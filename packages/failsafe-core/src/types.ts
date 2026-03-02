/**
 * Failsafe Core Types
 */

export type FailureType =
  | 'execution.timeout' | 'execution.out_of_memory' | 'execution.crash' | 'execution.hang'
  | 'execution.invalid_state' | 'execution.resource_exhaustion'
  | 'io.invalid_input' | 'io.malformed_data' | 'io.encoding_error' | 'io.serialization_error'
  | 'io.file_not_found' | 'io.permission_denied' | 'io.network_error' | 'io.timeout'
  | 'model.inference_error' | 'model.token_limit_exceeded' | 'model.context_window_exceeded'
  | 'model.temperature_invalid' | 'model.invalid_parameters' | 'model.unsupported_operation'
  | 'model.hallucination' | 'model.bias_detected'
  | 'logic.invalid_reasoning' | 'logic.circular_dependency' | 'logic.constraint_violation'
  | 'logic.incomplete_reasoning' | 'logic.incorrect_output' | 'logic.off_topic'
  | 'security.prompt_injection' | 'security.unauthorized_access' | 'security.authentication_failed'
  | 'security.data_leak' | 'security.validation_bypass' | 'security.rate_limit_exceeded'
  | 'integration.api_error' | 'integration.dependency_missing' | 'integration.version_mismatch'
  | 'integration.incompatible_format' | 'integration.connection_refused';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type Domain = 'reasoning' | 'code-generation' | 'content-creation' | 'data-processing'
  | 'planning' | 'retrieval' | 'agent-orchestration' | 'security' | 'performance' | 'general';
export type VerificationStatus = 'unverified' | 'verified' | 'disputed' | 'resolved';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

export interface ModelInfo {
  name: string; version: string; provider?: string; temperature?: number;
  maxTokens?: number; topP?: number; topK?: number; parameters?: Record<string, unknown>;
}

export interface SystemInfo {
  os?: string; nodeVersion?: string; memoryUsed?: number; memoryAvailable?: number;
  cpuUsage?: number; uptime?: number;
}

export interface Recommendation {
  id: string; title: string; description: string; priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'immediate_action' | 'investigation' | 'monitoring' | 'documentation' | 'prevention';
  estimatedEffort?: string; relatedFailures?: string[]; implementationGuide?: string;
  successCriteria?: string[]; createdAt: string;
}

export interface FailureReport {
  id: string; type: FailureType; severity: Severity; domain: Domain;
  title: string; description: string; context?: string; timestamp: string; duration?: number;
  modelInfo?: ModelInfo; systemInfo?: SystemInfo; errorMessage?: string; errorStack?: string;
  errorCode?: string; input?: unknown; output?: unknown; expectedOutput?: unknown;
  source?: string; userId?: string; sessionId?: string; tags?: string[];
  metadata?: Record<string, unknown>; verificationStatus: VerificationStatus;
  verifiedBy?: string; verificationNotes?: string; resolvedAt?: string;
  resolutionNotes?: string; recommendations?: Recommendation[];
  version: number; createdAt: string; updatedAt: string;
}

export interface PatternCondition {
  field: string;
  operator: 'equals' | 'contains' | 'matches' | 'greater_than' | 'less_than';
  value: unknown;
}

export interface FailurePattern {
  id: string; name: string; description: string; failureTypes: FailureType[];
  conditions: PatternCondition[]; severity: Severity; likelihood?: number; impact?: string;
  commonCauses?: string[]; preventionStrategies?: string[]; detectionRules?: string[];
  createdAt: string; updatedAt: string;
}

export interface RiskFactor {
  name: string; weight: number; value: number; description?: string;
  trend?: 'increasing' | 'decreasing' | 'stable';
}

export type RiskSignalType =
  | 'anomaly.output_distribution' | 'anomaly.latency_spike' | 'anomaly.error_rate_increase'
  | 'anomaly.token_usage_spike' | 'pattern.detected' | 'degradation.performance'
  | 'degradation.quality' | 'drift.model_behavior' | 'drift.input_distribution'
  | 'safety.prompt_injection_attempt' | 'safety.unauthorized_access_attempt'
  | 'reliability.repeated_failures';

export interface RiskSignal {
  id: string; type: RiskSignalType; level: RiskLevel; score: number;
  detectedAt: string; detector: string; relatedGoals?: string[];
  context?: Record<string, unknown>; factors: RiskFactor[]; analysis?: string;
  recommendations?: string[]; acknowledged: boolean; acknowledgedAt?: string;
  acknowledgedBy?: string; createdAt: string; updatedAt: string;
}

export interface Contributor {
  id: string; role: 'reporter' | 'verifier' | 'resolver' | 'maintainer';
  contributedAt: string; contribution: string;
}

export interface Badge {
  id: string; name: string; description: string; icon?: string;
  earnedAt: string; earnedBy: string; criteria: string;
}

export interface FailureReportFilter {
  types?: FailureType[]; severities?: Severity[]; domains?: Domain[];
  verificationStatus?: VerificationStatus[]; tags?: string[];
  dateRange?: { start: string; end: string }; source?: string; search?: string;
}

export interface QueryResult<T> {
  items: T[]; total: number; offset: number; limit: number; hasMore: boolean;
}

export interface FailureStats {
  totalReports: number; byType: Record<string, number>; bySeverity: Record<Severity, number>;
  byDomain: Record<Domain, number>; byStatus: Record<VerificationStatus, number>;
  averageSeverityScore: number; topFailureTypes: Array<{ type: FailureType; count: number }>;
  topDomains: Array<{ domain: Domain; count: number }>;
  unverifiedCount: number; resolvedCount: number; resolutionRate: number;
}

export interface FailureTimelineEntry {
  timestamp: string; event: 'created' | 'verified' | 'disputed' | 'resolved' | 'updated';
  actor?: string; notes?: string; previousState?: Partial<FailureReport>;
  newState?: Partial<FailureReport>;
}

export interface FailureFingerprint {
  id: string; failureReportId: string; hash: string;
  components: { type: string; message: string; stack: string }; createdAt: string;
}
