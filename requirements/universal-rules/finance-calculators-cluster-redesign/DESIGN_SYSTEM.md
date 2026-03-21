# Finance Calculators Light Design System

## Intent

Translate the approved homepage direction into premium Finance calculator pages.

The target feel is:

- light
- premium
- calm
- intentional
- elegant
- analytical without feeling corporate
- mobile-friendly
- trustworthy

The target feel is not:

- dark
- neon
- shell-driven
- dashboard-heavy
- cluttered
- boxy

---

## Core Principles

- The page should feel like a refined financial product page, not a calculator trapped inside a utility shell.
- The main answer must be readable in one glance.
- The calculator should feel immediate above the fold.
- Dense financial concepts should feel guided, not intimidating.
- Every Finance route should feel related without looking copied.

---

## Shell Rules

- Use a dedicated Finance cluster header and footer.
- Remove `top-nav`, `left-nav`, and the ads column from migrated Finance routes.
- Use one centered main column with generous vertical rhythm.
- Keep the H1 prominent, calm, and centered.
- Keep the intro short and helpful.

---

## Visual Tokens

### Background

- soft white base with restrained slate, mineral, and pale blue atmosphere
- no dark backgrounds
- no loud gradients
- no noisy decorative patterns

### Surfaces

- white and soft mineral cards
- subtle borders
- low-elevation shadows
- medium-to-large radii only where they calm the layout

### Text

- near-black primary text
- medium gray supporting text
- muted helper text used sparingly

### Accent

- graphite blue as the primary accent
- pale steel and muted aqua as support accents
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

- answer-first H2 with one short answer paragraph and one supporting paragraph
- `How to Guide` `H3`: `16px`
- guide `H4`: `14px`
- guide body, list, and table text: `14px`

---

## Layout And Component Rules

### Hero

- short, clean, one-screen-friendly
- existing H1 preserved
- one useful intro sentence or short paragraph

### Form panel

- white or soft-mineral surface
- clean input grouping
- precise entry fields sit next to or directly under paired range controls
- CTA is obvious without dominating the page

### Result panel

- answer-first
- one dominant value or decision summary
- supporting metrics grouped underneath in a calm grid
- result cards must feel informative, not promotional

### Explanation

- keep answer-first summary near the top
- follow the repo order: `How to Guide`, FAQ, Important Notes
- no crowded FAQ card wall

### Related calculators

- curated next-step guidance
- light card treatment
- no generic leftover-link feel

---

## Table Standards

- desktop and tablet table title and toggle share one row
- toggle sits right-aligned on wider screens and wraps cleanly on mobile
- table viewport height is fixed and internally scrollable when needed
- sticky header remains intact
- no page-level horizontal overflow
- numeric columns use tabular numerals and strong alignment
- comparison tables keep the first label column more readable than the value columns
- mobile tables should become labeled stacked rows when that improves scan clarity more than horizontal scroll
- graph/table support chrome should be compact and intentional, not dashboard-like

---

## Graph Standards

- graph is secondary to the primary decision, not decorative
- true opening value at period `0`
- max two primary series unless the route clearly requires more
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

### Time Value Pair

- present and future value routes should feel crisp, educational, and fast to scan
- annuity routes should make ordinary vs due differences obvious without clutter

### Interest Pair

- EAR and simple interest should feel compact and high-trust
- formulas should read like a guide, not a math dump

### Growth Pair

- compound interest and investment growth should establish the cluster graph/table language
- charts must clarify growth, not overpower the page

### Savings Pair

- time-to-goal and monthly-savings-needed should feel motivating and practical
- progress metrics should read like a plan, not a worksheet

### Advanced Route

- investment-return must preserve power while feeling calm
- advanced controls should be discoverable and segmented from the baseline flow

---

## Quality Bar

Every migrated route should look like:

- a calm premium product page
- intentionally designed for desktop and mobile
- clearly part of the Finance family
- cleaner than the old shell and dark theme in every visible section
