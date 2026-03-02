# @failsafe/sdk

Client library for FailSafe - detect, report, and analyze failures in AI systems.

## What is @failsafe/sdk?

The SDK provides a TypeScript/Python client for creating failure reports with rich context. It handles fingerprinting, pattern matching, deduplication, and root cause tracking.

## Installation

npm install @failsafe/sdk

Or with Python:

pip install failsafe-sdk

## Quick Start (TypeScript)

import { FailureReport, FailureTaxonomy } from "@failsafe/sdk";

const report = new FailureReport({
  title: "Claude failed to understand complex prompt",
  description: "Model generated irrelevant response",
  severity: "high",
  systemId: "ai-research-agent",
  agentId: "claude-3-sonnet",
  failureCategory: "misunderstanding",
  timestamp: new Date().toISOString(),
  context: {
    promptLength: 500,
    temperature: 0.7,
    modelVersion: "claude-3-sonnet-20240229",
    userFeedback: "Response was off-topic",
  },
});

const fingerprint = report.getFingerprint();
console.log("Failure fingerprint:", fingerprint);

// Check if similar failure exists
const isMissing = report.shouldReportNew(previousReports);

if (isMissing) {
  await client.report(report);
}

## Quick Start (Python)

from failsafe_sdk import FailureReport, FailureTaxonomy

report = FailureReport(
    title="Claude failed to understand complex prompt",
    description="Model generated irrelevant response",
    severity="high",
    system_id="ai-research-agent",
    agent_id="claude-3-sonnet",
    failure_category="misunderstanding",
    context={
        "prompt_length": 500,
        "temperature": 0.7,
        "model_version": "claude-3-sonnet-20240229",
    }
)

# Send to server
await client.report(report)

## API

### FailureReport

class FailureReport:
  - title: str - Human-readable title
  - description: str - What happened
  - severity: str - critical | high | medium | low
  - systemId: str - Which system failed
  - agentId: str - Which agent failed
  - failureCategory: str - From FailureTaxonomy
  - timestamp: str - ISO 8601
  - context: object - Additional context
  - rootCause?: str - Root cause if identified
  - solution?: str - How it was resolved
  - prevention?: str - How to prevent in future

Methods:
  - getFingerprint() - Get unique failure signature
  - shouldReportNew(reports) - Check if new/duplicate
  - toJSON() - Serialize
  - validate() - Check schema compliance

### FailureTaxonomy

Pre-defined failure categories:

- misunderstanding - Model misunderstood intent
- hallucination - Model generated false info
- reasoning_error - Logic or math error
- refusal - Model refused to comply
- format_error - Output format incorrect
- timeout - Execution took too long
- resource_exhaustion - Out of memory/tokens
- external_api - Dependency failed
- permission_denied - Access denied
- configuration - Invalid settings
- degradation - Performance degraded
- data_corruption - Data integrity issue
- unknown - Uncategorized

## Failure Fingerprinting

FailureReport automatically generates a fingerprint based on:
- Title (normalized)
- Failure category
- System and agent IDs
- Key context fields

Identical failures have matching fingerprints for deduplication.

## Examples

### Tracking Reasoning Errors

import { FailureReport } from "@failsafe/sdk";

const report = new FailureReport({
  title: "Math calculation error in financial analysis",
  description: "Claude calculated 2+2=5",
  severity: "critical",
  systemId: "financial-analyzer",
  agentId: "claude-3-opus",
  failureCategory: "reasoning_error",
  context: {
    calculation: "2 + 2",
    expected: 4,
    actual: 5,
    domain: "finance",
  },
  rootCause: "Model arithmetic error",
  solution: "Switched to Sonnet model",
  prevention: "Add arithmetic validation layer",
});

await client.report(report);

### Deduplication

const newFailures = [];

for (const failure of detectedFailures) {
  if (failure.shouldReportNew(existingReports)) {
    newFailures.push(failure);
    await client.report(failure);
  }
}

### Analysis

const reports = await client.listReports({
  systemId: "my-system",
  severity: "high",
  limit: 100,
});

const byCategory = {};
for (const report of reports) {
  const cat = report.failureCategory;
  byCategory[cat] = (byCategory[cat] || 0) + 1;
}

console.log("Failures by category:", byCategory);

## Taxonomy Reference

Full taxonomy at spec/taxonomy/failure-taxonomy-v0.1.md

## Privacy & Anonymization

Reports can be anonymized before sending:

const anonymized = report.anonymize({
  removeUserData: true,
  removeContext: ["email", "apiKey"],
});

await client.report(anonymized);

## Testing

npm test - TypeScript tests
pytest tests/ - Python tests

Includes:
- Report creation and validation
- Fingerprint generation
- Deduplication logic
- Serialization

## Documentation

- Main README: ../../README.md
- Taxonomy: ../../spec/taxonomy/failure-taxonomy-v0.1.md
- API Reference: ../../spec/failsafe-api-reference.md
- Quickstart: ../../spec/failsafe-quickstart.md

## License

MIT - See LICENSE
