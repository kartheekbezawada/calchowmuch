# SEO Fix Metrics Tracking

Created: 2026-08-15
Owner: HUMAN (kartheekbezawada)
Companion to: `SEO_RANKING_RECOVERY_PLAN_LOANS_CREDITCARDS_20260814.md` (the "what and why" doc —
this one is the "did it actually work" doc).

## Purpose

Every fix in this session is a hypothesis, not a guarantee. This document exists so that in 45
days we have a real answer — backed by numbers, not memory — to "which of these fixes actually
moved the needle, and which didn't." Every page touched gets a baseline (captured before/at the
time of the fix) and three follow-up checks at fixed intervals.

## How to update this document

1. Pull a fresh Google Search Console export (Performance → Search results → last 28 days,
   same CSV export format used throughout this project) on or after each target check-in date.
2. Find each page in `Pages.csv` (or the page-filtered query view for exact-page detail) and fill
   in its row for that checkpoint: impressions / clicks / average position.
3. Fill in the **Verdict** column using the rule of thumb below once a checkpoint's data is in.
4. If a page fix depended on Google actually finding new content (schema, FAQ answers), also
   spot-check the **Search Appearance** export for rich-result appearance (FAQ rich results etc.)
   where relevant — noted per-fix below.

### Verdict rule of thumb (directional, not statistical proof)

- **Improved**: clicks went from 0 to 1+ at a similar or better position, OR position improved by
  10+ points with impressions holding or growing.
- **Flat**: position and clicks essentially unchanged (within normal day-to-day noise — see the
  bonus-calculator and mortgage-calculator findings in the plan doc for how volatile day-to-day
  position can be even with no changes at all).
- **Worse**: position got meaningfully worse or impressions collapsed.
- **Inconclusive**: too few impressions to say anything (some of these pages get single-digit
  impressions/month — don't over-read noise on low-volume pages).

Google typically needs 2-3+ weeks to recrawl and re-rank after a change, which is why the first
checkpoint is +15 days, not sooner — checking earlier than that is checking noise.

## Baseline data source

All "Baseline" figures below are from the Google Search Console export
`calchowmuch.com-Performance-on-Search-2026-08-14` (28-day window, reporting through
2026-08-13), read directly from `Pages.csv`, cross-checked against page-specific data shared
during this session where noted. Fixes in this session shipped 2026-08-14 to 2026-08-15.

**Target check-in dates for all fixes in this batch:** +15d = **2026-08-30**, +30d = **2026-09-14**,
+45d = **2026-09-29**.

---

## Master tracker

| Page | Fix(es) applied | Plan ID | Shipped | Baseline (2026-08-13 window): Impr / Clicks / Pos | +15d (2026-08-30): Impr / Clicks / Pos | +30d (2026-09-14): Impr / Clicks / Pos | +45d (2026-09-29): Impr / Clicks / Pos | Verdict |
|---|---|---|---|---|---|---|---|---|
| loan-calculators/ltv-calculator | Related Calculators component + 3 FAQ entries (work-out-LTV, remortgage-LTV, 80%-LTV) | H2-H5, T1-2/3/4 | 08-14, 08-15 | 2,363 / 0 / 81.16 | _pending_ | _pending_ | _pending_ | _pending_ |
| loan-calculators/how-much-can-i-borrow | Related Calculators component + 2 FAQ entries (borrowing power/capacity) | H2, T1-1 | 08-14, 08-15 | 968 / 0 / 77.2 | _pending_ | _pending_ | _pending_ | _pending_ |
| loan-calculators/mortgage-calculator (home-loan) | Related Calculators component | — | 08-14 | 405 / 0 / 5.03 | _pending_ | _pending_ | _pending_ | _pending_ |
| loan-calculators/buy-to-let-mortgage-calculator | Related Calculators component + currency formatting bug fix (£ now shows) | — | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| loan-calculators/personal-loan-calculator | Related Calculators component | — | 08-14 | 191 / 0 / 74.96 | _pending_ | _pending_ | _pending_ | _pending_ |
| loan-calculators/interest-rate-change-calculator | Related Calculators component | — | 08-14 | 80 / 0 / 61.52 | _pending_ | _pending_ | _pending_ | _pending_ |
| loan-calculators/remortgage-calculator | Related Calculators component | — | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| loan-calculators/offset-mortgage-calculator | Related Calculators component | — | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| credit-card-calculators/credit-card-minimum-payment-calculator | Server-rendered FAQ schema + Capital One/Chase FAQ + "work out" phrasing | — , T1(pre-plan) | 08-14 | 2,454 / 0 / 61.48 | _pending_ | _pending_ | _pending_ | _pending_ |
| credit-card-calculators/balance-transfer-credit-card-calculator | Server-rendered FAQ schema | — | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| credit-card-calculators/credit-card-payment-calculator | Server-rendered FAQ schema | — | 08-14 | 266 / 0 / 50.12 | _pending_ | _pending_ | _pending_ | _pending_ |
| credit-card-calculators/credit-card-consolidation-calculator | Server-rendered FAQ schema | — | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| credit-card-calculators/debt-payoff-calculator | Server-rendered FAQ schema | — | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| car-loan-calculators/hire-purchase-calculator | Server-rendered FAQ schema + "hire purchase loan" FAQ entry | A1, T1-5 | 08-14, 08-15 | 619 / 0 / 55.04 | _pending_ | _pending_ | _pending_ | _pending_ |
| car-loan-calculators/pcp-calculator | Server-rendered FAQ schema + GFV/balloon FAQ entry | A1, T1-6 | 08-14, 08-15 | 266 / 0 / 54.86 | _pending_ | _pending_ | _pending_ | _pending_ |
| car-loan-calculators/car-loan-calculator | Server-rendered FAQ schema | A1 | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| car-loan-calculators/auto-loan-calculator | Server-rendered FAQ schema | A1 | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| car-loan-calculators/car-lease-calculator | Server-rendered FAQ schema | A1 | 08-14 | not in top-pages export (baseline needed) | _pending_ | _pending_ | _pending_ | _pending_ |
| salary-calculators/bonus-calculator | Title/H1/description rewrite ("(Gross Pay)" disambiguation, matching proven sibling pattern) | — | 08-15 | 88 / 0 / 6.8 (28-day, user-confirmed exact match with daily-breakdown recompute) | _pending_ | _pending_ | _pending_ | _pending_ |
| salary-calculators/salary-calculator | Received 1 new inbound link (from credit-card-minimum-payment page) — control/secondary, not expected to move much since it already ranks well | — | 08-15 | 3,667 / 3 / 11.46 | _pending_ | _pending_ | _pending_ | _pending_ |
| Sitewide | Sitemap `lastmod` frozen date fixed to real build date | — | 08-14 | Site-wide 28-day: 17,566 impr / 9 clicks / 0.051% CTR | _pending_ | _pending_ | _pending_ | _pending_ |

## Notes on baseline gaps

7 pages show "not in top-pages export (baseline needed)" — they didn't have enough impressions
in the 28-day window to appear in the `Pages.csv` top-pages list I read this session (which isn't
necessarily exhaustive down to zero). Before the +15d check-in, either pull a fresh export and
manually search for these exact URLs, or use Search Console's page-filter UI directly. Treat
their baseline as "low-to-negligible impressions" until confirmed with real numbers — it's
still useful context (e.g. if one of these jumps from ~0 to real traffic, that's a strong signal
on its own even without a precise starting number).

## What "success" looks like for this batch, realistically

Per the diagnosis in the plan document: these are position-50-96 pages being nudged with
technical/content fixes, not backlink or authority changes. A realistic, non-hand-wavy bar for
"this batch worked":

- Any of the LTV/how-much-can-i-borrow/hire-purchase/pcp pages moving from position 50-90 into
  the 30-50 range would be a meaningful, attributable win given the specific query-phrasing gaps
  targeted.
- bonus-calculator converting from 0 clicks to any clicks at its existing good position is the
  cleanest possible signal in this whole batch, since position isn't the variable being changed.
- Full page-1 rankings (position <10) for the loans/credit-card pages are not a realistic outcome
  from this batch alone — that needs the Tier 2/3 content-depth and backlink work the plan
  document already flags as out of scope for tonight.
