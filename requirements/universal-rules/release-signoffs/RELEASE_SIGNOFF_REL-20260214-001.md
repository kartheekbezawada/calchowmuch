# Release Sign-Off — REL-20260214-001

## REL-20260214-001 — Home Loan Calculators Audit

### 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260214-001 |
| **Release Type** | Audit (SERP + Ads + UI) |
| **Branch / Tag** | `main` |
| **Commit SHA** | — |
| **Environment Tested** | Localhost |
| **Release Owner** | Agent |
| **Date (UTC)** | 2026-02-14 |

### Scope

All 7 Home Loan calculators from `navigation.json` → Loans → Home subcategory:

| # | Calculator | URL |
|:--|:-----------|:----|
| 1 | Home Loan | `/loans/home-loan/` |
| 2 | How Much Can I Borrow | `/loans/how-much-can-i-borrow/` |
| 3 | Remortgage / Switching | `/loans/remortgage-switching/` |
| 4 | Buy-to-Let | `/loans/buy-to-let/` |
| 5 | Offset Calculator | `/loans/offset-calculator/` |
| 6 | Interest Rate Change | `/loans/interest-rate-change-calculator/` |
| 7 | Loan-to-Value (LTV) | `/loans/loan-to-value/` |

### File Assets Verification

| Calculator | module.js | calculator.css | explanation.html |
|:-----------|:---------:|:--------------:|:----------------:|
| Home Loan | PASS | PASS | PASS |
| How Much Can I Borrow | PASS | PASS | PASS |
| Remortgage / Switching | PASS | PASS | PASS |
| Buy-to-Let | PASS | PASS | PASS |
| Offset Calculator | PASS | PASS | PASS |
| Interest Rate Change | PASS | PASS | PASS |
| Loan-to-Value (LTV) | PASS | PASS | PASS |

---

### 8.1 Metadata & Canonical Verification (I1)

| Calculator | `<title>` Unique | Meta Desc Intent-Aligned | Canonical Correct | No Duplicate Metas | Notes |
|:-----------|:----------------:|:------------------------:|:-----------------:|:------------------:|:------|
| Home Loan | PASS | PASS | PASS | PASS | Title: "Home Loan Calculator \| Mortgage Payment Planner \| CalcHowMuch" |
| How Much Can I Borrow | PASS | PASS | PASS | PASS | Title: "How Much Can I Borrow \| Mortgage Affordability \| CalcHowMuch" |
| Remortgage / Switching | PASS | PASS | PASS | PASS | Title: "Remortgage Calculator (Switching) \| Break-even \| CalcHowMuch" |
| Buy-to-Let | PASS | PASS | PASS | PASS | Title: "Buy-to-Let (Yield, Cashflow & Coverage) \| CalcHowMuch" |
| Offset Calculator | PASS | PASS | PASS | PASS | Title: "Offset Calculator \| Interest Savings & Payoff \| CalcHowMuch" |
| Interest Rate Change | PASS | PASS | PASS | PASS | Title: "Interest Rate Change Calculator \| Rate Impact \| CalcHowMuch" |
| Loan-to-Value (LTV) | PASS | PASS | PASS | PASS | Title: "Loan-to-Value (LTV) Calculator \| LTV Bands \| CalcHowMuch" |

---

### 8.2 Structured Data Verification (I2)

| Calculator | Schema Bundle Correct | Validates Rich Results | JSON-LD Matches Visible | No Duplicate FAQPage | Notes |
|:-----------|:---------------------:|:----------------------:|:-----------------------:|:--------------------:|:------|
| Home Loan | PASS | PASS | PASS | PASS | @graph: WebSite, Organization, WebPage, SoftwareApplication, FAQPage, BreadcrumbList |
| How Much Can I Borrow | PASS | PASS | PASS | PASS | Same safe types |
| Remortgage / Switching | PASS | PASS | PASS | PASS | Same safe types |
| Buy-to-Let | PASS | PASS | PASS | PASS | Same safe types; 6 FAQ Q&As |
| Offset Calculator | PASS | PASS | PASS | PASS | 10 FAQ Q&As |
| Interest Rate Change | PASS | PASS | PASS | PASS | 10 FAQ Q&As |
| Loan-to-Value (LTV) | PASS | PASS | PASS | PASS | 10 FAQ Q&As |

---

### 8.3 Content Indexability (I3)

| Calculator | Explanation in HTML | FAQs in HTML | Key Formulas | H1 Present | H2/H3 Headings | No-JS Crawlable |
|:-----------|:-------------------:|:------------:|:------------:|:----------:|:--------------:|:---------------:|
| Home Loan | PASS | PASS | **FAIL** | PASS | PASS | PASS |
| How Much Can I Borrow | PASS | PASS | **FAIL** | PASS | PASS | PASS |
| Remortgage / Switching | PASS | PASS | **FAIL** | PASS | PASS | PASS |
| Buy-to-Let | PASS | PASS | **FAIL** | PASS | PASS | PASS |
| Offset Calculator | PASS | PASS | **FAIL** | PASS | PASS | PASS |
| Interest Rate Change | PASS | PASS | **FAIL** | PASS | PASS | PASS |
| Loan-to-Value (LTV) | PASS | PASS | **PARTIAL** | PASS | PASS | PASS |

> **Systemic Issue #1**: No calculator includes an explicit formula block in static HTML (e.g., PMT formula, yield formula, LTV formula). LTV is PARTIAL because its FAQ text mentions "loan amount divided by property value."

---

### 8.4 Internal Linking Verification (I4)

| Calculator | Parent Category Link | Related Calculators | Reverse/Comparison Links | All Links in HTML |
|:-----------|:--------------------:|:-------------------:|:------------------------:|:-----------------:|
| Home Loan | PASS | PASS | **FAIL** | PASS |
| How Much Can I Borrow | PASS | PASS | **FAIL** | PASS |
| Remortgage / Switching | PASS | PASS | **FAIL** | PASS |
| Buy-to-Let | PASS | PASS | **FAIL** | PASS |
| Offset Calculator | PASS | PASS | **FAIL** | PASS |
| Interest Rate Change | PASS | PASS | **FAIL** | PASS |
| Loan-to-Value (LTV) | PASS | PASS | **FAIL** | PASS |

> **Systemic Issue #2**: All 7 calculators rely on the left nav for sibling links but have no contextual in-body cross-links (e.g., "See also: Remortgage Calculator" or "Compare with: LTV Calculator"). This is a missed SEO internal-linking opportunity.

---

### 8.5 Intent Coverage (I5)

| Calculator | Primary Intent in Title/H1/Meta | Secondary Intents Addressed |
|:-----------|:-------------------------------:|:---------------------------:|
| Home Loan | PASS | PASS |
| How Much Can I Borrow | PASS | PASS |
| Remortgage / Switching | PASS | PASS |
| Buy-to-Let | PASS | PASS |
| Offset Calculator | PASS | PASS |
| Interest Rate Change | PASS | PASS |
| Loan-to-Value (LTV) | PASS | PASS |

---

### 8.6 Scenario Content (I6 — Finance, Required)

| Calculator | Scenario Tables / Examples | What-if Prompts | Notes |
|:-----------|:--------------------------:|:---------------:|:------|
| Home Loan | **PARTIAL** | PASS | Amortization tables JS-rendered, no static worked example |
| How Much Can I Borrow | PASS | PASS | Rate Scenarios table structure in HTML |
| Remortgage / Switching | PASS | PASS | Cost comparison tables; horizon slider |
| Buy-to-Let | PASS | PASS | Cashflow projection table; vacancy/rent controls |
| Offset Calculator | PASS | PASS | Monthly + yearly amortization tables |
| Interest Rate Change | PASS | PASS | Rate change tables; immediate/delayed toggle |
| Loan-to-Value (LTV) | PASS | PASS | LTV Bands table pre-rendered; Deposit Targets table |

---

### Ads Stability Verification

| Calculator | AdSense Head Loader | Ad Slots with Reserved Space | Only One Loader |
|:-----------|:-------------------:|:----------------------------:|:---------------:|
| Home Loan | PASS | PASS | PASS |
| How Much Can I Borrow | PASS | PASS | PASS |
| Remortgage / Switching | PASS | PASS | PASS |
| Buy-to-Let | PASS | PASS | PASS |
| Offset Calculator | PASS | PASS | PASS |
| Interest Rate Change | PASS | PASS | PASS |
| Loan-to-Value (LTV) | PASS | PASS | PASS |

> **AdSense Injection Policy Updated (2026-02-14)**: AdSense code (head loader + ad slots) is now always injected into all generated calculator pages unconditionally. The `CHM_ENABLE_ADSENSE` environment variable is deprecated. Ads only render on the approved production domain (`calchowmuch.com`) via Google AdSense domain verification.

---

### General UI Verification

| Calculator | Calculator UI | Calculate Button | aria-live Result | Button-group (No Dropdowns) | Sitemap |
|:-----------|:------------:|:----------------:|:----------------:|:---------------------------:|:-------:|
| Home Loan | PASS | PASS | PASS | PASS | PASS |
| How Much Can I Borrow | PASS | PASS | PASS | PASS | PASS |
| Remortgage / Switching | PASS | PASS | PASS | PASS | PASS |
| Buy-to-Let | PASS | PASS | PASS | PASS | PASS |
| Offset Calculator | PASS | PASS | PASS | PASS | PASS |
| Interest Rate Change | PASS | PASS | PASS | PASS | PASS |
| Loan-to-Value (LTV) | PASS | PASS | PASS | PASS | PASS |

---

### Cross-Calculator Summary Matrix

| Check | Home Loan | How Much Borrow | Remortgage | Buy-to-Let | Offset | Rate Change | LTV |
|:------|:---------:|:---------------:|:----------:|:----------:|:------:|:-----------:|:---:|
| I1: Title | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I1: Meta desc | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I1: Canonical | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I1: No dupes | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I2: JSON-LD | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I2: Safe types | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I2: Page-scoped | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I2: No dupe FAQ | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I2: Schema=visible | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I3: Explanation | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I3: FAQs in HTML | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I3: Key formulas | **FAIL** | **FAIL** | **FAIL** | **FAIL** | **FAIL** | **FAIL** | PARTIAL |
| I3: H1 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I3: H2/H3 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I3: No-JS crawl | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I4: Parent link | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I4: Related links | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I4: Reverse links | **FAIL** | **FAIL** | **FAIL** | **FAIL** | **FAIL** | **FAIL** | **FAIL** |
| I4: Links in HTML | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I5: Primary intent | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I5: Secondary | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| I6: Scenarios | PARTIAL | PASS | PASS | PASS | PASS | PASS | PASS |
| I6: What-if | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Ads: Head loader | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Ads: Slots | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| UI: Calculator | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| UI: Calc button | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| UI: aria-live | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| UI: button-group | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Sitemap | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| module.js | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| calculator.css | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| explanation.html | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

---

### Systemic Issues Summary

| # | Issue | Severity | Affected | Fix Required |
|:--|:------|:---------|:---------|:-------------|
| 1 | ~~**AdSense head loader missing**~~ | ~~HIGH~~ | ~~All 7~~ | **RESOLVED** — AdSense code is now always injected unconditionally. `CHM_ENABLE_ADSENSE` deprecated. |
| 2 | **Key formulas not in static HTML** | MEDIUM | All 7 (LTV partial) | Add formula block (e.g., PMT formula, yield formula) to explanation sections |
| 3 | **No reverse/comparison cross-links** | MEDIUM | All 7 | Add contextual "See also" / "Compare with" links in explanation body |
| 4 | **Home Loan scenario tables JS-only** | LOW | Home Loan only | Add one static worked-example row for crawlers |

---

### Release Decision

- [ ] **APPROVED** — All HARD gates passed
- [x] **CONDITIONAL PASS** — SOFT issues only (formulas, cross-links, Home Loan static row)
- [ ] **REJECTED** — HARD blocker found

**Note**: The AdSense loader absence is systemic and intentional for local/dev environments. If AdSense is expected in production via Cloudflare injection or build step, this is N/A. Otherwise it is a HARD blocker for ad revenue.
