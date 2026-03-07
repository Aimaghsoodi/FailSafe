"""Tests for FailSafe filtering and statistics"""

import pytest
from failsafe import (
    create_failure_report, filter_failure_reports,
    query_failure_reports, calculate_failure_stats, group_by,
)
from failsafe.types import FailureReportFilter


def _make_reports():
    return [
        create_failure_report(
            "security.prompt_injection", "critical", "security", "Sec1", "A",
        ),
        create_failure_report(
            "model.hallucination", "high", "reasoning", "Model1", "B",
        ),
        create_failure_report(
            "execution.crash", "medium", "general", "Exec1", "C",
        ),
        create_failure_report(
            "io.invalid_input", "low", "data-processing", "IO1", "D",
        ),
    ]


def test_filter_by_severity():
    reports = _make_reports()
    f = FailureReportFilter(severities=["critical", "high"])
    result = filter_failure_reports(reports, f)
    assert len(result) == 2


def test_filter_by_domain():
    reports = _make_reports()
    f = FailureReportFilter(domains=["security"])
    result = filter_failure_reports(reports, f)
    assert len(result) == 1
    assert result[0].domain == "security"


def test_query_pagination():
    reports = _make_reports()
    f = FailureReportFilter()
    result = query_failure_reports(reports, f, offset=0, limit=2)
    assert len(result.items) == 2
    assert result.total == 4
    assert result.has_more is True


def test_stats():
    reports = _make_reports()
    stats = calculate_failure_stats(reports)
    assert stats.total_reports == 4
    assert stats.by_severity["critical"] == 1
    assert stats.resolution_rate == 0.0


def test_group_by():
    reports = _make_reports()
    grouped = group_by(reports, "domain")
    assert "security" in grouped
    assert len(grouped["security"]) == 1
