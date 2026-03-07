"""FailSafe OpenAI Integration - Wrapper for OpenAI API calls"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional

from ..report import FailureReportBuilder
from ..types import FailureReport


class FailSafeOpenAIWrapper:
    """Wraps OpenAI client calls to capture failures as FailSafe reports."""

    def __init__(
        self,
        client: Any = None,
        domain: str = "reasoning",
        on_report: Optional[Callable[[FailureReport], None]] = None,
    ):
        self.client = client
        self.domain = domain
        self.on_report = on_report
        self.reports: List[FailureReport] = []

    def chat_completion(self, **kwargs: Any) -> Any:
        try:
            if self.client is None:
                raise RuntimeError("OpenAI client not configured")
            return self.client.chat.completions.create(**kwargs)
        except Exception as e:
            report = (
                FailureReportBuilder.create(
                    type="model.inference_error",
                    severity="high",
                    domain=self.domain,
                    title=f"OpenAI API error: {type(e).__name__}",
                    description=str(e),
                )
                .with_error(str(e), code=type(e).__name__)
                .build()
            )
            self.reports.append(report)
            if self.on_report:
                self.on_report(report)
            raise

    def get_reports(self) -> List[FailureReport]:
        return list(self.reports)

    def clear(self) -> None:
        self.reports.clear()
