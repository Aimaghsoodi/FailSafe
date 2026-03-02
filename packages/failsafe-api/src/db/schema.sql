-- FailSafe Database Schema

-- Failure Reports Table
CREATE TABLE IF NOT EXISTS failure_reports (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  context TEXT,
  timestamp TEXT NOT NULL,
  duration INTEGER,
  error_message TEXT,
  error_stack TEXT,
  error_code TEXT,
  input TEXT,
  output TEXT,
  expected_output TEXT,
  source TEXT,
  user_id TEXT,
  session_id TEXT,
  tags TEXT,
  metadata TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  verified_by TEXT,
  verification_notes TEXT,
  resolved_at TEXT,
  resolution_notes TEXT,
  recommendations TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Model Info Table
CREATE TABLE IF NOT EXISTS model_info (
  id TEXT PRIMARY KEY,
  failure_report_id TEXT NOT NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  provider TEXT,
  temperature REAL,
  max_tokens INTEGER,
  top_p REAL,
  top_k INTEGER,
  parameters TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (failure_report_id) REFERENCES failure_reports(id) ON DELETE CASCADE
);

-- System Info Table
CREATE TABLE IF NOT EXISTS system_info (
  id TEXT PRIMARY KEY,
  failure_report_id TEXT NOT NULL,
  os TEXT,
  node_version TEXT,
  memory_used INTEGER,
  memory_available INTEGER,
  cpu_usage REAL,
  uptime INTEGER,
  created_at TEXT NOT NULL,
  FOREIGN KEY (failure_report_id) REFERENCES failure_reports(id) ON DELETE CASCADE
);

-- Failure Patterns Table
CREATE TABLE IF NOT EXISTS failure_patterns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  failure_types TEXT NOT NULL,
  conditions TEXT NOT NULL,
  severity TEXT NOT NULL,
  likelihood REAL,
  impact TEXT,
  common_causes TEXT,
  prevention_strategies TEXT,
  detection_rules TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Risk Signals Table
CREATE TABLE IF NOT EXISTS risk_signals (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  level TEXT NOT NULL,
  score REAL NOT NULL,
  detected_at TEXT NOT NULL,
  detector TEXT NOT NULL,
  related_goals TEXT,
  context TEXT,
  factors TEXT,
  analysis TEXT,
  recommendations TEXT,
  acknowledged BOOLEAN NOT NULL DEFAULT 0,
  acknowledged_at TEXT,
  acknowledged_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Failure Timeline Table (for audit trail)
CREATE TABLE IF NOT EXISTS failure_timeline (
  id TEXT PRIMARY KEY,
  failure_report_id TEXT NOT NULL,
  event TEXT NOT NULL,
  actor TEXT,
  notes TEXT,
  previous_state TEXT,
  new_state TEXT,
  timestamp TEXT NOT NULL,
  FOREIGN KEY (failure_report_id) REFERENCES failure_reports(id) ON DELETE CASCADE
);

-- Failure Fingerprints Table
CREATE TABLE IF NOT EXISTS failure_fingerprints (
  id TEXT PRIMARY KEY,
  failure_report_id TEXT NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  components TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (failure_report_id) REFERENCES failure_reports(id) ON DELETE CASCADE
);

-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY,
  failure_report_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  category TEXT NOT NULL,
  estimated_effort TEXT,
  related_failures TEXT,
  implementation_guide TEXT,
  success_criteria TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (failure_report_id) REFERENCES failure_reports(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_failure_reports_type ON failure_reports(type);
CREATE INDEX IF NOT EXISTS idx_failure_reports_severity ON failure_reports(severity);
CREATE INDEX IF NOT EXISTS idx_failure_reports_domain ON failure_reports(domain);
CREATE INDEX IF NOT EXISTS idx_failure_reports_status ON failure_reports(verification_status);
CREATE INDEX IF NOT EXISTS idx_failure_reports_user ON failure_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_failure_reports_created ON failure_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_failure_reports_timestamp ON failure_reports(timestamp);

CREATE INDEX IF NOT EXISTS idx_risk_signals_type ON risk_signals(type);
CREATE INDEX IF NOT EXISTS idx_risk_signals_level ON risk_signals(level);
CREATE INDEX IF NOT EXISTS idx_risk_signals_detected ON risk_signals(detected_at);

CREATE INDEX IF NOT EXISTS idx_patterns_name ON failure_patterns(name);

CREATE INDEX IF NOT EXISTS idx_fingerprints_hash ON failure_fingerprints(hash);

-- Full-text search virtual tables
CREATE VIRTUAL TABLE IF NOT EXISTS fts_failure_reports USING fts5(
  id UNINDEXED,
  title,
  description,
  error_message,
  tags
);
