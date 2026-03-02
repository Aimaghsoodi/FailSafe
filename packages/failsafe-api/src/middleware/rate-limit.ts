/**
 * Rate Limit Middleware
 */

import type { Context } from 'hono';
import type { ApiConfig } from '../config';
import { AppError } from './error';

interface RateLimitEntry {
  requests: number;
  resetTime: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime < now) {
        this.limits.delete(key);
      }
    }
  }

  isAllowed(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    let entry = this.limits.get(key);

    if (!entry || entry.resetTime < now) {
      entry = { requests: 0, resetTime: now + this.windowMs };
      this.limits.set(key, entry);
    }

    entry.requests++;
    const allowed = entry.requests <= this.maxRequests;
    const remaining = Math.max(0, this.maxRequests - entry.requests);

    return { allowed, remaining, resetTime: entry.resetTime };
  }
}

export function createRateLimitMiddleware(config: ApiConfig) {
  const limiter = new RateLimiter(config.rateLimit.windowMs, config.rateLimit.maxRequests);

  return async (c: Context, next: () => Promise<void>) => {
    if (!config.rateLimit.enabled) {
      await next();
      return;
    }

    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const { allowed, remaining, resetTime } = limiter.isAllowed(ip);

    c.header('X-RateLimit-Limit', config.rateLimit.maxRequests.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());
    c.header('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

    if (!allowed) {
      throw new AppError(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests, please try again later',
        429
      );
    }

    await next();
  };
}
