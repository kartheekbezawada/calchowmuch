# Auto Loan Calculators - Requirements with Rule IDs

Scope: Loans - Auto Loans category.

Calculators covered:
- Car Loan Calculator
- Multiple Car Loan Calculator
- Hire Purchase Calculator
- PCP (Personal Contract Purchase) Calculator
- Leasing Calculator

---

## AUTO-NAV

**AUTO-NAV-1**  
All auto loan calculators must appear under Loans - Auto Loans in navigation and be deep-linkable.

**AUTO-NAV-2**  
Display names must match the universal hierarchy exactly.

---

## AUTO-IN - Shared Input Rules

**AUTO-IN-1**  
Vehicle price/balance inputs must be numeric and > 0.

**AUTO-IN-2**  
APR inputs must be numeric and >= 0.

**AUTO-IN-3**  
Term inputs must be numeric and >= 1 (years or months as labeled).

**AUTO-IN-4**  
Use button groups for mode toggles (no dropdowns).

---

## AUTO-CAR - Car Loan Calculator

**AUTO-CAR-1**  
Inputs: vehicle price, down payment (amount or %), trade-in, fees, sales tax %, APR, term (years).

**AUTO-CAR-2**  
Amount financed = price - down payment - trade-in + fees + tax.

**AUTO-CAR-3**  
Outputs: monthly payment, total interest, total cost, amount financed.

**AUTO-CAR-4**  
Table: yearly summary with Year, Payments, Interest, Ending Balance.

**AUTO-CAR-5**  
Graph: balance over time (line).

---

## AUTO-MULTI - Multiple Car Loan Calculator

**AUTO-MULTI-1**  
Inputs: at least two loans with balance, APR, term (years).

**AUTO-MULTI-2**  
Outputs: monthly payment and total interest per loan, plus combined totals.

**AUTO-MULTI-3**  
Table: summary with Loan A, Loan B, Combined.

**AUTO-MULTI-4**  
Graph: monthly payment comparison (bars).

---

## AUTO-HP - Hire Purchase Calculator

**AUTO-HP-1**  
Inputs: vehicle price, deposit, APR, term (months), final balloon (optional).

**AUTO-HP-2**  
Monthly payment must account for optional balloon (residual value).

**AUTO-HP-3**  
Outputs: monthly payment, total interest, total payable, final balloon.

**AUTO-HP-4**  
Table: yearly summary with Year, Payments, Interest, Ending Balance.

**AUTO-HP-5**  
Graph: balance over time (line).

---

## AUTO-PCP - PCP Calculator

**AUTO-PCP-1**  
Inputs: vehicle price, deposit, APR, term (months), balloon (GFV), option fee.

**AUTO-PCP-2**  
Monthly payment must account for GFV; option fee is added to the final payment.

**AUTO-PCP-3**  
Outputs: monthly payment, total interest, total payable, final payment (GFV + fee).

**AUTO-PCP-4**  
Table: yearly summary with Year, Payments, Interest, Ending Balance.

**AUTO-PCP-5**  
Graph: balance over time (line).

---

## AUTO-LEASE - Leasing Calculator

**AUTO-LEASE-1**  
Inputs: vehicle price, residual value (amount or %), term (months), money factor, upfront payment.

**AUTO-LEASE-2**  
Monthly lease payment = depreciation fee + finance fee.

**AUTO-LEASE-3**  
Outputs: monthly payment, total lease cost, upfront payment, residual value.

**AUTO-LEASE-4**  
Table: yearly summary with Year, Payments, Effective Cost.

**AUTO-LEASE-5**  
Graph: total cost accumulation over time (line).

---

## AUTO-EXP

**AUTO-EXP-1**  
Explanation must show a summary using the user's inputs and outcomes.

**AUTO-EXP-2**  
Include a short note about balloon/residual values where applicable.

---

## AUTO-UI

**AUTO-UI-1**  
Use shared calculator classes and Universal table/graph rules.

Completion: AUTO-* pass + Universal compliance.
