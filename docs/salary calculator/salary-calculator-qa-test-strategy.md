# Salary Calculator — QA Test Strategy

Companion document to `salary-calculator-tax-engine-spec.md` and
`salary-calculator-functional-test-spec.md`. Where the functional test spec defines *what to
test* (concrete UK/US scenarios and matrices), this document defines the broader *quality
engineering framework* around it: regression, data integrity, property-based, performance,
security, and CI/CD strategy.

For a calculator like this, a full quality-engineering test strategy is warranted, not just
functional/unit tests — the tax engine is especially suited to regression, property-based,
performance, data-integrity, and compatibility testing.

## 1. Testing Pyramid Overview

```
                     ┌──────────────────────┐
                     │   E2E / Playwright   │  Real user journeys
                     └──────────┬───────────┘
                                │
                ┌───────────────▼───────────────┐
                │     Functional / Integration  │  UK / US / Tax / Pay schedules
                └───────────────┬───────────────┘
                                │
         ┌──────────────────────▼──────────────────────┐
         │        Regression / Golden Test Suite       │  Every tax year + every important scenario
         └──────────────────────┬──────────────────────┘
                                │
    ┌───────────────────────────▼──────────────────────────┐
    │ Unit / Property / Boundary / Data Validation Tests   │
    └───────────────────────────┬──────────────────────────┘
                                │
                ┌───────────────▼───────────────┐
                │       Performance Tests       │  Calculation + page + bundle
                └───────────────────────────────┘
```

---

## 2. Regression Testing — Essential

Probably the #1 additional test category for this calculator. Every time the team updates tax
rates, adds a state, changes the tax engine, changes bonus/pension logic, changes
pay-frequency logic, updates the tax year, refactors JavaScript, or changes UI components, it
must be proven that existing calculations haven't changed unexpectedly.

### Golden Regression Cases

Create a permanent dataset:

```
tests/regression/
    uk-2026-27.json
    us-2026.json
```

Example: UK, England, £60,000, Annual, no bonus, no pension → expected `incomeTax = X`,
`NI = Y`, `net = Z`. The regression test compares the current engine's output against this
approved result.

### Tax-Year Regression Testing

Especially important — over time there will be 2026/27, 2027/28, 2028/29, and so on. A new
tax-year update must never accidentally change an old year's calculation:

```
2026/27 input → 2026/27 tax data → expected result
```

must remain reproducible forever. **Rule: never overwrite historical tax data.**

```
tax-data/
    uk/
        2026-27.json
        2027-28.json
    us/
        2026.json
        2027.json
```

---

## 3. Data Regression / Tax-Data Integrity Testing

Particularly important for the USA, which will eventually hold thousands of tax-data values.
Test the *data itself*, not just the calculation output. For US state tax data, verify: all 50
states exist, DC exists, state codes are unique, tax years exist, brackets are ordered, brackets
don't overlap, rates are valid, thresholds are valid, filing statuses are valid, and
source/verification-date fields exist.

Example failure this catches: California brackets defined as `0 → 20,000` then `15,000 →
50,000` — an overlap that would silently corrupt calculations.

### Tax-Data Schema Validation

Validate the tax data *before* the calculator even starts running:

```
rate >= 0
rate <= 1
lowerBound >= 0
upperBound > lowerBound
bracket[n].upperBound <= bracket[n+1].lowerBound   (representation-dependent)
```

This catches bad tax-data imports before they reach production.

---

## 4. Boundary Testing

For every threshold, test `threshold − 1`, `threshold`, `threshold + 1` — e.g. £50,269 /
£50,270 / £50,271, or $X−1 / $X / $X+1 for US thresholds. Automate this generation *from* the
tax-data itself, so adding a new bracket automatically creates its boundary cases rather than
requiring hundreds of hand-maintained tests.

---

## 5. Property-Based Testing

Instead of specifying only `£60,000 → £X net`, generate thousands of random valid salaries
(£0, £1, £17.53, £12,569, £12,570, £12,571, … £2,000,000) and test mathematical properties/
invariants that must hold for *all* of them:

- `net <= gross`
- `salary = 0 → tax = 0`
- `annual / 12 × 12 ≈ annual`
- `annual / 26 × 26 ≈ annual`

This catches bugs that wouldn't be found by hand-picked test cases. Vitest can run the normal
suite; a property-based library such as `fast-check` can generate the cases.

---

## 6. Metamorphic Testing

You don't always need to know the exact expected answer — you can test *relationships* between
inputs and outputs. Examples:

- Salary £50,000 → £50,001: net salary should not suddenly drop £10,000 because of a tax-engine
  bug.
- £60,000 salary + £10,000 bonus should produce higher gross compensation than £60,000 alone,
  and normally higher net income too.

This is powerful precisely when there's no authoritative expected output for every possible
input.

---

## 7. Differential Testing

Compare CalcHowMuch's output against an independent trusted reference:

```
CalcHowMuch ── compare ── Government/reference calculation ── difference
```

For UK, compare against HMRC examples/tables where available. For US, compare against IRS
examples and validated state calculations. The goal is not that every penny always matches
another calculator (payroll assumptions can legitimately differ) — the goal is that any
differences are *explainable*.

---

## 8. Performance Testing

Don't over-engineer this, but do set explicit budgets. The actual tax calculation should be
extremely fast since it's client-side.

**Calculation performance budgets:** target < 1 ms, warning > 5 ms, failure > 20 ms for a single
normal calculation. Benchmark at 1, 1,000, 10,000, and 100,000 calculations — not because users
will run 100,000 calculations, but to detect algorithmic problems (100,000 calculations taking
50 ms is fine; taking 30 seconds indicates a real problem).

**By country:** benchmark UK, USA Federal, USA State, USA Federal+State, and USA
Federal+State+deductions+bonus separately, to discover whether some state-specific logic is
accidentally expensive.

**All 51 US jurisdictions:** run `for each state: calculate $100,000` — 51 calculations should
be essentially instantaneous. Also stress-test 51 × 10,000 salaries.

**Browser performance:** First Contentful Paint, Largest Contentful Paint, Total Blocking Time,
Interaction to Next Paint, JS execution time, bundle size. Extend the existing Lighthouse
pipeline with CI budgets for JS bundle size, LCP, INP, CLS, and Lighthouse performance score.
Don't let the growing US tax dataset degrade page performance.

**Tax-data loading:** with 50 states × multiple years × brackets × deductions × credits × local
jurisdictions, don't blindly load everything into the initial bundle. Consider a progressive
loading architecture (initial page loads UK + US federal data only; selecting USA loads state
data; selecting California loads California's specific rules) — or bundle compact static data
if it's small enough. Measure rather than guess.

**Memory:** test initial memory → load US data → calculate repeatedly → switch states
repeatedly → memory. Rapid state switching (California → New York → Texas → Florida → …) should
not continually allocate objects and leak memory.

---

## 9. Stress Testing

Simulate extreme valid inputs: salary £10,000,000, $100,000,000, bonus $50,000,000. The
calculator should not crash, not produce `Infinity`, not produce `NaN`, not overflow, and remain
responsive. Also test 0, 0.01, and 999999999.

---

## 10. Security Testing

Even for a calculator, do basic security testing: XSS through input fields, malicious strings,
extremely long input, malformed query parameters, manipulated local storage, malicious URL
parameters, clipboard handling. Example: `salary = "<script>alert(1)</script>"` should never
execute.

---

## 11. Accessibility Testing

Automate with a tool such as `axe` inside Playwright. Test keyboard navigation, labels, form
errors, focus management, screen-reader labels, contrast, expandable sections, and result
announcements. Particularly important given this feature adds a significantly more complex form
than the current calculator.

---

## 12. Cross-Browser Testing

At minimum: Chrome, Edge, Firefox, Safari, plus iOS Safari and Android Chrome on mobile. Use
Playwright's browser matrix rather than manually testing every browser version.

---

## 13. Network / Offline Testing

The existing product promise is "runs entirely client-side" — test that explicitly: load the
calculator, disable the network, enter a salary, calculate. Expected: calculation still works.
This is simultaneously a functional test, a privacy test, and a resilience test.

---

## 14. URL / State Testing

If URL-driven state is eventually supported (e.g. `/salary-calculator?country=us&state=ca`),
test both directions — URL → calculator state, and calculator state → URL — and make sure
invalid URL parameters don't break the calculator.

---

## 15. Visual Regression Testing

Since Playwright is already in use, this is easy to add. Capture screenshots of key states:
`salary-calculator-uk.png`, `salary-calculator-scotland.png`, `salary-calculator-us.png`,
`salary-calculator-california.png`, `salary-calculator-bonus.png`, `salary-calculator-error.png`
— then diff against future builds. Catches broken layouts, missing fields, mobile overflow,
accidentally hidden results, CSS regressions, and broken responsive behaviour. Use selectively
rather than screenshotting every possible state.

---

## 16. CI/CD Testing Pipeline

```
Pull Request
  ├── TypeScript / lint
  ├── Unit tests
  ├── Property tests
  ├── Tax-data validation
  ├── Regression tests
  ├── Functional tests
  ├── Accessibility tests
  └── Build
       ↓
  Performance test
       ↓
  Deploy preview
       ↓
  E2E smoke tests
       ↓
  Production
```

### Production Smoke Testing

After deployment, run a very small, fast set of checks: UK £60,000, US $100,000 California, US
$100,000 Texas, a bonus scenario, and a pay-schedule check. This catches broken deployments,
missing JSON, incorrect asset paths, CDN problems, JS bundle errors, and tax-data loading
failures.

---

## 17. Test Category Priority Matrix

| Test type | Priority | Purpose |
|---|---|---|
| Unit | Critical | Individual algorithms |
| Functional | Critical | Complete calculator behaviour |
| Integration | Critical | Tax engine + data + salary |
| Regression | Critical | Prevent tax calculation changes |
| Boundary | Critical | Tax thresholds |
| Golden cases | Critical | Known correct results |
| Tax-data validation | Critical | Prevent bad tax tables |
| Property-based | High | Find unexpected calculation bugs |
| Metamorphic | High | Verify mathematical relationships |
| Differential | High | Compare against authoritative references |
| E2E | High | Real user workflows |
| Performance | High | Calculation/page speed |
| Accessibility | High | Usability/compliance |
| Security | High | Input/browser safety |
| Cross-browser | High | Browser compatibility |
| Offline/resilience | High | Client-side guarantee |
| Production smoke | High | Verify deployment |
| Visual regression | Medium | UI changes |
| Stress | Medium | Extreme values |
| Memory | Medium | Detect leaks |

---

## 18. Contract Testing — Recommended for the Platform, Not Just This Feature

Because CalcHowMuch already runs 100+ calculators and this feature introduces a reusable tax
engine, contract testing should be a first-class category going forward.

The tax engine should expose a stable contract:

```
Input → TaxEngine → CalculationResult
```

Every country implementation must satisfy the same contract. When UK and USA are later joined
by Canada, Australia, Ireland, or Germany, the same generic test suite can run against every
country's tax engine. This turns the salary calculator from a collection of individual
country-specific calculators into a tested computational platform — a materially stronger
architecture than a growing pile of one-off implementations.
