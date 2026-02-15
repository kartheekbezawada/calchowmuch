# Release Sign-Off Template

> **This file is a TEMPLATE only.** Do not write release evidence here.
>
> For each release, create a new file:
> `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`
>
> Example: `RELEASE_SIGNOFF_REL-20260214-001.md`

---

## Naming Convention

```
RELEASE_SIGNOFF_REL-YYYYMMDD-###.md
```

- `YYYYMMDD` — release date (UTC)
- `###` — sequential release number for that day (001, 002, etc.)

## Storage Location

```
requirements/universal-rules/release-signoffs/
├── RELEASE_SIGNOFF_REL-20260214-001.md
├── RELEASE_SIGNOFF_REL-20260215-001.md
└── ...
```

## Workflow

1. Copy the template sections below into a new file named `RELEASE_SIGNOFF_{RELEASE_ID}.md`
2. Fill out all sections with evidence
3. Add a summary row to `Release Sign-Off Master Table.md` linking to the sign-off file
4. Inform human: "Ready to merge"

## Checklist ↔ Sign-Off Mapping

> Every section below maps 1:1 to `RELEASE_CHECKLIST.md`. The mapping column shows which checklist section(s) each sign-off section captures evidence for.

| Sign-Off §                                 | Captures Evidence For (Checklist §)          |
| :----------------------------------------- | :------------------------------------------- |
| 1 — Release Identity                       | (meta — no checklist equivalent)             |
| 2 — Pages Tested                           | C2 Lab gates scope                           |
| 3 — Device & Browser Matrix                | B1, B2, B3 mobile/tablet coverage            |
| 4 — Pre-Release: Rendering & JS Discipline | A1 Rendering order, A3 JS discipline         |
| 5 — Pre-Release: Layout Stability (CLS)    | A2 Layout stability                          |
| 6 — Pre-Release: Caching Readiness         | A4 Caching readiness                         |
| 7 — Performance & CWV Results              | C1 Field targets, C2 Lab gates               |
| 8 — Global CWV Regression Guard            | C3 CWV Guard                                 |
| 9 — Ads: Slot Reservation                  | D1 Slot reservation                          |
| 10 — Ads: Load Timing                      | D2 Load timing                               |
| 11 — Ads: Placement Stability              | D3 Placement stability                       |
| 12 — Ads: Mobile Verification              | B3 Ads on mobile                             |
| 13 — Animation & Visual Effects            | E Animation                                  |
| 14 — Mobile & Tablet Verification          | B1 Layout/nav, B2 Inputs                     |
| 15 — Manual Regression Scenarios           | F1 First load, F2 Interaction, F3 Navigation |
| 16 — SERP Readiness                        | I1–I7 full SERP                              |
| 17 — Observability (Post-Release)          | J Post-release verification                  |
| 18 — Release Decision                      | K Decision rules                             |
| 19 — Exceptions                            | (follow-up tracking)                         |
| 20 — Final Sign-Off                        | (approval gate)                              |

---

## Template — Copy Below This Line

---

## 1) Release Identity

| Field                  | Value                                              |
| :--------------------- | :------------------------------------------------- |
| **Release ID**         | REL-YYYYMMDD-###                                   |
| **Release Type**       | UI / Logic / SEO / Performance / Ads / Nav / Other |
| **Branch / Tag**       | `<git-branch-or-tag>`                              |
| **Commit SHA**         | `<commit-sha>`                                     |
| **Environment Tested** | Localhost / Preview / Staging / Production         |
| **Release Owner**      | `<name>`                                           |
| **Date (UTC)**         | YYYY-MM-DD                                         |

---

## 2) Pages Tested (Coverage Required)

> Maps to: **Checklist C2** (lab gate scope)

### 2.1 Mandatory coverage (minimum)

| Page Type                   | Slug / URL Path                     | Notes                                  |
| :-------------------------- | :---------------------------------- | :------------------------------------- |
| Category Hub                | `/finance/` (example)               | Must include left-nav + internal links |
| Calculator (Top Traffic)    | `/<category>/<calculator-1>/`       | Must include ads + FAQ + results       |
| Calculator (Top Traffic)    | `/<category>/<calculator-2>/`       | Must include mode toggles if any       |
| Calculator (Heavy Table)    | `/<category>/<calculator-3>/`       | Must include scenario table/schedule   |
| Calculator (New / Modified) | `/<category>/<calculator-changed>/` | This release's main target             |

### 2.2 Optional extra coverage (recommended)

| Page Type                       | Slug / URL Path             | Notes                                  |
| :------------------------------ | :-------------------------- | :------------------------------------- |
| Landing from Google (deep link) | `/<category>/<calculator>/` | Validate correct subcategory auto-open |
| One non-finance page            | `/privacy/` or `/about/`    | Ensure shared layout stable            |

---

## 3) Device & Browser Matrix (Minimum Required)

> Maps to: **Checklist B1, B2, B3** (mobile/tablet coverage)

### 3.1 Desktop

| Device         | OS      | Browser | Version | Tested (Y/N) |
| :------------- | :------ | :------ | :------ | :----------- |
| Desktop/Laptop | Windows | Chrome  | Latest  |              |
| Desktop/Laptop | macOS   | Safari  | Latest  |              |

### 3.2 Mobile

| Device | OS      | Browser | Version | Tested (Y/N) |
| :----- | :------ | :------ | :------ | :----------- |
| Phone  | Android | Chrome  | Latest  |              |
| iPhone | iOS     | Safari  | Latest  |              |

### 3.3 Tablet (if layout differs)

| Device | OS         | Browser | Version | Tested (Y/N) |
| :----- | :--------- | :------ | :------ | :----------- |
| iPad   | iOS/iPadOS | Safari  | Latest  |              |

---

## 4) Pre-Release: Rendering Order & JS Discipline

> Maps to: **Checklist A1** (rendering order) + **A3** (JS discipline)

### 4.1 Rendering order (above-the-fold) — Checklist A1

- [ ] Calculator UI renders without waiting for ad scripts
- [ ] Initial results (or initial state) are visible immediately after first render
- [ ] No runtime injection adds content above the fold after load (especially ads/nav)
- [ ] No `@import` chains in any render-blocking CSS file (grep `public/assets/css/` for `@import`). Theme/dependency CSS must be loaded as separate `<link>` tags for parallel download. _(Ref: known_issues.md KI-010)_
- [ ] Render-blocking CSS count is ≤ 3 files. Any additional CSS must use async loading (preload+swap or media=print trick). _(Ref: known_issues.md KI-011)_

### 4.2 CSS Discipline Evidence — Checklist A1

| Page       | Blocking CSS Count | @import Chains Found (Y/N) | Async CSS Files | Notes |
| :--------- | :----------------- | :------------------------- | :-------------- | :---- |
| `<page-1>` |                    |                            |                 |       |
| `<page-2>` |                    |                            |                 |       |

### 4.2 JavaScript discipline (INP protection) — Checklist A3

- [ ] No heavy computation on slider/input events (no long tasks on interaction path)
- [ ] Non-essential scripts are deferred/lazy-loaded
- [ ] Interaction remains smooth during rapid slider drags and fast typing

---

## 5) Pre-Release: Layout Stability (CLS Control)

> Maps to: **Checklist A2**

- [ ] No visible layout shift when:
  - fonts load
  - results/table appear
  - FAQs render
  - nav expands/collapses
  - ads load
- [ ] All ad slots have reserved space at every breakpoint (see §9)

---

## 6) Pre-Release: Caching Readiness

> Maps to: **Checklist A4**

| Check                                                                        | Pass/Fail | Evidence / Notes |
| :--------------------------------------------------------------------------- | :-------- | :--------------- |
| Static assets are long-TTL cached (versioned/immutable)                      |           |                  |
| HTML caching strategy configured (high cache hit, no stale critical content) |           |                  |
| Cache headers verified for HTML                                              |           |                  |
| Cache headers verified for CSS                                               |           |                  |
| Cache headers verified for JS                                                |           |                  |
| Cache headers verified for fonts                                             |           |                  |
| Cache headers verified for images                                            |           |                  |

---

## 7) Performance & CWV Results

> Maps to: **Checklist C1** (field targets) + **C2** (lab gates)

### 7.1 Lighthouse (Lab) — Mobile profile

Run Lighthouse on the pages listed in §2. Record results below.

| Page       | LCP (s) | CLS | INP/TBT Proxy | CLS Warnings in Filmstrip (Y/N) | Blocking Tasks (Y/N) | Notes |
| :--------- | :------ | :-- | :------------ | :------------------------------ | :------------------- | :---- |
| `<page-1>` |         |     |               |                                 |                      |       |
| `<page-2>` |         |     |               |                                 |                      |       |
| `<page-3>` |         |     |               |                                 |                      |       |

- [ ] No CLS warnings or obvious layout shifts in filmstrip (C2)
- [ ] No large blocking tasks around first interaction (C2)
- [ ] Above-the-fold content renders quickly — no ad-induced delay (C2)
- [ ] **Lighthouse "Eliminate render-blocking resources" audit reviewed** — every CSS/JS file listed must be justified as critical or converted to async _(Ref: known_issues.md KI-010/011)_
- [ ] **Render-blocking request count** documented below (target: ≤ 3 CSS files)

| Page       | Render-Blocking CSS Files | Render-Blocking JS Files | "Eliminate render-blocking" Est. Savings | Notes |
| :--------- | :------------------------ | :----------------------- | :--------------------------------------- | :---- |
| `<page-1>` |                           |                          |                                          |       |
| `<page-2>` |                           |                          |                                          |       |

### 7.2 Field Metrics Snapshot (If available)

If this is a production follow-up or you have RUM/CrUX snapshots:

| Metric  | P75 Value | Threshold | Pass/Fail | Source        | URL Group / Notes |
| :------ | :-------- | :-------- | :-------- | :------------ | :---------------- |
| **LCP** |           | ≤ 2.5s    |           | GSC CWV / RUM |                   |
| **INP** |           | ≤ 200ms   |           | GSC CWV / RUM |                   |
| **CLS** |           | ≤ 0.10    |           | GSC CWV / RUM |                   |

---

## 8) Global CWV Regression Guard (Automated WSL)

> Maps to: **Checklist C3**

### 8.1 Guard Results

| Scope               | Routes Checked | Violations | Highest Normal LCP (ms) | Highest Stress LCP (ms) | Highest Normal INP Proxy (ms) | Highest Stress INP Proxy (ms) | Highest Normal CLS | Highest Stress CLS | Highest Single Shift | Status (Pass/Fail) |
| :------------------ | :------------- | :--------- | :---------------------- | :---------------------- | :---------------------------- | :---------------------------- | :----------------- | :----------------- | :------------------- | :----------------- |
| **All calculators** |                |            |                         |                         |                               |                               |                    |                    |                      |                    |

- [ ] Command executed: `npm run test:cwv:all` (or `npm run test:cls:all` alias)
- [ ] Evidence attached: `test-results/performance/cls-guard-all-calculators.json`
- [ ] Mode A (Normal) — standard load completed
- [ ] Mode B (Stress) — slow CSS, slow fonts, CPU throttle completed

### 8.2 Root Cause Analysis (If Failed/Warned)

- [ ] Late CSS load / FOUC
- [ ] Webfont metric swap
- [ ] Slider/component resize post-mount
- [ ] Breakpoint/class toggles after hydration
- [ ] Image/icon missing reserved dimensions
- [ ] Ad container collapse
- [ ] Dynamic injection
- [ ] **@import chain in render-blocking CSS** _(Ref: known_issues.md KI-010)_
- [ ] **Too many render-blocking CSS files (> 3)** _(Ref: known_issues.md KI-011)_

### 8.3 LCP Stress Margin Check

> Any stress LCP > 2300ms triggers a WARNING (200ms safety margin). Investigate render-blocking CSS count and @import chains before signing off. _(Added after KI-006/010)_

| Page       | Stress LCP (ms) | Margin to 2500ms | Status (OK / WARNING / FAIL) | Notes |
| :--------- | :-------------- | :--------------- | :--------------------------- | :---- |
| `<page-1>` |                 |                  |                              |       |
| `<page-2>` |                 |                  |                              |       |

---

## 9) Ads: Slot Reservation

> Maps to: **Checklist D1**

| Page       | Slot ID | min-height Reserved per Breakpoint (Y/N) | Present in Initial Layout (Y/N) | No Collapse to 0 Height (Y/N) | No-Fill Preserves Layout (Y/N) | Notes |
| :--------- | :------ | :--------------------------------------- | :------------------------------ | :---------------------------- | :----------------------------- | :---- |
| `<page-1>` |         |                                          |                                 |                               |                                |       |
| `<page-2>` |         |                                          |                                 |                               |                                |       |

---

## 10) Ads: Load Timing

> Maps to: **Checklist D2**

- [ ] Ads load after initial render AND idle window / first meaningful interaction
- [ ] Ad scripts are not render-blocking
- [ ] Exactly one AdSense loader in rendered `<head>`; no body-level loader duplication from ad unit snippets
- [ ] Ad implementation matches canonical snippet sources:
  - Head loader: `requirements/universal-rules/AdSense code snippet.md`
  - Body slot: `requirements/universal-rules/Ad Unit Code.md`

---

## 11) Ads: Placement Stability

> Maps to: **Checklist D3**

- [ ] No "auto" placements that dynamically add new slots in unpredictable places
- [ ] No ad refresh behavior that changes slot height
- [ ] Sticky ad behavior (if any) does not cover inputs or cause layout shift

---

## 12) Ads: Mobile Verification

> Maps to: **Checklist B3**

| Page       | Ads Overlap Inputs/Results (Y/N) | Ads Push Content Unexpectedly (Y/N) | Ads Change Height After Render (Y/N) | Notes |
| :--------- | :------------------------------- | :---------------------------------- | :----------------------------------- | :---- |
| `<page-1>` |                                  |                                     |                                      |       |
| `<page-2>` |                                  |                                     |                                      |       |

- [ ] Ads do not overlap inputs/results
- [ ] Ads do not push content unexpectedly
- [ ] Ads do not change height after render (no late resizing causing CLS)

---

## 13) Animation & Visual Effects

> Maps to: **Checklist E**

- [ ] Animations only use `opacity` and `transform`
- [ ] No animation uses layout properties (`height`/`width`/`top`/`left`) that can cause reflow
- [ ] Glassmorphism above fold is lightweight (no large blur on big surfaces)
- [ ] Hover effects do not trigger layout changes

---

## 14) Mobile & Tablet Verification

> Maps to: **Checklist B1** (layout/nav) + **B2** (inputs)

### 14.1 Layout & Navigation — Checklist B1

- [ ] Mobile uses single-column calculator layout
- [ ] Burger navigation works and does not cause main content CLS when opened/closed
- [ ] Tap targets meet usability: spacing, size, clear highlight for expand/collapse

### 14.2 Inputs on Mobile — Checklist B2

- [ ] Numeric inputs use numeric keyboard where relevant
- [ ] `min`/`max`/`step` present where applicable
- [ ] No input jank: slider drag remains responsive

---

## 15) Manual Regression Scenarios

> Maps to: **Checklist F1** (first load) + **F2** (interaction) + **F3** (navigation)

### 15.1 First Load — Checklist F1

| Scenario                                            | Pass/Fail | Notes |
| :-------------------------------------------------- | :-------- | :---- |
| Page loads with no visible jump                     |           |       |
| Results render without pushing content unexpectedly |           |       |
| Ads appear without shifting content                 |           |       |

### 15.2 User Interaction — Checklist F2

| Scenario                                                        | Pass/Fail | Notes |
| :-------------------------------------------------------------- | :-------- | :---- |
| Rapid slider drag for 5–10 seconds: no lag, no freezing         |           |       |
| Fast typing in numeric fields: no input delay                   |           |       |
| Toggling month/year or modes: no layout jump, no reflow flicker |           |       |

### 15.3 Navigation Behavior — Checklist F3

| Scenario                                                            | Pass/Fail | Notes |
| :------------------------------------------------------------------ | :-------- | :---- |
| Left nav: subcategories collapsed by default                        |           |       |
| Landing directly on calculator URL expands only correct subcategory |           |       |
| Expand/collapse does not shift main content pane                    |           |       |

---

## 16) SERP Readiness Verification (All Calculators)

> Maps to: **Checklist I1–I7**

### 16.1 Metadata & Canonical Verification — Checklist I1

| Page       | `<title>` Unique (Y/N) | Meta Desc Intent-Aligned (Y/N) | Canonical Correct (Y/N) | No Duplicate Metas (Y/N) | Notes |
| :--------- | :--------------------- | :----------------------------- | :---------------------- | :----------------------- | :---- |
| `<page-1>` |                        |                                |                         |                          |       |
| `<page-2>` |                        |                                |                         |                          |       |
| `<page-3>` |                        |                                |                         |                          |       |

### 16.2 Structured Data Verification — Checklist I2

| Page       | Schema Bundle Correct (Y/N) | Validates Rich Results Test (Y/N) | JSON-LD Matches Visible Content (Y/N) | No Duplicate FAQPage (Y/N) | Notes |
| :--------- | :-------------------------- | :-------------------------------- | :------------------------------------ | :------------------------- | :---- |
| `<page-1>` |                             |                                   |                                       |                            |       |
| `<page-2>` |                             |                                   |                                       |                            |       |
| `<page-3>` |                             |                                   |                                       |                            |       |

**Safe schema set:** `WebPage`, `SoftwareApplication`, `FAQPage` (when visible), `BreadcrumbList`.

- [ ] No `HowTo`, `Review`, `AggregateRating`, or `Product` schema unless supported by visible content

### 16.3 Content Indexability — Checklist I3

- [ ] Explanation section present in initial HTML (all calculator pages)
- [ ] FAQs present in initial HTML (all calculator pages with FAQs)
- [ ] Key formulas present in initial HTML (where applicable)
- [ ] Primary headings (H1, H2) present in initial HTML
- [ ] Page is fully crawlable without JavaScript execution
- [ ] No critical content gated behind JS rendering, tabs, or user interaction

### 16.4 Internal Linking Verification — Checklist I4

- [ ] Category page links to each calculator page within it
- [ ] Each calculator links back to its parent category
- [ ] Each calculator links to closely related calculators
- [ ] Each calculator links to reverse/comparison variants (where applicable)
- [ ] All internal links are visible in HTML (not JS-injected late)

### 16.5 Intent Coverage Verification — Checklist I5

- [ ] Primary intent reflected in title, H1, opening paragraph, and meta description
- [ ] 3–5 secondary intents addressed via explanation, scenario tables, FAQ, or related links
- [ ] Long-tail coverage via natural language phrasing (no keyword stuffing)

### 16.6 Scenario Content (Finance / Percentage Only) — Checklist I6

- [ ] Scenario summary tables or worked examples present
- [ ] Step-by-step breakdowns or practical interpretation text included
- [ ] "What-if" exploratory prompts present in initial HTML
- [ ] N/A (pure math calculator — skip)

### 16.7 SERP Readiness Gate (Aggregate Pass/Fail) — Checklist I7

A page is SERP-ready **only if all** of the following are true:

- [ ] Metadata is unique and intent-aligned
- [ ] Canonical is correct
- [ ] No duplicate schema output
- [ ] JSON-LD is page-scoped and valid
- [ ] Explanation and FAQs exist in initial HTML
- [ ] Internal links are present and crawlable
- [ ] Primary + secondary intents are clearly covered
- [ ] Scenario content exists (finance/percentage cluster)
- [ ] Related/reverse calculators are linked where applicable
- [ ] Page renders cleanly on mobile without CLS issues

**Failure of any mandatory item blocks release.**

---

## 17) Observability (Post-Release Verification)

> Maps to: **Checklist J** — Complete within 24–72 hours after production deploy.

### 17.1 Search Console — CWV

- [ ] No new "poor" URL groups
- [ ] No CLS regression group created

### 17.2 RUM Dashboard (if enabled)

- [ ] LCP distribution stable
- [ ] INP stable
- [ ] CLS stable

### 17.3 Search Console — Indexing

- [ ] No new "Excluded" or "Error" pages
- [ ] No soft 404 regressions
- [ ] Indexed vs submitted gap stable

### 17.4 Search Console — Enhancements

- [ ] No new structured data errors/warnings
- [ ] FAQ rich results still appearing (if applicable)

---

## 18) Release Decision (HARD / SOFT Classification)

> Maps to: **Checklist K**

### 18.1 HARD Blockers (any = release blocked)

- [ ] No CLS regression above 0.1 on representative devices/tests
- [ ] No ads causing visible layout shift
- [ ] No input lag/jank that affects interaction (INP risk)
- [ ] Render not blocked by ads or non-essential scripts
- [ ] No missing or duplicate `<title>` / meta description on any calculator page
- [ ] No broken or incorrect canonical URL
- [ ] No JSON-LD schema not matching visible page content
- [ ] No explanation or FAQ content missing from initial HTML (JS-only rendering)
- [ ] No duplicate `FAQPage` schema output on any page

### 18.2 SOFT Signals (can release with follow-up ticket)

- [ ] Slight Lighthouse score dip but no CWV proxy regressions
- [ ] Minor visual polish issues that do not affect CWV
- [ ] Non-critical asset caching improvements pending

---

## 19) Exceptions & Follow-Up Tickets

| Exception | Severity  | Ticket ID | Owner | Due Date |
| :-------- | :-------- | :-------- | :---- | :------- |
|           | LOW / MED |           |       |          |

---

## 20) Final Sign-Off

### 20.1 Release decision

- [ ] **APPROVED** (all HARD gates passed)
- [ ] **CONDITIONAL PASS** (SOFT issues only, documented above)
- [ ] **REJECTED** (HARD blocker found)

### 20.2 Signatures

| Role                | Name | Date (UTC) | Signature/Note |
| :------------------ | :--- | :--------- | :------------- |
| Release Owner       |      |            |                |
| Reviewer (optional) |      |            |                |
