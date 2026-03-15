# Sample Size Calculator

## 1. Purpose
Rebuild `/math/sample-size/` as a research-first sample-size planning tool for students, survey designers, UX researchers, product managers, and academic investigators. The page must educate as well as compute — every result must come with a plain-English interpretation, a step-by-step derivation, documented assumptions, and actionable guidance so the user can defend the number in a proposal, protocol, or stakeholder meeting.

This is not a toy calculator. It must be the single page a user bookmarks when they need to justify "how many responses do I actually need?"

## 2. Locked Product Identity
- Calculator ID: `sample-size`
- Public route: `/math/sample-size/`
- Route archetype: `calc_exp`
- Design family: `neutral`
- Pane layout: `single`
- Audience: university students, survey designers, UX researchers, product managers, academic investigators
- v1 scope: proportion sample size, mean sample size, finite-population correction, sensitivity table, preset scenarios

## 3. Product Goals
1. Show a meaningful solved example on first load so the page never feels empty or broken.
2. Explain every formula in plain English — not just the answer, but *why* the answer is that number.
3. Surface a sensitivity table so users can see how the sample size changes as they tighten or loosen one parameter.
4. Provide realistic preset scenarios (general survey, prevalence study, campus survey with finite N, lab mean study) that let new users learn by tuning a real starting point.
5. Give the user a research-ready interpretation paragraph they can copy into a proposal or protocol document.
6. Ship with strong SERP coverage: title, meta description, canonical, breadcrumb schema, SoftwareApplication schema, and FAQ schema.

## 4. Core UX Contract

### 4.1 General page behaviour
- The page must render as a single-pane `calc_exp` route.
- No split-pane legacy layout is allowed.
- No empty-state graph, table, or blank answer panel is allowed.
- **No ads pane.** The right-side `ads-column` section must be completely removed from the generated HTML. The calculator and explanation content must occupy the full available width of `layout-main` — no ad sidebar, no ad placeholder, no AdSense `<ins>` tags anywhere on this route. The page earns trust through quality, not ad revenue.
- On first load the calculator must show:
  - prefilled example inputs (General Survey preset: 95 % confidence, 5 % margin, p = 50 %)
  - a visible computed result (n = 385)
  - a visible step-by-step derivation
  - a visible interpretation paragraph
  - a visible assumption list
  - a visible sensitivity table
- The interface must feel premium, calm, and research-oriented — like a product from a world-class design studio, not a cluttered ad-supported utility.

### 4.2 Mode system
The calculator must provide two study-planning modes:

| # | Mode | Purpose |
|---|------|---------|
| 1 | **Proportion study** | Plan sample size when the outcome is a percentage, prevalence, response rate, or binary share. |
| 2 | **Mean study** | Plan sample size when the outcome is a continuous measurement and the population standard deviation (σ) is known or defensible. |

Mode switching requirements:
- Use a clear, labelled toggle or tab-set (e.g. "Proportion study" / "Mean study").
- Active mode must be visually obvious (filled highlight, not just underline).
- Switching modes must update:
  - visible input fields (proportion → estimated proportion %; mean → population σ)
  - margin-of-error label and hint text
  - preset cards (only show presets relevant to the active mode, or grey out mismatched ones)
  - result values, interpretation, assumptions, and steps
  - sensitivity table column headers
- Default mode on page load: **Proportion study**.

### 4.3 Preset system
Provide at least four clickable preset scenarios:

| Preset | Mode | Confidence | Margin | p / σ | Population | Expected n |
|--------|------|------------|--------|-------|------------|-----------|
| General survey baseline | Proportion | 95 % | 5 % | 50 % | ∞ | 385 |
| Prevalence planning | Proportion | 95 % | 3 % | 20 % | ∞ | 683 |
| Campus population survey | Proportion | 95 % | 5 % | 50 % | 1 200 | 292 |
| Laboratory mean estimate | Mean | 95 % | 2 | 8 | ∞ | 62 |

Preset behaviour:
- Clicking a preset must populate all input fields, select the matching mode, and trigger the calculation immediately so the result is visible without a second click.
- The active preset must be visually highlighted.
- User edits after a preset load must clear the active-preset highlight (mark "customised").

### 4.4 Input design

#### 4.4.1 Shared inputs (both modes)
| Input | Type | Default | Min | Step | Label | Hint |
|-------|------|---------|-----|------|-------|------|
| Confidence level | Button group | 95 % (z = 1.96) | — | — | Confidence level | Buttons for 90 %, 95 %, 99 % |
| Margin of error | Number | 5 | 0.01 | 0.1 | Margin of error (%) *or* Margin of error (units) depending on mode | Proportion mode: "Percent precision around the estimated proportion." Mean mode: "Precision in the same units as the standard deviation." |
| Population size | Number | (blank) | 1 | 1 | Population size (optional) | "Add this only when the full study population is small enough to matter. Leave blank for infinite population." |

#### 4.4.2 Proportion-mode input
| Input | Type | Default | Min | Max | Step | Label | Hint |
|-------|------|---------|-----|-----|------|-------|------|
| Estimated proportion | Number | 50 | 0 | 100 | 0.1 | Estimated proportion (%) | "Use 50 % when prior evidence is limited — it gives the most conservative (largest) sample." |

#### 4.4.3 Mean-mode input
| Input | Type | Default | Min | Step | Label | Hint |
|-------|------|---------|-----|------|-------|------|
| Population σ | Number | 8 | 0.0001 | 0.1 | Population standard deviation | "Use a known or defensible sigma for the study outcome. If unknown, run a pilot first." |

#### 4.4.4 Input constraints
- Maximum input length: `data-maxlength="12"`.
- Denominator / division-by-zero conditions: margin of error ≤ 0 must be blocked with a plain-English error message.
- Population size ≤ 0 (when filled) must be blocked.
- Proportion outside 0–100 must be blocked.
- σ ≤ 0 must be blocked.
- All error messages must be user-friendly, plain English, and appear inline near the invalid field.

### 4.5 Calculation trigger
- **Button-triggered only** — "Calculate Sample Size" button.
- No auto-recompute on input change.
- The button must be prominent, full-width within the input card, and accessible (proper `type="button"`, focus ring, descriptive label).

### 4.6 Result design
The result area must contain **all** of the following, visible immediately after calculation (no click-to-expand, no hidden tab):

#### 4.6.1 Primary answer
- Large, prominent display of the final sample size (integer, rounded up).
- Label: "Required sample" or "You need n responses" depending on mode context.

#### 4.6.2 Metric summary grid
A compact grid of key planning metrics:
- Method (Proportion / Mean)
- Confidence level (e.g. 95 %)
- Margin of error (e.g. ±5 %)
- Study-specific variable (Estimated proportion: 50 % *or* Population σ: 8)
- Population (e.g. 1 200 or "Infinite")
- Base n₀ (uncorrected)
- Corrected n (after finite-population correction, or same as n₀ if no population entered)

#### 4.6.3 Interpretation paragraph
A single, clear, copy-paste-ready paragraph that reads like it belongs in a protocol document. Example:

> "With 95 % confidence and a ±5 % margin of error, assuming a conservative 50 % proportion and an infinite population, you need at least **385** responses. The base formula produces n₀ = 384.16, which is rounded up to the next whole number."

When finite-population correction applies:

> "With finite-population correction applied to a population of 1 200, the required sample drops from the uncorrected 385 to **292** responses."

#### 4.6.4 Assumption list
- Bullet list of the assumptions behind the result (simple random sampling, independence, known σ for mean mode, justified p for proportion mode, etc.).
- Assumptions must be mode-specific — do not show σ assumptions for proportion mode and vice-versa.

#### 4.6.5 Step-by-step derivation
A numbered, formula-level walkthrough of the calculation:

**Proportion mode example:**
1. Identify z-score for 95 % confidence: z = 1.96
2. Compute variance term: p × (1 − p) = 0.50 × 0.50 = 0.25
3. Apply formula: n₀ = z² × p(1 − p) / E² = (1.96)² × 0.25 / (0.05)² = 384.16
4. Round up: n₀ → 385
5. (If population known) Apply finite-population correction: n = n₀ / (1 + (n₀ − 1) / N)

**Mean mode example:**
1. Identify z-score for 95 % confidence: z = 1.96
2. Apply formula: n₀ = (z × σ / E)² = (1.96 × 8 / 2)² = 61.47
3. Round up: n₀ → 62
4. (If population known) Apply finite-population correction.

Steps must use real numbers from the user's inputs — not abstract symbols.

#### 4.6.6 Sensitivity table
A table that shows how the required sample size changes when **one parameter varies** while the others stay fixed.

- Default sensitivity axis: **margin of error** varying in useful steps (e.g. 1 %, 2 %, 3 %, 4 %, 5 %, 7 %, 10 %).
- Table columns: Margin of error | Base n₀ | Final n (with FPC if applicable).
- Highlight the row matching the user's current margin setting.
- The table must update on every new calculation.
- Keep the table compact, scrollable if > 7 rows, and readable on mobile.

### 4.7 Error handling
- Show error messages inline adjacent to the invalid field.
- Error text must be plain English (e.g. "Margin of error must be greater than zero." not "Invalid input").
- Disable or grey-out the result area (do not blank it) while an error is active, so the user can still see their last valid result.

## 5. Calculation Logic Contract

### 5.1 Proportion sample size (infinite population)
$$n_0 = \frac{z^2 \cdot p \cdot (1 - p)}{E^2}$$
- z = z-score for chosen confidence level
- p = estimated proportion (as decimal, e.g. 0.50)
- E = margin of error (as decimal, e.g. 0.05)

### 5.2 Mean sample size (infinite population)
$$n_0 = \left(\frac{z \cdot \sigma}{E}\right)^2$$
- σ = population standard deviation
- E = margin of error (in same units as σ)

### 5.3 Finite-population correction
$$n = \frac{n_0}{1 + \frac{n_0 - 1}{N}}$$
- N = known population size
- Applied only when population size is entered and N > 0.

### 5.4 Rounding
- Always round **up** (ceiling) to the next whole number — never round down.

### 5.5 Z-score mapping
| Confidence | z |
|------------|---|
| 90 % | 1.645 |
| 95 % | 1.960 |
| 99 % | 2.576 |

## 6. Content Contract

### 6.1 Explanation structure (UR-EXP compliance)
The explanation block must follow this exact order:

1. **H2**: `Sample Size Calculator Complete Practical Guide`
2. **H3**: `How to Guide` — scannable numbered steps for using the calculator
3. **H3**: `All Formulas Used on This Page` — complete formula reference with variable definitions
4. **H3**: `What Does the Sample Size Calculator Tell Me?` — deep conceptual explanation
5. **H3**: `Worked Examples` — minimum 6 worked examples with narrative context
6. **H3**: `Scenario Analysis` — side-by-side comparison tables and "what-if" scenarios
7. **H3**: `Visual Reference` — decision flowchart, parameter-impact diagram, and summary tables
8. **H3**: `FAQ` — minimum 10 visible FAQ cards
9. **H3**: `Important Notes` — final section (mandatory fields per UR-EXP)

Rules:
- Sections must appear in exactly this order.
- Tone must be clear, research-oriented, and suitable for students and practitioners — not generic SEO filler.
- Content must be output-aware (refer to actual calculator fields and modes).
- Every section must add unique value — no repetition of the same paragraph across sections.

---

### 6.2 How to Guide
A scannable numbered list (5–7 steps) that walks the user from landing on the page to interpreting the result:

1. Choose a study mode (Proportion or Mean).
2. Select a confidence level (90 %, 95 %, 99 %) or load a preset scenario.
3. Enter the margin of error and the mode-specific parameter (p or σ).
4. Optionally enter a known population size for finite-population correction.
5. Click **Calculate Sample Size**.
6. Read the required sample, interpretation paragraph, and step-by-step derivation.
7. Check the sensitivity table to see how the sample changes if you tighten or loosen the margin.

Include a **small quick-reference comparison table** inside this section:

| Decision | Choose | Why |
|----------|--------|-----|
| Outcome is a % / rate / share | Proportion mode | Formula uses p(1 − p) variance |
| Outcome is a continuous measurement | Mean mode | Formula uses σ² |
| Population is small and known | Enter population size | FPC reduces required n |
| No prior estimate of p | Use p = 50 % | Gives the most conservative (largest) sample |

---

### 6.3 All Formulas Used on This Page
A dedicated reference block that collects **every formula** the calculator uses so a reader can verify or cite them. Each formula must include:
- the symbolic equation
- a plain-English description of every variable
- the conditions under which it applies

#### 6.3.1 Proportion sample size (infinite population)
$$n_0 = \frac{z^2 \cdot p \cdot (1 - p)}{E^2}$$

| Variable | Meaning |
|----------|---------|
| z | Z-score for the chosen confidence level (1.645, 1.960, or 2.576) |
| p | Estimated proportion as a decimal (e.g. 0.50 = 50 %) |
| E | Margin of error as a decimal (e.g. 0.05 = 5 %) |
| n₀ | Required sample size before any finite-population correction |

#### 6.3.2 Mean sample size (infinite population)
$$n_0 = \left(\frac{z \cdot \sigma}{E}\right)^2$$

| Variable | Meaning |
|----------|---------|
| σ | Population standard deviation (known or justified) |
| E | Margin of error in the same measurement units as σ |

#### 6.3.3 Finite-population correction (both modes)
$$n = \frac{n_0}{1 + \frac{n_0 - 1}{N}}$$

| Variable | Meaning |
|----------|---------|
| N | Total known population size |
| n₀ | Uncorrected sample size from 6.3.1 or 6.3.2 |
| n | Corrected (reduced) sample size — the final answer |

#### 6.3.4 Z-score lookup table

| Confidence level | Z-score | Meaning |
|-----------------|---------|---------|
| 90 % | 1.645 | 10 % chance the true value falls outside the interval |
| 95 % | 1.960 | 5 % chance — the most common research standard |
| 99 % | 2.576 | 1 % chance — used for high-stakes medical or regulatory work |

#### 6.3.5 Rounding rule
The final n is always rounded **up** (ceiling function): $n = \lceil n_{\text{raw}} \rceil$. Rounding down would yield a sample smaller than the statistical requirement.

---

### 6.4 What Does the Sample Size Calculator Tell Me?
A deep, intent-led conceptual explanation. This section must answer the core user question: *"I got a number — what does it actually mean for my project?"*

Must cover **all** of the following sub-topics with clear, jargon-free prose:

#### 6.4.1 The core idea
- Sample size is the minimum number of observations you need so that the result of your study is statistically reliable at the precision and confidence you chose.
- It is a **planning tool**, not a proof. The number assumes your sampling method is sound and your assumptions hold.

#### 6.4.2 Confidence level explained
- Confidence level is not the probability that the true value is in your interval — it is the long-run proportion of intervals that would contain the true value if you repeated the study many times.
- Higher confidence → wider interval → more observations needed.
- Include a plain-English analogy: "95 % confidence means if you repeated this survey 100 times, about 95 of those intervals would contain the true answer."

#### 6.4.3 Margin of error explained
- The margin of error is the plus-or-minus range around your estimate.
- Tighter margin → more precision → much larger sample (quadratic relationship: halving the margin roughly quadruples the sample).
- Include a concrete example: "If your survey finds 60 % approval with a ±5 % margin, the true value is likely between 55 % and 65 %."

#### 6.4.4 Proportion vs Mean — when does it matter?
- Proportion mode: outcome is binary or categorical (yes/no, approve/disapprove, infected/not infected).
- Mean mode: outcome is continuous (weight, test score, reaction time, blood pressure).
- Choosing the wrong mode will produce a meaningless sample size.

#### 6.4.5 Finite-population correction — when and why
- FPC only matters when you plan to sample a significant fraction of a small, known population.
- Rule of thumb: if n₀ / N > 5 %, FPC makes a meaningful difference.
- If population is large or unknown, leave it blank — the correction is negligible.

#### 6.4.6 What this calculator does NOT tell you
- It does not perform power analysis for hypothesis testing (e.g. A/B tests, clinical trials with treatment vs control).
- It does not account for non-response, dropout, or stratified sampling.
- It assumes simple random sampling with independent observations.
- For complex multi-arm designs, use dedicated power-analysis software.

---

### 6.5 Worked Examples (minimum 6)

| # | Title | Mode | Confidence | Margin | p / σ | Population | n |
|---|-------|------|------------|--------|-------|------------|---|
| 1 | General survey baseline | Proportion | 95 % | 5 % | 50 % | ∞ | 385 |
| 2 | Conservative p = 50 % with tighter margin | Proportion | 95 % | 4 % | 50 % | ∞ | 601 |
| 3 | Finite-population campus survey | Proportion | 95 % | 5 % | 50 % | 1 200 | 292 |
| 4 | Prevalence planning (epidemiology) | Proportion | 95 % | 3 % | 20 % | ∞ | 683 |
| 5 | Laboratory mean estimate | Mean | 95 % | 2 | 8 | ∞ | 62 |
| 6 | Small-cohort mean estimate | Mean | 95 % | 2 | 8 | 180 | 47 |

Each worked example must include:
- A **real-world scenario** sentence (who, what, why).
- The full **step-by-step derivation** with real numbers (same format as §4.6.5).
- A **key takeaway** sentence summarising the practical lesson.

Example narrative for #1:
> *"A university student government wants to gauge approval of a new campus policy. With no prior data, they use p = 50 % for the most conservative estimate. At 95 % confidence and a 5 % margin: n₀ = (1.96)² × 0.25 / (0.05)² = 384.16 → **385 responses**. Takeaway: the classic 385 number comes from the most conservative proportion assumption."*

---

### 6.6 Scenario Analysis
This section provides side-by-side comparison tables so users can explore "what-if" trade-offs without touching the calculator.

#### 6.6.1 Margin-of-error sensitivity (proportion mode, p = 50 %, 95 % confidence, infinite population)

| Margin of error | n₀ | Practical note |
|----------------|----|----------------|
| 1 % | 9 604 | Polling-grade precision — very expensive |
| 2 % | 2 401 | High-precision academic study |
| 3 % | 1 068 | Strong research standard |
| 4 % | 601 | Balanced cost vs precision |
| 5 % | 385 | Classic baseline for general surveys |
| 7 % | 196 | Quick exploratory pulse |
| 10 % | 97 | Rough pilot — wide interval |

**Insight callout:** *"Halving the margin from 10 % to 5 % quadruples the sample from 97 to 385. Halving again to 2.5 % pushes it to 1 537. Precision is expensive."*

#### 6.6.2 Confidence-level sensitivity (proportion mode, p = 50 %, E = 5 %, infinite population)

| Confidence | z | n₀ |
|------------|---|----|
| 90 % | 1.645 | 271 |
| 95 % | 1.960 | 385 |
| 99 % | 2.576 | 664 |

**Insight callout:** *"Moving from 95 % to 99 % confidence adds 279 extra observations — a 72 % increase — for a relatively small gain in certainty."*

#### 6.6.3 Proportion sensitivity (E = 5 %, 95 % confidence, infinite population)

| Estimated p | n₀ | Why it matters |
|------------|----|-|
| 10 % | 139 | Low-prevalence screening |
| 20 % | 246 | Prevalence or adoption studies |
| 30 % | 323 | Market share surveys |
| 40 % | 369 | Near-balanced outcomes |
| 50 % | 385 | Maximum variance — most conservative |

**Insight callout:** *"p = 50 % always gives the largest sample. If you have defensible prior evidence that p is far from 50 %, you can plan a smaller study."*

#### 6.6.4 Finite-population correction impact (proportion mode, p = 50 %, 95 %, E = 5 %)

| Population N | Uncorrected n₀ | Corrected n | Reduction |
|-------------|----------------|-------------|-----------|
| 500 | 385 | 218 | −43 % |
| 1 000 | 385 | 278 | −28 % |
| 2 000 | 385 | 323 | −16 % |
| 5 000 | 385 | 357 | −7 % |
| 10 000 | 385 | 370 | −4 % |
| 50 000 | 385 | 382 | −1 % |
| ∞ | 385 | 385 | 0 % |

**Insight callout:** *"FPC matters most below N ≈ 2 000. Above 10 000 the correction is barely noticeable."*

#### 6.6.5 Mean-mode trade-off table (95 % confidence, σ = 10, infinite population)

| Margin E (units) | n₀ | Practical note |
|------------------|----|----------------|
| 0.5 | 1 537 | High-precision lab measurement |
| 1 | 385 | Strong research standard |
| 2 | 97 | Moderate precision |
| 3 | 43 | Quick estimate |
| 5 | 16 | Pilot study only |

**Insight callout:** *"In mean mode the trade-off is the same quadratic pattern: halving E quadruples n. Always justify σ from prior data or a pilot."*

---

### 6.7 Visual Reference
This section specifies diagrams, charts, and summary tables that must appear in the explanation to make the content scannable and visually informative.

#### 6.7.1 Decision flowchart (required)
A clear, vertical flowchart diagram that helps the user pick the right mode and settings:

```
┌─────────────────────────────────────┐
│  What is the study outcome?         │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
 ┌───────────┐   ┌───────────┐
 │ % / Rate  │   │ Continuous│
 │ / Binary  │   │ measure   │
 └─────┬─────┘   └─────┬─────┘
       ▼               ▼
 ┌───────────┐   ┌───────────┐
 │Proportion │   │  Mean     │
 │  mode     │   │  mode     │
 └─────┬─────┘   └─────┬─────┘
       │               │
       └───────┬───────┘
               ▼
 ┌─────────────────────────────────────┐
 │  Is the total population known      │
 │  and relatively small (< 10 000)?   │
 └──────────────┬──────────────────────┘
        ┌───────┴───────┐
        ▼               ▼
     ┌─────┐        ┌──────┐
     │ Yes │        │  No  │
     └──┬──┘        └──┬───┘
        ▼               ▼
 ┌────────────┐  ┌─────────────────┐
 │Enter N for │  │Leave population │
 │    FPC     │  │  field blank    │
 └────────────┘  └─────────────────┘
```

This flowchart must be rendered as a styled HTML/CSS diagram or an inline SVG — not a code block or image file. It must be readable on mobile.

#### 6.7.2 Parameter-impact summary table (required)

| When you… | Sample size… | Relationship | Magnitude |
|-----------|-------------|--------------|-----------|
| ↑ Confidence level | ↑ Increases | Proportional to z² | Moderate |
| ↓ Margin of error | ↑ Increases | Inversely proportional to E² | **Strong** — halving E ≈ 4× n |
| Move p toward 50 % | ↑ Increases | p(1−p) maximises at 0.5 | Moderate |
| Move p away from 50 % | ↓ Decreases | p(1−p) shrinks | Moderate |
| ↑ Population σ | ↑ Increases | Proportional to σ² | Strong |
| Enter a small population N | ↓ Decreases | FPC factor < 1 | Significant below N ≈ 2 000 |

#### 6.7.3 Quick-reference cheat sheet card (required)
A single, compact, visually distinct card that a user can screenshot or print:

| Question | Quick answer |
|----------|-------------|
| Most common confidence level? | 95 % (z = 1.96) |
| Safest proportion assumption? | p = 50 % (most conservative) |
| Classic survey sample size? | 385 (at 95 % / 5 % / p = 50 %) |
| When to use FPC? | Population < ~10 000 and known |
| Does this do power analysis? | No — estimation planning only |

---

### 6.8 FAQ requirements
- Show exactly 10 visible FAQ cards.
- FAQ questions must reflect real user intent (not SEO padding).
- FAQ schema must match visible FAQ exactly — no extra, no missing.

Required FAQ topics (questions may be reworded for clarity):
1. When to use proportion mode
2. When to use mean mode
3. Why the default estimated proportion is 50 %
4. What finite-population correction does
5. Whether population size is always needed
6. Why the final sample is always rounded up
7. What happens when margin of error is tightened
8. What happens when confidence level is increased
9. Whether this replaces a full power analysis
10. Whether the calculator stores user data

---

### 6.9 Important Notes (mandatory — UR-EXP final section)
This is the last section in the explanation pane. It must include the following bullet items in this order:

1. **Last updated:** March 2026.
2. **Accuracy:** The calculator uses standard z-based sample-size planning formulas for proportions (Cochran) and means. Results match textbook outputs for the same inputs.
3. **Disclaimer:** These results support estimation planning and protocol drafting but do not replace institutional review board guidance, full power analysis, or professional statistical consultation.
4. **Assumptions:** The formulas assume simple random sampling, independent observations, a defensible prior proportion (or p = 50 % as worst-case), and a known or justified population standard deviation for mean studies.
5. **Non-response buffer:** Consider adding 10–20 % to the computed sample size to account for non-response, incomplete data, or dropout — this calculator does not include a non-response adjustment.
6. **Complex designs:** Cluster sampling, stratification, and multi-stage designs require design-effect adjustments not covered here.
7. **Privacy:** All calculations run locally in your browser — no data is stored.

## 7. SEO / SERP Contract

### 7.1 Metadata
- **Title**: `Sample Size Calculator — Proportion & Mean Study Planner | CalcHowMuch`
- **Meta description**: `Plan your study sample size for proportions or means with confidence intervals, finite-population correction, worked examples, sensitivity tables, and research-ready guidance. Free, no sign-up.`
- **Canonical**: `https://calchowmuch.com/math/sample-size/`
- **Robots**: `index, follow`
- **OG / Twitter cards**: title, description, type, url, image — all must be present and consistent.

### 7.2 Structured data
A single deduplicated `<script type="application/ld+json">` block containing one `@graph` array with:
- `WebPage` (name, url, description, inLanguage)
- `SoftwareApplication` (name, applicationCategory: EducationalApplication, operatingSystem: Web, offers: free)
- `BreadcrumbList`
- `FAQPage`

No duplicate schema types. Schema must pass Google Rich Results Test.

### 7.3 Breadcrumb contract
```
1. Home → https://calchowmuch.com/
2. Math → https://calchowmuch.com/math/
3. Sample Size Calculator → https://calchowmuch.com/math/sample-size/
```

### 7.4 Visible content parity
- H1, title, canonical intent, and schema naming must agree on "Sample Size Calculator".
- Visible FAQ count must equal FAQ schema count (10).
- FAQ text must match between visible cards and `FAQPage` schema.

## 8. Visual Design Contract

### 8.0 Design north star
> **Think like Apple designers.** Every element on this page must justify its existence. If it doesn't help the user understand or plan their sample size, it doesn't belong. The goal is a page so clean and confident that users trust the result on sight — no clutter, no visual noise, no cognitive overload.

### 8.1 Design philosophy — five principles

| # | Principle | What it means in practice |
|---|-----------|---------------------------|
| 1 | **Radical simplicity** | Remove everything that isn't essential. No decorative borders, no gratuitous icons, no feature badges. If in doubt, leave it out. |
| 2 | **One thing at a time** | Guide the eye in a single vertical flow: context → input → answer → explanation. The user should never wonder "where do I look next?" |
| 3 | **Breathing room** | Generous white-space (or dark-space on premium-dark theme) between every card. Padding is not wasted space — it is the design. Minimum 24 px gap between cards, 40 px between major sections. |
| 4 | **Quiet confidence** | Results speak for themselves. Large, clear answer number. Subtle supporting text. No exclamation marks, no "WOW!" badges, no pulsing animations. The wow comes from how effortless it feels. |
| 5 | **Progressive disclosure** | Show the answer first, then the details. Steps, assumptions, and sensitivity table are visible but visually secondary — the user scans downward only if they want depth. |

### 8.2 No-ads layout
- The `ads-column` sidebar must be **completely removed** from this route.
- The `center-column` must expand to fill the full width of `layout-main` (minus the left-nav).
- No AdSense `<ins>` tags, no ad placeholder divs, no AdSense head script on this page.
- The page must feel like a premium product — ad-free, distraction-free.

### 8.3 Layout structure
- **Full-width single column** within the center area (no left-right split between inputs and results).
- The vertical flow must be:
  1. **Hero** — one-line academic context + mode toggle. Compact, not a hero banner. Think Apple product tagline.
  2. **Preset ribbon** — horizontal row of preset cards (not a grid). On mobile, horizontally scrollable.
  3. **Input section** — clean card with grouped fields. Confidence buttons, margin field, mode-specific field, optional population. Calculate button at the bottom.
  4. **Answer section** — the result number, large and unmissable, followed by metric summary, interpretation, assumptions.
  5. **Detail section** — step-by-step derivation, then sensitivity table.
  6. **Explanation section** — guide, formulas, deep explanation, scenarios, visual reference, FAQ, important notes.
- On mobile: everything stacks naturally. No horizontal overflow except the preset ribbon and sensitivity table.

### 8.4 Colour and surface
- Use the premium-dark theme as the base.
- **Primary accent:** a single muted blue (e.g. `hsl(215, 50%, 55%)`) for interactive elements — buttons, active states, highlighted rows.
- **Success accent:** a subtle warm green only for the final answer number (e.g. `hsl(145, 40%, 55%)`).
- **Surface hierarchy:** use no more than 3 surface levels (background → card → elevated card). Distinguish them with subtle lightness shifts, not borders.
- **No borders unless essential.** Use spacing and surface colour to separate elements. Where a border is needed (e.g. input fields), use a single 1 px line at low opacity.
- **No gradients, no shadows deeper than 2 px, no glow effects.** The page should feel flat but layered.

### 8.5 Typography and readability
- **Answer number:** 48–56 px, semi-bold, the single largest element on the page. It must be readable from arm's length.
- **Section labels:** 11–12 px, uppercase, letter-spaced, muted — think Apple's category labels.
- **Body text:** 15–16 px, comfortable line-height (1.6), max line-width 680 px for explanation prose to prevent eye fatigue.
- **Input labels:** 13–14 px, medium weight, directly above the field. Never floating or inside the field.
- **Hints:** 12 px, muted, always below the input — never competing with the label.
- **Step formulas:** monospace or tabular-nums, slightly larger than body (16–17 px), with clear numbered prefixes.
- **Hierarchy rule:** at any screen position, the user's eye should be drawn to exactly one element. If two things compete for attention, one of them is too loud.

### 8.6 Micro-interactions and smooth feel
- **Mode toggle transition:** when switching Proportion ↔ Mean, the mode-specific fields must crossfade (opacity 0 → 1, ~200 ms ease) — not jump-cut.
- **Preset selection:** tapping a preset card adds a subtle scale pulse (1.00 → 1.02 → 1.00, ~150 ms) and the card border/background tints to the active accent.
- **Calculate button:** on press, a brief ripple or subtle press-down effect (~120 ms). On completion, the answer area fades in smoothly.
- **Sensitivity table highlight:** the active row has a left-edge accent bar that slides in (~200 ms).
- **No animation for animation's sake.** Every motion must communicate state change: "you tapped this", "this is new", "this field appeared". If the user wouldn't notice it missing, remove it.
- **Reduced motion:** respect `prefers-reduced-motion: reduce` — all transitions become instant, no pulse/ripple effects.

### 8.7 Preset cards
- Horizontal ribbon layout (flexbox row, gap 12 px, horizontal scroll on overflow).
- Each card: 160–200 px wide, rounded corners (8–10 px radius), inner padding 12–16 px.
- Content: kicker label (small caps, muted), title (14 px, medium weight), one-line parameter summary (12 px, muted).
- **Idle state:** card blends into background — low contrast border or no border.
- **Hover state:** subtle background lightening (not a shadow lift — stay flat).
- **Active state:** accent-coloured left bar or top bar + slight background tint. Only one preset active at a time.

### 8.8 Input card
- Single card surface, rounded corners, inner padding 20–24 px.
- Fields stacked vertically with 16 px gap.
- Confidence buttons: pill-shaped, inline group, only the active button is filled — others are ghost/outline.
- Number inputs: right-aligned text, clear unit suffix (% or units) outside the field or as a subtle inline label.
- Calculate button: full-width, accent-coloured, 48 px height, rounded, centred text. The single most prominent interactive element on the page.

### 8.9 Answer card
- Visually elevated — the one card that stands out from everything else.
- Answer number centred, large (48–56 px), accent colour.
- Below the number: a single-line summary ("You need at least 385 responses").
- Metric grid below: compact, 2–3 columns on desktop, stacked on mobile. Each metric is a label + value pair, not a "card within a card".
- Interpretation paragraph: regular body text, full-width, slightly indented or in a subtle blockquote-style container.

### 8.10 Sensitivity table styling
- Clean table with no outer border.
- Column headers: muted, uppercase, small.
- Rows: subtle alternating background (2–3 % lightness difference, not harsh zebra stripes).
- Active row: accent-coloured left-edge bar (3 px) + slightly brighter background.
- Compact, fixed-height container with scroll if > 7 rows.
- Mobile: horizontal scroll with sticky first column.

### 8.11 Explanation section styling
- Full-width prose within a max-width container (680 px for readability).
- Worked-example cards: minimal — a subtle top border or left accent, not a heavy card.
- FAQ cards: simple expand/collapse or flat list — no heavy accordion chrome.
- Scenario tables: same clean table style as the sensitivity table.
- Flowchart: rendered as styled HTML/CSS with rounded boxes, thin connector lines, and muted fills — matching the page palette.

### 8.12 Cognitive load rules (mandatory)
These rules exist to protect the user from overwhelm. Violating any of them is a design defect:

1. **One primary action per screen viewport.** The Calculate button must be the only prominent call-to-action visible at any scroll position in the input area. No competing buttons.
2. **Maximum 5 ± 2 visible inputs.** Both modes must stay within 5–7 input fields (including confidence buttons). If more are ever needed, use progressive disclosure (an "Advanced" expandable) — but v1 must not need this.
3. **No tooltips for essential information.** If a user *needs* information to use the field correctly, put it in the hint text below the field — not behind a hover tooltip or info icon.
4. **No modal dialogs.** Errors, guidance, and explanations must be inline. Nothing should interrupt the user's flow with a popup.
5. **Consistent vertical rhythm.** All cards, sections, and elements must align to a baseline spacing grid (8 px increments). Misaligned elements feel broken even if no one can articulate why.
6. **Limit colour palette.** Maximum 3 semantic colours on the page: accent (blue), success (green for answer), and error (muted red). Everything else is greyscale from the theme. More colours = more cognitive load.
7. **Reading order = DOM order.** No CSS-reordered content that breaks tab order or screen-reader flow. What you see top-to-bottom is what the DOM delivers top-to-bottom.

### 8.13 Accessibility
- All interactive elements must be keyboard-accessible.
- ARIA roles: `tablist` / `tab` for mode switch, `group` for confidence buttons, `alert` for errors, `polite` for live result region.
- Focus management: after calculation, focus should move to the result area for screen reader users.
- Colour contrast must meet WCAG AA (4.5:1 for text, 3:1 for large text and UI components).
- Touch targets: minimum 44 × 44 px on mobile.
- `prefers-reduced-motion`: all animations and transitions must be suppressed.
- `prefers-color-scheme`: not applicable (premium-dark is fixed), but ensure no white-flash on load.

## 9. Validation Rules
- Margin of error must be > 0.
- Proportion must be between 0 and 100 (inclusive).
- Population standard deviation must be > 0.
- Population size, when filled, must be ≥ 1.
- If population size is filled and is smaller than the computed n₀, show a guidance note: "Your sample would cover the entire population — consider surveying everyone."
- All validation messages must be plain English, inline, and non-blocking of the last valid result.

## 10. Sensitivity Table Contract
- The table must show sample size for **7 margin-of-error values** while holding all other inputs constant.
- Default margin values for proportion mode: 1 %, 2 %, 3 %, 4 %, 5 %, 7 %, 10 %.
- Default margin values for mean mode: 0.5, 1, 1.5, 2, 3, 5, 10 (in σ units).
- The row matching the user's current margin setting must be visually highlighted.
- Columns: Margin of Error | Base n₀ | Final n (with FPC if applicable).
- The table must regenerate on every new calculation.

## 11. Technical Contract

### 11.1 File structure
```
public/
  math/
    sample-size/
      index.html          ← page shell (generated)
public/
  calculators/
    math/
      sample-size/
        index.html         ← calculator pane markup
        module.js          ← entrypoint (ES module)
        engine.js          ← pure calculation + preset data
        calculator.css     ← page-specific overrides
content/
  calculators/
    math-calculators/
      sample-size-calculator/
        explanation.html   ← explanation pane content
```

### 11.2 Architecture rules
- MPA only — no client-side routing, no SPA behaviour.
- Calculator JS must be an ES module loaded with `type="module"`.
- No external dependencies — pure vanilla JS.
- Button-triggered calculation — no auto-recompute on input change.
- All calculations must run client-side in the browser — no server calls, no data stored.

### 11.3 CSS rules
- Page-specific styles in `calculator.css`, loaded via `@import url(...)` inside a `<style>` tag in the route HTML (existing pattern).
- Must not modify shared CSS files (`base.css`, `layout.css`, `calculator.css`, `shared-calculator-ui.css`, `theme-premium-dark.css`).

## 12. Acceptance Criteria
The rebuild is complete only if **all** of the following are true:

1. The route renders as single-pane `calc_exp` with `data-route-archetype="calc_exp"` and `data-design-family="neutral"` on `<body>`.
2. **No ads pane.** The generated HTML must not contain an `ads-column` section, ad placeholder divs, or AdSense script/`<ins>` tags.
3. Both modes (Proportion and Mean) compute correct sample sizes matching the formulas in §5.
4. A default solved example (General Survey, n = 385) is visible on first load — no blank state.
5. Preset cards populate inputs and trigger calculation immediately.
6. Each mode shows mode-specific worked steps with real numbers.
7. The sensitivity table renders with 7 rows, highlights the active margin row, and updates on every calculation.
8. The interpretation paragraph is contextual, copy-paste-ready, and mode-specific.
9. Finite-population correction is applied when population is entered and omitted when blank.
10. Validation errors are plain English, inline, and non-blocking of last valid result.
11. Explanation content follows the expanded UR-EXP structure: H2 guide → H3 How to Guide → H3 Formulas → H3 What Does It Tell Me → H3 Worked Examples → H3 Scenario Analysis → H3 Visual Reference → H3 FAQ (10 items) → H3 Important Notes.
12. Visible FAQ count is 10 and matches FAQ schema exactly.
13. Metadata (title, description, canonical, OG, Twitter) is present and correct.
14. JSON-LD contains WebPage + SoftwareApplication + BreadcrumbList + FAQPage in one deduplicated @graph.
15. **Design quality gate:** the page passes visual review against the 7 cognitive-load rules in §8.12 — one primary action per viewport, ≤ 7 inputs, no tooltips for essential info, no modals, consistent spacing grid, ≤ 3 semantic colours, DOM order = reading order.
16. Mode-switch transition is smooth crossfade (not jump-cut). `prefers-reduced-motion` is respected.
17. Unit tests, E2E tests, SEO tests, CWV tests, and ISS-001 layout tests all pass.
18. No mojibake or corrupted symbols remain.
19. The page is sitemap-listed.
