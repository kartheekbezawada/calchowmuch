# Expanded Header/Footer Rules: Modularization and Canonical Reference

**REQ-ID:** REQ-20260128-016
**Title:** Modularize and Expand Universal Header/Footer Rules
**Type:** UI/Layout
**Change Type:** Layout/Contract/Refactor
**Priority:** HIGH
**Status:** NEW
**Created:** 2026-01-28

---

## Scope

**In Scope:**
- Move all header and footer rules from UNIVERSAL_REQUIREMENTS.md to requirements/universal-rules/HEADER_RULES.md and FOOTER_RULES.md
- Expand header/footer rules for clarity, completeness, and future extensibility
- Update UNIVERSAL_REQUIREMENTS.md to reference these files for all header/footer requirements
- Ensure header/footer rules are only edited in their respective files

**Out of Scope:**
- Changing the actual header/footer UI or implementation (content/rules only)
- Calculator-specific requirements

**Authority:** This requirement defines the canonical contract for header/footer rules and their modularization.  
**Change Type:** Layout/Contract/Refactor

---

## Requirements

### HEADER-FOOTER-MODULAR-001 — Canonical Header/Footer Rule Files
- HEADER_RULES.md and FOOTER_RULES.md are the only authoritative sources for header/footer requirements
- All edits, clarifications, and updates must be made in these files

### HEADER-FOOTER-MODULAR-002 — Universal Requirements Reference
- UNIVERSAL_REQUIREMENTS.md must reference HEADER_RULES.md and FOOTER_RULES.md wherever header/footer requirements are discussed
- Remove/replace any detailed header/footer language in UNIVERSAL_REQUIREMENTS.md with a pointer to the respective file

### HEADER-FOOTER-MODULAR-003 — Rule Expansion
- Expand header/footer rules for clarity, completeness, and extensibility as needed
- Ensure all layout, content, and UI requirements for header/footer are only in their respective files

---

## Acceptance Criteria
- HEADER_RULES.md and FOOTER_RULES.md are the single sources for header/footer requirements
- UNIVERSAL_REQUIREMENTS.md defers to these files for header/footer requirements
- No duplicate/conflicting header/footer language remains in UNIVERSAL_REQUIREMENTS.md
- Header/footer rules are expanded and clear

---

## Compliance
- Track this requirement through BUILD → TEST → SEO → COMPLIANCE as per standard workflow
- Reference this REQ in all related PRs and tracker updates

---

## Notes
- This requirement modularizes and expands header/footer rules for maintainability
- UNIVERSAL_REQUIREMENTS.md will simply point to HEADER_RULES.md and FOOTER_RULES.md for these topics
