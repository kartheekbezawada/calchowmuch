# Buy-to-Let Calculator — Requirements with Rule IDs

Calculator ID: LOAN-BTL  
Purpose: Estimate buy-to-let profitability: mortgage costs, rental income, net cashflow, yield, and stress test.

---

## BTL-NAV

**BTL-NAV-1**  
Must appear under Loans navigation and be deep-linkable.

---

## BTL-IN — Property & Mortgage

**BTL-IN-1**  
Property Price > 0.

**BTL-IN-2**  
Deposit (amount or %) via toggle (no dropdown).

**BTL-IN-3**  
Interest Rate (APR %) ≥ 0.

**BTL-IN-4**  
Term (years) ≥ 1.

**BTL-IN-5**  
Interest-only vs Repayment toggle (button group).

---

## BTL-IN — Rental & Costs

**BTL-IN-R-1**  
Monthly Rent > 0.

**BTL-IN-R-2**  
Void Period (%) optional ≥ 0 (or “months vacant per year” toggle).

**BTL-IN-C-1**  
Letting Agent Fee (%) optional ≥ 0.

**BTL-IN-C-2**  
Maintenance/monthly costs optional ≥ 0.

**BTL-IN-C-3**  
Insurance, service charge, ground rent optional ≥ 0.

---

## BTL-OUT

**BTL-OUT-1**  
Show monthly mortgage payment (or interest-only payment).

**BTL-OUT-2**  
Show net monthly cashflow after costs.

**BTL-OUT-3**  
Show annual cashflow.

**BTL-OUT-4**  
Show gross yield and net yield.

**BTL-OUT-5**  
Show “stress test” rent coverage ratio (ICR-like): rent / interest payment.

---

## BTL-TBL

**BTL-TBL-1**  
Provide yearly projection table (UniversalDataTable):
- Year
- Rent income
- Costs
- Mortgage cost
- Net cashflow
- Cumulative cashflow

---

## BTL-GRAPH

**BTL-GRAPH-1**  
Graph: net cashflow over years (line).

**BTL-GRAPH-2**  
Optional second graph: sensitivity of cashflow vs interest rate (line).

---

## BTL-EXP

**BTL-EXP-1**  
Explain yields and cashflow using the user’s numbers.

**BTL-EXP-2**  
Explain interest-only vs repayment tradeoff.

---

## BTL-UI

**BTL-UI-1**  
No dropdowns; use toggles as button groups.

**BTL-UI-2**  
Tables must use UniversalDataTable and UTBL rules.

Completion: BTL-* pass + Universal compliance.
