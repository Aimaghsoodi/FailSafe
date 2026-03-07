"""
FailSafe Utilities

ID generation, timestamps, hashing, and helper functions.
"""

from __future__ import annotations

import hashlib
import secrets
import string
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any, Optional


_NANOID_ALPHABET = string.ascii_letters + string.digits + "_-"


def _nanoid(size: int = 12) -> str:
    """Generate a nanoid-style random string."""
    return "".join(secrets.choice(_NANOID_ALPHABET) for _ in range(size))


def generate_id(prefix: str) -> str:
    """Generate a prefixed unique ID (e.g. ``report_aBcDeFgHiJkL``)."""
    return f"{prefix}_{_nanoid(12)}"


def get_current_timestamp() -> str:
    """Return the current UTC time as an ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


def hash_string(value: str) -> str:
    """Return a SHA-256 hex digest of *value*."""
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def deep_clone(obj: Any) -> Any:
    """Return a deep copy of *obj*."""
    return deepcopy(obj)


def normalize_score(value: float) -> float:
    """Clamp *value* to the ``[0, 100]`` range and return it as a rounded int."""
    return max(0, min(100, round(value)))


def get_nested_value(obj: Any, path: str) -> Any:
    """
    Retrieve a nested attribute from *obj* using a dotted *path*.

    Works with both dicts and objects that expose attributes.
    """
    current: Any = obj
    for key in path.split("."):
        if current is None:
            return None
        if isinstance(current, dict):
            current = current.get(key)
        else:
            current = getattr(current, key, None)
    return current


def is_timestamp_in_range(timestamp: str, start: str, end: str) -> bool:
    """Return ``True`` if *timestamp* falls within [*start*, *end*] (inclusive)."""
    try:
        ts = datetime.fromisoformat(timestamp)
        start_dt = datetime.fromisoformat(start)
        end_dt = datetime.fromisoformat(end)
        return start_dt <= ts <= end_dt
    except (ValueError, TypeError):
        return False
