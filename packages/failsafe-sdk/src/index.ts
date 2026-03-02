export { FailSafeClient, type ClientConfig } from './client';
export { FailSafeMiddleware, type MiddlewareOptions } from './middleware';
export { FailSafeInterceptor, type InterceptorConfig } from './interceptor';
export { FailureReporter } from './reporter';

export type {
  FailureReport,
  FailureType,
  Severity,
  Domain,
  VerificationStatus,
  RiskLevel,
  ModelInfo,
  SystemInfo,
  Recommendation,
  PatternCondition,
  FailurePattern,
  RiskFactor,
  RiskSignalType,
  RiskSignal,
  FailureReportFilter,
  QueryResult,
  FailureStats,
} from '@failsafe/core';
