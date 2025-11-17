import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from './connection';
import { logger } from '../utils/logger';

async function runMigrations(): Promise<void> {
  try {
    logger.info('Starting database migration...');

    // Read and execute schema
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    // Split schema by statements and execute each
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
      }
    }

    logger.info('Database migration completed successfully');

  } catch (error) {
    logger.error('Database migration failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigrations };