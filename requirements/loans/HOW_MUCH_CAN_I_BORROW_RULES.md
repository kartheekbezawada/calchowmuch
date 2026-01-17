# How Much Can I Borrow — Requirements with Rule IDs

Calculator ID: LOAN-BORROW  
Purpose: Estimate affordable borrowing amount and/or affordable monthly payment based on income, expenses, and assumptions.

---

## BOR-NAV

**BOR-NAV-1**  
Must appear under Loans navigation and be deep-linkable.

---

## BOR-IN — Inputs (Calculation Pane)

**BOR-IN-1**  
Gross Annual Income must be numeric and > 0.

**BOR-IN-2**  
Net Monthly Income must be optional; if provided, calculator must clarify which is used (toggle: Gross-based vs Net-based).

**BOR-IN-3**  
Monthly Expenses must be numeric and ≥ 0.

**BOR-IN-4**  
Monthly Debt Payments must be numeric and ≥ 0.

**BOR-IN-5**  
Interest Rate (APR %) must be numeric and ≥ 0.

**BOR-IN-6**  
Loan Term (years) must be integer ≥ 1.

**BOR-IN-7**  
Affordability Method must be a button-group toggle:
- Income Multiple method (e.g., 4x–5.5x)
- Payment-based method (DSR / payment cap)

No dropdowns.

**BOR-IN-8** (Optional)  
Deposit/Down payment optional numeric ≥ 0 (to infer home price affordability).

---

## BOR-OUT — Outputs

**BOR-OUT-1**  
Show Maximum Borrow Amount (principal) clearly.

**BOR-OUT-2**  
Show Estimated Monthly Payment at max borrow.

**BOR-OUT-3**  
Show affordability constraints used (e.g., income multiple, max payment %).

**BOR-OUT-4**  
If deposit provided, show Estimated Max Property Price.

---

## BOR-VAL

**BOR-VAL-1**  
Invalid inputs block calculation with inline errors.

**BOR-VAL-2**  
If expenses + debts exceed income (net), show “Not affordable” state.

---

## BOR-EXP — Explanation (Must Use Real Values)

**BOR-EXP-1**  
Explain assumptions and show the actual numbers used (income, cap %, resulting payment, implied principal).

**BOR-EXP-2**  
Include at least one worked example using the user’s inputs.

**BOR-EXP-3**  
Explanation pane must scroll internally and never expand page height.

---

## BOR-TBL — Tables (Explanation Pane)

**BOR-TBL-1**  
Provide a small “Scenario Summary” table using UniversalDataTable:
- Metric | Value

**BOR-TBL-2**  
If multiple rates or terms are supported, provide comparison table.

---

## BOR-GRAPH — Graphs

**BOR-GRAPH-1**  
Provide graph: Max Borrow Amount vs Interest Rate (line), using a reasonable rate range around input (e.g., -2% to +2% within non-negative bounds).

**BOR-GRAPH-2**  
Graph must live in fixed-height container and not grow page.

---

## BOR-UI

**BOR-UI-1**  
No dropdowns. All toggles are button groups.

**BOR-UI-2**  
All tables must use UniversalDataTable and UTBL rules.

Completion: all BOR-* rules pass + Universal compliance.
