import { describe, it, expect } from 'vitest';
import { hashValue, anonymizeUserId, removesSensitiveData, hasSensitiveData } from '../src/anonymizer';
import type { FailureReport } from '../src/types';

describe('Anonymizer', () => {
  it('should hash values', () => {
    const hash1 = hashValue('user123');
    const hash2 = hashValue('user123');
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it('should anonymize user IDs', () => {
    const userId = 'user@example.com';
    const anonymized = anonymizeUserId(userId);
    expect(anonymized).not.toBe(userId);
    expect(anonymized.length).toBeLessThanOrEqual(16);
  });

  it('should remove sensitive data', () => {
    const report: FailureReport = {
      id: 'report_123',
      type: 'model.inference_error',
      severity: 'high',
      domain: 'reasoning',
      title: 'Error',
      description: 'Description',
      timestamp: '2026-02-28T12:00:00Z',
      userId: 'user123',
      input: { secret: 'password' },
      output: { result: 'data' },
      verificationStatus: 'unverified',
      version: 1,
      createdAt: '2026-02-28T12:00:00Z',
      updatedAt: '2026-02-28T12:00:00Z',
    };

    const sanitized = removesSensitiveData(report);
    expect(sanitized.userId).not.toBe('user123');
    expect(sanitized.input).toBe('[REDACTED]');
    expect(sanitized.output).toBe('[REDACTED]');
  });

  it('should detect sensitive data', () => {
    const reportWithEmail: FailureReport = {
      id: 'report_123',
      type: 'model.inference_error',
      severity: 'high',
      domain: 'reasoning',
      title: 'Error user@example.com',
      description: 'Description',
      timestamp: '2026-02-28T12:00:00Z',
      verificationStatus: 'unverified',
      version: 1,
      createdAt: '2026-02-28T12:00:00Z',
      updatedAt: '2026-02-28T12:00:00Z',
    };

    expect(hasSensitiveData(reportWithEmail)).toBe(true);
  });
});
