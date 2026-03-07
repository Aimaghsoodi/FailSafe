"""
FailSafe Failure Report

Functions for creating, updating, verifying, and resolving failure reports.
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from .types import Domain, FailureReport, FailureType, Severity
from .utils import generate_id, get_current_timestamp


# ---------------------------------------------------------------------------
# Builder
# ---------------------------------------------------------------------------


class FailureReportBuilder:
    """Fluent builder for constructing :class:`FailureReport` instances."""

    def __init__(
        self,
        id: str,
        type: FailureType,
        severity: Severity,
        domain: Domain,
        title: str,
        description: str,
    ) -> None:
        now = get_current_timestamp()
        self._data: Dict[str, Any] = {
            "id": id,
            "type": type,
            "severity": severity,
            "domain": domain,
            "title": title,
            "description": description,
            "timestamp": now,
            "verification_status": "unverified",
            "version": 1,
            "created_at": now,
            "updated_at": now,
        }

    @classmethod
    def create(
        cls,
        type: FailureType,
        severity: Severity,
        domain: Domain,
        title: str,
        description: str,
    ) -> "FailureReportBuilder":
        """Create a new builder with an auto-generated ID."""
        return cls(generate_id("report"), type, severity, domain, title, description)

    # -- optional enrichment --------------------------------------------------

    def with_error(
        self,
        message: str,
        stack: Optional[str] = None,
        code: Optional[str] = None,
    ) -> "FailureReportBuilder":
        """Attach error details."""
        self._data["error_message"] = message
        if stack is not None:
            self._data["error_stack"] = stack
        if code is not None:
            self._data["error_code"] = code
        return self

    def with_model_info(self, **kwargs: Any) -> "FailureReportBuilder":
        """Attach model information."""
        from .types import ModelInfo

        self._data["model_info"] = ModelInfo(**kwargs)
        return self

    def with_context(self, context: str) -> "FailureReportBuilder":
        """Attach additional context."""
        self._data["context"] = context
        return self

    def with_io(
        self,
        input: Any = None,
        output: Any = None,
        expected_output: Any = None,
    ) -> "FailureReportBuilder":
        """Attach input/output data."""
        if input is not None:
            self._data["input"] = input
        if output is not None:
            self._data["output"] = output
        if expected_output is not None:
            self._data["expected_output"] = expected_output
        return self

    def with_source(self, source: str) -> "FailureReportBuilder":
        """Set the source of the report."""
        self._data["source"] = source
        return self

    def with_tags(self, *tags: str) -> "FailureReportBuilder":
        """Attach tags."""
        self._data["tags"] = list(tags)
        return self

    def with_metadata(self, metadata: Dict[str, Any]) -> "FailureReportBuilder":
        """Attach arbitrary metadata."""
        self._data["metadata"] = metadata
        return self

    def build(self) -> FailureReport:
        """Construct the :class:`FailureReport`."""
        return FailureReport(**self._data)


# ---------------------------------------------------------------------------
# Convenience functions
# ---------------------------------------------------------------------------


def create_failure_report(
    type: FailureType,
    severity: Severity,
    domain: Domain,
    title: str,
    description: str,
) -> FailureReport:
    """Create a minimal failure report with an auto-generated ID."""
    return FailureReportBuilder.create(type, severity, domain, title, description).build()


def update_failure_report(
    report: FailureReport,
    **updates: Any,
) -> FailureReport:
    """
    Return a new :class:`FailureReport` with the given updates applied.

    The ``id`` and ``created_at`` fields are preserved, ``version`` is
    incremented, and ``updated_at`` is set to the current time.
    """
    data = report.model_dump()
    data.update(updates)
    # Immutable fields
    data["id"] = report.id
    data["created_at"] = report.created_at
    data["version"] = report.version + 1
    data["updated_at"] = get_current_timestamp()
    return FailureReport(**data)


def verify_failure_report(
    report: FailureReport,
    verified_by: str,
    notes: Optional[str] = None,
) -> FailureReport:
    """Mark a report as verified."""
    return update_failure_report(
        report,
        verification_status="verified",
        verified_by=verified_by,
        verification_notes=notes,
    )


def resolve_failure_report(
    report: FailureReport,
    notes: Optional[str] = None,
) -> FailureReport:
    """Mark a report as resolved."""
    return update_failure_report(
        report,
        verification_status="resolved",
        resolved_at=get_current_timestamp(),
        resolution_notes=notes,
    )


def is_critical(report: FailureReport) -> bool:
    """Return ``True`` if the report has critical severity."""
    return report.severity == "critical"
