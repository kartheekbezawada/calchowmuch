# Remortgage / Switching Calculator — Requirements with Rule IDs

Calculator ID: LOAN-REMO  
Purpose: Compare current mortgage vs new deal, including fees, rate, payment changes, break-even time, and savings.

> **⚠️ IMPORTANT FOR IMPLEMENTING AGENTS:**  
> This calculator MUST comply with all rules in [UNIVERSAL_REQUIREMENTS.md](../universal/UNIVERSAL_REQUIREMENTS.md).  
> Pay special attention to: UI-1.x (colors/typography), UI-2.x (components), UI-3.x (layout), UI-4.x (scrollbars), and TEST-x.x (testing standards).

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Date Created |
|----------------|------------|---------------------|---------------|
| REQ-REMO-001 | Remortgage Calculator | REMO-NAV-1, REMO-IN-C-1 to REMO-IN-C-4, REMO-IN-N-1 to REMO-IN-N-6, REMO-OUT-1 to REMO-OUT-6, REMO-TBL-1 to REMO-TBL-3, REMO-GRAPH-1 to REMO-GRAPH-3, REMO-EXP-1 to REMO-EXP-3 | 2026-01-19 |

---

## REMO-NAV

**REMO-NAV-1**  
Must appear under Loans navigation and be deep-linkable.

---

## REMO-IN — Current Mortgage Inputs

**REMO-IN-C-1**  
Current Balance must be > 0.

**REMO-IN-C-2**  
Current Rate (APR %) must be >= 0.

**REMO-IN-C-3**  
Remaining Term (years) must be >= 1.

**REMO-IN-C-4**  
Current Monthly Payment optional; if provided, calculator must reconcile or explain difference.

---

## REMO-IN — New Mortgage Inputs

**REMO-IN-N-1**  
New Rate (APR %) must be >= 0.

**REMO-IN-N-2**  
New Term (years) must be >= 1 (default = remaining term).

**REMO-IN-N-3**  
New Deal Fees (one-time) numeric >= 0.

**REMO-IN-N-4**  
Exit Fees / ERC (early repayment charge) numeric >= 0.

**REMO-IN-N-5**  
Legal/valuation fees optional numeric >= 0.

---

## REMO-UI — User Interface Enhancements (NEW)

**REMO-UI-1**  
Use universal styles; no dropdowns; fixed-height panes.

**REMO-UI-2**  
All tables must use UniversalDataTable and UTBL rules.

**REMO-UI-3**  
All input boxes must have `maxlength="10"` — limit input to 10 digits maximum.
- For `type="number"`: enforce via JavaScript validation since maxlength doesn't apply to number inputs.

**REMO-UI-4**  
Compact layout for mortgage inputs:
- **Current Balance**, **Current Rate (APR %)**, and **Remaining Term** must be displayed in a horizontal row (side-by-side).
- **New Rate**, **New Term**, and **New Deal Fees** must be displayed in a second horizontal row.
- Each input should have its label/heading directly above the input box.
- Use CSS grid or flexbox to arrange inputs efficiently.
- This saves vertical space and improves usability.

**REMO-UI-5**  
Fee inputs (Exit Fees, Legal Fees) can be in a collapsible "Additional Fees" section to reduce initial clutter.

**REMO-UI-6**  
Button group for horizon must be visually prominent with clear active state indication.

---

## REMO-OUT — Output Display

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
Toggle updates table + graph + summary immediately on selection.

---

## REMO-TBL — Table Display

**REMO-TBL-1**  
Provide "Cost Comparison Table" (UniversalDataTable):
- Month/Year
- Current cumulative cost
- New cumulative cost
- Net savings

**REMO-TBL-2**  
Table must highlight the break-even row (if within horizon) with a distinct background color or border.

**REMO-TBL-3**  
Table must show running totals and clearly indicate when new deal becomes cheaper than current.

---

## REMO-GRAPH — Graph Enhancements (NEW)

**REMO-GRAPH-1**  
Graph: "Cumulative Cost Over Time" (line chart with two lines):
- **Line 1 (Blue/Primary)**: Current mortgage cumulative cost
- **Line 2 (Green/Success)**: New mortgage cumulative cost
- Both lines visible simultaneously for comparison
- Legend must clearly label both lines

**REMO-GRAPH-2**  
Break-even point indicator:
- Vertical dashed line at break-even month
- Dot/marker at the intersection point
- Label showing "Break-even: Month X"

**REMO-GRAPH-3**  
Hover/tooltip functionality: When user hovers over any point on the graph, display:
- Month number
- Current cumulative cost (formatted with currency)
- New cumulative cost (formatted with currency)
- Net savings/loss at that point

**REMO-GRAPH-4**  
Add a secondary visualization showing "Savings Projection":
- **Option A**: Bar chart showing monthly savings over time
- **Option B**: Area chart showing cumulative savings growth
- Must clearly show when savings turn positive (after break-even)

**REMO-GRAPH-5**  
Graph must be responsive and maintain aspect ratio on different screen sizes.

---

## REMO-RATE — Rate Change Scenarios (NEW ENHANCEMENT)

**REMO-RATE-1**  
Provide "What-If Rate Scenarios" section:
- Show impact if rates increase by +0.5%, +1%, +1.5%, +2%
- Display as comparison cards or simple table

**REMO-RATE-2**  
Show "Rate Sensitivity Analysis":
- At what new rate does the switch become unprofitable?
- Display break-even rate prominently

**REMO-RATE-3**  
Optional toggle to show "Fixed vs Variable" comparison if user wants to model rate changes over the horizon period.

---

## REMO-EXP — Explanations

**REMO-EXP-1**  
Explain how fees change the decision and use real computed values.

**REMO-EXP-2**  
Explain break-even logic clearly using the user's numbers.

**REMO-EXP-3**  
When rate scenarios are shown, explain the impact of rate changes in plain English.

**REMO-EXP-4**  
Provide recommendation summary: "Based on your inputs, switching [is/is not] recommended because..."

---

## REMO-A11Y — Accessibility Requirements

**REMO-A11Y-1**  
All inputs must have associated `<label>` elements with proper `for` attributes.

**REMO-A11Y-2**  
Button groups must have `role="group"` and `aria-labelledby` attributes.

**REMO-A11Y-3**  
Active toggle button must have `aria-pressed="true"`.

**REMO-A11Y-4**  
Results must use `aria-live="polite"` for screen reader announcements.

**REMO-A11Y-5**  
Graphs must have text alternatives (aria-label or aria-describedby).

**REMO-A11Y-6**  
Keyboard navigation must work for all interactive elements.

---

## Completion Criteria

All REMO-* rules must pass + Universal compliance from [UNIVERSAL_REQUIREMENTS.md](../universal/UNIVERSAL_REQUIREMENTS.md).

### Implementation Checklist:
- [ ] Input boxes limited to 10 digits (maxlength/JS validation)
- [ ] Current mortgage inputs in horizontal row layout
- [ ] New mortgage inputs in horizontal row layout
- [ ] Collapsible fees section
- [ ] Horizon toggle with immediate updates
- [ ] Table with break-even row highlighting
- [ ] Dual-line cumulative cost graph
- [ ] Break-even marker on graph
- [ ] Graph hover tooltips with values
- [ ] Rate sensitivity analysis
- [ ] What-if scenarios display
- [ ] Accessibility requirements met
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing

---

## REMO-TEST — Testing Requirements

> **Test File Location:** `tests/calculators/remortgage-switching.spec.js`  
> **Test Framework:** Playwright  
> **Test Log:** `tests/calculators/REMORTGAGE_TEST_LOG.md`

### Unit Tests

**REMO-TEST-U-1**  
Test monthly payment calculation accuracy:
- Input: £220,000 balance, 6% rate, 20 years
- Verify calculated monthly payment matches expected value (±£1 tolerance)

**REMO-TEST-U-2**  
Test break-even calculation:
- Input: Current 6%, New 5%, £3000 total fees
- Verify break-even month is calculated correctly

**REMO-TEST-U-3**  
Test cumulative cost calculation:
- Verify cumulative costs are correctly summed over the horizon period

**REMO-TEST-U-4**  
Test savings calculation:
- Verify total savings = (current total cost) - (new total cost + fees)

**REMO-TEST-U-5**  
Test input validation: reject inputs with more than 10 digits.

**REMO-TEST-U-6**  
Test edge cases:
- 0% interest rate (should calculate correctly)
- Same rate on both mortgages
- Very short term (1 year)
- Very long term (30+ years)

### Integration Tests

**REMO-TEST-I-1**  
Verify table updates correctly when horizon toggle changes:
- Select 2 years → table shows 24 rows
- Select 3 years → table shows 36 rows
- Select 5 years → table shows 60 rows

**REMO-TEST-I-2**  
Verify graph updates when inputs change:
- Change current rate → both graph lines update
- Change new rate → new mortgage line updates
- Change fees → break-even marker moves

**REMO-TEST-I-3**  
Verify break-even marker appears/disappears correctly:
- When break-even is within horizon → marker visible
- When break-even is beyond horizon → marker hidden with "not within horizon" message

**REMO-TEST-I-4**  
Verify explanation pane updates with correct values after calculation.

**REMO-TEST-I-5**  
Verify tooltip displays correct values on graph hover.

### E2E / Visual Tests

**REMO-TEST-E2E-1**  
Test compact input layout:
- Verify Current Balance, Current Rate, and Remaining Term inputs are in a single horizontal row
- Verify New Rate, New Term, and New Deal Fees are in a second horizontal row
- Test responsive behavior on mobile (may stack vertically)
- **Screenshot:** `layout-desktop.png`, `layout-mobile.png`

**REMO-TEST-E2E-2**  
Test input maxlength restriction:
- Attempt to type 15 digits → only 10 should be accepted
- **Screenshot:** `input-maxlength.png`

**REMO-TEST-E2E-3**  
Test graph interactivity:
- Hover over each data point → tooltip must appear with correct value
- Verify tooltip disappears when mouse leaves
- **Screenshot:** `graph-hover-tooltip.png`

**REMO-TEST-E2E-4**  
Test break-even visualization:
- Verify break-even line appears at correct position
- Verify break-even dot is visible
- **Screenshot:** `break-even-marker.png`

**REMO-TEST-E2E-5**  
Test horizon toggle functionality:
- Click each horizon option (2, 3, 5 years)
- Verify active button styling changes
- Verify table and graph update
- **Screenshot:** `horizon-2yr.png`, `horizon-3yr.png`, `horizon-5yr.png`

**REMO-TEST-E2E-6**  
Test full user journey:
1. Enter current balance: £250,000
2. Enter current rate: 5.5%
3. Enter remaining term: 15 years
4. Enter new rate: 4.2%
5. Enter new term: 15 years
6. Enter fees: £2,500
7. Click "Compare Deals"
8. Verify results show savings
9. Verify break-even month displayed
10. Verify table shows correct projections
11. Verify graph shows two lines crossing
- **Screenshot:** `full-journey-result.png`

**REMO-TEST-E2E-7**  
Test error handling:
- Enter 0 for current balance → error message displayed
- Enter negative rate → error message displayed
- Enter 0 for term → error message displayed
- **Screenshot:** `error-states.png`

**REMO-TEST-E2E-8**  
Accessibility test:
- All inputs must have proper labels
- Button group must have correct ARIA attributes
- Results must announce to screen readers
- Tab navigation must work correctly
- **Screenshot:** `accessibility-check.png`

**REMO-TEST-E2E-9**  
Test layout stability (per UNIVERSAL_REQUIREMENTS.md):
- Navigate to calculator → no layout shift
- Enter values and calculate → no layout shift
- Toggle horizon → no layout shift
- **Screenshot:** `layout-stability.png`

**REMO-TEST-E2E-10**  
Visual regression test:
- Compare calculator appearance against baseline
- Verify colors match theme tokens
- Verify typography matches universal styles
- **Screenshot:** `visual-regression.png`
