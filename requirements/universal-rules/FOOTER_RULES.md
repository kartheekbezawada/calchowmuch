# Footer Rules — Canonical Footer Contract

> **Authority:** This document is the single source of truth for footer requirements across the calculator shell, content routes, and GTEP pages. Footer updates belong here before `UNIVERSAL_REQUIREMENTS.md` is touched.

## Scope & Reference
- Applies to every page that renders inside the shared shell plus standalone GTEP pages (`/sitemap/`, `/privacy/`, `/terms/`, `/contact/`, `/faqs/`).
- Footer copy must match `requirements/site-structure/SITE_COPY.md` when link text is controlled there (privacy, terms, etc.).
- Sitemap coverage remains critical: every footer link must be represented inside `DOC-SITEMAP` entries and the HTML sitemap page.

## Rule Index
| Rule ID | Requirement | Severity |
|---------|-------------|----------|
| FTR-1.1 | Footer markup must use `<footer role="contentinfo">` and appear as the last block before the closing `<body>` tag. | P0 |
| FTR-1.2 | Footer must contain the canonical legal/navigational links (Privacy, Terms & Conditions, Contact, FAQs, Sitemap) in a single row of `<a>` elements. | P0 |
| FTR-1.3 | Footer links must be static `<a>` tags with descriptive text, must not open new tabs (`target` omitted), and must include `rel="noopener"` when `target` is added for external resources. | P1 |
| FTR-1.4 | Footer spacing must reuse premium-dark spacing tokens (`unit-spacing-4`/`unit-spacing-6`) and maintain the minimal footprint described in `requirements/universal-rules/THEME_RULES.md`. | P1 |
| FTR-1.5 | Footer must never duplicate navigation panes or create additional JS-driven menus; keep the layout minimal so it does not hijack vertical space. | P0 |
| FTR-1.6 | Footer links must appear on every sitemap-covered page; missing links trigger P1 SEO violations per `DOC-SITEMAP` and sitemap rules. | P1 |
| FTR-1.7 | On GTEP pages the footer links are required for crawlability; these links should match the same order and text as the calculator shell footer. | P1 |

---

## Layout & Content
- Display footer links horizontally with a 16px gap and center them on narrow viewports using `text-align: center`.
- Avoid icons, badges, or logos inside the footer unless they are part of the standard legal links. Additional text (copyright, version) may appear as muted spans below the link row.
- Footer background must maintain the same premium-dark palette, using `bg-slate-900`/`text-slate-200` tokens for contrast.

## Behavioral Rules
- Every footer link must have a unique `href` that matches the canonical URL spelled out in `DOC-SITEMAP-2`. You may not anchor to fragments or rely on JS routing.
- The footer must load with static HTML; do not depend on client scripts to populate the link list or to toggle visibility (no hydration required).
- If the footer contains utility links (e.g., help or accessibility), treat them as secondary and mark them with `aria-label`s that describe their destination.

## SEO & Sitemap Compliance
- Footer links are required for the sitemap rule (AGENTS.md §9). Cross-link coverage is audited in `requirements/compliance/seo_tracker.md` and must be captured by the HTML sitemap page (`/sitemap/`).
- When adding a new footer link, add it to the HTML sitemap and the `DOC-SITEMAP` index, and update the sitemap XML.
- Footer text must not be flagged as duplicate content; keep it short and reusable.

## Notes
- Footer requirements in this document replace the previous `ARCH-1.8` rule. Any future references to `ARCH-1.8` should point here.
