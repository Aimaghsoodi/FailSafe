import { Hono } from 'hono';
import type { AppContext } from '../server.js';

export function createStatsRoutes(ctx: AppContext): Hono {
  const app = new Hono();

  // GET / — Global statistics
  app.get('/', async (c) => {
    const stats = await ctx.storage.getStatistics();
    return c.json(stats);
  });

  // GET /model/:model — Model-specific statistics
  app.get('/model/:model', async (c) => {
    const model = c.req.param('model');
    const stats = await ctx.storage.getStatisticsByModel(model);
    return c.json({ model, stats });
  });

  // GET /domain/:domain — Domain-specific statistics
  app.get('/domain/:domain', async (c) => {
    const domain = c.req.param('domain');
    const stats = await ctx.storage.getStatisticsByDomain(domain);
    return c.json({ domain, stats });
  });

  return app;
}
