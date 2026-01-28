# Apply Form Density Rules: Buy-to-Let Calculator

**REQ-ID:** REQ-20260128-018
**Title:** Enforce Calculation Pane Form Density Rules for Buy-to-Let Calculator
**Type:** Calculator/UI
**Change Type:** UI/Flow + ISS
**Priority:** HIGH
**Status:** NEW
**Created:** 2026-01-28

---

## Scope

**In Scope:**
- Apply all calculation pane form density and ISS rules (as defined in iss_form_density_calculation_pane_rules.md) to the Buy-to-Let calculator
- Review and update the calculation pane UI to ensure full compliance
- Refactor input layout, grouping, and progressive disclosure as needed

**Out of Scope:**
- Changes to calculation logic or result formulas
- Non-calculation-pane UI

**Authority:** iss_form_density_calculation_pane_rules.md is the single source of truth for these requirements.

---

## Requirements

### FORM-DENSITY-ENFORCE-002 — Calculator Compliance
- The Buy-to-Let calculator must comply with all rules in iss_form_density_calculation_pane_rules.md
- All core inputs must be visible without mandatory scroll
- Optional/advanced inputs must not block calculation
- Use progressive disclosure for excess inputs
- Apply row efficiency and clarity rules
- No layout instability or regressions

---

## Acceptance Criteria
- The calculator passes all compliance checks from iss_form_density_calculation_pane_rules.md
- No core input requires scrolling to access
- Optional inputs are clearly separated and do not block calculation
- Layout is stable and clear
- All changes tracked through BUILD → TEST → SEO → COMPLIANCE

---

## Compliance
- Reference this REQ in all related PRs and tracker updates
- Track through the standard workflow

---

## Notes
- This requirement ensures the Buy-to-Let calculator meets the latest universal form density and ISS standards
- All future changes to this calculator must maintain compliance
