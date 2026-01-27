General Terms Excluded Pages + Standalone SEO Sitemap (HTML) + Standalone Legal/Info Pages
Problem Statement

Your current /sitemap/ is rendered inside the calculator shell (top nav + left nav + calculation pane + ad pane). That layout is fine for calculators, but it is not ideal for SEO sitemap usability/performance, and Cloudflare is flagging /sitemap/ for poor performance. You also want similar standalone pages for Privacy, Terms, Contact, FAQs.

Goal

Create a new category of pages that are explicitly excluded from the calculator-shell universal layout, and implement them as plain, indexable, fast HTML pages with a single internal scroll area (right scrollbar).

A) New Rule Set: “General Terms Excluded Pages”
1) Definition

Create a new classification called:

General Terms Excluded Pages (GTEP)

These pages are not calculators and must not render inside the calculator shell.

Included routes

/sitemap/

/privacy/

/terms/

/contact/

/faqs/

2) Required behavior (GTEP Layout Contract)

GTEP pages must render as standalone pages with:

No top navigation buttons (Math/Loans/Time & Date)

No left navigation pane

No calculation pane container

No explanation pane container

No ad pane container

No calculator JS bootstrapping

One content column, scrollable (right scrollbar)

Header allowed (minimal):

Site title: “Calculate How Much”

Optional one-line subtitle/tagline (if already used globally)

Footer required (simple links):

Privacy | Terms & Conditions | Contact | FAQs | Sitemap

3) Update Universal Requirements (Add Exclusion Clause)

Update requirements/universal/UNIVERSAL_REQUIREMENTS.md with a new section:

EXCL-1 — Excluded Page Types (P0)

EXCL-1.1: GTEP pages MUST NOT use calculator shell layout regions.

EXCL-1.2: GTEP pages MUST be plain HTML-first and crawlable.

EXCL-1.3: GTEP pages MUST have internal scrolling and must not depend on calculator navigation state.

EXCL-1.4: GTEP pages MUST not load calculator-specific JS modules.

Also update any existing rules that currently imply “all pages use calculator shell” to explicitly exclude GTEP.

4) Update Workflow / Agents Contract

Update:

requirements/compliance/WORKFLOW.md and AGENTS.md to recognize GTEP as a supported page type and to ensure agents don’t “fix” these pages back into the calculator layout.

B) Implementation Requirement: Standalone HTML Sitemap Page
1) Routing

URL: /sitemap/ (keep same route, but change rendering)

Must be directly accessible and indexable

2) Page content requirements (HTML sitemap)

The sitemap page must list:

All top-level categories

All calculators grouped by category/subcategory

Links must point to canonical calculator URLs

Source of truth:

Must be generated from your navigation config (e.g., public/config/navigation.json) so it stays in sync.

3) Performance requirements (P0)

No calculator runtime JS

No heavy layout containers

Minimal CSS

No ad containers

No dynamic rendering required to see links (links must exist in HTML output)

C) Implementation Requirement: Standalone “Privacy / Terms / Contact / FAQs” Pages
1) Routing

/privacy/

/terms/

/contact/

/faqs/

2) Layout

Use the same GTEP layout contract:

Single scrollable content area

Minimal header + footer

No calculator panes/nav/ad containers

3) Contact page note (static-safe)

If you include a contact form, it must not expose your email in HTML/JS.

Acceptable options:

Cloudflare Worker endpoint (/api/contact)

Forms provider integration (Netlify Forms / Formspree)

No mailto: links.

D) SEO Requirements (Mandatory)
1) Unique metadata per page (P0)

Each GTEP page must have:

Unique <title>

Unique meta description

One <h1>

Canonical URL

2) Internal linking (P1)

Footer links must exist on each GTEP page (cross-linking improves crawlability)

3) XML Sitemap (separate from HTML sitemap)

This requirement is for the HTML sitemap page.
But for proper indexing, also ensure:

/sitemap.xml exists and lists all calculator URLs

/robots.txt references the sitemap.xml

(If /sitemap.xml already exists, verify it includes all calculators and is not blocked.)

E) Repository Changes (Expected Files)

Create a separate folder for GTEP pages (example):

/public/pages/
  sitemap/index.html
  privacy/index.html
  terms/index.html
  contact/index.html
  faqs/index.html


Or keep current routing structure if you already have it—key is they must not load the calculator shell.

F) Testing Requirements
1) E2E (Required)

Add a small E2E suite to assert GTEP layout exclusion:

For each route in:
/sitemap/, /privacy/, /terms/, /contact/, /faqs/

Assert:

Top nav buttons do not exist

Left nav does not exist

Calculator pane containers do not exist

Ad pane does not exist

Page contains an <h1>

Page contains footer links

2) SEO checks (Required)

Title, meta description, canonical exist and are unique

G) Acceptance Criteria
Must Have

 /sitemap/ is a standalone, indexable HTML page (no calculator shell, no ads)

 /privacy/, /terms/, /contact/, /faqs/ are standalone, indexable HTML pages

 Universal requirements updated with GTEP exclusion clause (EXCL-1.*)

 Workflow/Agents docs updated so agents don’t reintroduce calculator shell

 E2E tests exist verifying GTEP pages contain none of the calculator layout elements

 Cloudflare performance issue addressed by removing heavy shell/ad/calc JS from /sitemap/

Should Have

 HTML sitemap links are generated from navigation config to stay in sync

 /sitemap.xml verified/updated for full calculator coverage and referenced by robots.txt