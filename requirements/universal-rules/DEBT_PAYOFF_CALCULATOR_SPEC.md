# Debt Payoff Calculator Spec

> [!IMPORTANT]
> This document is the authoritative implementation source for future build work on `/credit-card-calculators/debt-payoff-calculator/`. If later notes conflict, this file wins unless `UNIVERSAL_REQUIREMENTS.md` or explicit HUMAN direction says otherwise.

## 1. Route Identity

| Field | Value |
| :--- | :--- |
| Calculator Name | Debt Payoff Calculator |
| Primary Route | `/credit-card-calculators/debt-payoff-calculator/` |
| Cluster | `credit-card-calculators` |
| Route Role | Flagship multi-debt payoff planner |
| Core Promise | Show when the user becomes debt free, what it costs, and how payoff strategy changes the outcome |
| Content Bias | Heavy-content, trust-forward, strategy-rich |
| Adjacent Routes | `/credit-card-calculators/credit-card-payment-calculator/`, `/credit-card-calculators/credit-card-minimum-payment-calculator/`, `/credit-card-calculators/credit-card-consolidation-calculator/`, `/credit-card-calculators/balance-transfer-credit-card-calculator/` |

## 2. Goal and Success Criteria

### Goal
Create a flagship debt-planning route that goes beyond single-card payoff estimates and gives users a multi-debt action plan with strategy comparison, charts, tables, and strong educational framing.

### Success Criteria
- The page answers the first question users care about: when they will be debt free.
- The route clearly differs from existing single-card repayment, minimum-payment, balance-transfer, and consolidation tools.
- The calculator supports multiple debts and a strategy-level repayment plan.
- The page renders meaningful results, tables, and charts on first load using realistic default example data.
- The content is detailed enough to support trust, SEO, and long-form engagement.
- The spec leaves no unresolved decisions for future implementation.

## 3. Differentiation From Existing Credit-Card Routes

### Against Credit Card Payment Calculator
- `Credit Card Payment Calculator` is a single-balance payoff estimator.
- `Debt Payoff Calculator` is a multi-debt planner with strategy routing.

### Against Credit Card Minimum Payment Calculator
- `Credit Card Minimum Payment Calculator` illustrates minimum-only cost.
- `Debt Payoff Calculator` is the action planner that shows how to get out of debt with a structured strategy.

### Against Credit Card Consolidation Calculator
- `Credit Card Consolidation Calculator` compares debt consolidation structures.
- `Debt Payoff Calculator` compares active payoff strategies without requiring consolidation.

### Against Balance Transfer Credit Card Calculator
- `Balance Transfer Credit Card Calculator` focuses on moving debt to a different promotional-rate structure.
- `Debt Payoff Calculator` focuses on paying debt down across multiple balances over time.

## 4. Canonical Product Scope

### Supported Debt Universe
- All debts plus loans are supported in v1.
- Debt type is label-only in v1.
- Debt categories exist for clarity and explanation, not for separate payoff math engines.

### Dynamic Debt Rows
The planner must support dynamic add/remove debt rows.

Each row includes:
- Debt name
- Debt type label
- Current balance
- APR
- Minimum payment

### Global Repayment Inputs
- One global extra monthly payment pool
- Strategy selector
- Goal-date mode support in v1

### Strategy Support
The page must support:
1. Debt Snowball
2. Debt Avalanche

### Strategy Presentation
- The user-selected strategy is shown in full detail.
- The alternate strategy is shown through outcome delta cards.
- The chart area must toggle between strategies rather than permanently overlay both.

## 5. Default On-Load Behavior

### Default State
- The page must load with a realistic preloaded multi-debt example.
- The first view must not be blank.
- The first view must render charts, tables, and outcome cards immediately.

### Default Example Purpose
The example exists to:
- prevent an empty-state impression
- show the page’s full value immediately
- support CTR-to-engagement continuity

### Default Example Requirements
- Use multiple debts
- Use a realistic mix of balances and APRs
- Support meaningful snowball vs avalanche comparison
- Be clear enough to power the worked-example content below the fold

## 6. Primary Outcome Hierarchy

Above the fold, the page must prioritize:

1. Debt-free date
2. Payoff months
3. Total interest
4. Alternate-strategy outcome delta cards

The page should feel like a debt-outcome planner first, not an abstract finance explainer.

## 7. Required Outputs

### Core Answer Outputs
- Debt-free date
- Total months to payoff
- Total interest paid

### Supporting Data Outputs
- Monthly payoff schedule
- Yearly summary table

### Required Charts
- Total-balance-over-time line graph
- Principal-vs-interest pie chart

### Strategy Comparison Outputs
- Chosen strategy in full detail
- Alternate strategy shown as delta cards
- Graph area toggles between strategy views

## 8. Goal-Date Mode

Goal-date mode is in scope for v1.

### Purpose
- Let users estimate what monthly payment is needed to hit a target debt-free date.

### Product Role
- This is a secondary mode, not the primary default framing.
- The route still leads with debt-free date first, but goal-date planning is supported within the calculator contract.

## 9. Content Contract

### Content Depth
- Heavy-content route
- Strategy-rich and trust-rich
- Not a thin utility page

### Required Structure
1. Answer-first opening
2. Long-form guide
3. Snowball vs avalanche comparison section
4. Three named worked scenarios
5. Example table sections
6. FAQ
7. Assumptions and important notes

### Three Named Worked Scenarios
The page must include three distinct scenario examples with names or clear identities.

Each scenario should support:
- debt mix explanation
- strategy interpretation
- example table reference
- chart interpretation

### Content Constraints
- Do not pad with generic debt advice.
- Do not use motivational fluff as the main voice.
- Keep the page grounded in decision support and practical payoff interpretation.

## 10. Presentation Contract

### Visual Direction
- `Clean Editorial`

### Writing Tone
- `Analytical + Expert`

### Paragraph System
- Mixed paragraph lengths
- Tight editorial spacing between paragraphs
- No paragraph indentation anywhere

### Section Rhythm
- Strong H3 section breaks
- Compact H4 rhythm beneath them
- Medium editorial gap from heading to first paragraph
- Medium-strong separation between major sections

### Lists
- Sparse utility lists only
- Full-sentence bullet items
- Tight clean spacing between bullet items

### Formula Presentation
- Plain formula blocks
- Center aligned
- Subtle monospace treatment
- Medium breathing room around the formula block
- Each formula followed by a mini explanatory paragraph

### Tables
- Compact but airy
- Muted strong headers
- Soft dividers
- No heavy striping
- Tight controlled gap from heading to table
- Medium separation from table to following paragraph or section
- Each table gets a dedicated heading plus one-line context
- Numeric columns should align for finance readability during implementation

### Charts
- One tight insight line under each chart
- Medium framing around chart modules

#### Line Graph
- Single clean line
- No default area fill
- Graph area toggles between strategies
- Title on the left, strategy control row on the top right

#### Pie Chart
- Flat 2-slice chart
- Principal vs interest only
- No 3D effects
- No exploded slices
- Labels in an external legend, not crowded onto the slices

## 11. Formula and Logic Notes

The implementation should explicitly explain, at minimum:
- how monthly interest is derived from APR
- how minimum payments and extra payment pool interact
- how balance reduction is modeled over time
- how strategy order changes payment routing
- how goal-date mode translates into target-payment logic

The page should present formulas to build trust, but not in an overly academic style.

## 12. Trust and Assumptions

The page must clearly state:
- fixed APR assumption
- no new debt assumption
- no promo-rate or changing-rate modeling in v1
- debt type labels do not change the underlying payoff math in v1

The route must avoid:
- hidden calculation assumptions
- emotional or coaching-style overpromising
- muddy overlap with consolidation or balance-transfer tools

## 13. SEO and Intent Notes

### Primary Search Intent
- debt payoff calculator
- debt snowball calculator
- debt avalanche calculator
- how long until I am debt free
- compare snowball vs avalanche payoff

### Route Positioning
- This is debt-payoff intent first.
- It should still link tightly into the existing credit-card loop.
- It should not be presented as just a credit-card-only calculator.

## 14. Acceptance Scenarios

### Product Scenarios
1. Add multiple debt rows and compute a valid payoff plan.
2. Remove a debt row and recalculate.
3. Run the plan with Snowball selected.
4. Run the plan with Avalanche selected.
5. Switch strategy and toggle the graph view.
6. Enter a global extra payment pool and see strategy routing reflected.
7. Use goal-date mode and get a corresponding target-payment outcome.

### Output Scenarios
1. Page loads with a prefilled multi-debt example.
2. Debt-free date appears above the fold.
3. Payoff months appear above the fold.
4. Total interest appears above the fold.
5. Alternate-strategy delta cards appear above the fold.
6. Monthly schedule is available.
7. Yearly summary is available.
8. Line graph shows total balance over time.
9. Pie chart shows principal vs interest.

### Content and Presentation Scenarios
1. The heavy content structure is present in the required order.
2. Three named worked scenarios are present.
3. Formula blocks follow the locked formatting system.
4. Table sections follow the locked spacing and labeling system.
5. Charts follow the locked visual direction and caption system.

## 15. Build Checklist

Use this checklist as the mandatory build gate for future implementation.

- [ ] Route is locked to `/credit-card-calculators/debt-payoff-calculator/`.
- [ ] Calculator name is `Debt Payoff Calculator` across route, metadata, and UI.
- [ ] The route is positioned as a debt-payoff planner, not a single-card tool.
- [ ] Multiple debts plus loans are supported in v1.
- [ ] Debt type is label-only in v1.
- [ ] Dynamic debt rows are present.
- [ ] Each row includes debt name, debt type, balance, APR, and minimum payment.
- [ ] A single extra monthly payment pool is present.
- [ ] Snowball is supported.
- [ ] Avalanche is supported.
- [ ] Goal-date mode is supported in v1.
- [ ] A realistic multi-debt default example loads on first render.
- [ ] Debt-free date appears above the fold.
- [ ] Payoff months appear above the fold.
- [ ] Total interest appears above the fold.
- [ ] Alternate-strategy delta cards appear above the fold.
- [ ] Monthly schedule is required and implemented.
- [ ] Yearly summary is required and implemented.
- [ ] Total-balance-over-time line graph is required and implemented.
- [ ] Principal-vs-interest pie chart is required and implemented.
- [ ] Graph area toggles between strategies.
- [ ] Long-form guide is present.
- [ ] Snowball vs avalanche comparison section is present.
- [ ] Three named worked scenarios are present.
- [ ] Example table sections are present.
- [ ] FAQ is present.
- [ ] Assumptions and important notes are present.
- [ ] Writing tone matches `Analytical + Expert`.
- [ ] Paragraph, list, formula, table, and chart formatting follow this spec.
- [ ] Trust notes explicitly state fixed APR and no-new-debt assumptions.
- [ ] Acceptance scenarios are satisfied.
- [ ] All internal-link behavior matches `DEBT_PAYOFF_CALCULATOR_LINK_PLAN.md`.

## 16. Implementation Notes

- This route is intentionally heavier than surrounding credit-card tools.
- The route should act like a flagship bridge between payoff calculators and strategy/explanation content.
- If later work attempts to simplify away charts, tables, or worked scenarios, that is a scope change and should not happen silently.
- If later work tries to turn debt types into type-specific calculation engines, that is a separate approved expansion, not part of this v1 contract.
