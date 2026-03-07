"""FailSafe Filtering, Querying, and Statistics"""

from __future__ import annotations

from typing import Any, Dict, List

from .types import (
    FailureReport, FailureReportFilter, FailureStats,
    QueryResult, FailureTypeCount, DomainCount,
)
from .taxonomy import SEVERITY_WEIGHTS
from .utils import is_timestamp_in_range


def filter_failure_reports(
    reports: List[FailureReport], filter: FailureReportFilter
) -> List[FailureReport]:
    result: List[FailureReport] = []
    for r in reports:
        if filter.types and r.type not in filter.types:
            continue
        if filter.severities and r.severity not in filter.severities:
            continue
        if filter.domains and r.domain not in filter.domains:
            continue
        if filter.verification_status and r.verification_status not in filter.verification_status:
            continue
        if filter.date_range:
            if not is_timestamp_in_range(
                r.timestamp, filter.date_range.start, filter.date_range.end
            ):
                continue
        if filter.source and r.source != filter.source:
            continue
        result.append(r)
    return result


def query_failure_reports(
    reports: List[FailureReport],
    filter: FailureReportFilter,
    offset: int = 0,
    limit: int = 50,
) -> QueryResult:
    filtered = filter_failure_reports(reports, filter)
    items = filtered[offset : offset + limit]
    return QueryResult(
        items=items,
        total=len(filtered),
        offset=offset,
        limit=limit,
        has_more=offset + limit < len(filtered),
    )


def calculate_failure_stats(reports: List[FailureReport]) -> FailureStats:
    by_type: Dict[str, int] = {}
    by_severity: Dict[str, int] = {
        "critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0,
    }
    by_domain: Dict[str, int] = {}
    by_status: Dict[str, int] = {
        "unverified": 0, "verified": 0, "disputed": 0, "resolved": 0,
    }
    total_weight = 0

    for r in reports:
        by_type[r.type] = by_type.get(r.type, 0) + 1
        by_severity[r.severity] = by_severity.get(r.severity, 0) + 1
        by_domain[r.domain] = by_domain.get(r.domain, 0) + 1
        by_status[r.verification_status] = by_status.get(r.verification_status, 0) + 1
        total_weight += SEVERITY_WEIGHTS.get(r.severity, 0)

    top_types = sorted(by_type.items(), key=lambda x: x[1], reverse=True)[:5]

    return FailureStats(
        total_reports=len(reports),
        by_type=by_type,
        by_severity=by_severity,
        by_domain=by_domain,
        by_status=by_status,
        average_severity_score=total_weight / len(reports) if reports else 0,
        top_failure_types=[
            FailureTypeCount(type=t, count=c) for t, c in top_types
        ],
        top_domains=[],
        unverified_count=by_status["unverified"],
        resolved_count=by_status["resolved"],
        resolution_rate=by_status["resolved"] / len(reports) if reports else 0,
    )


def group_by(
    reports: List[FailureReport], key: str
) -> Dict[str, List[FailureReport]]:
    grouped: Dict[str, List[FailureReport]] = {}
    for r in reports:
        value = str(getattr(r, key, ""))
        if value not in grouped:
            grouped[value] = []
        grouped[value].append(r)
    return grouped
