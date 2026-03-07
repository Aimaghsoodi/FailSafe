"""Tests for FailSafe validation"""

import pytest
from failsafe import (
    create_failure_report, validate_failure_report, check_integrity,
)
from failsafe.validation import is_valid_iso_date


def test_validate_valid_report():
    report = create_failure_report(
        "model.hallucination", "high", "reasoning", "Test", "Description",
    )
    result = validate_failure_report(report.model_dump())
    assert result["valid"] is True


def test_validate_invalid_report():
    result = validate_failure_report({"id": "", "severity": "unknown"})
    assert result["valid"] is False
    assert len(result["errors"]) > 0


def test_iso_date_validation():
    assert is_valid_iso_date("2024-01-15T10:30:00+00:00") is True
    assert is_valid_iso_date("not-a-date") is False


def test_check_integrity():
    r1 = create_failure_report(
        "model.hallucination", "high", "reasoning", "A", "B",
    )
    r2 = create_failure_report(
        "execution.crash", "medium", "general", "C", "D",
    )
    result = check_integrity([r1, r2])
    assert result["valid"] is True
