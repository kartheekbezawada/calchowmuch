# Issue Tracker (FSM Runs)

## Tracker Contract (No Duplicates)

**Uniqueness rule:** Each Issue ID MUST appear **exactly once** in the table.  
**Issue ID format (recommended):** `ISSUE-YYYYMMDD-HHMMSS` (UTC) — timestamp IDs eliminate reuse.  
**If legacy sequence IDs are used:** you MUST allocate the next unused `ISSUE-YYYYMMDD-###` number for that date.

**Allowed Status values:** OPEN, IN_PROGRESS, RESOLVED, CLOSED

---


This document is the system of record for issues created during FSM runs. Existing issues outside the current run are not in scope.

## FSM Issues (Authoritative)

| Issue ID | Requirement ID | Build/Test ID | Summary | Owner | Priority | Status | Evidence/Notes | Created |
|----------|----------------|---------------|---------|-------|----------|--------|----------------|---------|
| ISSUE-20260119-001 | REQ-20260119-001 | TEST-20260119-153209 | Fix buy-to-let utils test import paths | Codex | MEDIUM | RESOLVED | Updated test imports to ../../../public/... | 2026-01-19 15:33:37 |
| ISSUE-20260119-002 | REQ-20260119-003 | TEST-20260119-192244 | Playwright e2e failures across BOR/PERC/REMO/BTL/ISS-001 suites | Release Owner | HIGH | OPEN | See `test-results/` (e.g., input maxlength, result visibility, layout snapshot diffs) | 2026-01-19 19:24:34 |
| ISSUE-20260119-002 | REQ-20260119-002 | TEST-20260119-184219 | Playwright deps missing in WSL (libnspr4.so) | Release Owner | HIGH | OPEN | `npm run test:e2e` failed; chromium_headless_shell cannot load libnspr4.so | 2026-01-19 18:45:10 |
| ISSUE-20260119-003 | REQ-20260119-003 | TEST-20260119-200506 | Playwright e2e failures across BOR/REMO/BTL/ISS-001 suites | Release Owner | HIGH | OPEN | See `test-results/` (e.g., BOR currency symbol, Trebuchet font, REMO graph markers) | 2026-01-19 20:06:26 |
| ISSUE-20260119-004 | REQ-20260119-003 | TEST-20260119-201551 | Playwright e2e failures across BOR/BTL/ISS-001 suites | Release Owner | HIGH | OPEN | See `test-results/` (e.g., BOR font/currency, BTL tooltip/labels, ISS-001 screenshot diff) | 2026-01-19 20:16:50 |
| ISSUE-20260119-005 | REQ-20260119-003 | TEST-20260119-203815 | ISS-001 layout snapshot diff persists after shell adjustments | Release Owner | HIGH | OPEN | See `test-results/e2e-iss-001-layout-stabili-52f2e-ion---page-layout-stability-chromium/` | 2026-01-19 20:39:44 |
| ISSUE-20260120-001 | REQ-20260120-016 | TEST-20260120-100053 | Playwright e2e failures across BOR/BTL/ISS-001 suites | Release Owner | HIGH | RESOLVED | `npx playwright test` passed (86 tests) | 2026-01-20 02:29:40 |
| ISSUE-20260120-002 | REQ-20260120-018 | BUILD-20260120-214145 | SEO metadata, structured data, and sitemap updates implemented for the trigonometry suite | SEO Owner | MEDIUM | RESOLVED | setPageMetadata helper + structured-data.json + sitemap updates added for all five trigonometry pages; resolved 2026-01-20 21:42:40 | 2026-01-20 21:16:10 |

Notes:
- Use ISSUE-YYYYMMDD-### when creating issues in S6, S9, or S12.
- Only issues created during the active FSM run count as active blockers.

---

## Issue Resolution Summary

| Status | Count | Percentage |
|--------|-------|------------|
| OPEN | 6 | 86% |
| RESOLVED | 1 | 14% |
| CLOSED | 0 | 0% |

---

## Issue Categories

| Category | Count | Priority Breakdown |
|----------|-------|-----------------------|
| Test Failures | 4 | HIGH: 4, MEDIUM: 0, LOW: 0 |
| Configuration | 0 | HIGH: 0, MEDIUM: 0, LOW: 0 |
| Performance | 0 | HIGH: 0, MEDIUM: 0, LOW: 0 |
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

## Template (New Issue)

```markdown
| ISSUE-YYYYMMDD-HHMMSS | REQ-YYYYMMDD-### | BUILD-... / TEST-... | [Summary] | [Owner] | P0/P1/P2/P3 | OPEN/IN_PROGRESS/RESOLVED/CLOSED | [Evidence/Notes] | [Created UTC] |
```
