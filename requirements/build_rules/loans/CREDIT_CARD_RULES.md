# Credit Card Calculators - Requirements with Rule IDs

Scope: Loans - Credit Cards category.

Calculators covered:
- Repayment / Payoff Calculator
- Minimum Payment Calculator
- Balance Transfer / Installment Plan Calculator
- Credit Card Consolidation Calculator

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-CC-001 | Repayment / Payoff Calculator | • CC-NAV-1<br>• CC-NAV-2<br>• CC-IN-1<br>• CC-IN-2<br>• CC-IN-3<br>• CC-IN-4<br>• CC-PAYOFF-1<br>• CC-PAYOFF-2<br>• CC-PAYOFF-3<br>• CC-PAYOFF-4<br>• CC-PAYOFF-5 | • CC-TEST-U-1<br>• CC-TEST-E2E-1 | 2026-01-19 |
| REQ-CC-002 | Minimum Payment Calculator | • CC-NAV-1<br>• CC-NAV-2<br>• CC-IN-1<br>• CC-IN-2<br>• CC-IN-3<br>• CC-IN-4<br>• CC-MIN-1<br>• CC-MIN-2<br>• CC-MIN-3<br>• CC-MIN-4<br>• CC-MIN-5<br>• CC-MIN-6 | • CC-TEST-U-2<br>• CC-TEST-E2E-2 | 2026-01-19 |
| REQ-CC-003 | Balance Transfer Calculator | • CC-NAV-1<br>• CC-NAV-2<br>• CC-IN-1<br>• CC-IN-2<br>• CC-IN-3<br>• CC-IN-4<br>• CC-BT-1<br>• CC-BT-2<br>• CC-BT-3<br>• CC-BT-4 | • CC-TEST-U-3<br>• CC-TEST-E2E-3 | 2026-01-19 |
| REQ-CC-004 | CC Consolidation Calculator | • CC-NAV-1<br>• CC-NAV-2<br>• CC-IN-1<br>• CC-IN-2<br>• CC-IN-3<br>• CC-IN-4<br>• CC-CONSOL-1<br>• CC-CONSOL-2<br>• CC-CONSOL-3 | • CC-TEST-U-4<br>• CC-TEST-E2E-4 | 2026-01-19 |

---

## CC-NAV

**CC-NAV-1**  
All credit card calculators must appear under Loans - Credit Cards in navigation and be deep-linkable.

**CC-NAV-2**  
Display names must match the universal hierarchy exactly.

---

## CC-IN - Shared Input Rules

**CC-IN-1**  
Balance inputs must be numeric and > 0.

**CC-IN-2**  
APR inputs must be numeric and >= 0.

**CC-IN-3**  
Monthly payment inputs must be numeric and > 0.

**CC-IN-4**  
Use button groups for mode toggles (no dropdowns).

---

## CC-PAYOFF - Repayment / Payoff Calculator

**CC-PAYOFF-1**  
Inputs: balance, APR, monthly payment, optional extra payment.

**CC-PAYOFF-2**  
If payment is insufficient to reduce principal (payment <= monthly interest), show an error.

**CC-PAYOFF-3**  
Outputs: payoff months, total interest, total paid, average monthly payment.

**CC-PAYOFF-4**  
Table: yearly summary with Year, Payments, Interest, Ending Balance.

**CC-PAYOFF-5**  
Graph: balance over time (line).

---

## CC-MIN - Minimum Payment Calculator

**CC-MIN-1**  
Inputs: balance, APR, minimum payment rate (%), minimum payment floor.

**CC-MIN-2**  
Payment per month = max(balance * rate %, floor), capped at remaining balance + interest.

**CC-MIN-3**  
If minimum payment cannot reduce principal, show an error.

**CC-MIN-4**  
Outputs: payoff months, total interest, total paid, first payment, last payment.

**CC-MIN-5**  
Table: yearly summary with Year, Payments, Interest, Ending Balance.

**CC-MIN-6**  
Graph: balance over time (line).

---

## CC-BT - Balance Transfer / Installment Plan

**CC-BT-1**  
Inputs: transfer balance, transfer fee %, promo APR, promo months, post-promo APR, monthly payment.

**CC-BT-2**  
Transfer fee is applied upfront to the balance.

**CC-BT-3**  
Promo APR applies for promo months; post-promo APR applies afterward.

**CC-BT-4**  
Outputs: payoff months, total interest, total fees, total paid.

**CC-BT-5**  
Table: yearly summary with Year, Payments, Interest, Ending Balance.

**CC-BT-6**  
Graph: balance over time (line).

---

## CC-CONSOL - Credit Card Consolidation

**CC-CONSOL-1**  
Inputs: current balance, current APR, current monthly payment, consolidation APR, consolidation term (years), optional consolidation fees.

**CC-CONSOL-2**  
Comparison must show current payoff vs consolidation loan payoff.

**CC-CONSOL-3**  
Outputs: monthly payment difference, total interest difference, total cost difference.

**CC-CONSOL-4**  
Table: summary with Current vs Consolidation totals.

**CC-CONSOL-5**  
Graph: balance over time (line) for both scenarios.

---

## CC-EXP

**CC-EXP-1**  
Explanation must show a summary using the user's inputs and outcomes.

**CC-EXP-2**  
Include a short note about interest compounding and payment sensitivity.

---

## CC-UI

**CC-UI-1**  
Use shared calculator classes and Universal table/graph rules.

Completion: CC-* pass + Universal compliance.
