import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  azure: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    subscriptionId: string;
    storage: {
      accountName: string;
      accountKey: string;
      containerName: string;
    };
    serviceBus: {
      connectionString: string;
      queueName: string;
    };
    signalR: {
      connectionString: string;
    };
    keyVault: {
      url: string;
    };
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
  webauthn: {
    origin: string;
    rpId: string;
    rpName: string;
  };
  p2p: {
    listenPort: number;
    bootstrapPeers: string[];
  };
  ipfs: {
    apiUrl: string;
    gatewayUrl: string;
  };
  logging: {
    level: string;
    file: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  upload: {
    maxFileSize: number;
    maxFilesPerUser: number;
  };
  donations: {
    mealAmount: number;
    drinkAmount: number;
    snackAmount: number;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/wwwwwh_io',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  azure: {
    tenantId: process.env.AZURE_TENANT_ID || '',
    clientId: process.env.AZURE_CLIENT_ID || '',
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
    subscriptionId: process.env.AZURE_SUBSCRIPTION_ID || '',
    storage: {
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY || '',
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'content-files',
    },
    serviceBus: {
      connectionString: process.env.AZURE_SERVICE_BUS_CONNECTION_STRING || '',
      queueName: process.env.AZURE_SERVICE_BUS_QUEUE_NAME || 'peer-discovery',
    },
    signalR: {
      connectionString: process.env.AZURE_SIGNALR_CONNECTION_STRING || '',
    },
    keyVault: {
      url: process.env.AZURE_KEY_VAULT_URL || '',
    },
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  
  webauthn: {
    origin: process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000',
    rpId: process.env.WEBAUTHN_RP_ID || 'localhost',
    rpName: process.env.WEBAUTHN_RP_NAME || 'wwwwwh.io',
  },
  
  p2p: {
    listenPort: parseInt(process.env.P2P_LISTEN_PORT || '4001', 10),
    bootstrapPeers: process.env.P2P_BOOTSTRAP_PEERS 
      ? process.env.P2P_BOOTSTRAP_PEERS.split(',')
      : ['/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ'],
  },
  
  ipfs: {
    apiUrl: process.env.IPFS_API_URL || 'http://localhost:5001',
    gatewayUrl: process.env.IPFS_GATEWAY_URL || 'http://localhost:8080',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10737418240', 10), // 10GB
    maxFilesPerUser: parseInt(process.env.MAX_FILES_PER_USER || '1000', 10),
  },
  
  donations: {
    mealAmount: parseInt(process.env.DONATION_MEAL_AMOUNT || '300', 10), // $3.00
    drinkAmount: parseInt(process.env.DONATION_DRINK_AMOUNT || '800', 10), // $8.00
    snackAmount: parseInt(process.env.DONATION_SNACK_AMOUNT || '1500', 10), // $15.00
  },
};

// Validation
const requiredVars = [
  'DATABASE_URL',
] as const;

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && config.nodeEnv === 'production') {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export { config };