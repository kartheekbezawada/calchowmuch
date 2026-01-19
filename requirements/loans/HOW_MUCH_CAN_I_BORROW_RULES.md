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

# How Much Can I Borrow — Requirements with Rule IDs

Calculator ID: LOAN-BORROW  
Purpose: Estimate affordable borrowing amount and/or affordable monthly payment based on income, expenses, and assumptions.

> **⚠️ IMPORTANT FOR IMPLEMENTING AGENTS:**  
> This calculator MUST comply with all rules in [UNIVERSAL_REQUIREMENTS.md](../universal/UNIVERSAL_REQUIREMENTS.md).  
> Pay special attention to: UI-1.x (colors/typography), UI-2.x (components), UI-3.x (layout), UI-4.x (scrollbars), and TEST-x.x (testing standards).

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

## BOR-UI — User Interface Enhancements (NEW)

**BOR-UI-1**  
No dropdowns. All toggles are button groups.

**BOR-UI-2**  
All tables must use UniversalDataTable and UTBL rules.

**BOR-UI-3**  
All input boxes must have `maxlength="10"` — limit input to 10 digits maximum.

**BOR-UI-4**  
Compact layout for key inputs:
- **Gross Income**, **Monthly Expenses**, and **Monthly Debt Payments** should be displayed in a horizontal row (side-by-side) when screen space allows.
- Each input should have its label/heading directly above the input box.
- Use CSS grid or flexbox to arrange inputs efficiently.
- This saves vertical space and improves usability.

**BOR-UI-5**  
Clear affordability method selection with immediate visual feedback when toggling between Income Multiple and Payment Cap methods.

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

**BOR-OUT-5** (NEW ENHANCEMENT)  
Show debt-to-income ratio (DTI) and loan-to-income ratio (LTI) for transparency.

**BOR-OUT-6** (NEW ENHANCEMENT)  
Show "What-If" scenarios:
- Maximum borrowing at different income multiples (4x, 4.5x, 5x, 5.5x)
- Impact of different interest rates on affordability
- Display as comparison cards or simple table

---

## BOR-VAL — Input Validation

**BOR-VAL-1**  
Invalid inputs block calculation with inline errors.

**BOR-VAL-2**  
If expenses + debts exceed income (net), show "Not affordable" state.

**BOR-VAL-3** (NEW)  
Input validation: reject inputs with more than 10 digits.

---

## BOR-CALC — Enhanced Calculation Features (NEW)

**BOR-CALC-1**  
Provide "Stress Test" functionality:
- Show affordability at different interest rates (current rate + 1%, + 2%, + 3%)
- Display impact on maximum borrowing amount

**BOR-CALC-2**  
Provide "Income Required" reverse calculation:
- Given a desired loan amount, calculate required income
- Show both gross and net income requirements

**BOR-CALC-3**  
Enhanced affordability methods:
- Traditional income multiple (4x-5.5x gross)
- Debt Service Ratio (DSR) - max % of income for all debt payments
- Payment-to-Income ratio - max % of income for mortgage payment only

---

## BOR-TBL — Tables (Explanation Pane)

**BOR-TBL-1**  
Provide a "Scenario Summary" table using UniversalDataTable:
- Metric | Value

**BOR-TBL-2**  
Provide "Affordability Comparison" table showing:
- Method | Max Borrow | Monthly Payment | Notes

**BOR-TBL-3** (NEW)  
Provide "Stress Test" table showing:
- Interest Rate | Max Borrow | Monthly Payment | Income Required

---

## BOR-GRAPH — Graphs

**BOR-GRAPH-1**  
Provide graph: Max Borrow Amount vs Interest Rate (line), using a reasonable rate range around input (e.g., -2% to +2% within non-negative bounds).

**BOR-GRAPH-2**  
Graph must live in fixed-height container and not grow page.

**BOR-GRAPH-3** (NEW ENHANCEMENT)  
Provide secondary visualization: "Affordability Breakdown" chart
- **Option A**: Pie chart showing income allocation (mortgage, expenses, debts, remaining)
- **Option B**: Bar chart comparing different affordability methods
- **Option C**: Waterfall chart showing how expenses reduce available borrowing power

**BOR-GRAPH-4** (NEW)  
Add hover/tooltip functionality: When user hovers over graph points, display:
- Interest rate
- Maximum borrow amount (formatted with currency)
- Corresponding monthly payment

---

## BOR-EXP — Explanation (Must Use Real Values)

**BOR-EXP-1**  
Explain assumptions and show the actual numbers used (income, cap %, resulting payment, implied principal).

**BOR-EXP-2**  
Include at least one worked example using the user's inputs.

**BOR-EXP-3**  
Explanation pane must scroll internally and never expand page height.

**BOR-EXP-4** (NEW)  
When stress test is shown, explain the impact of rate changes in plain English.

**BOR-EXP-5** (NEW)  
Provide clear recommendation: "Based on your inputs, you can afford to borrow up to £X, resulting in monthly payments of £Y."

---

## BOR-A11Y — Accessibility Requirements (NEW)

**BOR-A11Y-1**  
All inputs must have associated `<label>` elements with proper `for` attributes.

**BOR-A11Y-2**  
Button groups must have `role="group"` and `aria-labelledby` attributes.

**BOR-A11Y-3**  
Active toggle button must have `aria-pressed="true"`.

**BOR-A11Y-4**  
Results must use `aria-live="polite"` for screen reader announcements.

**BOR-A11Y-5**  
Graphs must have text alternatives (aria-label or aria-describedby).

**BOR-A11Y-6**  
Keyboard navigation must work for all interactive elements.

---

## BOR-TEST — Testing Requirements (NEW)

> **Test File Location:** `tests/calculators/how-much-can-borrow.spec.js`  
> **Test Framework:** Playwright  
> **Test Log:** `tests/calculators/BORROW_TEST_LOG.md`

### Unit Tests

**BOR-TEST-U-1**  
Test income multiple calculation:
- Input: £60,000 gross income, 4.5x multiple
- Verify max borrow = £270,000

**BOR-TEST-U-2**  
Test payment cap calculation:
- Input: £5,000 monthly income, 35% payment cap, 5% rate, 25 years
- Verify max payment = £1,750 and corresponding loan amount

**BOR-TEST-U-3**  
Test affordability with expenses and debts:
- Input: £60,000 income, £1,500 expenses, £500 debts, 35% cap
- Verify available income calculation and max borrow

**BOR-TEST-U-4**  
Test input validation: reject inputs with more than 10 digits.

**BOR-TEST-U-5**  
Test "not affordable" state:
- Input: expenses + debts > income
- Verify appropriate error message displayed

**BOR-TEST-U-6**  
Test stress test calculations:
- Verify max borrow decreases correctly as interest rate increases

### Integration Tests

**BOR-TEST-I-1**  
Verify results update when affordability method changes:
- Toggle from Income Multiple to Payment Cap → results recalculate
- Values should be different between methods

**BOR-TEST-I-2**  
Verify stress test table updates when input rate changes:
- Change base rate → all stress test scenarios shift accordingly

**BOR-TEST-I-3**  
Verify graph updates correctly when inputs change:
- Change income → graph line shifts up/down
- Change rate → current position marker moves

**BOR-TEST-I-4**  
Verify explanation updates with correct values after calculation.

### E2E / Visual Tests

**BOR-TEST-E2E-1**  
Test compact input layout:
- Verify key inputs can be arranged horizontally on desktop
- Test responsive behavior on mobile (may stack vertically)
- **Screenshot:** `layout-desktop.png`, `layout-mobile.png`

**BOR-TEST-E2E-2**  
Test input maxlength restriction:
- Attempt to type 15 digits → only 10 should be accepted
- **Screenshot:** `input-maxlength.png`

**BOR-TEST-E2E-3**  
Test affordability method toggle:
- Click between Income Multiple and Payment Cap
- Verify active button styling changes
- Verify appropriate input fields show/hide
- **Screenshot:** `method-toggle.png`

**BOR-TEST-E2E-4**  
Test graph interactivity:
- Hover over graph points → tooltip appears with correct values
- Verify tooltip disappears when mouse leaves
- **Screenshot:** `graph-hover-tooltip.png`

**BOR-TEST-E2E-5**  
Test full user journey:
1. Enter gross income: £80,000
2. Enter monthly expenses: £2,000
3. Enter monthly debts: £400
4. Select "Payment Cap" method
5. Enter payment cap: 40%
6. Enter interest rate: 4.5%
7. Enter term: 30 years
8. Click "Calculate Borrowing Power"
9. Verify max borrow amount displayed
10. Verify stress test scenarios shown
- **Screenshot:** `full-journey-result.png`

**BOR-TEST-E2E-6**  
Test error handling:
- Enter 0 for income → error message displayed
- Enter expenses > income → "not affordable" message
- Enter negative values → error messages
- **Screenshot:** `error-states.png`

**BOR-TEST-E2E-7**  
Accessibility test:
- All inputs must have proper labels
- Button groups must have correct ARIA attributes
- Results must announce to screen readers
- Tab navigation must work correctly
- **Screenshot:** `accessibility-check.png`

**BOR-TEST-E2E-8**  
Test layout stability (per UNIVERSAL_REQUIREMENTS.md):
- Navigate to calculator → no layout shift
- Enter values and calculate → no layout shift
- Toggle affordability method → no layout shift
- **Screenshot:** `layout-stability.png`

**BOR-TEST-E2E-9**  
Visual regression test:
- Compare calculator appearance against baseline
- Verify colors match theme tokens
- Verify typography matches universal styles
- **Screenshot:** `visual-regression.png`

---

## Completion Criteria

All BOR-* rules must pass + Universal compliance from [UNIVERSAL_REQUIREMENTS.md](../universal/UNIVERSAL_REQUIREMENTS.md).

### Implementation Checklist:
- [ ] Input boxes limited to 10 digits (maxlength)
- [ ] Compact layout for key inputs
- [ ] Enhanced affordability methods
- [ ] Stress test functionality
- [ ] What-if scenarios display
- [ ] Affordability breakdown visualization
- [ ] Graph hover tooltips
- [ ] Accessibility requirements met
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Comprehensive test log documentation
