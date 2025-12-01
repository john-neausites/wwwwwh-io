class StaticMenu {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            dataPath: options.dataPath || 'menu-data.json',
            onItemClick: options.onItemClick || null,
            onError: options.onError || null,
            mobileBreakpoint: options.mobileBreakpoint || 480,
            ...options
        };
        this.allItems = [];
        this.currentItems = [];
        this.navigationStack = [];
        this.isLoading = true;
        this.init();
    }
    init() {
        if (!this.container) {
            console.error('Menu container not found');
            return;
        }
        this.showLoading();
        this.loadMenuData();
    }
    showLoading() {
        this.container.innerHTML = '<div class="menu-loading">Loading...</div>';
    }
    async loadMenuData() {
        try {
            const response = await fetch(this.options.dataPath + '?v=' + Date.now());
            if (!response.ok) {
                throw new Error('Failed to load menu data: ' + response.status + ' ' + response.statusText);
            }
            const menuData = await response.json();
            console.log(`Loaded menu data v${menuData.version} generated at ${menuData.generated}`);
            
            // Flatten nested structure from JSON
            this.allItems = this.flattenMenuItems(menuData.items);
            console.log(`Flattened ${this.allItems.length} menu items`);
            
            this.buildHierarchy();
            this.showRootLevel();
        } catch (error) {
            console.error('Menu loading error:', error);
            this.showError(error.message);
        }
    }
    
    flattenMenuItems(items) {
        const flattened = [];
        const flatten = (itemList) => {
            itemList.forEach(item => {
                const children = item.children || [];
                flattened.push({
                    id: item.id,
                    parent_id: item.parent_id,
                    name: item.name,
                    slug: item.slug,
                    immediate_children: item.immediate_children,
                    total_descendants: item.total_descendants,
                    children: []
                });
                if (children.length > 0) {
                    flatten(children);
                }
            });
        };
        flatten(items);
        return flattened;
    }
    buildHierarchy() {
        const itemsById = {};
        this.allItems.forEach(item => {
            itemsById[item.id] = item;
        });
        this.allItems.forEach(item => {
            if (item.parent_id && itemsById[item.parent_id]) {
                itemsById[item.parent_id].children.push(item);
            }
        });
        this.currentItems = this.allItems.filter(item => !item.parent_id);
    }
    getChildren(parentId) {
        if (!parentId) {
            return this.allItems.filter(item => !item.parent_id);
        }
        return this.allItems.filter(item => item.parent_id === parentId);
    }
    getParentPath(itemId) {
        const path = [];
        let currentItem = this.findItem(itemId);
        while (currentItem && currentItem.parent_id) {
            const parent = this.findItem(currentItem.parent_id);
            if (parent) {
                path.unshift(parent);
                currentItem = parent;
            } else {
                break;
            }
        }
        return path;
    }
    showRootLevel() {
        this.render('wwwwwh.io', this.currentItems);
    }
    render(title, items) {
        let html = '';
        const breadcrumbs = this.getBreadcrumbs();
        html += `<div class="menu-header">
            ${breadcrumbs ? `<div class="breadcrumbs">${breadcrumbs}</div>` : ''}
        </div>`;
        html += '<ul class="menu-list">';
        items.forEach(item => {
            const countDisplay = this.getCountDisplay(item);
            html += `<li><a href="#" data-id="${item.id}">
                ${item.name}
                ${countDisplay ? `<span class="item-count">${countDisplay}</span>` : ''}
            </a></li>`;
        });
        html += '</ul>';
        this.container.innerHTML = html;
        this.attachHandlers();
        this.isLoading = false;
    }
    attachHandlers() {
        this.container.querySelectorAll('a[data-id]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const itemId = parseInt(link.getAttribute('data-id'));
                this.handleClick(itemId);
            });
        });
        this.container.querySelectorAll('.breadcrumb-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const itemId = parseInt(item.getAttribute('data-item-id'));
                this.navigateToItem(itemId);
            });
        });
    }
    handleClick(itemId) {
        const item = this.findItem(itemId);
        if (!item) return;
        
        console.log(`Menu click: ${item.name} (ID: ${itemId}), Children: ${item.children.length}`);
        
        if (this.options.onItemClick) {
            this.options.onItemClick(item.slug, itemId);
        }
        
        // Check if unlocked - if so, allow drill-down navigation
        const isUnlocked = window.isUnlocked && window.isUnlocked();
        const isMobile = this.isMobile();
        
        console.log(`Mobile: ${isMobile}, Unlocked: ${isUnlocked}, Should navigate: ${isMobile || isUnlocked}`);
        
        if (isMobile || isUnlocked) {
            if (item.children.length > 0) {
                console.log(`Navigating to children of ${item.name}`);
                this.navigationStack.push({
                    title: this.getCurrentTitle(),
                    items: this.currentItems
                });
                this.currentItems = item.children;
                this.render(item.name, item.children);
            } else {
                console.log(`${item.name} has no children`);
            }
        } else {
            console.log('Desktop locked mode - no navigation');
        }
    }
    goBack() {
        if (this.navigationStack.length > 0) {
            const previous = this.navigationStack.pop();
            this.currentItems = previous.items;
            this.render(previous.title, previous.items);
            if (this.options.onItemClick && this.currentItems.length > 0) {
                const parentItem = this.findParentOfItems(this.currentItems);
                if (parentItem) {
                    this.options.onItemClick(parentItem.slug, parentItem.id);
                } else {
                    this.options.onItemClick('home', 0);
                }
            }
        }
    }
    findItem(id) {
        return this.allItems.find(item => item.id === id);
    }
    findParentOfItems(items) {
        if (items.length === 0) return null;
        const parentId = items[0].parent_id;
        if (!parentId) return null; 
        return this.findItem(parentId);
    }
    navigateToItem(itemId) {
        const targetItem = this.findItem(itemId);
        if (!targetItem) return;
        if (!targetItem.parent_id) {
            this.navigationStack = [];
            this.currentItems = this.getChildren(null);
            this.render('wwwwwh.io', this.currentItems);
            if (this.options.onItemClick) {
                this.options.onItemClick('home', 0);
            }
            return;
        }
        
        // Build navigation stack from root to target
        const path = this.getParentPath(itemId);
        this.navigationStack = [];
        
        // Add each parent to the navigation stack
        for (const ancestor of path) {
            const children = this.getChildren(ancestor.id);
            this.navigationStack.push({
                title: ancestor.name,
                items: children
            });
        }
        
        // Show children of target item (or target item if it's a leaf)
        const children = this.getChildren(targetItem.id);
        if (children.length > 0) {
            this.currentItems = children;
            this.render(targetItem.name, this.currentItems);
        } else {
            // If no children, show the parent's children with this item selected
            const parent = this.findItem(targetItem.parent_id);
            this.currentItems = this.getChildren(targetItem.parent_id);
            this.render(parent ? parent.name : 'wwwwwh.io', this.currentItems);
        }
    }
    getCurrentTitle() {
        return this.container.querySelector('.menu-title')?.textContent || 'Menu';
    }
    getBreadcrumbs() {
        if (this.navigationStack.length === 0) return null;
        const currentParent = this.findParentOfItems(this.currentItems);
        if (!currentParent) return null;
        const parentPath = this.getParentPath(currentParent.id);
        parentPath.push(currentParent); 
        const breadcrumbItems = parentPath.map(item => 
            `<span class="breadcrumb-item" data-item-id="${item.id}">${item.name}</span>`
        );
        return breadcrumbItems.join('<span class="breadcrumb-separator">/</span>');
    }
    isMobile() {
        return window.innerWidth <= this.options.mobileBreakpoint;
    }
    getCountDisplay(item) {
        if (!item.immediate_children && !item.total_descendants) {
            return null; 
        }
        if (this.isMobile()) {
            return item.immediate_children > 0 ? `(${item.immediate_children})` : null;
        } else {
            const total = item.total_descendants;
            if (total === 0) return null;
            let formatted;
            if (total < 100) {
                formatted = total.toString();
            } else if (total < 1000) {
                formatted = total.toString();
            } else if (total < 10000) {
                formatted = (total / 1000).toFixed(2) + 'k';
            } else if (total < 100000) {
                formatted = (total / 1000).toFixed(1) + 'k';
            } else {
                formatted = (total / 1000).toFixed(0) + 'k';
            }
            return `(${formatted})`;
        }
    }
    showError(message) {
        this.container.innerHTML = `<div class="menu-error">Error: ${message}</div>`;
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StaticMenu;
}