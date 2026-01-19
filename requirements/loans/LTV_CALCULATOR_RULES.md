# Loan-to-Value (LTV) Calculator — Requirements with Rule IDs

Calculator ID: LOAN-LTV  
Purpose: Calculate LTV and show thresholds that affect mortgage eligibility and rates.

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Date Created |
|----------------|------------|---------------------|---------------|
| REQ-LTV-001 | LTV Calculator | LTV-NAV-1, LTV-IN-1 to LTV-IN-3, LTV-OUT-1 to LTV-OUT-4 | 2026-01-19 |

---

## LTV-NAV

**LTV-NAV-1**  
Must appear under Loans navigation and be deep-linkable.

---

## LTV-IN

**LTV-IN-1**  
Property Value > 0.

**LTV-IN-2**  
Loan Amount > 0.

**LTV-IN-3** (Optional)  
Down payment input allowed; if included, loan amount may be derived (toggle amount/percent).

---

## LTV-OUT

**LTV-OUT-1**  
Show LTV percentage = (Loan / Property) * 100.

**LTV-OUT-2**  
Show Deposit amount and deposit percent (if derivable).

**LTV-OUT-3**  
Classify LTV bucket (examples): 60%, 75%, 80%, 85%, 90%, 95% (display as info only).

**LTV-OUT-4**  
Show warning/notice if LTV > 95% (high risk).

---

## LTV-TBL

**LTV-TBL-1**  
Provide threshold table (UniversalDataTable):
- LTV band
- Typical availability note (informational, non-advice)
- Risk note

---

## LTV-GRAPH

**LTV-GRAPH-1**  
Graph: LTV vs Deposit % (line) for the given property value.

---

## LTV-EXP

**LTV-EXP-1**  
Explain LTV meaning using the user’s numbers and show how deposit changes LTV.

**LTV-EXP-2**  
Must include “This is informational, not financial advice” note.

---

## LTV-UI

**LTV-UI-1**  
No dropdowns; fixed-height panes; internal scrolling.

**LTV-UI-2**  
Tables must use UniversalDataTable and UTBL rules.

Completion: LTV-* pass + Universal compliance.
