# Remortgage / Switching Calculator — Requirements with Rule IDs

Calculator ID: LOAN-REMO  
Purpose: Compare current mortgage vs new deal, including fees, rate, payment changes, break-even time, and savings.

> **⚠️ IMPORTANT FOR IMPLEMENTING AGENTS:**  
> This calculator MUST comply with all rules in [UNIVERSAL_REQUIREMENTS.md](../universal/UNIVERSAL_REQUIREMENTS.md).  
> Pay special attention to: UI-1.x (colors/typography), UI-2.x (components), UI-3.x (layout), UI-4.x (scrollbars), and TEST-x.x (testing standards).

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-REMO-001 | Remortgage Calculator | • REMO-NAV-1<br>• REMO-IN-C-1<br>• REMO-IN-C-2<br>• REMO-IN-C-3<br>• REMO-IN-C-4<br>• REMO-IN-N-1<br>• REMO-IN-N-2<br>• REMO-IN-N-3<br>• REMO-IN-N-4<br>• REMO-IN-N-5<br>• REMO-IN-N-6<br>• REMO-OUT-1<br>• REMO-OUT-2<br>• REMO-OUT-3<br>• REMO-OUT-4<br>• REMO-OUT-5<br>• REMO-OUT-6<br>• REMO-TBL-1<br>• REMO-TBL-2<br>• REMO-TBL-3<br>• REMO-GRAPH-1<br>• REMO-GRAPH-2<br>• REMO-GRAPH-3<br>• REMO-EXP-1<br>• REMO-EXP-2<br>• REMO-EXP-3 | • REMO-TEST-U-1<br>• REMO-TEST-U-2<br>• REMO-TEST-E2E-1<br>• REMO-TEST-E2E-2 | 2026-01-19 |
| REQ-20260126-001 | Remortgage Calculator UI/UX Improvements | • REMO-UI-7<br>• REMO-UI-8<br>• REMO-UI-9<br>• REMO-UI-10<br>• REMO-UI-11 | • REMO-TEST-E2E-UX-1<br>• REMO-TEST-E2E-UX-2<br>• REMO-TEST-E2E-UX-3 | 2026-01-26 |
| REQ-20260126-002 | Remortgage Calculator: No Vertical Scroll in Calculation Pane | • REMO-LAYOUT-1<br>• REMO-LAYOUT-2<br>• REMO-LAYOUT-3<br>• REMO-LAYOUT-4<br>• REMO-LAYOUT-5<br>• REMO-LAYOUT-6 | • REMO-TEST-LAYOUT-1<br>• REMO-TEST-LAYOUT-2<br>• REMO-TEST-LAYOUT-3 | 2026-01-26 |
| REQ-20260126-003 | Remortgage Calc: Input Reflow for 1366x768 Viewport | • REMO-REFLOW-1<br>• REMO-REFLOW-2<br>• REMO-REFLOW-3<br>• REMO-REFLOW-4 | • REMO-TEST-REFLOW-1<br>• REMO-TEST-REFLOW-2 | 2026-01-26 |
| REQ-20260126-004 | Revert REQ-20260126-003 Implementation | • REMO-REVERT-1<br>• REMO-REVERT-2<br>• REMO-REVERT-3 | • REMO-TEST-REVERT-1<br>• REMO-TEST-REVERT-2 | 2026-01-26 |

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

**REMO-UI-7** (REQ-20260126-001)  
Additional Fees toggle buttons must function correctly:
- Currently the Hide/Show toggle is always showing the fees section even when "Hide" is selected
- Fix the toggle logic to properly hide/show the additional fees section
- When "Hide" is pressed: additional fees inputs (Exit Fees, Legal/Valuation Fees) must be visually hidden
- When "Show" is pressed: additional fees inputs must be visible

**REMO-UI-8** (REQ-20260126-001)  
Rename Additional Fees toggle button text:
- Change "Hide" button text to "Exclude"
- Change "Show" button text to "Include"
- "Include" means show/include the additional fees in calculations
- "Exclude" means hide/exclude the additional fees from calculations

**REMO-UI-9** (REQ-20260126-001)  
Rename main action button:
- Change "Compare Deals" button text to "Calculate"
- This provides clearer user intent and matches standard calculator UX

**REMO-UI-10** (REQ-20260126-001)  
Prevent calculations before user action:
- Currently calculations are happening automatically before the "Compare Deals" button is pressed
- All calculations must ONLY happen after the user clicks the "Calculate" button
- No auto-calculation on input change or page load with default values
- Results area must remain empty until user explicitly triggers calculation

**REMO-UI-11** (REQ-20260126-001)  
Optimize calculator pane layout to eliminate scroll:
- All calculation input boxes and buttons must fit within the calculator pane without requiring scrollbar
- Currently input elements overflow to bottom requiring vertical scroll
- Improve vertical spacing, reduce padding/margins, or reorganize layout to make everything visible
- Follow UNIVERSAL_REQUIREMENTS.md UI-3.x layout constraints for fixed-height panes
- Calculator pane should show all inputs, buttons, and initial results area without scrolling

---

## REMO-LAYOUT — Calculation Pane Layout Constraints (REQ-20260126-002)

**REMO-LAYOUT-1**  
No vertical scrolling in Calculation Pane:
- `overflow-y: hidden` or equivalent behavior must be enforced
- Scrollbars must not appear at any time for the remortgage calculator
- The Calculation Pane must not introduce vertical scrollbar at standard desktop viewport sizes (1366×768 and above)
- scrollHeight must be <= clientHeight for the calculation pane element

**REMO-LAYOUT-2**  
All mandatory inputs must be visible simultaneously:
- Current Balance, Current Rate, Remaining Term, Current Monthly Payment
- New Rate, New Term, New Deal Fees
- Additional Fees section (Exit Fees, Legal/Valuation Fees) 
- Comparison Horizon buttons (2/3/5 years)
- Calculate button
- All must be visible without any scrolling action by the user

**REMO-LAYOUT-3**  
Horizontal and sectional reflow allowed:
- Inputs may flow into two columns for space efficiency
- Inputs may collapse into logical sections (Current Deal vs New Deal)
- Inputs may use grouped rows for visual organization
- Goal is visibility first, then optimal density
- Must not reduce font size below existing calculator standards

**REMO-LAYOUT-4**  
Pane contract preservation:
- Calculation Pane: inputs + Calculate action only
- Explanation Pane: results, summaries, tables, graphs
- No output elements may be moved into Calculation Pane to "make space"
- No dynamic resizing that causes layout shift after page load

**REMO-LAYOUT-5**  
Layout stability requirements:
- Pane height must remain stable after initial page load
- Changing input values must not cause reflow that introduces scrolling
- Layout must work at desktop baseline viewport (1366×768) and above
- No regression to other calculators' layouts allowed

**REMO-LAYOUT-6**  
Input visibility rules:
- Must not hide required inputs behind toggles by default
- Optional/advanced fields (like additional fees) may be grouped but core inputs visible
- Core inputs: Balance, Current Rate, Term, New Rate, New Term, Fees, Calculate button

---

## REMO-REFLOW — Input Reflow for 1366x768 Viewport (REQ-20260126-003)

**REMO-REFLOW-1**  
Specific 1366x768 viewport constraint:
- Calculation pane must not scroll at exactly 1366x768 resolution
- This is the minimum desktop viewport that must be supported
- Test specifically at this resolution to ensure no vertical scrollbar appears
- All inputs must be visible within the available viewport height at this resolution

**REMO-REFLOW-2**  
Keep Additional Fees visible by default:
- Additional Fees section (Exit Fees, Legal/Valuation Fees) must remain visible
- Do NOT hide Additional Fees behind collapsed/toggle states to save space
- Users should see the complete fee structure upfront for transparent comparison
- Both Exit Fees and Legal/Valuation fee inputs must be visible without user interaction

**REMO-REFLOW-3**  
Input reflow strategies for space optimization:
- Arrange inputs in efficient grid layouts (2-3 columns where logical)
- Group related inputs: Current Deal vs New Deal vs Fees vs Options
- Reduce vertical spacing/padding between input groups while maintaining readability
- Use horizontal layouts for related inputs (Rate + Term on same row)
- Optimize button group layouts (horizon selection buttons in compact row)

**REMO-REFLOW-4**  
Layout constraints and limitations:
- Maintain minimum touch target sizes for accessibility
- Preserve visual hierarchy and input grouping logic
- Do not reduce font sizes below universal calculator standards
- Ensure labels remain clearly associated with their inputs
- Test that tab order remains logical after reflow changes

---

## REMO-REVERT — Revert REQ-20260126-003 Implementation (REQ-20260126-004)

**REMO-REVERT-1**  
Revert layout changes from REQ-20260126-003:
- Remove any input reflow implementations that were added for 1366x768 viewport optimization
- Restore calculator layout to the state before REQ-20260126-003 implementation
- Remove any grid layouts or column arrangements specifically added for REQ-20260126-003
- Restore original input grouping and spacing that existed prior to REQ-20260126-003

**REMO-REVERT-2**  
Revert Additional Fees visibility changes:
- If Additional Fees section was made always visible due to REMO-REFLOW-2, revert to previous toggle behavior
- Restore original Hide/Show or Include/Exclude toggle functionality
- Remove any forced visibility implementations added for REQ-20260126-003 compliance

**REMO-REVERT-3**  
Restore original layout constraints:
- Remove specific 1366x768 resolution optimizations
- Restore original overflow and scrolling behavior that existed before REQ-20260126-003
- Ensure reversion does not break functionality from other completed requirements
- Maintain compatibility with UNIVERSAL_REQUIREMENTS.md constraints

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

**REMO-TEST-E2E-UX-1** (REQ-20260126-001)  
Additional Fees toggle functionality test:
- Navigate to remortgage calculator
- Verify "Include" button shows additional fees inputs (Exit Fees, Legal/Valuation Fees)
- Click "Exclude" button and verify additional fees inputs are hidden
- Click "Include" button again and verify inputs are visible
- Verify toggle state persists correctly throughout interaction

**REMO-TEST-E2E-UX-2** (REQ-20260126-001)  
Button text and calculation trigger test:
- Verify main action button displays "Calculate" (not "Compare Deals")
- Fill in all required inputs with valid values
- Verify result area is empty before clicking Calculate
- Click "Calculate" button and verify calculations are performed
- Verify results appear only after button click, not on input change

**REMO-TEST-E2E-UX-3** (REQ-20260126-001)  
Calculator pane layout test:
- Navigate to remortgage calculator
- Verify all input fields, buttons, and initial result area are visible without scrolling
- Verify no vertical scrollbar appears in calculator pane
- Test on standard screen resolutions (1920x1080, 1366x768)
- Verify layout remains compact and accessible

**REMO-TEST-LAYOUT-1** (REQ-20260126-002)  
Calculation Pane Scroll Prevention Test:
- Navigate to remortgage calculator at baseline viewport (1366x768)
- Verify `overflow-y` is set to `hidden` or equivalent on calculation pane
- Use JavaScript to verify `scrollHeight <= clientHeight` for calculation pane element
- Verify no vertical scrollbar appears regardless of input content
- Test viewport resize scenarios to ensure constraint holds
- **Screenshot:** `calculation-pane-no-scroll.png`

**REMO-TEST-LAYOUT-2** (REQ-20260126-002)  
Input Visibility Verification Test:
- Navigate to remortgage calculator
- Verify all mandatory inputs visible without scrolling:
  - Current Balance, Current Rate, Remaining Term, Current Monthly Payment
  - New Rate, New Term, New Deal Fees
  - Additional Fees section (even if collapsed)
  - Comparison Horizon buttons (2/3/5 years)
  - Calculate button
- Expand Additional Fees section and verify all inputs still fit
- Measure actual visible area vs required content height
- **Screenshot:** `all-inputs-visible.png`

**REMO-TEST-LAYOUT-3** (REQ-20260126-002)  
Layout Stability and Regression Test:
- Load remortgage calculator and measure initial pane height
- Fill in all input fields with maximum length values
- Verify pane height remains stable (no dynamic growth)
- Change input values multiple times and verify no scrollbar appears
- Test other calculators to ensure no layout regression introduced
- Verify Explanation Pane independently handles its overflow
- **Screenshot:** `layout-stability.png`

**REMO-TEST-REFLOW-1** (REQ-20260126-003)  
1366x768 Viewport Specific Test:
- Set browser window to exactly 1366x768 resolution
- Navigate to remortgage calculator
- Verify no vertical scrollbar appears in calculation pane
- Verify all inputs are visible without scrolling: Current Balance, Current Rate, Remaining Term, Current Monthly Payment, New Rate, New Term, New Deal Fees, Exit Fees, Legal/Valuation Fees, Comparison Horizon buttons, Calculate button
- Take measurements of available height vs content height
- Verify Additional Fees section is expanded and visible by default
- **Screenshot:** `1366x768-no-scroll.png`

**REMO-TEST-REFLOW-2** (REQ-20260126-003)  
Reflow Layout Verification Test:
- Navigate to remortgage calculator at 1366x768 resolution
- Verify efficient use of horizontal space with input groupings/columns
- Verify visual hierarchy maintained: Current Deal → New Deal → Additional Fees → Options → Calculate
- Test tab order remains logical after layout changes
- Verify all labels clearly associated with correct inputs
- Compare font sizes to ensure no reduction below calculator standards
- Test touch target sizes meet accessibility requirements
- **Screenshot:** `reflow-layout-optimized.png`

**REMO-TEST-REVERT-1** (REQ-20260126-004)  
Verify Reversion of REQ-20260126-003 Changes:
- Navigate to remortgage calculator
- Verify layout matches state before REQ-20260126-003 implementation
- Verify any grid layouts or column arrangements added for REQ-20260126-003 are removed
- Verify input grouping and spacing matches pre-REQ-20260126-003 state
- Compare against baseline screenshots taken before REQ-20260126-003 implementation
- **Screenshot:** `reverted-layout.png`

**REMO-TEST-REVERT-2** (REQ-20260126-004)  
Functional Verification After Reversion:
- Test all calculator functionality works correctly after reversion
- Verify calculations produce expected results
- Verify no regressions introduced to other requirements (REQ-20260126-001, REQ-20260126-002)
- Test Additional Fees toggle behavior matches original specifications
- Verify no broken styles or layout issues after reverting REQ-20260126-003 changes
- **Screenshot:** `functionality-post-revert.png`
