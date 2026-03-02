/**
 * Storage Interface
 */

import type { FailureReport, FailurePattern, RiskSignal, QueryResult, FailureStats, FailureReportFilter } from '@failsafe/core';

export interface StorageInterface {
  // Failure Reports
  createFailure(report: FailureReport): Promise<FailureReport>;
  getFailure(id: string): Promise<FailureReport | null>;
  updateFailure(id: string, updates: Partial<FailureReport>): Promise<FailureReport>;
  deleteFailure(id: string): Promise<boolean>;
  listFailures(filter?: FailureReportFilter, limit?: number, offset?: number): Promise<QueryResult<FailureReport>>;
  searchFailures(query: string, limit?: number, offset?: number): Promise<QueryResult<FailureReport>>;
  countFailures(filter?: FailureReportFilter): Promise<number>;

  // Patterns
  createPattern(pattern: FailurePattern): Promise<FailurePattern>;
  getPattern(id: string): Promise<FailurePattern | null>;
  updatePattern(id: string, updates: Partial<FailurePattern>): Promise<FailurePattern>;
  deletePattern(id: string): Promise<boolean>;
  listPatterns(limit?: number, offset?: number): Promise<QueryResult<FailurePattern>>;

  // Risk Signals
  createSignal(signal: RiskSignal): Promise<RiskSignal>;
  getSignal(id: string): Promise<RiskSignal | null>;
  updateSignal(id: string, updates: Partial<RiskSignal>): Promise<RiskSignal>;
  acknowledgeSignal(id: string, acknowledgedBy: string): Promise<RiskSignal>;
  listSignals(limit?: number, offset?: number): Promise<QueryResult<RiskSignal>>;
  getUnacknowledgedSignals(limit?: number): Promise<RiskSignal[]>;

  // Statistics
  getStatistics(dateRange?: { start: string; end: string }): Promise<FailureStats>;
  getStatisticsByModel(model: string): Promise<Record<string, number>>;
  getStatisticsByDomain(domain: string): Promise<Record<string, number>>;

  // Timeline & Audit
  getFailureTimeline(failureId: string): Promise<Array<any>>;
  recordTimelineEvent(failureId: string, event: string, actor?: string, notes?: string): Promise<void>;

  // Health check
  isHealthy(): Promise<boolean>;
  close(): Promise<void>;
}

export interface FailureCheckRequest {
  type: string;
  severity: string;
  domain: string;
  title: string;
  description: string;
  context?: string;
  errorMessage?: string;
  errorCode?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}
