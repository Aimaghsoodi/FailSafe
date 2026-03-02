import { describe, it, expect } from 'vitest';
import { calculateRiskScore, getRiskLevelFromScore, createRiskSignal, acknowledgeRiskSignal, isCriticalRisk } from '../src/risk-signal';
import type { RiskFactor } from '../src/types';

describe('RiskSignal', () => {
  const factors: RiskFactor[] = [
    { name: 'severity', weight: 0.5, value: 80 },
    { name: 'frequency', weight: 0.5, value: 70 },
  ];

  it('should calculate risk score', () => {
    const score = calculateRiskScore(factors);
    expect(score).toBeGreaterThan(70);
    expect(score).toBeLessThanOrEqual(80);
  });

  it('should determine risk level from score', () => {
    expect(getRiskLevelFromScore(95)).toBe('critical');
    expect(getRiskLevelFromScore(80)).toBe('high');
    expect(getRiskLevelFromScore(60)).toBe('medium');
    expect(getRiskLevelFromScore(30)).toBe('low');
    expect(getRiskLevelFromScore(10)).toBe('none');
  });

  it('should create a risk signal', () => {
    const signal = createRiskSignal('anomaly.error_rate_increase', factors, 'detector_1');
    expect(signal.id).toBeDefined();
    expect(signal.level).toBeDefined();
    expect(signal.score).toBeGreaterThan(0);
    expect(signal.acknowledged).toBe(false);
  });

  it('should acknowledge a risk signal', () => {
    const signal = createRiskSignal('anomaly.latency_spike', factors, 'detector_2');
    const acknowledged = acknowledgeRiskSignal(signal, 'reviewer_1');

    expect(acknowledged.acknowledged).toBe(true);
    expect(acknowledged.acknowledgedBy).toBe('reviewer_1');
    expect(acknowledged.acknowledgedAt).toBeDefined();
  });

  it('should identify critical risk', () => {
    const criticalFactors: RiskFactor[] = [
      { name: 'severity', weight: 1, value: 95 },
    ];
    const signal = createRiskSignal('safety.prompt_injection_attempt', criticalFactors, 'detector_3');
    expect(isCriticalRisk(signal)).toBe(true);
  });
});
