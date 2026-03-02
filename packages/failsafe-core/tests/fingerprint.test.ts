import { describe, it, expect } from 'vitest';
import { createFingerprint, findDuplicates, deduplicateReports } from '../src/fingerprint';
import type { FailureReport } from '../src/types';

describe('Fingerprint', () => {
  const baseReport: FailureReport = {
    id: 'report_1',
    type: 'model.inference_error',
    severity: 'high',
    domain: 'reasoning',
    title: 'Error',
    description: 'Description',
    timestamp: '2026-02-28T12:00:00Z',
    errorMessage: 'Same error message',
    errorStack: 'Same stack trace',
    verificationStatus: 'unverified',
    version: 1,
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-02-28T12:00:00Z',
  };

  it('should create fingerprint', () => {
    const fp = createFingerprint(baseReport);
    expect(fp.id).toBeDefined();
    expect(fp.hash).toBeDefined();
    expect(fp.failureReportId).toBe('report_1');
    expect(fp.components.type).toBe('model.inference_error');
  });

  it('should find duplicate reports', () => {
    const report2 = { ...baseReport, id: 'report_2', timestamp: '2026-02-28T13:00:00Z' };
    const report3 = {
      ...baseReport,
      id: 'report_3',
      errorMessage: 'Different error',
      timestamp: '2026-02-28T14:00:00Z',
    };

    const duplicates = findDuplicates([baseReport, report2, report3]);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0]).toHaveLength(2);
  });

  it('should deduplicate reports', () => {
    const report2 = { ...baseReport, id: 'report_2', timestamp: '2026-02-28T13:00:00Z' };
    const deduped = deduplicateReports([baseReport, report2]);
    expect(deduped).toHaveLength(1);
  });
});
