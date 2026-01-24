# FOOTER-002 — Footer Links Flush to Bottom Bar

## Summary
Footer links must sit flush near the bottom task bar with minimal padding. Remove any extra bottom gap while preserving the compact footer style.

## Scope
- All pages using the shared footer layout.
- Footer link container and its immediate wrapper in the page shell.

## Motivation
The footer currently sits too high, leaving a visible gap above the bottom task bar. This wastes space and breaks the compact layout intent.

## Requirements
1. Footer link row sits visually flush near the bottom task bar.
2. Remove extra bottom gap while keeping minimal padding.
3. Maintain existing link style: small text and underline (see universal rule `UI-3.5`).
4. Must not change overall shell height or introduce page-level scrolling (see `UI-3.1`, `UI-3.2`).

## Acceptance Criteria
- Footer links appear close to the bottom task bar with no obvious empty gap below.
- Padding remains minimal and consistent with compact footer styling.
- No regressions to fixed-height layout or internal scrolling behavior.

## Non-Goals
- Changing footer content or link destinations.
- Adding new footer sections or visual containers.
