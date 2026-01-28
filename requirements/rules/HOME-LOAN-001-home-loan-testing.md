# HOME-LOAN-001: Home Loan Calculator Testing & Bug Fixes

**REQ_ID:** REQ-20260128-001  
**Priority:** HIGH  
**Type:** Calculator  
**Change Type:** Bug Fix + Testing  
**Domain:** Loans Category > Home Loan Calculator

---

## §1 Problem Statement

The Home Loan Calculator in `/public/calculators/loans/home-loan/` is reported as "not working" and requires comprehensive testing coverage to identify and resolve functional issues.

## §2 Scope

### 2.1 Calculator Location
- **Path:** `/public/calculators/loans/home-loan/`
- **Files:** `index.html`, `module.js`, `calculator.css`, `explanation.html`
- **Category:** Loans > Home Loan

### 2.2 Testing Requirements

#### A. Unit Testing (Required per Testing Matrix)
- **Test File:** Create `tests/loans/home-loan.test.js`  
- **Coverage:** All calculation functions in `module.js`
- **Focus Areas:**
  - Mortgage payment calculations
  - Down payment amount/percent toggle
  - Extra payment impact calculations
  - Lump sum payment calculations
  - Amortization schedule generation
  - Input validation and edge cases

#### B. Integration Testing
- **File:** Create `tests/e2e/calculators/home-loan.spec.js`
- **Coverage:** Calculator UI flow and interactions
- **Test Cases:**
  - Form input handling
  - Button group toggles (Amount/Percent)
  - Calculate button functionality
  - Results display and formatting
  - Error handling for invalid inputs

#### C. Explanation Pane Testing (Critical Addition)
- **Coverage:** Complete explanation pane functionality in `explanation.html`
- **Test Areas:**
  - **Scheduled View Integration:** Input values from calculation pane properly reflected
  - **Output Synchronization:** Results from calculation pane appear correctly in explanation
  - **Graph Rendering:** Payment timeline graph displays and updates correctly
  - **Amortization Table:** Monthly payment breakdown table generates and displays
  - **View Switching:** Monthly vs Yearly summary toggles work properly
- **Specific Elements to Test:**
  - Data attributes: `[data-mtg="price"]`, `[data-mtg="loan-amount"]`, etc.
  - Graph components: `#mtg-line-base`, `#mtg-line-over`, axis labels
  - Summary blocks: `[data-mtg-view="monthly"]`, `[data-mtg-view="yearly"]`

#### C. Mathematical Validation
Test calculation accuracy against known mortgage formulas:
- **Monthly Payment Formula:** M = P[r(1+r)^n]/[(1+r)^n-1]
  - Where: M = payment, P = principal, r = monthly rate, n = number of payments
- **Amortization calculations**
- **Extra payment and lump sum impacts**

### 2.3 Bug Investigation Areas

#### A. Common Mortgage Calculator Issues
- Division by zero errors (0% interest rate)
- Floating point precision issues
- Input validation failures
- UI state management (down payment toggle)
- Results formatting and display

#### B. Interactive Elements
- Button group state management
- Input field validation and limits
- Start date handling (optional field)
- Lump sum month input validation

#### C. Explanation Pane Integration Issues
- **Data Binding:** Input values not propagating to explanation pane
- **Graph Rendering:** Payment timeline graph not displaying or updating
- **Amortization Table:** Table not generating or showing incorrect values
- **View Toggle:** Monthly/Yearly summary switching not working
- **Calculation Sync:** Results mismatch between calculation and explanation panes
- **DOM Updates:** Explanation elements not updating after new calculations

## §3 Acceptance Criteria

### 3.1 Testing Coverage
- [ ] Unit tests created with >80% code coverage
- [ ] E2E tests verify complete user flow
- [ ] Mathematical accuracy validated against reference calculations
- [ ] Edge cases tested (zero inputs, maximum values, invalid dates)
- [ ] Explanation pane data synchronization verified
- [ ] Graph rendering and updates tested
- [ ] Amortization table generation and accuracy validated
- [ ] View switching (Monthly/Yearly) functionality confirmed

### 3.2 Bug Fixes
- [ ] All identified calculation errors resolved
- [ ] UI interactions function correctly
- [ ] Input validation works as expected
- [ ] Results display formatting is accurate
- [ ] Explanation pane displays correct input values
- [ ] Payment timeline graph renders and updates properly
- [ ] Amortization table shows accurate monthly breakdowns
- [ ] View toggle buttons switch content correctly

### 3.3 Documentation
- [ ] Test cases documented with expected vs actual results
- [ ] Any mathematical formulas clearly commented in code
- [ ] Bug fixes documented with before/after behavior

## §4 Test Cases Template

### Calculation Test Cases
1. **Standard 30-year mortgage:** $400k home, $80k down, 6.5% APR
2. **Zero down payment:** $300k home, $0 down, 7% APR  
3. **High down payment:** $500k home, $200k down, 5.5% APR
4. **Extra payments:** $400k home with $500/month extra
5. **Lump sum:** $400k home with $10k lump sum in year 3
6. **Edge cases:** 0% interest, 100% down payment, invalid inputs

### UI Test Cases
1. Toggle between Amount/Percent down payment modes
2. Calculate button disabled/enabled states
3. Results display formatting (currency, percentages)
4. Input field validation and error states
5. Optional field handling (start date, lump sum month)

### Explanation Pane Test Cases
1. **Input Synchronization:** Verify calculation pane inputs appear correctly in explanation
2. **Graph Functionality:** Payment timeline graph displays baseline vs with extra payments
3. **Amortization Table:** Monthly payment breakdown with principal/interest split
4. **View Toggle:** Switch between Monthly and Yearly summary views
5. **Data Updates:** Explanation pane updates immediately after new calculation
6. **Graph Scaling:** Y-axis and X-axis labels adjust correctly for different loan amounts
7. **Table Accuracy:** Amortization schedule matches calculated payment amounts

## §5 Implementation Notes

- Follow existing test patterns in `/tests/loans/` directory
- Use Vitest testing framework for unit tests
- Use Playwright for E2E tests
- Ensure tests run in CI/CD pipeline
- Maintain compatibility with existing calculator architecture

---

**Status:** NEW  
**Next Action:** Developer must trigger with `EVT_START_BUILD REQ-20260128-001`  
**Dependencies:** None  
**Impact:** Loans category reliability improvement