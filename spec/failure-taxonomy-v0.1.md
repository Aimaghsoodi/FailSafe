# FailSafe Taxonomy v0.1.0

Complete AI Failure Classification System

Version: 0.1.0
Date: February 2026
Status: Specification

## Overview

This taxonomy organizes AI failures into 7 primary domains with 40+ subtypes.
Each failure includes severity level, indicators, and remediation guidance.

## 1. LEGAL FAILURES

### 1.1 Compliance Violations
- GDPR/Privacy Regulation Breach (Critical)
- Healthcare Regulation Violation HIPAA (Critical)
- Financial Services Regulation Breach (Critical)
- AI-Specific Regulation Violation (High)

### 1.2 Copyright & IP Violations
- Copyright Infringement Training Data (High)
- Patent Infringement (High)
- Trademark Violation (Medium)
- Trade Secret Misuse (High)

### 1.3 Contract Violations
- SLA Breach (High)
- Data Processing Agreement Violation (High)
- License Abuse (Medium)

### 1.4 Ethical/Rights Violations
- Discrimination (Critical)
- Right to Explanation Violation (High)
- Consent Violation (High)
- Right to Appeal Violation (High)

## 2. MEDICAL FAILURES

### 2.1 Safety & Efficacy
- Diagnosis Accuracy Failure (Critical)
- Treatment Recommendation Error (Critical)
- Drug Interaction Failure (Critical)
- Dosage Calculation Error (Critical)

### 2.2 Diagnostic Accuracy
- False Negative Missed Positive (Critical)
- False Positive Incorrect Positive (High)
- Severity Misclassification (High)

### 2.3 Data Quality & Privacy
- Patient Data Corruption (Critical)
- Medical Privacy Breach (Critical)

### 2.4 Patient Autonomy & Consent
- Informed Consent Failure (High)
- Autonomous Decision Override (Critical)

## 3. FINANCIAL FAILURES

### 3.1 Calculation & Accuracy
- Arithmetic Error (High)
- Compound Interest Amortization Error (High)
- Exchange Rate Error (High)
- Tax Calculation Failure (High)
- Valuation Error (High)

### 3.2 Recommendation Failures
- Unsuitability (High)
- Conflict of Interest (High)
- Excessive Risk (High)
- Fraud/Scam Recommendation (Critical)

### 3.3 Trading & Execution
- Erroneous Trade Execution (High)
- Market Manipulation (Critical)
- Insider Trading (Critical)
- Failed Hedge (High)

### 3.4 Compliance & Reporting
- Suspicious Activity Reporting SAR Failure (Critical)
- KYC/AML Non-Compliance (Critical)
- Regulatory Reporting Error (Critical)
- Capital Requirement Violation (Critical)

## 4. CODING FAILURES

### 4.1 Logic & Correctness
- Algorithm Incorrectness (High)
- Off-By-One Error (Medium)
- Race Condition (High)
- Null Pointer Undefined Reference (High)
- Type Error Type Coercion Bug (Medium)

### 4.2 Security Vulnerabilities
- SQL Injection (Critical)
- Cross-Site Scripting XSS (Critical)
- Authentication/Authorization Bypass (Critical)
- Cryptography Failure (Critical)
- Hardcoded Secret (Critical)

### 4.3 Performance
- Memory Leak (High)
- Algorithmic Complexity Failure (High)
- Inefficient Database Query (High)
- Blocking Operation (Medium)

### 4.4 Standards & Best Practices
- Naming Convention Violation (Low)
- Missing Documentation (Low)
- Dead Code (Low)
- DRY Violation (Low)

## 5. FACTUAL FAILURES

### 5.1 Hallucinations & Fabrications
- Citation Fabrication (High)
- Statistic Fabrication (High)
- Person/Place/Event Fabrication (High)
- Procedural Hallucination (High)
- Product/Technical Hallucination (High)

### 5.2 Outdated Information
- Expired Law/Regulation (High)
- Deprecated Technology (Medium)
- Outdated Medical Information (Critical)
- Obsolete Business Information (Medium)

### 5.3 Misattribution
- Quote Misattribution (Medium)
- Idea Misattribution (Medium)
- Data Misattribution (Medium)

### 5.4 Contextual Failure
- Overgeneralization (High)
- Context Loss (High)
- Inapplicable Analogy (High)

## 6. REASONING FAILURES

### 6.1 Logic Errors
- Affirming the Consequent (High)
- Denying the Antecedent (High)
- False Dilemma (High)
- Begging the Question (High)
- Equivocation (High)

### 6.2 Premise Failures
- Unsupported Assumption (High)
- False Premise (High)
- Inconsistent Premises (High)

### 6.3 Inference Failures
- Hasty Generalization (High)
- Correlation vs Causation (High)
- Appeal to Authority Fallacy (High)
- Slippery Slope Without Justification (High)

## 7. TEMPORAL FAILURES

### 7.1 Deadline & Scheduling
- Missed Deadline (High)
- Scheduling Conflict (High)
- Inadequate Buffer (Medium)
- Cascading Delay (High)

### 7.2 Temporal Consistency
- Stale Data (High)
- Version Mismatch (High)
- State Machine Violation (High)
- Transaction Consistency (Critical)

### 7.3 Temporal Logic
- Event Order Reversal (High)
- Time Zone Error (High)
- Leap Second Calendar Error (Medium)
- Wait/Timeout Miscalculation (High)

## Severity Scale

| Level | Impact | Response Time |
|-------|--------|----------------|
| 1-Critical | System failure, legal liability, safety risk | < 1 hour |
| 2-High | Significant impact, compliance issue | < 4 hours |
| 3-Medium | Moderate impact, user inconvenience | < 24 hours |
| 4-Low | Minor impact, edge case | < 1 week |
| 5-Minimal | Negligible impact, informational | Backlog |

Version: 0.1.0
Last Updated: February 2026
