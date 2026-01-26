Remortgage Switching: Output Ownership, Data Contract & ISS Enforcement
Title
Make Explanation Pane the single authoritative owner of Remortgage Switching outputs, backed by a strict data contract and ISS regression rules
Type
UI / Calculation Output / Governance / ISS
Priority
P0 — incorrect behaviour + high regression risk

Intent
The Remortgage Switching calculator must strictly separate inputs and outputs:
• Calculation Pane → inputs + computation only
• Explanation Pane → results, visualisations, and explanations only
All outputs must be dynamic, currency-agnostic, and driven by a single explicit data contract.
Any future leakage of outputs back into the Calculation Pane must be automatically detected and fail the build via ISS rules.

Scope
• Remortgage Switching Calculator only
• Calculation Pane
• Explanation Pane
• ISS visual / structural regression checks

Functional Requirements
FR-1 Pane Responsibility (Hard Rule)
• Calculation Pane MUST contain inputs only
o Input fields
o Action buttons (e.g., calculate)
• Calculation Pane MUST NOT contain:
o Remortgage summary blocks
o Cost comparison tables
o Graphs or charts
o <table> elements
• Explanation Pane MUST contain all outputs:
1. Remortgage Summary
2. Cost Comparison Table
3. Cumulative Cost Over Time graph
4. Narrative explanation derived from results

FR-2 Dynamic Behaviour
• The Explanation Pane MUST be fully dynamic.
• Any change to an input MUST immediately update:
o Summary values
o Table values
o Graph values
o Narrative explanation text
• No hardcoded or placeholder output values are allowed.

FR-3 Currency-Agnostic Output
• All numeric outputs MUST be displayed without any currency symbol.
• Prohibited symbols include (but are not limited to): £ $ € ₹ ¥.
• Thousands separators and decimals are allowed per existing formatting rules.

FR-4 Graph Interaction
• The Cumulative Cost Over Time graph MUST:
o Render in the Explanation Pane only
o Update dynamically with inputs
o Show a tooltip on hover displaying:
 Time period
 Current deal cumulative cost
 New deal cumulative cost

Data Contract Between Panes (Authoritative)
Ownership Rule
• Calculation Pane produces the model
• Explanation Pane consumes and renders
• Explanation Pane MUST NOT recompute values independently.

Contract: Required Fields
A) Inputs (echoed for explanation)
• current.apr_percent
• current.remaining_term_months
• current.monthly_payment
• current.balance_remaining
• current.fees_total
• new.apr_percent
• new.term_months
• new.monthly_payment
• new.fees_total
• new.initial_rate_period_months (if applicable)
• comparison.horizon_months

B) Summary Outputs
• summary.current_monthly_payment
• summary.new_monthly_payment
• summary.monthly_difference
• summary.annual_difference
• summary.current_deal_fees_total
• summary.new_deal_fees_total
• summary.fees_difference_total
• summary.break_even_month
• summary.break_even_label
• summary.total_cost_current_at_horizon
• summary.total_cost_new_at_horizon
• summary.total_savings_at_horizon

C) Cost Comparison Table
table.rows[] where each row includes:
• period_month
• current.cumulative_cost
• new.cumulative_cost
• difference

D) Graph Series
graph.series[] entries:
• month
• current_cumulative_cost
• new_cumulative_cost
Optional but supported:
• graph.break_even_month

E) Formatting Hints
• format.number_decimals
• format.thousands_separator

Narrative Explanation Requirements
The Explanation Pane MUST generate a narrative explanation that dynamically references the contract values and explains:
• Monthly payment difference (current vs new)
• Annualised impact
• How fees are included in total cost
• When and why break-even occurs
• How cumulative cost evolves over time
Narrative Template (Dynamic)
Your current monthly payment is X, compared to Y on the new deal, resulting in a monthly difference of Z (approximately A per year).
Fees of F are included in the total cost of the new deal. While these increase the upfront cost, lower ongoing payments reduce the cumulative cost over time.
The break-even point occurs at T, when cumulative savings exceed the initial fees. Beyond this point, the new deal becomes increasingly cheaper.
The chart above shows how cumulative costs for both deals change over the selected period.
(X, Y, Z, A, F, T must be injected from the data contract.)

ISS Regression Rules (Build-Blocking)
ISS-REMORT-1 — No Outputs in Calculation Pane (P0)
Fail if the Calculation Pane contains:
• Summary containers
• Tables
• Graph/chart containers
• <table> elements

ISS-REMORT-2 — Outputs Must Exist in Explanation Pane (P0)
Fail if the Explanation Pane is missing:
• Remortgage Summary
• Cost Comparison Table
• Cumulative Cost Over Time graph

ISS-REMORT-3 — No Duplicate Outputs Across Panes (P0)
Fail if any output container appears in both panes.

ISS-REMORT-4 — Currency Symbol Prohibition (P1)
Fail if rendered output text contains any currency symbol.

ISS-REMORT-5 — Graph Hover Interaction (P1)
Fail if graph hover does not display:
• Time period
• Current deal value
• New deal value

Acceptance Criteria
• AC-1: Calculation Pane contains inputs only
• AC-2: Explanation Pane contains all outputs and explanations
• AC-3: Outputs update dynamically with input changes
• AC-4: No currency symbols are rendered
• AC-5: Graph hover displays correct values
• AC-6: ISS rules fail on any output leakage or duplication
• AC-7: Explanation text accurately reflects calculated values

Definition of Done
• Outputs fully migrated to Explanation Pane
• Explicit data contract implemented and consumed
• Broken/static content removed
• ISS regression rules active and passing
• No P0 or P1 violations

One-line invariant (for agents)
Calculation Pane computes; Explanation Pane explains — and ISS enforces the boundary.