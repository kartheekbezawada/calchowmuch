# Remove Homepage Tagline Requirements

**REQ-ID:** REQ-20260124-008  
**Title:** Remove Homepage Tagline  
**Type:** Content Update  
**Priority:** MEDIUM  
**Status:** COMPLETE  
**Created:** 2026-01-24

---

## Scope

**In Scope:** Homepage tagline text only.  
**Out of Scope:** Navigation labels, calculator content, layout dimensions, typography tokens, component styling, JS logic, SEO metadata, sitemap.  
**Authority:** Universal UI Contract (UI-3.1, UI-3.2) and Product Intent (PI-1.3).  
**Change Type:** Content.

---

## Requirements

### COPY-010 — Remove Tagline Copy

**Requirement**
- Remove the homepage tagline text “Calculate how much you need, spend, afford.” from the homepage header area.
- Do not replace it with new copy in this REQ.

**Acceptance Criteria**
- [x] The `.site-tagline` element (or its content) is removed from public/index.html.
- [x] The homepage header layout height and spacing remain stable (UI-3.1, UI-3.2).
- [x] No changes to other pages or global layout templates.

### COPY-011 — Functional Guardrail

**Requirement**
- Content updates must not alter any calculator functionality or interactions.

**Acceptance Criteria**
- [x] No edits to public/assets/js/** files.
- [x] No changes to calculator input, output, or navigation logic.

---

## Completion Checklist (for implementer)

- [x] Homepage tagline removed from public/index.html.
- [x] Header layout unchanged.
- [x] No calculator logic changes.
