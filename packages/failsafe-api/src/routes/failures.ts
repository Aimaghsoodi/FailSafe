import { Hono } from 'hono';
import type { AppContext } from '../server.js';
import { AppError } from '../middleware/error.js';
import { generateId, getCurrentTimestamp } from '../storage/utils.js';
import type { FailureReport } from '@failsafe/core';

export function createFailuresRoutes(ctx: AppContext): Hono {
  const app = new Hono();

  // POST / — Submit a new failure report
  app.post('/', async (c) => {
    const body = await c.req.json();

    if (!body.type || !body.severity || !body.domain || !body.title || !body.description) {
      throw new AppError('VALIDATION_ERROR', 'Missing required fields: type, severity, domain, title, description', 400);
    }

    const now = getCurrentTimestamp();
    const report: FailureReport = {
      id: generateId('report'),
      type: body.type,
      severity: body.severity,
      domain: body.domain,
      title: body.title,
      description: body.description,
      context: body.context,
      timestamp: now,
      duration: body.duration,
      errorMessage: body.errorMessage,
      errorStack: body.errorStack,
      errorCode: body.errorCode,
      input: body.input,
      output: body.output,
      expectedOutput: body.expectedOutput,
      source: body.source,
      userId: body.userId,
      sessionId: body.sessionId,
      tags: body.tags,
      metadata: body.metadata,
      verificationStatus: 'unverified',
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    const created = await ctx.storage.createFailure(report);
    return c.json(created, 201);
  });

  // GET / — List failure reports with filtering
  app.get('/', async (c) => {
    const types = c.req.query('types')?.split(',') as any;
    const severities = c.req.query('severities')?.split(',') as any;
    const domains = c.req.query('domains')?.split(',') as any;
    const verificationStatus = c.req.query('status')?.split(',') as any;
    const source = c.req.query('source');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);

    const filter: any = {};
    if (types) filter.types = types;
    if (severities) filter.severities = severities;
    if (domains) filter.domains = domains;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (source) filter.source = source;

    const result = await ctx.storage.listFailures(filter, limit, offset);
    return c.json(result);
  });

  // GET /:id — Get a single failure report
  app.get('/:id', async (c) => {
    const id = c.req.param('id');
    const report = await ctx.storage.getFailure(id);

    if (!report) {
      throw new AppError('NOT_FOUND', `Failure report ${id} not found`, 404);
    }

    return c.json(report);
  });

  // PATCH /:id — Update a failure report
  app.patch('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await ctx.storage.getFailure(id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Failure report ${id} not found`, 404);
    }

    const updated = await ctx.storage.updateFailure(id, body);
    return c.json(updated);
  });

  // PATCH /:id/verify — Verify or dispute a failure report
  app.patch('/:id/verify', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await ctx.storage.getFailure(id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Failure report ${id} not found`, 404);
    }

    if (!body.status) {
      throw new AppError('VALIDATION_ERROR', 'Missing required field: status', 400);
    }

    const validTransitions: Record<string, string[]> = {
      unverified: ['verified', 'disputed', 'retracted'],
      disputed: ['verified', 'retracted'],
      verified: ['retracted'],
    };

    const allowed = validTransitions[existing.verificationStatus];
    if (!allowed || !allowed.includes(body.status)) {
      throw new AppError(
        'INVALID_TRANSITION',
        `Cannot transition from ${existing.verificationStatus} to ${body.status}`,
        400
      );
    }

    const updated = await ctx.storage.updateFailure(id, {
      verificationStatus: body.status,
      verifiedBy: body.verifiedBy,
      verificationNotes: body.notes,
    });

    await ctx.storage.recordTimelineEvent(id, `status_changed_to_${body.status}`, body.verifiedBy, body.notes);

    return c.json(updated);
  });

  // DELETE /:id — Delete a failure report
  app.delete('/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ctx.storage.deleteFailure(id);

    if (!deleted) {
      throw new AppError('NOT_FOUND', `Failure report ${id} not found`, 404);
    }

    return c.json({ deleted: true, id });
  });

  return app;
}
