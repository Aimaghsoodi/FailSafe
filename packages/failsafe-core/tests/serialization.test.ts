import { describe, it, expect } from 'vitest';
import { serializeFailureReport, deserializeFailureReport, exportAsJSONL, importFromJSONL, exportAsCSV } from '../src/serialization';
import type { FailureReport } from '../src/types';

describe('Serialization', () => {
  const report: FailureReport = {
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

  it('should serialize and deserialize failure report', () => {
    const json = serializeFailureReport(report);
    expect(json).toContain('report_123');

    const deserialized = deserializeFailureReport(json);
    expect(deserialized.id).toBe(report.id);
    expect(deserialized.type).toBe(report.type);
  });

  it('should export as JSONL', () => {
    const reports = [report];
    const jsonl = exportAsJSONL(reports);
    expect(jsonl).toContain('report_123');
  });

  it('should import from JSONL', () => {
    const jsonl = `{"id":"report_1","type":"model.inference_error","severity":"high","domain":"reasoning","title":"Test","description":"Test","timestamp":"2026-02-28T12:00:00Z","verificationStatus":"unverified","version":1,"createdAt":"2026-02-28T12:00:00Z","updatedAt":"2026-02-28T12:00:00Z"}`;
    const imported = importFromJSONL(jsonl);
    expect(imported).toHaveLength(1);
    expect(imported[0].id).toBe('report_1');
  });

  it('should export as CSV', () => {
    const csv = exportAsCSV([report]);
    expect(csv).toContain('id');
    expect(csv).toContain('report_123');
    expect(csv).toContain('model.inference_error');
  });
});
