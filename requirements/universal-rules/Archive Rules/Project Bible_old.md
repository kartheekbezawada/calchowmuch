# CalcHowMuch.com — Project Bible

> Product + SERP Strategy Document — 1M Unique Visitors / Month Target

---

## Table of Contents

1. [Project Introduction](#1-project-introduction)
2. [Non-Negotiable Aim](#2-non-negotiable-aim)
3. [Hosting](#3-hosting)
4. [Initial Information Architecture and Page Design](#4-initial-information-architecture-and-page-design)
5. [Archived 4-Pane Layout](#5-archived-4-pane-layout)
6. [New Design Motto and Layout](#6-new-design-motto-and-layout)
7. [Design Philosophy](#7-design-philosophy)
8. [SERP-Ready System](#8-serp-ready-system)
9. [Performance-Ready System](#9-performance-ready-system)
10. [Mobile & Tablet-Ready System](#10-mobile--tablet-ready-system)
11. [Navigation Rules](#11-navigation-rules)
12. [Crawl Efficiency & Index Hygiene](#12-crawl-efficiency--index-hygiene)
13. [UX Engagement Layer](#13-ux-engagement-layer)
14. [Observability & Real User Monitoring](#14-observability--real-user-monitoring)
15. [Content Freshness Signals](#15-content-freshness-signals)
16. [Programmatic SEO Guardrails](#16-programmatic-seo-guardrails)
17. [AdSense Safety Rules](#17-adsense-safety-rules)
18. [Stage-Gate Growth Signals](#18-stage-gate-growth-signals)
19. [Schema + Rich Text Model](#19-schema--rich-text-model)
20. [Structured Data Components](#20-structured-data-components)
21. [Schema Quality Gates](#21-schema-quality-gates)
22. [Readiness Reality Check](#22-readiness-reality-check)
23. [Top 10 High-ROI Actions for 100k/Month](#23-top-10-high-roi-actions-for-100kmonth)

---

## 1. Project Introduction

CalcHowMuch.com is a calculator website intended to scale to **1 million unique visitors per month** (average). At that scale, total page views will be significantly higher than uniques.

Working assumption (current rule of thumb):

- 1 unique visitor ≈ 5 page interactions / page views
- i.e., **1:5 unique-to-pageview ratio** (baseline expectation; may change over time)

The primary business purpose is to generate revenue to fund future expansions and other projects — the 1M/month milestone is **structurally important**, not "nice to have."

---

## 2. Non-Negotiable Aim

No ifs and buts:

- Reach **1,000,000 unique visitors per month**
- Exclude bot traffic from this goal

This is the core target the product, SEO system, and UX must serve.

---

## 3. Hosting

- Hosted on **Cloudflare Pages**

This choice supports fast global delivery, caching, and operational simplicity.

---

## 4. Initial Information Architecture and Page Design

### Category-First Structure

The site is organized with:

- Top-level calculator categories
- A left navigation pane listing calculators within categories and, in some cases, subcategories

Examples of categories already used:

- Maths
- Finance

### Default State Expectation

- Subcategories are closed by default
- When opened, calculators appear as selectable buttons

### General Pages (Non-Calculator Pages)

These exist outside the calculator layout system:

- Privacy
- Terms and conditions
- Contact us
- FAQs (site-wide generic FAQ about the site)
- Sitemap (complete navigation hierarchy)

---

## 5. Archived 4-Pane Layout

The original idea used four panes (for most calculator pages):

1. Left Navigation Pane
2. Calculation Pane
3. Explanation Pane
4. Ad Pane

### Why Archived

- 4 panes do not provide a rich user experience
- The UI feels stale, box-like, and cluttered
- Users experience unnecessary visual separation between "calculator" and "understanding"

**Key product insight:** layout density and pane fragmentation reduce perceived quality.

---

## 6. New Design Motto and Layout

### Motto (4 Keywords)

> **Simple · Smooth · Wow · Addictive**

These are not decorative words — they are the **acceptance criteria** for design decisions.

### New Layout (3 Panes + Stable Ads)

The new design uses three user panes + one constant ad zone, with two scroll contexts:

1. **Left Navigation Pane** — has its own right-side scrollbar
2. **Single Content Pane** (calculation + explanation combined) — has its own right-side scrollbar; this is the main reading + interaction surface
3. **Ad Pane** (constant across pages) — ads must not interfere with calculator usage; user perception matters: if the user is happy, they return repeatedly

---

## 7. Design Philosophy

### 7.1 Simple

The page must feel instantly understandable, especially for a non-technical baseline user.

Rules:

- Users should not need to hunt across multiple areas to get answers
- Avoid "navigate here and there" patterns for a single outcome
- Prefer one clear calculator per page, not many options
- Toggles are allowed only when they keep things simple (e.g., months/years)

### 7.2 Smooth

The product should feel fluid and interactive, with minimal friction.

Rules:

- Sliders are preferred
- Input boxes are a last resort (only when sliders are not practical)
- Results update instantly; avoid forcing a "calculate" click
- A calculate button can exist but must not be required
- Use default values everywhere:
  - Inputs have defaults
  - Answers render immediately
  - Tables render immediately
- Tables may have toggles (e.g., month/year) but must still feel effortless

### 7.3 Wow

You are not trying to "fight" established calculator websites in a typical way. The aim is 1M uniques/month, and the differentiator is **experience + visual impact**.

The "wow" layer can include:

- Glow effects
- Glassmorphism
- Shiny borders
- Highlighted answers (big fonts)
- Label glow / emphasis

**Important rule:**

- Wow should not be identical on every calculator
- Variation prevents boredom and increases return visits

### 7.4 Addictive

"Addictive" means users choose to return repeatedly because the product feels good.

You cannot force return visits via spend alone. The core belief is:

- If the product is good, customers come back.

The practical model:

> **Simple + Smooth + Wow ⇒ Addictive**

### Retention Hooks

Exact retention hooks that make calculators "addictive":

#### Hook 1 — Save Scenario (No Login)

- "Save" stores inputs + outputs to `localStorage` and generates a shareable URL (query params or short hash)
- Return visitors instantly see their last scenario + "Compare to new scenario"

#### Hook 2 — Compare 3 Scenarios (Side-by-Side)

- Every finance calculator supports: **Base / Optimistic / Conservative**
- Output table shows deltas (difference in time, total interest, final value, etc.)

#### Hook 3 — Timeline Table as the Default "Wow"

- Users love tables more than charts for money decisions
- Make the schedule/table the hero (monthly breakdown, milestones, totals)

#### Hook 4 — "Next Best Calculator" Flow (Cluster Chaining)

After results, show 2–3 contextual next steps:

- Debt payoff → Balance transfer → APR/EAR → Utilization
- Savings goal → Investment growth → Inflation adjustment → FV/PV

This increases session depth without dark patterns.

#### Hook 5 — Export (CSV + Print)

- CSV export option (calculation only)
- PDF export option (calculation only)
- Print-friendly view (no layout shift, no ads in print)

#### Hook 6 — "What Changed?" Explanation

When user adjusts one slider:

- Show a mini card: *"Changing X by Y causes Z change because…"*

This turns interaction into learning (strong retention).

#### Hook 7 — Presets (Fast Replay)

- "Typical" presets (e.g., "Aggressive payoff", "Low risk", "High inflation")
- One click loads preset values → instant results

#### Hook 8 — Lightweight "Collections"

- Allow users to pin calculators into "My Tools" (client-side)
- This becomes your navigation layer for repeat users

---

## 8. SERP-Ready System

SERP readiness is a **page-level quality contract**. A calculator page is considered SERP-ready only when all technical, content, and intent conditions below are satisfied simultaneously.

### 8.1 Core SERP Foundations (Mandatory)

Each calculator page must meet the following baseline requirements:

**Metadata integrity:**

- Unique, keyword-aligned `<title>`
- Meta description tightly aligned to the primary search intent
- Single, clean canonical URL matching the served page
- No duplicate or conflicting meta tags

**Structured data hygiene:**

- Page-scoped JSON-LD only
- No global schema collisions
- No duplicate `FAQPage` output
- JSON-LD must match visible page content exactly
- Schema must validate in Rich Results Test

**Content indexability:**

- Explanation content present in initial HTML
- FAQs present in initial HTML
- Critical content must not depend on client-side rendering
- Page must be fully crawlable without JavaScript execution

### 8.2 Internal Linking Architecture (SEO Multiplier)

Internal linking must be intentional and bidirectional.

**Required link paths:**

- Category page → calculator page
- Calculator → parent category
- Calculator → closely related calculators
- Calculator → reverse/comparison variants (when applicable)

**Design goal** — navigation must function as:

- Topical reinforcement
- Crawl-path expansion
- Authority distribution mechanism

Internal links must be visible in HTML and not injected late via JavaScript.

### 8.3 Indexable HTML Requirement (Critical)

All ranking-critical content must exist in the server-delivered HTML.

**Must be present at initial load:**

- Explanation section
- Key formulas (if applicable)
- Scenario tables
- FAQs
- Primary headings

**Not acceptable:**

- FAQ rendered only via JS
- Explanation injected after load
- Hidden tab content that requires user action to render
- Content gated behind hydration-heavy frameworks

**Objective:** ensure reliable crawling, faster indexing, and reduced rendering dependency.

### 8.4 Intent Coverage Depth (SERP Moat Strategy)

Ranking durability requires intent breadth, not just page quality.

Each calculator must explicitly target:

- 1 primary query (core intent)
- 3–5 secondary intents
- Multiple long-tail variants

#### 8.4.1 Primary Intent

The main user question the calculator solves.

Examples:

- "How much monthly savings do I need?"
- "How to calculate markup?"

**Requirement** — reflected in:

- Title
- H1
- Opening paragraph
- Meta description

#### 8.4.2 Secondary Intent Coverage

Support adjacent user questions that commonly co-occur in SERP.

Examples: reverse calculation, formula explanation, comparison use cases, planning scenarios, edge cases.

**Requirement** — address via:

- Explanation sections
- Scenario tables
- FAQ coverage
- Related calculator links

#### 8.4.3 Long-Tail Capture Layer

Each page must naturally cover long-tail variants through semantic breadth.

**Support using:**

- Natural language explanations
- Scenario examples
- Varied phrasing in FAQs
- Structured headings

Avoid keyword stuffing.

### 8.5 Scenario-Driven Content (Required for Finance Cluster)

For finance and percentage calculators, include real-world scenario grounding.

**Recommended components:**

- Scenario summary tables
- Worked examples
- Step-by-step breakdowns
- Practical interpretation text

**Purpose:**

- Improve dwell time
- Increase snippet eligibility
- Strengthen topical authority
- Improve AI overview eligibility

### 8.6 Comparison & Reverse Calculator Strategy

Where mathematically meaningful, strengthen the cluster with:

**Comparison calculators** — examples:

- Markup vs Margin
- APR vs EAR
- Simple vs Compound Interest

**Reverse calculators** — solve alternate unknowns:

- Find rate
- Find time
- Find contribution
- Find target value

**Benefit:**

- Expands keyword surface
- Improves internal linking graph
- Builds topical moat

### 8.7 Embedded "What-If" Mini Scenarios (High-Impact Enhancement)

Each high-value calculator should include short exploratory prompts such as:

- What if the rate increases?
- What if contributions double?
- What happens if the time horizon changes?

These should be: concise, user-focused, computation-aware, and present in initial HTML.

### 8.8 SERP Readiness Validation Checklist (Pass/Fail)

A page is SERP-ready only if:

- [ ] Metadata is unique and intent-aligned
- [ ] Canonical is correct
- [ ] No duplicate schema output
- [ ] JSON-LD is page-scoped and valid
- [ ] Explanation and FAQs exist in initial HTML
- [ ] Internal links are present and crawlable
- [ ] Primary + secondary intents are clearly covered
- [ ] Scenario content exists (finance cluster)
- [ ] Related/reverse calculators are linked where applicable
- [ ] Page renders cleanly on mobile without CLS issues

**Failure of any mandatory item blocks release.**

---

## 9. Performance-Ready System

> **Scope:** every calculator page and shared layout components (left nav, calculator UI, explanation pane, ad pane). Requirements must hold on **real devices and real networks** (field data), not only in Lighthouse lab runs.

### 9.1 Performance Objectives

**Primary objective:** deliver a fast, stable, responsive calculator experience that meets Core Web Vitals targets in field data and remains stable after ads load.

**Core Web Vitals targets (75th percentile, field):**

| Metric | Threshold |
|--------|-----------|
| LCP    | ≤ 2.5 s   |
| INP    | ≤ 200 ms  |
| CLS    | ≤ 0.1     |

These targets are **release gates** for any change that affects layout, scripts, ads, navigation, fonts, or above-the-fold rendering.

### 9.2 Rendering & Delivery Requirements

**Rapid initial HTML delivery (TTFB):**

- HTML must be delivered quickly using caching strategies that maximize cache hit rate
- Server/edge logic must prioritize: fast first byte, consistent response times, minimal dynamic computation on request path

**JavaScript minimization and load discipline:**

- Ship the smallest possible JavaScript needed for calculator interaction and immediate results rendering
- All non-essential scripts must be deferred, lazy-loaded, or triggered after initial render/idle

**Stable layout by default (no visual shifts):**

- The page must not reflow or shift due to:
  - Late-loading fonts
  - Late-rendered tables/results
  - Ad insertion/resizing
  - Navigation expansion behavior
- Layout stability must be guaranteed via reserved space and predictable rendering order

**Caching policy:**

- Static assets (CSS, JS, fonts, icons): aggressive caching (long TTL + immutable where applicable)
- HTML: balanced caching (shorter TTL + safe invalidation strategy) to maintain freshness while keeping high cache hit

### 9.3 CWV-Safe Ad Engineering Standard

**Non-negotiable principle:** ads must never create CLS. Any CLS regression caused by ads is a **release blocker**.

**Ad slot layout reservation (CLS prevention):**

1. Every ad placement must have pre-reserved space: fixed `min-height` per breakpoint, responsive rules that still reserve space before ad load
2. Avoid ad patterns known to resize unpredictably (especially on mobile)
3. Prefer fixed/stable placements over dynamic "auto" placements

**Load order rules (protect LCP + INP):**

1. Above-the-fold must render calculator UI + first results (or initial state) **without ads blocking render**
2. Load ads only after initial render completes **and** first idle window or first meaningful interaction
3. Heavy script execution must never run on the critical interaction path:
   - Slider movement must remain smooth
   - Keystrokes must remain responsive
   - Avoid long tasks triggered by input events

**Animation rules (protect INP + CLS):**

- Allowed: `opacity`, `transform`
- Disallowed: `height`, `width`, `top`, `left`, or any property triggering layout reflow/repaint-heavy shifts

**Glassmorphism guidance:**

- Allowed below the fold freely
- Above the fold: keep lightweight (avoid large blur filters on large surfaces)

### 9.4 Measurement, Budgets, and Release Gates

**Measurement sources (required):**

- Field CWV via Google Search Console CWV reporting
- Lab budgets via Lighthouse for regressions and CI checks

**Performance budgets (required):**

Each calculator page must meet defined budgets for:

- JS payload (initial)
- CSS payload (initial)
- Total blocking time / long tasks (lab proxy for INP risk)
- Image/font overhead
- Layout shift budget (CLS)

Budgets are enforced in CI, in local audits, and confirmed via field data after release.

**Release blockers (hard stops):**

Block release if any change causes:

- CLS regression above threshold
- Visible layout shift from ads/nav/font loading
- INP degradation (interaction lag)
- Delayed initial render due to ads or non-critical scripts

### 9.5 Ad Monetization Practical Rule

If monetizing via Google AdSense:

- Prefer manual placements with stable reserved containers
- Avoid configurations that inject/rescale unpredictably
- Engineer ad slots like UI components (fixed structure + reserved layout), not like "optional content"

---

## 10. Mobile & Tablet-Ready System

### 10.1 Layout Rules (Mobile-First)

- Mobile must use a **single-column layout** per calculator
- Left navigation must be accessible via a burger menu
- Tap targets must meet usability standards:
  - Comfortable spacing
  - Clear affordances for expand/collapse

### 10.2 Input Performance and Ergonomics

- Inputs must be optimized for mobile keyboards:
  - Numeric input types where relevant
  - `min`, `max`, `step` enforced
- Sliders must remain responsive under load:
  - No heavy computation on every input event
  - Use lightweight updates, debounce expensive work

### 10.3 Ads Must Not Harm Mobile UX

Ads must not:

- Push content down after render
- Overlap inputs/results
- Create scroll jumps
- Create CLS

### 10.4 Mobile-First Stability Rules

- Prevent font-driven reflow:
  - Avoid late font swaps that shift headings and key UI
  - Ensure typography loading does not shift layout
- Reserve space for all "late" components:
  - Result cards
  - Scenario tables
  - FAQ containers
  - Ad containers
  - Expandable nav elements (expanded state must not cause sudden shifts in main content)

---

## 11. Navigation Rules

This is both UX and SEO critical.

**Required behavior:**

- Left nav: all subcategories collapsed by default
- If a user lands directly on a calculator URL (bookmark or Google) → only that calculator's subcategory auto-expands
- Expand/collapse arrow must be:
  - High contrast
  - Easy to tap
  - Visually "obvious"
- Desktop-only hover effects (glassmorphism) must not impact mobile performance
- Expansion must not cause CLS

---

## 12. Crawl Efficiency & Index Hygiene

High-traffic calculators often fail here.

**Must-have:**

- No orphan calculator pages
- XML sitemap synchronized with nav JSON
- Consistent canonical strategy (no parameter pollution)
- Robots rules verified per environment
- Block pagination/filter URLs if not needed

**Watch metrics:**

- Indexed vs submitted gap
- Crawl stats in Search Console
- Soft 404 detection

---

## 13. UX Engagement Layer

Traffic without engagement can hurt over time.

**Must-have:**

- Instant calculation (no submit friction where possible)
- Sticky result summary on mobile (if helpful)
- Clear reset/edit flow
- Copy/share results capability
- No intrusive ads near inputs

**Watch metrics:**

- Engagement time
- Scroll depth
- Return users
- Interaction rate on inputs

---

## 14. Observability & Real User Monitoring

At scale, lab tests are not enough.

**Must-have RUM tracking:**

- LCP
- CLS
- INP

**Segment by:**

- Mobile vs desktop
- Country
- Calculator group

**Require:**

- Alerting on regressions (CLS spikes, slow interaction, etc.)

---

## 15. Content Freshness Signals

Signals that the site is maintained:

- Visible "Last updated" on page
- Periodic FAQ refreshes
- Internal linking to newly added calculators
- Sitemap `<lastmod>` accuracy

---

## 16. Programmatic SEO Guardrails

Because you generate many calculators, similarity becomes a scaling risk.

**Must-have:**

- No near-duplicate explanation text
- Parameterized templates with variation blocks
- Unique intro paragraph per calculator
- FAQ uniqueness score checks in audits

---

## 17. AdSense Safety Rules

**Must-have:**

- No ads above calculator H1 on mobile
- Reserved ad slot sizes (avoid CLS)
- Lazy-load below fold
- Ad density limits

---

## 18. Stage-Gate Growth Signals

Before pushing toward 1M/month, verify gates.

**Technical gate:**

- High cache hit ratio
- Stable Core Web Vitals across top pages
- No index coverage anomalies

**SEO gate:**

- Category clusters ranking (not only single pages)
- Long-tail impressions rising in Search Console
- FAQ rich results appearing

**Product gate:**

- Strong repeat usage on key calculators
- Low pogo-sticking from SERP

---

## 19. Schema + Rich Text Model

### What "Schema" Is (for This Project)

Schema is the JSON-LD you inject, such as:

- `FAQPage`
- `WebPage`
- `SoftwareApplication`
- `BreadcrumbList`

Schema tells Google:

- What the page is
- What the calculator does
- What the FAQs are
- How the page fits the site

**Schema does not replace content.**

### What "Rich Text" Is

Rich text is the visible explanation pane:

- Summary
- Scenario table
- How the formula works
- Visible FAQ boxes
- H2/H3 headings, tables, lists

This is what users read.

### Critical Rule

Every FAQ in schema must exist visibly on the page (and should match meaning closely). Otherwise you risk:

- FAQ rich result loss
- Structured data warnings
- Eligibility issues at scale

---

## 20. Structured Data Components

**Core components:**

1. `@context` (usually `schema.org`)
2. `@type` (most important field)
3. Properties (type-specific fields)
4. Nested objects (`FAQPage` → `Question` → `Answer`)
5. Arrays (lists of FAQs, breadcrumbs)
6. IDs and URLs (`url`, `@id`, breadcrumb position)
7. Recommended fields: `name`, `description`, `url`, `applicationCategory`, `operatingSystem`, `inLanguage`

**Standard bundle per calculator:**

- `WebPage`
- `SoftwareApplication`
- `FAQPage` (only if FAQs are visible)
- `BreadcrumbList`

---

## 21. Schema Quality Gates

Beyond "having schema," enforce:

1. Schema and visible content in sync
2. Page-scoped injection only (no global FAQ injection)
3. Correct bundle types only
4. Stable canonical + stable `@id` pattern
5. Automated validation per page:
   - Valid JSON
   - Rich results eligibility check
   - Duplicate FAQ detection
   - Schema present in initial HTML

**Rule:** do not add schema types you cannot support in visible content.

**Avoid:**

- `HowTo` (unless true step-by-step visible)
- `Review` / `AggregateRating` (unless real ratings UI and data visible)
- `Product` (unless you are selling a product)

**Safe set for CalcHowMuch:**

- `WebPage`
- `SoftwareApplication`
- `FAQPage` (when visible)
- `BreadcrumbList`

---

## 22. Readiness Reality Check

A realistic breakdown (based on system thinking and guardrails):

| Area                 | Readiness   |
|----------------------|-------------|
| Technical foundation | ~90%        |
| SEO mechanics        | ~85–90%     |
| Scale readiness      | ~80–85%     |
| **Overall**          | **~85–90%** |

The last 10–15% is usually won/lost by:

- Intent precision per page
- Uniqueness at scale
- Internal linking density
- Real-user performance stability (especially mobile + ads)
- Consistency discipline

---

## 23. Top 10 High-ROI Actions for 100k/Month

Ordered by impact vs effort:

1. Intent-perfect titles and H1s
2. First-paragraph "instant answer"
3. Related calculators block (4–6 tight links)
4. Unique intro + FAQ variation system
5. Mobile CLS hardening (especially ads)
6. Category hub strengthening (intro + structured internal links)
7. RUM dashboard + regression alerts
8. Weekly Search Console query mining loop
9. Sitemap + index hygiene automation
10. Visible "Last updated" freshness signal + aligned sitemap `<lastmod>`
