REQ-20260207-005
Compound Interest Calculator — Finance Category
=============================================

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

**How much will my money grow with compound interest over time?**

Users typically want:

- ending balance after compounding
- total interest earned
- effect of contributions and compounding frequency

Compound interest is commonly described as "interest on principal plus accumulated interest."

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords MUST be explicitly supported in:

- H1
- title
- meta description
- explanation copy
- FAQ questions

| Keyword Type | Keywords |
|--------------|----------|
| **Primary** | compound interest calculator, compound interest |
| **Secondary** | compound interest formula, calculate compound interest, compounding interest calculator |
| **Long-tail / Intent** | how to calculate compound interest, compound interest calculator with contributions, compound interest calculator monthly, compound interest calculator daily, compound interest calculator savings |

(Formula reference commonly used: A = P(1 + r/n)^(nt) )

---

## 2. Category & Navigation Requirements

### 2.1 Top-Level Category

**Top Navigation Button:** Finance

**Category:** Interest & Growth

### 2.2 Left Navigation Structure (Finance)

```
Finance
└── Interest & Growth
    ├── Simple Interest
    ├── Compound Interest
    └── Effective Annual Rate (EAR)
```

**Rules**

- Display name must be exactly "Compound Interest"
- Navigation must be config-driven
- One calculator per page

---

## 3. URL & Page Model (SEO + MVP)

**Canonical URL**

```
/finance/compound-interest/
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
/public/calculators/finance/compound-interest/
├── index.html          # Calculation pane fragment (NOT full page)
├── module.js           # UI glue + compound interest compute
├── explanation.html    # Explanation pane fragment (SEO-critical)
└── calculator.css      # Optional per-calculator styling
```

**Generated output (do not hand-edit):**

```text
/public/finance/compound-interest/index.html
```

---

## 5. Calculation Pane Requirements

**H2**

Compound Interest Calculator

### Inputs

| Section | Input | Type | Required | Notes |
|---------|-------|------|----------|-------|
| **Core (Above the Fold)** | Initial Principal (P) | Number | Yes | Currency |
| **Core (Above the Fold)** | Annual Interest Rate (%) | Number | Yes | Accept decimals |
| **Core (Above the Fold)** | Time Period | Number | Yes | Positive |
| **Core (Above the Fold)** | Time Unit | Button Toggle | Yes | Years / Months |
| **Core (Above the Fold)** | Compounding Frequency | Button Group | Yes | Annual, Semi-Annual, Quarterly, Monthly, Daily |
| **Optional (Progressive Disclosure)** | Regular Contribution | Number | No | Currency |
| **Optional (Progressive Disclosure)** | Contribution Frequency | Button Group | No | Monthly / Quarterly / Annually |
| **Optional (Progressive Disclosure)** | Contribution Timing | Button Toggle | No | End of period / Beginning of period |

**Rules**

- No dropdowns (UI-2.5)
- Optional inputs must not block calculation
- Progressive disclosure section must be clearly visible and collapsible
- "Daily" uses n = 365 (fixed)

Additional universal rules:

- Validate all inputs (UI-2.3, CS-1.3)
- Cap input length to 12 characters (UI-2.4)

---

## 6. Calculator Engine (Logic)

### 6.1 Core Formula (Authoritative)

**Base compound growth (no contributions):**

```
A = P × (1 + r/n)^(n×t)
```

**Where:**

- P = initial principal
- r = annual rate (decimal)
- n = compounding periods per year
- t = years (if months are used, t = months/12)

### 6.2 Contributions (If Enabled)

If contributions are enabled, engine MUST compute:

- ending balance including contributions
- total contributions
- total interest earned

**Implementation rule:**

Use periodic simulation based on the smallest applicable interval (compounding period vs contribution period).

Must remain deterministic and stable (no floating drift causing cents oscillation). Round display values to 2 decimals; internal can keep higher precision.

### 6.3 Outputs

| Output | Required |
|--------|----------|
| Ending Balance | Yes |
| Total Interest Earned | Yes |
| Total Contributions | Yes (0 if not used) |
| Initial Principal | Yes |
| Rate Used | Yes |
| Compounding Frequency | Yes |
| Effective Period Count | Yes |

### 6.4 Validation Rules

- Prevent negative principal
- Prevent negative time
- Prevent zero/negative compounding periods
- Prevent invalid contribution frequency when contribution value is empty
- No unhandled exceptions

---

## 7. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 7.1 H2 — Summary (Keyword-Dense, Natural)

Compound interest is interest calculated on both the original principal and the interest that has already been added, which can make balances grow faster over time.

This compound interest calculator estimates your ending balance, total interest earned, and how compounding frequency and regular contributions affect long-term growth.

### 7.2 H3 — Scenario Summary

| Category | Value | Source |
|----------|-------|--------|
| Initial Principal | {PRINCIPAL} | Calculation Pane |
| Annual Interest Rate | {RATE}% | Calculation Pane |
| Time Period | {TIME} | Calculation Pane |
| Time Unit | {TIME_UNIT} | Calculation Pane |
| Compounding Frequency | {COMPOUNDING_FREQUENCY} | Calculation Pane |
| Regular Contribution | {CONTRIBUTION} | Calculation Pane |
| Contribution Frequency | {CONTRIBUTION_FREQUENCY} | Calculation Pane |
| Ending Balance | {ENDING_BALANCE} | Calculator Engine |

### 7.3 H3 — Results Table

| Metric | Value | Unit | Explanation |
|--------|-------|------|-------------|
| Ending Balance | {ENDING_BALANCE} | Currency | Total value after compounding |
| Total Interest Earned | {TOTAL_INTEREST} | Currency | Growth beyond principal + contributions |
| Total Contributions | {TOTAL_CONTRIBUTIONS} | Currency | Sum of added deposits |
| Initial Principal | {PRINCIPAL} | Currency | Starting amount |
| Annual Rate | {RATE} | % | Interest rate used |
| Compounding Periods/Year | {N} | — | Frequency converted to periods |
| Total Compounding Periods | {TOTAL_PERIODS} | Periods | n × t |

### 7.4 H3 — Explanation (SEO-Optimized)

Compound interest grows money by applying interest repeatedly to a balance that already includes previous interest. This is why longer timelines and more frequent compounding can significantly increase the ending balance.

The standard compound interest formula uses principal, interest rate, compounding frequency, and time to estimate the final amount.

If you add regular contributions, the ending balance can increase further because each contribution can also earn compound interest over the remaining time.

### 7.5 H3 — Frequently Asked Questions (Exactly 10)

**1. What is compound interest?**

Compound interest is interest calculated on the initial principal and on previously accumulated interest.

**2. What is the compound interest formula?**

A common compound interest formula is A = P × (1 + r/n)^(n×t).

**3. How do you calculate compound interest?**

You calculate compound interest by applying the compound interest formula using your principal, rate, compounding frequency, and time.

**4. What is the difference between simple and compound interest?**

Simple interest is calculated only on the principal, while compound interest is calculated on principal plus accumulated interest.

**5. Does compounding monthly increase returns?**

Monthly compounding generally produces a higher ending balance than annual compounding at the same nominal rate.

**6. What does compounding frequency mean?**

Compounding frequency is how often interest is added to the balance each year.

**7. Can I use this as a savings compound interest calculator?**

Yes. You can estimate savings growth using an initial balance, interest rate, time, and optional contributions.

**8. How do contributions affect compound interest?**

Contributions increase the balance and can also earn interest, raising the final amount over time.

**9. What happens if the interest rate is 0%?**

If the interest rate is 0%, the ending balance equals the principal plus any contributions.

**10. Is compound interest useful for investing?**

Yes. Compound interest helps estimate long-term growth for investments, savings, and retirement planning.

---

## 8. SEO Requirements (Top-Ranking Focus)

### 8.1 Metadata (Keyword-Optimized)

**H1:** Compound Interest Calculator

**Title:**
```
Compound Interest Calculator – CalcHowMuch
```

**Meta Description:**
```
Calculate compound interest to estimate your ending balance, total interest earned, and growth over time. Supports monthly, daily, and contributions.
```

---

## 9. Structured Data (JSON-LD — REQUIRED)

**Placement Rule**

All JSON-LD scripts below must be embedded on:

- /finance/compound-interest/
- Page-scoped only (no global FAQPage injection)

Schema types are defined on Schema.org for WebPage, FAQPage, and BreadcrumbList.

### 1) WebPage (Required)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Compound Interest Calculator",
  "url": "https://calchowmuch.com/finance/compound-interest/",
  "description": "Calculate compound interest to estimate ending balance and total interest earned based on principal, rate, time, and compounding frequency.",
  "inLanguage": "en"
}
```

### 2) SoftwareApplication (Calculator-Specific, Required)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Compound Interest Calculator",
  "applicationCategory": "FinanceApplication",
  "applicationSubCategory": "Interest & Growth Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/finance/compound-interest/",
  "description": "Free compound interest calculator to estimate ending balance, total interest earned, and the impact of compounding frequency and contributions.",
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
      "name": "What is compound interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Compound interest is interest calculated on the initial principal and on previously accumulated interest."
      }
    },
    {
      "@type": "Question",
      "name": "What is the compound interest formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A common compound interest formula is A = P × (1 + r/n)^(n×t)."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate compound interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You calculate compound interest by applying the compound interest formula using your principal, rate, compounding frequency, and time."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between simple and compound interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simple interest is calculated only on the principal, while compound interest is calculated on principal plus accumulated interest."
      }
    },
    {
      "@type": "Question",
      "name": "Does compounding monthly increase returns?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Monthly compounding generally produces a higher ending balance than annual compounding at the same nominal rate."
      }
    },
    {
      "@type": "Question",
      "name": "What does compounding frequency mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Compounding frequency is how often interest is added to the balance each year."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this as a savings compound interest calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can estimate savings growth using an initial balance, interest rate, time, and optional contributions."
      }
    },
    {
      "@type": "Question",
      "name": "How do contributions affect compound interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Contributions increase the balance and can also earn interest, raising the final amount over time."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the interest rate is 0%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If the interest rate is 0%, the ending balance equals the principal plus any contributions."
      }
    },
    {
      "@type": "Question",
      "name": "Is compound interest useful for investing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Compound interest helps estimate long-term growth for investments, savings, and retirement planning."
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
      "name": "Compound Interest",
      "item": "https://calchowmuch.com/finance/compound-interest/"
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

**Change Type:** New calculator

Tests required: Unit, ISS-001, E2E, SEO P1–P5

SEO phase tracking file:

- `requirements/seo/REQ-20260207-005.md`

---

## 11. Workflow

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

---

## 12. Acceptance Criteria

- Ranks for "compound interest calculator" and related long-tail queries
- Correct calculations for all compounding frequencies
- Contributions produce deterministic, stable results
- Explanation pane crawlable and keyword-aligned
- Rich Results Test shows FAQPage (10 Qs) and BreadcrumbList
- No schema scope violations (no global FAQPage)
