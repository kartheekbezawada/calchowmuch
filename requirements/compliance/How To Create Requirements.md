# SERP-Ready Calculator Requirements Standard (CalcHowMuch)
Version: 1.0  
Last updated: 2026-02-08  
Applies to: **All CalcHowMuch calculators** (new builds + SERP upgrades)

---

## 0) What this document is
This is the **single, reusable standard** for writing calculator requirement documents that are:
- **SERP-ready** (SEO intent + schema + crawlability)
- **Implementation-ready** (unambiguous UI + compute + validation)
- **Test-ready** (clear acceptance criteria + test mapping)
- **Traceable** (navigation/sitemap/schema/FAQ consistency)

Use this as your “requirements playbook” when you pause for days and return.

---

## 1) Golden rules (non-negotiable)
### 1.1 Single-Question Rule
Each calculator page must answer **one primary user question**.  
If multiple modes exist, they must be **tightly coupled** and still satisfy the same core intent.

### 1.2 Layout protection (when stated)
If the requirement says **“keep layout as-is”**, do not change:
- input labels, ordering, spacing, button position
- section structure
- explanation pane copy (unless explicitly allowed)

Allowed changes for SERP upgrade only:
- `<title>`, meta description, canonical, JSON-LD, sitemap entry, schema guard, internal linking (only if a slot already exists)

### 1.3 SEO must be grounded in intent
Keywords are not decoration. Requirements must map keywords to:
- page title + H1 + meta description
- explanation summary + FAQs
- structured data (WebPage/SoftwareApplication/FAQPage)

### 1.4 Schema must match visible content
If you inject FAQPage schema, the Q/A text **must match the visible FAQ text verbatim** (punctuation and quotes included).

### 1.5 Everything must be testable
If it can’t be verified by a unit test, E2E test, or SEO assertion, it’s not a requirement—rewrite it.

---

## 2) Requirement document types
### Type A — New calculator (full REQ)
Includes: UI spec, compute spec, explanation pane spec, 10 FAQs (unless you have a different rule), JSON-LD bundle, sitemap/nav updates, tests.

### Type B — SERP upgrade (existing calculator, “no content changes”)
Includes: title/meta/canonical, JSON-LD, sitemap/nav, schema guard, tests.  
Explicitly states: **calculation pane unchanged** and **explanation pane unchanged**.

### Type C — SERP rebuild (existing calculator, keep layout but rewrite explanation pane)
Includes: calculation pane locked, compute may be unchanged or hardened, explanation pane rewritten to standard, 10 FAQs, JSON-LD, tests.

---

## 3) Required top header block (copy/paste)
Every REQ must start with this metadata:

- Calculator Group:
- Calculator:
- Primary Question (Single-Question Rule):
- Status: NEW / REBUILD / SERP Upgrade
- Constraints: (e.g., “keep layout as-is”)
- FSM Phase: REQ
- Scope: UI / Compute / Navigation / SEO / Sitemap / Testing / Compliance

---

## 4) SERP & SEO requirements (what to include)
### 4.1 Purpose & Search intent
- Define the user’s **job-to-be-done**
- List the **modes** (if any) and explain why they are still one intent
- State the **core output** the user expects

### 4.2 Keyword spec (MANDATORY)
Provide:
- Primary keywords (3–6)
- Secondary keywords (5–12)
- Long-tail / intent phrases (6–15)
- Optional: “keyword pods” (clustered by scenario/intent/audience)

**Placement rule** (unless “no content changes”):
- H1: includes primary keyword
- Title: primary keyword + qualifier
- Meta description: primary + benefit + core outputs
- Explanation H2 summary: primary + 1–2 secondary
- FAQs: at least 3 questions should naturally include primary/secondary

### 4.3 SEO metadata (MANDATORY)
- Title (≤ ~60 chars target)
- Meta description (140–160 chars target)
- Canonical URL: `https://calchowmuch.com{slug}`
- OpenGraph/Twitter cards (optional but recommended; keep consistent site-wide)

### 4.4 Canonical/slug rules
- One canonical per calculator page
- Slug should be:
  - lowercase
  - hyphenated
  - stable (avoid renames unless necessary)

---

## 5) Navigation, sitemap, and indexing
### 5.1 Navigation
- Must specify:
  - Top category (e.g., Time & Date)
  - Left-nav label (exact text)
  - Slug mapping
- If “no layout change”, navigation updates should be config-only.

### 5.2 Sitemap
Requirement must state:
- Add/confirm `<url><loc>...</loc><changefreq>monthly</changefreq><priority>0.70</priority></url>`
- Any index page updates (if you have calculators index pages)

### 5.3 Internal linking
Only allowed when:
- you already have a “Related calculators” slot or standard block
- no layout changes required to add it

---

## 6) Calculation pane (UI) requirements
### 6.1 Form spec
Provide:
- Inputs list: label, type, units, default, min/max, step, required/optional
- Modes: what inputs are shown per mode
- Validation: error states (what triggers errors + exact message rules if needed)
- Output spec: what appears after Calculate (tables/cards/rows)

### 6.2 UX constraints
- Must be “simple and clean”
- Avoid overloading users; use progressive disclosure only if already supported
- For worker-friendly UIs: short labels, predictable buttons, minimal scrolling

### 6.3 “Keep as-is” rule
If calculation pane is locked, explicitly paste the current UI wording and state:
- “Do not change labels/order/control types”

---

## 7) Compute logic (LLD spec)
### 7.1 Constants & defaults
List constants as named values, e.g.:
- `CYCLE_MINUTES = 90`
- `FALL_ASLEEP_MINUTES = 15`

### 7.2 Deterministic formulas
For each output:
- Provide formula
- Provide examples
- Provide edge-case handling rules

### 7.3 Time rules (important for Time & Date)
- Must handle crossing midnight (“ends next day”)
- Must clarify:
  - whether start is included
  - how DST affects results (if relevant)
  - timezone behavior (local browser time unless specified)

### 7.4 Rounding rules
State explicitly:
- “No rounding” (store full precision; format for display only), or
- “Round to X decimals” (where/when)

---

## 8) Explanation pane (SERP-critical) standard
### 8.1 Structure rules
- H2: Summary (single H2)
- H3: all other sections
- Include:
  - Scenario Summary table (dynamic fields)
  - Results table (dynamic fields)
  - How it works (plain language)
  - Assumptions/limitations
  - FAQs section (boxed styling)

### 8.2 Dynamic tables
Requirement must define:
- table columns/rows
- which fields map to which inputs/outputs
- when a row is hidden (e.g., “Week range only in weekly mode”)

### 8.3 FAQ rules
Pick one model per page and state it:

**Model 1 — New calculator FAQs**
- Exactly 10 FAQs (if that’s your standard)
- Must be SERP-optimized
- Must match FAQPage JSON-LD exactly

**Model 2 — Existing calculator FAQs (no content change)**
- Do not edit FAQ text
- Copy FAQs into JSON-LD verbatim
- If page has no FAQs, do not inject FAQPage schema

---

## 9) JSON-LD bundle (page-scoped)
Each page should have a consistent bundle:
- WebPage
- SoftwareApplication
- BreadcrumbList
- FAQPage (only if FAQs exist and are visible)

### 9.1 Schema injection guard (MANDATORY)
Add a page-level boolean guard pattern to prevent duplicate FAQPage:
- Layout must not inject FAQPage globally
- Page injects FAQPage only when `enableFAQ = true`

---

## 10) Testing & QA requirements
Every REQ must include tests in these categories (as applicable):

### 10.1 Unit tests (compute)
- Core formulas
- Edge cases (midnight, DST, negative values, invalid ranges)
- Rounding/precision assertions

### 10.2 E2E tests (Playwright)
- Mode switching
- Input entry
- Calculate -> output rendering
- Error handling
- Explanation pane presence + FAQ rendering

### 10.3 SEO tests
- Title/meta/canonical present
- JSON-LD scripts present and valid
- FAQPage schema matches visible FAQs
- No duplicate FAQPage scripts

### 10.4 UI regression (ISS-001)
- Snapshot tests for calculation pane (and explanation pane if locked)
- “No layout change” pages must pass pixel/DOM snapshot expectations

---

## 11) Acceptance criteria (definition of done)
A requirement is not complete without “Done = …”.
Include 6–12 bullet points such as:
- “No UI layout changes”
- “Outputs match formulas and examples”
- “Explanation pane includes dynamic scenario + results tables”
- “FAQPage schema matches visible FAQs exactly”
- “Sitemap and nav updated”
- “All tests pass”

---

# Appendix A — Copy/paste REQ template (fill blanks)

## REQ — {Calculator Name} (SERP-Ready)
Calculator Group: {Group}  
Calculator: {Name}  
Primary Question: {Single-question}  
Status: {NEW | REBUILD | SERP Upgrade}  
Constraints: {e.g., Keep layout as-is}  
FSM Phase: REQ  
Scope: {UI, Compute, Navigation, SEO, Sitemap, Testing}

### 1) Purpose & Search Intent
- User intent:
- Modes (if any):
- Core outputs:

### 2) SEO Keywords
- Primary:
- Secondary:
- Long-tail / keyword pods:

### 3) URL & Canonical
- Slug:
- Canonical:

### 4) Calculation Pane (UI)
- Inputs (table):
- Modes:
- Output spec:
- Validation rules:

### 5) Compute Logic
- Constants:
- Formulas:
- Edge cases:
- Rounding/precision:

### 6) Explanation Pane
- H2 Summary requirements:
- H3 sections:
- Scenario summary table:
- Results table:
- FAQs model: {10 new | existing unchanged}

### 7) JSON-LD
- WebPage:
- SoftwareApplication:
- BreadcrumbList:
- FAQPage: {yes/no}
- Schema guard:

### 8) Sitemap & Navigation
- Left-nav label:
- Add sitemap entry:

### 9) Testing
- Unit:
- E2E:
- SEO:
- UI regression:

### 10) Acceptance Criteria
- Bullet list:

---

# Appendix B — Requirement Quality Checklist (use to validate any REQ)

## B1 — Completeness
- [ ] Header block filled (group/name/question/status/constraints/scope)
- [ ] Canonical URL defined
- [ ] Title + meta description defined
- [ ] Keywords provided (primary/secondary/long-tail)
- [ ] Navigation + sitemap update stated
- [ ] JSON-LD bundle specified (WebPage, SoftwareApplication, BreadcrumbList)
- [ ] FAQPage schema rules stated (and FAQ text source identified)
- [ ] Explanation pane rules stated (or explicitly locked “as-is”)

## B2 — Unambiguity
- [ ] Every mode is clearly defined (what shows/what computes)
- [ ] Input definitions include units, defaults, min/max/step
- [ ] “No layout changes” pages explicitly list locked UI wording/controls
- [ ] DST/timezone behavior explicitly stated when time math is involved

## B3 — Testability
- [ ] Unit tests cover core formulas and edge cases
- [ ] E2E tests cover UI flow + error states
- [ ] SEO tests validate title/meta/canonical + JSON-LD
- [ ] FAQPage schema matches visible FAQ text verbatim
- [ ] UI regression checks included when layout is locked

## B4 — Implementation readiness
- [ ] Constants and formulas are deterministic (no hand-waving)
- [ ] Edge cases have explicit rules (midnight, negative, missing inputs)
- [ ] Rounding/precision rules are explicit (“no rounding” or “round to X”)
- [ ] Acceptance criteria clearly define “done”

## B5 — SERP readiness
- [ ] Title includes primary keyword + qualifier
- [ ] Meta description includes primary keyword + benefit + output
- [ ] Explanation summary includes primary keyword naturally (unless locked)
- [ ] Internal linking specified only where allowed
- [ ] Sitemap entry included and canonical matches

---

## How to use this checklist
Before you mark a requirement “ready”, scan B1–B5 and ensure every checkbox is satisfied or explicitly marked “not applicable” with a reason.
