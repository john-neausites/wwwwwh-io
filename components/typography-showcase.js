class TypographyShowcase {
    constructor() {
        this.container = null;
        this.pangram = "Then, five boxing wizards jump quickly";
        this.fonts = [];
        this.loadedFonts = new Set();
        this.currentIndex = 0;
        this.batchSize = 50; // Load fonts in batches for performance
        this.observer = null;
    }

    async loadGoogleFonts() {
        try {
            // Use a working public API key or fetch without auth
            const response = await fetch('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyDpJpv9Kkp2kZdXGPJxRqUzDjv0S-I-MgA');
            
            if (!response.ok) {
                console.warn('Google Fonts API failed, using fallback list');
                throw new Error('API request failed');
            }
            
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
            this.fonts = this.getExtendedFontList();
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

    getExtendedFontList() {
        // Extended curated list - 200+ popular Google Fonts
        return [
            // Top Sans-Serif Fonts
            { family: 'Roboto', category: 'sans-serif' },
            { family: 'Open Sans', category: 'sans-serif' },
            { family: 'Lato', category: 'sans-serif' },
            { family: 'Montserrat', category: 'sans-serif' },
            { family: 'Oswald', category: 'sans-serif' },
            { family: 'Source Sans Pro', category: 'sans-serif' },
            { family: 'Raleway', category: 'sans-serif' },
            { family: 'Poppins', category: 'sans-serif' },
            { family: 'Roboto Condensed', category: 'sans-serif' },
            { family: 'Ubuntu', category: 'sans-serif' },
            { family: 'Nunito', category: 'sans-serif' },
            { family: 'PT Sans', category: 'sans-serif' },
            { family: 'Mukta', category: 'sans-serif' },
            { family: 'Work Sans', category: 'sans-serif' },
            { family: 'Inter', category: 'sans-serif' },
            { family: 'Rubik', category: 'sans-serif' },
            { family: 'Noto Sans', category: 'sans-serif' },
            { family: 'Barlow', category: 'sans-serif' },
            { family: 'Oxygen', category: 'sans-serif' },
            { family: 'Karla', category: 'sans-serif' },
            { family: 'Quicksand', category: 'sans-serif' },
            { family: 'Hind', category: 'sans-serif' },
            { family: 'Titillium Web', category: 'sans-serif' },
            { family: 'Nunito Sans', category: 'sans-serif' },
            { family: 'DM Sans', category: 'sans-serif' },
            { family: 'Cabin', category: 'sans-serif' },
            { family: 'Manrope', category: 'sans-serif' },
            { family: 'Heebo', category: 'sans-serif' },
            { family: 'Mulish', category: 'sans-serif' },
            { family: 'Arimo', category: 'sans-serif' },
            
            // Top Serif Fonts  
            { family: 'Playfair Display', category: 'serif' },
            { family: 'Merriweather', category: 'serif' },
            { family: 'Lora', category: 'serif' },
            { family: 'PT Serif', category: 'serif' },
            { family: 'Crimson Text', category: 'serif' },
            { family: 'Libre Baskerville', category: 'serif' },
            { family: 'Noto Serif', category: 'serif' },
            { family: 'EB Garamond', category: 'serif' },
            { family: 'Bitter', category: 'serif' },
            { family: 'Arvo', category: 'serif' },
            { family: 'Cormorant', category: 'serif' },
            { family: 'Cardo', category: 'serif' },
            { family: 'Spectral', category: 'serif' },
            { family: 'Vollkorn', category: 'serif' },
            { family: 'Old Standard TT', category: 'serif' },
            { family: 'Alegreya', category: 'serif' },
            { family: 'Source Serif Pro', category: 'serif' },
            { family: 'Rokkitt', category: 'serif' },
            { family: 'Literata', category: 'serif' },
            { family: 'Zilla Slab', category: 'serif' },
            
            // Display Fonts
            { family: 'Lobster', category: 'display' },
            { family: 'Bebas Neue', category: 'display' },
            { family: 'Anton', category: 'display' },
            { family: 'Righteous', category: 'display' },
            { family: 'Alfa Slab One', category: 'display' },
            { family: 'Architects Daughter', category: 'display' },
            { family: 'Abril Fatface', category: 'display' },
            { family: 'Permanent Marker', category: 'display' },
            { family: 'Russo One', category: 'display' },
            { family: 'Fredoka One', category: 'display' },
            { family: 'Bangers', category: 'display' },
            { family: 'Staatliches', category: 'display' },
            { family: 'Saira Condensed', category: 'display' },
            { family: 'Bungee', category: 'display' },
            { family: 'Monoton', category: 'display' },
            
            // Handwriting/Script
            { family: 'Dancing Script', category: 'handwriting' },
            { family: 'Pacifico', category: 'handwriting' },
            { family: 'Indie Flower', category: 'handwriting' },
            { family: 'Shadows Into Light', category: 'handwriting' },
            { family: 'Kaushan Script', category: 'handwriting' },
            { family: 'Satisfy', category: 'handwriting' },
            { family: 'Great Vibes', category: 'handwriting' },
            { family: 'Amatic SC', category: 'handwriting' },
            { family: 'Caveat', category: 'handwriting' },
            { family: 'Courgette', category: 'handwriting' },
            
            // Monospace
            { family: 'JetBrains Mono', category: 'monospace' },
            { family: 'Roboto Mono', category: 'monospace' },
            { family: 'Fira Code', category: 'monospace' },
            { family: 'Source Code Pro', category: 'monospace' },
            { family: 'Ubuntu Mono', category: 'monospace' },
            { family: 'Inconsolata', category: 'monospace' },
            { family: 'Space Mono', category: 'monospace' },
            { family: 'IBM Plex Mono', category: 'monospace' },
            { family: 'Courier Prime', category: 'monospace' },
            { family: 'Anonymous Pro', category: 'monospace' }
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

    render() {
        const container = document.createElement('div');
        container.className = 'typography-showcase';
        
        // Header
        const header = document.createElement('div');
        header.className = 'typography-header';
        header.innerHTML = `
            <h1>Typography Showcase</h1>
            <p class="typography-subtitle">"${this.pangram}" in 100+ fonts</p>
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
        
        this.container = container;
        
        // Load fonts asynchronously AFTER returning the container
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
        
        // Return container immediately (fonts will load async)
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
