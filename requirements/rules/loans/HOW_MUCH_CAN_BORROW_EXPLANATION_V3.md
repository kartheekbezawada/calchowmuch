Problem Statement
The current “How Much Can I Borrow” page lacks a structured, intent-aligned Explanation Pane that clearly connects user inputs to outcomes in a transparent, lender-realistic way. 
Users need a predictable pattern: 
(1) Borrowing Summary 
 (2) Scenario Table 
 (3) Explanation 
(4) FAQ, with sections 1 and 2 fully driven by Calculation Pane data rather than static text.
________________________________________
Scope (What must be built)
Implement an Explanation Pane composed of four sections in this exact order:
1.	Initial Borrowing Summary (Dynamic) – H2 Heaader
2.	Scenario Summary Table (Dynamic) – H3 Header
3.	General Explanation of lender logic (Static) – H3 Header
4.	FAQ (Static) – H3 Header
Sections 1 and 2 must be derived programmatically from Calculation Pane values — no hardcoded numbers or examples.
________________________________________
Out of Scope
•	Charts or visualizations
•	Personalized financial advice
•	Credit-score logic
•	Lender matching
•	Dynamic FAQs
________________________________________


Section 1 — Initial Borrowing Summary (Agent Instructions)
Requirement R1
The agent must generate this summary dynamically using only Calculation Pane outputs, including at minimum:
•	Gross Annual Income
•	Net Monthly Income
•	Monthly Expenses
•	Monthly Debt Payments
•	Interest Rate (APR %)
•	Loan Term
•	Estimated Max Borrowing - > This as Final answer highlighted 
Required structure (template, not literal text)
The summary must communicate all of the following ideas in natural English:
•	That the result is an estimate, not a guarantee
•	That the estimate is based on:
o	user income
o	expenses
o	selected interest rate
o	loan term
o	affordability method
•	That lenders may vary in their final decision
⚠️ Rule: Do NOT print raw input numbers in this section.
Instead, instruct the system to reference them conceptually (e.g., “based on your income, expenses, and chosen rate…”).
________________________________________
Section 2 — Scenario Summary Table (Agent Instructions)
Requirement R2
The agent must automatically construct a Scenario Summary Table from the Calculation Pane data.
Table contract
Column	Source	Constraint
Category	Fixed labels	As defined below
Your Value	Must pull from Calculation Pane	No defaults
What it means	Static guidance	Short, neutral
Mandatory rows (must appear in this order):
•	Gross Annual Income
•	Net Monthly Income
•	Monthly Expenses
•	Monthly Debt Payments
•	Interest Rate (APR %)
•	Loan Term
•	Affordability Method
•	Income Multiple
•	Deposit (optional)
•	Estimated Max Borrowing - > This as Final answer highlighted 
⚠️ Rule: This table is the only place where raw input values are shown.
________________________________________
Section 3 — General Explanation (Static Content)
The Explanation Pane must cover, in plain language:
•	How lenders assess borrowing:
o	income multiples
o	affordability checks
o	stress testing for rate rises
•	Why results change when inputs change
•	That different lenders may approve different amounts
This text can be standardized across all users.
________________________________________
Section 4 — FAQ (Static Content)
The page must include at least these FAQs:
Frequently Asked Questions (FAQ)
Q1. Is this a guaranteed amount I can borrow?
No. This is only an estimate. Final approval depends on your credit score, employment stability, and the lender’s policies.
Q2. Why is my borrowing less than 5x my income?
Because lenders adjust for:
•	your expenses,
•	existing debts, and
•	interest rate stress tests.
Q3. Can I borrow more with a longer loan term?
Often yes — a longer term can lower monthly payments and increase affordability, but you will pay more interest overall.
Q4. Do different lenders give different amounts?
Yes. Some lenders are more flexible with expenses or income multiples than others.
Q5. Should I speak to a broker?
If you are serious about buying, a broker can match you with the lender most likely to approve your application.
Note :- Use this tool to understand your mortgage borrowing power, plan your deposit, and estimate how much house you can afford before applying.
________________________________________
UI Placement Rules
•	Section 1 → Top of Explanation Pane
•	Section 2 → Immediately below Section 1
•	Section 3 → Below table
•	Section 4 → At the bottom
No collapsible panels unless approved later.
________________________________________
Acceptance Criteria
The build is complete when:
•	Section 1 uses Calculation Pane data conceptually (no hard numbers shown).
•	Section 2 table auto-populates from inputs.
•	Table updates when inputs change and result is recalculated.
•	Sections 3 and 4 are present and readable.
•	No lender guarantees are implied anywhere on the page.
________________________________________
Files likely to change
(Agent to fill based on repo structure)
•	/public/.../how-much-can-i-borrow.html
•	Explanation pane component or template
________________________________________
Definition of Done
•	UI renders correctly
•	Dynamic values update
•	Text remains neutral, compliant, and SEO-safe
•	No JavaScript errors in console

