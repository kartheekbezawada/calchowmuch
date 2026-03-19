# Home Loan Cluster Light Design System

## Intent

Translate the approved homepage direction into premium Home Loan calculator pages.

The target feel is:

- light
- premium
- calm
- precise
- readable
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

- The page should feel like a refined product page, not a calculator inside a utility shell.
- The main answer must be legible in one glance.
- The calculator should feel immediate above the fold.
- Dense information should feel structured and calm, never intimidating.
- Every Home Loan route should feel related without looking cloned.

---

## Shell Rules

- Use a dedicated Home Loan cluster header and footer.
- Remove `top-nav`, `left-nav`, and the ads column from migrated Home Loan routes.
- Use one centered main column with generous vertical rhythm.
- Keep the H1 prominent, calm, and centered.
- Keep the intro short and helpful.

---

## Visual Tokens

### Background

- soft white base with restrained blue atmosphere
- no dark backgrounds
- no heavy gradients
- no noisy decorative patterns

### Surfaces

- white and soft off-white cards
- subtle borders
- low-elevation shadows
- medium-to-large radii only where they calm the layout

### Text

- near-black primary text
- medium gray supporting text
- muted helper text used sparingly

### Accent

- calm blue as the primary accent
- accent used for focus, active states, key links, and emphasis
- no electric cyan glow, neon green, or hot pink carryover

---

## Typography

- large confident H1
- clean H2/H3 hierarchy
- system-font direction consistent with homepage
- short readable helper copy
- no decorative finance-dashboard typography

Explanation baseline:

- preserve the `How Much Can I Borrow` explanation rhythm as the cluster baseline
- `How to Guide` `H3`: `16px`
- guide `H4`: `14px`
- guide body/list/table text: `14px`

---

## Layout and Component Rules

### Hero

- short, calm intro
- title centered
- calculator visible above the fold

### Form Panel

- clear grouping
- premium light inputs
- calm slider tracks and readable value badges
- CTA easy to identify

### Result Panel

- answer-first hierarchy
- primary answer large and obvious
- supporting metrics grouped below with strong label/value rhythm
- result surfaces must remain light, not dark slabs

### Explanation

- content meaning unchanged
- sections feel editorial and premium
- FAQ and notes feel consistent with the rest of the page

### Related Calculators

- preserve existing related content blocks
- present them as curated product links, not shell leftovers

---

## Table Standards

- table title and toggle share one row on desktop/tablet
- toggle right-aligned on desktop
- toggle remains segmented and clearly active/inactive
- full data stays available unless route requirements say otherwise
- fixed-height table viewport
- internal scroll inside the wrapper
- sticky header
- no page-level horizontal overflow
- mobile may wrap title/toggle, but the table stays a real table

Visual treatment:

- raised table container
- quiet uppercase header row
- alternating row washes
- tabular numerals
- stronger first column
- light placeholder state for pending rows

---

## Graph Standards

- graph exists to help a decision, not decorate the page
- true opening value at period `0`
- max two primary series
- compact legend near top
- sparse readable axis labels
- no clipped or overlapping labels
- no oversized KPI stack above the graph
- tooltip copy stays minimal and clamps to the container
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
- hover/focus transitions can lift, sharpen, or tint slightly
- avoid flashy motion or decorative effects

---

## Quality Bar

Every migrated route should look like:

- a calm premium product page
- intentionally designed for desktop and mobile
- consistent with the other completed Home Loan pages
- cleaner than the old shell and dark theme in every visible section
