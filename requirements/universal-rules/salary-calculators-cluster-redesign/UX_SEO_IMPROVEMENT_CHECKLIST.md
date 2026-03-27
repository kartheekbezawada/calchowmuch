# Salary Cluster UX / SEO Improvement Checklist

## Executive Summary

This document logs the first improvement wave for the live `salary-calculators` cluster.

The goal is to improve the current salary conversion and earnings routes without expanding into benchmark-style salary estimation. This wave focuses on the highest-impact gaps found in the audit:

- static SEO metadata/schema parity in generated salary HTML
- lower first-screen friction on `salary-calculator`
- clearer mode labels on multi-mode earnings routes
- stronger result context, methodology, and actionability
- tighter FAQ and lower-page card density
- stronger hub intent routing and salary-cluster internal linking

Status legend:

- `Not started`
- `In progress`
- `Done`
- `Deferred`

---

## Ranked Checklist

### 1. Static metadata and schema parity across all salary routes

Status: `Done`

Acceptance criteria:

- Every salary route ships route-specific static `<title>` and meta description in generated HTML.
- Every salary route ships static `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` JSON-LD in generated HTML.
- Salary SEO tests validate raw source HTML, not only post-hydration metadata.

### 2. First-screen input simplification for `salary-calculator`

Status: `Done`

Acceptance criteria:

- The primary pay amount and frequency remain first-screen primary.
- Hours/week, weeks/year, and days/week move into a secondary assumptions control with defaults.
- The route still preserves editable assumptions for reverse conversions.

### 3. Explicit mode-label upgrades across raise, bonus, weekly, and commission flows

Status: `Done`

Acceptance criteria:

- `Percent` becomes `Percent of salary`.
- `Amount` becomes `Flat amount`.
- `Rate` becomes `Commission rate %`.
- `Split hours` becomes `Regular + overtime hours`.

### 4. Result-context improvements so outputs show assumptions, not just numbers

Status: `Done`

Acceptance criteria:

- Each result card includes a visible answer-context row.
- Each result card includes a compact `Calculation basis` block.
- Key outputs include a short action-oriented interpretation line, not only a raw number.

### 5. FAQ spacing and lower-page card-density tightening

Status: `Done`

Acceptance criteria:

- FAQ cards use tighter padding and reduced visual weight compared with primary calculator/result cards.
- The lower page reads more compactly without changing route structure.

### 6. Explanation-pane depth upgrades with route-specific guidance

Status: `Done`

Acceptance criteria:

- Each salary route retains formula and worked-example coverage.
- Each salary route adds at least one extra section that clarifies assumptions or result drivers.
- Content remains concise and route-specific.

### 7. Hub intent shortcuts and stronger contextual internal linking

Status: `Done`

Acceptance criteria:

- The salary hub includes intent-first shortcuts such as hourly-pay, annual-salary, weekly-pay, and raise/bonus/commission entry points.
- Hub navigation remains inside the salary cluster and reflects user intent rather than only route titles.

### 8. Trust and methodology copy standardization

Status: `Done`

Acceptance criteria:

- Each route includes a compact `How we calculate this` block below the result area.
- Each route keeps gross-pay disclaimers explicit.
- No route introduces tax, net-pay, or payroll-compliance claims.

### 9. Output interpretation copy for actionability

Status: `Done`

Acceptance criteria:

- Result cards explain what the main output means in plain language.
- Raise, bonus, commission, overtime, and weekly routes provide a short consequence-oriented result line.

### 10. Future-wave backlog separated from current scope

Status: `Deferred`

Acceptance criteria:

- Benchmark-style salary estimation by experience, location, company size, or percentiles remains outside this wave.
- Any future “what should I earn?” work is treated as a separate product expansion, not merged into these conversion tools.

---

## Deferred Backlog

- Salary benchmarking with experience, location, and company-size inputs
- Salary ranges, percentiles, and confidence bands
- Side-by-side city, role, or offer comparison scenarios
- Take-home pay, tax, and inflation follow-on routes
