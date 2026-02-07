# Present Value of Annuity Calculator (Ordinary & Due)

**Status:** NEW

**Type:** Brand-new calculator (Finance → Time Value of Money)
**FSM Phase:** REQ

**Scope:** UI, Compute, Navigation, SEO, Sitemap, Testing

## 1. Purpose & Search Intent (SEO-Critical)

### 1.1 Primary User Question (Single-Question Rule)

What is the present value of a series of regular payments (annuity)?
This calculator answers one focused, high-intent financial question used by:

- investors
- students
- mortgage & loan planners
- retirement planners
- finance professionals

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords MUST be explicitly supported in:

- H1
- title
- meta description
- explanation copy
- FAQ questions

| Keyword Type | Keywords |
| --- | --- |
| Primary Keywords | • present value of annuity, • PV of annuity, • annuity present value calculator, • present value of annuity calculator |
| Secondary Keywords | • present value of ordinary annuity, • present value of annuity due, • annuity due calculator, • PV ordinary annuity calculator |
| Long-Tail / Intent Keywords | • how to calculate present value of annuity, • present value of annuity formula, • annuity present value example, • PV of annuity with monthly payments |

## 2. Category & Navigation Requirements

### 2.1 Top-Level Category

- Top Navigation Button: Finance
- Category: Time Value of Money

### 2.2 Left Navigation Structure (Finance)

```text
Finance
└── Time Value of Money
    ├── Present Value (PV)
    ├── Future Value (FV)
    └── Present Value of Annuity
```

#### Rules

- Display name must be exactly "Present Value of Annuity"
- Annuity type handled within the calculator, not as separate pages
- Navigation must be config-driven

## 3. URL & Page Model (SEO + MVP)

### Canonical URL

`/finance/present-value-of-annuity/`

### Architecture

- Multi-Page Application (MPA)
- One calculator per page
- Full page reload
- Crawlable explanation pane

### SEO Rule

- One calculator page must target both ordinary annuity and annuity due
- Do not split into two URLs (avoids keyword cannibalization)

## 4. Folder & File Structure

```text
/public/calculators/finance/present-value-of-annuity/
├── index.html          # Calculator shell + calculation pane
├── module.js           # PV annuity logic (ordinary + due)
└── explanation.html    # Static explanation pane (SEO-critical)
```

## 5. Calculation Pane Requirements

**H2 :-** Present Value of Annuity Calculator (Ordinary & Due)

| Section | Input | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Core Inputs (Above the Fold) | Payment Amount (PMT) | Number | Yes | |
| Core Inputs (Above the Fold) | Discount Rate (%) | Number | Yes | |
| Core Inputs (Above the Fold) | Number of Periods | Number | Yes | |
| Core Inputs (Above the Fold) | Period Type | Button Toggle (Years / Months) | Yes | |
| Core Inputs (Above the Fold) | Annuity Type | Button Toggle (Ordinary / Due) | Yes | Toggle is mandatory and must be visible by default |
| Optional Inputs (Progressive Disclosure) | Compounding Frequency | Button Group (Annual, Quarterly, Monthly) | No | |

**Rules:**

- No dropdowns
- Optional inputs must not block calculation
- Users needs to expand or close option for Optional Inputs. This is must be clearly visible.

## 6. Calculator Engine (Logic)

### 6.1 Core Formulas (Authoritative)

#### Present Value of Ordinary Annuity

PV = PMT × [1 − (1 + r)⁻ⁿ] ÷ r

#### Present Value of Annuity Due

PVdue = PVordinary × (1 + r)

**Where:**

- PMT = periodic payment
- r = periodic discount rate
- n = number of periods

### 6.2 Outputs

| Output | Required |
| --- | --- |
| Present Value of Annuity | Yes |
| Annuity Type Applied | Yes |
| Total Payments | Yes |
| Discount Rate per Period | Yes |
| Effective Period Count | Yes |

#### Validation Rules

- Prevent divide-by-zero
- Validate negative / empty inputs
- No unhandled exceptions

## 7. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 7.1 H2 — Summary (Keyword-Dense, Natural)

The present value of an annuity shows how much a series of regular future payments is worth today, after applying a discount rate.

This calculator computes the present value of an ordinary annuity and the present value of an annuity due, based on payment amount, number of periods, and timing of payments.
It is commonly used to evaluate loans, mortgages, leases, pensions, and retirement income in today's terms.

### 7.2 H3 — Scenario Summary

| Category | Value | Source |
| --- | --- | --- |
| Payment Amount | {PMT} | Calculation Pane |
| Discount Rate | {DISCOUNT_RATE}% | Calculation Pane |
| Number of Periods | {PERIODS} | Calculation Pane |
| Annuity Type | {ANNUITY_TYPE} | Calculation Pane |
| Present Value of Annuity | {PV_ANNUITY} | Calculator Engine |

### 7.3 H3 — Results Table

| Metric | Value | Unit | Explanation |
| --- | --- | --- | --- |
| Present Value of Annuity | {PV_ANNUITY} | Currency | Value of payments today |
| Payment Amount | {PMT} | Currency | Regular payment |
| Total Payments | {TOTAL_PAYMENTS} | Currency | Sum of all payments |
| Annuity Type | {ANNUITY_TYPE} | — | Ordinary or Due |
| Effective Periods | {TOTAL_PERIODS} | Periods | Total payment periods |

### 7.4 H3 — Explanation (SEO-Optimized)

The present value of an annuity is the value today of a series of regular future payments, discounted using a specified interest or discount rate.

It answers a common financial question: how much are recurring payments worth in today's money?

There are two main types of annuities used in present value calculations:

- In an ordinary annuity, payments are made at the end of each period (for example, loan repayments or bond coupons).
- In an annuity due, payments are made at the beginning of each period (such as rent, lease payments, or insurance premiums).

Because payments in an annuity due are received earlier, the present value of an annuity due is always higher than the present value of an ordinary annuity when all other factors are the same.
This calculator applies the appropriate present value of annuity formula based on the selected annuity type.

It uses your payment amount, discount rate, and number of periods to discount each payment back to today, producing the total present value of the annuity.
Present value of annuity calculations are widely used in loans, mortgages, leases, pensions, retirement planning, and investment analysis, where comparing future cash flows in today's terms is essential for making informed financial decisions.

### H3 -- Ordinary Annuity vs Annuity Due

| Feature | Ordinary Annuity | Annuity Due |
| --- | --- | --- |
| Payment Timing | End of each period | Beginning of each period |
| First Payment Occurs | After first period | Immediately |
| Present Value | Lower | Higher |
| Discounting | More discounting applied | Less discounting applied |
| Common Examples | Loan repayments, bond coupons | Rent, lease payments, insurance premiums |
| Formula Basis | Standard annuity PV formula | Ordinary annuity PV × (1 + r) |
| Cash Flow Timing | Later | Earlier |
| Typical Use Case | Loans and investments | Leases and pensions |

### 7.5 H3 — Frequently Asked Questions (Exactly 10)

1. What is the present value of an annuity?
   The present value of an annuity is the value today of a series of regular future payments, discounted using a specific interest or discount rate.
2. What is the difference between an ordinary annuity and an annuity due?
   In an ordinary annuity, payments occur at the end of each period, while in an annuity due, payments occur at the beginning of each period.
3. Why is the present value of an annuity due higher than an ordinary annuity?
   An annuity due has a higher present value because payments are received earlier and are discounted for fewer periods.
4. How do you calculate the present value of an ordinary annuity?
   The present value of an ordinary annuity is calculated by discounting each payment made at the end of each period back to today using the discount rate.
5. How do you calculate the present value of an annuity due?
   The present value of an annuity due is calculated by adjusting the ordinary annuity present value to account for payments made at the beginning of each period.
6. What discount rate should be used for annuity calculations?
   The discount rate should reflect interest rates, investment returns, inflation expectations, or borrowing costs relevant to the cash flow.
7. Is the present value of annuity used for loans and mortgages?
   Yes, present value of annuity calculations are commonly used to value loan repayments, mortgages, and lease payments.
8. Can this calculator be used for monthly annuity payments?
   Yes, the calculator supports monthly, quarterly, and annual payment periods depending on the selected settings.
9. What happens if the discount rate is zero?
   If the discount rate is zero, the present value of the annuity equals the total amount of all payments.
10. Is the present value of annuity useful for retirement planning?
    Yes, it is widely used to estimate the value of pensions, retirement income streams, and long-term annuity payments.

## 8. SEO Requirements (Top-Ranking Focus)

### 8.1 Metadata (Keyword-Optimized)

- H1: Present Value of Annuity Calculator
- Title: Present Value of Annuity Calculator (Ordinary & Due) – CalcHowMuch
- Meta Description:

Calculate the present value of an annuity. Compare ordinary annuity vs annuity due using payment amount, rate, and periods with our free calculator.

Below is the complete, production-ready Structured Data bundle for the Present Value of Annuity (Ordinary & Due) Calculator, meeting SEO-P2 requirements exactly.
This is written to be:

- Google Rich Results compliant
- Keyword-aligned with your SERP strategy
- Safe to paste directly into the page
- One calculator = one bundle

**Placement:**

#### 1) WebPage (Required)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Present Value of Annuity Calculator",
  "url": "https://calchowmuch.com/finance/present-value-of-annuity/",
  "description": "Calculate the present value of an annuity. Compare ordinary annuity and annuity due using payment amount, discount rate, and number of periods.",
  "inLanguage": "en"
}
</script>
```

#### Why this matters

- Establishes page identity
- Supports indexing and snippet extraction

#### 2) SoftwareApplication (Calculator-Specific, Required)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Present Value of Annuity Calculator",
  "applicationCategory": "FinanceApplication",
  "applicationSubCategory": "Time Value of Money Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/finance/present-value-of-annuity/",
  "description": "Free present value of annuity calculator for ordinary annuity and annuity due. Calculates PV using payment amount, rate, and timing.",
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
</script>
```

#### Rules satisfied

- Exactly one SoftwareApplication
- Calculator clearly identified
- Free tool signal (price = 0)

#### 3) FAQPage (SERP-Optimized, Required)

This must match the SERP-optimized FAQ copy exactly.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the present value of an annuity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The present value of an annuity is the value today of a series of regular future payments, discounted using a specific interest or discount rate."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between an ordinary annuity and an annuity due?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In an ordinary annuity, payments occur at the end of each period, while in an annuity due, payments occur at the beginning of each period."
      }
    },
    {
      "@type": "Question",
      "name": "Why is the present value of an annuity due higher than an ordinary annuity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An annuity due has a higher present value because payments are received earlier and are discounted for fewer periods."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate the present value of an ordinary annuity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The present value of an ordinary annuity is calculated by discounting each payment made at the end of each period back to today using the discount rate."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate the present value of an annuity due?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The present value of an annuity due is calculated by adjusting the ordinary annuity present value to account for payments made at the beginning of each period."
      }
    },
    {
      "@type": "Question",
      "name": "What discount rate should be used for annuity calculations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The discount rate should reflect interest rates, investment returns, inflation expectations, or borrowing costs relevant to the cash flow."
      }
    },
    {
      "@type": "Question",
      "name": "Is the present value of annuity used for loans and mortgages?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, present value of annuity calculations are commonly used to value loan repayments, mortgages, and lease payments."
      }
    },
    {
      "@type": "Question",
      "name": "Can this calculator be used for monthly annuity payments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the calculator supports monthly, quarterly, and annual payment periods depending on the selected settings."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the discount rate is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If the discount rate is zero, the present value of the annuity equals the total amount of all payments."
      }
    },
    {
      "@type": "Question",
      "name": "Is the present value of annuity useful for retirement planning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, it is widely used to estimate the value of pensions, retirement income streams, and long-term annuity payments."
      }
    }
  ]
}
</script>
```

#### Critical

- Exactly 10 FAQs
- Text must match visible FAQ content
- No dynamic placeholders

#### 4) BreadcrumbList (Required)

```html
<script type="application/ld+json">
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
      "name": "Present Value of Annuity",
      "item": "https://calchowmuch.com/finance/present-value-of-annuity/"
    }
  ]
}
</script>
```

### FAQPage Scope Rule (Critical)

**Rule:**
Each calculator page MUST include its own page-scoped FAQPage JSON-LD.
Global or layout-level FAQPage structured data MUST NOT be injected on calculator pages.
The site-wide FAQPage schema is allowed only on the /faq route.

**Failure Mode:**
If a global FAQPage schema is present, Google may ignore calculator-specific FAQPage entities.

**Implementation Checklist (Maps Doc → Reality)**
Use this to verify your code, not the document.

#### On /finance/present-value-of-annuity/

- FAQPage JSON-LD exists only in this page
- No FAQPage JSON-LD from layout / app shell
- FAQs are visible in HTML (accordion OK, hidden display:none ❌)
- Rich Results Test shows 10 FAQs

#### On /faq

- Global FAQPage JSON-LD exists
- Calculator FAQPage schemas are not reused here

## 9. Sitemap & Indexing

Must update:

- sitemap.xml
- /sitemap
- public/calculators/index.html

## 10. Testing Requirements

**Change Type:** New calculator

| Test | Required |
| --- | --- |
| Unit (annuity logic) | ✅ |
| ISS-001 | ✅ |
| E2E | ✅ |
| SEO-P1 → P5 | ✅ |

## 11. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

| Section | Key Checklist Items |
| --- | --- |
| 1. Purpose & Search Intent | Primary question: "What is the PV of regular payments (annuity)?" Targeted users. - Primary/Secondary/Long-Tail Keywords in H1, title, meta, etc. |
| 2. Category & Navigation | - Top: Finance > Time Value of Money. - Left nav: Exact structure, display name, config-driven, no separate pages for annuity types. |
| 3. URL & Page Model | - Canonical: /finance/present-value-of-annuity/. - MPA, one calc/page, full reload, crawlable explanation. - Single page for both annuity types. |
| 4. Folder & File Structure | - Dir: /public/calculators/finance/present-value-of-annuity/. - Files: index.html, module.js, explanation.html. |
| Implementation note: | All Tables implemented as a semantic HTML table with column headers preserved during Word → Markdown/HTML conversion. |
| 5. Calculation Pane | - H2: Present Value of Annuity Calculator (Ordinary & Due). - Core Inputs: PMT, Discount Rate, Periods, Period Type (toggle), Annuity Type (toggle, visible default). - Optional: Compounding Frequency (button group). - Rules: No dropdowns, optionals non-blocking, expandable section visible. |
| 6. Calculator Engine | - Formulas: Ordinary PV, Due PV, variables defined. - Outputs: PV Annuity, Type Applied, Total Payments, Rate/Period, Period Count. - Validation: No divide-by-zero, negative/empty inputs, no exceptions. |
| 7. Explanation Pane | - Implement Universal Standard. - H2 Summary: Keyword-dense text. - H3 Scenario Summary: Table with dynamic values. - H3 Results Table: Metrics with units/explanations. - H3 Explanation: Text on PV, types, uses, comparison table. - H3 FAQs: Exactly 10 with provided Q&A. |
| 8. SEO Requirements | - Metadata: H1, Title, Meta Description as specified. - Structured Data: WebPage, SoftwareApplication (one, free), FAQPage (10 exact), BreadcrumbList JSON-LD scripts. |

### Implementation Checklist (Maps Doc → Reality)

Use this to verify your code, not the document.

#### On /finance/present-value-of-annuity/

- FAQPage JSON-LD exists only in this page
- No FAQPage JSON-LD from layout / app shell
- FAQs are visible in HTML (accordion OK, hidden display:none ❌)
- Rich Results Test shows 10 FAQs

#### On /faq

- Global FAQPage JSON-LD exists
- Calculator FAQPage schemas are not reused here

| Section | Key Checklist Items |
| --- | --- |
| 9. Sitemap & Indexing | - Update sitemap.xml, /sitemap, public/calculators/index.html. |
| 10. Testing | - Unit (logic), ISS-001, E2E, SEO P1-P5 all ✅. |
| 11. Workflow | - Phases: REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE. |
| 12. Acceptance Criteria | - Ranks for key term, toggle functional, explanation natural/keyword-rich, SEO/tests pass, sitemap updated. No P0 failures. |
| 13. Strategic SEO | - All schemas detected (WebPage, SoftwareApp, FAQ, Breadcrumb), no errors, URLs canonical. |
