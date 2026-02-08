REQ-20260207-004
Effective Annual Rate (EAR) Converter — Finance Category
=======================================================

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

**What is the effective annual rate (EAR) of an interest rate with compounding?**

This calculator answers one focused, high-intent financial question used by:

- borrowers comparing loans
- credit card users
- investors
- finance students
- mortgage and savings planners

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords MUST be supported in:

- H1
- `<title>`
- meta description
- explanation pane
- FAQ questions

| Keyword Type | Keywords |
|--------------|----------|
| **Primary** | effective annual rate, EAR calculator, effective annual rate calculator |
| **Secondary** | nominal vs effective interest rate, annual equivalent rate, AER vs EAR |
| **Long-Tail / Intent** | how to calculate effective annual rate, effective annual rate formula, EAR with monthly compounding, convert nominal rate to EAR |

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

- Display name must be exactly "Effective Annual Rate"
- Navigation must be config-driven
- One calculator per concept (no merged pages)

---

## 3. URL & Page Model (SEO + MVP)

**Canonical URL**

```
/finance/effective-annual-rate/
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
/public/calculators/finance/effective-annual-rate/
├── index.html          # Calculation pane fragment (NOT full page)
├── module.js           # UI glue + EAR compute
├── explanation.html    # Explanation pane fragment (SEO-critical)
└── calculator.css      # Optional per-calculator styling
```

**Generated output (do not hand-edit):**

```text
/public/finance/effective-annual-rate/index.html
```

---

## 5. Calculation Pane Requirements

**H2**

Effective Annual Rate (EAR) Calculator

### Inputs

| Section | Input | Type | Required | Notes |
|---------|-------|------|----------|-------|
| **Core (Above the Fold)** | Nominal Interest Rate (%) | Number | Yes | Accept decimals |
| **Core (Above the Fold)** | Compounding Frequency | Button Group | Yes | Annual, Semi-Annual, Quarterly, Monthly, Daily |
| **Optional (Progressive Disclosure)** | Custom Compounding Periods | Number | No | Overrides preset |

**Rules**

- No dropdowns (UI-2.5)
- Button groups only
- Optional inputs must not block calculation
- Progressive disclosure must be visibly toggleable
- Validate all inputs (UI-2.3, CS-1.3)
- Cap input length to 12 characters (UI-2.4)

---

## 6. Calculator Engine (Logic)

### 6.1 Core Formula (Authoritative)

**Effective Annual Rate (EAR)**

```
EAR = (1 + r / n)ⁿ − 1
```

**Where:**

- r = nominal annual interest rate (decimal)
- n = number of compounding periods per year

### 6.2 Outputs

| Output | Required |
|--------|----------|
| Effective Annual Rate (EAR %) | Yes |
| Nominal Rate Used | Yes |
| Compounding Frequency | Yes |
| Compounding Periods per Year | Yes |

**Validation Rules**

- Prevent negative rates
- Prevent zero or negative compounding periods
- No unhandled exceptions

---

## 7. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 7.1 H2 — Summary

The effective annual rate (EAR) shows the true annual cost or return of an interest rate after accounting for compounding.

This calculator converts a nominal interest rate into an effective annual rate, allowing accurate comparison between loans, credit cards, and investment products that compound interest at different frequencies.

### 7.2 H3 — Scenario Summary

| Category | Value | Source |
|----------|-------|--------|
| Nominal Interest Rate | {NOMINAL_RATE}% | Calculation Pane |
| Compounding Frequency | {FREQUENCY} | Calculation Pane |
| Compounding Periods | {PERIODS} | Calculator Engine |
| Effective Annual Rate | {EAR}% | Calculator Engine |

### 7.3 H3 — Results Table

| Metric | Value | Unit | Explanation |
|--------|-------|------|-------------|
| Effective Annual Rate | {EAR} | % | True annual interest rate |
| Nominal Rate | {NOMINAL_RATE} | % | Stated annual rate |
| Compounding Frequency | {FREQUENCY} | — | Interest application frequency |
| Periods per Year | {PERIODS} | — | Compounding count |

### 7.4 H3 — Explanation

The effective annual rate (EAR) represents the actual yearly interest rate after taking compounding into account.

Nominal interest rates do not reflect how often interest is applied. When interest compounds more frequently—such as monthly or daily—the effective annual rate becomes higher than the nominal rate.

EAR allows borrowers and investors to accurately compare financial products with different compounding schedules, ensuring informed financial decisions.

### 7.5 H3 — Frequently Asked Questions (Exactly 10)

**1. What is the effective annual rate (EAR)?**

The effective annual rate is the true annual interest rate after accounting for compounding.

**2. How is EAR different from a nominal interest rate?**

Nominal rates do not include compounding effects, while EAR does.

**3. Why is EAR higher than the nominal rate?**

Because interest compounds multiple times per year.

**4. How do you calculate the effective annual rate?**

By applying the EAR formula using the nominal rate and compounding frequency.

**5. What does compounding frequency mean?**

It refers to how often interest is added to the balance each year.

**6. Is EAR the same as APR?**

No. APR may exclude compounding, while EAR always includes it.

**7. Can EAR be used for loan comparison?**

Yes. EAR provides an accurate basis for comparing loans.

**8. Does monthly compounding increase EAR?**

Yes. More frequent compounding increases EAR.

**9. What happens if interest compounds daily?**

Daily compounding produces a higher EAR than monthly or annual compounding.

**10. Is EAR useful for savings and investments?**

Yes. It reflects the real annual return on interest-bearing accounts.

---

## 8. SEO Metadata

**H1:** Effective Annual Rate Calculator

**Title:**
```
Effective Annual Rate (EAR) Calculator – CalcHowMuch
```

**Meta Description:**
```
Calculate the effective annual rate (EAR) from a nominal interest rate and compounding frequency. Compare true annual interest rates accurately.
```

---

## 9. Structured Data (JSON-LD)

### 1) WebPage

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Effective Annual Rate Calculator",
  "url": "https://calchowmuch.com/finance/effective-annual-rate/",
  "description": "Convert a nominal interest rate into an effective annual rate using compounding frequency.",
  "inLanguage": "en"
}
```

### 2) SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Effective Annual Rate Calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/finance/effective-annual-rate/",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "CalcHowMuch"
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
      "name": "What is the effective annual rate (EAR)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The effective annual rate is the true annual interest rate after accounting for compounding."
      }
    },
    {
      "@type": "Question",
      "name": "How is EAR different from a nominal interest rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nominal rates do not include compounding effects, while EAR does."
      }
    },
    {
      "@type": "Question",
      "name": "Why is EAR higher than the nominal rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because interest compounds multiple times per year."
      }
    },
    {
      "@type": "Question",
      "name": "How do you calculate the effective annual rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By applying the EAR formula using the nominal rate and compounding frequency."
      }
    },
    {
      "@type": "Question",
      "name": "What does compounding frequency mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It refers to how often interest is added to the balance each year."
      }
    },
    {
      "@type": "Question",
      "name": "Is EAR the same as APR?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. APR may exclude compounding, while EAR always includes it."
      }
    },
    {
      "@type": "Question",
      "name": "Can EAR be used for loan comparison?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. EAR provides an accurate basis for comparing loans."
      }
    },
    {
      "@type": "Question",
      "name": "Does monthly compounding increase EAR?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. More frequent compounding increases EAR."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if interest compounds daily?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Daily compounding produces a higher EAR than monthly or annual compounding."
      }
    },
    {
      "@type": "Question",
      "name": "Is EAR useful for savings and investments?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It reflects the real annual return on interest-bearing accounts."
      }
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

- `requirements/seo/REQ-20260207-004.md`

---

## 11. Workflow

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

---

## 12. Acceptance Criteria

- Ranks for "effective annual rate calculator"
- Accurate EAR computation
- All schemas validated
- Exactly 10 FAQs rendered & indexed
- No P0 SEO or ISS failures
