import { Hono } from 'hono';
import type { AppContext } from '../server.js';
import { AppError } from '../middleware/error.js';
import { generateId, getCurrentTimestamp } from '../storage/utils.js';
import type { FailurePattern } from '@failsafe/core';

export function createPatternsRoutes(ctx: AppContext): Hono {
  const app = new Hono();

  // GET / — List failure patterns
  app.get('/', async (c) => {
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);
    const result = await ctx.storage.listPatterns(limit, offset);
    return c.json(result);
  });

  // GET /:id — Get a single pattern
  app.get('/:id', async (c) => {
    const id = c.req.param('id');
    const pattern = await ctx.storage.getPattern(id);

    if (!pattern) {
      throw new AppError('NOT_FOUND', `Pattern ${id} not found`, 404);
    }

    return c.json(pattern);
  });

  // POST / — Create a new pattern
  app.post('/', async (c) => {
    const body = await c.req.json();

    if (!body.name || !body.description || !body.failureTypes || !body.severity) {
      throw new AppError('VALIDATION_ERROR', 'Missing required fields: name, description, failureTypes, severity', 400);
    }

    const now = getCurrentTimestamp();
    const pattern: FailurePattern = {
      id: generateId('pattern'),
      name: body.name,
      description: body.description,
      failureTypes: body.failureTypes,
      conditions: body.conditions || [],
      severity: body.severity,
      likelihood: body.likelihood,
      impact: body.impact,
      commonCauses: body.commonCauses,
      preventionStrategies: body.preventionStrategies,
      detectionRules: body.detectionRules,
      createdAt: now,
      updatedAt: now,
    };

    const created = await ctx.storage.createPattern(pattern);
    return c.json(created, 201);
  });

  return app;
}
