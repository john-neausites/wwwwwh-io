class TypographyShowcase {
    constructor() {
        this.container = null;
        this.pangram = "Five boxing wizards jump quickly";
        this.fonts = [];
        this.loadedFonts = new Set();
        this.currentIndex = 0;
        this.batchSize = 50; // Load fonts in batches for performance
        this.observer = null;
    }

    async loadGoogleFonts() {
        try {
            const apiKey = 'AIzaSyDpJpv9Kkp2kZdXGPJxRqUzDjv0S-I-MgA'; // Public Google Fonts API key
            const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`);
            const data = await response.json();
            
            // Get top 1000 fonts (or all if less than 1000)
            this.fonts = data.items.slice(0, 1000).map(font => ({
                family: font.family,
                category: font.category,
                variants: font.variants
            }));
            
            console.log(`Loaded ${this.fonts.length} fonts from Google Fonts`);
            return this.fonts;
        } catch (error) {
            console.error('Failed to load Google Fonts:', error);
            // Fallback to a curated list if API fails
            this.fonts = this.getFallbackFonts();
            return this.fonts;
        }
    }

    getFallbackFonts() {
        // Curated list of great fonts as fallback
        return [
            { family: 'Roboto', category: 'sans-serif' },
            { family: 'Open Sans', category: 'sans-serif' },
            { family: 'Lato', category: 'sans-serif' },
            { family: 'Montserrat', category: 'sans-serif' },
            { family: 'Oswald', category: 'sans-serif' },
            { family: 'Raleway', category: 'sans-serif' },
            { family: 'Poppins', category: 'sans-serif' },
            { family: 'Playfair Display', category: 'serif' },
            { family: 'Merriweather', category: 'serif' },
            { family: 'Dancing Script', category: 'handwriting' },
            { family: 'Pacifico', category: 'handwriting' },
            { family: 'Indie Flower', category: 'handwriting' },
            { family: 'Lobster', category: 'display' },
            { family: 'Bebas Neue', category: 'display' },
            { family: 'JetBrains Mono', category: 'monospace' },
            { family: 'Roboto Mono', category: 'monospace' },
            { family: 'Fira Code', category: 'monospace' },
            { family: 'Source Code Pro', category: 'monospace' }
        ];
    }

    loadFontDynamically(fontFamily) {
        if (this.loadedFonts.has(fontFamily)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400&display=swap`;
            
            link.onload = () => {
                this.loadedFonts.add(fontFamily);
                resolve();
            };
            
            link.onerror = () => {
                console.warn(`Failed to load font: ${fontFamily}`);
                resolve(); // Resolve anyway to continue
            };
            
            document.head.appendChild(link);
            
            // Timeout fallback
            setTimeout(() => resolve(), 3000);
        });
    }

    createFontItem(font, index) {
        const item = document.createElement('div');
        item.className = 'typography-item';
        item.dataset.fontFamily = font.family;
        item.dataset.index = index;
        
        // Font name label
        const label = document.createElement('div');
        label.className = 'font-label';
        label.textContent = `${index + 1}. ${font.family}`;
        
        // Category tag
        const category = document.createElement('span');
        category.className = 'font-category';
        category.textContent = font.category || 'sans-serif';
        label.appendChild(category);
        
        // Pangram display
        const pangram = document.createElement('div');
        pangram.className = 'font-pangram';
        pangram.textContent = this.pangram;
        pangram.style.fontFamily = `"${font.family}", ${font.category || 'sans-serif'}`;
        
        item.appendChild(label);
        item.appendChild(pangram);
        
        return item;
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '200px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const fontFamily = item.dataset.fontFamily;
                    
                    if (fontFamily && !this.loadedFonts.has(fontFamily)) {
                        this.loadFontDynamically(fontFamily);
                    }
                }
            });
        }, options);
    }

    async render() {
        const container = document.createElement('div');
        container.className = 'typography-showcase';
        
        // Header
        const header = document.createElement('div');
        header.className = 'typography-header';
        header.innerHTML = `
            <h1>Typography Showcase</h1>
            <p class="typography-subtitle">"${this.pangram}" in 1,000 fonts</p>
            <div class="typography-stats">
                <span class="stat">Total: <strong id="font-count">Loading...</strong></span>
                <span class="stat">Loaded: <strong id="fonts-loaded">0</strong></span>
            </div>
        `;
        
        // Loading indicator
        const loading = document.createElement('div');
        loading.className = 'typography-loading';
        loading.innerHTML = '<div class="loading-spinner">Loading fonts...</div>';
        
        container.appendChild(header);
        container.appendChild(loading);
        
        // Load fonts asynchronously
        this.loadGoogleFonts().then(() => {
            loading.remove();
            
            // Update count
            const countEl = container.querySelector('#font-count');
            if (countEl) countEl.textContent = this.fonts.length;
            
            // Create grid container
            const grid = document.createElement('div');
            grid.className = 'typography-grid';
            
            // Create all font items
            this.fonts.forEach((font, index) => {
                const item = this.createFontItem(font, index);
                grid.appendChild(item);
            });
            
            container.appendChild(grid);
            
            // Setup lazy loading
            this.setupIntersectionObserver();
            const items = grid.querySelectorAll('.typography-item');
            items.forEach(item => this.observer.observe(item));
            
            // Update loaded count as fonts load
            setInterval(() => {
                const loadedEl = container.querySelector('#fonts-loaded');
                if (loadedEl) loadedEl.textContent = this.loadedFonts.size;
            }, 1000);
        });
        
        this.container = container;
        return container;
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.container) {
            this.container.remove();
        }
    }
}
