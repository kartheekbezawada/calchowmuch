# Universal Requirements — calchowmuch (Single Source of Truth)

**Document purpose:** This file is the *one* authoritative, indexed rulebook for the calchowmuch static calculator platform.  
**Use case:** Humans + LLM reviewers (Claude/Codex) must be able to cite an exact rule ID when something is violated.

---

## Table of Contents

0. [Document Control](#0-document-control)  
1. [Product Intent](#1-product-intent)  
2. [Authority and Precedence](#2-authority-and-precedence)  
3. [Universal UI Contract](#3-universal-ui-contract)  
4. [Universal Layout and Architecture Boundaries](#4-universal-layout-and-architecture-boundaries)  
5. [Folder Structure Contract](#5-folder-structure-contract)  
6. [Coding Standards](#6-coding-standards)  
7. [Testing Standards](#7-testing-standards)  
8. [SEO and URL Rules](#8-seo-and-url-rules)  
9. [Inventory and Documentation Accuracy](#9-inventory-and-documentation-accuracy)  
10. [PR and Phase Workflow](#10-pr-and-phase-workflow)  
11. [Hard “Never Do” Rules](#11-hard-never-do-rules)  
12. [Definition of Done](#12-definition-of-done)  
13. [How to Report Violations](#13-how-to-report-violations)

---

## 0) Document Control

**[DC-0.1] Single source of truth** — This file is the canonical universal requirements document.  
**[DC-0.2] Applies everywhere** — These rules apply to **ALL calculators**, **ALL phases**, and **ALL PRs**.  
**[DC-0.3] Rule IDs are mandatory** — Any review comment must reference one or more rule IDs (e.g., `UI-2.3`, `FS-3.1`).  
**[DC-0.4] Ignore duplicates elsewhere** — If older documents conflict or repeat content, this file governs.

---

## 1) Product Intent

**[PI-1.1] What this project is** — A modular, high-performance, SEO-friendly calculator platform answering real-world “How much?” questions using transparent logic.  
**[PI-1.2] Target users** — general users, students/learners, financially conscious users, search users from long-tail intent.  
**[PI-1.3] Value proposition**  
- One calculator = one focused question.  
- Simple UI, no unnecessary complexity.  
- Static explanations build trust + SEO value.  
- Extremely fast load times (static + CDN-first).  
- Modular architecture scales to many calculators without becoming fragile.

---

## 2) Authority and Precedence

**[AP-2.1] This file governs** — If anything conflicts, this document wins.  
**[AP-2.2] “Universal vs Phase”** — Phase requirements add new scope, but must not violate universal rules.  
**[AP-2.3] “Repo truth beats assumptions”** — Documentation and reviews must reflect the actual repository state.

---

## 3) Universal UI Contract

The Basic Calculator is the **visual source of truth** for colors, typography, spacing, and component styling.

### 3.1 Theme Tokens (match Basic exactly)

**[UI-1.1] Colors**
- Accent: `#2563eb`
- Accent strong: `#1d4ed8`
- Backgrounds: `#ffffff`
- Borders: `#e5e7eb`
- Text: `#111827`
- Muted text: `#6b7280`
- Secondary button background: `#e2e8f0`
- Secondary button text: `#1f2937`
- Neutral pill background: `#f3f4f6`

**[UI-1.2] Typography**
- Body font: `Trebuchet MS` stack
- Display font (headers): `Iowan Old Style` stack

**[UI-1.3] Sizing and spacing tokens**
- Calculator input font size: `16px`
- Helper/label text: `14px`
- Result text: `18px`, `font-weight: 600`
- Shared padding/radius values must match Basic.

### 3.2 Components (shared classes only)

**[UI-2.1] Buttons**
- Use shared button classes only (`.calculator-button` etc.).
- Primary button: accent background, white text, `font-weight: 600`.
- Secondary button: `#e2e8f0` background, dark text.
- No custom palettes or one-off button designs.

**[UI-2.2] Buttons must not wrap**
- Enforce `white-space: nowrap`.
- If label is too long, shorten label or adjust width (do not invent new styles).

**[UI-2.3] Inputs**
- Use shared input classes/tokens.
- Must have labels.
- Must validate all input.

**[UI-2.4] Input length cap**
- Input values limited to **12 characters**.
  - For `type="text"`: use `maxlength="12"`.
  - For `type="number"`: enforce via JS since maxlength doesn’t apply.

**[UI-2.5] No dropdowns**
- `select` elements are not allowed in calculators.
- Replace with button groups / segmented controls.

### 3.3 Layout contract (page must never grow)

**[UI-3.1] Fixed-height shell**
- Layout must not exceed the Basic Calculator baseline.
- Constrain shell height to viewport (e.g., `height/max-height: calc(100vh - 48px)` or equivalent).

**[UI-3.2] Internal scrolling**
- Left navigation, calculation pane, explanation pane must scroll internally.
- Content must never push page height larger to make the app usable.

**[UI-3.3] No horizontal scroll**
- Common desktop widths must not introduce horizontal scroll.

### 3.4 Scrollbar styling (global and consistent)

**[UI-4.1] Scrollbar theme**
- Thumb: `#2563eb`
- Track: `#f3f4f6`
- Thin width where supported.
- Must apply consistently across all scrollable panes.

### 3.5 Toggle Components (Universal)

**[UITGL-1] Use button groups**
- Toggles must be implemented using button groups, not dropdowns.

**[UITGL-2] Obvious state**
- Toggle state must be visually obvious.

**[UITGL-3] No layout height changes**
- Toggles must not change overall page height or shell size.

**[UITGL-4] Update dependent UI**
- Toggle interaction must update all dependent UI elements (tables, graphs, summaries).

### 3.6 Graphs and Visualizations (Universal)

**[UIGRAPH-1] Fixed-height container**
- Graphs must live inside a fixed-height container.

**[UIGRAPH-2] No page growth**
- Graphs must not increase page height.

**[UIGRAPH-3] Reactive to state**
- Graphs must respond to state changes (inputs, toggles).

**[UIGRAPH-4] Internal scroll if needed**
- Graphs must scroll internally if needed and never push layout height.

---

## 4) Universal Layout and Architecture Boundaries

The UI is a **calculator container framework**: layout is fixed/shared; calculators plug in.

### 4.1 Page regions (fixed skeleton)

**[ARCH-1.1] Six fixed regions**
- Global Header
- Primary Category Navigation
- Left Navigation Pane (Calculator Selector)
- Main Calculation Pane
- Explanation Pane
- Right Monetization Panes (ads)
- Footer

(Ad panes may be one or more containers depending on design, but must be stable.)

### 4.2 Responsibility boundaries (strict)

**[ARCH-2.1] Layout Shell**
- Contains header/footer/panes/ads containers.
- Must contain **no calculator-specific logic or content**.

**[ARCH-2.2] Navigation schema**
- Categories/subcategories/calculator list must be config-driven.
- No hard-coded calculator lists in layout code.

**[ARCH-2.3] Calculator module**
- Owns calculator-specific inputs/compute logic/results.
- Owns explanation content (static HTML).

**[ARCH-2.4] Shared core utilities**
- Shared formatting/validation/helpers must live in shared utilities.
- Calculator folders must not duplicate shared utility logic.

**[ARCH-2.5] Ads isolation**
- Ads load async and must not block calculation logic.
- Ads must not shift layout after render (avoid CLS).

### 4.3 Navigation and switching rules

**[ARCH-3.1] Deep-linking**
- Each calculator must be addressable by direct URL.
- Switching calculators must update:
  - URL
  - page title
  - meta description
  - canonical URL

**[ARCH-3.2] One active calculator**
- Only the active calculator’s UI + logic runs.
- Switching calculators must not execute other calculators’ logic.

### 4.4 Explanation pane rules

**[ARCH-4.1] Explanation must be crawlable**
- Explanation content must exist as HTML (not injected at runtime).
- Use semantic headings (H2/H3).
- Long formulas/steps belong in Explanation pane, not Calculation pane.

**[ARCH-4.2] Multi-mode calculators**
- Explanation must show **only the active mode** explanation (no mixed-mode clutter).

**[UI-EXP-CLARIFY-1] Allowed content, fixed height**
- Explanation panes may contain text, tables, and graphs, but must never change the page shell height.

### 4.5 Universal Domain Navigation

**[UNAV-ROOT-1] Domain buttons required**
- There must be one or more top-level domain buttons (e.g., Math, Loans, Finance).

**[UNAV-ROOT-2] One active domain**
- Only one domain may be active at a time.

**[UNAV-ROOT-3] Domain activation behavior**
- Activating a domain must:
  - Replace left navigation content entirely.
  - Reset left navigation scroll to top.
  - Preserve page shell height.
  - Not trigger a full page reload.

**[UNAV-ROOT-4] No cross-domain leakage**
- Domain switching must not leak navigation items from other domains.

### 4.6 Navigation Scalability Constraints

**[UNAV-SCALE-1] Flat list limit**
- A flat list must not exceed 15 items.

**[UNAV-SCALE-2] Category size limit**
- A category must not exceed 25 calculators.

**[UNAV-SCALE-3] Required subdivision**
- If a category exceeds 25 calculators, it must be subdivided.

**[UNAV-SCALE-4] Search threshold**
- Search must be provided when total calculators in a domain exceed 30.

### 4.7 Navigation Search Contract

**[UNAV-SEARCH-1] Visible search**
- Search input must be visible at the top of the navigation pane.

**[UNAV-SEARCH-2] Real-time filtering**
- Search must filter navigation items in real time.

**[UNAV-SEARCH-3] No auto-navigation**
- Search must not auto-navigate or change the active calculator.

**[UNAV-SEARCH-4] Full restore on clear**
- Clearing search must restore the full navigation tree.

---

## 5) Folder Structure Contract

### 5.1 Deploy root

**[FS-1.1] `/public` is deploy root**
- Everything served by the website/CDN lives under `/public`.
- Anything outside `/public` is dev/tooling/docs only.

### 5.2 Required folders and purpose

**[FS-2.1] Shared layout**
- `/public/layout/` — shared page shell fragments (header/footer/panes).
- No calculator-specific logic/content allowed.

**[FS-2.2] Shared assets**
- `/public/assets/` — site-wide assets.
- `/public/assets/css/` — shared CSS (base/layout/calculator UI).
- `/public/assets/js/core/` — shared JS utilities.
- `/public/assets/js/vendors/` optional — third-party libs (versioned/hashed), do not load unless needed.

**[FS-2.3] Config**
- `/public/config/` — config-driven navigation etc. (e.g., `navigation.json`).
- No hard-coded calculator lists.

### 5.3 Calculator folders (source of truth)

**[FS-3.1] Calculator folder structure**
- `/public/calculators/<category>/<calculator-slug>/`
  - `index.html` (SEO entry)
  - `module.js` (calculator-specific logic)
  - `explanation.html` (static explanation)

**[FS-3.2] Calculator isolation**
- Calculator folders must not import each other.
- No circular dependencies.

**[FS-3.3] Naming**
- Folder slugs must be **lowercase** and **hyphen-separated**.
  - ✅ `credit-card-payoff`
  - ❌ `CreditCardPayoff`

### 5.4 Indexing files

**[FS-4.1] Master calculators listing**
- `/public/calculators/index.html` must link to all active calculators and reflect navigation structure.

**[FS-4.2] Sitemap and robots**
- `/public/sitemap.xml` must list every active calculator URL.
- `robots.txt` must not accidentally block calculator pages.

---

## 6) Coding Standards

### 6.1 JavaScript (plain JS)

**[CS-1.1] Plain JavaScript**
- Use plain JS (no TypeScript assumptions).

**[CS-1.2] No duplicated utility logic**
- Shared logic belongs in `/public/assets/js/core/`.

**[CS-1.3] Input validation**
- Validate all user inputs (including empty values and divide-by-zero).

**[CS-1.4] Safe error handling**
- Compute functions must not throw unhandled exceptions.
- Return a clear error state/message to UI.

**[CS-1.5] Avoid globals**
- Avoid global variables; scope to modules.

### 6.2 HTML

**[CS-2.1] Unique metadata per calculator**
- Unique `<title>`
- Unique meta description
- Exactly one `<h1>`

**[CS-2.2] Explanation is static HTML**
- Explanation content must be present in HTML and crawlable (not injected).

**[CS-2.3] Semantic headings**
- Use H2/H3 inside explanation pane.

**[CS-2.4] Inputs must have labels**
- Every input has a label for accessibility.

### 6.3 CSS

**[CS-3.1] Shared CSS**
- Layout CSS belongs in shared layout stylesheet(s).
- Calculator UI styling belongs in shared calculator stylesheet(s).

**[CS-3.2] Avoid inline styles**
- Do not use inline styles in calculator HTML.

**[CS-3.3] No duplicated CSS**
- Do not duplicate CSS rules across calculator folders unless unavoidable.

---

## 7) Testing Standards

**[TEST-1.1] Unit tests required**
- All new calculator compute logic must have unit tests.

**[TEST-1.2] Coverage**
- Minimum **80% coverage** for new compute logic.

---

## 8) SEO and URL Rules

**[SEO-1.1] Deep-linkable calculators**
- Each calculator must be directly accessible via URL.

**[SEO-1.2] Metadata updates**
- Changing calculator selection must update title/description/canonical.

**[SEO-1.3] Explanation is SEO depth**
- Explanation pane contains long-form content, examples, assumptions, edge cases.
- Calculation pane stays compact.

---

## 9) Inventory and Documentation Accuracy

**[DOC-1.1] Inventory disclosure is mandatory**
- Documentation must list all calculator folders that exist under `/public/calculators/`, even if not wired into navigation.

**[DOC-1.2] Status labeling**
Every calculator must be labeled as one of:
- Active
- Work-in-progress / Unverified
- Legacy / Deprecated

**[DOC-1.3] No silent omission**
- If folders exist but are not referenced in navigation, docs must still acknowledge them and state status.

---

## 10) PR and Phase Workflow

### 10.1 Required reading order (for Claude/Codex review)

**[WF-1.1] Claude must read**
1. This Universal Requirements file (this document)
2. Phase tracker (`requirements/universal/INDEX.MD`)
3. The active phase file in `requirements/phases/`

**[WF-1.2] Codex must read**
Same inputs as Claude before review.

### 10.2 Development loop

**[WF-2.1] Ralph Lauren Loop**
1. Implement
2. Evaluate vs requirements
3. Identify gaps
4. Fix
5. Repeat until requirements + tests pass

### 10.3 After PR merge

**[WF-3.1] Update the phase tracker**
After merge, update `INDEX.MD`:
- mark phase ✅ done
- progress 100%
- add PR number
- update current phase pointer
- update last updated date

---

## 11) Hard Never Do Rules

**[NEVER-1.1] Never delete data without soft-delete strategy**  
**[NEVER-1.2] Never bypass authentication (if/when applicable)**  
**[NEVER-1.3] Never commit directly to `main`**  
**[NEVER-1.4] Never ignore runtime or linting errors**  
**[NEVER-1.5] Never hardcode environment-specific values**  
**[NEVER-1.6] Never merge PRs that violate universal rules**  

---

## 12) Definition of Done

A task/PR is **done only when**:

**[DOD-1.1] Code works as intended**  
**[DOD-1.2] Unit tests pass**  
**[DOD-1.3] No runtime or lint errors**  
**[DOD-1.4] Reviewed by Codex**  
**[DOD-1.5] PR approved + merged**  
**[DOD-1.6] Phase tracker updated (INDEX.MD)**  

If any item is missing, the task is not done.

---

## 13) How to Report Violations

When reporting issues (human or LLM), use this exact format:

**Violation Template**
- **Rule ID(s):** `UI-2.5`, `FS-3.1`, `CS-1.3`  
- **Severity:** P0 Block / P1 Fix / P2 Suggest  
- **Where:** file path(s) + line(s) if possible  
- **What happened:** short factual description  
- **Expected:** quote the requirement from this document  
- **Proposed fix:** concrete action

**Severity guidance**
- **P0 Block:** breaks non-negotiables (folder contract, security, page growth, no-dropdown rule, missing tests for new compute logic, etc.)
- **P1 Fix:** validation gaps, duplicated utilities, SEO metadata not unique, explanation not crawlable
- **P2 Suggest:** naming, readability, minor refactors

---

**End of document**
