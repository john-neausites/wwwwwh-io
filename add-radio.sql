-- Add Radio menu item under Audio > Music (id: 111)
-- This goes after Lists (1111) and before other music items

INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
(1115, 111, 'Radio', 'audio-music-radio', 'Music radio with skip, like, and dislike controls', 4, 5, 1);

-- Note: Update Music's immediate_children count from 4 to 5
-- Also update total_descendants from 7 to 8
