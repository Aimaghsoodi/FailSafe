# FailSafe

**AI Failure Intelligence Platform**

[![CI](https://github.com/Aimaghsoodi/FailSafe/actions/workflows/ci.yml/badge.svg)](https://github.com/Aimaghsoodi/FailSafe/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## What is FailSafe?

FailSafe is an open-source platform for tracking, classifying, and learning from AI agent failures. It provides a structured, machine-readable taxonomy of failure modes so AI tools can check for known risks before making the same mistakes.

Think of it as the CVE database for AI failures — a shared intelligence layer that helps every connected tool avoid repeating known mistakes.

---

## Quick Start

### Install

```bash
npm install @failsafe/core
```

### Report a Failure

```typescript
import { createFailureReport } from '@failsafe/core';

const report = createFailureReport(
  'model.hallucination',   // failure type
  'high',                  // severity
  'reasoning',             // domain
  'Fabricated citation',   // title
  'Model cited a non-existent court case as legal precedent'
);

console.log(report.id);                 // "report_V1StGXR8..."
console.log(report.verificationStatus); // "unverified"
```

### Builder Pattern

```typescript
import { FailureReportBuilder } from '@failsafe/core';

const report = FailureReportBuilder
  .create('security.prompt_injection', 'critical', 'security',
    'Prompt injection detected',
    'User input contained system prompt override attempt')
  .withError('Malicious prompt detected in user input')
  .build();
```

### Update and Verify Reports

```typescript
import {
  updateFailureReport,
  verifyFailureReport,
  resolveFailureReport
} from '@failsafe/core';

// Update fields
const updated = updateFailureReport(report, {
  severity: 'critical',
  tags: ['production', 'urgent']
});

// Mark as verified by a reviewer
const verified = verifyFailureReport(report, 'reviewer@team.com', 'Confirmed in production logs');

// Mark as resolved
const resolved = resolveFailureReport(verified, 'Fixed with input sanitization');
console.log(resolved.verificationStatus); // "resolved"
```

---

## Failure Taxonomy

FailSafe classifies failures into 6 top-level categories with 35+ subtypes:

| Category | Examples |
|----------|----------|
| **Security** | `security.prompt_injection`, `security.data_leak`, `security.unauthorized_access` |
| **Execution** | `execution.timeout`, `execution.crash`, `execution.out_of_memory` |
| **Model** | `model.hallucination`, `model.bias_detected`, `model.inference_error` |
| **Logic** | `logic.invalid_reasoning`, `logic.circular_dependency`, `logic.off_topic` |
| **I/O** | `io.invalid_input`, `io.malformed_data`, `io.network_error` |
| **Integration** | `integration.api_error`, `integration.dependency_missing`, `integration.version_mismatch` |

### Severity Levels

| Level | Score | Description |
|-------|-------|-------------|
| `critical` | 100 | System-breaking, data loss, security breach |
| `high` | 80 | Major feature broken, significant impact |
| `medium` | 50 | Degraded experience, workaround available |
| `low` | 25 | Minor issue, cosmetic |
| `info` | 10 | Informational, no user impact |

---

## Risk Scoring

```typescript
import {
  calculateImpactScore,
  calculateUrgencyScore,
  calculateCompositeScore,
  rankReportsByScore
} from '@failsafe/core';

// Impact score (0-100) based on severity, domain, and resolution status
const impact = calculateImpactScore(report);

// Urgency score (0-100) based on severity and verification status
const urgency = calculateUrgencyScore(report);

// Composite score combining impact and urgency
const composite = calculateCompositeScore(report);

// Rank multiple reports by composite score (highest first)
const ranked = rankReportsByScore(reports);
ranked.forEach(({ report, score }) => {
  console.log(`${report.title}: ${score}`);
});
```

---

## Querying and Filtering

```typescript
import {
  filterFailureReports,
  queryFailureReports,
  calculateFailureStats,
  groupBy
} from '@failsafe/core';

// Filter by type, severity, domain, date range
const critical = filterFailureReports(reports, {
  severities: ['critical', 'high'],
  domains: ['security']
});

// Paginated queries
const page = queryFailureReports(reports, {
  types: ['model.hallucination'],
  verificationStatus: ['unverified']
}, 0, 20);

console.log(page.total);   // total matching reports
console.log(page.hasMore); // whether more pages exist

// Aggregate statistics
const stats = calculateFailureStats(reports);
console.log(stats.totalReports);
console.log(stats.bySeverity);       // { critical: 3, high: 12, ... }
console.log(stats.resolutionRate);   // 0.75

// Group by any field
const byDomain = groupBy(reports, 'domain');
```

---

## Pattern Matching

```typescript
import { createFailureReport } from '@failsafe/core';
import type { FailurePattern } from '@failsafe/core';

// Define a failure pattern
const pattern: FailurePattern = {
  id: 'pattern_hallucination_citations',
  name: 'Citation Hallucination',
  description: 'Model fabricates citations or references',
  failureTypes: ['model.hallucination'],
  conditions: [{ field: 'domain', operator: 'equals', value: 'reasoning' }],
  severity: 'high',
  commonCauses: ['Insufficient training data', 'No retrieval augmentation'],
  preventionStrategies: ['Use RAG pipeline', 'Add citation verification step'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
```

---

## Validation and Fingerprinting

```typescript
import { validateFailureReport } from '@failsafe/core';
import { generateFingerprint } from '@failsafe/core';

// Validate a report against the schema
const result = validateFailureReport(report);
console.log(result.valid);    // true/false
console.log(result.errors);   // validation errors

// Generate a fingerprint for deduplication
const fingerprint = generateFingerprint(report);
console.log(fingerprint.hash); // unique hash based on type + message + stack
```

---

## MCP Server (AI Agent Integration)

Add to your AI tool's MCP configuration:

```json
{
  "mcpServers": {
    "failsafe": {
      "command": "npx",
      "args": ["@failsafe/mcp-server"]
    }
  }
}
```

The MCP server exposes tools for submitting failure reports, checking risks, searching known failures, and retrieving statistics.

---

## Packages

| Package | Description |
|---------|-------------|
| [`@failsafe/core`](./packages/failsafe-core/) | Core library — failure reporting, taxonomy, scoring, matching, validation |
| [`@failsafe/mcp-server`](./packages/failsafe-mcp/) | MCP server — expose failure intelligence to AI agents |
| [`@failsafe/api`](./packages/failsafe-api/) | REST API server with Hono |

---

## Development

```bash
git clone https://github.com/Aimaghsoodi/FailSafe.git
cd FailSafe
pnpm install
pnpm build
pnpm test    # 50 tests
```

---

## API Reference

### Failure Reports
`createFailureReport(type, severity, domain, title, description)` · `updateFailureReport(report, updates)` · `verifyFailureReport(report, verifiedBy, notes?)` · `resolveFailureReport(report, notes?)` · `isCritical(report)`

### FailureReportBuilder
`create(type, severity, domain, title, description)` · `withError(message, stack?, code?)` · `build()`

### Scoring
`calculateImpactScore(report)` · `calculateUrgencyScore(report)` · `calculateCompositeScore(report)` · `rankReportsByScore(reports)` · `createRiskFactorsFromReport(report)`

### Querying
`filterFailureReports(reports, filter)` · `queryFailureReports(reports, filter, offset?, limit?)` · `calculateFailureStats(reports)` · `groupBy(reports, key)`

### Taxonomy
`isValidFailureType(type)` · `getCategory(type)` · `getSubcategories(category)` · `getDefaultSeverityForType(type)`

### Validation
`validateFailureReport(report)` · `serializeReport(report)` · `deserializeReport(json)`

---

## License

MIT — see [LICENSE](./LICENSE).
