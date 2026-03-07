"""FailSafe CrewAI Integration - Callback handler for CrewAI agents"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional

from ..report import create_failure_report, FailureReportBuilder
from ..types import FailureReport


class FailSafeCrewAIHandler:
    """CrewAI step callback that captures agent failures as FailSafe reports."""

    def __init__(
        self,
        domain: str = "agent-orchestration",
        on_report: Optional[Callable[[FailureReport], None]] = None,
    ):
        self.domain = domain
        self.on_report = on_report
        self.reports: List[FailureReport] = []

    def step_callback(self, step_output: Any) -> None:
        output_str = str(step_output) if step_output else ""
        if self._looks_like_failure(output_str):
            report = create_failure_report(
                type="execution.crash",
                severity="medium",
                domain=self.domain,
                title="CrewAI step failure",
                description=output_str[:500],
            )
            self.reports.append(report)
            if self.on_report:
                self.on_report(report)

    def task_callback(self, task_output: Any) -> None:
        pass

    def on_error(
        self, error: Exception, context: Optional[Dict[str, Any]] = None
    ) -> FailureReport:
        report = (
            FailureReportBuilder.create(
                type="execution.crash",
                severity="high",
                domain=self.domain,
                title=f"CrewAI error: {type(error).__name__}",
                description=str(error),
            )
            .with_error(str(error), code=type(error).__name__)
            .build()
        )
        self.reports.append(report)
        if self.on_report:
            self.on_report(report)
        return report

    def get_reports(self) -> List[FailureReport]:
        return list(self.reports)

    def clear(self) -> None:
        self.reports.clear()

    @staticmethod
    def _looks_like_failure(text: str) -> bool:
        indicators = ["error", "exception", "failed", "traceback", "timeout"]
        lower = text.lower()
        return any(ind in lower for ind in indicators)
