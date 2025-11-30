class MusicTournament {
    constructor(container) {
        this.container = container;
        this.currentMatchup = null;
        this.tournamentData = [];
        this.userVotes = JSON.parse(localStorage.getItem('musicTournamentVotes') || '{}');
        this.currentEra = null;
        this.currentGenre = null;
    }

    async init() {
        await this.render();
    }

    // Billboard-style chart data by era (using iTunes Search API for previews)
    getChartsByEra() {
        return {
            '1960-1964': {
                rock: ['The Beatles - I Want to Hold Your Hand', 'The Rolling Stones - (I Can\'t Get No) Satisfaction', 'The Beach Boys - Good Vibrations', 'The Supremes - Baby Love'],
                pop: ['Elvis Presley - It\'s Now or Never', 'Roy Orbison - Oh, Pretty Woman', 'The Righteous Brothers - You\'ve Lost That Lovin\' Feeling', 'Bobby Vinton - Blue Velvet'],
                soul: ['Sam Cooke - A Change Is Gonna Come', 'Marvin Gaye - How Sweet It Is', 'James Brown - I Got You', 'Aretha Franklin - Respect']
            },
            '1965-1969': {
                rock: ['Led Zeppelin - Whole Lotta Love', 'Jimi Hendrix - Purple Haze', 'The Doors - Light My Fire', 'Cream - Sunshine of Your Love'],
                pop: ['The Monkees - I\'m a Believer', 'Petula Clark - Downtown', 'The 5th Dimension - Aquarius', 'Tommy James - Crimson and Clover'],
                soul: ['Otis Redding - Sittin\' on The Dock of the Bay', 'Wilson Pickett - In the Midnight Hour', 'Percy Sledge - When a Man Loves a Woman', 'The Temptations - My Girl']
            },
            '1970-1974': {
                rock: ['Queen - Bohemian Rhapsody', 'Pink Floyd - Money', 'Elton John - Rocket Man', 'The Who - Baba O\'Riley'],
                pop: ['ABBA - Dancing Queen', 'Carpenters - Close to You', 'Gilbert O\'Sullivan - Alone Again', 'Three Dog Night - Joy to the World'],
                soul: ['Stevie Wonder - Superstition', 'Al Green - Let\'s Stay Together', 'Curtis Mayfield - Move On Up', 'Marvin Gaye - What\'s Going On']
            },
            '1975-1979': {
                rock: ['AC/DC - Highway to Hell', 'Boston - More Than a Feeling', 'Fleetwood Mac - Dreams', 'Eagles - Hotel California'],
                disco: ['Bee Gees - Stayin\' Alive', 'Donna Summer - Hot Stuff', 'Chic - Le Freak', 'KC and the Sunshine Band - Get Down Tonight'],
                punk: ['The Ramones - Blitzkrieg Bop', 'Sex Pistols - Anarchy in the UK', 'The Clash - London Calling', 'Blondie - Heart of Glass']
            },
            '1980-1984': {
                rock: ['Journey - Don\'t Stop Believin\'', 'Van Halen - Jump', 'Def Leppard - Pour Some Sugar on Me', 'Foreigner - I Want to Know What Love Is'],
                pop: ['Michael Jackson - Billie Jean', 'Madonna - Like a Virgin', 'Prince - When Doves Cry', 'Cyndi Lauper - Girls Just Want to Have Fun'],
                newwave: ['The Police - Every Breath You Take', 'Duran Duran - Hungry Like the Wolf', 'Talking Heads - Burning Down the House', 'Devo - Whip It']
            },
            '1985-1989': {
                rock: ['Guns N\' Roses - Sweet Child O\' Mine', 'Bon Jovi - Livin\' on a Prayer', 'U2 - With or Without You', 'INXS - Need You Tonight'],
                pop: ['Whitney Houston - I Wanna Dance with Somebody', 'George Michael - Faith', 'Janet Jackson - Nasty', 'Tiffany - I Think We\'re Alone Now'],
                hiphop: ['Run-DMC - Walk This Way', 'Public Enemy - Fight the Power', 'Beastie Boys - Fight for Your Right', 'N.W.A - Straight Outta Compton']
            },
            '1990-1994': {
                rock: ['Nirvana - Smells Like Teen Spirit', 'Pearl Jam - Alive', 'Red Hot Chili Peppers - Under the Bridge', 'Soundgarden - Black Hole Sun'],
                pop: ['Mariah Carey - Vision of Love', 'Boyz II Men - End of the Road', 'Whitney Houston - I Will Always Love You', 'Celine Dion - The Power of Love'],
                hiphop: ['Dr. Dre - Nuthin\' but a G Thang', 'Snoop Dogg - Gin and Juice', 'Tupac - California Love', 'Wu-Tang Clan - C.R.E.A.M.']
            },
            '1995-1999': {
                rock: ['Radiohead - Karma Police', 'Foo Fighters - Everlong', 'The Verve - Bitter Sweet Symphony', 'Oasis - Wonderwall'],
                pop: ['Britney Spears - Baby One More Time', 'Backstreet Boys - I Want It That Way', 'NSYNC - Bye Bye Bye', 'Christina Aguilera - Genie in a Bottle'],
                hiphop: ['Notorious B.I.G. - Hypnotize', 'Jay-Z - Hard Knock Life', 'Eminem - My Name Is', 'Lauryn Hill - Doo Wop']
            },
            '2000-2004': {
                rock: ['Linkin Park - In the End', 'The White Stripes - Seven Nation Army', 'Queens of the Stone Age - No One Knows', 'The Strokes - Last Nite'],
                pop: ['Outkast - Hey Ya!', 'Beyoncé - Crazy in Love', 'Usher - Yeah!', 'Nelly - Hot in Herre'],
                hiphop: ['50 Cent - In Da Club', 'Kanye West - Through the Wire', 'Missy Elliott - Work It', 'Ludacris - Stand Up']
            },
            '2005-2009': {
                rock: ['The Killers - Mr. Brightside', 'Arctic Monkeys - I Bet You Look Good on the Dancefloor', 'Kings of Leon - Use Somebody', 'Coldplay - Viva la Vida'],
                pop: ['Rihanna - Umbrella', 'Lady Gaga - Poker Face', 'Katy Perry - I Kissed a Girl', 'Taylor Swift - Love Story'],
                hiphop: ['Lil Wayne - Lollipop', 'T.I. - Whatever You Like', 'Flo Rida - Low', 'Soulja Boy - Crank That']
            },
            '2010-2014': {
                rock: ['Imagine Dragons - Radioactive', 'Foster the People - Pumped Up Kicks', 'The Black Keys - Lonely Boy', 'Mumford & Sons - I Will Wait'],
                pop: ['Adele - Rolling in the Deep', 'Bruno Mars - Just the Way You Are', 'Pharrell Williams - Happy', 'Katy Perry - Roar'],
                hiphop: ['Drake - Started from the Bottom', 'Kendrick Lamar - Swimming Pools', 'Macklemore - Thrift Shop', 'Nicki Minaj - Super Bass']
            },
            '2015-2019': {
                rock: ['Twenty One Pilots - Stressed Out', 'Panic! at the Disco - High Hopes', 'The Lumineers - Ho Hey', 'Portugal. The Man - Feel It Still'],
                pop: ['The Weeknd - Blinding Lights', 'Ed Sheeran - Shape of You', 'Ariana Grande - Thank U Next', 'Billie Eilish - Bad Guy'],
                hiphop: ['Post Malone - Rockstar', 'Cardi B - Bodak Yellow', 'Travis Scott - Sicko Mode', 'Lil Nas X - Old Town Road']
            },
            '2020-2024': {
                pop: ['Dua Lipa - Levitating', 'Olivia Rodrigo - Drivers License', 'Harry Styles - As It Was', 'Taylor Swift - Anti-Hero'],
                hiphop: ['Megan Thee Stallion - Savage', 'Jack Harlow - First Class', 'Kendrick Lamar - N95', 'Drake - Way 2 Sexy'],
                alternative: ['Glass Animals - Heat Waves', 'Tame Impala - The Less I Know the Better', 'Arctic Monkeys - Do I Wanna Know', 'Cage the Elephant - Come a Little Closer']
            }
        };
    }

    async searchSoundCloud(artist, songTitle) {
        try {
            const query = encodeURIComponent(`${artist} ${songTitle}`);
            const response = await fetch(`https://soundcloud.com/search/sounds?q=${query}`);
            const html = await response.text();
            
            // Extract first track URL from search results
            const match = html.match(/https:\/\/soundcloud\.com\/[^\/]+\/[^\s"<>]+/);
            if (match) {
                const trackUrl = match[0];
                console.log(`✓ Found on SoundCloud: ${songTitle} - ${artist}`);
                return {
                    soundCloudUrl: trackUrl,
                    source: 'soundcloud'
                };
            }
        } catch (error) {
            console.error(`SoundCloud error for ${songTitle}:`, error);
        }
        return null;
    }

    async searchItunes(songTitle, artist) {
        // Try SoundCloud first for better compatibility
        const soundCloudResult = await this.searchSoundCloud(artist, songTitle);
        if (soundCloudResult) {
            return soundCloudResult;
        }

        // Fallback to iTunes
        try {
            // Clean up search terms
            const cleanTitle = songTitle.replace(/[()]/g, '').trim();
            const cleanArtist = artist.replace(/[()]/g, '').trim();
            
            // Search for artist's albums (entity=album works better with CSP)
            const query = encodeURIComponent(cleanArtist);
            const response = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&entity=album&limit=10`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Try each album to find the song with preview
                for (const album of data.results) {
                    if (album.collectionId) {
                        try {
                            // Use lookup API to get all tracks from this album
                            const lookupResponse = await fetch(`https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song&limit=200`);
                            const lookupData = await lookupResponse.json();
                            
                            if (lookupData.results && lookupData.results.length > 1) {
                                const tracks = lookupData.results.slice(1); // Skip album info
                                
                                // Find matching track with preview
                                const matchingTrack = tracks.find(t => 
                                    t.trackName && t.previewUrl && 
                                    (t.trackName.toLowerCase().includes(cleanTitle.toLowerCase()) ||
                                     cleanTitle.toLowerCase().includes(t.trackName.toLowerCase()))
                                );
                                
                                if (matchingTrack) {
                                    console.log(`✓ Found preview on iTunes: ${cleanTitle} - ${cleanArtist}`);
                                    return {
                                        previewUrl: matchingTrack.previewUrl,
                                        artwork: matchingTrack.artworkUrl100?.replace('100x100', '600x600'),
                                        albumName: matchingTrack.collectionName,
                                        releaseDate: matchingTrack.releaseDate,
                                        iTunesUrl: matchingTrack.trackViewUrl,
                                        source: 'itunes'
                                    };
                                }
                            }
                        } catch (lookupError) {
                            console.error('Lookup API error:', lookupError);
                        }
                    }
                }
            }
            
            console.log(`✗ No preview found for: ${songTitle} - ${artist}`);
            return null;
        } catch (error) {
            console.error('iTunes API error:', error);
            return null;
        }
    }

    generateMatchup(era, genre) {
        const charts = this.getChartsByEra();
        const songs = charts[era]?.[genre] || [];
        
        if (songs.length < 2) return null;

        // Tournament-style seeding: 1 vs 4, 2 vs 3
        const shuffled = [...songs].sort(() => Math.random() - 0.5);
        const song1 = this.parseSongString(shuffled[0]);
        const song2 = this.parseSongString(shuffled[1]);

        return { song1, song2, era, genre };
    }

    parseSongString(songString) {
        const [artist, title] = songString.split(' - ');
        // Clean up special characters and formatting for better iTunes matching
        const cleanArtist = artist.trim().replace(/\s+/g, ' ');
        const cleanTitle = title.trim()
            .replace(/\(I Can't Get No\)/i, 'I Can\'t Get No')
            .replace(/\'/g, "'") // Normalize apostrophes
            .replace(/\s+/g, ' ');
        
        return { 
            artist: cleanArtist, 
            title: cleanTitle, 
            fullName: songString 
        };
    }

    async loadMatchupData(matchup) {
        const [data1, data2] = await Promise.all([
            this.searchItunes(matchup.song1.title, matchup.song1.artist),
            this.searchItunes(matchup.song2.title, matchup.song2.artist)
        ]);

        matchup.song1.data = data1;
        matchup.song2.data = data2;

        return matchup;
    }

    handleVote(winner, loser) {
        const voteKey = `${this.currentEra}_${this.currentGenre}`;
        
        if (!this.userVotes[voteKey]) {
            this.userVotes[voteKey] = [];
        }

        this.userVotes[voteKey].push({
            winner: winner.fullName,
            loser: loser.fullName,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('musicTournamentVotes', JSON.stringify(this.userVotes));

        // Load next matchup
        this.loadNewMatchup(this.currentEra, this.currentGenre);
    }

    async loadNewMatchup(era, genre) {
        this.currentEra = era;
        this.currentGenre = genre;

        const matchup = this.generateMatchup(era, genre);
        if (!matchup) {
            this.showNoMoreMatchups();
            return;
        }

        this.currentMatchup = await this.loadMatchupData(matchup);
        this.renderMatchup();
    }

    showNoMoreMatchups() {
        const battleArea = this.container.querySelector('.battle-area');
        battleArea.innerHTML = `
            <div class="tournament-complete">
                <h3>🏆 Era Complete!</h3>
                <p>Select a new era and genre to continue voting.</p>
            </div>
        `;
    }

    renderMatchup() {
        const battleArea = this.container.querySelector('.battle-area');
        const { song1, song2 } = this.currentMatchup;

        battleArea.innerHTML = `
            <div class="matchup-container">
                <div class="song-card" data-song="1">
                    <div class="album-art" style="background-image: url('${song1.data?.artwork || ''}')">
                        ${!song1.data?.artwork ? '<div class="no-artwork">🎵</div>' : ''}
                    </div>
                    <h3>${song1.title}</h3>
                    <p class="artist">${song1.artist}</p>
                    ${song1.data?.source === 'soundcloud' && song1.data?.soundCloudUrl ? `
                        <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" 
                            src="https://w.soundcloud.com/player/?url=${encodeURIComponent(song1.data.soundCloudUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false">
                        </iframe>
                    ` : song1.data?.previewUrl ? `
                        <audio controls preload="none">
                            <source src="${song1.data.previewUrl}" type="audio/mp4">
                        </audio>
                    ` : song1.data?.soundCloudUrl ? 
                        `<p class="no-preview"><a href="${song1.data.soundCloudUrl}" target="_blank" rel="noopener">Listen on SoundCloud ↗</a></p>` :
                      song1.data?.iTunesUrl ? 
                        `<p class="no-preview"><a href="${song1.data.iTunesUrl}" target="_blank" rel="noopener">Listen on iTunes ↗</a></p>` :
                        '<p class="no-preview">Preview unavailable</p>'}
                    <button class="vote-btn" data-winner="1">Vote for This</button>
                </div>

                <div class="vs-divider">
                    <span>VS</span>
                </div>

                <div class="song-card" data-song="2">
                    <div class="album-art" style="background-image: url('${song2.data?.artwork || ''}')">
                        ${!song2.data?.artwork ? '<div class="no-artwork">🎵</div>' : ''}
                    </div>
                    <h3>${song2.title}</h3>
                    <p class="artist">${song2.artist}</p>
                    ${song2.data?.source === 'soundcloud' && song2.data?.soundCloudUrl ? `
                        <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" 
                            src="https://w.soundcloud.com/player/?url=${encodeURIComponent(song2.data.soundCloudUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false">
                        </iframe>
                    ` : song2.data?.previewUrl ? `
                        <audio controls preload="none">
                            <source src="${song2.data.previewUrl}" type="audio/mp4">
                        </audio>
                    ` : song2.data?.soundCloudUrl ? 
                        `<p class="no-preview"><a href="${song2.data.soundCloudUrl}" target="_blank" rel="noopener">Listen on SoundCloud ↗</a></p>` :
                      song2.data?.iTunesUrl ? 
                        `<p class="no-preview"><a href="${song2.data.iTunesUrl}" target="_blank" rel="noopener">Listen on iTunes ↗</a></p>` :
                        '<p class="no-preview">Preview unavailable</p>'}
                    <button class="vote-btn" data-winner="2">Vote for This</button>
                </div>
            </div>
        `;

        // Attach vote handlers
        battleArea.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const winnerId = e.target.dataset.winner;
                const winner = winnerId === '1' ? song1 : song2;
                const loser = winnerId === '1' ? song2 : song1;
                this.handleVote(winner, loser);
            });
        });
    }

    async render() {
        const charts = this.getChartsByEra();
        const eras = Object.keys(charts);

        this.container.innerHTML = `
            <div class="music-tournament">
                <div class="tournament-header">
                    <h2>🎵 Music Tournament</h2>
                    <p>Pick the better song from each matchup. Tournament-style seeding by era and genre.</p>
                </div>

                <div class="era-selector">
                    <label>Era:</label>
                    <select id="era-select">
                        <option value="">-- Select Era --</option>
                        ${eras.map(era => `<option value="${era}">${era}</option>`).join('')}
                    </select>
                </div>

                <div class="genre-selector" style="display: none;">
                    <label>Genre:</label>
                    <select id="genre-select">
                        <option value="">-- Select Genre --</option>
                    </select>
                </div>

                <div class="battle-area">
                    <div class="start-prompt">
                        <p>Select an era to begin the tournament.</p>
                    </div>
                </div>

                <style>
                    .music-tournament {
                        font-family: 'JetBrains Mono', monospace;
                        padding: 20px;
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .tournament-header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .tournament-header h2 {
                        font-size: 32px;
                        margin-bottom: 10px;
                    }
                    .era-selector, .genre-selector {
                        margin: 20px 0;
                        display: flex;
                        gap: 10px;
                        align-items: center;
                        justify-content: center;
                    }
                    select {
                        padding: 10px 15px;
                        font-size: 14px;
                        font-family: 'JetBrains Mono', monospace;
                        border: 2px solid currentColor;
                        background: transparent;
                        color: currentColor;
                        cursor: pointer;
                    }
                    .matchup-container {
                        display: grid;
                        grid-template-columns: 1fr auto 1fr;
                        gap: 30px;
                        align-items: center;
                        margin-top: 40px;
                    }
                    .song-card {
                        border: 2px solid currentColor;
                        padding: 20px;
                        text-align: center;
                        transition: all 0.3s ease;
                    }
                    .song-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    }
                    .album-art {
                        width: 100%;
                        aspect-ratio: 1;
                        background-size: cover;
                        background-position: center;
                        margin-bottom: 15px;
                        border: 1px solid rgba(0,0,0,0.1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .no-artwork {
                        font-size: 64px;
                        opacity: 0.3;
                    }
                    .song-card h3 {
                        font-size: 18px;
                        margin: 10px 0;
                    }
                    .artist {
                        font-size: 14px;
                        opacity: 0.7;
                        margin-bottom: 15px;
                    }
                    audio {
                        width: 100%;
                        margin: 15px 0;
                    }
                    .vote-btn {
                        width: 100%;
                        padding: 15px;
                        font-size: 16px;
                        font-weight: 600;
                        border: 2px solid currentColor;
                        background: transparent;
                        color: currentColor;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-family: 'JetBrains Mono', monospace;
                    }
                    .vote-btn:hover {
                        background: currentColor;
                        color: var(--color-primary, white);
                    }
                    .vs-divider {
                        font-size: 48px;
                        font-weight: 900;
                        opacity: 0.3;
                        text-align: center;
                    }
                    .start-prompt, .tournament-complete {
                        text-align: center;
                        padding: 60px 20px;
                        font-size: 18px;
                        opacity: 0.6;
                    }
                    .no-preview {
                        font-size: 12px;
                        opacity: 0.5;
                        font-style: italic;
                        margin: 15px 0;
                    }
                    @media (max-width: 768px) {
                        .matchup-container {
                            grid-template-columns: 1fr;
                            gap: 20px;
                        }
                        .vs-divider {
                            transform: rotate(90deg);
                            font-size: 32px;
                        }
                    }
                </style>
            </div>
        `;

        // Era selector handler
        const eraSelect = this.container.querySelector('#era-select');
        const genreSelect = this.container.querySelector('#genre-select');
        const genreSelector = this.container.querySelector('.genre-selector');

        eraSelect.addEventListener('change', (e) => {
            const era = e.target.value;
            if (!era) {
                genreSelector.style.display = 'none';
                return;
            }

            const genres = Object.keys(charts[era]);
            genreSelect.innerHTML = '<option value="">-- Select Genre --</option>' +
                genres.map(g => `<option value="${g}">${g.charAt(0).toUpperCase() + g.slice(1)}</option>`).join('');
            
            genreSelector.style.display = 'flex';
        });

        genreSelect.addEventListener('change', (e) => {
            const genre = e.target.value;
            const era = eraSelect.value;
            
            if (era && genre) {
                this.loadNewMatchup(era, genre);
            }
        });
    }
}

// Make globally available
window.MusicTournament = MusicTournament;
