import { describe, it, expect } from 'vitest';
import { validateFailureReport, isValidISODate, checkIntegrity } from '../src/validation';
import type { FailureReport } from '../src/types';

describe('Validation', () => {
  it('should validate a valid failure report', () => {
    const report = {
      id: 'report_123',
      type: 'model.inference_error',
      severity: 'high',
      domain: 'reasoning',
      title: 'Test error',
      description: 'Test description',
      timestamp: '2026-02-28T12:00:00Z',
      verificationStatus: 'unverified',
      version: 1,
      createdAt: '2026-02-28T12:00:00Z',
      updatedAt: '2026-02-28T12:00:00Z',
    };

    const result = validateFailureReport(report);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should reject invalid report (missing required fields)', () => {
    const report = { id: 'report_123' };
    const result = validateFailureReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it('should validate ISO dates', () => {
    expect(isValidISODate('2026-02-28T12:00:00Z')).toBe(true);
    expect(isValidISODate('not-a-date')).toBe(false);
  });

  it('should check integrity of report collection', () => {
    const reports: FailureReport[] = [
      {
        id: 'report_1',
        type: 'model.inference_error',
        severity: 'high',
        domain: 'reasoning',
        title: 'Error 1',
        description: 'Description 1',
        timestamp: '2026-02-28T12:00:00Z',
        verificationStatus: 'unverified',
        version: 1,
        createdAt: '2026-02-28T12:00:00Z',
        updatedAt: '2026-02-28T12:00:00Z',
      },
      {
        id: 'report_1',
        type: 'model.hallucination',
        severity: 'medium',
        domain: 'reasoning',
        title: 'Error 2',
        description: 'Description 2',
        timestamp: '2026-02-28T13:00:00Z',
        verificationStatus: 'unverified',
        version: 1,
        createdAt: '2026-02-28T13:00:00Z',
        updatedAt: '2026-02-28T13:00:00Z',
      },
    ];

    const result = checkIntegrity(reports);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Duplicate report ID: report_1');
  });
});
