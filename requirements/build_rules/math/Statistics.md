# Statistics Phase Requirements (Math -> Simple)

## Objective
Extend the Math -> Simple category with nine statistics calculators. Each calculator must be deep-linkable, load its own UI in the Calculation pane, and show its own explanation content in the Explanation pane.

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-STAT-001 | Standard Deviation Calculator | • STAT-SD-1<br>• STAT-SD-2<br>• STAT-SD-3<br>• STAT-SD-4<br>• STAT-SD-5 | • STAT-TEST-SD-1<br>• STAT-TEST-SD-E2E | 2026-01-19 |
| REQ-STAT-002 | Number Sequence Calculator | • STAT-NS-1<br>• STAT-NS-2<br>• STAT-NS-3<br>• STAT-NS-4 | • STAT-TEST-NS-1<br>• STAT-TEST-NS-E2E | 2026-01-19 |
| REQ-STAT-003 | Sample Size Calculator | • STAT-SS-1<br>• STAT-SS-2<br>• STAT-SS-3<br>• STAT-SS-4 | • STAT-TEST-SS-1<br>• STAT-TEST-SS-E2E | 2026-01-19 |
| REQ-STAT-004 | Probability Calculator | • STAT-PROB-1<br>• STAT-PROB-2<br>• STAT-PROB-3<br>• STAT-PROB-4 | • STAT-TEST-PROB-1<br>• STAT-TEST-PROB-E2E | 2026-01-19 |
| REQ-STAT-005 | Statistics Calculator | • STAT-CALC-1<br>• STAT-CALC-2<br>• STAT-CALC-3<br>• STAT-CALC-4<br>• STAT-CALC-5 | • STAT-TEST-CALC-1<br>• STAT-TEST-CALC-E2E | 2026-01-19 |
| REQ-STAT-006 | Mean, Median, Mode, Range Calculator | • STAT-MMM-1<br>• STAT-MMM-2<br>• STAT-MMM-3<br>• STAT-MMM-4<br>• STAT-MMM-5 | • STAT-TEST-MMM-1<br>• STAT-TEST-MMM-E2E | 2026-01-19 |
| REQ-STAT-007 | Permutation and Combination Calculator | • STAT-PC-1<br>• STAT-PC-2<br>• STAT-PC-3<br>• STAT-PC-4 | • STAT-TEST-PC-1<br>• STAT-TEST-PC-E2E | 2026-01-19 |
| REQ-STAT-008 | Z-score Calculator | • STAT-Z-1<br>• STAT-Z-2<br>• STAT-Z-3<br>• STAT-Z-4 | • STAT-TEST-Z-1<br>• STAT-TEST-Z-E2E | 2026-01-19 |
| REQ-STAT-009 | Confidence Interval Calculator | • STAT-CI-1<br>• STAT-CI-2<br>• STAT-CI-3<br>• STAT-CI-4 | • STAT-TEST-CI-1<br>• STAT-TEST-CI-E2E | 2026-01-19 |

---

## Scope (this phase)
- Add navigation entries (order + IDs) and routing support.
- Add calculator folders and files for the nine calculators.
- Add shared statistics utilities and tests.
- Add explanation content (20+ lines each) with worked examples.
- Update SEO artifacts (sitemap and structured data) for new calculators.

## Navigation and routing
1) Update `public/config/navigation.json` under category id `math`, subcategory id `simple`.
2) Add calculators after `fraction-calculator` in the exact order below.
3) Each calculator uses `url: "#/calculators/<id>"`.
4) Update `getCalculatorPath()` in `public/index.html` to map each new id to `/calculators/math/<id>`.

## Calculator list (order + IDs)
| Display name | id (slug) | folder path |
| --- | --- | --- |
| Standard Deviation Calculator | standard-deviation | public/calculators/math/standard-deviation/ |
| Number Sequence Calculator | number-sequence | public/calculators/math/number-sequence/ |
| Sample Size Calculator | sample-size | public/calculators/math/sample-size/ |
| Probability Calculator | probability | public/calculators/math/probability/ |
| Statistics Calculator | statistics | public/calculators/math/statistics/ |
| Mean, Median, Mode, Range Calculator | mean-median-mode-range | public/calculators/math/mean-median-mode-range/ |
| Permutation and Combination Calculator | permutation-combination | public/calculators/math/permutation-combination/ |
| Z-score Calculator | z-score | public/calculators/math/z-score/ |
| Confidence Interval Calculator | confidence-interval | public/calculators/math/confidence-interval/ |

## Calculator module contract
- Each calculator lives in `public/calculators/math/<id>/`.
- Required files: `index.html`, `module.js`, `explanation.html`.
- Optional: `calculator.css` for calculator-specific styles; import via `@import` in `index.html`. Avoid large inline `<style>` blocks.
- `index.html` is a fragment (no page shell, no head).
- `module.js` is an ES module and must use shared core utilities.
- `explanation.html` is static HTML (no JS rendering).
- All inputs have labels and unique IDs.
- No calculator-specific logic in `public/index.html` beyond the path map.

## Shared UX and layout rules
- Provide a short helper sentence at the top of each calculator.
- Use a consistent input grid for labeled inputs.
- Exactly one primary calculate button per calculator or per mode (full width).
- Use `.result` and optional `.result-detail` areas with `aria-live="polite"` and a minimum height to prevent layout shift.
- When switching calculators or modes, clear previous results and errors.
- No alerts. Show validation errors in the result or detail area.

## Dataset input rules (for calculators that accept a list)
- Use a single textarea input labeled "Dataset" (or similar).
- Accept numbers separated by commas, spaces, or newlines.
- Trim whitespace and ignore empty tokens.
- Reject any token that is not a finite number; show an error that lists invalid tokens.
- Preserve negative values and decimals.

## Formatting rules
- Use `formatNumber()` for all numeric outputs.
- Default max fraction digits: 4 for statistics outputs.
- Use `formatPercent()` for probability and confidence interval outputs.
- Counts (n) and combinatorics outputs should be integers with no rounding.
- Do not display scientific notation.

## Shared statistics utilities
- Add `public/assets/js/core/stats.js` (or extend `math.js`) with shared functions:
  - sum, mean, median, mode (multi-mode support)
  - variance (sample + population)
  - standardDeviation (sample + population)
  - min, max, range
- Do not duplicate these functions inside calculators.

## Testing
- Add unit tests for stats utilities in `tests/core/stats.test.js`.
- Cover edge cases: empty dataset, single value, even/odd median, multiple modes, negative values.

## Calculator-specific requirements

### 1) Standard Deviation Calculator (id: standard-deviation)
Purpose:
- Compute mean, variance, and standard deviation for a dataset.

Inputs:
- Dataset (list of numbers).
- Mode toggle: Sample or Population.

Outputs:
- n (count)
- mean
- variance
- standard deviation

Rules:
- Sample mode requires n >= 2, otherwise show an error.
- Population mode requires n >= 1.
- Use sample variance with n - 1 (Bessel correction).
- Show which mode is active in the result text.

### 2) Number Sequence Calculator (id: number-sequence)
Purpose:
- Compute the nth term of an arithmetic or geometric sequence.

Inputs:
- Sequence type: Arithmetic or Geometric.
- a1 (first term)
- n (term index, integer >= 1)
- d (common difference) OR r (common ratio)
- Optional preview length k (default 10, max 50)

Outputs:
- nth term (a_n)
- preview list of first k terms (comma-separated)

Rules:
- n must be an integer >= 1.
- k must be an integer >= 1; clamp to 50.
- Allow negative d or r.
- Use formula:
  - Arithmetic: a_n = a1 + (n - 1) * d
  - Geometric: a_n = a1 * r^(n - 1)

### 3) Sample Size Calculator (id: sample-size)
Purpose:
- Required sample size for a proportion.

Inputs:
- Confidence level: 90%, 95%, 99%
- Margin of error E (percent)
- Estimated proportion p (percent, default 50)
- Optional population size N

Outputs:
- Required sample size (rounded up to integer)

Rules:
- Convert percent inputs to decimals for calculation.
- Base formula: n0 = (z^2 * p * (1 - p)) / E^2
- If N provided: n = n0 / (1 + (n0 - 1) / N)
- z values: 90% = 1.645, 95% = 1.96, 99% = 2.576
- E must be > 0, p in [0, 1], N >= 1 if provided.

### 4) Probability Calculator (id: probability)
Purpose:
- Compute basic probability operations for independent events.

Modes:
- Single event: P(A)
- Complement: 1 - P(A)
- AND (independent): P(A) * P(B)
- OR (independent): P(A) + P(B) - P(A) * P(B)

Inputs:
- P(A) percent (0 to 100)
- P(B) percent (0 to 100) where applicable

Outputs:
- Probability as decimal and percent

Rules:
- Convert percent to decimal for calculation.
- Validate ranges; show error if outside 0 to 100.

### 5) Statistics Calculator (id: statistics)
Purpose:
- Full descriptive summary for a dataset.

Inputs:
- Dataset

Outputs:
- count, sum, mean, median, mode(s)
- min, max, range
- variance (population and sample)
- standard deviation (population and sample)

Rules:
- If multiple modes exist, list them all (comma-separated).
- If no mode exists, show "no mode".
- Use shared stats utilities.

### 6) Mean, Median, Mode, Range Calculator (id: mean-median-mode-range)
Purpose:
- Core measures of center and spread.

Inputs:
- Dataset

Outputs:
- mean, median, mode(s)
- min, max, range

Rules:
- Same mode rules as above.
- Do not compute variance or standard deviation here.

### 7) Permutation and Combination Calculator (id: permutation-combination)
Purpose:
- Compute nPr and nCr.

Modes:
- Permutation: nPr
- Combination: nCr

Inputs:
- n (integer >= 0)
- r (integer >= 0)

Outputs:
- integer result

Rules:
- r must be <= n.
- Use integer math only.
- If using Number factorials, enforce n <= 170 to avoid overflow and show a clear error.
- If using BigInt, output as a string (no commas) and adjust tests accordingly.

### 8) Z-score Calculator (id: z-score)
Purpose:
- Compute z = (x - mean) / standardDeviation

Inputs:
- x (value)
- mean
- standard deviation (must be > 0)

Outputs:
- z-score

Rules:
- If standard deviation <= 0, show an error.
- Format to 4 decimal places.

### 9) Confidence Interval Calculator (id: confidence-interval)
Purpose:
- Compute a confidence interval for a population proportion.

Inputs:
- Confidence level: 90%, 95%, 99%
- Sample proportion p-hat (percent)
- Sample size n

Outputs:
- Lower and upper bounds
- Margin of error

Rules:
- Convert percent inputs to decimals.
- Standard error: sqrt(p * (1 - p) / n)
- Margin of error: z * standard error
- CI = p-hat +/- margin of error
- n must be > 0, p-hat in [0, 1]

Optional:
- Add a second mode for mean with known sigma:
  - inputs: x-bar, sigma, n, confidence
  - margin of error: z * sigma / sqrt(n)

## Explanation content requirements
For each calculator explanation.html:
- At least 20 separate lines (bullets or short paragraphs).
- Must include:
  - what the calculator does
  - when to use it
  - definitions for each input
  - formula or step list
  - worked example using the default UI inputs
  - output values that match the calculator (including rounding)
  - edge cases and validation notes

## Acceptance criteria
- Nine calculators appear under Math -> Simple after fraction-calculator, in the defined order.
- Each new calculator is deep-linkable via `#/calculators/<id>` and is loaded correctly by `public/index.html`.
- Only the active calculator UI and explanation are visible at a time.
- Left nav remains scrollable and usable on short viewport heights.
- All calculators validate inputs, show friendly errors, and avoid console errors or alerts.
- Shared stats utilities exist and are covered by tests.
- `public/sitemap.xml` and `public/seo/structured-data.json` include the new calculators (if used for active calculators).
