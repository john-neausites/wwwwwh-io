/**
 * DISABLED Database Connection - Cold Storage Version
 * 
 * This is a stub version of the database connection that maintains the same
 * interface but doesn't actually connect to a database. This allows us
 * to focus on frontend development while keeping database functionality in cold storage.
 */

import { logger } from '../utils/logger';

class Database {
  private static instance: Database;

  private constructor() {
    logger.info('Database initialized in DISABLED mode (cold storage)');
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    logger.debug('Database query called (DISABLED):', { text, params });
    return []; // Always return empty array
  }

  public async queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    logger.debug('Database queryOne called (DISABLED):', { text, params });
    return null; // Always return null
  }

  public async getClient(): Promise<any> {
    logger.debug('Database getClient called (DISABLED)');
    return null; // Return null client
  }

  public async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    logger.debug('Database transaction called (DISABLED)');
    // Call the callback with a null client to maintain interface
    return await callback(null);
  }

  public async close(): Promise<void> {
    logger.info('Database close called (DISABLED)');
    // Do nothing in disabled mode
  }

  public async ping(): Promise<boolean> {
    logger.debug('Database ping called (DISABLED)');
    return false; // Always return false to indicate no database connection
  }
}

export const db = Database.getInstance();