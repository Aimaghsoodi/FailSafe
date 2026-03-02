import { describe, it, expect } from 'vitest';
import { createFailureReport, FailureReportBuilder, verifyFailureReport, resolveFailureReport, isCritical } from '../src/failure-report';

describe('FailureReport', () => {
  it('should create a failure report using builder', () => {
    const report = FailureReportBuilder.create('model.inference_error', 'high', 'reasoning', 'Test error', 'Description')
      .withError('Error message', 'Stack trace')
      .build();

    expect(report.id).toBeDefined();
    expect(report.type).toBe('model.inference_error');
    expect(report.severity).toBe('high');
    expect(report.errorMessage).toBe('Error message');
    expect(report.verificationStatus).toBe('unverified');
  });

  it('should create a simple failure report', () => {
    const report = createFailureReport('io.timeout', 'medium', 'data-processing', 'IO timeout', 'Network request timed out');
    expect(report.title).toBe('IO timeout');
    expect(report.severity).toBe('medium');
  });

  it('should verify a failure report', () => {
    const report = createFailureReport('execution.crash', 'critical', 'agent-orchestration', 'Agent crashed', 'Agent process exited');
    const verified = verifyFailureReport(report, 'reviewer_1', 'Confirmed issue');
    
    expect(verified.verificationStatus).toBe('verified');
    expect(verified.verifiedBy).toBe('reviewer_1');
    expect(verified.version).toBe(2);
  });

  it('should resolve a failure report', () => {
    const report = createFailureReport('security.prompt_injection', 'critical', 'security', 'Injection detected', 'Prompt injection attempt');
    const resolved = resolveFailureReport(report, 'Fixed in v1.1.0');
    
    expect(resolved.verificationStatus).toBe('resolved');
    expect(resolved.resolutionNotes).toBe('Fixed in v1.1.0');
    expect(resolved.resolvedAt).toBeDefined();
  });

  it('should check if report is critical', () => {
    const critical = createFailureReport('execution.crash', 'critical', 'agent-orchestration', 'Crash', 'Crashed');
    const noncritical = createFailureReport('io.timeout', 'low', 'data-processing', 'Timeout', 'Timeout');

    expect(isCritical(critical)).toBe(true);
    expect(isCritical(noncritical)).toBe(false);
  });
});
