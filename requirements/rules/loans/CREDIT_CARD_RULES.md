CAR_LOAN_CALCULATOR_REBUILD_RULES.md


Title: Car Loan (Auto Loans) — Fix Calculations + Move Graph/Table to Explanation Pane + SEO Blog Explanation
Change Type: Bug Fix + UI Relocation + SEO Content + Table/Graph Enhancements

1) Problem Statement

The existing Car Loan Calculator under Loans → Auto Loans → Car Loan Calculator is not producing correct results (calculation not working or not updating). It also currently renders a graph inside the Calculation Pane, which violates the platform separation rules (complex outputs belong in the Explanation Pane). The Explanation Pane must become SEO-friendly blog content with tables + graphs placed at the top.

2) Goals

    Rebuild the calculator logic deterministically (inputs → compute → render).
    Keep the Calculation Pane compact: inputs + a few summary results only.
    Move Graph + Amortization Table into the Explanation Pane.
    Make Explanation Pane blog-style, long-form, SEO-heavy with multiple sections + FAQs.

Add:
    A table toggle: Monthly / Yearly
    Graph always Yearly with hover tooltips
    Table columns: Date (MM-YYYY), Principal Amount, Interest, Total
    Graph: X = years, Y = amount, series = Total, Principal, Interest
    Remove currency symbols from table cells and graph values (units established via headers/labels).

3) Page Placement & Navigation
Top Navigation
Appears under Auto Loans top nav and any small icon like Time and Date.
Left Navigation Hierarchy
Auto Loans
    Car Loan Calculator 
Routing

URL: /auto-loans/car-loan-calculator

Deep-linking must activate:

Loans in top nav

Auto Loans section expanded in left nav

Car Loan Calculator highlighted

4) Calculation Pane (Inputs + Compact Summary Only)
Inputs (Interactive)

Vehicle Price (number)

Down Payment Type (segmented buttons): Amount / Percent

Down Payment (number)

Trade-in Value (number)

Dealer Fees (number)

Sales Tax (%) (number)

APR (%) (number)

Loan Term (years) (number; allow decimals? No, integer only)

Button: Calculate (primary)

Input Validation (Required)

All numeric fields must be ≥ 0

Sales Tax %: 0–30

APR %: 0–40

Loan Term years: 1–8 (integer)

Down payment percent: 0–100

Prevent Amount Financed < 0 (show inline error: “Down payment + trade-in exceeds total cost.”)

Compact Outputs (Calculation Pane)

Show as short text lines only:

Amount Financed

Monthly Payment

Total Interest

Total Cost (Principal + Interest)

Rules:

No tables in Calculation Pane

No graphs in Calculation Pane

No currency symbols in values (use labels like “Amount (GBP)” or “Amount”)

5) Core Logic (Rebuild Spec)
Definitions

Let:

P = vehicle price

fees = dealer fees

trade = trade-in value

taxRate = salesTaxPercent / 100

apr = aprPercent / 100

years = loanTermYears (integer)

n = years * 12

r = apr / 12

Down Payment

If Down Payment Type = Amount:

down = downPaymentAmount
If Down Payment Type = Percent:

down = P * (downPaymentPercent / 100)

Taxable Base (Deterministic Rule)

Sales tax is applied to:

taxable = max(0, (P - trade) + fees)

Then:

tax = taxable * taxRate

Amount Financed

amountFinanced = (P - down - trade) + fees + tax

Clamp: if amountFinanced < 0 → error state (do not compute payment)

Monthly Payment

If aprPercent == 0:

monthlyPayment = amountFinanced / n
Else:

monthlyPayment = amountFinanced * (r * (1+r)^n) / ((1+r)^n - 1)

Amortization Schedule (Monthly)

For month m = 1..n:

interest_m = balance * r

principal_m = monthlyPayment - interest_m

balance = max(0, balance - principal_m)

total_m = principal_m + interest_m (equals payment except last month rounding)

Rounding rule:

Round display to 2 decimals

Keep internal computation in full precision; adjust final payment to close balance to zero if needed.

6) Explanation Pane (SEO Blog + Graph + Table at Top)
Top of Explanation Pane (Always First)

Order:

Removable summary block (text)

Graph (Yearly only)

Table (toggle Monthly/Yearly)

6.1 Graph Requirements (Yearly Only)

X-axis: Year number (1..years)

Y-axis: Amount (no currency symbol)

Series (3 lines):

Total Paid (per year)

Principal Paid (per year)

Interest Paid (per year)

Hover tooltip required:

On hover, show values for that year for all 3 series

Fixed-height container; must not change page height.

Graph data source:

Aggregate monthly schedule into yearly buckets.

Yearly aggregation rule:

Year k includes months ((k-1)*12 + 1) .. min(k*12, n).

6.2 Table Requirements (Toggle Monthly / Yearly)

Toggle control in Explanation Pane above table: Monthly / Yearly

Default: Yearly (lower row count; better UX)

Table columns (exact):

Date (MM-YYYY)

Principal Amount

Interest

Total

Date rules:

Use Loan Start Month = current local month/year at compute time (no additional input in v1).

Monthly view:

One row per month, date increments monthly from start month.

Yearly view:

One row per year using 12-YYYY (end of year marker) except partial last year uses month of last payment.

Principal/Interest/Total are summed for that year.

Table format rules:

Semantic <table><thead><tbody><tfoot>

Full outer border + full gridlines

Numeric columns right-aligned

No cell wrapping

No currency symbols in cells (headers define units)

7) Explanation Pane Content (Blog-Style, SEO-Heavy)
Required Sections (H2/H3)

H2: What is a Car Loan Calculator?

H2: How Monthly Car Loan Payments Work

H3: APR vs Interest Paid

H3: Loan Term Trade-offs (shorter vs longer)

H2: How Down Payments and Trade-ins Reduce Borrowing

H2: Fees and Sales Tax (What Gets Financed)

H2: How to Use This Calculator (Step-by-step)

H2: Examples (at least 2 scenarios)

H2: Assumptions and Limitations

H2: Frequently Asked Questions (minimum 10 FAQs)

FAQ topics (minimum):

What is amount financed?

Does a bigger down payment lower total interest?

How does a trade-in affect sales tax (not advice; just explain this calculator’s assumption)

What if APR is 0%?

Why does extending term lower monthly but increase total cost?

Are dealer fees included in financing?

Is this an official quote?

Why might my lender payment differ? (rounding, fees, insurance, etc.)

Can I model early payoff? (Not in v1)

What about balloon payments? (Not in v1)

Structured Data:

Add FAQPage JSON-LD for the FAQ section.

8) SEO Metadata

Title: Car Loan Calculator – Monthly Payment, Interest, and Amortization

Meta Description: Estimate car loan monthly payments after down payment, trade-in, fees, and sales tax. View yearly payment graph and amortization table.

H1: Car Loan Calculator

Canonical: /loans/auto-loans/car-loan-calculator

9) Non-Goals (v1)

No lender offers or rate shopping

No insurance/maintenance calculations

No balloon payments

No early payoff / extra payment logic

No currency selection (values remain symbol-agnostic)

10) File Structure
/public/calculators/loans/auto-loans/car-loan-calculator/
  index.html
  module.js
  explanation.html

11) Testing Requirements
Unit Tests (Required)

Amount financed calculation (amount + percent down payment paths)

APR = 0 case

Standard amortization payment sanity check (known expected values within tolerance)

Yearly aggregation correctness (sum(monthly) == yearly total)

Date formatting MM-YYYY rollovers across years

E2E Tests (Required)

Inputs change → calculate → results update

Graph exists in Explanation Pane, not in Calculation Pane

Table exists in Explanation Pane with toggle Monthly/Yearly

Hover over graph shows tooltip values

No currency symbols in table cells

12) Acceptance Criteria

MUST HAVE

 Calculator computes and updates correctly for provided sample inputs

 Graph removed from Calculation Pane and rendered in Explanation Pane

 Graph: yearly only; axes labeled; series = total/principal/interest; hover tooltip works

 Table in Explanation Pane with toggle Monthly/Yearly; default Yearly

 Table columns exactly: Date (MM-YYYY), Principal Amount, Interest, Total

 Values symbol-agnostic (no currency symbols in cells/tooltips)

 Explanation Pane is long-form SEO blog with required sections + 10+ FAQs

 FAQPage structured data added

 Unit + E2E tests pass

SHOULD HAVE

 Smooth toggle without layout shifts

 Scroll containers stable; no page height growth