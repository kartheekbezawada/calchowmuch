# HOME-LOAN-UI-003: Home Loan Calculator UI/Flow Simplification & Bug Fixes

**REQ_ID:** REQ-20260128-003  
**Priority:** HIGH  
**Type:** Calculator  
**Change Type:** UI/Flow + Bug Fix  

---

## §1 Problem Statement

The Home Loan Calculator's explanation pane and results area contain redundant or non-functional elements:
- Separate Monthly and Yearly Summary sections are unnecessary and should be removed.
- The Balance Chart is not working as intended.
- The Schedule View currently uses two tabs (Monthly/Yearly); this should be replaced with a single toggle to select between Monthly and Yearly views.

## §2 Scope

- **Target:** `/public/calculators/loans/home-loan/` (index.html, module.js, explanation.html, calculator.css)
- **UI Elements:**
  - Monthly Summary and Yearly Summary sections
  - Balance Chart (graph)
  - Schedule View tab group

## §3 Acceptance Criteria

- [ ] Remove both Monthly Summary and Yearly Summary sections from the explanation/results pane.
- [ ] Remove or fix the Balance Chart so that it either works correctly or is removed entirely if not feasible.
- [ ] Remove the Schedule View tab group; replace with a single toggle (button or switch) to select Monthly or Yearly view.
- [ ] Ensure all references, event handlers, and DOM updates related to the removed elements are cleaned up in JS and HTML.
- [ ] UI remains visually consistent and accessible after changes.
- [ ] No orphaned code or dead CSS remains.

## §4 Implementation Notes

- Update both the HTML and JS modules to reflect UI changes.
- If fixing the Balance Chart, ensure it displays correct data and updates with calculation results.
- If removing, ensure no references remain in code or UI.
- The new toggle for Monthly/Yearly should be accessible and clearly labeled.
- Test for regressions in calculation and display logic.

---

**Status:** NEW  
**Next Action:** Developer must trigger with `EVT_START_BUILD REQ-20260128-003`  
**Dependencies:** None  
**Impact:** Improved clarity, usability, and reliability of Home Loan Calculator UI
