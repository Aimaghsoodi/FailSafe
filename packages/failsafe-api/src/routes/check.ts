import { Hono } from 'hono';
import type { AppContext } from '../server.js';
import { AppError } from '../middleware/error.js';
import { generateId, getCurrentTimestamp } from '../storage/utils.js';

export function createCheckRoutes(ctx: AppContext): Hono {
  const app = new Hono();

  // POST / — Pre-flight risk check
  app.post('/', async (c) => {
    const body = await c.req.json();

    if (!body.type && !body.title && !body.description) {
      throw new AppError('VALIDATION_ERROR', 'Provide at least type, title, or description for risk check', 400);
    }

    // Search for matching patterns
    const patterns = await ctx.storage.listPatterns(100, 0);
    const matchedPatterns: Array<{ patternId: string; patternName: string; confidence: number }> = [];

    const searchTerms = [body.type, body.title, body.description, body.errorMessage]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    for (const pattern of patterns.items) {
      const patternTerms = [pattern.name, pattern.description, ...(pattern.failureTypes || [])].join(' ').toLowerCase();
      // Simple keyword overlap scoring
      const searchWords = searchTerms.split(/\s+/);
      const patternWords = new Set(patternTerms.split(/\s+/));
      const matchCount = searchWords.filter((w) => patternWords.has(w)).length;
      const confidence = searchWords.length > 0 ? matchCount / searchWords.length : 0;

      if (confidence > 0.1) {
        matchedPatterns.push({
          patternId: pattern.id,
          patternName: pattern.name,
          confidence: Math.min(confidence, 1),
        });
      }
    }

    matchedPatterns.sort((a, b) => b.confidence - a.confidence);

    // Calculate risk score based on matches
    const maxConfidence = matchedPatterns.length > 0 ? matchedPatterns[0].confidence : 0;
    const riskScore = Math.round(maxConfidence * 100);
    const riskLevel =
      riskScore >= 90 ? 'critical' : riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : riskScore >= 15 ? 'low' : 'none';

    const signal = {
      id: generateId('risk'),
      riskLevel,
      riskScore,
      matchedPatterns: matchedPatterns.slice(0, 5),
      recommendations: [],
      timestamp: getCurrentTimestamp(),
    };

    return c.json(signal);
  });

  return app;
}
