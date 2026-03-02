# @failsafe/mcp-server

Model Context Protocol server for FailSafe - expose failure tracking to AI agents.

## What is @failsafe/mcp-server?

An MCP server that gives AI agents the ability to report and query failures. Agents can log failures they encounter, track patterns, analyze root causes, and get prevention recommendations.

## Installation

npm install -g @failsafe/mcp-server

## Quick Start

Start the server:

failsafe-mcp --file ~/.failsafe/reports.json

## Claude Desktop Integration

Add to claude_desktop_config.json:

{
  "mcpServers": {
    "failsafe": {
      "command": "failsafe-mcp",
      "args": ["--file", "~/.failsafe/reports.json"]
    }
  }
}

## Tools

failsafe_report_failure
- Create new failure report
- Params: title, description, severity, systemId, agentId, failureCategory, context
- Returns: report ID and fingerprint

failsafe_list_failures
- Query failure reports
- Params: systemId, severity, category, limit, offset
- Returns: list of failure reports with stats

failsafe_get_failure
- Get specific failure report
- Params: reportId
- Returns: full report with context

failsafe_analyze_patterns
- Find common failure patterns
- Params: systemId, timeRange
- Returns: pattern analysis with frequency and trends

failsafe_get_prevention_signals
- Get signals to prevent failures
- Params: failureCategory
- Returns: prevention recommendations

failsafe_search
- Search failure descriptions and context
- Params: query, systemId
- Returns: matching failure reports

## Configuration

--file <path> - Reports database file (required)
--storage <file|sqlite> - Backend (default: file)

## Usage from Claude

Claude can now:

Ask: "Report that the model failed to understand the requirements"
Tool: failsafe_report_failure

Ask: "Show me recent failures in the system"
Tool: failsafe_list_failures

Ask: "What are common failure patterns?"
Tool: failsafe_analyze_patterns

Ask: "How can we prevent misunderstanding failures?"
Tool: failsafe_get_prevention_signals

## Development

npm run dev - Development mode
npm run build - Build
npm test - Test
npm run lint - Lint

## Documentation

- Main README: ../../README.md
- Taxonomy: ../../spec/taxonomy/failure-taxonomy-v0.1.md
- Quickstart: ../../spec/failsafe-quickstart.md

## License

MIT - See LICENSE
