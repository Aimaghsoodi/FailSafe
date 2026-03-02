import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FailSafeMiddleware } from '../src/middleware';
import { FailSafeClient } from '../src/client';

describe('FailSafeMiddleware', () => {
  let middleware: FailSafeMiddleware;
  let client: FailSafeClient;

  beforeEach(() => {
    client = new FailSafeClient();
    middleware = new FailSafeMiddleware({
      client,
      autoReport: true,
      riskThreshold: 75,
    });

    globalThis.fetch = vi.fn();
  });

  it('should initialize with options', () => {
    expect(middleware).toBeDefined();
  });

  it('should wrap a function successfully', async () => {
    const testFn = vi.fn(async () => 'success');
    const wrapped = middleware.wrap(testFn, 'test-domain');

    const result = await wrapped();
    expect(result).toBe('success');
    expect(testFn).toHaveBeenCalled();
  });

  it('should handle errors in wrapped function', async () => {
    const error = new Error('Test error');
    const testFn = vi.fn(async () => {
      throw error;
    });

    const wrapped = middleware.wrap(testFn, 'test-domain');

    await expect(wrapped()).rejects.toThrow('Test error');
  });

  it('should check and annotate with risk signal', async () => {
    const mockRiskSignal = {
      id: 'risk_123',
      type: 'anomaly.latency_spike' as const,
      level: 'medium' as const,
      score: 50,
      detectedAt: new Date().toISOString(),
      detector: 'test',
      factors: [],
      acknowledged: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRiskSignal,
    });

    const testFn = async () => 'test-result';
    const result = await middleware.checkAndAnnotate({ test: 'input' }, testFn);

    expect(result.result).toBe('test-result');
    expect(result.riskSignal).toBeDefined();
  });
});
