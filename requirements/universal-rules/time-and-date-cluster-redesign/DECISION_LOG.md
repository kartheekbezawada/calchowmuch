# Time & Date Cluster Decision Log

## D-001

Decision:

- The Time & Date cluster will use a dedicated light shell instead of the legacy shared shell.

Reason:

- The current dark three-column shell delays the task and competes with the calculator.

Impact:

- Migrated routes will not render top nav, left nav, or ads column.

## D-002

Decision:

- Age Calculator is the baseline route for the cluster redesign.

Reason:

- It already has a strong answer-first structure, enough complexity to pressure-test the template, and fewer special-case interactions than Countdown or the sleep routes.

Impact:

- Shared shell and result hierarchy decisions should be proven there first.

## D-003

Decision:

- The cluster will use one shared system with subgroup tone shifts instead of route-by-route visual reinvention.

Reason:

- The cluster must feel coherent while still letting sleep, work, planning, and milestone calculators express different moods.

Impact:

- Shared spacing, shell rhythm, and component patterns are mandatory; route accents may vary by subgroup.

## D-004

Decision:

- Route source fragments must stop depending on inline `@import` CSS delivery.

Reason:

- The cluster migration should align with the repo's CSS loading rules and avoid legacy shell-era delivery patterns.

Impact:

- Shared cluster CSS and route CSS will be loaded through the Time & Date cluster generation branch.

## D-005

Decision:

- Related-calculator discoverability will move from persistent left navigation into compact in-flow route navigation.

Reason:

- The cluster still needs discoverability after removing the shell, but persistent chrome is not acceptable on migrated routes.

Impact:

- The cluster shell should expose route relationships without restoring the old navigation pattern.