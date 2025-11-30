class ColorPalette {
    constructor() {
        this.colors = {
            // Winter & Spring Palette
            violet: '#8B5CF6',
            purple: '#A855F7',
            clearPeriwinkle: '#C7D2FE',
            periwinkle: '#A5B4FC',
            trueBlue: '#3B82F6',
            clearBlue: '#93C5FD',
            forest: '#059669',
            chineseTeal: '#0D9488',
            chineseBlue: '#0891B2',
            tealBlue: '#06B6D4',
            aqua: '#00CED1',
            turquoise: '#40E0D0',
            teal: '#14B8A6',
            lightAqua: '#5EEAD4',
            jade: '#10B981',
            lime: '#84CC16',
            warmGreen: '#65A30D',
            pastelYellow: '#FDE047',
            lightNavy: '#1E3A8A',
            marineNavy: '#1E40AF',
            pewter: '#71717A',
            taupe: '#78716C',
            chocolate: '#78350F',
            khaki: '#A16207',
            blackBrown: '#292524',
            deepOlive: '#3F6212',
            eggplant: '#581C87',
            deepTeal: '#134E4A',
            softWhite: '#F8FAFC',
            ivory: '#FFFEF5',
            clearWarmRed: '#F87171',
            coralRose: '#FB7185',
            warmPink: '#F472B6',
            coralPink: '#F9A8D4',
            clearSalmon: '#FCA5A5',
            shellPink: '#FED7E2',
            orangeRed: '#FB923C',
            coral: '#FDA4AF',
            peach: '#FDBA74',
            softGoldenYellow: '#FCD34D',
            banana: '#FEF08A',
            goldJewelry: '#F59E0B'
        };
        
        this.currentPalette = null;
        this.init();
    }
    
    init() {
        // Check if palette is stored in session
        const storedPalette = sessionStorage.getItem('colorPalette');
        if (storedPalette) {
            this.currentPalette = JSON.parse(storedPalette);
            // Ensure layer exists (for backward compatibility with old stored palettes)
            if (!this.currentPalette.layer) {
                this.currentPalette.layer = this.currentPalette.accent;
            }
        }
        // Otherwise, app loads with default grayscale/no color mode
    }
    
    generatePalette() {
        const colorNames = Object.keys(this.colors);
        const shuffled = colorNames.sort(() => Math.random() - 0.5);
        
        // Pick 4 random colors
        const primary = this.colors[shuffled[0]];
        const secondary = this.colors[shuffled[1]];
        const accent = this.colors[shuffled[2]];
        const layer = this.colors[shuffled[3]];
        
        this.currentPalette = {
            primary,
            secondary,
            accent,
            layer,
            names: [shuffled[0], shuffled[1], shuffled[2], shuffled[3]]
        };
        
        // Store in session storage
        sessionStorage.setItem('colorPalette', JSON.stringify(this.currentPalette));
        
        return this.currentPalette;
    }
    
    applyPalette(bgColor = null, textColor = null, accentColor = null, layerColor = null) {
        // If colors provided, update current palette
        if (bgColor && textColor && accentColor) {
            this.currentPalette = {
                primary: bgColor,
                secondary: textColor,
                accent: accentColor,
                layer: layerColor || accentColor,
                names: ['custom', 'custom', 'custom', 'custom']
            };
            // Store in session storage
            sessionStorage.setItem('colorPalette', JSON.stringify(this.currentPalette));
        }
        
        if (!this.currentPalette) return;
        
        const { primary, secondary, accent, layer } = this.currentPalette;
        
        // Primary = Background
        // Secondary = Secondary elements (subtle)
        // Accent = Text/contrast
        
        // Apply background color (solid, no gradient)
        document.body.style.background = primary;
        document.body.style.backgroundColor = primary;
        document.body.style.color = secondary;
        
        // Update CSS variables for consistent theming
        document.documentElement.style.setProperty('--color-primary', primary);
        document.documentElement.style.setProperty('--color-secondary', secondary);
        document.documentElement.style.setProperty('--color-accent', accent);
        document.documentElement.style.setProperty('--color-layer', layer || accent);
        
        // Apply to main container
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.style.backgroundColor = primary;
        }
        
        // Sidebar - neutral background
        const sidebar = document.querySelector('.what-sidebar');
        if (sidebar) {
            sidebar.style.backgroundColor = secondary;
            sidebar.style.color = primary;
        }
        
        // Content area - base background with neutral text
        const content = document.querySelector('.why-content');
        if (content) {
            content.style.backgroundColor = primary;
            content.style.color = secondary;
        }
        
        // Menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.color = primary;
            item.style.borderColor = layer;
        });
        
        // Menu list container - use secondary for background
        const menuList = document.querySelector('.menu-list');
        if (menuList) {
            menuList.style.backgroundColor = secondary;
        }
        
        const mainMenu = document.querySelector('#main-menu');
        if (mainMenu) {
            mainMenu.style.backgroundColor = secondary;
        }
        
        // Menu header and breadcrumbs
        const menuHeader = document.querySelector('.menu-header');
        if (menuHeader) {
            menuHeader.style.backgroundColor = secondary;
            menuHeader.style.borderBottomColor = layer || accent;
        }
        
        const breadcrumbs = document.querySelectorAll('.breadcrumb-item');
        breadcrumbs.forEach(item => {
            item.style.color = primary;
        });
        
        const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
        if (breadcrumbCurrent) {
            breadcrumbCurrent.style.color = layer;
            breadcrumbCurrent.style.fontWeight = '600';
        }
        
        // Mobile header
        const mobileHeader = document.querySelector('.mobile-header');
        if (mobileHeader) {
            mobileHeader.style.backgroundColor = accent;
            mobileHeader.style.color = primary;
        }
        
        const mobileHeaderContent = document.querySelector('.mobile-header-content');
        if (mobileHeaderContent) {
            mobileHeaderContent.style.color = primary;
        }
        
        // Menu links - primary text, layer hover
        const menuLinks = document.querySelectorAll('.menu-list a');
        menuLinks.forEach(link => {
            link.style.color = primary;
            link.style.borderColor = 'transparent';
            link.style.setProperty('--hover-bg', layer);
            link.style.setProperty('--hover-color', primary);
            link.style.setProperty('--active-bg', layer);
        });
        
        // Time banners with accent
        const whenBar = document.querySelector('.when-bar');
        if (whenBar) {
            whenBar.style.backgroundColor = accent;
            whenBar.style.color = primary;
            
            // Style time elements within banner
            const timeElements = whenBar.querySelectorAll('.session-time, .cosmic-time, .y2k-time, .when-content span');
            timeElements.forEach(el => {
                el.style.color = primary;
            });
        }
        
        const mobileBanner = document.querySelector('.mobile-banner');
        if (mobileBanner) {
            mobileBanner.style.backgroundColor = accent;
            mobileBanner.style.color = primary;
            
            // Style mobile banner content
            const bannerContent = mobileBanner.querySelector('#mobile-banner-content');
            if (bannerContent) {
                bannerContent.style.color = primary;
            }
        }
        
        // Nav - neutral background
        const nav = document.querySelector('.how-nav');
        if (nav) {
            nav.style.backgroundColor = secondary;
            nav.style.color = primary;
        }
        
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.style.color = primary;
            link.style.borderColor = layer;
        });
        
        console.log(`🎨 Applied color palette: ${this.currentPalette.names.join(', ')}`);
        console.log(`   Background: ${this.currentPalette.names[0]} (Primary)`);
        console.log(`   Secondary: ${this.currentPalette.names[1]} (Secondary)`);
        console.log(`   Text: ${this.currentPalette.names[2]} (Accent)`);
        
        // Update color state
        sessionStorage.setItem('colorState', 'on');
        
        // Update Color button styling
        if (typeof styleColorButton === 'function') {
            setTimeout(() => styleColorButton(), 100);
        }
        
        // Set up observer to reapply menu styles when menu content changes
        this.observeMenuChanges();
    }
    
    observeMenuChanges() {
        if (this.menuObserver) {
            this.menuObserver.disconnect();
        }
        
        const mainMenu = document.querySelector('#main-menu');
        if (!mainMenu || !this.currentPalette) return;
        
        const { primary, secondary, layer, accent } = this.currentPalette;
        
        this.menuObserver = new MutationObserver(() => {
            // Reapply styles to menu elements after content changes
            const menuList = document.querySelector('.menu-list');
            if (menuList) {
                menuList.style.backgroundColor = secondary;
            }
            
            const menuHeader = document.querySelector('.menu-header');
            if (menuHeader) {
                menuHeader.style.backgroundColor = secondary;
                menuHeader.style.borderBottomColor = layer || accent;
            }
            
            const breadcrumbs = document.querySelectorAll('.breadcrumb-item');
            breadcrumbs.forEach(item => {
                item.style.color = primary;
            });
            
            const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
            if (breadcrumbCurrent) {
                breadcrumbCurrent.style.color = layer;
                breadcrumbCurrent.style.fontWeight = '600';
            }
            
            const menuLinks = document.querySelectorAll('.menu-list a');
            menuLinks.forEach(link => {
                link.style.color = primary;
                link.style.borderColor = 'transparent';
                link.style.setProperty('--hover-bg', layer);
                link.style.setProperty('--hover-color', primary);
                link.style.setProperty('--active-bg', layer);
            });
        });
        
        this.menuObserver.observe(mainMenu, {
            childList: true,
            subtree: true
        });
    }
    
    removePalette() {
        // Don't remove the palette data, just unapply it
        // sessionStorage.removeItem('colorPalette');
        // this.currentPalette = null;
        
        // Disconnect menu observer
        if (this.menuObserver) {
            this.menuObserver.disconnect();
            this.menuObserver = null;
        }
        
        // Reset to original styles
        document.body.style.background = '';
        document.body.style.backgroundColor = '';
        document.documentElement.style.removeProperty('--color-primary');
        document.documentElement.style.removeProperty('--color-secondary');
        document.documentElement.style.removeProperty('--color-accent');
        document.documentElement.style.removeProperty('--color-layer');
        
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.style.backgroundColor = '';
        }
        
        const sidebar = document.querySelector('.what-sidebar');
        if (sidebar) {
            sidebar.style.backgroundColor = '';
            sidebar.style.color = '';
        }
        
        const content = document.querySelector('.why-content');
        if (content) {
            content.style.backgroundColor = '';
            content.style.color = '';
        }
        
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.color = '';
            item.style.borderColor = '';
        });
        
        const menuList = document.querySelector('.menu-list');
        if (menuList) {
            menuList.style.backgroundColor = '';
        }
        
        const mainMenu = document.querySelector('#main-menu');
        if (mainMenu) {
            mainMenu.style.backgroundColor = '';
        }
        
        const menuHeader = document.querySelector('.menu-header');
        if (menuHeader) {
            menuHeader.style.backgroundColor = '';
            menuHeader.style.borderBottomColor = '';
        }
        
        const breadcrumbs = document.querySelectorAll('.breadcrumb-item');
        breadcrumbs.forEach(item => {
            item.style.color = '';
        });
        
        const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
        if (breadcrumbCurrent) {
            breadcrumbCurrent.style.color = '';
        }
        
        const mobileHeader = document.querySelector('.mobile-header');
        if (mobileHeader) {
            mobileHeader.style.backgroundColor = '';
            mobileHeader.style.color = '';
        }
        
        const mobileHeaderContent = document.querySelector('.mobile-header-content');
        if (mobileHeaderContent) {
            mobileHeaderContent.style.color = '';
        }
        
        const menuLinks = document.querySelectorAll('.menu-list a');
        menuLinks.forEach(link => {
            link.style.color = '';
            link.style.borderColor = '';
            link.style.removeProperty('--hover-bg');
            link.style.removeProperty('--hover-color');
            link.style.removeProperty('--active-bg');
        });
        
        const whenBar = document.querySelector('.when-bar');
        if (whenBar) {
            whenBar.style.backgroundColor = '';
            whenBar.style.color = '';
            
            const timeElements = whenBar.querySelectorAll('.session-time, .cosmic-time, .y2k-time, .when-content span');
            timeElements.forEach(el => {
                el.style.color = '';
            });
        }
        
        const mobileBanner = document.querySelector('.mobile-banner');
        if (mobileBanner) {
            mobileBanner.style.backgroundColor = '';
            mobileBanner.style.color = '';
            
            const bannerContent = mobileBanner.querySelector('#mobile-banner-content');
            if (bannerContent) {
                bannerContent.style.color = '';
            }
        }
        
        const nav = document.querySelector('.how-nav');
        if (nav) {
            nav.style.backgroundColor = '';
        }
        
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.style.color = '';
        });
        
        // Update color state
        sessionStorage.setItem('colorState', 'off');
        
        // Update Color button styling
        if (typeof styleColorButton === 'function') {
            setTimeout(() => styleColorButton(), 100);
        }
        
        console.log('🎨 Color palette removed, reverted to grayscale');
    }
    
    togglePalette() {
        // Always generate a new palette on click
        this.generatePalette();
        this.applyPalette();
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorPalette;
}
