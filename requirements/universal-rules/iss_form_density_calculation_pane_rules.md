# Calculation Pane Form Density & ISS Rules (Single Source)

> **Canonical source:** This file replaces all previous scattered references. Issued under REQ-20260128-015, it is the single source of truth for calculation-pane form density and ISS-related layout expectations.

## Scope

- Applies to the Calculation Pane on every active calculator (MPA shell pages).
- Does not apply to GTEP pages (sitemap, privacy, terms, contact, faqs).
- Captures the ISS requirements that protect form density, progressive disclosure, and layout stability without duplicating guidance elsewhere.

## Core Principles (UUI-FDP equivalents)

| Rule ID | Principle | Severity |
| ------- | --------- | -------- |
| UUI-FDP-001 | Core inputs must be reachable without mandatory scroll inside the calculation pane. | P0 |
| UUI-FDP-002 | Optional/advanced inputs must never block the primary calculation. | P0 |
| UUI-FDP-003 | Use progressive disclosure when inputs exceed comfortable density (collapsible advanced sections, mode toggles, logical groups). | P0 |
| UUI-FDP-004 | Related inputs may share a row to save vertical space, provided clarity remains (e.g., loan term + rate). | P1 |
| UUI-FDP-005 | Scrolling is allowed only for optional sections; core CTA must be accessible without scroll. | P1 |
| UUI-FDP-006 | Form density must never erode labels, hit targets, or clarity. | P0 |
| UUI-FDP-007 | Interactions (mode switches, toggles) must not change the number of visible rows or push core inputs off-screen. | P0 |

## Requirements

1. **Core Inputs First** – Required fields for the primary result must live above the fold (the first viewport of the calculation pane) without needing optional fields to be interacted with.
2. **Optional Inputs Tucked Away** – Optional or advanced controls must sit inside collapsible sections, secondary rows, or toggled panels that do not interfere with the core flow.
3. **Progressive Disclosure** – When the input set outgrows a single view, use logical grouping, disclosure panels, or mode-specific labels; avoid stacking more than one screen-full of inputs in a single column.
4. **Row Efficiency** – Where semantics permit, combine related controls (term + rate, start + end) so they share a horizontal row while preserving explicit labels.
5. **Layout Stability** – Switching between modes (Amount vs Percent) must not alter row counts, heights, or push the calculation button; animations should not cause layout shifts.
6. **Clarity Preservation** – Every input stays labeled, spacing remains legible, and no unlabeled placeholders replace textual guidance.

## Testing Notes

- This document feeds the ISS-001 layout stability checks for calculators touched under this REQ: `requirements/specs/e2e/iss-design-001.spec.js`.
- When you alter a calculator’s calculation pane, verify compliance via the layout stability suite and confirm review notes reference this file and the relevant UUI-FDP rule IDs.

## Reference

Use this document (not UNIVERSAL_REQUIREMENTS.md) when updating or reviewing calculation-pane form density. Any future clarifications or updates must live here to keep the contract single-sourced.
