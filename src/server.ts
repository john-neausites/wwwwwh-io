import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { db } from './database/connection';
import { p2pNetwork } from './services/p2p-network';

// Import routes (will be created)
// import authRoutes from '@/routes/auth';
// import contentRoutes from '@/routes/content';
// import peerRoutes from '@/routes/peer';
// import donationRoutes from '@/routes/donation';

class Server {
  private app: express.Application;
  private server?: any;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "wss:", "ws:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.nodeEnv === 'production' 
        ? ['https://wwwwwh.io'] 
        : ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    }));

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim())
      }
    }));

    // Static files
    this.app.use(express.static('public'));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const dbStatus = await db.ping();
        const p2pStatus = p2pNetwork.getPeerId() !== null;
        
        const health = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          services: {
            database: dbStatus ? 'connected' : 'disconnected',
            p2p: p2pStatus ? 'connected' : 'disconnected',
          },
          network: p2pNetwork.getNetworkStats()
        };

        res.json(health);
      } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
          status: 'error',
          timestamp: new Date().toISOString(),
          error: 'Service unavailable'
        });
      }
    });

    // API versioning
    const apiV1 = express.Router();
    
    // Placeholder for route mounting
    // apiV1.use('/auth', authRoutes);
    // apiV1.use('/content', contentRoutes);
    // apiV1.use('/peer', peerRoutes);
    // apiV1.use('/donation', donationRoutes);

    // Temporary placeholder routes
    apiV1.get('/status', (req, res) => {
      res.json({
        message: 'wwwwwh.io API v1',
        version: '0.1.0',
        timestamp: new Date().toISOString()
      });
    });

    this.app.use('/api/v1', apiV1);

    // Serve React app (placeholder)
    this.app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'public' });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
      });
    });

    // Global error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', err);

      // Don't leak error details in production
      const message = config.nodeEnv === 'production' 
        ? 'Internal Server Error' 
        : err.message;

      res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message,
        timestamp: new Date().toISOString(),
        ...(config.nodeEnv !== 'production' && { stack: err.stack })
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Initialize services
      logger.info('Initializing services...');
      
      // Test database connection
      await db.ping();
      logger.info('Database connected successfully');

      // Start P2P network
      await p2pNetwork.start();
      logger.info('P2P network started successfully');

      // Start HTTP server
      this.server = this.app.listen(config.port, () => {
        logger.info(`Server started on port ${config.port}`);
        logger.info(`Environment: ${config.nodeEnv}`);
        logger.info(`P2P Node ID: ${p2pNetwork.getPeerId()}`);
      });

      // Graceful shutdown handlers
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const signals = ['SIGTERM', 'SIGINT'];

    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, starting graceful shutdown...`);

        try {
          // Close HTTP server
          if (this.server) {
            await new Promise<void>((resolve) => {
              this.server.close(() => resolve());
            });
            logger.info('HTTP server closed');
          }

          // Stop P2P network
          await p2pNetwork.stop();
          logger.info('P2P network stopped');

          // Close database connections
          await db.close();
          logger.info('Database connections closed');

          logger.info('Graceful shutdown completed');
          process.exit(0);

        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }
}

// Start the server
const server = new Server();
server.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});

export default server;