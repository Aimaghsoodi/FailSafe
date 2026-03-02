import type {
  Tool,
  TextContent,
} from '@modelcontextprotocol/sdk/types';
import type {
  FailureReport,
  FailurePattern,
  RiskSignal,
  FailureStats,
} from '@failsafe/core';

export interface ToolDefinitions {
  tools: Tool[];
}

/**
 * Define all MCP tools for FailSafe
 */
export function defineTools(): Tool[] {
  return [
    {
      name: 'failsafe_check_risk',
      description: 'Check the risk level of a given input or scenario. Returns risk signals and analysis.',
      inputSchema: {
        type: 'object',
        properties: {
          input: {
            type: 'object',
            description: 'The input data to check for risk',
          },
          context: {
            type: 'object',
            description: 'Optional context about the operation',
          },
        },
        required: ['input'],
      },
    },
    {
      name: 'failsafe_report_failure',
      description: 'Report a failure to the FailSafe system with detailed information.',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'The type of failure (e.g., execution.crash, io.network_error)',
          },
          severity: {
            type: 'string',
            enum: ['critical', 'high', 'medium', 'low', 'info'],
            description: 'The severity of the failure',
          },
          domain: {
            type: 'string',
            enum: [
              'reasoning',
              'code-generation',
              'content-creation',
              'data-processing',
              'planning',
              'retrieval',
              'agent-orchestration',
              'security',
              'performance',
              'general',
            ],
            description: 'The domain where the failure occurred',
          },
          title: {
            type: 'string',
            description: 'Brief title of the failure',
          },
          description: {
            type: 'string',
            description: 'Detailed description of the failure',
          },
          errorMessage: {
            type: 'string',
            description: 'Error message if applicable',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags for categorizing the failure',
          },
        },
        required: ['type', 'severity', 'domain', 'title', 'description'],
      },
    },
    {
      name: 'failsafe_search_failures',
      description: 'Search for failure reports matching criteria.',
      inputSchema: {
        type: 'object',
        properties: {
          severities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Filter by severity levels',
          },
          domains: {
            type: 'array',
            items: { type: 'string' },
            description: 'Filter by domains',
          },
          types: {
            type: 'array',
            items: { type: 'string' },
            description: 'Filter by failure types',
          },
          search: {
            type: 'string',
            description: 'Free text search across titles and descriptions',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results to return',
          },
        },
      },
    },
    {
      name: 'failsafe_get_patterns',
      description: 'Get failure patterns that have been detected in the system.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of patterns to return',
          },
        },
      },
    },
    {
      name: 'failsafe_get_stats',
      description: 'Get statistics and aggregated data about failures.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ];
}

/**
 * Type definitions for tool arguments
 */
export interface CheckRiskInput {
  input: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface ReportFailureInput {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  domain: string;
  title: string;
  description: string;
  errorMessage?: string;
  tags?: string[];
}

export interface SearchFailuresInput {
  severities?: string[];
  domains?: string[];
  types?: string[];
  search?: string;
  limit?: number;
}

export interface GetPatternsInput {
  limit?: number;
}

export interface GetStatsInput {}

/**
 * Tool result types
 */
export interface ToolResult {
  content: TextContent[];
  isError?: boolean;
}
