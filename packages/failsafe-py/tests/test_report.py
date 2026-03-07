"""Tests for FailSafe report creation and lifecycle"""

import pytest
from failsafe import (
    create_failure_report, update_failure_report,
    verify_failure_report, resolve_failure_report,
    is_critical, FailureReportBuilder,
)


def test_create_failure_report():
    report = create_failure_report(
        "model.hallucination", "high", "reasoning",
        "Fabricated citation", "Model cited a non-existent paper",
    )
    assert report.id.startswith("report_")
    assert report.type == "model.hallucination"
    assert report.severity == "high"
    assert report.domain == "reasoning"
    assert report.verification_status == "unverified"
    assert report.version == 1


def test_update_failure_report():
    report = create_failure_report(
        "model.hallucination", "medium", "reasoning",
        "Test", "Test description",
    )
    updated = update_failure_report(report, severity="critical", tags=["urgent"])
    assert updated.severity == "critical"
    assert updated.tags == ["urgent"]
    assert updated.version == 2
    assert updated.id == report.id


def test_verify_failure_report():
    report = create_failure_report(
        "security.prompt_injection", "high", "security",
        "Injection", "Prompt injection detected",
    )
    verified = verify_failure_report(report, "admin@team.com", "Confirmed")
    assert verified.verification_status == "verified"
    assert verified.verified_by == "admin@team.com"


def test_resolve_failure_report():
    report = create_failure_report(
        "execution.crash", "high", "general",
        "Crash", "Agent crashed",
    )
    resolved = resolve_failure_report(report, "Fixed with retry logic")
    assert resolved.verification_status == "resolved"
    assert resolved.resolution_notes == "Fixed with retry logic"
    assert resolved.resolved_at is not None


def test_is_critical():
    critical = create_failure_report(
        "security.data_leak", "critical", "security",
        "Data leak", "Sensitive data exposed",
    )
    low = create_failure_report(
        "io.invalid_input", "low", "general",
        "Bad input", "Invalid input received",
    )
    assert is_critical(critical) is True
    assert is_critical(low) is False


def test_builder_pattern():
    report = (
        FailureReportBuilder.create(
            "security.prompt_injection", "critical", "security",
            "Injection detected", "System prompt override",
        )
        .with_error("Malicious prompt detected")
        .with_tags("production", "urgent")
        .with_source("api-gateway")
        .build()
    )
    assert report.error_message == "Malicious prompt detected"
    assert report.tags == ["production", "urgent"]
    assert report.source == "api-gateway"
