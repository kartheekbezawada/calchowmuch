# Credit Card Cluster Redesign Brief

## 1. Purpose

This document defines the redesign brief for the CalcHowMuch Credit Card Calculators cluster.

The goal is to rebuild the visual design and UX of the cluster into a clean, premium, light-theme experience inspired by Apple, Stripe, and Notion while preserving calculator functionality, SEO structure, accessibility, and performance.

This is an implementation brief, not a prompt draft.

---

## 2. Scope

Apply this redesign system consistently across the entire Credit Card Calculators cluster, including:

- Credit Card Payment Calculator
- Credit Card Minimum Payment Calculator
- Balance Transfer Credit Card Calculator
- Credit Card Consolidation Calculator
- Any related credit card calculator pages in this cluster

---

## 3. Core Goal

Rebuild the cluster into a light, premium, modern, simple, calm, high-trust product experience.

The redesign must:

- improve clarity and usability
- improve perceived product quality
- improve SEO presentation without harming structure
- preserve calculator logic
- keep pages fast and lightweight

The redesign must not feel:

- decorative
- flashy
- crowded
- generic
- like a content farm

---

## 4. Non-Goals

The redesign is not intended to:

- rewrite calculator logic unless minor UX improvements require small structural changes
- add unnecessary visual complexity
- introduce heavy JS for presentation-only effects
- preserve the current dark theme for this cluster
- act as a color-only refresh

Important rule:

Do not just restyle colors. Redesign hierarchy, spacing, typography, form structure, results presentation, and section rhythm so the pages feel genuinely premium and substantially improved.

Think like a user seeing the page for the first time: reduce cognitive load, increase trust, make the result instantly understandable, and remove anything that feels visually heavy or outdated.

---

## 5. Experience Direction

### 5.1 Visual Direction

- Light theme only for this cluster
- Backgrounds: white or very soft neutral
- Text: dark gray or near-black
- Accent color: calm, trustworthy, finance-appropriate
- Clean typography with strong hierarchy
- Generous whitespace
- Smooth section rhythm
- Minimal borders
- Soft shadows only where necessary
- Rounded corners, but not excessive

### 5.2 Product Feel

The site should feel:

- smooth
- uncluttered
- elegant
- readable
- trustworthy
- conversion-focused

### 5.3 Design Principles

- Simplicity over decoration
- Clarity over density
- Premium over flashy
- Trust over gimmicks
- Structured over cluttered
- Calm over noisy

### 5.4 Avoid

- current dark CSS theme in this cluster
- oversized dark containers
- hard black backgrounds
- loud colors
- flashy gradients
- heavy shadows
- crowded cards
- harsh contrast combinations that reduce trust

---

## 6. Required Page Structure

Each calculator page in the cluster should follow this structure:

### 6.1 Hero Section

- Clear H1
- One short high-value intro
- No giant wall of text above the calculator

### 6.2 Calculator Card Above the Fold

- Inputs clearly grouped
- Primary CTA obvious
- Results visible quickly
- Strong visual separation between input and output areas

### 6.3 Results Summary Section

- Large key result cards
- Secondary supporting metrics
- Strong visual hierarchy

### 6.4 Interpretation / Explanation Section

- Human-readable explanation of the result
- Simple, helpful, trustworthy language

### 6.5 How It Works / Formulas

- Clean expandable or well-structured section
- Not visually heavy

### 6.6 FAQ Section

- Match visible content with schema
- Easy to scan

### 6.7 Related Calculators Section

- Strong internal linking
- Consistent card or link style

---

## 7. UX Requirements

The redesign must:

- improve readability of repayment summaries, payoff timelines, and balance transfer comparisons
- make amortization and payoff tables cleaner and less overwhelming
- use spacing and hierarchy to reduce cognitive load
- make results feel instantly understandable
- make forms feel uncramped
- improve layout hierarchy across hero, calculator, results, explanation, FAQ, and related links

Special attention areas:

- results cards
- payoff summaries
- comparison blocks
- tables
- explanation sections
- FAQ scannability

---

## 8. Design System Requirements

Create a reusable visual system for the entire credit card cluster.

This system should define:

- color palette
- typography scale
- spacing system
- card styles
- form field styles
- button styles
- result summary components
- table styles
- link and related-calculator components
- section spacing rhythm

The output should feel like one premium product family across the cluster.

---

## 9. Technical Requirements

The implementation must:

- audit existing cluster CSS and identify what is dark-theme-specific
- create a shared cluster design stylesheet or reusable tokens/components where appropriate
- minimize duplication
- preserve semantic HTML
- preserve headings, schema hooks, metadata hooks, and content sections needed for SEO
- avoid breaking calculator logic
- keep CLS low
- keep the render path efficient
- avoid heavy presentation-only JavaScript

---

## 10. SEO Requirements

The redesign must:

- preserve H1, title, meta, schema, and core content structure
- improve visible content presentation, not just raw text styling
- maintain snippet-friendly intros
- ensure internal linking between related credit card calculators is strong
- keep FAQ visible if FAQ schema is present

SEO intent:

- improve SERP presentation quality
- improve perceived authority and trust
- strengthen cluster-level internal linking

---

## 11. Accessibility Requirements

The redesign must include:

- strong contrast on light backgrounds
- keyboard-friendly forms
- visible focus states
- accessible labels
- good mobile readability
- no tiny text
- no low-contrast gray-on-gray UI

---

## 12. Delivery Strategy

This work should be executed in two phases.

### 12.1 Phase 1

Create the cluster design foundation:

- cluster design system
- color palette
- typography scale
- spacing system
- component rules
- one sample redesigned page

### 12.2 Phase 2

Apply the approved system consistently across the entire Credit Card Calculators cluster.

Requirements for rollout:

- reuse the same design tokens
- reuse the same layout rhythm
- reuse the same component styling
- keep each page consistent while adapting to the calculator-specific content
- preserve SEO sections and calculator logic
- improve internal linking among credit card calculators
- remove dark-theme styling from this cluster
- ensure all pages feel like one premium product family

---

## 13. Required Deliverables

Produce the following:

1. A cluster-level redesign plan
2. A reusable design system or token set for the cluster
3. A CSS refactor strategy
4. The first fully redesigned calculator page as the reference implementation
5. A consistent rollout across the remaining credit card calculator pages
6. An exact list of changed files
7. A short explanation of why each major design change improves UX and SEO

Recommended artifacts:

- `CREDIT_CARD_CLUSTER_DESIGN_SYSTEM.md`
- `CREDIT_CARD_CLUSTER_REDESIGN_PLAN.md`
- updated shared cluster CSS or design tokens
- one reference page implementation

---

## 14. Output Standard

When executing this redesign:

- be decisive
- think like a premium product designer and front-end system engineer
- avoid generic advice
- make concrete, production-quality changes
- prioritize elegance, clarity, and consistency

---

## 15. Appendix: Reusable Prompt Framing

If this brief is later converted into task prompts, use a phased approach rather than one oversized instruction block.

Preferred sequence:

- Phase 1: design system and reference page
- Phase 2: cluster-wide rollout

Compact prompt framing:

Redesign the entire Credit Card Calculators cluster into a premium light-theme system. Do not just restyle colors. Redesign hierarchy, spacing, typography, form structure, results presentation, and section rhythm so the pages feel genuinely premium and substantially improved while preserving calculator logic, SEO, accessibility, and performance.
