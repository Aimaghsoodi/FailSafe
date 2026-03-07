"""Tests for FailSafe taxonomy"""

import pytest
from failsafe import (
    is_valid_failure_type, get_failure_category,
    get_default_severity_for_type, get_all_categories,
    get_failure_types_for_category, SEVERITY_WEIGHTS,
    ALL_FAILURE_TYPES,
)


def test_valid_failure_types():
    assert is_valid_failure_type("model.hallucination") is True
    assert is_valid_failure_type("security.prompt_injection") is True
    assert is_valid_failure_type("nonexistent.type") is False


def test_categories():
    categories = get_all_categories()
    assert "security" in categories
    assert "model" in categories
    assert "execution" in categories
    assert len(categories) == 6


def test_get_failure_category():
    assert get_failure_category("model.hallucination") == "model"
    assert get_failure_category("security.prompt_injection") == "security"


def test_severity_weights():
    assert SEVERITY_WEIGHTS["critical"] == 100
    assert SEVERITY_WEIGHTS["info"] == 0
    assert SEVERITY_WEIGHTS["high"] > SEVERITY_WEIGHTS["medium"]


def test_failure_types_count():
    assert len(ALL_FAILURE_TYPES) >= 35


def test_types_for_category():
    security = get_failure_types_for_category("security")
    assert "security.prompt_injection" in security
    assert len(security) >= 5
