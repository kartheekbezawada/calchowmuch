# REQ-20260208-025 — Credit Card Repayment/Payoff Calculator (SERP-Ready Rebuild)

Calculator Group: Credit Cards
Calculator: Credit Card Repayment/Payoff Calculator
Primary Question (Single-Question Rule): How long will it take to pay off my credit card balance with a fixed monthly payment, and how much interest will I pay?
Status: REBUILD
Constraints: Existing compute logic is sufficient; rebuild UI, explanation pane, and SEO package to current standards
FSM Phase: REQ
Scope: UI, Compute (retain), Navigation, SEO, Sitemap, Testing, Compliance

---

## Current Navigation Structure

### Top Navigation Bar

The Credit Cards group is accessed via the top-nav bar. The active top-nav link for all Credit Card calculators:

```html
<a class="top-nav-link is-active" href="/loans/credit-card-repayment-payoff">
  <span class="nav-icon" aria-hidden="true">💳</span>
  <span class="nav-label">Credit Cards</span>
</a>
```

The top-nav entry point links to `/loans/credit-card-repayment-payoff` (this calculator, as it is the first in the group).

Full top-nav order: Math | Home Loan | **Credit Cards** | Auto Loans | Finance | Time & Date | Percentage Calculators.

### Left Navigation Pane

Category ID: `credit-cards`
Category Label: "Credit Cards"
Expand/collapse: expanded by default (`aria-expanded="true"`)

| Position | Left-Nav Label   | Route                                      | Active on This Page  |
| -------- | ---------------- | ------------------------------------------ | -------------------- |
| 1        | Repayment        | `/loans/credit-card-repayment-payoff`      | **Yes (is-active)**  |
| 2        | Minimum Payment  | `/loans/credit-card-minimum-payment`       | No                   |
| 3        | Balance Transfer | `/loans/balance-transfer-installment-plan` | No                   |
| 4        | Card Consolidation | `/loans/credit-card-consolidation`       | No                   |

### navigation.json Config (Source of Truth)

Located in: `public/config/navigation.json` under `categories[1].subcategories[1]` (Loans > Credit Cards).

```json
{
  "id": "credit-cards",
  "name": "Credit Cards",
  "icon": "💳",
  "calculators": [
    { "id": "credit-card-repayment-payoff", "name": "Repayment", "url": "/loans/credit-card-repayment-payoff" },
    { "id": "credit-card-minimum-payment", "name": "Minimum Payment", "url": "/loans/credit-card-minimum-payment" },
    { "id": "balance-transfer-installment-plan", "name": "Balance Transfer", "url": "/loans/balance-transfer-installment-plan" },
    { "id": "credit-card-consolidation", "name": "Card Consolidation", "url": "/loans/credit-card-consolidation" }
  ]
}
```

### File Paths (Current)

| Component | Path |
| --------- | ---- |
| Public HTML | `public/loans/credit-card-repayment-payoff/index.html` |
| Calculator Module | `public/calculators/loans/credit-card-repayment-payoff/module.js` |
| Calculator CSS | `public/calculators/loans/credit-card-repayment-payoff/calculator.css` |
| Explanation HTML | `public/calculators/loans/credit-card-repayment-payoff/explanation.html` |
| Shared Utils | `public/assets/js/core/credit-card-utils.js` |
| Unit Tests | `tests_specs/credit-cards/unit/credit-card-utils.test.js` |

---

## 1) Purpose & Search Intent

- **User intent:** A user has a credit card balance and wants to know how many months it will take to pay it off with a specific monthly payment. They also want to understand total interest paid and total cost.
- **Modes:** Single mode only (fixed monthly payment payoff). No mode switching required.
- **Core outputs:** Payoff time (months), total interest paid, total amount paid, yearly payoff snapshot table.

---

## 2) SEO Keywords

### Primary Keywords (3-6)
- credit card payoff calculator
- credit card repayment calculator
- pay off credit card calculator
- credit card payoff time

### Secondary Keywords (5-12)
- credit card interest calculator
- how long to pay off credit card
- credit card balance payoff
- credit card payment calculator
- credit card debt calculator
- fixed payment credit card
- extra payment credit card
- credit card payoff schedule

### Long-tail / Intent Phrases (6-15)
- how long will it take to pay off my credit card
- calculate credit card payoff time with fixed payment
- credit card payoff with extra payments
- how much interest will I pay on credit card
- credit card repayment schedule calculator
- estimate credit card payoff date
- credit card balance payoff timeline
- free credit card payoff calculator online
- credit card debt repayment plan calculator

### Placement Rules
- H1: "Credit Card Repayment Calculator" (includes primary keyword)
- Title: "Credit Card Repayment Calculator -- Payoff Time & Interest" (primary + qualifier)
- Meta description: primary keyword + benefit (payoff time, total interest) + core outputs
- Explanation H2 summary: includes "credit card repayment" + "payoff" naturally
- FAQs: at least 3 questions include primary/secondary keywords

---

## 3) URL & Canonical

- Slug: `/loans/credit-card-repayment-payoff/`
- Canonical: `https://calchowmuch.com/loans/credit-card-repayment-payoff/`

---

## 4) SEO Metadata

- **Title** (<=60 chars): `Credit Card Repayment Calculator -- Payoff Time & Interest`
- **Meta description** (140-160 chars): `Calculate how long it takes to pay off your credit card balance with fixed monthly payments. See total interest, payoff time, and yearly breakdown.`
- **Canonical URL:** `https://calchowmuch.com/loans/credit-card-repayment-payoff/`
- **OpenGraph/Twitter:** Title and description must match. og:type = website. og:image = site default.

---

## 5) Calculation Pane (UI)

### Inputs

| Label | ID | Type | Default | Min | Max | Step | Required |
|-------|----|------|---------|-----|-----|------|----------|
| Card Balance | cc-payoff-balance | number | 8500 | 0.01 | -- | 0.01 | Yes |
| APR (%) | cc-payoff-apr | number | 18.9 | 0 | -- | 0.01 | Yes |
| Monthly Payment | cc-payoff-payment | number | 250 | 0.01 | -- | 0.01 | Yes |
| Extra Payment (optional) | cc-payoff-extra | number | 0 | 0 | -- | 0.01 | No |

### Modes
- Single mode only. No mode switching.

### Output Spec (after Calculate click)
Results displayed in `#cc-payoff-result` and `#cc-payoff-summary`:
- **Payoff time:** N months
- **Total interest:** $X,XXX.XX
- **Total paid:** $X,XXX.XX
- **Monthly payment:** $X,XXX.XX (base + extra)

### Validation Rules
- Balance must be > 0: `"Balance must be greater than 0."`
- APR must be >= 0: `"APR must be 0 or higher."`
- Monthly payment must be > 0: `"Monthly payment must be greater than 0."`
- If APR > 0 and payment <= first month's interest: `"Payment is too low to reduce the balance."`

### UI Interaction Contract
- Calculate button triggers computation (UI-2.6). No auto-recalculation on input change after first calculation.
- After first Calculate click, any input change must reset results to placeholder state until next Calculate click.
- No dropdowns (UI-2.5). All controls are inputs or button groups.

---

## 6) Compute Logic

### Constants & Defaults
- `MAX_MONTHS = 720` (60 years safety cap)

### Formulas
Uses `calculateCreditCardPayoff()` from `/assets/js/core/credit-card-utils.js`:

```
monthlyRate = APR / 100 / 12
For each month until balance = 0 or month > MAX_MONTHS:
  interest = remaining * monthlyRate
  payment = min(monthlyPayment + extraPayment, remaining + interest)
  principal = max(0, payment - interest)
  remaining = max(0, remaining - principal)
```

### Edge Cases
- APR = 0: No interest; balance / payment = months.
- Payment exactly covers interest: infinite loop; caught by "payment too low" validation.
- Extra payment = 0: treated as no extra payment.
- Balance <= 0: error returned.

### Rounding/Precision
- Internal: full precision. `roundToTwo()` used only for specific display values.
- Display: currency values to 2 decimal places. Months as whole number.

---

## 7) Explanation Pane

Must follow UI-EXP-PANE-STD section order (mandatory).

### Panel Layout

- No TOC bullet list at the top of the explanation pane.
- No generic "Explanation" heading — the panel starts directly with the H2 Summary.
- Dynamic value spans (`[data-cc-payoff]`) are highlighted with a blue background badge (matching Countdown Timer pattern): `background: rgba(59, 130, 246, 0.45)`, `outline: 1px solid rgba(59, 130, 246, 0.65)`, `border-radius: 8px`, `font-weight: 600`, `padding: 2px 6px`.
- Explanation pane is pre-filled on page load using default input values (balance=8500, APR=18.9%, payment=$250, extra=$0). The pre-fill populates the H2 Summary dynamic spans and the Yearly Payoff Snapshot table without triggering the calculator results panel or setting `hasCalculated`.

### H2 Summary ("Credit Card Repayment Summary")

Dynamic text referencing user inputs and outputs:
- References: balance, APR, monthly payment, payoff months, total interest, total paid.
- Includes interpretation ("Interest compounds monthly, so increasing the payment even slightly reduces the payoff time and total interest.").

### ~~H3 Scenario Summary Table~~ (REMOVED)

> **Removed**: The Scenario Summary table has been removed from the explanation pane. Input/output values are already referenced in the H2 Summary text and the Yearly Payoff Snapshot table, making this section redundant.

### H3 Results Table (Yearly Payoff Snapshot)
| Year | Payments | Interest | Ending Balance |
|------|----------|----------|----------------|

Dynamic rows populated from `summarizeYearly()` output. Pre-filled on page load with default input values. Extra spacing (`margin-bottom: 12px` on `#cc-payoff-yearly`) between the heading and table for visual clarity.

### H3 Explanation (Plain Language)
- What this calculator does
- How interest compounds monthly
- Why higher payments save money
- Assumptions and limitations

### H3 Frequently Asked Questions
FAQs model: **10 new** (EXP-FAQ-1)

1. What is a credit card payoff calculator?
2. How is credit card interest calculated?
3. How long will it take to pay off my credit card?
4. What happens if I only make the minimum payment?
5. How does an extra payment reduce my payoff time?
6. What is APR and how does it affect my balance?
7. Can I pay off my credit card faster with biweekly payments?
8. What if my APR changes during repayment?
9. Does this calculator account for new purchases?
10. How accurate is this credit card payoff estimate?

Each FAQ must be in a bordered container using the shared `.faq-box` class from `calculator.css`. Q: bolded with "Q:" prefix, A: indented with `.faq-answer` class and "A:" prefix. 6px gap between FAQ boxes.

---

## 8) JSON-LD

- **WebPage:** name, url, description, inLanguage: en
- **SoftwareApplication:** name, applicationCategory: FinanceApplication, operatingSystem: Web, url, description, browserRequirements, softwareVersion: 1.0, creator (CalcHowMuch), offers (free)
- **BreadcrumbList:** Home > Credit Cards > Credit Card Repayment Calculator
- **FAQPage:** Yes (10 FAQs, must match visible FAQ text verbatim)
- **Schema guard:** `pageSchema = { calculatorFAQ: true, globalFAQ: false }`

---

## 9) Sitemap & Navigation

- **Top-nav category:** Credit Cards (active)
- **Left-nav label:** "Repayment"
- **Left-nav position:** First item in Credit Cards group
- **Sitemap entry:** `<url><loc>https://calchowmuch.com/loans/credit-card-repayment-payoff/</loc><changefreq>monthly</changefreq><priority>0.70</priority></url>`

---

## 10) Testing

### Unit Tests
- Existing tests in `tests_specs/credit-cards/unit/credit-card-utils.test.js` cover `calculateCreditCardPayoff()`.
- Verify: payoff months > 0, total interest > 0, total payment > balance.
- Edge case: payment too low returns error.
- Edge case: APR = 0 returns payoff with 0 interest.

### E2E Tests (Playwright)
- REPAYMENT-TEST-E2E-1: Load page, verify nav active states, fill inputs, click Calculate, verify result content.
- REPAYMENT-TEST-E2E-2: After Calculate, change input, verify results reset to placeholder.
- REPAYMENT-TEST-E2E-3: Verify explanation pane has 10 FAQ items.

### SEO Tests
- REPAYMENT-TEST-SEO-1: Verify title, meta description, H1, canonical, JSON-LD types (WebPage, SoftwareApplication, FAQPage, BreadcrumbList), 10 FAQs in schema, sitemap entry.

### UI Regression
- ISS-001 regression check if layout changes are made.

---

## 11) Acceptance Criteria

- [ ] Calculator loads and computes payoff correctly with default values.
- [ ] All validation errors display correctly.
- [ ] No auto-recalculation on input change after first Calculate click (UI-2.6).
- [ ] No dropdowns in UI (UI-2.5).
- [ ] Explanation pane follows UI-EXP-PANE-STD section order with 10 FAQs.
- [ ] FAQPage JSON-LD matches visible FAQ text verbatim.
- [ ] JSON-LD includes WebPage, SoftwareApplication, BreadcrumbList, FAQPage.
- [ ] Title, meta description, canonical URL are correct.
- [ ] Yearly payoff snapshot table follows UTBL-* rules.
- [ ] Calculator appears in sitemap.
- [ ] All unit, E2E, and SEO tests pass.
- [ ] P1/P2/P5 SEO checks pass.

---

## Quality Checklist (Appendix B Validation)

### B1 -- Completeness
- [x] Header block filled
- [x] Canonical URL defined
- [x] Title + meta description defined
- [x] Keywords provided (primary/secondary/long-tail)
- [x] Navigation + sitemap update stated
- [x] JSON-LD bundle specified
- [x] FAQPage schema rules stated
- [x] Explanation pane rules stated

### B2 -- Unambiguity
- [x] Single mode clearly defined
- [x] Input definitions include units, defaults, min/max/step
- [x] Validation rules with exact error messages

### B3 -- Testability
- [x] Unit tests cover core formulas and edge cases
- [x] E2E tests cover UI flow
- [x] SEO tests validate title/meta/canonical + JSON-LD
- [x] FAQPage schema matches visible FAQ text verbatim

### B4 -- Implementation Readiness
- [x] Formulas are deterministic
- [x] Edge cases have explicit rules
- [x] Rounding/precision rules are explicit

### B5 -- SERP Readiness
- [x] Title includes primary keyword + qualifier
- [x] Meta description includes primary keyword + benefit + output
- [x] Sitemap entry included and canonical matches
