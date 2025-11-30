class ContentManager {
    constructor(options = {}) {
        this.options = {
            contentSelector: options.contentSelector || '#content-display',
            loadingDelay: options.loadingDelay || 200,
            mobileBreakpoint: options.mobileBreakpoint || 480,
            ...options
        };
        this.contentElement = document.querySelector(this.options.contentSelector);
        if (!this.contentElement) {
            console.error(`Content element not found: ${this.options.contentSelector}`);
            return;
        }
    }
    async loadContent(contentId) {
        if (!this.contentElement) {
            console.error('Content display element not found');
            return;
        }
        if (contentId === 'photo-fineart') {
            this.loadNGAGallery();
            return;
        }
        if (contentId === 'audio-components-instruments-keyboards-synthesizer' || 
            contentId.includes('synthesizer')) {
            this.loadSynthesizer();
            return;
        }
        if (contentId === 'photo-color') {
            console.log('Loading color palette builder...');
            this.loadColorPaletteBuilder();
            return;
        }
        // Music tournament for music lists
        if (contentId === 'audio-music-lists-new' || 
            contentId === 'audio-music-lists-favorites' || 
            contentId === 'audio-music-lists-popular') {
            this.loadMusicTournament();
            return;
        }
        this.contentElement.classList.add('loading');
        try {
            const content = await this.loadMarkdownContent(contentId);
            setTimeout(() => {
                this.contentElement.innerHTML = content;
                this.contentElement.classList.remove('loading');
                if (this.isMobile()) {
                    const contentArea = document.querySelector('.why-content');
                    if (contentArea) {
                        contentArea.style.display = 'block';
                    }
                }
            }, this.options.loadingDelay);
        } catch (error) {
            console.error('Content loading error:', error);
            setTimeout(() => {
                this.contentElement.innerHTML = this.getContentForSection(contentId);
                this.contentElement.classList.remove('loading');
            }, this.options.loadingDelay);
        }
    }
    async loadMarkdownContent(contentId) {
        const contentSuffix = this.isMobile() ? '-mobile' : '';
        const markdownPath = `content/${contentId}${contentSuffix}.md`;
        try {
            console.log(`Loading markdown: ${markdownPath}`);
            const response = await fetch(markdownPath);
            if (!response.ok) {
                if (contentSuffix === '-mobile') {
                    console.log(`Mobile content not found, trying desktop version`);
                    return await this.loadDesktopContent(contentId);
                }
                throw new Error(`Failed to load ${markdownPath}: ${response.status}`);
            }
            const lastModified = response.headers.get('last-modified');
            const fileTimestamp = lastModified ? new Date(lastModified) : new Date();
            const markdownText = await response.text();
            console.log(`Loaded ${this.isMobile() ? 'mobile' : 'desktop'} content for ${contentId}`);
            const html = this.parseMarkdown(markdownText);
            const timestampHtml = this.formatFileTimestamp(fileTimestamp, markdownPath);
            return html + timestampHtml;
        } catch (error) {
            console.log(`Markdown file not found: ${markdownPath}, using fallback content`);
            throw error;
        }
    }
    async loadDesktopContent(contentId) {
        const markdownPath = `content/${contentId}.md`;
        const response = await fetch(markdownPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${markdownPath}: ${response.status}`);
        }
        const lastModified = response.headers.get('last-modified');
        const fileTimestamp = lastModified ? new Date(lastModified) : new Date();
        const markdownText = await response.text();
        const html = this.parseMarkdown(markdownText);
        const timestampHtml = this.formatFileTimestamp(fileTimestamp, markdownPath);
        return html + timestampHtml;
    }
    parseMarkdown(markdown) {
        let html = markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
            .replace(/\*Generated: ([^*]+)\*/gim, '<footer class="content-timestamp">Generated: $1</footer>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>');
        html = '<p>' + html + '</p>';
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><h/g, '<h');
        html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
        html = html.replace(/<p><footer/g, '<footer');
        html = html.replace(/<\/footer><\/p>/g, '</footer>');
        return html;
    }
    formatFileTimestamp(date, filePath) {
        const isoString = date.toISOString();
        const microseconds = String(date.getMilliseconds() * 1000 + Math.floor(Math.random() * 1000)).padStart(6, '0');
        const timestampWithMicros = isoString.replace(/\.\d{3}Z$/, `.${microseconds}Z`);
        const fileName = filePath.split('/').pop();
        return `<footer class="live-timestamp">
            <div class="timestamp-info">
                <strong>File:</strong> ${fileName}<br>
                <strong>Last Modified:</strong> ${timestampWithMicros}
            </div>
        </footer>`;
    }
    isMobile() {
        return window.innerWidth <= this.options.mobileBreakpoint;
    }
    loadNGAGallery() {
        this.contentElement.classList.add('loading');
        if (!document.querySelector('link[href*="nga-gallery.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'components/nga-gallery.css';
            document.head.appendChild(link);
        }
        if (!window.NGAGallery) {
            const script = document.createElement('script');
            script.src = 'components/nga-gallery.js';
            script.onload = () => {
                this.initializeNGAGallery();
            };
            document.head.appendChild(script);
        } else {
            this.initializeNGAGallery();
        }
    }
    initializeNGAGallery() {
        setTimeout(() => {
            this.contentElement.innerHTML = '<div id="nga-gallery-container"></div>';
            this.contentElement.classList.remove('loading');
            window.ngaGallery = new NGAGallery('nga-gallery-container', {
                itemsPerPage: 20,
                showImages: true
            });
            window.ngaGallery.loadFineArt();
            if (this.isMobile()) {
                const contentArea = document.querySelector('.why-content');
                if (contentArea) {
                    contentArea.style.display = 'block';
                }
            }
        }, this.options.loadingDelay);
    }
    
    loadSynthesizer() {
        this.contentElement.classList.add('loading');
        setTimeout(() => {
            this.contentElement.innerHTML = '<div id="synthesizer-container"></div>';
            this.contentElement.classList.remove('loading');
            
            window.synthesizer = new Synthesizer('synthesizer-container', {
                octaves: 3,
                startOctave: 3,
                waveform: 'sine'
            });
            
            if (this.isMobile()) {
                const contentArea = document.querySelector('.why-content');
                if (contentArea) {
                    contentArea.style.display = 'block';
                }
            }
        }, this.options.loadingDelay);
    }
    
    loadColorPaletteBuilder() {
        console.log('loadColorPaletteBuilder called');
        this.contentElement.classList.add('loading');
        
        // Make sure colorPalette is available
        if (!window.colorPalette) {
            console.error('ColorPalette not initialized');
            return;
        }
        
        console.log('ColorPalette available, creating builder...');
        
        setTimeout(() => {
            console.log('Creating ColorPaletteBuilder instance...');
            // Create the builder and render it
            window.colorBuilder = new ColorPaletteBuilder(window.colorPalette);
            const builderElement = window.colorBuilder.render();
            
            console.log('Builder rendered, inserting into DOM...');
            // Insert into content area
            this.contentElement.innerHTML = '';
            this.contentElement.appendChild(builderElement);
            this.contentElement.classList.remove('loading');
            
            console.log('Attaching event listeners...');
            // Attach event listeners
            window.colorBuilder.attachEventListeners();
            
            console.log('Color palette builder loaded successfully');
            
            if (this.isMobile()) {
                const contentArea = document.querySelector('.why-content');
                if (contentArea) {
                    contentArea.style.display = 'block';
                }
            }
        }, this.options.loadingDelay);
    }
    loadMusicTournament() {
        console.log('Loading music tournament...');
        
        // Clear and show loading
        this.contentElement.classList.add('loading');
        this.contentElement.innerHTML = '<div class="loading-message">Loading Music Tournament...</div>';
        
        setTimeout(() => {
            console.log('MusicTournament available:', typeof window.MusicTournament !== 'undefined');
            
            if (typeof window.MusicTournament === 'undefined') {
                console.error('MusicTournament class not found');
                this.contentElement.innerHTML = '<div class="error">Music Tournament not available</div>';
                this.contentElement.classList.remove('loading');
                return;
            }
            
            console.log('Creating MusicTournament instance...');
            const tournament = new window.MusicTournament(this.contentElement);
            
            console.log('Initializing tournament...');
            tournament.init();
            
            this.contentElement.classList.remove('loading');
            console.log('Music tournament loaded successfully');
            
            if (this.isMobile()) {
                const contentArea = document.querySelector('.why-content');
                if (contentArea) {
                    contentArea.style.display = 'block';
                }
            }
        }, this.options.loadingDelay);
    }
    getContentForSection(sectionId) {
        const contentMap = {
            'media': `
                <h1>Media Files</h1>
                <p>Access and manage multimedia content across various formats and protocols.</p>
                <h2>Media Categories</h2>
                <ul>
                    <li><strong>Audio:</strong> Lossless, Compressed, Web formats</li>
                    <li><strong>Photo:</strong> RAW, Compressed, Lossless, Vector</li>
                    <li><strong>Text:</strong> Rich and Plain text documents</li>
                    <li><strong>Video:</strong> Web, Archive, Professional formats</li>
                </ul>
                <h2>Access Methods</h2>
                <p>Media files can be accessed through FTP, SFTP, HTTPS, and API endpoints.</p>
            `,
            'media-audio': `
                <h1>Audio Files</h1>
                <p>High-quality audio file storage and streaming capabilities.</p>
                <h2>Audio Categories</h2>
                <ul>
                    <li><strong>Lossless:</strong> FLAC, WAV, AIFF - Uncompressed audio</li>
                    <li><strong>Compressed:</strong> MP3, AAC, OGG - Lossy compression</li>
                    <li><strong>Web:</strong> OPUS, WebM Audio - Web-optimized formats</li>
                </ul>
            `,
            'media-photo': `
                <h1>Photo Files</h1>
                <p>Professional photography and image management systems.</p>
                <h2>Photo Categories</h2>
                <ul>
                    <li><strong>RAW:</strong> CR2, NEF, ARW, DNG - Unprocessed sensor data</li>
                    <li><strong>Compressed:</strong> JPEG, WebP, HEIC - Lossy compression</li>
                    <li><strong>Lossless:</strong> PNG, TIFF - No quality loss</li>
                    <li><strong>Vector:</strong> SVG - Scalable graphics</li>
                </ul>
            `,
            'photo-fineart': `
                <div id="nga-gallery-container">
                    <div class="nga-loading">
                        <div class="nga-spinner"></div>
                        <p>Loading National Gallery of Art collection...</p>
                    </div>
                </div>
                <script>
                    if (!window.ngaGallery && window.NGAGallery) {
                        setTimeout(() => {
                            window.ngaGallery = new NGAGallery('nga-gallery-container');
                            window.ngaGallery.loadFineArt();
                        }, 500);
                    }
                </script>
            `,
            'media-text': `
                <h1>Text Files</h1>
                <p>Document storage and text processing systems.</p>
                <h2>Text Categories</h2>
                <ul>
                    <li><strong>Rich:</strong> DOCX, RTF, HTML, Markdown - Formatted documents</li>
                    <li><strong>Plain:</strong> TXT, CSV, JSON, XML - Unformatted text</li>
                </ul>
            `,
            'media-video': `
                <h1>Video Files</h1>
                <p>Video content management and streaming services.</p>
                <h2>Video Categories</h2>
                <ul>
                    <li><strong>Web:</strong> MP4, WebM, MOV - Web-compatible formats</li>
                    <li><strong>Archive:</strong> AVI, MKV, WMV - Legacy and container formats</li>
                    <li><strong>Professional:</strong> ProRes, DNxHD - High-quality codecs</li>
                </ul>
            `,
            'audio-lossless': `
                <h1>Lossless Audio</h1>
                <p>Uncompressed and losslessly compressed audio formats.</p>
                <h2>Supported Formats</h2>
                <ul>
                    <li><strong>FLAC:</strong> Free Lossless Audio Codec</li>
                    <li><strong>WAV:</strong> Waveform Audio File Format</li>
                    <li><strong>AIFF:</strong> Audio Interchange File Format</li>
                </ul>
            `,
            'spatial': `
                <h1>Spatial Data</h1>
                <p>Geographic information systems and spatial data management.</p>
                <h2>Spatial Data Categories</h2>
                <ul>
                    <li><strong>Models (3D):</strong> 3D models and meshes</li>
                    <li><strong>Drawings (2D):</strong> Technical drawings and schematics</li>
                    <li><strong>Geospatial:</strong> Geographic and mapping data</li>
                    <li><strong>Reality (VR/AR):</strong> Virtual and Augmented Reality content</li>
                </ul>
            `,
            'software': `
                <h1>Software Resources</h1>
                <p>Source code repositories, binary distributions, and development tools.</p>
                <h2>Software Categories</h2>
                <ul>
                    <li><strong>Source:</strong> Version-controlled repositories</li>
                    <li><strong>Compiled:</strong> Compiled executables and libraries</li>
                    <li><strong>Web:</strong> Web applications and frameworks</li>
                    <li><strong>Mobile:</strong> Mobile applications and SDKs</li>
                    <li><strong>Desktop:</strong> Desktop applications</li>
                    <li><strong>Console:</strong> Command-line tools and utilities</li>
                </ul>
            `,
            'scientific': `
                <h1>Scientific Resources</h1>
                <p>Research data, publications, and scientific computing resources.</p>
                <h2>Scientific Categories</h2>
                <ul>
                    <li><strong>Medical:</strong> Medical research and data</li>
                    <li><strong>Research:</strong> General research data and papers</li>
                    <li><strong>Molecular:</strong> Molecular and chemical data</li>
                    <li><strong>Astronomical:</strong> Astronomical observations and data</li>
                </ul>
            `,
            'business': `
                <h1>Business Resources</h1>
                <p>Corporate documents, reports, and business intelligence data.</p>
                <h2>Business Categories</h2>
                <ul>
                    <li><strong>Documents:</strong> Corporate documentation</li>
                    <li><strong>Archives:</strong> Historical business records</li>
                    <li><strong>Data:</strong> Business intelligence and analytics</li>
                    <li><strong>Reports:</strong> Financial and operational reports</li>
                </ul>
            `
        };
        return contentMap[sectionId] || `
            <h1>Content Not Found</h1>
            <p>The requested content section "${sectionId}" could not be found.</p>
            <p>Please select a valid section from the navigation menu.</p>
        `;
    }
}