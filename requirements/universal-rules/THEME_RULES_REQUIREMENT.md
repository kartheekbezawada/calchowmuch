# Unified Theme Rules: Universal Tokens + Premium-Dark Global Default

**REQ-ID:** REQ-20260128-014
**Title:** Unified Theme Rules: Universal Tokens + Premium-Dark Global Default
**Type:** Theme
**Change Type:** Layout/CSS
**Priority:** HIGH
**Status:** NEW
**Created:** 2026-01-28

---

## Scope

**In Scope:**
- Consolidate all universal theme tokens (colors, typography, sizing, etc.)
- Make premium-dark theme the global default for all calculators and pages
- Remove per-page theme CSS inclusions
- Require theme loading via base layout (not per-page)
- Ensure all calculators/pages use the global theme

**Out of Scope:**
- Creating new theme variants
- Modifying existing premium-dark theme styling
- User theme switching functionality
- Calculator logic or functionality changes

**Authority:** This requirement defines the canonical approach for theme tokens and global theme application.  
**Change Type:** Layout/CSS (reference: TESTING_RULES.md)

---

## Requirements

### THEME-UNIFIED-001 — Universal Theme Tokens
- All color, typography, sizing, and component tokens must be defined in THEME_RULES.md
- All calculators and UI must use these tokens

### THEME-UNIFIED-002 — Premium-Dark Global Default
- theme-premium-dark.css must be loaded globally via the base layout (not per-page)
- Remove all individual <link rel="stylesheet" href="/assets/css/theme-premium-dark.css" ...> from calculator/page HTML
- All calculators/pages must use the global premium-dark theme
- Visual appearance and performance must match or improve over previous implementation

### THEME-UNIFIED-003 — Reference and Build/Test Updates
- All documentation, build configs, and references must point to THEME_RULES.md as the single source of truth
- Archive/remove requirements/rules/premium_dark_theme_global_009.md after confirming this file covers its requirements

---

## Acceptance Criteria
- THEME_RULES.md contains all universal tokens and global theme requirements
- No per-page theme CSS links remain
- Theme loads globally via base layout
- All calculators/pages use the global premium-dark theme
- All references and build/test configs point to THEME_RULES.md
- premium_dark_theme_global_009.md is archived/removed

---

## Compliance
- Track this requirement through BUILD → TEST → SEO → COMPLIANCE as per standard workflow
- Reference this REQ in all related PRs and tracker updates

---

## Notes
- This requirement supersedes and replaces premium_dark_theme_global_009.md
- THEME_RULES.md is now the canonical source for all theme requirements
