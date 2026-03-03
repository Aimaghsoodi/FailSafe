import type { FailureReport, RiskSignal } from '@failsafe/core';
import { FailSafeClient } from './client';

export interface MiddlewareOptions {
  client: FailSafeClient;
  autoReport?: boolean;
  riskThreshold?: number;
}

/**
 * FailSafeMiddleware provides request/response wrapping and checking capabilities
 */
export class FailSafeMiddleware {
  private client: FailSafeClient;
  private autoReport: boolean;
  private riskThreshold: number;

  constructor(options: MiddlewareOptions) {
    this.client = options.client;
    this.autoReport = options.autoReport ?? true;
    this.riskThreshold = options.riskThreshold ?? 75;
  }

  /**
   * Wrap a function to check risk before execution
   */
  wrap<T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
    domain: string = 'general'
  ): (...args: Args) => Promise<T> {
    return async (...args: Args): Promise<T> => {
      try {
        const result = await fn(...args);
        return result;
      } catch (error) {
        if (this.autoReport) {
          await this.reportError(error, domain, args);
        }
        throw error;
      }
    };
  }

  /**
   * Check input and annotate response with risk information
   */
  async checkAndAnnotate<T>(
    input: Record<string, unknown>,
    fn: () => Promise<T>
  ): Promise<{ result: T; riskSignal: RiskSignal }> {
    const riskSignal = await this.client.check(input);

    const result = await fn();

    return {
      result,
      riskSignal,
    };
  }

  /**
   * Report an error as a failure
   */
  private async reportError(error: unknown, domain: string, context: unknown[]): Promise<void> {
    try {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      const report: Omit<FailureReport, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'execution.crash',
        severity: 'high',
        domain: domain as any,
        title: 'Middleware caught exception',
        description: errorMessage,
        errorMessage,
        errorStack,
        context: JSON.stringify({ context }),
        timestamp: new Date().toISOString(),
        verificationStatus: 'unverified',
        version: 1,
      };

      await this.client.submit(report);
    } catch {
      // Silently fail to avoid cascading errors
    }
  }
}
