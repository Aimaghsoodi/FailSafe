import type {
  FailureReport,
  FailureReportFilter,
  FailurePattern,
  RiskSignal,
  QueryResult,
  FailureStats,
} from '@failsafe/core';

export interface ClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * FailSafeClient provides a client interface for interacting with FailSafe services.
 * It handles failure reporting, risk checking, pattern matching, and statistics retrieval.
 */
export class FailSafeClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: ClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
    this.timeout = config.timeout || 30000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Submit a failure report to the FailSafe system
   */
  async submit(report: Omit<FailureReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<FailureReport> {
    try {
      const response = await this.fetch('/reports', {
        method: 'POST',
        body: JSON.stringify(report),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to submit report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check the risk level for a given input or scenario
   */
  async check(input: Record<string, unknown>): Promise<RiskSignal> {
    try {
      const response = await this.fetch('/check', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to check risk: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Search for failure reports matching the given filter criteria
   */
  async search(filter: FailureReportFilter): Promise<QueryResult<FailureReport>> {
    try {
      const params = new URLSearchParams();

      if (filter.types) params.append('types', filter.types.join(','));
      if (filter.severities) params.append('severities', filter.severities.join(','));
      if (filter.domains) params.append('domains', filter.domains.join(','));
      if (filter.verificationStatus) params.append('status', filter.verificationStatus.join(','));
      if (filter.tags) params.append('tags', filter.tags.join(','));
      if (filter.dateRange) {
        params.append('startDate', filter.dateRange.start);
        params.append('endDate', filter.dateRange.end);
      }
      if (filter.source) params.append('source', filter.source);
      if (filter.search) params.append('search', filter.search);

      const response = await this.fetch(`/reports?${params.toString()}`, {
        method: 'GET',
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to search reports: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get failure patterns from the system
   */
  async getPatterns(): Promise<FailurePattern[]> {
    try {
      const response = await this.fetch('/patterns', {
        method: 'GET',
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to get patterns: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get statistics about failure reports
   */
  async getStats(): Promise<FailureStats> {
    try {
      const response = await this.fetch('/stats', {
        method: 'GET',
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to get stats: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Verify a failure report (mark as verified or disputed)
   */
  async verify(
    reportId: string,
    status: 'verified' | 'disputed',
    notes?: string
  ): Promise<FailureReport> {
    try {
      const response = await this.fetch(`/reports/${reportId}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to verify report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Make an HTTP request to the FailSafe server
   */
  private async fetch(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
