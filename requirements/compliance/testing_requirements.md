# Testing Requirements & Strategy

> **Purpose:** Define the test taxonomy, scope, cost, and selection criteria for calchowmuch. This document ensures agents and humans select the right tests for the right changes—avoiding expensive E2E runs when cheaper alternatives exist.

---

## 1) Testing Pyramid (Cost-Based Ordering)

Tests are ordered from **least expensive** (fast, cheap) to **most expensive** (slow, costly):

```
                    ┌─────────────────────┐
                    │   E2E Full Sweep    │  ← Most expensive
                    │   (Release Only)    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │       Calculator E2E Tests      │  ← Expensive
              │  (Only impacted calculators)    │
              └────────────────┬────────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │           Layout Stability (ISS-001)       │  ← Medium
         │    (Required for shell/nav/CSS changes)    │
         └─────────────────────┬─────────────────────┘
                               │
    ┌──────────────────────────┴──────────────────────────┐
    │                SEO Automated Checks (P1)             │  ← Low-Medium
    │        (Auto-checkable rules from matrix)            │
    └──────────────────────────┬──────────────────────────┘
                               │
   ┌───────────────────────────┴───────────────────────────┐
   │           Integration Tests (Graph/Table/DOM)          │  ← Low
   │         (Component contracts, data mapping)            │
   └───────────────────────────┬───────────────────────────┘
                               │
  ┌────────────────────────────┴────────────────────────────┐
  │                     Unit Tests (Pure)                    │  ← Cheapest
  │            (Core compute logic, utilities)               │
  └──────────────────────────────────────────────────────────┘
```

---

## 2) Test Categories Defined

### 2.1 Unit Tests (Pure Functions)

| Attribute | Value |
|-----------|-------|
| **Location** | `tests/core/*.test.js` |
| **Runner** | Vitest |
| **Cost** | ⭐ Very Low (~10ms per test) |
| **Purpose** | Validate pure compute logic: math formulas, formatting, validation |
| **When to Run** | Every build, every PR |
| **Coverage Target** | ≥ 80% for new compute logic (per `TEST-1.2`) |

**What they test:**
- `loan-utils.js`: Monthly payment, amortization schedules
- `math.js`, `stats.js`: Statistical formulas
- `format.js`: Currency/number formatting
- `validate.js`: Input validation (toNumber, bounds checking)

**Test ID Pattern:** `{PREFIX}-TEST-U-{N}` (e.g., `BTL-TEST-U-1`, `CALC-TEST-U-3`)

---

### 2.2 Integration Tests (DOM/Component)

| Attribute | Value |
|-----------|-------|
| **Location** | `tests/core/*.test.js` (with jsdom) |
| **Runner** | Vitest with jsdom environment |
| **Cost** | ⭐⭐ Low (~50-100ms per test) |
| **Purpose** | Validate DOM structure, table semantics, graph data mapping |
| **When to Run** | When table/graph/component changes occur |

**What they test:**
- Table structure: `<thead>`, `<tbody>`, `<tfoot>` present
- Graph container: Fixed height, data series mapping
- Scroll behavior: `overflow-x/y: scroll` on containers
- Data mapping: Input → computed values → DOM output

**Test ID Pattern:** `{PREFIX}-TEST-INT-{N}` (e.g., `BTL-TEST-INT-TABLE-1`)

---

### 2.3 SEO Automated Checks

| Attribute | Value |
|-----------|-------|
| **Location** | `tests/seo/tests/seo/seo-auto.spec.js` |
| **Runner** | Playwright |
| **Cost** | ⭐⭐⭐ Medium (~200-500ms per page) |
| **Purpose** | Validate P1 SEO rules that are auto-checkable |
| **When to Run** | When new calculators added, metadata changed, or release sweep |

**What they test (per seo_requirements.md P1 rules):**
- ✅ Rule 1: Page not blocked by robots.txt / noindex
- ✅ Rule 2-3: Canonical present and accurate
- ✅ Rule 5-7: URL format (lowercase, hyphen-separated, no query params)
- ✅ Rule 9-11: Title, meta description, single H1
- ✅ Rule 12-13: Sitemap inclusion
- ✅ Rule 14-16: JSON-LD structured data validation
- ✅ Rule 22: Heading hierarchy (no H2→H4 jumps)

**Target Specification:**
- `tests/seo/seo.targets.json` defines URL sets per requirement
- Run with: `npx playwright test tests/seo/seo-auto.spec.js`
- Override targets: `REQ_ID=REQ-20260120-021 npx playwright test tests/seo/seo-auto.spec.js`

**Test ID Pattern:** `{PREFIX}-TEST-SEO-{N}` or mapped to rule numbers

---

### 2.4 Layout Stability Tests (ISS-001)

| Attribute | Value |
|-----------|-------|
| **Location** | `requirements/specs/e2e/iss-001-layout-stability.spec.js` |
| **Runner** | Playwright |
| **Cost** | ⭐⭐⭐ Medium (~1-2s for snapshot comparison) |
| **Purpose** | Prevent layout regressions (shell height, scrollbar stability, nav ping-pong) |
| **When to Run** | Layout/CSS/shell/navigation changes |

**What they test:**
- Shell maintains `100vh` max height
- Scrollbars visible (`overflow-y: scroll`, `scrollbar-gutter: stable`)
- No navigation "ping-pong" (clicking nav doesn't cause layout shift)
- Content scrolls internally, page never scrolls

**Snapshot Update:** When intentional layout changes occur:
```bash
npx playwright test requirements/specs/e2e/iss-001-layout-stability.spec.js --update-snapshots
```

---

### 2.5 Calculator Functional E2E Tests

| Attribute | Value |
|-----------|-------|
| **Location** | `tests/e2e/{calculator}.spec.js` |
| **Runner** | Playwright |
| **Cost** | ⭐⭐⭐⭐ High (~3-10s per calculator) |
| **Purpose** | End-to-end validation of calculator user flows |
| **When to Run** | Only for impacted calculators (not all calculators) |

**Test Categories:**
| Test Type | Suffix | Purpose | When Required |
|-----------|--------|---------|---------------|
| Load Test | `-TEST-E2E-LOAD` | Calculator loads without error | New calculator, UI change |
| Workflow Test | `-TEST-E2E-WORKFLOW` | Inputs → Calculate → Results work | UI/flow change |
| Navigation Test | `-TEST-E2E-NAV` | Nav links resolve, deep-linking works | Nav/config change |
| Mobile Test | `-TEST-E2E-MOBILE` | Responsive layout works | Optional |
| A11y Test | `-TEST-E2E-A11Y` | Accessibility compliance | A11y change |

**CRITICAL RULE:** Run E2E **only** for calculators you changed. Untouched calculators do not need E2E unless it's a full release sweep.

---

### 2.6 Graph Tests (Calculator-Scoped)

| Attribute | Value |
|-----------|-------|
| **Location** | Within calculator test files or integration tests |
| **Cost** | ⭐⭐ Low (unit) to ⭐⭐⭐ Medium (E2E) |
| **Purpose** | Validate graph rendering, data mapping, hover behavior |

**What they test:**
- Graph container has fixed height (per `UIGRAPH-1`, `UIGRAPH-2`)
- Data series mapped correctly to chart
- Hover/tooltip displays correct values
- X/Y axis labels present (per `UIGRAPH-5`, `UIGRAPH-6`)
- Legend present for multi-series (per `UIGRAPH-7`)

**Hover Test (if interactive):**
```javascript
// Example hover test pattern
await page.hover('.chart-point[data-index="5"]');
await expect(page.locator('.tooltip')).toContainText('Expected Value');
```

---

### 2.7 Table Tests (Calculator-Scoped)

| Attribute | Value |
|-----------|-------|
| **Location** | Within calculator test files or integration tests |
| **Cost** | ⭐⭐ Low |
| **Purpose** | Validate table structure, semantics, scroll behavior |

**What they test (per UTBL-* rules):**
- `<thead>`, `<tbody>`, `<tfoot>` structure (UTBL-STRUCT-1,2,3)
- Full grid borders (UTBL-BORDER-1,2)
- Scrollable container with visible scrollbars (UTBL-SCROLL-1,2,3)
- Table doesn't expand page height (UTBL-SIZE-1,4)
- No currency symbols in cells (UTBL-TEXT-5)

---

### 2.8 Golden Output / Result Validation Tests

| Attribute | Value |
|-----------|-------|
| **Location** | `requirements/expected_results/{calculator}/`, `tests/calculator_results/` |
| **Cost** | ⭐ Very Low |
| **Purpose** | Validate calculator outputs match expected "golden" results |

**What they test:**
- Given specific inputs, calculator produces exact expected outputs
- Edge cases handled correctly (zero, negative, max values)
- Precision and rounding match specification

**Example:**
```javascript
// Golden output test pattern
expect(computeMonthlyPayment(200000, 5, 25)).toBeCloseTo(1169.18, 2);
expect(buildAmortizationSchedule(100000, 3, 12)).toMatchObject(expectedSchedule);
```

---

## 3) Test Selection Matrix (Authoritative)

**Use this table to select required tests based on change type:**

| Change Type | Unit Tests | Integration | SEO Auto | ISS-001 | E2E (Impacted Only) | E2E (Full Sweep) |
|-------------|:----------:|:-----------:|:--------:|:-------:|:-------------------:|:----------------:|
| **New calculator** | ✅ Required | ✅ If tables/graphs | ✅ Required | — | ✅ LOAD + WORKFLOW | — |
| **Compute logic change** | ✅ Required (80% cov) | — | — | — | — | — |
| **UI/flow change** | — | — | — | — | ✅ LOAD + WORKFLOW | — |
| **Graph change** | ✅ Data mapping | ✅ Container/render | — | — | Optional WORKFLOW | — |
| **Table change** | ✅ Data mapping | ✅ DOM semantics | — | — | Optional WORKFLOW | — |
| **Shared component change** | ✅ Required | ✅ Events/semantics | — | — | ✅ 1-2 representative | — |
| **Layout/CSS/shell change** | — | — | — | ✅ Required | — | — |
| **Navigation/config change** | — | — | — | ✅ Required | ✅ NAV (affected domain) | — |
| **A11y-only change** | — | — | — | — | ✅ A11Y (affected) | — |
| **SEO/metadata-only change** | — | — | ✅ Required | — | — | — |
| **Content/explanation-only** | — | — | — | — | — | — |
| **Dependency/tooling change** | ✅ Required | — | — | — | ✅ 1 smoke | — |
| **Bugfix hot patch** | ✅ Targeted | — | — | — | Targeted if UI | — |
| **Release sweep** | ✅ Full suite | — | ✅ Sample | ✅ Required | — | ✅ 1 per category |

---

## 4) Test ID Conventions

### 4.1 ID Format

```
{PREFIX}-TEST-{TYPE}-{SCOPE}-{N}
```

| Component | Values | Example |
|-----------|--------|---------|
| PREFIX | Calculator code (`BTL`, `CALC`, `LOG`, `PERC`) | `BTL` |
| TYPE | `U` (unit), `INT` (integration), `E2E`, `SEO` | `U` |
| SCOPE | Test focus (`LOAD`, `WORKFLOW`, `NAV`, `TABLE`, `GRAPH`) | `WORKFLOW` |
| N | Sequential number | `1`, `2`, `3` |

**Examples:**
- `BTL-TEST-U-1` — Buy-to-Let unit test #1
- `CALC-TEST-E2E-WORKFLOW-2` — Calculus E2E workflow test #2
- `LOG-TEST-INT-GRAPH-1` — Logarithm graph integration test #1

### 4.2 Test Run ID Format

```
TEST-YYYYMMDD-HHMMSS
```

Used in `testing_tracker.md` to track each test execution run.

---

## 5) Test Execution Commands

### 5.1 Unit Tests

```bash
# Run all unit tests
npm run test

# Run specific test file
npm run test -- tests/core/loan-utils.test.js

# Run with coverage
npm run test:coverage
```

### 5.2 E2E Tests

```bash
# Run all E2E tests (requires server on :8000)
npm run test:e2e

# Run specific E2E file
npx playwright test tests/e2e/buy-to-let.spec.js

# Run ISS-001 layout stability
npx playwright test requirements/specs/e2e/iss-001-layout-stability.spec.js

# Update snapshots after intentional changes
npx playwright test requirements/specs/e2e/iss-001-layout-stability.spec.js --update-snapshots
```

### 5.3 SEO Tests

```bash
# Run SEO auto tests with default targets
npx playwright test tests/seo/seo-auto.spec.js

# Run for specific requirement
REQ_ID=REQ-20260120-021 npx playwright test tests/seo/seo-auto.spec.js

# Run for specific URLs
SEO_URLS="/calculators/math/log/natural-log/,/calculators/math/log/common-log/" npx playwright test tests/seo/seo-auto.spec.js
```

---

## 6) Coverage Requirements

| Scope | Minimum Coverage | Measured By |
|-------|-----------------|-------------|
| New compute logic | 80% | `npm run test:coverage` |
| Core utilities (`/public/assets/js/core/`) | 80% | `npm run test:coverage` |
| Calculator-specific modules | Best effort | — |

---

## 7) Test Optimization Rules

### 7.1 Screenshot Policy (per TEST-1.5)

```javascript
// playwright.config.js
use: {
  screenshot: 'only-on-failure',  // NOT 'on' or 'always'
}
```

### 7.2 Trace Policy (per TEST-1.6)

```javascript
// playwright.config.js
use: {
  trace: 'retain-on-failure',  // NOT 'on'
}
```

### 7.3 Install Frequency (per TEST-1.4)

Do **not** run these before every test:
- `pnpm install`
- `npx playwright install chromium`

Only run when dependencies or cache changed.

---

## 8) Compliance Verification Formula

A test run is **PASS** when:

```
TEST_PASS = BUILD_PASS 
            AND (mandatory_tests_executed AND mandatory_tests_all_pass)
            AND (optional_tests_skipped OR optional_tests_pass)
```

Where:
- `BUILD_PASS`: Build completed successfully (`npm run lint` passes)
- `mandatory_tests`: Tests required per Test Selection Matrix for the change type
- `optional_tests`: Tests allowed to skip per matrix

**Overall Compliance:**
```
COMPLIANCE_PASS = REQ_VERIFIED 
                  AND BUILD_PASS 
                  AND TEST_PASS 
                  AND (SEO_PASS OR SEO_NA) 
                  AND UNIVERSAL_RULES_FOLLOWED
```

---

## 9) Test File Organization

```
tests/
├── core/                           # Unit tests (Vitest)
│   ├── algebra-calculators.test.js
│   ├── basic-calculator.test.js
│   ├── calculus.test.js
│   ├── confidence-interval.test.js
│   ├── loan-utils.test.js          # (if exists)
│   ├── logarithm-calculators.test.js
│   ├── mmmr-calculator.test.js
│   ├── statistics-calculator.test.js
│   └── ...
├── e2e/                            # E2E tests (Playwright)
│   ├── buy-to-let.spec.js
│   ├── calculus-calculators.spec.js
│   ├── logarithm-calculators.spec.js
│   └── ...
├── seo/                            # SEO tests (Playwright)
│   ├── seo.targets.json            # URL targets per REQ
│   └── tests/seo/
│       └── seo-auto.spec.js        # Auto-checkable SEO rules
├── calculator_results/             # Golden output snapshots
│   ├── buy-to-let/
│   └── percentage-calculator/
requirements/
├── expected_results/               # Expected calculation results
│   └── buy-to-let/
└── specs/                          # Specification-based tests
    └── e2e/
        └── iss-001-layout-stability.spec.js
```

---

## 10) Summary: Cost vs Coverage Trade-offs

| Situation | Recommended Approach |
|-----------|---------------------|
| **Compute-only change** | Unit tests only (fast, cheap) |
| **Single calculator UI change** | Unit + E2E for that calculator only |
| **Shared CSS/layout change** | ISS-001 only (no full E2E sweep) |
| **New calculator added** | Unit + E2E-LOAD + E2E-WORKFLOW + SEO |
| **Pre-release verification** | Unit suite + ISS-001 + E2E for 1 calculator per category |
| **Major refactor** | Full unit suite + ISS-001 + targeted E2E |

**Golden Rule:** Never run full E2E sweep for single-calculator changes. E2E is expensive—reserve it for impacted calculators only.

---

**Document Owner:** Compliance Team  
**Last Updated:** 2026-01-22  
**Related:** [WORKFLOW.md](WORKFLOW.md), [UNIVERSAL_REQUIREMENTS.md](../universal/UNIVERSAL_REQUIREMENTS.md)
