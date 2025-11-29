class NGAGallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            apiBase: 'https://api.nga.gov/v1',
            itemsPerPage: options.itemsPerPage || 20,
            showImages: options.showImages !== false,
            ...options
        };
        this.currentPage = 1;
        this.isLoading = false;
        this.artworks = [];
        this.hasMorePages = true;
    }

    async loadFineArt(query = '', page = 1) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            const allSampleArtworks = [
                {
                    id: 1,
                    title: "Girl with a Pearl Earring",
                    attribution: "Johannes Vermeer",
                    displaydate: "c. 1665",
                    medium: "Oil on canvas",
                    dimensions: "44.5 cm × 39 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1024px-1665_Girl_with_a_Pearl_Earring.jpg" }
                    },
                    description: "This masterpiece showcases Vermeer's exceptional ability to capture light and intimate human moments."
                },
                {
                    id: 2,
                    title: "The Starry Night",
                    attribution: "Vincent van Gogh",
                    displaydate: "1889",
                    medium: "Oil on canvas",
                    dimensions: "73.7 cm × 92.1 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" }
                    },
                    description: "Van Gogh's swirling night sky over a French village, painted during his stay at an asylum."
                },
                {
                    id: 3,
                    title: "The Birth of Venus",
                    attribution: "Sandro Botticelli",
                    displaydate: "c. 1484–1486",
                    medium: "Tempera on canvas",
                    dimensions: "172.5 cm × 278.9 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg" }
                    },
                    description: "Botticelli's Renaissance masterpiece depicting the Roman goddess Venus emerging from the sea."
                },
                {
                    id: 4,
                    title: "Woman with a Parasol",
                    attribution: "Claude Monet",
                    displaydate: "1875",
                    medium: "Oil on canvas",
                    dimensions: "100 cm × 81 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg/1024px-Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg" }
                    },
                    description: "Monet's impressionist portrait of his wife Camille and their son Jean in a sunny field."
                },
                {
                    id: 5,
                    title: "The Great Wave off Kanagawa",
                    attribution: "Katsushika Hokusai",
                    displaydate: "c. 1831",
                    medium: "Woodblock print",
                    dimensions: "25.7 cm × 37.9 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg" }
                    },
                    description: "The iconic Japanese woodblock print depicting a great wave threatening boats off Kanagawa."
                },
                {
                    id: 6,
                    title: "American Gothic",
                    attribution: "Grant Wood",
                    displaydate: "1930",
                    medium: "Oil on beaverboard",
                    dimensions: "78 cm × 65.3 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/1024px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg" }
                    },
                    description: "Wood's famous depiction of a farmer and his daughter standing in front of their Iowa home."
                },
                {
                    id: 7,
                    title: "The Persistence of Memory",
                    attribution: "Salvador Dalí",
                    displaydate: "1931",
                    medium: "Oil on canvas",
                    dimensions: "24 cm × 33 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/1280px-The_Persistence_of_Memory.jpg" }
                    },
                    description: "Dalí's surrealist masterpiece featuring melting clocks in a dreamlike landscape."
                },
                {
                    id: 8,
                    title: "Liberty Leading the People",
                    attribution: "Eugène Delacroix",
                    displaydate: "1830",
                    medium: "Oil on canvas",
                    dimensions: "260 cm × 325 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Eugène_Delacroix_-_La_liberté_guidant_le_peuple.jpg/1280px-Eugène_Delacroix_-_La_liberté_guidant_le_peuple.jpg" }
                    },
                    description: "Delacroix's romantic painting commemorating the July Revolution of 1830 in France."
                },
                {
                    id: 9,
                    title: "The Scream",
                    attribution: "Edvard Munch",
                    displaydate: "1893",
                    medium: "Oil, tempera, and pastel on cardboard",
                    dimensions: "91 cm × 73.5 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/1024px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg" }
                    },
                    description: "Munch's expressionist masterpiece depicting a figure with an agonized expression against a tumultuous sky."
                },
                {
                    id: 10,
                    title: "The Last Supper",
                    attribution: "Leonardo da Vinci",
                    displaydate: "1495–1498",
                    medium: "Tempera on gesso, pitch, and mastic",
                    dimensions: "460 cm × 880 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/1280px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg" }
                    },
                    description: "Da Vinci's iconic depiction of Jesus's final meal with his disciples before his crucifixion."
                },
                {
                    id: 11,
                    title: "Mona Lisa",
                    attribution: "Leonardo da Vinci",
                    displaydate: "c. 1503–1519",
                    medium: "Oil on poplar panel",
                    dimensions: "77 cm × 53 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1024px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg" }
                    },
                    description: "The world's most famous portrait, known for her enigmatic smile and da Vinci's masterful technique."
                },
                {
                    id: 12,
                    title: "The Night Watch",
                    attribution: "Rembrandt van Rijn",
                    displaydate: "1642",
                    medium: "Oil on canvas",
                    dimensions: "363 cm × 437 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_HD.jpg/1280px-The_Night_Watch_-_HD.jpg" }
                    },
                    description: "Rembrandt's masterpiece of Dutch Golden Age painting depicting a city militia in action."
                },
                {
                    id: 13,
                    title: "Guernica",
                    attribution: "Pablo Picasso",
                    displaydate: "1937",
                    medium: "Oil on canvas",
                    dimensions: "349 cm × 776 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/1280px-PicassoGuernica.jpg" }
                    },
                    description: "Picasso's powerful anti-war painting depicting the bombing of Guernica during the Spanish Civil War."
                },
                {
                    id: 14,
                    title: "The Kiss",
                    attribution: "Gustav Klimt",
                    displaydate: "1907–1908",
                    medium: "Oil and gold leaf on canvas",
                    dimensions: "180 cm × 180 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gustav_Klimt_016.jpg/1024px-Gustav_Klimt_016.jpg" }
                    },
                    description: "Klimt's golden masterpiece of the Art Nouveau period, depicting an embracing couple."
                },
                {
                    id: 15,
                    title: "The Creation of Adam",
                    attribution: "Michelangelo",
                    displaydate: "1508–1512",
                    medium: "Fresco",
                    dimensions: "280 cm × 570 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/1280px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg" }
                    },
                    description: "The iconic Sistine Chapel ceiling fresco depicting God giving life to Adam."
                },
                {
                    id: 16,
                    title: "Water Lilies",
                    attribution: "Claude Monet",
                    displaydate: "1916",
                    medium: "Oil on canvas",
                    dimensions: "200 cm × 425 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg" }
                    },
                    description: "Part of Monet's famous series capturing his water garden at Giverny in various lights."
                },
                {
                    id: 17,
                    title: "Las Meninas",
                    attribution: "Diego Velázquez",
                    displaydate: "1656",
                    medium: "Oil on canvas",
                    dimensions: "318 cm × 276 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/1024px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg" }
                    },
                    description: "Velázquez's complex masterpiece depicting the Spanish royal family and the artist himself."
                },
                {
                    id: 18,
                    title: "The Garden of Earthly Delights",
                    attribution: "Hieronymus Bosch",
                    displaydate: "1490–1510",
                    medium: "Oil on oak panels",
                    dimensions: "220 cm × 389 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Garden_of_earthly_delights.jpg/1280px-The_Garden_of_earthly_delights.jpg" }
                    },
                    description: "Bosch's fantastical triptych depicting paradise, earthly pleasures, and hell."
                },
                {
                    id: 19,
                    title: "Impression, Sunrise",
                    attribution: "Claude Monet",
                    displaydate: "1872",
                    medium: "Oil on canvas",
                    dimensions: "48 cm × 63 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg" }
                    },
                    description: "The painting that gave the Impressionist movement its name, depicting Le Havre harbor at sunrise."
                },
                {
                    id: 20,
                    title: "The School of Athens",
                    attribution: "Raphael",
                    displaydate: "1509–1511",
                    medium: "Fresco",
                    dimensions: "500 cm × 770 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg" }
                    },
                    description: "Raphael's Renaissance fresco depicting ancient philosophers including Plato and Aristotle."
                },
                {
                    id: 21,
                    title: "Composition VIII",
                    attribution: "Wassily Kandinsky",
                    displaydate: "1923",
                    medium: "Oil on canvas",
                    dimensions: "140 cm × 201 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg/1280px-Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg" }
                    },
                    description: "Kandinsky's pioneering abstract work featuring geometric shapes and vibrant colors."
                },
                {
                    id: 22,
                    title: "The Son of Man",
                    attribution: "René Magritte",
                    displaydate: "1964",
                    medium: "Oil on canvas",
                    dimensions: "116 cm × 89 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/en/e/e5/Magritte_TheSonOfMan.jpg" }
                    },
                    description: "Magritte's surrealist self-portrait of a man in a bowler hat with his face obscured by an apple."
                },
                {
                    id: 23,
                    title: "Nighthawks",
                    attribution: "Edward Hopper",
                    displaydate: "1942",
                    medium: "Oil on canvas",
                    dimensions: "84 cm × 152 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/1280px-Nighthawks_by_Edward_Hopper_1942.jpg" }
                    },
                    description: "Hopper's iconic depiction of urban isolation in a late-night American diner."
                },
                {
                    id: 24,
                    title: "The Arnolfini Portrait",
                    attribution: "Jan van Eyck",
                    displaydate: "1434",
                    medium: "Oil on oak panel",
                    dimensions: "82 cm × 60 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Van_Eyck_-_Arnolfini_Portrait.jpg/1024px-Van_Eyck_-_Arnolfini_Portrait.jpg" }
                    },
                    description: "Van Eyck's masterpiece of Northern Renaissance art depicting a wealthy merchant and his wife."
                },
                {
                    id: 25,
                    title: "A Sunday Afternoon on the Island of La Grande Jatte",
                    attribution: "Georges Seurat",
                    displaydate: "1884–1886",
                    medium: "Oil on canvas",
                    dimensions: "207 cm × 308 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg" }
                    },
                    description: "Seurat's pointillist masterpiece depicting Parisians relaxing in a suburban park."
                },
                {
                    id: 26,
                    title: "The Swing",
                    attribution: "Jean-Honoré Fragonard",
                    displaydate: "1767",
                    medium: "Oil on canvas",
                    dimensions: "81 cm × 64 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Jean-Honor%C3%A9_Fragonard_-_The_Swing.jpg/1024px-Jean-Honor%C3%A9_Fragonard_-_The_Swing.jpg" }
                    },
                    description: "Fragonard's playful Rococo masterpiece depicting a young woman on a swing in a garden."
                },
                {
                    id: 27,
                    title: "Wanderer above the Sea of Fog",
                    attribution: "Caspar David Friedrich",
                    displaydate: "1818",
                    medium: "Oil on canvas",
                    dimensions: "95 cm × 75 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/1024px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg" }
                    },
                    description: "Friedrich's Romantic masterpiece showing a man contemplating a misty mountain landscape."
                },
                {
                    id: 28,
                    title: "The Hay Wain",
                    attribution: "John Constable",
                    displaydate: "1821",
                    medium: "Oil on canvas",
                    dimensions: "130 cm × 185 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/John_Constable_The_Hay_Wain.jpg/1280px-John_Constable_The_Hay_Wain.jpg" }
                    },
                    description: "Constable's beloved landscape painting of rural Suffolk depicting a hay wagon crossing a stream."
                },
                {
                    id: 29,
                    title: "Christina's World",
                    attribution: "Andrew Wyeth",
                    displaydate: "1948",
                    medium: "Tempera on panel",
                    dimensions: "82 cm × 121 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Christinasworld.jpg/1280px-Christinasworld.jpg" }
                    },
                    description: "Wyeth's haunting realist painting of a woman in a field looking toward a distant farmhouse."
                },
                {
                    id: 30,
                    title: "The Tower of Babel",
                    attribution: "Pieter Bruegel the Elder",
                    displaydate: "1563",
                    medium: "Oil on panel",
                    dimensions: "114 cm × 155 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg/1280px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg" }
                    },
                    description: "Bruegel's detailed depiction of the biblical Tower of Babel with its impossible architecture."
                },
                {
                    id: 31,
                    title: "The Third of May 1808",
                    attribution: "Francisco Goya",
                    displaydate: "1814",
                    medium: "Oil on canvas",
                    dimensions: "268 cm × 347 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/El_Tres_de_Mayo%2C_by_Francisco_de_Goya%2C_from_Prado_thin_black_margin.jpg/1280px-El_Tres_de_Mayo%2C_by_Francisco_de_Goya%2C_from_Prado_thin_black_margin.jpg" }
                    },
                    description: "Goya's powerful depiction of Spanish resistance fighters executed by French troops during the Peninsular War."
                },
                {
                    id: 32,
                    title: "Autumn Rhythm (Number 30)",
                    attribution: "Jackson Pollock",
                    displaydate: "1950",
                    medium: "Enamel on canvas",
                    dimensions: "266 cm × 525 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Autumn_Rhythm.jpg/1280px-Autumn_Rhythm.jpg" }
                    },
                    description: "Pollock's abstract expressionist drip painting showcasing his revolutionary action painting technique."
                },
                {
                    id: 33,
                    title: "The Death of Marat",
                    attribution: "Jacques-Louis David",
                    displaydate: "1793",
                    medium: "Oil on canvas",
                    dimensions: "165 cm × 128 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Death_of_Marat_by_David.jpg/1024px-Death_of_Marat_by_David.jpg" }
                    },
                    description: "David's neoclassical painting of revolutionary leader Jean-Paul Marat assassinated in his bathtub."
                },
                {
                    id: 34,
                    title: "Whistler's Mother",
                    attribution: "James McNeill Whistler",
                    displaydate: "1871",
                    medium: "Oil on canvas",
                    dimensions: "144 cm × 163 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Whistlers_Mother_high_res.jpg/1024px-Whistlers_Mother_high_res.jpg" }
                    },
                    description: "Whistler's iconic portrait formally titled 'Arrangement in Grey and Black No. 1'."
                },
                {
                    id: 35,
                    title: "The Fighting Temeraire",
                    attribution: "J.M.W. Turner",
                    displaydate: "1838",
                    medium: "Oil on canvas",
                    dimensions: "91 cm × 122 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg/1280px-The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg" }
                    },
                    description: "Turner's Romantic masterpiece depicting the warship HMS Temeraire being towed to be scrapped."
                },
                {
                    id: 36,
                    title: "Café Terrace at Night",
                    attribution: "Vincent van Gogh",
                    displaydate: "1888",
                    medium: "Oil on canvas",
                    dimensions: "81 cm × 65 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg/1024px-Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_%28Yorck%29.jpg" }
                    },
                    description: "Van Gogh's vibrant night scene of a café in Arles, one of his first starry night paintings."
                },
                {
                    id: 37,
                    title: "The Raft of the Medusa",
                    attribution: "Théodore Géricault",
                    displaydate: "1818–1819",
                    medium: "Oil on canvas",
                    dimensions: "491 cm × 716 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/JEAN_LOUIS_TH%C3%89ODORE_G%C3%89RICAULT_-_La_Balsa_de_la_Medusa_%28Museo_del_Louvre%2C_1818-19%29.jpg/1280px-JEAN_LOUIS_TH%C3%89ODORE_G%C3%89RICAULT_-_La_Balsa_de_la_Medusa_%28Museo_del_Louvre%2C_1818-19%29.jpg" }
                    },
                    description: "Géricault's dramatic depiction of survivors from the wreck of the French frigate Méduse."
                },
                {
                    id: 38,
                    title: "The Blue Boy",
                    attribution: "Thomas Gainsborough",
                    displaydate: "c. 1770",
                    medium: "Oil on canvas",
                    dimensions: "178 cm × 122 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Thomas_Gainsborough_-_The_Blue_Boy_%28The_Huntington_Library%2C_San_Marino_L.A.%29.jpg/1024px-Thomas_Gainsborough_-_The_Blue_Boy_%28The_Huntington_Library%2C_San_Marino_L.A.%29.jpg" }
                    },
                    description: "Gainsborough's iconic portrait of a young man in 17th-century costume rendered in striking blue."
                },
                {
                    id: 39,
                    title: "The Ambassadors",
                    attribution: "Hans Holbein the Younger",
                    displaydate: "1533",
                    medium: "Oil on oak",
                    dimensions: "207 cm × 209 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hans_Holbein_the_Younger_-_The_Ambassadors_-_Google_Art_Project.jpg/1024px-Hans_Holbein_the_Younger_-_The_Ambassadors_-_Google_Art_Project.jpg" }
                    },
                    description: "Holbein's double portrait famous for its anamorphic skull and Renaissance symbolism."
                },
                {
                    id: 40,
                    title: "The Calling of St Matthew",
                    attribution: "Caravaggio",
                    displaydate: "1599–1600",
                    medium: "Oil on canvas",
                    dimensions: "322 cm × 340 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Calling_of_Saint_Matthew-Caravaggo_%281599-1600%29.jpg/1280px-The_Calling_of_Saint_Matthew-Caravaggo_%281599-1600%29.jpg" }
                    },
                    description: "Caravaggio's Baroque masterpiece depicting Christ calling Matthew to discipleship."
                },
                {
                    id: 41,
                    title: "Olympia",
                    attribution: "Édouard Manet",
                    displaydate: "1863",
                    medium: "Oil on canvas",
                    dimensions: "130 cm × 190 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg/1280px-Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg" }
                    },
                    description: "Manet's controversial modernist reworking of the reclining nude that scandalized Paris."
                },
                {
                    id: 42,
                    title: "Dance at Le Moulin de la Galette",
                    attribution: "Pierre-Auguste Renoir",
                    displaydate: "1876",
                    medium: "Oil on canvas",
                    dimensions: "131 cm × 175 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Auguste_Renoir_-_Dance_at_Le_Moulin_de_la_Galette_-_Google_Art_Project.jpg/1280px-Auguste_Renoir_-_Dance_at_Le_Moulin_de_la_Galette_-_Google_Art_Project.jpg" }
                    },
                    description: "Renoir's joyful Impressionist scene of a Sunday afternoon dance in Montmartre."
                },
                {
                    id: 43,
                    title: "The Gleaners",
                    attribution: "Jean-François Millet",
                    displaydate: "1857",
                    medium: "Oil on canvas",
                    dimensions: "84 cm × 111 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Jean-Fran%C3%A7ois_Millet_%28II%29_-_Gleaners_-_Google_Art_Project.jpg/1280px-Jean-Fran%C3%A7ois_Millet_%28II%29_-_Gleaners_-_Google_Art_Project.jpg" }
                    },
                    description: "Millet's realist depiction of three peasant women gleaning a field after harvest."
                },
                {
                    id: 44,
                    title: "The Grand Canal, Venice",
                    attribution: "Canaletto",
                    displaydate: "c. 1730",
                    medium: "Oil on canvas",
                    dimensions: "46 cm × 63 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Giovanni_Antonio_Canal%2C_il_Canaletto_-_The_Grand_Canal_in_Venice_from_Palazzo_Flangini_to_Campo_San_Marcuola_-_Google_Art_Project.jpg/1280px-Giovanni_Antonio_Canal%2C_il_Canaletto_-_The_Grand_Canal_in_Venice_from_Palazzo_Flangini_to_Campo_San_Marcuola_-_Google_Art_Project.jpg" }
                    },
                    description: "Canaletto's luminous veduta capturing the architectural beauty of Venice's Grand Canal."
                },
                {
                    id: 45,
                    title: "No. 5, 1948",
                    attribution: "Jackson Pollock",
                    displaydate: "1948",
                    medium: "Oil on fiberboard",
                    dimensions: "244 cm × 122 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/No._5%2C_1948.jpg/800px-No._5%2C_1948.jpg" }
                    },
                    description: "Pollock's dense abstract expressionist work, once the world's most expensive painting."
                },
                {
                    id: 46,
                    title: "The Hunters in the Snow",
                    attribution: "Pieter Bruegel the Elder",
                    displaydate: "1565",
                    medium: "Oil on wood",
                    dimensions: "117 cm × 162 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Pieter_Bruegel_the_Elder_-_Hunters_in_the_Snow_%28Winter%29_-_Google_Art_Project.jpg/1280px-Pieter_Bruegel_the_Elder_-_Hunters_in_the_Snow_%28Winter%29_-_Google_Art_Project.jpg" }
                    },
                    description: "Bruegel's winter landscape masterpiece depicting hunters returning to a snow-covered village."
                },
                {
                    id: 47,
                    title: "The Sleeping Gypsy",
                    attribution: "Henri Rousseau",
                    displaydate: "1897",
                    medium: "Oil on canvas",
                    dimensions: "129 cm × 201 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/La_Boh%C3%A9mienne_endormie.jpg/1280px-La_Boh%C3%A9mienne_endormie.jpg" }
                    },
                    description: "Rousseau's dreamlike primitive painting of a sleeping woman with a curious lion in the moonlight."
                },
                {
                    id: 48,
                    title: "Saturn Devouring His Son",
                    attribution: "Francisco Goya",
                    displaydate: "1819–1823",
                    medium: "Mural transferred to canvas",
                    dimensions: "146 cm × 83 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Francisco_de_Goya%2C_Saturno_devorando_a_su_hijo_%281819-1823%29.jpg/1024px-Francisco_de_Goya%2C_Saturno_devorando_a_su_hijo_%281819-1823%29.jpg" }
                    },
                    description: "Goya's disturbing Black Painting depicting the Greek myth of Cronus consuming his children."
                },
                {
                    id: 49,
                    title: "Broadway Boogie Woogie",
                    attribution: "Piet Mondrian",
                    displaydate: "1942–1943",
                    medium: "Oil on canvas",
                    dimensions: "127 cm × 127 cm",
                    images: {
                        web: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Piet_Mondriaan_-_Broadway_Boogie-Woogie_-_1942-1943_-_Museum_of_Modern_Art%2C_New_York.jpg/1280px-Piet_Mondriaan_-_Broadway_Boogie-Woogie_-_1942-1943_-_Museum_of_Modern_Art%2C_New_York.jpg" }
                    },
                    description: "Mondrian's vibrant late work inspired by Manhattan's grid and the energy of boogie-woogie music."
                }
            ];

            // Simulate pagination by slicing the data
            const startIndex = (page - 1) * this.options.itemsPerPage;
            const endIndex = startIndex + this.options.itemsPerPage;
            let sampleArtworks = allSampleArtworks.slice(startIndex, endIndex);
            
            let filteredArtworks = sampleArtworks;

            if (page === 1) {
                this.artworks = filteredArtworks;
            } else {
                if (filteredArtworks.length > 0) {
                    this.artworks = [...this.artworks, ...filteredArtworks];
                }
            }

            // Check if there are more pages
            this.hasMorePages = endIndex < allSampleArtworks.length;
            this.currentPage = page;

            this.render();

        } catch (error) {
            console.error('Failed to load NGA artworks:', error);
            this.showError(`Failed to load artworks: ${error.message}`);
        } finally {
            this.isLoading = false;
        }
    }

    async loadMore() {
        if (!this.isLoading) {
            await this.loadFineArt('', this.currentPage + 1);
        }
    }

    render() {
        if (!this.artworks.length) {
            this.container.innerHTML = '<div class="nga-empty">No artworks found.</div>';
            return;
        }

        const artworksHtml = this.artworks.map(artwork => this.renderArtwork(artwork)).join('');
        
        const loadMoreHtml = this.hasMorePages ? `
            <div class="nga-load-more">
                <button onclick="window.ngaGallery.loadMore()" ${this.isLoading ? 'disabled' : ''}>
                    ${this.isLoading ? 'Loading...' : 'Load More Artworks'}
                </button>
            </div>
        ` : '';

        // Reset and render
        this.container.innerHTML = `
            <div class="nga-gallery">
                <div class="nga-header">
                    <h2>Fine Art Gallery</h2>
                    <p>Explore masterpieces from the National Gallery of Art's public domain collection</p>
                </div>
                <div class="nga-grid">
                    ${artworksHtml}
                </div>
                ${loadMoreHtml}
            </div>
        `;

        this.attachEventListeners();
        this.initializeFullScreenModal();
    }

    renderArtwork(artwork) {
        const imageUrl = artwork.images?.web?.url || artwork.images?.print?.url;
        const imageHtml = imageUrl ? 
            `<img src="${imageUrl}" alt="${artwork.title}" loading="lazy" class="nga-zoomable-image" data-artwork-id="${artwork.id}" />` : 
            '<div class="nga-no-image">No Image Available</div>';

        const artist = artwork.attribution || 'Unknown Artist';
        const date = artwork.displaydate || 'Date Unknown';
        const medium = artwork.medium || '';
        const dimensions = artwork.dimensions || '';

        return `
            <div class="nga-artwork" data-id="${artwork.id}">
                <div class="nga-image">
                    ${imageHtml}
                </div>
                <div class="nga-info">
                    <h3 class="nga-title">${artwork.title || 'Untitled'}</h3>
                    <p class="nga-artist">${artist}</p>
                    <p class="nga-date">${date}</p>
                    ${medium ? `<p class="nga-medium">${medium}</p>` : ''}
                    ${dimensions ? `<p class="nga-dimensions">${dimensions}</p>` : ''}
                    ${artwork.accessionnum ? `<p class="nga-accession">Accession: ${artwork.accessionnum}</p>` : ''}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Artwork click handlers for modal/detail view
        this.container.querySelectorAll('.nga-artwork').forEach(artwork => {
            artwork.addEventListener('click', (e) => {
                const artworkId = e.currentTarget.dataset.id;
                this.showArtworkDetail(artworkId);
            });
        });
    }

    async showArtworkDetail(artworkId) {
        try {
            // Since we're using sample data, find the artwork in our local array
            const artwork = this.artworks.find(a => a.id == artworkId);
            if (artwork) {
                this.renderModal(artwork);
            }
        } catch (error) {
            console.error('Failed to load artwork details:', error);
        }
    }

    renderModal(artwork) {
        const modal = document.createElement('div');
        modal.className = 'nga-modal';
        modal.innerHTML = `
            <div class="nga-modal-content">
                <span class="nga-close">&times;</span>
                <div class="nga-modal-body">
                    ${artwork.images?.web?.url ? 
                        `<img src="${artwork.images.web.url}" alt="${artwork.title}" />` : 
                        '<div class="nga-no-image-large">No Image Available</div>'
                    }
                    <div class="nga-details">
                        <h2>${artwork.title || 'Untitled'}</h2>
                        <p><strong>Artist:</strong> ${artwork.attribution || 'Unknown'}</p>
                        <p><strong>Date:</strong> ${artwork.displaydate || 'Unknown'}</p>
                        ${artwork.medium ? `<p><strong>Medium:</strong> ${artwork.medium}</p>` : ''}
                        ${artwork.dimensions ? `<p><strong>Dimensions:</strong> ${artwork.dimensions}</p>` : ''}
                        ${artwork.creditline ? `<p><strong>Credit:</strong> ${artwork.creditline}</p>` : ''}
                        ${artwork.accessionnum ? `<p><strong>Accession Number:</strong> ${artwork.accessionnum}</p>` : ''}
                        ${artwork.description ? `<p><strong>Description:</strong> ${artwork.description}</p>` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        modal.querySelector('.nga-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="nga-loading">
                <div class="nga-spinner"></div>
                <p>Loading National Gallery of Art collection...</p>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="nga-error">
                <h3>Unable to load collection</h3>
                <p>${message}</p>
                <button onclick="window.ngaGallery.loadFineArt()">Try Again</button>
            </div>
        `;
    }

    // Full-screen modal functionality
    initializeFullScreenModal() {
        // Create modal HTML
        const modalHtml = `
            <div id="nga-fullscreen-modal" class="nga-fullscreen-modal" style="display: none;">
                <div class="nga-modal-backdrop"></div>
                <div class="nga-modal-container">
                    <div class="nga-modal-controls">
                        <button class="nga-zoom-in">+</button>
                        <button class="nga-zoom-out">-</button>
                        <button class="nga-close-modal">✕</button>
                    </div>
                    <div class="nga-modal-image-container">
                        <img id="nga-modal-image" class="nga-modal-image" />
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM if it doesn't exist
        if (!document.getElementById('nga-fullscreen-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
        
        this.attachModalEventListeners();
    }
    
    attachModalEventListeners() {
        // Image click handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nga-zoomable-image')) {
                const artworkId = e.target.dataset.artworkId;
                const artwork = this.artworks.find(a => a.id == artworkId);
                if (artwork) {
                    this.openFullScreenModal(artwork);
                }
            }
        });
        
        // Modal controls
        const modal = document.getElementById('nga-fullscreen-modal');
        const modalImage = document.getElementById('nga-modal-image');
        const closeBtn = document.querySelector('.nga-close-modal');
        const zoomInBtn = document.querySelector('.nga-zoom-in');
        const zoomOutBtn = document.querySelector('.nga-zoom-out');
        const backdrop = document.querySelector('.nga-modal-backdrop');
        
        let scale = 1;
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        
        // Close modal handlers
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';  // Restore scrolling
            scale = 1;
            translateX = 0;
            translateY = 0;
            this.updateImageTransform(modalImage, scale, translateX, translateY);
        };
        
        closeBtn?.addEventListener('click', closeModal);
        backdrop?.addEventListener('click', closeModal);
        modalImage?.addEventListener('click', closeModal);
        
        // Zoom controls
        zoomInBtn?.addEventListener('click', () => {
            scale = Math.min(scale * 1.2, 20);
            this.updateImageTransform(modalImage, scale, translateX, translateY);
        });
        
        zoomOutBtn?.addEventListener('click', () => {
            scale = Math.max(scale / 1.2, 0.1);
            this.updateImageTransform(modalImage, scale, translateX, translateY);
        });
        
        // Mouse wheel zoom
        modalImage?.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            scale = Math.min(Math.max(scale * delta, 0.1), 20);
            this.updateImageTransform(modalImage, scale, translateX, translateY);
        });
        
        // Pan functionality - Mouse
        modalImage?.addEventListener('mousedown', (e) => {
            if (scale > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                modalImage.style.cursor = 'grabbing';
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging && scale > 1) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                this.updateImageTransform(modalImage, scale, translateX, translateY);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (modalImage) modalImage.style.cursor = scale > 1 ? 'grab' : 'pointer';
        });
        
        // Touch gestures
        let initialDistance = 0;
        let lastTouchX = 0;
        let lastTouchY = 0;
        
        modalImage?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 2) {
                // Pinch zoom start
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
            } else if (e.touches.length === 1) {
                // Pan start
                const touch = e.touches[0];
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
            }
        });
        
        modalImage?.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 2) {
                // Pinch zoom
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                const scaleChange = currentDistance / initialDistance;
                scale = Math.min(Math.max(scale * scaleChange, 0.1), 20);
                initialDistance = currentDistance;
                this.updateImageTransform(modalImage, scale, translateX, translateY);
            } else if (e.touches.length === 1 && scale > 1) {
                // Pan
                const touch = e.touches[0];
                translateX += touch.clientX - lastTouchX;
                translateY += touch.clientY - lastTouchY;
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
                this.updateImageTransform(modalImage, scale, translateX, translateY);
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (modal && modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case '+':
                    case '=':
                        scale = Math.min(scale * 1.2, 20);
                        this.updateImageTransform(modalImage, scale, translateX, translateY);
                        break;
                    case '-':
                        scale = Math.max(scale / 1.2, 0.1);
                        this.updateImageTransform(modalImage, scale, translateX, translateY);
                        break;
                }
            }
        });
    }
    
    openFullScreenModal(artwork) {
        const modal = document.getElementById('nga-fullscreen-modal');
        const modalImage = document.getElementById('nga-modal-image');
        const imageUrl = artwork.images?.web?.url || artwork.images?.print?.url;
        
        if (imageUrl && modal && modalImage) {
            modalImage.src = imageUrl;
            modalImage.alt = artwork.title;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    updateImageTransform(image, scale, translateX, translateY) {
        if (image) {
            image.style.transform = `scale(${scale}) translate(${translateX/scale}px, ${translateY/scale}px)`;
            image.style.cursor = scale > 1 ? 'grab' : 'pointer';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Make globally available for onclick handlers
    window.ngaGallery = null;
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NGAGallery;
}