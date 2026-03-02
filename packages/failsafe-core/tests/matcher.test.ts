import { describe, it, expect } from 'vitest';
import { filterFailureReports, queryFailureReports, calculateFailureStats, groupBy } from '../src/matcher';
import type { FailureReport } from '../src/types';

describe('Matcher', () => {
  const reports: FailureReport[] = [
    {
      id: 'report_1',
      type: 'model.inference_error',
      severity: 'high',
      domain: 'reasoning',
      title: 'Error 1',
      description: 'Description 1',
      timestamp: '2026-02-28T12:00:00Z',
      verificationStatus: 'verified',
      version: 1,
      createdAt: '2026-02-28T12:00:00Z',
      updatedAt: '2026-02-28T12:00:00Z',
    },
    {
      id: 'report_2',
      type: 'security.prompt_injection',
      severity: 'critical',
      domain: 'security',
      title: 'Security issue',
      description: 'Prompt injection detected',
      timestamp: '2026-02-28T13:00:00Z',
      verificationStatus: 'unverified',
      version: 1,
      createdAt: '2026-02-28T13:00:00Z',
      updatedAt: '2026-02-28T13:00:00Z',
    },
  ];

  it('should filter by severity', () => {
    const filtered = filterFailureReports(reports, { severities: ['critical'] });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].severity).toBe('critical');
  });

  it('should filter by domain', () => {
    const filtered = filterFailureReports(reports, { domains: ['reasoning'] });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].domain).toBe('reasoning');
  });

  it('should query with pagination', () => {
    const result = queryFailureReports(reports, {}, 0, 1);
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(2);
    expect(result.hasMore).toBe(true);
  });

  it('should calculate failure stats', () => {
    const stats = calculateFailureStats(reports);
    expect(stats.totalReports).toBe(2);
    expect(stats.bySeverity.critical).toBe(1);
    expect(stats.bySeverity.high).toBe(1);
    expect(stats.unverifiedCount).toBe(1);
    expect(stats.resolvedCount).toBe(0);
  });

  it('should group by field', () => {
    const grouped = groupBy(reports, 'severity');
    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped['high']).toHaveLength(1);
    expect(grouped['critical']).toHaveLength(1);
  });
});
