import type {
  FailureReport,
  FailurePattern,
  RiskSignal,
  FailureStats,
} from '@failsafe/core';
import type {
  CheckRiskInput,
  ReportFailureInput,
  SearchFailuresInput,
  GetPatternsInput,
  GetStatsInput,
  ToolResult,
} from './tools';

export class FailSafeStorage {
  private reports: Map<string, FailureReport> = new Map();
  private patterns: Map<string, FailurePattern> = new Map();
  private signals: Map<string, RiskSignal> = new Map();

  addReport(report: FailureReport): FailureReport {
    this.reports.set(report.id, report);
    return report;
  }

  getReport(id: string): FailureReport | undefined {
    return this.reports.get(id);
  }

  getAllReports(): FailureReport[] {
    return Array.from(this.reports.values());
  }

  addPattern(pattern: FailurePattern): FailurePattern {
    this.patterns.set(pattern.id, pattern);
    return pattern;
  }

  getPatterns(): FailurePattern[] {
    return Array.from(this.patterns.values());
  }

  addSignal(signal: RiskSignal): RiskSignal {
    this.signals.set(signal.id, signal);
    return signal;
  }

  getStats(): FailureStats {
    const reports = this.getAllReports();
    const bySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    const byDomain: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {
      unverified: 0,
      verified: 0,
      disputed: 0,
      resolved: 0,
    };

    reports.forEach((report) => {
      bySeverity[report.severity]++;
      byDomain[report.domain] = (byDomain[report.domain] || 0) + 1;
      byType[report.type] = (byType[report.type] || 0) + 1;
      byStatus[report.verificationStatus]++;
    });

    const topFailureTypes = Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type: type as any, count }));

    const topDomains = Object.entries(byDomain)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain: domain as any, count }));

    return {
      totalReports: reports.length,
      byType,
      bySeverity,
      byDomain,
      byStatus,
      averageSeverityScore: 0,
      topFailureTypes,
      topDomains,
      unverifiedCount: byStatus.unverified,
      resolvedCount: byStatus.resolved,
      resolutionRate: reports.length > 0 ? byStatus.resolved / reports.length : 0,
    };
  }

  searchReports(filters: {
    severities?: string[];
    domains?: string[];
    types?: string[];
    search?: string;
  }): FailureReport[] {
    let results = this.getAllReports();

    if (filters.severities && filters.severities.length > 0) {
      results = results.filter((r) => filters.severities!.includes(r.severity));
    }

    if (filters.domains && filters.domains.length > 0) {
      results = results.filter((r) => filters.domains!.includes(r.domain));
    }

    if (filters.types && filters.types.length > 0) {
      results = results.filter((r) => filters.types!.includes(r.type));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }
}

export class ToolHandlers {
  constructor(private storage: FailSafeStorage) {}

  async handleCheckRisk(input: CheckRiskInput): Promise<ToolResult> {
    try {
      const score = Math.random() * 100;
      const level = score > 75 ? 'critical' : score > 50 ? 'high' : score > 25 ? 'medium' : 'low';

      const signal: RiskSignal = {
        id: `risk_${Date.now()}`,
        type: 'anomaly.output_distribution',
        level: level as any,
        score,
        detectedAt: new Date().toISOString(),
        detector: 'mcp-handler',
        factors: [],
        acknowledged: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.storage.addSignal(signal);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(signal, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error checking risk: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleReportFailure(input: ReportFailureInput): Promise<ToolResult> {
    try {
      const report: FailureReport = {
        id: `report_${Date.now()}`,
        type: input.type as any,
        severity: input.severity as any,
        domain: input.domain as any,
        title: input.title,
        description: input.description,
        errorMessage: input.errorMessage,
        tags: input.tags,
        verificationStatus: 'unverified',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };

      this.storage.addReport(report);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(report, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error reporting failure: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleSearchFailures(input: SearchFailuresInput): Promise<ToolResult> {
    try {
      const results = this.storage.searchReports({
        severities: input.severities,
        domains: input.domains,
        types: input.types,
        search: input.search,
      });

      const limited = results.slice(0, input.limit || 10);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                count: limited.length,
                total: results.length,
                results: limited,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching failures: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleGetPatterns(input: GetPatternsInput): Promise<ToolResult> {
    try {
      const patterns = this.storage.getPatterns().slice(0, input.limit || 10);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ count: patterns.length, patterns }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting patterns: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleGetStats(input: GetStatsInput): Promise<ToolResult> {
    try {
      const stats = this.storage.getStats();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting stats: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}
