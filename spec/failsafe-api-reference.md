# FailSafe API Reference

HTTP API for reporting and querying failures.

## Starting the Server

```bash
npm install -g @failsafe/api
failsafe-api serve --port 3000
```

## Endpoints

### POST /failures

Report a new failure.

```bash
curl -X POST http://localhost:3000/failures \
  -H "Content-Type: application/json" \
  -d '{
    "system": "assistant",
    "category": "hallucination",
    "severity": "high",
    "input": {"prompt": "Explain quantum computing"},
    "output": {"response": "..."},
    "failure": {
      "type": "factual_error",
      "description": "Provided false information",
      "user_affected": true
    },
    "analysis": {
      "root_cause": "Model hallucination",
      "pattern": "Common on niche topics"
    }
  }'
```

Response:
```json
{
  "id": "failure_abc123",
  "timestamp": "2024-03-01T12:00:00Z",
  "created": true
}
```

### GET /failures

Query failures.

```bash
# Get recent failures
curl http://localhost:3000/failures?limit=10&sort=-timestamp

# Filter by system
curl http://localhost:3000/failures?system=assistant

# Filter by severity
curl http://localhost:3000/failures?severity=high,critical

# Filter by category
curl http://localhost:3000/failures?category=hallucination

# Date range
curl http://localhost:3000/failures?from=2024-02-01&to=2024-03-01

# Search by pattern
curl http://localhost:3000/failures?pattern=factual_error
```

Response:
```json
{
  "total": 42,
  "failures": [
    {
      "id": "failure_xyz789",
      "system": "assistant",
      "category": "hallucination",
      "severity": "high",
      "timestamp": "2024-03-01T12:00:00Z",
      "description": "..."
    }
  ]
}
```

### GET /failures/:id

Get single failure with full details.

```bash
curl http://localhost:3000/failures/failure_abc123
```

### GET /stats

Get failure statistics.

```bash
curl http://localhost:3000/stats
```

Response:
```json
{
  "total": 156,
  "by_severity": {
    "critical": 5,
    "high": 18,
    "medium": 67,
    "low": 66
  },
  "by_category": {
    "hallucination": 45,
    "reasoning_error": 23,
    "factual_error": 38,
    ...
  },
  "by_system": {
    "assistant": 89,
    "analyzer": 45,
    "writer": 22
  },
  "trend": [
    {"date": "2024-02-27", "count": 12},
    {"date": "2024-02-28", "count": 15},
    {"date": "2024-03-01", "count": 10}
  ]
}
```

### GET /patterns

Get failure patterns.

```bash
curl http://localhost:3000/patterns

# Filter by frequency
curl "http://localhost:3000/patterns?min_occurrences=5"

# Get pattern details
curl http://localhost:3000/patterns/pattern_xyz
```

Response:
```json
{
  "patterns": [
    {
      "id": "pattern_xyz",
      "type": "factual_error",
      "occurrences": 12,
      "signals": [
        {"name": "confidence_high", "importance": "high"},
        {"name": "physics_domain", "importance": "high"}
      ],
      "related_failures": [...]
    }
  ]
}
```

### GET /export

Export all failures.

```bash
curl http://localhost:3000/export > failures.json

# Export as CSV
curl "http://localhost:3000/export?format=csv" > failures.csv

# Export date range
curl "http://localhost:3000/export?from=2024-02-01&to=2024-03-01" > monthly.json
```

### POST /analyze

Get analysis for a failure.

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "system": "assistant",
    "input": "...",
    "output": "...",
    "suspected_issue": "hallucination"
  }'
```

Response:
```json
{
  "analysis": {
    "likely_cause": "hallucination on niche topic",
    "confidence": 0.87,
    "similar_failures": 12,
    "prevention_signals": [...]
  }
}
```

### DELETE /failures/:id

Delete a failure (for privacy).

```bash
curl -X DELETE http://localhost:3000/failures/failure_abc123
```

## Authentication

Optional API key authentication:

```bash
# Start with auth required
failsafe-api serve --require-auth --api-key mykey123

# Use in requests
curl -H "X-API-Key: mykey123" http://localhost:3000/failures
```

## Rate Limiting

Default: 100 requests/minute per IP

```bash
# Start with custom limits
failsafe-api serve --rate-limit 1000
```

## SDK

Also use the SDK instead of HTTP:

```typescript
import { FailSafeAPI } from '@failsafe/api';

const api = new FailSafeAPI('http://localhost:3000');

// Report failure
await api.reportFailure({...});

// Query
const failures = await api.getFailures({ severity: 'high' });

// Statistics
const stats = await api.getStats();

// Export
await api.export('failures.json');
```
