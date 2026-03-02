import type { FailureReport } from './types';

export function validateFailureReport(report: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (!report.id || typeof report.id !== 'string') {
    errors.push('id: must be a non-empty string');
  }
  if (!report.type || typeof report.type !== 'string') {
    errors.push('type: must be a non-empty string');
  }
  if (!['critical', 'high', 'medium', 'low', 'info'].includes(report.severity)) {
    errors.push('severity: must be one of critical, high, medium, low, info');
  }
  if (!report.title || typeof report.title !== 'string') {
    errors.push('title: must be a non-empty string');
  }
  if (!isValidISODate(report.timestamp)) {
    errors.push('timestamp: must be a valid ISO 8601 date');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function checkIntegrity(reports: FailureReport[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const report of reports) {
    if (ids.has(report.id)) {
      errors.push(`Duplicate report ID: ${report.id}`);
    }
    ids.add(report.id);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
