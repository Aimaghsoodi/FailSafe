import type { RiskSignal, RiskFactor, RiskLevel } from './types';
import { generateId, getCurrentTimestamp, normalizeScore } from './utils';

export const RISK_LEVEL_THRESHOLDS = {
  none: 0,
  low: 25,
  medium: 50,
  high: 75,
  critical: 90,
} as const;

export function calculateRiskScore(factors: RiskFactor[]): number {
  if (factors.length === 0) return 0;
  const weightedSum = factors.reduce((sum, f) => sum + f.value * f.weight, 0);
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  return normalizeScore(totalWeight > 0 ? weightedSum / totalWeight : 0);
}

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= RISK_LEVEL_THRESHOLDS.critical) return 'critical';
  if (score >= RISK_LEVEL_THRESHOLDS.high) return 'high';
  if (score >= RISK_LEVEL_THRESHOLDS.medium) return 'medium';
  if (score >= RISK_LEVEL_THRESHOLDS.low) return 'low';
  return 'none';
}

export function createRiskSignal(type: RiskSignal['type'], factors: RiskFactor[], detector: string): RiskSignal {
  const score = calculateRiskScore(factors);
  const level = getRiskLevelFromScore(score);
  return {
    id: generateId('risk'),
    type,
    level,
    score,
    detectedAt: getCurrentTimestamp(),
    detector,
    factors,
    acknowledged: false,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };
}

export function acknowledgeRiskSignal(signal: RiskSignal, acknowledgedBy: string): RiskSignal {
  return {
    ...signal,
    acknowledged: true,
    acknowledgedAt: getCurrentTimestamp(),
    acknowledgedBy,
    updatedAt: getCurrentTimestamp(),
  };
}

export function isCriticalRisk(signal: RiskSignal): boolean {
  return signal.level === 'critical';
}
