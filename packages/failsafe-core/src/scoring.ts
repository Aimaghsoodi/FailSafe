import type { FailureReport, RiskFactor } from './types';
import { SEVERITY_WEIGHTS } from './taxonomy';
import { normalizeScore } from './utils';

export function calculateImpactScore(report: FailureReport): number {
  // Scale severity to leave room for domain/status bonuses
  let score = SEVERITY_WEIGHTS[report.severity] * 0.7;

  if (report.domain === 'security') {
    score += 20;
  }
  if (report.domain === 'agent-orchestration') {
    score += 12;
  }

  if (report.verificationStatus !== 'resolved') {
    score += 8;
  }

  if (report.recommendations && report.recommendations.length > 2) {
    score += 5;
  }

  return normalizeScore(Math.round(score));
}

export function calculateUrgencyScore(report: FailureReport): number {
  const severityScore = SEVERITY_WEIGHTS[report.severity];
  const isUnverified = report.verificationStatus === 'unverified' ? 20 : 0;
  const isCritical = report.severity === 'critical' ? 30 : 0;

  return normalizeScore(severityScore + isUnverified + isCritical);
}

export function createRiskFactorsFromReport(report: FailureReport): RiskFactor[] {
  const factors: RiskFactor[] = [];

  factors.push({
    name: 'severity',
    weight: 0.3,
    value: SEVERITY_WEIGHTS[report.severity],
  });

  const verificationScore = report.verificationStatus === 'unverified' ? 80 : report.verificationStatus === 'verified' ? 40 : 20;
  factors.push({
    name: 'verification_status',
    weight: 0.2,
    value: verificationScore,
  });

  const domainScore = report.domain === 'security' ? 90 : report.domain === 'agent-orchestration' ? 75 : 60;
  factors.push({
    name: 'domain_criticality',
    weight: 0.25,
    value: domainScore,
  });

  const resolutionScore = report.verificationStatus === 'resolved' ? 10 : 70;
  factors.push({
    name: 'resolution_status',
    weight: 0.25,
    value: resolutionScore,
  });

  return factors;
}

export function calculateCompositeScore(report: FailureReport): number {
  const impact = calculateImpactScore(report) * 0.4;
  const urgency = calculateUrgencyScore(report) * 0.35;
  const baseline = 25;

  return normalizeScore(impact + urgency + baseline);
}

export function rankReportsByScore(reports: FailureReport[]): Array<{ report: FailureReport; score: number }> {
  return reports
    .map((report) => ({
      report,
      score: calculateCompositeScore(report),
    }))
    .sort((a, b) => b.score - a.score);
}
