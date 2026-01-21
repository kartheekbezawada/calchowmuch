# Remortgage Switching Calculator - Test Log

> **Calculator ID:** LOAN-REMO  
> **Test File:** `tests/calculators/remortgage-switching.spec.js`  
> **Framework:** Playwright  
> **Requirements:** `requirements/loans/REMORTGAGE_SWITCHING_RULES.md`

---

## Test Execution Summary

| Run Date | Run Time | Total Tests | Passed | Failed | Skipped | Duration | Executor |
|----------|----------|-------------|--------|--------|---------|----------|----------|
| 2026-01-19 | -- | 45 | -- | -- | -- | -- | Pending |

---

## Test Results by Category

### REMO-NAV: Navigation Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-NAV-1a | Calculator accessible via direct URL | ⏳ Pending | -- | -- | -- |
| REMO-NAV-1b | Calculator appears under Loans navigation | ⏳ Pending | -- | -- | -- |

### REMO-IN: Input Validation Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-IN-C-1a | Current Balance must be > 0 | ⏳ Pending | -- | -- | Zero balance |
| REMO-IN-C-1b | Negative balance rejected | ⏳ Pending | -- | -- | -50000 |
| REMO-IN-C-2a | Current Rate accepts 0% | ⏳ Pending | -- | -- | Edge case |
| REMO-IN-C-2b | Negative rate rejected | ⏳ Pending | -- | -- | -1% |
| REMO-IN-C-3 | Remaining Term must be >= 1 | ⏳ Pending | -- | -- | Zero term |
| REMO-IN-N-1 | New Rate accepts 0% | ⏳ Pending | -- | -- | Edge case |
| REMO-IN-N-2 | New Term must be >= 1 | ⏳ Pending | -- | -- | Zero term |
| REMO-IN-N-3/4/5 | Negative fees rejected | ⏳ Pending | -- | -- | -100 |
| REMO-TEST-U-5 | Input limited to 10 digits | ⏳ Pending | -- | `input-maxlength.png` | -- |

### REMO-OUT: Output Display Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-OUT-1 | Shows Current vs New monthly payment | ⏳ Pending | -- | -- | -- |
| REMO-OUT-2 | Shows monthly and annual difference | ⏳ Pending | -- | -- | -- |
| REMO-OUT-3 | Shows total cost over horizon | ⏳ Pending | -- | -- | -- |
| REMO-OUT-4 | Shows break-even month | ⏳ Pending | -- | -- | -- |
| REMO-OUT-5 | Shows total savings | ⏳ Pending | -- | -- | -- |

### REMO-TGL: Horizon Toggle Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-TGL-1a | Horizon toggle has 2, 3, 5 year options | ⏳ Pending | -- | -- | -- |
| REMO-TGL-1b | Default horizon is 2 years | ⏳ Pending | -- | -- | -- |
| REMO-TGL-2 | Toggle updates table immediately | ⏳ Pending | -- | `horizon-5yr.png` | -- |
| REMO-TEST-I-1a | 2 years shows ~24 rows | ⏳ Pending | -- | `horizon-2yr.png` | -- |
| REMO-TEST-I-1b | 3 years shows ~36 rows | ⏳ Pending | -- | `horizon-3yr.png` | -- |
| REMO-TEST-I-1c | 5 years shows ~60 rows | ⏳ Pending | -- | `horizon-5yr.png` | -- |

### REMO-TBL: Table Display Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-TBL-1a | Table has required columns (4) | ⏳ Pending | -- | -- | Month, Current, New, Savings |
| REMO-TBL-1b | Table shows cumulative costs | ⏳ Pending | -- | -- | Values increase |
| REMO-TBL-3 | Net savings column shows difference | ⏳ Pending | -- | -- | -- |

### REMO-GRAPH: Graph Display Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-GRAPH-1 | Graph displays two lines | ⏳ Pending | -- | -- | Current + New |
| REMO-GRAPH-2a | Break-even marker displays | ⏳ Pending | -- | `break-even-marker.png` | -- |
| REMO-GRAPH-2b | Graph note shows break-even info | ⏳ Pending | -- | -- | -- |
| REMO-TEST-I-2 | Graph updates when inputs change | ⏳ Pending | -- | -- | Rate change |

### REMO-TEST-E2E: End-to-End Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-TEST-E2E-6a | Complete journey - savings scenario | ⏳ Pending | -- | `full-journey-result.png` | £250k, 5.5%→4.2% |
| REMO-TEST-E2E-6b | Complete journey - no savings | ⏳ Pending | -- | `no-savings-scenario.png` | 4%→5% |
| REMO-TEST-E2E-7a | Error: zero balance | ⏳ Pending | -- | `error-zero-balance.png` | -- |
| REMO-TEST-E2E-7b | Error: negative values | ⏳ Pending | -- | `error-negative-rate.png` | -- |
| REMO-TEST-E2E-7c | Error: zero term | ⏳ Pending | -- | `error-zero-term.png` | -- |

### REMO-A11Y: Accessibility Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-A11Y-1 | All inputs have labels | ⏳ Pending | -- | -- | -- |
| REMO-A11Y-2a | Button group has role="group" | ⏳ Pending | -- | -- | -- |
| REMO-A11Y-2b | Button group has aria-labelledby | ⏳ Pending | -- | -- | -- |
| REMO-A11Y-3 | Active button has aria-pressed | ⏳ Pending | -- | -- | -- |
| REMO-A11Y-4 | Results have aria-live | ⏳ Pending | -- | -- | -- |
| REMO-A11Y-6 | Keyboard navigation works | ⏳ Pending | -- | -- | Tab key |
| REMO-TEST-E2E-8 | Accessibility screenshot | ⏳ Pending | -- | `accessibility-check.png` | -- |

### REMO-TEST-E2E-9: Layout Stability Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-TEST-E2E-9a | Layout stable during calculation | ⏳ Pending | -- | -- | No shift |
| REMO-TEST-E2E-9b | Layout stable during toggle changes | ⏳ Pending | -- | `layout-stability.png` | -- |

### REMO-TEST-E2E-10: Visual Regression Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-TEST-E2E-10a | Calculator visual appearance | ⏳ Pending | -- | `visual-regression-baseline.png` | Baseline |
| REMO-TEST-E2E-10b | Calculator with results | ⏳ Pending | -- | `visual-regression-with-results.png` | After calc |

### REMO-TEST-U-6: Edge Case Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-TEST-U-6a | 0% interest rate | ⏳ Pending | -- | -- | Both rates 0% |
| REMO-TEST-U-6b | Same rate both mortgages | ⏳ Pending | -- | -- | 5% = 5% |
| REMO-TEST-U-6c | Very short term (1 year) | ⏳ Pending | -- | -- | -- |
| REMO-TEST-U-6d | Very long term (35 years) | ⏳ Pending | -- | -- | -- |
| REMO-TEST-U-6e | Large loan amount (£5M) | ⏳ Pending | -- | -- | -- |

### REMO-TEST-U-1 to U-4: Calculation Accuracy Tests

| Test ID | Test Description | Status | Date/Time | Screenshot | Notes |
|---------|------------------|--------|-----------|------------|-------|
| REMO-TEST-U-1 | Monthly payment accuracy | ⏳ Pending | -- | -- | £220k @ 6% = ~£1,576 |
| REMO-TEST-U-2 | Break-even calculation | ⏳ Pending | -- | -- | £3k fees / £200 savings |
| REMO-TEST-U-3 | Cumulative cost calculation | ⏳ Pending | -- | -- | 24 months |
| REMO-TEST-U-4 | Savings calculation | ⏳ Pending | -- | -- | 6%→4% |

---

## Screenshot Reference

| Screenshot Name | Test ID | Description | Captured |
|-----------------|---------|-------------|----------|
| `horizon-2yr.png` | REMO-TEST-I-1a | 2 year horizon table | ⏳ Pending |
| `horizon-3yr.png` | REMO-TEST-I-1b | 3 year horizon table | ⏳ Pending |
| `horizon-5yr.png` | REMO-TEST-I-1c | 5 year horizon table | ⏳ Pending |
| `break-even-marker.png` | REMO-GRAPH-2a | Break-even visualization | ⏳ Pending |
| `full-journey-result.png` | REMO-TEST-E2E-6a | Complete user journey | ⏳ Pending |
| `no-savings-scenario.png` | REMO-TEST-E2E-6b | No savings scenario | ⏳ Pending |
| `error-zero-balance.png` | REMO-TEST-E2E-7a | Error state | ⏳ Pending |
| `error-negative-rate.png` | REMO-TEST-E2E-7b | Error state | ⏳ Pending |
| `error-zero-term.png` | REMO-TEST-E2E-7c | Error state | ⏳ Pending |
| `accessibility-check.png` | REMO-TEST-E2E-8 | Full page accessibility | ⏳ Pending |
| `layout-stability.png` | REMO-TEST-E2E-9b | Layout during toggles | ⏳ Pending |
| `visual-regression-baseline.png` | REMO-TEST-E2E-10a | Baseline appearance | ⏳ Pending |
| `visual-regression-with-results.png` | REMO-TEST-E2E-10b | With results | ⏳ Pending |
| `input-maxlength.png` | REMO-TEST-U-5 | Input character limit | ⏳ Pending |

---

## How to Run Tests

```bash
# Run all remortgage switching tests
npx playwright test tests/calculators/remortgage-switching.spec.js

# Run with headed browser (see the browser)
npx playwright test tests/calculators/remortgage-switching.spec.js --headed

# Run specific test by name
npx playwright test -g "REMO-NAV-1"

# Run and generate HTML report
npx playwright test tests/calculators/remortgage-switching.spec.js --reporter=html

# Run with screenshots on failure
npx playwright test tests/calculators/remortgage-switching.spec.js --screenshot=on

# Debug mode
npx playwright test tests/calculators/remortgage-switching.spec.js --debug
```

---

## Test Environment

| Property | Value |
|----------|-------|
| Playwright Version | (run `npx playwright --version`) |
| Node Version | (run `node --version`) |
| Browser | Chromium (Desktop Chrome) |
| Base URL | http://localhost:8000 |
| Test Dir | tests/calculators |
| Screenshots Dir | tests/calculators/screenshots |

---

## Notes

- All tests should be run locally before pushing to ensure calculator functions correctly
- Screenshots are timestamped to avoid overwriting previous runs
- Update this log after each test run with actual results
- Follow [UNIVERSAL_REQUIREMENTS.md](../../requirements/universal/UNIVERSAL_REQUIREMENTS.md) for UI compliance

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-19 | Agent | Initial test file creation with 45 exhaustive tests |
| 2026-01-19 | Agent | Created test log template with screenshot tracking |
