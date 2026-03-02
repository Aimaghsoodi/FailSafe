import type { FailureReport } from './types';

export function serializeFailureReport(report: FailureReport): string {
  return JSON.stringify(report, null, 2);
}

export function deserializeFailureReport(json: string): FailureReport {
  return JSON.parse(json) as FailureReport;
}

export function toJSONLD(report: FailureReport): any {
  return {
    '@context': 'https://failsafe.dev/schema',
    '@type': 'FailureReport',
    '@id': `urn:failsafe:report:${report.id}`,
    ...report,
  };
}

export function exportAsJSONL(reports: FailureReport[]): string {
  return reports.map((r) => JSON.stringify(r)).join('\n');
}

export function importFromJSONL(jsonl: string): FailureReport[] {
  return jsonl
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as FailureReport);
}

export function exportAsCSV(reports: FailureReport[]): string {
  const headers = ['id', 'type', 'severity', 'domain', 'title', 'timestamp', 'verificationStatus'];
  const rows = reports.map((r) => [
    r.id,
    r.type,
    r.severity,
    r.domain,
    r.title,
    r.timestamp,
    r.verificationStatus,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}
