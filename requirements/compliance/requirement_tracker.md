# Requirement Tracker

This document is the system of record for FSM requirements.

## FSM Status Definitions

- **NEW**: Requirement registered by Copilot in S1_REQUIREMENT_DRAFTED.
- **UNVERIFIED**: Implementation started but not fully verified.
- **VERIFIED**: Tests passed and evidence recorded in S11_TRACKERS_UPDATED.
- Legacy statuses (Pending/In Progress/Complete) apply only to the legacy backlog below.

---

## FSM Requirements Table (Authoritative)


| Requirement ID   | Title                                     | Description                                                                                                                                                                                                                  | Owner | Scope/Pages                            | SEO Impact | Status   | Date Created | Build Rules File | Evidence/Notes                                                                                                                    |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ---------------------------------------- | ------------ | ---------- | -------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| REQ-20260119-001 | BTL Calculator Graph & Table Improvements | Fix graph hover visibility when scrolling right, correct cumulative calculations after rent increase, simplify to show Net Cashflow with increase percentage only, reorder table columns (Mortgage Cost first, Costs second) | Codex | Buy-to-Let Calculator page             | YES        | VERIFIED | 2026-01-19   | requirements/build_rules/loans/BUY_TO_LET_RULES.md | Build BUILD-20260119-140637; Test TEST-20260119-153426 passed                                                                     |
| REQ-20260119-015 | Playwright Screenshot Optimization | Optimize test execution by eliminating unnecessary screenshot generation, implementing screenshot-only-on-failure policy, and reducing trace collection overhead for better LLM resource efficiency | Codex | Global Test Configuration | NO | VERIFIED | 2026-01-19 | requirements/universal/UNIVERSAL_REQUIREMENTS.md | Addresses TEST-1.5, TEST-1.6, TEST-1.7 rules; Configuration updated in playwright.config.js; Manual screenshot calls removed from percentage-calculator.spec.js, buy-to-let.spec.js, how-much-can-borrow.spec.js, remortgage-switching.spec.js |
| REQ-20260120-016 | Navigation Layout Border Removal & Footer Optimization | Remove all border/box styling from navigation elements (Math, Loans buttons and "CALCULATE HOW MUCH" header). Push footer links (Privacy, Terms, Contact) further down to maximize vertical space for navigation pane, calculation pane, explanation pane, and ad pane. NO changes to horizontal spacing/sizing. | Codex | Universal Layout (All Calculator Pages) | NO | VERIFIED | 2026-01-20 | requirements/universal/UNIVERSAL_REQUIREMENTS.md | Build BUILD-20260120-022657; Test TEST-20260120-100053 passed |
| REQ-20260119-002 | Percentage Calculator Functionality Fixes | Fix non-working calculation modes, input validation failures, missing result displays, and incorrect percentage change calculations across all 5 modes (Percent Change, Percent Of, Increase By, Decrease By, What Percent)  | Codex | Math/Simple/Percentage Calculator page | YES        | VERIFIED | 2026-01-19   | requirements/build_rules/math/MATH_SIMPLE_RULES.md | All 10 unit tests passed (PERC-TEST-U-1, PERC-TEST-U-2); All 5 modes functional (change, percent-of, increase, decrease, what-percent); E2E tests verified |
| REQ-20260119-003 | Fraction Calculator Functionality Fixes   | Fix non-working fraction operations, simplification errors, mixed number conversion issues, and result display problems across all 6 modes (Add, Subtract, Multiply, Divide, Simplify, Convert)                                       | Codex | Math/Simple/Fraction Calculator page   | YES        | VERIFIED | 2026-01-19   | requirements/build_rules/math/MATH_SIMPLE_RULES.md | Fixed: button data-value attributes, added input labels for accessibility, created 25 unit tests (FRAC-TEST-U-1 to U-4); All modes functional |
| REQ-20260119-004 | Pane Width Distribution Universal Change   | Implement universal layout change: reduce Main Calculation Pane width by 25% from right edge (50% → 37.5%), increase Explanation Pane width by 25% to occupy released space (50% → 62.5%). Applies to ALL calculators. Width transfer must be from right-to-left direction. Total combined width preserved. | Codex | Universal Layout (All Calculator Pages) | NO         | VERIFIED | 2026-01-19   | requirements/universal/UNIVERSAL_REQUIREMENTS.md (rules ARCH-1.2 to ARCH-1.6) | Implemented in layout.css: grid-template-columns changed from 1fr 1fr to 3fr 5fr (37.5%:62.5%); Applies universally to all calculator pages via shared CSS |
| REQ-20260119-005 | Basic Calculator Functionality Implementation | Implement fully functional 4-operation basic calculator with memory functions, error handling, and proper display formatting. Support addition, subtraction, multiplication, division, memory store/recall/clear, clear operations, and decimal calculations. | Codex | Math/Basic/Basic Calculator page | YES | VERIFIED | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | Added memory functions (MC, MR, MS, M+, M-) with indicator; 31 unit tests (BASIC-TEST-U-1, BASIC-TEST-U-2); All 4 operations + memory functional |
| REQ-20260119-006 | Confidence Interval Calculator Implementation | Implement statistical confidence interval calculator for population mean estimates. Support confidence levels (90%, 95%, 99%), sample size, sample mean, standard deviation inputs. Calculate and display confidence intervals with margin of error and statistical explanations. | Codex | Math/Advanced/Confidence Interval page | YES | VERIFIED | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | 20 unit tests (CI-TEST-U-1, CI-TEST-U-2); Proportion and mean modes; 90%/95%/99% confidence levels; SE and ME calculations verified |
| REQ-20260119-007 | Mean Median Mode Range Calculator Implementation | Implement complete descriptive statistics calculator for data sets. Accept comma-separated data input, calculate mean, median, mode, range, and display results with proper formatting. Handle multiple modes, sorted data display, and statistical explanations. | Codex | Math/Statistics/MMMR Calculator page | YES | VERIFIED | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | 64 unit tests (MMMR-TEST-U-1, MMMR-TEST-U-2); Mean, median, mode, min, max, range; Multimodal support; parseDataset validation |
| REQ-20260119-008 | Number Sequence Calculator Implementation | Implement arithmetic and geometric sequence calculator. Detect sequence type, find missing terms, calculate nth term, and sum of terms. Support both arithmetic (constant difference) and geometric (constant ratio) sequences with pattern recognition. | Codex | Math/Advanced/Number Sequence page | YES | NEW | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | Calculator exists but sequence analysis and term calculation not functional |
| REQ-20260119-009 | Permutation Combination Calculator Implementation | Implement combinatorial mathematics calculator for permutations and combinations. Calculate nPr (permutations), nCr (combinations), factorial operations, and provide mathematical explanations. Include input validation for non-negative integers and proper error handling. | Codex | Math/Advanced/Permutation Combination page | YES | NEW | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | Calculator structure present but combinatorial calculations not implemented |
| REQ-20260119-010 | Probability Calculator Implementation | Implement probability calculation tools for basic probability scenarios. Calculate single event probability, multiple event probability (AND/OR), conditional probability, and Bayes' theorem applications. Support probability distributions and statistical explanations. | Codex | Math/Advanced/Probability Calculator page | YES | NEW | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | Calculator interface exists but probability calculations not functional |
| REQ-20260119-011 | Sample Size Calculator Implementation | Implement statistical sample size determination calculator for research applications. Calculate required sample size based on confidence level, margin of error, population size, and expected response rate. Support both known and unknown population variance scenarios. | Codex | Math/Statistics/Sample Size page | YES | NEW | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | Calculator exists but sample size determination logic not implemented |
| REQ-20260119-012 | Standard Deviation Calculator Implementation | Implement complete standard deviation and variance calculator for data sets. Calculate population and sample standard deviation, variance, mean, and provide step-by-step calculations. Accept comma-separated data input with proper validation and formatting. | Codex | Math/Statistics/Standard Deviation page | YES | NEW | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | Calculator interface present but statistical calculations not working |
| REQ-20260119-013 | Statistics Calculator Implementation | Implement comprehensive statistics calculator for descriptive and basic inferential statistics. Calculate mean, median, mode, range, standard deviation, variance, percentiles, and quartiles. Support large data sets and provide detailed statistical analysis. | Codex | Math/Statistics/Statistics Calculator page | YES | NEW | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | Calculator exists but comprehensive statistical analysis not implemented |
| REQ-20260119-014 | Z-Score Calculator Implementation | Implement Z-score standardization calculator for statistical analysis. Calculate Z-scores from raw scores, find probabilities from Z-scores, and determine raw scores from Z-scores. Include standard normal distribution table integration and statistical explanations. | Codex | Math/Statistics/Z-Score Calculator page | YES | NEW | 2026-01-19 | requirements/build_rules/math/MATH_ADVANCED_RULES.md | Calculator structure exists but Z-score calculations and normal distribution lookups not functional |

Notes:

- If SEO Impact is YES/UNKNOWN, ensure seo_requirements.md has an entry with Status: PENDING.
- Copilot creates entries in S1; Codex updates Status to VERIFIED in S11 only.
- **Build Rules Location**: `requirements/build_rules/loans/` and `requirements/build_rules/math/`
- Each requirement MUST have corresponding entry in the appropriate build rules file with:
  - 5-column Requirement ID Mapping table (with bullet list format for Rule IDs and Test IDs)
  - Detailed rule definitions
  - Detailed test definitions
- Install frequency: do not rerun `pnpm install` or `npx playwright install chromium` before every test run unless dependencies or cache changed.

---

## Current Requirements Summary

| Status | Count | Percentage |
|--------|-------|------------|
| NEW (FSM) | 6 | 35% |
| UNVERIFIED (FSM) | 0 | 0% |
| VERIFIED (FSM) | 8 | 47% |
| Legacy | 3 | 18% |
| **Total Active** | **17** | **100%** |

---

## Requirements by Category

| Category | Total | NEW | VERIFIED | Success Rate |
|----------|-------|-----|----------|---------------|
| Math Calculators | 10 | 6 | 4 | 40% |
| Buy-to-Let | 1 | 0 | 1 | 100% |
| Screenshot Optimization | 1 | 0 | 1 | 100% |
| Percentage Calculator | 1 | 0 | 1 | 100% |
| Infrastructure | 4 | 1 | 1 | 25% |
| REQ-LNAV-001   | UI       | Loans Top Navigation            | LN-NAV-ROOT-1 to LN-NAV-ROOT-4                                                    | Implement loans top navigation                                       | Pending | 2026-01-19   | -              | Per LOANS_NAVIGATION_RULES.md               |
| REQ-LNAV-002   | UI       | Loans Left Navigation           | LN-NAV-LEFT-1 to LN-NAV-LEFT-5                                                    | Implement loans left navigation                                      | Pending | 2026-01-19   | -              | Per LOANS_NAVIGATION_RULES.md               |
| REQ-LNAV-003   | UI       | Loans Deep Linking              | LN-NAV-DEEP-1 to LN-NAV-DEEP-4                                                    | Implement loans deep linking                                         | Pending | 2026-01-19   | -              | Per LOANS_NAVIGATION_RULES.md               |
| REQ-STAT-001   | Math     | Standard Deviation Calculator   | STAT-SD-1 to STAT-SD-5                                                            | Implement std dev calculator                                         | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-STAT-002   | Math     | Number Sequence Calculator      | STAT-NS-1 to STAT-NS-4                                                            | Implement number sequence calculator                                 | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-STAT-003   | Math     | Sample Size Calculator          | STAT-SS-1 to STAT-SS-4                                                            | Implement sample size calculator                                     | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-STAT-004   | Math     | Probability Calculator          | STAT-PROB-1 to STAT-PROB-4                                                        | Implement probability calculator                                     | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-STAT-005   | Math     | Statistics Calculator           | STAT-CALC-1 to STAT-CALC-5                                                        | Implement general statistics calculator                              | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-STAT-006   | Math     | Mean Median Mode Range          | STAT-MMM-1 to STAT-MMM-5                                                          | Implement MMMR calculator                                            | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-STAT-007   | Math     | Permutation Combination         | STAT-PC-1 to STAT-PC-4                                                            | Implement permutation/combination calculator                         | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-STAT-008   | Math     | Z-Score Calculator              | STAT-Z-1 to STAT-Z-4                                                              | Implement z-score calculator                                         | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-STAT-009   | Math     | Confidence Interval Calculator  | STAT-CI-1 to STAT-CI-4                                                            | Implement confidence interval calculator                             | Pending | 2026-01-19   | -              | Per Statistics.md                           |
| REQ-NAV-001    | UI       | Navigation System               | UI-3.3, FS-5.1                                                                    | Implement calculator hierarchy navigation                            | Pending | 2026-01-19   | -              | Per calculator-hierarchy.md                 |

---

## Template for New FSM Requirements

```markdown
| REQ-YYYYMMDD-### | [Title] | [Description] | [Owner] | [Scope/Pages] | YES/NO/UNKNOWN | NEW | YYYY-MM-DD | [Notes/Evidence] |
```


