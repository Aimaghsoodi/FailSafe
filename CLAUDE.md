# FAILSAFE — Complete Claude Code Implementation Prompt

You are building **FailSafe** — an open-source collective AI failure intelligence platform. It tracks, categorizes, and learns from AI failures across the industry. Think of it as the CVE database for AI mistakes: a shared, structured, machine-readable database of AI failures that helps all AI tools avoid repeating known mistakes.

This is NOT error logging. This is NOT observability. This is **collective failure intelligence** — a taxonomy-driven, pattern-matching system where every reported failure makes every connected AI tool smarter.

You are building this as a production-ready, publishable open-source project. Every package must be fully functional, tested, documented, and ready for npm/PyPI publishing.

---

## PROJECT STRUCTURE

```
failsafe/
├── README.md                          # Project overview, quickstart, badges
├── LICENSE                            # MIT License
├── CONTRIBUTING.md                    # Contribution guidelines
├── CHANGELOG.md                      # Version history
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # CI: lint, test, build on every PR
│   │   ├── publish-npm.yml           # Publish to npm on tag
│   │   └── publish-pypi.yml          # Publish to PyPI on tag
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── failure_report.md         # Template for submitting AI failures
│   └── pull_request_template.md
│
├── spec/                              # The FailSafe Specification
│   ├── README.md                     # Spec overview
│   ├── taxonomy/
│   │   ├── failure-taxonomy-v0.1.md  # Complete failure classification (3000+ words)
│   │   └── severity-matrix.md        # Severity assessment by domain + failure type
│   ├── schema/
│   │   ├── failure-report.schema.json    # JSON Schema for FailureReport
│   │   ├── failure-pattern.schema.json   # JSON Schema for FailurePattern
│   │   ├── risk-signal.schema.json       # JSON Schema for RiskSignal
│   │   └── contributor.schema.json       # JSON Schema for Contributor profiles
│   └── examples/                     # 10 example failure reports
│       ├── factual-hallucination.json
│       ├── citation-hallucination.json
│       ├── numerical-hallucination.json
│       ├── temporal-hallucination.json
│       ├── logical-reasoning-error.json
│       ├── mathematical-reasoning-error.json
│       ├── safety-instruction-violation.json
│       ├── format-instruction-violation.json
│       ├── wrong-tool-action-error.json
│       └── harmful-output-quality.json
│
├── seed-data/                         # Curated AI failure datasets
│   ├── README.md                     # How seed data was collected, methodology
│   ├── sources.md                    # Source links and attribution
│   ├── legal-hallucinations.json     # 50 documented legal AI failures
│   ├── medical-errors.json           # 50 documented medical AI errors
│   ├── financial-errors.json         # 50 documented financial AI errors
│   ├── coding-errors.json            # 50 documented code generation errors
│   ├── factual-hallucinations.json   # 100 documented factual hallucinations
│   ├── reasoning-errors.json         # 50 documented reasoning failures
│   └── temporal-errors.json          # 50 documented date/time errors
│
├── packages/
│   ├── failsafe-core/                # Core TypeScript library
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── index.ts              # Public API exports
│   │   │   ├── types.ts              # All TypeScript interfaces/types
│   │   │   ├── utils.ts              # ID generation, timestamps, helpers
│   │   │   ├── taxonomy.ts           # Failure taxonomy as code
│   │   │   ├── failure-report.ts     # FailureReport class — create, validate, anonymize, fingerprint
│   │   │   ├── pattern.ts            # FailurePattern class — create, match, update
│   │   │   ├── risk-signal.ts        # RiskSignal class — create, calculate risk
│   │   │   ├── matcher.ts            # Pattern matching engine (TF-IDF-like similarity)
│   │   │   ├── anonymizer.ts         # PII detection and removal
│   │   │   ├── fingerprint.ts        # Deduplication via content hashing
│   │   │   ├── scoring.ts            # Severity scoring (0-100), risk level calculation
│   │   │   ├── validation.ts         # Ajv-based schema validation
│   │   │   └── serialization.ts      # JSON serialization/deserialization
│   │   └── tests/
│   │       ├── taxonomy.test.ts
│   │       ├── failure-report.test.ts
│   │       ├── pattern.test.ts
│   │       ├── risk-signal.test.ts
│   │       ├── matcher.test.ts
│   │       ├── anonymizer.test.ts
│   │       ├── fingerprint.test.ts
│   │       ├── scoring.test.ts
│   │       ├── validation.test.ts
│   │       ├── serialization.test.ts
│   │       └── fixtures/
│   │           ├── valid-report.json
│   │           ├── valid-pattern.json
│   │           ├── invalid-report.json
│   │           ├── duplicate-reports.json
│   │           ├── pii-samples.json
│   │           └── cluster-reports.json
│   │
│   ├── failsafe-api/                 # REST API server (Hono)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── index.ts              # Server entry point
│   │   │   ├── server.ts             # Hono server setup
│   │   │   ├── config.ts             # Server configuration
│   │   │   ├── db/
│   │   │   │   ├── schema.sql        # SQLite schema with FTS5
│   │   │   │   └── migrations/
│   │   │   │       └── 001_initial.sql
│   │   │   ├── routes/
│   │   │   │   ├── failures.ts       # POST, GET, GET/:id, PATCH/:id/verify
│   │   │   │   ├── check.ts          # POST /v1/check
│   │   │   │   ├── patterns.ts       # GET, GET/:id
│   │   │   │   ├── stats.ts          # GET, GET/model/:model, GET/domain/:domain
│   │   │   │   ├── search.ts         # GET /v1/search
│   │   │   │   └── health.ts         # GET /health
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts           # API key authentication
│   │   │   │   ├── rate-limit.ts     # Rate limiting per API key
│   │   │   │   ├── validation.ts     # Request body validation
│   │   │   │   └── cors.ts           # CORS configuration
│   │   │   ├── services/
│   │   │   │   ├── failure-service.ts
│   │   │   │   ├── pattern-service.ts
│   │   │   │   ├── check-service.ts
│   │   │   │   └── stats-service.ts
│   │   │   └── storage/
│   │   │       ├── interface.ts       # Storage interface
│   │   │       ├── sqlite.ts          # SQLite implementation
│   │   │       └── memory.ts          # In-memory implementation (for tests)
│   │   └── tests/
│   │       ├── routes/
│   │       │   ├── failures.test.ts
│   │       │   ├── check.test.ts
│   │       │   ├── patterns.test.ts
│   │       │   ├── stats.test.ts
│   │       │   └── search.test.ts
│   │       ├── services/
│   │       │   ├── failure-service.test.ts
│   │       │   ├── pattern-service.test.ts
│   │       │   └── check-service.test.ts
│   │       └── storage/
│   │           └── sqlite.test.ts
│   │
│   ├── failsafe-sdk/                 # TypeScript SDK for API consumers
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── index.ts              # Public API exports
│   │   │   ├── client.ts             # FailSafeClient class
│   │   │   ├── middleware.ts          # FailSafeMiddleware (wrap, checkAndAnnotate)
│   │   │   ├── interceptor.ts        # Response interceptor for popular frameworks
│   │   │   └── reporter.ts           # Easy failure reporting helpers
│   │   └── tests/
│   │       ├── client.test.ts
│   │       ├── middleware.test.ts
│   │       └── reporter.test.ts
│   │
│   ├── failsafe-mcp/                 # MCP Server for AI agent integration
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── index.ts              # MCP server entry point
│   │   │   ├── server.ts             # MCP server setup with stdio transport
│   │   │   ├── tools.ts              # 5 tool definitions
│   │   │   └── handlers.ts           # Tool call handlers
│   │   └── tests/
│   │       ├── server.test.ts
│   │       └── tools.test.ts
│   │
│   ├── failsafe-cli/                 # CLI tool
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── src/
│   │   │   ├── index.ts              # CLI entry point (#!/usr/bin/env node)
│   │   │   ├── commands/
│   │   │   │   ├── submit.ts         # failsafe submit — interactive failure submission
│   │   │   │   ├── check.ts          # failsafe check "query" — check risk before sending
│   │   │   │   ├── search.ts         # failsafe search "term" — search failures
│   │   │   │   ├── patterns.ts       # failsafe patterns — list known patterns
│   │   │   │   ├── stats.ts          # failsafe stats — show statistics dashboard
│   │   │   │   ├── seed.ts           # failsafe seed — load seed data
│   │   │   │   └── verify.ts         # failsafe verify <id> — verify a failure report
│   │   │   ├── display.ts            # Terminal formatting, colors, tables
│   │   │   └── config.ts             # CLI configuration (~/.failsafe/config.json)
│   │   └── tests/
│   │       ├── commands/
│   │       │   ├── submit.test.ts
│   │       │   ├── check.test.ts
│   │       │   ├── search.test.ts
│   │       │   └── stats.test.ts
│   │       └── display.test.ts
│   │
│   └── failsafe-py/                  # Python SDK
│       ├── pyproject.toml
│       ├── failsafe/
│       │   ├── __init__.py
│       │   ├── types.py              # Pydantic models for all types
│       │   ├── client.py             # FailSafeClient (HTTP client)
│       │   ├── report.py             # FailureReport class
│       │   ├── pattern.py            # FailurePattern class
│       │   ├── matcher.py            # Pattern matching
│       │   ├── anonymizer.py         # PII detection/removal
│       │   ├── fingerprint.py        # Deduplication
│       │   ├── scoring.py            # Severity/risk scoring
│       │   ├── taxonomy.py           # Failure taxonomy
│       │   ├── validation.py         # Schema validation
│       │   ├── serialization.py      # JSON serialization
│       │   └── middleware.py          # LangChain/CrewAI middleware
│       └── tests/
│           ├── test_client.py
│           ├── test_report.py
│           ├── test_pattern.py
│           ├── test_matcher.py
│           ├── test_anonymizer.py
│           ├── test_scoring.py
│           └── conftest.py           # Shared fixtures
│
├── website/                          # Landing page + documentation
│   ├── index.html                    # Single-page landing site
│   ├── docs/
│   │   ├── quickstart.md
│   │   ├── api-reference.md
│   │   ├── taxonomy.md
│   │   ├── sdk-typescript.md
│   │   ├── sdk-python.md
│   │   ├── mcp-integration.md
│   │   └── contributing-failures.md
│   └── blog/
│       └── manifesto.md              # The manifesto blog post
│
└── examples/
    ├── langchain-middleware/          # LangChain with auto-check middleware
    │   ├── README.md
    │   └── failsafe_langchain.py
    ├── crewai-middleware/             # CrewAI with auto-check middleware
    │   ├── README.md
    │   └── failsafe_crewai.py
    ├── claude-desktop-mcp/           # Claude Desktop MCP integration
    │   ├── README.md
    │   └── claude_desktop_config.json
    └── cloudflare-worker/            # FailSafe API on Cloudflare Workers
        ├── README.md
        ├── wrangler.toml
        └── src/index.ts
```

---

## DETAILED TECHNICAL SPECIFICATIONS

### 1. CORE DATA TYPES (packages/failsafe-core/src/types.ts)

```typescript
// ============================================================================
// FAILURE TAXONOMY — Hierarchical Classification
// ============================================================================

/**
 * Top-level failure categories. Every AI failure falls into one of these 6
 * categories, each with domain-specific subtypes.
 */
export type FailureCategory =
  | 'hallucination'
  | 'reasoning_error'
  | 'instruction_violation'
  | 'context_error'
  | 'tool_action_error'
  | 'output_quality';

/**
 * Hallucination subtypes — the model generates content not grounded in reality
 * or source material.
 */
export type HallucinationSubtype =
  | 'factual'           // States false facts as true ("The Eiffel Tower is in London")
  | 'citation'          // Invents non-existent papers, cases, URLs, quotes
  | 'numerical'         // Fabricates or miscalculates numbers, statistics, dates
  | 'temporal'          // Wrong dates, anachronisms, future events stated as past
  | 'entity'            // Conflates people, orgs, places, or invents them
  | 'capability';       // Claims abilities it doesn't have ("I searched the web")

/**
 * Reasoning error subtypes — the model's logic or inference is flawed.
 */
export type ReasoningSubtype =
  | 'logical'           // Invalid logical deductions, affirming the consequent, etc.
  | 'mathematical'      // Arithmetic errors, wrong formulas, unit conversion failures
  | 'causal'            // Confuses correlation/causation, reverses cause/effect
  | 'statistical'       // Misinterprets p-values, base rates, sample sizes
  | 'analogical';       // False analogies, over-generalization from examples

/**
 * Instruction violation subtypes — the model disobeys explicit instructions.
 */
export type InstructionSubtype =
  | 'safety'            // Generates harmful/dangerous content despite safety instructions
  | 'scope'             // Answers questions outside defined scope/domain
  | 'format'            // Ignores requested output format (JSON, bullet points, etc.)
  | 'persona'           // Breaks character or role assignment
  | 'confidentiality';  // Leaks system prompt content, PII, or restricted information

/**
 * Context error subtypes — the model misinterprets or misuses context.
 */
export type ContextSubtype =
  | 'ambiguity'         // Picks wrong interpretation of ambiguous input
  | 'missing'           // Ignores critical context that was provided
  | 'cultural'          // Misapplies cultural norms, idioms, regional conventions
  | 'domain';           // Applies general knowledge incorrectly to specialized domain

/**
 * Tool/action error subtypes — the model misuses tools or takes wrong actions.
 */
export type ToolActionSubtype =
  | 'wrong_tool'        // Selects inappropriate tool for the task
  | 'wrong_params'      // Correct tool, but wrong arguments or parameters
  | 'misinterprets_result' // Misreads or misinterprets tool output
  | 'unnecessary';      // Uses a tool when direct response was sufficient

/**
 * Output quality subtypes — the output is technically responsive but harmful or poor.
 */
export type OutputQualitySubtype =
  | 'harmful'           // Content that could cause real-world harm if acted upon
  | 'misleading'        // Technically true but framed to mislead
  | 'incomplete'        // Missing critical information, caveats, or warnings
  | 'contradictory'     // Self-contradicting within the same response
  | 'outdated';         // Uses outdated information when current data matters

/**
 * Union of all subtype types for generic handling.
 */
export type FailureSubtype =
  | HallucinationSubtype
  | ReasoningSubtype
  | InstructionSubtype
  | ContextSubtype
  | ToolActionSubtype
  | OutputQualitySubtype;

/**
 * Structured failure type: category + subtype combination.
 */
export interface FailureType {
  category: FailureCategory;
  subtype: FailureSubtype;
}

// ============================================================================
// SEVERITY
// ============================================================================

/**
 * Severity levels for failure reports. Severity is context-dependent:
 * a factual hallucination is "low" in casual chat but "critical" in medical advice.
 */
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

/**
 * Mapping of severity to numeric ranges:
 * - critical: 90-100
 * - high: 70-89
 * - medium: 40-69
 * - low: 15-39
 * - informational: 0-14
 */

// ============================================================================
// DOMAIN
// ============================================================================

/**
 * Domain classification. High-stakes domains (legal, medical, financial)
 * increase severity scores automatically.
 */
export type Domain =
  | 'legal'
  | 'medical'
  | 'financial'
  | 'coding'
  | 'education'
  | 'general'
  | 'scientific'
  | 'creative';

/**
 * High-stakes domains where AI failures carry outsized risk.
 */
export const HIGH_STAKES_DOMAINS: Domain[] = ['legal', 'medical', 'financial'];

// ============================================================================
// MODEL INFORMATION
// ============================================================================

/**
 * Information about the AI model that produced the failure.
 */
export interface ModelInfo {
  name: string;              // e.g., "gpt-4", "claude-3-opus", "gemini-pro"
  provider: string;          // e.g., "openai", "anthropic", "google"
  version?: string;          // e.g., "2024-01-25", "20240229"
}

// ============================================================================
// VERIFICATION
// ============================================================================

/**
 * Verification status of a failure report. Reports start as "unverified"
 * and progress through community verification.
 */
export type VerificationStatus =
  | 'unverified'    // Newly submitted, not yet reviewed
  | 'verified'      // Confirmed by independent verification
  | 'disputed'      // Challenged by another contributor
  | 'retracted';    // Reporter or moderator withdrew the report

// ============================================================================
// FAILURE REPORT — The core data object
// ============================================================================

/**
 * A FailureReport is a structured record of a single AI failure instance.
 * It captures the query, the failed response, what should have happened,
 * and classification metadata.
 */
export interface FailureReport {
  id: string;                          // nanoid with "fail_" prefix, e.g., "fail_V1StGXR8"
  query: string;                       // The input/prompt that triggered the failure
  response: string;                    // The AI's actual (failed) response
  groundTruth?: string;                // The correct/expected response (if known)
  explanation: string;                 // Human-readable explanation of why this is a failure
  failureType: FailureType;            // Structured classification
  severity: Severity;                  // Severity level
  severityScore: number;               // Numeric severity 0-100
  domain: Domain;                      // Domain context
  model: ModelInfo;                    // Which model failed
  tags?: string[];                     // Freeform tags for additional classification
  verificationStatus: VerificationStatus;
  reportedBy?: string;                 // Contributor ID who reported this
  verifiedBy?: string;                 // Contributor ID who verified this
  anonymized: boolean;                 // Whether PII has been stripped
  fingerprint: string;                 // Content hash for deduplication
  createdAt: string;                   // ISO 8601 timestamp
  updatedAt: string;                   // ISO 8601 timestamp
  metadata?: Record<string, unknown>;  // Extensible metadata
}

// ============================================================================
// FAILURE PATTERN — Recurring failure signatures
// ============================================================================

/**
 * A FailurePattern is a generalized description of a recurring failure type.
 * Patterns are derived from clusters of similar FailureReports.
 */
export interface FailurePattern {
  id: string;                          // nanoid with "pat_" prefix
  name: string;                        // Human-readable pattern name
  description: string;                 // Detailed description of the pattern
  failureType: FailureType;            // Primary classification
  occurrenceCount: number;             // How many times this pattern has been observed
  exampleReportIds: string[];          // IDs of representative failure reports
  detectionHeuristics: string[];       // Keywords, phrases, or regex for matching
  affectedModels: string[];            // Models known to exhibit this pattern
  affectedDomains: Domain[];           // Domains where this pattern occurs
  severity: Severity;                  // Typical severity
  firstSeen: string;                   // ISO 8601 — when first observed
  lastSeen: string;                    // ISO 8601 — most recent occurrence
  metadata?: Record<string, unknown>;
}

// ============================================================================
// RISK SIGNAL — Real-time risk assessment
// ============================================================================

/**
 * A RiskSignal is the result of checking a query against known failure patterns
 * BEFORE sending it to an AI model. It warns about known risks.
 */
export interface RiskSignal {
  id: string;                          // nanoid with "risk_" prefix
  query: string;                       // The query that was checked
  riskLevel: RiskLevel;                // Overall risk assessment
  riskScore: number;                   // Numeric risk 0-100
  matchedPatterns: MatchedPattern[];   // Patterns that matched
  recommendations: Recommendation[];   // Suggested mitigations
  timestamp: string;                   // ISO 8601
}

/**
 * Risk levels derived from risk score.
 * - critical: 90-100
 * - high: 70-89
 * - medium: 40-69
 * - low: 15-39
 * - minimal: 0-14
 */
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';

/**
 * A pattern match result with confidence score.
 */
export interface MatchedPattern {
  patternId: string;
  patternName: string;
  confidence: number;                  // 0.0 to 1.0
  explanation: string;                 // Why this pattern matched
}

/**
 * A recommended action to mitigate a detected risk.
 */
export interface Recommendation {
  type: RecommendationType;
  description: string;
  priority: number;                    // 1 = highest priority
}

export type RecommendationType =
  | 'verify'          // Fact-check the output
  | 'add_context'     // Provide additional context to the AI
  | 'use_tool'        // Use a specific tool (calculator, search, etc.)
  | 'human_review'    // Escalate to human review
  | 'rephrase';       // Rephrase the query for better results

/**
 * Individual risk factor contributing to overall risk score.
 */
export interface RiskFactor {
  factor: string;                      // Name of the risk factor
  weight: number;                      // How much this factor matters (0-1)
  score: number;                       // This factor's score (0-100)
  explanation?: string;                // Why this factor was flagged
}

// ============================================================================
// CONTRIBUTOR — Community member profiles
// ============================================================================

/**
 * A Contributor is a community member who submits and/or verifies failure reports.
 * Reputation is earned through verified submissions.
 */
export interface Contributor {
  id: string;                          // nanoid with "contrib_" prefix
  name?: string;                       // Display name (optional for anonymity)
  reportsSubmitted: number;
  reportsVerified: number;
  reputation: number;                  // 0-100 reputation score
  badges: Badge[];
  joinedAt: string;                    // ISO 8601
}

/**
 * Badges earned through contribution milestones.
 */
export type Badge =
  | 'first_report'      // Submitted first failure report
  | 'verified_10'       // Verified 10 reports
  | 'domain_expert'     // 20+ verified reports in a single domain
  | 'pattern_finder'    // Report led to a new pattern being identified
  | 'top_contributor';  // Top 10 all-time contributors

// ============================================================================
// QUERY / FILTER TYPES
// ============================================================================

/**
 * Filter for querying failure reports.
 */
export interface FailureFilter {
  failureType?: FailureType;
  category?: FailureCategory | FailureCategory[];
  subtype?: FailureSubtype | FailureSubtype[];
  severity?: Severity | Severity[];
  domain?: Domain | Domain[];
  model?: string;
  provider?: string;
  tags?: string[];
  verificationStatus?: VerificationStatus | VerificationStatus[];
  search?: string;                     // Full-text search across query, response, explanation
  createdAfter?: string;
  createdBefore?: string;
  minSeverityScore?: number;
  maxSeverityScore?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'severityScore' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated query result.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Aggregate statistics across the failure database.
 */
export interface FailureStats {
  totalReports: number;
  totalPatterns: number;
  totalContributors: number;
  byCategory: Record<FailureCategory, number>;
  bySeverity: Record<Severity, number>;
  byDomain: Record<Domain, number>;
  byModel: Record<string, number>;
  byVerificationStatus: Record<VerificationStatus, number>;
  topPatterns: FailurePattern[];       // Top 10 most common patterns
  recentReports: FailureReport[];      // 10 most recent reports
  averageSeverityScore: number;
  highStakesPercentage: number;        // % of reports in high-stakes domains
}

/**
 * Model-specific statistics.
 */
export interface ModelStats {
  model: string;
  totalFailures: number;
  byCategory: Record<FailureCategory, number>;
  bySeverity: Record<Severity, number>;
  averageSeverityScore: number;
  topPatterns: FailurePattern[];
  recentReports: FailureReport[];
}

/**
 * Domain-specific statistics.
 */
export interface DomainStats {
  domain: Domain;
  totalFailures: number;
  byCategory: Record<FailureCategory, number>;
  bySeverity: Record<Severity, number>;
  averageSeverityScore: number;
  topPatterns: FailurePattern[];
  topModels: Array<{ model: string; count: number }>;
}

// ============================================================================
// ANONYMIZATION
// ============================================================================

/**
 * Result of running PII detection on text.
 */
export interface AnonymizationResult {
  anonymizedText: string;
  detections: PIIDetection[];
  piiFound: boolean;
}

export interface PIIDetection {
  type: PIIType;
  original: string;
  replacement: string;
  startIndex: number;
  endIndex: number;
}

export type PIIType =
  | 'email'
  | 'phone'
  | 'ssn'
  | 'credit_card'
  | 'ip_address'
  | 'url_auth_token'
  | 'person_name'
  | 'address';

// ============================================================================
// FINGERPRINTING / DEDUPLICATION
// ============================================================================

/**
 * Result of fingerprint comparison between two reports.
 */
export interface FingerprintMatch {
  reportId: string;
  similarity: number;                  // 0.0 to 1.0
  isDuplicate: boolean;                // true if similarity > threshold
}

/**
 * A cluster of similar failure reports.
 */
export interface FailureCluster {
  clusterId: string;
  reports: string[];                   // Report IDs in this cluster
  centroid: string;                    // Most representative report ID
  averageSimilarity: number;
}

// ============================================================================
// EVENTS
// ============================================================================

/**
 * Events emitted when the failure database changes.
 */
export interface FailureEvent {
  id: string;
  type: FailureEventType;
  reportId?: string;
  patternId?: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export type FailureEventType =
  | 'report.created'
  | 'report.verified'
  | 'report.disputed'
  | 'report.retracted'
  | 'report.updated'
  | 'pattern.created'
  | 'pattern.updated'
  | 'pattern.occurrence'
  | 'risk.checked'
  | 'contributor.joined'
  | 'contributor.badge_earned';
```

### 2. TAXONOMY MODULE (packages/failsafe-core/src/taxonomy.ts)

Implement the failure taxonomy as executable code:

```typescript
/**
 * The taxonomy module provides programmatic access to the failure classification
 * system. It defines the full type hierarchy, severity defaults, domain-aware
 * severity adjustments, and helper functions for navigating the taxonomy.
 */

// === Taxonomy Tree ===

interface TaxonomyNode {
  category: FailureCategory;
  subtypes: Array<{
    subtype: FailureSubtype;
    name: string;
    description: string;
    defaultSeverity: Severity;
    detectionHints: string[];          // Keywords/patterns that suggest this subtype
    examples: string[];                // Brief example descriptions
  }>;
}

const TAXONOMY: TaxonomyNode[];        // Full taxonomy tree

// === Helper Functions ===

function getSubtypesForCategory(category: FailureCategory): FailureSubtype[];
function getCategoryForSubtype(subtype: FailureSubtype): FailureCategory;
function getDefaultSeverity(failureType: FailureType): Severity;
function isHighStakesDomain(domain: Domain): boolean;
function adjustSeverityForDomain(baseSeverity: Severity, domain: Domain): Severity;
function getSeverityScore(severity: Severity, domain: Domain): number;
function getDetectionHints(failureType: FailureType): string[];
function getAllCategories(): FailureCategory[];
function getAllSubtypes(): FailureSubtype[];
function isValidFailureType(failureType: FailureType): boolean;
function getFailureTypeDisplayName(failureType: FailureType): string;
```

**Severity adjustment rules:**
- Base severity comes from the failure subtype default
- High-stakes domains (legal, medical, financial) bump severity UP one level (medium -> high, high -> critical)
- Hallucinations in high-stakes domains are ALWAYS at least "high"
- Safety instruction violations are ALWAYS at least "high" regardless of domain
- Informational severity is never adjusted (it stays informational)

### 3. FAILURE REPORT MODULE (packages/failsafe-core/src/failure-report.ts)

```typescript
/**
 * FailureReport class — create, validate, and manage individual failure reports.
 */
class FailureReport {
  // === Construction ===
  static create(input: CreateFailureReportInput): FailureReport;
  static fromJSON(json: string | object): FailureReport;

  // === Properties ===
  readonly data: Readonly<FailureReportData>;

  // === Validation ===
  validate(): ValidationResult;
  isComplete(): boolean;

  // === Anonymization ===
  anonymize(): FailureReport;          // Returns new report with PII stripped
  isAnonymized(): boolean;

  // === Fingerprinting ===
  getFingerprint(): string;
  isSimilarTo(other: FailureReport, threshold?: number): boolean;

  // === Severity ===
  getSeverityScore(): number;
  recalculateSeverity(): FailureReport;

  // === Serialization ===
  toJSON(): FailureReportData;
  toString(): string;
}

interface CreateFailureReportInput {
  query: string;                       // Required
  response: string;                    // Required
  explanation: string;                 // Required
  failureType: FailureType;            // Required
  domain: Domain;                      // Required
  model: ModelInfo;                    // Required
  groundTruth?: string;
  severity?: Severity;                 // Auto-calculated if omitted
  tags?: string[];
  reportedBy?: string;
  metadata?: Record<string, unknown>;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

### 4. PATTERN MATCHER MODULE (packages/failsafe-core/src/matcher.ts)

```typescript
/**
 * PatternMatcher — the core intelligence engine. Matches queries and responses
 * against known failure patterns using TF-IDF-like text similarity, keyword
 * matching, and heuristic rules.
 */
class PatternMatcher {
  constructor(patterns: FailurePattern[]);

  // === Risk Checking ===
  /**
   * Check a query BEFORE sending to AI. Returns risk signal with matched
   * patterns and recommendations.
   */
  checkRisk(query: string, domain?: Domain): RiskSignal;

  // === Failure Matching ===
  /**
   * Match a failure report against known patterns. Returns matched patterns
   * sorted by confidence.
   */
  matchPatterns(report: FailureReport): MatchedPattern[];

  /**
   * Find reports similar to a given report. Uses fingerprint comparison
   * and text similarity.
   */
  findSimilar(report: FailureReport, allReports: FailureReport[], threshold?: number): FingerprintMatch[];

  // === Pattern Discovery ===
  /**
   * Analyze a collection of reports to detect new patterns. Groups similar
   * reports into clusters and generates pattern candidates.
   */
  detectNewPatterns(reports: FailureReport[], minClusterSize?: number): FailurePattern[];

  // === Internal ===
  private tokenize(text: string): string[];
  private calculateTFIDF(tokens: string[], corpus: string[][]): Map<string, number>;
  private cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number;
  private matchHeuristics(text: string, heuristics: string[]): number;
  private calculateRiskScore(matches: MatchedPattern[], domain?: Domain): number;
  private generateRecommendations(matches: MatchedPattern[], riskLevel: RiskLevel): Recommendation[];
}
```

### 5. ANONYMIZER MODULE (packages/failsafe-core/src/anonymizer.ts)

```typescript
/**
 * PII detection and removal. All failure reports should be anonymized before
 * submission to protect user privacy.
 */
class Anonymizer {
  /**
   * Detect and remove PII from text. Returns anonymized text and a list
   * of detections.
   */
  static anonymize(text: string): AnonymizationResult;

  /**
   * Check if text contains PII without modifying it.
   */
  static detectPII(text: string): PIIDetection[];

  /**
   * Anonymize all text fields in a FailureReport.
   */
  static anonymizeReport(report: FailureReport): FailureReport;

  // === Detection Patterns ===
  private static readonly EMAIL_REGEX: RegExp;       // Standard email pattern
  private static readonly PHONE_REGEX: RegExp;       // US/intl phone numbers
  private static readonly SSN_REGEX: RegExp;         // US SSN format XXX-XX-XXXX
  private static readonly CREDIT_CARD_REGEX: RegExp;  // Major card formats
  private static readonly IP_REGEX: RegExp;           // IPv4 and IPv6
  private static readonly URL_AUTH_REGEX: RegExp;     // URLs with auth tokens/keys
  private static readonly NAME_PATTERNS: string[];    // Common name prefixes (Mr., Dr., etc.)

  // === Replacement Format ===
  // Emails    -> [EMAIL_REDACTED]
  // Phones    -> [PHONE_REDACTED]
  // SSNs      -> [SSN_REDACTED]
  // Cards     -> [CARD_REDACTED]
  // IPs       -> [IP_REDACTED]
  // Tokens    -> [TOKEN_REDACTED]
  // Names     -> [NAME_REDACTED]
  // Addresses -> [ADDRESS_REDACTED]
}
```

### 6. FINGERPRINT MODULE (packages/failsafe-core/src/fingerprint.ts)

```typescript
/**
 * Content-based fingerprinting for deduplication. Generates stable hashes
 * from report content, enabling duplicate detection without exact string matching.
 */
class Fingerprinter {
  /**
   * Generate a fingerprint for a failure report. The fingerprint is a hash
   * of normalized (lowercased, whitespace-collapsed, stop-words-removed)
   * query + response + failure type.
   */
  static fingerprint(report: CreateFailureReportInput): string;

  /**
   * Compare two fingerprints and return a similarity score (0-1).
   */
  static compare(fpA: string, fpB: string): number;

  /**
   * Check if a report is a duplicate of any existing report.
   * Uses both exact fingerprint match and fuzzy similarity.
   */
  static isDuplicate(
    report: CreateFailureReportInput,
    existingReports: FailureReport[],
    threshold?: number                  // Default: 0.85
  ): FingerprintMatch | null;

  /**
   * Cluster reports by similarity. Uses single-linkage clustering.
   */
  static cluster(
    reports: FailureReport[],
    threshold?: number                  // Default: 0.80
  ): FailureCluster[];

  // === Internal ===
  private static normalize(text: string): string;
  private static extractKeyTerms(text: string): string[];
  private static hashTerms(terms: string[]): string;
  private static simhash(text: string): string;     // SimHash for fuzzy matching
}
```

### 7. SCORING MODULE (packages/failsafe-core/src/scoring.ts)

```typescript
/**
 * Severity and risk scoring engine. Converts qualitative assessments into
 * quantitative scores for sorting, filtering, and threshold-based alerting.
 */

// === Severity Scoring ===
function calculateSeverityScore(
  failureType: FailureType,
  domain: Domain,
  factors?: RiskFactor[]
): number;                              // Returns 0-100

function severityFromScore(score: number): Severity;
function scoreFromSeverity(severity: Severity): number;  // Midpoint of range

// === Risk Level Calculation ===
function calculateRiskLevel(
  matchedPatterns: MatchedPattern[],
  domain?: Domain
): { riskLevel: RiskLevel; riskScore: number; factors: RiskFactor[] };

function riskLevelFromScore(score: number): RiskLevel;

// === Confidence Scoring ===
function calculateConfidence(
  heuristicScore: number,               // 0-1 from keyword matching
  similarityScore: number,              // 0-1 from TF-IDF
  domainMatch: boolean,
  modelMatch: boolean
): number;                              // Returns 0-1

// === Severity Score Ranges ===
// critical:      90-100
// high:          70-89
// medium:        40-69
// low:           15-39
// informational: 0-14

// === Risk Score Ranges ===
// critical: 90-100
// high:     70-89
// medium:   40-69
// low:      15-39
// minimal:  0-14

// === Domain Multipliers ===
// legal:     1.4x
// medical:   1.4x
// financial: 1.3x
// scientific: 1.1x
// coding:    1.0x
// education: 1.0x
// creative:  0.9x
// general:   1.0x
```

---

## API ENDPOINTS (packages/failsafe-api/)

### Server Framework: Hono

Use Hono for the HTTP server. It is lightweight, fast, and works on Node.js, Cloudflare Workers, Deno, and Bun.

### Database: SQLite with FTS5

```sql
-- packages/failsafe-api/src/db/schema.sql

-- Core failure reports table
CREATE TABLE IF NOT EXISTS failure_reports (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  ground_truth TEXT,
  explanation TEXT NOT NULL,
  failure_category TEXT NOT NULL,
  failure_subtype TEXT NOT NULL,
  severity TEXT NOT NULL,
  severity_score INTEGER NOT NULL,
  domain TEXT NOT NULL,
  model_name TEXT NOT NULL,
  model_provider TEXT NOT NULL,
  model_version TEXT,
  tags TEXT,                            -- JSON array stored as text
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  reported_by TEXT,
  verified_by TEXT,
  anonymized INTEGER NOT NULL DEFAULT 0,
  fingerprint TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  metadata TEXT                         -- JSON object stored as text
);

-- Full-text search index
CREATE VIRTUAL TABLE IF NOT EXISTS failure_reports_fts USING fts5(
  query,
  response,
  explanation,
  ground_truth,
  content='failure_reports',
  content_rowid='rowid'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS failure_reports_ai AFTER INSERT ON failure_reports BEGIN
  INSERT INTO failure_reports_fts(rowid, query, response, explanation, ground_truth)
  VALUES (new.rowid, new.query, new.response, new.explanation, new.ground_truth);
END;

CREATE TRIGGER IF NOT EXISTS failure_reports_ad AFTER DELETE ON failure_reports BEGIN
  INSERT INTO failure_reports_fts(failure_reports_fts, rowid, query, response, explanation, ground_truth)
  VALUES ('delete', old.rowid, old.query, old.response, old.explanation, old.ground_truth);
END;

CREATE TRIGGER IF NOT EXISTS failure_reports_au AFTER UPDATE ON failure_reports BEGIN
  INSERT INTO failure_reports_fts(failure_reports_fts, rowid, query, response, explanation, ground_truth)
  VALUES ('delete', old.rowid, old.query, old.response, old.explanation, old.ground_truth);
  INSERT INTO failure_reports_fts(rowid, query, response, explanation, ground_truth)
  VALUES (new.rowid, new.query, new.response, new.explanation, new.ground_truth);
END;

-- Failure patterns table
CREATE TABLE IF NOT EXISTS failure_patterns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  failure_category TEXT NOT NULL,
  failure_subtype TEXT NOT NULL,
  occurrence_count INTEGER NOT NULL DEFAULT 0,
  example_report_ids TEXT,              -- JSON array
  detection_heuristics TEXT,            -- JSON array
  affected_models TEXT,                 -- JSON array
  affected_domains TEXT,                -- JSON array
  severity TEXT NOT NULL,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL,
  metadata TEXT
);

-- Contributors table
CREATE TABLE IF NOT EXISTS contributors (
  id TEXT PRIMARY KEY,
  name TEXT,
  reports_submitted INTEGER NOT NULL DEFAULT 0,
  reports_verified INTEGER NOT NULL DEFAULT 0,
  reputation INTEGER NOT NULL DEFAULT 0,
  badges TEXT,                          -- JSON array
  joined_at TEXT NOT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reports_category ON failure_reports(failure_category);
CREATE INDEX IF NOT EXISTS idx_reports_severity ON failure_reports(severity);
CREATE INDEX IF NOT EXISTS idx_reports_domain ON failure_reports(domain);
CREATE INDEX IF NOT EXISTS idx_reports_model ON failure_reports(model_name);
CREATE INDEX IF NOT EXISTS idx_reports_provider ON failure_reports(model_provider);
CREATE INDEX IF NOT EXISTS idx_reports_status ON failure_reports(verification_status);
CREATE INDEX IF NOT EXISTS idx_reports_fingerprint ON failure_reports(fingerprint);
CREATE INDEX IF NOT EXISTS idx_reports_created ON failure_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_patterns_category ON failure_patterns(failure_category);
CREATE INDEX IF NOT EXISTS idx_patterns_severity ON failure_patterns(severity);
```

### Route Specifications

#### `POST /v1/failures` — Submit a new failure report

**Request Body:**
```json
{
  "query": "What was the outcome of Smith v. Jones 2019?",
  "response": "In Smith v. Jones (2019), the Supreme Court ruled...",
  "groundTruth": "This case does not exist.",
  "explanation": "The model fabricated a court case that never happened.",
  "failureType": { "category": "hallucination", "subtype": "citation" },
  "domain": "legal",
  "model": { "name": "gpt-4", "provider": "openai", "version": "2024-01-25" },
  "tags": ["fabricated-case", "legal-citation"],
  "metadata": {}
}
```

**Response (201):**
```json
{
  "id": "fail_V1StGXR8",
  "severity": "critical",
  "severityScore": 95,
  "fingerprint": "a1b2c3d4e5f6...",
  "verificationStatus": "unverified",
  "anonymized": true,
  "duplicate": null,
  "createdAt": "2026-02-28T10:30:00Z"
}
```

**Behavior:**
- Auto-calculate severity based on failure type + domain
- Auto-anonymize PII from query, response, groundTruth, explanation
- Auto-generate fingerprint
- Check for duplicates; if found, return `duplicate: { reportId, similarity }`
- Validate against schema

#### `GET /v1/failures/:id` — Get a single failure report

**Response (200):** Full FailureReport object.

**Response (404):** `{ "error": "Report not found", "id": "<id>" }`

#### `GET /v1/failures` — List failure reports with filtering

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by failure category |
| `subtype` | string | Filter by failure subtype |
| `severity` | string | Filter by severity level |
| `domain` | string | Filter by domain |
| `model` | string | Filter by model name |
| `provider` | string | Filter by model provider |
| `status` | string | Filter by verification status |
| `minScore` | number | Minimum severity score |
| `maxScore` | number | Maximum severity score |
| `createdAfter` | string | ISO 8601 date filter |
| `createdBefore` | string | ISO 8601 date filter |
| `tags` | string | Comma-separated tags |
| `limit` | number | Results per page (default 20, max 100) |
| `offset` | number | Pagination offset |
| `sort` | string | Sort field: `createdAt`, `severityScore`, `updatedAt` |
| `order` | string | Sort order: `asc`, `desc` |

**Response (200):**
```json
{
  "data": [/* FailureReport[] */],
  "total": 1234,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

#### `PATCH /v1/failures/:id/verify` — Verify or dispute a failure report

**Request Body:**
```json
{
  "status": "verified",
  "verifiedBy": "contrib_ABC123",
  "notes": "Confirmed: case does not exist in any legal database."
}
```

**Response (200):** Updated FailureReport object.

**Allowed transitions:**
- `unverified` -> `verified` | `disputed` | `retracted`
- `disputed` -> `verified` | `retracted`
- `verified` -> `retracted` (moderator only)

#### `POST /v1/check` — Pre-flight risk check

**Request Body:**
```json
{
  "query": "What medications interact with warfarin?",
  "domain": "medical",
  "model": "gpt-4"
}
```

**Response (200):**
```json
{
  "id": "risk_XyZ789",
  "riskLevel": "high",
  "riskScore": 78,
  "matchedPatterns": [
    {
      "patternId": "pat_MedDrug01",
      "patternName": "Drug Interaction Hallucination",
      "confidence": 0.87,
      "explanation": "Queries about drug interactions frequently produce hallucinated interactions or miss critical ones."
    }
  ],
  "recommendations": [
    {
      "type": "verify",
      "description": "Cross-reference any drug interactions with FDA database or Lexicomp.",
      "priority": 1
    },
    {
      "type": "human_review",
      "description": "Medical queries about drug interactions should be reviewed by a pharmacist.",
      "priority": 2
    }
  ],
  "timestamp": "2026-02-28T10:30:00Z"
}
```

#### `GET /v1/patterns` — List known failure patterns

**Query Parameters:** `category`, `severity`, `domain`, `model`, `limit`, `offset`, `sort`, `order`

**Response (200):** `PaginatedResult<FailurePattern>`

#### `GET /v1/patterns/:id` — Get a single pattern

**Response (200):** Full FailurePattern object with linked example reports.

#### `GET /v1/stats` — Global statistics

**Response (200):** Full FailureStats object.

#### `GET /v1/stats/model/:model` — Model-specific statistics

**Response (200):** ModelStats object.

#### `GET /v1/stats/domain/:domain` — Domain-specific statistics

**Response (200):** DomainStats object.

#### `GET /v1/search` — Full-text search

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (required) |
| `category` | string | Filter by category |
| `domain` | string | Filter by domain |
| `severity` | string | Filter by severity |
| `limit` | number | Results per page |
| `offset` | number | Pagination offset |

**Response (200):** `PaginatedResult<FailureReport>` ranked by FTS5 relevance.

#### `GET /health` — Health check

**Response (200):**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime": 3600,
  "database": "connected",
  "totalReports": 1234,
  "totalPatterns": 45
}
```

### Middleware Stack

```typescript
// Applied to all /v1/* routes in this order:
app.use('/v1/*', cors());              // CORS headers
app.use('/v1/*', rateLimiter({         // Rate limiting
  maxRequests: 100,
  windowMs: 60_000,                    // 100 requests per minute
  keyGenerator: (c) => c.req.header('X-API-Key') || c.req.header('x-forwarded-for') || 'anonymous',
}));
app.use('/v1/*', authenticate({        // API key auth
  required: false,                     // Auth optional for reads, required for writes
  headerName: 'X-API-Key',
}));

// Write endpoints require authentication:
app.post('/v1/failures', requireAuth);
app.patch('/v1/failures/:id/verify', requireAuth);
```

### Authentication

- API key-based authentication via `X-API-Key` header
- Read endpoints (GET) are publicly accessible (no auth required)
- Write endpoints (POST, PATCH) require a valid API key
- API keys are stored in SQLite `api_keys` table with scopes
- Rate limiting is per-key for authenticated requests, per-IP for anonymous

---

## MCP SERVER TOOLS (packages/failsafe-mcp/)

Expose these 5 MCP tools using `@modelcontextprotocol/sdk` with **stdio transport**:

### Tool 1: `failsafe_check_risk`

**Description:** Check a query for known AI failure risks BEFORE sending it to a model. Returns risk level, matched patterns, and recommendations. Call this proactively when handling high-stakes queries (medical, legal, financial).

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The query/prompt to check for known failure risks"
    },
    "domain": {
      "type": "string",
      "enum": ["legal", "medical", "financial", "coding", "education", "general", "scientific", "creative"],
      "description": "The domain context (affects risk scoring)"
    },
    "model": {
      "type": "string",
      "description": "The model that will process this query (for model-specific risk)"
    }
  },
  "required": ["query"]
}
```

**Returns:** RiskSignal with risk level, score, matched patterns, and recommendations.

### Tool 2: `failsafe_report_failure`

**Description:** Report an AI failure you observed. Provide the query, the AI's incorrect response, and what went wrong. Reports are anonymized automatically and deduplicated.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The prompt/query that was sent to the AI"
    },
    "response": {
      "type": "string",
      "description": "The AI's actual (incorrect) response"
    },
    "groundTruth": {
      "type": "string",
      "description": "The correct answer or expected response"
    },
    "explanation": {
      "type": "string",
      "description": "Why this response is wrong — what the failure is"
    },
    "failureType": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "enum": ["hallucination", "reasoning_error", "instruction_violation", "context_error", "tool_action_error", "output_quality"]
        },
        "subtype": {
          "type": "string",
          "description": "Specific subtype within the category"
        }
      },
      "required": ["category", "subtype"]
    },
    "domain": {
      "type": "string",
      "enum": ["legal", "medical", "financial", "coding", "education", "general", "scientific", "creative"]
    },
    "model": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "provider": { "type": "string" },
        "version": { "type": "string" }
      },
      "required": ["name", "provider"]
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["query", "response", "explanation", "failureType", "domain", "model"]
}
```

### Tool 3: `failsafe_search_failures`

**Description:** Search the failure database for known AI failures matching your query. Use to find out if a particular type of mistake has been reported before.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "Search query — searches across queries, responses, and explanations"
    },
    "category": {
      "type": "string",
      "enum": ["hallucination", "reasoning_error", "instruction_violation", "context_error", "tool_action_error", "output_quality"],
      "description": "Filter by failure category"
    },
    "domain": {
      "type": "string",
      "enum": ["legal", "medical", "financial", "coding", "education", "general", "scientific", "creative"],
      "description": "Filter by domain"
    },
    "severity": {
      "type": "string",
      "enum": ["critical", "high", "medium", "low", "informational"],
      "description": "Filter by minimum severity"
    },
    "model": {
      "type": "string",
      "description": "Filter by model name"
    },
    "limit": {
      "type": "number",
      "description": "Max results to return (default 10)"
    }
  },
  "required": ["query"]
}
```

### Tool 4: `failsafe_get_patterns`

**Description:** Get known failure patterns — recurring types of AI mistakes that have been observed across multiple reports. Use to understand systematic AI weaknesses.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["hallucination", "reasoning_error", "instruction_violation", "context_error", "tool_action_error", "output_quality"],
      "description": "Filter by failure category"
    },
    "domain": {
      "type": "string",
      "description": "Filter by affected domain"
    },
    "model": {
      "type": "string",
      "description": "Filter by affected model"
    },
    "limit": {
      "type": "number",
      "description": "Max patterns to return (default 10)"
    }
  }
}
```

### Tool 5: `failsafe_get_stats`

**Description:** Get statistics about AI failures — totals, breakdowns by category/severity/domain/model, and trends. Useful for understanding the landscape of AI failures.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "model": {
      "type": "string",
      "description": "Get stats for a specific model"
    },
    "domain": {
      "type": "string",
      "description": "Get stats for a specific domain"
    }
  }
}
```

---

## CLI SPECIFICATION (packages/failsafe-cli/)

```
Usage: failsafe <command> [options]

Commands:
  submit                    Submit a new AI failure report (interactive)
  check <query>             Check a query for known failure risks
  search <term>             Search the failure database
  patterns                  List known failure patterns
  stats                     Show failure statistics dashboard
  seed [file]               Load seed data into the database
  verify <id>               Verify or dispute a failure report

Options:
  --api <url>               API server URL (default: http://localhost:3747)
  --key <key>               API key for authentication
  --format <json|table|text> Output format (default: table)
  --domain <domain>         Filter by domain
  --category <category>     Filter by failure category
  --severity <severity>     Filter by severity
  --model <model>           Filter by model
  --config <path>           Config file (default: ~/.failsafe/config.json)
  --version                 Show version
  --help                    Show help
```

### Command Details

#### `failsafe submit`
Interactive failure report submission using inquirer prompts:
1. Prompt for query (multiline text input)
2. Prompt for AI response (multiline text input)
3. Prompt for ground truth (optional, multiline)
4. Prompt for explanation (multiline)
5. Select failure category (list selection)
6. Select failure subtype (list based on category)
7. Select domain (list selection)
8. Enter model name (text input with autocomplete from known models)
9. Enter model provider (text input with autocomplete)
10. Enter tags (comma-separated, optional)
11. Confirm and submit

Display: Severity (auto-calculated), fingerprint, duplicate check result.

#### `failsafe check <query>`
```
$ failsafe check "What medications interact with warfarin?" --domain medical

  Risk Level: HIGH (78/100)

  Matched Patterns:
  ┌──────────────────────────────────┬────────────┬─────────────────────────────────┐
  │ Pattern                          │ Confidence │ Explanation                     │
  ├──────────────────────────────────┼────────────┼─────────────────────────────────┤
  │ Drug Interaction Hallucination   │ 87%        │ Drug interaction queries freq…  │
  │ Medical Dosage Fabrication       │ 62%        │ Numerical hallucination risk…   │
  └──────────────────────────────────┴────────────┴─────────────────────────────────┘

  Recommendations:
  1. VERIFY: Cross-reference drug interactions with FDA database.
  2. HUMAN_REVIEW: Medical drug interaction queries should be reviewed by a pharmacist.
```

#### `failsafe search <term>`
Full-text search with colored, formatted output showing matching reports.

#### `failsafe patterns`
Table view of known failure patterns with occurrence counts, severity, and affected models.

#### `failsafe stats`
Dashboard using `boxen` showing:
- Total reports, patterns, contributors
- Breakdown by category (bar chart using Unicode blocks)
- Breakdown by severity
- Top 5 models by failure count
- Top 5 domains by failure count
- Recent reports (last 5)

#### `failsafe seed [file]`
Load seed data from `seed-data/` directory or a specific file. Shows progress bar and summary.

#### `failsafe verify <id>`
Interactive verification:
1. Display the full failure report
2. Ask: Verify, Dispute, or Retract?
3. Prompt for notes
4. Submit verification

Use: `commander` (CLI parsing), `chalk` (colors), `cli-table3` (tables), `boxen` (dashboard), `inquirer` (interactive prompts), `ora` (spinners).

---

## TypeScript SDK (packages/failsafe-sdk/)

### FailSafeClient

```typescript
/**
 * HTTP client for the FailSafe API. Provides typed methods for all endpoints.
 */
class FailSafeClient {
  constructor(options: ClientOptions);

  // === Failure Reports ===
  submit(input: CreateFailureReportInput): Promise<FailureReport>;
  getReport(id: string): Promise<FailureReport>;
  listReports(filter?: FailureFilter): Promise<PaginatedResult<FailureReport>>;
  verify(id: string, status: VerificationStatus, notes?: string): Promise<FailureReport>;

  // === Risk Checking ===
  check(query: string, domain?: Domain, model?: string): Promise<RiskSignal>;

  // === Search ===
  search(query: string, filter?: Partial<FailureFilter>): Promise<PaginatedResult<FailureReport>>;

  // === Patterns ===
  getPatterns(filter?: PatternFilter): Promise<PaginatedResult<FailurePattern>>;
  getPattern(id: string): Promise<FailurePattern>;

  // === Statistics ===
  getStats(): Promise<FailureStats>;
  getModelStats(model: string): Promise<ModelStats>;
  getDomainStats(domain: Domain): Promise<DomainStats>;

  // === Health ===
  health(): Promise<HealthResponse>;
}

interface ClientOptions {
  baseUrl: string;                     // Default: "http://localhost:3747"
  apiKey?: string;
  timeout?: number;                    // Default: 30000ms
  retries?: number;                    // Default: 3
}
```

### FailSafeMiddleware

```typescript
/**
 * Middleware that wraps AI calls with automatic failure checking and reporting.
 * Works with any async function that takes a string input and returns a string output.
 */
class FailSafeMiddleware {
  constructor(client: FailSafeClient, options?: MiddlewareOptions);

  /**
   * Wrap an AI function with pre-flight risk checking.
   * Returns the original response plus risk annotations.
   */
  wrap<T>(fn: (input: string) => Promise<T>): (input: string) => Promise<WrappedResponse<T>>;

  /**
   * Check a query and annotate the response with risk information.
   * Does NOT block — just adds metadata.
   */
  checkAndAnnotate(query: string, response: string, domain?: Domain): Promise<AnnotatedResponse>;
}

interface MiddlewareOptions {
  domain?: Domain;
  model?: ModelInfo;
  autoCheck?: boolean;                 // Check risk before every call (default: true)
  autoReport?: boolean;                // Auto-report detected failures (default: false)
  blockHighRisk?: boolean;             // Block queries with risk >= threshold (default: false)
  riskThreshold?: number;              // Risk score threshold for blocking (default: 80)
}

interface WrappedResponse<T> {
  response: T;
  riskSignal?: RiskSignal;
  blocked: boolean;
  processingTimeMs: number;
}

interface AnnotatedResponse {
  query: string;
  response: string;
  riskSignal: RiskSignal;
  annotations: string[];               // Human-readable warnings
}
```

### Interceptor

```typescript
/**
 * Response interceptor that watches AI responses for signs of known failure
 * patterns and auto-reports or warns.
 */
class FailSafeInterceptor {
  constructor(client: FailSafeClient, patterns: FailurePattern[]);

  /**
   * Intercept and analyze an AI response.
   */
  intercept(query: string, response: string, domain?: Domain): InterceptResult;

  /**
   * Refresh patterns from the API.
   */
  refreshPatterns(): Promise<void>;
}

interface InterceptResult {
  flagged: boolean;
  matchedPatterns: MatchedPattern[];
  riskLevel: RiskLevel;
  suggestions: string[];
}
```

### Reporter

```typescript
/**
 * Simplified failure reporting helpers for quick integration.
 */

function reportFailure(client: FailSafeClient, input: QuickReportInput): Promise<FailureReport>;
function reportHallucination(client: FailSafeClient, query: string, response: string, explanation: string, model: ModelInfo): Promise<FailureReport>;
function reportReasoningError(client: FailSafeClient, query: string, response: string, explanation: string, model: ModelInfo): Promise<FailureReport>;

interface QuickReportInput {
  query: string;
  response: string;
  explanation: string;
  category: FailureCategory;
  subtype: FailureSubtype;
  domain?: Domain;
  model?: ModelInfo;
}
```

---

## PYTHON SDK (packages/failsafe-py/)

### pyproject.toml

```toml
[project]
name = "failsafe-ai"
version = "0.1.0"
description = "FailSafe Python SDK — Collective AI failure intelligence"
readme = "README.md"
requires-python = ">=3.9"
license = {text = "MIT"}
authors = [
  {name = "Abtin", email = "abtin@openclaw.io"}
]
keywords = ["ai", "failures", "hallucination", "safety", "llm", "mcp"]
classifiers = [
  "Development Status :: 3 - Alpha",
  "Intended Audience :: Developers",
  "License :: OSI Approved :: MIT License",
  "Programming Language :: Python :: 3",
  "Programming Language :: Python :: 3.9",
  "Programming Language :: Python :: 3.10",
  "Programming Language :: Python :: 3.11",
  "Programming Language :: Python :: 3.12",
  "Topic :: Scientific/Engineering :: Artificial Intelligence",
]
dependencies = [
  "pydantic>=2.0",
  "httpx>=0.24",
  "jsonschema>=4.0",
]

[project.optional-dependencies]
dev = [
  "pytest>=7.0",
  "pytest-asyncio>=0.21",
  "ruff>=0.1.0",
  "pytest-cov>=4.0",
]
langchain = ["langchain>=0.1.0"]
crewai = ["crewai>=0.1.0"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
target-version = "py39"
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"
```

### Python API — Mirror TypeScript exactly

```python
# failsafe/__init__.py
from failsafe.types import (
    FailureReport, FailurePattern, RiskSignal, FailureType,
    Severity, Domain, ModelInfo, VerificationStatus,
    RiskLevel, Recommendation, Contributor, Badge,
    FailureCategory, FailureFilter, FailureStats,
    ModelStats, DomainStats, MatchedPattern,
)
from failsafe.client import FailSafeClient
from failsafe.report import create_failure_report, anonymize_report
from failsafe.pattern import PatternMatcher
from failsafe.scorer import calculate_severity_score, calculate_risk_level
from failsafe.taxonomy import (
    get_default_severity, is_high_stakes_domain,
    adjust_severity_for_domain, get_subtypes_for_category,
)

__all__ = [
    "FailSafeClient",
    "FailureReport", "FailurePattern", "RiskSignal", "FailureType",
    "Severity", "Domain", "ModelInfo", "VerificationStatus",
    "RiskLevel", "Recommendation", "Contributor", "Badge",
    "FailureCategory", "FailureFilter", "FailureStats",
    "ModelStats", "DomainStats", "MatchedPattern",
    "create_failure_report", "anonymize_report",
    "PatternMatcher",
    "calculate_severity_score", "calculate_risk_level",
    "get_default_severity", "is_high_stakes_domain",
    "adjust_severity_for_domain", "get_subtypes_for_category",
]
```

```python
# failsafe/types.py — Pydantic models for ALL types
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from enum import Enum

class FailureCategory(str, Enum):
    HALLUCINATION = "hallucination"
    REASONING_ERROR = "reasoning_error"
    INSTRUCTION_VIOLATION = "instruction_violation"
    CONTEXT_ERROR = "context_error"
    TOOL_ACTION_ERROR = "tool_action_error"
    OUTPUT_QUALITY = "output_quality"

class Severity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFORMATIONAL = "informational"

class Domain(str, Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    FINANCIAL = "financial"
    CODING = "coding"
    EDUCATION = "education"
    GENERAL = "general"
    SCIENTIFIC = "scientific"
    CREATIVE = "creative"

class RiskLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    MINIMAL = "minimal"

class VerificationStatus(str, Enum):
    UNVERIFIED = "unverified"
    VERIFIED = "verified"
    DISPUTED = "disputed"
    RETRACTED = "retracted"

class Badge(str, Enum):
    FIRST_REPORT = "first_report"
    VERIFIED_10 = "verified_10"
    DOMAIN_EXPERT = "domain_expert"
    PATTERN_FINDER = "pattern_finder"
    TOP_CONTRIBUTOR = "top_contributor"

class RecommendationType(str, Enum):
    VERIFY = "verify"
    ADD_CONTEXT = "add_context"
    USE_TOOL = "use_tool"
    HUMAN_REVIEW = "human_review"
    REPHRASE = "rephrase"

class FailureType(BaseModel):
    category: FailureCategory
    subtype: str

class ModelInfo(BaseModel):
    name: str
    provider: str
    version: Optional[str] = None

class FailureReport(BaseModel):
    id: str = Field(pattern=r"^fail_[a-zA-Z0-9]+$")
    query: str
    response: str
    ground_truth: Optional[str] = None
    explanation: str
    failure_type: FailureType
    severity: Severity
    severity_score: int = Field(ge=0, le=100)
    domain: Domain
    model: ModelInfo
    tags: Optional[list[str]] = None
    verification_status: VerificationStatus = VerificationStatus.UNVERIFIED
    reported_by: Optional[str] = None
    verified_by: Optional[str] = None
    anonymized: bool = False
    fingerprint: str
    created_at: str
    updated_at: str
    metadata: Optional[dict] = None

class MatchedPattern(BaseModel):
    pattern_id: str
    pattern_name: str
    confidence: float = Field(ge=0.0, le=1.0)
    explanation: str

class Recommendation(BaseModel):
    type: RecommendationType
    description: str
    priority: int

class FailurePattern(BaseModel):
    id: str = Field(pattern=r"^pat_[a-zA-Z0-9]+$")
    name: str
    description: str
    failure_type: FailureType
    occurrence_count: int
    example_report_ids: list[str]
    detection_heuristics: list[str]
    affected_models: list[str]
    affected_domains: list[Domain]
    severity: Severity
    first_seen: str
    last_seen: str
    metadata: Optional[dict] = None

class RiskSignal(BaseModel):
    id: str = Field(pattern=r"^risk_[a-zA-Z0-9]+$")
    query: str
    risk_level: RiskLevel
    risk_score: int = Field(ge=0, le=100)
    matched_patterns: list[MatchedPattern]
    recommendations: list[Recommendation]
    timestamp: str

# ... Contributor, FailureStats, ModelStats, DomainStats, etc.
```

```python
# failsafe/client.py — HTTP client
import httpx
from failsafe.types import *

class FailSafeClient:
    def __init__(
        self,
        base_url: str = "http://localhost:3747",
        api_key: Optional[str] = None,
        timeout: float = 30.0,
    ):
        ...

    async def submit(self, input: CreateFailureReportInput) -> FailureReport: ...
    async def get_report(self, id: str) -> FailureReport: ...
    async def list_reports(self, filter: Optional[FailureFilter] = None) -> PaginatedResult[FailureReport]: ...
    async def verify(self, id: str, status: VerificationStatus, notes: Optional[str] = None) -> FailureReport: ...
    async def check(self, query: str, domain: Optional[Domain] = None, model: Optional[str] = None) -> RiskSignal: ...
    async def search(self, query: str, **filters) -> PaginatedResult[FailureReport]: ...
    async def get_patterns(self, **filters) -> PaginatedResult[FailurePattern]: ...
    async def get_pattern(self, id: str) -> FailurePattern: ...
    async def get_stats(self) -> FailureStats: ...
    async def get_model_stats(self, model: str) -> ModelStats: ...
    async def get_domain_stats(self, domain: Domain) -> DomainStats: ...
    async def health(self) -> dict: ...

    # Synchronous wrappers
    def submit_sync(self, input: CreateFailureReportInput) -> FailureReport: ...
    def check_sync(self, query: str, domain: Optional[Domain] = None) -> RiskSignal: ...
    def search_sync(self, query: str, **filters) -> PaginatedResult[FailureReport]: ...
```

```python
# failsafe/middleware.py — LangChain / CrewAI middleware

class FailSafeMiddleware:
    """Wrap AI calls with automatic failure checking."""

    def __init__(self, client: FailSafeClient, domain: Optional[Domain] = None, model: Optional[ModelInfo] = None):
        ...

    async def check_and_annotate(self, query: str, response: str) -> AnnotatedResponse:
        """Check a query/response pair against known failure patterns."""
        ...

    def wrap_langchain(self, llm):
        """Wrap a LangChain LLM with FailSafe middleware."""
        ...

    def wrap_crewai(self, agent):
        """Wrap a CrewAI agent with FailSafe middleware."""
        ...
```

---

## PACKAGE CONFIGURATIONS

### Monorepo: pnpm workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

### Root package.json

```json
{
  "name": "failsafe",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "dev:api": "pnpm --filter @failsafe/api dev"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### tsconfig.base.json (shared)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

### failsafe-core/package.json

```json
{
  "name": "@failsafe/core",
  "version": "0.1.0",
  "description": "FailSafe core library — AI failure taxonomy, pattern matching, and risk assessment",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "keywords": ["ai", "failure", "hallucination", "safety", "taxonomy", "risk", "pattern-matching"],
  "license": "MIT",
  "dependencies": {
    "ajv": "^8.12.0",
    "nanoid": "^5.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "eslint": "^8.50.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```

### failsafe-api/package.json

```json
{
  "name": "@failsafe/api",
  "version": "0.1.0",
  "description": "FailSafe REST API server — failure intelligence endpoint",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsup src/index.ts --format cjs --dts",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "license": "MIT",
  "dependencies": {
    "@failsafe/core": "workspace:*",
    "hono": "^4.0.0",
    "@hono/node-server": "^1.0.0",
    "better-sqlite3": "^11.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@types/better-sqlite3": "^7.0.0"
  }
}
```

### failsafe-sdk/package.json

```json
{
  "name": "@failsafe/sdk",
  "version": "0.1.0",
  "description": "FailSafe TypeScript SDK — check, report, and search AI failures",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "license": "MIT",
  "dependencies": {
    "@failsafe/core": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

### failsafe-mcp/package.json

```json
{
  "name": "@failsafe/mcp-server",
  "version": "0.1.0",
  "description": "FailSafe MCP server — expose failure intelligence to AI agents",
  "bin": {
    "failsafe-mcp": "dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs --dts",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts",
    "test": "vitest run"
  },
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@failsafe/core": "workspace:*",
    "better-sqlite3": "^11.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

### failsafe-cli/package.json

```json
{
  "name": "failsafe",
  "version": "0.1.0",
  "description": "FailSafe CLI — report, check, and search AI failures from the command line",
  "bin": {
    "failsafe": "dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs",
    "dev": "tsx src/index.ts",
    "test": "vitest run"
  },
  "license": "MIT",
  "dependencies": {
    "@failsafe/core": "workspace:*",
    "@failsafe/sdk": "workspace:*",
    "commander": "^12.0.0",
    "chalk": "^5.3.0",
    "cli-table3": "^0.6.0",
    "boxen": "^7.0.0",
    "inquirer": "^9.0.0",
    "ora": "^7.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

---

## JSON SCHEMAS (spec/schema/)

Create full JSON Schema draft-2020-12 for:

### failure-report.schema.json

- `id`: pattern `^fail_[a-zA-Z0-9]+$`, required
- `query`: string, minLength 1, required
- `response`: string, minLength 1, required
- `groundTruth`: string, optional
- `explanation`: string, minLength 10, required
- `failureType`: object with `category` (enum of 6 categories) and `subtype` (string), required
- `severity`: enum of 5 levels, required
- `severityScore`: integer 0-100, required
- `domain`: enum of 8 domains, required
- `model`: object with `name` (required), `provider` (required), `version` (optional)
- `tags`: array of strings, optional
- `verificationStatus`: enum of 4 statuses, required
- `reportedBy`: string, optional
- `verifiedBy`: string, optional
- `anonymized`: boolean, required
- `fingerprint`: string, minLength 8, required
- `createdAt`: ISO 8601 datetime format, required
- `updatedAt`: ISO 8601 datetime format, required
- `metadata`: object, optional

### failure-pattern.schema.json

- `id`: pattern `^pat_[a-zA-Z0-9]+$`, required
- `name`: string, required
- `description`: string, required
- `failureType`: same as above, required
- `occurrenceCount`: integer >= 0, required
- `exampleReportIds`: array of strings, required
- `detectionHeuristics`: array of strings, required
- `affectedModels`: array of strings, required
- `affectedDomains`: array of domain enums, required
- `severity`: enum, required
- `firstSeen`: ISO 8601, required
- `lastSeen`: ISO 8601, required
- `metadata`: object, optional

### risk-signal.schema.json

- `id`: pattern `^risk_[a-zA-Z0-9]+$`, required
- `query`: string, required
- `riskLevel`: enum of 5 levels, required
- `riskScore`: integer 0-100, required
- `matchedPatterns`: array of MatchedPattern objects, required
- `recommendations`: array of Recommendation objects, required
- `timestamp`: ISO 8601, required

### contributor.schema.json

- `id`: pattern `^contrib_[a-zA-Z0-9]+$`, required
- `name`: string, optional
- `reportsSubmitted`: integer >= 0, required
- `reportsVerified`: integer >= 0, required
- `reputation`: integer 0-100, required
- `badges`: array of badge enums, required
- `joinedAt`: ISO 8601, required

---

## SEED DATA (seed-data/)

### Requirements

Each seed data file must contain an array of FailureReport objects that validate against the schema.

**Counts:**
- `legal-hallucinations.json` — 50 reports
- `medical-errors.json` — 50 reports
- `financial-errors.json` — 50 reports
- `coding-errors.json` — 50 reports
- `factual-hallucinations.json` — 100 reports
- `reasoning-errors.json` — 50 reports
- `temporal-errors.json` — 50 reports

**Total: 400 seed failure reports**

**Quality requirements:**
- Each report must be realistic and plausible — representing real categories of AI mistakes
- Every report must have all required fields: id, query, response, explanation, failureType, severity, severityScore, domain, model, verificationStatus, anonymized, fingerprint, createdAt, updatedAt
- Distribute across multiple models (GPT-4, GPT-3.5, Claude 3, Gemini Pro, Llama 3, Mistral, etc.)
- Include a variety of subtypes within each file
- Ground truth should be provided where applicable
- Severity scores must match the severity level ranges
- Fingerprints must be unique per report
- Timestamps should span 2024-2026

**Content guidelines:**
- Legal: fabricated case citations, misquoted statutes, wrong jurisdictions, incorrect precedent
- Medical: wrong drug interactions, fabricated studies, incorrect dosages, misattributed symptoms
- Financial: wrong stock data, fabricated financial ratios, incorrect regulatory citations, wrong tax rules
- Coding: incorrect API usage, security vulnerabilities in generated code, wrong library versions, logic errors
- Factual: wrong historical facts, fabricated quotes, incorrect geography, wrong scientific claims
- Reasoning: mathematical errors, logical fallacies, statistical misinterpretations, flawed analogies
- Temporal: future events as past, wrong dates for historical events, anachronistic references, version confusion

---

## EXAMPLE FAILURE REPORTS (spec/examples/)

Create 10 detailed example reports, one highlighting each major failure subcategory:

1. **factual-hallucination.json** — Model states a false fact (e.g., wrong capital city, wrong discovery attribution)
2. **citation-hallucination.json** — Model invents a research paper or legal case
3. **numerical-hallucination.json** — Model fabricates a statistic or miscalculates
4. **temporal-hallucination.json** — Model gets a date wrong or confuses timelines
5. **logical-reasoning-error.json** — Model makes a logical fallacy
6. **mathematical-reasoning-error.json** — Model gets arithmetic or math wrong
7. **safety-instruction-violation.json** — Model generates content violating safety guidelines
8. **format-instruction-violation.json** — Model ignores explicit format instructions
9. **wrong-tool-action-error.json** — Agent uses the wrong tool for a task
10. **harmful-output-quality.json** — Model produces output that could cause real harm

Each example must be a fully valid FailureReport with all fields populated.

---

## CI/CD (.github/workflows/)

### ci.yml

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  typescript:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

  python:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      - working-directory: packages/failsafe-py
        run: |
          pip install -e ".[dev]"
          ruff check .
          pytest --cov=failsafe --cov-report=xml
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-python
          path: packages/failsafe-py/coverage.xml
```

### publish-npm.yml

- Trigger: git tag `v*`
- Build all packages, publish @failsafe/core, @failsafe/api, @failsafe/sdk, @failsafe/mcp-server, failsafe (CLI) to npm with `--access public`
- Publish in dependency order: core first, then api/sdk/mcp/cli
- Requires NPM_TOKEN secret

### publish-pypi.yml

- Trigger: git tag `v*`
- Build and publish failsafe-ai to PyPI using hatch
- Requires PYPI_TOKEN secret

---

## TESTING REQUIREMENTS

### Unit Tests — Every public method in every module

- **taxonomy.test.ts** — All helper functions, category/subtype lookups, severity adjustments, domain multipliers, invalid inputs
- **failure-report.test.ts** — Creation, validation, anonymization, fingerprinting, severity calculation, serialization round-trip
- **pattern.test.ts** — Creation, matching, occurrence tracking, serialization
- **risk-signal.test.ts** — Creation from matched patterns, risk calculation, recommendations
- **matcher.test.ts** — Pattern matching, TF-IDF similarity, risk checking, new pattern detection, edge cases (empty corpus, single word queries, very long texts)
- **anonymizer.test.ts** — Email detection, phone detection, SSN detection, credit card detection, IP detection, URL token detection, name heuristics, no false positives on clean text, nested PII, multiple PII types in same text
- **fingerprint.test.ts** — Deterministic hashing, duplicate detection, similarity scoring, clustering, threshold sensitivity
- **scoring.test.ts** — All severity score ranges, all risk level ranges, domain multipliers, confidence calculation, edge values (0, 100)
- **validation.test.ts** — Valid reports pass, invalid reports fail with specific errors, partial reports, extra fields, wrong types

### Integration Tests

- Full workflow: create report -> anonymize -> fingerprint -> check duplicate -> submit via API -> search -> verify
- Risk check workflow: load patterns -> check query -> get recommendations -> verify risk levels
- Seed data loading: load all seed files -> validate -> check stats
- API endpoint chaining: submit 10 reports -> list with filters -> search -> get stats -> verify one

### Edge Cases

- Empty strings for query/response
- Very long text (100K+ characters)
- Unicode/emoji in failure reports
- All optional fields omitted
- All optional fields populated
- Duplicate report detection with near-identical but slightly different text
- PII detection with adversarial inputs (PII inside code blocks, PII in URLs)
- Pattern matching with zero patterns loaded
- Statistics with zero reports
- Concurrent report submissions (race conditions)

### Fixtures

- `valid-report.json` — Complete valid failure report
- `valid-pattern.json` — Complete valid failure pattern
- `invalid-report.json` — Report with multiple schema violations
- `duplicate-reports.json` — Array of near-duplicate reports for dedup testing
- `pii-samples.json` — Text samples with various PII types
- `cluster-reports.json` — Reports that should cluster into 3 groups

### Coverage

- Minimum 80% code coverage per package
- Track and report coverage in CI
- Coverage reports uploaded as CI artifacts

---

## MANIFESTO BLOG POST (website/blog/manifesto.md)

Write 2500-3500 words. Title: **"Every AI Makes the Same Mistakes. Until Now."**

### Structure

1. **The Same Mistake, Everywhere** (500w)
   Open with 3 concrete AI failure stories: a lawyer sanctioned for citing fabricated cases from ChatGPT, a medical chatbot recommending dangerous drug combinations, a financial advisor tool giving wrong tax advice. These are not edge cases. They are the SAME types of mistakes, happening to DIFFERENT people, using DIFFERENT tools, over and over. No one is learning from anyone else's failures.

2. **The Missing Feedback Loop** (400w)
   When a vulnerability is found in software, it gets a CVE number, goes into a database, and every security tool in the world learns about it within hours. AI failures have no equivalent. Each AI tool fails in isolation. A hallucination discovered by one user on Monday will be repeated by a different model for a different user on Tuesday. The failure data exists — in screenshots, in tweets, in incident reports — but it is scattered, unstructured, and machine-unreadable.

3. **Introducing Collective Failure Intelligence** (500w)
   Define the concept: a shared, structured, machine-readable database of AI failures that any AI tool can query. Every time an AI fails and the failure is reported, that knowledge becomes available to every connected tool. Introduce the taxonomy: 6 categories, 30+ subtypes, severity scoring, domain-aware risk assessment. This is not about pointing fingers at models. This is about building the immune system that AI currently lacks.

4. **How It Works** (600w)
   Code examples showing the three key workflows:
   - **Report**: After observing an AI mistake, report it with structured metadata
   - **Check**: Before sending a high-stakes query, check it against known failure patterns
   - **Search**: Look up what failures have been observed for a given topic/model/domain
   Include TypeScript SDK and CLI examples. Show the MCP integration.

5. **The Network Effect** (300w)
   Every failure report makes the system smarter. Every connected tool makes every other tool safer. A hallucination caught by a legal AI in New York protects a medical AI in Tokyo. The more tools connect, the faster we close the feedback loop. Quantify: with 400 seed failures covering 7 domains, we already detect risk signals for X% of high-stakes queries.

6. **The Architecture** (400w)
   Open-source core library. REST API. MCP server. TypeScript and Python SDKs. CLI. File-based or SQLite storage. Deploys anywhere: laptop, server, Cloudflare Workers. Designed for sovereignty — you own your data, run your instance, contribute what you choose. Part of the OpenClaw ecosystem for sovereign AI agents.

7. **What We Need From You** (300w)
   - Star the repo (github.com/AbtinDev/failsafe)
   - Report a failure you have observed
   - Connect your first tool via MCP
   - Help build the taxonomy — are we missing categories?
   - Join the Discord
   - If you run an AI company: integrate the SDK and contribute failures back to the commons

**Tone:** Cybersecurity thought leadership. Serious, data-driven, urgent but not alarmist. Think Krebs on Security meets Stripe engineering blog. Concrete numbers, specific examples, zero fluff. Every sentence earns its place.

---

## IMPLEMENTATION ORDER

Build in this exact sequence. Each step depends on the previous ones.

1. **spec/schema/** — JSON Schemas first (they define all data shapes)
2. **spec/taxonomy/** — Failure taxonomy document and severity matrix
3. **spec/examples/** — 10 example failure reports (validate against schemas)
4. **seed-data/** — All 7 seed data files (validate against schemas)
5. **packages/failsafe-core/src/types.ts** -> `utils.ts` -> `taxonomy.ts` -> `scoring.ts` -> `anonymizer.ts` -> `fingerprint.ts` -> `failure-report.ts` -> `pattern.ts` -> `matcher.ts` -> `risk-signal.ts` -> `validation.ts` -> `serialization.ts` -> `index.ts`
6. **Tests for failsafe-core** — All unit tests, fixtures, 80%+ coverage
7. **packages/failsafe-api/** — Hono server, SQLite schema, all routes, all middleware, all services
8. **Tests for failsafe-api** — Route tests, service tests, storage tests
9. **packages/failsafe-sdk/** — Client, middleware, interceptor, reporter
10. **packages/failsafe-mcp/** — MCP server with 5 tools
11. **packages/failsafe-cli/** — CLI with all commands
12. **packages/failsafe-py/** — Python SDK mirroring TypeScript API
13. **examples/** — Integration examples (LangChain, CrewAI, Claude Desktop, Cloudflare Worker)
14. **website/** — Landing page + docs + manifesto blog post
15. **.github/workflows/** — CI/CD pipelines
16. **Root README.md, CONTRIBUTING.md, CHANGELOG.md**

---

## IMPORTANT CONTEXT

- **GitHub:** github.com/AbtinDev/failsafe
- **Ecosystem:** Part of the OpenClaw ecosystem (sovereign AI agents on client infrastructure), alongside GoalOS (intent layer) and AgentSpec (behavioral contracts)
- **Target audience:** AI developers, AI safety researchers, teams deploying AI in production, especially in high-stakes domains (legal, medical, financial)
- **Primary demo:** MCP server integrated with Claude Desktop — an AI agent that checks FailSafe before answering high-stakes questions
- **Keep dependencies minimal** — lightweight and fast. The core library should have ZERO heavy dependencies beyond ajv and nanoid.
- **Sovereignty:** Users OWN their failure data. Everything runs locally by default. Contributing to the shared database is opt-in.
- **Privacy:** All failure reports MUST be anonymized before storage. PII detection is mandatory, not optional.
- **Default API port:** 3747 (like FAIL on a phone keypad, sort of)
- **Spec must be extensible** — the metadata field on every object allows domain-specific extensions without spec changes
- **All code must be production-quality:** proper error handling, input validation, TypeScript strict mode, comprehensive JSDoc comments, no `any` types, no uncaught promise rejections
