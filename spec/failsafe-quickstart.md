# FailSafe Quickstart

Structured failure detection and reporting for AI systems.

## Installation

```bash
npm install @failsafe/core @failsafe/sdk
# or Python
pip install failsafe-sdk
```

## Your First Failure Report

```typescript
import { FailureReport, FailureTaxonomy, Severity } from '@failsafe/core';

// Create a failure report
const report = new FailureReport({
  system: 'ai-assistant',
  category: 'reasoning',
  severity: Severity.HIGH,
  timestamp: new Date(),
  
  input: {
    prompt: 'Explain quantum computing',
    context: { model: 'claude-3' }
  },
  
  output: {
    response: 'Quantum computers use invisible marbles...',
    confidence: 0.95
  },
  
  failure: {
    type: 'factual_error',
    description: 'Provided scientifically inaccurate explanation',
    impact: 'User received incorrect information',
    userAffected: true
  },
  
  analysis: {
    rootCause: 'Model hallucination on niche topic',
    pattern: 'Common for quantum/physics topics',
    reproducibility: 0.3
  },
  
  mitigation: {
    immediate: 'Flag as uncertain',
    shortTerm: 'Add fact-checking step',
    longTerm: 'Fine-tune on domain knowledge'
  },
  
  preventionSignals: [
    { signal: 'confidence > 0.9', importance: 'medium' },
    { signal: 'physics_domain', importance: 'high' },
    { signal: 'explanation_length > 500', importance: 'low' }
  ]
});

// Validate against schema
const validation = report.validate();
if (validation.valid) {
  console.log('Report is valid');
}

// Send for analysis
await report.save('~/.failsafe/reports/');

// Get pattern matching
const patterns = await report.getPatterns();
console.log('Related patterns:', patterns);
```

## Using the SDK

```typescript
import { FailSafeSDK, Severity } from '@failsafe/sdk';

const failsafe = new FailSafeSDK({
  storage: 'file',
  path: '~/.failsafe/failures.db'
});

// Report a failure
await failsafe.reportFailure({
  system: 'assistant',
  category: 'hallucination',
  severity: Severity.HIGH,
  input: { prompt: '...' },
  output: { response: '...' },
  failure: {
    type: 'factual_error',
    description: 'AI made up false information',
    userAffected: true
  }
});

// Query failures
const recent = await failsafe.getFailures({
  system: 'assistant',
  timeRange: { days: 7 },
  severity: [Severity.HIGH, Severity.CRITICAL]
});

// Get statistics
const stats = await failsafe.getStats();
console.log(`Total failures: ${stats.total}`);
console.log(`By severity:`, stats.bySeverity);
console.log(`By category:`, stats.byCategory);

// Export for analysis
await failsafe.export('analysis.json');
```

## Python

```python
from failsafe import FailureReport, Severity

report = FailureReport(
    system='assistant',
    category='reasoning',
    severity=Severity.HIGH,
    input={'prompt': 'Explain X'},
    output={'response': '...'},
    failure={
        'type': 'factual_error',
        'description': 'Incorrect information',
        'user_affected': True
    }
)

report.save('~/.failsafe/reports/')

# Get patterns
patterns = report.get_patterns()
```

## Taxonomy

FailSafe includes a comprehensive failure taxonomy:

- **Factual Errors** - Wrong information, hallucinations
- **Reasoning Errors** - Logical flaws, false premises
- **Temporal Errors** - Deadline misses, timing issues
- **Domain Errors** - Medical, legal, financial mistakes
- **Safety Errors** - Code injection, security issues
- **Interaction Errors** - Misunderstanding user intent

See [Failure Taxonomy](../taxonomy/failure-taxonomy-v0.1.md) for details.

## API Integration

```bash
# Start the API server
failsafe-api serve

# Log a failure (curl)
curl -X POST http://localhost:3000/failures \
  -H "Content-Type: application/json" \
  -d '{
    "system": "assistant",
    "category": "hallucination",
    "severity": "high",
    "input": {"prompt": "..."}, 
    "output": {"response": "..."},
    "failure": {"type": "factual_error"}
  }'

# Get statistics
curl http://localhost:3000/stats

# Export
curl http://localhost:3000/export > failures.json
```

## Best Practices

1. **Report immediately** after detecting failure
2. **Include context** - input, output, user info
3. **Identify root cause** - helps pattern detection
4. **Log mitigation** - what you did to fix it
5. **Add prevention signals** - helps catch similar failures earlier

## Next Steps

- Read [API Reference](failsafe-api-reference.md)
- Review [Taxonomy](../taxonomy/failure-taxonomy-v0.1.md)
- Explore [Pattern Matching](failsafe-patterns.md)
- See [Examples](failsafe-examples.md)
