import { describe, it, expect } from 'vitest';
import { calculateImpactScore, calculateUrgencyScore, calculateCompositeScore, rankReportsByScore } from '../src/scoring';
import type { FailureReport } from '../src/types';

describe('Scoring', () => {
  const securityReport: FailureReport = {
    id: 'report_sec',
    type: 'security.prompt_injection',
    severity: 'critical',
    domain: 'security',
    title: 'Security issue',
    description: 'Injection detected',
    timestamp: '2026-02-28T12:00:00Z',
    verificationStatus: 'unverified',
    version: 1,
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-02-28T12:00:00Z',
  };

  const resolvedReport: FailureReport = {
    ...securityReport,
    id: 'report_resolved',
    verificationStatus: 'resolved',
    resolvedAt: '2026-02-28T13:00:00Z',
  };

  it('should calculate impact score', () => {
    const score = calculateImpactScore(securityReport);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should give higher impact score for security domain', () => {
    const securityScore = calculateImpactScore(securityReport);
    const otherReport = { ...securityReport, domain: 'reasoning' as const };
    const otherScore = calculateImpactScore(otherReport);
    expect(securityScore).toBeGreaterThan(otherScore);
  });

  it('should calculate urgency score', () => {
    const score = calculateUrgencyScore(securityReport);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should calculate composite score', () => {
    const score = calculateCompositeScore(securityReport);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should rank reports by score', () => {
    const reports = [resolvedReport, securityReport];
    const ranked = rankReportsByScore(reports);
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
  });
});
