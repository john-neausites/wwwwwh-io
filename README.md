# wwwwwh.io

P2P/S2S digital file sharing platform with physical key authentication, focusing on curated public domain content and activity-based content discovery.

## Overview

wwwwwh.io is a decentralized file sharing platform designed to provide **perpetual access to your digital content**. Our core mission is ensuring users can access their files forever through community-driven, privacy-first architecture.

### Core Objective: Perpetual Content Access
The platform eliminates single points of failure that cause content loss:
- **No Vendor Lock-in**: Open protocols and user-controlled encryption keys
- **Community Redundancy**: Distributed storage across motivated peers
- **Hardware Security**: Physical keys prevent account takeover
- **Legal Sustainability**: Public domain focus ensures permanent availability
- **Export Freedom**: Complete data portability at any time

### Key Features
- **Physical Key Authentication**: FIDO2/WebAuthn hardware security keys for tamper-resistant access
- **Peer-to-Peer Architecture**: Direct connections with zero central file storage
- **Activity-Based Discovery**: Contextual content recommendations based on current activity, mood, and social context
- **Curated Public Domain Content**: Legal content distribution focusing initially on National Gallery of Art collection
- **Community Seeding Incentives**: Donation-based sustainability with storage contribution rewards

## Architecture

### Perpetual Access Design Principles

**User Data Sovereignty**
- Users control their own content and encryption keys
- Platform never stores user content, only coordinates peer connections
- Hardware keys provide cryptographic proof of ownership
- Content can be migrated between platforms using open standards

**Community-Driven Persistence**
- IPFS content addressing for immutable identification
- Economic incentives for long-term content hosting
- Redundant peer storage for popular content
- Graceful degradation with minimal infrastructure

**Zero-Knowledge Privacy**
- End-to-end encryption before content leaves user devices
- Minimal metadata collection for coordination only
- Audit trails without privacy invasion
- Complete data export capabilities

### Technology Stack

**Prototype (Current)**
- **Backend**: Node.js with TypeScript for rapid development
- **Database**: PostgreSQL with ltree extension for hierarchical data
- **P2P Networking**: libp2p with WebRTC for direct connections
- **Authentication**: FIDO2/WebAuthn for hardware key support
- **Cloud**: Azure services (Service Bus, SignalR, Storage, Key Vault)

**Production (Planned)**
- **Backend**: Rust with Tokio for memory safety and performance
- **Same database and P2P architecture for continuity**
- **Gradual service-by-service migration strategy**

### Core Components

1. **Contextual Genre System**: Activity-based content matching using the CORE_ACTIVITIES framework
2. **Hierarchical Content Catalog**: PostgreSQL ltree-based menu system for efficient categorization
3. **P2P Network Layer**: libp2p-based peer discovery and content sharing
4. **Hardware Authentication**: FIDO2 integration for physical key security
5. **Donation System**: Stripe integration for platform support (meal/drink/snack tiers)

## Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 13+ with ltree extension
- Redis (optional, for caching)
- FIDO2-compatible security key for testing

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd wwwwwh-io
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up PostgreSQL database**:
   ```bash
   # Create database
   createdb wwwwwh_io
   
   # Run migrations
   npm run db:migrate
   
   # Seed initial data
   npm run db:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

### Development Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm test            # Run tests
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
```

## Core Features

### Activity-Based Content Discovery

The platform uses a contextual genre system that matches content to user activities:

```typescript
// Example: Get recommendations for cooking with family while feeling happy
const recommendation = contextualGenreSystem.getRecommendation(
  'cook',           // Activity
  ['family'],       // Group dynamics
  'happy'          // Emotion
);
// Returns: "Kitchen Sing-Alongs"
```

### Hierarchical Content Organization

Content is organized using PostgreSQL's ltree extension for efficient tree operations:

```sql
-- Example: Find all Renaissance artworks
SELECT * FROM content_items 
WHERE menu_path <@ 'photo.fineart.nationalgallery.renaissance';

-- Example: Get all subcategories under Audio
SELECT * FROM menu 
WHERE path ~ 'audio.*{1}';
```

### P2P Network Architecture

- **Discovery**: mDNS and bootstrap peers for initial peer discovery
- **Connection**: WebRTC data channels for direct peer-to-peer file transfer
- **Coordination**: Azure SignalR for signaling server functionality
- **Content Distribution**: IPFS-style content addressing with community seeding

### Hardware Authentication Flow

1. User registers FIDO2 security key with platform
2. Key generates unique cryptographic credentials
3. All platform access requires physical key authentication
4. No passwords or traditional authentication methods

## Content Categories

### Initial Focus Areas

**Food & Cooking Content**
- Recipe videos and demonstrations
- Culinary technique guides
- Food photography and styling
- Cooking-related literature

**Blockbuster Entertainment**
- Popular films (public domain)
- Classic music albums
- Bestselling books
- Iconic visual art

### Content Classification

All content is tagged with:
- **Activities**: From CORE_ACTIVITIES (workout, cook, relax, etc.)
- **Emotions**: nostalgia, happy, sad, love, scared, hurt, relaxed, tense
- **Group Dynamics**: friend, family, partner, colleague, etc.
- **Temporal**: Year, decade, generation for historical context

## Donation System

### Support Tiers

- **Meal ($3)**: Basic platform support
- **Drink ($8)**: Enhanced content access
- **Snack ($15)**: Priority features and content

### Community Incentives

- Bandwidth contribution rewards
- Rare content hosting bonuses
- Community moderation privileges
- Early access to new features

## Deployment

### Azure Services Configuration

The platform uses Azure for Startups program benefits:

- **Azure Service Bus**: Peer discovery coordination
- **Azure SignalR Service**: WebRTC signaling server
- **Azure Storage**: Bootstrap content and metadata
- **Azure Key Vault**: Secrets management
- **Azure Database for PostgreSQL**: Managed database service

### Production Deployment

```bash
# Build the application
npm run build

# Set production environment variables
export NODE_ENV=production

# Start with process manager
pm2 start dist/server.js --name wwwwwh-io
```

## API Documentation

### Health Check
```
GET /health
```
Returns platform status, database connectivity, and P2P network statistics.

### Content Discovery
```
GET /api/v1/content/search?activities=cook&emotions=happy
```
Search content based on contextual parameters.

### P2P Network
```
GET /api/v1/peer/status
```
Get current peer connection status and network information.

## Security Considerations

### Data Privacy
- **Zero Knowledge**: Platform never stores user content
- **Minimal Tracking**: Only daily user counts and action metrics
- **Peer-to-Peer**: Direct connections bypass central servers
- **Encryption**: End-to-end encryption for all content transfers

### Hardware Security
- **FIDO2 Compliance**: Industry-standard authentication
- **Tamper Resistance**: Physical security key requirements
- **Credential Isolation**: Unique keys per user
- **Audit Trail**: Authentication events logged

## Roadmap

### Phase 1 (Current): Node.js Prototype
- ✅ Basic P2P networking with libp2p
- ✅ PostgreSQL schema with hierarchical content
- ✅ Activity-based content system
- ✅ FIDO2 authentication framework
- 🔄 Azure services integration
- 🔄 National Gallery content ingestion

### Phase 2: Enhanced Features
- 📅 WebRTC streaming implementation
- 📅 Mobile applications (React Native)
- 📅 Advanced content discovery algorithms
- 📅 Community moderation tools

### Phase 3: Rust Migration
- 📅 Rust backend services
- 📅 Performance optimizations
- 📅 Advanced P2P protocols
- 📅 Scalability improvements

### Phase 4: Ecosystem Growth
- 📅 Developer APIs
- 📅 Third-party integrations
- 📅 Advanced privacy features
- 📅 Global content distribution

## Contributing

### Beta Testing Program

We're currently recruiting the first 5 beta testers from an eventual 100 early users. Beta testers will receive:

- Free FIDO2 security key
- Direct access to development team
- Input on feature prioritization
- Early access to all platform features

### Development Guidelines

1. **Perpetual Access First**: Every feature must ask "How does this help users access their content forever?"
2. **Code Style**: Follow TypeScript and ESLint configurations
3. **Testing**: Write tests for all new features, especially content availability scenarios
4. **Documentation**: Update README and inline documentation
5. **Security**: Follow secure coding practices with hardware key integration
6. **Privacy**: Maintain zero-knowledge principles - platform cannot decrypt user content
7. **Data Portability**: Implement export/import functions for all user data
8. **Graceful Degradation**: Design for operation with minimal infrastructure

## Legal

### Content Policy
- **Public Domain Priority**: Ensures perpetual legal availability without license expiration
- **First Sale Doctrine Compliance**: Legitimate ownership transfer for purchased materials  
- **No User-Generated Content Initially**: Focus on legally sustainable content during beta
- **Automated Verification**: Content validation against public domain databases
- **Community Curation**: Peer review system for content quality and legality
- **Preservation Focus**: Priority on rare, culturally significant, or at-risk content

### Privacy Policy
- Minimal data collection (daily counts only)
- No personal information storage
- Hardware key authentication only
- Peer-to-peer architecture for privacy

## Objective Scaffolding: Perpetual Content Access

### Problem Statement
Traditional cloud storage creates single points of failure:
- **Service Shutdowns**: Companies close, taking user content with them
- **Account Loss**: Password/2FA issues lock users out permanently  
- **Vendor Lock-in**: Proprietary formats trap content in specific platforms
- **Legal Changes**: Licensing shifts can remove content unexpectedly
- **Technical Failures**: Server outages, data corruption, security breaches

### Solution Architecture

**Layer 1: Cryptographic Ownership**
- Hardware security keys prove content ownership
- User-controlled encryption prevents platform access to content
- Content addressing via IPFS ensures immutable identification
- Digital signatures verify authenticity and prevent tampering

**Layer 2: Distributed Redundancy**
- P2P network with no central servers storing user content
- Community seeding incentives ensure multiple copies exist
- Geographic distribution protects against regional failures
- Economic rewards align peer interests with content preservation

**Layer 3: Legal Sustainability**
- Public domain focus eliminates licensing expiration risks
- First sale doctrine compliance for legitimate content ownership
- Transparent content verification processes
- Community governance for policy decisions

**Layer 4: Technical Resilience**
- Open protocols prevent vendor lock-in
- Graceful degradation with minimal infrastructure requirements
- Complete data export capabilities at any time
- Cross-platform compatibility for long-term access

### Success Metrics
- **Content Availability**: Percentage of content accessible after 1, 5, 10+ years
- **Peer Participation**: Number of active seeders per content item
- **Export Usage**: Frequency of successful data exports by users
- **Recovery Success**: Ability to restore access after various failure scenarios
- **Community Health**: Long-term engagement and contribution patterns

### Failure Mode Protection

**Company Shutdown**
- Open source code allows community to continue development
- P2P network operates without central servers
- Users retain full control of their content and keys

**Technical Failures**
- Multiple redundant copies across peer network
- Content verification prevents corruption propagation
- Alternative access methods (local cache, backup peers)

**Legal Challenges**
- Public domain focus minimizes legal vulnerability
- Distributed architecture complicates takedown efforts
- User ownership proofs support fair use claims

**Economic Sustainability**
- Donation model reduces dependency on external funding
- Community incentives create self-sustaining ecosystem
- Minimal infrastructure costs due to P2P architecture

## Support

For technical support, feature requests, or beta testing applications:

- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for general questions  
- **Security**: security@wwwwwh.io for security-related issues
- **Beta Program**: beta@wwwwwh.io for early access requests
- **Perpetual Access**: access@wwwwwh.io for content recovery assistance

## License

MIT License - see LICENSE file for details.

---

**wwwwwh.io** - Secure, private, community-driven digital file sharing.