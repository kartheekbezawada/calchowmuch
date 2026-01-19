# Issue Tracker (Compliance Integration)

This document extends the main [issues.md](../../issues.md) with compliance tracking integration, linking issues to requirements and tests.

## Issue-Requirement-Test Traceability

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

## Issue Creation Template

When creating new issues, MUST include:

```markdown
**Issue ID**: ISS-XXX
**Related Requirements**: REQ-XXX (specify which rule violated)
**Related Tests**: TEST-XXX (prevention test needed)
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