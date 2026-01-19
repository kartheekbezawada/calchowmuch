# Compliance Tracking System

This folder contains all compliance tracking documents for the calchowmuch project, ensuring deterministic, state-driven traceability from requirements to release readiness.

---

## Workflow Chain (FSM)

```
requirement_tracker.md -> build_tracker.md -> testing_tracker.md -> seo_requirements.md -> compliance-report.md
      (REQ-...)             (BUILD-...)         (TEST-...)            (SEO-...)
```

See [WORKFLOW.md](WORKFLOW.md) for the full finite-state machine and allowed transitions.

---

## Documents Overview

| Document | Purpose | Owner | ID Format |
|----------|---------|-------|-----------|
| [WORKFLOW.md](WORKFLOW.md) | FSM workflow documentation | - | - |
| [requirement_tracker.md](requirement_tracker.md) | System-of-record for requirement definitions | Copilot (create), Codex (verify) | REQ-YYYYMMDD-### |
| [build_tracker.md](build_tracker.md) | Build/implementation tracking | Codex | BUILD-YYYYMMDD-HHMMSS |
| [testing_tracker.md](testing_tracker.md) | Test execution tracking | Codex | TEST-YYYYMMDD-HHMMSS |
| [seo_requirements.md](seo_requirements.md) | SEO requirements + validation tracking | Codex | SEO-... / SEO-PENDING-REQ-XXXX |
| [issue_tracker.md](issue_tracker.md) | Issues created during FSM runs | Codex | ISSUE-YYYYMMDD-### |
| [compliance-report.md](compliance-report.md) | Final compliance verification matrix | System | - |

---

## Workflow Integration (Auto-Advance)

- Human requests Copilot to draft requirements (S0 -> S1).
- Human requests Codex to process a specific REQ (S2 -> S13 or S14).
- Codex auto-advances through the FSM after S2_PREFLIGHT and updates trackers only in allowed states.

---

## Traceability Requirements

Each FSM requirement must have:
- Requirement ID (`REQ-YYYYMMDD-###`)
- Build ID (`BUILD-YYYYMMDD-HHMMSS`)
- Test Run ID (`TEST-YYYYMMDD-HHMMSS`)
- SEO ID or placeholder (`SEO-...`, `SEO-PENDING-REQ-XXXX`, or `SEO-N/A`)
- Issue IDs created during the run (if any)

---

## Rule References

All compliance checks reference rule IDs from:
- [Universal Requirements](../universal/UNIVERSAL_REQUIREMENTS.md) - UI, coding, testing standards
- [Calculator Hierarchy](../universal/calculator-hierarchy.md) - Navigation structure
- Category-specific requirements:
  - `/loans/AUTO_LOAN_RULES.md`
  - `/loans/BUY_TO_LET_RULES.md`
  - `/loans/CREDIT_CARD_RULES.md`
  - `/loans/HOME_LOAN.MD`
  - `/loans/HOW_MUCH_CAN_I_BORROW_RULES.md`
  - `/loans/LOAN_EMI.md`
  - `/math/Statistics.md`

---

## Quick Links

- **Add New Requirement**: Update `requirement_tracker.md`
- **Track Build**: Update `build_tracker.md`
- **Record Test Results**: Update `testing_tracker.md`
- **Check SEO**: Update `seo_requirements.md`
- **Report Issue**: Update `issue_tracker.md`
- **View Compliance**: See `compliance-report.md`
