# Requirement Tracker

> **Purpose:** Registry of formal requirements  
> **LLM Rule:** Read Active section only. STOP at Archive.

---

## Active Requirements

| REQ_ID | Title | Type | Change Type | Priority | Status | SEO? |
| ------ | ----- | ---- | ----------- | -------- | ------ | ---- |
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
| SEO | SEO Auto |

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

Completed requirements are archived in:

- `requirements/Archive/Requirement Tracker_Archive.md`

<!-- Keep this section empty; archive lives in the separate file. -->
