/**
 * FailSafe API on Cloudflare Workers
 * Query and report AI failures
 */

import { FailureReport, FailurePattern } from '@failsafe/core';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/failures' && request.method === 'GET') {
      return handleListFailures(request, env);
    } else if (url.pathname.match(/^\/api\/failures\/[^/]+$/) && request.method === 'GET') {
      return handleGetFailure(request, env);
    } else if (url.pathname === '/api/failures' && request.method === 'POST') {
      return handleReportFailure(request, env);
    } else if (url.pathname === '/api/patterns' && request.method === 'GET') {
      return handleGetPatterns(request, env);
    } else if (url.pathname === '/api/analytics') {
      return handleGetAnalytics(request, env);
    } else if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }));
    } else {
      return jsonResponse({ error: 'Not found' }, 404);
    }
  }
};

interface Env {
  FAILSAFE_BUCKET?: R2Bucket;
}

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleListFailures(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const limit = parseInt(url.searchParams.get('limit') || '50');

  // In production, load from R2
  const failures = getFailures(env).slice(0, limit);

  return jsonResponse({
    count: failures.length,
    failures: failures
  });
}

async function handleGetFailure(request: Request, env: Env): Promise<Response> {
  const id = new URL(request.url).pathname.split('/')[3];
  const failures = getFailures(env);
  const failure = failures.find(f => f.id === id);

  if (!failure) {
    return jsonResponse({ error: 'Not found' }, 404);
  }

  return jsonResponse(failure);
}

async function handleReportFailure(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json() as any;
    
    const report: FailureReport = {
      id: Math.random().toString(36).substr(2, 9),
      type: data.type,
      description: data.description,
      timestamp: new Date().toISOString(),
      severity: data.severity || 'medium',
      context: data.context || {},
      fingerprint: data.fingerprint
    };

    // In production, save to R2/database
    return jsonResponse({
      success: true,
      report: report
    }, 201);
  } catch (error) {
    return jsonResponse({ error: String(error) }, 400);
  }
}

async function handleGetPatterns(request: Request, env: Env): Promise<Response> {
  const failures = getFailures(env);
  const patterns: Record<string, number> = {};

  for (const failure of failures) {
    patterns[failure.type] = (patterns[failure.type] || 0) + 1;
  }

  const sorted = Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return jsonResponse({
    patterns: Object.fromEntries(sorted)
  });
}

async function handleGetAnalytics(request: Request, env: Env): Promise<Response> {
  const failures = getFailures(env);
  const now = new Date();
  const week_ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const this_week = failures.filter(f => new Date(f.timestamp) > week_ago);

  return jsonResponse({
    total_failures: failures.length,
    failures_this_week: this_week.length,
    most_common_type: getMostCommon(failures, 'type'),
    most_severe: getMostCommon(failures, 'severity')
  });
}

function getFailures(env: Env): any[] {
  // Mock data for example
  return [
    {
      id: 'fail_001',
      type: 'hallucination',
      description: 'Model fabricated citation',
      timestamp: new Date().toISOString(),
      severity: 'high'
    }
  ];
}

function getMostCommon(items: any[], field: string): string {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item[field]] = (counts[item[field]] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';
}

interface FailureReport {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  severity: string;
  context: Record<string, any>;
  fingerprint?: string;
}
