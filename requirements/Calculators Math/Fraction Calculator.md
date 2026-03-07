# Fraction Calculator

## 1. Purpose
Rebuild `/math/fraction-calculator/` as a student-first fraction calculator for high-school learners. The page must teach as well as calculate. It should feel like a teacher is solving the problem with the student, not like a generic utility tool.

## 2. Locked Product Identity
- Calculator ID: `fraction-calculator`
- Public route: `/math/fraction-calculator/`
- Route archetype: `calc_exp`
- Design family: `neutral`
- Pane layout: `single`
- Audience: high-school students
- v1 scope: add, subtract, multiply, divide, simplify, convert

## 3. Product Goals
1. Show a meaningful solved example on first load so the page never feels empty.
2. Explain fraction operations in simple classroom English.
3. Show both the final answer and the worked steps.
4. Make each mode easy to understand even for a student who is unsure what to do next.
5. Ship with strong SERP coverage: title, meta description, canonical, breadcrumb schema, calculator schema, and FAQ schema.

## 4. Core UX Contract
### 4.1 General page behavior
- The page must render as a single-pane `calc_exp` route.
- No split-pane legacy layout is allowed.
- No empty-state graph, table, or answer panel is allowed.
- On first load, the calculator must show:
  - prefilled example inputs
  - a visible result
  - a visible worked-steps panel
  - a visible teacher note
- The interface must feel educational and calm, not financial or dashboard-like.

### 4.2 Mode system
The calculator must include these six modes:
1. Add
2. Subtract
3. Multiply
4. Divide
5. Simplify
6. Convert

Mode switching requirements:
- Use a clear lesson-tab or operation-switch design.
- Active mode must be visually obvious.
- Switching modes must update:
  - visible inputs
  - worked steps
  - teacher note
  - mode-specific explanation summary
- Default mode: `add`

### 4.3 Input design
- Inputs must be grouped so students can clearly see which fraction belongs to which operation.
- Fraction inputs should visually resemble a numerator over denominator structure.
- Labels must use simple language such as `First fraction`, `Second fraction`, `Fraction to simplify`, and `Mixed number`.
- Denominator zero must be blocked with plain-English guidance.
- Negative values must be supported.

### 4.4 Result design
The result area must contain:
- final answer
- simplest form
- mixed-number form when relevant
- worked steps
- teacher note / how to read the answer

The result area must not feel empty or rely on a click to become useful.

## 5. Teaching Logic Contract
### 5.1 Add / Subtract
Must show:
- least common denominator
- equivalent fractions
- numerator combination step
- simplification step

### 5.2 Multiply
Must show:
- numerator multiplied by numerator
- denominator multiplied by denominator
- simplified result
- optional simplification-first message if cancellation is possible

### 5.3 Divide
Must show:
- reciprocal step for the second fraction
- multiplication step after flipping
- simplified result

### 5.4 Simplify
Must show:
- greatest common divisor (GCD)
- divide top and bottom by the GCD
- final simplest form

### 5.5 Convert
Must support both:
- improper fraction to mixed number
- mixed number to improper fraction

Must show:
- quotient and remainder when converting to mixed form
- `(whole x denominator) + numerator` when converting to improper form

## 6. Content Contract
### 6.1 Explanation structure
The explanation block must follow this order:
1. `H2`: `Fraction Calculator Complete Practical Guide`
2. `H4`: `Intent`
3. `H4`: `Complete Practical Guide`
4. FAQ section
5. `Important Notes` final section

Rules:
- Do not add a redundant `How to Guide` heading if the `H2` already carries that role.
- Tone must be simple, teacher-like, and suitable for students.
- Avoid finance-style language and SEO filler.

### 6.2 Explanation content requirements
The explanation must cover:
- what a fraction is
- numerator and denominator meaning
- when to use each mode
- worked examples in simple English
- common mistakes students make
- why simplification matters
- why common denominators matter
- how to read mixed numbers and improper fractions

### 6.3 FAQ requirements
- Show 10 visible FAQ cards.
- FAQ questions must reflect real student intent.
- FAQ schema must match the visible FAQ exactly.

## 7. SEO / SERP Contract
### 7.1 Metadata
- Title: `Fraction Calculator - Add, Subtract, Multiply, Divide & Simplify | CalcHowMuch`
- Meta description: `Use this free fraction calculator to add, subtract, multiply, divide, simplify, and convert fractions with clear worked steps for students.`
- Canonical: `https://calchowmuch.com/math/fraction-calculator/`

### 7.2 Structured data
The generated route must include a single deduplicated JSON-LD payload containing:
- `WebPage`
- `SoftwareApplication`
- `BreadcrumbList`
- `FAQPage`

### 7.3 Breadcrumb contract
Breadcrumb schema must represent:
1. Home
2. Math
3. Fraction Calculator

### 7.4 Visible content parity
- H1, title, canonical intent, and schema naming must agree.
- Visible FAQ count must equal FAQ schema count.

## 8. Visual Design Contract
- The design must feel like a modern classroom workspace.
- Use strong but calm accent colors.
- Avoid loan-calculator cards, KPI panels, graphs, and financial-dashboard metaphors.
- Use clear spacing, readable typography, and consistent alignment.
- Mobile layout must remain readable without sideways clipping.

## 9. Validation Rules
- Denominator cannot be zero.
- Divide mode cannot divide by a zero-value fraction.
- Mixed-number denominator cannot be zero.
- All validation must be written in simple English.

## 10. Acceptance Criteria
The rebuild is complete only if:
1. The route renders as single-pane.
2. All six modes work correctly.
3. Default solved example is visible on first load.
4. Each mode shows mode-specific worked steps.
5. Explanation content is fully rewritten in simple English.
6. Visible FAQ count is 10 and matches FAQ schema.
7. Metadata, canonical, breadcrumb JSON-LD, and FAQ JSON-LD are present and correct.
8. Unit, E2E, SEO, and CWV scoped tests pass.
9. No mojibake or corrupted symbols remain.
