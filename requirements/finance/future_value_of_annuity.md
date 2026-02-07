REQ-20260207-003
Future Value of Annuity Calculator (Ordinary & Due) — Finance Category
=====================================================================

## Status: NEW

- Type: Requirements spec + build/generation instructions
- FSM Phase: REQ
- Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

### Repo Reality Check (AP-2.3)

Finance calculators in this repo use:

- Fragments under `/public/calculators/<domain>/<slug>/` (source-of-truth)
- Generated full shell page under `/public/<domain>/<slug>/index.html` (do not hand-edit)

This calculator MUST follow the same pattern as existing Finance calculators such as:

- `/public/calculators/finance/present-value/`
- `/public/calculators/finance/future-value/`

---

## 1. Purpose & Search Intent (SEO-Critical)

### 1.1 Primary User Question (Single-Question Rule)

**What will a series of regular payments be worth in the future (annuity)?**

This calculator answers one focused, high-intent question used by:

- investors
- students
- retirement planners
- savings planners
- finance professionals

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords MUST be supported in:

- H1
- title
- meta description
- explanation copy
- FAQ questions

| Keyword Type | Keywords |
|--------------|----------|
| **Primary** | future value of annuity, FV of annuity, annuity future value calculator, future value of annuity calculator |
| **Secondary** | future value of ordinary annuity, future value of annuity due, annuity due FV calculator |
| **Long-Tail / Intent** | how to calculate future value of annuity, future value of annuity formula, annuity future value example, FV of annuity with monthly payments |

---

## 2. Category & Navigation Requirements

### 2.1 Top-Level Category

**Top Navigation:** Finance

**Category:** Time Value of Money

### 2.2 Left Navigation Structure (Finance)

```
Finance
└── Time Value of Money
    ├── Present Value (PV)
    ├── Future Value (FV)
    ├── Present Value of Annuity
    └── Future Value of Annuity
```

**Rules**

- Display name must be exactly "Future Value of Annuity"
- Ordinary vs Due handled inside one calculator
- Navigation must be config-driven

---

## 3. URL & Page Model (SEO + MVP)

**Canonical URL**

```
/finance/future-value-of-annuity/
```

**Architecture**

- Multi-Page Application (MPA)
- One calculator per page
- Full page reload
- Crawlable explanation pane

**SEO Rule**

- One page targets both annuity types
- Do not split URLs (prevents keyword cannibalization)

---

## 4. Folder & File Structure

**Fragments (source-of-truth) — FS-3.1:**

```text
/public/calculators/finance/future-value-of-annuity/
├── index.html          # Calculation pane fragment (NOT full page)
├── module.js           # UI glue + FV annuity compute (ordinary + due)
├── explanation.html    # Explanation pane fragment (SEO-critical)
└── calculator.css      # Optional per-calculator styling
```

**Generated output (do not hand-edit):**

```text
/public/finance/future-value-of-annuity/index.html
```

---

## 5. Calculation Pane Requirements

**H2**

Future Value of Annuity Calculator (Ordinary & Due)

### Inputs

| Section | Input | Type | Required |
|---------|-------|------|----------|
| **Core** | Payment Amount (PMT) | Number | Yes |
| **Core** | Interest Rate (%) | Number | Yes |
| **Core** | Number of Periods | Number | Yes |
| **Core** | Period Type | Toggle (Years / Months) | Yes |
| **Core** | Annuity Type | Toggle (Ordinary / Due) | Yes |
| **Optional** | Compounding Frequency | Button Group | No |

**Rules**

- No dropdowns (UI-2.5)
- Optional inputs must not block calculation
- Optional section must be expandable / collapsible
- Annuity Type toggle visible by default
- Validate all inputs (UI-2.3, CS-1.3)
- Cap input length to 12 characters (UI-2.4)

---

## 6. Calculator Engine (Logic)

### 6.1 Authoritative Formulas

**Future Value of Ordinary Annuity**

```
FV = PMT × [ (1 + r)^n − 1 ] ÷ r
```

**Future Value of Annuity Due**

```
FV_due = FV_ordinary × (1 + r)
```

**Where:**

- PMT = payment per period
- r = interest rate per period
- n = number of periods

### 6.2 Outputs

| Output | Required |
|--------|----------|
| Future Value of Annuity | Yes |
| Annuity Type Applied | Yes |
| Total Contributions | Yes |
| Interest Rate per Period | Yes |
| Effective Period Count | Yes |

**Validation**

- Prevent divide-by-zero
- Reject negative / empty inputs
- No unhandled exceptions

### 6.3 Period/Rate Normalization (Required)

- Calculator MUST compute and display interest rate per period and effective period count.
- If `Compounding Frequency` is not selected, interpret the user-entered interest rate as the rate per selected period type (Years = per year, Months = per month).
- If `Compounding Frequency` is selected, rate/period and effective periods MUST be normalized the same way as the existing Finance `present-value` / `future-value` calculators to ensure consistent Time Value of Money behavior across Finance.

---

## 7. Explanation Pane (SEO-Critical)

### 7.1 H2 — Summary

The future value of an annuity shows how much a series of regular payments will be worth at a future date after earning interest over time.

This calculator computes the future value of an ordinary annuity and the future value of an annuity due using your payment amount, interest rate, number of periods, and payment timing.

It is commonly used for savings plans, retirement contributions, investment growth, and long-term financial planning.

### 7.2 H3 — Scenario Summary

| Category | Value | Source |
|----------|-------|--------|
| Payment Amount | {PMT} | Calculation Pane |
| Interest Rate | {INTEREST_RATE}% | Calculation Pane |
| Number of Periods | {PERIODS} | Calculation Pane |
| Annuity Type | {ANNUITY_TYPE} | Calculation Pane |
| Future Value of Annuity | {FV_ANNUITY} | Calculator Engine |

### 7.3 H3 — Results Table

| Metric | Value | Unit | Explanation |
|--------|-------|------|-------------|
| Future Value of Annuity | {FV_ANNUITY} | Currency | Value at end of term |
| Payment Amount | {PMT} | Currency | Regular contribution |
| Total Contributions | {TOTAL_PAYMENTS} | Currency | Sum of payments |
| Annuity Type | {ANNUITY_TYPE} | — | Ordinary or Due |
| Effective Periods | {TOTAL_PERIODS} | Periods | Total periods |

### 7.4 H3 — Explanation

The future value of an annuity represents the total value of a series of regular payments at a future point in time, assuming the payments earn interest over each period.

It answers a common financial question: how much will my regular contributions grow into over time?

There are two main types of annuities used in future value calculations:

In an ordinary annuity, payments are made at the end of each period.

In an annuity due, payments are made at the beginning of each period.

Because annuity due payments are invested earlier, they earn interest for a longer period, resulting in a higher future value than an ordinary annuity when all other factors are the same.

Future value of annuity calculations are widely used for retirement savings, education funds, investment plans, and long-term financial goals involving recurring contributions.

### 7.5 H3 — Ordinary Annuity vs Annuity Due

| Feature | Ordinary Annuity | Annuity Due |
|---------|------------------|-------------|
| Payment Timing | End of period | Beginning of period |
| First Payment | After first period | Immediately |
| Future Value | Lower | Higher |
| Interest Earned | Less | More |
| Common Examples | Savings plans | Retirement contributions |
| Formula Basis | Standard FV formula | FV × (1 + r) |

### 7.6 H3 — Frequently Asked Questions (Exactly 10)

**1. What is the future value of an annuity?**

The future value of an annuity is the total value of a series of regular payments at a future date after earning interest over time.

**2. What is the difference between an ordinary annuity and an annuity due?**

In an ordinary annuity, payments are made at the end of each period, while in an annuity due, payments are made at the beginning of each period.

**3. Why is the future value of an annuity due higher?**

An annuity due has a higher future value because payments are invested earlier and earn interest for a longer time.

**4. How do you calculate the future value of an ordinary annuity?**

The future value of an ordinary annuity is calculated by compounding each payment made at the end of each period using the interest rate.

**5. How do you calculate the future value of an annuity due?**

The future value of an annuity due is calculated by adjusting the ordinary annuity future value to account for payments made at the beginning of each period.

**6. What interest rate should be used in future value calculations?**

The interest rate should reflect expected investment returns, savings rates, or long-term growth assumptions relevant to the contributions.

**7. Is the future value of annuity useful for retirement planning?**

Yes, it is commonly used to estimate how regular retirement contributions will grow over time.

**8. Can this calculator be used for monthly contributions?**

Yes, the calculator supports monthly, quarterly, and annual contribution periods.

**9. What happens if the interest rate is zero?**

If the interest rate is zero, the future value of the annuity equals the total amount of all contributions.

**10. Is future value of annuity used for investment planning?**

Yes, it is widely used to evaluate savings plans, investment strategies, and long-term financial goals.

---

## 8. SEO Metadata

**H1:** Future Value of Annuity Calculator

**Title:**
```
Future Value of Annuity Calculator (Ordinary & Due) – CalcHowMuch
```

**Meta Description:**
```
Calculate the future value of an annuity. Compare ordinary annuity vs annuity due using payment amount, interest rate, and periods.
```

---

## 9. Structured Data (JSON-LD)

### 1) WebPage

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Future Value of Annuity Calculator",
  "url": "https://calchowmuch.com/finance/future-value-of-annuity/",
  "description": "Calculate the future value of an annuity. Compare ordinary annuity and annuity due using payment amount, interest rate, and number of periods.",
  "inLanguage": "en"
}
```

### 2) SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Future Value of Annuity Calculator",
  "applicationCategory": "FinanceApplication",
  "applicationSubCategory": "Time Value of Money Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/finance/future-value-of-annuity/",
  "description": "Free future value of annuity calculator for ordinary annuity and annuity due.",
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

### 3) FAQPage (Exact Match Required)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the future value of an annuity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The future value of an annuity is the total value of a series of regular payments at a future date after earning interest over time."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between an ordinary annuity and an annuity due?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In an ordinary annuity, payments are made at the end of each period, while in an annuity due, payments are made at the beginning of each period."
      }
    },
    {
      "@type": "Question",
      "name": "Why is the future value of an annuity due higher?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An annuity due has a higher future value because payments are invested earlier and earn interest for a longer time."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate the future value of an ordinary annuity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The future value of an ordinary annuity is calculated by compounding each payment made at the end of each period using the interest rate."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate the future value of an annuity due?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The future value of an annuity due is calculated by adjusting the ordinary annuity future value to account for payments made at the beginning of each period."
      }
    },
    {
      "@type": "Question",
      "name": "What interest rate should be used in future value calculations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The interest rate should reflect expected investment returns, savings rates, or long-term growth assumptions."
      }
    },
    {
      "@type": "Question",
      "name": "Is the future value of annuity useful for retirement planning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, it is commonly used to estimate how regular retirement contributions will grow over time."
      }
    },
    {
      "@type": "Question",
      "name": "Can this calculator be used for monthly contributions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the calculator supports monthly, quarterly, and annual contribution periods."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the interest rate is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If the interest rate is zero, the future value of the annuity equals the total amount of all contributions."
      }
    },
    {
      "@type": "Question",
      "name": "Is future value of annuity used for investment planning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, it is widely used to evaluate savings plans, investment strategies, and long-term financial goals."
      }
    }
  ]
}
```

### 4) BreadcrumbList

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
      "name": "Future Value of Annuity",
      "item": "https://calchowmuch.com/finance/future-value-of-annuity/"
    }
  ]
}
```

---

## 10. Sitemap & Testing

Update:

- public/config/navigation.json
- sitemap.xml
- /sitemap
- public/calculators/index.html

Rules:

- `sitemap.xml` MUST list every active calculator URL (FS-4.2)
- New calculator REQs MUST include sitemap coverage as an acceptance criterion (DOC-SITEMAP-5)

Tests required: Unit, ISS-001, E2E, SEO P1–P5

SEO phase tracking file:

- `requirements/seo/REQ-20260207-003.md`

---

## 11. Workflow

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE
