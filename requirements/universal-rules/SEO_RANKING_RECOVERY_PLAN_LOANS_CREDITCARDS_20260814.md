# SEO Ranking Recovery Plan — Loans & Credit Cards Clusters

Created: 2026-08-14
Owner: HUMAN (kartheekbezawada)
Status: Tier 0 and Tier 1 complete. Tier 2+ awaiting direction.
Data basis: Google Search Console exports `calchowmuch.com-Performance-on-Search-2026-08-14` (28-day window, 15 Jul – 11 Aug 2026 reporting period), `requirements/universal-rules/seo_exports/internal-link-audit.md` (regenerated 2026-08-14), direct codebase inspection.

## Objective

Site-wide: 17,566 impressions / 9 clicks / 0.051% CTR over 28 days, and climbing in impressions
without clicks following. The diagnosis established across this whole engagement (original GSC
report + two cluster-level SEO agent audits below) is consistent: **this is a ranking/trust
problem, not a demand problem.** Wherever the site actually reaches position 10–15, it earns
normal CTR (9-36%); everywhere it sits at position 50-96, it earns zero clicks regardless of
impression volume.

This plan targets the two clusters carrying the largest untapped demand: **Loans (home-loan +
auto-loan)** and **Credit Cards**. Constraints, matching this repo's existing SEO wave
convention (`NON_MATH_SEO_WAVE_PLAN.md`):

- No backlinks / off-page strategies — outside scope, flagged separately.
- No content padding for word-count's sake — every addition ties to a specific, cited query gap.
- Every recommendation is specific, sourced to a query or a code location, and independently
  verifiable — not generic "improve SEO" advice.
- Content/copy changes are marked for human review before shipping; mechanical/technical fixes
  are implemented directly and verified with the existing test suite.

## How this plan was built

1. Read the full 28-day GSC export (Chart/Countries/Devices/Pages/Queries/Filters/Search
   appearance CSVs — 1,006 query rows, the export's row cap).
2. Re-ran `scripts/audit-internal-links.mjs` (found and worked around a broken Windows
   entry-point guard — see Technical Debt Found, item T4) for a fresh internal-link snapshot.
3. Verified crawl-control status directly against `public/_headers` and `public/robots.txt`
   rather than trusting the stale April audit in `seo_exports/audit-summary.md`.
4. Dispatched two parallel research passes (read-only, no edits) against the two highest-volume,
   worst-ranked clusters: home-loan (LTV/borrowing) and auto-loan (hire-purchase/PCP), each
   briefed with the exact query-level data for that cluster and instructed to read actual page
   content, not guess.
5. Cross-referenced findings against work already completed earlier the same day (sitemap,
   home-loan internal linking, credit-card FAQ schema, buy-to-let currency, minimum-payment FAQ
   content) to avoid duplicating or contradicting it.

---

# SECTION 1 — DIAGNOSIS

## 1.1 Site-wide pattern (confirmed, unchanged from original report)

| Metric | Value |
|---|---|
| 28-day clicks / impressions / CTR | 9 / 17,566 / 0.051% |
| Impressions trend | 7,337 (days 1-14) → 10,229 (days 15-28), +39%, clicks flat |
| Desktop vs Mobile position | 49.02 vs 19.48 (desktop consistently worse) |
| US vs UK position | 30.53 vs 69.09 (UK consistently worse) |
| Best-ranking pages | salary-calculator (11.46), birthday-day-of-week (12.46), nap-time (9.92) — all convert normally |
| Worst-ranking pages | ltv-calculator (81.16), how-much-can-i-borrow (77.2), credit-card-minimum-payment (61.48) |

## 1.2 Cluster-level findings

### Home-loan cluster (8 pages: mortgage-calculator, how-much-can-i-borrow, remortgage-calculator,
buy-to-let-mortgage-calculator, offset-mortgage-calculator, interest-rate-change-calculator,
ltv-calculator, personal-loan-calculator)

Combined query demand for LTV/borrowing-power terms across ~35 near-duplicate phrasings: **2,000+
impressions/28 days, positions 68-96, zero clicks.** Full findings in Section 2.

Diagnosis (from cluster research pass): title/H1 targeting for the two flagship pages is
already reasonably aligned with head terms — that's *not* the primary blocker. The real gaps are
(a) a currency-display bug identical to one already fixed tonight, live on 6 of 8 pages, (b) a
genuine content-completeness gap on the specific colloquial/threshold phrasings searchers use
("work out ltv," "80 ltv," "remortgage ltv," "borrowing power") that the page's more formal
language doesn't naturally cover even though the underlying facts already exist on the page, and
(c) weaker structural/trust signals (template uniformity, no sourcing, unclear UK targeting) that
plausibly cap how far on-page fixes alone can move rank.

### Auto-loan cluster (5 pages: car-loan-calculator, auto-loan-calculator, hire-purchase-calculator,
pcp-calculator, car-lease-calculator)

Combined query demand for hire-purchase/PCP terms: **500+ impressions/28 days, positions 45-83,
zero clicks.** This cluster went through a prior SEO wave (`NON_MATH_SEO_WAVE_PLAN.md`,
"Car Loans" — marked complete) that fixed titles/meta/H1/basic schema, and rankings did not move.

Diagnosis (from cluster research pass): the prior wave's schema work was surface-level, not
structural — this cluster was never wired into the same rich FAQPage/entity-graph schema
pipeline that Credit Cards, Finance, Home Loan, Salary, and Math clusters already use, despite
the FAQ markup already being in the exact format the existing extractor expects (zero content
rewrite needed to fix this specifically). Beyond that: the content is templated and
calculator-usage-focused rather than answering the buyer's actual decision-stage questions (HP
vs. PCP vs. loan, APR vs. flat rate, what GFV/balloon actually costs), which is a genuine content
gap metadata polish can't fix — consistent with why the prior wave didn't move rankings.

## 1.3 Technical SEO status (verified, not carried over from stale audits)

| Item | Status | Evidence |
|---|---|---|
| `/calculators/*` shadow-route crawl leakage | **Resolved** — do not re-flag | `public/_headers:31-33` sets blanket `X-Robots-Tag: noindex, nofollow, noarchive` on `/calculators/*`. The April `audit-summary.md` flagging this as a live risk is stale. |
| Internal-link audit tooling | **Stale/broken** — see Technical Debt T4 | Cluster-registry config doesn't classify the home-loan cluster or 4 of 5 credit-card pages, causing false "orphan" reports. |
| Sitemap freshness | **Fixed tonight** | `lastmod` was frozen at a single hardcoded date; now stamps actual build date. |

---

# SECTION 2 — FINDINGS BY CLUSTER (source detail)

## 2.1 Home-loan cluster

| # | Finding | Type | Pages affected | Query evidence |
|---|---|---|---|---|
| H1 | ~~Currency-formatting bug~~ — **re-classified after verification, see Section 4 Tier 0 note**: 3 of 6 pages have tests explicitly requiring no currency symbol; the other 3 have no smoking-gun evidence of broken intent like buy-to-let did. Likely deliberate convention, not a bug. Moved to Tier 2 (T2-5). | Reclassified: Product decision | mortgage-calculator, how-much-can-i-borrow, remortgage-calculator, offset-mortgage-calculator, interest-rate-change-calculator, ltv-calculator (6 of 8 pages) | N/A — trust/UX issue, not a ranking query itself |
| H2 | No FAQ/content addressing "borrowing power" / "borrowing capacity" terminology | Content | how-much-can-i-borrow | borrowing capacity calculator (104) + borrowing power calculator (89) + home loan borrowing power (79) + borrowing power (53) + mortgage borrowing capacity (8) = 333 impressions |
| H3 | No FAQ phrased as "how do you work out LTV" / "how to determine LTV" despite formula already existing on-page | Content (mechanical — restating existing facts) | ltv-calculator | how do you work out ltv (60, pos 93.1) + how to work out ltv (59, pos 91.2) + how do i work out ltv (54, pos 92.3) + how to determine ltv (49, pos 96.4) = 222 impressions, worst positions in dataset |
| H4 | No dedicated remortgage-LTV section/worked example | Content | ltv-calculator | remortgage loan to value calculator (75, pos **68.2** — best-positioned query in report) + calculate ltv remortgage (31) + what is my ltv remortgage (30) + how to work out ltv when remortgaging (30) |
| H5 | No direct "what is 80% LTV" / threshold-specific answer | Content (mechanical — band data already exists) | ltv-calculator | what is 80 ltv (34, pos 96.2 — worst single query in dataset) |
| H6 | `mortgage-calculator` anomaly: position 5.03, 405 impressions, **0 clicks** | Investigate first | mortgage-calculator | Page is technically clean (canonical, indexable, FAQ schema present) — statistically implausible as random variance at true position 5. Needs the exact query-level breakdown for this URL (Search Console page-filtered query report) before any copy change; leading hypotheses are SERP/brand-trust crowding on a broad generic query, not a title defect. |
| H7 | Deposit Targets table (LTV) and Rate Scenarios table (borrow) are empty in server-rendered HTML, populated only by client JS | Technical | ltv-calculator, how-much-can-i-borrow | Indirect — this is the most numerically specific content on each page and isn't statically crawlable |
| H8 | Template uniformity / no author, sourcing, or regulatory framing across all 8 pages | Structural, needs product decision | all 8 | Plausible rank-ceiling explanation, not query-specific |
| H9 | No explicit UK signal on LTV page (no "UK" string, `lang="en"` not `en-GB`) despite 100% UK terminology | Content, light | ltv-calculator | loan to value ratio calculator uk (61) |
| H10 | Unsourced claim: "Many first-time buyers aim for 90-95% LTV" | Fact-check flag | ltv-calculator | N/A |
| H11 | Meta descriptions run 131-137 chars, ~20-25 chars under Google's display budget | Minor | ltv-calculator, how-much-can-i-borrow, mortgage-calculator | N/A |

## 2.2 Auto-loan cluster

| # | Finding | Type | Pages affected | Query evidence |
|---|---|---|---|---|
| A1 | FAQPage schema entirely absent — cluster was never wired into the rich schema pipeline that 74 other pages sitewide already use; FAQ markup already matches the existing extractor's expected format exactly | Mechanical, zero content rewrite | all 5 | Structural — affects rich-result eligibility for the whole cluster |
| A2 | Top query phrase "hire purchase loan" (109 impr, #1 query) never appears verbatim anywhere on the page | Content | hire-purchase-calculator | hire purchase loan calculator (109) + loan calculator hire purchase (54) |
| A3 | PCP page never bridges "GFV" to "balloon payment" (common UK usage) | Content | pcp-calculator | balloon-payment-adjacent query volume across cluster |
| A4 | No HP vs. PCP vs. personal-loan comparison; no APR-vs-flat-rate explanation anywhere in cluster | Content, biggest depth gap | all 5 | Decision-stage intent implied by query mix |
| A5 | FAQs are calculator-mechanics-focused ("does it recalculate automatically"), not product-focused ("is hire purchase better than PCP") | Content | hire-purchase-calculator, pcp-calculator | Ties directly to A1 — schema fix alone won't win rich results without answering the actual questions |
| A6 | Word count thin (955-1,066 words) vs. likely competitor depth for contested UK finance terms | Content | all 5 | General |
| A7 | ~~No currency symbol anywhere~~ — **re-classified**: no test either way, but also no evidence of broken intent (see H1 re-classification). Moved to Tier 2 (T2-5) alongside the home-loan pages rather than assumed a bug. | Reclassified: Product decision | all 5 | UK-specific terms with zero £ signal |
| A8 | `Offer.priceCurrency` hardcoded `USD` | Mechanical, minor, low priority (inert — price is always "0") | all 5 | Bundle with T2-5 if that decision goes ahead |
| A9 | No author/reviewer byline, last-updated date, or regulatory (FCA/Consumer Credit Act) framing | Structural, needs product decision | all 5 | E-E-A-T pattern gap |
| A10 | No `/car-loan-calculators/` hub page; homepage links to none of the 5 pages | Mechanical, lower priority | all 5 | Site-wide pattern (most clusters lack hubs), not a regression |
| A11 | Internal cross-linking within the cluster — **confirmed already solid**, no action needed | N/A (positive finding) | all 5 | Fully meshed related-calculator links already present |

---

# SECTION 3 — ALREADY SHIPPED (same day, prior to this document)

| Fix | Scope | Commit | Verified |
|---|---|---|---|
| Sitemap `lastmod` frozen date → real build date | Sitewide | `2a04c2d5` | Sitemap test suite |
| Home-loan cluster missing "Related Calculators" component | 8 pages | `0b51f2f0` | 95/95 loans test suite + visual |
| Credit-card cluster server-rendered FAQPage/SoftwareApplication schema | 5 pages | `030e5450` | 27/28 credit-cards suite (1 unrelated pre-existing failure) |
| Buy-to-let currency formatting bug (`formatNumber`→`formatCurrency`) | 1 page | `d2c2a978` | Visual + 10/10 buy-to-let suite |
| Auto-loan cluster wired into server-rendered FAQPage schema (T0-3) | 5 pages | `a90095ee` | 18/18 auto-loans suite |
| Tier 1: 6 FAQ additions closing specific query gaps (LTV x3, how-much-can-i-borrow x2, hire-purchase, pcp-calculator) | 4 pages | `78c22835` | 28/28 across all 4 pages' full suites, visual |
| Credit-card-minimum-payment: Capital One/Chase FAQ gap + "work out" phrasing + salary-calculator internal link | 2 pages | `7620b946` | Visual + full suite |

These are not re-listed in the checklist below.

---

# SECTION 4 — PRIORITIZED CHECKLIST

Tiers reflect risk and certainty, matching how tonight's work was actually executed and verified
— not just impact size.

## Tier 0 — Mechanical, zero content-authorship risk, ship immediately

Same fix pattern already proven twice tonight (buy-to-let currency, credit-card FAQ schema).
No new copy is authored; either propagating a formatting fix or wiring existing FAQ content into
the schema pipeline that already exists for other clusters.

| ID | Task | Pages | Status |
|---|---|---|---|
| ~~T0-1~~ | ~~Fix currency formatting on remaining home-loan pages~~ | ~~6 pages~~ | **WITHDRAWN — see below** |
| ~~T0-2~~ | ~~Fix currency formatting on auto-loan cluster~~ | ~~5 pages~~ | **WITHDRAWN — see below** |
| T0-3 | Wire auto-loan cluster into the rich schema pipeline (added `AUTO_LOAN_SCHEMA_CONFIG`, reused existing `extractCalculatorFaqEntries`/`buildFinanceStructuredData`, mirroring the credit-card fix) | all 5 auto-loan pages | **done** (`a90095ee`) — 18/18 auto-loans suite passing |
| ~~T0-4~~ | ~~Fix hardcoded `Offer.priceCurrency: 'USD'` → `'GBP'` for auto-loan cluster~~ | ~~5 pages~~ | **WITHDRAWN — tied to T0-2** |

### Why T0-1/T0-2/T0-4 were withdrawn

Before executing, checked each candidate page's release test suite the same way every other
fix tonight was verified — and found the "currency bug" framing from the research pass doesn't
hold up:

- **3 of the 6 home-loan pages have an explicit, passing test *requiring the absence* of
  currency symbols**: `how-much-can-i-borrow` (`BOR-TEST-E2E-3: no currency symbols in results
  or displays`, plus a code comment `/* Format helpers (no currency symbols) */`),
  `offset-mortgage-calculator` (`OFFSET-HYBRID-8: output text excludes currency symbols`), and
  `remortgage-calculator` (`REMO-HYBRID-4: output text and table values contain no currency
  symbols`). This is a deliberate, tested design choice, not a bug.
- For the remaining 3 home-loan pages (LTV, mortgage-calculator, interest-rate-change) and all
  5 auto-loan pages, there's no test either way — but there's also no equivalent of the
  "smoking gun" that made the buy-to-let fix safe: a function literally named
  `formatLoanCurrency` that took a currency code and silently did nothing. These pages just use
  generically-named formatters (`fmtAmount`, `fmt`) with no evidence of broken intent.
  Applying the buy-to-let fix pattern here would have been generalizing from one confirmed bug
  to five-plus unconfirmed ones — the same mistake already made and caught once tonight (the
  countdown-timer/birthday-day-of-week structured-data revert).
- Reading LTV's own static worked-example content (`explanation.html`, read in full earlier)
  confirms its existing numbers are already presented without currency symbols — consistent
  with this being deliberate site convention for the ratio/affordability-focused calculators,
  not an oversight.

**Conclusion:** "no currency symbol" appears to be the deliberate convention for this whole
loans mega-category (ratio/comparison tools), with buy-to-let as a genuine, isolated bug because
it's a specific UK mortgage product with unambiguous intent evidence. Recommend leaving this
alone — it's now Tier 2 item T2-5 below, for a human decision, not a mechanical fix.

## Tier 1 — Content additions using searchers' literal phrasing (facts already exist on-page; drafting the Q&A wording is the only new authorship)

**Status: done (`78c22835`).** All 6 items shipped. Verified: 28/28 tests passing across all 4
pages' full release suites (loan-to-value, how-much-can-i-borrow, hire-purchase, pcp-calculator),
FAQ schema counts confirmed matching between static HTML and each page's test expectations
(LTV 10→13, how-much-can-i-borrow 10→12, hire-purchase 10→11, pcp-calculator 10→11), client-side
`CALCULATOR_FAQ_SCHEMA` in each affected `module.js` synced to match (the same runtime-overwrite
trap hit twice earlier tonight), and each new entry visually screenshotted.

| ID | Task | Page | Query evidence | Status |
|---|---|---|---|---|
| T1-1 | Add "What is borrowing power?" / "What is my borrowing capacity?" FAQ entries | how-much-can-i-borrow | 333 impressions (H2) | done |
| T1-2 | Add "How do you work out LTV?" FAQ entry (restate existing formula) | ltv-calculator | 222 impressions, positions 91-96 (H3) | done |
| T1-3 | Add remortgage-LTV worked example / FAQ entry | ltv-calculator | best-positioned query in dataset, 68.2 (H4) | done |
| T1-4 | Add "What is 80% LTV?" threshold FAQ entry | ltv-calculator | worst-positioned query in dataset, 96.2 (H5) | done |
| T1-5 | Add "hire purchase loan" phrase naturally into intro/FAQ | hire-purchase-calculator | 109+54 impressions, #1 query in cluster (A2) | done |
| T1-6 | Add "Is GFV the same as a balloon payment?" FAQ entry | pcp-calculator | A3 | done |

## Tier 2 — Bigger content decisions (needs your direction before drafting)

These aren't mechanical — they're either a comparison/guide content type the site doesn't have
yet, or touch claims that need a source.

| ID | Task | Page(s) | Notes |
|---|---|---|---|
| T2-1 | HP vs. PCP vs. personal-loan comparison content + APR-vs-flat-rate explainer | auto-loan cluster | Biggest content-depth gap found (A4); real editorial work, not a quick add |
| T2-2 | Rewrite car-loan FAQs from mechanics-focused to product-focused | hire-purchase-calculator, pcp-calculator | A5 — depends on T2-1 groundwork |
| T2-3 | Fact-check "90-95% LTV" first-time-buyer claim, cite or revise | ltv-calculator | H10 |
| T2-4 | Add explicit UK signal (copy + `lang="en-GB"` + `og:locale`) | ltv-calculator, possibly whole loans/credit-card clusters | H9 — ties to the earlier currency/locale decision (multi-market, scoped-technical-only was chosen previously; this would be an incremental step, not full hreflang infra) |
| T2-5 | Decide whether LTV/mortgage-calculator/interest-rate-change (home-loan) and all 5 auto-loan pages should display currency at all | 8 pages | Withdrawn from Tier 0 — see "Why T0-1/T0-2/T0-4 were withdrawn" above. Not a bug fix; a product decision on whether these ratio/comparison-focused calculators should stay currency-agnostic (current apparent convention) or switch to explicit £. |

## Tier 3 — Structural/E-E-A-T, needs a product decision, not a content edit

| ID | Task | Scope | Notes |
|---|---|---|---|
| T3-1 | Author/reviewer byline + last-updated date + regulatory framing (FCA/Consumer Credit Act references) | home-loan cluster (H8), auto-loan cluster (A9) | Real trust-signal gap on YMYL content; needs a decision on who the "author" is and what regulatory claims are accurate to make |
| T3-2 | Break template uniformity (identical title pattern, identical boilerplate notes) across loan clusters | 13 pages | Plausible rank-ceiling factor; large scope, needs design input |
| T3-3 | `/car-loan-calculators/` hub page + homepage links | auto-loan cluster | Lower priority; site-wide pattern, most clusters lack hubs |

## Tier 4 — Investigate before acting

| ID | Task | Notes |
|---|---|---|
| T4-1 | Pull page-filtered query breakdown for `/loan-calculators/mortgage-calculator/` from GSC directly (not available in the CSV export format used so far) | H6 — position 5, 405 impressions, 0 clicks. Do not touch this page's title/copy until we know what query is actually driving impressions. |
| T4-2 | Populate Deposit Targets / Rate Scenarios tables server-side, or accept JS-rendered as sufficient given Google generally executes JS | H7 — lower urgency; real but secondary technical gap |

---

# TECHNICAL DEBT FOUND (not SEO-ranking-critical, logged for awareness)

| ID | Finding | Evidence |
|---|---|---|
| T-Debt-1 | `scripts/audit-internal-links.mjs`'s `if (import.meta.url === \`file://${process.argv[1]}\`)` entry-point guard silently fails on Windows — `npm run audit:internal-links` exits 0 but never runs `main()`. Worked around tonight by calling the exported `runAudit()` directly. | Confirmed via direct reproduction |
| T-Debt-2 | `config/clusters/route-ownership.json` / `cluster-registry.json` don't classify the home-loan cluster at all, and only track 1 of 5 credit-card pages — causes false "orphan" findings in the internal-link audit (flagged `debt-payoff-calculator` as orphaned despite having inbound links from all 4 siblings) | `internal-link-audit.md`, regenerated 2026-08-14 |
| T-Debt-3 | `scripts/local-seo-performance-audit.mjs` depends on a missing input file (`requirements/compliance/REQ-20260208-029.slugs.txt`) tied to a specific past ticket — not reusable as a general audit tool without that file | Direct run attempt |

---

# SECTION 5 — VERIFICATION PLAN

- Each Tier 0/1 change: rebuild affected page(s) via `node scripts/generate-mpa-pages.js --calc-id <id>`, run that page's release Playwright suite, run full `npx vitest run`, visually screenshot before shipping (same process used for all of tonight's prior fixes).
- Re-pull GSC data in 2-4 weeks. Priority signals to check: LTV cluster position movement on the "work out ltv"/"80 ltv"/remortgage-LTV queries specifically (Tier 1 targets), auto-loan cluster rich-result appearance in Search Appearance export (Tier 0 schema fix), mortgage-calculator page-filtered query report (Tier 4 investigation).
- Do not expect ranking movement before 2-3 weeks minimum post-deploy (Google recrawl + reindex latency) — this was true for tonight's earlier fixes and remains true here.
