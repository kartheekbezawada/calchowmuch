# Requirement Tracker

> **Purpose:** Registry of formal requirements  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Requirements

| REQ_ID | Title | Type | Change Type | Priority | Status | SEO? |
|--------|-------|------|-------------|----------|--------|------|
| REQ-20260124-001 | Purple Theme Refresh | Theme | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260124-002 | Light Green Page Background | Theme | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260124-003 | Increase Light Green Intensity | Theme | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260124-004 | Footer Content | Site | Layout/CSS | MEDIUM | COMPLETE | YES |
| REQ-20260124-005 | Footer Links Flush to Bottom Bar | Site | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260124-006 | Subtle Panel Corner Radius | UI | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260124-007 | Reduce Light Green Intensity | Theme | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260124-008 | Remove Homepage Tagline | Site | Content | MEDIUM | COMPLETE | YES |
| REQ-20260124-009 | Remove Nav Search and Label | Site | UI/Flow | MEDIUM | COMPLETE | NO |
| REQ-20260124-010 | System Font Stack + Typography Scale | Theme | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260125-001 | Footer Layout & Positioning Refresh | Site | Layout/CSS | MEDIUM | COMPLETE | YES |
| REQ-20260125-002 | Light Green Background Reset | Theme | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260125-003 | Footer Full-Width Container | Site | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260125-004 | Sitemap Page + Footer Link | Site | UI/Flow + SEO | HIGH | COMPLETE | YES |
| REQ-20260125-005 | Home Page Shell-Only Content | Site | UI/Flow | HIGH | COMPLETE | NO |
| REQ-20260125-006 | Grey Scrollbars for Nav/Calc/Explanation | UI | Layout/CSS | MEDIUM | COMPLETE | NO |
| REQ-20260125-007 | Math Navigation Expandable Icons | Navigation | UI/Flow | HIGH | BLOCKED | NO |
| REQ-20260125-100 | Remortgage Switching Output Ownership & ISS | UI/Calculation | UI/Flow + ISS | P0 | COMPLETE | NO |
| REQ-20260126-001 | Remortgage Calculator UI/UX Improvements | Calculator | UI/Flow | HIGH | COMPLETE | NO |
| REQ-20260126-002 | Remortgage Calculator: No Vertical Scroll in Calculation Pane | Calculator | Layout/CSS | HIGH | COMPLETE | NO |
| REQ-20260126-003 | Remortgage Calc: Input Reflow for 1366x768 Viewport | Calculator | Layout/CSS | HIGH | COMPLETE | NO |
| REQ-20260126-004 | Revert REQ-20260126-003 Implementation | Calculator | Layout/CSS | HIGH | COMPLETE | NO |
| REQ-20260126-005 | Sleep Time Calculator (Time & Date) | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260126-006 | Wake-Up Time Calculator (Time & Date) | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260126-007 | Time Between Two Dates Calculator (Time & Date) | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260126-008 | Days Until a Date Calculator (Time & Date) | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260126-009 | Age Calculator (Time & Date) | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260126-011 | Archive Completed REQ-20260126-010 Tracker Rows | Housekeeping | Archive/Cleanup | LOW | COMPLETE | NO |
| REQ-20260126-012 | Birthday Day-of-Week Calculator (Time & Date) | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260126-013 | Nap Time Calculator (Time & Date) | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260126-014 | Work Hours Calculator (Time & Date) | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |

---

## Status Values

| Status | Meaning |
|--------|---------|
| NEW | Created, not started |
| IN_PROGRESS | EVT_START_BUILD triggered |
| TESTING | Build passed, tests running |
| COMPLETE | Ready to archive |
| BLOCKED | Needs human help |

---

## Change Type → Required Tests

| Change Type | Tests |
|-------------|-------|
| Compute | Unit |
| UI/Flow | E2E |
| New Calculator | Unit + E2E + SEO |
| Layout/CSS | ISS-001 |
| SEO | SEO Auto |

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move COMPLETE requirements here. LLMs should not load this section. -->

| REQ_ID | Title | Status | Iterations | Completed |
|--------|-------|--------|------------|-----------|
| REQ-20260122-001 | Navigation Restructure - Top Level Loan Categories | COMPLETE | 13 | 2026-01-22 18:35 |
| REQ-20260122-002 | Top Navigation Button Visual System | COMPLETE | 6 | 2026-01-22 18:42 |
| REQ-20260122-003 | ISS-NAV-TOP-001 — Top Nav Visual Contract | COMPLETE | 12 | 2026-01-22 18:57 |
| REQ-20260126-010 | Switch Calculator Navigation to Full Page Loads (MPA) | COMPLETE | 2 | 2026-01-26 22:21 |
