# Inflation Adjusted Salary Calculator Child Route Spec

## Parent Plan

- `requirements/universal-rules/salary-calculators-cluster-redesign/ROLLOUT_PLAN.md`
- `requirements/universal-rules/salary-calculators-cluster-redesign/DESIGN_SYSTEM.md`

## Route

- `/salary-calculators/inflation-adjusted-salary-calculator/`

## Route Intro

Use this Inflation Adjusted Salary Calculator to check whether a salary change actually keeps up with inflation. The route compares current salary, new salary, inflation rate, and years between pay points in one answer-first view.

## Route Design Contract

- Inherit the shared salary design baseline from `DESIGN_SYSTEM.md`.
- Use a simple answer-first layout with one primary real-pay output.
- Keep the first supporting result row focused on required salary, nominal change, real change, and salary in today's dollars.
- Include a lightweight inflation sensitivity block without turning the route into a chart-heavy finance page.

## SEO Metadata

- Page title: `Inflation Adjusted Salary Calculator | Real Raise vs Inflation`
- H1: `Inflation Adjusted Salary Calculator`
- Meta description: `Compare current salary, new salary, inflation rate, and years between pay points to see whether a raise keeps up with inflation.`
- Canonical URL: `https://calchowmuch.com/salary-calculators/inflation-adjusted-salary-calculator/`

## Search Intent

- Primary intent: compensation planning and real-pay comparison
- Searcher goal: see whether a raise beats inflation
- SERP angle: answer-first tool for inflation-adjusted salary comparison

## Keyword Strategy

### Primary Keywords

- inflation adjusted salary calculator
- real salary calculator
- salary raise vs inflation

### Secondary Keywords

- inflation adjusted raise calculator
- real pay increase calculator
- salary keep up with inflation
- raise after inflation

## Internal Calculator Mesh

- Parent hub: `/salary-calculators/`
- Related routes:
  - `/salary-calculators/raise-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/annual-to-monthly-salary-calculator/`
  - `/finance-calculators/inflation-calculator/`

## Formula Table

| Output | Formula | Inputs | Notes |
|---|---|---|---|
| Required salary | `currentSalary x (1 + inflationRate)^years` | currentSalary, inflationRate, years | Salary needed to preserve buying power |
| Nominal change | `newSalary - currentSalary` | currentSalary, newSalary | Before inflation |
| Nominal percent | `(newSalary - currentSalary) / currentSalary x 100` | currentSalary, newSalary | Before inflation |
| New salary in today's dollars | `newSalary / (1 + inflationRate)^years` | newSalary, inflationRate, years | Real-value view |
| Real salary gap | `newSalary - requiredSalary` | newSalary, requiredSalary | Positive means ahead of inflation |
| Real change percent | `(newSalary - requiredSalary) / requiredSalary x 100` | newSalary, requiredSalary | Positive means ahead of inflation |

## Assumptions

- results are gross-pay comparisons only
- inflation rate is user-provided and fixed across the selected period
- no tax, deduction, or payroll logic is included
- no live CPI or country-specific inflation feed is used

## Validation Rules

- do not calculate if current salary or new salary is missing or non-positive
- inflation rate must be zero or greater
- years between salaries must be zero or greater
- keep the last valid result visible while invalid inputs are corrected

## Worked Example

- current salary: `$60,000.00`
- new salary: `$66,000.00`
- inflation rate: `3%`
- years between salaries: `2`
- required salary to keep pace: `$63,654.00`
- real salary gap: `$2,346.00`

## Result Hierarchy

1. real salary gap hero result
2. context note stating whether the new salary beats inflation
3. support cards for required salary, nominal change, real change, and new salary in today's dollars
4. inflation sensitivity card row
