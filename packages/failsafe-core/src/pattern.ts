import type { FailurePattern, FailureReport, PatternCondition } from './types';
import { generateId, getCurrentTimestamp, getNestedValue } from './utils';

export function matchesCondition(report: FailureReport, condition: PatternCondition): boolean {
  const reportValue = getNestedValue(report, condition.field);

  switch (condition.operator) {
    case 'equals':
      return reportValue === condition.value;
    case 'contains':
      return String(reportValue).includes(String(condition.value));
    case 'matches':
      try {
        return new RegExp(condition.value as any).test(String(reportValue));
      } catch {
        return false;
      }
    case 'greater_than':
      return Number(reportValue) > Number(condition.value);
    case 'less_than':
      return Number(reportValue) < Number(condition.value);
    default:
      return false;
  }
}

export function matchesPattern(report: FailureReport, pattern: FailurePattern): boolean {
  if (!pattern.failureTypes.includes(report.type)) {
    return false;
  }
  return pattern.conditions.every((condition) => matchesCondition(report, condition));
}

export function createFailurePattern(
  name: string,
  description: string,
  failureTypes: FailureReport['type'][],
  conditions: PatternCondition[],
  severity: FailureReport['severity']
): FailurePattern {
  return {
    id: generateId('pattern'),
    name,
    description,
    failureTypes,
    conditions,
    severity,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };
}

export function findMatchingPatterns(report: FailureReport, patterns: FailurePattern[]): FailurePattern[] {
  return patterns.filter((pattern) => matchesPattern(report, pattern));
}
