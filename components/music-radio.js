class MusicRadio {
    constructor(container) {
        this.container = container;
        this.currentAudio = null;
        this.currentTrack = null;
        this.currentTrackIndex = 0;
        this.playlist = [];
        this.isPlaying = false;
        this.isLoading = false;
        this.likedTracks = this.loadLikedTracks();
        this.dislikedTracks = this.loadDislikedTracks();
        this.progressInterval = null;
        
        // Generate diverse playlist
        this.generatePlaylist();
    }
    
    loadLikedTracks() {
        try {
            return JSON.parse(localStorage.getItem('music-radio-liked') || '[]');
        } catch {
            return [];
        }
    }
    
    loadDislikedTracks() {
        try {
            return JSON.parse(localStorage.getItem('music-radio-disliked') || '[]');
        } catch {
            return [];
        }
    }
    
    saveLikedTracks() {
        localStorage.setItem('music-radio-liked', JSON.stringify(this.likedTracks));
    }
    
    saveDislikedTracks() {
        localStorage.setItem('music-radio-disliked', JSON.stringify(this.dislikedTracks));
    }
    
    generatePlaylist() {
        // Curated diverse playlist of popular songs across genres
        this.playlist = [
            // Electronic/Dance
            { artist: "Daft Punk", title: "Get Lucky", genre: "Electronic" },
            { artist: "Calvin Harris", title: "Summer", genre: "Electronic" },
            { artist: "The Chainsmokers", title: "Closer", genre: "Electronic" },
            { artist: "Avicii", title: "Wake Me Up", genre: "Electronic" },
            { artist: "Zedd", title: "Clarity", genre: "Electronic" },
            
            // Pop
            { artist: "Ed Sheeran", title: "Shape of You", genre: "Pop" },
            { artist: "Taylor Swift", title: "Shake It Off", genre: "Pop" },
            { artist: "Ariana Grande", title: "thank u, next", genre: "Pop" },
            { artist: "Bruno Mars", title: "Uptown Funk", genre: "Pop" },
            { artist: "The Weeknd", title: "Blinding Lights", genre: "Pop" },
            
            // Rock
            { artist: "Imagine Dragons", title: "Radioactive", genre: "Rock" },
            { artist: "Twenty One Pilots", title: "Stressed Out", genre: "Rock" },
            { artist: "Arctic Monkeys", title: "Do I Wanna Know", genre: "Rock" },
            { artist: "The Killers", title: "Mr. Brightside", genre: "Rock" },
            { artist: "Foo Fighters", title: "The Pretender", genre: "Rock" },
            
            // Hip Hop/R&B
            { artist: "Drake", title: "Hotline Bling", genre: "Hip Hop" },
            { artist: "Kendrick Lamar", title: "HUMBLE", genre: "Hip Hop" },
            { artist: "Post Malone", title: "Circles", genre: "Hip Hop" },
            { artist: "Travis Scott", title: "SICKO MODE", genre: "Hip Hop" },
            { artist: "Billie Eilish", title: "bad guy", genre: "Pop" },
            
            // Indie/Alternative
            { artist: "Tame Impala", title: "The Less I Know The Better", genre: "Indie" },
            { artist: "Glass Animals", title: "Heat Waves", genre: "Indie" },
            { artist: "MGMT", title: "Electric Feel", genre: "Indie" },
            { artist: "Foster the People", title: "Pumped Up Kicks", genre: "Indie" },
            { artist: "Alt-J", title: "Breezeblocks", genre: "Indie" },
            
            // Classic Hits
            { artist: "Queen", title: "Bohemian Rhapsody", genre: "Rock" },
            { artist: "Fleetwood Mac", title: "Dreams", genre: "Rock" },
            { artist: "Journey", title: "Don't Stop Believin'", genre: "Rock" },
            { artist: "Michael Jackson", title: "Billie Jean", genre: "Pop" },
            { artist: "Prince", title: "Purple Rain", genre: "Pop" }
        ];
        
        // Shuffle playlist
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    async render() {
        this.container.innerHTML = `
            <div class="music-radio">
                <div class="radio-header">
                    <h2>🎵 Music Radio</h2>
                    <p class="radio-subtitle">Discover new music • 30-second previews</p>
                </div>
                
                <div class="radio-player">
                    <div class="now-playing-card">
                        <div class="track-artwork-container">
                            <div class="artwork-placeholder" id="track-artwork">
                                <svg class="vinyl-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <radialGradient id="vinyl-gradient">
                                            <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
                                            <stop offset="40%" style="stop-color:#2d2d2d;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
                                        </radialGradient>
                                    </defs>
                                    <circle cx="50" cy="50" r="45" fill="url(#vinyl-gradient)" stroke="#444" stroke-width="1"/>
                                    <circle cx="50" cy="50" r="35" fill="none" stroke="#555" stroke-width="0.5" opacity="0.3"/>
                                    <circle cx="50" cy="50" r="25" fill="none" stroke="#555" stroke-width="0.5" opacity="0.3"/>
                                    <circle cx="50" cy="50" r="15" fill="none" stroke="#555" stroke-width="0.5" opacity="0.3"/>
                                    <circle cx="50" cy="50" r="8" fill="#1a1a1a" stroke="#666" stroke-width="1"/>
                                    <circle cx="50" cy="50" r="3" fill="#333"/>
                                </svg>
                            </div>
                            <div class="genre-badge" id="genre-badge"></div>
                        </div>
                        
                        <div class="track-info-container">
                            <div class="track-title" id="track-title">Click Play to Start</div>
                            <div class="track-artist" id="track-artist">Music Radio</div>
                        </div>
                        
                        <div class="playback-controls">
                            <button class="control-btn skip-btn" id="prev-btn" title="Previous" disabled>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6v12M14 12l-8 6V6l8 6z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="control-btn play-btn" id="play-btn" title="Play">
                                <svg class="play-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5v14l11-7z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                                </svg>
                                <svg class="pause-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none;">
                                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/>
                                </svg>
                            </button>
                            <button class="control-btn skip-btn" id="next-btn" title="Skip">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6v12M10 12l8 6V6l8-6z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                            <div class="progress-time">
                                <span id="current-time">0:00</span>
                                <span id="duration">0:30</span>
                            </div>
                        </div>
                        
                        <div class="reaction-controls">
                            <button class="reaction-btn dislike-btn" id="dislike-btn" title="Dislike">
                                <svg class="gem-icon thumbs-down" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="dislike-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#ee5a6f;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#c92a2a;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                    <!-- Gem facets -->
                                    <polygon points="50,10 30,40 20,70 50,110 80,70 70,40" fill="url(#dislike-gradient)" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
                                    <polygon points="50,10 30,40 50,50" fill="rgba(255,255,255,0.4)"/>
                                    <polygon points="50,10 70,40 50,50" fill="rgba(255,255,255,0.2)"/>
                                    <polygon points="30,40 20,70 50,50" fill="rgba(0,0,0,0.1)"/>
                                    <polygon points="70,40 80,70 50,50" fill="rgba(0,0,0,0.2)"/>
                                    <!-- Thumbs down shape -->
                                    <path d="M 45,45 L 40,45 L 40,60 L 45,60 L 48,75 L 52,75 L 55,60 L 60,60 L 60,45 L 55,45 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
                                </svg>
                                <span class="reaction-label">Dislike</span>
                            </button>
                            <button class="reaction-btn repeat-btn" id="repeat-btn" title="Repeat" style="display: none;">
                                <svg class="gem-icon repeat" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="repeat-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style="stop-color:#748ffc;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#5c7cfa;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#364fc7;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                    <!-- Gem facets -->
                                    <polygon points="50,10 30,40 20,70 50,110 80,70 70,40" fill="url(#repeat-gradient)" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
                                    <polygon points="50,10 30,40 50,50" fill="rgba(255,255,255,0.4)"/>
                                    <polygon points="50,10 70,40 50,50" fill="rgba(255,255,255,0.2)"/>
                                    <polygon points="30,40 20,70 50,50" fill="rgba(0,0,0,0.1)"/>
                                    <polygon points="70,40 80,70 50,50" fill="rgba(0,0,0,0.2)"/>
                                    <!-- Repeat arrows -->
                                    <path d="M 40,50 A 8,8 0 1,1 60,50" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-linecap="round"/>
                                    <polygon points="38,48 35,52 41,52" fill="rgba(255,255,255,0.9)"/>
                                    <path d="M 60,55 A 8,8 0 1,1 40,55" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-linecap="round"/>
                                    <polygon points="62,57 65,53 59,53" fill="rgba(255,255,255,0.9)"/>
                                </svg>
                                <span class="reaction-label">Repeat</span>
                            </button>
                            <button class="reaction-btn like-btn" id="like-btn" title="Like">
                                <svg class="gem-icon thumbs-up" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="like-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style="stop-color:#51cf66;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#37b24d;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#2b8a3e;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                    <!-- Gem facets -->
                                    <polygon points="50,10 30,40 20,70 50,110 80,70 70,40" fill="url(#like-gradient)" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
                                    <polygon points="50,10 30,40 50,50" fill="rgba(255,255,255,0.4)"/>
                                    <polygon points="50,10 70,40 50,50" fill="rgba(255,255,255,0.2)"/>
                                    <polygon points="30,40 20,70 50,50" fill="rgba(0,0,0,0.1)"/>
                                    <polygon points="70,40 80,70 50,50" fill="rgba(0,0,0,0.2)"/>
                                    <!-- Thumbs up shape -->
                                    <path d="M 45,60 L 40,60 L 40,45 L 45,45 L 48,30 L 52,30 L 55,45 L 60,45 L 60,60 L 55,60 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
                                </svg>
                                <span class="reaction-label">Like</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="queue-section">
                        <h3>Coming Up</h3>
                        <div class="queue-list" id="queue-list">
                            <!-- Queue items populated by JS -->
                        </div>
                    </div>
                    
                    <div class="liked-section">
                        <h3>Your Likes (<span id="liked-count">0</span>)</h3>
                        <div class="liked-list" id="liked-list">
                            <p class="empty-message">Like songs to save them here</p>
                        </div>
                    </div>
                </div>
                
                ${this.getStyles()}
            </div>
        `;
        
        this.attachEventListeners();
        this.updateQueue();
        this.updateLikedList();
    }
    
    getStyles() {
        return `
            <style>
                .music-radio {
                    padding: 20px;
                    font-family: 'JetBrains Mono', monospace;
                    max-width: 900px;
                    margin: 0 auto;
                }
                
                .radio-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .radio-header h2 {
                    font-size: 36px;
                    margin-bottom: 8px;
                }
                
                .radio-subtitle {
                    font-size: 14px;
                    opacity: 0.6;
                }
                
                .radio-player {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }
                
                .now-playing-card {
                    background: linear-gradient(135deg, var(--color-secondary, rgba(99, 102, 241, 0.1)), var(--color-layer, rgba(168, 85, 247, 0.1)));
                    border: 3px solid currentColor;
                    border-radius: 20px;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    align-items: center;
                }
                
                .track-artwork-container {
                    position: relative;
                    width: 250px;
                    height: 250px;
                }
                
                .artwork-placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, var(--color-secondary, #667eea) 0%, var(--color-layer, #764ba2) 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 100px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    transition: transform 0.3s ease;
                    overflow: hidden;
                }
                
                .artwork-placeholder.playing {
                    animation: vinyl-spin 3s linear infinite;
                }
                
                @keyframes vinyl-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .artwork-placeholder img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 20px;
                }
                
                .vinyl-icon {
                    width: 120px;
                    height: 120px;
                    opacity: 0.8;
                }
                
                .genre-badge {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: var(--color-accent, #667eea);
                    color: var(--color-primary, white);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }
                
                .track-info-container {
                    text-align: center;
                    width: 100%;
                }
                
                .track-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                
                .track-artist {
                    font-size: 20px;
                    opacity: 0.7;
                }
                
                .playback-controls {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }
                
                .control-btn {
                    width: 70px;
                    height: 70px;
                    border: 3px solid currentColor;
                    background: transparent;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    color: currentColor;
                    position: relative;
                }
                
                .control-btn svg {
                    width: 28px;
                    height: 28px;
                }
                
                .control-btn:hover:not(:disabled) {
                    background: currentColor;
                    color: var(--color-primary, white);
                    transform: scale(1.1);
                }
                
                .control-btn:active:not(:disabled) {
                    transform: scale(0.95);
                }
                
                .control-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                
                .play-btn {
                    width: 90px;
                    height: 90px;
                    border-width: 4px;
                }
                
                .play-btn svg {
                    width: 36px;
                    height: 36px;
                }
                
                .play-btn.loading {
                    animation: pulse-btn 1.5s ease-in-out infinite;
                }
                
                @keyframes pulse-btn {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(0.95); }
                }
                
                .skip-btn {
                    width: 60px;
                    height: 60px;
                    font-size: 24px;
                }
                
                .progress-bar {
                    width: 100%;
                    position: relative;
                }
                
                .progress-fill {
                    height: 8px;
                    background: currentColor;
                    border-radius: 4px;
                    width: 0%;
                    transition: width 0.1s linear;
                }
                
                .progress-time {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 8px;
                    font-size: 12px;
                    opacity: 0.6;
                }
                
                .reaction-controls {
                    display: flex;
                    gap: 12px;
                    width: 100%;
                    justify-content: center;
                }
                
                .reaction-btn {
                    flex: 1;
                    max-width: 150px;
                    padding: 16px 20px;
                    border: 2px solid currentColor;
                    background: transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    color: currentColor;
                    position: relative;
                }
                
                .gem-icon {
                    width: 70px;
                    height: 84px;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
                    transition: all 0.3s ease;
                }
                
                .reaction-btn:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }
                
                .reaction-btn:hover .gem-icon {
                    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4)) brightness(1.15);
                    transform: scale(1.1) rotate(5deg);
                }
                
                .reaction-btn:active {
                    transform: translateY(-2px);
                }
                
                .reaction-btn:active .gem-icon {
                    transform: scale(1.05) rotate(0deg);
                }
                
                .reaction-btn.active {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: currentColor;
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
                }
                
                .reaction-btn.active .gem-icon {
                    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5)) brightness(1.3);
                    transform: scale(1.15);
                    animation: gem-pulse 1.5s ease-in-out infinite;
                }
                
                @keyframes gem-pulse {
                    0%, 100% { filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5)) brightness(1.3); }
                    50% { filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6)) brightness(1.5); }
                }
                
                .like-btn.active {
                    border-color: #51cf66;
                }
                
                .dislike-btn.active {
                    border-color: #ff6b6b;
                }
                
                .repeat-btn.active {
                    border-color: #748ffc;
                }
                
                .reaction-label {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .queue-section, .liked-section {
                    border: 2px solid currentColor;
                    border-radius: 12px;
                    padding: 20px;
                }
                
                .queue-section h3, .liked-section h3 {
                    font-size: 18px;
                    margin-bottom: 16px;
                    opacity: 0.8;
                }
                
                .queue-list, .liked-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .queue-item, .liked-item {
                    padding: 12px;
                    border: 1px solid rgba(128, 128, 128, 0.3);
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s ease;
                }
                
                .queue-item:hover, .liked-item:hover {
                    background: rgba(128, 128, 128, 0.1);
                }
                
                .queue-item-info, .liked-item-info {
                    flex: 1;
                }
                
                .queue-item-title, .liked-item-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .queue-item-artist, .liked-item-artist {
                    font-size: 12px;
                    opacity: 0.6;
                }
                
                .queue-item-genre {
                    font-size: 10px;
                    padding: 4px 8px;
                    background: rgba(128, 128, 128, 0.2);
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                
                .empty-message {
                    text-align: center;
                    opacity: 0.5;
                    font-size: 12px;
                    padding: 20px;
                }
                
                .liked-item-remove {
                    padding: 6px 12px;
                    border: 1px solid currentColor;
                    background: transparent;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 10px;
                    text-transform: uppercase;
                    transition: all 0.2s ease;
                    font-family: 'JetBrains Mono', monospace;
                    color: currentColor;
                }
                
                .liked-item-remove:hover {
                    background: var(--color-layer, #ef4444);
                    border-color: var(--color-layer, #ef4444);
                    color: var(--color-primary, white);
                }
                
                @media (max-width: 768px) {
                    .now-playing-card {
                        padding: 30px 20px;
                    }
                    
                    .track-artwork-container {
                        width: 200px;
                        height: 200px;
                    }
                    
                    .track-title {
                        font-size: 22px;
                    }
                    
                    .track-artist {
                        font-size: 16px;
                    }
                    
                    .reaction-controls {
                        flex-wrap: wrap;
                    }
                    
                    .reaction-btn {
                        max-width: 100%;
                    }
                }
            </style>
        `;
    }
    
    attachEventListeners() {
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('next-btn').addEventListener('click', () => this.skipTrack());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousTrack());
        document.getElementById('like-btn').addEventListener('click', () => this.likeTrack());
        document.getElementById('dislike-btn').addEventListener('click', () => this.dislikeTrack());
        document.getElementById('repeat-btn').addEventListener('click', () => this.repeatTrack());
    }
    
    async togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }
    
    async play() {
        if (this.isLoading) return;
        
        const playBtn = document.getElementById('play-btn');
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        
        if (!this.currentTrack) {
            // Load first track
            this.isLoading = true;
            playBtn.classList.add('loading');
            
            try {
                await this.loadTrack(this.currentTrackIndex);
            } catch (error) {
                console.error('Error loading track:', error);
                this.currentTrackIndex++;
                if (this.currentTrackIndex < this.playlist.length) {
                    await this.play();
                }
                return;
            }
            
            playBtn.classList.remove('loading');
        }
        
        if (this.currentAudio) {
            this.currentAudio.play();
            this.isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            document.getElementById('track-artwork').classList.add('playing');
            this.startProgressUpdate();
        }
    }
    
    pause() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.isPlaying = false;
            const playBtn = document.getElementById('play-btn');
            const playIcon = playBtn.querySelector('.play-icon');
            const pauseIcon = playBtn.querySelector('.pause-icon');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            document.getElementById('track-artwork').classList.remove('playing');
        }
    }
    
    async loadTrack(index) {
        if (index >= this.playlist.length) {
            // Reached end of playlist, shuffle and restart
            this.playlist = this.playlist.sort(() => Math.random() - 0.5);
            index = 0;
            this.currentTrackIndex = 0;
        }
        
        const track = this.playlist[index];
        this.currentTrack = track;
        
        // Update UI
        document.getElementById('track-title').textContent = track.title;
        document.getElementById('track-artist').textContent = track.artist;
        document.getElementById('genre-badge').textContent = track.genre;
        
        // Check if liked or disliked
        const isLiked = this.likedTracks.some(t => t.artist === track.artist && t.title === track.title);
        const isDisliked = this.dislikedTracks.some(t => t.artist === track.artist && t.title === track.title);
        
        document.getElementById('like-btn').classList.toggle('active', isLiked);
        document.getElementById('dislike-btn').classList.toggle('active', isDisliked);
        document.getElementById('repeat-btn').classList.remove('active');
        
        // Enable prev button if not first track
        document.getElementById('prev-btn').disabled = this.currentTrackIndex === 0;
        
        // Fetch preview from iTunes
        try {
            const searchQuery = encodeURIComponent(`${track.artist} ${track.title}`);
            const itunesUrl = `https://itunes.apple.com/search?term=${searchQuery}&media=music&entity=song&limit=5`;
            
            // Try direct iTunes API first
            let response = await fetch(itunesUrl);
            let data;
            
            // If direct call fails, try with CORS proxy
            if (!response.ok) {
                console.log('Direct iTunes API failed, trying CORS proxy...');
                response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(itunesUrl)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const proxyData = await response.json();
                data = JSON.parse(proxyData.contents);
            } else {
                data = await response.json();
            }
            
            if (data.results && data.results.length > 0) {
                const result = data.results.find(r => r.previewUrl) || data.results[0];
                
                if (result.previewUrl) {
                    // Update artwork if available
                    if (result.artworkUrl100) {
                        const artworkUrl = result.artworkUrl100.replace('100x100', '300x300');
                        document.getElementById('track-artwork').innerHTML = `<img src="${artworkUrl}" alt="${track.title}">`;
                    }
                    
                    // Create audio element
                    if (this.currentAudio) {
                        this.currentAudio.pause();
                        this.currentAudio = null;
                    }
                    
                    this.currentAudio = new Audio(result.previewUrl);
                    this.currentAudio.volume = 0.7;
                    
                    // When track ends, play next
                    this.currentAudio.addEventListener('ended', () => {
                        this.skipTrack();
                    });
                    
                    this.isLoading = false;
                    this.updateQueue();
                    
                } else {
                    throw new Error('No preview URL available for this track');
                }
            } else {
                throw new Error('No results found from iTunes');
            }
        } catch (error) {
            console.error('Error loading track:', error);
            // Show error to user
            document.getElementById('track-artwork').innerHTML = `
                <div style="padding: 20px; text-align: center; color: var(--color-layer, #ff6b6b);">
                    <p>Unable to load preview</p>
                    <p style="font-size: 12px; margin-top: 10px;">Skipping to next track...</p>
                </div>
            `;
            // Auto-skip after 2 seconds
            setTimeout(() => this.skipTrack(), 2000);
            throw error;
        }
    }
    
    async skipTrack() {
        this.currentTrackIndex++;
        this.pause();
        this.currentTrack = null;
        this.currentAudio = null;
        document.getElementById('progress-fill').style.width = '0%';
        document.getElementById('current-time').textContent = '0:00';
        document.getElementById('track-artwork').innerHTML = '<span class="vinyl-icon">💿</span>';
        document.getElementById('track-artwork').classList.remove('playing');
        await this.play();
    }
    
    async previousTrack() {
        if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
            this.pause();
            this.currentTrack = null;
            this.currentAudio = null;
            document.getElementById('progress-fill').style.width = '0%';
            document.getElementById('current-time').textContent = '0:00';
            document.getElementById('track-artwork').innerHTML = '<span class="vinyl-icon">💿</span>';
            document.getElementById('track-artwork').classList.remove('playing');
            await this.play();
        }
    }
    
    async repeatTrack() {
        const repeatBtn = document.getElementById('repeat-btn');
        repeatBtn.classList.toggle('active');
        
        if (this.currentAudio) {
            this.currentAudio.currentTime = 0;
            if (!this.isPlaying) {
                await this.play();
            }
        }
    }
    
    likeTrack() {
        if (!this.currentTrack) return;
        
        const likeBtn = document.getElementById('like-btn');
        const isLiked = likeBtn.classList.contains('active');
        
        if (isLiked) {
            // Unlike
            this.likedTracks = this.likedTracks.filter(t => 
                !(t.artist === this.currentTrack.artist && t.title === this.currentTrack.title)
            );
            likeBtn.classList.remove('active');
        } else {
            // Like
            this.likedTracks.push({
                artist: this.currentTrack.artist,
                title: this.currentTrack.title,
                genre: this.currentTrack.genre
            });
            likeBtn.classList.add('active');
            
            // Remove from disliked if it was there
            this.dislikedTracks = this.dislikedTracks.filter(t => 
                !(t.artist === this.currentTrack.artist && t.title === this.currentTrack.title)
            );
            document.getElementById('dislike-btn').classList.remove('active');
        }
        
        this.saveLikedTracks();
        this.saveDislikedTracks();
        this.updateLikedList();
    }
    
    dislikeTrack() {
        if (!this.currentTrack) return;
        
        const dislikeBtn = document.getElementById('dislike-btn');
        const isDisliked = dislikeBtn.classList.contains('active');
        
        if (isDisliked) {
            // Un-dislike
            this.dislikedTracks = this.dislikedTracks.filter(t => 
                !(t.artist === this.currentTrack.artist && t.title === this.currentTrack.title)
            );
            dislikeBtn.classList.remove('active');
        } else {
            // Dislike
            this.dislikedTracks.push({
                artist: this.currentTrack.artist,
                title: this.currentTrack.title,
                genre: this.currentTrack.genre
            });
            dislikeBtn.classList.add('active');
            
            // Remove from liked if it was there
            this.likedTracks = this.likedTracks.filter(t => 
                !(t.artist === this.currentTrack.artist && t.title === this.currentTrack.title)
            );
            document.getElementById('like-btn').classList.remove('active');
            
            // Auto-skip after disliking
            setTimeout(() => this.skipTrack(), 500);
        }
        
        this.saveLikedTracks();
        this.saveDislikedTracks();
        this.updateLikedList();
    }
    
    startProgressUpdate() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.progressInterval = setInterval(() => {
            if (this.currentAudio && this.isPlaying) {
                const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
                document.getElementById('progress-fill').style.width = `${progress}%`;
                
                const currentMinutes = Math.floor(this.currentAudio.currentTime / 60);
                const currentSeconds = Math.floor(this.currentAudio.currentTime % 60);
                document.getElementById('current-time').textContent = 
                    `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
            }
        }, 100);
    }
    
    updateQueue() {
        const queueList = document.getElementById('queue-list');
        const nextTracks = this.playlist.slice(this.currentTrackIndex + 1, this.currentTrackIndex + 6);
        
        if (nextTracks.length === 0) {
            queueList.innerHTML = '<p class="empty-message">End of queue</p>';
            return;
        }
        
        queueList.innerHTML = nextTracks.map(track => `
            <div class="queue-item">
                <div class="queue-item-info">
                    <div class="queue-item-title">${track.title}</div>
                    <div class="queue-item-artist">${track.artist}</div>
                </div>
                <div class="queue-item-genre">${track.genre}</div>
            </div>
        `).join('');
    }
    
    updateLikedList() {
        const likedList = document.getElementById('liked-list');
        const likedCount = document.getElementById('liked-count');
        
        likedCount.textContent = this.likedTracks.length;
        
        if (this.likedTracks.length === 0) {
            likedList.innerHTML = '<p class="empty-message">Like songs to save them here</p>';
            return;
        }
        
        likedList.innerHTML = this.likedTracks.map((track, index) => `
            <div class="liked-item">
                <div class="liked-item-info">
                    <div class="liked-item-title">${track.title}</div>
                    <div class="liked-item-artist">${track.artist} • ${track.genre}</div>
                </div>
                <button class="liked-item-remove" onclick="window.musicRadio.removeLiked(${index})">Remove</button>
            </div>
        `).join('');
    }
    
    removeLiked(index) {
        this.likedTracks.splice(index, 1);
        this.saveLikedTracks();
        this.updateLikedList();
        
        // Update button state if it's the current track
        if (this.currentTrack) {
            const isLiked = this.likedTracks.some(t => 
                t.artist === this.currentTrack.artist && t.title === this.currentTrack.title
            );
            document.getElementById('like-btn').classList.toggle('active', isLiked);
        }
    }
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.MusicRadio = MusicRadio;
}
