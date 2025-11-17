import { db } from './connection';
import { logger } from '../utils/logger';

async function seedDatabase(): Promise<void> {
  try {
    logger.info('Starting database seeding...');

    // Seed hierarchical menu structure
    await seedMenuHierarchy();
    
    // Seed file types
    await seedFileTypes();
    
    // Create initial National Gallery content structure (placeholder)
    await seedNationalGalleryStructure();

    logger.info('Database seeding completed successfully');

  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  }
}

async function seedMenuHierarchy(): Promise<void> {
  logger.info('Seeding menu hierarchy...');

  const menuItems = [
    // Audio hierarchy
    { path: 'audio', name: 'Audio', type: 'category', level: 0 },
    { path: 'audio.music', name: 'Music', type: 'subcategory', level: 1 },
    { path: 'audio.music.lists', name: 'Lists', type: 'collection', level: 2 },
    { path: 'audio.music.lists.new', name: 'New', type: 'collection', level: 3 },
    { path: 'audio.music.lists.favorites', name: 'Favorites', type: 'collection', level: 3 },
    { path: 'audio.music.lists.popular', name: 'Popular', type: 'collection', level: 3 },
    { path: 'audio.music.discographies', name: 'Discographies', type: 'collection', level: 2 },
    { path: 'audio.music.albums', name: 'Albums', type: 'collection', level: 2 },
    { path: 'audio.music.singles', name: 'Singles', type: 'collection', level: 2 },
    
    { path: 'audio.literature', name: 'Literature', type: 'subcategory', level: 1 },
    { path: 'audio.literature.fiction', name: 'Fiction', type: 'collection', level: 2 },
    { path: 'audio.literature.nonfiction', name: 'Non-Fiction', type: 'collection', level: 2 },
    { path: 'audio.literature.educational', name: 'Educational', type: 'collection', level: 2 },
    { path: 'audio.literature.biography', name: 'Biography', type: 'collection', level: 2 },
    
    { path: 'audio.podcasts', name: 'Podcasts', type: 'subcategory', level: 1 },
    { path: 'audio.podcasts.news', name: 'News', type: 'collection', level: 2 },
    { path: 'audio.podcasts.comedy', name: 'Comedy', type: 'collection', level: 2 },
    { path: 'audio.podcasts.technology', name: 'Technology', type: 'collection', level: 2 },
    { path: 'audio.podcasts.interview', name: 'Interview', type: 'collection', level: 2 },

    // Photo hierarchy
    { path: 'photo', name: 'Photo', type: 'category', level: 0 },
    { path: 'photo.portrait', name: 'Portrait', type: 'subcategory', level: 1 },
    { path: 'photo.landscape', name: 'Landscape', type: 'subcategory', level: 1 },
    { path: 'photo.architecture', name: 'Architecture', type: 'subcategory', level: 1 },
    { path: 'photo.fineart', name: 'Fine Art', type: 'subcategory', level: 1 },

    // Text hierarchy
    { path: 'text', name: 'Text', type: 'category', level: 0 },
    { path: 'text.literature', name: 'Literature', type: 'subcategory', level: 1 },
    { path: 'text.literature.fiction', name: 'Fiction', type: 'collection', level: 2 },
    { path: 'text.literature.fiction.novels', name: 'Novels', type: 'collection', level: 3 },
    { path: 'text.literature.fiction.shortstories', name: 'Short Stories', type: 'collection', level: 3 },
    { path: 'text.literature.nonfiction', name: 'Non-Fiction', type: 'collection', level: 2 },
    
    // Video hierarchy
    { path: 'video', name: 'Video', type: 'category', level: 0 },
    { path: 'video.entertainment', name: 'Entertainment', type: 'subcategory', level: 1 },
    { path: 'video.entertainment.movies', name: 'Movies', type: 'collection', level: 2 },
    { path: 'video.entertainment.movies.features', name: 'Feature Films', type: 'collection', level: 3 },
    { path: 'video.entertainment.movies.documentaries', name: 'Documentaries', type: 'collection', level: 3 },
  ];

  for (const item of menuItems) {
    await db.query(`
      INSERT INTO menu (path, name, type, level, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (path) DO NOTHING
    `, [item.path, item.name, item.type, item.level]);
  }

  logger.info(`Seeded ${menuItems.length} menu items`);
}

async function seedFileTypes(): Promise<void> {
  logger.info('Seeding file types...');

  // Get menu IDs for linking
  const audioMenu = await db.queryOne<{id: number}>('SELECT id FROM menu WHERE path = $1', ['audio']);
  const photoMenu = await db.queryOne<{id: number}>('SELECT id FROM menu WHERE path = $1', ['photo']);
  const textMenu = await db.queryOne<{id: number}>('SELECT id FROM menu WHERE path = $1', ['text']);
  const videoMenu = await db.queryOne<{id: number}>('SELECT id FROM menu WHERE path = $1', ['video']);

  const fileTypes = [
    // Audio file types
    ...(audioMenu ? [
      { menuId: audioMenu.id, fileType: 'WAV', mimeType: 'audio/wav', extension: '.wav', category: 'audio' },
      { menuId: audioMenu.id, fileType: 'FLAC', mimeType: 'audio/flac', extension: '.flac', category: 'audio' },
      { menuId: audioMenu.id, fileType: 'MP3', mimeType: 'audio/mpeg', extension: '.mp3', category: 'audio' },
    ] : []),

    // Photo file types
    ...(photoMenu ? [
      { menuId: photoMenu.id, fileType: 'CR2', mimeType: 'image/x-canon-cr2', extension: '.cr2', category: 'photo' },
      { menuId: photoMenu.id, fileType: 'JPEG', mimeType: 'image/jpeg', extension: '.jpg', category: 'photo' },
      { menuId: photoMenu.id, fileType: 'PNG', mimeType: 'image/png', extension: '.png', category: 'photo' },
      { menuId: photoMenu.id, fileType: 'TIFF', mimeType: 'image/tiff', extension: '.tiff', category: 'photo' },
    ] : []),

    // Text file types
    ...(textMenu ? [
      { menuId: textMenu.id, fileType: 'TXT', mimeType: 'text/plain', extension: '.txt', category: 'text' },
      { menuId: textMenu.id, fileType: 'PDF', mimeType: 'application/pdf', extension: '.pdf', category: 'text' },
      { menuId: textMenu.id, fileType: 'EPUB', mimeType: 'application/epub+zip', extension: '.epub', category: 'text' },
      { menuId: textMenu.id, fileType: 'MD', mimeType: 'text/markdown', extension: '.md', category: 'text' },
    ] : []),

    // Video file types
    ...(videoMenu ? [
      { menuId: videoMenu.id, fileType: 'MP4', mimeType: 'video/mp4', extension: '.mp4', category: 'video' },
      { menuId: videoMenu.id, fileType: 'MOV', mimeType: 'video/quicktime', extension: '.mov', category: 'video' },
      { menuId: videoMenu.id, fileType: 'AVI', mimeType: 'video/x-msvideo', extension: '.avi', category: 'video' },
      { menuId: videoMenu.id, fileType: 'MKV', mimeType: 'video/x-matroska', extension: '.mkv', category: 'video' },
    ] : []),
  ];

  for (const fileType of fileTypes) {
    await db.query(`
      INSERT INTO menu_types (menu_id, file_type, mime_type, extension, category, is_supported, created_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW())
      ON CONFLICT (menu_id, file_type, extension) DO NOTHING
    `, [fileType.menuId, fileType.fileType, fileType.mimeType, fileType.extension, fileType.category]);
  }

  logger.info(`Seeded ${fileTypes.length} file types`);
}

async function seedNationalGalleryStructure(): Promise<void> {
  logger.info('Creating National Gallery content structure...');

  // Create a special collection for National Gallery content
  await db.query(`
    INSERT INTO menu (path, name, type, level, description, metadata, created_at, updated_at)
    VALUES (
      'photo.fineart.nationalgallery', 
      'National Gallery of Art', 
      'collection', 
      2,
      'Public domain artworks from the National Gallery of Art collection',
      '{"source": "National Gallery of Art", "isPublicDomain": true, "curatedCollection": true}',
      NOW(), 
      NOW()
    )
    ON CONFLICT (path) DO NOTHING
  `);

  // Create subcollections for different art periods/styles
  const artCollections = [
    { path: 'photo.fineart.nationalgallery.renaissance', name: 'Renaissance', description: 'Renaissance period artworks' },
    { path: 'photo.fineart.nationalgallery.baroque', name: 'Baroque', description: 'Baroque period artworks' },
    { path: 'photo.fineart.nationalgallery.impressionism', name: 'Impressionism', description: 'Impressionist artworks' },
    { path: 'photo.fineart.nationalgallery.modern', name: 'Modern Art', description: 'Modern art collection' },
    { path: 'photo.fineart.nationalgallery.american', name: 'American Art', description: 'American artists collection' },
  ];

  for (const collection of artCollections) {
    await db.query(`
      INSERT INTO menu (path, name, type, level, description, metadata, created_at, updated_at)
      VALUES ($1, $2, 'collection', 3, $3, '{"isPublicDomain": true}', NOW(), NOW())
      ON CONFLICT (path) DO NOTHING
    `, [collection.path, collection.name, collection.description]);
  }

  logger.info('National Gallery structure created');
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seed script failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };