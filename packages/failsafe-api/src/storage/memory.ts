/**
 * In-Memory Storage Implementation (for testing)
 */

import type { FailureReport, FailurePattern, RiskSignal, QueryResult, FailureStats, FailureReportFilter } from '@failsafe/core';
import type { StorageInterface } from './storage';
import { generateId, getCurrentTimestamp } from './utils';

export class MemoryStorage implements StorageInterface {
  private failures: Map<string, FailureReport> = new Map();
  private patterns: Map<string, FailurePattern> = new Map();
  private signals: Map<string, RiskSignal> = new Map();
  private timeline: Map<string, Array<any>> = new Map();

  async createFailure(report: FailureReport): Promise<FailureReport> {
    this.failures.set(report.id, report);
    this.timeline.set(report.id, []);
    return report;
  }

  async getFailure(id: string): Promise<FailureReport | null> {
    return this.failures.get(id) || null;
  }

  async updateFailure(id: string, updates: Partial<FailureReport>): Promise<FailureReport> {
    const existing = this.failures.get(id);
    if (!existing) throw new Error(`Failure report ${id} not found`);

    const updated: FailureReport = {
      ...existing,
      ...updates,
      id,
      createdAt: existing.createdAt,
      version: existing.version + 1,
      updatedAt: getCurrentTimestamp(),
    };

    this.failures.set(id, updated);
    return updated;
  }

  async deleteFailure(id: string): Promise<boolean> {
    return this.failures.delete(id);
  }

  async listFailures(filter?: FailureReportFilter, limit = 50, offset = 0): Promise<QueryResult<FailureReport>> {
    let items = Array.from(this.failures.values());

    if (filter?.types && filter.types.length > 0) {
      items = items.filter(f => filter.types!.includes(f.type as any));
    }
    if (filter?.severities && filter.severities.length > 0) {
      items = items.filter(f => filter.severities!.includes(f.severity));
    }
    if (filter?.domains && filter.domains.length > 0) {
      items = items.filter(f => filter.domains!.includes(f.domain));
    }
    if (filter?.verificationStatus && filter.verificationStatus.length > 0) {
      items = items.filter(f => filter.verificationStatus!.includes(f.verificationStatus));
    }
    if (filter?.source) {
      items = items.filter(f => f.source === filter.source);
    }
    if (filter?.dateRange) {
      items = items.filter(f => {
        const ts = new Date(f.timestamp).getTime();
        const start = new Date(filter.dateRange!.start).getTime();
        const end = new Date(filter.dateRange!.end).getTime();
        return ts >= start && ts <= end;
      });
    }

    items = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = items.length;
    const paged = items.slice(offset, offset + limit);

    return {
      items: paged,
      total,
      offset,
      limit,
      hasMore: offset + paged.length < total,
    };
  }

  async searchFailures(query: string, limit = 50, offset = 0): Promise<QueryResult<FailureReport>> {
    const searchLower = query.toLowerCase();
    let items = Array.from(this.failures.values()).filter(f =>
      f.title.toLowerCase().includes(searchLower) ||
      f.description.toLowerCase().includes(searchLower) ||
      f.errorMessage?.toLowerCase().includes(searchLower) ||
      f.tags?.some(t => t.toLowerCase().includes(searchLower))
    );

    items = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = items.length;
    const paged = items.slice(offset, offset + limit);

    return {
      items: paged,
      total,
      offset,
      limit,
      hasMore: offset + paged.length < total,
    };
  }

  async countFailures(filter?: FailureReportFilter): Promise<number> {
    const result = await this.listFailures(filter, 1, 0);
    return result.total;
  }

  async createPattern(pattern: FailurePattern): Promise<FailurePattern> {
    this.patterns.set(pattern.id, pattern);
    return pattern;
  }

  async getPattern(id: string): Promise<FailurePattern | null> {
    return this.patterns.get(id) || null;
  }

  async updatePattern(id: string, updates: Partial<FailurePattern>): Promise<FailurePattern> {
    const existing = this.patterns.get(id);
    if (!existing) throw new Error(`Pattern ${id} not found`);

    const updated = { ...existing, ...updates, id, createdAt: existing.createdAt, updatedAt: getCurrentTimestamp() };
    this.patterns.set(id, updated);
    return updated;
  }

  async deletePattern(id: string): Promise<boolean> {
    return this.patterns.delete(id);
  }

  async listPatterns(limit = 50, offset = 0): Promise<QueryResult<FailurePattern>> {
    let items = Array.from(this.patterns.values());
    items = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = items.length;
    const paged = items.slice(offset, offset + limit);

    return {
      items: paged,
      total,
      offset,
      limit,
      hasMore: offset + paged.length < total,
    };
  }

  async createSignal(signal: RiskSignal): Promise<RiskSignal> {
    this.signals.set(signal.id, signal);
    return signal;
  }

  async getSignal(id: string): Promise<RiskSignal | null> {
    return this.signals.get(id) || null;
  }

  async updateSignal(id: string, updates: Partial<RiskSignal>): Promise<RiskSignal> {
    const existing = this.signals.get(id);
    if (!existing) throw new Error(`Signal ${id} not found`);

    const updated = { ...existing, ...updates, id, createdAt: existing.createdAt, updatedAt: getCurrentTimestamp() };
    this.signals.set(id, updated);
    return updated;
  }

  async acknowledgeSignal(id: string, acknowledgedBy: string): Promise<RiskSignal> {
    return this.updateSignal(id, {
      acknowledged: true,
      acknowledgedAt: getCurrentTimestamp(),
      acknowledgedBy,
    });
  }

  async listSignals(limit = 50, offset = 0): Promise<QueryResult<RiskSignal>> {
    let items = Array.from(this.signals.values());
    items = items.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
    const total = items.length;
    const paged = items.slice(offset, offset + limit);

    return {
      items: paged,
      total,
      offset,
      limit,
      hasMore: offset + paged.length < total,
    };
  }

  async getUnacknowledgedSignals(limit = 50): Promise<RiskSignal[]> {
    return Array.from(this.signals.values())
      .filter(s => !s.acknowledged)
      .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
      .slice(0, limit);
  }

  async getStatistics(dateRange?: { start: string; end: string }): Promise<FailureStats> {
    let items = Array.from(this.failures.values());

    if (dateRange) {
      items = items.filter(f => {
        const ts = new Date(f.timestamp).getTime();
        const start = new Date(dateRange.start).getTime();
        const end = new Date(dateRange.end).getTime();
        return ts >= start && ts <= end;
      });
    }

    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byDomain: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    items.forEach(f => {
      byType[f.type] = (byType[f.type] || 0) + 1;
      bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
      byDomain[f.domain] = (byDomain[f.domain] || 0) + 1;
      byStatus[f.verificationStatus] = (byStatus[f.verificationStatus] || 0) + 1;
    });

    const unverified = byStatus['unverified'] || 0;
    const resolved = byStatus['resolved'] || 0;

    return {
      totalReports: items.length,
      byType,
      bySeverity,
      byDomain,
      byStatus,
      averageSeverityScore: 0,
      topFailureTypes: Object.entries(byType).map(([type, count]) => ({ type: type as any, count })).sort((a, b) => b.count - a.count).slice(0, 5),
      topDomains: Object.entries(byDomain).map(([domain, count]) => ({ domain: domain as any, count })).sort((a, b) => b.count - a.count).slice(0, 5),
      unverifiedCount: unverified,
      resolvedCount: resolved,
      resolutionRate: items.length > 0 ? resolved / items.length : 0,
    };
  }

  async getStatisticsByModel(model: string): Promise<Record<string, number>> {
    // Placeholder - would need model tracking in memory storage
    return {};
  }

  async getStatisticsByDomain(domain: string): Promise<Record<string, number>> {
    const items = Array.from(this.failures.values()).filter(f => f.domain === domain);
    const result: Record<string, number> = {};
    items.forEach(f => {
      result[f.severity] = (result[f.severity] || 0) + 1;
    });
    return result;
  }

  async getFailureTimeline(failureId: string): Promise<Array<any>> {
    return this.timeline.get(failureId) || [];
  }

  async recordTimelineEvent(failureId: string, event: string, actor?: string, notes?: string): Promise<void> {
    const events = this.timeline.get(failureId) || [];
    events.push({ id: generateId('timeline'), event, actor, notes, timestamp: getCurrentTimestamp() });
    this.timeline.set(failureId, events);
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }

  async close(): Promise<void> {
    this.failures.clear();
    this.patterns.clear();
    this.signals.clear();
    this.timeline.clear();
  }
}
