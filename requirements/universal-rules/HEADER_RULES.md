# Header Rules — Canonical Header Contract

> **Authority:** This file is the single source of truth for all site header requirements. Any reviewer or engineer who needs to update header behavior must edit this document before touching `UNIVERSAL_REQUIREMENTS.md`.

## Scope & Reference
- Applies to every page that renders inside the shared calculator shell (including the homepage, all calculators, and the shared nav/ads layout).
- GTEP pages may reuse the same header tokens, but they have an explicit lightweight variant described in section 3.4.
- References:
  - Site title and tagline are defined verbatim in `requirements/site-structure/SITE_COPY.md`.
  - Loans-specific navigation behaviors are detailed in `requirements/rules/loans/LOANS_NAVIGATION_RULES.md`.

## Rule Index
| Rule ID | Requirement | Severity |
|---------|-------------|----------|
| HDR-1.1 | Header markup must use `<header role="banner">` and must appear above all other shell regions. | P0 |
| HDR-1.2 | The site title "Calculate How Much" must be a visible `<a href="/">` link, matching `SITE_COPY` and targeting the root URL with `rel="canonical"`. | P0 |
| HDR-1.3 | The optional tagline `"Calculate how much you need, spend, afford."` reuses `SITE_COPY` text and may appear directly below the title on the homepage; if rendered elsewhere it must still use the exact copy. | P1 |
| HDR-2.1 | Primary navigation buttons (Math, Loans, Time & Date) must be `<a>` elements, not `<button>`s, and must use full page reloads to honor the MPA requirement. | P0 |
| HDR-2.2 | Only one top-level domain may be active at a time; switching domains preserves shell height and resets the left nav scroll (see `LN-NAV-ROOT-2` and `LN-NAV-ROOT-4`). | P0 |
| HDR-2.3 | Navigation anchors must never wrap, must reuse `calculator-button` styles, and must not have separate border/box styling (clean button-only appearance). | P0 |
| HDR-3.1 | Search inputs inside the header must be `<input type="search">` with `aria-label="Search calculators"`, must not auto-navigate, and must only filter via user typing (see `LN-NAV-SEARCH-*`). | P0 |
| HDR-3.2 | The header must not load calculator-specific JS modules; it only consumes shared navigation config and theme tokens. | P1 |
| HDR-3.3 | Header height is fixed (per UI-3.1); adding new elements must preserve the premium-dark spacing tokens from `THEME_RULES.md`. | P1 |
| HDR-3.4 | GTEP pages reuse header colors and site title but omit the navigation buttons and search input; the minimal header is allowable per `requirements/rules/general/gtep-pages.md`. | P1 |

---

## Structural Requirements
- Always wrap header content inside a semantic `<header role="banner">` followed by a `nav` element containing the domain buttons. Screen readers expect the banner to be the first landmark.
- Keep the header height consistent: use `unit-spacing-4` (from `THEME_RULES.md`) for padding and ensure the header does not push the page height beyond `100vh`.
- Provide the site title as plain text wrapped in `<span class="site-title">` and link it to `/` with `rel="home"`.

## Navigation Behavior
- Primary navigation mirrors the configuration stored in `public/config/navigation.json`; do not hardcode additional categories.
- Each anchor must provide a descriptive `aria-current="page"` when active and must not rely on JavaScript to set the active state (the server renders the correct markup on each page load).
- The header should not contain dropdowns, forms that require JS validation, or experimental components. Keep interactions predictable and static.

## Interaction & Accessibility
- Use `aria-label`s on icon-only links (if any) and ensure contrast meets WCAG 2.1 AA via the premium-dark palette (`THEME_RULES.md`).
- Search inputs must debounce on the server side if necessary; they may use progressive enhancement but must degrade gracefully to a standard `<form action="/search" method="get">`.
- Maintain tabbable order: site title → domain buttons → search → any trailing utility links (profile, notifications, etc.).

## Notes
- Header updates must keep the header/footer modules independent; no header content should be duplicated in `UNIVERSAL_REQUIREMENTS.md`. Changes here implicitly satisfy `ARCH-1.7` (navigation styling) and the overall header contract.
