# SITE_COPY — calchowmuch.com

> Authority: This file is the single source of truth for all user-facing global copy.
> Rule: Agents MUST use the text verbatim. No rewording. No punctuation changes.
> Last Updated: 2026-01-23

---

## Global Tagline (DESIGN-001)

**SITE_TAGLINE (verbatim):**
Clear answers, without the guesswork

### Usage rules
- Must appear directly below the site title ("Calculate How Much") within the shared header shell on every page.
- Must be a single line (wrap only on small screens).
- Must not be changed without updating this file and the related tests (ISS-DESIGN-001).
- **Test locations:** tests referencing the global header (update assertions when this value changes).

---

## Site Title

**SITE_TITLE (verbatim):**
Calculate How Much

### Usage rules
- Primary site title appearing in header navigation
- Must not include domain name
- Must not be changed without updating this file and related tests

---

## Category Taglines (DESIGN-HEADER-001)

Use the following values verbatim when rendering category-specific taglines in the global header. Category tagline must only appear when the corresponding category context is active. No rotation, personalization, or A/B testing is permitted.

| Category | Tagline |
|----------|---------|
| Math | Clear answers, without the guesswork |
| Home Loans | Money, made clear |
| Credit Cards | Understand the cost before you swipe |
| Auto Loans | Know what you’ll really pay |
| CFA / Advanced Finance | Clarity for serious financial decisions |

### Maintenance rules
- Update this table whenever a new category is added or an existing category tagline changes (requires REQ update).
- Header implementations must source these strings from this file; hardcoded copies elsewhere are disallowed.
