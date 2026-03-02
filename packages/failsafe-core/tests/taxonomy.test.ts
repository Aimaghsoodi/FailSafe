import { describe, it, expect } from 'vitest';
import { SEVERITY_WEIGHTS, getSeverityWeight, getFailureCategory, getDefaultSeverityForType } from '../src/taxonomy';

describe('Taxonomy', () => {
  it('should have severity weights', () => {
    expect(SEVERITY_WEIGHTS.critical).toBe(100);
    expect(SEVERITY_WEIGHTS.high).toBe(75);
    expect(SEVERITY_WEIGHTS.medium).toBe(50);
    expect(SEVERITY_WEIGHTS.low).toBe(25);
    expect(SEVERITY_WEIGHTS.info).toBe(0);
  });

  it('should get severity weight', () => {
    expect(getSeverityWeight('critical')).toBe(100);
    expect(getSeverityWeight('low')).toBe(25);
  });

  it('should get failure category', () => {
    expect(getFailureCategory('model.inference_error')).toBe('model');
    expect(getFailureCategory('security.prompt_injection')).toBe('security');
  });

  it('should get default severity for type', () => {
    expect(getDefaultSeverityForType('security.prompt_injection')).toBe('high');
    expect(getDefaultSeverityForType('execution.timeout')).toBe('high');
    expect(getDefaultSeverityForType('model.hallucination')).toBe('medium');
  });
});
