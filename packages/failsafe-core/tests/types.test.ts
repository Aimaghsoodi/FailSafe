import { describe, it, expect } from 'vitest';
import type { FailureReport, FailureType } from '../src/types';

describe('Type Definitions', () => {
  it('should allow valid FailureType values', () => {
    const types: FailureType[] = [
      'execution.timeout',
      'model.hallucination',
      'security.prompt_injection',
      'integration.api_error',
    ];
    expect(types).toHaveLength(4);
  });

  it('should create valid FailureReport object', () => {
    const report: FailureReport = {
      id: 'report_123',
      type: 'model.inference_error',
      severity: 'high',
      domain: 'reasoning',
      title: 'Test failure',
      description: 'A test failure report',
      timestamp: '2026-02-28T12:00:00Z',
      verificationStatus: 'unverified',
      version: 1,
      createdAt: '2026-02-28T12:00:00Z',
      updatedAt: '2026-02-28T12:00:00Z',
    };
    expect(report.id).toBe('report_123');
    expect(report.type).toBe('model.inference_error');
  });
});
