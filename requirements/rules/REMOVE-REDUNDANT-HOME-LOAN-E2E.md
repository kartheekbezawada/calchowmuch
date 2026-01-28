# REMOVE-REDUNDANT-HOME-LOAN-E2E: Remove Redundant Home Loan E2E Spec

**REQ_ID:** REQ-20260128-002  
**Priority:** LOW  
**Type:** Housekeeping  
**Change Type:** Test Cleanup  

---

## §1 Problem Statement

A redundant or obsolete end-to-end (E2E) test spec exists for the Home Loan Calculator under `tests/e2e`. This file is no longer required and should be removed to reduce maintenance overhead and avoid confusion.

## §2 Scope

- **Target File:** Any E2E spec for Home Loan Calculator under `tests/e2e/` (e.g., `tests/e2e/calculators/home-loan.spec.js`)
- **Exclusions:** Do not remove unit or integration tests; only the redundant E2E spec.

## §3 Acceptance Criteria

- [ ] The redundant E2E spec file for Home Loan Calculator is deleted from the repository.
- [ ] No references to the deleted file remain in test runners or documentation.
- [ ] No impact on other calculator E2E tests or coverage.
- [ ] Requirement is tracked and closed in compliance records.

## §4 Implementation Notes

- Confirm the file is not required by any current test plan or compliance rule.
- Update documentation or test runner configs if necessary.
- Mark this requirement as COMPLETE once the file is removed and verified.

---

**Status:** NEW  
**Next Action:** Developer must trigger with `EVT_START_BUILD REQ-20260128-002`  
**Dependencies:** None  
**Impact:** Test suite clarity and maintainability improvement
