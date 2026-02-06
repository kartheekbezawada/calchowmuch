# Testing Requirements — Canonical Test Governance

**Authority:** This document defines the mandatory test taxonomy, selection rules, and execution requirements for CalcHowMuch.com.  
**Status:** Canonical — supersedes all prior testing guidance.  
**Issued Under:** REQ-20260128-016  
**Last Updated:** 2026-02-06  
**Version:** 2.0

---

## 0) Scope & Applicability

**Applies to:**
- All public routes
- All calculators
- All UI, SEO, layout, and compute changes

**Does NOT apply to:**
- GTEP pages (Sitemap, Privacy, Terms, Contact, FAQs) unless explicitly stated

**Principle:**  
> _Test what is required, no more, no less. The matrix is law._

---

## 1) Canonical Rule References

- **Calculation Pane:**  
  `requirements/universal-rules/calculation_pane_rules.md

  - **Explanation Pane:**  
  `requirements/universal-rules/explnation_pane_standard.md

- **SEO Governance (P1–P5):**  
  `requirements/universal-rules/seo_rules.md

- **Universal Requirements:**  
  `UNIVERSAL_REQUIREMENTS.md`

This document only defines **which tests must run** and **when**.

---

## 2) Test Pyramid (Cost-Ordered)
     ┌──────────────────────┐
     │     Full Sweep       │  ← Release candidates only
     │    (Highest cost)    │
     ├──────────────────────┤
     │        E2E           │  ← User flows, navigation
     ├──────────────────────┤
     │       ISS-001        │  ← Layout, density, CLS
     ├──────────────────────┤
     │   SEO (P1–P5)        │  ← Indexing, schema, CWV
     ├──────────────────────┤
     │    Integration       │  ← APIs, services
     ├──────────────────────┤
     │        Unit          │  ← Compute logic
     │     (Lowest cost)    │
     └──────────────────────┘

**Rule:** Prefer the lowest-cost test that proves correctness.

---

## 3) Test Suites Defined (Authoritative)

### 3.1 Functional Test Suites

| Suite | Purpose | Command |
|------|--------|---------|
| **Unit** | Individual calculation logic | `npm run test:unit` |
| **Integration** | API/service boundaries | `npm run test:integration` |
| **E2E** | User flows, mode switching | `npm run test:e2e` |
| **Full Sweep** | All suites | `npm run test:all` |

---

### 3.2 SEO Test Suites (Priority-Based)

> **SEO Auto is deprecated. SEO validation is priority-scoped (P1–P5).**

| SEO Suite | Validates | Priority | Command |
|---------|----------|----------|---------|
| **SEO-P1** | Title, meta description, canonical, H1, lang, viewport | P1 | `npm run test:seo:p1` |
| **SEO-P2** | OpenGraph, Twitter cards, **Structured Data** | P2 | `npm run test:seo:p2` |
| **SEO-P3** | Core Web Vitals (LCP, CLS, TBT) | P3 | `npm run test:seo:p3` |
| **SEO-P4** | Accessibility impacting SEO | P4 | `npm run test:seo:p4` |
| **SEO-P5** | Sitemap, robots, redirects, canonical domain | P5 | `npm run test:seo:p5` |
| **SEO-FULL** | All SEO suites | P1–P5 | `npm run test:seo` |

---

### 3.3 ISS Layout Test Suite

| Suite | Purpose | Command |
|------|--------|---------|
| **ISS-001** | Form density, progressive disclosure, layout stability | `npm run test:iss001` |

ISS rules are defined in `ISS-UI-FDP.md`.

---

## 4) SEO Structured Data Enforcement (Hard Rules)

When **SEO-P2** is required, the following schema **must exist**:

| Page Type | Required Schema |
|----------|-----------------|
| Homepage | `Organization`, `WebSite`, `BreadcrumbList` |
| Category page | `WebPage`, `BreadcrumbList` |
| Calculator page | `WebPage`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList` |

Missing required schema = **SEO-P2 FAIL**.

---

## 5) Test Selection Matrix (Authoritative)

| Change Type | Unit | Integration | SEO-P1 | SEO-P2 | SEO-P3 | SEO-P4 | SEO-P5 | ISS-001 | E2E |
|-------------|:----:|:-----------:|:------:|:------:|:------:|:------:|:------:|:-------:|:---:|
| Compute logic change | ✅ | — | — | — | — | — | — | — | — |
| API/service change | — | ✅ | — | — | — | — | — | — | — |
| SEO/metadata change | — | — | ✅ | ✅ | — | — | — | — | — |
| Layout/CSS change | — | — | — | — | ✅ | ✅ | — | ✅ | — |
| UI/flow change | — | — | — | — | — | — | — | — | ✅ |
| **New calculator** | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **New site section** | — | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Content update (copy) | — | — | ✅ | — | — | — | — | — | — |
| URL structure change | — | — | ✅ | — | — | — | ✅ | — | — |
| Bug fix (compute) | ✅ | — | — | — | — | — | — | — | — |
| Bug fix (UI) | — | — | — | — | — | — | — | ✅ | ✅ |
| Refactor (no behavior change) | ✅ | — | — | — | — | — | — | — | — |

**Interpretation**
- ✅ = required and must pass
- Tests stack if multiple change types apply

---

## 6) E2E Scoping Rules

| Scenario | E2E Scope |
|--------|-----------|
| Single calculator change | That calculator only |
| Shared component change | All affected calculators |
| Navigation change | Mode switching + affected flows |
| New calculator | Calculator + nav integration |
| Release candidate | Full sweep |

**Rule:** Never run a full E2E sweep for a single-calculator change.

---

## 7) Evidence & Traceability (Mandatory)

Every test run must record:

| Field | Required |
|-----|----------|
| TEST_ID | Yes |
| SEO_ID / REQ_ID | Yes |
| Test Suite(s) | Yes |
| Route(s) | Yes |
| Result (PASS/FAIL) | Yes |
| Artifacts | Yes |
| Iteration ID | Yes |

Artifacts must be stored under:

---

## 8) Failure Handling (Ralph Lauren Loop)

1. Log failure in `iteration_tracker.md`
2. Classify failure:
   - Code defect → BUILD
   - Test defect → FIX TEST
   - Flaky → Retry ≤ 2 times
3. Increment iteration counter
4. If iteration ≥ 25:
   - Mark status = ABORTED
   - File ISSUE (MAX_ITERATIONS)
   - Stop loop

---

## 9) Required vs Optional Tests

| Context | Required |
|-------|----------|
| Local development | Per matrix |
| PR validation | Per matrix |
| Release candidate | Full sweep only |

Optional tests may be run but **do not replace required ones**.

---

## 10) Test Commands Reference

```bash
# Unit
npm run test:unit

# Integration
npm run test:integration

# SEO by priority
npm run test:seo:p1
npm run test:seo:p2
npm run test:seo:p3
npm run test:seo:p4
npm run test:seo:p5

# ISS layout
npm run test:iss001

# E2E
npm run test:e2e

# Full sweep
npm run test:all

