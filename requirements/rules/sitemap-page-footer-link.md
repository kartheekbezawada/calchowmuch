# Sitemap Page + Footer Link Requirements

**REQ-ID:** REQ-20260125-004  
**Title:** Sitemap Page + Footer Link  
**Type:** UI/Flow + SEO Update  
**Priority:** HIGH  
**Status:** NEW  
**Created:** 2026-01-25

---

## Scope

**In Scope:** Global footer link and a new sitemap page rendered inside the site shell.  
**Out of Scope:** Calculator logic, layout structure outside sitemap page, SEO for other pages, analytics, build tooling.  
**Authority:** Universal UI Contract (UI-3.1, UI-3.2, UI-3.5), Product Intent (PI-1.3).  
**Change Type:** UI/Flow + SEO/Metadata.

---

## Functional Requirements

### FR-1 — Footer Link

**Requirement**
- Add a footer link labeled “Sitemap”.
- Placement MUST be immediately after “FAQs” in the footer link row.
- Link styling MUST match existing footer links (text-only, same size/spacing/underline behavior).

**Acceptance Criteria**
- [ ] Footer link order: Privacy | Terms & Conditions | Contact | FAQs | Sitemap
- [ ] “Sitemap” link matches existing footer link styling.

### FR-2 — New Sitemap Page

**Requirement**
- Create a publicly accessible page/route at `/sitemap` (or equivalent stable route used by the site).
- Page MUST render inside the existing site shell (header/nav/footer consistent with other pages).
- Page MUST include:
  - A single H1: “Sitemap”.
  - Category headings (e.g., Math, Home Loans, Credit Cards, Auto Loans).
  - Under each category, a list of calculators as links to canonical routes.

**Acceptance Criteria**
- [ ] `/sitemap` loads successfully and uses the global shell.
- [ ] Exactly one H1 with text “Sitemap”.
- [ ] Category-grouped calculator links are visible as HTML (crawlable).

### FR-3 — Source of Truth (No Duplication)

**Requirement**
- Sitemap content MUST be derived from the same navigation source of truth used for the left navigation (e.g., public/config/navigation.json).
- Hardcoded calculator lists in the sitemap page are NOT allowed.

**Acceptance Criteria**
- [ ] Sitemap categories and links are generated from the shared navigation data.
- [ ] No static duplicate list exists in the sitemap page.

### FR-4 — Completeness Rule (Future-Proofing)

**Requirement**
- Any calculator visible in navigation MUST appear in the sitemap.
- Any calculator not visible in navigation MUST NOT appear in the sitemap.
- Adding a new calculator is incomplete unless it appears in navigation and is automatically reflected in the sitemap.

**Acceptance Criteria**
- [ ] Sitemap list matches navigation source-of-truth exactly.
- [ ] Adding/removing navigation entries updates sitemap output without manual edits.

### FR-5 — SEO Baseline

**Requirement**
- Sitemap page MUST include a unique `<title>` and meta description.
- Page must be crawlable as rendered HTML without user interaction.
- Footer link must provide an internal crawlable path to the sitemap.

**Acceptance Criteria**
- [ ] `<title>` and meta description present and unique on `/sitemap`.
- [ ] Sitemap content present in HTML on initial render.
- [ ] Footer link points to the sitemap route and is crawlable.

---

## Non-Functional Requirements

- Must not introduce layout shift or horizontal scrolling in the global shell.
- Must load fast (static content, minimal JS work).

---

## Test Requirements (per change type)

**Change Type:** UI/Flow + SEO/Metadata

**Required**
- E2E: Verify footer “Sitemap” link exists and navigates to `/sitemap`.
- SEO Auto: Verify title/meta/H1/canonical basics for `/sitemap` (P1).

---

## Definition of Done

- Footer link shipped and ordered correctly.
- `/sitemap` page shipped with category-grouped links.
- Sitemap content remains aligned with navigation source of truth.
- Required tests pass and evidence recorded in trackers (build/test/seo when applicable).
