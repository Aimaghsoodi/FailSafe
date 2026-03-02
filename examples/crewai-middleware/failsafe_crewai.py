"""FailSafe CrewAI Middleware"""

from typing import Optional, Callable, List, Any
from crewai import Agent, Task, Crew
from failsafe import FailSafeClient


class FailSafeTeam:
    """CrewAI crew with FailSafe failure detection."""

    def __init__(
        self,
        agents: List[Agent],
        tasks: List[Task],
        mode: str = 'block',
        api_key: Optional[str] = None,
        failure_handler: Optional[Callable] = None,
        confidence_threshold: float = 0.7
    ):
        self.agents = agents
        self.tasks = tasks
        self.mode = mode
        self.confidence_threshold = confidence_threshold
        self.failure_handler = failure_handler
        self.client = FailSafeClient(api_key=api_key) if api_key else None
        self.crew = Crew(agents=agents, tasks=tasks)

    def check_output(self, output: str) -> dict:
        """Check agent output for failures."""
        if not self.client:
            return {'blocked': False}

        try:
            report = self.client.check(output)
            failures = [f for f in report.failures if f.confidence >= self.confidence_threshold]

            for failure in failures:
                if self.failure_handler:
                    self.failure_handler(failure)

            return {
                'blocked': self.mode == 'block' and len(failures) > 0,
                'failures': failures
            }
        except Exception:
            return {'blocked': False}

    def kickoff(self):
        """Execute crew with failure checking."""
        # Wrap task execution
        original_execute = self.crew.execute

        def checked_execute():
            result = original_execute()
            check_result = self.check_output(str(result))
            if check_result['blocked']:
                raise ValueError("Output blocked: failure detected")
            return result

        self.crew.execute = checked_execute
        return self.crew.execute()
