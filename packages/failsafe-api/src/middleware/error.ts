/**
 * Error Handling Middleware
 */

import type { Context } from 'hono';

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export class AppError extends Error implements ApiError {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, statusCode = 500, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'AppError';
  }
}

export function createErrorHandler() {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (error: any) {
      const err = error instanceof AppError ? error : new AppError(
        'INTERNAL_SERVER_ERROR',
        error?.message || 'Internal server error',
        500
      );

      const statusCode = err.statusCode || 500;
      return c.json(
        {
          error: {
            code: err.code,
            message: err.message,
            details: err.details,
          },
        },
        statusCode
      );
    }
  };
}
