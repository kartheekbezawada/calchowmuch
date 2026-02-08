REQ-20260206-004
Future Value (FV) Calculator — Finance Category
==============================================

## Status: NEW

- Type: Brand-new calculator (existing Finance category)
- FSM Phase: REQ
- Owner: Product / Platform
- Scope: UI, Compute, Navigation, SEO, Sitemap, Testing

### Repo Reality Check (AP-2.3)

This repo renders calculator pages via a generator that wraps calculator *fragments* into the full 3-column shell.

Source-of-truth fragments live under:

- `/public/calculators/finance/future-value/` (to be created in BUILD)

Generated output page (do not hand-edit) will be:

- `/public/finance/future-value/index.html`

1. Purpose & User Intent
1.1 Calculator Question (Single-Question Rule)

What will an amount of money be worth in the future?

This calculator answers one focused financial question aligned with Time Value of Money (TVM) principles, allowing users to estimate how today’s money grows over time.

2. Category & Navigation Requirements
2.1 Top-Level Category

Top Navigation Button: Finance

Category Status: Existing (introduced with PV)

Clicking Finance MUST:

Activate the Finance navigation tree

Preserve shell layout and internal scrolling

Prevent cross-category navigation leakage

2.2 Left Navigation Structure (Finance)
Finance
└── Time Value of Money
    ├── Present Value (PV)
    └── Future Value (FV)


Rules

Display name must be exactly “Future Value (FV)”

Must follow calculator hierarchy and deep-link rules

Navigation must be config-driven (no hard-coded lists)

3. URL & Page Model (MVP Rule)

URL

/finance/future-value/


Architecture

Multi-Page Application (MPA)

One calculator per page

Full page reload on navigation

Enforced Rules

Standalone HTML document

Crawlable explanation content

One page = one calculator

4. Folder & File Structure

This project uses a generator that wraps fragments into the full shell.

**Fragments (source-of-truth):**

`/public/calculators/finance/future-value/`

- `index.html` — calculation pane fragment (NOT the full page shell)
- `module.js` — FV calculator UI + compute glue
- `explanation.html` — explanation pane fragment (crawlable)
- `calculator.css` — optional per-calculator styling

**Generated output (do not hand-edit):**

- `/public/finance/future-value/index.html`


Must comply with folder structure and naming rules defined in UNIVERSAL_REQUIREMENTS.

5. Calculation Pane Requirements
5.1 Core Inputs
Input	Type	Required
Present Value (PV)	Number	Yes
Interest / Growth Rate (%)	Number	Yes
Time Period	Number	Yes
Period Type	Button Toggle (Years / Months)	Yes
5.2 Optional Inputs (Progressive Disclosure)
Input	Type
Compounding Frequency	Button Group (Annual, Semi-Annual, Quarterly, Monthly)
Regular Contribution	Number (optional)

Rules

Optional inputs must not block calculation

Optional inputs must be behind progressive disclosure

Dropdowns are not allowed

Must comply with ISS-UI-FDP calculation pane rules

6. Calculator Engine (Logic)
6.1 Core Formula
FV = PV × (1 + r)ⁿ


Where:

r = periodic interest/growth rate

n = number of periods

(If Regular Contribution is enabled, compound contribution logic applies.)

6.2 Outputs
Output	Required
Future Value (FV)	Yes
Total Contributions	Yes
Total Growth / Interest	Yes
Effective Period Count	Yes

Validation Rules

Prevent divide-by-zero

Validate negative and empty inputs

No unhandled exceptions

## 7. Explanation Pane (Mandatory)

Must implement Explanation Pane — Universal Standard exactly.

### 7.1 Required Section Order (Fixed)

- H2 — Summary
- H3 — Scenario Summary
- H3 — Results Table
- H3 — Explanation
- H3 — Frequently Asked Questions (exactly 10)
- No extra headings or sections are allowed.

### 7.2 H2 — Summary

Based on your inputs for starting amount, interest rate, and time period, this calculator estimates the future value (FV) of your money.

The result shows how much your money could grow over time through compound interest.
This helps you plan savings, investments, and long-term financial goals.

### 7.3 H3 — Scenario Summary

| Category | Value | Source |
| --- | --- | --- |
| Present Value | {PRESENT_VALUE} | Calculation Pane |
| Interest Rate | {INTEREST_RATE}% | Calculation Pane |
| Time Period | {TIME_PERIOD} {PERIOD_TYPE} | Calculation Pane |
| Compounding Frequency | {COMPOUNDING_FREQUENCY} | Calculation Pane |
| Future Value | {FUTURE_VALUE} | Calculator Engine |

### 7.4 H3 — Results Table

| Metric | Value | Unit | Explanation |
| --- | --- | --- | --- |
| Future Value (FV) | {FUTURE_VALUE} | Currency | Value of money in future |
| Present Value (PV) | {PRESENT_VALUE} | Currency | Starting amount |
| Total Contributions | {TOTAL_CONTRIBUTIONS} | Currency | Money added over time |
| Total Growth | {TOTAL_GROWTH} | Currency | Interest earned |
| Effective Periods | {TOTAL_PERIODS} | Periods | Total compounding periods |

### 7.5 H3 — Explanation

- Future value represents how much money today can grow over time when interest or growth is applied.
Because returns compound, growth accelerates as both the original amount and accumulated interest earn returns.

- In this calculation, your present value grows using the selected interest rate, compounding frequency, and time period.
Higher rates or longer periods increase future value, while lower rates or shorter periods reduce it.

### 7.6 H3 — Frequently Asked Questions (10)

Each FAQ must be rendered inside a bordered .faq-box.

<div class="faq-box"><strong>Q: What is future value (FV)?</strong> A: Future value is the amount your money will be worth at a future date after earning interest or growth.</div>
<div class="faq-box"><strong>Q: How is future value different from present value?</strong> A: Present value is today’s worth of money, while future value shows what it grows into over time.</div>
<div class="faq-box"><strong>Q: What interest rate should I use?</strong> A: Use an expected return rate based on savings, investments, or inflation assumptions.</div>
<div class="faq-box"><strong>Q: How does compounding affect future value?</strong> A: More frequent compounding increases growth by earning interest on interest.</div>
<div class="faq-box"><strong>Q: Does time period matter for future value?</strong> A: Yes, longer time periods significantly increase future value due to compounding.</div>
<div class="faq-box"><strong>Q: What are regular contributions?</strong> A: Regular contributions are additional amounts added periodically to increase total savings.</div>
<div class="faq-box"><strong>Q: Is future value useful for retirement planning?</strong> A: Yes, it helps estimate how current savings may grow by retirement.</div>
<div class="faq-box"><strong>Q: Can future value decrease over time?</strong> A: With a positive interest rate, future value increases; negative rates reduce growth.</div>
<div class="faq-box"><strong>Q: What happens if the interest rate is zero?</strong> A: The future value equals the present value plus any contributions.</div>
<div class="faq-box"><strong>Q: Is this calculator suitable for savings and investments?</strong> A: Yes, it can be used for savings goals, investments, education funds, and retirement planning.</div>

8. SEO Requirements (New Calculator Page)
8.1 Mandatory SEO Scope

This change introduces a new calculator page, therefore SEO P1–P5 are mandatory.

8.2 Metadata

H1: Future Value Calculator

Title: Future Value (FV) Calculator – CalcHowMuch

Meta Description:

Calculate how much your money could grow in the future using interest rate and time period. Simple FV calculator.

## 8.3 Structured Data (Required)
The calculator page MUST include:
- WebPage
- SoftwareApplication
- FAQPage
- BreadcrumbList
- Missing any schema = SEO FAIL

## 9. Sitemap & Indexing (Build-Blocking)

Must update:
- sitemap.xml
- Human-readable /sitemap
- public/calculators/index.html

Rules
- A calculator is LIVE if it appears in navigation
- LIVE calculators must appear in sitemap

## 10. Testing Requirements

Change Type: New calculator (existing category)

Required Tests (No Exceptions)
Test	Required
Unit (compute logic)	✅
ISS-001 (layout stability)	✅
E2E (navigation + flow)	✅
SEO-P1	✅
SEO-P2	✅
SEO-P3	✅
SEO-P4	✅
SEO-P5	✅

## 11. Workflow Enforcement

FSM sequence is mandatory:

REQ → BUILD → TEST → SEO → COMPLIANCE → COMPLETE


Rules:

No implementation before EVT_START_BUILD

One ITER file per build

Maximum 25 iterations

Compliance PASS required for release

12. Acceptance Criteria (Hard Gates)

This requirement is ACCEPTED ONLY IF:

Future Value (FV) appears under Finance → Time Value of Money

Calculator is standalone and crawlable

Calculation Pane passes ISS-UI-FDP

Explanation Pane matches universal structure exactly

SEO P1–P5 all PASS

Calculator appears in sitemap

All required tests PASS

Failure of any P0 rule = REQ FAIL

13. Validation Checklist (Post-Build)

Google Rich Results Test: no schema errors

Lighthouse Performance: thresholds met

Lighthouse SEO: all checks pass

Accessibility (pa11y): no AA violations