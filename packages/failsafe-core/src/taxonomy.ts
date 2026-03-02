import type { FailureType, Severity } from './types';

export const FAILURE_TYPE_CATEGORIES = {
  execution: ['execution.timeout', 'execution.out_of_memory', 'execution.crash'] as const,
  io: ['io.invalid_input', 'io.malformed_data', 'io.timeout'] as const,
  model: ['model.inference_error', 'model.hallucination', 'model.bias_detected'] as const,
  logic: ['logic.invalid_reasoning', 'logic.circular_dependency'] as const,
  security: ['security.prompt_injection', 'security.unauthorized_access'] as const,
  integration: ['integration.api_error', 'integration.dependency_missing'] as const,
} as const;

export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  critical: 100, high: 75, medium: 50, low: 25, info: 0,
};

export function getFailureCategory(type: FailureType): string {
  const [category] = type.split('.');
  return category;
}

export function getSeverityWeight(severity: Severity): number {
  return SEVERITY_WEIGHTS[severity];
}