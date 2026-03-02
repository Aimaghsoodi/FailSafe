import { Hono } from 'hono';
import type { AppContext } from '../server.js';
import { AppError } from '../middleware/error.js';

export function createSearchRoutes(ctx: AppContext): Hono {
  const app = new Hono();

  // GET / — Full-text search
  app.get('/', async (c) => {
    const q = c.req.query('q');

    if (!q) {
      throw new AppError('VALIDATION_ERROR', 'Missing required query parameter: q', 400);
    }

    const limit = parseInt(c.req.query('limit') || '20', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);

    const result = await ctx.storage.searchFailures(q, limit, offset);
    return c.json(result);
  });

  return app;
}
