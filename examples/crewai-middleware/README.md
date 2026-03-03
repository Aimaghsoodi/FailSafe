# CrewAI + FailSafe Middleware

Integrate FailSafe failure detection with CrewAI agent teams.

## What This Does

- Detects failures in agent outputs
- Blocks problematic outputs before task execution
- Logs failures across team
- Provides team-wide failure insights

## Installation

```bash
pip install crewai failsafe
```

## Usage

```python
from failsafe_crewai import FailSafeTeam

team = FailSafeTeam(agents, tasks, mode='block')
result = team.kickoff()
```

## Configuration

```python
# Block failures
team = FailSafeTeam(agents, tasks, mode='block')

# Warn mode
team = FailSafeTeam(agents, tasks, mode='warn')

# Custom handlers
team = FailSafeTeam(
    agents, tasks,
    failure_handler=my_handler,
    confidence_threshold=0.8
)
```

## Team Analytics

```python
from failsafe import FailSafeClient

client = FailSafeClient()
team_failures = client.query_failures(team_id="my-crew")
```

## See Also

- Implementation: `failsafe_crewai.py`
- GitHub: https://github.com/Aimaghsoodi/FailSafe
