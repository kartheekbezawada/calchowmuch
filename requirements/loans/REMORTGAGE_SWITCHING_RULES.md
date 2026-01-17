# Remortgage / Switching Calculator — Requirements with Rule IDs

Calculator ID: LOAN-REMO  
Purpose: Compare current mortgage vs new deal, including fees, rate, payment changes, break-even time, and savings.

---

## REMO-NAV

**REMO-NAV-1**  
Must appear under Loans navigation and be deep-linkable.

---

## REMO-IN — Current Mortgage Inputs

**REMO-IN-C-1**  
Current Balance must be > 0.

**REMO-IN-C-2**  
Current Rate (APR %) must be ≥ 0.

**REMO-IN-C-3**  
Remaining Term (years) must be ≥ 1.

**REMO-IN-C-4**  
Current Monthly Payment optional; if provided, calculator must reconcile or explain difference.

---

## REMO-IN — New Mortgage Inputs

**REMO-IN-N-1**  
New Rate (APR %) must be ≥ 0.

**REMO-IN-N-2**  
New Term (years) must be ≥ 1 (default = remaining term).

**REMO-IN-N-3**  
New Deal Fees (one-time) numeric ≥ 0.

**REMO-IN-N-4**  
Exit Fees / ERC (early repayment charge) numeric ≥ 0.

**REMO-IN-N-5**  
Legal/valuation fees optional numeric ≥ 0.

---

## REMO-OUT

**REMO-OUT-1**  
Show Current monthly payment vs New monthly payment.

**REMO-OUT-2**  
Show monthly difference and annual difference.

**REMO-OUT-3**  
Show total cost over a chosen comparison horizon (default: 2–5 years toggle).

**REMO-OUT-4**  
Show break-even month: when savings exceed fees.

**REMO-OUT-5**  
Show total savings (or extra cost) over the horizon.

---

## REMO-TGL — Toggles

**REMO-TGL-1**  
Provide toggle for comparison horizon:
- 2 years
- 3 years
- 5 years
(button group, no dropdown)

**REMO-TGL-2**  
Toggle updates table + graph + summary.

---

## REMO-TBL

**REMO-TBL-1**  
Provide “Cost Comparison Table” (UniversalDataTable):
- Month/Year
- Current cumulative cost
- New cumulative cost
- Net savings

---

## REMO-GRAPH

**REMO-GRAPH-1**  
Graph: cumulative cost over time (two lines: Current vs New).

**REMO-GRAPH-2**  
Graph must indicate break-even point if it occurs.

---

## REMO-EXP

**REMO-EXP-1**  
Explain how fees change the decision and use real computed values.

**REMO-EXP-2**  
Explain break-even logic clearly using the user’s numbers.

---

## REMO-UI

**REMO-UI-1**  
Use universal styles; no dropdowns; fixed-height panes.

**REMO-UI-2**  
All tables must use UniversalDataTable and UTBL rules.

Completion: REMO-* pass + Universal compliance.
