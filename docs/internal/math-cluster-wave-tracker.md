# Math Cluster Wave Tracker

Status:

- Drafted on `2026-03-25`
- Scope approved for planning only
- Purpose: track route-by-route migration status for all legacy math calculators

This tracker is the execution ledger that sits beside the master plan and migration checklist.

Companion docs:

- `docs/internal/math-cluster-redesign-master-plan.md`
- `docs/internal/math-cluster-migration-checklist.md`

---

## Status Legend

- `not-started`: no route work has begun
- `planned`: route is assigned to a wave and ready for scoped execution
- `in-progress`: active route work is underway
- `blocked`: route has a known blocker that must be resolved or explicitly escalated
- `qa-review`: build work is complete and route is awaiting validation review
- `passed`: route migration and scoped validation are complete
- `admin-approved`: route is complete with an approved governance/tooling exception

## Owner Convention

Until work is assigned, use `Unassigned`.

When implementation begins, replace the owner field with the responsible person or team handle for that route.

## Classification Legend

- `Type 1`: straight shell migration
- `Type 2`: shell migration plus content/test cleanup
- `Type 3`: reconstruction route

All current classifications below are provisional and should be confirmed during pre-flight.

---

## Wave Summary

| Wave | Domain | Route Count | Status | Owner | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | Shared baseline and route classification | 36 | planned | Unassigned | Audit generated shell markers and classify every math route before execution |
| 1 | Simple foundation routes | 2 | planned | Unassigned | Replace legacy dark shell on the smallest math subset first |
| 2 | Algebra suite | 5 | planned | Unassigned | Existing algebra routes are single-pane legacy, not redesign-complete |
| 3 | Trigonometry suite | 5 | planned | Unassigned | Mix of single-pane legacy and split legacy routes in one domain wave |
| 4 | Calculus suite | 5 | planned | Unassigned | Settle expression-entry and result-detail patterns in one pass |
| 5 | Log cluster | 5 | planned | Unassigned | Keep similar routes visually and editorially consistent |
| 6 | Statistics core | 6 | planned | Unassigned | Includes `sample-size`, which is also still legacy dark-shell |
| 7 | Counting and probability | 3 | planned | Unassigned | Mixed interaction models, smaller wave |
| 8 | Advanced statistics | 5 | planned | Unassigned | Highest complexity tables, graphs, and interpretation load |

---

## Route Tracker

| Wave | Calculator ID | Route | Current Legacy State | Provisional Classification | Status | Owner | Priority | Blockers | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | basic | `/math/basic/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Already single-pane in config but still loads dark shell and legacy nav chrome |
| 1 | fraction-calculator | `/math/fraction-calculator/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Verify whether the route is a simple shell swap or needs CSS cleanup due to heavy inline styling |
| 2 | quadratic-equation | `/math/algebra/quadratic-equation/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Prior release status does not equal redesign completion; preserve algebra runtime fixes while replacing shell |
| 2 | system-of-equations | `/math/algebra/system-of-equations/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Preserve multi-result output clarity while removing legacy shell chrome |
| 2 | polynomial-operations | `/math/algebra/polynomial-operations/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Multiple answer sections may need stronger summary hierarchy |
| 2 | factoring | `/math/algebra/factoring/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Keep factoring modes clear without reverting to dense legacy layout |
| 2 | slope-distance | `/math/algebra/slope-distance/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Coordinate and slope outputs need concise visual grouping |
| 3 | unit-circle | `/math/trigonometry/unit-circle/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Already single-pane, but generated page still uses dark theme and legacy nav |
| 3 | triangle-solver | `/math/trigonometry/triangle-solver/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Preserve triangle-entry usability while replacing shell |
| 3 | trig-functions | `/math/trigonometry/trig-functions/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Function-heavy route; verify graph and value-display bindings before layout moves |
| 3 | inverse-trig | `/math/trigonometry/inverse-trig/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Keep inverse-function inputs/results concise and mobile-readable |
| 3 | law-of-sines-cosines | `/math/trigonometry/law-of-sines-cosines/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Triangle data entry and worked explanation need clean hierarchy |
| 4 | derivative | `/math/calculus/derivative/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Expression entry must stay readable; avoid crowding symbolic result detail |
| 4 | integral | `/math/calculus/integral/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Check definite/indefinite result presentation before final shell decisions |
| 4 | limit | `/math/calculus/limit/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Needs concise explanation and strong result-state handling |
| 4 | series-convergence | `/math/calculus/series-convergence/` | split legacy dark | Type 3 | planned | Unassigned | Medium | None logged yet | Likely reconstruction candidate because advanced result interpretation may exceed simple shell swap |
| 4 | critical-points | `/math/calculus/critical-points/` | split legacy dark | Type 2 | planned | Unassigned | Medium | None logged yet | Multiple result states may require careful answer/support split |
| 5 | natural-log | `/math/log/natural-log/` | split legacy dark | Type 1 | planned | Unassigned | Medium | None logged yet | Good candidate to establish log-cluster baseline styling |
| 5 | common-log | `/math/log/common-log/` | split legacy dark | Type 1 | planned | Unassigned | Medium | None logged yet | Keep parity with natural-log once baseline is set |
| 5 | log-properties | `/math/log/log-properties/` | split legacy dark | Type 2 | planned | Unassigned | Medium | None logged yet | Explanation quality likely needs more attention than shell work alone |
| 5 | exponential-equations | `/math/log/exponential-equations/` | split legacy dark | Type 2 | planned | Unassigned | Medium | None logged yet | Solver flow may need stronger answer-state hierarchy |
| 5 | log-scale | `/math/log/log-scale/` | split legacy dark | Type 2 | planned | Unassigned | Medium | None logged yet | Domain examples must stay specific and not drift into generic science copy |
| 6 | mean-median-mode-range | `/math/mean-median-mode-range/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Multi-output summary route; answer grouping matters |
| 6 | standard-deviation | `/math/standard-deviation/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Input parsing and sample/population explanation need tight writing |
| 6 | statistics | `/math/statistics/` | split legacy dark | Type 3 | planned | Unassigned | High | None logged yet | Broad calculator; likely needs route reconstruction or more deliberate information architecture |
| 6 | confidence-interval | `/math/confidence-interval/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Preserve statistical assumptions and note clarity |
| 6 | z-score | `/math/z-score/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Keep formula, interpretation, and result state readable together |
| 6 | sample-size | `/math/sample-size/` | single-pane legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Single-pane in config, but still ships dark shell and legacy navigation |
| 7 | number-sequence | `/math/number-sequence/` | split legacy dark | Type 2 | planned | Unassigned | Medium | None logged yet | Sequence pattern explanation should stay concrete and non-bloated |
| 7 | permutation-combination | `/math/permutation-combination/` | split legacy dark | Type 2 | planned | Unassigned | Medium | None logged yet | Distinguishing modes clearly is more important than decorative UI |
| 7 | probability | `/math/probability/` | split legacy dark | Type 2 | planned | Unassigned | Medium | None logged yet | Input mode clarity and outcome summaries will be key |
| 8 | regression-analysis | `/math/statistics/regression-analysis/` | split legacy dark | Type 3 | planned | Unassigned | High | None logged yet | Chart/table outputs likely require route-specific reconstruction decisions |
| 8 | anova | `/math/statistics/anova/` | split legacy dark | Type 3 | planned | Unassigned | High | None logged yet | Complex grouped outputs and interpretation content raise reconstruction risk |
| 8 | hypothesis-testing | `/math/statistics/hypothesis-testing/` | split legacy dark | Type 3 | planned | Unassigned | High | None logged yet | Multiple test modes and statistical interpretation increase layout and writing complexity |
| 8 | correlation | `/math/statistics/correlation/` | split legacy dark | Type 2 | planned | Unassigned | High | None logged yet | Scatter/result interpretation needs clear hierarchy |
| 8 | distribution | `/math/statistics/distribution/` | split legacy dark | Type 3 | planned | Unassigned | High | None logged yet | Multi-distribution UI likely needs stronger route-specific planning |

---

## Wave Ownership And Update Rules

1. Every route must have exactly one current status.
2. Every active route must have an owner before implementation begins.
3. When a route changes status, update the route row first, then the wave summary row if needed.
4. Do not delete historical blocker notes; replace resolved blockers with short outcome text.
5. If a route shifts classification from `Type 1` or `Type 2` to `Type 3`, log the reason in the notes column immediately.
6. If a wave needs shared-file changes, note that in the wave summary before execution starts.

---

## Suggested Update Pattern During Execution

Use this sequence whenever a route wave starts:

1. Set owner.
2. Confirm classification.
3. Move status from `planned` to `in-progress`.
4. Add blockers or `None`.
5. After scoped validation, move route to `qa-review` or `passed`.
6. When all route rows in a wave are complete, update the wave summary status.

---

## First Recommended Population Pass

Before implementation starts, fill these fields first for Wave 1 through Wave 4:

1. owner
2. confirmed classification
3. confirmed blockers
4. route-specific notes on module risk

That will reduce avoidable surprises before entering the heavier log and statistics waves.
