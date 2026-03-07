# Personal Loan Calculator Requirements

## 1. Objective
Build a Personal Loan calculator in the loans cluster to estimate monthly payment, total repayment, and total interest for a fixed-rate installment loan.

## 2. Route, Cluster, and Identity
- Public route: `/loan-calculators/personal-loan-calculator/`
- Source route folder: `public/calculators/loan-calculators/personal-loan-calculator/`
- Cluster: `loans`
- Calculator ID: `personal-loan`
- Canonical URL: `https://calchowmuch.com/loan-calculators/personal-loan-calculator/`
- H1: `Personal Loan Calculator`
- Explanation H2 must be intent-led: `Personal Loan Complete Practical Guide`

## 3. Scope
In scope:
- Personal Loan calculator page and assets under loan-calculators
- Calculator UI, formula logic, and result summary
- Explanation content and FAQ content
- SEO metadata and JSON-LD for calculator route
- Sitemap inclusion for the new public route
- Scoped tests for the new calculator and release evidence

Out of scope:
- Variable-rate loan engine
- Refinance or debt-consolidation scenario comparison engine
- Account/login, save/share history features

## 4. Functional Requirements
- User can enter:
- Loan amount
- Annual interest rate (APR)
- Loan term (years and months or total months)
- Optional one-time setup fee (default `0`)
- Optional monthly extra payment (default `0`)
- System validates all inputs before calculation.
- System calculates and displays:
- Monthly payment (base EMI)
- Monthly payment with extra amount applied
- Total repayment
- Total interest
- Total cost including one-time fee
- Estimated payoff duration with extra payment
- User can reset all values to defaults.
- Result refreshes on calculate action and must be deterministic for same input values.

## 5. Input Rules and Validation
- Loan amount:
- Required
- Numeric
- Minimum `500`
- Maximum `5,000,000`
- APR:
- Required
- Numeric percent
- Minimum `0`
- Maximum `60`
- Loan term:
- Required
- Integer months after normalization
- Minimum `3` months
- Maximum `600` months
- Setup fee:
- Optional
- Numeric
- Minimum `0`
- Monthly extra payment:
- Optional
- Numeric
- Minimum `0`
- Must not exceed a value that creates negative remaining balance in first month
- Invalid or out-of-range values show clear inline error text.

## 6. Calculation Rules
- Let:
- `P` = principal loan amount
- `r` = monthly interest rate = `APR / 100 / 12`
- `n` = total number of monthly payments
- `f` = one-time setup fee
- `x` = monthly extra payment

- Base monthly payment formula:
- If `r > 0`:
- `M = P * r * (1 + r)^n / ((1 + r)^n - 1)`
- If `r = 0`:
- `M = P / n`

- Base totals:
- `TotalRepayment = M * n`
- `TotalInterest = TotalRepayment - P`
- `TotalCostWithFee = TotalRepayment + f`

- Extra payment scenario:
- `EffectivePayment = M + x`
- Recompute amortization month by month using:
- `Interest_t = Balance_(t-1) * r`
- `Principal_t = EffectivePayment - Interest_t`
- `Balance_t = Balance_(t-1) - Principal_t`
- Stop when balance reaches `0` or below.
- `PayoffMonthsWithExtra` is the number of months to clear the balance.
- `InterestWithExtra` is sum of monthly interest in extra-payment schedule.
- `InterestSaved = TotalInterest - InterestWithExtra`

- Rounding:
- Internal math at full precision.
- Display currency to 2 decimals.
- Display percentages to 2 decimals.

## 7. UX and Architecture Requirements
- Must follow MPA architecture.
- Must not introduce SPA navigation.
- Must use hard links (`<a href>`) for navigation.
- Route metadata must be declared in navigation config:
- `routeArchetype: calc_exp`
- `designFamily: home-loan`
- `paneLayout: single`
- Page must render correctly on desktop and mobile.
- Inputs require accessible labels and keyboard support.
- Output cards must show clear labels and units.
- Include an optional compact amortization preview table for first 12 months.

### 7.1 UX Vision and Experience Target
- Design goal: premium but simple.
- Experience goal: user should understand what to do within 5 seconds, complete the calculation within 30 seconds, and understand the result without reading technical docs.
- No overwhelm rule:
- Show only essential inputs in the primary panel.
- Keep advanced controls collapsed under "Advanced options".
- No underwhelm rule:
- Results must feel meaningful with clear primary number, secondary insights, and actionable guidance.
- Visual tone: trustworthy, modern, smooth, calm.

### 7.2 Layout Blueprint (Top to Bottom)
- Section 1: Hero intro with one-sentence value statement.
- Section 2: Single-pane calculator hero block with two columns on desktop.
- Left column: inputs and actions.
- Right column: result summary cards and payoff insights.
- Section 3: Optional amortization preview table (first 12 months).
- Section 4: Personal Loan Complete Practical Guide (`800-1200` words).
- Section 5: FAQ block.
- Section 6: Important Notes block (must be final explanation section).

### 7.3 Input Design Requirements
- Primary inputs visible by default:
- Loan Amount
- APR
- Loan Term
- Advanced panel (collapsed by default):
- Setup Fee
- Extra Monthly Payment
- Each numeric input must support:
- Number field entry
- Optional range slider where useful for quick adjustment
- Immediate value formatting helper text
- Real-time validation with inline error text
- Primary CTA:
- `Calculate Payment`
- Secondary CTA:
- `Reset`
- Input interaction must avoid jitter and layout shift.

### 7.4 Result and Insight Design Requirements
- Result area must include:
- Primary card: Monthly Payment
- Secondary cards: Total Interest, Total Repayment, Total Cost with Fee, Payoff with Extra
- Insight row:
- Interest Saved with Extra
- Months Saved with Extra
- Result labels must be plain English.
- Numbers must include currency symbol and separators.
- Show assumptions label near outputs:
- "Fixed-rate estimate based on entered values."

### 7.5 Motion and Smoothness Requirements
- Use subtle transitions only:
- Input focus, card updates, and collapsible panel transitions
- Motion duration target: `150ms` to `220ms`
- Animation easing must prioritize readability, not decoration.
- Must avoid long tasks and stutter on input and slider interactions.
- No layout thrash during calculations.

### 7.6 Visual Design System Requirements
- Use existing home-loan design family tokens and component style patterns.
- Keep strong contrast and clean spacing.
- Typography hierarchy must clearly separate:
- H1 page intent
- Input labels
- Primary result number
- Explanatory help text
- Card style requirements:
- Rounded corners, soft depth, clear boundaries
- Distinct visual emphasis for primary result card
- "Highly attractive simple smooth wow design" requirement:
- Achieve with hierarchy, spacing, typography, and subtle motion
- Do not rely on flashy effects, heavy gradients, or crowded widgets

### 7.7 Mobile UX Requirements
- Mobile-first readability for `360px+` widths.
- Core inputs and primary result must be visible without excessive scrolling.
- Tap targets must be comfortably sized.
- Input keyboard types must match input purpose (`inputmode` numeric/decimal where applicable).
- Sticky or persistent result summary is optional but must not block inputs.

### 7.8 Accessibility and Clarity Requirements
- Labels linked to inputs.
- Error text must be specific and actionable.
- Keyboard-only flow must cover full calculation journey.
- Color cannot be the only indicator of state.
- Screen reader announcements required for result updates.
- Copy style must be simple English with low jargon.

### 7.9 UI/UX Acceptance Checklist
- User can complete a calculation without opening advanced options.
- User can understand primary output and next action in one glance.
- Desktop and mobile layouts maintain consistent hierarchy.
- No visual clutter in input area or result area.
- Calculator feels smooth on interaction and updates without delay.

## 8. SEO and Content Requirements
- Title tag:
- `Personal Loan Calculator - Monthly Payment, Interest & Total Cost | CalcHowMuch`
- Meta description:
- `Calculate personal loan monthly payments, total interest, and payoff time. Add extra monthly payments to see interest savings and early payoff.`
- JSON-LD:
- WebPage
- SoftwareApplication
- BreadcrumbList
- FAQ content required and intent-aligned.
- Route must be included in sitemap.

## 9. Mandatory How to Guide Requirement
- Include a user-facing guide with length between `800` and `1200` words.
- Explanation block order for `calc_exp` route must be:
- Intent-led `H2` (`Personal Loan Complete Practical Guide`)
- `Intent`
- `Complete Practical Guide`
- `FAQ`
- `Important Notes`

- Intent must explain:
- What this calculator solves
- Who should use it
- When to use it and when not to use it

- Complete Practical Guide must explain:
- Every input in simple English
- Full formula explanation in plain English
- At least one worked example with real values
- How extra monthly payment changes payoff and interest
- How to interpret outputs for decision-making

- Important Notes must include:
- Assumptions and limitations
- Rounding behavior
- Financial disclaimer that results are estimates, not professional advice

## 10. Implementation File Targets
- `public/calculators/loan-calculators/personal-loan-calculator/index.html`
- `public/calculators/loan-calculators/personal-loan-calculator/module.js`
- `public/calculators/loan-calculators/personal-loan-calculator/calculator.css`
- `public/calculators/loan-calculators/personal-loan-calculator/explanation.html`
- `public/loan-calculators/personal-loan-calculator/index.html` (generated/static route output)
- Loans scope map and route registry files needed by cluster conventions
- `tests_specs/loans/personal-loan_release/` scoped release specs
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_{ID}.md`

## 11. Release Gates (Scoped + Mandatory)
- `npm run lint`
- `npm run test`
- `CLUSTER=loans CALC=personal-loan npm run test:calc:unit`
- `CLUSTER=loans CALC=personal-loan npm run test:calc:e2e`
- `CLUSTER=loans CALC=personal-loan npm run test:calc:seo`
- `CLUSTER=loans CALC=personal-loan npm run test:calc:cwv`
- `npm run test:iss001`
- `CLUSTER=loans CALC=personal-loan npm run test:schema:dedupe -- --scope=calc`
- `CLUSTER=loans CALC=personal-loan npm run test:seo:mojibake -- --scope=calc`
- `npm run test:content:quality -- --scope=calc`

## 12. Acceptance Criteria
- Calculator route is live and reachable at `/loan-calculators/personal-loan-calculator/`.
- All required inputs validate correctly.
- Formula outputs match approved unit test vectors.
- 800-1200 word guide exists with required section order.
- FAQ + schema validations pass and sitemap contains the route.
- All required scoped tests and mandatory gates pass.
- Release sign-off file is completed with evidence.
