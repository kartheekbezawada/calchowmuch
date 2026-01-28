HOW_MUCH_I_CAN_BORROW_RULES.md
REQ_ID: REQ-20260128-001
Title: How Much Can I Borrow Calculator (Loans) — Form Density + Progressive Disclosure + Slider Inputs
Change Type: New Calculator + UI Contract + SEO Shell
________________________________________
1) Page Metadata & Navigation
Top Navigation
•	Follow Existing 
Left Navigation
•	Follow Existing 
Hierarchy:
•	Follow Existing
Routing
•	URL: /loans/how-much-can-i-borrow
•	Deep linking must:
o	Activate Loans in top nav
o	Highlight How Much Can I Borrow in left nav
SEO Metadata
•	Title: How Much Can I Borrow? – Estimate Borrowing Power
•	Meta Description: Estimate how much you can borrow based on income, expenses, interest rate, term, deposit, and affordability method. Simple, fast, and free.
•	H1: How Much Can I Borrow?
________________________________________
2) Scope & General Characteristics
•	Single dedicated calculator page
•	Inputs designed using Form Density & Progressive Disclosure rules
•	No lender offers, no application flows, no legal/official guarantee claims
•	Output is an estimate for planning only
________________________________________
3) Calculation Pane Layout (Required Row Contract)
Must implement exactly these rows inside the Calculation Pane:
Row 1 (two inputs)
•	Gross Annual Income (required)
•	Net Monthly Income (optional)
Row 2 (buttons)
•	Income Basis Buttons (required)
o	Button group values (minimum):
	Use Gross Income
	Use Net Income
o	Default: Use Gross Income
Row 3 (two inputs)
•	Monthly Expenses (required)
•	Monthly Debt Payments (required)
Row 4 (two sliders)
•	Interest Rate (APR %) — slider (required)
•	Loan Term (Years) — slider (required)
Row 5 (buttons)
•	Affordability Method Buttons (required)
o	Button group values (minimum):
	Income Multiple
	Payment-to-Income
o	Default: Income Multiple
Row 6 (two sliders)
•	Income Multiple (e.g., 4–5.5x) — slider (required)
•	Deposit (optional) — slider (optional)
Progressive disclosure rule for optional inputs
•	Deposit slider may be hidden behind an “Optional inputs” disclosure toggle, but only if it does not disrupt Row 6 structure. If hidden, Row 6 must still be stable (show Deposit: — placeholder until expanded).
________________________________________
4) Input Definitions & Validation
Gross Annual Income
•	Number input
•	Required
•	Range: 0–10,000,000
•	Inline validation errors only
Net Monthly Income (optional)
•	Number input
•	Optional
•	Range: 0–1,000,000
Monthly Expenses
•	Number input
•	Required
•	Range: 0–1,000,000
Monthly Debt Payments
•	Number input
•	Required
•	Range: 0–1,000,000
Interest Rate Slider (APR %)
•	Range slider
•	Required
•	Min: 0.00
•	Max: 49.99
•	Step: 0.01
•	Default: 6.50
•	Display value must show two decimal places (e.g., 1.56%)
Loan Term Slider (Years)
•	Range slider
•	Required
•	Min: 0
•	Max: 50
•	Step: 1
•	Default: 25
Affordability Method Buttons
•	Required
•	Default: Income Multiple
Income Multiple Slider
•	Range slider
•	Required when Affordability Method = Income Multiple
•	Min: 1.00
•	Max: 10.00
•	Step: 0.01
•	Default: 4.50
•	Display must show two decimals and “x” suffix (e.g., 4.50x)
Deposit Slider (optional)
•	Range slider
•	Optional
•	Min: 0.00
•	Max: 1,000,000.00
•	Step: 0.01
•	Default: 0.00
•	Display must show two decimals
________________________________________
5) Slider UI Styling Contract (Mandatory)
Gradient Families (pick-and-assign)
Use these gradients exactly (left-to-right), one per slider:
•	Blue → Cyan: #3b82f6 → #06b6d4
•	Green → Emerald: #10b981 → #059669
•	Orange → Red: #f97316 → #dc2626
•	Violet → Indigo: #8b5cf6 → #6366f1
Track Color (right side)
•	Track after current value must be: #1e293b
Thumb (Handle) Styling (All sliders)
•	Size: 20×20
•	Shape: Circle (border-radius: 50%)
•	Color: #ffffff
•	Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
•	Cursor: pointer
•	Remove default appearance
Slider Track Styling
•	Height: 8px
•	Border-radius: 9999px
Dynamic Gradient Fill (Mandatory behavior)
On input event, calculate percent:
percent = ((value - min) / (max - min)) * 100
Then set background with 4 stops:
•	0% gradient start color
•	{percent}% gradient end color
•	{percent}% track color #1e293b
•	100% track color #1e293b
________________________________________
6) Calculation Outputs (Calculation Pane)
Show compact outputs (text only):
•	Borrowing Estimate (primary)
•	Monthly Payment Estimate (secondary)
•	Assumptions line: chosen method, term, APR
No graphs/tables in Calculation Pane.
________________________________________
7) Core Logic (v1 Estimate Rules)
Method A — Income Multiple (default)
•	Base borrowing = (selected income basis annual amount) * incomeMultiple
•	If Deposit > 0, total budget = base borrowing + deposit (display separately)
•	Apply a simple affordability cap using expenses:
o	monthlyDisposable = selected monthly income - expenses - debt
o	If monthlyDisposable <= 0 → show warning and set payment-based cap to 0
o	Compute estimated payment for base borrowing using APR and term
o	If payment > monthlyDisposable, reduce borrowing iteratively (binary search) until payment <= monthlyDisposable
Method B — Payment-to-Income
•	Borrowing is solved from max affordable payment:
o	maxPayment = monthlyDisposable
o	Solve principal from annuity formula using APR + term
o	Add deposit to show “total budget” separately
Notes
•	Use stable numeric methods; do not loop excessively
•	Display values to 2 decimals; compute internally at higher precision
________________________________________
8) Explanation Pane (SEO Shell v1)
•	Blog-style explanation content (long-form) describing:
o	What borrowing power means
o	How income, expenses, and debt affect affordability
o	How APR and term influence monthly payment and borrowing
o	What deposit does (separate from borrowing)
o	How to use the calculator
o	FAQs (minimum 10)
Structured data:
•	Add FAQPage JSON-LD for the FAQ section.
No requirement to include graphs/tables here in v1 unless added later.
________________________________________
9) Form Density & Progressive Disclosure Compliance (Must)
This calculator must comply with:
•	UUI-FDP / UIPD universal rules
•	ISS-UIFD / ISS-UIPD tests for:
o	Max 2 inputs per row
o	Optional inputs must not block calculation
o	Toggle must not cause layout shifts
________________________________________
10) File Structure
/public/calculators/loans/how-much-can-i-borrow/
  index.html
  module.js
  explanation.html
________________________________________
Acceptance Criteria
MUST HAVE
•	Route /loans/how-much-can-i-borrow
•	Navigation activation and highlight correct
•	Calculation pane rows match Row 1–6 exactly as specified
•	Interest rate slider supports 0.00–49.99 with step 0.01 and two-decimal display
•	Loan term slider supports 0–50 years
•	Income multiple and deposit sliders support two-decimal precision
•	Sliders use required gradients, track color, and thumb styling
•	Dynamic gradient fill updates on input
•	Compact outputs shown in Calculation Pane (no table/graph)
•	Inline validation errors only
•	No layout shifts when toggling method or income basis
SHOULD HAVE
•	Keyboard accessibility for sliders and buttons
•	Clear warnings when disposable income is non-positive
WON’T HAVE (v1)
•	Lender-specific rules, offers, or pre-approval
•	Jurisdiction-specific affordability regulations
•	Saving history or exporting results
________________________________________
Codex Prompt for Sliders (Implementation Reference)
Create 4 HTML range sliders with these exact specifications:

SLIDER 1 (Income Multiple)
- Min: 1
- Max: 10
- Step: 0.01
- Default: 4.5
- Gradient: Linear from #3b82f6 (left) to #06b6d4 (at current value)
- Track: #1e293b from current value to end

SLIDER 2 (Deposit)
- Min: 0
- Max: 1000000
- Step: 0.01
- Default: 0
- Gradient: Linear from #10b981 (left) to #059669 (at current value)
- Track: #1e293b from current value to end

SLIDER 3 (Interest Rate APR)
- Min: 0
- Max: 49.99
- Step: 0.01
- Default: 6.5
- Gradient: Linear from #f97316 (left) to #dc2626 (at current value)
- Track: #1e293b from current value to end

SLIDER 4 (Loan Term Years)
- Min: 0
- Max: 50
- Step: 1
- Default: 25
- Gradient: Linear from #8b5cf6 (left) to #6366f1 (at current value)
- Track: #1e293b from current value to end

ALL SLIDERS:
- Height: 8px
- Border radius: 9999px
- Thumb size: 20×20px circle
- Thumb color: #ffffff
- Thumb shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Remove default appearance
- Cursor: pointer

DYNAMIC GRADIENT:
- Calculate percentage: ((value - min) / (max - min)) * 100
- Update background on input event
- Gradient stops at: 0%, {percent}%, {percent}%, 100%
- First two stops are gradient colors
- Last two stops are track color #1e293b


## Testing

| Type | Command | Coverage | Result |
|------|---------|----------|--------|
| Unit (Vitest) | `pnpm test requirements/specs/loans/loan-utils.test.js` | Affordability math, payment-to-income method, monthly disposable guardrails | PASS |
| ISS-001 Layout (Playwright) | `pnpm test:iss001` | Form density, progressive disclosure, layout stability | PASS |

> **Notes**
>
> - Vitest wiring asserts the new monthly disposable guardrail, deposit inclusion, and affordability gap messaging described in this document.
> - ISS-001 ensures the updated Calculation Pane rows, slider gradients, and optional deposit toggle remain stable under interaction.
> - Evidence + iteration details are recorded in `compliance-report.md`, `testing_tracker.md`, and `iterations/ITER-20260128-154622.md`.
