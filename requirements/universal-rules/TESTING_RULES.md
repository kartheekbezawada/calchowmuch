# Testing Requirements - Canonical Test Governance

**Authority:** This document defines mandatory test selection and execution for CalcHowMuch.com.
**Status:** Canonical; other testing docs must defer to this file.
**Issued Under:** REQ-20260128-016
**Last Updated:** 2026-02-08
**Version:** 2.3

---

## 0) Scope & Applicability

**Applies to:**
- All public routes
- All calculators
- All UI, SEO, layout, and compute changes

**Does NOT apply to:**
- GTEP pages unless explicitly stated by a REQ

**Principle:**
> Test what is required, no more, no less.

---

## 1) Canonical Rule References

- **Calculation Pane:** `requirements/universal-rules/calculation_pane_rules.md`
- **Explanation Pane:** `requirements/universal-rules/explanation_pane_standard.md`
- **SEO Governance (P1-P5):** `requirements/universal-rules/SEO_RULES.md`
- **Universal Requirements:** `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`
- **Workflow FSM:** `requirements/universal-rules/WORKFLOW.md`

This document defines which suites must run and how to execute them.

---

## 2) BUILD -> TEST Handoff (Mandatory)

When BUILD status is `PASS`, implementers must immediately execute required tests per the matrix in Section 5.
No extra human confirmation is required for BUILD -> TEST progression.

If tests require a local server and one is not running, start it and continue:
- `npm run serve`

---

## 3) Test Suites Defined (Authoritative)

### 3.1 Functional Test Suites

| Suite | Purpose | Command |
|------|--------|---------|
| Unit | Calculation logic and core JS behavior | `npm run test` |
| E2E | User flows and navigation | `npm run test:e2e` |
| ISS-001 | Layout stability and density checks | `npm run test:iss001` |

### 3.2 SEO Validation Suites

| SEO Suite | Validates | Priority | Command |
|---------|----------|----------|---------|
| SEO-P1 | Title, meta description, canonical, H1, lang, viewport | P1 | `npm run test:e2e -- requirements/specs/e2e/*-seo.spec.js` |
| SEO-P2 | OpenGraph, Twitter cards, structured data | P2 | `npm run test:e2e -- requirements/specs/e2e/*-seo.spec.js` |
| SEO-P3 | Core Web Vitals (LCP, CLS, TBT, FCP, TTI) | P3 | `Manual via SEO_RULES.md (may be WAIVED for calculator pages in headless/no-GUI NO_FCP environments)` |
| SEO-P4 | Accessibility impacting SEO | P4 | `N/A (manual gate; see SEO_RULES.md)` |
| SEO-P5 | Sitemap, robots, redirects, canonical domain | P5 | `npm run test:e2e -- requirements/specs/e2e/*-seo.spec.js` |

**Note:** SEO-P4 remains mandatory when required by the matrix.
SEO-P3 is executed using direct tool commands defined in `SEO_RULES.md`; for calculator pages, SEO-P3 must be attempted and may be recorded as **WAIVED** only under the policy in Section 5.0.

---

## 4) SEO Structured Data Enforcement (Hard Rules)

When SEO-P2 is required, required schema must exist:

| Page Type | Required Schema |
|----------|-----------------|
| Homepage | `Organization`, `WebSite`, `BreadcrumbList` |
| Category page | `WebPage`, `BreadcrumbList` |
| Calculator page | `WebPage`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList` |

Missing required schema = SEO-P2 FAIL.

Additional mandatory FAQ schema guard for calculator pages:
- Exactly one `FAQPage` schema is allowed per URL.
- Calculator routes must use calculator-scoped FAQ schema only.
- Global FAQ schema is permitted only on `/faq` or `/faq/`.
- Global FAQ schema appearing on any non-FAQ calculator route is an automatic FAIL.

Required enforcement test command:
- `npx vitest run tests/core/page-metadata-schema-guard.test.js`

---

## 5) Test Selection Matrix (Authoritative)

### 5.0 Global Rule — Calculator Lighthouse P3 Policy (NO_FCP Waiver)

If a REQ creates or modifies any **calculator** page, attempt SEO-P3 (Lighthouse performance) using the commands in `SEO_RULES.md`.

If Lighthouse fails with `NO_FCP` in a headless/no-GUI environment, then SEO-P3 may be recorded as **WAIVED** for calculator pages **only** if:
- P1 / P2 / P5 Playwright SEO checks pass, and
- P4 (Pa11y) passes, and
- failure evidence is recorded (command + logs and any produced artifacts).

If Lighthouse runs successfully but reports bad metrics (slow LCP/TTI/TBT, high CLS, etc.), SEO-P3 is **FAIL** (not waivable).

| Change Type | Unit | SEO-P1 | SEO-P2 | SEO-P3 | SEO-P4 | SEO-P5 | ISS-001 | E2E |
|-------------|:----:|:------:|:------:|:------:|:------:|:------:|:-------:|:---:|
| Compute logic change | YES | - | - | - | - | - | - | - |
| SEO/metadata change | - | YES | YES | - | - | - | - | - |
| Layout/CSS change | - | - | - | YES | YES | - | YES | - |
| UI/flow change | - | - | - | - | - | - | - | YES |
| UI/flow change (dense multi-input toggle, mode visibility, Add/Remove row behavior) | - | - | - | - | - | - | YES | YES |
| New calculator | YES | YES | YES | YES | YES | YES | YES | YES |
| New site section | - | YES | YES | YES | YES | YES | YES | YES |
| Content update (copy) | - | YES | - | - | - | - | - | - |
| URL structure change | - | YES | - | - | - | YES | - | - |
| Bug fix (compute) | YES | - | - | - | - | - | - | - |
| Bug fix (UI) | - | - | - | - | - | - | YES | YES |
| Refactor (no behavior change) | YES | - | - | - | - | - | - | - |

Tests stack when multiple change types apply.

### 5.1 Mandatory FAQ Schema Guard Execution

Run `npx vitest run tests/core/page-metadata-schema-guard.test.js` when any of the following are true:
- New calculator page is added.
- Any calculator metadata/schema wiring changes.
- `public/assets/js/core/ui.js` structured-data logic changes.

This test is a release gate for calculator-related REQs.

### 5.2 Mandatory Button-Only Trigger Regression (Finance + Percentage)

Run this when any Finance or Percentage calculator changes calculation-trigger behavior, input handling, or explanation-pane live-binding behavior:
- `npm run test:e2e -- requirements/specs/e2e/button-only-recalc-finance-percentage.spec.js`

For other calculator domains with explicit Calculate CTAs, run an equivalent targeted trigger-regression spec for the affected routes.

Pass criteria:
- Editing inputs does not change calculation result/explanation before Calculate click.
- Clicking Calculate updates calculation result/explanation as expected.

### 5.3 Mandatory Dense Toggle/Input Regression (All Calculator Domains)

Run this when a calculator change includes any of the following:
- Mode switching/toggling behavior
- Progressive disclosure for dense input sets
- Dynamic Add Item / Remove Item row interactions

Required checks:
- `npm run test:iss001`
- Route-level E2E covering mode change + Calculate click behavior
- If Finance/Percentage calculators are in scope, also run:
  - `npm run test:e2e -- requirements/specs/e2e/button-only-recalc-finance-percentage.spec.js`

Pass criteria:
- Toggle default state matches requirement and shows correct fields.
- Mode toggles do not trigger result/explanation recomputation before Calculate click.
- Add Item rows keep the same layout density/structure as initial rows.

---

## 6) E2E Scoping Rules

| Scenario | E2E Scope |
|--------|-----------|
| Single calculator change | That calculator only |
| Shared component change | Affected calculators only |
| Navigation change | Affected navigation flows |
| New calculator | New calculator + nav integration |
| Release candidate | Full representative sweep |

Never run a full E2E sweep for single-calculator changes.

---

## 7) Evidence & Traceability (Mandatory)

Each test run must record:
- TEST_ID
- REQ_ID (and SEO_ID when applicable)
- Test suite(s)
- Route(s)
- PASS/FAIL result
- Artifacts/evidence link
- ITER_ID

Record results in `requirements/compliance/testing_tracker.md` and iteration notes.

---

## 8) Failure Handling

1. Log failure in active ITER file.
2. Classify failure source:
- Code defect -> BUILD
- Test defect -> BUILD (fix tests)
- Flaky -> Retry up to 2 times
3. Update trackers with failure row.
4. If iterations reach 25, file ISSUE and stop.

---

## 9) Command Reference (Repository-Valid)

```bash
# Unit
npm run test

# FAQ schema guard (calculator schema isolation)
npx vitest run tests/core/page-metadata-schema-guard.test.js

# E2E (all specs in configured testDir)
npm run test:e2e

# E2E (single spec)
npm run test:e2e -- requirements/specs/e2e/<spec-file>.spec.js

# ISS-001
npm run test:iss001

# Button-only trigger regression (Finance + Percentage)
npm run test:e2e -- requirements/specs/e2e/button-only-recalc-finance-percentage.spec.js

# Lint (build gate)
npm run lint

# Start local static server if needed
npm run serve
```
