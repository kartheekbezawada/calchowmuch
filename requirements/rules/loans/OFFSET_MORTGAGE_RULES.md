# Offset Calculator — Requirements with Rule IDs

Calculator ID: LOAN-OFFSET  
Purpose: Show how an offset savings balance reduces mortgage interest and payoff duration.

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-OFFSET-001 | Offset Mortgage Calculator | • OFF-NAV-1<br>• OFF-IN-1<br>• OFF-IN-2<br>• OFF-IN-3<br>• OFF-IN-4<br>• OFF-IN-5<br>• OFF-OUT-1<br>• OFF-OUT-2<br>• OFF-OUT-3<br>• OFF-OUT-4 | • OFF-TEST-U-1<br>• OFF-TEST-E2E-1 | 2026-01-19 |

---

## OFF-NAV

**OFF-NAV-1**  
Must appear under Loans navigation and be deep-linkable.

---

## OFF-IN

**OFF-IN-1**  
Mortgage Balance > 0.

**OFF-IN-2**  
Interest Rate APR ≥ 0.

**OFF-IN-3**  
Remaining Term years ≥ 1.

**OFF-IN-4**  
Offset Savings Balance ≥ 0.

**OFF-IN-5** (Optional)  
Monthly contribution to offset savings ≥ 0.

**OFF-IN-6**  
Offset mode toggle (button group):
- Full offset (interest calculated on balance - savings)
- Partial/average offset (if supported, must be explained)

---

## OFF-OUT

**OFF-OUT-1**  
Show baseline monthly payment and total interest.

**OFF-OUT-2**  
Show offset scenario monthly payment and total interest.

**OFF-OUT-3**  
Show interest saved and time saved.

**OFF-OUT-4**  
Show effective interest-bearing balance = principal - offset savings.

---

## OFF-TBL

**OFF-TBL-1**  
Yearly table required (UniversalDataTable):
- Year
- Offset savings (start/end)
- Interest paid baseline
- Interest paid offset
- Interest saved
- Ending mortgage balance

---

## OFF-GRAPH

**OFF-GRAPH-1**  
Graph: interest paid per year (two lines baseline vs offset) OR remaining balance (two lines).

---

## OFF-EXP

**OFF-EXP-1**  
Explain offset mechanics using real numbers (effective balance, interest saved).

**OFF-EXP-2**  
Explain that offset reduces interest but depends on maintaining savings balance.

---

## OFF-UI

**OFF-UI-1**  
No dropdowns; fixed-height panes; internal scrolling.

**OFF-UI-2**  
Tables must use UniversalDataTable and UTBL rules.

Completion: OFF-* pass + Universal compliance.
