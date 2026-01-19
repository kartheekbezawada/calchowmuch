# Mortgage Calculator — Requirements with Rule IDs

Calculator ID: LOAN-MTG  
Purpose: Compute mortgage monthly payment, interest vs principal split, and payoff timeline with amortization tables and graphs.

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Date Created |
|----------------|------------|---------------------|---------------|
| REQ-MTG-001 | Mortgage Calculator | MTG-NAV-1, MTG-NAV-2, MTG-IN-1 to MTG-IN-6, MTG-OP-1 to MTG-OP-4, MTG-OUT-1 to MTG-OUT-5, MTG-TBL-1 to MTG-TBL-3, MTG-GRAPH-1 to MTG-GRAPH-3, MTG-EXP-1 to MTG-EXP-3 | 2026-01-19 |

---

## MTG-NAV — Navigation & Deep Linking

**MTG-NAV-1**  
Mortgage Calculator must appear under Loans navigation in the correct category.

**MTG-NAV-2**  
Direct URL must:
- Activate Loans top button
- Expand correct category
- Highlight Mortgage Calculator
- Load Mortgage UI + Explanation content

---

## MTG-IN — Inputs (Calculation Pane)

**MTG-IN-1**  
Home Price must be numeric and > 0.

**MTG-IN-2**  
Down Payment must support:
- Amount (£) and
- Percent (%)
Implemented via button toggle (no dropdowns).

**MTG-IN-3**  
Loan Term must be selectable as years (integer ≥ 1). (Button group if multiple presets, otherwise numeric input.)

**MTG-IN-4**  
Interest Rate (APR %) must be numeric and ≥ 0.

**MTG-IN-5** (Optional but recommended)  
Property Tax (annual) and Home Insurance (annual) can be included as optional inputs to show PITI breakdown. Must be clearly labeled as optional.

**MTG-IN-6** (Optional)  
Start Date optional; if absent, schedule uses Month 1..N.

---

## MTG-OP — Overpayment / Extra Payments

**MTG-OP-1**  
Extra Monthly Payment must be supported.

**MTG-OP-2** (Optional)  
One-time Lump Sum payment option allowed (with month selector). Must not use dropdown.

**MTG-OP-3**  
Extra payments must never drive remaining balance negative; final payment must adjust.

**MTG-OP-4**  
Baseline vs With-Overpayment comparison must be shown.

---

## MTG-OUT — Outputs (Calculation Pane)

**MTG-OUT-1**  
Show Monthly Payment (principal + interest) at minimum.

**MTG-OUT-2**  
Show monthly breakdown for the first payment:
- principal portion
- interest portion

**MTG-OUT-3**  
Show payoff timeline:
- total months
- payoff date if start date is provided

**MTG-OUT-4**  
Show lifetime totals:
- total paid
- total interest

**MTG-OUT-5**  
If taxes/insurance included, show:
- total monthly payment (PITI)
- component breakdown

**MTG-OUT-6**  
If overpayment enabled, show:
- new payoff timeline
- interest saved
- time saved

---

## MTG-VAL — Validation & Error Handling

**MTG-VAL-1**  
All invalid inputs block calculation and show inline errors.

**MTG-VAL-2**  
0% interest must be handled correctly: payment = principal / months.

**MTG-VAL-3**  
Down payment percent must be in [0, 100). Down payment amount must be < home price.

**MTG-VAL-4**  
Term must be ≥ 1 year.

---

## MTG-EXP — Explanation Pane Content (Must Use Real Values)

**MTG-EXP-1**  
Explanation must reference the user’s actual computed values (not placeholders).

**MTG-EXP-2**  
Explanation must include:
- what a mortgage payment is
- amortization meaning (why interest is higher early)
- payoff timeline interpretation
- what extra payments change (time + interest)

**MTG-EXP-3**  
Explanation must include “Monthly Summary”, “Yearly Summary”, and “Lifetime Totals” using real values.

**MTG-EXP-4**  
Explanation pane must remain fixed height and scroll internally.

---

## MTG-TGL — Explanation Toggles (No Dropdowns)

**MTG-TGL-1**  
Provide a toggle for:
- Monthly view
- Yearly view

**MTG-TGL-2**  
Toggle switching must update:
- table
- graph
- summary text

---

## MTG-TBL — Tables (Explanation Pane Only)

**MTG-TBL-M-1**  
Monthly amortization table required with columns:
- Month (or date)
- Payment
- Principal
- Interest
- Extra (if any)
- Remaining balance

**MTG-TBL-Y-1**  
Yearly summary table required with columns:
- Year
- Total paid
- Total principal
- Total interest
- Total extra
- Ending balance

**MTG-TBL-2**  
Tables must live only in the Explanation pane (not Calculation pane).

---

## MTG-GRAPH — Graphs (Explanation Pane Only)

**MTG-GRAPH-1**  
Graph must exist and be visible.

**MTG-GRAPH-M-1**  
Monthly view graph must show remaining balance vs month (line minimum).

**MTG-GRAPH-Y-1**  
Yearly view graph must show remaining balance vs year (line minimum).

**MTG-GRAPH-2**  
Graph must update on:
- recalculation
- toggle change
- overpayment change

**MTG-GRAPH-3**  
Graph must not increase page height; it must fit in fixed-height container with internal scroll.

---

## MTG-UI — Universal UI Compliance

**MTG-UI-1**  
All controls use universal styles (same as Basic).

**MTG-UI-2**  
No dropdowns (`<select>`) anywhere.

**MTG-UI-3**  
Toggle controls must be button groups.

**MTG-UI-4**  
No page growth: left nav, calculation, explanation panes scroll internally.

---

## Completion Criteria

**MTG-DONE-1**  
All MTG-* rules pass and no Universal rule is violated.
