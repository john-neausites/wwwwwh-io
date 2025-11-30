class PlaylistSelector {
    constructor(container) {
        this.container = container;
        this.selectedMood = null;
        this.selectedCompany = null;
        this.selectedActivity = null;
        this.selectedLength = '10-songs'; // Default: 10 songs
        
        // Define the playlist database
        this.playlists = this.generatePlaylists();
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

    async fetchWithTimeout(url, timeout = 15000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                mode: 'cors',
                cache: 'default'
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
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
                                console.error('Lookup API error:', lookupError);
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
                    console.log(`⚠ No preview found for: ${song.title} - ${song.artist}`);
                    results.push({ ...song, previewUrl: null, artwork: null, iTunesUrl: null });
                }
            } catch (error) {
                console.error(`Error fetching ${song.title}:`, error);
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

        let html = `
            <div class="active-playlist">
                <h3>${playlist.title}</h3>
                <p class="playlist-meta">${this.selectedMood} • ${this.selectedCompany} • ${this.selectedActivity} • ${lengthDisplay}</p>
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
    }

    render() {
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
}

window.PlaylistSelector = PlaylistSelector;
