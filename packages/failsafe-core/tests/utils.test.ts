import { describe, it, expect } from 'vitest';
import { generateId, getCurrentTimestamp, hashString, normalizeScore, isTimestampInRange } from '../src/utils';

describe('Utils', () => {
  it('should generate unique IDs with prefix', () => {
    const id1 = generateId('report');
    const id2 = generateId('report');
    expect(id1).toMatch(/^report_/);
    expect(id2).toMatch(/^report_/);
    expect(id1).not.toBe(id2);
  });

  it('should get current ISO timestamp', () => {
    const ts = getCurrentTimestamp();
    expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should hash strings consistently', () => {
    const hash1 = hashString('test');
    const hash2 = hashString('test');
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it('should normalize scores', () => {
    expect(normalizeScore(150)).toBe(100);
    expect(normalizeScore(-10)).toBe(0);
    expect(normalizeScore(50)).toBe(50);
  });

  it('should check timestamp in range', () => {
    const start = '2026-02-28T10:00:00Z';
    const end = '2026-02-28T14:00:00Z';
    const inRange = '2026-02-28T12:00:00Z';
    const outOfRange = '2026-02-28T15:00:00Z';

    expect(isTimestampInRange(inRange, start, end)).toBe(true);
    expect(isTimestampInRange(outOfRange, start, end)).toBe(false);
  });
});
