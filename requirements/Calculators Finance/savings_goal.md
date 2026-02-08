REQ-20260207-006
Savings Goal Calculator — Finance Category
=========================================

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

**How long will it take to reach my savings goal (or how much do I need to save per month), accounting for optional interest?**

This calculator targets users planning:

- emergency funds
- vacation or wedding savings
- house deposit
- car purchase
- general savings targets

### 1.2 Primary SEO Keywords (MANDATORY)

These keywords MUST be explicitly supported in:

- H1
- title
- meta description
- explanation copy
- FAQ questions

| Keyword Type | Keywords |
|--------------|----------|
| **Primary** | savings goal calculator, savings goal |
| **Secondary** | how much to save per month, savings target calculator, goal savings planner |
| **Long-tail / Intent** | how long to reach savings goal, savings goal calculator with interest, savings goal calculator monthly contribution, required monthly savings to reach goal, savings goal by date calculator |

---

## 2. Category & Navigation Requirements

### 2.1 Top-Level Category

**Top Navigation Button:** Finance

**Category:** Savings & Budgeting

### 2.2 Left Navigation Structure (Finance)

```
Finance
└── Investments & Savings
    ├── Savings Goal
    ├── Investment Growth
```

**Rules**

- Display name must be exactly "Savings Goal"
- Navigation must be config-driven
- One calculator per page

---

## 3. URL & Page Model (SEO + MVP)

**Canonical URL**

```
/finance/savings-goal/
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
/public/calculators/finance/savings-goal/
├── index.html          # Calculation pane fragment (NOT full page)
├── module.js           # UI glue + savings goal compute
├── explanation.html    # Explanation pane fragment (SEO-critical)
└── calculator.css      # Optional per-calculator styling
```

**Generated output (do not hand-edit):**

```text
/public/finance/savings-goal/index.html
```

---

## 5. Calculation Pane Requirements

**H2**

Savings Goal Calculator

### Mode (Required)

Mode Toggle (Button Toggle):

- Time to Goal
- Monthly Savings Needed

Mode toggle is required and visible by default.

### Inputs

| Section | Input | Type | Required | Notes |
|---------|-------|------|----------|-------|
| **Core (Above the Fold)** | Savings Goal Amount | Number | Yes | Currency |
| **Core (Above the Fold)** | Current Savings | Number | Yes | Currency (can be 0) |
| **Core (Above the Fold)** | Monthly Contribution | Number | Yes (Time to Goal mode) | Currency |
| **Core (Above the Fold)** | Target Time | Number | Yes (Monthly Needed mode) | Duration value |
| **Core (Above the Fold)** | Time Unit | Button Toggle | Yes (Monthly Needed mode) | Years / Months |
| **Optional (Progressive Disclosure)** | Annual Interest Rate (APY %) | Number | No | If omitted, assume 0% |
| **Optional (Progressive Disclosure)** | Compounding Frequency | Button Group | No | Monthly (default), Quarterly, Annually |
| **Optional (Progressive Disclosure)** | Contribution Timing | Button Toggle | No | End of month (default) / Beginning of month |

**Rules**

- No dropdowns (UI-2.5)
- Button groups only
- Optional inputs must not block calculation
- Progressive disclosure section must be clearly visible and collapsible
- Show currency formatting in outputs; inputs accept plain numbers

Additional universal rules:

- Validate all inputs (UI-2.3, CS-1.3)
- Cap input length to 12 characters (UI-2.4)

---

## 6. Calculator Engine (Logic)

### 6.1 Definitions

- G = goal amount
- S0 = current savings
- C = monthly contribution
- r = annual rate as decimal (APY %)
- m = compounding periods per year (12 monthly, 4 quarterly, 1 annually)
- i = periodic rate = r / m
- k = number of periods (months if monthly compounding; quarters if quarterly, etc.)

### 6.2 Mode A — Time to Goal (Primary)

Compute k periods such that balance reaches goal:

**If interest is 0%:**

```
k = ceil((G - S0) / C)
```

**If interest is > 0:**

Use iterative simulation per period (deterministic):

```
balance = S0
repeat each period:
  if contribution timing = beginning: balance += contribution_per_period
  balance *= (1 + i)
  if contribution timing = end: balance += contribution_per_period
until balance >= G
```

**Where:**

contribution_per_period depends on compounding period:

- Monthly: C
- Quarterly: C * 3
- Annually: C * 12

**Return:**

TIME_TO_GOAL_PERIODS and display as X years Y months (convert from periods consistently)

### 6.3 Mode B — Monthly Savings Needed

Given target time T in months (if years provided, T = years * 12), compute required monthly contribution.

**If interest is 0%:**

```
C = (G - S0) / T
```

**If interest is > 0:**

Use binary search on C with deterministic simulation (same rules as Mode A) to find minimal C such that balance at T periods is >= G.

Stop when difference within currency tolerance (e.g., £0.01) or max iterations reached.

### 6.4 Outputs

| Output | Required |
|--------|----------|
| Goal Amount | Yes |
| Current Savings | Yes |
| Mode Applied | Yes |
| Time to Goal (months + years/months format) | Yes (Time to Goal mode) |
| Required Monthly Savings | Yes (Monthly Needed mode) |
| Final Balance at Goal/Target Time | Yes |
| Total Contributions | Yes |
| Total Interest Earned | Yes (0 if rate=0) |
| Rate Used + Compounding Frequency | Yes |

### 6.5 Validation Rules

- G must be > 0
- S0 must be >= 0
- In Time to Goal mode: if G <= S0, time to goal is 0
- In Time to Goal mode: C must be > 0 if G > S0
- In Monthly Needed mode: T must be > 0 and goal > current savings to require contributions
- Prevent negative rates and invalid compounding period
- No unhandled exceptions

### 6.6 Rounding Rules

- Internal calculations may use higher precision
- Display values:
  - Currency: 2 decimals
  - Percent: 2 decimals
  - Time: months integer, plus formatted years/months

---

## 7. Explanation Pane (SEO-Critical)

Must implement Explanation Pane — Universal Standard exactly.

### 7.1 H2 — Summary (Keyword-Dense, Natural)

A savings goal calculator helps you plan how long it will take to reach a target amount or how much you need to save each month to hit your goal by a specific time.

This calculator estimates time to goal and monthly savings needed using your current savings, contributions, and optional interest with compounding, so you can compare scenarios and build a realistic plan.

### 7.2 H3 — Scenario Summary

| Category | Value | Source |
|----------|-------|--------|
| Savings Goal Amount | {GOAL_AMOUNT} | Calculation Pane |
| Current Savings | {CURRENT_SAVINGS} | Calculation Pane |
| Mode | {MODE} | Calculation Pane |
| Monthly Contribution | {MONTHLY_CONTRIBUTION} | Calculation Pane |
| Target Time | {TARGET_TIME} | Calculation Pane |
| Annual Interest Rate | {ANNUAL_RATE}% | Calculation Pane |
| Compounding Frequency | {COMPOUNDING_FREQUENCY} | Calculation Pane |
| Result (Time or Monthly Needed) | {PRIMARY_RESULT} | Calculator Engine |

### 7.3 H3 — Results Table

| Metric | Value | Unit | Explanation |
|--------|-------|------|-------------|
| Time to Goal | {TIME_TO_GOAL} | Duration | Time required to reach goal |
| Required Monthly Savings | {REQUIRED_MONTHLY} | Currency | Monthly amount needed to hit goal by target time |
| Final Balance | {FINAL_BALANCE} | Currency | Ending balance at goal/target time |
| Total Contributions | {TOTAL_CONTRIBUTIONS} | Currency | Sum of all deposits |
| Total Interest Earned | {TOTAL_INTEREST} | Currency | Growth from interest/compounding |
| Rate + Compounding | {RATE_AND_FREQUENCY} | — | Assumptions used |

### 7.4 H3 — Explanation (SEO-Optimized)

A savings goal is easiest to plan when you break it into consistent monthly deposits and track how long those deposits will take to reach your target.

If you include an interest rate, your balance can grow faster because interest is applied to both your savings and previously earned interest (compounding). The compounding frequency (monthly, quarterly, or annually) affects how quickly the balance grows.

This calculator supports two planning views:

- Time to Goal: estimate how long your monthly savings will take to reach the goal.
- Monthly Savings Needed: estimate the monthly amount required to reach the goal within a fixed timeframe.

### 7.5 H3 — Frequently Asked Questions (Exactly 10)

**1. What is a savings goal calculator?**

A savings goal calculator estimates how long it will take to reach a target amount or how much you need to save each month to reach it.

**2. How do I calculate how much to save per month?**

You can divide the remaining amount needed by the number of months, and optionally include interest to account for compounding growth.

**3. How do I calculate how long it will take to reach my savings goal?**

Use your goal amount, current savings, and monthly contribution to estimate the number of months needed, optionally including interest.

**4. Does interest make it easier to reach a savings goal?**

Yes. Interest can increase your balance over time, reducing the monthly amount needed or shortening the time to goal.

**5. What compounding frequency should I use?**

Use the frequency that matches your account, such as monthly, quarterly, or annually.

**6. What if my current savings is already higher than my goal?**

Then your time to goal is zero because you have already reached the target.

**7. What happens if my monthly contribution is zero?**

If your goal is higher than your current savings, you will not reach it without contributions or interest growth.

**8. Is this a savings goal calculator with interest?**

Yes. You can add an annual interest rate and compounding frequency to include interest growth.

**9. Can this help me plan for a house deposit or emergency fund?**

Yes. You can use it for any target amount, including an emergency fund, house deposit, or holiday budget.

**10. Why do results change when I choose beginning vs end of month contributions?**

Contributing at the beginning gives money more time to earn interest, which can slightly reduce the time to goal or the required monthly savings.

---

## 8. SEO Requirements (Top-Ranking Focus)

### 8.1 Metadata (Keyword-Optimized)

**H1:** Savings Goal Calculator

**Title:**
```
Savings Goal Calculator – CalcHowMuch
```

**Meta Description:**
```
Plan your savings goal. Calculate how long it will take to reach a target amount or how much you need to save per month. Optional interest and compounding.
```

---

## 9. Structured Data (JSON-LD — REQUIRED)

**Placement Rule**

All JSON-LD scripts below must be embedded only on:

- /finance/savings-goal/
- Page-scoped only (no global FAQPage injection)

### 1) WebPage (Required)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Savings Goal Calculator",
  "url": "https://calchowmuch.com/finance/savings-goal/",
  "description": "Calculate time to reach a savings goal or the monthly savings needed to hit a target amount, with optional interest and compounding.",
  "inLanguage": "en"
}
```

### 2) SoftwareApplication (Calculator-Specific, Required)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Savings Goal Calculator",
  "applicationCategory": "FinanceApplication",
  "applicationSubCategory": "Savings & Budgeting Calculator",
  "operatingSystem": "Web",
  "url": "https://calchowmuch.com/finance/savings-goal/",
  "description": "Free savings goal calculator to estimate time to goal or required monthly savings. Supports optional interest and compounding frequency.",
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
      "name": "What is a savings goal calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A savings goal calculator estimates how long it will take to reach a target amount or how much you need to save each month to reach it."
      }
    },
    {
      "@type": "Question",
      "name": "How do I calculate how much to save per month?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can divide the remaining amount needed by the number of months, and optionally include interest to account for compounding growth."
      }
    },
    {
      "@type": "Question",
      "name": "How do I calculate how long it will take to reach my savings goal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use your goal amount, current savings, and monthly contribution to estimate the number of months needed, optionally including interest."
      }
    },
    {
      "@type": "Question",
      "name": "Does interest make it easier to reach a savings goal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Interest can increase your balance over time, reducing the monthly amount needed or shortening the time to goal."
      }
    },
    {
      "@type": "Question",
      "name": "What compounding frequency should I use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the frequency that matches your account, such as monthly, quarterly, or annually."
      }
    },
    {
      "@type": "Question",
      "name": "What if my current savings is already higher than my goal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Then your time to goal is zero because you have already reached the target."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if my monthly contribution is zero?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If your goal is higher than your current savings, you will not reach it without contributions or interest growth."
      }
    },
    {
      "@type": "Question",
      "name": "Is this a savings goal calculator with interest?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can add an annual interest rate and compounding frequency to include interest growth."
      }
    },
    {
      "@type": "Question",
      "name": "Can this help me plan for a house deposit or emergency fund?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can use it for any target amount, including an emergency fund, house deposit, or holiday budget."
      }
    },
    {
      "@type": "Question",
      "name": "Why do results change when I choose beginning vs end of month contributions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Contributing at the beginning gives money more time to earn interest, which can slightly reduce the time to goal or the required monthly savings."
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
      "name": "Savings Goal",
      "item": "https://calchowmuch.com/finance/savings-goal/"
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
| Unit (savings goal logic) | ✅ |
| ISS-001 | ✅ |
| E2E | ✅ |
| SEO-P1 → P5 | ✅ |

---

## 12. Workflow Enforcement

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE

---

## 13. Acceptance Criteria

- Ranks for "savings goal calculator" and long-tail variants ("how much to save per month", "how long to reach savings goal")
- Mode toggle works and does not break single-page SEO
- Deterministic results for interest + contributions
- Explanation pane crawlable and keyword-aligned
- Rich Results Test shows FAQPage (10 Qs) + BreadcrumbList
- No schema scope violations (no global FAQPage)

SEO phase tracking file:

- `requirements/seo/REQ-20260207-006.md`
