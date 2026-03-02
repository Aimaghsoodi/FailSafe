import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { defineTools } from './tools.js';
import { ToolHandlers, FailSafeStorage } from './handlers.js';

export function createServer(): { server: Server; storage: FailSafeStorage } {
  const server = new Server(
    {
      name: 'failsafe-mcp',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const storage = new FailSafeStorage();
  const handlers = new ToolHandlers(storage);
  const tools = defineTools();

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'failsafe_check_risk':
        return handlers.handleCheckRisk(args as any);

      case 'failsafe_report_failure':
        return handlers.handleReportFailure(args as any);

      case 'failsafe_search_failures':
        return handlers.handleSearchFailures(args as any);

      case 'failsafe_get_patterns':
        return handlers.handleGetPatterns(args as any);

      case 'failsafe_get_stats':
        return handlers.handleGetStats(args as any);

      default:
        return {
          content: [
            {
              type: 'text' as const,
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  });

  return { server, storage };
}

export async function startServer(): Promise<void> {
  const { server } = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
