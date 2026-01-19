# Compliance Tracking System

This folder contains all compliance tracking documents for the calchowmuch project, ensuring full traceability from requirements to implementation to testing to production.

---

## Workflow Chain

```
Requirements Tracker → Build Tracker → Testing Tracker → SEO Tests Tracker → Universal Requirements → Compliance Report
     (REQ-XXX)         (BUILD-XXX)       (TTRK-XXX)          (SEO-XXX)           (Rule IDs)           (Final Matrix)
```

See [WORKFLOW.md](WORKFLOW.md) for detailed workflow documentation.

---

## Documents Overview

| Document | Purpose | Owner | ID Format |
|----------|---------|-------|-----------|
| [WORKFLOW.md](WORKFLOW.md) | Master workflow documentation | - | - |
| [requirements-tracker.md](requirements-tracker.md) | Track requirements from creation to completion | Copilot | REQ-[CAT]-XXX |
| [build-tracker.md](build-tracker.md) | Track implementation/build progress | Codex | BUILD-[CAT]-XXX |
| [testing-tracker.md](testing-tracker.md) | Track test execution and results | Codex | TTRK-[CAT]-XXX, TEST-[CAT]-XXX |
| [seo-tracker.md](seo-tracker.md) | Track SEO compliance testing | Codex | SEO-[CAT]-XXX |
| [issue-tracker.md](issue-tracker.md) | Track issues linked to requirements | All | ISS-XXX |
| [compliance-report.md](compliance-report.md) | Final compliance verification matrix | System | - |

---

## Workflow Integration

### Step 1: Copilot Creates Requirements
- Defines requirements in calculator MD files (e.g., `AUTO_LOAN_RULES.md`)
- Each requirement has Rule IDs (e.g., `AUTO-CAR-1`)
- Updates `requirements-tracker.md` with `REQ-XXX` entries

### Step 2: Codex Implements Requirements  
- Builds calculator based on requirements
- Updates `build-tracker.md` with `BUILD-XXX` status
- Links back to `REQ-XXX`

### Step 3: Codex Executes Tests
- Runs unit and E2E tests
- Updates `testing-tracker.md` with `TTRK-XXX` and `TEST-XXX` results
- Links back to `REQ-XXX` and `BUILD-XXX`

### Step 4: Codex Validates SEO
- Runs SEO compliance checks
- Updates `seo-tracker.md` with `SEO-XXX` results
- Links back to `BUILD-XXX`

### Step 5: Universal Requirements Validation
- Verifies all Rule IDs from `UNIVERSAL_REQUIREMENTS.md` are followed
- Updates compliance status

### Step 6: Compliance Report Generated
- `compliance-report.md` aggregates all tracker data
- Provides final compliance matrix with pass/fail status

---

## Traceability Matrix

Each requirement MUST have:
- Unique Requirement ID (`REQ-XXX`)
- Associated Rule IDs from calculator MD files
- Build Tracker ID (`BUILD-XXX`)
- Testing Tracker ID (`TTRK-XXX`)
- Test IDs (`TEST-XXX`)
- SEO Test ID (`SEO-XXX`)
- Universal Requirements compliance status

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

- **Add New Requirement**: Update `requirements-tracker.md`
- **Track Build**: Update `build-tracker.md`
- **Record Test Results**: Update `testing-tracker.md`
- **Check SEO**: Update `seo-tracker.md`
- **Report Issue**: Update `issue-tracker.md`
- **View Compliance**: See `compliance-report.md`