# Overpayment / Additional Payment Calculator — Requirements with Rule IDs

Calculator ID: LOAN-OPAY  
Purpose: Show how extra payments reduce payoff time and interest on an existing loan/mortgage.

---

## OPAY-NAV

**OPAY-NAV-1**  
Must appear under Loans navigation and be deep-linkable.

---

## OPAY-IN

**OPAY-IN-1**  
Current Balance > 0.

**OPAY-IN-2**  
Interest Rate APR ≥ 0.

**OPAY-IN-3**  
Remaining Term years ≥ 1.

**OPAY-IN-4**  
Extra payment mode toggle (button group):
- Extra Monthly amount
- Extra Annual lump sum

**OPAY-IN-5**  
Extra payment value ≥ 0.

---

## OPAY-OUT

**OPAY-OUT-1**  
Show baseline payoff date/duration and interest.

**OPAY-OUT-2**  
Show new payoff date/duration and interest with overpayment.

**OPAY-OUT-3**  
Show interest saved and time saved.

---

## OPAY-TGL

**OPAY-TGL-1**  
Toggle Monthly vs Yearly view in explanation (button group).

---

## OPAY-TBL

**OPAY-TBL-M-1**  
Monthly table required (UniversalDataTable):
- Month
- Payment
- Principal
- Interest
- Extra
- Remaining balance

**OPAY-TBL-Y-1**  
Yearly table required (UniversalDataTable):
- Year
- Total paid
- Principal
- Interest
- Extra
- Ending balance

---

## OPAY-GRAPH

**OPAY-GRAPH-1**  
Graph: remaining balance over time with two lines:
- Baseline
- Overpayment

**OPAY-GRAPH-2**  
Graph switches monthly/yearly per toggle.

---

## OPAY-EXP

**OPAY-EXP-1**  
Explanation must reference real values and explicitly state interest saved and time saved.

---

## OPAY-UI

**OPAY-UI-1**  
Fixed-height panes; no page growth.

**OPAY-UI-2**  
Tables must use UniversalDataTable and UTBL rules.

Completion: OPAY-* pass + Universal compliance.
