# ARCHIVE_REQ_20260126_010_RULES.md

**REQ_ID:** REQ-20260126-011  
**Title:** Archive Completed REQ-20260126-010 Tracker Rows  
**Change Type:** Archive/Cleanup  

---

## Goal

Archive completed tracker rows for REQ-20260126-010 across all compliance ledgers and perform approved cleanup of temporary artifacts, following the repo's archive/retention rules.

---

## Scope

**This REQ is for housekeeping only—no functional changes.**

### Target REQ for Archival
- **REQ-20260126-010:** Switch Calculator Navigation to Full Page Loads (MPA)
- **Status:** COMPLETE
- **All related tracker entries:** COMPLETE/PASS status

---

## Archive Operations Required

### 1. Requirement Tracker Archival
**File:** `requirements/compliance/requirement_tracker.md`
- Move REQ-20260126-010 row from Active Requirements to Archive section
- Update Archive entry with completion metadata

### 2. SEO Tracker Archival
**File:** `requirements/compliance/seo_tracker.md`
- Move SEO-REQ-20260126-006 (REQ-20260126-010) from Active Validations to Archive section
- Status: PASS - all validations complete

### 3. Build Tracker Archival
**File:** `requirements/compliance/build_tracker.md`
- Archive completed BUILD entries for REQ-20260126-010:
  - BUILD-20260126-221901 (COMPLETE)
  - BUILD-20260126-212224 (COMPLETE)

### 4. Testing Tracker Archival
**File:** `requirements/compliance/testing_tracker.md`
- Archive completed TEST entries for REQ-20260126-010:
  - TEST-20260126-222306 (ISS-001, COMPLETE)
  - TEST-20260126-221055 (ISS-001, COMPLETE)
  - TEST-20260126-221059 (E2E, COMPLETE)

### 5. Compliance Report
**File:** `requirements/compliance/compliance-report.md`
- Verify REQ-20260126-010 has COMPLIANCE PASS entry
- Archive if complete

---

## Cleanup Operations

### 1. Snapshot File Documentation
- Document any updated snapshot files from testing:
  - `requirements/specs/e2e/iss-design-001.spec.js` (snapshots updated)
  - `requirements/specs/e2e/age-calculator.spec.js`
  - `requirements/specs/e2e/remortgage-switching.spec.js`
- Verify snapshot updates are committed and documented

### 2. Iteration Files
- Review iteration files for REQ-20260126-010:
  - `iterations/ITER-20260126-221901.md`
  - `iterations/ITER-20260126-212224.md`
- Ensure proper retention according to repo rules

---

## Archive Format Rules

### Requirement Tracker Archive Entry
```markdown
| REQ-20260126-010 | Switch Calculator Navigation to Full Page Loads (MPA) | COMPLETE | 2 | 2026-01-26 22:21 |
```

### SEO Tracker Archive Entry
```markdown
| SEO-REQ-20260126-006 | REQ-20260126-010 | All Calculator Pages (MPA) | PASS | 2026-01-26 |
```

### Build/Test Tracker Archive Entries
- Move to Archive sections with original metadata intact
- Preserve completion timestamps
- Maintain iteration cross-references

---

## Acceptance Criteria

**MUST HAVE:**
- [ ] REQ-20260126-010 moved to Archive section in requirement_tracker.md
- [ ] SEO-REQ-20260126-006 moved to Archive section in seo_tracker.md
- [ ] All BUILD entries for REQ-20260126-010 moved to Archive sections
- [ ] All TEST entries for REQ-20260126-010 moved to Archive sections
- [ ] Compliance report updated/archived if applicable
- [ ] Active sections no longer contain REQ-20260126-010 references
- [ ] Archive entries include proper completion metadata
- [ ] Snapshot file documentation complete

**SHOULD HAVE:**
- [ ] Iteration files reviewed and retained per repo policy
- [ ] Cleanup documented in archive entries
- [ ] Cross-references maintained in archived entries

**VALIDATION:**
- [ ] All tracker Active sections clean of REQ-20260126-010
- [ ] Archive sections properly formatted
- [ ] No functional changes to codebase
- [ ] Tracker file structure preserved

---

## Non-Goals

- No functional changes to calculators or navigation
- No deletion of iteration files (follow retention policy)
- No changes to test snapshots (document only)
- No modification of completed builds or tests

---

## Change Type
Archive/Cleanup (housekeeping operations only)

---

## Priority
**LOW** - Housekeeping task with no user impact

---

## Dependencies
- REQ-20260126-010 must have COMPLETE status
- All related tracker entries must be COMPLETE/PASS
- Archive sections must exist in tracker files