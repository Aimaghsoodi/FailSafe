# @failsafe/api

REST API server for FailSafe - expose failure management and risk detection via HTTP.

## What is @failsafe/api?

A production-ready REST API for submitting, querying, and analyzing failure reports from any system or language. Includes authentication, rate limiting, and full audit trails.

## Installation

npm install -g @failsafe/api

## Quick Start

Start the server:

failsafe-api --port 3000 --db ./failures.db

Or with environment variables:

export FAILSAFE_PORT=3000
export FAILSAFE_DB=./failures.db
failsafe-api

## API Endpoints

POST /api/failures - Report new failure

{
  "title": "Model timeout",
  "description": "Claude exceeded timeout limit",
  "severity": "high",
  "systemId": "my-system",
  "agentId": "claude",
  "failureCategory": "timeout",
  "context": { "timeoutMs": 300000 }
}

Response:

{
  "id": "fail_abc123",
  "fingerprint": "sha256...",
  "timestamp": "2024-03-01T12:00:00Z",
  "isDuplicate": false
}

GET /api/failures - List failures

Query params:
  systemId - Filter by system
  severity - Filter by severity (critical, high, medium, low)
  category - Filter by failure category
  limit - Results per page (default 20)
  offset - Pagination offset
  after - ISO timestamp, only failures after this time

GET /api/failures/:id - Get failure details

Returns full failure report with all context.

GET /api/systems - List all systems with failure stats

GET /api/systems/:systemId - System statistics

{
  "systemId": "my-system",
  "totalFailures": 156,
  "criticalCount": 12,
  "highCount": 34,
  "byCategory": {
    "timeout": 45,
    "misunderstanding": 67,
    "reasoning_error": 44
  },
  "trend": "increasing"
}

GET /api/patterns - Analyze failure patterns

Query params:
  systemId - System to analyze
  timeRange - Time window (1h, 24h, 7d, 30d)

Returns:

{
  "patterns": [
    {
      "pattern": "timeout on complex queries",
      "frequency": 45,
      "affectedSystems": 3,
      "trend": "increasing",
      "preventionSignal": "Add query complexity limit"
    }
  ]
}

GET /api/taxonomy - Get failure taxonomy

Returns full failure taxonomy with categories and descriptions.

## Configuration

--port <port> - Server port (default 3000)
--db <path> - Database file path (required)
--host <host> - Bind address (default localhost)
--auth-key <key> - API key for authentication
--log-level <level> - Log level (debug, info, warn, error)

## Authentication

With auth-key set, include in all requests:

curl -H "X-API-Key: your-key" http://localhost:3000/api/failures

## Development

npm run dev - Development mode with hot reload
npm run build - Build for production
npm test - Run tests
npm run lint - Lint code

## Deployment

Docker:

docker build -t failsafe-api .
docker run -p 3000:3000 -v /data:/data failsafe-api

Environment:

FAILSAFE_PORT=3000
FAILSAFE_DB=/data/failures.db
FAILSAFE_NODE_ENV=production
FAILSAFE_LOG_LEVEL=info

## Performance

- Handles 1000+ reports/second
- Sub-100ms query response
- Automatic indexing
- Compression enabled

## Documentation

- Main README: ../../README.md
- Taxonomy: ../../spec/taxonomy/failure-taxonomy-v0.1.md
- Quickstart: ../../spec/failsafe-quickstart.md
- Full API Ref: ../../spec/failsafe-api-reference.md

## License

MIT - See LICENSE
