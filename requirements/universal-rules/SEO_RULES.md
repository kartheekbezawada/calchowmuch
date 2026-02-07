# Comprehensive SEO Guidelines for CalcHowMuch.com

## Document Metadata

| Field | Value |
| --- | --- |
| Purpose | Defines mandatory SEO validation rules, priorities, and best practices for all public pages on CalcHowMuch.com, with special emphasis on calculator tools. |
| Authority | These rules are binding for all new and modified pages. Non-compliance risks reduced rankings, poor indexing, or algorithmic penalties. |
| Last Updated | 2026-01-22 |
| Version | 2.0 (Structured Data Integrated Edition) |
| Scope | All public routes, with emphasis on calculators in: Time Value of Money, Bonds, Portfolio & Risk, Corporate Finance, Derivatives, FX & Rates, and Statistics & Probability. |
| Core Principles | Prioritize user intent, mobile performance, structured data, and verifiable compliance recorded in seo_tracker.md. |

## Priority Levels Overview

| Priority | Focus Area | When Required |
| --- | --- | --- |
| P1 – Critical SEO | Crawlability & relevance | All public pages |
| P2 – Enhanced SEO | Social + structured data | All public pages |
| P3 – Performance SEO | Core Web Vitals | All public pages |
| P4 – Accessibility Overlap | WCAG + usability | All public pages |
| P5 – Advanced SEO | Site-wide infrastructure | All pages |

## Implications of Priorities

- P1 (Mandatory) — Failure here can block indexing or create duplicate content issues.
- P2 (Required for calculators) — Enables rich results via structured data.
- P3 (Launch gate) — Direct ranking factor via Core Web Vitals.
- P4 (Required baseline) — Improves usability, dwell time, and voice search readiness.
- P5 (Site governance) — Controls redirects, sitemaps, HTTPS, and canonical strategy.

## P1 — Critical SEO (Mandatory)

Every public page must pass all P1 checks.

| Rule | Requirement | Validation |
| --- | --- | --- |
| P1.1 | Unique <title> (50–60 chars) containing primary keyword | Automated + manual |
| P1.2 | Unique meta description (150–160 chars) | Manual |
| P1.3 | Correct canonical URL | HTML source |
| P1.4 | Exactly one <h1> with primary keyword | DOM check |
| P1.5 | No duplicate content | Copyscape/Plagiarism check |
| P1.6 | Mobile viewport present | HTML check |
| P1.7 | <html lang="en"> (or correct locale) | HTML check |

### Automated check

```
npm run test:seo -- --level p1
```

### Nuances

- Primary keyword must appear early in title and description.
- Titles must be unique across the site (no templates duplicated page-to-page).

## P2 — Enhanced SEO (Required for All Public Pages)

Includes structured data as a first-class requirement.

| Rule | Requirement | Validation |
| --- | --- | --- |
| P2.1 | OpenGraph title present | HTML |
| P2.2 | OpenGraph description present | HTML |
| P2.3 | Valid OpenGraph image (1.91:1) | URL check |
| P2.4 | Correct og:type (website or article) | HTML |
| P2.5 | Twitter card present | HTML |
| P2.6 | Valid JSON-LD structured data | Google Rich Results |
| P2.7 | BreadcrumbList schema | Schema validator |

### Required Structured Data by Page Type

#### Homepage (must include all three)

- Organization
- WebSite
- BreadcrumbList

#### Category Pages

- WebPage
- BreadcrumbList

#### Every Calculator Page

Must include:

- WebPage
- SoftwareApplication (calculator schema)
- FAQPage (if FAQs exist — they must exist)
- BreadcrumbList

### Automated check

```
npm run test:seo -- --level p2
```

## P3 — Performance SEO (Launch Gate; Waivable for calculator pages in headless/no-GUI environments)

| Metric | Threshold | Tool |
| --- | --- | --- |
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| FCP | < 1.8s | Lighthouse |
| TTI | < 3.8s | Lighthouse |
| TBT | < 200ms | Lighthouse |

### Additional P3 rules

- All images must have alt text
- No render-blocking JS/CSS above the fold
- Images sized correctly (no layout shifts)
- Fonts use font-display: swap

### Run

```
npx lighthouse <url> --only-categories=performance
```

### 4.1 Canonical P3 Lighthouse Command (Locked)

Purpose: run SEO-P3 Performance using Playwright Chromium in WSL/Linux with deterministic artifact output and no `xvfb-run`.

```bash
mkdir -p test-results/seo/present-value
CHROME_PATH="$(find "${HOME}/.cache/ms-playwright" -type f -path '*/chrome-linux64/chrome' | sort | tail -n 1)" \
npx lighthouse "http://127.0.0.1:8002/finance/present-value/" \
  --only-categories=performance \
  --output=json \
  --output-path="test-results/seo/present-value/lighthouse-performance.json" \
  --chrome-flags="--headless=new --window-size=1365,940 --no-sandbox --disable-dev-shm-usage --user-data-dir=/tmp/lighthouse-profile-present-value"
```

Notes:
- This command mitigates `NO_FCP` by forcing a fixed viewport.
- This command avoids Windows `C:\Users\...\AppData\Local\lighthouse.*` profile sprawl by pinning `CHROME_PATH` to Playwright Chromium in WSL/Linux.

### P3 Waiver Policy — Calculator pages in headless/no-GUI environments (NO_FCP)

**Problem:** In headless/non-GUI environments, Chrome may not reliably “paint” a real frame. Lighthouse can then fail to detect First Contentful Paint and report `NO_FCP`.

**Clarification:** This is not inherently a “WSL problem”. The common root cause is **no real GUI/display** (headless with no WSLg/X server/desktop session).

**Policy (calculator pages):** SEO-P3 is **NOT a blocking launch gate** for calculator REQs when the failure mode is `NO_FCP` in a headless/no-GUI environment. In this case, record **P3 = WAIVED**.

**Automation / recording note:** This waiver is a standing policy for calculator pages. Do **not** add special per-REQ notes in `requirement_tracker.md`. Record the waiver status and evidence only in `seo_tracker.md` (and the REQ compliance row).

**Waiver is allowed ONLY when all are true:**
- The route is a calculator page.
- Lighthouse was attempted using the Canonical P3 command (or equivalent) and fails specifically with `NO_FCP` / missing FCP due to headless/no-GUI execution.
- P1 / P2 / P5 checks pass (Playwright SEO suite).
- P4 passes via Pa11y (or equivalent) and evidence is recorded.

**Required evidence when P3 is WAIVED:**
- The exact Lighthouse command used and the terminal output showing `NO_FCP` (or the best available log/trace).
- Any produced Lighthouse JSON artifact (if created) or a note that none was produced due to runtime failure.
- Evidence of P1/P2/P5 Playwright SEO passing.
- The Pa11y JSON output (or equivalent) showing results.

**Non-waivable failures:** If Lighthouse runs successfully but reports poor metrics (e.g., slow LCP/TTI/TBT, high CLS), then P3 is **FAIL** and remains blocking.

## P4 — Accessibility (Baseline Requirement)

| Rule | Requirement |
| --- | --- |
| P4.1 | Proper heading hierarchy (H1 → H2 → H3) |
| P4.2 | Descriptive link text (no “click here”) |
| P4.3 | Labels associated with all inputs |
| P4.4 | WCAG AA color contrast (4.5:1) |
| P4.5 | Visible focus states |
| P4.6 | ARIA labels where needed |

### Run

```
npx pa11y <url>
```

### 4.2 Canonical P4 Pa11y Command (Locked)

Purpose: run SEO-P4 accessibility with Playwright Chromium and deterministic JSON output while preserving Pa11y exit semantics.

```bash
mkdir -p test-results/seo/present-value
set +e
PUPPETEER_EXECUTABLE_PATH="$(find "${HOME}/.cache/ms-playwright" -type f -path '*/chrome-linux64/chrome' | sort | tail -n 1)" \
npx pa11y "http://127.0.0.1:8002/finance/present-value/" \
  --timeout 120000 \
  --wait 1000 \
  --reporter json > "test-results/seo/present-value/pa11y.json"
PA11Y_EXIT=$?
set -e
if [ "${PA11Y_EXIT}" -gt 2 ]; then
  exit "${PA11Y_EXIT}"
fi
```

Notes:
- Exit code `0` means pass, `2` means violations found, and values `>2` are runtime/tooling failures.
- This command distinguishes real accessibility issues from environment failures.

## P5 — Advanced SEO (Site-Wide Governance)

| Rule | Requirement | When Applied |
| --- | --- | --- |
| P5.1 | Valid sitemap.xml | Any page change |
| P5.2 | robots.txt allows Googlebot | Always |
| P5.3 | Sitemap submitted to GSC | After major updates |
| P5.4 | 301 redirects for moved URLs | URL changes |
| P5.5 | Hreflang (if multilingual) | If applicable |
| P5.6 | HTTPS enforced | Always |
| P5.7 | Single canonical domain (www vs non-www) | Initial setup |

## SEO Validation by Change Type (Corrected Matrix)

| Change Type | P1 | P2 | P3 | P4 | P5 |
| --- | --- | --- | --- | --- | --- |
| New calculator page | ✅ | ✅ | ✅ | ✅ | ✅ |
| Metadata update | ✅ | ✅ | — | — | — |
| Content update | ✅ | — | — | — | — |
| Layout/styling change | — | — | ✅ | ✅ | — |
| URL structure change | ✅ | — | — | — | ✅ |
| New site section | ✅ | ✅ | ✅ | ✅ | ✅ |

Rationale: New calculators and new sections reshape site architecture, indexing, performance, and schema — therefore they must complete P1–P5.
For calculator pages, P3 may be recorded as **WAIVED** only under the P3 Waiver Policy above.

## Recording Compliance (seo_tracker.md)

| SEO_ID | REQ_ID | Page/Route | Checks | Status |
| --- | --- | --- | --- | --- |
| SEO-REQ-20260122-001 | REQ-20260122-001 | /calc/tip | P1, P2, P3, P4, P5 | PASS ✅ |

### Process

- Assign unique SEO_ID.
- Run automated checks.
- Log result before launch.
- Archive passed entries quarterly.

## Common SEO Issues & Fixes

| Issue | Impact | Fix |
| --- | --- | --- |
| Missing meta description | Low CTR | Add unique description |
| Duplicate titles | SERP confusion | Make titles unique |
| Missing canonical | Duplicate risk | Add canonical tag |
| Slow LCP | Ranking loss | Optimize images/fonts |
| High CLS | Poor UX | Reserve layout space |
| Missing alt text | Accessibility + SEO loss | Add descriptive alt |

## Best-SEO Calculator Page Template (Reusable)

### 1) URL (Mandatory)

https://calchowmuch.com/{category}/{calculator-slug}/

### 2) <head> SEO Elements

Title (55–60 chars)

{Primary Keyword} – {Qualifier} | CalcHowMuch

Meta description (150–160 chars)

Use our free {primary keyword} to estimate {main outcome} based on your {key inputs}. Fast, simple, and mobile-friendly.

Canonical

<link rel="canonical" href="https://calchowmuch.com/{category}/{calculator-slug}/" />

Required Meta (P2)

- og:title
- og:description
- og:image (1.91:1)
- twitter:card

### 3) On-Page Structure

H1

H1: {Primary Keyword}

Above-the-fold summary (2–3 lines)

This calculator estimates {main result} based on your {top 2–3 inputs}.
Adjust values to compare scenarios instantly.

### 4) Calculator Pane

- Inputs left (desktop), stacked (mobile)
- Results right (desktop), below inputs (mobile)
- Summary card at top
- Scenario table below results

### 5) Scenario Summary Table

H2: Your Scenario Summary

| Metric | Value |
| --- | --- |
| {Input 1} | {value} |
| {Input 2} | {value} |
| {Key Output} | {value} |
| {Secondary Output} | {value} |

### 6) Explanation Section (Critical for rankings)

H2: How This Works

Cover:

- What the calculator estimates
- What drives results up/down
- Who it is for
- Limitations of estimates

### 7) FAQs + Schema (Mandatory)

H2: Frequently Asked Questions

8–10 boxed FAQs required per calculator, with FAQPage JSON-LD.

### 8) Breadcrumbs (Visible + Schema)

Home > Category > Calculator Name

Include BreadcrumbList JSON-LD.

## Structured Data Strategy (Summary)

| Page | Required Schema |
| --- | --- |
| Homepage | Organization + WebSite + BreadcrumbList |
| Category page | WebPage + BreadcrumbList |
| Calculator page | WebPage + SoftwareApplication + FAQPage + BreadcrumbList |

You should implement a Pass/Fail checklist per change type based on that matrix. It turns the matrix into an enforceable gate, reduces subjective reviews, and makes audits (and agent workflows) deterministic.

## Recommended structure

### 1) A single reusable checklist template

Use one template with:

```
Use one template with:

Change Type

Page/Route

Required priorities (P1–P5)

Checks + evidence

Overall PASS/FAIL

Blocking failures (anything P1/P3/P5 that fails should block launch)
```

### 2) One checklist instance per change (SEO_ID)

Each change gets a unique SEO_ID, stored in seo_tracker.md and (optionally) a dedicated file per change for detailed evidence.

## Pass/Fail rules (simple and strict)

### PASS criteria

A change is PASS if:

- All required priorities for its change type are marked PASS (per matrix)
- No “blocking” items are unresolved

### FAIL criteria

A change is FAIL if:

- Any required priority is FAIL
- Any required evidence is missing (treat as FAIL, not “unknown”)

### Blockers (recommended)

- P1 always blocks public launch
- P3 blocks launch (Core Web Vitals) for non-calculator pages; for calculator pages, P3 may be WAIVED only under the P3 Waiver Policy above
- P5 blocks if it affects crawl/indexing (sitemap/robots/canonical/redirects)

## Concrete “Pass/Fail checklist by change type”

### A) New calculator page (must pass P1–P5)

PASS only if: P1 ✅ P2 ✅ (P3 ✅ OR P3 = WAIVED per policy) P4 ✅ P5 ✅

Minimum evidence to record

- P1: title/meta/canonical/H1/lang/viewport checks
- P2: OG/Twitter + JSON-LD (WebPage + SoftwareApplication + FAQPage + BreadcrumbList)
- P3: Lighthouse report with metrics OR WAIVER evidence (NO_FCP logs + artifacts)
- P4: pa11y report (or equivalent) + heading/labels verified
- P5: sitemap updated + robots ok + canonical domain ok

### B) New site section (must pass P1–P5)

Same PASS gate as above, plus:

- internal linking plan (hub page)
- sitemap coverage of new section routes

### C) Metadata update (P1–P2)

PASS only if: P1 ✅ P2 ✅
No need for P3–P5 unless you changed layout or URL.

### D) Content update (P1 only)

PASS only if: P1 ✅
(If you add FAQs or breadcrumbs, you should also run P2.)

### E) Layout/styling change (P3–P4)

PASS only if: (P3 ✅ OR P3 = WAIVED per policy) P4 ✅
(If layout change affects headings/meta/schema, also run P1/P2.)

### F) URL structure change (P1 + P5)

PASS only if: P1 ✅ P5 ✅
And must include redirect verification (no chains).

## How to store it in seo_tracker.md

Add columns that make Pass/Fail explicit:

| SEO_ID | REQ_ID | Change Type | Route | Required | P1 | P2 | P3 | P4 | P5 | Overall | Evidence Links |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEO-REQ-20260205-001 | REQ-20260205-001 | New calculator page | /finance/present-value/ | P1–P5 | PASS | PASS | PASS | PASS | PASS | PASS | lighthouse, pa11y, schema |

Overall should be computed deterministically:

- If any required Px = FAIL → Overall = FAIL
- If any required Px = WAIVED → Overall = PASS only if the waiver policy allows WAIVED for that Px and route type; otherwise Overall = FAIL
- If all required Px are PASS (or allowed WAIVED) → Overall = PASS

## Implementation tip (what makes this actually useful)

Define a rule in your workflow like:

No deploy of public route unless Overall = PASS for that SEO_ID

Evidence artifacts must exist (Lighthouse JSON or waiver logs, pa11y output, schema validation screenshot/link)
