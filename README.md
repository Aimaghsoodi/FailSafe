# FailSafe: Collective AI Failure Intelligence

[![npm version](https://img.shields.io/npm/v/@failsafe/core.svg)](https://www.npmjs.com/package/@failsafe/core)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Your AI tools fail. FailSafe makes sure they don't fail the same way twice.**

FailSafe is an open-source collective AI failure intelligence platform. It tracks, categorizes, and learns from AI failures across the industry. Think of it as the CVE database for AI mistakes: a shared, structured, machine-readable database of AI failures that helps all AI tools avoid repeating known mistakes.

## Why FailSafe?

AI systems hallucinate, reason incorrectly, violate instructions, and produce harmful outputs. These failures are predictable and follow patterns. FailSafe captures those patterns so every connected AI tool can check for known risks before making the same mistakes.

## Quick Start

Install the core library:

```bash
npm install @failsafe/core
```

Report a failure:

```typescript
import { createFailureReport } from "@failsafe/core";

const report = createFailureReport(
  "model.hallucination",
  "high",
  "general",
  "Fabricated court case citation",
  "The model cited a non-existent court case as legal precedent"
);
```

Or use the CLI:

```bash
npm install -g failsafe

failsafe submit
failsafe check "What medications interact with warfarin?"
failsafe search "hallucination"
failsafe stats
```

## Package Overview

| Package | Description | Status |
|---------|-------------|--------|
| **@failsafe/core** | Core library with failure reporting, patterns, risk scoring | Production |
| **@failsafe/api** | REST API server (Hono) with SQLite storage | Production |
| **@failsafe/sdk** | TypeScript SDK for API consumers | Production |
| **@failsafe/mcp-server** | Model Context Protocol server for AI agents | Production |

## Core Concepts

**Failure Reports** are structured records of individual AI failure instances. Each captures the query, the failed response, what should have happened, and classification metadata.

**Failure Patterns** are generalized descriptions of recurring failure types, derived from clusters of similar reports.

**Risk Signals** are the result of checking a query against known failure patterns BEFORE sending it to an AI model.

**Taxonomy** is a hierarchical classification system with 6 categories (hallucination, reasoning error, instruction violation, context error, tool/action error, output quality) and 28 subtypes.

## Development

```bash
git clone https://github.com/AbtinDev/failsafe.git
cd failsafe
pnpm install
pnpm build
pnpm test
```

## Documentation

- [Specification](spec/)
- [Failure Taxonomy](spec/taxonomy/)
- [JSON Schemas](spec/schema/)
- [API Reference](website/docs/api-reference.md)
- [MCP Integration](website/docs/mcp-integration.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, code style, testing requirements, and PR process.

## License

MIT Licensed. See [LICENSE](LICENSE).

---

Part of the [OpenClaw](https://github.com/AbtinDev) ecosystem.
