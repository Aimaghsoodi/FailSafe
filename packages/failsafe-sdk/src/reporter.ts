import type { FailureReport, FailureType, Severity, Domain } from '@failsafe/core';
import { FailSafeClient } from './client';

/**
 * FailureReporter provides convenient helpers for reporting failures
 */
export class FailureReporter {
  constructor(private client: FailSafeClient) {}

  /**
   * Report a custom failure
   */
  async report(
    type: FailureType,
    severity: Severity,
    domain: Domain,
    title: string,
    description: string,
    options?: {
      errorMessage?: string;
      errorStack?: string;
      tags?: string[];
      context?: Record<string, unknown>;
    }
  ): Promise<FailureReport> {
    return this.client.submit({
      type,
      severity,
      domain,
      title,
      description,
      errorMessage: options?.errorMessage,
      errorStack: options?.errorStack,
      tags: options?.tags,
      context: options?.context ? JSON.stringify(options.context) : undefined,
      verificationStatus: 'unverified',
      version: 1,
    });
  }

  /**
   * Report a timeout failure
   */
  async reportTimeout(
    title: string,
    duration?: number,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'execution.timeout',
      'high',
      'performance',
      title,
      `Operation timed out${duration ? ` after ${duration}ms` : ''}`,
      { context }
    );
  }

  /**
   * Report out of memory error
   */
  async reportOutOfMemory(
    title: string,
    memoryUsed?: number,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'execution.out_of_memory',
      'critical',
      'performance',
      title,
      `Out of memory${memoryUsed ? ` (${memoryUsed}MB used)` : ''}`,
      { context }
    );
  }

  /**
   * Report a crash
   */
  async reportCrash(
    title: string,
    error: Error,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'execution.crash',
      'critical',
      'general',
      title,
      error.message,
      {
        errorMessage: error.message,
        errorStack: error.stack,
        context,
      }
    );
  }

  /**
   * Report a network error
   */
  async reportNetworkError(
    title: string,
    error: Error,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'io.network_error',
      'high',
      'general',
      title,
      error.message,
      {
        errorMessage: error.message,
        errorStack: error.stack,
        context,
      }
    );
  }

  /**
   * Report a validation error
   */
  async reportValidationError(
    title: string,
    description: string,
    input?: unknown,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'io.malformed_data',
      'medium',
      'general',
      title,
      description,
      {
        context: { ...context, input },
      }
    );
  }

  /**
   * Report a permission denied error
   */
  async reportPermissionDenied(
    title: string,
    resource?: string,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'security.unauthorized_access',
      'high',
      'security',
      title,
      `Access denied${resource ? ` to ${resource}` : ''}`,
      { context }
    );
  }

  /**
   * Report a prompt injection attempt
   */
  async reportPromptInjection(
    title: string,
    input: string,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'security.prompt_injection',
      'critical',
      'security',
      title,
      'Potential prompt injection detected',
      {
        context: { ...context, suspiciousInput: input },
      }
    );
  }

  /**
   * Report a model inference error
   */
  async reportModelError(
    title: string,
    error: Error,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'model.inference_error',
      'high',
      'reasoning',
      title,
      error.message,
      {
        errorMessage: error.message,
        errorStack: error.stack,
        context,
      }
    );
  }

  /**
   * Report a token limit exceeded error
   */
  async reportTokenLimitExceeded(
    title: string,
    tokensUsed?: number,
    tokensLimit?: number,
    context?: Record<string, unknown>
  ): Promise<FailureReport> {
    return this.report(
      'model.token_limit_exceeded',
      'high',
      'reasoning',
      title,
      `Token limit exceeded${tokensUsed && tokensLimit ? ` (${tokensUsed}/${tokensLimit})` : ''}`,
      { context }
    );
  }
}
