import { describe, it, expect } from 'vitest';
import { matchesCondition, matchesPattern, createFailurePattern, findMatchingPatterns } from '../src/pattern';
import type { FailureReport } from '../src/types';

describe('Pattern', () => {
  const report: FailureReport = {
    id: 'report_123',
    type: 'model.inference_error',
    severity: 'high',
    domain: 'reasoning',
    title: 'Timeout error',
    description: 'Request timeout',
    timestamp: '2026-02-28T12:00:00Z',
    errorMessage: 'TIMEOUT: Request exceeded 30s',
    verificationStatus: 'unverified',
    version: 1,
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-02-28T12:00:00Z',
  };

  it('should match equals condition', () => {
    const condition = { field: 'type', operator: 'equals' as const, value: 'model.inference_error' };
    expect(matchesCondition(report, condition)).toBe(true);
  });

  it('should match contains condition', () => {
    const condition = { field: 'errorMessage', operator: 'contains' as const, value: 'TIMEOUT' };
    expect(matchesCondition(report, condition)).toBe(true);
  });

  it('should match pattern', () => {
    const pattern = createFailurePattern(
      'Timeout Pattern',
      'Detects timeout errors',
      ['model.inference_error'],
      [
        { field: 'errorMessage', operator: 'contains' as const, value: 'TIMEOUT' },
        { field: 'severity', operator: 'equals' as const, value: 'high' },
      ],
      'high'
    );

    expect(matchesPattern(report, pattern)).toBe(true);
  });

  it('should find matching patterns', () => {
    const pattern1 = createFailurePattern(
      'Inference Errors',
      'All inference errors',
      ['model.inference_error'],
      [],
      'high'
    );
    const pattern2 = createFailurePattern(
      'Timeout Errors',
      'Timeout errors',
      ['io.timeout'],
      [],
      'medium'
    );

    const matched = findMatchingPatterns(report, [pattern1, pattern2]);
    expect(matched).toHaveLength(1);
    expect(matched[0].name).toBe('Inference Errors');
  });
});
