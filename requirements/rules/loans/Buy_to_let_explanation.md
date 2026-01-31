Buy-to-Let Calculator — Explanation Pane, Summary, Tables, Graph, and FAQ
Status

Ready for Build

Scope

This requirement defines the Explanation Pane behavior and content for the Buy-to-Let calculator, including:
    Dynamic summary text
    Output snapshot table
    Input summary table
    Net cash flow graph
    FAQ section

No calculation logic is defined here; this requirement consumes outputs from the Calculation Pane only.

1. Objective
    Provide a clear, investor-focused explanation of Buy-to-Let results that:
        Is fully data-driven from Calculation Pane outputs
        Prevents data leakage back into the Calculation Pane
        Is suitable for SEO indexing
        Works across desktop and mobile

2. Pane Responsibilities (ISS Compliance)

Calculation Pane
    Owns all inputs
    Owns the Calculate button
    Produces outputs
    Explanation Pane
    Read-only
    Renders narrative, tables, graphs, and FAQs
    Must never modify inputs or outputs
    Must not trigger recalculation

3. Dynamic Buy-to-Let Summary (Top Section)
    Requirement
        Display a 2–3 line dynamic summary at the top of the Explanation Pane.
        Content Rules
        Must interpolate values from Calculation Pane outputs
        Must not exceed 3 lines


Template
Based on a property price of £{PROPERTY_PRICE} and monthly rent of £{MONTHLY_RENT},
this estimate shows expected cashflow, yields, and stress coverage under your selected
mortgage terms. With a {MORTGAGE_TYPE} mortgage at {INTEREST_RATE}% over
{LOAN_TERM_YEARS} years, your projected net monthly cashflow is
£{NET_MONTHLY_CASHFLOW} and stress coverage is {STRESS_COVERAGE}%.

4. Output Snapshot Table (Key Results)
Requirement

Render a compact table of outputs only.

Fields (Mandatory)
Output	Source
Monthly Mortgage Payment	MONTHLY_MORTGAGE_PAYMENT
Net Monthly Cashflow	NET_MONTHLY_CASHFLOW
Gross Yield	GROSS_YIELD
Net Yield	NET_YIELD
Stress Coverage	STRESS_COVERAGE
Rules

Outputs only (no inputs)

Table must be visually compact

Currency values use £

Percentages use %

5. Input Summary Table (Calculation Pane Inputs)
Requirement

Render a modest, non-dense summary table showing inputs used.

Fields
Input	Source
Property Price	PROPERTY_PRICE
Monthly Rent	MONTHLY_RENT
Deposit Type	DEPOSIT_TYPE
Deposit Amount	DEPOSIT_AMOUNT
Deposit Percent	DEPOSIT_PERCENT
Loan Amount	LOAN_AMOUNT
LTV	LTV_PERCENT
Interest Rate	INTEREST_RATE
Loan Term	LOAN_TERM_YEARS
Mortgage Type	MORTGAGE_TYPE
Rent Increase Enabled	RENT_INCREASE_ENABLED
Rent Increase Type	RENT_INCREASE_TYPE
Rent Increase Value	RENT_INCREASE_VALUE
Rent Increase Frequency	RENT_INCREASE_FREQUENCY
Vacancy Type	VACANCY_TYPE
Vacancy Value	VACANCY_VALUE
Letting Agent Fee	LETTING_AGENT_FEE
Maintenance (Monthly)	MAINTENANCE_MONTHLY
Insurance / Service / Ground Rent (Monthly)	INSURANCE_MONTHLY
Business Rules

If Deposit Amount is selected → Deposit Percent is ignored

If Deposit Percent is selected → Deposit Amount is ignored

Table must remain visually small (not a full spreadsheet)

6. Net Cash Flow Graph
Rendering Rules

Graph renders only after Calculate button is pressed

No data shown on initial load

Axes

X-axis: Years (0–35)

Y-axis: Net Cash Flow

Lines
Line	Meaning	Color
Line 1	Net Cash Flow	White
Line 2	Net Cash Flow with Rent Increase	Blue
Interaction & Layout

Hover tooltip enabled

No horizontal scroll

Legend positioned top-right

No forced minimum values on axes

Y-axis max must not exceed max net cashflow value

7. FAQ Section (Static Content)
Requirement

Render the following FAQ content verbatim below the graph.

Purpose

User education

SEO coverage

No dependency on calculation values

Topics Covered

What is a buy-to-let mortgage

How it works

Deposit requirements

Interest rates

Rental coverage rules

First-time buyers

Living in the property

Income requirements

Mortgage terms

Interest-only mortgages

Fees

Taxation

Remortgaging

Limited company buy-to-let

Investment risks

Void periods

Switching from residential to buy-to-let

(No logic or conditional rendering.)

8. Explicit Data Contract
Mandatory Fields
PROPERTY_PRICE
MONTHLY_RENT
MONTHLY_MORTGAGE_PAYMENT
NET_MONTHLY_CASHFLOW
GROSS_YIELD
NET_YIELD
STRESS_COVERAGE
INTEREST_RATE
LOAN_TERM_YEARS
MORTGAGE_TYPE

Optional / Conditional Fields
DEPOSIT_AMOUNT
DEPOSIT_PERCENT
RENT_INCREASE_*
VACANCY_*
LETTING_AGENT_FEE
MAINTENANCE_MONTHLY
INSURANCE_MONTHLY

9. Non-Functional Requirements

Explanation Pane must be read-only

No side effects on Calculation Pane

Mobile-friendly layout

SEO-safe static FAQ markup

No currency hardcoding outside £

No recalculation triggered from Explanation Pane

10. Out of Scope

Mortgage calculations

Validation logic

Tax calculations

Persistence or saving scenarios

Buy to Let Mortgage – Frequently Asked Questions (FAQ)

What is a buy to let mortgage?

A buy to let mortgage is a loan used to purchase property that will be rented out to tenants rather than lived in by the owner. Approval is based mainly on the expected rental income, not just your personal salary.

How does a buy to let mortgage work?

Lenders assess whether the projected rent can comfortably cover the mortgage payments. Most require rental income to exceed the mortgage interest by a set percentage, typically 125%–145%, depending on the lender and your tax status.

How much deposit do I need for a buy to let mortgage?

Most lenders require a minimum deposit of 20%–25% of the property value. Some higher-risk cases may require a larger deposit.

Are buy to let mortgage interest rates higher?

Yes. Buy to let mortgage rates are usually higher than residential mortgage rates because they are considered higher risk by lenders.

How much rental income do I need?

Rental income requirements vary by lender, but a common rule is that monthly rent must cover 125%–145% of the mortgage interest calculated at a stressed interest rate.

Can first-time buyers get a buy to let mortgage?

Some lenders allow first-time buyers, but many prefer applicants who already own a residential property. Requirements are typically stricter for first-time buyers.

Can I live in a buy to let property?

No. Buy to let mortgages are for rental purposes only. Living in the property would breach the mortgage terms. If your plans change, you must speak to your lender.

What is the minimum income requirement?

Many lenders require a minimum personal income (often 25,000 or more), even though affordability is primarily based on rental income.

How long can a buy to let mortgage term be?

Terms typically range from 5 to 35 years, depending on the lender and your age at the end of the term.

Are buy to let mortgages interest-only?

Most buy to let mortgages are interest-only, meaning you repay only the interest each month and repay the full loan amount when the property is sold or the mortgage ends.

What fees are involved?

Common fees include:

Arrangement or product fees

Valuation fees

Legal fees

Broker fees (if applicable)

These costs should be considered alongside the interest rate.

Do I pay tax on buy to let income?

Yes. Rental income is taxable. Mortgage interest tax relief is restricted and now given as a basic-rate tax credit. Tax rules can change, so professional advice is recommended.

Can I re-mortgage a buy to let property?

Yes. You can re-mortgage to secure a better rate, release equity, or change mortgage terms, subject to lender criteria and rental affordability checks.

What is a limited company buy to let mortgage?

This is a buy to let mortgage taken out by a limited company rather than an individual. It can offer tax advantages for some investors but usually comes with higher rates and fees.

Is buy to let a good investment?

Buy to let can provide rental income and potential capital growth, but it also carries risks such as void periods, maintenance costs, interest rate changes, and regulatory requirements.

What happens if the property is empty?

You are still responsible for mortgage payments even if the property has no tenants. Lenders expect landlords to manage periods without rental income.

Can I switch from residential to buy to let?

Yes, either by re-mortgaging or by obtaining lender consent to let. Each option has different implications and conditions.