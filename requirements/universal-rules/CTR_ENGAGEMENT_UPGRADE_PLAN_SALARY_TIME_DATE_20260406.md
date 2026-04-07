# CTR + Engagement Upgrade Plan — Salary + Time & Date (CalcHowMuch)

Created: 2026-04-06 (Europe/London)  
Owner: HUMAN  
Status: Draft (target implementation: 2026-04-07)

## Objective
Increase:
- SERP CTR (more clicks from Google results)
- Post-click engagement (less bounce/pogo-sticking)
- Trust + perceived usefulness within first 5 seconds

Constraints:
- No backlinks / off-page strategies
- No “content expansion for word count”
- No generic “write better content”
- Only internal improvements that directly increase CTR + engagement
- Every recommendation must be specific + implementable + measurable

Audit scope (clusters):
- Salary Calculators cluster (`/salary-calculators/**`)
- Time & Date cluster (`/time-and-date/**`)

Coverage depth: Hybrid
- Full cluster-level diagnosis + action plan
- Detailed above-the-fold rewrites/specs for 8 routes:
  - Salary: `/salary-calculators/salary-calculator/`, `/salary-calculators/hourly-to-salary-calculator/`, `/salary-calculators/salary-to-hourly-calculator/`, `/salary-calculators/weekly-pay-calculator/`
  - Time & Date: `/time-and-date/sleep-time-calculator/`, `/time-and-date/countdown-timer/`, `/time-and-date/time-between-two-dates-calculator/`, `/time-and-date/age-calculator/`
- Take-home/after-tax route: explicitly **not** in this wave (prevent mismatch by clarifying “gross pay / before tax”).

## Repo Observations (baseline)
- Salary calculators currently load with result placeholders (`—`) and require **Calculate** before any meaningful output (weak first-impression continuity vs snippet promise).
- Time & Date: several key routes already render meaningful default outputs on load (Age, Time Between Dates, Countdown); Sleep is designed to calculate on load but still shows a “select a time” placeholder message in the markup.
- Internal link audit snapshot (generated 2026-04-04): Salary same-cluster coverage avg ~40% (weak), Time & Date ~100% (strong).

---

# SECTION 1 — CTR PROBLEM DIAGNOSIS

## Salary Calculators cluster — Top 5 reasons users don’t click
| Reason users don’t click | Snippet weakness | Perceived value gap | Intent mismatch |
|---|---|---|---|
| 1) “Salary calculator” is commonly interpreted as take-home / after-tax | Title + description don’t make “gross/before tax” unavoidable | Fear: “I’ll still need another tool” | High |
| 2) Titles read like a feature list (hourly/daily/weekly/…) | Truncation hides the benefit/outcome | Doesn’t promise a decision (“offer compare”, “budget”) | Medium |
| 3) No differentiator vs big incumbents | Snippet doesn’t signal “answer-first”, “assumptions visible”, “copy-ready” | “Why click this result?” | Medium |
| 4) Trust/accuracy concerns (hidden assumptions) | Assumptions not snippet-forward | “I don’t trust payroll math I can’t see” | Medium |
| 5) Pogo-stick fear (form friction + empty initial state) | Snippet doesn’t imply instant usefulness | “This will be slow / cluttered” | Medium |

## Time & Date cluster — Top 5 reasons users don’t click
| Reason users don’t click | Snippet weakness | Perceived value gap | Intent mismatch |
|---|---|---|---|
| 1) SERP crowding (many “calculator” brands) | Titles look generic | “Nothing special here” | Medium |
| 2) Sleep intent is usually “best bedtime / wake-up times” | “Sleep Time” can be less explicit | Unclear promise (bedtime vs wake time) | Medium |
| 3) Countdown users want a live ticking timer | “Live” must be front-loaded | “Will it actually update?” | Low–Medium |
| 4) Time-between-dates users often want business days first | Business days can get buried | “Does it do business days + copy summary?” | Low |
| 5) Age intent is “exact age + next birthday” | Must be obvious in snippet + fold | “Does it answer my immediate question?” | Low |

---

# SECTION 2 — ABOVE-THE-FOLD FIXES (HIGHEST IMPACT)

Implementation mapping (repo):
- **H1 / title / description / canonical:** `scripts/generate-mpa-pages.js` overrides (by calc id)
- **Subtitle:** prominent calculator fragment headline in `public/calculators/<cluster>/<calc>/index.html`
- **First 40–50 word intro (featured snippet optimized):** first short-answer paragraph under the page’s primary H2 in `public/calculators/<cluster>/<calc>/explanation.html`

## Salary — Salary Calculator (`/salary-calculators/salary-calculator/`)
- H1: `Salary Calculator (Gross Pay)`
- Subtitle: `Convert one pay amount into hourly, weekly, monthly, and annual pay`
- 40–50 word intro:
  `This gross salary calculator converts one pay amount into annual, monthly, biweekly, weekly, daily, and hourly views. Choose the pay period you know, confirm your schedule when needed, then calculate to get a clean side‑by‑side comparison for budgeting and offer decisions.`
- Must be visible without scrolling (mobile):
  - Pay amount (pre-filled) + pay frequency control
  - Primary result + at least 3 supporting outputs
  - “Gross (before tax)” is visible near the result interpretation
  - Assumptions summary line (compact)
- Must be removed/hidden:
  - Placeholder dashes (`—`) on load
  - Any lead copy that pushes the first input below the fold

Defaults:
- Frequency: annual
- Amount: 60000
- Assumptions: 40 hrs/week, 52 weeks/year, 5 days/week

## Salary — Hourly to Salary (`/salary-calculators/hourly-to-salary-calculator/`)
- H1: `Hourly to Salary Calculator (Gross Pay)`
- Subtitle: `Turn an hourly rate into annual, monthly, biweekly, and weekly pay`
- 40–50 word intro:
  `Use this gross hourly‑to‑salary calculator to estimate annual salary from an hourly rate. Enter your hourly pay, hours per week, and paid weeks per year, then calculate to see annual, monthly, biweekly, and weekly totals side by side for fast offer comparisons.`
- Must be visible without scrolling:
  - Hourly rate + hours/week + weeks/year (pre-filled)
  - Annual result (no placeholder) + monthly + weekly
  - “Gross (before tax)” visible in the results interpretation
- Must be removed/hidden:
  - Any “Calculate to see…” placeholder messaging (replace with real default output)

Defaults:
- $25/hr, 40 hrs/week, 52 weeks/year

## Salary — Salary to Hourly (`/salary-calculators/salary-to-hourly-calculator/`)
- H1: `Salary to Hourly Calculator (Gross Pay)`
- Subtitle: `See what a salary pays per hour based on your schedule`
- 40–50 word intro:
  `This gross salary‑to‑hourly calculator converts an annual salary into hourly, weekly, biweekly, and monthly pay using your hours per week and weeks per year. Use it to compare offers with different schedules and to verify whether a higher salary actually means higher hourly pay.`
- Must be visible without scrolling:
  - Annual salary + hours/week + weeks/year (pre-filled)
  - Hourly result + weekly + monthly
  - Assumptions line visible
- Must be removed/hidden:
  - Placeholder values on load

Defaults:
- $60000/yr, 40 hrs/week, 52 weeks/year

## Salary — Weekly Pay (`/salary-calculators/weekly-pay-calculator/`)
- H1: `Weekly Pay Calculator (Gross Pay)`
- Subtitle: `Estimate weekly earnings from hours, rate, and overtime—then annualize it`
- 40–50 word intro:
  `Use this gross weekly pay calculator to estimate what you’ll earn in a typical week. Enter hourly rate and hours (or split regular and overtime hours), then calculate to see weekly pay first and the annualized equivalent second—useful for shift work, freelancing, and overtime planning.`
- Must be visible without scrolling:
  - Hourly rate + total weekly hours (pre-filled)
  - Weekly result + annualized projection (no placeholder)
  - Overtime split remains optional by user action
- Must be removed/hidden:
  - Split-mode fields unless split is selected
  - Placeholder outputs on load

Defaults:
- Standard mode, $25/hr, 40 hours, 52 weeks/year

---

## Time & Date — Sleep Time (`/time-and-date/sleep-time-calculator/`)
- H1: `Sleep Time Calculator (90‑Minute Cycles)`
- Subtitle: `Best bedtimes or wake‑up times in 4, 5, or 6 sleep cycles`
- 40–50 word intro:
  `This sleep time calculator suggests bedtimes or wake‑up times that align with 90‑minute sleep cycles plus a short fall‑asleep buffer. Choose whether you’re planning bedtime or wake time, set the target, then calculate to get 4‑, 5‑, and 6‑cycle options with a balanced recommendation.`
- Must be visible without scrolling:
  - Mode toggle + time input + calculate button
  - Results visible immediately (no “select a time” dead-end feel)
  - Recommended option clearly labeled
- Must be removed/hidden:
  - Advanced controls unless “Advanced” is opened

## Time & Date — Countdown Timer (`/time-and-date/countdown-timer/`)
- H1: `Countdown Timer (Live)`
- Subtitle: `Live countdown to any date—copy a summary or add to calendar`
- 40–50 word intro:
  `Create a live countdown timer for any event—birthdays, launches, holidays, trips, or deadlines. Set the date and time, start the timer, and the page updates every second with days, hours, minutes, and seconds remaining. After starting, copy a clean summary or export the event to your calendar.`
- Must be visible without scrolling:
  - Event name + target date/time + Start
  - Live countdown tiles visible and updating
  - Copy summary + 1 calendar action visible
- Must be removed/hidden:
  - Share-card / PNG tools until after Start, behind “Advanced sharing”

## Time & Date — Time Between Dates (`/time-and-date/time-between-two-dates-calculator/`)
- H1: `Time Between Two Dates Calculator`
- Subtitle: `Days + business days first, then weeks, months, and hours`
- 40–50 word intro:
  `Use this time between dates calculator to find the exact duration between two dates in total days, business days, weeks, months, and hours. Pick a preset or enter dates, choose date‑only or date‑time mode, then calculate to get a copy‑ready summary plus a detailed breakdown.`
- Must be visible without scrolling:
  - Presets + date inputs + Calculate
  - Headline duration + business days + Copy summary
- Must be removed/hidden:
  - Low-priority breakdown blocks that push the headline answer down

## Time & Date — Age Calculator (`/time-and-date/age-calculator/`)
- H1: `Age Calculator (Exact)`
- Subtitle: `Exact age + totals + next birthday countdown`
- 40–50 word intro:
  `This age calculator shows your exact age from a date of birth and an as‑of date. Enter both dates (or use today), then calculate to see years/months/days, total weeks and days, the weekday you were born, and a next‑birthday countdown you can copy or share.`
- Must be visible without scrolling:
  - DOB + as-of + Calculate (prefilled example)
  - Exact age headline + next birthday countdown
  - Copy summary action
- Must be removed/hidden:
  - Secondary “totals/events” scaffolding above the headline answer on mobile

---

# SECTION 3 — UI / UX CTR IMPROVEMENTS (specific, implementable)

## Salary (apply to 4 routes)
- Prefill defaults + render meaningful default outputs on load (then keep button-triggered recalculation after edits).
- Add a compact dirty-state chip near results: `Inputs changed — click Calculate to update`.
- Make “Gross (before tax)” unavoidable in the result interpretation (reduces take-home mismatch bounces).
- Add `Copy summary` in the results card (copy-ready offer/budget share output).
- Keep assumptions collapsed but always show an assumptions summary line in results.

## Time & Date (targeted)
- Sleep: make result time formatting locale-friendly (US users shouldn’t be forced into 24h parsing); show cycle count clearly.
- Countdown: reduce above-the-fold cognitive load; push advanced share tools behind disclosure.
- Age: keep “exact age + next birthday” dominant; push non-core blocks lower on mobile.

---

# SECTION 4 — DIFFERENTIATION STRATEGY

## Salary
Competitors (generic):
- Overstuffed forms, hidden assumptions, “take-home” positioning, cluttered results.
Do differently:
- Gross clarity up front + schedule-visible math
- Copy-ready outputs for offer comparison
- One-click scenario nudges (e.g., 37.5h/week, 48 weeks/year) rather than more inputs

## Time & Date
Competitors (generic):
- Give a number; weak “planning workflow”; weak sharing.
Do differently:
- Always “one clean answer first”
- Copy summary + calendar export as first-class outcomes

---

# SECTION 5 — TRUST & CREDIBILITY LAYER
- Salary: show assumptions used + formula line + “gross before tax” in the interpretation zone.
- Countdown: “uses your local time zone / device clock”.
- Time-between-dates (datetime mode): DST note (already supported conceptually; keep it visible where needed).
- Sleep: short “not medical advice” microcopy.
- Add a consistent micro-proof: `Calculated locally in your browser · no data stored`.

---

# SECTION 6 — ENGAGEMENT LOOP (POST-CLICK)
After first calculation, show a compact “Next best step” card (max 3 links, context-based):
- Salary calculator → Raise, Overtime pay, Inflation-adjusted salary
- Hourly→Salary → Salary→Hourly, Weekly pay, Salary calculator
- Weekly pay → Overtime pay, Salary calculator, Raise
- Sleep → Wake-up time, Power nap, Nap time
- Countdown → Days until a date, Time between dates, Copy/share
- Age → Birthday day-of-week, Countdown, Time between dates

---

# SECTION 7 — PRIORITIZED ACTION PLAN

| Priority | Change | Impact | Effort | Why |
|---|---|---:|---:|---|
| P0 | Salary: prefill + compute once on load (no placeholders) | High | Low | Fixes “dead page” feeling; fulfills snippet promise immediately |
| P0 | Salary: “Gross (before tax)” clarity in interpretation zone | High | Low | Prevents take-home intent pogo-sticks |
| P0 | Salary: dirty-state chip (“click Calculate to update”) | High | Low | Prevents confusion when results don’t auto-update |
| P1 | Salary: `Copy summary` in results card | Med–High | Low–Med | Makes tool shareable + decision-ready |
| P1 | Countdown: hide advanced share tools until after Start | Medium | Low | Reduces cognitive load |
| P1 | Sleep: locale-friendly time formatting + explicit cycle labeling | Medium | Low | Removes comprehension friction |
| P2 | Add “Next best step” card (3 links) | Medium | Medium | Increases pages/session without spammy UX |

---

## Scope Contract Draft (for approval before edits)
Routes (in-scope):
- `/salary-calculators/salary-calculator/`
- `/salary-calculators/hourly-to-salary-calculator/`
- `/salary-calculators/salary-to-hourly-calculator/`
- `/salary-calculators/weekly-pay-calculator/`
- `/time-and-date/sleep-time-calculator/`
- `/time-and-date/countdown-timer/`
- `/time-and-date/time-between-two-dates-calculator/`
- `/time-and-date/age-calculator/`

Allowed source-of-truth files (explicit):
- `scripts/generate-mpa-pages.js`
- `public/calculators/salary-calculators/salary-calculator/index.html`
- `public/calculators/salary-calculators/salary-calculator/explanation.html`
- `public/calculators/salary-calculators/salary-calculator/module.js`
- `public/calculators/salary-calculators/hourly-to-salary-calculator/index.html`
- `public/calculators/salary-calculators/hourly-to-salary-calculator/explanation.html`
- `public/calculators/salary-calculators/hourly-to-salary-calculator/module.js`
- `public/calculators/salary-calculators/salary-to-hourly-calculator/index.html`
- `public/calculators/salary-calculators/salary-to-hourly-calculator/explanation.html`
- `public/calculators/salary-calculators/salary-to-hourly-calculator/module.js`
- `public/calculators/salary-calculators/weekly-pay-calculator/index.html`
- `public/calculators/salary-calculators/weekly-pay-calculator/explanation.html`
- `public/calculators/salary-calculators/weekly-pay-calculator/module.js`
- `public/calculators/time-and-date/sleep-time-calculator/index.html`
- `public/calculators/time-and-date/sleep-time-calculator/explanation.html`
- `public/calculators/time-and-date/sleep-time-calculator/module.js`
- `public/calculators/time-and-date/countdown-timer/index.html`
- `public/calculators/time-and-date/countdown-timer/explanation.html`
- `public/calculators/time-and-date/countdown-timer/module.js`
- `public/calculators/time-and-date/time-between-two-dates-calculator/index.html`
- `public/calculators/time-and-date/time-between-two-dates-calculator/explanation.html`
- `public/calculators/time-and-date/time-between-two-dates-calculator/module.js`
- `public/calculators/time-and-date/age-calculator/index.html`
- `public/calculators/time-and-date/age-calculator/explanation.html`
- `public/calculators/time-and-date/age-calculator/module.js`

Allowed generated outputs (explicit, regenerated for the 8 routes only):
- `public/salary-calculators/salary-calculator/index.html`
- `public/salary-calculators/hourly-to-salary-calculator/index.html`
- `public/salary-calculators/salary-to-hourly-calculator/index.html`
- `public/salary-calculators/weekly-pay-calculator/index.html`
- `public/time-and-date/sleep-time-calculator/index.html`
- `public/time-and-date/countdown-timer/index.html`
- `public/time-and-date/time-between-two-dates-calculator/index.html`
- `public/time-and-date/age-calculator/index.html`

Forbidden files (unless explicitly re-scoped):
- `public/assets/js/core/**`
- `config/clusters/**`
- `clusters/**`
- Any other calculator routes outside the 8 listed

Allowed commands (tomorrow):
- Search/inspect: `rg`, `sed`, `nl`, `cat`, `find`, `ls`
- Regenerate per calc id (repeat for the 8 calc ids): `TARGET_CALC_ID=<id> node scripts/generate-mpa-pages.js --calc-id <id>`
- Lint: `npm run lint`
- Scoped calc tests: `CLUSTER=<cluster> CALC=<calc> npm run test:calc:unit|e2e|cwv|seo`

Stop rule:
- If any fix requires touching forbidden files or routes, stop and request explicit scope expansion.
