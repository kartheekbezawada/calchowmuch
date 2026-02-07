# Requirement Tracker

> **Purpose:** Registry of formal requirements  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Requirements

| REQ_ID | Title | Type | Change Type | Priority | Status | SEO? |
| ------ | ----- | ---- | ----------- | -------- | ------ | ---- |
| REQ-20260207-001 | FAQPage Schema Injection Guard — Prevent Global FAQ Leakage Onto Calculator Pages | SEO | SEO | HIGH | NEW | YES |
| REQ-20260207-002 | Present Value of Annuity Calculator (Ordinary & Due) — Finance Category | Calculator | New Calculator + SEO | HIGH | TESTING | YES |
| REQ-20260207-003 | Future Value of Annuity Calculator (Ordinary & Due) — Finance Category | Calculator | New Calculator + SEO | HIGH | TESTING | YES |
| REQ-20260207-004 | Effective Annual Rate (EAR) Converter — Finance Category | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260207-005 | Compound Interest Calculator — Finance Category | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260207-006 | Savings Goal Calculator — Finance Category | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260207-007 | Investment Growth Calculator — Finance Category | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260207-008 | Simple Interest Calculator — Finance Category | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260207-009 | ISS-001 Global Shell Layout Stability Fix (All Calculator Pages) | Calculator Platform | Layout/CSS + Test Stabilization | HIGH | COMPLETE | YES |
| REQ-20260206-001 | Present Value (PV) Calculator — Finance Category | Calculator | New Calculator + SEO | HIGH | NEW | YES |
| REQ-20260206-004 | Future Value (FV) Calculator — Finance Category | Calculator | New Calculator + SEO | HIGH | TESTING | YES |
| REQ-20260206-003 | Align TESTING_RULES with package.json scripts | Compliance | Testing Governance | HIGH | COMPLETE | NO |

---

## Status Values

| Status | Meaning |
| ------ | ------- |
| NEW | Created, not started |
| IN_PROGRESS | EVT_START_BUILD triggered |
| TESTING | Build passed, tests running |
| COMPLETE | Ready to archive |
| BLOCKED | Needs human help |

---

## Change Type → Required Tests

| Change Type | Tests |
| ----------- | ----- |
| Compute | Unit |
| UI/Flow | E2E |
| New Calculator | Unit + E2E + SEO |
| Layout/CSS | ISS-001 |
| SEO | SEO Auto (P3 may be WAIVED for calculators per SEO_RULES) |

Notes

- Do not add per-REQ notes to this tracker for the Lighthouse `NO_FCP` issue.
- For calculator pages in headless/no-GUI environments, record SEO-P3 as **WAIVED** with evidence in `seo_tracker.md` per `requirements/universal-rules/SEO_RULES.md`.

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

Completed requirements are archived in:

- `requirements/Archive/Requirement Tracker_Archive.md`

<!-- Keep this section empty; archive lives in the separate file. -->
