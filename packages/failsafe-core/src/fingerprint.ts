import type { FailureReport, FailureFingerprint } from './types';
import { hashString, generateId } from './utils';

export function extractFingerprintComponents(report: FailureReport): {
  type: string;
  message: string;
  stack: string;
} {
  return {
    type: report.type,
    message: report.errorMessage || report.title,
    stack: report.errorStack || '',
  };
}

export function generateFingerprintHash(components: {
  type: string;
  message: string;
  stack: string;
}): string {
  const combined = `${components.type}|${components.message}|${components.stack}`;
  return hashString(combined);
}

export function createFingerprint(report: FailureReport): FailureFingerprint {
  const components = extractFingerprintComponents(report);
  const hash = generateFingerprintHash(components);

  return {
    id: generateId('fp'),
    failureReportId: report.id,
    hash,
    components,
    createdAt: report.createdAt,
  };
}

export function findDuplicates(reports: FailureReport[]): FailureReport[][] {
  const fingerprints = new Map<string, FailureReport[]>();

  for (const report of reports) {
    const fp = createFingerprint(report);
    const group = fingerprints.get(fp.hash) || [];
    group.push(report);
    fingerprints.set(fp.hash, group);
  }

  return Array.from(fingerprints.values()).filter((group) => group.length > 1);
}

export function deduplicateReports(reports: FailureReport[]): FailureReport[] {
  const duplicates = findDuplicates(reports);
  const idsToRemove = new Set<string>();

  for (const group of duplicates) {
    const sorted = [...group].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    for (let i = 1; i < sorted.length; i++) {
      idsToRemove.add(sorted[i].id);
    }
  }

  return reports.filter((r) => !idsToRemove.has(r.id));
}
