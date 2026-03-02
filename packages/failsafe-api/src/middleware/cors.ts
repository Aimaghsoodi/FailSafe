/**
 * CORS Middleware
 */

import type { Context } from 'hono';
import type { ApiConfig } from '../config';

export function createCorsMiddleware(config: ApiConfig) {
  return async (c: Context, next: () => Promise<void>) => {
    if (!config.cors.enabled) {
      await next();
      return;
    }

    const origin = c.req.header('origin');
    const allowed = config.cors.origin === '*' ? '*' :
      Array.isArray(config.cors.origin) ? config.cors.origin : [config.cors.origin];

    const isAllowed = allowed === '*' || (Array.isArray(allowed) && allowed.includes(origin || ''));

    if (isAllowed) {
      c.header('Access-Control-Allow-Origin', origin || '*');
      c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
      c.header('Access-Control-Max-Age', '86400');
    }

    if (c.req.method === 'OPTIONS') {
      return c.text('OK');
    }

    await next();
  };
}
