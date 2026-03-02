/**
 * SQLite Storage Implementation
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import type { FailureReport, FailurePattern, RiskSignal, QueryResult, FailureStats, FailureReportFilter } from '@failsafe/core';
import type { StorageInterface } from './storage';
import { generateId, getCurrentTimestamp } from './utils';

export class SqliteStorage implements StorageInterface {
  private db: Database.Database;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.ensureDirectory();
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initializeSchema();
  }

  private ensureDirectory(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private initializeSchema(): void {
    const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf-8');
    this.db.exec(schema);
  }

  async createFailure(report: FailureReport): Promise<FailureReport> {
    const stmt = this.db.prepare(`
      INSERT INTO failure_reports (
        id, type, severity, domain, title, description, context, timestamp, duration,
        error_message, error_stack, error_code, input, output, expected_output,
        source, user_id, session_id, tags, metadata, verification_status,
        version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      report.id, report.type, report.severity, report.domain, report.title, report.description,
      report.context, report.timestamp, report.duration,
      report.errorMessage, report.errorStack, report.errorCode,
      JSON.stringify(report.input), JSON.stringify(report.output), JSON.stringify(report.expectedOutput),
      report.source, report.userId, report.sessionId, JSON.stringify(report.tags), JSON.stringify(report.metadata),
      report.verificationStatus, report.version, report.createdAt, report.updatedAt
    );

    // Insert into FTS table for full-text search
    this.db.prepare(`
      INSERT INTO fts_failure_reports (id, title, description, error_message, tags)
      VALUES (?, ?, ?, ?, ?)
    `).run(report.id, report.title, report.description, report.errorMessage || '', JSON.stringify(report.tags || []));

    return report;
  }

  async getFailure(id: string): Promise<FailureReport | null> {
    const stmt = this.db.prepare('SELECT * FROM failure_reports WHERE id = ?');
    const row = stmt.get(id) as any;
    return row ? this.rowToFailureReport(row) : null;
  }

  async updateFailure(id: string, updates: Partial<FailureReport>): Promise<FailureReport> {
    const existing = await this.getFailure(id);
    if (!existing) throw new Error(`Failure report ${id} not found`);

    const updated = { ...existing, ...updates, id, createdAt: existing.createdAt, version: existing.version + 1, updatedAt: getCurrentTimestamp() };

    const stmt = this.db.prepare(`
      UPDATE failure_reports SET
        type = ?, severity = ?, domain = ?, title = ?, description = ?, context = ?,
        timestamp = ?, duration = ?, error_message = ?, error_stack = ?, error_code = ?,
        input = ?, output = ?, expected_output = ?, source = ?, user_id = ?, session_id = ?,
        tags = ?, metadata = ?, verification_status = ?, verified_by = ?, verification_notes = ?,
        resolved_at = ?, resolution_notes = ?, version = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      updated.type, updated.severity, updated.domain, updated.title, updated.description, updated.context,
      updated.timestamp, updated.duration, updated.errorMessage, updated.errorStack, updated.errorCode,
      JSON.stringify(updated.input), JSON.stringify(updated.output), JSON.stringify(updated.expectedOutput),
      updated.source, updated.userId, updated.sessionId, JSON.stringify(updated.tags),
      JSON.stringify(updated.metadata), updated.verificationStatus, updated.verifiedBy, updated.verificationNotes,
      updated.resolvedAt, updated.resolutionNotes, updated.version, updated.updatedAt, id
    );

    return updated;
  }

  async deleteFailure(id: string): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM failure_reports WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async listFailures(filter?: FailureReportFilter, limit = 50, offset = 0): Promise<QueryResult<FailureReport>> {
    let query = 'SELECT * FROM failure_reports WHERE 1=1';
    const params: any[] = [];

    if (filter?.types && filter.types.length > 0) {
      query += ` AND type IN (${filter.types.map(() => '?').join(',')})`;
      params.push(...filter.types);
    }
    if (filter?.severities && filter.severities.length > 0) {
      query += ` AND severity IN (${filter.severities.map(() => '?').join(',')})`;
      params.push(...filter.severities);
    }
    if (filter?.domains && filter.domains.length > 0) {
      query += ` AND domain IN (${filter.domains.map(() => '?').join(',')})`;
      params.push(...filter.domains);
    }
    if (filter?.verificationStatus && filter.verificationStatus.length > 0) {
      query += ` AND verification_status IN (${filter.verificationStatus.map(() => '?').join(',')})`;
      params.push(...filter.verificationStatus);
    }
    if (filter?.source) {
      query += ' AND source = ?';
      params.push(filter.source);
    }
    if (filter?.dateRange) {
      query += ' AND timestamp >= ? AND timestamp <= ?';
      params.push(filter.dateRange.start, filter.dateRange.end);
    }

    const countStmt = this.db.prepare(query.replace('SELECT *', 'SELECT COUNT(*) as count'));
    const countResult = countStmt.all(...params) as any[];
    const total = countResult[0]?.count || 0;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as any[];
    const items = rows.map(row => this.rowToFailureReport(row));

    return {
      items,
      total,
      offset,
      limit,
      hasMore: offset + items.length < total,
    };
  }

  async searchFailures(query: string, limit = 50, offset = 0): Promise<QueryResult<FailureReport>> {
    const stmt = this.db.prepare(`
      SELECT DISTINCT fr.* FROM failure_reports fr
      JOIN fts_failure_reports fts ON fr.id = fts.id
      WHERE fts MATCH ?
      ORDER BY fr.created_at DESC
      LIMIT ? OFFSET ?
    `);

    const countStmt = this.db.prepare(`
      SELECT COUNT(DISTINCT fr.id) as count FROM failure_reports fr
      JOIN fts_failure_reports fts ON fr.id = fts.id
      WHERE fts MATCH ?
    `);

    const countResult = countStmt.get(query) as any;
    const total = countResult?.count || 0;

    const rows = stmt.all(query, limit, offset) as any[];
    const items = rows.map(row => this.rowToFailureReport(row));

    return {
      items,
      total,
      offset,
      limit,
      hasMore: offset + items.length < total,
    };
  }

  async countFailures(filter?: FailureReportFilter): Promise<number> {
    const result = await this.listFailures(filter, 1, 0);
    return result.total;
  }

  async createPattern(pattern: FailurePattern): Promise<FailurePattern> {
    const stmt = this.db.prepare(`
      INSERT INTO failure_patterns (
        id, name, description, failure_types, conditions, severity,
        likelihood, impact, common_causes, prevention_strategies, detection_rules,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      pattern.id, pattern.name, pattern.description, JSON.stringify(pattern.failureTypes),
      JSON.stringify(pattern.conditions), pattern.severity, pattern.likelihood, pattern.impact,
      JSON.stringify(pattern.commonCauses), JSON.stringify(pattern.preventionStrategies),
      JSON.stringify(pattern.detectionRules), pattern.createdAt, pattern.updatedAt
    );

    return pattern;
  }

  async getPattern(id: string): Promise<FailurePattern | null> {
    const stmt = this.db.prepare('SELECT * FROM failure_patterns WHERE id = ?');
    const row = stmt.get(id) as any;
    return row ? this.rowToPattern(row) : null;
  }

  async updatePattern(id: string, updates: Partial<FailurePattern>): Promise<FailurePattern> {
    const existing = await this.getPattern(id);
    if (!existing) throw new Error(`Pattern ${id} not found`);

    const updated = { ...existing, ...updates, id, createdAt: existing.createdAt, updatedAt: getCurrentTimestamp() };

    const stmt = this.db.prepare(`
      UPDATE failure_patterns SET
        name = ?, description = ?, failure_types = ?, conditions = ?, severity = ?,
        likelihood = ?, impact = ?, common_causes = ?, prevention_strategies = ?,
        detection_rules = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      updated.name, updated.description, JSON.stringify(updated.failureTypes),
      JSON.stringify(updated.conditions), updated.severity, updated.likelihood,
      updated.impact, JSON.stringify(updated.commonCauses),
      JSON.stringify(updated.preventionStrategies), JSON.stringify(updated.detectionRules),
      updated.updatedAt, id
    );

    return updated;
  }

  async deletePattern(id: string): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM failure_patterns WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async listPatterns(limit = 50, offset = 0): Promise<QueryResult<FailurePattern>> {
    const countStmt = this.db.prepare('SELECT COUNT(*) as count FROM failure_patterns');
    const countResult = countStmt.get() as any;
    const total = countResult?.count || 0;

    const stmt = this.db.prepare('SELECT * FROM failure_patterns ORDER BY created_at DESC LIMIT ? OFFSET ?');
    const rows = stmt.all(limit, offset) as any[];
    const items = rows.map(row => this.rowToPattern(row));

    return { items, total, offset, limit, hasMore: offset + items.length < total };
  }

  async createSignal(signal: RiskSignal): Promise<RiskSignal> {
    const stmt = this.db.prepare(`
      INSERT INTO risk_signals (
        id, type, level, score, detected_at, detector, related_goals, context,
        factors, analysis, recommendations, acknowledged, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      signal.id, signal.type, signal.level, signal.score, signal.detectedAt, signal.detector,
      JSON.stringify(signal.relatedGoals), JSON.stringify(signal.context),
      JSON.stringify(signal.factors), signal.analysis, JSON.stringify(signal.recommendations),
      signal.acknowledged, signal.createdAt, signal.updatedAt
    );

    return signal;
  }

  async getSignal(id: string): Promise<RiskSignal | null> {
    const stmt = this.db.prepare('SELECT * FROM risk_signals WHERE id = ?');
    const row = stmt.get(id) as any;
    return row ? this.rowToSignal(row) : null;
  }

  async updateSignal(id: string, updates: Partial<RiskSignal>): Promise<RiskSignal> {
    const existing = await this.getSignal(id);
    if (!existing) throw new Error(`Signal ${id} not found`);

    const updated = { ...existing, ...updates, id, createdAt: existing.createdAt, updatedAt: getCurrentTimestamp() };

    const stmt = this.db.prepare(`
      UPDATE risk_signals SET
        type = ?, level = ?, score = ?, detected_at = ?, detector = ?, related_goals = ?,
        context = ?, factors = ?, analysis = ?, recommendations = ?, acknowledged = ?,
        acknowledged_at = ?, acknowledged_by = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      updated.type, updated.level, updated.score, updated.detectedAt, updated.detector,
      JSON.stringify(updated.relatedGoals), JSON.stringify(updated.context),
      JSON.stringify(updated.factors), updated.analysis, JSON.stringify(updated.recommendations),
      updated.acknowledged, updated.acknowledgedAt, updated.acknowledgedBy, updated.updatedAt, id
    );

    return updated;
  }

  async acknowledgeSignal(id: string, acknowledgedBy: string): Promise<RiskSignal> {
    return this.updateSignal(id, {
      acknowledged: true,
      acknowledgedAt: getCurrentTimestamp(),
      acknowledgedBy,
    });
  }

  async listSignals(limit = 50, offset = 0): Promise<QueryResult<RiskSignal>> {
    const countStmt = this.db.prepare('SELECT COUNT(*) as count FROM risk_signals');
    const countResult = countStmt.get() as any;
    const total = countResult?.count || 0;

    const stmt = this.db.prepare('SELECT * FROM risk_signals ORDER BY detected_at DESC LIMIT ? OFFSET ?');
    const rows = stmt.all(limit, offset) as any[];
    const items = rows.map(row => this.rowToSignal(row));

    return { items, total, offset, limit, hasMore: offset + items.length < total };
  }

  async getUnacknowledgedSignals(limit = 50): Promise<RiskSignal[]> {
    const stmt = this.db.prepare('SELECT * FROM risk_signals WHERE acknowledged = 0 ORDER BY detected_at DESC LIMIT ?');
    const rows = stmt.all(limit) as any[];
    return rows.map(row => this.rowToSignal(row));
  }

  async getStatistics(dateRange?: { start: string; end: string }): Promise<FailureStats> {
    let whereClause = '1=1';
    const params: any[] = [];

    if (dateRange) {
      whereClause = 'timestamp >= ? AND timestamp <= ?';
      params.push(dateRange.start, dateRange.end);
    }

    const totalStmt = this.db.prepare(`SELECT COUNT(*) as count FROM failure_reports WHERE ${whereClause}`);
    const total = (totalStmt.get(...params) as any)?.count || 0;

    const byTypeStmt = this.db.prepare(`SELECT type, COUNT(*) as count FROM failure_reports WHERE ${whereClause} GROUP BY type`);
    const byType = Object.fromEntries((byTypeStmt.all(...params) as any[]).map(r => [r.type, r.count]));

    const bySeverityStmt = this.db.prepare(`SELECT severity, COUNT(*) as count FROM failure_reports WHERE ${whereClause} GROUP BY severity`);
    const bySeverity = Object.fromEntries((bySeverityStmt.all(...params) as any[]).map(r => [r.severity, r.count]));

    const byDomainStmt = this.db.prepare(`SELECT domain, COUNT(*) as count FROM failure_reports WHERE ${whereClause} GROUP BY domain`);
    const byDomain = Object.fromEntries((byDomainStmt.all(...params) as any[]).map(r => [r.domain, r.count]));

    const byStatusStmt = this.db.prepare(`SELECT verification_status, COUNT(*) as count FROM failure_reports WHERE ${whereClause} GROUP BY verification_status`);
    const byStatus = Object.fromEntries((byStatusStmt.all(...params) as any[]).map(r => [r.verification_status, r.count]));

    const unverifiedStmt = this.db.prepare(`SELECT COUNT(*) as count FROM failure_reports WHERE ${whereClause} AND verification_status = 'unverified'`);
    const unverified = (unverifiedStmt.get(...params) as any)?.count || 0;

    const resolvedStmt = this.db.prepare(`SELECT COUNT(*) as count FROM failure_reports WHERE ${whereClause} AND verification_status = 'resolved'`);
    const resolved = (resolvedStmt.get(...params) as any)?.count || 0;

    return {
      totalReports: total,
      byType,
      bySeverity,
      byDomain,
      byStatus,
      averageSeverityScore: 0,
      topFailureTypes: Object.entries(byType).map(([type, count]) => ({ type: type as any, count: count as number })).sort((a, b) => b.count - a.count).slice(0, 5),
      topDomains: Object.entries(byDomain).map(([domain, count]) => ({ domain: domain as any, count: count as number })).sort((a, b) => b.count - a.count).slice(0, 5),
      unverifiedCount: unverified,
      resolvedCount: resolved,
      resolutionRate: total > 0 ? resolved / total : 0,
    };
  }

  async getStatisticsByModel(model: string): Promise<Record<string, number>> {
    const stmt = this.db.prepare(`
      SELECT severity, COUNT(*) as count FROM failure_reports
      WHERE id IN (SELECT failure_report_id FROM model_info WHERE name = ?)
      GROUP BY severity
    `);
    const rows = stmt.all(model) as any[];
    return Object.fromEntries(rows.map(r => [r.severity, r.count]));
  }

  async getStatisticsByDomain(domain: string): Promise<Record<string, number>> {
    const stmt = this.db.prepare(`
      SELECT severity, COUNT(*) as count FROM failure_reports
      WHERE domain = ?
      GROUP BY severity
    `);
    const rows = stmt.all(domain) as any[];
    return Object.fromEntries(rows.map(r => [r.severity, r.count]));
  }

  async getFailureTimeline(failureId: string): Promise<Array<any>> {
    const stmt = this.db.prepare('SELECT * FROM failure_timeline WHERE failure_report_id = ? ORDER BY timestamp ASC');
    return stmt.all(failureId) as any[];
  }

  async recordTimelineEvent(failureId: string, event: string, actor?: string, notes?: string): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO failure_timeline (id, failure_report_id, event, actor, notes, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(generateId('timeline'), failureId, event, actor, notes, getCurrentTimestamp());
  }

  async isHealthy(): Promise<boolean> {
    try {
      this.db.prepare('SELECT 1').get();
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    this.db.close();
  }

  private rowToFailureReport(row: any): FailureReport {
    return {
      id: row.id,
      type: row.type,
      severity: row.severity,
      domain: row.domain,
      title: row.title,
      description: row.description,
      context: row.context,
      timestamp: row.timestamp,
      duration: row.duration,
      errorMessage: row.error_message,
      errorStack: row.error_stack,
      errorCode: row.error_code,
      input: row.input ? JSON.parse(row.input) : undefined,
      output: row.output ? JSON.parse(row.output) : undefined,
      expectedOutput: row.expected_output ? JSON.parse(row.expected_output) : undefined,
      source: row.source,
      userId: row.user_id,
      sessionId: row.session_id,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      verificationStatus: row.verification_status,
      verifiedBy: row.verified_by,
      verificationNotes: row.verification_notes,
      resolvedAt: row.resolved_at,
      resolutionNotes: row.resolution_notes,
      recommendations: row.recommendations ? JSON.parse(row.recommendations) : undefined,
      version: row.version,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private rowToPattern(row: any): FailurePattern {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      failureTypes: JSON.parse(row.failure_types),
      conditions: JSON.parse(row.conditions),
      severity: row.severity,
      likelihood: row.likelihood,
      impact: row.impact,
      commonCauses: row.common_causes ? JSON.parse(row.common_causes) : undefined,
      preventionStrategies: row.prevention_strategies ? JSON.parse(row.prevention_strategies) : undefined,
      detectionRules: row.detection_rules ? JSON.parse(row.detection_rules) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private rowToSignal(row: any): RiskSignal {
    return {
      id: row.id,
      type: row.type,
      level: row.level,
      score: row.score,
      detectedAt: row.detected_at,
      detector: row.detector,
      relatedGoals: row.related_goals ? JSON.parse(row.related_goals) : undefined,
      context: row.context ? JSON.parse(row.context) : undefined,
      factors: row.factors ? JSON.parse(row.factors) : [],
      analysis: row.analysis,
      recommendations: row.recommendations ? JSON.parse(row.recommendations) : undefined,
      acknowledged: Boolean(row.acknowledged),
      acknowledgedAt: row.acknowledged_at,
      acknowledgedBy: row.acknowledged_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
