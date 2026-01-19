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
