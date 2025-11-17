import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './utils/config';
import { logger } from './utils/logger';

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
        const health = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          services: {
            database: 'not-configured', // Will be 'connected' once DB is set up
            p2p: 'disabled', // Will be enabled once P2P is working
          },
          network: {
            totalPeers: 0,
            onlinePeers: 0,
            averageQuality: 0,
            totalBandwidth: 0,
            uniqueContent: 0
          }
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
    
    // Temporary placeholder routes
    apiV1.get('/status', (req, res) => {
      res.json({
        message: 'wwwwwh.io API v1',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        features: {
          contextualGenreSystem: 'implemented',
          hierarchicalContent: 'schema-ready',
          hardwareAuth: 'planned',
          p2pNetwork: 'in-development'
        }
      });
    });

    // Demo endpoint for contextual genre system
    apiV1.get('/content/recommend', (req, res) => {
      const { activity, emotions, groups } = req.query;
      
      // Simple mock recommendation
      const mockRecommendations: Record<string, Record<string, string>> = {
        cook: {
          happy: 'Kitchen Sing-Alongs',
          relaxed: 'Cooking Ambience'
        },
        workout: {
          happy: 'Energetic Pop',
          tense: 'Workout Trap'
        },
        relax: {
          happy: 'Feel-Good Classics',
          relaxed: 'Ambient Chill'
        }
      };

      const activityRecs = mockRecommendations[activity as string];
      const recommendation = activityRecs?.[emotions as string] || 'General Mix';
      
      res.json({
        activity,
        emotions,
        groups,
        recommendation,
        message: 'This is a mock response. Full contextual system will be implemented with database integration.'
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
      logger.info('Initializing wwwwwh.io platform...');
      
      // TODO: Test database connection when configured
      // TODO: Start P2P network when libp2p is working

      // Start HTTP server
      this.server = this.app.listen(config.port, () => {
        logger.info(`🚀 wwwwwh.io server started on port ${config.port}`);
        logger.info(`📱 Frontend available at: http://localhost:${config.port}`);
        logger.info(`🔧 API available at: http://localhost:${config.port}/api/v1`);
        logger.info(`❤️  Health check: http://localhost:${config.port}/health`);
        logger.info(`🌍 Environment: ${config.nodeEnv}`);
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