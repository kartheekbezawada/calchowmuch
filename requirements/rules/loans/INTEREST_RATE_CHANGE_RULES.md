# Interest Rate Change Calculator — Requirements with Rule IDs

Calculator ID: LOAN-RATECHG  
Purpose: Show impact of interest rate changes on monthly payment, total interest, and payoff trajectory.

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-RATE-001 | Interest Rate Change Calculator | • RATE-NAV-1<br>• RATE-IN-1<br>• RATE-IN-2<br>• RATE-IN-3<br>• RATE-IN-4<br>• RATE-IN-5<br>• RATE-OUT-1<br>• RATE-OUT-2<br>• RATE-OUT-3<br>• RATE-OUT-4 | • RATE-TEST-U-1<br>• RATE-TEST-E2E-1 | 2026-01-19 |

---

## RATE-NAV

**RATE-NAV-1**  
Must appear under Loans navigation and be deep-linkable.

---

## RATE-IN

**RATE-IN-1**  
Loan Balance > 0.

**RATE-IN-2**  
Current Rate APR ≥ 0.

**RATE-IN-3**  
New Rate APR ≥ 0.

**RATE-IN-4**  
Remaining Term years ≥ 1.

**RATE-IN-5**  
Change timing input:
- Apply immediately
- Apply after X months
Implemented via toggle + numeric input (no dropdown).

---

## RATE-OUT

**RATE-OUT-1**  
Show current monthly payment.

**RATE-OUT-2**  
Show new monthly payment after rate change.

**RATE-OUT-3**  
Show monthly difference and annual difference.

**RATE-OUT-4**  
Show change in total interest paid (baseline vs new).

---

## RATE-TBL

**RATE-TBL-1**  
Yearly comparison table (UniversalDataTable):
- Year
- Interest paid baseline
- Interest paid new
- Payment baseline
- Payment new
- Balance baseline
- Balance new

---

## RATE-GRAPH

**RATE-GRAPH-1**  
Graph: monthly payment over time with two lines:
- baseline
- new rate scenario

**RATE-GRAPH-2**  
If rate change occurs after X months, graph must show step change at that point.

---

## RATE-EXP

**RATE-EXP-1**  
Explain why rate changes impact amortization and show real values.

---

## RATE-UI

**RATE-UI-1**  
No dropdowns; fixed-height panes; internal scrolling.

**RATE-UI-2**  
Tables must use UniversalDataTable and UTBL rules.

Completion: RATE-* pass + Universal compliance.
