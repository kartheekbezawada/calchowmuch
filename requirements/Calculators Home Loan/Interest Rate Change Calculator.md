# Interest Rate Change Calculator

## How much does a mortgage rate change affect my monthly payment?

An interest rate change calculator estimates the exact pound impact on your monthly repayment and total lifetime interest when a mortgage rate rises or falls, either immediately or after a chosen number of months, across your remaining loan term.

A one or two percentage point rate change can feel abstract until you see the numbers. On a 250,000 mortgage with 25 years left, moving from 5% to 6.5% adds about 226 per month and over 67,000 in total interest across the full term. That is the kind of figure most borrowers need before making a remortgaging decision, accepting a lender's offer, or planning a budget for a fixed-rate end date. This calculator puts both scenarios side by side so the comparison is immediate.

## What does an interest rate change calculator help me answer?

This calculator is built to answer the questions most borrowers ask when rates move:

- How much will my mortgage payment go up if rates rise?
- What does a 1% rate increase cost me per month?
- Can I afford the new payment if my fixed rate expires?
- How much total interest will I save if I switch to a lower rate?
- What is the difference in payment if my rate changes in six months versus now?
- How do I compare my current deal against a new rate offer?

## What this interest rate change calculator shows

The calculator runs two parallel amortisation paths and compares them across your remaining term — a baseline using your current rate, and a new scenario using the rate you want to test.

### Inputs

- **Loan Balance** — the current outstanding mortgage balance in pounds
- **Current Rate (APR %)** — the interest rate you are paying now
- **New Rate (APR %)** — the rate you want to test, either higher or lower than the current rate
- **Remaining Term (years)** — how many years are left on the mortgage
- **Rate Change Timing** — whether the new rate applies from the start of the remaining term (Apply Immediately) or takes effect after a certain number of months (After X Months)
- **Change After (months)** — how many months to stay on the current rate before switching to the new rate; only active when After X Months timing is selected

### Outputs

- **New Monthly Payment** — the recalculated monthly repayment based on the new rate
- **Baseline Monthly Payment** — the monthly repayment at the current rate, for comparison
- **Monthly Difference** — how much more or less the new payment is compared to the baseline, per month
- **Annual Difference** — the monthly difference scaled to a full year
- **Baseline Total Interest** — lifetime interest paid at the current rate over the remaining term
- **New Scenario Total Interest** — lifetime interest paid at the new rate over the remaining term
- **Total Interest Change** — the overall difference between the two paths
- **Rate Change Table** — monthly or yearly breakdown showing payment and balance for both scenarios side by side

## Why use an interest rate change calculator?

Mortgage rates rarely stay the same. Fixed deals expire. Tracker rates move with the base rate. Variable rates are adjusted by lenders. Each of those events restarts the payment calculation at a new interest rate, and the impact is not always intuitive.

The calculator is useful for:

- Stress-testing your budget before a fixed-rate end date by entering a realistic new rate
- Comparing a current lender SVR against a remortgage offer to see the monthly and lifetime saving
- Modelling how a delayed rate change — such as a rate fix that kicks in after six months — differs from an immediate switch
- Understanding why small-sounding rate moves produce large total interest differences on long-term mortgages

## How does an interest rate change calculator work?

The calculator runs standard mortgage amortisation for two scenarios and compares the outputs.

### Step 1 — Baseline monthly payment

The current rate path is calculated using the full remaining term at the current rate.

$$M_{\text{current}} = P \times \frac{r_c \times (1 + r_c)^{n}}{(1 + r_c)^{n} - 1}$$

Where:

- **M_current** = monthly payment at current rate
- **P** = loan balance
- **r_c** = monthly current rate = current APR ÷ 12 ÷ 100
- **n** = total remaining months = remaining years × 12

### Step 2 — New rate monthly payment

The new rate path recalculates the payment using the same balance and remaining term but the new rate.

$$M_{\text{new}} = P \times \frac{r_n \times (1 + r_n)^{n}}{(1 + r_n)^{n} - 1}$$

Where:

- **r_n** = monthly new rate = new APR ÷ 12 ÷ 100

### Step 3 — Monthly and annual difference

$$\text{Monthly Difference} = M_{\text{new}} - M_{\text{current}}$$

$$\text{Annual Difference} = \text{Monthly Difference} \times 12$$

A positive result means the new rate costs more per month. A negative result means it saves money.

### Step 4 — After X Months timing

When the rate change is set to apply after a chosen number of months rather than immediately, the calculator runs the current rate for those months first. The outstanding balance at the switch point is then used as the new starting principal for the new rate calculation.

$$P_{\text{switch}} = \text{Balance remaining after } k \text{ months at } r_c$$

The new rate payment is then:

$$M_{\text{new}} = P_{\text{switch}} \times \frac{r_n \times (1 + r_n)^{(n - k)}}{(1 + r_n)^{(n - k)} - 1}$$

This means the delayed scenario produces a slightly lower balance at the switch point, which can make a small difference to the new payment compared to an immediate switch.

### Step 5 — Total interest comparison

$$\text{Baseline Interest} = \sum_{\text{all months}} \text{Interest portion at } r_c$$

$$\text{New Scenario Interest} = \sum_{\text{all months}} \text{Interest portion at } r_n$$

$$\text{Total Interest Change} = \text{New Scenario Interest} - \text{Baseline Interest}$$

A positive change means the new rate costs more over the full remaining term. A negative change means a saving.

## What do the calculator inputs mean?

### Loan Balance

The outstanding mortgage balance today, not the original loan amount. Use your most recent statement. This is the amount both payment calculations are based on.

### Current Rate (APR %)

The interest rate you are currently paying. This is used to build the baseline scenario for comparison. If you are unsure of your exact APR, check your lender's most recent mortgage statement.

### New Rate (APR %)

The rate you want to test. This could be a new deal you have been quoted, a stress-test rate to check budget headroom, a predicted base rate outcome, or your lender's Standard Variable Rate when your fix expires.

### Remaining Term (years)

The number of years left on the mortgage. The longer the remaining term, the larger the total interest impact when rates change. This is one of the most sensitive inputs in the calculation.

### Rate Change Timing

- **Apply Immediately** — the new rate is assumed to start from the first month of the remaining term. Use this when the rate change has already happened or the new product would start right away.
- **After X Months** — the current rate continues for a chosen number of months, then the new rate takes over on the remaining balance. Use this when you know your fix expires in a set period, or when a deal takes time to arrange.

### Change After (months)

Only active when After X Months timing is selected. Sets the number of months before the rate switch. For example, entering 12 means the current rate applies for one more year before the new rate takes effect on the remaining balance.

## What do the calculator outputs mean?

### New Monthly Payment

The recalculated monthly repayment at the new rate. This is the primary number most borrowers need: it tells you what the new rate means in actual monthly cost.

### Baseline Monthly Payment

The comparison payment at your current rate. Reading this alongside the new payment immediately shows the monthly cost difference.

### Monthly Difference

How much more or less you would pay per month under the new rate versus the current rate. This is the most budget-relevant figure for day-to-day affordability planning.

### Annual Difference

The monthly difference multiplied by twelve. This makes the impact easier to context against annual income or household budget planning.

### Total Interest Change

The overall difference in interest paid across the full remaining term. This figure is typically much larger than borrowers expect because small monthly differences compound across many years. It is the most important output for long-term cost decisions.

## How to use the interest rate change calculator

1. **Enter your current loan balance.** Use your latest statement balance.
2. **Set the current rate.** Enter the APR you are paying now.
3. **Enter the new rate to test.** Try the rate you have been quoted, your lender's SVR, or a stress-test rate.
4. **Set the remaining term.** Use years remaining, not the original mortgage length.
5. **Choose timing.** Select Apply Immediately if the change is now, or After X Months if you know when your deal ends.
6. **Set months if using delayed timing.** Enter how many months before the rate switches.
7. **Review payment difference first.** The monthly and annual difference tells you whether the new rate is affordable.
8. **Check total interest change.** This gives you the lifetime perspective — the full cost of the new rate over the remaining term.
9. **Adjust the new rate up and down.** Test a range — for example, 5.5%, 6.0%, and 6.5% — to understand how sensitive your costs are to small rate movements.

## Example: how much does a 1.5% rate rise cost me?

Using the calculator defaults:

| Input | Example Value |
| --- | --- |
| Loan Balance | 250,000 |
| Current Rate | 5.0% |
| New Rate | 6.5% |
| Remaining Term | 25 years |
| Timing | Apply Immediately |

| Output | Baseline (5.0%) | New Scenario (6.5%) |
| --- | --- | --- |
| Monthly Payment | 1,461.48 | 1,688.02 |
| Monthly Difference | — | +226.54 |
| Annual Difference | — | +2,718.51 |
| Total Interest | ~188,443 | ~256,405 |
| Total Interest Change | — | +67,963 |

A 1.5 percentage point rate rise on a 250,000 mortgage with 25 years remaining costs an extra 226.54 per month, 2,718 per year, and approximately 67,963 more in total interest across the full remaining term. These numbers explain why borrowers approaching a fixed-rate end date should model their options before the rate change takes effect.

## Apply Immediately vs After X Months — comparison

| Comparison Point | Apply Immediately | After X Months |
| --- | --- | --- |
| When to use | Rate change is happening now or from day one | You know your fix ends in a set number of months |
| Balance used for new calculation | Full current balance | Reduced balance after k months of current rate |
| Monthly payment at new rate | Calculated from current balance | Slightly lower, because balance has reduced slightly |
| Total interest | Full remaining term at new rate | Mix: current rate for k months, then new rate on remainder |
| Most useful for | Immediate affordability check | Fix expiry planning and budget setting |

The distinction matters when planning around a deal expiry. If you still have 12 months left on your fix, the balance at expiry will be slightly lower — which means the new payment could be marginally less than an immediate calculation suggests. The After X Months mode captures this more accurately.

## Important Notes

- This calculator is a planning and decision-support tool. It does not represent a lender offer, mortgage approval, or guaranteed repayment figure.
- Monthly payments are calculated using standard amortisation. Some lenders calculate interest daily rather than monthly, which can produce minor differences.
- The After X Months mode assumes the outstanding balance at the switch month is calculated using standard amortisation at the current rate. Your actual balance at that date may differ depending on lender compounding conventions.
- Taxes, insurance, service charges, and any other costs beyond principal and interest are not included in this model.
- Product fees, broker fees, and early repayment charges are not included and could materially affect whether a rate switch is financially beneficial overall.
- Total interest figures reflect the full remaining term at each rate and should be read as indicative estimates, not guaranteed costs.
- Results are estimates only. Users should validate rate change scenarios with their mortgage lender or an independent mortgage adviser before making financial decisions.

## UI Placement Contract

- Render the full interest rate change guide content in the explanation area below the calculator interaction block and rate change table.
- Render Important Notes as the final content block.
- Do not use FAQ selector classes for Related Calculator cards.
