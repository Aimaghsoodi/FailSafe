import { Hono } from 'hono';
import type { ApiConfig } from './config.js';
import { DEFAULT_CONFIG } from './config.js';
import { createCorsMiddleware } from './middleware/cors.js';
import { createErrorHandler } from './middleware/error.js';
import { createRateLimitMiddleware } from './middleware/rate-limit.js';
import { createFailuresRoutes } from './routes/failures.js';
import { createCheckRoutes } from './routes/check.js';
import { createPatternsRoutes } from './routes/patterns.js';
import { createStatsRoutes } from './routes/stats.js';
import { createSearchRoutes } from './routes/search.js';
import { createHealthRoutes } from './routes/health.js';
import type { StorageInterface } from './storage/storage.js';
import { MemoryStorage } from './storage/memory.js';

export interface AppContext {
  storage: StorageInterface;
  config: ApiConfig;
  startTime: number;
}

export function createApp(config: ApiConfig = DEFAULT_CONFIG, storage?: StorageInterface): Hono {
  const app = new Hono();
  const store: StorageInterface = storage || new MemoryStorage();
  const startTime = Date.now();

  const ctx: AppContext = { storage: store, config, startTime };

  // Global middleware
  app.use('*', createErrorHandler());
  app.use('*', createCorsMiddleware(config));

  if (config.rateLimit.enabled) {
    app.use('/v1/*', createRateLimitMiddleware(config));
  }

  // Mount routes
  const failures = createFailuresRoutes(ctx);
  const check = createCheckRoutes(ctx);
  const patterns = createPatternsRoutes(ctx);
  const stats = createStatsRoutes(ctx);
  const search = createSearchRoutes(ctx);
  const health = createHealthRoutes(ctx);

  app.route('/v1/failures', failures);
  app.route('/v1/check', check);
  app.route('/v1/patterns', patterns);
  app.route('/v1/stats', stats);
  app.route('/v1/search', search);
  app.route('/health', health);

  return app;
}

export { MemoryStorage } from './storage/memory.js';
