# Math Cluster Wave Tracker

Status:

- Updated on `2026-03-26`
- Execution active
- Purpose: serve as the append-only execution ledger for the math migration

Companion docs:

- `requirements/math-migration/MATH_MIGRATION_EXECUTION_CARD.md`
- `docs/internal/math-cluster-redesign-master-plan.md`
- `docs/internal/math-cluster-migration-checklist.md`

## Operating Rules

- The execution card is the highest authority for route execution.
- Re-read the execution card after every `2-3` routes and whenever switching waves.
- Execution is one calculator at a time.
- Do not move to the next route until the current route is fully `redesign-complete`.
- Once the current route is fully `redesign-complete`, advance directly to the next approved route without waiting for another HUMAN approval.
- Stop only for a failed gate, scope-breaking conflict, or a reclassification event that forces `type-3`.
- `releaseStatus` and `migrationStatus` are separate facts.

## Exact Status Taxonomy

- `ownerState`: `legacy-shared` | `cluster-owned:math`
- `layoutState`: `legacy-single-dark` | `legacy-split-dark` | `redesign-complete`
- `migrationType`: `type-1` | `type-2` | `type-3`
- `auditStatus`: `not-audited` | `audited`
- `migrationStatus`: `planned` | `scope-approved` | `in-progress` | `blocked` | `qa-review` | `redesign-complete`
- `releaseStatus`: `not-run` | `release-passed-only` | `admin-approved`
- `engineeringGate`: `pending` | `pass` | `fail`
- `designGate`: `pending` | `pass` | `fail`
- `seoGate`: `pending` | `pass` | `fail`
- `cwvGate`: `pending` | `pass` | `fail`
- `waveStatus`: `planned` | `active` | `blocked` | `qa-review` | `passed` | `admin-approved` | `failed`

## Wave Summary

| Wave | Name | Routes | Status | Active Route | Owner | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0A | Math cluster baseline | 0 | active | none | Codex | Create math cluster governance baseline and scaffolding |
| 0B | Route audit lock | 36 | active | none | Codex | Confirm generated shell state and classification for all routes |
| 1 | Pilot | 3 | passed | none | Codex | `basic`, `fraction-calculator`, and `sample-size` are redesign-complete. Pilot shell, schema, and auto-continuation rules are now stable. |
| 2 | Stabilize | 0 | passed | none | Codex | Pilot findings were folded back into the execution card, checklist, and tracker before scale-out. |
| 3 | Algebra suite | 5 | passed | none | Codex | `quadratic-equation`, `slope-distance`, `factoring`, `polynomial-operations`, and `system-of-equations` are redesign-complete. Wave 3 exit gates are complete. |
| 4 | Trigonometry suite | 5 | passed | none | Codex | `unit-circle`, `triangle-solver`, `trig-functions`, `inverse-trig`, and `law-of-sines-cosines` are redesign-complete. Wave 4 exit gates are complete. |
| 5 | Log cluster | 5 | passed | none | Codex | `natural-log`, `common-log`, `log-properties`, `exponential-equations`, and `log-scale` are redesign-complete. Wave 5 exit gates are complete. |
| 6 | Calculus suite | 5 | active | critical-points | Codex | Expression-heavy layouts and dense outputs |
| 7 | Statistics core | 4 | planned | none | Codex | Multi-output routes with stronger content demands |
| 8 | Counting and probability | 3 | planned | none | Codex | Smaller but mixed interaction models |
| 9 | Statistics advanced | 3 | planned | none | Codex | Chart and interpretation-heavy routes |
| 10 | Final advanced statistics | 3 | planned | none | Codex | Highest reconstruction risk routes |

## Route Ledger

| Wave | Route | calculatorId | ownerState | layoutState | migrationType | auditStatus | migrationStatus | releaseStatus | engineeringGate | designGate | seoGate | cwvGate | Owner | Blockers | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `/math/basic/` | `basic` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `not-run` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | New math light shell shipped in generated output. Static schema, FAQ, internal links, and scoped validations passed. |
| 1 | `/math/fraction-calculator/` | `fraction-calculator` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `not-run` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static FAQ extraction, answer-first layout, internal links, and scoped validations passed. |
| 1 | `/math/sample-size/` | `sample-size` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `not-run` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Existing study logic was preserved while static schema, related links, and scoped validations were brought up to redesign-complete state. |
| 3 | `/math/algebra/quadratic-equation/` | `quadratic-equation` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, related links, formula notes, and scoped validations now satisfy the redesign definition. |
| 3 | `/math/algebra/slope-distance/` | `slope-distance` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, line-form detail panels, internal links, and scoped validations now satisfy the redesign definition. |
| 3 | `/math/algebra/factoring/` | `factoring` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, collapsed advanced options, related links, and scoped validations now satisfy the redesign definition. |
| 3 | `/math/algebra/polynomial-operations/` | `polynomial-operations` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, operation-mode hierarchy, related links, and scoped validations now satisfy the redesign definition. |
| 3 | `/math/algebra/system-of-equations/` | `system-of-equations` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, system-size hierarchy, related links, and scoped validations now satisfy the redesign definition. |
| 4 | `/math/trigonometry/unit-circle/` | `unit-circle` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, interactive circle diagram, related links, and scoped validations now satisfy the redesign definition. |
| 4 | `/math/trigonometry/triangle-solver/` | `triangle-solver` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, diagram contract, formula notes, and scoped validations now satisfy the redesign definition. |
| 4 | `/math/trigonometry/trig-functions/` | `trig-functions` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, graph contract, exact-value notes, and scoped validations now satisfy the redesign definition. |
| 4 | `/math/trigonometry/inverse-trig/` | `inverse-trig` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, inverse-solution hierarchy, related links, and scoped validations now satisfy the redesign definition. |
| 4 | `/math/trigonometry/law-of-sines-cosines/` | `law-of-sines-cosines` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, triangle-law hierarchy, diagram contract, and scoped validations now satisfy the redesign definition. |
| 5 | `/math/log/natural-log/` | `natural-log` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, graph contract, ln hierarchy, and scoped validations now satisfy the redesign definition. |
| 5 | `/math/log/common-log/` | `common-log` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, selected-base graph contract, change-of-base hierarchy, and scoped validations now satisfy the redesign definition. |
| 5 | `/math/log/log-properties/` | `log-properties` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, rule-explorer hierarchy, and scoped validations now satisfy the redesign definition. |
| 5 | `/math/log/exponential-equations/` | `exponential-equations` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, solve-flow hierarchy, graph checkpoint contract, and scoped validations now satisfy the redesign definition. |
| 5 | `/math/log/log-scale/` | `log-scale` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | none | Light math shell shipped in generated output. Static schema, interpretation guide hierarchy, and scoped validations now satisfy the redesign definition. |
| 6 | `/math/calculus/derivative/` | `derivative` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | parser defect resolved | Light math shell shipped in generated output. Static schema, derivative-step hierarchy, and scoped validations now satisfy the redesign definition. |
| 6 | `/math/calculus/integral/` | `integral` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | parser defect resolved | Light math shell shipped in generated output. Static schema, integration-mode hierarchy, and scoped validations now satisfy the redesign definition. |
| 6 | `/math/calculus/limit/` | `limit` | `cluster-owned:math` | `redesign-complete` | `type-2` | `audited` | `redesign-complete` | `release-passed-only` | `pass` | `pass` | `pass` | `pass` | `Codex` | variable binding defect resolved | Light math shell shipped in generated output. Static schema, direction-analysis hierarchy, and scoped validations now satisfy the redesign definition. |

## Route Audit Template

```md
### Route Audit — <calculatorId>
- Route:
- Layout: split | single
- Legacy markers:
- Design issues:
- SEO issues:
- Logic risk:
- Type: 1 | 2 | 3
- Notes:
```

## Wave Checklist Template

```md
## Wave <N> — <Wave Name>
- Routes:
- Approved scope:
- Migration done:
- Engineering pass:
- Design pass:
- SEO pass:
- CWV pass:
- Evidence:
- Status:
```

## Route Audit Log

### Route Audit — fraction-calculator
- Route: `/math/fraction-calculator/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: old route placed the answer behind the step card, duplicated teaching chrome, and depended on legacy shell spacing
- SEO issues: explanation lacked snippet structure, quick-answer table, related links, and extractable FAQ cards for static schema
- Logic risk: low; migration preserved existing calculator IDs, mode selectors, and arithmetic module behavior
- Type: `2`
- Notes: migrated to the light math cluster shell, moved the answer card to the primary position, collapsed advanced notes, and restored static `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` output in generated HTML

### Route Audit — sample-size
- Route: `/math/sample-size/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: strong calculator workflow already existed, but it was wrapped in a dark-shell presentation and relied on legacy shell spacing
- SEO issues: generated proof used legacy shell metadata, FAQ cards were not extractable for math-cluster schema generation, and related internal links were missing
- Logic risk: low; migration preserved the existing study engine, presets, IDs, and interactive state model
- Type: `2`
- Notes: migrated to the light math cluster shell, kept the answer-first study planner intact, removed body-level schema injection, added related calculators, and restored static generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` output

### Route Audit — quadratic-equation
- Route: `/math/algebra/quadratic-equation/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route placed the answer in a dark preview card with thin explanatory content and old shell dependencies
- SEO issues: explanation lacked quick-answer structure, formula notes, worked examples, and related internal links; source fragment also carried body-level FAQ JSON-LD
- Logic risk: low; migration preserved the existing coefficient inputs, solve trigger, equation display, snapshot targets, and algebra-core solving logic
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the algebra route as an answer-first layout, removed body-level schema injection, added static explanation structure and internal links, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — slope-distance
- Route: `/math/algebra/slope-distance/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route relied on the legacy dark algebra preview layout, pushed the answer behind old shell chrome, and did not prioritize first-screen geometry results
- SEO issues: explanation was thin, lacked a quick-answer structure, formula notes, worked examples, related internal links, and a March 2026 notes contract
- Logic risk: low; migration preserved the existing coordinate inputs, calculate trigger, snapshot targets, result containers, and algebra-core slope-distance logic
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the route as an answer-first coordinate-geometry layout, preserved line-equation output hooks, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — factoring
- Route: `/math/algebra/factoring/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route used the dark algebra preview layout, exposed too many method controls on first screen, and buried the answer beneath legacy shell chrome
- SEO issues: explanation was thin, lacked quick-answer structure, worked examples, related links, and an updated notes contract; source fragment also carried body-level FAQ JSON-LD
- Logic risk: low; migration preserved the polynomial input, method checkboxes, calculate trigger, snapshot targets, result containers, and factoring engine order
- Type: `2`
- Notes: migrated to the light math cluster shell, collapsed advanced method toggles, rebuilt the answer-first factoring layout, removed body-level schema injection, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — polynomial-operations
- Route: `/math/algebra/polynomial-operations/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route used the old algebra preview shell, lacked a clear answer-first hierarchy, and kept operation controls visually flat against the dark layout
- SEO issues: explanation was thin, lacked quick-answer structure, worked examples, related links, and an updated notes contract; source fragment also carried body-level FAQ JSON-LD
- Logic risk: low; migration preserved the operation button group, input IDs, calculate trigger, snapshot targets, and the add/subtract/multiply/divide engine behavior
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the operation selector into a first-screen control bar, removed body-level schema injection, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — system-of-equations
- Route: `/math/algebra/system-of-equations/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route used the old algebra preview shell, buried the answer under legacy chrome, and treated the 2x2/3x3 workflow as a dark settings panel instead of an answer-first solver
- SEO issues: explanation was thin, lacked quick-answer structure, worked examples, related links, and an updated notes contract; source fragment also carried body-level FAQ JSON-LD
- Logic risk: low; migration preserved the system-size and solution-method button groups, coefficient input IDs, solve trigger, snapshot targets, and solver engine outputs
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the system solver as an answer-first route, removed body-level schema injection, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — unit-circle
- Route: `/math/trigonometry/unit-circle/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route sat inside the legacy dark shell, hid the diagram contract, and had no clear answer-first hierarchy between angle input, diagram, and trig outputs
- SEO issues: explanation lacked a real snippet intro, quick-answer structure, FAQs, related links, and notes contract; route metadata also depended on stale runtime injection instead of generated static proof
- Logic risk: low; migration preserved the angle input, unit button group, result containers, diagram canvas IDs, legend ID, and shared trigonometry-core calculations
- Type: `2`
- Notes: migrated to the light math cluster shell, restored the interactive diagram contract, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — triangle-solver
- Route: `/math/trigonometry/triangle-solver/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route buried the solver in the legacy shell, shipped no usable diagram card on first screen, and had no answer-first hierarchy between inputs, solutions, and method notes
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, formula coverage, FAQs, related links, and notes contract; route metadata also depended on generic legacy output rather than generated static proof
- Logic risk: low; migration preserved the triangle type selector, angle-unit button group, input IDs, solve trigger, result containers, diagram canvas ID, and shared trigonometry-core solver behavior
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the answer-first triangle workflow with a stable diagram card, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — trig-functions
- Route: `/math/trigonometry/trig-functions/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route buried the six trig outputs inside the legacy shell, lacked a real answer-first relationship between inputs and graph, and failed to render the graph canvas contract in the source fragment
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, formula coverage, FAQs, related links, and notes contract; route metadata also depended on stale runtime injection rather than generated static proof
- Logic risk: low; migration preserved the angle input, angle-unit button group, graph-function select, amplitude and period IDs, calculate trigger, result containers, graph canvas ID, and shared trigonometry-core calculations
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the answer-first trig workflow with a stable graph card, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — inverse-trig
- Route: `/math/trigonometry/inverse-trig/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route depended on the legacy shell, mixed interval controls and answer details into one dark stack, and did not give the principal value or interval solutions a clear first-screen hierarchy
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, formula coverage, FAQs, related links, and notes contract; route metadata also depended on stale runtime injection rather than generated static proof
- Logic risk: low; migration preserved the inverse-function select, interval inputs, output-unit button group, calculate trigger, snapshot IDs, and shared trigonometry-core solution engine
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the route around the principal-value answer card and interval solution list, removed runtime metadata injection, aligned the scoped E2E with the stable decimal-radian rendering contract, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — law-of-sines-cosines
- Route: `/math/trigonometry/law-of-sines-cosines/`
- Layout: split
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, legacy left nav, and split-shell chrome; all removed in redesign output
- Design issues: previous route buried the triangle-law workflow in the legacy split shell, lacked a first-screen answer hierarchy, and referenced a triangle canvas ID that the source fragment did not actually render
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, worked examples, FAQs, related links, and notes contract; route metadata also depended on runtime injection rather than generated static proof
- Logic risk: low; migration preserved the method select, angle-unit button group, side and angle input IDs, solve trigger, result containers, diagram IDs, and the shared trigonometry-core solving logic
- Type: `2`
- Notes: migrated to the light math cluster shell, converted the route from split to single-pane output, restored the missing diagram canvas contract, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — natural-log
- Route: `/math/log/natural-log/`
- Layout: split
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, legacy left nav, and split-shell chrome; all removed in redesign output
- Design issues: previous route buried the ln result in the legacy split shell, lacked a first-screen answer and graph hierarchy, and promised visualization without rendering a dedicated answer-first graph workflow
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, worked examples, FAQs, related links, and notes contract; route metadata also depended on runtime injection rather than generated static proof
- Logic risk: low; migration preserved the ln input ID, precision selector, calculate trigger, result containers, and shared logarithm-core calculation logic
- Type: `2`
- Notes: migrated to the light math cluster shell, converted the route from split to single-pane output, added the graph card and snapshot contract around the existing ln logic, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — common-log
- Route: `/math/log/common-log/`
- Layout: split
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, legacy left nav, and split-shell chrome; all removed in redesign output
- Design issues: previous route buried the selected-base result in the legacy split shell, lacked a first-screen graph and answer hierarchy, and treated custom-base comparison as a flat form instead of an answer-first workflow
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, worked examples, FAQs, related links, and notes contract; route metadata also depended on runtime injection rather than generated static proof
- Logic risk: low; migration preserved the argument ID, base selector, custom-base row and input IDs, calculate trigger, result containers, and shared logarithm-core calculation logic
- Type: `2`
- Notes: migrated to the light math cluster shell, converted the route from split to single-pane output, added the selected-base graph and snapshot contract around the existing log logic, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — log-properties
- Route: `/math/log/log-properties/`
- Layout: split
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, legacy left nav, and split-shell chrome; all removed in redesign output
- Design issues: previous route buried the three rule checks in the legacy split shell, lacked a first-screen answer hierarchy, and did not keep the symbolic identities visible beside the numeric outputs
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, worked examples, FAQs, related links, and notes contract; route metadata also depended on runtime injection rather than generated static proof
- Logic risk: low; migration preserved the base input ID, product, quotient, and power rule input IDs, calculate trigger, result containers, and shared logarithm-core rule logic
- Type: `2`
- Notes: migrated to the light math cluster shell, converted the route from split to single-pane output, rebuilt it as an answer-first rule explorer, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — exponential-equations
- Route: `/math/log/exponential-equations/`
- Layout: split
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, legacy left nav, and split-shell chrome; all removed in redesign output
- Design issues: previous route buried the solved x value inside the legacy split shell, lacked a first-screen graph and answer hierarchy, and did not keep the logarithmic rearrangement close to the result
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, worked examples, FAQs, related links, and notes contract; route metadata also depended on runtime injection rather than generated static proof
- Logic risk: low; migration preserved the base, target, multiplier, and shift input IDs, solve trigger, result containers, and shared logarithm-core solve logic
- Type: `2`
- Notes: migrated to the light math cluster shell, converted the route from split to single-pane output, rebuilt it as an answer-first exponential-equation solver, added the graph checkpoint contract around the existing solve logic, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — log-scale
- Route: `/math/log/log-scale/`
- Layout: split
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, legacy left nav, and split-shell chrome; all removed in redesign output
- Design issues: previous route buried the scale conversion inside the legacy split shell, lacked a first-screen answer hierarchy, and treated the three modes as a flat form with no interpretation guidance
- SEO issues: explanation was thin, lacked a snippet intro, quick-answer structure, worked examples, FAQs, related links, and notes contract; route metadata also depended on runtime injection rather than generated static proof
- Logic risk: low; migration preserved the scale selector, all input IDs, convert trigger, result containers, and shared logarithm-core conversion logic
- Type: `2`
- Notes: migrated to the light math cluster shell, converted the route from split to single-pane output, rebuilt it as an answer-first scale converter with an interpretation guide, removed runtime metadata injection, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — derivative
- Route: `/math/calculus/derivative/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route stacked inputs, output, and steps in a generic shell with no answer-first hierarchy and no clear boundary between symbolic result and walkthrough
- SEO issues: explanation was broad but not structured to the migration contract; it lacked a snippet intro, quick-answer table, visible FAQ card grid, related calculators, and notes contract aligned to static schema output
- Logic risk: medium; the route preserved all existing input IDs and the polynomial differentiation flow, but the original term parser contained a zero-length regex defect that could exhaust memory instead of terminating
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the route around an answer card plus dedicated steps card, moved the pure differentiation logic into a route-local helper for stable unit coverage, fixed the parser termination defect, removed inline bootstrap assumptions, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — integral
- Route: `/math/calculus/integral/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route stacked mode controls, output, and steps in a generic shell with no answer-first hierarchy and no clear boundary between antiderivative and definite-value modes
- SEO issues: explanation was broad but not structured to the migration contract; it lacked a snippet intro, quick-answer table, visible FAQ card grid, related calculators, and notes contract aligned to static schema output
- Logic risk: medium; the route preserved all existing input IDs and the indefinite/definite integration flow, but the original term parser contained the same zero-length regex defect that could exhaust memory instead of terminating
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the route around an answer card plus dedicated steps card, moved the pure integration logic into a route-local helper for stable unit coverage, fixed the parser termination defect, removed inline bootstrap assumptions, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

### Route Audit — limit
- Route: `/math/calculus/limit/`
- Layout: single
- Legacy markers: generated output previously shipped `theme-premium-dark.css`, legacy top nav, and legacy left nav; all removed in redesign output
- Design issues: previous route stacked direction controls, output, and step text in a generic shell with no answer-first hierarchy and no stable summary of whether the limit existed
- SEO issues: explanation was broad but not structured to the migration contract; it lacked a snippet intro, quick-answer table, visible FAQ card grid, related calculators, and notes contract aligned to static schema output
- Logic risk: medium; the route preserved all existing input IDs and the direct/one-sided/infinity limit flow, but the evaluator incorrectly hardcoded `x` instead of honoring the selected variable field
- Type: `2`
- Notes: migrated to the light math cluster shell, rebuilt the route around an answer card plus dedicated analysis card, moved the pure limit logic into a route-local helper for stable unit coverage, fixed the variable-binding defect, removed inline bootstrap assumptions, replaced placeholder tests, and restored generated `WebPage`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` proof

## Update Rules

1. Update the route row first, then the wave row.
2. Do not change the active route until the current route is `redesign-complete`.
3. If a gate fails, set the route to `blocked` or keep it `in-progress`; do not advance the wave.
4. If classification changes to `type-3`, log the reason immediately.
5. Do not delete blocker history; replace it with a short outcome note.
