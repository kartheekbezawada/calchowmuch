# Commission Calculator

## Introduction

This calculator estimates how much commission a salesperson, broker, or affiliate earns from a sale based on either a single flat rate or a multi-tier commission structure.

It is built for sales managers designing compensation plans, freelance reps estimating deal payouts, hiring managers benchmarking commission offers, and business owners modeling the cost of their sales channel. If you need to answer "what does this sale actually pay out?" before the deal closes, this is the right tool.

Use it when you are:

- Structuring a new sales compensation plan and need to see the cost at different deal sizes.
- Comparing a flat-rate offer against a tiered plan to decide which pays better.
- Estimating affiliate or referral payouts before signing a partnership agreement.
- Checking whether your current commission structure is competitive for recruiting.

The calculator handles both simple flat-rate commissions and progressive tiered plans where different slices of the sale earn different rates — the same model used by most enterprise sales organizations, real estate brokerages, and insurance agencies.

---

## How This Calculator Works

The calculator has two modes. Each mode uses different inputs, but both produce the same outputs: total commission earned and the effective commission rate.

### Mode: Flat Rate

In flat-rate mode you enter two values:

**Total Sales**
This is the gross value of the deal, before any deductions. Enter the full contract value or total revenue from the sale. If you are calculating quarterly commission on a book of business, use the total sales for that period. The commission scales linearly with this number — double the sales, double the payout.

A common mistake is entering net revenue (after returns or chargebacks) when your commission plan is based on gross sales, or vice versa. Check your plan terms before entering a number.

**Commission Rate (%)**
This is the percentage of each dollar of sales that goes to the salesperson. A 7.5% rate on $30,000 in sales produces $2,250 in commission.

Rates vary widely by industry. SaaS sales reps typically earn 8–12% on new annual contract value. Real estate agents receive 2.5–3% of the property price. Affiliate programs often pay 5–30% depending on the product category. If you are benchmarking your rate, make sure you are comparing the same commission base (gross vs. net, one-time vs. recurring).

### Mode: Tiered Plan

In tiered mode the calculator splits total sales across bands, each with its own rate. This mirrors how most progressive commission structures work in practice.

**Tier Thresholds (From / Up To)**
Each row defines a sales band. The first tier typically starts at $0 and runs to a threshold (e.g., $10,000). The next tier picks up where the previous one ended. Only the portion of sales within each band earns that band's rate.

Misunderstanding tier boundaries is the most common source of error. In a tiered plan, hitting the $50,000 threshold does not mean the entire $50,000 earns the higher rate — only the dollars above the previous threshold do.

**Tier Rates (%)**
Each band has its own commission rate. Tiered plans almost always increase the rate at higher bands to incentivize larger deals. For example: 5% on the first $10,000, 7% on $10,001–$25,000, and 10% above $25,000.

Changing the number of tiers or adjusting where thresholds fall has a significant effect on payout, especially near the boundaries. Use the add/remove tier controls to model different structures and compare the results.

### Outputs

**Total Commission** — The dollar amount earned from the sale. In flat mode this is simply sales multiplied by the rate. In tiered mode it is the sum of each tier's contribution.

**Effective Commission Rate** — Total commission divided by total sales, shown as a percentage. In flat mode this equals the input rate. In tiered mode it is always lower than the highest tier rate because lower tiers pull it down. This number is useful for comparing a tiered offer against a flat-rate alternative.

---

## What Affects the Final Commission

Beyond the numbers you enter, several real-world factors determine what actually gets paid:

**Commission base definition.** Plans differ on whether commission is calculated on gross revenue, net revenue (after returns), contract value, or collected revenue. Two plans with the same rate can produce very different payouts depending on which base they use.

**Accelerators and decelerators.** Many enterprise plans include accelerators that increase the rate once a rep exceeds quota, or decelerators that reduce the rate for underperformance. This calculator does not model quota attainment multipliers, but you can approximate an accelerated rate by using tiered mode and setting the upper tiers at post-quota rates.

**Caps and floors.** Some plans cap total commission at a fixed amount or guarantee a minimum draw. If your plan has a cap, compare the calculator result to the cap to see which applies.

**Clawbacks.** In subscription or recurring-revenue businesses, commission may be clawed back if a customer churns within a defined period. The calculator shows the gross payout at the time of sale, not the net payout after potential clawbacks.

**Split commissions.** When two or more reps share a deal, total sales might remain the same but each person receives a fraction of the commission. Enter your split share as the rate (e.g., half of 10% = 5%) to model your individual payout.

**Payment timing.** Commission may be paid at booking, invoicing, or cash collection. The amount is the same, but the timing affects cash flow planning.

**Currency and tax.** Commission payouts are typically subject to income tax. The calculator does not include tax withholding. If you are working across currencies, convert all values to the same currency before entering them.

---

## Example Calculation

### Scenario: SaaS Account Executive — Tiered Quarterly Plan

A SaaS company pays commission on new annual contract value (ACV) using a three-tier quarterly structure:

| Tier | Sales Band | Rate |
|------|-----------|------|
| 1 | $0 – $25,000 | 8% |
| 2 | $25,001 – $75,000 | 10% |
| 3 | Above $75,000 | 13% |

The rep closes $110,000 in new ACV this quarter.

**Step 1 — Tier 1 commission:**
$25,000 × 8% = $2,000

**Step 2 — Tier 2 commission:**
$50,000 (the band from $25,001 to $75,000) × 10% = $5,000

**Step 3 — Tier 3 commission:**
$35,000 (the amount above $75,000) × 13% = $4,550

**Step 4 — Total commission:**
$2,000 + $5,000 + $4,550 = **$11,550**

**Step 5 — Effective rate:**
$11,550 ÷ $110,000 = **10.50%**

Even though the top tier pays 13%, the effective rate is 10.50% because the first $75,000 earned lower rates. This is the number to compare against a flat-rate offer of, say, 10%.

---

## How to Interpret Your Estimate

The calculator produces a mathematical result based on the values you enter. Here is how to put that number in context:

**If you are evaluating a comp plan offer:** Compare the effective rate across different deal sizes. A tiered plan may look generous at the top tier, but the effective rate at your realistic deal volume is what matters. Run two or three scenarios — one at your expected sales, one at 75% of that, and one at 125% — to see how the plan performs across a realistic range.

**If you are designing a commission structure:** The effective rate tells you what your average cost-of-sale will be at a given volume. If the effective rate at your median deal size exceeds your gross margin, the plan is not sustainable. Model a few representative deal sizes before finalizing thresholds.

**If you are comparing flat vs. tiered:** A flat 10% rate always pays exactly 10%. A tiered plan that tops out at 13% only reaches a 10.5% effective rate at $110K in the example above. The tiered plan pays more in absolute dollars on large deals but costs less on smaller ones. Your choice depends on which behavior you want to incentivize.

**When you may need a custom model:** This calculator does not handle quota attainment multipliers, multi-year deal discounts, team overrides, management bonuses, or ramp periods. If your plan includes those elements, use this calculator for the base commission and model the extras separately.

---

## Common Mistakes to Avoid

**Confusing gross and net sales.** Entering gross revenue when your plan pays on net (or vice versa) will skew the result. Check your plan document for the exact definition of the commission base.

**Treating tiered rates as flat rates.** In a tiered plan with a 13% top bracket, only the sales above the lower threshold earn 13%. The entire sale does not earn 13%. If you want to model a plan where the entire sale earns the highest qualifying rate (sometimes called a "cliff" plan), use flat-rate mode with the applicable rate instead.

**Forgetting to account for splits.** If you share commission with a co-seller or overlay rep, enter your split share as the rate, not the full rate. Otherwise the calculator will show the full payout, not your portion.

**Ignoring accelerators.** If your plan has a 1.5x accelerator above quota, your real rate above a certain threshold is higher than the base rate. You can approximate this in tiered mode by adding an extra tier with the accelerated rate.

**Using annual rates for monthly calculations.** If your plan pays a different rate per month or per quarter, make sure the sales figure matches the rate's time period. $120,000 annual at 10% is not the same plan as $10,000 monthly at 10% if the monthly plan resets tiers each month.

---

## Tips for Getting a More Accurate Estimate

**Use your actual plan document.** Commission plans often have footnotes about caps, minimum thresholds, and excluded revenue types. Pull the exact rates and thresholds from your plan, not from memory.

**Match the time period.** If your plan is quarterly, enter one quarter's sales — not annual sales divided by four — if the tiers reset each quarter. Quarterly tiers and annual tiers produce different effective rates for the same total annual sales.

**Model multiple scenarios.** Run the calculator at 80%, 100%, and 120% of your expected sales to see how the payout changes. This is especially useful for tiered plans where crossing a threshold significantly changes the marginal rate.

**Compare against the margin.** If you are a business owner setting rates, check that the commission at your expected sales volume stays within your gross margin. A 12% effective rate on a product with 30% gross margin is very different from 12% on a product with 60% gross margin.

**Include all deal components.** Some plans pay different rates on new business vs. renewals, or on product vs. services revenue. If your deal includes multiple components, calculate commission for each component separately.

---

## Frequently Asked Questions

### How accurate is this commission calculator?

The calculator produces exact results for the inputs you provide. It applies the flat or tiered formula precisely. The accuracy of your estimate depends on whether you enter the correct sales amount and commission rates from your actual plan.

### Does the calculator include taxes on commission?

No. Commission is taxable income in most jurisdictions, but the calculator shows gross commission before any tax withholding. Consult a tax professional or your payroll department for net-of-tax estimates.

### Can I use this for real estate commissions?

Yes. For a standard real estate commission, use flat-rate mode with the agent's share of the commission. For example, if the listing agreement is 6% split equally between buyer and seller agents, enter 3% as the rate and the property sale price as total sales.

### What is the difference between flat and tiered commission?

Flat commission applies one rate to the entire sale. Tiered commission splits the sale into bands and applies a different rate to each band. Tiered plans reward higher sales volumes with better marginal rates but produce a lower effective rate than the top tier rate.

### Can I model a commission plan with a cap?

The calculator does not have a built-in cap field, but you can compare the result to your cap manually. If the calculated commission exceeds your plan's cap, the actual payout is the cap amount.

### How do I calculate commission for a team?

Enter the team's total sales and the team commission rate. The result is the team's total commission pool. Divide that among team members according to your split rules separately.

### Is the effective rate useful for anything?

The effective rate is the single most useful number for comparing commission plans. It tells you the actual percentage cost-of-sale at a given volume level, which lets you compare a tiered plan against a flat plan, or two tiered plans against each other, on an apples-to-apples basis.

### What happens if I leave a tier gap in tiered mode?

If your tier thresholds do not connect (e.g., Tier 1 ends at $10,000 but Tier 2 starts at $15,000), the sales between $10,000 and $15,000 fall outside any tier and earn no commission. Make sure your tier boundaries connect without gaps or overlaps.
