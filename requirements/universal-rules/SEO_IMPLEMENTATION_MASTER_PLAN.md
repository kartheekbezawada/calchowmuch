# SEO Master Plan With Master Pre-Approval and Automatic Wave Progression

## Summary

Create one new internal program document at `requirements/universal-rules/SEO_IMPLEMENTATION_MASTER_PLAN.md` and execute the SEO program as a sequence of **isolated repo-only waves**. The program is **master pre-approved** now, which means execution should move from wave to wave automatically without asking again, as long as the work stays inside the pre-approved scope defined below and does not violate cluster-isolation or URL-freeze rules.

Primary strategy:

- optimize **impressions first**
- improve CTR as a secondary outcome through better titles/meta/intros
- keep **all current public URLs unchanged**
- keep execution **repo-only**
- complete **checklist + release signoff at the end of every wave**
- auto-advance to the next wave once the current wave is signed off

This program does **not** include Search Console operations, Bing review, indexing submissions, or outreach/promotion. Those are out of scope by design.

## Execution Status

- `Wave 1`: Completed on `2026-03-30`
- Release evidence: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_RELEASE-20260330-SEO-WAVE1.md`
- Wave 1 routes completed:
  - `/`
  - `/calculators/`
  - `/pricing-calculators/`
  - `/salary-calculators/`
  - `/pricing-calculators/margin-calculator/`
  - `/pricing-calculators/markup-calculator/`
  - `/pricing-calculators/commission-calculator/`
  - `/salary-calculators/commission-calculator/`
  - `/time-and-date/age-calculator/`
- `Wave 3`: Completed on `2026-03-30`
- Release evidence: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_RELEASE-20260330-SEO-WAVE3.md`
- `Wave 4`: Completed on `2026-03-30`
- Release evidence: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_RELEASE-20260330-SEO-WAVE4.md`
- Wave 4 routes completed:
  - `/time-and-date/sleep-time-calculator/`
  - `/time-and-date/wake-up-time-calculator/`
  - `/time-and-date/nap-time-calculator/`
  - `/time-and-date/power-nap-calculator/`
  - `/time-and-date/energy-based-nap-selector/`
  - `/time-and-date/work-hours-calculator/`
  - `/time-and-date/overtime-hours-calculator/`
  - `/time-and-date/time-between-two-dates-calculator/`
  - `/time-and-date/days-until-a-date-calculator/`
  - `/time-and-date/countdown-timer/`
  - `/time-and-date/birthday-day-of-week/`
  - `/percentage-calculators/percent-change-calculator/`
  - `/percentage-calculators/percent-to-fraction-decimal-calculator/`
  - `/percentage-calculators/percentage-composition-calculator/`
  - `/percentage-calculators/percentage-decrease-calculator/`
  - `/percentage-calculators/percentage-difference-calculator/`
  - `/percentage-calculators/percentage-increase-calculator/`
  - `/percentage-calculators/percentage-of-a-number-calculator/`
  - `/percentage-calculators/reverse-percentage-calculator/`
  - `/percentage-calculators/percentage-finder-calculator/`
- Wave 4 implementation note:
  - `/time-and-date/` and `/percentage-calculators/` hub pages are not currently governed as active public routes in this repo, so Wave 4 remained route-level rather than hub-level.
- `Wave 2`: Completed on `2026-04-01`
- Release evidence: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_RELEASE-20260401-SEO-WAVE2.md`
- Wave 2 routes completed:
  - `/pricing-calculators/discount-calculator/`
  - `/salary-calculators/salary-calculator/`
  - `/salary-calculators/hourly-to-salary-calculator/`
  - `/salary-calculators/salary-to-hourly-calculator/`
  - `/salary-calculators/annual-to-monthly-salary-calculator/`
  - `/salary-calculators/monthly-to-annual-salary-calculator/`
  - `/salary-calculators/weekly-pay-calculator/`
  - `/salary-calculators/overtime-pay-calculator/`
  - `/salary-calculators/raise-calculator/`
  - `/salary-calculators/bonus-calculator/`
  - `/salary-calculators/inflation-adjusted-salary-calculator/`
- `Wave 5`: Completed on `2026-04-01`
- Release evidence: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_RELEASE-20260401-SEO-WAVE5.md`
- Wave 5 routes completed:
  - all governed `/math/**` public calculator routes, including `/math/trigonometry/unit-circle/`
- `Wave 6`: Completed on `2026-04-01`
- Release evidence: `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_RELEASE-20260401-SEO-WAVE6.md`
- Final program status:
  - all six SEO waves are complete
  - final consolidation gates passed for the Wave 2 and Wave 5 route families

## Master Pre-Approval and Stop Rules

This plan is the pre-approved execution envelope for all waves.

### Auto-advance rule

The implementer may move automatically from Wave 1 to Wave 2, then Wave 3, and so on, without pausing for new approval, if all of the following are true:

- the next wave is already defined in this plan
- the next wave stays within the approved route families and file families below
- no URL change is required
- no redirect is required
- no canonical identity change is required
- no shared/core/generator expansion beyond the approved surfaces below is required
- the current wave has completed checklist and signoff

### Hard stop conditions

Execution must stop only if a needed fix requires one of these:

- changing a public URL slug
- adding redirects
- changing canonical identity from one live route to another
- touching shared/core runtime files outside the approved families below
- touching route families not included in this plan
- introducing a new cluster or new route not already covered here
- changing ownership/contract files outside the approved scope
- changing generator behavior globally rather than editing route-specific metadata/template sections already approved here

## Approved Scope Contract

### Approved route families

Wave execution is pre-approved for these public route families:

- `/`
- `/calculators/`
- `/pricing-calculators/**`
- `/salary-calculators/**`
- `/finance-calculators/**`
- `/credit-card-calculators/**`
- `/car-loan-calculators/**`
- `/loan-calculators/**`
- `/time-and-date/**`
- `/percentage-calculators/**`
- `/math/**`

### Approved file families

Execution is pre-approved to edit only these file families:

- `requirements/universal-rules/SEO_IMPLEMENTATION_MASTER_PLAN.md`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_*SEO*.md`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_*<wave-id>*.md`
- `scripts/generate-mpa-pages.js`
- `public/index.html` only as generated output verification, not primary source
- `public/calculators/index.html` only as generated output verification, not primary source
- `public/pricing-calculators/index.html` only as generated output verification, not primary source
- `public/salary-calculators/index.html` only as generated output verification, not primary source
- `public/time-and-date/index.html` only as generated output verification, not primary source if generated
- `public/percentage-calculators/index.html` only as generated output verification, not primary source if generated
- `public/math/index.html` only as generated output verification, not primary source if generated
- `public/calculators/*/content.html`
- `public/calculators/*/*/index.html`
- `public/calculators/*/*/explanation.html`
- `public/calculators/*/*/module.js`
- `public/calculators/*/*/calculator.css` only when content/internal-link/section layout needs it
- `public/config/navigation.json` when internal-link ordering, hub visibility, or governed route copy needs adjustment
- generated public route HTML under `public/**/index.html` only as wave outputs after scoped regeneration

### Forbidden file families

These are forbidden unless a later scope-break decision is made:

- `public/assets/js/core/**`
- `public/assets/css/**` except route-local calculator CSS already approved above
- `clusters/**` unless a wave explicitly proves a cluster-local content file is the real source-of-truth and that path is already inside the touched route family
- `config/clusters/cluster-registry.json`
- `config/clusters/route-ownership.json`
- unrelated release docs
- unrelated calculator clusters not in the active wave
- any redirect/config/deployment file

### Approved commands

- `rg`, `sed`, `nl`, `find`, `cat`, `ls`
- scoped route generation via `node scripts/generate-mpa-pages.js --route /path/`
- scoped calc generation via `node scripts/generate-mpa-pages.js --calc-id <id>`
- `npm run lint`
- `CLUSTER=<cluster> CALC=<calc> npm run test:calc:seo`
- `CLUSTER=<cluster> CALC=<calc> npm run test:content:quality -- --scope=calc`
- route-scoped schema checks with `--scope=route --route=/path/`
- homepage and hub Playwright coverage
- `npm run test:homepage:search:contracts`
- `npm run test:cluster:contracts`
- `TARGET_ROUTE=/path/ npm run test:isolation:scope` when required

## Source-of-Truth Edit Model

The implementation must not guess where SEO data lives. Use these rules.

### Homepage and top-level hubs

For `/` and major hub pages, the primary source-of-truth is the generator/template layer and cluster/hub content sources, not the generated HTML alone.

Use this pattern:

- edit route metadata/template content in `scripts/generate-mpa-pages.js` where the homepage or generated hub shell is defined
- edit `public/calculators/<cluster>/content.html` when the cluster hub body content is sourced there
- treat generated `public/<route>/index.html` as output verification after scoped regeneration

### Calculator pages

For calculator routes, SEO-critical data usually lives in more than one place and both must be updated:

- `scripts/generate-mpa-pages.js`
  This controls generated HTML title/description/H1 and route-level output metadata for many routes.
- `public/calculators/<cluster>/<calc>/module.js`
  This controls runtime metadata, schema, breadcrumb data, and route-specific structured data.
- `public/calculators/<cluster>/<calc>/explanation.html`
  This is the main long-form SEO/helpful-content surface.
- `public/calculators/<cluster>/<calc>/index.html`
  Edit only when section order, link modules, or route-local structure must change.
- `public/<route>/index.html`
  Verify only after scoped regeneration; do not use as the primary manual edit surface when a source file exists.

This dual-update rule is mandatory for routes like:

- `/pricing-calculators/margin-calculator/`
- `/pricing-calculators/markup-calculator/`
- `/pricing-calculators/commission-calculator/`
- `/salary-calculators/commission-calculator/`
- `/time-and-date/age-calculator/`
- `/math/trigonometry/unit-circle/`

## Content and Snippet Standards

These standards are fixed across all waves.

### Titles

- lead with the primary intent keyword
- include the outcome or use case, not just the calculator name
- avoid generic brand-only endings
- keep title distinct from near-duplicate routes
- use brand only when it helps differentiation, not by default

### Meta descriptions

- state what the tool calculates
- state one practical use case or outcome
- avoid filler like “free online tool” unless it adds real snippet value
- keep descriptions distinct for overlapping routes
- fix all `DESC_TOO_SHORT` and `DESC_TOO_LONG` cases as waves reach them

### H1 and intro

- H1 must match visible intent cleanly
- first paragraph must answer what the page does
- second paragraph must explain when to use it
- intro must support impressions first, not just formula exposition

### Deep content contract for touched calculators

Every materially rewritten calculator route should include:

- answer-first intro
- short practical explanation
- one scannable use-case list
- one worked example or scenario set
- clearer formula or logic explanation
- route-specific FAQ where helpful
- related calculator links
- route-specific Important Notes where needed

### Hub-page contract

Every touched hub page should include:

- clear topic definition
- summary of what problems the category solves
- featured calculator summaries
- related calculator groupings
- stronger internal links
- enough explanatory copy to avoid acting as a thin shell

### Internal-link contract

Every touched route should gain stronger internal-link support.

For calculators:

- link to 4 to 8 genuinely related calculators or hubs
- prefer same-cluster or adjacent-intent links
- use descriptive anchor text
- avoid repetitive exact-match spam patterns

For hubs:

- link prominently to the wave’s target calculators
- include at least one contextual paragraph around key links
- use clear query-aligned anchor text

## Wave Plan

### Wave 1: Foundation, Hubs, and Highest-Leverage Commercial Pages

Routes:

- `/`
- `/calculators/`
- `/pricing-calculators/`
- `/salary-calculators/`
- `/pricing-calculators/margin-calculator/`
- `/pricing-calculators/markup-calculator/`
- `/pricing-calculators/commission-calculator/`
- `/salary-calculators/commission-calculator/`
- `/time-and-date/age-calculator/`

Goals:

- turn homepage into a stronger search landing page
- turn `/calculators/`, `/pricing-calculators/`, and `/salary-calculators/` into stronger authority hubs
- improve metadata and deep content on margin, markup, commission, and age
- separate commission intent without changing URLs

Special handling:

- `/pricing-calculators/commission-calculator/` must target pricing/sales commission intent
- `/salary-calculators/commission-calculator/` must target compensation/earnings intent
- no merge, redirect, or canonical consolidation is allowed

### Wave 2: Complete Pricing and Salary Route Families

Routes:

- all remaining `/pricing-calculators/**`
- all remaining `/salary-calculators/**`

Goals:

- remove thin or generic cluster coverage around pricing and salary topics
- standardize metadata quality across both clusters
- improve internal-link loops among margin, markup, discount, commission, raise, bonus, overtime, and pay-conversion pages
- raise topical authority around pricing math and earnings/pay intent

### Wave 3: Finance, Credit Cards, Car Loans, and Home Loans

Routes:

- `/finance-calculators/**`
- `/credit-card-calculators/**`
- `/car-loan-calculators/**`
- `/loan-calculators/**`

Goals:

- build authority in high-value financial/commercial topics
- improve comparison-intent and planning-intent copy
- expand internal links between mortgage, remortgage, LTV, affordability, personal loan, car loan, credit card payoff, balance transfer, and finance growth tools
- prioritize pages currently flagged for thin content or weak snippets

### Wave 4: Time and Date Completion Plus Percentage Cluster

Routes:

- all remaining `/time-and-date/**` after age
- `/percentage-calculators/**`

Goals:

- strengthen high-utility evergreen routes
- clean up short descriptions and weak explanatory copy
- tighten internal links between age, date, countdown, work-hours, and percentage calculators
- finish the percentage cluster with clear intent separation across percentage increase, decrease, difference, reverse, finder, and composition pages

### Wave 5: Math Cluster, Including Unit Circle

Routes:

- `/math/**`, including `/math/trigonometry/unit-circle/`

Goals:

- improve educational intent pages that require deeper explanation
- add richer examples, formula context, and related-path links
- strengthen math hub discoverability and route grouping
- make unit-circle, trig, algebra, and statistics pages less isolated from one another

### Wave 6: Final Consolidation Pass

Routes:

- only pages already touched in prior waves

Goals:

- close residual snippet issues
- normalize internal-link quality
- fix remaining `LOW_WORD_COUNT`, `DESC_TOO_SHORT`, `DESC_TOO_LONG`, and `TITLE_H1_MISMATCH` items still present after earlier waves
- complete final program signoff summary after all wave signoffs already exist

## Route-Specific Intent Rules for Key Pages

These are fixed and should not be re-decided during execution.

### Homepage `/`

- broader calculator intent
- category-discovery intent
- practical planning/use-case framing
- no generic “quick calculations” positioning as the main message

### `/calculators/`

- master collection intent
- category and direct-tool discovery
- cleaner hierarchy and stronger topic summaries

### `/pricing-calculators/`

- pricing, markup, margin, discount, commission cluster authority
- stronger “business pricing decisions” positioning

### `/salary-calculators/`

- pay conversion, raises, bonuses, overtime, and earnings cluster authority
- stronger “salary and earnings planning” positioning

### Margin calculator

Target queries include:

- gross margin calculator
- profit margin calculator
- margin percentage calculator

### Markup calculator

Target queries include:

- markup calculator
- cost to selling price
- markup percentage calculator

### Pricing commission calculator

Target queries include:

- sales commission calculator
- commission on sales
- tiered commission calculator for pricing/sales use

### Salary commission calculator

Target queries include:

- commission earnings calculator
- salary plus commission calculator
- commission pay calculator

### Age calculator

Target queries include:

- exact age calculator
- age in years months and days
- next birthday calculator

### Unit circle

Target queries include:

- unit circle calculator
- trig values on unit circle
- reference angle and quadrant help

## Verification and Checklist by Wave

Every wave must complete all applicable checks before auto-advancing.

### Homepage and hub routes

Use the smallest route-appropriate set, including where applicable:

- `npm run lint`
- homepage/hub Playwright coverage
- `npm run test:homepage:search:contracts`
- `npm run test:cluster:contracts` when governed discoverability/navigation is touched
- `TARGET_ROUTE=/path/ npm run test:isolation:scope` when isolation-sensitive surfaces are touched

### Calculator routes

For each touched calculator route:

- scoped regeneration with `node scripts/generate-mpa-pages.js --route /path/` or `--calc-id <id>`
- `CLUSTER=<cluster> CALC=<calc> npm run test:calc:seo`
- `CLUSTER=<cluster> CALC=<calc> npm run test:content:quality -- --scope=calc` when the explanation content is materially rewritten

### Signoff

At the end of every wave:

- create a release signoff file under `requirements/universal-rules/release-signoffs/`
- record exact routes touched
- record exact file families touched
- record commands executed and results
- record skips explicitly with a reason
- confirm “Ready to merge” for that wave only after signoff is complete

Auto-advance to the next wave only after that signoff exists.

## Risks and Defaults

- both commission URLs are live and must remain live
- no URL consolidation is allowed in this program
- generator metadata and module metadata must stay aligned for touched calculators
- generated HTML is an output artifact, not the first-choice edit surface when a source file exists
- if a later wave proves a route needs shared-core changes, execution must stop because that breaks master pre-approval
- unit circle is deferred to the math wave unless a future scope-breaking reprioritization is explicitly made outside this plan

## Assumptions

- this plan is the final master pre-approved execution envelope
- route progression is automatic between waves
- execution is repo-only
- impressions are the primary KPI
- full on-page improvements are allowed within the same URLs
- shared/core/generator behavior rewrites outside the approved surfaces are not allowed
- no additional human approval is needed between waves unless a stop condition is hit
