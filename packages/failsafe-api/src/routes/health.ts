import { Hono } from 'hono';
import type { AppContext } from '../server.js';

export function createHealthRoutes(ctx: AppContext): Hono {
  const app = new Hono();

  // GET / — Health check
  app.get('/', async (c) => {
    const healthy = await ctx.storage.isHealthy();
    const uptime = Math.floor((Date.now() - ctx.startTime) / 1000);

    let totalReports = 0;
    let totalPatterns = 0;
    try {
      totalReports = await ctx.storage.countFailures();
      const patternsResult = await ctx.storage.listPatterns(0, 0);
      totalPatterns = patternsResult.total;
    } catch {
      // Ignore errors during health check
    }

    return c.json({
      status: healthy ? 'healthy' : 'unhealthy',
      version: '0.1.0',
      uptime,
      database: healthy ? 'connected' : 'disconnected',
      totalReports,
      totalPatterns,
    });
  });

  return app;
}
