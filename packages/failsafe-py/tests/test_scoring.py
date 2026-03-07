"""Tests for FailSafe scoring"""

import pytest
from failsafe import (
    create_failure_report, calculate_impact_score,
    calculate_urgency_score, calculate_composite_score,
    create_risk_factors_from_report, rank_reports_by_score,
)


def test_impact_score():
    report = create_failure_report(
        "security.prompt_injection", "critical", "security",
        "Injection", "Test",
    )
    score = calculate_impact_score(report)
    assert 0 <= score <= 100
    assert score > 70  # critical + security domain


def test_urgency_score():
    report = create_failure_report(
        "model.hallucination", "high", "reasoning",
        "Hallucination", "Test",
    )
    score = calculate_urgency_score(report)
    assert 0 <= score <= 100


def test_composite_score():
    report = create_failure_report(
        "execution.crash", "medium", "general",
        "Crash", "Test",
    )
    score = calculate_composite_score(report)
    assert 0 <= score <= 100


def test_risk_factors():
    report = create_failure_report(
        "security.data_leak", "critical", "security",
        "Data leak", "Test",
    )
    factors = create_risk_factors_from_report(report)
    assert len(factors) == 4
    names = [f.name for f in factors]
    assert "severity" in names
    assert "verification_status" in names
    assert "domain_criticality" in names


def test_rank_reports():
    r1 = create_failure_report(
        "security.data_leak", "critical", "security", "Critical", "A",
    )
    r2 = create_failure_report(
        "io.invalid_input", "low", "general", "Low", "B",
    )
    r3 = create_failure_report(
        "model.hallucination", "medium", "reasoning", "Medium", "C",
    )
    ranked = rank_reports_by_score([r1, r2, r3])
    assert len(ranked) == 3
    assert ranked[0][1] >= ranked[1][1] >= ranked[2][1]
