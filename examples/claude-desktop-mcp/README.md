# Claude Desktop + FailSafe MCP

Connect FailSafe failure detection to Claude Desktop via MCP.

## What This Does

- Claude can query FailSafe failure database
- Check patterns before giving advice
- Report and learn from failures
- Build collective failure intelligence

## Prerequisites

- Claude Desktop
- FailSafe MCP server built
- FailSafe account or local database

## Setup

### 1. Build MCP Server

```bash
cd ../../packages/failsafe-mcp
npm build
```

### 2. Configure Claude Desktop

Edit Claude Desktop config:

```json
{
  "mcpServers": {
    "failsafe": {
      "command": "failsafe-mcp",
      "args": ["--storage", "file"]
    }
  }
}
```

### 3. Restart Claude

Restart Claude Desktop to load FailSafe tools.

## Available Tools

- `failsafe_get_context` - Failure landscape summary
- `failsafe_query_failures` - Search failures
- `failsafe_get_patterns` - Get common patterns
- `failsafe_report_failure` - Report new failure

## Usage

```
Claude, what are common AI failures in code generation?
Show me the most prevalent patterns in the database.
What safety violations have been reported this month?
```

Claude can now query collective AI failure intelligence.

## See Also

- Configuration: `claude_desktop_config.json`
- MCP Server: ../../packages/failsafe-mcp
