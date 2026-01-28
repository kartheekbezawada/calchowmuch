# HOME-LOAN-UI-004: Home Loan Calculator Calculation Pane Restructure

**REQ_ID:** REQ-20260128-004  
**Priority:** HIGH  
**Type:** Calculator  
**Change Type:** UI/Flow  

---

## §1 Problem Statement

The Home Loan Calculator's Calculation Pane currently requires excessive vertical scrolling due to its row structure. The goal is to reduce vertical scroll by restructuring the pane into fewer rows, while keeping all existing inputs and calculation behavior unchanged.

## §2 Scope

- **Target:** `/public/calculators/loans/home-loan/` (index.html, module.js, calculator.css)
- **UI Elements:**
  - Calculation Pane input rows
  - Advanced options section

## §3 Requirements

### 1. Core Section (Always Visible)
- **Row 1:** Home Price (single input row)
- **Row 2 (Combined Down Payment Row):**
  - Left: Down Payment Type (segmented buttons: Amount / Percent)
  - Right: Down Payment Value (single numeric input)
  - Label and meaning switch based on selected type:
    - If Amount selected → label: Down Payment Amount
    - If Percent selected → label: Down Payment Percent
  - Only one input field is shown; label/placeholder changes, no additional controls appear.
- **Row 3:** Two inputs on the same row:
  - Loan Term (years)
  - Interest Rate (APR %)
- **Row 4:** Calculate Mortgage button
  - Immediately below, show compact output: Monthly Payment (Principal + Interest)

### 2. Advanced Options (After Core)
- After Row 4, render an Advanced options collapsible section (collapsed by default) containing:
  - Property Tax (annual, optional)
  - Home Insurance (annual, optional)
  - Start Date (optional)
  - Extra Monthly Payment
  - One-time Lump Sum (optional)
  - Lump Sum Month (number)
- Advanced options must not alter core results logic.
- Toggling Advanced options must not change core values unless user edits fields inside it.

### 3. Layout Stability Rules
- Switching Down Payment Type must not change the overall row structure.
- The combined Down Payment row must remain one row at all times.
- No outputs, graphs, or tables may be moved into the Calculation Pane as part of this change.

## §4 Acceptance Criteria

- [ ] Down Payment Type + Down Payment Value appear on a single row.
- [ ] Loan Term (years) + Interest Rate (APR %) appear on a single row.
- [ ] Advanced options are moved below the Calculate button inside a collapsible section.
- [ ] Monthly Payment output appears immediately after Calculate (no scrolling required).
- [ ] Existing calculation logic and results remain unchanged.
- [ ] Layout is visually stable and accessible.

## §5 Implementation Notes

- Update HTML and JS to reflect new row structure.
- Use accessible controls for segmented buttons and collapsible section.
- Test for regressions in calculation and display logic.
- Do not move outputs, graphs, or tables into the Calculation Pane.

---

**Status:** NEW  
**Next Action:** Developer must trigger with `EVT_START_BUILD REQ-20260128-004`  
**Dependencies:** None  
**Impact:** Improved usability and reduced vertical scroll in Home Loan Calculator
