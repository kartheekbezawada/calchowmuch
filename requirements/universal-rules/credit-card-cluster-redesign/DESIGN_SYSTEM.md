# Credit Card Cluster Light Design System

## Intent

This design system translates the approved homepage visual direction into calculator pages.

The target feel is:

- premium
- quiet
- light
- readable
- modern
- trustworthy

The target feel is not:

- glassy
- neon
- gradient-heavy
- dashboard-like
- shell-driven
- dark

---

## Core Principles

- The page should feel like a focused landing page, not a tool embedded in a shell.
- The calculator must be immediately understandable above the fold.
- Results must read faster than they do now.
- Tables must feel lighter and less intimidating.
- Every page in the cluster must feel related without looking cloned.

---

## Homepage Design Translation

### Reuse from homepage

- light radial page atmosphere
- centered `wrap` container feel
- large clean hero spacing
- system font stack
- restrained blue accent
- white surfaces
- subtle borders
- soft shadows
- rounded corners without excess

### Do not copy blindly

- no homepage-style popular chips in the hero
- no cluster discovery grid above the calculator
- calculator routes still lead with calculator + results, not category browsing

---

## Visual Tokens

### Backgrounds

- page background: soft white with subtle radial blue tint
- primary surface: white / near-white
- secondary surface: slightly warm or cool off-white
- section separators: low-contrast line only

### Text

- primary text: near-black
- secondary text: medium gray
- tertiary text: muted gray used sparingly

### Accent

- primary accent: calm blue
- use accent for focus, links, active emphasis, and high-signal highlights
- avoid orange-heavy, neon, or multi-color CTA styling

### Borders and shadows

- borders should be visible but quiet
- shadows should be soft and low elevation
- strong glow effects are not allowed

### Radius

- medium radius on cards and inputs
- larger radius on primary sections only when it helps calm the layout

---

## Typography

### Font approach

- use the same clean system-font direction established on the homepage
- no heavy display font usage
- no decorative finance-dashboard typography

### Hierarchy

- H1: strong, high-confidence, simple
- H2: section anchor with clear spacing
- H3/H4: compact but readable
- helper text: short, clear, not tiny

### Text rules

- do not add long intro paragraphs above the calculator
- do not over-label every block
- do not fill the page with muted microcopy

---

## Layout System

### Global shell

- remove top-nav for the credit-card cluster routes
- remove left-nav for the credit-card cluster routes
- use a simple, homepage-style page shell instead

### Page structure

1. lightweight header
2. hero with H1 and short intro
3. calculator card above the fold
4. result summary block
5. table / detail block
6. explanation block
7. FAQ block
8. related calculators block
9. footer

### Container width

- centered content
- no overly wide unreadable text blocks
- no compressed dashboard columns

### Section rhythm

- generous vertical spacing
- clear transitions between calculator, results, explanation, FAQ, and related sections

---

## Component Rules

### Hero

- short, clean, one-screen-friendly
- existing H1 preserved
- one high-value intro sentence or short paragraph

### Calculator card

- white surface
- clear input grouping
- no dark, over-styled form panel
- CTA easy to find
- input labels clean and strong

### Inputs

- preserve functional input types
- improve spacing and readability
- use premium light controls
- strong visible focus states

### Primary CTA

- high contrast
- simple solid fill
- no bright multi-color gradient button
- clear hover/focus/active states

### Results summary

- large primary result
- supporting metrics grouped underneath
- key outputs should feel like answers, not raw rows

### Snapshot / side metrics

- compact grid or stacked metrics
- use quiet label/value hierarchy
- no dark side rail card treatment

### Tables

- lighter background
- stronger row spacing
- sticky headers preserved where required
- easier scan pattern
- reduced visual heaviness
- use a raised table container with a soft top shelf instead of a flat grid slab
- use uppercase low-noise headers with stronger separation from data rows
- use alternating row washes to improve row tracking on dense repayment schedules
- keep first-column labels stronger than the numeric columns
- use tabular numerals for money / balance / payment rows
- right-align numeric-heavy schedule tables where it improves scan speed
- keep the balance-transfer scenario summary mixed-alignment so the source column remains readable
- style empty / placeholder rows as deliberate pending states, not broken output
- do not show horizontal table scrollbars for these credit-card routes unless a real content break makes it unavoidable
- on small screens, convert table rows into labeled stacked cards rather than forcing sideways scrolling
- keep consolidation guide tables text-friendly with normal wrapping
- keep amortization controls visually separated from the table body
- add extra spacing between consecutive consolidation example tables so they read as separate comparison blocks

### Excel-style table variant

Use this variant when a calculator needs a more literal data-table presentation rather than a soft card-table treatment.

Rules:

- use flat spreadsheet-like cells instead of rounded inner table cards
- show clear vertical and horizontal grid lines
- use a light blue-grey header fill
- keep borders visible and quiet, not decorative
- remove heavy inner shadows and pill styling
- use alternating row shading for scanability
- center headers and values when the table reads better as a balanced matrix
- avoid horizontal scrollbars when the content can fit through better sizing and layout control

When to use:

- payoff schedules
- yearly summary tables
- simple comparison tables where clarity matters more than visual softness

Implementation note:

- if shared cluster selectors force numeric columns right or introduce scroll behavior, apply a route-scoped override for that specific table and make it strong enough to beat the shared cascade

### Explanation

- existing content preserved
- improve section spacing, headings, paragraph width, and readability

### FAQ

- same visible questions and answers
- calmer presentation
- no mismatch with schema

### Related calculators

- same section across all four routes
- clean homepage-style chip/card/link treatment
- stronger cluster cohesion

---

## Calculator-Specific Notes

### Credit Card Payment

- emphasize payoff horizon and total interest
- table should feel like a clear repayment schedule, not a dense output dump

### Credit Card Minimum Payment

- make minimum-payment cost instantly obvious
- yearly table needs strong readability

### Balance Transfer

- highlight total cost comparison and promo-window logic
- snapshot should feel decision-oriented

### Consolidation

- clarify comparison between current card payoff and consolidation option
- advanced options must feel secondary, not buried

---

## Implementation Model

- create cluster-owned shared design styles for the credit-card routes
- keep page-specific CSS only for route-specific components
- avoid duplicated styling across all four calculators

Potential structure:

- shared cluster light styles
- route-specific overrides only where content structure differs

---

## Prohibited Outcomes

- dark shell carried into the new design
- homepage colors pasted on top of old layout
- shell nav hidden with CSS while old structure remains conceptually unchanged
- cluttered result cards
- dense unreadable tables
- decorative-only redesign
