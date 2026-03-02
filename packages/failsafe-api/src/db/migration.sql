-- Migration 001: Initial schema
-- This file is kept for reference; schema.sql contains the complete schema

-- Version tracking table
CREATE TABLE IF NOT EXISTS schema_versions (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TEXT NOT NULL
);

-- Insert version 1 if not exists
INSERT OR IGNORE INTO schema_versions (version, name, applied_at)
VALUES (1, '001_initial', datetime('now'));
