"""FailSafe Risk Scoring"""

from __future__ import annotations

from typing import List, Tuple

from .types import FailureReport, RiskFactor
from .taxonomy import SEVERITY_WEIGHTS
from .utils import normalize_score


def calculate_impact_score(report: FailureReport) -> float:
    score = SEVERITY_WEIGHTS.get(report.severity, 0) * 0.7
    if report.domain == "security":
        score += 20
    if report.domain == "agent-orchestration":
        score += 12
    if report.verification_status != "resolved":
        score += 8
    if report.recommendations and len(report.recommendations) > 2:
        score += 5
    return normalize_score(round(score))


def calculate_urgency_score(report: FailureReport) -> float:
    severity_score = SEVERITY_WEIGHTS.get(report.severity, 0)
    is_unverified = 20 if report.verification_status == "unverified" else 0
    is_critical_sev = 30 if report.severity == "critical" else 0
    return normalize_score(severity_score + is_unverified + is_critical_sev)


def create_risk_factors_from_report(report: FailureReport) -> List[RiskFactor]:
    factors: List[RiskFactor] = []

    factors.append(RiskFactor(
        name="severity", weight=0.3,
        value=SEVERITY_WEIGHTS.get(report.severity, 0),
    ))

    verification_score = (
        80 if report.verification_status == "unverified"
        else 40 if report.verification_status == "verified"
        else 20
    )
    factors.append(RiskFactor(
        name="verification_status", weight=0.2, value=verification_score,
    ))

    domain_score = (
        90 if report.domain == "security"
        else 75 if report.domain == "agent-orchestration"
        else 60
    )
    factors.append(RiskFactor(
        name="domain_criticality", weight=0.25, value=domain_score,
    ))

    resolution_score = 10 if report.verification_status == "resolved" else 70
    factors.append(RiskFactor(
        name="resolution_status", weight=0.25, value=resolution_score,
    ))

    return factors


def calculate_composite_score(report: FailureReport) -> float:
    impact = calculate_impact_score(report) * 0.4
    urgency = calculate_urgency_score(report) * 0.35
    baseline = 25
    return normalize_score(impact + urgency + baseline)


def rank_reports_by_score(
    reports: List[FailureReport],
) -> List[Tuple[FailureReport, float]]:
    scored = [(r, calculate_composite_score(r)) for r in reports]
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored
