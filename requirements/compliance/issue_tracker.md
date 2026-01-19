# Issue Tracker (FSM Runs)

This document is the system of record for issues created during FSM runs. Existing issues outside the current run are not in scope.

## FSM Issues (Authoritative)

| Issue ID | Requirement ID | Build/Test ID | Summary | Owner | Priority | Status | Evidence/Notes | Created |
|----------|----------------|---------------|---------|-------|----------|--------|----------------|---------|
| ISSUE-20260119-001 | REQ-20260119-001 | TEST-20260119-153209 | Fix buy-to-let utils test import paths | Codex | MEDIUM | RESOLVED | Updated test imports to ../../../public/... | 2026-01-19 15:33:37 |
| ISSUE-20260119-002 | REQ-20260119-003 | TEST-20260119-192244 | Playwright e2e failures across BOR/PERC/REMO/BTL/ISS-001 suites | Release Owner | HIGH | OPEN | See `test-results/` (e.g., input maxlength, result visibility, layout snapshot diffs) | 2026-01-19 19:24:34 |
| ISSUE-20260119-002 | REQ-20260119-002 | TEST-20260119-184219 | Playwright deps missing in WSL (libnspr4.so) | Release Owner | HIGH | OPEN | `npm run test:e2e` failed; chromium_headless_shell cannot load libnspr4.so | 2026-01-19 18:45:10 |

Notes:
- Use ISSUE-YYYYMMDD-### when creating issues in S6, S9, or S12.
- Only issues created during the active FSM run count as active blockers.

---

## Legacy Issue Log (pre-FSM)

| Issue ID | Related Req ID | Related Test ID | Category | Status | Severity | Compliance Impact | Resolution Status |
|----------|---------------|----------------|----------|--------|----------|------------------|-------------------|
| ISS-001 | REQ-003 | TEST-004 | UI/Layout | Resolved | P1 | Universal Requirements UI-3.x | ✅ Resolved with regression test |
| ISS-002 | REQ-003 | TEST-004 | UI/Scrollbar | Resolved | P2 | Universal Requirements UI-3.4 | ✅ Resolved with styling update |
| ISS-003 | REQ-003 | TEST-004 | UI/Scrollbar | Resolved | P2 | Universal Requirements UI-3.4 | ✅ Resolved with color update |
| ISS-004 | REQ-003 | TEST-004 | UI/Layout | Resolved | P1 | Universal Requirements UI-3.3 | ✅ Resolved with layout fix |
| ISS-005 | REQ-003 | TEST-004 | Navigation/UI | Resolved | P1 | Universal Requirements UI-3.3 | ✅ Resolved with nav stabilization |

## Compliance Impact Categories

### Universal Requirements Impact
- **UI-3.x**: User interface contract violations
- **FS-5.x**: Folder structure violations  
- **CS-6.x**: Coding standards violations
- **TS-7.x**: Testing standards violations
- **SEO-8.x**: SEO compliance violations

### Issue Resolution Requirements
1. **Root Cause Analysis**: Must identify which Universal Requirements rule was violated
2. **Fix Implementation**: Must address the rule violation directly
3. **Regression Prevention**: Must add test cases to prevent recurrence
4. **Compliance Verification**: Must update compliance-report.md status

## Active Issues Requiring Attention

| Issue ID | Priority | Requirement Impact | Test Coverage | Next Action |
|----------|----------|-------------------|---------------|-------------|
| - | - | - | - | - |

## Issue Creation Template (FSM)

When creating new issues, MUST include:

```markdown
**Issue ID**: ISSUE-YYYYMMDD-###
**Related Requirements**: REQ-YYYYMMDD-### (specify which rule violated)
**Related Builds/Tests**: BUILD-YYYYMMDD-HHMMSS / TEST-YYYYMMDD-HHMMSS
**Compliance Impact**: [Universal Requirements rule ID]
**Severity**: P0/P1/P2/P3
**Category**: UI/Navigation/Calculator/etc.
```

## Prevention Metrics

| Month | New Issues | Resolved Issues | Prevention Tests Added | Repeat Issues |
|-------|------------|-----------------|----------------------|---------------|
| Jan 2026 | 5 | 5 | 1 | 0 |

## Notes
- All issues MUST be linked to requirements and tests for full traceability
- Resolved issues remain tracked for compliance audit trail
- Prevention tests are mandatory for P0/P1 issues
