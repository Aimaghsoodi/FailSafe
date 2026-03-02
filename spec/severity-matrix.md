# FailSafe Severity Matrix

Assessment criteria, remediation SLAs, and escalation procedures.

## Severity Levels and SLAs

### Level 1: CRITICAL
- **Impact:** System/business failure, legal liability, safety risk, death/serious injury
- **Response Time:** Immediate (< 1 hour)
- **Remediation Target:** < 4 hours
- **Escalation:** CEO, Legal, Product Lead
- **Communication:** Public notification likely required
- **Examples:** SQL Injection exploited, Patient misdiagnosis, Insider trading executed, Medical privacy breach

### Level 2: HIGH
- **Impact:** Significant impact, compliance issue, major user harm, regulatory finding
- **Response Time:** Urgent (< 4 hours)
- **Remediation Target:** < 24 hours
- **Escalation:** Department Lead, Compliance Officer
- **Communication:** Customer notification may be required
- **Examples:** Calculation error affecting 1000+ users, SLA breach, Failed hedge, Discrimination detected

### Level 3: MEDIUM
- **Impact:** Moderate impact, user inconvenience, minor compliance gap, limited scope
- **Response Time:** Standard (< 24 hours)
- **Remediation Target:** < 1 week
- **Escalation:** Team Lead, QA Manager
- **Communication:** Update in release notes
- **Examples:** Off-by-one error, Naming convention violation, Inadequate buffer, Type coercion bug

### Level 4: LOW
- **Impact:** Minor impact, edge case, cosmetic issue, single user affected
- **Response Time:** Planned (< 1 week)
- **Remediation Target:** < 1 month
- **Escalation:** Team Lead
- **Communication:** Backlog item
- **Examples:** Dead code, Missing documentation, Low-impact memory leak, Deprecated warning

### Level 5: MINIMAL
- **Impact:** Negligible impact, informational only, no user effect
- **Response Time:** Backlog (no deadline)
- **Remediation Target:** Next major release
- **Escalation:** None
- **Communication:** None required
- **Examples:** Code comment typo, Style improvement, Non-blocking logging improvement

---

## Domain-Specific Assessment Matrix

### LEGAL FAILURES
- Regulatory violation → Level 1
- Data privacy breach → Level 1
- Contract violation with legal exposure → Level 2
- License abuse → Level 3
- Documentation gap → Level 4

### MEDICAL FAILURES
- Patient safety compromise → Level 1
- Diagnosis error causing treatment delay → Level 2
- Data quality issue affecting care → Level 2
- Consent documentation missing → Level 3
- Privacy best practice violation → Level 4

### FINANCIAL FAILURES
- Market manipulation, insider trading → Level 1
- Calculation error affecting transactions → Level 1
- Regulatory compliance failure → Level 1
- SLA breach with customer impact → Level 2
- Minor calculation discrepancy → Level 3

### CODING FAILURES
- Security vulnerability (SQL Injection, XSS) → Level 1
- Authentication bypass → Level 1
- Hardcoded secret exposed → Level 1
- Algorithm incorrectness in critical path → Level 2
- Performance regression in release → Level 2

### FACTUAL FAILURES
- Hallucination in medical/legal context → Level 2
- Citation fabrication in academic context → Level 2
- Outdated medical information → Level 2
- Product feature hallucination → Level 3
- Minor outdated business info → Level 4

### REASONING FAILURES
- Logical error in medical decision → Level 2
- False premise in financial recommendation → Level 2
- Unsound argument in legal analysis → Level 3
- Logical inconsistency in narrative → Level 4

### TEMPORAL FAILURES
- Transaction atomicity violation → Level 1
- Deadline miss affecting business → Level 2
- Scheduling conflict affecting critical path → Level 2
- Stale data causing decision error → Level 3
- Minor timing inconsistency → Level 4

---

## Impact Quantification

### User/Customer Impact
- **Severity 1:** 10,000+ users or customer relationship at risk
- **Severity 2:** 100-10,000 users affected
- **Severity 3:** 10-100 users affected
- **Severity 4:** 1-10 users affected
- **Severity 5:** 0-1 users affected or no users affected

### Financial Impact
- **Severity 1:** > $1,000,000 or unbounded liability
- **Severity 2:** $100,000 - $1,000,000
- **Severity 3:** $10,000 - $100,000
- **Severity 4:** $1,000 - $10,000
- **Severity 5:** < $1,000

### Regulatory/Compliance Impact
- **Severity 1:** Violation of law, criminal liability, enforcement action risk
- **Severity 2:** Regulatory violation requiring notification, civil liability
- **Severity 3:** Compliance gap, documentation requirement
- **Severity 4:** Best practice violation, process improvement needed
- **Severity 5:** No regulatory impact

### Safety/Health Impact
- **Severity 1:** Death, serious injury, or immediate risk
- **Severity 2:** Significant health impact, treatment delay
- **Severity 3:** Minor health impact, patient inconvenience
- **Severity 4:** No health impact, process improvement
- **Severity 5:** Negligible or no health impact

---

## Escalation Procedures

### Level 1 (Critical) Escalation
1. Declare incident (t+0)
2. Notify: Incident Commander, CEO, Legal, Compliance (t+5 min)
3. Open war room / incident bridge (t+10 min)
4. Identify root cause (t+30 min)
5. Implement mitigation (t+1 hour)
6. Customer notification plan (t+30 min)
7. Post-mortem scheduled within 24 hours
8. Regulatory notification within required timeframe

### Level 2 (High) Escalation
1. Alert team lead and department head (t+0)
2. Create incident ticket (t+15 min)
3. Assign investigation owner (t+15 min)
4. Root cause analysis (t+4 hours)
5. Remediation plan (t+8 hours)
6. Customer communication if needed (t+12 hours)
7. Resolved and verified (t+24 hours)
8. Incident retrospective within 1 week

### Level 3 (Medium) Escalation
1. Create ticket in backlog (t+0)
2. Assign to engineer (t+1 day)
3. Estimate remediation (t+2 days)
4. Fix and test (t+1 week)
5. Deploy and verify (t+1 week)
6. Close ticket

### Level 4 (Low) Escalation
1. Add to backlog
2. Prioritize with other low-priority work
3. Fix when convenient
4. No formal escalation required

### Level 5 (Minimal) Escalation
1. Backlog only
2. Fix if work on related area
3. No formal tracking required

---

## Assessment Worksheet

When discovering a failure, use this worksheet:

```
Failure Discovery Worksheet

1. Category: [ ] Legal [ ] Medical [ ] Financial [ ] Coding [ ] Factual [ ] Reasoning [ ] Temporal

2. Type: _______________
   Subtype: _______________

3. Immediate Impact:
   - Users affected: _______
   - Financial impact: $_______
   - Safety risk: [ ] Yes [ ] No
   - Legal exposure: [ ] Yes [ ] No

4. Scope:
   - Single user: [ ]
   - Limited (< 1%): [ ]
   - Moderate (1-10%): [ ]
   - Widespread (> 10%): [ ]
   - System-wide: [ ]

5. Detection:
   - Customer complaint: [ ] Yes [ ] No
   - Internal discovery: [ ] Yes [ ] No
   - Monitoring alert: [ ] Yes [ ] No
   - Other: [ ]

6. Reproducibility:
   - Always: [ ] Always [ ] Sometimes [ ] Rarely [ ] Unknown

7. Severity Assessment:
   - Initial estimate: [ ] 1-Critical [ ] 2-High [ ] 3-Medium [ ] 4-Low [ ] 5-Minimal
   - Reviewed by: _______________
   - Final severity: [ ] 1-Critical [ ] 2-High [ ] 3-Medium [ ] 4-Low [ ] 5-Minimal

8. Escalation Required:
   - [ ] CEO/Board
   - [ ] Legal
   - [ ] Compliance
   - [ ] Regulatory notification
   - [ ] Customer notification
   - [ ] Public disclosure

9. Response Target:
   - Response by: ___ (date/time)
   - Resolution by: ___ (date/time)
   - Verification by: ___ (date/time)
```

---

## Cross-Domain Severity Adjustment

Some failures impact multiple domains. In such cases:

- Maximum severity applies
- Example: Calculation error affecting patient dosage = Medical (Critical) + Financial (High) + Legal (High) = Level 1 Critical
- Cross-domain failures require broader escalation

---

## Remediation SLA Tracking

- All Level 1 failures tracked in daily executive report
- Level 2 failures tracked weekly
- Monthly retrospective on all failures to identify patterns
- Target: < 80% of failures repeat

---

Version: 0.1.0
Last Updated: February 2026
