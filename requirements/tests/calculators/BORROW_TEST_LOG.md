# How Much Can I Borrow Calculator - Test Execution Log

**Calculator:** How Much Can I Borrow (`/calculators/loans/how-much-can-borrow/`)  
**Requirements File:** `requirements/loans/HOW_MUCH_CAN_I_BORROW_RULES.md`  
**Test Framework:** Playwright + Vitest  
**Coverage Target:** 95% minimum

---

## Test Execution Summary

**Last Updated:** 2026-01-19  
**Test Status:** Implementation Phase  
**Total Tests:** TBD  
**Passing:** TBD  
**Failing:** TBD  
**Coverage:** TBD%

---

## Unit Tests (Vitest)

### BOR-TEST-U-1: Income Multiple Calculation
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test income multiple calculation accuracy  
**Test Data:**
- Input: £60,000 gross income, 4.5x multiple
- Expected: Max borrow = £270,000
- Tolerance: ±£1

**Implementation Notes:**
- Test file: `tests/loans/how-much-can-borrow-utils.test.js`
- Function: `calculateBorrow()` with income multiple method
- Edge cases: Different multiples (4x, 5x, 5.5x)

---

### BOR-TEST-U-2: Payment Cap Calculation
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test payment-based affordability calculation  
**Test Data:**
- Input: £5,000 monthly income, 35% payment cap, 5% rate, 25 years
- Expected: Max payment = £1,750, corresponding loan amount
- Tolerance: ±£10

**Implementation Notes:**
- Verify payment calculation formula
- Test different cap percentages (30%, 35%, 40%)
- Validate loan amount derivation from payment

---

### BOR-TEST-U-3: Affordability with Expenses
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test affordability calculation including expenses and debts  
**Test Data:**
- Input: £60,000 income, £1,500 expenses, £500 debts, 35% cap
- Expected: Available income = (£5,000 - £1,500 - £500) = £3,000
- Max payment = £3,000 × 35% = £1,050

**Implementation Notes:**
- Test available income calculation
- Verify payment cap applies to available income
- Edge case: expenses + debts > income

---

### BOR-TEST-U-4: Input Validation
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test maxlength validation per BOR-UI-3  
**Test Cases:**
- Valid: 9-digit inputs accepted
- Invalid: 11-digit inputs rejected
- Boundary: 10-digit inputs (maximum allowed)

**Implementation Notes:**
- Use `hasMaxDigits()` function from validate.js
- Test all numeric inputs
- Verify error messaging

---

### BOR-TEST-U-5: Not Affordable State
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test "not affordable" error handling  
**Test Data:**
- Input: £3,000 income, £2,000 expenses, £1,500 debts
- Expected: Error message "Not affordable"
- Available income: negative value

**Implementation Notes:**
- Test error message accuracy
- Verify calculation stops when not affordable
- Test edge case: exactly equal expenses and income

---

### BOR-TEST-U-6: Stress Test Calculations
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test stress test rate scenarios  
**Test Data:**
- Base rate: 4.5%
- Stress rates: 5.5%, 6.5%, 7.5%
- Expected: Max borrow decreases as rate increases

**Implementation Notes:**
- Verify monotonic decrease in max borrow
- Test reasonable rate ranges
- Validate stress test accuracy

---

## Integration Tests (Playwright)

### BOR-TEST-I-1: Affordability Method Toggle
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test results update when switching methods  
**Test Steps:**
1. Enter inputs
2. Calculate with Income Multiple method
3. Switch to Payment Cap method
4. Verify results recalculate and differ

**Expected Behavior:**
- Results update immediately
- Values are different between methods
- UI feedback on method change

---

### BOR-TEST-I-2: Stress Test Table Updates
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test stress test table responds to input changes  
**Test Steps:**
1. Set base rate to 4%
2. Generate stress test scenarios
3. Change base rate to 6%
4. Verify all scenarios shift correctly

**Expected Behavior:**
- All stress scenarios update
- Relative differences maintained
- Table refreshes smoothly

---

### BOR-TEST-I-3: Graph Updates
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test graph responsiveness to input changes  
**Test Steps:**
1. Set income and calculate
2. Observe graph baseline
3. Increase income by 20%
4. Verify graph line shifts up proportionally

**Expected Behavior:**
- Graph updates immediately
- Line movement proportional to input change
- Current position marker moves correctly

---

### BOR-TEST-I-4: Explanation Updates
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test explanation pane updates with correct values  
**Test Steps:**
1. Enter specific test inputs
2. Calculate results
3. Verify explanation shows exact input values
4. Change inputs and verify explanation updates

**Expected Behavior:**
- Real values used in explanations
- Updates reflect input changes
- Worked examples use user data

---

## E2E Tests (Playwright)

### BOR-TEST-E2E-1: Compact Input Layout
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test responsive layout per BOR-UI-4  
**Screenshots Required:**
- `layout-desktop.png`: Desktop horizontal layout
- `layout-mobile.png`: Mobile stacked layout

**Test Steps:**
1. Load calculator on desktop (1920×1080)
2. Verify Gross Income, Expenses, Debts in horizontal row
3. Capture desktop screenshot
4. Resize to mobile (375×667)
5. Verify inputs stack vertically
6. Capture mobile screenshot

**Success Criteria:**
- Desktop: Inputs side-by-side
- Mobile: Inputs stacked
- No layout shifts during resize
- Labels above inputs

---

### BOR-TEST-E2E-2: Input Maxlength Restriction
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test input length enforcement per BOR-UI-3  
**Screenshot Required:** `input-maxlength.png`

**Test Steps:**
1. Focus on gross income input
2. Attempt to type 15 digits: "123456789012345"
3. Verify only 10 digits accepted: "1234567890"
4. Capture screenshot showing restriction

**Success Criteria:**
- Maximum 10 digits accepted
- Visual feedback on restriction
- Consistent across all inputs

---

### BOR-TEST-E2E-3: Affordability Method Toggle
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test method switching UI per BOR-UI-5  
**Screenshot Required:** `method-toggle.png`

**Test Steps:**
1. Load calculator (Income Multiple selected by default)
2. Verify Income Multiple field visible, Payment Cap hidden
3. Click "Payment Cap" button
4. Verify Payment Cap field visible, Income Multiple hidden
5. Capture screenshot showing toggle states

**Success Criteria:**
- Active button styling changes
- Appropriate fields show/hide
- Immediate visual feedback
- Clear method selection

---

### BOR-TEST-E2E-4: Graph Interactivity
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test graph hover tooltips per BOR-GRAPH-4  
**Screenshot Required:** `graph-hover-tooltip.png`

**Test Steps:**
1. Calculate results to generate graph
2. Hover over graph data points
3. Verify tooltip appears with:
   - Interest rate
   - Maximum borrow amount (currency formatted)
   - Monthly payment
4. Move mouse away, verify tooltip disappears
5. Capture screenshot with tooltip visible

**Success Criteria:**
- Tooltip appears on hover
- Shows correct formatted values
- Disappears on mouse leave
- Positioned clearly readable

---

### BOR-TEST-E2E-5: Full User Journey
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Complete user workflow test  
**Screenshot Required:** `full-journey-result.png`

**Test Steps:**
1. Enter gross income: £80,000
2. Enter monthly expenses: £2,000
3. Enter monthly debts: £400
4. Select "Payment Cap" method
5. Enter payment cap: 40%
6. Enter interest rate: 4.5%
7. Enter term: 30 years
8. Click "Calculate Borrowing Power"
9. Verify results displayed:
   - Max borrow amount
   - Monthly payment
   - Stress test scenarios
10. Capture final results screenshot

**Success Criteria:**
- All inputs accepted correctly
- Calculation completes successfully
- Results display clearly
- Stress test scenarios shown
- No console errors

---

### BOR-TEST-E2E-6: Error Handling
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test error states and validation  
**Screenshot Required:** `error-states.png`

**Test Scenarios:**
1. Enter 0 for income → Error: "Income must be greater than 0"
2. Enter expenses > income → Error: "Not affordable"
3. Enter negative rate → Error: "Interest rate must be 0 or more"
4. Capture screenshot showing error states

**Success Criteria:**
- Clear error messages displayed
- Calculation blocked on errors
- Error messages contextual
- User can recover from errors

---

### BOR-TEST-E2E-7: Accessibility
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test accessibility compliance per BOR-A11Y-*  
**Screenshot Required:** `accessibility-check.png`

**Test Areas:**
1. Keyboard navigation (Tab order)
2. Screen reader labels (aria-label, aria-labelledby)
3. Button group ARIA attributes
4. Focus management
5. High contrast compatibility

**Tools:**
- axe-playwright for automated checks
- Manual keyboard testing
- Screen reader testing (NVDA/JAWS)

**Success Criteria:**
- No accessibility violations
- Logical tab order
- All interactive elements accessible via keyboard
- Screen reader compatibility

---

### BOR-TEST-E2E-8: Layout Stability
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test layout stability per UNIVERSAL_REQUIREMENTS.md  
**Screenshot Required:** `layout-stability.png`

**Test Steps:**
1. Navigate to calculator
2. Measure initial layout dimensions
3. Enter values and calculate
4. Verify no layout shifts occurred
5. Toggle affordability methods
6. Verify layout remains stable

**Success Criteria:**
- No Cumulative Layout Shift (CLS)
- Fixed-height containers maintained
- Internal scrolling only
- Consistent spacing

---

### BOR-TEST-E2E-9: Visual Regression
**Status:** ❓ NOT YET IMPLEMENTED  
**Description:** Test visual consistency  
**Screenshot Required:** `visual-regression.png`

**Test Areas:**
1. Color scheme matches theme tokens
2. Typography follows universal styles
3. Component spacing consistent
4. Button styling standardized

**Success Criteria:**
- Colors match CSS custom properties
- Font families consistent
- Spacing follows design system
- No visual regressions from baseline

---

## Performance Tests

### Loading Performance
**Status:** ❓ NOT YET IMPLEMENTED  
**Metrics to Track:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Bundle size

**Targets:**
- FCP < 1.5s
- LCP < 2.5s
- TTI < 3.5s
- Bundle < 50KB gzipped

---

### Calculation Performance
**Status:** ❓ NOT YET IMPLEMENTED  
**Test Cases:**
- Large income values (£1M+)
- Edge case rates (0%, 50%+)
- Long terms (40+ years)
- Complex scenario calculations

**Target:** All calculations < 100ms

---

## Test Infrastructure

### Test Files Structure
```
tests/
├── loans/
│   └── how-much-can-borrow-utils.test.js
├── calculators/
│   ├── how-much-can-borrow.spec.js
│   └── BORROW_TEST_LOG.md (this file)
└── calculator_results/
    └── how-much-can-borrow/
        └── screenshots/
```

### Required Test Dependencies
- @playwright/test
- vitest
- @vitest/coverage-v8
- axe-playwright (accessibility)

### Test Data Sets
- Standard scenarios (typical UK income ranges)
- Edge cases (extreme values)
- Boundary conditions (validation limits)
- Real-world examples (market research data)

---

## Implementation Priority

### Phase 1: Core Functionality
1. BOR-TEST-U-1: Income multiple calculation
2. BOR-TEST-U-2: Payment cap calculation
3. BOR-TEST-U-4: Input validation
4. BOR-TEST-E2E-5: Full user journey

### Phase 2: Enhanced Features
1. BOR-TEST-U-6: Stress test calculations
2. BOR-TEST-E2E-4: Graph interactivity
3. BOR-TEST-I-1: Method toggle integration

### Phase 3: Polish & Accessibility
1. BOR-TEST-E2E-7: Accessibility compliance
2. BOR-TEST-E2E-8: Layout stability
3. BOR-TEST-E2E-9: Visual regression

---

## Notes for Developers

### Common Issues to Watch
- Number input maxlength doesn't work natively (needs JS validation)
- Graph tooltips need proper z-index management
- Mobile layout requires media query testing
- Screen reader compatibility with dynamic content

### Testing Best Practices
- Use data-testid attributes for reliable element selection
- Test real user interactions, not implementation details
- Validate both positive and negative scenarios
- Include boundary condition testing

### Maintenance
- Update test data annually for market relevance
- Review error messages for clarity
- Monitor performance metrics trends
- Update screenshots for visual regression baseline

---

**Document Status:** Living document - update as tests are implemented and executed.  
**Next Review:** After initial implementation completion.