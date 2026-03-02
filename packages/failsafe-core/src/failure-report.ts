import type { FailureReport } from './types';
import { generateId, getCurrentTimestamp } from './utils';

export class FailureReportBuilder {
  private report: Partial<FailureReport>;

  constructor(
    id: string,
    type: FailureReport['type'],
    severity: FailureReport['severity'],
    domain: FailureReport['domain'],
    title: string,
    description: string
  ) {
    this.report = {
      id,
      type,
      severity,
      domain,
      title,
      description,
      timestamp: getCurrentTimestamp(),
      verificationStatus: 'unverified',
      version: 1,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
  }

  static create(
    type: FailureReport['type'],
    severity: FailureReport['severity'],
    domain: FailureReport['domain'],
    title: string,
    description: string
  ): FailureReportBuilder {
    return new FailureReportBuilder(generateId('report'), type, severity, domain, title, description);
  }

  withError(message: string, stack?: string, code?: string): this {
    this.report.errorMessage = message;
    this.report.errorStack = stack;
    this.report.errorCode = code;
    return this;
  }

  build(): FailureReport {
    return this.report as FailureReport;
  }
}

export function createFailureReport(
  type: FailureReport['type'],
  severity: FailureReport['severity'],
  domain: FailureReport['domain'],
  title: string,
  description: string
): FailureReport {
  return FailureReportBuilder.create(type, severity, domain, title, description).build();
}

export function updateFailureReport(
  report: FailureReport,
  updates: Partial<FailureReport>
): FailureReport {
  return {
    ...report,
    ...updates,
    id: report.id,
    createdAt: report.createdAt,
    version: report.version + 1,
    updatedAt: getCurrentTimestamp(),
  };
}

export function verifyFailureReport(report: FailureReport, verifiedBy: string, notes?: string): FailureReport {
  return updateFailureReport(report, {
    verificationStatus: 'verified',
    verifiedBy,
    verificationNotes: notes,
  });
}

export function resolveFailureReport(report: FailureReport, notes?: string): FailureReport {
  return updateFailureReport(report, {
    verificationStatus: 'resolved',
    resolvedAt: getCurrentTimestamp(),
    resolutionNotes: notes,
  });
}

export function isCritical(report: FailureReport): boolean {
  return report.severity === 'critical';
}
