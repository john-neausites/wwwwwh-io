#!/usr/bin/env python3
"""
Export menu data from SQLite database to JSON for static site
"""
import sqlite3
import json
from datetime import datetime, timezone

def export_menu_to_json(db_path='wwwwwh.db', output_path='menu-data.json'):
    """Export menu structure from SQLite to JSON"""
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get all menu items with counts
    cursor.execute("""
        SELECT 
            m.id,
            m.parent_id,
            m.name,
            m.slug,
            COALESCE(c.immediate_children, 0) as immediate_children,
            COALESCE(c.total_descendants, 0) as total_descendants
        FROM menu_items m
        LEFT JOIN menu_item_counts c ON c.item_id = m.id
        WHERE m.is_active = 1
        ORDER BY m.level, m.sort_order
    """)
    
    items = []
    for row in cursor.fetchall():
        items.append({
            'id': row['id'],
            'parent_id': row['parent_id'],
            'name': row['name'],
            'slug': row['slug'],
            'immediate_children': row['immediate_children'],
            'total_descendants': row['total_descendants'],
            'children': []
        })
    
    # Build hierarchy
    items_by_id = {item['id']: item for item in items}
    
    for item in items:
        if item['parent_id'] and item['parent_id'] in items_by_id:
            items_by_id[item['parent_id']]['children'].append(item)
    
    # Get root items
    root_items = [item for item in items if not item['parent_id']]
    
    # Create output structure
    output = {
        'version': '1.0',
        'generated': datetime.now(timezone.utc).isoformat(),
        'items': root_items
    }
    
    # Write to JSON file
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    conn.close()
    
    print(f"✅ Exported {len(items)} menu items to {output_path}")
    print(f"📊 Root categories: {len(root_items)}")
    
    return output

if __name__ == '__main__':
    export_menu_to_json()
