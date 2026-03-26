# Salary Calculators Light Design System

## Intent

Translate the salary cluster into a calm, premium, answer-first utility system.

The cluster should feel:

- light
- simple
- precise
- premium
- fast to scan
- trustworthy
- low-friction
- mobile-safe

The cluster should not feel:

- dark
- dashboard-like
- shell-heavy
- cluttered
- text-heavy
- noisy
- finance-enterprise
- over-designed

---

## Core Principles

- The first screen should explain the task immediately.
- The user should see the calculator and understand the main action without thinking.
- The answer should feel instant and obvious after calculate.
- Supporting numbers should help the answer, not compete with it.
- Explanation content should exist, but it must not crowd the answer area.
- Every salary route should feel like one family, not ten unrelated pages.

---

## Design Philosophy

- Think Apple-style utility, not startup-dashboard utility.
- Use reduction, spacing, hierarchy, and restraint instead of decoration.
- Prefer one strong answer over many equal-weight result blocks.
- Prefer smooth rhythm over dense data packing.
- Prefer short labels and short helper text.
- Every element must justify its presence.

---

## Visual Direction

### Background

- soft off-white page background
- subtle cool-gray or blue-gray atmosphere only
- no dark surfaces
- no heavy gradients
- no loud decorative patterns

### Surfaces

- white primary cards
- slightly tinted secondary surfaces
- soft borders
- low-elevation shadows
- generous corner radius without looking playful

### Accent

- restrained blue-gray accent
- accent used for focus, active state, links, selected controls, and key emphasis
- avoid bright cyan, purple, neon, or multicolor gradients

### Text

- near-black primary text
- medium-gray supporting text
- muted helper text used sparingly
- strong numeric emphasis for main answers

---

## Typography

- clean sans-serif for UI and body
- large confident H1
- short, quiet intro text
- compact section headings
- large tabular numerals for main answers
- helper text must stay short and secondary

### Text rules

- no long paragraphs above the calculator
- no explanation-heavy result cards
- no repeated labels around obvious numbers
- no microcopy overload
- no wall of FAQ-style text near the answer

---

## Information Hierarchy

Every salary route should follow this order:

1. lightweight route header
2. H1 and short intro
3. calculator card above the fold
4. primary answer card
5. compact supporting metrics
6. optional secondary detail block
7. explanation content
8. FAQ
9. related calculators
10. footer

### Above-the-fold rule

- the user must see the page purpose, main inputs, and primary action quickly
- on common laptop widths, the calculator start state should feel immediate
- on mobile, the first screen should not feel text-first

---

## Layout System

### Shell rules

- single-column, centered layout
- no left-nav
- no ad-column in the main reading path
- no shell leftovers around the calculator
- explanation stays in the same page narrative, not a separate pane

### Container behavior

- generous max-width, but never too wide for readable text
- comfortable vertical rhythm between sections
- strong whitespace around the calculator and answer areas

### Grid behavior

- calculator card and answer card stack cleanly
- supporting metrics may use a 2-column or 4-cell rhythm depending on width
- mobile collapses to one clear column without visual crowding

---

## Component Rules

### Hero

- one H1
- one short intro paragraph
- no promotional clutter
- no chip clouds
- no oversized category browsing blocks

### Calculator card

- white surface
- clearly grouped inputs
- visible labels
- simple spacing
- strong but quiet focus states
- one obvious primary CTA

### Input controls

- radios or segmented controls for mode switching
- avoid dropdowns for core mode choice
- input labels should be direct and plain
- helper text only when it removes ambiguity
- validation should be calm and local, never loud

### CTA

- one clear primary button
- strong contrast
- simple fill
- no flashy gradient treatment
- hover and focus states should feel refined, not animated for attention

### Primary answer card

- one dominant value
- short label
- optional one-line context
- strongest visual emphasis on the page
- no clutter inside the card

### Supporting metrics

- 2 to 4 items only in the first supporting row
- quiet label-value styling
- clearly secondary to the main answer
- avoid oversized KPI dashboards

### Secondary detail

- only include when it adds real value
- use compact cards or simple rows
- do not let this section overpower the answer-first hierarchy

---

## Result Density Rules

- every route must have one primary answer
- the top result area must not contain more than one visually dominant number
- support values belong below the primary answer
- if a route produces many outputs, prioritize and progressively demote the rest
- deep details belong lower on the page

### Copy around answers

- keep answer labels short
- keep explanatory copy minimal near the result
- move worked explanations lower into the explanation section

---

## Route Variants

Use one shared base system across all routes.

### Conversion calculators

Applies to:

- `salary-calculator`
- `hourly-to-salary-calculator`
- `salary-to-hourly-calculator`
- `annual-to-monthly-salary-calculator`
- `monthly-to-annual-salary-calculator`

Rules:

- emphasize one converted answer first
- show adjacent pay-frequency equivalents as supporting metrics
- make comparison across frequencies feel clean and effortless

### Earnings calculators

Applies to:

- `weekly-pay-calculator`
- `overtime-pay-calculator`
- `raise-calculator`
- `bonus-calculator`
- `commission-calculator`

Rules:

- emphasize one payout or compensation outcome first
- show component values below
- mode changes must stay visually simple and easy to parse
- avoid looking like payroll software

### Cluster hub

Applies to:

- `salary-calculators-hub`

Rules:

- featured routes must appear before long-form explanatory copy
- route discovery should feel curated rather than grid-heavy
- unpublished routes must never appear in visible UI or schema

---

## Motion

- subtle only
- quick, low-distance transitions
- no decorative motion
- result reveal should feel smooth and composed
- hover states may sharpen, lift, or tint slightly

---

## Mobile Rules

- mobile must preserve the same answer-first hierarchy
- no crowded control rows
- segmented controls must remain thumb-friendly
- the primary CTA should stay obvious without excessive scrolling
- the answer card should remain visually strong on small screens
- explanation content must not interrupt the calculator flow too early

---

## Content Rules

- explanation is important but must sit below the task area
- FAQs should be concise and direct
- related calculators should feel curated, not generic
- avoid repeating the same concept in intro, result, explanation, and FAQ

---

## Quality Bar

Every salary calculator should feel like:

- a premium single-purpose utility page
- simpler than the current cluster hub
- faster to understand than a traditional calculator page
- visually quiet but unmistakably polished
- consistent with the rest of the salary family
