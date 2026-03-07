"""
FailSafe Core Types

Pydantic v2 models mirroring the TypeScript failsafe-core type definitions.
"""

from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Literal, Optional, Union

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums / Literal unions
# ---------------------------------------------------------------------------

FailureType = Literal[
    # execution
    "execution.timeout",
    "execution.out_of_memory",
    "execution.crash",
    "execution.hang",
    "execution.invalid_state",
    "execution.resource_exhaustion",
    # io
    "io.invalid_input",
    "io.malformed_data",
    "io.encoding_error",
    "io.serialization_error",
    "io.file_not_found",
    "io.permission_denied",
    "io.network_error",
    "io.timeout",
    # model
    "model.inference_error",
    "model.token_limit_exceeded",
    "model.context_window_exceeded",
    "model.temperature_invalid",
    "model.invalid_parameters",
    "model.unsupported_operation",
    "model.hallucination",
    "model.bias_detected",
    # logic
    "logic.invalid_reasoning",
    "logic.circular_dependency",
    "logic.constraint_violation",
    "logic.incomplete_reasoning",
    "logic.incorrect_output",
    "logic.off_topic",
    # security
    "security.prompt_injection",
    "security.unauthorized_access",
    "security.authentication_failed",
    "security.data_leak",
    "security.validation_bypass",
    "security.rate_limit_exceeded",
    # integration
    "integration.api_error",
    "integration.dependency_missing",
    "integration.version_mismatch",
    "integration.incompatible_format",
    "integration.connection_refused",
]

Severity = Literal["critical", "high", "medium", "low", "info"]

Domain = Literal[
    "reasoning",
    "code-generation",
    "content-creation",
    "data-processing",
    "planning",
    "retrieval",
    "agent-orchestration",
    "security",
    "performance",
    "general",
]

VerificationStatus = Literal["unverified", "verified", "disputed", "resolved"]

RiskLevel = Literal["critical", "high", "medium", "low", "none"]

ConditionOperator = Literal["equals", "contains", "matches", "greater_than", "less_than"]

RecommendationPriority = Literal["critical", "high", "medium", "low"]

RecommendationCategory = Literal[
    "immediate_action",
    "investigation",
    "monitoring",
    "documentation",
    "prevention",
]

RiskSignalType = Literal[
    "anomaly.output_distribution",
    "anomaly.latency_spike",
    "anomaly.error_rate_increase",
    "anomaly.token_usage_spike",
    "pattern.detected",
    "degradation.performance",
    "degradation.quality",
    "drift.model_behavior",
    "drift.input_distribution",
    "safety.prompt_injection_attempt",
    "safety.unauthorized_access_attempt",
    "reliability.repeated_failures",
]

TimelineEvent = Literal["created", "verified", "disputed", "resolved", "updated"]

ContributorRole = Literal["reporter", "verifier", "resolver", "maintainer"]


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class ModelInfo(BaseModel):
    """Information about the AI model involved in a failure."""

    name: str
    version: str
    provider: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    top_p: Optional[float] = None
    top_k: Optional[int] = None
    parameters: Optional[Dict[str, Any]] = None


class SystemInfo(BaseModel):
    """System information at the time of a failure."""

    os: Optional[str] = None
    node_version: Optional[str] = None
    memory_used: Optional[float] = None
    memory_available: Optional[float] = None
    cpu_usage: Optional[float] = None
    uptime: Optional[float] = None


class Recommendation(BaseModel):
    """A recommendation for addressing a failure."""

    id: str
    title: str
    description: str
    priority: RecommendationPriority
    category: RecommendationCategory
    estimated_effort: Optional[str] = None
    related_failures: Optional[List[str]] = None
    implementation_guide: Optional[str] = None
    success_criteria: Optional[List[str]] = None
    created_at: str


class FailureReport(BaseModel):
    """
    Core failure report model.

    Represents a single tracked AI failure with full metadata,
    verification status, and optional recommendations.
    """

    id: str
    type: FailureType
    severity: Severity
    domain: Domain
    title: str
    description: str
    context: Optional[str] = None
    timestamp: str
    duration: Optional[float] = None

    model_info: Optional[ModelInfo] = None
    system_info: Optional[SystemInfo] = None

    error_message: Optional[str] = None
    error_stack: Optional[str] = None
    error_code: Optional[str] = None

    input: Optional[Any] = None
    output: Optional[Any] = None
    expected_output: Optional[Any] = None

    source: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

    verification_status: VerificationStatus = "unverified"
    verified_by: Optional[str] = None
    verification_notes: Optional[str] = None
    resolved_at: Optional[str] = None
    resolution_notes: Optional[str] = None

    recommendations: Optional[List[Recommendation]] = None

    version: int = 1
    created_at: str
    updated_at: str

    model_config = {"populate_by_name": True}


class PatternCondition(BaseModel):
    """A single condition used in failure pattern matching."""

    field: str
    operator: ConditionOperator
    value: Any


class FailurePattern(BaseModel):
    """
    A pattern that describes a class of failures.

    Used for automatic detection and classification.
    """

    id: str
    name: str
    description: str
    failure_types: List[FailureType]
    conditions: List[PatternCondition]
    severity: Severity
    likelihood: Optional[float] = None
    impact: Optional[str] = None
    common_causes: Optional[List[str]] = None
    prevention_strategies: Optional[List[str]] = None
    detection_rules: Optional[List[str]] = None
    created_at: str
    updated_at: str


class RiskFactor(BaseModel):
    """A weighted risk factor contributing to an overall risk score."""

    name: str
    weight: float
    value: float
    description: Optional[str] = None
    trend: Optional[Literal["increasing", "decreasing", "stable"]] = None


class RiskSignal(BaseModel):
    """A detected risk signal from monitoring AI systems."""

    id: str
    type: RiskSignalType
    level: RiskLevel
    score: float
    detected_at: str
    detector: str
    related_goals: Optional[List[str]] = None
    context: Optional[Dict[str, Any]] = None
    factors: List[RiskFactor]
    analysis: Optional[str] = None
    recommendations: Optional[List[str]] = None
    acknowledged: bool = False
    acknowledged_at: Optional[str] = None
    acknowledged_by: Optional[str] = None
    created_at: str
    updated_at: str


class Contributor(BaseModel):
    """A person or system that contributed to a failure report."""

    id: str
    role: ContributorRole
    contributed_at: str
    contribution: str


class Badge(BaseModel):
    """A badge awarded for contributions to failure reporting."""

    id: str
    name: str
    description: str
    icon: Optional[str] = None
    earned_at: str
    earned_by: str
    criteria: str


class FailureReportFilter(BaseModel):
    """Filter criteria for querying failure reports."""

    types: Optional[List[FailureType]] = None
    severities: Optional[List[Severity]] = None
    domains: Optional[List[Domain]] = None
    verification_status: Optional[List[VerificationStatus]] = None
    tags: Optional[List[str]] = None
    date_range: Optional[DateRange] = None
    source: Optional[str] = None
    search: Optional[str] = None


class DateRange(BaseModel):
    """A date range for filtering."""

    start: str
    end: str


# Fix forward reference: FailureReportFilter uses DateRange
FailureReportFilter.model_rebuild()


class QueryResult(BaseModel):
    """Paginated query result."""

    items: List[FailureReport]
    total: int
    offset: int
    limit: int
    has_more: bool


class FailureTypeCount(BaseModel):
    """Count of failures by type."""

    type: FailureType
    count: int


class DomainCount(BaseModel):
    """Count of failures by domain."""

    domain: Domain
    count: int


class FailureStats(BaseModel):
    """Aggregate statistics over a set of failure reports."""

    total_reports: int
    by_type: Dict[str, int]
    by_severity: Dict[str, int]
    by_domain: Dict[str, int]
    by_status: Dict[str, int]
    average_severity_score: float
    top_failure_types: List[FailureTypeCount]
    top_domains: List[DomainCount]
    unverified_count: int
    resolved_count: int
    resolution_rate: float


class FailureTimelineEntry(BaseModel):
    """An entry in the timeline of a failure report's lifecycle."""

    timestamp: str
    event: TimelineEvent
    actor: Optional[str] = None
    notes: Optional[str] = None
    previous_state: Optional[Dict[str, Any]] = None
    new_state: Optional[Dict[str, Any]] = None


class FailureFingerprint(BaseModel):
    """A fingerprint for deduplicating similar failures."""

    id: str
    failure_report_id: str
    hash: str
    components: FingerprintComponents
    created_at: str


class FingerprintComponents(BaseModel):
    """Components used to generate a failure fingerprint."""

    type: str
    message: str
    stack: str


# Fix forward reference
FailureFingerprint.model_rebuild()
