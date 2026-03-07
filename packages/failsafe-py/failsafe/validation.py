"""FailSafe Validation"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List


def is_valid_iso_date(date_string: str) -> bool:
    try:
        datetime.fromisoformat(date_string)
        return True
    except (ValueError, TypeError):
        return False


def validate_failure_report(report: Any) -> Dict[str, Any]:
    errors: List[str] = []

    if isinstance(report, dict):
        data = report
    elif hasattr(report, "model_dump"):
        data = report.model_dump()
    else:
        data = {}

    if not data.get("id") or not isinstance(data.get("id"), str):
        errors.append("id: must be a non-empty string")
    if not data.get("type") or not isinstance(data.get("type"), str):
        errors.append("type: must be a non-empty string")
    if data.get("severity") not in ("critical", "high", "medium", "low", "info"):
        errors.append("severity: must be one of critical, high, medium, low, info")
    if not data.get("title") or not isinstance(data.get("title"), str):
        errors.append("title: must be a non-empty string")
    ts = data.get("timestamp", "")
    if not is_valid_iso_date(ts):
        errors.append("timestamp: must be a valid ISO 8601 date")

    return {"valid": len(errors) == 0, "errors": errors if errors else None}


def check_integrity(reports: list) -> Dict[str, Any]:
    errors: List[str] = []
    ids: set = set()
    for r in reports:
        rid = r.id if hasattr(r, "id") else r.get("id", "")
        if rid in ids:
            errors.append(f"Duplicate report ID: {rid}")
        ids.add(rid)
    return {"valid": len(errors) == 0, "errors": errors}
