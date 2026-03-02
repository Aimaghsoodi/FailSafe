import crypto from 'crypto';
import type { FailureReport } from './types';

export function hashValue(value: string, salt: string = 'failsafe'): string {
  return crypto.createHash('sha256').update(`${salt}:${value}`).digest('hex');
}

export function anonymizeUserId(userId: string): string {
  return hashValue(userId).substring(0, 16);
}

export function anonymizeSessionId(sessionId: string): string {
  return hashValue(sessionId).substring(0, 12);
}

export function removesSensitiveData(report: FailureReport): FailureReport {
  const sanitized = { ...report };

  if (sanitized.input !== undefined) {
    sanitized.input = '[REDACTED]';
  }
  if (sanitized.output !== undefined) {
    sanitized.output = '[REDACTED]';
  }
  if (sanitized.userId) {
    sanitized.userId = anonymizeUserId(sanitized.userId);
  }
  if (sanitized.sessionId) {
    sanitized.sessionId = anonymizeSessionId(sanitized.sessionId);
  }

  return sanitized;
}

export function createAnonymizedReport(report: FailureReport): FailureReport {
  return removesSensitiveData(report);
}

export function hasSensitiveData(report: FailureReport): boolean {
  const text = JSON.stringify(report);

  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) return true;
  if (/(password|token|secret|key|credential)/i.test(text)) return true;

  return false;
}
