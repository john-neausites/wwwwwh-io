-- PostgreSQL schema for wwwwwh.io P2P file sharing platform
-- Requires ltree extension for hierarchical data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "ltree";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE donation_tier AS ENUM ('free', 'meal', 'drink', 'snack');
CREATE TYPE access_level AS ENUM ('public', 'single_user', 'select_users', 'concurrent');
CREATE TYPE menu_type AS ENUM ('category', 'subcategory', 'collection', 'item');
CREATE TYPE file_category AS ENUM ('audio', 'photo', 'text', 'video');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    username VARCHAR(100) UNIQUE,
    donation_tier donation_tier DEFAULT 'free',
    hardware_key_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_username_check CHECK (username ~ '^[a-zA-Z0-9_-]{3,30}$')
);

-- Hardware keys table for FIDO2 authentication
CREATE TABLE hardware_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    credential_id TEXT UNIQUE NOT NULL,
    public_key TEXT NOT NULL,
    counter BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT hardware_keys_counter_check CHECK (counter >= 0)
);

-- Hierarchical menu system using ltree
CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    path ltree NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type menu_type NOT NULL,
    parent_id INTEGER REFERENCES menu(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT menu_level_check CHECK (level >= 0),
    CONSTRAINT menu_name_check CHECK (length(trim(name)) > 0)
);

-- File type support table
CREATE TABLE menu_types (
    id SERIAL PRIMARY KEY,
    menu_id INTEGER REFERENCES menu(id) ON DELETE CASCADE,
    file_type VARCHAR(50) NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    extension VARCHAR(10) NOT NULL,
    category file_category NOT NULL,
    is_supported BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(menu_id, file_type, extension)
);

-- Content items table
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hash VARCHAR(64) UNIQUE NOT NULL, -- IPFS hash
    name VARCHAR(500) NOT NULL,
    description TEXT,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    menu_path ltree NOT NULL,
    activities TEXT[] DEFAULT '{}',
    emotions TEXT[] DEFAULT '{}',
    group_dynamics TEXT[] DEFAULT '{}',
    year_created INTEGER,
    decade VARCHAR(10),
    generation VARCHAR(20),
    is_public_domain BOOLEAN DEFAULT false,
    access_level access_level DEFAULT 'public',
    seeders INTEGER DEFAULT 0,
    download_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT content_items_file_size_check CHECK (file_size > 0),
    CONSTRAINT content_items_seeders_check CHECK (seeders >= 0),
    CONSTRAINT content_items_download_count_check CHECK (download_count >= 0),
    CONSTRAINT content_items_year_check CHECK (year_created IS NULL OR (year_created >= 1800 AND year_created <= EXTRACT(YEAR FROM NOW()) + 10))
);

-- Peer connections tracking
CREATE TABLE peer_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    peer_id VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    multiaddr TEXT NOT NULL,
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    connection_quality DECIMAL(3,2) DEFAULT 0.0,
    bandwidth BIGINT DEFAULT 0,
    content_shared TEXT[] DEFAULT '{}', -- IPFS hashes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT peer_connections_quality_check CHECK (connection_quality >= 0.0 AND connection_quality <= 1.0),
    CONSTRAINT peer_connections_bandwidth_check CHECK (bandwidth >= 0)
);

-- Donation transactions
CREATE TABLE donation_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Amount in cents
    tier donation_tier NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT donation_transactions_amount_check CHECK (amount > 0)
);

-- User sessions for JWT token management
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    peer_id VARCHAR(255),
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily usage analytics (minimal tracking)
CREATE TABLE daily_analytics (
    date DATE PRIMARY KEY,
    active_users_count INTEGER DEFAULT 0,
    content_access_public_domain INTEGER DEFAULT 0,
    content_access_user_owned INTEGER DEFAULT 0,
    peer_connections_count INTEGER DEFAULT 0,
    total_bandwidth_bytes BIGINT DEFAULT 0,
    
    CONSTRAINT daily_analytics_counts_check CHECK (
        active_users_count >= 0 AND 
        content_access_public_domain >= 0 AND 
        content_access_user_owned >= 0 AND 
        peer_connections_count >= 0 AND 
        total_bandwidth_bytes >= 0
    )
);

-- Content access tracking for seeding incentives
CREATE TABLE content_access_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_hash VARCHAR(64) NOT NULL,
    peer_id VARCHAR(255) NOT NULL,
    access_type VARCHAR(20) NOT NULL, -- 'download', 'stream', 'seed'
    bytes_transferred BIGINT DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT content_access_bytes_check CHECK (bytes_transferred >= 0),
    CONSTRAINT content_access_duration_check CHECK (duration_seconds >= 0)
);

-- Indexes for performance
CREATE INDEX idx_menu_path ON menu USING GIST (path);
CREATE INDEX idx_menu_parent_id ON menu(parent_id);
CREATE INDEX idx_menu_type ON menu(type);

CREATE INDEX idx_content_items_menu_path ON content_items USING GIST (menu_path);
CREATE INDEX idx_content_items_hash ON content_items(hash);
CREATE INDEX idx_content_items_activities ON content_items USING GIN (activities);
CREATE INDEX idx_content_items_emotions ON content_items USING GIN (emotions);
CREATE INDEX idx_content_items_group_dynamics ON content_items USING GIN (group_dynamics);
CREATE INDEX idx_content_items_access_level ON content_items(access_level);
CREATE INDEX idx_content_items_public_domain ON content_items(is_public_domain);
CREATE INDEX idx_content_items_year ON content_items(year_created);
CREATE INDEX idx_content_items_decade ON content_items(decade);

CREATE INDEX idx_users_donation_tier ON users(donation_tier);
CREATE INDEX idx_users_hardware_key_id ON users(hardware_key_id);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_hardware_keys_user_id ON hardware_keys(user_id);
CREATE INDEX idx_hardware_keys_credential_id ON hardware_keys(credential_id);
CREATE INDEX idx_hardware_keys_active ON hardware_keys(is_active);

CREATE INDEX idx_peer_connections_peer_id ON peer_connections(peer_id);
CREATE INDEX idx_peer_connections_user_id ON peer_connections(user_id);
CREATE INDEX idx_peer_connections_online ON peer_connections(is_online);
CREATE INDEX idx_peer_connections_last_seen ON peer_connections(last_seen);

CREATE INDEX idx_donation_transactions_user_id ON donation_transactions(user_id);
CREATE INDEX idx_donation_transactions_status ON donation_transactions(status);
CREATE INDEX idx_donation_transactions_tier ON donation_transactions(tier);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);

CREATE INDEX idx_content_access_log_content_hash ON content_access_log(content_hash);
CREATE INDEX idx_content_access_log_peer_id ON content_access_log(peer_id);
CREATE INDEX idx_content_access_log_accessed_at ON content_access_log(accessed_at);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_updated_at 
    BEFORE UPDATE ON menu 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at 
    BEFORE UPDATE ON content_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get menu hierarchy ancestors
CREATE OR REPLACE FUNCTION get_menu_ancestors(menu_path ltree)
RETURNS TABLE(id integer, path ltree, name varchar, type menu_type, level integer) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.path, m.name, m.type, m.level
    FROM menu m
    WHERE m.path @> menu_path
    ORDER BY m.level;
END;
$$ LANGUAGE plpgsql;

-- Function to get menu hierarchy descendants
CREATE OR REPLACE FUNCTION get_menu_descendants(menu_path ltree, max_depth integer DEFAULT NULL)
RETURNS TABLE(id integer, path ltree, name varchar, type menu_type, level integer) AS $$
BEGIN
    IF max_depth IS NULL THEN
        RETURN QUERY
        SELECT m.id, m.path, m.name, m.type, m.level
        FROM menu m
        WHERE menu_path @> m.path
        ORDER BY m.path;
    ELSE
        RETURN QUERY
        SELECT m.id, m.path, m.name, m.type, m.level
        FROM menu m
        WHERE menu_path @> m.path AND nlevel(m.path) <= nlevel(menu_path) + max_depth
        ORDER BY m.path;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update daily analytics
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS void AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
BEGIN
    INSERT INTO daily_analytics (date, active_users_count, peer_connections_count)
    VALUES (
        today_date,
        (SELECT COUNT(*) FROM users WHERE last_active_at >= today_date),
        (SELECT COUNT(*) FROM peer_connections WHERE is_online = true)
    )
    ON CONFLICT (date) 
    DO UPDATE SET
        active_users_count = EXCLUDED.active_users_count,
        peer_connections_count = EXCLUDED.peer_connections_count;
END;
$$ LANGUAGE plpgsql;