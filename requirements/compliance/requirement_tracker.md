# Requirement Tracker

This document is the system of record for FSM requirements.

## FSM Status Definitions

- **NEW**: Requirement registered by Copilot in S1_REQUIREMENT_DRAFTED.
- **UNVERIFIED**: Implementation started but not fully verified.
- **VERIFIED**: Tests passed and evidence recorded in S11_TRACKERS_UPDATED.
- Legacy statuses (Pending/In Progress/Complete) apply only to the legacy backlog below.

---

## FSM Requirements Table (Authoritative)


| Requirement ID   | Title                                     | Description                                                                                                                                                                                                                  | Owner | Scope/Pages                            | SEO Impact | Status   | Date Created | Evidence/Notes                                                                                                                    |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ---------------------------------------- | ------------ | ---------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| REQ-20260119-001 | BTL Calculator Graph & Table Improvements | Fix graph hover visibility when scrolling right, correct cumulative calculations after rent increase, simplify to show Net Cashflow with increase percentage only, reorder table columns (Mortgage Cost first, Costs second) | Codex | Buy-to-Let Calculator page             | YES        | VERIFIED | 2026-01-19   | Build BUILD-20260119-140637; Test TEST-20260119-153426 passed                                                                     |
| REQ-20260119-002 | Percentage Calculator Functionality Fixes | Fix non-working calculation modes, input validation failures, missing result displays, and incorrect percentage change calculations across all 5 modes (Percent Change, Percent Of, Increase By, Decrease By, What Percent)  | Codex | Math/Simple/Percentage Calculator page | YES        | NEW      | 2026-01-19   | Calculator appears to load but calculation functions not working; results not displaying correctly; input validation issues       |
| REQ-20260119-003 | Fraction Calculator Functionality Fixes   | Fix non-working fraction operations, simplification errors, mixed number conversion issues, and result display problems across all 5 modes (Add, Subtract, Multiply, Divide, Simplify)                                       | Codex | Math/Simple/Fraction Calculator page   | YES        | NEW      | 2026-01-19   | Calculator interface loads but fraction operations not calculating correctly; simplification and mixed number conversions failing |
| REQ-20260119-004 | Pane Width Distribution Universal Change   | Implement universal layout change: reduce Main Calculation Pane width by 25% from right edge (50% → 37.5%), increase Explanation Pane width by 25% to occupy released space (50% → 62.5%). Applies to ALL calculators. Width transfer must be from right-to-left direction. Total combined width preserved. | Copilot | Universal Layout (All Calculator Pages) | NO         | NEW      | 2026-01-19   | New rules ARCH-1.2 to ARCH-1.6 added to UNIVERSAL_REQUIREMENTS.md; must be implemented as universal layout change affecting all calculator pages |
| REQ-20260119-005 | Basic Calculator Functionality Implementation | Implement fully functional 4-operation basic calculator with memory functions, error handling, and proper display formatting. Support addition, subtraction, multiplication, division, memory store/recall/clear, clear operations, and decimal calculations. | Codex | Math/Basic/Basic Calculator page | YES | NEW | 2026-01-19 | Calculator exists but functionality needs implementation with proper calculation logic, memory operations, and error handling |
| REQ-20260119-006 | Confidence Interval Calculator Implementation | Implement statistical confidence interval calculator for population mean estimates. Support confidence levels (90%, 95%, 99%), sample size, sample mean, standard deviation inputs. Calculate and display confidence intervals with margin of error and statistical explanations. | Codex | Math/Advanced/Confidence Interval page | YES | NEW | 2026-01-19 | Calculator structure exists but needs complete statistical calculation implementation |
| REQ-20260119-007 | Mean Median Mode Range Calculator Implementation | Implement complete descriptive statistics calculator for data sets. Accept comma-separated data input, calculate mean, median, mode, range, and display results with proper formatting. Handle multiple modes, sorted data display, and statistical explanations. | Codex | Math/Statistics/MMMR Calculator page | YES | NEW | 2026-01-19 | Calculator interface exists but statistical calculations not implemented |
| REQ-20260119-008 | Number Sequence Calculator Implementation | Implement arithmetic and geometric sequence calculator. Detect sequence type, find missing terms, calculate nth term, and sum of terms. Support both arithmetic (constant difference) and geometric (constant ratio) sequences with pattern recognition. | Codex | Math/Advanced/Number Sequence page | YES | NEW | 2026-01-19 | Calculator exists but sequence analysis and term calculation not functional |
| REQ-20260119-009 | Permutation Combination Calculator Implementation | Implement combinatorial mathematics calculator for permutations and combinations. Calculate nPr (permutations), nCr (combinations), factorial operations, and provide mathematical explanations. Include input validation for non-negative integers and proper error handling. | Codex | Math/Advanced/Permutation Combination page | YES | NEW | 2026-01-19 | Calculator structure present but combinatorial calculations not implemented |
| REQ-20260119-010 | Probability Calculator Implementation | Implement probability calculation tools for basic probability scenarios. Calculate single event probability, multiple event probability (AND/OR), conditional probability, and Bayes' theorem applications. Support probability distributions and statistical explanations. | Codex | Math/Advanced/Probability Calculator page | YES | NEW | 2026-01-19 | Calculator interface exists but probability calculations not functional |
| REQ-20260119-011 | Sample Size Calculator Implementation | Implement statistical sample size determination calculator for research applications. Calculate required sample size based on confidence level, margin of error, population size, and expected response rate. Support both known and unknown population variance scenarios. | Codex | Math/Statistics/Sample Size page | YES | NEW | 2026-01-19 | Calculator exists but sample size determination logic not implemented |
| REQ-20260119-012 | Standard Deviation Calculator Implementation | Implement complete standard deviation and variance calculator for data sets. Calculate population and sample standard deviation, variance, mean, and provide step-by-step calculations. Accept comma-separated data input with proper validation and formatting. | Codex | Math/Statistics/Standard Deviation page | YES | NEW | 2026-01-19 | Calculator interface present but statistical calculations not working |
| REQ-20260119-013 | Statistics Calculator Implementation | Implement comprehensive statistics calculator for descriptive and basic inferential statistics. Calculate mean, median, mode, range, standard deviation, variance, percentiles, and quartiles. Support large data sets and provide detailed statistical analysis. | Codex | Math/Statistics/Statistics Calculator page | YES | NEW | 2026-01-19 | Calculator exists but comprehensive statistical analysis not implemented |
| REQ-20260119-014 | Z-Score Calculator Implementation | Implement Z-score standardization calculator for statistical analysis. Calculate Z-scores from raw scores, find probabilities from Z-scores, and determine raw scores from Z-scores. Include standard normal distribution table integration and statistical explanations. | Codex | Math/Statistics/Z-Score Calculator page | YES | NEW | 2026-01-19 | Calculator structure exists but Z-score calculations and normal distribution lookups not functional |

Notes:

- If SEO Impact is YES/UNKNOWN, ensure seo_requirements.md has an entry with Status: PENDING.
- Copilot creates entries in S1; Codex updates Status to VERIFIED in S11 only.
- **Build Rules Location**: `requirements/build_rules/loans/` and `requirements/build_rules/math/`
- Each requirement MUST have corresponding entry in the appropriate build rules file with:
  - 5-column Requirement ID Mapping table (with bullet list format for Rule IDs and Test IDs)
  - Detailed rule definitions
  - Detailed test definitions

---

## Legacy Backlog (pre-FSM)


| Requirement ID | Category | Component                       | Associated Rule IDs                                                               | Description                                                          | Status  | Date Created | Date Completed | Notes                                       |
| ---------------- | ---------- | --------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------- | -------------- | ---------------- | --------------------------------------------- |
| REQ-AUTO-001   | Loans    | Car Loan Calculator             | AUTO-CAR-1, AUTO-CAR-2, AUTO-CAR-3, AUTO-CAR-4, AUTO-CAR-5                        | Implement car loan calculator with all inputs, outputs, table, graph | Pending | 2026-01-19   | -              | Per AUTO_LOAN_RULES.md                      |
| REQ-AUTO-002   | Loans    | Multiple Car Loan Calculator    | AUTO-MULTI-1, AUTO-MULTI-2, AUTO-MULTI-3, AUTO-MULTI-4                            | Implement multi-car loan comparison calculator                       | Pending | 2026-01-19   | -              | Per AUTO_LOAN_RULES.md                      |
| REQ-AUTO-003   | Loans    | Hire Purchase Calculator        | AUTO-HP-1, AUTO-HP-2, AUTO-HP-3, AUTO-HP-4                                        | Implement hire purchase calculator                                   | Pending | 2026-01-19   | -              | Per AUTO_LOAN_RULES.md                      |
| REQ-AUTO-004   | Loans    | PCP Calculator                  | AUTO-PCP-1, AUTO-PCP-2, AUTO-PCP-3, AUTO-PCP-4                                    | Implement PCP calculator                                             | Pending | 2026-01-19   | -              | Per AUTO_LOAN_RULES.md                      |
| REQ-AUTO-005   | Loans    | Leasing Calculator              | AUTO-LEASE-1, AUTO-LEASE-2, AUTO-LEASE-3                                          | Implement leasing calculator                                         | Pending | 2026-01-19   | -              | Per AUTO_LOAN_RULES.md                      |
| REQ-BTL-001    | Loans    | Buy-to-Let Calculator           | BTL-NAV-1, BTL-IN-1 to BTL-IN-5, BTL-IN-R-1 to BTL-IN-C-3, BTL-OUT-1 to BTL-OUT-9 | Implement BTL profitability calculator                               | Pending | 2026-01-19   | -              | Per BUY_TO_LET_RULES.md                     |
| REQ-CC-001     | Loans    | Credit Card Payoff              | CC-PAYOFF-1, CC-PAYOFF-2, CC-PAYOFF-3, CC-PAYOFF-4, CC-PAYOFF-5                   | Implement CC payoff calculator                                       | Pending | 2026-01-19   | -              | Per CREDIT_CARD_RULES.md                    |
| REQ-CC-002     | Loans    | Minimum Payment Calculator      | CC-MIN-1, CC-MIN-2, CC-MIN-3, CC-MIN-4, CC-MIN-5, CC-MIN-6                        | Implement minimum payment calculator                                 | Pending | 2026-01-19   | -              | Per CREDIT_CARD_RULES.md                    |
| REQ-CC-003     | Loans    | Balance Transfer Calculator     | CC-BT-1, CC-BT-2, CC-BT-3, CC-BT-4                                                | Implement balance transfer calculator                                | Pending | 2026-01-19   | -              | Per CREDIT_CARD_RULES.md                    |
| REQ-CC-004     | Loans    | CC Consolidation Calculator     | CC-CONSOL-1, CC-CONSOL-2, CC-CONSOL-3                                             | Implement consolidation calculator                                   | Pending | 2026-01-19   | -              | Per CREDIT_CARD_RULES.md                    |
| REQ-MTG-001    | Loans    | Mortgage Calculator             | MTG-NAV-1, MTG-NAV-2, MTG-IN-1 to MTG-IN-6, MTG-OUT-1 to MTG-OUT-4                | Implement mortgage calculator                                        | Pending | 2026-01-19   | -              | Per HOME_LOAN.MD                            |
| REQ-BOR-001    | Loans    | How Much Can I Borrow           | BOR-NAV-1, BOR-IN-1 to BOR-IN-8, BOR-OUT-1 to BOR-OUT-4, BOR-VAL-1, BOR-VAL-2     | Implement affordability calculator                                   | Pending | 2026-01-19   | -              | Per HOW_MUCH_CAN_I_BORROW_RULES.md          |
| REQ-EMI-001    | Loans    | Loan EMI Calculator             | EMI-IN-1 to EMI-IN-3, EMI-OP-1 to EMI-OP-3, EMI-OUT-1 to EMI-OUT-4                | Implement EMI calculator                                             | Pending | 2026-01-19   | -              | Per LOAN_EMI.md                             |
| REQ-RATE-001   | Loans    | Interest Rate Change Calculator | RATE-NAV-1, RATE-IN-1 to RATE-IN-5, RATE-OUT-1 to RATE-OUT-4                      | Implement rate change calculator                                     | Pending | 2026-01-19   | -              | Per INTEREST_RATE_CHANGE_RULES.md           |
| REQ-LTV-001    | Loans    | LTV Calculator                  | LTV-NAV-1, LTV-IN-1 to LTV-IN-3, LTV-OUT-1 to LTV-OUT-4                           | Implement LTV calculator                                             | Pending | 2026-01-19   | -              | Per LTV_CALCULATOR_RULES.md                 |
| REQ-OFFSET-001 | Loans    | Offset Mortgage Calculator      | OFF-NAV-1, OFF-IN-1 to OFF-IN-5, OFF-OUT-1 to OFF-OUT-4                           | Implement offset mortgage calculator                                 | Pending | 2026-01-19   | -              | Per OFFSET_MORTGAGE_RULES.md                |
| REQ-OPAY-001   | Loans    | Overpayment Calculator          | OPAY-NAV-1, OPAY-IN-1 to OPAY-IN-5, OPAY-OUT-1 to OPAY-OUT-5                      | Implement overpayment calculator                                     | Pending | 2026-01-19   | -              | Per OVERPAYMENT_ADDITIONAL_PAYMENT_RULES.md |
| REQ-REMO-001   | Loans    | Remortgage Calculator           | REMO-NAV-1, REMO-IN-C-1 to REMO-IN-N-6, REMO-OUT-1 to REMO-OUT-6                  | Implement remortgage calculator                                      | Pending | 2026-01-19   | -              | Per REMORTGAGE_SWITCHING_RULES.md           |
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

---

## Legacy Category Codes (pre-FSM)

- **AUTO**: Auto Loans (AUTO_LOAN_RULES.md)
- **BTL**: Buy-to-Let (BUY_TO_LET_RULES.md)
- **CC**: Credit Cards (CREDIT_CARD_RULES.md)
- **MTG**: Mortgage (HOME_LOAN.MD)
- **BOR**: Borrow Calculator (HOW_MUCH_CAN_I_BORROW_RULES.md)
- **EMI**: Loan EMI (LOAN_EMI.md)
- **RATE**: Interest Rate Change (INTEREST_RATE_CHANGE_RULES.md)
- **LTV**: Loan-to-Value (LTV_CALCULATOR_RULES.md)
- **OFFSET**: Offset Mortgage (OFFSET_MORTGAGE_RULES.md)
- **OPAY**: Overpayment (OVERPAYMENT_ADDITIONAL_PAYMENT_RULES.md)
- **REMO**: Remortgage (REMORTGAGE_SWITCHING_RULES.md)
- **LNAV**: Loans Navigation (LOANS_NAVIGATION_RULES.md)
- **STAT**: Statistics (Statistics.md)
- **NAV**: Navigation/UI (calculator-hierarchy.md)
- **UI**: Universal UI (UNIVERSAL_REQUIREMENTS.md)

---

## Legacy Summary (pre-FSM)


| Category       | Total Requirements | Pending | In Progress | Complete | Verified |
| ---------------- | -------------------- | --------- | ------------- | ---------- | ---------- |
| Loans (AUTO)   | 5                  | 5       | 0           | 0        | 0        |
| Loans (BTL)    | 1                  | 1       | 0           | 0        | 0        |
| Loans (CC)     | 4                  | 4       | 0           | 0        | 0        |
| Loans (MTG)    | 1                  | 1       | 0           | 0        | 0        |
| Loans (BOR)    | 1                  | 1       | 0           | 0        | 0        |
| Loans (EMI)    | 1                  | 1       | 0           | 0        | 0        |
| Loans (RATE)   | 1                  | 1       | 0           | 0        | 0        |
| Loans (LTV)    | 1                  | 1       | 0           | 0        | 0        |
| Loans (OFFSET) | 1                  | 1       | 0           | 0        | 0        |
| Loans (OPAY)   | 1                  | 1       | 0           | 0        | 0        |
| Loans (REMO)   | 1                  | 1       | 0           | 0        | 0        |
| UI (LNAV)      | 3                  | 3       | 0           | 0        | 0        |
| Math (STAT)    | 9                  | 9       | 0           | 0        | 0        |
| UI (NAV)       | 1                  | 1       | 0           | 0        | 0        |
| **TOTAL**      | **31**             | **31**  | **0**       | **0**    | **0**    |
