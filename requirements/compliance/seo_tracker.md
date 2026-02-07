# SEO Tracker

> **Purpose:** Track SEO validation for pages  
> **LLM Rule:** Load when REQ has SEO impact. STOP at Archive.

---

## Active Validations

| SEO_ID | REQ_ID | Page | Checks | Status | P1 | P2 | P3 |
|--------|--------|------|--------|--------|----|----|-----|
| SEO-REQ-20260206-004 | REQ-20260206-004 | /finance/future-value/ | P1/P2/P5 via `future-value-seo.spec.js` PASS; P4 via Pa11y PASS (0 issues); P3 Lighthouse FAIL (`NO_FCP`) | FAIL | PASS | PASS | FAIL |
| SEO-REQ-20260206-003 | REQ-20260206-003 | N/A (testing-governance docs) | SEO impact marked `NO` in requirement tracker; SEO gate not applicable | NA | — | — | — |


## Priority Levels

| Level | Focus | Required For |
|-------|-------|--------------|
| P1 | Title, meta, canonical | All pages |
| P2 | OpenGraph, structured data | Public pages |
| P3 | Core Web Vitals | All pages |

Full rules: `seo_requirements.md`

---

<!-- ⛔ LLM STOP: Do not read below this line ⛔ -->

## Archive

<!-- Move completed SEO validations here. LLMs should not load this section. -->

| SEO_ID | REQ_ID | Page | Status | Archived |
|--------|--------|------|--------|----------|
| SEO-REQ-20260126-006 | REQ-20260126-010 | All Calculator Pages (MPA) | PASS | 2026-01-26 |
