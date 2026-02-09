# REQ-20260208-028 — Credit Card Consolidation Calculator (SERP-Ready Rebuild)

Calculator Group: Credit Cards
Calculator: Credit Card Consolidation Calculator
Primary Question (Single-Question Rule): Should I consolidate my credit card debt into a fixed-rate loan, and how much will I save compared to my current payments?
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
| 2        | Minimum Payment    | `/loans/credit-card-minimum-payment`       | No                   |
| 3        | Balance Transfer   | `/loans/balance-transfer-installment-plan` | No                   |
| 4        | Card Consolidation | `/loans/credit-card-consolidation`         | **Yes (is-active)**  |

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
| Public HTML      | `public/loans/credit-card-consolidation/index.html`          |
| Calculator Module | `public/calculators/loans/credit-card-consolidation/module.js` |
| Calculator CSS   | `public/calculators/loans/credit-card-consolidation/calculator.css` |
| Explanation HTML | `public/calculators/loans/credit-card-consolidation/explanation.html` |
| Shared Utils     | `public/assets/js/core/credit-card-utils.js`                  |
| Unit Tests       | `requirements/specs/loans/credit-card-utils.test.js`           |

---

## 1) Purpose & Search Intent

- **User intent:** A user has credit card debt across one or more cards and is considering consolidating into a single fixed-rate personal loan. They want to compare: current cards (high APR, fixed payment) vs. a consolidation loan (lower APR, fixed term). The comparison shows monthly payment change, interest savings, and total cost difference.
- **Modes:** Single mode only. No mode switching required. The calculator inherently compares two scenarios (current cards vs consolidation) in a single computation.
- **Core outputs:** Current payoff months, consolidation monthly payment, interest difference, total cost difference, side-by-side comparison table.

---

## 2) SEO Keywords

### Primary Keywords (3-6)
- credit card consolidation calculator
- debt consolidation calculator
- credit card debt consolidation calculator
- consolidation loan calculator

### Secondary Keywords (5-12)
- consolidate credit card debt calculator
- debt consolidation savings calculator
- credit card consolidation comparison
- personal loan consolidation calculator
- consolidation loan vs credit card
- credit card debt payoff comparison
- consolidation interest savings
- fixed rate consolidation calculator

### Long-tail / Intent Phrases (6-15)
- should I consolidate my credit card debt
- how much will I save by consolidating credit card debt
- compare credit card payments vs consolidation loan
- credit card consolidation calculator with fees
- is debt consolidation worth it calculator
- calculate consolidation loan payment and savings
- free credit card debt consolidation calculator
- consolidation loan vs paying credit cards separately
- compare interest costs credit card vs personal loan

### Placement Rules
- H1: "Credit Card Consolidation Calculator" (includes primary keyword)
- Title: "Credit Card Consolidation Calculator -- Compare & Save" (primary + qualifier)
- Meta description: primary keyword + benefit (compare costs, see savings) + core outputs
- Explanation H2 summary: includes "credit card consolidation" + "savings" naturally
- FAQs: at least 3 questions include primary/secondary keywords

---

## 3) URL & Canonical

- Slug: `/loans/credit-card-consolidation/`
- Canonical: `https://calchowmuch.com/loans/credit-card-consolidation/`

---

## 4) SEO Metadata

- **Title** (<=60 chars): `Credit Card Consolidation Calculator -- Compare & Save`
- **Meta description** (140-160 chars): `Compare paying credit cards separately vs consolidating into a fixed-rate loan. See monthly payment, interest savings, and total cost difference.`
- **Canonical URL:** `https://calchowmuch.com/loans/credit-card-consolidation/`
- **OpenGraph/Twitter:** Title and description must match. og:type = website. og:image = site default.

---

## 5) Calculation Pane (UI)

### Inputs

| Label | ID | Type | Default | Min | Max | Step | Required |
|-------|----|------|---------|-----|-----|------|----------|
| Total Card Balance | cc-con-balance | number | 12000 | 0.01 | -- | 0.01 | Yes |
| Current Average APR (%) | cc-con-apr | number | 19.5 | 0 | -- | 0.01 | Yes |
| Current Monthly Payment | cc-con-payment | number | 400 | 0.01 | -- | 0.01 | Yes |
| Consolidation APR (%) | cc-con-new-apr | number | 10.5 | 0 | -- | 0.01 | Yes |
| Consolidation Term (years) | cc-con-term | number | 3 | 1 | -- | 1 | Yes |
| Consolidation Fees | cc-con-fees | number | 250 | 0 | -- | 0.01 | No |

### Modes
- Single mode only. No mode switching. The calculator compares two scenarios (current cards vs consolidation) automatically.

### Output Spec (after Calculate click)
Results displayed in `#cc-con-result` and `#cc-con-summary`:
- **Monthly payment change:** +/- $X,XXX.XX
- **Interest difference:** $X,XXX.XX
- **Total cost difference:** $X,XXX.XX
- **Consolidation payment:** $X,XXX.XX

### Validation Rules
- Balance must be > 0: `"Balance must be greater than 0."`
- Current APR must be >= 0: `"Current APR must be 0 or higher."`
- Consolidation APR must be >= 0: `"Consolidation APR must be 0 or higher."`
- Term must be > 0: `"Consolidation term must be greater than 0."`
- Current payment must be > 0: `"Current payment must be greater than 0."`
- If current payment is too low to reduce current balance: error from `calculateCreditCardPayoff()`.

### UI Interaction Contract
- Calculate button triggers computation (UI-2.6). No auto-recalculation on input change after first calculation.
- After first Calculate click, any input change must reset results to placeholder state until next Calculate click.
- No dropdowns (UI-2.5).

---

## 6) Compute Logic

### Constants & Defaults
- `MAX_MONTHS = 720` (60 years safety cap for current card payoff)
- Term is input in years, converted to months: `termMonths = max(1, round(termYears * 12))`

### Formulas
Uses `calculateConsolidation()` from `/assets/js/core/credit-card-utils.js`:

**Current cards scenario:**
```
Uses calculateCreditCardPayoff({balance, apr: currentApr, monthlyPayment: currentPayment})
Returns: months, totalInterest, totalPayment
```

**Consolidation scenario:**
```
newBalance = balance + max(0, fees)
termMonths = max(1, round(termYears * 12))
monthlyPayment = computeMonthlyPayment(newBalance, consolidationApr, termMonths)
  where computeMonthlyPayment uses standard amortization:
  r = consolidationApr / 100 / 12
  payment = newBalance * r / (1 - (1 + r)^(-termMonths))
Schedule built via buildAmortizationSchedule()
Returns: monthlyPayment, totalInterest, totalPayment, months
```

**Comparison outputs:**
```
monthlyDifference = currentPayment - consolidation.monthlyPayment
interestDifference = current.totalInterest - consolidation.totalInterest
totalDifference = current.totalPayment - consolidation.totalPayment
```

Positive values mean consolidation saves money; negative means consolidation costs more.

### Edge Cases
- Current payment too low for current APR: error from inner `calculateCreditCardPayoff()`.
- Consolidation APR = 0: No interest on consolidation loan; pure principal payoff.
- Fees = 0: No fees added to consolidation balance.
- Term = 1 year: 12-month consolidation loan.
- Consolidation is worse than current: negative savings displayed (this is valid information for the user).

### Rounding/Precision
- Internal: full precision. `computeMonthlyPayment()` returns precise value.
- Display: currency values to 2 decimal places. Months as whole number.

---

## 7) Explanation Pane

Must follow UI-EXP-PANE-STD section order (mandatory).

### H2 Summary
Dynamic text referencing user inputs and outputs:
- References: balance, current APR, current payment, current payoff months, consolidation APR, consolidation term, consolidation payment, interest savings, total cost difference.
- Includes interpretation of whether consolidation saves or costs more.

### H3 Scenario Summary Table
| Category | Value | Source |
|----------|-------|--------|
| Total Card Balance | {balance} | Input |
| Current Average APR | {currentApr}% | Input |
| Current Monthly Payment | {currentPayment} | Input |
| Consolidation APR | {newApr}% | Input |
| Consolidation Term | {term} months | Input |
| Consolidation Fees | {fees} | Input |
| Current Payoff Time | {currentMonths} months | Output |
| Consolidation Payment | {newPayment} | Output |
| Interest Savings | {interestDiff} | Output |
| Total Cost Difference | {totalDiff} | Output |

### H3 Results Table (Cost Comparison)
| Scenario | Months | Total Interest | Total Paid |
|----------|--------|----------------|------------|
| Current Cards | {currentMonths} | {currentInterest} | {currentTotal} |
| Consolidation | {conMonths} | {conInterest} | {conTotal} |

Dynamic rows populated from `calculateConsolidation()` output. This table uses a comparison format (2 rows) rather than a yearly snapshot.

### H3 Explanation (Plain Language)
- What credit card consolidation means
- How a lower APR reduces total interest
- Impact of consolidation fees on savings
- When consolidation makes sense vs. when it doesn't
- Fixed term vs. open-ended credit card payoff
- Assumptions and limitations

### H3 Frequently Asked Questions
FAQs model: **10 new** (EXP-FAQ-1)

1. What is credit card debt consolidation?
2. How does a consolidation loan reduce interest costs?
3. When is consolidation not worth it?
4. How are consolidation fees handled in the calculation?
5. What APR can I expect for a consolidation loan?
6. Does consolidation affect my credit score?
7. Can I consolidate cards with different APRs?
8. What happens if I miss a payment on a consolidation loan?
9. Does this calculator include origination fees?
10. How do I compare consolidation vs. balance transfer?

Each FAQ must be in a bordered container (`.cc-con-faq-item`). Q: bolded, A: indented. 6px gap between FAQ boxes.

---

## 8) JSON-LD

- **WebPage:** name, url, description, inLanguage: en
- **SoftwareApplication:** name, applicationCategory: FinanceApplication, operatingSystem: Web, url, description, browserRequirements, softwareVersion: 1.0, creator (CalcHowMuch), offers (free)
- **BreadcrumbList:** Home > Credit Cards > Credit Card Consolidation Calculator
- **FAQPage:** Yes (10 FAQs, must match visible FAQ text verbatim)
- **Schema guard:** `pageSchema = { calculatorFAQ: true, globalFAQ: false }`

---

## 9) Sitemap & Navigation

- **Top-nav category:** Credit Cards (active)
- **Left-nav label:** "Card Consolidation"
- **Left-nav position:** Fourth (last) item in Credit Cards group
- **Sitemap entry:** `<url><loc>https://calchowmuch.com/loans/credit-card-consolidation/</loc><changefreq>monthly</changefreq><priority>0.70</priority></url>`

---

## 10) Testing

### Unit Tests
- Existing tests in `requirements/specs/loans/credit-card-utils.test.js` cover `calculateConsolidation()`.
- Verify: current.months > 0, consolidation.monthlyPayment > 0, interestDifference is defined.
- Edge case: consolidation worse than current (negative savings).
- Edge case: fees = 0.
- Edge case: consolidation APR = 0.
- Edge case: current payment too low returns error.

### E2E Tests (Playwright)
- CONSOLIDATION-TEST-E2E-1: Load page, verify nav active states, fill inputs, click Calculate, verify result content and comparison table.
- CONSOLIDATION-TEST-E2E-2: After Calculate, change input, verify results reset to placeholder.
- CONSOLIDATION-TEST-E2E-3: Verify explanation pane has 10 FAQ items.

### SEO Tests
- CONSOLIDATION-TEST-SEO-1: Verify title, meta description, H1, canonical, JSON-LD types (WebPage, SoftwareApplication, FAQPage, BreadcrumbList), 10 FAQs in schema, sitemap entry.

### UI Regression
- ISS-001 regression check if layout changes are made.

---

## 11) Acceptance Criteria

- [ ] Calculator loads and computes both scenarios correctly with default values.
- [ ] Comparison table shows Current Cards vs Consolidation side by side.
- [ ] Positive savings displayed when consolidation is cheaper; negative when it costs more.
- [ ] All validation errors display correctly.
- [ ] No auto-recalculation on input change after first Calculate click (UI-2.6).
- [ ] No dropdowns in UI (UI-2.5).
- [ ] Explanation pane follows UI-EXP-PANE-STD section order with 10 FAQs.
- [ ] FAQPage JSON-LD matches visible FAQ text verbatim.
- [ ] JSON-LD includes WebPage, SoftwareApplication, BreadcrumbList, FAQPage.
- [ ] Title, meta description, canonical URL are correct.
- [ ] Comparison table follows UTBL-* rules.
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
- [x] Single mode clearly defined (inherent two-scenario comparison)
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
