class MusicRadio {
    constructor(container, station = 'general') {
        this.container = container;
        this.station = station;
        this.currentAudio = null;
        this.currentTrack = null;
        this.currentTrackIndex = 0;
        this.playlist = [];
        this.isPlaying = false;
        this.isLoading = false;
        this.likedTracks = this.loadLikedTracks();
        this.dislikedTracks = this.loadDislikedTracks();
        this.progressInterval = null;
        
        // Generate playlist based on station
        switch (station) {
            case 'christmas':
                this.generateChristmasPlaylist();
                break;
            case 'rock':
                this.generateRockPlaylist();
                break;
            case 'pop':
                this.generatePopPlaylist();
                break;
            case 'hiphop':
                this.generateHipHopPlaylist();
                break;
            case 'electronic':
                this.generateElectronicPlaylist();
                break;
            case 'jazz':
                this.generateJazzPlaylist();
                break;
            case 'classical':
                this.generateClassicalPlaylist();
                break;
            case 'country':
                this.generateCountryPlaylist();
                break;
            case 'rnb':
                this.generateRnBPlaylist();
                break;
            default:
                this.generatePlaylist();
        }
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
    
    generateChristmasPlaylist() {
        // Comprehensive Christmas music playlist
        this.playlist = [
            // Classic Traditional
            { artist: "Bing Crosby", title: "White Christmas", genre: "Christmas" },
            { artist: "Nat King Cole", title: "The Christmas Song", genre: "Christmas" },
            { artist: "Frank Sinatra", title: "Have Yourself a Merry Little Christmas", genre: "Christmas" },
            { artist: "Judy Garland", title: "Have Yourself a Merry Little Christmas", genre: "Christmas" },
            { artist: "Elvis Presley", title: "Blue Christmas", genre: "Christmas" },
            { artist: "Dean Martin", title: "Let It Snow", genre: "Christmas" },
            { artist: "Perry Como", title: "It's Beginning to Look a Lot Like Christmas", genre: "Christmas" },
            { artist: "Andy Williams", title: "It's the Most Wonderful Time of the Year", genre: "Christmas" },
            { artist: "Burl Ives", title: "A Holly Jolly Christmas", genre: "Christmas" },
            { artist: "Gene Autry", title: "Rudolph the Red-Nosed Reindeer", genre: "Christmas" },
            { artist: "Brenda Lee", title: "Rockin' Around the Christmas Tree", genre: "Christmas" },
            
            // Timeless Carols
            { artist: "Bing Crosby", title: "Silent Night", genre: "Christmas" },
            { artist: "Nat King Cole", title: "O Holy Night", genre: "Christmas" },
            { artist: "Mahalia Jackson", title: "O Holy Night", genre: "Christmas" },
            { artist: "Harry Simeone Chorale", title: "Little Drummer Boy", genre: "Christmas" },
            { artist: "Bing Crosby", title: "Little Drummer Boy", genre: "Christmas" },
            { artist: "Perry Como", title: "O Little Town of Bethlehem", genre: "Christmas" },
            { artist: "Frank Sinatra", title: "O Little Town of Bethlehem", genre: "Christmas" },
            { artist: "Nat King Cole", title: "Deck the Halls", genre: "Christmas" },
            { artist: "Bing Crosby", title: "God Rest Ye Merry Gentlemen", genre: "Christmas" },
            { artist: "Andy Williams", title: "Joy to the World", genre: "Christmas" },
            { artist: "Nat King Cole", title: "Hark! The Herald Angels Sing", genre: "Christmas" },
            { artist: "Johnny Mathis", title: "We Need a Little Christmas", genre: "Christmas" },
            { artist: "Frank Sinatra", title: "Jingle Bells", genre: "Christmas" },
            { artist: "Bing Crosby", title: "Angels We Have Heard on High", genre: "Christmas" },
            
            // Modern Pop Classics
            { artist: "Mariah Carey", title: "All I Want for Christmas Is You", genre: "Christmas" },
            { artist: "Wham!", title: "Last Christmas", genre: "Christmas" },
            { artist: "Michael Bublé", title: "It's Beginning to Look a Lot Like Christmas", genre: "Christmas" },
            { artist: "Michael Bublé", title: "Holly Jolly Christmas", genre: "Christmas" },
            { artist: "Michael Bublé", title: "White Christmas", genre: "Christmas" },
            { artist: "Michael Bublé", title: "Jingle Bells", genre: "Christmas" },
            { artist: "Kelly Clarkson", title: "Underneath the Tree", genre: "Christmas" },
            { artist: "Ariana Grande", title: "Santa Tell Me", genre: "Christmas" },
            { artist: "Justin Bieber", title: "Mistletoe", genre: "Christmas" },
            { artist: "Sia", title: "Snowman", genre: "Christmas" },
            { artist: "Pentatonix", title: "Hallelujah", genre: "Christmas" },
            { artist: "Pentatonix", title: "Mary, Did You Know?", genre: "Christmas" },
            { artist: "Pentatonix", title: "Little Drummer Boy", genre: "Christmas" },
            { artist: "Pentatonix", title: "Silent Night", genre: "Christmas" },
            
            // Fun & Upbeat
            { artist: "Bobby Helms", title: "Jingle Bell Rock", genre: "Christmas" },
            { artist: "Chuck Berry", title: "Run Rudolph Run", genre: "Christmas" },
            { artist: "The Ronettes", title: "Sleigh Ride", genre: "Christmas" },
            { artist: "The Jackson 5", title: "Santa Claus Is Coming to Town", genre: "Christmas" },
            { artist: "Bruce Springsteen", title: "Santa Claus Is Comin' to Town", genre: "Christmas" },
            { artist: "Paul McCartney", title: "Wonderful Christmastime", genre: "Christmas" },
            { artist: "John Lennon", title: "Happy Xmas (War Is Over)", genre: "Christmas" },
            { artist: "Band Aid", title: "Do They Know It's Christmas?", genre: "Christmas" },
            { artist: "Jose Feliciano", title: "Feliz Navidad", genre: "Christmas" },
            { artist: "Stevie Wonder", title: "What Christmas Means to Me", genre: "Christmas" },
            { artist: "The Waitresses", title: "Christmas Wrapping", genre: "Christmas" },
            { artist: "Run-DMC", title: "Christmas in Hollis", genre: "Christmas" },
            
            // Contemporary Artists
            { artist: "Taylor Swift", title: "Christmas Tree Farm", genre: "Christmas" },
            { artist: "Gwen Stefani", title: "You Make It Feel Like Christmas", genre: "Christmas" },
            { artist: "John Legend", title: "Bring Me Love", genre: "Christmas" },
            { artist: "Lady Gaga", title: "Christmas Tree", genre: "Christmas" },
            { artist: "Katy Perry", title: "Cozy Little Christmas", genre: "Christmas" },
            { artist: "Coldplay", title: "Christmas Lights", genre: "Christmas" },
            { artist: "Maroon 5", title: "Happy Xmas (War Is Over)", genre: "Christmas" },
            
            // Classic Rock Christmas
            { artist: "The Eagles", title: "Please Come Home for Christmas", genre: "Christmas" },
            { artist: "The Beach Boys", title: "Little Saint Nick", genre: "Christmas" },
            { artist: "Elton John", title: "Step Into Christmas", genre: "Christmas" },
            { artist: "Greg Lake", title: "I Believe in Father Christmas", genre: "Christmas" },
            { artist: "The Pretenders", title: "2000 Miles", genre: "Christmas" },
            { artist: "Tom Petty", title: "Christmas All Over Again", genre: "Christmas" },
            
            // Country Christmas
            { artist: "Dolly Parton", title: "Hard Candy Christmas", genre: "Christmas" },
            { artist: "Dolly Parton", title: "All I Want for Christmas Is You", genre: "Christmas" },
            { artist: "Carrie Underwood", title: "O Holy Night", genre: "Christmas" },
            { artist: "Garth Brooks", title: "The Old Man's Back in Town", genre: "Christmas" },
            { artist: "Reba McEntire", title: "Silent Night", genre: "Christmas" },
            { artist: "Blake Shelton", title: "Jingle Bell Rock", genre: "Christmas" },
            { artist: "Kenny Chesney", title: "All I Want for Christmas Is a Real Good Tan", genre: "Christmas" },
            
            // R&B/Soul Christmas
            { artist: "Luther Vandross", title: "Every Year, Every Christmas", genre: "Christmas" },
            { artist: "Stevie Wonder", title: "Someday at Christmas", genre: "Christmas" },
            { artist: "The Temptations", title: "Silent Night", genre: "Christmas" },
            { artist: "Boyz II Men", title: "Let It Snow", genre: "Christmas" },
            { artist: "Marvin Gaye", title: "I Want to Come Home for Christmas", genre: "Christmas" },
            { artist: "Aretha Franklin", title: "O Holy Night", genre: "Christmas" },
            { artist: "Toni Braxton", title: "Snowflakes of Love", genre: "Christmas" },
            { artist: "Whitney Houston", title: "Do You Hear What I Hear?", genre: "Christmas" },
            { artist: "Alicia Keys", title: "Please Come Home for Christmas", genre: "Christmas" },
            { artist: "John Legend", title: "This Time of the Year", genre: "Christmas" },
            
            // Jazz & Swing
            { artist: "Ella Fitzgerald", title: "Sleigh Ride", genre: "Christmas" },
            { artist: "Louis Armstrong", title: "Winter Wonderland", genre: "Christmas" },
            { artist: "Ella Fitzgerald", title: "Let It Snow", genre: "Christmas" },
            { artist: "Frank Sinatra", title: "Winter Wonderland", genre: "Christmas" },
            { artist: "Dean Martin", title: "Baby, It's Cold Outside", genre: "Christmas" },
            { artist: "Eartha Kitt", title: "Santa Baby", genre: "Christmas" },
            { artist: "Tony Bennett", title: "The Christmas Song", genre: "Christmas" },
            
            // Children's Favorites
            { artist: "Alvin and the Chipmunks", title: "The Chipmunk Song", genre: "Christmas" },
            { artist: "The Muppets", title: "The Twelve Days of Christmas", genre: "Christmas" },
            { artist: "Gene Autry", title: "Here Comes Santa Claus", genre: "Christmas" },
            { artist: "Burl Ives", title: "Rudolph the Red-Nosed Reindeer", genre: "Christmas" },
            { artist: "Jose Feliciano", title: "I Wanna Wish You a Merry Christmas", genre: "Christmas" },
            
            // Modern Indie/Alternative
            { artist: "Sufjan Stevens", title: "Come Thou Fount of Every Blessing", genre: "Christmas" },
            { artist: "Sufjan Stevens", title: "O Come O Come Emmanuel", genre: "Christmas" },
            { artist: "She & Him", title: "Baby, It's Cold Outside", genre: "Christmas" },
            { artist: "The Killers", title: "Don't Shoot Me Santa", genre: "Christmas" },
            { artist: "Phoenix", title: "Alone on Christmas Day", genre: "Christmas" },
            { artist: "Death Cab for Cutie", title: "Christmas (Baby Please Come Home)", genre: "Christmas" },
            
            // Instrumental Classics
            { artist: "Trans-Siberian Orchestra", title: "Christmas Eve/Sarajevo 12/24", genre: "Christmas" },
            { artist: "Trans-Siberian Orchestra", title: "Carol of the Bells", genre: "Christmas" },
            { artist: "Mannheim Steamroller", title: "Deck the Halls", genre: "Christmas" },
            { artist: "Mannheim Steamroller", title: "Carol of the Bells", genre: "Christmas" },
            { artist: "Vince Guaraldi Trio", title: "Christmas Time Is Here", genre: "Christmas" },
            { artist: "Vince Guaraldi Trio", title: "Linus and Lucy", genre: "Christmas" },
            
            // More Modern Covers
            { artist: "Ed Sheeran", title: "Perfect Christmas", genre: "Christmas" },
            { artist: "Ed Sheeran", title: "Merry Christmas", genre: "Christmas" },
            { artist: "Sia", title: "Santa's Coming for Us", genre: "Christmas" },
            { artist: "CeeLo Green", title: "Mary Did You Know?", genre: "Christmas" },
            { artist: "Train", title: "Shake Up Christmas", genre: "Christmas" },
            { artist: "Meghan Trainor", title: "I'll Be Home", genre: "Christmas" },
            { artist: "Cher", title: "DJ Play a Christmas Song", genre: "Christmas" },
            
            // Additional Classics
            { artist: "Johnny Mathis", title: "Sleigh Ride", genre: "Christmas" },
            { artist: "Johnny Mathis", title: "Winter Wonderland", genre: "Christmas" },
            { artist: "Nat King Cole", title: "Frosty the Snowman", genre: "Christmas" },
            { artist: "Bing Crosby", title: "I'll Be Home for Christmas", genre: "Christmas" },
            { artist: "Perry Como", title: "Home for the Holidays", genre: "Christmas" },
            { artist: "Andy Williams", title: "Happy Holiday", genre: "Christmas" },
            { artist: "Judy Garland", title: "The Christmas Song", genre: "Christmas" },
            { artist: "Rosemary Clooney", title: "White Christmas", genre: "Christmas" },
            
            // Religious/Spiritual
            { artist: "Amy Grant", title: "Grown-Up Christmas List", genre: "Christmas" },
            { artist: "Amy Grant", title: "Breath of Heaven", genre: "Christmas" },
            { artist: "Celine Dion", title: "O Holy Night", genre: "Christmas" },
            { artist: "Josh Groban", title: "O Holy Night", genre: "Christmas" },
            { artist: "Andrea Bocelli", title: "Silent Night", genre: "Christmas" },
            { artist: "Carrie Underwood", title: "Mary, Did You Know?", genre: "Christmas" },
            { artist: "Chris Tomlin", title: "Noel", genre: "Christmas" },
            
            // More Fun Upbeat
            { artist: "Mariah Carey", title: "Oh Santa!", genre: "Christmas" },
            { artist: "Kelly Clarkson", title: "Christmas Eve", genre: "Christmas" },
            { artist: "The Pointer Sisters", title: "Santa Claus Is Coming to Town", genre: "Christmas" },
            { artist: "Jessica Simpson", title: "Let It Snow", genre: "Christmas" },
            { artist: "Britney Spears", title: "My Only Wish", genre: "Christmas" },
            { artist: "NSYNC", title: "Merry Christmas, Happy Holidays", genre: "Christmas" },
            { artist: "Christina Aguilera", title: "Christmas Time", genre: "Christmas" },
            { artist: "Destiny's Child", title: "8 Days of Christmas", genre: "Christmas" },
            
            // International Flavors
            { artist: "Andrea Bocelli", title: "Cantique de Noël", genre: "Christmas" },
            { artist: "Josh Groban", title: "Ave Maria", genre: "Christmas" },
            { artist: "Il Divo", title: "O Holy Night", genre: "Christmas" },
            { artist: "Celtic Woman", title: "O Come All Ye Faithful", genre: "Christmas" },
            
            // Broadway/Show Tunes
            { artist: "Idina Menzel", title: "A Hand for Mrs. Claus", genre: "Christmas" },
            { artist: "Kristin Chenoweth", title: "Home on Christmas Day", genre: "Christmas" },
            { artist: "Barbra Streisand", title: "Jingle Bells", genre: "Christmas" },
            { artist: "Barbra Streisand", title: "The Christmas Song", genre: "Christmas" },
            
            // Novelty Songs
            { artist: "Spike Jones", title: "All I Want for Christmas", genre: "Christmas" },
            { artist: "Bob Rivers", title: "The Twelve Pains of Christmas", genre: "Christmas" },
            { artist: "Adam Sandler", title: "The Chanukah Song", genre: "Christmas" },
            { artist: "Dr. Demento", title: "Grandma Got Run Over by a Reindeer", genre: "Christmas" },
            
            // Additional Contemporary
            { artist: "Sam Smith", title: "Have Yourself a Merry Little Christmas", genre: "Christmas" },
            { artist: "Shawn Mendes", title: "The Christmas Song", genre: "Christmas" },
            { artist: "Sabrina Carpenter", title: "White Christmas", genre: "Christmas" },
            { artist: "Alessia Cara", title: "Make It to Christmas", genre: "Christmas" },
            { artist: "Camila Cabello", title: "I'll Be Home for Christmas", genre: "Christmas" },
            { artist: "Brett Eldredge", title: "The First Noel", genre: "Christmas" },
            { artist: "Harry Connick Jr.", title: "When My Heart Finds Christmas", genre: "Christmas" },
            { artist: "Harry Connick Jr.", title: "It Must've Been Ol' Santa Claus", genre: "Christmas" },
            
            // More Traditional Carols
            { artist: "Mormon Tabernacle Choir", title: "Silent Night", genre: "Christmas" },
            { artist: "Mormon Tabernacle Choir", title: "The First Noel", genre: "Christmas" },
            { artist: "King's College Choir", title: "Once in Royal David's City", genre: "Christmas" },
            { artist: "Vienna Boys Choir", title: "O Come All Ye Faithful", genre: "Christmas" }
        ];
        
        // Shuffle playlist
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    generateRockPlaylist() {
        this.playlist = [
            // Classic Rock
            { artist: "Led Zeppelin", title: "Stairway to Heaven", genre: "Rock" },
            { artist: "Pink Floyd", title: "Comfortably Numb", genre: "Rock" },
            { artist: "The Beatles", title: "Come Together", genre: "Rock" },
            { artist: "The Rolling Stones", title: "Paint It Black", genre: "Rock" },
            { artist: "Queen", title: "Bohemian Rhapsody", genre: "Rock" },
            { artist: "AC/DC", title: "Back in Black", genre: "Rock" },
            { artist: "Guns N' Roses", title: "Sweet Child O' Mine", genre: "Rock" },
            { artist: "Nirvana", title: "Smells Like Teen Spirit", genre: "Rock" },
            { artist: "Metallica", title: "Enter Sandman", genre: "Rock" },
            { artist: "Black Sabbath", title: "Paranoid", genre: "Rock" },
            
            // Alternative Rock
            { artist: "Radiohead", title: "Creep", genre: "Rock" },
            { artist: "The Smashing Pumpkins", title: "1979", genre: "Rock" },
            { artist: "Pearl Jam", title: "Alive", genre: "Rock" },
            { artist: "Soundgarden", title: "Black Hole Sun", genre: "Rock" },
            { artist: "Stone Temple Pilots", title: "Interstate Love Song", genre: "Rock" },
            { artist: "Red Hot Chili Peppers", title: "Under the Bridge", genre: "Rock" },
            { artist: "Foo Fighters", title: "Everlong", genre: "Rock" },
            { artist: "The White Stripes", title: "Seven Nation Army", genre: "Rock" },
            { artist: "Arctic Monkeys", title: "Do I Wanna Know", genre: "Rock" },
            { artist: "The Strokes", title: "Last Nite", genre: "Rock" },
            
            // Modern Rock
            { artist: "Imagine Dragons", title: "Radioactive", genre: "Rock" },
            { artist: "Twenty One Pilots", title: "Stressed Out", genre: "Rock" },
            { artist: "The Killers", title: "Mr. Brightside", genre: "Rock" },
            { artist: "Muse", title: "Uprising", genre: "Rock" },
            { artist: "Linkin Park", title: "In the End", genre: "Rock" },
            { artist: "Green Day", title: "Boulevard of Broken Dreams", genre: "Rock" },
            { artist: "Weezer", title: "Buddy Holly", genre: "Rock" },
            { artist: "Blink-182", title: "All the Small Things", genre: "Rock" },
            { artist: "Fall Out Boy", title: "Sugar, We're Goin Down", genre: "Rock" },
            { artist: "Paramore", title: "Misery Business", genre: "Rock" }
        ];
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    generatePopPlaylist() {
        this.playlist = [
            // Modern Pop
            { artist: "Taylor Swift", title: "Shake It Off", genre: "Pop" },
            { artist: "Ariana Grande", title: "thank u, next", genre: "Pop" },
            { artist: "Billie Eilish", title: "bad guy", genre: "Pop" },
            { artist: "Dua Lipa", title: "Don't Start Now", genre: "Pop" },
            { artist: "The Weeknd", title: "Blinding Lights", genre: "Pop" },
            { artist: "Harry Styles", title: "Watermelon Sugar", genre: "Pop" },
            { artist: "Olivia Rodrigo", title: "good 4 u", genre: "Pop" },
            { artist: "Doja Cat", title: "Say So", genre: "Pop" },
            { artist: "Lizzo", title: "Truth Hurts", genre: "Pop" },
            { artist: "Lorde", title: "Royals", genre: "Pop" },
            
            // Pop Classics
            { artist: "Michael Jackson", title: "Billie Jean", genre: "Pop" },
            { artist: "Madonna", title: "Like a Prayer", genre: "Pop" },
            { artist: "Prince", title: "Purple Rain", genre: "Pop" },
            { artist: "Whitney Houston", title: "I Wanna Dance with Somebody", genre: "Pop" },
            { artist: "Britney Spears", title: "Toxic", genre: "Pop" },
            { artist: "Justin Timberlake", title: "Can't Stop the Feeling", genre: "Pop" },
            { artist: "Lady Gaga", title: "Bad Romance", genre: "Pop" },
            { artist: "Katy Perry", title: "Firework", genre: "Pop" },
            { artist: "Rihanna", title: "Umbrella", genre: "Pop" },
            { artist: "Beyoncé", title: "Crazy in Love", genre: "Pop" },
            
            // Contemporary Pop
            { artist: "Ed Sheeran", title: "Shape of You", genre: "Pop" },
            { artist: "Bruno Mars", title: "Uptown Funk", genre: "Pop" },
            { artist: "Adele", title: "Rolling in the Deep", genre: "Pop" },
            { artist: "Sam Smith", title: "Stay with Me", genre: "Pop" },
            { artist: "Shawn Mendes", title: "Stitches", genre: "Pop" },
            { artist: "Camila Cabello", title: "Havana", genre: "Pop" },
            { artist: "Charlie Puth", title: "Attention", genre: "Pop" },
            { artist: "Selena Gomez", title: "Lose You to Love Me", genre: "Pop" },
            { artist: "Halsey", title: "Without Me", genre: "Pop" },
            { artist: "Jonas Brothers", title: "Sucker", genre: "Pop" }
        ];
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    generateHipHopPlaylist() {
        this.playlist = [
            // Modern Hip Hop
            { artist: "Drake", title: "God's Plan", genre: "Hip Hop" },
            { artist: "Kendrick Lamar", title: "HUMBLE", genre: "Hip Hop" },
            { artist: "Post Malone", title: "Circles", genre: "Hip Hop" },
            { artist: "Travis Scott", title: "SICKO MODE", genre: "Hip Hop" },
            { artist: "Cardi B", title: "Bodak Yellow", genre: "Hip Hop" },
            { artist: "Megan Thee Stallion", title: "Savage", genre: "Hip Hop" },
            { artist: "Lil Nas X", title: "Old Town Road", genre: "Hip Hop" },
            { artist: "21 Savage", title: "a lot", genre: "Hip Hop" },
            { artist: "Future", title: "Mask Off", genre: "Hip Hop" },
            { artist: "Lil Baby", title: "Drip Too Hard", genre: "Hip Hop" },
            
            // Classic Hip Hop
            { artist: "Notorious B.I.G.", title: "Juicy", genre: "Hip Hop" },
            { artist: "Tupac", title: "California Love", genre: "Hip Hop" },
            { artist: "Dr. Dre", title: "Still D.R.E.", genre: "Hip Hop" },
            { artist: "Snoop Dogg", title: "Gin and Juice", genre: "Hip Hop" },
            { artist: "Eminem", title: "Lose Yourself", genre: "Hip Hop" },
            { artist: "Jay-Z", title: "Empire State of Mind", genre: "Hip Hop" },
            { artist: "Kanye West", title: "Stronger", genre: "Hip Hop" },
            { artist: "50 Cent", title: "In Da Club", genre: "Hip Hop" },
            { artist: "OutKast", title: "Hey Ya", genre: "Hip Hop" },
            { artist: "Nas", title: "N.Y. State of Mind", genre: "Hip Hop" },
            
            // Contemporary Hip Hop
            { artist: "J. Cole", title: "No Role Modelz", genre: "Hip Hop" },
            { artist: "A$AP Rocky", title: "Praise the Lord", genre: "Hip Hop" },
            { artist: "Tyler, The Creator", title: "Earfquake", genre: "Hip Hop" },
            { artist: "Childish Gambino", title: "This Is America", genre: "Hip Hop" },
            { artist: "Logic", title: "1-800-273-8255", genre: "Hip Hop" },
            { artist: "Mac Miller", title: "Self Care", genre: "Hip Hop" },
            { artist: "Juice WRLD", title: "Lucid Dreams", genre: "Hip Hop" },
            { artist: "XXXTentacion", title: "SAD", genre: "Hip Hop" },
            { artist: "Lil Uzi Vert", title: "XO Tour Llif3", genre: "Hip Hop" },
            { artist: "Playboi Carti", title: "Magnolia", genre: "Hip Hop" }
        ];
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    generateElectronicPlaylist() {
        this.playlist = [
            // EDM/Dance
            { artist: "Daft Punk", title: "Get Lucky", genre: "Electronic" },
            { artist: "Calvin Harris", title: "Summer", genre: "Electronic" },
            { artist: "The Chainsmokers", title: "Closer", genre: "Electronic" },
            { artist: "Avicii", title: "Wake Me Up", genre: "Electronic" },
            { artist: "Zedd", title: "Clarity", genre: "Electronic" },
            { artist: "David Guetta", title: "Titanium", genre: "Electronic" },
            { artist: "Marshmello", title: "Happier", genre: "Electronic" },
            { artist: "Kygo", title: "Firestone", genre: "Electronic" },
            { artist: "Martin Garrix", title: "Animals", genre: "Electronic" },
            { artist: "Tiësto", title: "Red Lights", genre: "Electronic" },
            
            // House/Techno
            { artist: "Swedish House Mafia", title: "Don't You Worry Child", genre: "Electronic" },
            { artist: "Deadmau5", title: "Ghosts 'n' Stuff", genre: "Electronic" },
            { artist: "Skrillex", title: "Bangarang", genre: "Electronic" },
            { artist: "Diplo", title: "Revolution", genre: "Electronic" },
            { artist: "Major Lazer", title: "Lean On", genre: "Electronic" },
            { artist: "Disclosure", title: "Latch", genre: "Electronic" },
            { artist: "Flume", title: "Never Be Like You", genre: "Electronic" },
            { artist: "ODESZA", title: "Say My Name", genre: "Electronic" },
            { artist: "Porter Robinson", title: "Shelter", genre: "Electronic" },
            { artist: "Madeon", title: "Pop Culture", genre: "Electronic" },
            
            // Electronic Pop
            { artist: "CHVRCHES", title: "The Mother We Share", genre: "Electronic" },
            { artist: "M83", title: "Midnight City", genre: "Electronic" },
            { artist: "Empire of the Sun", title: "Alive", genre: "Electronic" },
            { artist: "Passion Pit", title: "Take a Walk", genre: "Electronic" },
            { artist: "MGMT", title: "Electric Feel", genre: "Electronic" },
            { artist: "Foster the People", title: "Pumped Up Kicks", genre: "Electronic" },
            { artist: "Two Door Cinema Club", title: "What You Know", genre: "Electronic" },
            { artist: "Phoenix", title: "1901", genre: "Electronic" },
            { artist: "Justice", title: "D.A.N.C.E.", genre: "Electronic" },
            { artist: "The Midnight", title: "Los Angeles", genre: "Electronic" }
        ];
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    generateJazzPlaylist() {
        this.playlist = [
            // Classic Jazz
            { artist: "Miles Davis", title: "So What", genre: "Jazz" },
            { artist: "John Coltrane", title: "A Love Supreme", genre: "Jazz" },
            { artist: "Louis Armstrong", title: "What a Wonderful World", genre: "Jazz" },
            { artist: "Ella Fitzgerald", title: "Summertime", genre: "Jazz" },
            { artist: "Duke Ellington", title: "Take the 'A' Train", genre: "Jazz" },
            { artist: "Billie Holiday", title: "Strange Fruit", genre: "Jazz" },
            { artist: "Charlie Parker", title: "Ornithology", genre: "Jazz" },
            { artist: "Dizzy Gillespie", title: "A Night in Tunisia", genre: "Jazz" },
            { artist: "Thelonious Monk", title: "Round Midnight", genre: "Jazz" },
            { artist: "Dave Brubeck", title: "Take Five", genre: "Jazz" },
            
            // Vocal Jazz
            { artist: "Frank Sinatra", title: "Fly Me to the Moon", genre: "Jazz" },
            { artist: "Nat King Cole", title: "Unforgettable", genre: "Jazz" },
            { artist: "Sarah Vaughan", title: "Misty", genre: "Jazz" },
            { artist: "Nina Simone", title: "Feeling Good", genre: "Jazz" },
            { artist: "Tony Bennett", title: "I Left My Heart in San Francisco", genre: "Jazz" },
            { artist: "Dinah Washington", title: "What a Diff'rence a Day Makes", genre: "Jazz" },
            { artist: "Chet Baker", title: "My Funny Valentine", genre: "Jazz" },
            { artist: "Peggy Lee", title: "Fever", genre: "Jazz" },
            { artist: "Diana Krall", title: "The Look of Love", genre: "Jazz" },
            { artist: "Norah Jones", title: "Don't Know Why", genre: "Jazz" },
            
            // Contemporary Jazz
            { artist: "Snarky Puppy", title: "Lingus", genre: "Jazz" },
            { artist: "Robert Glasper", title: "Black Radio", genre: "Jazz" },
            { artist: "Kamasi Washington", title: "Truth", genre: "Jazz" },
            { artist: "Esperanza Spalding", title: "Black Gold", genre: "Jazz" },
            { artist: "Thundercat", title: "Them Changes", genre: "Jazz" },
            { artist: "GoGo Penguin", title: "Hopopono", genre: "Jazz" },
            { artist: "Hiatus Kaiyote", title: "Breathing Underwater", genre: "Jazz" },
            { artist: "BadBadNotGood", title: "Time Moves Slow", genre: "Jazz" },
            { artist: "Christian Scott", title: "Isadora", genre: "Jazz" },
            { artist: "Gregory Porter", title: "Liquid Spirit", genre: "Jazz" }
        ];
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    generateClassicalPlaylist() {
        this.playlist = [
            // Baroque
            { artist: "Johann Sebastian Bach", title: "Toccata and Fugue in D Minor", genre: "Classical" },
            { artist: "Antonio Vivaldi", title: "The Four Seasons: Spring", genre: "Classical" },
            { artist: "George Frideric Handel", title: "Messiah: Hallelujah Chorus", genre: "Classical" },
            { artist: "Johann Pachelbel", title: "Canon in D", genre: "Classical" },
            
            // Classical Period
            { artist: "Wolfgang Amadeus Mozart", title: "Symphony No. 40", genre: "Classical" },
            { artist: "Wolfgang Amadeus Mozart", title: "Eine kleine Nachtmusik", genre: "Classical" },
            { artist: "Ludwig van Beethoven", title: "Symphony No. 5", genre: "Classical" },
            { artist: "Ludwig van Beethoven", title: "Für Elise", genre: "Classical" },
            { artist: "Ludwig van Beethoven", title: "Moonlight Sonata", genre: "Classical" },
            { artist: "Joseph Haydn", title: "Symphony No. 94 'Surprise'", genre: "Classical" },
            
            // Romantic
            { artist: "Frédéric Chopin", title: "Nocturne Op. 9 No. 2", genre: "Classical" },
            { artist: "Pyotr Ilyich Tchaikovsky", title: "Swan Lake", genre: "Classical" },
            { artist: "Pyotr Ilyich Tchaikovsky", title: "1812 Overture", genre: "Classical" },
            { artist: "Johannes Brahms", title: "Hungarian Dance No. 5", genre: "Classical" },
            { artist: "Franz Schubert", title: "Ave Maria", genre: "Classical" },
            { artist: "Richard Wagner", title: "Ride of the Valkyries", genre: "Classical" },
            { artist: "Giuseppe Verdi", title: "La Traviata: Brindisi", genre: "Classical" },
            { artist: "Giacomo Puccini", title: "Nessun Dorma", genre: "Classical" },
            
            // Modern Classical
            { artist: "Claude Debussy", title: "Clair de Lune", genre: "Classical" },
            { artist: "Maurice Ravel", title: "Boléro", genre: "Classical" },
            { artist: "Igor Stravinsky", title: "The Rite of Spring", genre: "Classical" },
            { artist: "Sergei Rachmaninoff", title: "Piano Concerto No. 2", genre: "Classical" },
            { artist: "Gustav Holst", title: "The Planets: Mars", genre: "Classical" },
            { artist: "Edward Elgar", title: "Pomp and Circumstance", genre: "Classical" },
            { artist: "Samuel Barber", title: "Adagio for Strings", genre: "Classical" },
            { artist: "Aaron Copland", title: "Appalachian Spring", genre: "Classical" },
            { artist: "George Gershwin", title: "Rhapsody in Blue", genre: "Classical" },
            { artist: "Leonard Bernstein", title: "West Side Story: Overture", genre: "Classical" },
            { artist: "Philip Glass", title: "Glassworks", genre: "Classical" },
            { artist: "Max Richter", title: "On the Nature of Daylight", genre: "Classical" }
        ];
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    generateCountryPlaylist() {
        this.playlist = [
            // Classic Country
            { artist: "Johnny Cash", title: "Ring of Fire", genre: "Country" },
            { artist: "Dolly Parton", title: "Jolene", genre: "Country" },
            { artist: "Willie Nelson", title: "On the Road Again", genre: "Country" },
            { artist: "Patsy Cline", title: "Crazy", genre: "Country" },
            { artist: "Hank Williams", title: "I'm So Lonesome I Could Cry", genre: "Country" },
            { artist: "Merle Haggard", title: "Okie from Muskogee", genre: "Country" },
            { artist: "Loretta Lynn", title: "Coal Miner's Daughter", genre: "Country" },
            { artist: "George Jones", title: "He Stopped Loving Her Today", genre: "Country" },
            { artist: "Waylon Jennings", title: "Luckenbach, Texas", genre: "Country" },
            { artist: "Tammy Wynette", title: "Stand by Your Man", genre: "Country" },
            
            // 90s Country
            { artist: "Garth Brooks", title: "Friends in Low Places", genre: "Country" },
            { artist: "Shania Twain", title: "Man! I Feel Like a Woman", genre: "Country" },
            { artist: "Alan Jackson", title: "Chattahoochee", genre: "Country" },
            { artist: "Reba McEntire", title: "Fancy", genre: "Country" },
            { artist: "Brooks & Dunn", title: "Boot Scootin' Boogie", genre: "Country" },
            { artist: "Faith Hill", title: "Breathe", genre: "Country" },
            { artist: "Tim McGraw", title: "Live Like You Were Dying", genre: "Country" },
            { artist: "Toby Keith", title: "Should've Been a Cowboy", genre: "Country" },
            
            // Modern Country
            { artist: "Luke Bryan", title: "Country Girl (Shake It for Me)", genre: "Country" },
            { artist: "Carrie Underwood", title: "Before He Cheats", genre: "Country" },
            { artist: "Blake Shelton", title: "God's Country", genre: "Country" },
            { artist: "Miranda Lambert", title: "The House That Built Me", genre: "Country" },
            { artist: "Kenny Chesney", title: "No Shoes, No Shirt, No Problems", genre: "Country" },
            { artist: "Jason Aldean", title: "Dirt Road Anthem", genre: "Country" },
            { artist: "Florida Georgia Line", title: "Cruise", genre: "Country" },
            { artist: "Kacey Musgraves", title: "Follow Your Arrow", genre: "Country" },
            { artist: "Chris Stapleton", title: "Tennessee Whiskey", genre: "Country" },
            { artist: "Maren Morris", title: "My Church", genre: "Country" },
            { artist: "Kane Brown", title: "Heaven", genre: "Country" },
            { artist: "Thomas Rhett", title: "Die a Happy Man", genre: "Country" }
        ];
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    generateRnBPlaylist() {
        this.playlist = [
            // Classic R&B
            { artist: "Marvin Gaye", title: "What's Going On", genre: "R&B" },
            { artist: "Aretha Franklin", title: "Respect", genre: "R&B" },
            { artist: "Stevie Wonder", title: "Superstition", genre: "R&B" },
            { artist: "Al Green", title: "Let's Stay Together", genre: "R&B" },
            { artist: "Smokey Robinson", title: "Cruisin'", genre: "R&B" },
            { artist: "The Temptations", title: "My Girl", genre: "R&B" },
            { artist: "Diana Ross", title: "Ain't No Mountain High Enough", genre: "R&B" },
            { artist: "James Brown", title: "I Got You (I Feel Good)", genre: "R&B" },
            { artist: "Otis Redding", title: "Sittin' On the Dock of the Bay", genre: "R&B" },
            { artist: "Sam Cooke", title: "A Change Is Gonna Come", genre: "R&B" },
            
            // 90s/2000s R&B
            { artist: "Usher", title: "Yeah!", genre: "R&B" },
            { artist: "Alicia Keys", title: "Fallin'", genre: "R&B" },
            { artist: "Mary J. Blige", title: "Be Without You", genre: "R&B" },
            { artist: "R. Kelly", title: "I Believe I Can Fly", genre: "R&B" },
            { artist: "TLC", title: "No Scrubs", genre: "R&B" },
            { artist: "Destiny's Child", title: "Say My Name", genre: "R&B" },
            { artist: "D'Angelo", title: "Untitled (How Does It Feel)", genre: "R&B" },
            { artist: "Lauryn Hill", title: "Doo Wop (That Thing)", genre: "R&B" },
            { artist: "Maxwell", title: "Ascension (Don't Ever Wonder)", genre: "R&B" },
            { artist: "Erykah Badu", title: "On & On", genre: "R&B" },
            
            // Contemporary R&B
            { artist: "The Weeknd", title: "Earned It", genre: "R&B" },
            { artist: "H.E.R.", title: "Focus", genre: "R&B" },
            { artist: "Khalid", title: "Location", genre: "R&B" },
            { artist: "SZA", title: "The Weekend", genre: "R&B" },
            { artist: "Frank Ocean", title: "Thinkin Bout You", genre: "R&B" },
            { artist: "Miguel", title: "Adorn", genre: "R&B" },
            { artist: "Jhené Aiko", title: "The Worst", genre: "R&B" },
            { artist: "Anderson .Paak", title: "Come Down", genre: "R&B" },
            { artist: "Daniel Caesar", title: "Best Part", genre: "R&B" },
            { artist: "Jorja Smith", title: "Blue Lights", genre: "R&B" }
        ];
        this.playlist = this.playlist.sort(() => Math.random() - 0.5);
    }
    
    getStationInfo() {
        const stations = {
            'general': {
                title: '🎵 Music Radio',
                subtitle: 'Discover new music • 30-second previews'
            },
            'christmas': {
                title: '🎄 Christmas Radio',
                subtitle: 'Holiday classics & modern favorites • 30-second previews'
            },
            'rock': {
                title: '🎸 Rock Radio',
                subtitle: 'Classic & modern rock anthems • 30-second previews'
            },
            'pop': {
                title: '🎤 Pop Radio',
                subtitle: 'Chart-topping pop hits • 30-second previews'
            },
            'hiphop': {
                title: '🎧 Hip Hop Radio',
                subtitle: 'Classic & contemporary rap • 30-second previews'
            },
            'electronic': {
                title: '🔊 Electronic Radio',
                subtitle: 'EDM, house & electronic beats • 30-second previews'
            },
            'jazz': {
                title: '🎷 Jazz Radio',
                subtitle: 'Classic & contemporary jazz • 30-second previews'
            },
            'classical': {
                title: '🎻 Classical Radio',
                subtitle: 'Timeless orchestral masterpieces • 30-second previews'
            },
            'country': {
                title: '🤠 Country Radio',
                subtitle: 'Classic & modern country hits • 30-second previews'
            },
            'rnb': {
                title: '💿 R&B Radio',
                subtitle: 'Soul, funk & contemporary R&B • 30-second previews'
            }
        };
        return stations[this.station] || stations['general'];
    }
    
    async render() {
        const stationInfo = this.getStationInfo();
        const stationTitle = stationInfo.title;
        const stationSubtitle = stationInfo.subtitle;
        
        this.container.innerHTML = `
            <div class="music-radio">
                <div class="radio-header">
                    <h2>${stationTitle}</h2>
                    <p class="radio-subtitle">${stationSubtitle}</p>
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
                            <button class="control-btn skip-btn" id="prev-btn" title="Previous" disabled style="display: none;">
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
                            <button class="control-btn skip-btn" id="next-btn" title="Skip" style="display: none;">
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
        if (!playBtn) return;
        
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        
        if (!this.currentTrack) {
            // Load first track
            this.isLoading = true;
            playBtn.classList.add('loading');
            
            // Try up to 5 tracks with delays between attempts
            let attempts = 0;
            const maxAttempts = 5;
            let success = false;
            
            while (attempts < maxAttempts && this.currentTrackIndex < this.playlist.length) {
                try {
                    await this.loadTrack(this.currentTrackIndex);
                    success = true;
                    break; // Success, exit loop
                } catch (error) {
                    console.error(`Attempt ${attempts + 1}/${maxAttempts} failed:`, error.message);
                    this.currentTrackIndex++;
                    attempts++;
                    
                    // Add delay between attempts to prevent rapid cycling
                    if (attempts < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }
            
            playBtn.classList.remove('loading');
            this.isLoading = false;
            
            // Show error in UI instead of alert if all attempts failed
            if (!success) {
                console.error('❌ Failed to load any tracks after', maxAttempts, 'attempts');
                const artworkEl = document.getElementById('track-artwork');
                if (artworkEl) {
                    artworkEl.innerHTML = `
                        <div style="padding: 30px; text-align: center; color: var(--color-layer, #ff6b6b);">
                            <p style="font-size: 18px; margin-bottom: 10px;">⚠️ Unable to Load Music</p>
                            <p style="font-size: 12px; opacity: 0.8;">iTunes previews unavailable</p>
                            <p style="font-size: 12px; margin-top: 10px;">Try another station or refresh</p>
                        </div>
                    `;
                }
                document.getElementById('track-title').textContent = 'No tracks available';
                document.getElementById('track-artist').textContent = 'Please try another station';
                return;
            }
        }
        
        if (this.currentAudio) {
            try {
                await this.currentAudio.play();
                this.isPlaying = true;
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
                const artworkEl = document.getElementById('track-artwork');
                if (artworkEl) artworkEl.classList.add('playing');
                this.startProgressUpdate();
            } catch (error) {
                console.error('❌ Error playing audio:', error);
                // Don't auto-skip on play error - let user retry
                this.isLoading = false;
            }
        }
    }
    
    pause() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.isPlaying = false;
            const playBtn = document.getElementById('play-btn');
            if (playBtn) {
                const playIcon = playBtn.querySelector('.play-icon');
                const pauseIcon = playBtn.querySelector('.pause-icon');
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
            }
            const artworkEl = document.getElementById('track-artwork');
            if (artworkEl) artworkEl.classList.remove('playing');
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
        
        // Update UI with null checks
        const titleEl = document.getElementById('track-title');
        const artistEl = document.getElementById('track-artist');
        const genreEl = document.getElementById('genre-badge');
        
        if (titleEl) titleEl.textContent = track.title;
        if (artistEl) artistEl.textContent = track.artist;
        if (genreEl) genreEl.textContent = track.genre;
        
        // Check if liked or disliked
        const isLiked = this.likedTracks.some(t => t.artist === track.artist && t.title === track.title);
        const isDisliked = this.dislikedTracks.some(t => t.artist === track.artist && t.title === track.title);
        
        const likeBtn = document.getElementById('like-btn');
        const dislikeBtn = document.getElementById('dislike-btn');
        const repeatBtn = document.getElementById('repeat-btn');
        const prevBtn = document.getElementById('prev-btn');
        
        if (likeBtn) likeBtn.classList.toggle('active', isLiked);
        if (dislikeBtn) dislikeBtn.classList.toggle('active', isDisliked);
        if (repeatBtn) repeatBtn.classList.remove('active');
        if (prevBtn) prevBtn.disabled = this.currentTrackIndex === 0;
        
        // Fetch preview from iTunes
        try {
            const searchQuery = encodeURIComponent(`${track.artist} ${track.title}`);
            const itunesUrl = `https://itunes.apple.com/search?term=${searchQuery}&media=music&entity=song&limit=5`;
            
            console.log(`🎵 Searching iTunes for: ${track.artist} - ${track.title}`);
            
            // Try direct iTunes API first
            let response = await fetch(itunesUrl);
            let data;
            
            // If direct call fails, try with CORS proxy
            if (!response.ok) {
                console.log('⚠️ Direct iTunes API failed, trying CORS proxy...');
                response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(itunesUrl)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const proxyData = await response.json();
                data = JSON.parse(proxyData.contents);
            } else {
                data = await response.json();
            }
            
            console.log(`📊 iTunes results: ${data.results?.length || 0} found`);
            
            if (data.results && data.results.length > 0) {
                const result = data.results.find(r => r.previewUrl) || data.results[0];
                
                if (result.previewUrl) {
                    console.log(`✅ Preview URL found: ${result.trackName || track.title}`);
                    
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
                    
                    // Error handling for audio loading
                    this.currentAudio.addEventListener('error', (e) => {
                        console.error(`❌ Audio load error for ${track.title}:`, e);
                        this.skipTrack();
                    });
                    
                    this.isLoading = false;
                    this.updateQueue();
                    
                } else {
                    console.warn(`⚠️ No preview URL in results for: ${track.artist} - ${track.title}`);
                    throw new Error('No preview URL available for this track');
                }
            } else {
                console.warn(`⚠️ No iTunes results for: ${track.artist} - ${track.title}`);
                throw new Error('No results found from iTunes');
            }
        } catch (error) {
            console.error(`❌ Error loading track "${track.artist} - ${track.title}":`, error.message);
            // Don't show error UI or auto-skip - let the retry logic handle it
            this.isLoading = false;
            throw error;
        }
    }
    
    async skipTrack() {
        this.currentTrackIndex++;
        this.pause();
        this.currentTrack = null;
        this.currentAudio = null;
        
        const progressFill = document.getElementById('progress-fill');
        const currentTime = document.getElementById('current-time');
        const artwork = document.getElementById('track-artwork');
        
        if (progressFill) progressFill.style.width = '0%';
        if (currentTime) currentTime.textContent = '0:00';
        if (artwork) {
            artwork.innerHTML = `
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
            `;
            artwork.classList.remove('playing');
        }
        await this.play();
    }
    
    async previousTrack() {
        if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
            this.pause();
            this.currentTrack = null;
            this.currentAudio = null;
            
            const progressFill = document.getElementById('progress-fill');
            const currentTime = document.getElementById('current-time');
            const artwork = document.getElementById('track-artwork');
            
            if (progressFill) progressFill.style.width = '0%';
            if (currentTime) currentTime.textContent = '0:00';
            if (artwork) {
                artwork.innerHTML = `
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
                `;
                artwork.classList.remove('playing');
            }
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
    
    destroy() {
        // Stop playback and clean up audio resources
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.src = '';
            this.currentAudio = null;
        }
        
        // Clear progress interval
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        // Reset state
        this.isPlaying = false;
        this.isLoading = false;
        this.currentTrack = null;
        
        console.log('🛑 Music radio stopped');
    }
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.MusicRadio = MusicRadio;
}
