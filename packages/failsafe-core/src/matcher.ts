import type { FailureReport, FailureReportFilter, QueryResult, FailureStats } from './types';
import { isTimestampInRange } from './utils';
import { SEVERITY_WEIGHTS } from './taxonomy';

export function filterFailureReports(
  reports: FailureReport[],
  filter: FailureReportFilter
): FailureReport[] {
  return reports.filter((report) => {
    if (filter.types && !filter.types.includes(report.type)) {
      return false;
    }

    if (filter.severities && !filter.severities.includes(report.severity)) {
      return false;
    }

    if (filter.domains && !filter.domains.includes(report.domain)) {
      return false;
    }

    if (filter.verificationStatus && !filter.verificationStatus.includes(report.verificationStatus)) {
      return false;
    }

    if (filter.dateRange) {
      if (!isTimestampInRange(report.timestamp, filter.dateRange.start, filter.dateRange.end)) {
        return false;
      }
    }

    if (filter.source && report.source !== filter.source) {
      return false;
    }

    return true;
  });
}

export function queryFailureReports(
  reports: FailureReport[],
  filter: FailureReportFilter,
  offset: number = 0,
  limit: number = 50
): QueryResult<FailureReport> {
  const filtered = filterFailureReports(reports, filter);
  const items = filtered.slice(offset, offset + limit);

  return {
    items,
    total: filtered.length,
    offset,
    limit,
    hasMore: offset + limit < filtered.length,
  };
}

export function calculateFailureStats(reports: FailureReport[]): FailureStats {
  const byType: Record<string, number> = {};
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  const byDomain: Record<string, number> = {};
  const byStatus = { unverified: 0, verified: 0, disputed: 0, resolved: 0 };
  let totalWeight = 0;

  for (const r of reports) {
    byType[r.type] = (byType[r.type] || 0) + 1;
    bySeverity[r.severity]++;
    byDomain[r.domain] = (byDomain[r.domain] || 0) + 1;
    byStatus[r.verificationStatus]++;
    totalWeight += SEVERITY_WEIGHTS[r.severity];
  }

  const topFailureTypes = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type: type as any, count }));

  return {
    totalReports: reports.length,
    byType,
    bySeverity: bySeverity as any,
    byDomain,
    byStatus: byStatus as any,
    averageSeverityScore: reports.length > 0 ? totalWeight / reports.length : 0,
    topFailureTypes,
    topDomains: [],
    unverifiedCount: byStatus.unverified,
    resolvedCount: byStatus.resolved,
    resolutionRate: reports.length > 0 ? byStatus.resolved / reports.length : 0,
  };
}

export function groupBy<K extends keyof FailureReport>(
  reports: FailureReport[],
  key: K
): Record<string, FailureReport[]> {
  const grouped: Record<string, FailureReport[]> = {};

  for (const report of reports) {
    const value = String(report[key]);
    if (!grouped[value]) {
      grouped[value] = [];
    }
    grouped[value].push(report);
  }

  return grouped;
}
