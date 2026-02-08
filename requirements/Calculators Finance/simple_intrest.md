REQ-20260207-008
Simple Interest Calculator — Finance Category
============================================

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

**How much interest will I earn or owe using simple interest over a period of time?**

This calculator targets users who want:

- total interest using simple interest (no compounding)
- ending amount (principal + interest)
- easy comparison vs compound interest

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords MUST be explicitly supported in:

- H1
- title
- meta description
- explanation copy
- FAQ questions

| Keyword Type | Keywords |
|--------------|----------|
| **Primary** | simple interest calculator, simple interest |
| **Secondary** | simple interest formula, calculate simple interest, simple interest rate calculator |
| **Long-tail / Intent** | how to calculate simple interest, simple interest calculator monthly, simple interest calculator yearly, simple interest vs compound interest, simple interest on loan |

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

- Display name must be exactly "Simple Interest"
- Navigation must be config-driven
- One calculator per page

---

## 3. URL & Page Model (SEO + MVP)

**Canonical URL**

```
/finance/simple-interest/
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
/public/calculators/finance/simple-interest/
├── index.html          # Calculation pane fragment (NOT full page)
├── module.js           # UI glue + simple interest compute
├── explanation.html    # Explanation pane fragment (SEO-critical)
└── calculator.css      # Optional per-calculator styling
```

**Generated output (do not hand-edit):**

```text
/public/finance/simple-interest/index.html
```

---

## 5. Calculation Pane Requirements

**H2**

Simple Interest Calculator

### Inputs

| Section | Input | Type | Required | Notes |
|---------|-------|------|----------|-------|
| **Core (Above the Fold)** | Principal Amount (P) | Number | Yes | Currency |
| **Core (Above the Fold)** | Interest Rate (%) | Number | Yes | Annual rate, decimals allowed |
| **Core (Above the Fold)** | Time Period | Number | Yes | Positive |
| **Core (Above the Fold)** | Time Unit | Button Toggle | Yes | Years / Months |
| **Optional (Progressive Disclosure)** | Interest Basis | Button Group | No | "Per Year" (default) / "Per Month" |

**Rules**

- No dropdowns (UI-2.5)
- Button groups only
- Optional inputs must not block calculation
- Progressive disclosure section must be clearly visible and collapsible

Additional universal rules:

- Validate all inputs (UI-2.3, CS-1.3)
- Cap input length to 12 characters (UI-2.4)

---

## 6. Calculator Engine (Logic)

### 6.1 Core Formula (Authoritative)

**Simple Interest:**

```
I = P × r × t
A = P + I
```

**Where:**

- P = principal
- r = interest rate (decimal)
- t = time in years
- If time unit = months: t = months / 12

**If Interest Basis = Per Month:**

Convert monthly rate to annual-equivalent time handling:

- Use r_month = rate_decimal and t_months = months
- Then I = P × r_month × t_months
- If user selects years with monthly basis, convert: t_months = years × 12

### 6.2 Outputs

| Output | Required |
|--------|----------|
| Total Interest | Yes |
| Ending Amount (Principal + Interest) | Yes |
| Principal Used | Yes |
| Rate Used | Yes |
| Time Used (normalized) | Yes |

### 6.3 Validation Rules

- Prevent negative principal
- Prevent negative time
- Prevent negative rate
- No unhandled exceptions

---

## 7. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 7.1 H2 — Summary (Keyword-Dense, Natural)

Simple interest is calculated only on the original principal and does not include interest-on-interest. This makes it straightforward for estimating basic loan interest or simple savings growth.

This simple interest calculator computes the total interest and the ending amount based on principal, rate, and time, and helps compare simple interest vs compound interest.

### 7.2 H3 — Scenario Summary

| Category | Value | Source |
|----------|-------|--------|
| Principal Amount | {PRINCIPAL} | Calculation Pane |
| Interest Rate | {RATE}% | Calculation Pane |
| Time Period | {TIME} | Calculation Pane |
| Time Unit | {TIME_UNIT} | Calculation Pane |
| Interest Basis | {BASIS} | Calculation Pane |
| Total Interest | {TOTAL_INTEREST} | Calculator Engine |
| Ending Amount | {ENDING_AMOUNT} | Calculator Engine |

### 7.3 H3 — Results Table

| Metric | Value | Unit | Explanation |
|--------|-------|------|-------------|
| Total Interest | {TOTAL_INTEREST} | Currency | Interest earned/owed |
| Ending Amount | {ENDING_AMOUNT} | Currency | Principal + interest |
| Principal | {PRINCIPAL} | Currency | Starting amount |
| Rate | {RATE} | % | Interest rate used |
| Time (Years) | {T_YEARS} | Years | Normalized duration |
| Formula | I = P×r×t | — | Core simple interest formula |

### 7.4 H3 — Explanation (SEO-Optimized)

Simple interest calculates interest only on the original principal. Unlike compound interest, it does not add previously earned interest back into the balance, so growth is linear over time.

Because the formula is simple and predictable, simple interest is often used for basic loans, short-term borrowing, and quick interest estimates where compounding is not applied.

### 7.5 H3 — Frequently Asked Questions (Exactly 10)

**1. What is simple interest?**

Simple interest is interest calculated only on the original principal amount.

**2. What is the simple interest formula?**

A common formula is I = P × r × t, where P is principal, r is rate, and t is time.

**3. How do you calculate simple interest?**

Multiply the principal by the rate and the time period to get total interest.

**4. What is the ending amount with simple interest?**

The ending amount is A = P + I, which is principal plus total interest.

**5. What is the difference between simple and compound interest?**

Simple interest applies only to principal, while compound interest applies to principal plus accumulated interest.

**6. Can I use this for a simple interest loan calculation?**

Yes. It can estimate interest owed on loans that use simple interest.

**7. Does simple interest grow linearly?**

Yes. With a fixed rate, simple interest increases at a constant amount over time.

**8. How do I calculate simple interest for months?**

Convert months to years by dividing by 12, then apply the same formula.

**9. What happens if the interest rate is 0%?**

Total interest is zero and the ending amount equals the principal.

**10. Is simple interest common for long-term investing?**

Generally no. Long-term investing more often involves compounding, but simple interest is useful for quick comparisons.

---

## 8. SEO Requirements (Top-Ranking Focus)

### 8.1 Metadata (Keyword-Optimized)

**H1:** Simple Interest Calculator

**Title:**
```
Simple Interest Calculator – CalcHowMuch
```

**Meta Description:**
```
Calculate simple interest to find total interest and ending amount using principal, rate, and time. Compare simple vs compound interest quickly.
```

---

## 9. Structured Data (JSON-LD — REQUIRED)

**Placement Rule**

All JSON-LD scripts below must be embedded only on:

- /finance/simple-interest/
- Page-scoped only (no global FAQPage injection)

### 1) WebPage (Required)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Simple Interest Calculator",
  "url": "https://calchowmuch.com/finance/simple-interest/",
  "description": "Calculate simple interest to estimate total interest and ending amount based on principal, rate, and time.",
  "inLanguage": "en"
}
```

### 2) SoftwareApplication (Calculator-Specific, Required)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Simple Interest Calculator",
  "applicationCategory": "FinanceApplication",
  "applicationSubCategory": "Interest & Growth Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/finance/simple-interest/",
  "description": "Free simple interest calculator to compute total interest and ending amount using principal, rate, and time.",
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
      "name": "What is simple interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simple interest is interest calculated only on the original principal amount."
      }
    },
    {
      "@type": "Question",
      "name": "What is the simple interest formula?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A common formula is I = P × r × t, where P is principal, r is rate, and t is time."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate simple interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multiply the principal by the rate and the time period to get total interest."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ending amount with simple interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The ending amount is A = P + I, which is principal plus total interest."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between simple and compound interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simple interest applies only to principal, while compound interest applies to principal plus accumulated interest."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this for a simple interest loan calculation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It can estimate interest owed on loans that use simple interest."
      }
    },
    {
      "@type": "Question",
      "name": "Does simple interest grow linearly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. With a fixed rate, simple interest increases at a constant amount over time."
      }
    },
    {
      "@type": "Question",
      "name": "How do I calculate simple interest for months?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Convert months to years by dividing by 12, then apply the same formula."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if the interest rate is 0%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Total interest is zero and the ending amount equals the principal."
      }
    },
    {
      "@type": "Question",
      "name": "Is simple interest common for long-term investing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Generally no. Long-term investing more often involves compounding, but simple interest is useful for quick comparisons."
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
      "name": "Simple Interest",
      "item": "https://calchowmuch.com/finance/simple-interest/"
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
| Unit (simple interest logic) | ✅ |
| ISS-001 | ✅ |
| E2E | ✅ |
| SEO-P1 → P5 | ✅ |

---

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

---

## 13. Acceptance Criteria

- Ranks for "simple interest calculator" and long-tail variants
- Correct interest + ending amount for years/months
- Explanation pane crawlable and keyword-aligned
- Rich Results Test shows FAQPage (10 Qs) + BreadcrumbList
- No schema scope violations (no global FAQPage)

SEO phase tracking file:

- `requirements/seo/REQ-20260207-008.md`
