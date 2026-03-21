# Auto Loan Cluster Light Design System

## Intent

Translate the approved homepage direction into premium Auto Loan calculator pages.

The target feel is:

- light
- premium
- calm
- intentional
- precise
- mobile-friendly
- trustworthy

The target feel is not:

- dark
- neon
- glass-heavy
- shell-driven
- dashboard-like
- cluttered

---

## Core Principles

- The page should feel like a refined product page, not a calculator trapped inside a utility shell.
- The main answer must be readable in one glance.
- The calculator should feel immediate above the fold.
- Dense financing choices should feel guided, not intimidating.
- Every Auto Loan route should feel related without looking copied.

---

## Shell Rules

- Use a dedicated Auto Loan cluster header and footer.
- Remove `top-nav`, `left-nav`, and the ads column from migrated Auto Loan routes.
- Use one centered main column with generous vertical rhythm.
- Keep the H1 prominent, calm, and centered.
- Keep the intro short and helpful.

---

## Visual Tokens

### Background

- soft white base with restrained graphite and steel-blue atmosphere
- no dark backgrounds
- no loud gradients
- no noisy decorative patterns

### Surfaces

- white and soft stone cards
- subtle borders
- low-elevation shadows
- medium-to-large radii only where they calm the layout

### Text

- near-black primary text
- medium gray supporting text
- muted helper text used sparingly

### Accent

- steel blue as the primary accent
- graphite and muted silver as support accents
- accent used for focus, active states, key links, and answer emphasis
- no electric cyan glow, purple gradients, or orange-heavy finance-dashboard carryover

---

## Typography

- large confident H1
- clean H2/H3 hierarchy
- system-font direction consistent with homepage
- short readable helper copy
- no decorative dashboard typography

Explanation baseline:

- `H3`: `16px`
- guide `H4`: `14px`
- guide body, list, and table text: `14px`

---

## Layout And Component Rules

### Hero

- short, clean, one-screen-friendly
- existing H1 preserved
- one useful intro sentence or short paragraph

### Form panel

- white or soft-stone surface
- clean input grouping
- precise entry fields sit next to or directly under their paired range controls
- CTA is obvious without dominating the page

### Result panel

- answer-first
- one dominant monthly-payment or comparison answer
- supporting metrics grouped underneath in a quiet grid
- balloon, GFV, residual, or total-cost metrics must feel secondary but still obvious

### Explanation

- keep answer-first summary near the top
- follow the repo order: guide, FAQ, important notes
- no crowded FAQ card wall

### Related calculators

- curated next-step guidance
- light card treatment
- no generic leftover-link feel

---

## Table Standards

- desktop/tablet table title and toggle share one row
- toggle sits right-aligned on wider screens and wraps cleanly on mobile
- table viewport height is fixed and internally scrollable when needed
- sticky header remains intact
- no page-level horizontal overflow
- numeric columns use tabular numerals and strong alignment
- comparison tables keep the first label column more readable than the value columns
- mobile tables should become labeled stacked rows when that improves scan clarity more than horizontal scroll
- cost-breakdown tables should feel concise and deliberate, not like spreadsheet dumps

---

## Graph Standards

- graph is secondary to the primary decision, not decorative
- true opening value at period `0`
- max two primary series
- compact legend near the top
- sparse readable axis labels
- no clipped or overlapping labels
- no oversized KPI stack above the graph
- tooltip copy stays minimal and contained
- desktop height target `240px-320px`
- mobile height target `180px-260px`

Visual treatment:

- light graph container
- subtle grid lines
- strong but calm line contrast
- minimal chrome

---

## Motion

- subtle only
- hover and focus transitions can lift, sharpen, or tint slightly
- avoid flashy motion or decorative effects

---

## Calculator-Specific Notes

### Car Loan

- answer should lead with monthly payment and amount financed
- tax, fees, trade-in, and deposit need clean scan hierarchy

### Multiple Car Loan

- comparison needs clearer A vs B vs combined structure
- combined payment and combined interest must stay visible without hunting

### Hire Purchase

- balloon payment must read like a deliberate final obligation, not a hidden footnote

### PCP

- GFV, final payment, and option fee need strong hierarchy
- the page must guide the end-of-term choice clearly

### Leasing

- residual, money factor, and total lease cost must feel understandable
- density should be reduced more aggressively than on the other routes

---

## Quality Bar

Every migrated route should look like:

- a calm premium product page
- intentionally designed for desktop and mobile
- clearly part of the Auto Loan family
- cleaner than the old shell and dark theme in every visible section
