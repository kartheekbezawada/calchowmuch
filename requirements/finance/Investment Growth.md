REQ-20260207-007
Investment Growth Calculator — Finance Category
==============================================

## Status: NEW

- Type: Requirements spec + build/generation instructions
- FSM Phase: REQ
- Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

### Repo Reality Check (AP-2.3)

Finance calculators in this repo use:

- Fragments under `/public/calculators/<domain>/<slug>/` (source-of-truth)
- Generated full shell page under `/public/<domain>/<slug>/index.html` (do not hand-edit)

---

## 1. Purpose & Search Intent (SEO-Critical)

### 1.1 Primary User Question (Single-Question Rule)

**How much will my investment be worth in the future based on growth rate, time, and contributions?**

Users typically want:

- future value of an investment
- total contributions vs growth
- impact of monthly deposits and expected return

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords MUST be explicitly supported in:

- H1
- title
- meta description
- explanation copy
- FAQ questions

| Keyword Type | Keywords |
|--------------|----------|
| **Primary** | investment growth calculator, investment calculator |
| **Secondary** | future value investment calculator, investment return calculator, portfolio growth calculator |
| **Long-tail / Intent** | investment growth calculator with contributions, investment calculator monthly contributions, how much will my investment be worth, investment growth over time calculator, expected return calculator |

---

## 2. Category & Navigation Requirements

### 2.1 Top-Level Category

**Top Navigation Button:** Finance

**Category:** Investing

### 2.2 Left Navigation Structure (Finance)

```
Finance
└── Investments & Savings
    ├── Savings Goal
    ├── Investment Growth
```

**Rules**

- Display name must be exactly "Investment Growth"
- Navigation must be config-driven
- One calculator per page

---

## 3. URL & Page Model (SEO + MVP)

**Canonical URL**

```
/finance/investment-growth/
```

**Architecture**

- Multi-Page Application (MPA)
- One calculator per page
- Full page reload
- Crawlable explanation pane

---

## 4. Folder & File Structure

**Fragments (source-of-truth) — FS-3.1:**

```text
/public/calculators/finance/investment-growth/
├── index.html          # Calculation pane fragment (NOT full page)
├── module.js           # UI glue + investment growth compute
├── explanation.html    # Explanation pane fragment (SEO-critical)
└── calculator.css      # Optional per-calculator styling
```

**Generated output (do not hand-edit):**

```text
/public/finance/investment-growth/index.html
```

---

## 5. Calculation Pane Requirements

**H2**

Investment Growth Calculator

### Inputs

| Section | Input | Type | Required | Notes |
|---------|-------|------|----------|-------|
| **Core (Above the Fold)** | Initial Investment | Number | Yes | Currency |
| **Core (Above the Fold)** | Expected Annual Return (%) | Number | Yes | Decimals allowed |
| **Core (Above the Fold)** | Investment Period | Number | Yes | Positive |
| **Core (Above the Fold)** | Time Unit | Button Toggle | Yes | Years / Months |
| **Core (Above the Fold)** | Contribution Amount | Number | No | Currency (default 0) |
| **Core (Above the Fold)** | Contribution Frequency | Button Group | No | Monthly (default), Quarterly, Annually |
| **Optional (Progressive Disclosure)** | Compounding Frequency | Button Group | No | Monthly (default), Quarterly, Annually, Daily |
| **Optional (Progressive Disclosure)** | Contribution Timing | Button Toggle | No | End of period (default) / Beginning of period |
| **Optional (Progressive Disclosure)** | Inflation Rate (%) | Number | No | Optional "real value" output |

**Rules**

- No dropdowns (UI-2.5)
- Button groups only
- Optional inputs must not block calculation
- Progressive disclosure section must be clearly visible and collapsible
- Daily compounding uses 365

Additional universal rules:

- Validate all inputs (UI-2.3, CS-1.3)
- Cap input length to 12 characters (UI-2.4)

---

## 6. Calculator Engine (Logic)

### 6.1 Definitions

- P0 = initial investment
- r = expected annual return as decimal
- t = years (if months used: t = months / 12)
- m = compounding periods per year (12 monthly, 4 quarterly, 1 annually, 365 daily)
- i = periodic growth rate = r / m
- Contribution frequency periods per year:
  - monthly: 12
  - quarterly: 4
  - annually: 1

### 6.2 Base Growth (No Contributions)

If contribution amount = 0:

```
FV = P0 × (1 + r/m)^(m×t)
```

### 6.3 Contributions (If Enabled)

If contribution amount > 0, compute using deterministic period simulation based on the smallest step required:

**Simulation rule (mandatory):**

Step period = LCM-compatible smallest interval between:

- compounding period
- contribution period

If simplifying: step at monthly resolution when any setting is monthly; otherwise quarterly; otherwise annual.

Results must be deterministic.

**Pseudo:**

```
balance = P0
for each step period:
  if contribution due this period:
     if timing = beginning: balance += contrib
  balance *= (1 + step_rate)
  if contribution due this period:
     if timing = end: balance += contrib
```

**Where:**

step_rate derived from annual return converted to step periodic rate.

### 6.4 Inflation Adjustment (Optional)

If inflation rate provided, compute "real value" of final balance:

- infl = inflation decimal
- FV_real = FV / (1 + infl)^t

### 6.5 Outputs

| Output | Required |
|--------|----------|
| Future Value (Ending Balance) | Yes |
| Total Contributions | Yes |
| Total Growth (Gain) | Yes |
| Initial Investment | Yes |
| Expected Return Used | Yes |
| Time Used (normalized) | Yes |
| Compounding Frequency Used | Yes |
| Contribution Settings Applied | Yes |
| Real Future Value (inflation-adjusted) | Yes (only if inflation provided) |

### 6.6 Validation Rules

- P0 must be >= 0 (allow 0 for contribution-only scenario)
- Return rate can be 0; must not be negative by default (if you later allow negative, must be explicit)
- Time must be > 0
- If both P0 and contribution are 0, output is 0 (no error)
- No unhandled exceptions

### 6.7 Rounding Rules

- Internal precision high
- Display:
  - Currency: 2 decimals
  - Percent: 2 decimals

---

## 7. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 7.1 H2 — Summary (Keyword-Dense, Natural)

An investment growth calculator estimates how much an investment could be worth in the future based on an expected annual return, time horizon, and optional recurring contributions.

This investment calculator shows your future value, total contributions, and total growth, and can optionally estimate inflation-adjusted ("real") value to understand purchasing power.

### 7.2 H3 — Scenario Summary

| Category | Value | Source |
|----------|-------|--------|
| Initial Investment | {INITIAL_INVESTMENT} | Calculation Pane |
| Expected Annual Return | {RETURN_RATE}% | Calculation Pane |
| Investment Period | {TIME} | Calculation Pane |
| Time Unit | {TIME_UNIT} | Calculation Pane |
| Contribution Amount | {CONTRIBUTION_AMOUNT} | Calculation Pane |
| Contribution Frequency | {CONTRIBUTION_FREQUENCY} | Calculation Pane |
| Compounding Frequency | {COMPOUNDING_FREQUENCY} | Calculation Pane |
| Future Value | {FUTURE_VALUE} | Calculator Engine |

### 7.3 H3 — Results Table

| Metric | Value | Unit | Explanation |
|--------|-------|------|-------------|
| Future Value | {FUTURE_VALUE} | Currency | Estimated ending balance |
| Total Contributions | {TOTAL_CONTRIBUTIONS} | Currency | Total deposits added |
| Total Growth | {TOTAL_GROWTH} | Currency | Future value minus deposits |
| Initial Investment | {INITIAL_INVESTMENT} | Currency | Starting amount |
| Expected Return | {RETURN_RATE} | % | Growth assumption |
| Total Time | {T_YEARS} | Years | Normalized duration |
| Real Future Value | {REAL_FUTURE_VALUE} | Currency | Inflation-adjusted value (if enabled) |

### 7.4 H3 — Explanation (SEO-Optimized)

Investment growth is commonly estimated using compound growth assumptions, where returns can build on prior returns over time. Your time horizon and expected annual return are the largest drivers of long-term outcomes.

If you add regular contributions, the final balance can increase significantly because each contribution may also earn returns over the remaining period.

If you include inflation, the calculator can estimate a "real" future value, which helps you understand what the ending balance may be worth in today's purchasing power.

### 7.5 H3 — Frequently Asked Questions (Exactly 10)

**1. What is an investment growth calculator?**

An investment growth calculator estimates the future value of an investment based on expected return, time, and contributions.

**2. How do you calculate investment growth over time?**

You apply compound growth assumptions using an expected annual return and the investment period, and add contributions if applicable.

**3. What is future value in investing?**

Future value is the estimated amount your investment could grow to after a set time period.

**4. How do monthly contributions affect investment growth?**

Monthly contributions can increase the final balance because added deposits may also earn returns over time.

**5. What does expected annual return mean?**

It is the assumed average yearly growth rate used for forecasting.

**6. Does compounding frequency matter for investment growth?**

Yes. More frequent compounding can slightly increase estimated growth under the same annual return assumption.

**7. Can this calculator estimate investment returns?**

Yes. It estimates future value and total growth based on the return rate you enter.

**8. What is inflation-adjusted future value?**

It estimates your ending balance in today's purchasing power after accounting for inflation.

**9. What happens if the return rate is 0%?**

Future value equals the initial investment plus total contributions.

**10. Is this investment growth estimate guaranteed?**

No. It is a projection based on assumptions and actual market returns can vary.

---

## 8. SEO Requirements (Top-Ranking Focus)

### 8.1 Metadata (Keyword-Optimized)

**H1:** Investment Growth Calculator

**Title:**
```
Investment Growth Calculator – CalcHowMuch
```

**Meta Description:**
```
Estimate investment growth over time. Calculate future value, total contributions, and total gains using an expected annual return. Optional inflation adjustment.
```

---

## 9. Structured Data (JSON-LD — REQUIRED)

**Placement Rule**

All JSON-LD scripts below must be embedded only on:

- /finance/investment-growth/
- Page-scoped only (no global FAQPage injection)

### 1) WebPage (Required)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Investment Growth Calculator",
  "url": "https://calchowmuch.com/finance/investment-growth/",
  "description": "Estimate investment growth over time using expected annual return, contributions, and compounding frequency. Calculates future value and total gains.",
  "inLanguage": "en"
}
```

### 2) SoftwareApplication (Calculator-Specific, Required)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Investment Growth Calculator",
  "applicationCategory": "FinanceApplication",
  "applicationSubCategory": "Investing Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/finance/investment-growth/",
  "description": "Free investment growth calculator to estimate future value, total contributions, and investment gains over time. Optional inflation adjustment.",
  "browserRequirements": "Requires JavaScript enabled",
  "softwareVersion": "1.0",
  "creator": {
    "@type": "Organization",
    "name": "CalcHowMuch"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### 3) FAQPage (SERP-Optimized, Required — must match visible FAQs exactly)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an investment growth calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An investment growth calculator estimates the future value of an investment based on expected return, time, and contributions."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate investment growth over time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You apply compound growth assumptions using an expected annual return and the investment period, and add contributions if applicable."
      }
    },
    {
      "@type": "Question",
      "name": "What is future value in investing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Future value is the estimated amount your investment could grow to after a set time period."
      }
    },
    {
      "@type": "Question",
      "name": "How do monthly contributions affect investment growth?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Monthly contributions can increase the final balance because added deposits may also earn returns over time."
      }
    },
    {
      "@type": "Question",
      "name": "What does expected annual return mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is the assumed average yearly growth rate used for forecasting."
      }
    },
    {
      "@type": "Question",
      "name": "Does compounding frequency matter for investment growth?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. More frequent compounding can slightly increase estimated growth under the same annual return assumption."
      }
    },
    {
      "@type": "Question",
      "name": "Can this calculator estimate investment returns?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It estimates future value and total growth based on the return rate you enter."
      }
    },
    {
      "@type": "Question",
      "name": "What is inflation-adjusted future value?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It estimates your ending balance in today's purchasing power after accounting for inflation."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the return rate is 0%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Future value equals the initial investment plus total contributions."
      }
    },
    {
      "@type": "Question",
      "name": "Is this investment growth estimate guaranteed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. It is a projection based on assumptions and actual market returns can vary."
      }
    }
  ]
}
```

### 4) BreadcrumbList (Required)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://calchowmuch.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Finance",
      "item": "https://calchowmuch.com/finance/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Investment Growth",
      "item": "https://calchowmuch.com/finance/investment-growth/"
    }
  ]
}
```

---

## 10. Sitemap & Indexing

Must update:

- public/config/navigation.json
- sitemap.xml
- /sitemap
- public/calculators/index.html

Rules:

- `sitemap.xml` MUST list every active calculator URL (FS-4.2)
- New calculator REQs MUST include sitemap coverage as an acceptance criterion (DOC-SITEMAP-5)

---

## 11. Testing Requirements

**Change Type:** New calculator

| Test | Required |
|------|----------|
| Unit (investment growth logic) | ✅ |
| ISS-001 | ✅ |
| E2E | ✅ |
| SEO-P1 → P5 | ✅ |

---

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

---

## 13. Acceptance Criteria

- Ranks for "investment growth calculator" and long-tail variants ("how much will my investment be worth")
- Correct future value with/without contributions
- Optional inflation output correct and gated
- Explanation pane crawlable and keyword-aligned
- Rich Results Test shows FAQPage (10 Qs) + BreadcrumbList
- No schema scope violations (no global FAQPage)

SEO phase tracking file:

- `requirements/seo/REQ-20260207-007.md`
