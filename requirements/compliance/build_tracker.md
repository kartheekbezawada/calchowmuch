# Build Tracker

This document is the system of record for FSM build runs.

## FSM Build Status Definitions
- **RUNNING**: Build in progress (S4_BUILD_RUNNING).
- **FAILED**: Build failed (S5_BUILD_FAILED_RETRYABLE).
- **PASSED**: Build completed and artifacts recorded (S7_BUILD_PASSED).
- **AUTO_ABORT**: Build aborted after retry budget (S6_BUILD_ABORTED).
- **SUCCESS**: Final verification complete (S11_TRACKERS_UPDATED).
- Legacy statuses (Not Started/In Progress/Complete/Deployed) apply only to the legacy backlog below.

---

## FSM Build Runs (Authoritative)

| Build ID | Requirement ID | Initiator | Start Time | Status | Attempt | Evidence/Artifacts | Notes |
|----------|----------------|-----------|------------|--------|---------|--------------------|-------|
| BUILD-20260119-140637 | REQ-20260119-001 | Codex | 2026-01-19 14:06:43 | FAILED | 1 | `npm run lint` -> npm not found (bash + PowerShell) | Auto-advance build start |
| BUILD-20260119-140637 | REQ-20260119-001 | Codex | 2026-01-19 15:31:28 | PASSED | 2 | `npm run lint` ok | Retry after Node install |
| BUILD-20260119-140637 | REQ-20260119-001 | Codex | 2026-01-19 15:33:55 | SUCCESS | 3 | `npm run lint` ok | Verified 2026-01-19 15:35:14 after tests |
| BUILD-20260119-171813 | REQ-20260119-002 | Codex | 2026-01-19 17:18:23 | RUNNING | 1 | Pending Windows PowerShell build run | Auto-advance build start |
| BUILD-20260119-171813 | REQ-20260119-002 | Codex | 2026-01-19 17:19:06 | FAILED | 1 | `powershell.exe` not executable here; run `npm run lint` in Windows PowerShell | Build blocked in non-Windows environment |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:27:34 | RUNNING | 1 | Pending `npm run lint` (Linux) | Auto-advance build start |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:27:51 | FAILED | 1 | `npm run lint` -> /bin/bash: npm: command not found | Node/NPM missing in WSL; build blocked |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:33:56 | RUNNING | 2 | Pending `npm run lint` (Linux) | Retry build |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:36:04 | FAILED | 2 | `npm run lint` -> /bin/bash: npm: command not found | Node/NPM missing in WSL; retry blocked |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:41:50 | RUNNING | 3 | Pending `npm run lint` (Linux) | Retry build after Node install |
| BUILD-20260119-182726 | REQ-20260119-002 | Codex | 2026-01-19 18:42:08 | PASSED | 3 | `npm run lint` ok | Lint-only build step |

Notes:
- Attempt starts at 1 and increments on each retry.
- Final Status: SUCCESS is recorded in S11 after tests pass and trackers are updated.

---

## Legacy Backlog (pre-FSM)

| Build ID | Requirement ID | Associated Rule IDs | Component | Description | Status | Assigned To | Build Started | Build Completed | Deployed Date | Notes |
|----------|---------------|-------------------|-----------|-------------|--------|-------------|---------------|-----------------|---------------|-------|
| BUILD-AUTO-001 | REQ-AUTO-001 | AUTO-CAR-1 to AUTO-CAR-5 | Car Loan Calculator | Implement car loan calculator | Not Started | Codex | - | - | - | Per AUTO_LOAN_RULES.md |
| BUILD-AUTO-002 | REQ-AUTO-002 | AUTO-MULTI-1 to AUTO-MULTI-4 | Multi-Car Loan | Implement multi-car loan comparison | Not Started | Codex | - | - | - | Per AUTO_LOAN_RULES.md |
| BUILD-AUTO-003 | REQ-AUTO-003 | AUTO-HP-1 to AUTO-HP-4 | Hire Purchase | Implement hire purchase calculator | Not Started | Codex | - | - | - | Per AUTO_LOAN_RULES.md |
| BUILD-AUTO-004 | REQ-AUTO-004 | AUTO-PCP-1 to AUTO-PCP-4 | PCP Calculator | Implement PCP calculator | Not Started | Codex | - | - | - | Per AUTO_LOAN_RULES.md |
| BUILD-AUTO-005 | REQ-AUTO-005 | AUTO-LEASE-1 to AUTO-LEASE-3 | Leasing Calculator | Implement leasing calculator | Not Started | Codex | - | - | - | Per AUTO_LOAN_RULES.md |
| BUILD-BTL-001 | REQ-BTL-001 | BTL-NAV-1, BTL-IN-*, BTL-OUT-* | Buy-to-Let Calculator | Implement BTL calculator | Not Started | Codex | - | - | - | Per BUY_TO_LET_RULES.md |
| BUILD-CC-001 | REQ-CC-001 | CC-PAYOFF-1 to CC-PAYOFF-5 | Credit Card Payoff | Implement CC payoff calculator | Not Started | Codex | - | - | - | Per CREDIT_CARD_RULES.md |
| BUILD-CC-002 | REQ-CC-002 | CC-MIN-1 to CC-MIN-6 | Minimum Payment | Implement minimum payment calculator | Not Started | Codex | - | - | - | Per CREDIT_CARD_RULES.md |
| BUILD-CC-003 | REQ-CC-003 | CC-BT-1 to CC-BT-4 | Balance Transfer | Implement balance transfer calculator | Not Started | Codex | - | - | - | Per CREDIT_CARD_RULES.md |
| BUILD-CC-004 | REQ-CC-004 | CC-CONSOL-1 to CC-CONSOL-3 | CC Consolidation | Implement consolidation calculator | Not Started | Codex | - | - | - | Per CREDIT_CARD_RULES.md |
| BUILD-MTG-001 | REQ-MTG-001 | MTG-NAV-*, MTG-IN-*, MTG-OUT-* | Mortgage Calculator | Implement mortgage calculator | Not Started | Codex | - | - | - | Per HOME_LOAN.MD |
| BUILD-BOR-001 | REQ-BOR-001 | BOR-NAV-1, BOR-IN-*, BOR-OUT-*, BOR-VAL-* | Borrow Calculator | Implement borrow calculator | Not Started | Codex | - | - | - | Per HOW_MUCH_CAN_I_BORROW_RULES.md |
| BUILD-EMI-001 | REQ-EMI-001 | EMI-IN-*, EMI-OP-*, EMI-OUT-* | Loan EMI Calculator | Implement EMI calculator | Not Started | Codex | - | - | - | Per LOAN_EMI.md |
| BUILD-STAT-001 | REQ-STAT-001 | STAT-SD-1 to STAT-SD-5 | Standard Deviation | Implement std dev calculator | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-STAT-002 | REQ-STAT-002 | STAT-NS-1 to STAT-NS-4 | Number Sequence | Implement number sequence calculator | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-STAT-003 | REQ-STAT-003 | STAT-SS-1 to STAT-SS-4 | Sample Size | Implement sample size calculator | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-STAT-004 | REQ-STAT-004 | STAT-PROB-1 to STAT-PROB-4 | Probability | Implement probability calculator | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-STAT-005 | REQ-STAT-005 | STAT-CALC-1 to STAT-CALC-5 | Statistics | Implement general statistics calculator | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-STAT-006 | REQ-STAT-006 | STAT-MMM-1 to STAT-MMM-5 | Mean Median Mode Range | Implement MMMR calculator | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-STAT-007 | REQ-STAT-007 | STAT-PC-1 to STAT-PC-4 | Permutation Combination | Implement permutation/combination | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-STAT-008 | REQ-STAT-008 | STAT-Z-1 to STAT-Z-4 | Z-Score | Implement z-score calculator | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-STAT-009 | REQ-STAT-009 | STAT-CI-1 to STAT-CI-4 | Confidence Interval | Implement CI calculator | Not Started | Codex | - | - | - | Per Statistics.md |
| BUILD-NAV-001 | REQ-NAV-001 | UI-3.3, FS-5.1 | Navigation System | Implement calculator hierarchy navigation | Not Started | Codex | - | - | - | Per calculator-hierarchy.md |

---

## Legacy Build Dependencies (pre-FSM)

| Build ID | Depends On | Blocking |
|----------|-----------|----------|
| BUILD-AUTO-001 | - | BUILD-AUTO-002 |
| BUILD-MTG-001 | - | BUILD-BOR-001 |
| BUILD-NAV-001 | - | All calculators |

---

## Legacy Build Summary (pre-FSM)

| Date | Total Builds | Not Started | In Progress | Complete | Deployed | Failed |
|------|-------------|-------------|-------------|----------|----------|--------|
| 2026-01-19 | 23 | 23 | 0 | 0 | 0 | 0 |

---

## Legacy Build by Category (pre-FSM)

| Category | Total | Not Started | In Progress | Complete | Deployed |
|----------|-------|-------------|-------------|----------|----------|
| Auto Loans | 5 | 5 | 0 | 0 | 0 |
| Buy-to-Let | 1 | 1 | 0 | 0 | 0 |
| Credit Cards | 4 | 4 | 0 | 0 | 0 |
| Mortgage | 1 | 1 | 0 | 0 | 0 |
| Borrow | 1 | 1 | 0 | 0 | 0 |
| EMI | 1 | 1 | 0 | 0 | 0 |
| Statistics | 9 | 9 | 0 | 0 | 0 |
| Navigation | 1 | 1 | 0 | 0 | 0 |
| **TOTAL** | **23** | **23** | **0** | **0** | **0** |

---

## Template for New FSM Builds

```markdown
| BUILD-YYYYMMDD-HHMMSS | REQ-YYYYMMDD-### | [Human] | YYYY-MM-DD HH:MM:SS | RUNNING | 1 | [Artifacts/Logs] | [Notes] |
```
