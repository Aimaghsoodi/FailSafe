/**
 * FailSafe API Configuration
 */

export interface ApiConfig {
  port: number;
  host: string;
  env: 'development' | 'production' | 'test';
  database: {
    path: string;
    verbose?: boolean;
  };
  cors: {
    enabled: boolean;
    origin?: string | string[];
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  storage: 'sqlite' | 'memory';
}

export const DEFAULT_CONFIG: ApiConfig = {
  port: 3000,
  host: '0.0.0.0',
  env: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
  database: {
    path: process.env.FAILSAFE_DB_PATH || './.failsafe/data.db',
    verbose: process.env.NODE_ENV !== 'production',
  },
  cors: {
    enabled: true,
    origin: process.env.CORS_ORIGIN || '*',
  },
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  storage: (process.env.STORAGE as 'sqlite' | 'memory') || 'sqlite',
};

export function getConfig(): ApiConfig {
  return {
    ...DEFAULT_CONFIG,
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
  };
}
