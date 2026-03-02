import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FailSafeClient } from '../src/client';
import type { FailureReport } from '@failsafe/core';

describe('FailSafeClient', () => {
  let client: FailSafeClient;

  beforeEach(() => {
    client = new FailSafeClient({
      baseUrl: 'http://localhost:3000',
      timeout: 5000,
    });

    // Mock global fetch
    globalThis.fetch = vi.fn();
  });

  it('should initialize with config', () => {
    const customClient = new FailSafeClient({
      baseUrl: 'http://custom.com',
      timeout: 10000,
    });
    expect(customClient).toBeDefined();
  });

  it('should submit a failure report', async () => {
    const mockResponse = {
      id: 'report_123',
      type: 'execution.crash' as const,
      severity: 'critical' as const,
      domain: 'general' as const,
      title: 'Test crash',
      description: 'Test description',
      verificationStatus: 'unverified' as const,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const report = await client.submit({
      type: 'execution.crash',
      severity: 'critical',
      domain: 'general',
      title: 'Test crash',
      description: 'Test description',
      verificationStatus: 'unverified',
      version: 1,
    });

    expect(report.id).toBe('report_123');
    expect(report.type).toBe('execution.crash');
  });

  it('should check risk', async () => {
    const mockRiskSignal = {
      id: 'risk_123',
      type: 'anomaly.latency_spike' as const,
      level: 'high' as const,
      score: 80,
      detectedAt: new Date().toISOString(),
      detector: 'test-detector',
      factors: [],
      acknowledged: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRiskSignal,
    });

    const signal = await client.check({ test: 'input' });
    expect(signal.id).toBe('risk_123');
    expect(signal.level).toBe('high');
  });

  it('should search reports', async () => {
    const mockResult = {
      items: [],
      total: 0,
      offset: 0,
      limit: 10,
      hasMore: false,
    };

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await client.search({
      severities: ['critical', 'high'],
    });

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should get patterns', async () => {
    const mockPatterns = [
      {
        id: 'pattern_123',
        name: 'Timeout Pattern',
        description: 'Detects timeout failures',
        failureTypes: ['execution.timeout' as const],
        conditions: [],
        severity: 'high' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPatterns,
    });

    const patterns = await client.getPatterns();
    expect(patterns).toHaveLength(1);
    expect(patterns[0].name).toBe('Timeout Pattern');
  });

  it('should get stats', async () => {
    const mockStats = {
      totalReports: 100,
      byType: { 'execution.crash': 50 },
      bySeverity: { critical: 25, high: 75 },
      byDomain: { general: 100 },
      byStatus: { unverified: 50, verified: 50 },
      averageSeverityScore: 75,
      topFailureTypes: [{ type: 'execution.crash' as const, count: 50 }],
      topDomains: [{ domain: 'general' as const, count: 100 }],
      unverifiedCount: 50,
      resolvedCount: 25,
      resolutionRate: 0.25,
    };

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStats,
    });

    const stats = await client.getStats();
    expect(stats.totalReports).toBe(100);
  });

  it('should verify a report', async () => {
    const mockResponse = {
      id: 'report_123',
      type: 'execution.crash' as const,
      severity: 'critical' as const,
      domain: 'general' as const,
      title: 'Test crash',
      description: 'Test description',
      verificationStatus: 'verified' as const,
      verifiedBy: 'user_123',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await client.verify('report_123', 'verified', 'Confirmed');
    expect(result.verificationStatus).toBe('verified');
  });

  it('should handle errors', async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Internal server error' }),
    });

    await expect(client.getStats()).rejects.toThrow('HTTP 500');
  });
});
