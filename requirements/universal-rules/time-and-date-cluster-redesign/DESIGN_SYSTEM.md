# Time & Date Cluster Light Design System

## Intent

Translate the Time & Date cluster into a quiet editorial utility system.

The cluster should feel:

- light
- calm
- precise
- human
- trustworthy
- fast to scan
- mobile-friendly

The cluster should not feel:

- dark
- shell-heavy
- dashboard-like
- ad-driven
- cluttered
- noisy

## Core Principles

- The first screen should answer what the page does before it asks for effort.
- Utility comes first; atmosphere supports trust but never competes with the task.
- Results should feel immediate, legible, and anchored in real-world planning.
- Explanation content belongs in the page narrative, not in a secondary shell pane.

## Visual Direction

### Base palette

- page background: `#f6f2ea`
- primary surface: `#fffdf9`
- secondary surface: `#f1ece3`
- primary text: `#1f2730`
- muted text: `#60707c`
- border: `#d8d0c4`
- primary accent: `#274c77`
- support accent: `#7aa6b8`

### Typography

- display headings: warm editorial serif tone
- UI labels and controls: clean sans-serif
- H1 should feel large, composed, and calm
- answer values may use a display treatment, but labels and helper text must stay simple

### Surfaces

- large rounded cards
- soft borders
- low, quiet shadows
- subtle gradient or wash only where it reinforces focus

## Information Hierarchy

Every route should follow the same page order:

1. route header with H1 and short trust-building intro
2. compact route switcher or related-calculator strip
3. primary workbench with inputs and explicit calculate action
4. answer-first result surface with supporting metrics
5. secondary detail cards only when they clarify the answer
6. explanation content
7. FAQ
8. important notes
9. related calculators

## Cluster Tones

### Milestones

Routes:

- `age-calculator`
- `birthday-day-of-week`

Tone:

- warm
- reflective
- human

### Planning and countdown

Routes:

- `days-until-a-date-calculator`
- `time-between-two-dates-calculator`
- `countdown-timer-generator`

Tone:

- forward-looking
- tidy
- practical

### Work hours

Routes:

- `work-hours-calculator`
- `overtime-hours-calculator`

Tone:

- operational
- crisp
- structured

### Sleep and nap

Routes:

- `sleep-time-calculator`
- `wake-up-time-calculator`
- `nap-time-calculator`
- `power-nap-calculator`
- `energy-based-nap-selector`

Tone:

- restorative
- atmospheric
- soft without becoming decorative

## Shell Rules

- dedicated Time & Date header and footer
- centered single-column page shell
- no top nav
- no left nav
- no ads column
- explanation content stays in the same column as the calculator

## Interaction Rules

- preserve MPA navigation
- keep button-only recalculation after post-load edits
- support live states only after a deliberate start action where the route clearly requires it
- highlight stale-result states when inputs change after a calculation

## Quality Bar

Every migrated route should feel like:

- a focused utility page
- clearly part of the Time & Date family
- calmer and more legible than the legacy shell
- intentionally designed on desktop and mobile