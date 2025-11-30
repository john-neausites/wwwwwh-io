class PlaylistSelector {
    constructor(container) {
        this.container = container;
        this.selectedMood = null;
        this.selectedCompany = null;
        this.selectedActivity = null;
        this.selectedLength = '10-songs'; // Default: 10 songs
        
        // Define the playlist database
        this.playlists = this.generatePlaylists();
        
        // Preview playback state
        this.isPreviewPlaying = false;
        this.currentAudio = null;
        this.currentTrackIndex = 0;
        this.previewTracks = [];
        this.fadeInProgress = false;
        
        // Quick preview state (for card grid)
        this.quickPreviewAudios = {};
        this.currentQuickPreview = null;
        
        // Loading states
        this.expandingPlaylists = new Set();
        this.prefetchedPlaylists = new Set();
        
        // Rate limiting
        this.lastRequestTime = 0;
        this.minRequestDelay = 800; // 800ms between requests to avoid overwhelming proxy
        this.rateLimitRetries = 3;
        
        // Dev mode - use pre-made playlists
        this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.devPlaylists = [
            { name: 'Group Workout Energy', file: 'group-workout-energy-playlist.zip', mood: 'energetic', company: 'friends', activity: 'exercise' },
            { name: 'Focused Calm', file: 'focused-calm-playlist.zip', mood: 'calm', company: 'alone', activity: 'work' },
            { name: 'Romantic Dinner', file: 'romantic-dinner-playlist.zip', mood: 'romantic', company: 'partner', activity: 'dinner' },
            { name: 'Study Session', file: 'study-session-playlist.zip', mood: 'focused', company: 'alone', activity: 'work' },
            { name: 'Couples Workout', file: 'couples-workout-playlist.zip', mood: 'energetic', company: 'partner', activity: 'exercise' },
            { name: 'Deep Work', file: 'deep-work-playlist.zip', mood: 'focused', company: 'alone', activity: 'work' },
            { name: 'Reflective Solitude', file: 'reflective-solitude-playlist.zip', mood: 'melancholic', company: 'alone', activity: 'relax' }
        ];
    }

    generatePlaylists() {
        // Comprehensive playlist combinations
        const database = {
            // Format: "mood-company-activity": { title, songs }
            
            // ENERGETIC playlists
            "energetic-alone-exercise": {
                title: "Solo Power Workout",
                songs: [
                    { artist: "The Prodigy", title: "Firestarter" },
                    { artist: "Chemical Brothers", title: "Block Rockin' Beats" },
                    { artist: "Justice", title: "Genesis" },
                    { artist: "Daft Punk", title: "Harder Better Faster Stronger" },
                    { artist: "Pendulum", title: "Propane Nightmares" },
                    { artist: "MSTRKRFT", title: "Bounce" },
                    { artist: "Deadmau5", title: "Ghosts 'n' Stuff" },
                    { artist: "Boys Noize", title: "& Down" },
                    { artist: "Gesaffelstein", title: "Pursuit" },
                    { artist: "SebastiAn", title: "Embody" }
                ]
            },
            "energetic-alone-work": {
                title: "High-Energy Focus",
                songs: [
                    { artist: "Kavinsky", title: "Nightcall" },
                    { artist: "Carpenter Brut", title: "Turbo Killer" },
                    { artist: "Perturbator", title: "Future Club" },
                    { artist: "Com Truise", title: "Brokendate" },
                    { artist: "GUNSHIP", title: "Tech Noir" },
                    { artist: "Lazerhawk", title: "Overdrive" },
                    { artist: "Dance With the Dead", title: "Riot" },
                    { artist: "Miami Nights 1984", title: "Accelerated" },
                    { artist: "Mitch Murder", title: "The Touch" },
                    { artist: "Power Glove", title: "Streets of 2043" }
                ]
            },
            "energetic-alone-create": {
                title: "Creative Burst",
                songs: [
                    { artist: "Flying Lotus", title: "Do the Astral Plane" },
                    { artist: "Aphex Twin", title: "Windowlicker" },
                    { artist: "Squarepusher", title: "Come On My Selector" },
                    { artist: "Amon Tobin", title: "Easy Muffin" },
                    { artist: "Autechre", title: "Pen Expers" },
                    { artist: "Clark", title: "Herr Barr" },
                    { artist: "Plaid", title: "Zeal" },
                    { artist: "Venetian Snares", title: "Szamár Madár" },
                    { artist: "µ-Ziq", title: "Hasty Boom Alert" },
                    { artist: "Boards of Canada", title: "1969" }
                ]
            },
            "energetic-friends-exercise": {
                title: "Group Workout Energy",
                songs: [
                    { artist: "LMFAO", title: "Party Rock Anthem" },
                    { artist: "Flo Rida", title: "Club Can't Handle Me" },
                    { artist: "Pitbull", title: "Give Me Everything" },
                    { artist: "David Guetta", title: "Titanium" },
                    { artist: "Calvin Harris", title: "Feel So Close" },
                    { artist: "Avicii", title: "Levels" },
                    { artist: "Swedish House Mafia", title: "Don't You Worry Child" },
                    { artist: "Martin Garrix", title: "Animals" },
                    { artist: "Zedd", title: "Clarity" },
                    { artist: "Hardwell", title: "Spaceman" }
                ]
            },
            "energetic-friends-party": {
                title: "High Energy Party",
                songs: [
                    { artist: "Mark Ronson", title: "Uptown Funk" },
                    { artist: "Dua Lipa", title: "Levitating" },
                    { artist: "Bruno Mars", title: "24K Magic" },
                    { artist: "The Weeknd", title: "Blinding Lights" },
                    { artist: "Doja Cat", title: "Say So" },
                    { artist: "Lizzo", title: "Good as Hell" },
                    { artist: "Cardi B", title: "I Like It" },
                    { artist: "Megan Thee Stallion", title: "Savage" },
                    { artist: "Post Malone", title: "Circles" },
                    { artist: "Harry Styles", title: "As It Was" }
                ]
            },
            "energetic-partner-exercise": {
                title: "Couples Workout",
                songs: [
                    { artist: "Macklemore", title: "Can't Hold Us" },
                    { artist: "Imagine Dragons", title: "Radioactive" },
                    { artist: "Twenty One Pilots", title: "Stressed Out" },
                    { artist: "Fall Out Boy", title: "Centuries" },
                    { artist: "Panic! at the Disco", title: "High Hopes" },
                    { artist: "OneRepublic", title: "Counting Stars" },
                    { artist: "AJR", title: "Bang!" },
                    { artist: "Walk the Moon", title: "Shut Up and Dance" },
                    { artist: "Bastille", title: "Pompeii" },
                    { artist: "Foster the People", title: "Pumped Up Kicks" }
                ]
            },

            // CALM playlists
            "calm-alone-relax": {
                title: "Solo Meditation",
                songs: [
                    { artist: "Brian Eno", title: "Music for Airports" },
                    { artist: "Max Richter", title: "On the Nature of Daylight" },
                    { artist: "Nils Frahm", title: "Says" },
                    { artist: "Ólafur Arnalds", title: "Near Light" },
                    { artist: "Ryuichi Sakamoto", title: "Merry Christmas Mr. Lawrence" },
                    { artist: "Stars of the Lid", title: "Requiem for Dying Mothers" },
                    { artist: "Hammock", title: "Breathturn" },
                    { artist: "William Basinski", title: "dlp 1.1" },
                    { artist: "Tim Hecker", title: "Harmony in Ultraviolet" },
                    { artist: "Grouper", title: "Heavy Water" }
                ]
            },
            "calm-alone-work": {
                title: "Focused Calm",
                songs: [
                    { artist: "Tycho", title: "A Walk" },
                    { artist: "Boards of Canada", title: "Roygbiv" },
                    { artist: "Bonobo", title: "Kiara" },
                    { artist: "Four Tet", title: "Two Thousand and Seventeen" },
                    { artist: "Jon Hopkins", title: "Emerald Rush" },
                    { artist: "Khruangbin", title: "Time (You and I)" },
                    { artist: "Emancipator", title: "Soon It Will Be Cold Enough" },
                    { artist: "Explosions in the Sky", title: "Your Hand in Mine" },
                    { artist: "God Is an Astronaut", title: "All Is Violent, All Is Bright" },
                    { artist: "Mogwai", title: "Take Me Somewhere Nice" }
                ]
            },
            "calm-alone-read": {
                title: "Reading Ambiance",
                songs: [
                    { artist: "Ludovico Einaudi", title: "Nuvole Bianche" },
                    { artist: "Yiruma", title: "River Flows in You" },
                    { artist: "Max Richter", title: "November" },
                    { artist: "Ólafur Arnalds", title: "Saman" },
                    { artist: "Nils Frahm", title: "Ambre" },
                    { artist: "Dustin O'Halloran", title: "Opus 23" },
                    { artist: "Peter Broderick", title: "And It's Alright" },
                    { artist: "Hauschka", title: "Ferndorf" },
                    { artist: "Balmorhea", title: "Constellations" },
                    { artist: "Rachel Grimes", title: "Book of Leaves" }
                ]
            },
            "calm-partner-relax": {
                title: "Couples Relaxation",
                songs: [
                    { artist: "Bon Iver", title: "Holocene" },
                    { artist: "Iron & Wine", title: "Naked As We Came" },
                    { artist: "Sufjan Stevens", title: "Chicago" },
                    { artist: "The National", title: "Bloodbuzz Ohio" },
                    { artist: "Fleet Foxes", title: "White Winter Hymnal" },
                    { artist: "Jose Gonzalez", title: "Heartbeats" },
                    { artist: "Ray LaMontagne", title: "Trouble" },
                    { artist: "Father John Misty", title: "I Love You, Honeybear" },
                    { artist: "The Tallest Man on Earth", title: "The Gardener" },
                    { artist: "Gregory Alan Isakov", title: "Amsterdam" }
                ]
            },
            "calm-partner-dinner": {
                title: "Romantic Dinner",
                songs: [
                    { artist: "Norah Jones", title: "Come Away With Me" },
                    { artist: "Diana Krall", title: "The Look of Love" },
                    { artist: "Melody Gardot", title: "Baby I'm a Fool" },
                    { artist: "Madeleine Peyroux", title: "Dance Me to the End of Love" },
                    { artist: "Stacey Kent", title: "Jardin d'Hiver" },
                    { artist: "Chet Baker", title: "My Funny Valentine" },
                    { artist: "Billie Holiday", title: "The Very Thought of You" },
                    { artist: "Ella Fitzgerald", title: "Cheek to Cheek" },
                    { artist: "Nina Simone", title: "I Put a Spell on You" },
                    { artist: "Peggy Lee", title: "Fever" }
                ]
            },

            // HAPPY playlists
            "happy-alone-relax": {
                title: "Solo Joy",
                songs: [
                    { artist: "Pharrell Williams", title: "Happy" },
                    { artist: "Katrina & The Waves", title: "Walking on Sunshine" },
                    { artist: "Bobby McFerrin", title: "Don't Worry Be Happy" },
                    { artist: "Bill Withers", title: "Lovely Day" },
                    { artist: "Earth Wind & Fire", title: "September" },
                    { artist: "Stevie Wonder", title: "Signed, Sealed, Delivered" },
                    { artist: "The Isley Brothers", title: "Shout" },
                    { artist: "KC and the Sunshine Band", title: "That's the Way (I Like It)" },
                    { artist: "James Brown", title: "I Got You (I Feel Good)" },
                    { artist: "Marvin Gaye", title: "Ain't No Mountain High Enough" }
                ]
            },
            "happy-friends-party": {
                title: "Friends Celebration",
                songs: [
                    { artist: "Outkast", title: "Hey Ya!" },
                    { artist: "Kool & The Gang", title: "Celebration" },
                    { artist: "KC and the Sunshine Band", title: "Get Down Tonight" },
                    { artist: "Chic", title: "Le Freak" },
                    { artist: "Sister Sledge", title: "We Are Family" },
                    { artist: "The Jacksons", title: "Blame It on the Boogie" },
                    { artist: "Wild Cherry", title: "Play That Funky Music" },
                    { artist: "Earth, Wind & Fire", title: "Boogie Wonderland" },
                    { artist: "Bee Gees", title: "Stayin' Alive" },
                    { artist: "Michael Jackson", title: "Don't Stop 'Til You Get Enough" }
                ]
            },
            "happy-friends-drive": {
                title: "Road Trip Vibes",
                songs: [
                    { artist: "Tom Petty", title: "Free Fallin'" },
                    { artist: "Journey", title: "Don't Stop Believin'" },
                    { artist: "Fleetwood Mac", title: "Dreams" },
                    { artist: "Eagles", title: "Take It Easy" },
                    { artist: "America", title: "A Horse with No Name" },
                    { artist: "Bruce Springsteen", title: "Born to Run" },
                    { artist: "Boston", title: "More Than a Feeling" },
                    { artist: "Steve Miller Band", title: "The Joker" },
                    { artist: "Lynyrd Skynyrd", title: "Sweet Home Alabama" },
                    { artist: "Creedence Clearwater Revival", title: "Fortunate Son" }
                ]
            },

            // MELANCHOLIC playlists
            "melancholic-alone-relax": {
                title: "Reflective Solitude",
                songs: [
                    { artist: "Radiohead", title: "Exit Music (For a Film)" },
                    { artist: "Sigur Rós", title: "Svefn-g-englar" },
                    { artist: "The National", title: "About Today" },
                    { artist: "Elliott Smith", title: "Angeles" },
                    { artist: "Mazzy Star", title: "Fade Into You" },
                    { artist: "Low", title: "Lullaby" },
                    { artist: "Slowdive", title: "Alison" },
                    { artist: "Portishead", title: "Roads" },
                    { artist: "The xx", title: "Intro" },
                    { artist: "James Blake", title: "Retrograde" }
                ]
            },
            "melancholic-alone-read": {
                title: "Contemplative Reading",
                songs: [
                    { artist: "Nick Drake", title: "Pink Moon" },
                    { artist: "Jeff Buckley", title: "Hallelujah" },
                    { artist: "Damien Rice", title: "The Blower's Daughter" },
                    { artist: "Jose Gonzalez", title: "Heartbeats" },
                    { artist: "Sufjan Stevens", title: "Death With Dignity" },
                    { artist: "Bon Iver", title: "Skinny Love" },
                    { artist: "Alexi Murdoch", title: "Orange Sky" },
                    { artist: "Iron & Wine", title: "Such Great Heights" },
                    { artist: "Antony and the Johnsons", title: "Hope There's Someone" },
                    { artist: "Andrew Bird", title: "Pulaski at Night" }
                ]
            },
            "melancholic-alone-drive": {
                title: "Late Night Drive",
                songs: [
                    { artist: "The Cure", title: "Pictures of You" },
                    { artist: "Depeche Mode", title: "Enjoy the Silence" },
                    { artist: "New Order", title: "Bizarre Love Triangle" },
                    { artist: "The Smiths", title: "There Is a Light That Never Goes Out" },
                    { artist: "Joy Division", title: "Love Will Tear Us Apart" },
                    { artist: "Echo & The Bunnymen", title: "The Killing Moon" },
                    { artist: "Cocteau Twins", title: "Heaven or Las Vegas" },
                    { artist: "Siouxsie and the Banshees", title: "Cities in Dust" },
                    { artist: "The Chameleons", title: "Second Skin" },
                    { artist: "Bauhaus", title: "Bela Lugosi's Dead" }
                ]
            },

            // FOCUSED playlists
            "focused-alone-work": {
                title: "Deep Work",
                songs: [
                    { artist: "Kiasmos", title: "Looped" },
                    { artist: "Rival Consoles", title: "Unfolding" },
                    { artist: "Jon Hopkins", title: "Open Eye Signal" },
                    { artist: "Moderat", title: "A New Error" },
                    { artist: "Apparat", title: "Goodbye" },
                    { artist: "Nils Frahm", title: "Re" },
                    { artist: "Ólafur Arnalds", title: "Ljósið" },
                    { artist: "Max Cooper", title: "Repetition" },
                    { artist: "Bonobo", title: "Cirrus" },
                    { artist: "Burial", title: "Archangel" }
                ]
            },
            "focused-alone-study": {
                title: "Study Session",
                songs: [
                    { artist: "Hammock", title: "Breathturn" },
                    { artist: "Helios", title: "Halving the Compass" },
                    { artist: "Eluvium", title: "Don't Get Any Closer" },
                    { artist: "Goldmund", title: "Threnody" },
                    { artist: "Library Tapes", title: "Feelings for Something Lost" },
                    { artist: "A Winged Victory for the Sullen", title: "Requiem for the Static King" },
                    { artist: "Deaf Center", title: "White Lake" },
                    { artist: "Celer", title: "Lightness and Irresponsibility" },
                    { artist: "Loscil", title: "Endless Falls" },
                    { artist: "36", title: "Lithea" }
                ]
            },
            "focused-alone-create": {
                title: "Creative Flow",
                songs: [
                    { artist: "Caribou", title: "Can't Do Without You" },
                    { artist: "Jamie xx", title: "Loud Places" },
                    { artist: "Nicolas Jaar", title: "Space Is Only Noise" },
                    { artist: "Floating Points", title: "Silhouettes" },
                    { artist: "Actress", title: "Hubble" },
                    { artist: "Four Tet", title: "Angel Echoes" },
                    { artist: "Bicep", title: "Glue" },
                    { artist: "Overmono", title: "Arla Fearn" },
                    { artist: "Koreless", title: "Joy Squad" },
                    { artist: "Mount Kimbie", title: "Made to Stray" }
                ]
            }
        };

        return database;
    }

    getKnownSoundCloudUrl(artist, title) {
        // Feature flag: SoundCloud integration disabled for now
        const ENABLE_SOUNDCLOUD = false;
        
        if (!ENABLE_SOUNDCLOUD) return null;
        
        // Hardcoded SoundCloud URLs for popular synthwave/electronic tracks
        const knownTracks = {
            'kavinsky-nightcall': 'https://soundcloud.com/kavinskylive/nightcall',
            'carpenter brut-turbo killer': 'https://soundcloud.com/carpenter_brut/turbo-killer',
            'perturbator-future club': 'https://soundcloud.com/perturbator/future-club',
            'gunship-tech noir': 'https://soundcloud.com/gunshipmusic/tech-noir',
            'lazerhawk-overdrive': 'https://soundcloud.com/lazerhawk/overdrive',
            'dance with the dead-riot': 'https://soundcloud.com/dance-with-the-dead/riot',
            'miami nights 1984-accelerated': 'https://soundcloud.com/rosso-corsa-records/miami-nights-1984-accelerated',
        };
        
        const key = `${artist.toLowerCase()}-${title.toLowerCase()}`;
        if (knownTracks[key]) {
            console.log(`✓ Using known SoundCloud URL: ${title} - ${artist}`);
            return {
                soundCloudUrl: knownTracks[key],
                source: 'soundcloud'
            };
        }
        return null;
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async rateLimitedFetch(url, timeout = 15000, retries = 0) {
        // Enforce minimum delay between requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestDelay) {
            await this.delay(this.minRequestDelay - timeSinceLastRequest);
        }
        this.lastRequestTime = Date.now();
        
        // Use CORS proxy for localhost development
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const fetchUrl = isDevelopment ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(fetchUrl, {
                signal: controller.signal,
                mode: 'cors',
                cache: 'default'
            });
            clearTimeout(id);
            
            // Handle rate limiting with exponential backoff
            if (response.status === 429 && retries < this.rateLimitRetries) {
                const backoffDelay = Math.pow(2, retries) * 2000; // 2s, 4s, 8s
                await this.delay(backoffDelay);
                return this.rateLimitedFetch(url, timeout, retries + 1);
            }
            
            // Handle proxy errors (530, 502, etc) with retry
            if ((response.status === 530 || response.status === 502 || response.status === 503) && retries < this.rateLimitRetries) {
                const backoffDelay = Math.pow(2, retries) * 1000;
                await this.delay(backoffDelay);
                return this.rateLimitedFetch(url, timeout, retries + 1);
            }
            
            return response;
        } catch (error) {
            clearTimeout(id);
            // Retry on network errors
            if (retries < this.rateLimitRetries && error.name !== 'AbortError') {
                const backoffDelay = Math.pow(2, retries) * 500;
                await this.delay(backoffDelay);
                return this.rateLimitedFetch(url, timeout, retries + 1);
            }
            throw error;
        }
    }
    
    async fetchWithTimeout(url, timeout = 15000) {
        return this.rateLimitedFetch(url, timeout, 0);
    }

    async searchItunesForPlaylist(songs) {
        const results = [];
        for (const song of songs) {
            let bestResult = null;
            
            // Check for known SoundCloud tracks first (feature flagged)
            const soundCloudResult = this.getKnownSoundCloudUrl(song.artist, song.title);
            if (soundCloudResult) {
                results.push({
                    ...song,
                    soundCloudUrl: soundCloudResult.soundCloudUrl,
                    source: 'soundcloud'
                });
                continue;
            }
            
            // Fallback to iTunes for mainstream artists
            try {
                // Search for artist's albums (entity=album works better with CSP)
                const query = encodeURIComponent(song.artist);
                const response = await this.fetchWithTimeout(`https://itunes.apple.com/search?term=${query}&media=music&entity=album&limit=10`);
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    // Try each album to find the song with preview
                    for (const album of data.results) {
                        if (album.collectionId) {
                            try {
                                // Use lookup API to get all tracks from this album
                                const lookupResponse = await this.fetchWithTimeout(`https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song&limit=200`);
                                const lookupData = await lookupResponse.json();
                                
                                if (lookupData.results && lookupData.results.length > 1) {
                                    const tracks = lookupData.results.slice(1); // Skip album info
                                    
                                    // Find matching track with preview
                                    const matchingTrack = tracks.find(t => 
                                        t.trackName && t.previewUrl && 
                                        (t.trackName.toLowerCase().includes(song.title.toLowerCase()) ||
                                         song.title.toLowerCase().includes(t.trackName.toLowerCase()))
                                    );
                                    
                                    if (matchingTrack) {
                                        bestResult = matchingTrack;
                                        break; // Found it, stop searching
                                    }
                                }
                            } catch (lookupError) {
                                // Silent fail for lookup errors to reduce console spam
                                if (lookupError.message && !lookupError.message.includes('429')) {
                                    // Only log non-rate-limit errors
                                }
                            }
                        }
                    }
                }
                
                if (bestResult) {
                    results.push({
                        ...song,
                        previewUrl: bestResult.previewUrl,
                        artwork: bestResult.artworkUrl100?.replace('100x100', '300x300'),
                        albumName: bestResult.collectionName,
                        iTunesUrl: bestResult.trackViewUrl,
                        source: 'itunes'
                    });
                } else {
                    // Silent fail for missing previews
                    results.push({ ...song, previewUrl: null, artwork: null, iTunesUrl: null });
                }
            } catch (error) {
                // Only log non-rate-limit errors to reduce console spam
                if (!error.message || !error.message.includes('429')) {
                    // Silent fail
                }
                results.push({ ...song, previewUrl: null, artwork: null, iTunesUrl: null });
            }
        }
        return results;
    }

    getPlaylistLength() {
        // Calculate how many songs based on selected length
        // Assuming average song length: 3.5 minutes
        if (this.selectedLength === '10-songs') return 10;
        if (this.selectedLength === '15-min') return Math.ceil(15 / 3.5); // ~4 songs
        if (this.selectedLength === '30-min') return Math.ceil(30 / 3.5); // ~9 songs
        if (this.selectedLength === '60-min') return Math.ceil(60 / 3.5); // ~17 songs (but we only have 10, so will loop)
        return 10;
    }

    async showPlaylist() {
        if (!this.selectedMood || !this.selectedCompany || !this.selectedActivity) {
            return;
        }

        const key = `${this.selectedMood}-${this.selectedCompany}-${this.selectedActivity}`;
        const playlist = this.playlists[key];

        if (!playlist) {
            this.container.querySelector('.playlist-display').innerHTML = `
                <div class="no-playlist">
                    <p>🎵 No playlist found for this combination.</p>
                    <p>Try a different selection!</p>
                </div>
            `;
            return;
        }

        this.container.querySelector('.playlist-display').innerHTML = `
            <div class="loading-playlist">
                <p>Loading ${playlist.title}...</p>
            </div>
        `;

        // Get desired length
        const desiredLength = this.getPlaylistLength();
        let selectedSongs = [...playlist.songs];
        
        // If user wants more songs than available, loop the playlist
        if (desiredLength > selectedSongs.length) {
            const timesToRepeat = Math.ceil(desiredLength / selectedSongs.length);
            selectedSongs = [];
            for (let i = 0; i < timesToRepeat; i++) {
                selectedSongs = selectedSongs.concat(playlist.songs);
            }
        }
        
        // Trim to exact length
        selectedSongs = selectedSongs.slice(0, desiredLength);

        const songs = await this.searchItunesForPlaylist(selectedSongs);

        // Calculate estimated total time
        const estimatedMinutes = Math.round(songs.length * 3.5);
        const lengthDisplay = this.selectedLength === '10-songs' 
            ? `${songs.length} songs (~${estimatedMinutes} min)`
            : this.selectedLength.replace('-', ' ').replace('min', 'minutes');

        // Store tracks for preview
        this.previewTracks = songs.filter(s => s.previewUrl);

        let html = `
            <div class="active-playlist">
                <div class="playlist-header-controls">
                    <div class="playlist-title-section">
                        <h3>${playlist.title}</h3>
                        <p class="playlist-meta">${this.selectedMood} • ${this.selectedCompany} • ${this.selectedActivity} • ${lengthDisplay}</p>
                    </div>
                    <button class="preview-playlist-btn" id="preview-playlist-btn">
                        ▶ Preview Playlist
                    </button>
                </div>
                <div class="playlist-tracks">
        `;

        for (const song of songs) {
            html += `
                <div class="track-item">
                    ${song.artwork ? `<img src="${song.artwork}" alt="${song.title}" class="track-artwork">` : '<div class="track-artwork-placeholder">🎵</div>'}
                    <div class="track-info">
                        <div class="track-title">${song.title}</div>
                        <div class="track-artist">${song.artist}</div>
                        ${song.albumName ? `<div class="track-album">${song.albumName}</div>` : ''}
                    </div>
                    <div class="track-actions">
                        ${song.source === 'soundcloud' && song.soundCloudUrl ? `
                            <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" 
                                src="https://w.soundcloud.com/player/?url=${encodeURIComponent(song.soundCloudUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false">
                            </iframe>
                        ` : song.previewUrl ? `
                            <audio controls preload="none">
                                <source src="${song.previewUrl}" type="audio/mp4">
                            </audio>
                        ` : song.iTunesUrl ? 
                            `<span class="no-preview">No preview available</span>` :
                            '<span class="no-preview">Not found</span>'}
                        ${song.soundCloudUrl ? `<a href="${song.soundCloudUrl}" target="_blank" rel="noopener" class="soundcloud-link">Listen on SoundCloud ↗</a>` : 
                          song.iTunesUrl ? `<a href="${song.iTunesUrl}" target="_blank" rel="noopener" class="itunes-link">Listen on iTunes ↗</a>` : ''}
                    </div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        this.container.querySelector('.playlist-display').innerHTML = html;
        
        // Attach preview button listener
        const previewBtn = this.container.querySelector('#preview-playlist-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.togglePreview());
        }
    }

    async render() {
        this.container.innerHTML = `
            <div class="playlist-selector">
                <div class="playlist-grid" id="playlist-grid">
                    <div class="loading-playlists">Loading playlists...</div>
                </div>
            </div>
        `;

        await this.loadAllPlaylists();
    }

    async loadAllPlaylists() {
        const gridContainer = this.container.querySelector('#playlist-grid');
        gridContainer.innerHTML = '<div class="loading-playlists">Loading playlists...</div>';

        // DEV MODE: Use pre-made playlists
        if (this.isDevelopment) {
            const playlistCards = this.devPlaylists.map(playlist => ({
                key: `${playlist.mood}-${playlist.company}-${playlist.activity}`,
                title: playlist.name,
                mood: playlist.mood,
                company: playlist.company,
                activity: playlist.activity,
                downloadUrl: `/playlists/${playlist.file}`,
                isDevMode: true,
                trackCount: 10,
                estimatedDuration: 35
            }));
            
            this.renderPlaylistCards(playlistCards);
            return;
        }

        // PRODUCTION MODE: Get 10 random playlist combinations
        const allKeys = Object.keys(this.playlists);
        const selectedKeys = this.getRandomPlaylists(allKeys, 10);
        
        const playlistCards = [];
        
        // First pass: load preview songs quickly
        for (const key of selectedKeys) {
            const playlist = this.playlists[key];
            const [mood, company, activity] = key.split('-');
            
            // Fetch iTunes data for first 3 songs as preview (for quick loading)
            const previewSongs = await this.searchItunesForPlaylist(playlist.songs.slice(0, 3));
            
            playlistCards.push({
                key,
                title: playlist.title,
                mood,
                company,
                activity,
                songs: playlist.songs,
                previewSongs,
                allTracks: null,
                trackCount: playlist.songs.length,
                estimatedDuration: Math.round(playlist.songs.length * 3.5)
            });
        }

        this.renderPlaylistCards(playlistCards);
        
        // Second pass: prefetch all tracks in background
        this.prefetchAllTracks(playlistCards);
    }
    
    async prefetchAllTracks(playlistCards) {
        // Prefetch all tracks in background for instant expansion
        // Process playlists one at a time to avoid rate limiting
        for (const playlist of playlistCards) {
            if (!this.prefetchedPlaylists.has(playlist.key)) {
                try {
                    const fullPlaylist = this.playlists[playlist.key];
                    
                    // Fetch remaining tracks (we already have first 3)
                    const remainingSongs = fullPlaylist.songs.slice(3);
                    const remainingTracks = await this.searchItunesForPlaylist(remainingSongs);
                    
                    // Combine preview songs with remaining tracks
                    const allTracks = [...playlist.previewSongs, ...remainingTracks];
                    
                    // Store in playlist object
                    fullPlaylist.allTracks = allTracks;
                    playlist.allTracks = allTracks;
                    
                    this.prefetchedPlaylists.add(playlist.key);
                    
                    // Add delay between playlists to avoid rate limiting
                    await this.delay(1000);
                } catch (error) {
                    // Silent fail to reduce console spam
                }
            }
        }
    }

    getRandomPlaylists(keys, count) {
        const shuffled = [...keys].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    renderOldSelector() {
        const moods = ['energetic', 'calm', 'happy', 'melancholic', 'focused'];
        const companies = ['alone', 'partner', 'friends', 'family'];
        const activities = ['work', 'exercise', 'relax', 'party', 'drive', 'study', 'create', 'dinner', 'read'];

        this.container.innerHTML = `
            <div class="playlist-selector">
                <div class="selector-header">
                    <h2>🎵 Curated Playlists</h2>
                    <p>Choose your mood, company, and activity</p>
                </div>

                <div class="selector-controls">
                    <div class="selector-group">
                        <label>Mood</label>
                        <div class="button-group" data-type="mood">
                            ${moods.map(m => `
                                <button class="selector-btn" data-value="${m}">
                                    ${m.charAt(0).toUpperCase() + m.slice(1)}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="selector-group">
                        <label>Company</label>
                        <div class="button-group" data-type="company">
                            ${companies.map(c => `
                                <button class="selector-btn" data-value="${c}">
                                    ${c.charAt(0).toUpperCase() + c.slice(1)}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="selector-group">
                        <label>Activity</label>
                        <div class="button-group" data-type="activity">
                            ${activities.map(a => `
                                <button class="selector-btn" data-value="${a}">
                                    ${a.charAt(0).toUpperCase() + a.slice(1)}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="selector-group">
                        <label>Length</label>
                        <div class="button-group" data-type="length">
                            <button class="selector-btn selected" data-value="10-songs">10 Songs</button>
                            <button class="selector-btn" data-value="15-min">15 Min</button>
                            <button class="selector-btn" data-value="30-min">30 Min</button>
                            <button class="selector-btn" data-value="60-min">60 Min</button>
                        </div>
                    </div>
                </div>

                <div class="playlist-display">
                    <div class="start-prompt">
                        <p>Select mood, company, activity, and length to generate your playlist</p>
                    </div>
                </div>

                <style>
                    .playlist-selector {
                        padding: 20px;
                        font-family: 'JetBrains Mono', monospace;
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .selector-header {
                        text-align: center;
                        margin-bottom: 40px;
                    }
                    .selector-header h2 {
                        font-size: 32px;
                        margin-bottom: 10px;
                    }
                    .selector-header p {
                        opacity: 0.7;
                        font-size: 14px;
                    }
                    .selector-controls {
                        display: flex;
                        flex-direction: column;
                        gap: 30px;
                        margin-bottom: 40px;
                    }
                    .selector-group label {
                        display: block;
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 10px;
                        opacity: 0.8;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .button-group {
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                    }
                    .selector-btn {
                        padding: 10px 20px;
                        border: 2px solid currentColor;
                        background: transparent;
                        color: currentColor;
                        font-family: 'JetBrains Mono', monospace;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .selector-btn:hover {
                        background: currentColor;
                        color: var(--color-primary, white);
                    }
                    .selector-btn.selected {
                        background: currentColor;
                        color: var(--color-primary, white);
                        font-weight: 600;
                    }
                    .playlist-display {
                        border: 2px solid currentColor;
                        padding: 30px;
                        min-height: 400px;
                    }
                    
                    /* Grid Layout */
                    .playlist-grid {
                        display: flex;
                        flex-direction: column;
                        gap: 1px;
                        background: currentColor;
                    }
                    .loading-playlists {
                        padding: 60px 20px;
                        text-align: center;
                        background: var(--color-primary);
                        opacity: 0.5;
                    }
                    
                    /* Playlist Card */
                    .playlist-card {
                        background: var(--color-primary);
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    
                    /* Dev Mode Card Styles */
                    .playlist-card.dev-mode {
                        border: 2px dashed currentColor;
                        opacity: 0.9;
                    }
                    .download-btn {
                        padding: 8px 16px;
                        border: 1px solid currentColor;
                        background: transparent;
                        color: currentColor;
                        font-family: 'JetBrains Mono', monospace;
                        font-size: 11px;
                        text-decoration: none;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        white-space: nowrap;
                    }
                    .download-btn:hover {
                        background: currentColor;
                        color: var(--color-primary);
                    }
                    .playlist-info {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        opacity: 0.7;
                    }
                    .info-item {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 11px;
                    }
                    .info-item .icon {
                        font-size: 14px;
                        width: 20px;
                        text-align: center;
                    }
                    .dev-badge {
                        padding: 6px 12px;
                        border: 1px solid currentColor;
                        background: rgba(128,128,128,0.1);
                        font-size: 9px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        text-align: center;
                        opacity: 0.5;
                    }
                    
                    /* Playlist Header */
                    .playlist-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 12px;
                    }
                    .playlist-title {
                        font-size: 14px;
                        font-weight: 500;
                        margin: 0;
                        flex: 1;
                    }
                    .save-btn {
                        width: 36px;
                        height: 36px;
                        border: 1px solid currentColor;
                        background: transparent;
                        color: currentColor;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                        transition: all 0.2s ease;
                    }
                    .save-btn:hover {
                        background: currentColor;
                        color: var(--color-primary);
                    }
                    
                    /* Track Grid */
                    .track-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 8px;
                    }
                    .track-card {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .track-card.playable {
                        cursor: pointer;
                    }
                    .track-artwork {
                        position: relative;
                        aspect-ratio: 1;
                        background: rgba(128,128,128,0.1);
                        overflow: hidden;
                        border: 1px solid currentColor;
                    }
                    .track-artwork img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    }
                    .artwork-placeholder {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32px;
                        opacity: 0.3;
                    }
                    .play-overlay {
                        position: absolute;
                        inset: 0;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        font-size: 24px;
                        color: white;
                    }
                    .track-card.playable:hover .play-overlay {
                        opacity: 1;
                    }
                    .track-card.playing .play-overlay {
                        opacity: 1;
                    }
                    .track-details {
                        min-height: 0;
                    }
                    .track-title {
                        font-size: 11px;
                        font-weight: 500;
                        margin-bottom: 3px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .track-artist {
                        font-size: 9px;
                        opacity: 0.5;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    
                    /* View All Button */
                    .view-all-btn {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid currentColor;
                        background: transparent;
                        color: currentColor;
                        font-family: 'JetBrains Mono', monospace;
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .view-all-btn:hover {
                        background: currentColor;
                        color: var(--color-primary);
                    }
                    
                    /* Expanded Tracks */
                    .expanded-tracks {
                        margin-top: 8px;
                    }
                    .loading-message {
                        padding: 30px 20px;
                        text-align: center;
                        opacity: 0.5;
                        font-size: 10px;
                        animation: pulse-loading 1.5s ease-in-out infinite;
                    }
                    @keyframes pulse-loading {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 0.6; }
                    }
                    .all-tracks {
                        display: flex;
                        flex-direction: column;
                        gap: 1px;
                        background: currentColor;
                    }
                    .track-row {
                        background: var(--color-primary);
                        padding: 8px;
                        display: grid;
                        grid-template-columns: 40px 1fr auto;
                        gap: 12px;
                        align-items: center;
                    }
                    .track-row.playable {
                        cursor: pointer;
                    }
                    .track-row.playable:hover {
                        background: rgba(255,255,255,0.02);
                    }
                    .track-artwork-small {
                        width: 40px;
                        height: 40px;
                        background: rgba(128,128,128,0.1);
                        overflow: hidden;
                        border: 1px solid currentColor;
                    }
                    .track-artwork-small img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    }
                    .artwork-placeholder-small {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                        opacity: 0.3;
                    }
                    .play-btn-small {
                        width: 32px;
                        height: 32px;
                        border: 1px solid currentColor;
                        background: transparent;
                        color: currentColor;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        transition: all 0.2s ease;
                    }
                    .play-btn-small:hover {
                        background: currentColor;
                        color: var(--color-primary);
                    }
                    .track-row.playing .play-btn-small {
                        background: currentColor;
                        color: var(--color-primary);
                    }
                    
                    /* Track Info Shared Styles */
                    .track-info {
                        min-width: 0;
                        flex: 1;
                    }
                    

                    
                    /* Expanded Section */
                    .playlist-expanded {
                        padding: 20px;
                        border-top: 2px solid currentColor;
                        background: rgba(128,128,128,0.05);
                    }
                    .expanded-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 12px;
                        border-bottom: 1px solid rgba(128,128,128,0.3);
                        flex-wrap: wrap;
                        gap: 12px;
                    }
                    .expanded-header h4 {
                        margin: 0;
                        font-size: 16px;
                    }
                    .expanded-actions {
                        display: flex;
                        gap: 8px;
                    }
                    .play-all-expanded-btn, .stop-all-btn {
                        padding: 8px 16px;
                        border: 2px solid currentColor;
                        background: currentColor;
                        color: var(--color-primary, white);
                        font-family: 'JetBrains Mono', monospace;
                        font-size: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .stop-all-btn {
                        background: transparent;
                        color: currentColor;
                    }
                    .stop-all-btn:hover {
                        background: #FF5722;
                        border-color: #FF5722;
                        color: white;
                    }
                    
                    /* Drum Pad Grid */
                    .drum-pad-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                        gap: 12px;
                    }
                    .drum-pad {
                        position: relative;
                        aspect-ratio: 1;
                        border: 2px solid currentColor;
                        background: rgba(128,128,128,0.1);
                        cursor: pointer;
                        transition: all 0.15s ease;
                        display: flex;
                        flex-direction: column;
                        padding: 12px;
                        user-select: none;
                    }
                    .drum-pad.active:hover {
                        background: rgba(128,128,128,0.2);
                        transform: scale(1.02);
                        border-color: var(--color-accent, #3B82F6);
                    }
                    .drum-pad.active:active {
                        transform: scale(0.98);
                        background: var(--color-accent, #3B82F6);
                        color: white;
                    }
                    .drum-pad.playing {
                        background: var(--color-accent, #3B82F6);
                        border-color: var(--color-accent, #3B82F6);
                        color: white;
                        animation: pulse 0.3s ease;
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .drum-pad.disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                        border-style: dashed;
                    }
                    .pad-number {
                        position: absolute;
                        top: 8px;
                        left: 8px;
                        font-size: 11px;
                        font-weight: 700;
                        opacity: 0.5;
                    }
                    .pad-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        padding: 0 8px;
                    }
                    .pad-title {
                        font-size: 13px;
                        font-weight: 600;
                        margin-bottom: 6px;
                        line-height: 1.2;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    .pad-artist {
                        font-size: 11px;
                        opacity: 0.7;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 100%;
                    }
                    .pad-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.7);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        pointer-events: none;
                    }
                    .drum-pad.active:hover .pad-overlay {
                        opacity: 1;
                    }
                    .drum-pad.playing .pad-overlay {
                        opacity: 0;
                    }
                    .pad-play-icon {
                        font-size: 32px;
                        color: white;
                    }
                    .pad-menu-btn {
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        width: 24px;
                        height: 24px;
                        border: 1px solid currentColor;
                        background: rgba(0,0,0,0.3);
                        color: currentColor;
                        font-size: 14px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: all 0.2s ease;
                        z-index: 10;
                    }
                    .drum-pad:hover .pad-menu-btn {
                        opacity: 1;
                    }
                    .pad-menu-btn:hover {
                        background: currentColor;
                        color: var(--color-primary, white);
                    }
                    
                    @media (max-width: 768px) {
                        .drum-pad-grid {
                            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                            gap: 10px;
                        }
                        .drum-pad {
                            padding: 10px;
                        }
                        .pad-title {
                            font-size: 12px;
                        }
                        .pad-artist {
                            font-size: 10px;
                        }
                    }
                    .loading-playlists, .expanded-loading {
                        text-align: center;
                        padding: 60px 20px;
                        opacity: 0.6;
                    }
                    
                    @media (max-width: 768px) {
                        .playlist-grid {
                            grid-template-columns: 1fr;
                            gap: 20px;
                        }
                        .track-row {
                            grid-template-columns: 30px 1fr auto;
                            gap: 8px;
                            font-size: 12px;
                        }
                    }
                    
                    .playlist-header-controls {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 20px;
                        gap: 20px;
                        flex-wrap: wrap;
                    }
                    .playlist-title-section {
                        flex: 1;
                    }
                    .preview-playlist-btn {
                        padding: 12px 24px;
                        border: 2px solid currentColor;
                        background: currentColor;
                        color: var(--color-primary, white);
                        font-family: 'JetBrains Mono', monospace;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        white-space: nowrap;
                    }
                    .preview-playlist-btn:hover {
                        opacity: 0.8;
                        transform: scale(1.02);
                    }
                    .preview-playlist-btn.playing {
                        background: transparent;
                        color: currentColor;
                    }
                    .start-prompt, .no-playlist, .loading-playlist {
                        text-align: center;
                        padding: 100px 20px;
                        opacity: 0.6;
                    }
                    .active-playlist h3 {
                        font-size: 24px;
                        margin-bottom: 5px;
                    }
                    .playlist-meta {
                        font-size: 12px;
                        opacity: 0.6;
                        margin-bottom: 30px;
                    }
                    .playlist-tracks {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    .track-item {
                        display: grid;
                        grid-template-columns: 80px 1fr auto;
                        gap: 15px;
                        align-items: center;
                        padding: 10px;
                        border: 1px solid rgba(128,128,128,0.3);
                    }
                    .track-artwork {
                        width: 80px;
                        height: 80px;
                        object-fit: cover;
                    }
                    .track-artwork-placeholder {
                        width: 80px;
                        height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32px;
                        opacity: 0.3;
                        border: 1px solid currentColor;
                    }
                    .track-info {
                        flex: 1;
                    }
                    .track-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 4px;
                    }
                    .track-artist {
                        font-size: 14px;
                        opacity: 0.7;
                        margin-bottom: 2px;
                    }
                    .track-album {
                        font-size: 12px;
                        opacity: 0.5;
                    }
                    .track-actions {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        align-items: flex-end;
                    }
                    .track-actions audio {
                        width: 250px;
                        height: 32px;
                    }
                    .itunes-link {
                        color: currentColor;
                        text-decoration: none;
                        font-size: 12px;
                        padding: 5px 10px;
                        border: 1px solid currentColor;
                        transition: all 0.2s ease;
                    }
                    .itunes-link:hover {
                        background: currentColor;
                        color: var(--color-primary, white);
                    }
                    .no-preview {
                        font-size: 11px;
                        opacity: 0.4;
                    }
                    @media (max-width: 768px) {
                        .track-item {
                            grid-template-columns: 1fr;
                            text-align: center;
                        }
                        .track-actions {
                            align-items: center;
                        }
                        .track-actions audio {
                            width: 100%;
                        }
                    }
                </style>
            </div>
        `;

        // Attach event listeners
        this.container.querySelectorAll('.selector-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.closest('.button-group').dataset.type;
                const value = e.target.dataset.value;

                // Update selection
                if (type === 'mood') this.selectedMood = value;
                if (type === 'company') this.selectedCompany = value;
                if (type === 'activity') this.selectedActivity = value;
                if (type === 'length') this.selectedLength = value;

                // Update UI
                e.target.closest('.button-group').querySelectorAll('.selector-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');

                // Show playlist if all selected (length is optional, has default)
                if (this.selectedMood && this.selectedCompany && this.selectedActivity) {
                    this.showPlaylist();
                }
            });
        });
    }

    renderPlaylistCards(playlists) {
        const gridContainer = this.container.querySelector('#playlist-grid');
        
        const cardsHtml = playlists.map((playlist, index) => {
            // DEV MODE: Show simplified cards with download links
            if (playlist.isDevMode) {
                return `
                    <div class="playlist-card dev-mode" data-key="${playlist.key}">
                        <div class="playlist-header">
                            <h3 class="playlist-title">${playlist.title}</h3>
                            <a href="${playlist.downloadUrl}" download class="download-btn" title="Download Playlist">
                                <span>💾 Download</span>
                            </a>
                        </div>
                        
                        <div class="playlist-info">
                            <div class="info-item">
                                <span class="icon">🎵</span>
                                <span>${playlist.trackCount} tracks</span>
                            </div>
                            <div class="info-item">
                                <span class="icon">⏱</span>
                                <span>~${playlist.estimatedDuration} min</span>
                            </div>
                            <div class="info-item">
                                <span class="icon">🎭</span>
                                <span>${playlist.mood}</span>
                            </div>
                        </div>
                        
                        <div class="dev-badge">Pre-Generated Playlist</div>
                    </div>
                `;
            }
            
            // PRODUCTION MODE: Show full cards with previews
            const tracks = playlist.previewSongs || [];
            
            return `
                <div class="playlist-card" data-key="${playlist.key}">
                    <div class="playlist-header">
                        <h3 class="playlist-title">${playlist.title}</h3>
                        <button class="save-btn" data-key="${playlist.key}" title="Save Playlist">
                            <span>💾</span>
                        </button>
                    </div>
                    
                    <div class="track-grid">
                        ${tracks.slice(0, 3).map((song, idx) => `
                            <div class="track-card ${song.previewUrl ? 'playable' : ''}" data-key="${playlist.key}" data-index="${idx}">
                                <div class="track-artwork">
                                    ${song.artwork ? 
                                        `<img src="${song.artwork.replace('100x100', '300x300')}" alt="">` :
                                        `<div class="artwork-placeholder">♪</div>`
                                    }
                                    ${song.previewUrl ? '<div class="play-overlay"><span>▶</span></div>' : ''}
                                </div>
                                <div class="track-details">
                                    <div class="track-title">${song.title}</div>
                                    <div class="track-artist">${song.artist}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button class="view-all-btn" data-key="${playlist.key}">
                        View All ${playlist.trackCount} Tracks
                    </button>
                    
                    <div class="expanded-tracks" id="expanded-${playlist.key}" style="display: none;">
                        <div class="loading-message">Loading...</div>
                    </div>
                </div>
            `;
        }).join('');

        gridContainer.innerHTML = cardsHtml;
        this.attachCardEventListeners();
    }

    getRandomColorPalette() {
        const palettes = [
            { primary: '#FF3366', secondary: '#00D9FF', accent: '#FFE600' },
            { primary: '#00FFC6', secondary: '#B066FF', accent: '#FF6B9D' },
            { primary: '#0066FF', secondary: '#FF0099', accent: '#00FFCC' },
            { primary: '#FF6B00', secondary: '#00D4FF', accent: '#B3FF00' },
            { primary: '#FF0066', secondary: '#00FF99', accent: '#6B66FF' },
            { primary: '#00CCFF', secondary: '#FF3399', accent: '#FFCC00' },
            { primary: '#9D00FF', secondary: '#00FFD4', accent: '#FF6600' },
            { primary: '#FF0080', secondary: '#00E5FF', accent: '#CCFF00' },
            { primary: '#0099FF', secondary: '#FF0066', accent: '#00FF88' },
            { primary: '#FF3D00', secondary: '#00D9A3', accent: '#8B5FFF' }
        ];
        return palettes[Math.floor(Math.random() * palettes.length)];
    }

    attachCardEventListeners() {
        // Track cards - play on click
        this.container.querySelectorAll('.track-card.playable').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = card.dataset.key;
                const idx = parseInt(card.dataset.index);
                this.playQuickPreview(key, idx, card);
            });
        });

        // View all buttons
        this.container.querySelectorAll('.view-all-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const key = btn.dataset.key;
                await this.togglePlaylistExpand(key);
            });
        });

        // Save buttons
        this.container.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const key = btn.dataset.key;
                await this.downloadPlaylist(key);
            });
        });
    }

    async togglePlaylistExpand(key) {
        // Prevent multiple clicks
        if (this.expandingPlaylists.has(key)) return;
        
        const card = this.container.querySelector(`.playlist-card[data-key="${key}"]`);
        const expandedSection = card.querySelector('.expanded-tracks');
        const btn = card.querySelector('.view-all-btn');
        
        if (expandedSection.style.display === 'none') {
            // Check if already expanded with content
            if (!expandedSection.querySelector('.expanded-loading')) {
                expandedSection.style.display = 'block';
                return;
            }
            
            // Mark as loading
            this.expandingPlaylists.add(key);
            disc.style.opacity = '0.5';
            
            try {
                const playlist = this.playlists[key];
                
                // Use prefetched data if available, otherwise load
                let allTracks = playlist.allTracks;
                if (!allTracks) {
                    expandedSection.innerHTML = '<div class="loading-message">Loading...</div>';
                    allTracks = await this.searchItunesForPlaylist(playlist.songs);
                    playlist.allTracks = allTracks;
                }
                
                expandedSection.style.display = 'block';
                btn.textContent = 'Hide Tracks';
                
                expandedSection.innerHTML = `
                    <div class="all-tracks">
                        ${allTracks.slice(0, 10).map((song, idx) => `
                            <div class="track-row ${song.previewUrl ? 'playable' : ''}" data-key="${key}" data-index="${idx}">
                                <div class="track-artwork-small">
                                    ${song.artwork ? 
                                        `<img src="${song.artwork.replace('100x100', '100x100')}" alt="">` :
                                        `<div class="artwork-placeholder-small">♪</div>`
                                    }
                                </div>
                                <div class="track-info">
                                    <div class="track-title">${song.title}</div>
                                    <div class="track-artist">${song.artist}</div>
                                </div>
                                ${song.previewUrl ? `
                                    <button class="play-btn-small">
                                        <span>▶</span>
                                    </button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                `;
                
                // Reattach listeners
                this.attachCardEventListeners();
            } catch (error) {
                console.error('Error expanding playlist:', error);
                expandedSection.innerHTML = '<div class="loading-message">Error loading tracks</div>';
            } finally {
                this.expandingPlaylists.delete(key);
            }
        } else {
            // Collapse
            expandedSection.style.display = 'none';
            btn.textContent = `View All ${this.playlists[key].songs.length} Tracks`;
        }
    }

    openPlaylistInItunes(key) {
        const playlist = this.playlists[key];
        if (!playlist || !playlist.previewSongs || playlist.previewSongs.length === 0) return;
        
        // Open first track in iTunes (user can browse from there)
        const firstTrack = playlist.previewSongs.find(song => song.iTunesUrl);
        if (firstTrack && firstTrack.iTunesUrl) {
            window.open(firstTrack.iTunesUrl, '_blank', 'noopener,noreferrer');
        } else {
            // Fallback: search iTunes for the playlist title
            const searchQuery = encodeURIComponent(playlist.title || playlist.songs[0].title);
            window.open(`https://music.apple.com/us/search?term=${searchQuery}`, '_blank', 'noopener,noreferrer');
        }
    }

    async remixPlaylist(key) {
        const card = this.container.querySelector(`.playlist-card[data-key="${key}"]`);
        if (!card) return;

        card.style.opacity = '0.5';
        
        try {
            const [mood, company, activity] = key.split('-');
            const playlist = this.playlists[key];
            
            // Shuffle songs
            const allSongs = [...playlist.songs];
            const shuffled = allSongs.sort(() => Math.random() - 0.5);
            playlist.songs = shuffled;
            
            // Reload preview data
            const previewSongs = await this.searchItunesForPlaylist(playlist.songs.slice(0, 3));
            playlist.previewSongs = previewSongs;
            
            // Change color palette
            const newPalette = this.getRandomColorPalette();
            
            const header = card.querySelector('.card-header');
            if (header) {
                header.style.background = `linear-gradient(135deg, ${newPalette.primary}, ${newPalette.secondary})`;
                card.style.setProperty('--card-primary', newPalette.primary);
                card.style.setProperty('--card-secondary', newPalette.secondary);
                card.style.setProperty('--card-accent', newPalette.accent);
            }
            
            // Update quick preview grid
            const quickGrid = card.querySelector('.quick-preview-grid');
            if (quickGrid && previewSongs.length > 0) {
                quickGrid.innerHTML = previewSongs.slice(0, 4).map((song, idx) => `
                    <div class="quick-preview-item ${song.previewUrl ? 'active' : 'disabled'}" 
                         data-key="${key}" 
                         data-quick-index="${idx}">
                        ${song.artwork ? 
                            `<img src="${song.artwork.replace('100x100', '300x300')}" alt="${song.title}" class="preview-artwork">` :
                            `<div class="preview-placeholder">♪</div>`
                        }
                        <div class="preview-overlay">
                            <div class="preview-play-btn">▶</div>
                            <div class="preview-info">
                                <div class="preview-title">${song.title}</div>
                                <div class="preview-artist">${song.artist}</div>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Reattach event listeners for quick preview
                this.attachCardEventListeners();
            }
            
            // Reset expanded state
            const expanded = card.querySelector('.playlist-expanded');
            if (expanded && expanded.style.display !== 'none') {
                expanded.style.display = 'none';
                const expandBtn = card.querySelector('.btn-expand .btn-text');
                if (expandBtn) expandBtn.textContent = 'Drum Pad';
            }
            
            // Clear audio
            if (this.drumPadAudios[key]) {
                this.drumPadAudios[key].forEach(audio => {
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                });
                delete this.drumPadAudios[key];
            }
            
            if (this.isPreviewPlaying && this.currentPreviewKey === key) {
                this.stopPreview();
            }
            
            card.style.opacity = '1';
            
        } catch (error) {
            console.error('Error remixing playlist:', error);
            card.style.opacity = '1';
        }
    }

    async toggleExpand(key, btn) {
        const expandedSection = this.container.querySelector(`#expanded-${key}`);
        const card = this.container.querySelector(`.playlist-card[data-key="${key}"]`);
        const btnText = btn.querySelector('.btn-text');
        
        if (expandedSection.style.display === 'none') {
            // Expand - load full track list
            if (btnText) btnText.textContent = 'Hide';
            expandedSection.style.display = 'block';
            
            // Load all tracks if not already loaded
            if (expandedSection.querySelector('.expanded-loading')) {
                const playlist = this.playlists[key];
                const allTracks = await this.searchItunesForPlaylist(playlist.songs);
                this.renderExpandedTracks(key, allTracks);
            }
            
            card.classList.add('expanded');
        } else {
            // Collapse
            if (btnText) btnText.textContent = 'Drum Pad';
            expandedSection.style.display = 'none';
            card.classList.remove('expanded');
        }
    }

    renderExpandedTracks(key, tracks) {
        const expandedSection = this.container.querySelector(`#expanded-${key}`);
        
        // Create drum pad grid
        const drumPadsHtml = tracks.map((track, index) => `
            <div class="drum-pad ${track.previewUrl ? 'active' : 'disabled'}" 
                 data-key="${key}" 
                 data-index="${index}"
                 ${track.previewUrl ? '' : 'title="No preview available"'}>
                <div class="pad-number">${index + 1}</div>
                <div class="pad-content">
                    <div class="pad-title">${track.title}</div>
                    <div class="pad-artist">${track.artist}</div>
                </div>
                <div class="pad-overlay">
                    <div class="pad-play-icon">▶</div>
                </div>
                ${track.iTunesUrl ? 
                    `<button class="pad-menu-btn" data-url="${track.iTunesUrl}" title="View on iTunes" onclick="event.stopPropagation(); window.open('${track.iTunesUrl}', '_blank')">⋯</button>` :
                    ''
                }
            </div>
        `).join('');

        expandedSection.innerHTML = `
            <div class="expanded-header">
                <h4>Interactive Drum Pad - Click to Play</h4>
                <div class="expanded-actions">
                    <button class="play-all-expanded-btn" data-key="${key}">▶ Play All</button>
                    <button class="stop-all-btn" data-key="${key}">⏹ Stop</button>
                </div>
            </div>
            <div class="drum-pad-grid">
                ${drumPadsHtml}
            </div>
        `;

        // Store tracks for playback
        this.expandedTracks = this.expandedTracks || {};
        this.expandedTracks[key] = tracks;

        // Initialize drum pad audio objects
        this.drumPadAudios = this.drumPadAudios || {};
        this.drumPadAudios[key] = tracks.map(track => {
            if (track.previewUrl) {
                const audio = new Audio(track.previewUrl);
                audio.preload = 'auto';
                return audio;
            }
            return null;
        });

        // Attach drum pad click handlers
        expandedSection.querySelectorAll('.drum-pad.active').forEach(pad => {
            pad.addEventListener('click', (e) => {
                if (e.target.classList.contains('pad-menu-btn')) return;
                const padKey = pad.dataset.key;
                const index = parseInt(pad.dataset.index);
                this.playDrumPad(padKey, index, pad);
            });
        });

        // Attach play all button
        expandedSection.querySelector('.play-all-expanded-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.previewPlaylist(key);
        });

        // Attach stop all button
        expandedSection.querySelector('.stop-all-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.stopAllDrumPads(key);
        });
    }

    playDrumPad(key, index, padElement) {
        const audioObjects = this.drumPadAudios?.[key];
        if (!audioObjects || !audioObjects[index]) return;

        const audio = audioObjects[index];
        
        // Reset and play from start (drum pad behavior)
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.error('Drum pad playback error:', err);
        });

        // Visual feedback
        padElement.classList.add('playing');
        
        // Remove playing class when audio ends or is interrupted
        const removePlayingClass = () => {
            padElement.classList.remove('playing');
            audio.removeEventListener('ended', removePlayingClass);
            audio.removeEventListener('pause', removePlayingClass);
        };
        
        audio.addEventListener('ended', removePlayingClass);
        audio.addEventListener('pause', removePlayingClass);

        // Track active pad
        this.activePads = this.activePads || {};
        this.activePads[key] = this.activePads[key] || [];
        if (!this.activePads[key].includes(index)) {
            this.activePads[key].push(index);
        }
    }

    stopAllDrumPads(key) {
        const audioObjects = this.drumPadAudios?.[key];
        if (!audioObjects) return;

        audioObjects.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        // Remove all playing classes
        this.container.querySelectorAll('.drum-pad.playing').forEach(pad => {
            pad.classList.remove('playing');
        });

        // Clear active pads
        if (this.activePads) {
            this.activePads[key] = [];
        }

        console.log('🛑 All drum pads stopped');
    }

    playQuickPreview(key, idx, trackElement) {
        const playlist = this.playlists[key];
        if (!playlist) return;
        
        // Try to get from allTracks first, fall back to previewSongs
        const tracks = playlist.allTracks || playlist.previewSongs || [];
        const song = tracks[idx];
        if (!song || !song.previewUrl) return;

        // Stop any previous quick preview
        if (this.currentQuickPreview) {
            this.currentQuickPreview.audio.pause();
            this.currentQuickPreview.audio.currentTime = 0;
            if (this.currentQuickPreview.element) {
                this.currentQuickPreview.element.classList.remove('playing');
            }
        }

        // Initialize audio if not exists
        const audioKey = `${key}-${idx}`;
        if (!this.quickPreviewAudios[audioKey]) {
            this.quickPreviewAudios[audioKey] = new Audio(song.previewUrl);
        }

        const audio = this.quickPreviewAudios[audioKey];
        
        // Play from start
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.error('Quick preview playback error:', err);
        });

        // Visual feedback
        trackElement.classList.add('playing');
        
        // Remove playing class when audio ends
        const removePlayingClass = () => {
            trackElement.classList.remove('playing');
            audio.removeEventListener('ended', removePlayingClass);
            audio.removeEventListener('pause', removePlayingClass);
            if (this.currentQuickPreview?.audio === audio) {
                this.currentQuickPreview = null;
            }
        };
        
        audio.addEventListener('ended', removePlayingClass);
        audio.addEventListener('pause', removePlayingClass);

        // Track current preview
        this.currentQuickPreview = { audio, element: trackElement };
    }

    playIndividualTrack(key, index) {
        const tracks = this.expandedTracks[key];
        if (!tracks || !tracks[index]) return;

        const track = tracks[index];
        if (!track.previewUrl) {
            alert('No preview available for this track');
            return;
        }

        // Stop any current playback
        this.stopPreview();

        console.log(`🎵 Playing: ${track.artist} - ${track.title}`);

        this.currentAudio = new Audio(track.previewUrl);
        this.currentAudio.play().catch(err => {
            console.error('Playback error:', err);
            alert('Failed to play track');
        });
    }

    async previewPlaylist(key) {
        const playlist = this.playlists[key];
        if (!playlist) return;

        // Get tracks (use expanded if available, otherwise load)
        let tracks = this.expandedTracks?.[key];
        if (!tracks) {
            tracks = await this.searchItunesForPlaylist(playlist.songs);
            this.expandedTracks = this.expandedTracks || {};
            this.expandedTracks[key] = tracks;
        }

        this.previewTracks = tracks.filter(t => t.previewUrl);
        
        if (this.previewTracks.length === 0) {
            alert('No preview tracks available for this playlist');
            return;
        }

        // Find the preview button and update it
        const previewBtn = this.container.querySelector(`.preview-btn[data-key="${key}"]`);
        if (this.isPreviewPlaying && this.currentPlaylistKey === key) {
            this.stopPreview();
            if (previewBtn) previewBtn.textContent = '▶ Preview';
        } else {
            this.stopPreview(); // Stop any other playlist
            this.currentPlaylistKey = key;
            this.isPreviewPlaying = true;
            this.currentTrackIndex = 0;
            if (previewBtn) previewBtn.textContent = '⏸ Stop';
            this.playPreviewTrack(0);
        }
    }

    async downloadPlaylist(key) {
        const playlist = this.playlists[key];
        if (!playlist) return;

        const [mood, company, activity] = key.split('-');
        
        // Get full track data with preview URLs
        let tracks = this.expandedTracks?.[key];
        if (!tracks) {
            // Show loading message
            this.showDownloadProgress('Loading track previews...');
            tracks = await this.searchItunesForPlaylist(playlist.songs);
            this.expandedTracks = this.expandedTracks || {};
            this.expandedTracks[key] = tracks;
        }
        
        // Create comprehensive playlist document
        const playlistDoc = {
            title: playlist.title,
            description: `A curated ${mood} playlist for ${company} during ${activity}`,
            mood: mood,
            company: company,
            activity: activity,
            trackCount: playlist.songs.length,
            estimatedDuration: `${Math.round(playlist.songs.length * 3.5)} minutes`,
            tracks: tracks.map((song, index) => ({
                position: index + 1,
                artist: song.artist,
                title: song.title,
                searchQuery: `${song.artist} ${song.title}`,
                previewUrl: song.previewUrl || null,
                iTunesUrl: song.iTunesUrl || null,
                albumName: song.albumName || null,
                audioFile: song.previewUrl ? `${index + 1}-${song.artist}-${song.title}.m4a`.replace(/[^a-z0-9.-]/gi, '-') : null
            })),
            instructions: {
                spotify: "Search for each track in Spotify and add to a new playlist",
                appleMusic: "Use the search query to find each track in Apple Music",
                youtube: "Search YouTube Music using the provided artist and title",
                tidal: "Search Tidal using the artist and title information",
                audioFiles: "Use the included 30-second preview files to identify tracks by sound"
            },
            generatedBy: "wwwwwh.io Playlist Curator",
            generatedDate: new Date().toISOString(),
            totalTracks: playlist.songs.length
        };

        // Create formatted text version
        const textContent = `
${playlist.title.toUpperCase()}
${'='.repeat(playlist.title.length + 10)}

Description: ${playlistDoc.description}
Mood: ${mood} | Company: ${company} | Activity: ${activity}
Total Tracks: ${playlist.songs.length} | Duration: ~${Math.round(playlist.songs.length * 3.5)} min

TRACK LISTING
${'-'.repeat(50)}

${tracks.map((song, i) => {
    const audioFile = song.previewUrl ? `${i + 1}-${song.artist}-${song.title}.m4a`.replace(/[^a-z0-9.-]/gi, '-') : 'no-preview';
    return `${(i + 1).toString().padStart(2, '0')}. ${song.artist} - ${song.title}
    Audio: ${audioFile}
    Album: ${song.albumName || 'Unknown'}
    Search: "${song.artist} ${song.title}"`;
}).join('\n\n')}

${'-'.repeat(50)}

AUDIO PREVIEWS INCLUDED
-----------------------
This download includes 30-second high-quality preview clips from iTunes.
Use these audio samples to:
• Identify the exact track by sound when searching streaming services
• Share with others to demonstrate the playlist vibe
• Preview before purchasing full tracks

HOW TO USE THIS PLAYLIST
------------------------
This playlist template can be used to recreate this curated collection 
on any major streaming platform:

• Spotify: Create a new playlist and search for each track
• Apple Music: Use search to add each song to your library
• YouTube Music: Find and add tracks using artist + title
• Tidal: Search and add to create your own version
• Amazon Music: Use the track list to build your playlist

TIP: Play the preview audio file and use music recognition apps like 
Shazam or SoundHound to quickly find tracks on your platform.

Generated by wwwwwh.io Playlist Curator
Date: ${new Date().toLocaleDateString()}
Total Audio Files: ${tracks.filter(t => t.previewUrl).length} of ${tracks.length}
`;

        // Create ZIP file with folder structure for Apple Music
        const filename = playlist.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const folderName = playlist.title;
        
        this.showDownloadProgress('Creating playlist package...');
        
        const zip = new JSZip();
        const playlistFolder = zip.folder(folderName);
        
        // Add JSON document
        playlistFolder.file('playlist-info.json', JSON.stringify(playlistDoc, null, 2));
        
        // Add text track list
        playlistFolder.file('tracklist.txt', textContent);
        
        // Add README for Apple Music import
        const readmeContent = `
${playlist.title}
${'='.repeat(playlist.title.length)}

IMPORTING TO APPLE MUSIC
------------------------

1. Drag this entire folder into Apple Music/iTunes
2. The audio files will be imported automatically
3. Create a new playlist called "${playlist.title}"
4. Select all imported tracks and add them to the playlist
5. Use the tracklist.txt to verify track order

ALTERNATIVE METHOD
------------------

1. Open Apple Music/iTunes
2. File > Add to Library
3. Select this folder
4. All audio files will be imported to your library
5. Use "tracklist.txt" to build your playlist

USING WITH OTHER APPS
---------------------

• Spotify: Use the track list to search and add songs
• YouTube Music: Search using artist and title from tracklist.txt
• Shazam: Play the preview files to identify tracks
• Music Recognition: Use preview files with any music ID app

Generated by wwwwwh.io Playlist Curator
${new Date().toLocaleDateString()}
`;
        playlistFolder.file('README.txt', readmeContent);
        
        // Download audio previews into the ZIP
        this.showDownloadProgress(`Adding ${tracks.filter(t => t.previewUrl).length} audio previews to package...`);
        await this.addAudioToZip(tracks, playlistFolder, filename);
        
        // Generate and download ZIP
        this.showDownloadProgress('Finalizing playlist package...');
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // Download the ZIP file
        await this.downloadBlob(zipBlob, `${filename}-playlist.zip`);
        
        // Show success message
        this.showDownloadSuccess(playlist.title, tracks.filter(t => t.previewUrl).length);

        console.log(`✓ Downloaded playlist package: ${playlist.title}`);
    }

    async addAudioToZip(tracks, zipFolder, playlistFilename) {
        const tracksWithPreviews = tracks.filter(t => t.previewUrl);
        const playlistTitle = zipFolder.name; // Get folder name as genre
        
        for (let i = 0; i < tracksWithPreviews.length; i++) {
            const track = tracksWithPreviews[i];
            const trackIndex = tracks.indexOf(track) + 1;
            
            try {
                // Update progress
                this.updateDownloadProgress(`Adding preview ${i + 1}/${tracksWithPreviews.length} to package...`);
                
                // Fetch the preview audio
                const response = await fetch(track.previewUrl);
                const arrayBuffer = await response.arrayBuffer();
                
                // Add ID3 tags to the audio file
                const taggedAudio = await this.addID3Tags(arrayBuffer, {
                    title: track.title,
                    artist: track.artist,
                    album: track.albumName || 'Unknown Album',
                    genre: playlistTitle,
                    track: trackIndex,
                    year: new Date().getFullYear().toString(),
                    comment: `Curated by wwwwwh.io - Preview from iTunes`
                });
                
                // Create filename that Apple Music will recognize
                const audioFilename = `${trackIndex.toString().padStart(2, '0')} - ${track.artist} - ${track.title}.m4a`
                    .replace(/[/\\?%*:|"<>]/g, '-')
                    .replace(/-+/g, '-')
                    .substring(0, 200); // Limit filename length
                
                // Add to ZIP
                zipFolder.file(audioFilename, taggedAudio);
                
            } catch (error) {
                console.error(`Failed to add preview for ${track.title}:`, error);
            }
        }
    }

    async addID3Tags(audioBuffer, metadata) {
        try {
            // Use ID3Writer to add metadata tags
            const writer = new ID3Writer(audioBuffer);
            
            // Set text frames
            writer.setFrame('TIT2', metadata.title);  // Title
            writer.setFrame('TPE1', [metadata.artist]); // Artist
            writer.setFrame('TALB', metadata.album);   // Album
            writer.setFrame('TCON', [metadata.genre]); // Genre (playlist name)
            writer.setFrame('TRCK', metadata.track.toString()); // Track number
            writer.setFrame('TYER', metadata.year);    // Year
            writer.setFrame('COMM', {
                description: '',
                text: metadata.comment
            }); // Comment
            
            writer.addTag();
            
            return writer.arrayBuffer;
        } catch (error) {
            console.error('Failed to add ID3 tags:', error);
            // Return original buffer if tagging fails
            return audioBuffer;
        }
    }

    downloadBlob(blob, filename) {
        return new Promise((resolve) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            resolve();
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showDownloadProgress(message) {
        // Remove existing progress message
        const existing = document.querySelector('.download-progress-message');
        if (existing) existing.remove();
        
        const progressMsg = document.createElement('div');
        progressMsg.className = 'download-progress-message';
        progressMsg.innerHTML = `
            <div class="progress-spinner">⟳</div>
            <strong>${message}</strong>
        `;
        progressMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2196F3;
            color: white;
            padding: 16px 20px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        document.body.appendChild(progressMsg);
        
        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .progress-spinner {
                animation: spin 1s linear infinite;
                font-size: 18px;
            }
        `;
        document.head.appendChild(style);
    }

    updateDownloadProgress(message) {
        const progressMsg = document.querySelector('.download-progress-message strong');
        if (progressMsg) {
            progressMsg.textContent = message;
        }
    }

    showDownloadSuccess(playlistTitle, audioCount) {
        // Remove progress message
        const progressMsg = document.querySelector('.download-progress-message');
        if (progressMsg) progressMsg.remove();
        
        const message = document.createElement('div');
        message.className = 'download-success-message';
        message.innerHTML = `
            <strong>✓ Playlist Downloaded</strong><br>
            ${playlistTitle}<br>
            <small>JSON, TXT, and ${audioCount} audio preview${audioCount !== 1 ? 's' : ''}</small>
        `;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 16px 20px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 4000);
    }

    togglePreview() {
        if (this.isPreviewPlaying) {
            this.stopPreview();
        } else {
            this.startPreview();
        }
    }

    startPreview() {
        if (this.previewTracks.length === 0) {
            alert('No preview tracks available');
            return;
        }

        this.isPreviewPlaying = true;
        this.currentTrackIndex = 0;
        
        const btn = this.container.querySelector('#preview-playlist-btn');
        if (btn) {
            btn.textContent = '⏸ Stop Preview';
            btn.classList.add('playing');
        }

        this.playPreviewTrack(0);
    }

    stopPreview() {
        this.isPreviewPlaying = false;
        
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        // Update preview button if it exists
        if (this.currentPlaylistKey) {
            const btn = this.container.querySelector(`.preview-btn[data-key="${this.currentPlaylistKey}"]`);
            if (btn) {
                btn.textContent = '▶ Preview';
            }
        }

        const oldBtn = this.container.querySelector('#preview-playlist-btn');
        if (oldBtn) {
            oldBtn.textContent = '▶ Preview Playlist';
            oldBtn.classList.remove('playing');
        }

        this.currentTrackIndex = 0;
        this.currentPlaylistKey = null;
    }

    playPreviewTrack(index) {
        if (!this.isPreviewPlaying || index >= this.previewTracks.length) {
            if (this.isPreviewPlaying) {
                // Reached end, loop back
                this.currentTrackIndex = 0;
                this.playPreviewTrack(0);
            }
            return;
        }

        const track = this.previewTracks[index];
        if (!track.previewUrl) {
            // Skip to next track
            this.currentTrackIndex = index + 1;
            this.playPreviewTrack(this.currentTrackIndex);
            return;
        }

        console.log(`🎵 Now previewing: ${track.artist} - ${track.title}`);

        // Clean up previous audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        // Create new audio element
        this.currentAudio = new Audio(track.previewUrl);
        this.currentAudio.volume = 1.0;

        // Setup crossfade before track ends
        this.currentAudio.addEventListener('timeupdate', () => {
            if (!this.isPreviewPlaying) return;
            
            const timeRemaining = this.currentAudio.duration - this.currentAudio.currentTime;
            
            // Start fade out 2 seconds before end
            if (timeRemaining <= 2 && timeRemaining > 1.9 && !this.fadeInProgress) {
                this.startCrossfade(index);
            }
        });

        // Handle track ending
        this.currentAudio.addEventListener('ended', () => {
            if (this.isPreviewPlaying) {
                this.currentTrackIndex = index + 1;
                if (this.currentTrackIndex >= this.previewTracks.length) {
                    this.currentTrackIndex = 0; // Loop back to start
                }
                this.playPreviewTrack(this.currentTrackIndex);
            }
        });

        // Play the track
        this.currentAudio.play().catch(err => {
            console.error('Preview playback error:', err);
            // Try next track
            this.currentTrackIndex = index + 1;
            this.playPreviewTrack(this.currentTrackIndex);
        });
    }

    startCrossfade(currentIndex) {
        this.fadeInProgress = true;
        
        const nextIndex = currentIndex + 1;
        if (nextIndex >= this.previewTracks.length) {
            // Will loop, fade out only
            this.fadeOut(this.currentAudio, 2000);
            return;
        }

        const nextTrack = this.previewTracks[nextIndex];
        if (!nextTrack.previewUrl) {
            this.fadeInProgress = false;
            return;
        }

        // Create next audio element
        const nextAudio = new Audio(nextTrack.previewUrl);
        nextAudio.volume = 0;

        // Start playing next track silently
        nextAudio.play().then(() => {
            // Crossfade over 2 seconds
            this.crossfade(this.currentAudio, nextAudio, 2000);
            
            // Update current audio
            setTimeout(() => {
                this.currentAudio = nextAudio;
                this.fadeInProgress = false;
            }, 2000);
        }).catch(err => {
            console.error('Crossfade preload error:', err);
            this.fadeInProgress = false;
        });
    }

    fadeOut(audio, duration) {
        if (!audio) return;
        
        const steps = 20;
        const stepDuration = duration / steps;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            audio.volume = Math.max(0, 1 - (step / steps));
            
            if (step >= steps) {
                clearInterval(interval);
                audio.volume = 0;
            }
        }, stepDuration);
    }

    crossfade(fadeOutAudio, fadeInAudio, duration) {
        const steps = 20;
        const stepDuration = duration / steps;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            
            if (fadeOutAudio) {
                fadeOutAudio.volume = Math.max(0, 1 - progress);
            }
            if (fadeInAudio) {
                fadeInAudio.volume = Math.min(1, progress);
            }
            
            if (step >= steps) {
                clearInterval(interval);
                if (fadeOutAudio) fadeOutAudio.volume = 0;
                if (fadeInAudio) fadeInAudio.volume = 1;
            }
        }, stepDuration);
    }
}

window.PlaylistSelector = PlaylistSelector;
