"""FailSafe LangChain Integration - Callback handler for LangChain chains"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional

from ..report import create_failure_report, FailureReportBuilder
from ..types import FailureReport

try:
    from langchain_core.callbacks import BaseCallbackHandler

    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False
    BaseCallbackHandler = object  # type: ignore[misc,assignment]


class FailSafeLangChainHandler(BaseCallbackHandler):  # type: ignore[misc]
    """LangChain callback handler that captures failures as FailSafe reports."""

    def __init__(
        self,
        domain: str = "reasoning",
        on_report: Optional[Callable[[FailureReport], None]] = None,
    ):
        if HAS_LANGCHAIN:
            super().__init__()
        self.domain = domain
        self.on_report = on_report
        self.reports: List[FailureReport] = []

    def on_llm_error(self, error: BaseException, **kwargs: Any) -> None:
        report = (
            FailureReportBuilder.create(
                type="model.inference_error",
                severity="high",
                domain=self.domain,
                title=f"LLM error: {type(error).__name__}",
                description=str(error),
            )
            .with_error(str(error), code=type(error).__name__)
            .build()
        )
        self.reports.append(report)
        if self.on_report:
            self.on_report(report)

    def on_chain_error(self, error: BaseException, **kwargs: Any) -> None:
        report = (
            FailureReportBuilder.create(
                type="execution.crash",
                severity="high",
                domain=self.domain,
                title=f"Chain error: {type(error).__name__}",
                description=str(error),
            )
            .with_error(str(error), code=type(error).__name__)
            .build()
        )
        self.reports.append(report)
        if self.on_report:
            self.on_report(report)

    def on_tool_error(self, error: BaseException, **kwargs: Any) -> None:
        report = (
            FailureReportBuilder.create(
                type="integration.api_error",
                severity="medium",
                domain=self.domain,
                title=f"Tool error: {type(error).__name__}",
                description=str(error),
            )
            .with_error(str(error), code=type(error).__name__)
            .build()
        )
        self.reports.append(report)
        if self.on_report:
            self.on_report(report)

    def get_reports(self) -> List[FailureReport]:
        return list(self.reports)

    def clear(self) -> None:
        self.reports.clear()
