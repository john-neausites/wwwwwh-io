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
        
        // Stop any currently playing radio when navigating away
        // TODO: Future enhancement - add crossfade transition between stations
        if (this.currentRadio) {
            this.currentRadio.destroy();
            this.currentRadio = null;
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
        // Music tournament for popular
        if (contentId === 'audio-music-lists-popular') {
            this.loadMusicTournament();
            return;
        }
        // New releases from iTunes
        if (contentId === 'audio-music-lists-new') {
            this.loadNewReleases();
            return;
        }
        // Curated playlist selector
        if (contentId === 'audio-music-lists-favorites') {
            this.loadPlaylistSelector();
            return;
        }
        // Music Radio Stations
        if (contentId === 'audio-music-radio') {
            this.loadMusicRadio('general');
            return;
        }
        if (contentId === 'audio-music-radio-christmas') {
            this.loadMusicRadio('christmas');
            return;
        }
        if (contentId === 'audio-music-radio-rock') {
            this.loadMusicRadio('rock');
            return;
        }
        if (contentId === 'audio-music-radio-pop') {
            this.loadMusicRadio('pop');
            return;
        }
        if (contentId === 'audio-music-radio-hiphop') {
            this.loadMusicRadio('hiphop');
            return;
        }
        if (contentId === 'audio-music-radio-electronic') {
            this.loadMusicRadio('electronic');
            return;
        }
        if (contentId === 'audio-music-radio-jazz') {
            this.loadMusicRadio('jazz');
            return;
        }
        if (contentId === 'audio-music-radio-classical') {
            this.loadMusicRadio('classical');
            return;
        }
        if (contentId === 'audio-music-radio-country') {
            this.loadMusicRadio('country');
            return;
        }
        if (contentId === 'audio-music-radio-rnb') {
            this.loadMusicRadio('rnb');
            return;
        }
        this.contentElement.classList.add('loading');
        try {
            const content = await this.loadMarkdownContent(contentId);
            
            // Track successful content load
            if (window.analytics) {
                window.analytics.trackContentLoad('markdown', contentId);
            }
            
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
            
            // Track error
            if (window.analytics) {
                window.analytics.trackError('content_load', error.message, { contentId });
            }
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
        
        // Track content load
        if (window.analytics) {
            window.analytics.trackContentLoad('music_tournament', 'audio-music-lists-popular');
        }
        
        // Clear and show loading
        this.contentElement.classList.add('loading');
        this.contentElement.innerHTML = '<div class="loading-message">Loading Music Tournament...</div>';
        
        setTimeout(() => {
            console.log('MusicTournament available:', typeof window.MusicTournament !== 'undefined');
            
            if (typeof window.MusicTournament === 'undefined') {
                console.error('MusicTournament class not found');
                this.contentElement.innerHTML = '<div class="error">Music Tournament not available</div>';
                this.contentElement.classList.remove('loading');
                
                if (window.analytics) {
                    window.analytics.trackError('music_tournament_load', 'Class not found', {});
                }
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
    loadNewReleases() {
        console.log('Loading new releases from iTunes...');
        
        this.contentElement.classList.add('loading');
        this.contentElement.innerHTML = '<div class="loading-message">Loading New Releases...</div>';
        
        setTimeout(async () => {
            try {
                // Use iTunes Search API for new releases - search for popular recent albums
                const searches = [
                    'Kendrick Lamar', 'Taylor Swift', 'Drake', 'The Weeknd', 'Bad Bunny',
                    'Beyoncé', 'Dua Lipa', 'Billie Eilish', 'Post Malone', 'Ariana Grande',
                    'Ed Sheeran', 'Olivia Rodrigo', 'SZA', 'Travis Scott', 'Harry Styles'
                ];
                
                const releases = [];
                const seenAlbums = new Set();
                
                for (const artist of searches) {
                    try {
                        const query = encodeURIComponent(artist);
                        const response = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&entity=album&limit=5&sort=recent`);
                        const data = await response.json();
                        
                        if (data.results && data.results.length > 0) {
                            for (const album of data.results) {
                                // Avoid duplicates
                                if (!seenAlbums.has(album.collectionId)) {
                                    seenAlbums.add(album.collectionId);
                                    releases.push({
                                        collectionId: album.collectionId,
                                        title: album.collectionName,
                                        artist: album.artistName,
                                        artwork: album.artworkUrl100?.replace('100x100', '600x600'),
                                        releaseDate: album.releaseDate,
                                        link: album.collectionViewUrl,
                                        trackCount: album.trackCount,
                                        primaryGenre: album.primaryGenreName
                                    });
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching ${artist}:`, error);
                    }
                }
                
                // Sort by release date (newest first) and take top 50
                releases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                const topReleases = releases.slice(0, 50);
                
                let html = `
                    <div class="new-releases">
                        <h2>🎵 New Releases</h2>
                        <p class="subtitle">Recent albums from top artists</p>
                        <div class="releases-grid">
                `;
                
                for (const release of topReleases) {
                    const releaseDate = new Date(release.releaseDate).toLocaleDateString();
                    
                    html += `
                        <div class="release-card" data-collection-id="${release.collectionId}">
                            <div class="album-cover">
                                <img src="${release.artwork}" alt="${release.title}" loading="lazy">
                            </div>
                            <h3>${release.title}</h3>
                            <p class="artist">${release.artist}</p>
                            <p class="meta">${releaseDate} • ${release.trackCount} tracks</p>
                            <p class="genre">${release.primaryGenre}</p>
                            <button class="preview-btn">Preview All Tracks</button>
                            <div class="track-list" style="display: none;"></div>
                        </div>
                    `;
                }
                
                html += `
                        </div>
                        <style>
                            .new-releases {
                                padding: 20px;
                                font-family: 'JetBrains Mono', monospace;
                            }
                            .new-releases h2 {
                                font-size: 32px;
                                margin-bottom: 10px;
                            }
                            .subtitle {
                                opacity: 0.7;
                                margin-bottom: 30px;
                            }
                            .releases-grid {
                                display: grid;
                                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                                gap: 20px;
                            }
                            .release-card {
                                border: 2px solid currentColor;
                                padding: 15px;
                                transition: transform 0.2s ease;
                            }
                            .release-card:hover {
                                transform: translateY(-5px);
                            }
                            .release-card img {
                                width: 100%;
                                display: block;
                                margin-bottom: 10px;
                            }
                            .release-card h3 {
                                font-size: 14px;
                                margin: 10px 0 5px;
                                line-height: 1.3;
                            }
                            .release-card .artist {
                                font-size: 12px;
                                opacity: 0.7;
                                margin-bottom: 5px;
                            }
                            .release-card .meta {
                                font-size: 11px;
                                opacity: 0.5;
                                margin-bottom: 5px;
                            }
                            .release-card .genre {
                                font-size: 10px;
                                opacity: 0.4;
                                margin-bottom: 10px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            }
                            .release-card .album-cover {
                                cursor: pointer;
                            }
                            .release-card .preview-btn {
                                display: block;
                                width: 100%;
                                margin-top: 10px;
                                padding: 8px;
                                border: 2px solid currentColor;
                                background: transparent;
                                color: currentColor;
                                font-family: 'JetBrains Mono', monospace;
                                font-size: 11px;
                                cursor: pointer;
                                transition: all 0.2s ease;
                            }
                            .release-card .preview-btn:hover {
                                background: currentColor;
                                color: var(--color-primary, white);
                            }
                            .release-card .preview-btn.active {
                                background: currentColor;
                                color: var(--color-primary, white);
                                font-weight: 600;
                            }
                            .release-card .preview-btn:disabled {
                                opacity: 0.5;
                                cursor: not-allowed;
                            }
                            .release-card .track-list {
                                margin-top: 15px;
                                border-top: 1px solid currentColor;
                                padding-top: 15px;
                            }
                            .release-card .track-item {
                                padding: 8px 0;
                                border-bottom: 1px solid rgba(128,128,128,0.2);
                            }
                            .release-card .track-item:last-child {
                                border-bottom: none;
                            }
                            .release-card .track-number {
                                font-size: 10px;
                                opacity: 0.5;
                                margin-right: 8px;
                            }
                            .release-card .track-name {
                                font-size: 12px;
                                margin-bottom: 5px;
                            }
                            .release-card .track-duration {
                                font-size: 10px;
                                opacity: 0.5;
                            }
                            .release-card audio {
                                width: 100%;
                                height: 32px;
                                margin-top: 5px;
                            }
                            .release-card a {
                                color: inherit;
                                text-decoration: none;
                            }
                        </style>
                    </div>
                `;
                
                this.contentElement.innerHTML = html;
                
                // Attach event listeners for preview buttons
                this.contentElement.querySelectorAll('.preview-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const card = e.target.closest('.release-card');
                        const trackList = card.querySelector('.track-list');
                        const collectionId = card.dataset.collectionId;
                        
                        // Toggle if already loaded
                        if (trackList.innerHTML !== '') {
                            const isHidden = trackList.style.display === 'none';
                            trackList.style.display = isHidden ? 'block' : 'none';
                            e.target.textContent = isHidden ? 'Hide Tracks' : 'Preview All Tracks';
                            e.target.classList.toggle('active', isHidden);
                            return;
                        }
                        
                        // Load tracks
                        e.target.textContent = 'Loading...';
                        e.target.disabled = true;
                        e.target.classList.add('active');
                        
                        try {
                            const response = await fetch(`https://itunes.apple.com/lookup?id=${collectionId}&entity=song&limit=200`);
                            const data = await response.json();
                            
                            if (data.results && data.results.length > 1) {
                                const tracks = data.results.slice(1); // Skip first result (album info)
                                
                                let trackHtml = '';
                                tracks.forEach((track, index) => {
                                    const duration = track.trackTimeMillis ? Math.floor(track.trackTimeMillis / 1000 / 60) + ':' + String(Math.floor((track.trackTimeMillis / 1000) % 60)).padStart(2, '0') : '';
                                    
                                    trackHtml += `
                                        <div class="track-item">
                                            <div class="track-info">
                                                <span class="track-number">${track.trackNumber || index + 1}.</span>
                                                <span class="track-name">${track.trackName}</span>
                                                ${duration ? `<span class="track-duration"> • ${duration}</span>` : ''}
                                            </div>
                                            ${track.previewUrl ? `
                                                <audio controls preload="none">
                                                    <source src="${track.previewUrl}" type="audio/mp4">
                                                </audio>
                                            ` : '<p class="no-preview" style="font-size: 10px; opacity: 0.4; margin-top: 5px;">No preview available</p>'}
                                        </div>
                                    `;
                                });
                                
                                trackList.innerHTML = trackHtml;
                                trackList.style.display = 'block';
                                e.target.textContent = 'Hide Tracks';
                                e.target.disabled = false;
                                e.target.classList.add('active');
                            } else {
                                trackList.innerHTML = '<p style="opacity: 0.5; font-size: 11px;">No tracks found</p>';
                                trackList.style.display = 'block';
                                e.target.textContent = 'Preview All Tracks';
                                e.target.disabled = false;
                                e.target.classList.remove('active');
                            }
                        } catch (error) {
                            console.error('Error loading tracks:', error);
                            trackList.innerHTML = '<p style="opacity: 0.5; font-size: 11px; color: red;">Failed to load tracks</p>';
                            trackList.style.display = 'block';
                            e.target.textContent = 'Preview All Tracks';
                            e.target.disabled = false;
                            e.target.classList.remove('active');
                        }
                    });
                });
                
                this.contentElement.classList.remove('loading');
            } catch (error) {
                console.error('Error loading new releases:', error);
                this.contentElement.innerHTML = '<div class="error">Failed to load new releases</div>';
                this.contentElement.classList.remove('loading');
            }
        }, this.options.loadingDelay);
    }
    loadPlaylistSelector() {
        console.log('Loading playlist selector...');
        
        // Track content load
        if (window.analytics) {
            window.analytics.trackContentLoad('playlist_selector', 'audio-music-lists-favorites');
        }
        
        this.contentElement.classList.add('loading');
        this.contentElement.innerHTML = '<div class="loading-message">Loading Playlist Selector...</div>';
        
        setTimeout(() => {
            if (typeof window.PlaylistSelector === 'undefined') {
                console.error('PlaylistSelector class not found');
                this.contentElement.innerHTML = '<div class="error">Playlist selector not available</div>';
                this.contentElement.classList.remove('loading');
                
                if (window.analytics) {
                    window.analytics.trackError('playlist_selector_load', 'Class not found', {});
                }
                return;
            }
            
            const selector = new window.PlaylistSelector(this.contentElement);
            selector.render();
            
            this.contentElement.classList.remove('loading');
            console.log('Playlist selector loaded successfully');
            return;
        }, this.options.loadingDelay);
    }
    loadMusicRadio(station = 'general') {
        console.log(`Loading music radio station: ${station}...`);
        
        // Track content load
        if (window.analytics) {
            window.analytics.trackContentLoad('music_radio', `audio-music-radio-${station}`);
        }
        
        this.contentElement.classList.add('loading');
        this.contentElement.innerHTML = '<div class="loading-message">Loading Music Radio...</div>';
        
        setTimeout(() => {
            if (typeof window.MusicRadio === 'undefined') {
                console.error('MusicRadio class not found');
                this.contentElement.innerHTML = '<div class="error">Music radio not available</div>';
                this.contentElement.classList.remove('loading');
                
                if (window.analytics) {
                    window.analytics.trackError('music_radio_load', 'Class not found', {});
                }
                return;
            }
            
            const radio = new window.MusicRadio(this.contentElement, station);
            this.currentRadio = radio; // Keep reference to stop on navigation
            window.musicRadio = radio; // Make globally available for inline handlers
            radio.render();
            
            this.contentElement.classList.remove('loading');
            console.log(`Music radio loaded successfully: ${station}`);
        }, this.options.loadingDelay);
    }
    loadMoodPlaylistsOld() {
        console.log('Loading old mood playlists...');
        
        this.contentElement.classList.add('loading');
        this.contentElement.innerHTML = '<div class="loading-message">Loading Playlists...</div>';
        
        setTimeout(() => {
            const playlists = {
                'Focus': {
                    icon: '🎯',
                    description: 'Deep work, coding, studying',
                    songs: [
                        { artist: 'Brian Eno', title: 'Music for Airports', album: 'Ambient 1' },
                        { artist: 'Max Richter', title: 'On the Nature of Daylight', album: 'The Blue Notebooks' },
                        { artist: 'Nils Frahm', title: 'Says', album: 'Spaces' },
                        { artist: 'Ólafur Arnalds', title: 'Near Light', album: 'For Now I Am Winter' },
                        { artist: 'Ryuichi Sakamoto', title: 'Merry Christmas Mr. Lawrence', album: 'BTTB' }
                    ]
                },
                'Energy': {
                    icon: '⚡',
                    description: 'Workouts, running, motivation',
                    songs: [
                        { artist: 'Daft Punk', title: 'Harder Better Faster Stronger', album: 'Discovery' },
                        { artist: 'The Prodigy', title: 'Firestarter', album: 'The Fat of the Land' },
                        { artist: 'Chemical Brothers', title: 'Block Rockin\' Beats', album: 'Dig Your Own Hole' },
                        { artist: 'Justice', title: 'Genesis', album: 'Cross' },
                        { artist: 'MSTRKRFT', title: 'Easy Love', album: 'The Looks' }
                    ]
                },
                'Chill': {
                    icon: '🌙',
                    description: 'Relaxation, evening, unwinding',
                    songs: [
                        { artist: 'Bonobo', title: 'Kiara', album: 'Black Sands' },
                        { artist: 'Tycho', title: 'A Walk', album: 'Dive' },
                        { artist: 'Boards of Canada', title: 'Dayvan Cowboy', album: 'The Campfire Headphase' },
                        { artist: 'Air', title: 'La Femme d\'Argent', album: 'Moon Safari' },
                        { artist: 'Khruangbin', title: 'Time (You and I)', album: 'Con Todo El Mundo' }
                    ]
                },
                'Social': {
                    icon: '🎉',
                    description: 'Parties, gatherings, friends',
                    songs: [
                        { artist: 'Dua Lipa', title: 'Levitating', album: 'Future Nostalgia' },
                        { artist: 'Mark Ronson', title: 'Uptown Funk', album: 'Uptown Special' },
                        { artist: 'Chromeo', title: 'Jealous', album: 'White Women' },
                        { artist: 'LCD Soundsystem', title: 'Dance Yrself Clean', album: 'This Is Happening' },
                        { artist: 'Disclosure', title: 'Latch', album: 'Settle' }
                    ]
                },
                'Drive': {
                    icon: '🚗',
                    description: 'Road trips, commutes, travel',
                    songs: [
                        { artist: 'M83', title: 'Midnight City', album: 'Hurry Up, We\'re Dreaming' },
                        { artist: 'Phoenix', title: '1901', album: 'Wolfgang Amadeus Phoenix' },
                        { artist: 'MGMT', title: 'Electric Feel', album: 'Oracular Spectacular' },
                        { artist: 'Tame Impala', title: 'The Less I Know the Better', album: 'Currents' },
                        { artist: 'Foster the People', title: 'Pumped Up Kicks', album: 'Torches' }
                    ]
                },
                'Morning': {
                    icon: '☀️',
                    description: 'Wake up, breakfast, start fresh',
                    songs: [
                        { artist: 'Jon Hopkins', title: 'Open Eye Signal', album: 'Immunity' },
                        { artist: 'Four Tet', title: 'Angel Echoes', album: 'Beautiful Rewind' },
                        { artist: 'Caribou', title: 'Can\'t Do Without You', album: 'Our Love' },
                        { artist: 'Jamie xx', title: 'Loud Places', album: 'In Colour' },
                        { artist: 'Moderat', title: 'A New Error', album: 'Moderat' }
                    ]
                },
                'Late Night': {
                    icon: '🌃',
                    description: 'After hours, introspection, solitude',
                    songs: [
                        { artist: 'The xx', title: 'Intro', album: 'xx' },
                        { artist: 'Massive Attack', title: 'Teardrop', album: 'Mezzanine' },
                        { artist: 'Portishead', title: 'Glory Box', album: 'Dummy' },
                        { artist: 'Burial', title: 'Archangel', album: 'Untrue' },
                        { artist: 'James Blake', title: 'Retrograde', album: 'Overgrown' }
                    ]
                },
                'Creative': {
                    icon: '🎨',
                    description: 'Design, writing, brainstorming',
                    songs: [
                        { artist: 'Aphex Twin', title: 'Windowlicker', album: 'Windowlicker EP' },
                        { artist: 'Autechre', title: 'Pen Expers', album: 'Exai' },
                        { artist: 'Flying Lotus', title: 'Do the Astral Plane', album: 'Cosmogramma' },
                        { artist: 'Squarepusher', title: 'Come On My Selector', album: 'Hard Normal Daddy' },
                        { artist: 'Amon Tobin', title: 'Easy Muffin', album: 'Permutation' }
                    ]
                }
            };
            
            let html = `
                <div class="mood-playlists">
                    <h2>🎵 Mood Playlists</h2>
                    <p class="subtitle">Curated selections for every moment</p>
                    <div class="playlists-grid">
            `;
            
            for (const [mood, playlist] of Object.entries(playlists)) {
                html += `
                    <div class="playlist-card">
                        <div class="playlist-header">
                            <span class="playlist-icon">${playlist.icon}</span>
                            <h3>${mood}</h3>
                        </div>
                        <p class="playlist-description">${playlist.description}</p>
                        <div class="playlist-songs">
                            ${playlist.songs.map(song => `
                                <div class="song-item">
                                    <div class="song-title">${song.title}</div>
                                    <div class="song-artist">${song.artist}</div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="play-playlist-btn" data-mood="${mood}">
                            ▶ Play on iTunes
                        </button>
                    </div>
                `;
            }
            
            html += `
                    </div>
                    <style>
                        .mood-playlists {
                            padding: 20px;
                            font-family: 'JetBrains Mono', monospace;
                        }
                        .mood-playlists h2 {
                            font-size: 32px;
                            margin-bottom: 10px;
                        }
                        .subtitle {
                            opacity: 0.7;
                            margin-bottom: 30px;
                        }
                        .playlists-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                            gap: 20px;
                        }
                        .playlist-card {
                            border: 2px solid currentColor;
                            padding: 20px;
                            transition: all 0.2s ease;
                        }
                        .playlist-card:hover {
                            transform: translateY(-5px);
                            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        }
                        .playlist-header {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            margin-bottom: 10px;
                        }
                        .playlist-icon {
                            font-size: 32px;
                        }
                        .playlist-card h3 {
                            font-size: 20px;
                            margin: 0;
                        }
                        .playlist-description {
                            font-size: 12px;
                            opacity: 0.7;
                            margin-bottom: 15px;
                        }
                        .playlist-songs {
                            margin: 15px 0;
                            max-height: 200px;
                            overflow-y: auto;
                        }
                        .song-item {
                            padding: 8px 0;
                            border-bottom: 1px solid rgba(128,128,128,0.2);
                        }
                        .song-item:last-child {
                            border-bottom: none;
                        }
                        .song-title {
                            font-size: 13px;
                            font-weight: 600;
                            margin-bottom: 3px;
                        }
                        .song-artist {
                            font-size: 11px;
                            opacity: 0.6;
                        }
                        .play-playlist-btn {
                            width: 100%;
                            padding: 12px;
                            font-size: 14px;
                            font-weight: 600;
                            border: 2px solid currentColor;
                            background: transparent;
                            color: currentColor;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            font-family: 'JetBrains Mono', monospace;
                            margin-top: 10px;
                        }
                        .play-playlist-btn:hover {
                            background: currentColor;
                            color: var(--color-primary, white);
                        }
                        @media (max-width: 768px) {
                            .playlists-grid {
                                grid-template-columns: 1fr;
                            }
                        }
                    </style>
                </div>
            `;
            
            this.contentElement.innerHTML = html;
            this.contentElement.classList.remove('loading');
            
            // Add click handlers for playlist buttons
            this.contentElement.querySelectorAll('.play-playlist-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const mood = e.target.dataset.mood;
                    const playlist = playlists[mood];
                    const firstSong = playlist.songs[0];
                    const query = encodeURIComponent(`${firstSong.artist} ${firstSong.title}`);
                    window.open(`https://music.apple.com/search?term=${query}`, '_blank');
                });
            });
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