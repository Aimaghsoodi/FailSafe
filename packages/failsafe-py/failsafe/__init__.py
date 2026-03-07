"""FailSafe - AI Failure Intelligence Platform"""

from .types import (
    FailureReport, FailurePattern, FailureReportFilter, FailureStats,
    QueryResult, RiskFactor, RiskSignal, ModelInfo, SystemInfo,
    Recommendation, PatternCondition, FailureFingerprint,
    FailureTimelineEntry, Contributor, Badge,
)
from .taxonomy import (
    FAILURE_TYPE_CATEGORIES, ALL_FAILURE_TYPES, SEVERITY_WEIGHTS,
    DEFAULT_SEVERITY_MAP, get_failure_category, get_severity_weight,
    get_default_severity_for_type, is_valid_failure_type,
    get_failure_types_for_category, get_all_categories,
)
from .report import (
    FailureReportBuilder, create_failure_report, update_failure_report,
    verify_failure_report, resolve_failure_report, is_critical,
)
from .scoring import (
    calculate_impact_score, calculate_urgency_score,
    calculate_composite_score, create_risk_factors_from_report,
    rank_reports_by_score,
)
from .validation import (
    validate_failure_report, is_valid_iso_date, check_integrity,
)
from .matcher import (
    filter_failure_reports, query_failure_reports,
    calculate_failure_stats, group_by,
)

__version__ = "0.1.0"
