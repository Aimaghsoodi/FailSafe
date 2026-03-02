# Cloudflare Workers + FailSafe

Deploy FailSafe failure API on Cloudflare Workers.

## What This Does

- REST API for failure reporting
- Query failure database
- Pattern analysis at the edge
- Integrate with any application

## Installation

```bash
cd examples/cloudflare-worker
npm install
wrangler deploy
```

## API Endpoints

```bash
GET /api/failures - List failures
GET /api/failures/:id - Get failure details
POST /api/failures - Report new failure
GET /api/patterns - Get common patterns
GET /api/analytics - Get statistics
```

## Usage

```bash
curl https://your-worker.workers.dev/api/failures
curl -X POST https://your-worker.workers.dev/api/failures \
  -d '{"type":"hallucination","description":"..."}'
```

## Configuration

Edit `wrangler.toml` with your Cloudflare credentials.

## See Also

- Wrangler: https://developers.cloudflare.com/workers/
- Implementation: `src/index.ts`
