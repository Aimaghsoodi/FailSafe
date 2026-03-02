# GoalOS Specification

The GoalOS Specification defines the data models, API contracts, and protocols for structured intent graphs that enable AI agents to understand and act on human goals, intentions, and priorities.

## What is an Intent Graph?

An **intent graph** is a machine-readable representation of what a human is trying to achieve. It's:

- **Not memory** — It doesn't store facts about a user
- **Not task management** — It's not a to-do list or issue tracker
- **The intent layer** — A structured, hierarchical representation of goals, their dependencies, priorities, and success criteria

An intent graph allows AI agents (Claude, custom tools, etc.) to:
- Understand the human's larger context and priorities
- Make better decisions aligned with stated goals
- Avoid contradicting or undermining other objectives
- Help humans reflect on and refine their ambitions

## Contents

### Core Schemas

- **[goal.schema.json](./schema/goal.schema.json)** — JSON Schema for a single Goal object
- **[intent-graph.schema.json](./schema/intent-graph.schema.json)** — JSON Schema for the complete IntentGraph with referential integrity validation
- **[dependency.schema.json](./schema/dependency.schema.json)** — JSON Schema for goal dependencies
- **[permission.schema.json](./schema/permission.schema.json)** — JSON Schema for agent permissions
- **[event.schema.json](./schema/event.schema.json)** — JSON Schema for goal change events

### Full Specification

- **[goalos-spec-v0.1.md](./goalos-spec-v0.1.md)** — Complete specification document covering data model, API, use cases, and design principles

### Example Intent Graphs

Real-world examples validating against the schema:

1. **[personal-project.json](./examples/personal-project.json)** — Launching an AI business (OpenClaw)
2. **[team-sprint.json](./examples/team-sprint.json)** — Engineering team quarterly sprint goals
3. **[career-transition.json](./examples/career-transition.json)** — Data scientist to AI entrepreneur transition
4. **[content-creator.json](./examples/content-creator.json)** — Multi-platform content creation pipeline
5. **[health-fitness.json](./examples/health-fitness.json)** — Health and fitness transformation goals

## Key Concepts

### Goal

A goal is a specific objective with:
- **Hierarchical structure** — Goals can have parent goals and sub-goals
- **Status tracking** — active, planned, blocked, paused, completed, abandoned
- **Priority** — Critical, high, medium, low, or someday
- **Time horizons** — today, this_week, this_month, this_quarter, this_year, long_term
- **Success criteria** — Measurable criteria for completion
- **Dependencies** — Relationships to other goals (blocks, requires, enables, related)
- **Permissions** — Agent access control at goal level

### IntentGraph

The complete graph containing:
- All goals for a user/team
- Default permissions for agents
- Metadata about the graph owner and purpose
- Support for querying, filtering, and traversing goals

### Dependencies

Goals can declare relationships:
- **blocks** — Goal A blocks Goal B (B cannot start until A is complete)
- **requires** — Goal B requires Goal A to complete first
- **enables** — Goal A enables/unblocks Goal B
- **related** — Goals are semantically related

### Permissions

Fine-grained access control for AI agents:
- **Capabilities** — read, write, complete, create_sub_goals, reprioritize
- **Scopes** — Can be limited to specific goal IDs, domains, or nesting depth
- **Agents** — Named agents like "claude-desktop", "langchain-agent", "custom-tool"

## Usage

### Validating an Intent Graph

```bash
# Validate against schema
ajv validate -s spec/schema/intent-graph.schema.json -d spec/examples/personal-project.json
```

### Using with TypeScript

```typescript
import { IntentGraph } from '@goalos/core';

// Load from file
const graph = await IntentGraph.fromFile('./my-goals.json');

// Query
const activeGoals = graph.getByStatus('active');
const priorities = graph.getTopPriorities(5);

// Update
const goal = graph.addGoal({
  title: 'Complete project',
  status: 'active',
  priority: { level: 'high' }
});

// Serialize
await graph.toFile('./my-goals.json');
```

### Using with Python

```python
from goalos import IntentGraph

# Load from file
graph = IntentGraph.from_file('./my-goals.json')

# Query
active_goals = graph.get_by_status('active')
priorities = graph.get_top_priorities(5)

# Update
goal = graph.add_goal(
    title='Complete project',
    status='active',
    priority={'level': 'high'}
)

# Serialize
graph.to_file('./my-goals.json')
```

### Using with MCP (Claude Desktop)

```json
{
  "mcpServers": {
    "goalos": {
      "command": "goalos-mcp",
      "args": ["serve", "--storage", "file"]
    }
  }
}
```

## Design Principles

### 1. Simplicity
- Minimal required fields
- Optional fields for extensibility
- JSON-native, human-readable

### 2. Sovereignty
- Users own their intent graphs
- Local-first storage by default
- Open standard, no lock-in

### 3. Composability
- Works with any AI tool via MCP
- Can be used standalone or in combination
- Supports merging graphs from multiple sources

### 4. Extensibility
- Custom metadata fields on any object
- Domain-specific specializations supported
- Version-forward compatible

## Specification Versions

- **0.1.0** (current) — Initial release with core goal model, dependencies, and permissions

## Contributing

Proposed changes to the specification should:
1. Include motivation and use cases
2. Provide example JSON validating against schema
3. Follow semantic versioning for schema changes
4. Be discussed in GitHub issues before implementation

## License

The GoalOS specification is released under the [MIT License](../LICENSE).
