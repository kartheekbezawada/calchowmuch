# CalcHowMuch — SEO Audit & Fix Requirements
**For: Claude Code (repo-level analysis and implementation)**
**Source data: Google Search Console, last 3 months (2026-05-07 to 2026-08-06)**
**Prepared: 2026-08-08**

---

## 0. How to use this document

This is a requirements brief, not a spec — hand this whole file to Claude Code and ask it to:
1. Read it in full
2. Locate the relevant pages/templates/components in the repo
3. Produce a written audit against each requirement below (what currently exists vs. what's missing)
4. Propose and implement fixes, prioritized as ordered in Section 3

Suggested first prompt to Claude Code:

> "Read CalcHowMuch_SEO_Requirements_for_Claude_Code.md in full. Audit the repo against every requirement in Section 2 and 3. For each page listed in Section 3, tell me what currently exists (title tag, meta description, H1/H2 structure, word count, FAQ presence, schema markup, internal links in/out) before changing anything. Output the audit as a table. Do not make edits yet — wait for me to review the audit first."**

---

## 1. Data summary (why this document exists)

Site-wide, last 3 months: **16 clicks / 37,831 impressions / 0.04% CTR / avg position ~60.**

Trend is genuinely positive — average position improved from ~72 (May) to ~37 (early Aug) — but the traffic is heavily concentrated in one lucky, low-competition topic cluster, while several high-impression finance-calculator pages are stuck on page 6–9 of Google and get essentially zero clicks. This document exists to close that gap.

Two clusters behave completely differently and the repo work should treat them differently:

- **"Day of the week born" cluster** (page: `/time-and-date/birthday-day-of-week/`): low competition, already ranking pos 10–28 on 15+ query variants, 138 impressions on the best single query. This is a **polish** job — get it from position ~17 into single digits.
- **Contested finance-calculator clusters** (credit card minimum payment, LTV, hire purchase, balance transfer, commission): high competition from banks/comparison sites, stuck at position 55–95 despite thousands of impressions. This is a **content depth + internal linking + schema** job, not a quick tweak.

---

## 2. Repo-wide technical SEO checklist

Ask Claude Code to check these across the whole site first, since they affect every page:

- [ ] Are `<title>` tags unique per calculator page, and do they contain the primary query phrase in the way users actually type it (see Section 3 query lists — not just the "official" term)?
- [ ] Are meta descriptions present, unique, and under ~155 characters, written to earn a click (not just describe the tool)?
- [ ] Is there one `<h1>` per page matching the primary intent, and a logical H2/H3 hierarchy under it?
- [ ] Is structured data (schema.org) implemented anywhere? Check for `FAQPage`, `HowTo`, `WebApplication`/`SoftwareApplication`, or `BreadcrumbList` schema on calculator pages — none may currently exist.
- [ ] Is there an XML sitemap, and does it include all calculator pages listed in Section 3?
- [ ] Check `robots.txt` for accidental disallow rules on any calculator directories.
- [ ] Check canonical tags — confirm no duplicate-content issues between e.g. `/loan-calculators/` (index) and individual calculator pages.
- [ ] Check internal linking: do high-authority pages (e.g. `/time-and-date/birthday-day-of-week/`, `/salary-calculators/salary-calculator/`, which already rank well) link to the stuck finance pages anywhere? If not, that's a fixable gap — internal links pass authority.
- [ ] Check page load / Core Web Vitals for the stuck pages vs. the ranking pages — rule out a technical performance gap as a contributing factor.
- [ ] Confirm each calculator page currently has body content beyond the calculator widget itself (word count check) — thin content is the likely primary cause of the stuck cluster's poor rankings.
- [ ] Check for a suspicious tracking/session ID string that appeared in the 24-hour query report: `personal loan calculator with extra payments*3ff8f546-4dab-4fbb-a76a-64d1fb80d360` — confirm this isn't a URL parameter or query string leaking into page titles/content in a way that could cause indexation issues.

---

## 3. Page-by-page requirements, ordered by opportunity size (impressions × how fixable)

For each page below: current state (position, impressions/quarter), the actual query phrases Google already associates with it, and what content the page needs to add. Word the on-page copy around the query phrases as written by users, since Google is already surfacing the page for these — it just isn't earning trust/relevance yet.

### 3.1 `/credit-card-calculators/credit-card-minimum-payment-calculator/` — HIGHEST PRIORITY
- Current: 7,974 impressions/quarter, **0 clicks**, avg position 76
- 226 distinct query variants map to this page/topic, totaling 7,393 impressions, weighted avg position 76.5
- Top queries to write content around:
  - "credit card minimum payment calculator" (969 impr, pos 57.5 — closest to breaking through)
  - "credit card payment calculator" (886 impr, pos 82.7)
  - "minimum payment calculator" (310 impr, pos 56.3)
  - "how to calculate credit card payment" (177 impr, pos 79.8)
  - "how to determine minimum credit card payment" (174 impr, pos 81.9)
  - "how to work out minimum payment on credit card" (164 impr, pos 82.6)
  - "how much is the minimum payment on a credit card" (151 impr, pos 88.5)
  - "how to figure minimum payment on credit card" (149 impr, pos 81.2)
- **Requirement:** add a clear "how minimum payment is calculated" explainer section (the formula, a worked numeric example), plus an FAQ block directly answering the "how to work out / how to determine / how much is" phrasings above as literal Q&A pairs. Add `FAQPage` schema.

### 3.2 `/loan-calculators/ltv-calculator/`
- Current: 4,852 impressions/quarter, 0 clicks, avg position 85.3
- 69 query variants, 4,557 impressions, weighted avg position 85.9 — the worst-performing high-volume cluster on the site
- Top queries:
  - "ltv calculator" (801 impr, pos 87.1)
  - "loan to value calculator" (485 impr, pos 88.0)
  - "ltv calculator remortgage" (270 impr, pos 79.3)
  - "remortgage loan to value calculator" (261 impr, pos 76.1)
  - "calculate ltv remortgage" (243 impr, pos 81.0)
  - "loan to value calculator remortgage" (192 impr, pos 77.7)
  - "what is my ltv remortgage" (143 impr, pos 88.6)
- **Requirement:** the remortgage-specific queries are ~40% of this cluster's volume — consider whether a dedicated "remortgage LTV" section or subheading is warranted, not just a generic LTV explainer. Add a "what is a good LTV for remortgaging" FAQ entry specifically, since that intent is distinct from a first-time-buyer LTV calculation.

### 3.3 `/car-loan-calculators/hire-purchase-calculator/` (+ related `pcp-calculator/`)
- Current: 3,044 impressions/quarter, 0 clicks, avg position 71.1
- 43 query variants, 3,168 impressions, weighted avg position 72.5
- Top queries:
  - "hire purchase calculator" (657 impr, pos 74.3)
  - "car hire purchase calculator" (363 impr, pos 82.8)
  - "hire purchase loan calculator" (319 impr, pos 67.6)
  - "hire purchase calc" (307 impr, pos 71.3)
  - "hire purchase with balloon calculator" (198 impr, pos 68.4)
  - "pcp cal" (197 impr, pos 76.0) — note: this query likely intends the separate PCP calculator page; confirm internal linking between HP and PCP calculators is clear both directions
  - "hp with balloon calculator" (183 impr, pos 63.1)
  - "hire purchase interest calculator" (167 impr, pos 66.4)
- **Requirement:** "balloon payment" terminology appears in two of the top 8 queries — confirm the page explains balloon payments explicitly, not just as a calculator input field. "Car hire purchase" (363 impr) suggests users conflate this with an auto-loan-specific tool — consider whether the page title/H1 should mention "car" explicitly.

### 3.4 `/credit-card-calculators/balance-transfer-credit-card-calculator/`
- Current: 1,098 impressions/quarter, 0 clicks, avg position 80.7
- 21 query variants, 1,012 impressions, weighted avg position 80.8
- Top queries: "balance transfer calculator" (413 impr, pos 78.5), "credit card balance transfer calculator" (148 impr, pos 86.3), "balance transfer fee calculator" (112 impr, pos 77.6), "calculate balance transfer fee" (86 impr, pos 81.0), "balance transfer savings calculator" (23 impr, pos 74.1)
- **Requirement:** "fee" and "savings" are distinct sub-intents here (cost of transferring vs. money saved by transferring) — the page should clearly address both, ideally as separate labeled sections or FAQ entries.

### 3.5 `/salary-calculators/commission-calculator/`
- Current: 1,542 impressions/quarter, 1 click, avg position 52.3 (already converting — worth pushing further)
- 37 query variants, 861 impressions, weighted avg position 68.7
- Top queries: "commission calculation" (225 impr, pos 69.4), "commission calculator" (143 impr, pos 65.6), "base salary plus commission formula" (81 impr, pos 80.3), "salary plus commission calculator" (37 impr, pos 30.7 — notably better than the rest of this cluster)
- **Requirement:** "salary plus commission calculator" already sits at position 30.7, far better than sibling queries — check whether the page currently supports a combined base+commission calculation, since that's the phrasing already earning better rankings. If it doesn't, this is a feature gap, not just a content gap.

### 3.6 `/time-and-date/time-between-two-dates-calculator/`
- Current: 1,206 impressions/quarter, 0 clicks, avg position 54.0
- 43 query variants, 674 impressions, weighted avg position 61.7
- Top queries: "time between dates" (220 impr, pos 59.6), "time between two dates" (143 impr, pos 62.6), "time between 2 dates" (33 impr, pos 60.4)
- **Requirement:** lowest-competition of the underperforming cluster (position already in the 55-65 range vs. 70-90 for the finance pages) — likely the fastest of the "stuck" pages to fix. Check title tag matches "time between dates" phrasing exactly, not just "time between two dates calculator."

---

## 4. Pages already working — protect and extend, don't rebuild

- `/time-and-date/birthday-day-of-week/` — 5 clicks, 3,028 impr, pos 19.6. Best performer. "What day of the week was I born" (138 impr, pos 17.0) is close to page 1. Check title tag/meta description are optimized to convert impressions to clicks at this position (CTR is only 0.17%, low for position ~20) — this is a copywriting/snippet problem, not a ranking problem.
- `/time-and-date/nap-time-calculator/` — 4 clicks, 1,026 impr, pos 15.5, best CTR on site (0.39%). Use this page's title/meta pattern as the internal benchmark for what's working.
- `/salary-calculators/salary-calculator/` — 2 clicks, 3,234 impr, pos 15.4.
- `/loan-calculators/mortgage-calculator/` — pos 5.5 (best position on the whole site) but only 607 impressions/quarter, low search volume relative to its ranking strength. Not a repo problem — flag as a possible keyword-targeting/content-expansion opportunity separately (e.g., does the page cover enough related mortgage query variants to capture more volume at this strong position?).

---

## 5. Suggested Claude Code workflow

1. **Audit pass** (no edits): produce the requested table from Section 0 for the six pages in Section 3, plus the technical checklist in Section 2.
2. **Content pass**: for pages in Section 3, draft the explainer sections, worked examples, and FAQ blocks using the exact query phrasing given above as the FAQ questions.
3. **Schema pass**: implement `FAQPage` schema on any page that now has an FAQ block; confirm `WebApplication` or `SoftwareApplication` schema exists on all calculator pages.
4. **Internal linking pass**: add contextual links from the strong pages (Section 4) to the stuck pages (Section 3) where topically relevant (e.g., salary calculator → commission calculator; mortgage calculator → LTV calculator).
5. **Verification**: re-check title tags and meta descriptions repo-wide against the checklist in Section 2 before considering this complete.

Do not touch the calculator logic/functionality itself as part of this work unless Section 3.5 (commission calculator combined base+commission support) reveals an actual feature gap — this is primarily a content, metadata, schema, and internal-linking exercise.