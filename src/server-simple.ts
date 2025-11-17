import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import multer from 'multer';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { fileService } from './services/file-service';

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
    
    // Configure multer for file uploads
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
        files: 10 // Maximum 10 files at once
      },
      fileFilter: (req, file, cb) => {
        // Allow all file types for now, but log them
        logger.info(`File upload: ${file.originalname} (${file.mimetype})`);
        cb(null, true);
      }
    });
    
    // File management endpoints
    
    // List files in a directory
    apiV1.get('/files', async (req, res) => {
      try {
        const requestPath = req.query.path as string || '';
        const files = await fileService.listFiles(requestPath);
        res.json(files);
      } catch (error: any) {
        logger.error('Failed to list files:', error);
        res.status(500).json({
          error: 'Failed to list files',
          message: error.message
        });
      }
    });
    
    // Upload files
    apiV1.post('/files/upload', upload.array('file'), async (req, res) => {
      try {
        const files = req.files as Express.Multer.File[];
        const targetPath = req.body.path || '';
        
        if (!files || files.length === 0) {
          return res.status(400).json({
            error: 'No files provided'
          });
        }
        
        const uploadedFiles = [];
        
        for (const file of files) {
          const fileItem = await fileService.saveUploadedFile(
            file.buffer,
            file.originalname,
            targetPath
          );
          uploadedFiles.push(fileItem);
        }
        
        res.json({
          message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
          files: uploadedFiles
        });
        
      } catch (error: any) {
        logger.error('File upload failed:', error);
        res.status(500).json({
          error: 'Upload failed',
          message: error.message
        });
      }
    });
    
    // Create folder
    apiV1.post('/files/folder', async (req, res) => {
      try {
        const { name, path: parentPath } = req.body;
        
        if (!name) {
          return res.status(400).json({
            error: 'Folder name is required'
          });
        }
        
        const folder = await fileService.createFolder(name, parentPath || '');
        res.json({
          message: 'Folder created successfully',
          folder
        });
        
      } catch (error: any) {
        logger.error('Failed to create folder:', error);
        res.status(500).json({
          error: 'Failed to create folder',
          message: error.message
        });
      }
    });
    
    // Download file
    apiV1.get('/files/download', async (req, res) => {
      try {
        const filePath = req.query.path as string;
        
        if (!filePath) {
          return res.status(400).json({
            error: 'File path is required'
          });
        }
        
        const { stream, stats, mimeType } = await fileService.getFileStream(filePath);
        
        // Set appropriate headers
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filePath.split('/').pop() || 'download')}"`);
        
        // Pipe the file stream to response
        stream.pipe(res);
        
      } catch (error: any) {
        logger.error('File download failed:', error);
        res.status(404).json({
          error: 'File not found',
          message: error.message
        });
      }
    });
    
    // Delete file or folder
    apiV1.delete('/files', async (req, res) => {
      try {
        const filePath = req.query.path as string;
        
        if (!filePath) {
          return res.status(400).json({
            error: 'File path is required'
          });
        }
        
        await fileService.deleteFile(filePath);
        res.json({
          message: 'File deleted successfully'
        });
        
      } catch (error: any) {
        logger.error('File deletion failed:', error);
        res.status(500).json({
          error: 'Failed to delete file',
          message: error.message
        });
      }
    });
    
    // API status endpoint
    apiV1.get('/status', (req, res) => {
      res.json({
        message: 'wwwwwh.io API v1',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        features: {
          fileManagement: 'implemented',
          uploadDownload: 'implemented',
          folderOperations: 'implemented',
          p2pNetwork: 'disabled',
          database: 'disabled'
        },
        storage: {
          baseDirectory: fileService.getBaseDirectory()
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

    // File management app
    this.app.get('/app', (req, res) => {
      res.sendFile('app.html', { root: 'public' });
    });

    // wwwwwh-styled file management app
    this.app.get('/files', (req, res) => {
      res.sendFile('wwwwwh-app.html', { root: 'public' });
    });

    // Serve main landing page for other routes
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