# Loans Navigation — Test Scenarios

## Purpose
This document defines **behavioral test cases** for Copilot, Playwright, or LLM reviewers.

---

## TEST-LN-NAV-1 — Domain Switch

**Action**
- Click Loans button

**Expected**
- Loans navigation visible
- Math navigation hidden

**Rules Covered**
- LN-NAV-ROOT-1
- LN-NAV-ROOT-3

---

## TEST-LN-NAV-2 — Search Filtering

**Action**
- Type "mortgage" into Loans search box

**Expected**
- Only mortgage-related calculators visible
- No auto-navigation

**Rules Covered**
- LN-NAV-SEARCH-2
- LN-NAV-SEARCH-4

---

## TEST-LN-NAV-3 — Category Toggle

**Action**
- Collapse one loan category

**Expected**
- Only that category collapses
- No layout shift
- Active calculator unchanged

**Rules Covered**
- LN-NAV-CAT-3

---

## TEST-LN-NAV-4 — Deep Link Load

**Action**
- Open URL directly to Home Loan

**Expected**
- Loans tab active
- Correct category expanded
- Home Loan highlighted

**Rules Covered**
- LN-NAV-ITEM-3

---

## TEST-LN-NAV-5 — Category Size Limit

**Action**
- Inject >25 calculators into one category

**Expected**
- Test fails unless category subdivision exists

**Rules Covered**
- LN-NAV-LIMIT-1
- LN-NAV-LIMIT-2

---

## Failure Reporting Format

Violation:
- Rule ID:
- Severity:
- Evidence:
- Screenshot / DOM path (if applicable)
