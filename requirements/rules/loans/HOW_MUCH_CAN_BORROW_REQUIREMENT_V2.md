# How Much Can I Borrow Calculator — V2 Rules & Requirement

**REQ-ID:** REQ-20260128-019
**Title:** Implement and Test HOW_MUCH_CAN_BORROW_RULES_V2 for Calculator
**Type:** Calculator/UI
**Change Type:** UI/Flow + ISS + Testing
**Priority:** HIGH
**Status:** NEW
**Created:** 2026-01-28

---

## Scope

**In Scope:**
- Apply all rules defined in requirements/rules/loans/HOW_MUCH_CAN_BORROW_RULES_V2.MD to the How Much Can I Borrow calculator
- Ensure compliance with calculation pane form density and ISS rules (iss_form_density_calculation_pane_rules.md)
- Implement/refactor UI and logic as required by V2 rules
- Conduct all required testing and document results in HOW_MUCH_CAN_BORROW_RULES_V2.MD

**Out of Scope:**
- Non-calculation-pane UI
- Unrelated calculators

**Authority:** HOW_MUCH_CAN_BORROW_RULES_V2.MD and iss_form_density_calculation_pane_rules.md are the single sources of truth for this requirement.

---

## Requirements

### BORROW-V2-001 — Calculator Compliance
- Calculator must comply with all rules in HOW_MUCH_CAN_BORROW_RULES_V2.MD
- Must also comply with all form density and ISS rules
- All core inputs must be visible without mandatory scroll
- Optional/advanced inputs must not block calculation
- Use progressive disclosure for excess inputs
- Apply row efficiency and clarity rules
- No layout instability or regressions

### BORROW-V2-002 — Testing
- Conduct unit tests for calculation logic
- Conduct E2E tests for UI/flow, including form density compliance
- Document all tests and results in HOW_MUCH_CAN_BORROW_RULES_V2.MD under a dedicated Testing section
- Track all changes through BUILD → TEST → SEO → COMPLIANCE

---

## Acceptance Criteria
- Calculator passes all compliance checks from HOW_MUCH_CAN_BORROW_RULES_V2.MD and iss_form_density_calculation_pane_rules.md
- All required tests are documented in HOW_MUCH_CAN_BORROW_RULES_V2.MD
- No core input requires scrolling to access
- Optional inputs are clearly separated and do not block calculation
- Layout is stable and clear
- All changes tracked through standard workflow

---

## Compliance
- Reference this REQ in all related PRs and tracker updates
- Track through the standard workflow

---

## Notes
- This requirement ensures the How Much Can I Borrow calculator meets the latest V2 and universal standards
- All future changes to this calculator must maintain compliance
