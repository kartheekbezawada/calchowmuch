# Single Source of Truth: Calculation Pane Form Density (ISS)

**REQ-ID:** REQ-20260128-015
**Title:** Single Source: iss_form_density_calculation_pane_rules.md as Canonical Form Density Contract
**Type:** UI/ISS
**Change Type:** Layout/UI/Contract
**Priority:** HIGH
**Status:** NEW
**Created:** 2026-01-28

---

## Scope

**In Scope:**
- Make requirements/universal-rules/iss_form_density_calculation_pane_rules.md the single, canonical source for all calculation pane form density and ISS rules
- Update requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md to defer to this file for all calculation pane form density and ISS expectations
- Remove/replace any duplicate or conflicting form density language in UNIVERSAL_REQUIREMENTS.md
- Ensure all layout, density, and ISS expectations for the calculation pane are only edited in iss_form_density_calculation_pane_rules.md

**Out of Scope:**
- Changing the actual form density or ISS rules (content remains as-is, just centralized)
- Calculator-specific requirements

**Authority:** This requirement defines the canonical contract for calculation pane form density and ISS enforcement.  
**Change Type:** Layout/UI/Contract

---

## Requirements

### FORM-DENSITY-SINGLE-SOURCE-001 — Canonical ISS Doc
- iss_form_density_calculation_pane_rules.md is the only authoritative source for calculation pane form density and ISS rules
- All edits, clarifications, and updates must be made in this file

### FORM-DENSITY-SINGLE-SOURCE-002 — Universal Requirements Reference
- UNIVERSAL_REQUIREMENTS.md must reference iss_form_density_calculation_pane_rules.md wherever calculation pane form density is discussed
- Replace any detailed form density language in UNIVERSAL_REQUIREMENTS.md with a pointer to the ISS doc

### FORM-DENSITY-SINGLE-SOURCE-003 — ISS Doc Alignment
- All detailed layout, density, and ISS expectations for the calculation pane must be in iss_form_density_calculation_pane_rules.md only
- UNIVERSAL_REQUIREMENTS.md should defer to this file for calculation pane form density

---

## Acceptance Criteria
- iss_form_density_calculation_pane_rules.md is the single source for calculation pane form density and ISS rules
- UNIVERSAL_REQUIREMENTS.md defers to this file for calculation pane form density
- No duplicate/conflicting form density language remains in UNIVERSAL_REQUIREMENTS.md

---

## Compliance
- Track this requirement through BUILD → TEST → SEO → COMPLIANCE as per standard workflow
- Reference this REQ in all related PRs and tracker updates

---

## Notes
- This requirement centralizes all calculation pane form density and ISS rules in a single, canonical file
- UNIVERSAL_REQUIREMENTS.md will simply point to iss_form_density_calculation_pane_rules.md for these topics
