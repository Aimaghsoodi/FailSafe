import type { RiskSignal } from '@failsafe/core';
import { FailSafeClient } from './client';

export interface InterceptorConfig {
  client: FailSafeClient;
  riskThreshold?: number;
  blockOnCritical?: boolean;
}

/**
 * FailSafeInterceptor intercepts HTTP responses to check for risk signals
 */
export class FailSafeInterceptor {
  private client: FailSafeClient;
  private riskThreshold: number;
  private blockOnCritical: boolean;

  constructor(config: InterceptorConfig) {
    this.client = config.client;
    this.riskThreshold = config.riskThreshold ?? 75;
    this.blockOnCritical = config.blockOnCritical ?? true;
  }

  /**
   * Intercept a fetch response to check for risk
   */
  async interceptResponse(response: Response): Promise<{ response: Response; riskSignal?: RiskSignal }> {
    try {
      const data = await response.clone().json();

      const riskSignal = await this.client.check({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: data,
      });

      if (this.blockOnCritical && riskSignal.level === 'critical') {
        throw new Error(`Critical risk detected: ${riskSignal.type}`);
      }

      return {
        response,
        riskSignal,
      };
    } catch (error) {
      return { response };
    }
  }

  /**
   * Create a fetch wrapper that intercepts responses
   */
  wrapFetch(originalFetch: typeof fetch): typeof fetch {
    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const response = await originalFetch(input, init);
      const { response: interceptedResponse } = await this.interceptResponse(response);
      return interceptedResponse;
    };
  }
}

export type RequestInfo = Request | string;
