"""
FailSafe Failure Taxonomy

Defines the canonical failure categories, subtypes, severity weights,
and default severity mappings.
"""

from __future__ import annotations

from typing import Dict, List, Optional, Tuple

from .types import FailureType, Severity


# ---------------------------------------------------------------------------
# Category -> subtypes mapping
# ---------------------------------------------------------------------------

FAILURE_TYPE_CATEGORIES: Dict[str, Tuple[FailureType, ...]] = {
    "execution": (
        "execution.timeout",
        "execution.out_of_memory",
        "execution.crash",
        "execution.hang",
        "execution.invalid_state",
        "execution.resource_exhaustion",
    ),
    "io": (
        "io.invalid_input",
        "io.malformed_data",
        "io.encoding_error",
        "io.serialization_error",
        "io.file_not_found",
        "io.permission_denied",
        "io.network_error",
        "io.timeout",
    ),
    "model": (
        "model.inference_error",
        "model.token_limit_exceeded",
        "model.context_window_exceeded",
        "model.temperature_invalid",
        "model.invalid_parameters",
        "model.unsupported_operation",
        "model.hallucination",
        "model.bias_detected",
    ),
    "logic": (
        "logic.invalid_reasoning",
        "logic.circular_dependency",
        "logic.constraint_violation",
        "logic.incomplete_reasoning",
        "logic.incorrect_output",
        "logic.off_topic",
    ),
    "security": (
        "security.prompt_injection",
        "security.unauthorized_access",
        "security.authentication_failed",
        "security.data_leak",
        "security.validation_bypass",
        "security.rate_limit_exceeded",
    ),
    "integration": (
        "integration.api_error",
        "integration.dependency_missing",
        "integration.version_mismatch",
        "integration.incompatible_format",
        "integration.connection_refused",
    ),
}

# Flat set of all valid failure types for fast lookup
ALL_FAILURE_TYPES: frozenset[str] = frozenset(
    ft for types in FAILURE_TYPE_CATEGORIES.values() for ft in types
)

# ---------------------------------------------------------------------------
# Severity weights (matches TypeScript SEVERITY_WEIGHTS)
# ---------------------------------------------------------------------------

SEVERITY_WEIGHTS: Dict[str, int] = {
    "critical": 100,
    "high": 75,
    "medium": 50,
    "low": 25,
    "info": 0,
}

# ---------------------------------------------------------------------------
# Default severity per failure type
# ---------------------------------------------------------------------------

DEFAULT_SEVERITY_MAP: Dict[str, Severity] = {
    "security.prompt_injection": "high",
    "security.unauthorized_access": "high",
    "execution.timeout": "high",
    "execution.out_of_memory": "high",
    "execution.crash": "high",
    "model.inference_error": "medium",
    "model.hallucination": "medium",
    "model.bias_detected": "medium",
    "logic.invalid_reasoning": "medium",
    "logic.circular_dependency": "low",
    "io.invalid_input": "low",
    "io.malformed_data": "low",
    "io.timeout": "medium",
    "integration.api_error": "medium",
    "integration.dependency_missing": "low",
}


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------


def get_failure_category(failure_type: str) -> str:
    """
    Extract the top-level category from a dotted failure type.

    >>> get_failure_category("execution.timeout")
    'execution'
    """
    return failure_type.split(".")[0]


def get_severity_weight(severity: Severity) -> int:
    """Return the numeric weight for a severity level."""
    return SEVERITY_WEIGHTS.get(severity, 0)


def get_default_severity_for_type(failure_type: str) -> Severity:
    """
    Return the default severity for a given failure type.

    Falls back to ``'medium'`` when the type has no explicit mapping.
    """
    return DEFAULT_SEVERITY_MAP.get(failure_type, "medium")


def is_valid_failure_type(failure_type: str) -> bool:
    """Return ``True`` if *failure_type* is a recognised FailSafe failure type."""
    return failure_type in ALL_FAILURE_TYPES


def get_failure_types_for_category(category: str) -> Tuple[FailureType, ...]:
    """Return all failure types belonging to *category*, or an empty tuple."""
    return FAILURE_TYPE_CATEGORIES.get(category, ())


def get_all_categories() -> List[str]:
    """Return the list of top-level failure categories."""
    return list(FAILURE_TYPE_CATEGORIES.keys())
