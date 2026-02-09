# REQ-20260208-026 — Credit Card Minimum Payment Calculator (SERP-Ready Rebuild)

Calculator Group: Credit Cards
Calculator: Credit Card Minimum Payment
Primary Question (Single-Question Rule): How long will it take to pay off my credit card if I only make the minimum payment each month, and how much will it cost me?
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

The top-nav entry point links to `/loans/credit-card-repayment-payoff` (Repayment calculator, the first in the group).

Full top-nav order: Math | Home Loan | **Credit Cards** | Auto Loans | Finance | Time & Date | Percentage Calculators.

### Left Navigation Pane

Category ID: `credit-cards`
Category Label: "Credit Cards"
Expand/collapse: expanded by default (`aria-expanded="true"`)

| Position | Left-Nav Label     | Route                                      | Active on This Page  |
| -------- | ------------------ | ------------------------------------------ | -------------------- |
| 1        | Repayment          | `/loans/credit-card-repayment-payoff`      | No                   |
| 2        | Minimum Payment    | `/loans/credit-card-minimum-payment`       | **Yes (is-active)**  |
| 3        | Balance Transfer   | `/loans/balance-transfer-installment-plan` | No                   |
| 4        | Card Consolidation | `/loans/credit-card-consolidation`         | No                   |

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

| Component        | Path                                                           |
| ---------------- | -------------------------------------------------------------- |
| Public HTML      | `public/loans/credit-card-minimum-payment/index.html`          |
| Calculator Module | `public/calculators/loans/credit-card-minimum-payment/module.js` |
| Calculator CSS   | `public/calculators/loans/credit-card-minimum-payment/calculator.css` |
| Explanation HTML | `public/calculators/loans/credit-card-minimum-payment/explanation.html` |
| Shared Utils     | `public/assets/js/core/credit-card-utils.js`                  |
| Unit Tests       | `requirements/specs/loans/credit-card-utils.test.js`           |

---

## 1) Purpose & Search Intent

- **User intent:** A user wants to understand the true cost of making only minimum payments on their credit card. They want to see how long payoff takes, how much total interest they will pay, and how the declining minimum payment extends repayment.
- **Modes:** Single mode only. No mode switching required.
- **Core outputs:** Payoff time (months), first payment amount, total interest paid, total amount paid, yearly payoff snapshot table.

---

## 2) SEO Keywords

### Primary Keywords (3-6)
- minimum payment calculator
- credit card minimum payment calculator
- minimum payment payoff calculator
- credit card minimum payment

### Secondary Keywords (5-12)
- minimum payment interest cost
- how long to pay off minimum payment
- credit card minimum payment trap
- minimum payment schedule
- credit card minimum payment formula
- minimum payment percentage
- credit card minimum payment floor
- true cost of minimum payments

### Long-tail / Intent Phrases (6-15)
- how long does it take to pay off a credit card with minimum payments
- how much interest will I pay with minimum payments only
- credit card minimum payment calculator with interest
- what happens if I only pay the minimum on my credit card
- calculate total cost of minimum credit card payments
- minimum payment vs fixed payment comparison
- free credit card minimum payment calculator
- credit card payoff time minimum payments only
- why does minimum payment take so long to pay off

### Placement Rules
- H1 (UI heading): "Credit Card Minimum Payment"
- Title: "Credit Card Minimum Payment Calculator -- True Cost of Minimums" (primary + qualifier)
- Meta description: primary keyword + benefit (true payoff cost) + core outputs
- Explanation H2 summary: includes "minimum payment" + "payoff" naturally
- FAQs: at least 3 questions include primary/secondary keywords

---

## 3) URL & Canonical

- Slug: `/loans/credit-card-minimum-payment/`
- Canonical: `https://calchowmuch.com/loans/credit-card-minimum-payment/`

---

## 4) SEO Metadata

- **Title** (<=60 chars): `Credit Card Minimum Payment Calculator True Cost of Minimums`
- **Meta description** (140-160 chars): `See how long it takes to pay off your credit card with minimum payments only. Calculate total interest, payoff months, and yearly payment breakdown.`
- **Canonical URL:** `https://calchowmuch.com/loans/credit-card-minimum-payment/`
- **OpenGraph/Twitter:** Title and description must match. og:type = website. og:image = site default.

---

## 5) Calculation Pane (UI)

### Inputs

| Label | ID | Type | Default | Min | Max | Step | Required |
|-------|----|------|---------|-----|-----|------|----------|
| Card Balance | cc-min-balance | number | 3200 | 0.01 | -- | 0.01 | Yes |
| APR (%) | cc-min-apr | number | 21.9 | 0 | -- | 0.01 | Yes |
| Minimum Payment Rate (%) | cc-min-rate | number | 2.5 | 0 | -- | 0.1 | Yes |
| Lowest Monthly Payment ($) | cc-min-floor | number | 25 | 0 | -- | 0.01 | Yes |

### Provider Note (Required)

`Note: Minimum Payment Rate (%) and Minimum Payment Floor (lowest monthly payment) vary by credit card provider. Check your provider's Terms & Conditions for exact values.`

### Modes
- Single mode only. No mode switching.

### Output Spec (after Calculate click)
Results displayed in `#cc-min-result` and `#cc-min-summary`:
- **Payoff time:** N months
- **Total interest:** localized currency amount
- **Total paid:** localized currency amount
- **First payment:** localized currency amount

### Validation Rules
- Balance must be > 0: `"Balance must be greater than 0."`
- APR must be >= 0: `"APR must be 0 or higher."`
- Minimum payment rate must be >= 0: `"Minimum payment rate must be 0 or higher."`
- Lowest monthly payment must be >= 0: `"Lowest monthly payment must be 0 or higher."`
- If APR > 0 and first minimum payment <= first month's interest: `"Minimum payment is too low to reduce the balance."`

### UI Interaction Contract
- Calculate button triggers computation (UI-2.6). No auto-recalculation on input change after first calculation.
- After first Calculate click, any input change must reset results to placeholder state until next Calculate click.
- No dropdowns (UI-2.5).
- `Results Table (Yearly Payoff Snapshot)` is prefilled on initial page load using default calculator inputs.
- Placeholder table row is a fallback only for invalid/unavailable data states, not the normal initial state.

---

## 6) Compute Logic

### Constants & Defaults
- `MAX_MONTHS = 720` (60 years safety cap)
- Default minimum rate: 2.5%
- Default lowest monthly payment floor input: 25

### Formulas
Uses `calculateMinimumPayment()` from `/assets/js/core/credit-card-utils.js`:

```
firstPayment = max(balance * minRate / 100, floor)

For each month until balance = 0 or month > MAX_MONTHS:
  monthlyRate = APR / 100 / 12
  interest = remaining * monthlyRate
  payment = max(remaining * minRate / 100, floor)
  payment = min(payment, remaining + interest)
  principal = max(0, payment - interest)
  remaining = max(0, remaining - principal)
```

Key behavior: Minimum payment declines as balance drops (percentage-based), but is floored at the minimum floor amount. This is what causes the "minimum payment trap" -- declining payments extend payoff time significantly.

### Edge Cases
- APR = 0: No interest; straightforward division.
- Min rate = 0 and floor = 0: payment = 0, caught by validation.
- Payment too low to reduce balance: returns error.
- Balance <= 0: error returned.

### Rounding/Precision
- Internal: full precision. `roundToTwo()` for first/last payment display.
- Display: currency values to 2 decimal places. Months as whole number.

---

## 7) Explanation Pane

Must follow UI-EXP-PANE-STD section order (mandatory).

Required order:
- `H2 Summary` -> `H3 Results Table (Yearly Payoff Snapshot)` -> `H3 Explanation` -> `H3 Frequently Asked Questions`

### H2 Summary
Dynamic text referencing user inputs and outputs:
- References: balance, APR, first payment amount, payoff months, total interest, total paid.
- Includes interpretation ("Minimum payments decline as the balance drops, which extends payoff time and increases interest paid.").
- Dynamic value chips (`[data-cc-min]`) must use compact highlight styling (reduced padding/radius/contrast) for readability.
- Explanation dynamic numeric values are currency-neutral (no `US$`, no `$`) in highlighted chips.

### H3 Results Table (Yearly Payoff Snapshot)
| Year | Payments | Interest | Ending Balance |
|------|----------|----------|----------------|

Dynamic rows populated from `summarizeYearly()` output.
Table is prefilled at initial load from default calculator inputs.

### H3 Explanation (Plain Language)
- What minimum payment means and how it is calculated
- Why declining payments extend payoff time (the "minimum payment trap")
- How the lowest monthly payment floor works
- Comparison: minimum-only vs fixed payment strategy
- Assumptions and limitations

### H3 Frequently Asked Questions
FAQs model: **10 new** (EXP-FAQ-1)

1. What is a credit card minimum payment?
2. How is the minimum payment calculated?
3. Why does it take so long to pay off with minimum payments?
4. What is the minimum payment trap?
5. How does the lowest monthly payment floor work?
6. What happens if I pay more than the minimum?
7. Does the minimum payment rate vary by card issuer?
8. Can my minimum payment ever go up?
9. Does this calculator include new purchases or fees?
10. How can I estimate a faster payoff strategy?

Each FAQ must be in a bordered container (`.cc-min-faq-item`). Q: bolded, A: indented. 6px gap between FAQ boxes.

---

## 8) JSON-LD

- **WebPage:** name, url, description, inLanguage: en
- **SoftwareApplication:** name, applicationCategory: FinanceApplication, operatingSystem: Web, url, description, browserRequirements, softwareVersion: 1.0, creator (CalcHowMuch), offers (free)
- **BreadcrumbList:** Home > Credit Cards > Credit Card Minimum Payment Calculator
- **FAQPage:** Yes (10 FAQs, must match visible FAQ text verbatim)
- **Schema guard:** `pageSchema = { calculatorFAQ: true, globalFAQ: false }`

---

## 9) Sitemap & Navigation

- **Top-nav category:** Credit Cards (active)
- **Left-nav label:** "Minimum Payment"
- **Left-nav position:** Second item in Credit Cards group
- **Sitemap entry:** `<url><loc>https://calchowmuch.com/loans/credit-card-minimum-payment/</loc><changefreq>monthly</changefreq><priority>0.70</priority></url>`

---

## 10) Testing

### Unit Tests
- Existing tests in `requirements/specs/loans/credit-card-utils.test.js` cover `calculateMinimumPayment()`.
- Verify: firstPayment > 0, months > 0, totalInterest > 0.
- Edge case: payment too low returns error.
- Edge case: APR = 0 returns payoff with 0 interest.
- Edge case: very small balance (below floor) pays off in 1 month.

### E2E Tests (Playwright)
- MINPAY-TEST-E2E-1: Load page, verify nav active states, verify H1 + floor label + provider note, verify yearly table is prefilled on initial load (no placeholder row), run Calculate, verify result content.
- MINPAY-TEST-E2E-2: After Calculate, change input, verify results reset to placeholder.
- MINPAY-TEST-E2E-3: Verify explanation pane has 10 FAQ items and no `Scenario Summary` requirement.
- E2E assertion guard: explanation currency-sensitive dynamic values (`balance`, `floor`, `first-payment`, `interest`, `total`) must not contain `US$`/`$`.

### SEO Tests
- MINPAY-TEST-SEO-1: Verify title, meta description, H1, canonical, JSON-LD types (WebPage, SoftwareApplication, FAQPage, BreadcrumbList), 10 FAQs in schema, sitemap entry.

### UI Regression
- ISS-001 regression check if layout changes are made.

---

## 11) Acceptance Criteria

- [ ] Calculator loads and computes minimum payment payoff correctly with default values.
- [ ] All validation errors display correctly.
- [ ] No auto-recalculation on input change after first Calculate click (UI-2.6).
- [ ] No dropdowns in UI (UI-2.5).
- [ ] Explanation pane follows required section order (`H2 Summary` -> `H3 Results Table` -> `H3 Explanation` -> `H3 FAQs`) with 10 FAQs.
- [ ] `Scenario Summary` section is not required/present in explanation contract.
- [ ] Explanation highlighted dynamic values are currency-neutral (no `US$`, no `$`).
- [ ] Summary highlight chips are compact/readable (reduced padding/radius/contrast).
- [ ] FAQPage JSON-LD matches visible FAQ text verbatim.
- [ ] JSON-LD includes WebPage, SoftwareApplication, BreadcrumbList, FAQPage.
- [ ] Title, meta description, canonical URL are correct.
- [ ] Yearly payoff snapshot table is prefilled from default inputs on initial load.
- [ ] Calculator appears in sitemap.
- [ ] All unit, E2E, and SEO tests pass.
- [ ] P1/P2/P5 SEO checks pass.

---

## 12) Admin Delta Finalization (2026-02-08)

- H1 simplified to `Credit Card Minimum Payment`.
- Floor label simplified to `Lowest Monthly Payment ($)`.
- Provider note added under calculator inputs.
- Scenario summary removed from explanation contract.
- Explanation dynamic values made currency-neutral (no `US$`/`$` in chips).
- Summary chip spacing/readability tightened (compact style).
- Yearly table prefilled from default inputs on initial load.

### Doc-to-Implementation Consistency Verification

- `calculator-title` expected text: `public/loans/credit-card-minimum-payment/index.html`
- `cc-min-floor` label text: `public/loans/credit-card-minimum-payment/index.html`
- Provider note presence: `public/loans/credit-card-minimum-payment/index.html`
- Absence of `Scenario Summary` contract in explanation behavior: `requirements/specs/e2e/credit-card-minimum-payment.spec.js`
- Prefilled yearly table behavior: `public/calculators/loans/credit-card-minimum-payment/module.js`
- Currency-neutral explanation chips: `public/calculators/loans/credit-card-minimum-payment/module.js`

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
