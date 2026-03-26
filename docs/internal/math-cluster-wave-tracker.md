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
| 3 | Algebra suite | 5 | active | slope-distance | Codex | `quadratic-equation` is redesign-complete. Historical releases for the remaining algebra routes still do not count as redesign proof. |
| 4 | Trigonometry suite | 5 | planned | none | Codex | Mixed legacy single and split routes |
| 5 | Log cluster | 5 | planned | none | Codex | Similar route family, should stay visually consistent |
| 6 | Calculus suite | 5 | planned | none | Codex | Expression-heavy layouts and dense outputs |
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
| 3 | `/math/algebra/slope-distance/` | `slope-distance` | `legacy-shared` | `legacy-single-dark` | `type-2` | `not-audited` | `in-progress` | `release-passed-only` | `pending` | `pending` | `pending` | `pending` | `Codex` | historical release only | Active algebra route. Re-audit generated output because prior release evidence does not count as redesign proof. |
| 3 | `/math/algebra/factoring/` | `factoring` | `legacy-shared` | `legacy-single-dark` | `type-2` | `not-audited` | `planned` | `release-passed-only` | `pending` | `pending` | `pending` | `pending` | `Codex` | historical release only | Prior release evidence exists, but no redesign proof. |
| 3 | `/math/algebra/polynomial-operations/` | `polynomial-operations` | `legacy-shared` | `legacy-single-dark` | `type-2` | `not-audited` | `planned` | `release-passed-only` | `pending` | `pending` | `pending` | `pending` | `Codex` | historical release only | Prior release evidence exists, but no redesign proof. |
| 3 | `/math/algebra/system-of-equations/` | `system-of-equations` | `legacy-shared` | `legacy-single-dark` | `type-2` | `not-audited` | `planned` | `release-passed-only` | `pending` | `pending` | `pending` | `pending` | `Codex` | historical release only | Prior release evidence exists, but no redesign proof. |

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

## Update Rules

1. Update the route row first, then the wave row.
2. Do not change the active route until the current route is `redesign-complete`.
3. If a gate fails, set the route to `blocked` or keep it `in-progress`; do not advance the wave.
4. If classification changes to `type-3`, log the reason immediately.
5. Do not delete blocker history; replace it with a short outcome note.
