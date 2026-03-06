# Requirement Tracker

> **Purpose:** Registry of formal requirements  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Requirements

| REQ_ID | Title | Type | Change Type | Priority | Status | SEO? |
| ------ | ----- | ---- | ----------- | -------- | ------ | ---- |
| REQ-20260208-001 | Commission Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-002 | Discount Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-003 | Margin Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-004 | Markup Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-005 | Percent Change Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-006 | Percentage Decrease Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-007 | Percentage Difference Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-008 | Percentage Increase Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-009 | Percentage Composition Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-010 | Percent to Fraction/Decimal Converter — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-011 | Reverse Percentage Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-012 | What Percent Is X of Y Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-013 | Find Percentage of a Number Calculator — Percentage Calculators | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-014 | Age Calculator — Time & Date | Calculator | SEO | HIGH | COMPLETE | YES |
| REQ-20260208-015 | Nap Time Calculator — Time & Date | Calculator | SEO | HIGH | COMPLETE | YES |
| REQ-20260208-016 | Time Between Two Dates Calculator — Time & Date | Calculator | SEO | HIGH | COMPLETE | YES |
| REQ-20260208-017 | Wake-Up Time Calculator — Time & Date | Calculator | Compute + Explanation + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-018 | Birthday Day-of-Week Calculator — Time & Date | Calculator | SEO | HIGH | COMPLETE | YES |
| REQ-20260208-019 | Countdown Timer Generator — Time & Date | Calculator | SEO | HIGH | COMPLETE | YES |
| REQ-20260208-020 | Work Hours Calculator — Time & Date | Calculator | Explanation + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-021 | Power Nap Calculator — Time & Date | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-022 | Energy-Based Nap Selector — Time & Date | Calculator | New Calculator + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-023 | Sleep Time Calculator — Time & Date | Calculator | Compute + Explanation + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-024 | Overtime Hours Calculator — Time & Date | Calculator | Compute + Explanation + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-025 | Credit Card Repayment/Payoff Calculator — Credit Cards | Calculator | Compute + Explanation + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-026 | Credit Card Minimum Payment Calculator — Credit Cards | Calculator | Compute + Explanation + SEO | HIGH | COMPLETE | YES |
| REQ-20260208-027 | Balance Transfer / Installment Plan Calculator — Credit Cards | Calculator | Compute + Explanation + SEO | HIGH | NEW | YES |
| REQ-20260208-028 | Credit Card Consolidation Calculator — Credit Cards | Calculator | Compute + Explanation + SEO | HIGH | NEW | YES |
| REQ-20260208-029 | Local SEO & Performance Audit Framework — Calculators | Compliance | SEO + Performance | HIGH | BLOCKED | YES |
| REQ-20260208-030 | Implement Local SEO & Performance Audit Runner — Calculators | Tooling | SEO + Performance | HIGH | COMPLETE | YES |

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
- For calculator pages in headless/no-GUI environments, record SEO-P3 as **WAIVED** with evidence in `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md` per `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`.

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

Completed requirements are archived in:

- `requirements/Archive/Requirement Tracker_Archive.md`

<!-- Keep this section empty; archive lives in the separate file. -->
