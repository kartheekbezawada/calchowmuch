# Buy-to-Let Calculator — Requirements with Rule IDs

Calculator ID: LOAN-BTL  
Purpose: Estimate buy-to-let profitability: mortgage costs, rental income, net cashflow, yield, and stress test.

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-BTL-001 | Buy-to-Let Calculator | • BTL-NAV-1<br>• BTL-IN-1<br>• BTL-IN-2<br>• BTL-IN-3<br>• BTL-IN-4<br>• BTL-IN-5<br>• BTL-IN-R-1<br>• BTL-IN-R-2<br>• BTL-IN-C-1<br>• BTL-IN-C-2<br>• BTL-IN-C-3<br>• BTL-IN-RENT-1<br>• BTL-IN-RENT-2<br>• BTL-IN-RENT-3<br>• BTL-IN-RENT-4<br>• BTL-OUT-1<br>• BTL-OUT-2<br>• BTL-OUT-3<br>• BTL-OUT-4<br>• BTL-OUT-5<br>• BTL-GRAPH-1<br>• BTL-GRAPH-2<br>• BTL-GRAPH-3<br>• BTL-TBL-1<br>• BTL-TBL-2<br>• BTL-TBL-3<br>• BTL-EXP-1<br>• BTL-EXP-2<br>• BTL-EXP-3 | • BTL-TEST-E2E-LOAD<br>• BTL-TEST-E2E-NAV<br>• BTL-TEST-E2E-WORKFLOW<br>• BTL-TEST-E2E-MOBILE<br>• BTL-TEST-E2E-A11Y<br>• BTL-TEST-U-1<br>• BTL-TEST-U-2<br>• BTL-TEST-U-3<br>• BTL-TEST-U-4<br>• BTL-TEST-U-5<br>• BTL-TEST-I-1<br>• BTL-TEST-I-2<br>• BTL-TEST-I-3 | 2026-01-19 |
| REQ-20260119-001 | Buy-to-Let Calculator | • BTL-GRAPH-4<br>• BTL-TBL-4<br>• BTL-TBL-5<br>• BTL-CALC-1 | • BTL-TEST-E2E-LOAD<br>• BTL-TEST-E2E-NAV<br>• BTL-TEST-E2E-WORKFLOW<br>• BTL-TEST-E2E-MOBILE<br>• BTL-TEST-E2E-A11Y<br>• BTL-TEST-FIX-1<br>• BTL-TEST-FIX-2<br>• BTL-TEST-FIX-3 | 2026-01-19 |

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
Interest Rate (APR %) >= 0.

**BTL-IN-4**  
Term (years) >= 1.

**BTL-IN-5**  
Interest-only vs Repayment toggle (button group).

---

## BTL-IN — Rental & Costs

**BTL-IN-R-1**  
Monthly Rent > 0.

**BTL-IN-R-2**  
Void Period (%) optional >= 0 (or "months vacant per year" toggle).

**BTL-IN-C-1**  
Letting Agent Fee (%) optional >= 0.

**BTL-IN-C-2**  
Maintenance/monthly costs optional >= 0.

**BTL-IN-C-3**  
Insurance, service charge, ground rent optional >= 0.

---

## BTL-IN-RENT — Rent Increase Options (NEW ENHANCEMENT)

**BTL-IN-RENT-1**  
Provide "Rent Increase" toggle to enable/disable rent increase projection.

**BTL-IN-RENT-2**  
When rent increase is enabled, show two input options:
- **By Percentage**: Annual rent increase as a percentage (e.g., 3% per year)
- **By Amount**: Fixed annual rent increase in currency (e.g., £50 per year)

**BTL-IN-RENT-3**  
Provide "Increase Frequency/Timeframe" option to specify when rent increases apply:
- Every year
- Every 2 years
- Every 3 years
- Custom interval (years)

**BTL-IN-RENT-4**  
Rent increase values must project forward in all tables and graphs when enabled.

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
Show "stress test" rent coverage ratio (ICR-like): rent / interest payment.

---

## BTL-TBL

**BTL-TBL-1**  
Provide yearly projection table (UniversalDataTable):
- Year
- Rent income (with increase applied if enabled)
- Costs
- Mortgage cost
- Net cashflow
- Cumulative cashflow

**BTL-TBL-2**  
When rent increase is enabled, table must show:
- Adjusted rent income per year reflecting the increase
- Updated net cashflow based on increased rent
- Clear indication of years when rent increase is applied

---

## BTL-GRAPH

**BTL-GRAPH-1**  
Graph: "Net Cashflow Over Time" (line chart).
- Show baseline Annual Cashflow line (without rent increase) in one color
- When rent increase is enabled, show a second line (BLACK color) representing Annual Cashflow WITH rent increase applied
- Both lines should be visible simultaneously for comparison
- Legend must clearly label both lines

**BTL-GRAPH-2**  
Hover/tooltip functionality: When user hovers over any point on the graph, display:
- Year
- Cashflow value (formatted with currency)
- If rent increase line: show the rent increase applied that year

**BTL-GRAPH-3**  
Replace "Cashflow Sensitivity vs Interest Rate" with a more intuitive visualization:
- **Option A**: Bar chart showing "What-If Scenarios" — display net annual cashflow at different interest rates (e.g., current rate, +1%, +2%, +3%)
- **Option B**: Horizontal bar showing "Break-even Analysis" — at what interest rate does cashflow become negative?
- **Option C**: Simple comparison cards showing: "Your rate: X% = £Y/month" vs "If rates rise to Z%: £W/month"
- Must be easily understandable at a glance by non-financial users

---

## BTL-EXP

**BTL-EXP-1**  
Explain yields and cashflow using the user's numbers.

**BTL-EXP-2**  
Explain interest-only vs repayment tradeoff.

**BTL-EXP-3**  
When rent increase is used, explain projected cashflow improvement over time.

---

## BTL-UI

**BTL-UI-1**  
No dropdowns; use toggles as button groups.

**BTL-UI-2**  
Tables must use UniversalDataTable and UTBL rules.

**BTL-UI-3**  
All input boxes must have `maxlength="10"` — limit input to 10 digits maximum.

**BTL-UI-4**  
Compact layout for mortgage inputs:
- **Deposit Amount**, **Interest Rate (APR %)**, and **Loan Term (years)** must be displayed in a horizontal row (side-by-side).
- Each input should have its label/heading directly above the input box.
- Use CSS grid or flexbox to arrange as: `[Deposit] [Interest Rate] [Loan Term]` in one row.
- This saves vertical space and improves usability.

**BTL-UI-5**  
Rent increase section should be collapsible/expandable to avoid clutter when not used.

---

## BTL-TEST — Testing Requirements

### Unit Tests

**BTL-TEST-U-1**  
Test rent increase calculation by percentage:
- Input: £1000/month rent, 5% annual increase, 10 years
- Verify Year 1 = £1000, Year 2 = £1050, Year 5 = £1215.51 (compounded)

**BTL-TEST-U-2**  
Test rent increase calculation by fixed amount:
- Input: £1000/month rent, £50 annual increase, 10 years
- Verify Year 1 = £1000, Year 2 = £1050, Year 5 = £1200

**BTL-TEST-U-3**  
Test rent increase with custom timeframe:
- Input: £1000/month rent, 10% increase every 2 years, 6 years
- Verify: Year 1-2 = £1000, Year 3-4 = £1100, Year 5-6 = £1210

**BTL-TEST-U-4**  
Test input validation: reject inputs with more than 10 digits.

**BTL-TEST-U-5**  
Test net cashflow calculation with and without rent increase enabled.

### Integration Tests

**BTL-TEST-I-1**  
Verify table updates correctly when rent increase options change:
- Toggle rent increase ON → table shows increased rent column values
- Toggle rent increase OFF → table reverts to static rent values

**BTL-TEST-I-2**  
Verify graph displays two lines when rent increase is enabled:
- Baseline cashflow line (without increase)
- Projected cashflow line (with increase, black color)

**BTL-TEST-I-3**  
Verify hover tooltip displays correct values for both graph lines.

### E2E / Visual Tests

**BTL-TEST-E2E-1**  
Test compact input layout:
- Verify Deposit, Interest Rate, and Loan Term inputs are in a single horizontal row
- Test responsive behavior on mobile (may stack vertically)

**BTL-TEST-E2E-2**  
Test input maxlength restriction:
- Attempt to type 15 digits → only 10 should be accepted

**BTL-TEST-E2E-3**  
Test graph interactivity:
- Hover over each data point → tooltip must appear with correct value
- Verify tooltip disappears when mouse leaves

**BTL-TEST-E2E-4**  
Test full user journey:
1. Enter property price, deposit, rate, term
2. Enter monthly rent
3. Enable rent increase (5% annually)
4. Verify table shows increasing rent values
5. Verify graph shows two comparison lines
6. Hover over Year 5 on graph → verify tooltip shows correct projected value

**BTL-TEST-E2E-5**  
Accessibility test:
- All inputs must have proper labels
- Graph must have ARIA descriptions
- Tooltips must be keyboard accessible

---

## Completion Criteria

All BTL-* rules must pass + Universal compliance.

### Implementation Checklist:
- [ ] Input boxes limited to 10 digits (maxlength)

---

## NEW RULES for REQ-20260119-001 (Buy-to-Let Calculator Graph & Table Improvements)

**BTL-GRAPH-4**  
Fix graph hover visibility and interaction issues:
- Ensure hover tooltips are clearly visible with proper contrast
- Fix z-index issues where tooltips may be hidden behind other elements
- Improve hover area detection for better user experience
- Tooltips must display formatted currency values and year information

**BTL-TBL-4**  
Fix table column ordering and structure:
- Reorder columns for better logical flow: Year → Rent Income → Costs → Mortgage Cost → Net Cashflow → Cumulative
- Ensure proper column alignment (numbers right-aligned, text left-aligned)
- Fix any responsive table issues on mobile devices

**BTL-TBL-5**  
Fix cumulative calculation display issues:
- Ensure cumulative cashflow column calculates correctly across all years
- Fix any rounding errors in cumulative totals
- Ensure negative cumulative values are properly displayed with appropriate styling

**BTL-CALC-1**
Validate rent increase logic implementation:
- When rent increase is enabled, verify calculations are applied at correct intervals
- Ensure percentage increases compound properly year-over-year
- Verify fixed amount increases are applied consistently
- Test edge cases with custom increase frequencies

---

## BTL-TEST-FIX — Test Requirements for REQ-20260119-001

**BTL-TEST-FIX-1**  
Test graph hover visibility fix:
- Scroll graph right to year 10+
- Hover over data points → verify tooltip appears visible (not clipped or hidden)
- Verify tooltip z-index is above all other elements
- Test on different viewport sizes

**BTL-TEST-FIX-2**  
Test cumulative calculation accuracy:
- Enable rent increase at 5% annually
- Verify cumulative cashflow sums correctly across all years
- Check for rounding consistency (max 2 decimal places)
- Verify negative cumulative values display with proper formatting

**BTL-TEST-FIX-3**  
Test table column reordering:
- Verify columns are in order: Year → Rent Income → Costs → Mortgage Cost → Net Cashflow → Cumulative
- Test column alignment (numbers right-aligned)
- Verify table remains responsive on mobile

---

### Implementation Checklist for REQ-20260119-001:
- [ ] Graph hover tooltip visibility fixed
- [ ] Cumulative calculations correct after rent increase
- [ ] Table columns reordered properly
- [ ] All BTL-TEST-FIX tests passing

---

### Implementation Checklist for REQ-BTL-001:
- [ ] Deposit, Interest Rate, Loan Term in horizontal row layout
- [ ] Rent increase by percentage option
- [ ] Rent increase by amount option
- [ ] Rent increase timeframe/frequency selector
- [ ] Table reflects rent increase projections
- [ ] Graph shows dual lines (baseline vs with increase)
- [ ] Graph hover shows values
- [ ] Sensitivity graph replaced with intuitive visualization
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
