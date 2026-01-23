# GLOBAL HEADER REDESIGN REQUIREMENTS (v1)

**REQ-ID:** REQ-20260123-001  
**Title:** Global Header Redesign (Pixel-Perfect + Category Taglines)  
**Type:** Shared Layout  
**Priority:** HIGH  
**Status:** NEW  
**Created:** 2026-01-23

---

## Objective

Elevate the global header so it communicates a serious product experience, delivers a stable brand block, and supports category-specific taglines without regressions to SEO structure or calculator routing. This redesign applies to every page rendered inside the shared layout shell.

---

## Scope

**In Scope**
- Global header markup within the shared shell
- Header typography, spacing, responsive behavior
- Category button styling and layout
- Category tagline rendering rules
- Integration with copy defined in requirements/universal/SITE_COPY.md

**Out of Scope**
- Calculator logic or data computations
- Navigation hierarchy or routing behavior
- Non-header layout regions (left nav, calculator column, right ads)
- A/B testing frameworks or personalization logic

**Change Type:** Layout/CSS (requires ISS visual validation)

---

## Copy Contract

**Source of truth:** requirements/universal/SITE_COPY.md

- Site title: Calculate How Much (unchanged)
- Global tagline: Clear answers, without the guesswork (always visible)
- Category taglines: Use verbatim values from the Category Tagline table in SITE_COPY.md. Render only when a category is active. No rotation, personalization, or experimentation.
- Header implementation must reference SITE_COPY tokens programmatically; hardcoded literals are prohibited.

---

## Structural Requirements

1. Header container (`.site-header`) must contain, in order:
   - `.brand` wrapping:
     - `.site-title`
     - `.site-tagline-global`
   - `nav#top-nav` (existing navigation buttons)
   - `.site-tagline-category` (render only when a category context is active)
2. Header must respect exactly one `<h1>` per page. If a page already declares an `<h1>`, the site title must render as a non-heading element (e.g., `<a>` or `<div>`). Category titles may upgrade to `<h1>` only when no other `<h1>` is present.
3. Category buttons align to the same left edge as the `.brand` block and share uniform dimensions.

---

## Layout & Typography Specifications

All pixel values are strict.

### Container
- Max width: 1280px, centered with `margin: 0 auto`
- Horizontal padding: desktop 24px, tablet 20px, mobile 16px
- Vertical padding: top 18px, bottom 14px

### Vertical Rhythm
- Gap between site title and global tagline: 4px
- Gap between brand block and category buttons: 12px
- Gap between category buttons and category tagline: 10px

### Typography
- **Site title:** font-size 24px desktop / 22px tablet / 20px mobile, weight 700, line-height 28px, color #0B1220, no letter spacing adjustments
- **Global tagline:** font-size 14px desktop & tablet / 13px mobile, weight 500, line-height 20px, color #475569
- **Category tagline:** font-size 13px desktop & tablet / 12px mobile, weight 500, line-height 18px, color #64748B

### Category Buttons
- Height 36px, padding-x 14px, min-width 92px, border-radius 10px
- Base background #0B0B0B, text color #FFFFFF, font-size 13px, weight 600
- Active state background #2563EB with border #2563EB
- Optional focus ring: `box-shadow: 0 0 0 3px rgba(37,99,235,0.25)`
- Buttons may wrap to a second row on desktop/tablet; maintain prescribed gaps

### Responsive Rules
- Desktop & tablet: all elements left-aligned; no horizontal scroll
- Mobile: header remains left-aligned; category buttons may wrap or scroll horizontally (choose one approach). Prevent horizontal overflow of the page.

---

## Behavioral Requirements

- Category tagline updates synchronously with the active category context (Math, Home Loans, Credit Cards, Auto Loans, CFA / Advanced Finance). If no category context is active, the element is omitted.
- Active state for buttons must remain visually stable during navigation changes and refreshes.
- Header content must remain pixel-consistent across pages; no hero-style stretching or inconsistent spacing.
- Layout changes must not introduce layout shifts or overflow when navigation buttons wrap.

---

## SEO & Accessibility Safeguards

- Maintain exactly one `<h1>` per page (UI-SEO-001 guardrail).
- Ensure screen readers perceive the header block as a cohesive landmark (use existing landmark structure).
- Global tagline should remain readable text, not replaced with background images or SVG-only solutions.

---

## Testing Requirements

- Execute ISS visual regression for the header component to confirm no unintended layout drift (ISS-001 policy).
- Update automated copy assertions that reference the previous tagline string.
- Validate no horizontal overflow on mobile breakpoints (manual or automated check recorded in testing tracker).

---

## Completion Checklist (for implementer)

- [ ] All header copy pulled dynamically from SITE_COPY tokens
- [ ] Header spacing and typography match the defined pixel specs on desktop, tablet, and mobile
- [ ] Category buttons render uniformly with correct active styling and optional focus ring support
- [ ] Category tagline appears only when context is active and matches SITE_COPY
- [ ] One `<h1>` per page rule confirmed post-implementation
- [ ] ISS visual regression executed and recorded

---

## Business Justification

A cohesive, product-grade header improves credibility, supports SEO clarity, and communicates calculator context to users. The redesign introduces category tagging aligned with finance verticals while enforcing a stable brand voice across the experience.
