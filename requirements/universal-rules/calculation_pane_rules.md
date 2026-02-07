# ISS-UI-FDP — Calculation Pane Form Density & Progressive Disclosure (Single Source of Truth)

**Canonical Source:** This document is the single source of truth for Calculation Pane form density, progressive disclosure, and layout stability rules. It replaces all scattered references and duplicates.

**Last Updated:** 2026-02-05  
**Version:** 1.0

---

## 0) Scope

**Applies to:** Calculation Pane on all calculator pages (MPA shell pages)  
**Does NOT apply to:** GTEP pages (Sitemap, Privacy, Terms, Contact, FAQs)  
**Goal:** Ensure users can complete the primary calculation quickly on first view, without clutter, confusion, or layout shifts.

---

## 1) Source Requirements Mapping

**Source Requirement IDs (traceability):**
- UUI-FDP-001
- UUI-FDP-002
- UUI-FDP-003
- UUI-FDP-004
- UUI-FDP-005
- UUI-FDP-006
- UUI-FDP-007

---

## 2) Core Principles (UUI-FDP Equivalents)

| Rule ID | Principle | Severity |
| --- | --- | --- |
| UUI-FDP-001 | Core inputs reachable without mandatory scroll inside the Calculation Pane. | P0 |
| UUI-FDP-002 | Optional/advanced inputs must never block the primary calculation. | P0 |
| UUI-FDP-003 | Use progressive disclosure when inputs exceed comfortable density. | P0 |
| UUI-FDP-004 | Related inputs may share a row to reduce vertical depth (without reducing clarity). | P1 |
| UUI-FDP-005 | Scrolling is allowed only for optional sections; core CTA must be accessible without scroll. | P1 |
| UUI-FDP-006 | Density must not erode labels, tap targets, or comprehension. | P0 |
| UUI-FDP-007 | Interactions must not cause layout shifts or alter row structure. | P0 |

---

## 3) Rules (ISS-UI-FDP)

### ISS-UI-FDP-001 — Core Inputs Visibility (P0)
**Rule:**  
All core inputs required to produce the primary result must be accessible without mandatory scrolling inside the Calculation Pane.

**Violation Conditions:**
- User must scroll before reaching the minimum required inputs.
- Required inputs are placed below optional inputs.
- Primary calculation cannot be started from the initial viewport.

**Test Strategy:**
- Identify the calculator’s primary calculate action.
- Identify required inputs for that action.
- Assert all required inputs are present within the initial scroll viewport of the Calculation Pane.

---

### ISS-UI-FDP-002 — Optional Inputs Must Not Block Calculation (P0)
**Rule:**  
Optional or advanced inputs must not prevent a user from calculating the primary result.

**Violation Conditions:**
- Optional inputs placed between required inputs.
- Optional inputs visually interrupt the core calculation flow.
- Calculation cannot proceed unless optional fields are interacted with.

**Test Strategy:**
- Attempt calculation using only required inputs.
- Assert calculation succeeds without touching any optional fields.

---

### ISS-UI-FDP-003 — Progressive Disclosure for Excess Inputs (P0)
**Rule:**  
When the number of inputs exceeds comfortable density, use progressive disclosure instead of linear vertical stacking.

**Allowed Mechanisms:**
- Collapsible “Advanced / Optional” sections
- Mode-based input switching (e.g., Amount vs Percent)
- Logical grouping (cards/sections with headings)

**Violation Conditions:**
- More than one screen-height of inputs stacked without grouping/disclosure.
- Optional inputs permanently expanded without justification.

**Test Strategy:**
- Count visible inputs before calculation.
- If input count exceeds the threshold defined in the calculator spec, assert presence of a disclosure mechanism.

---

### ISS-UI-FDP-004 — Row Efficiency for Related Inputs (P1)
**Rule:**  
Conceptually related inputs may share a row to reduce vertical depth, provided clarity is maintained.

**Examples (Non-exhaustive):**
- Loan Term + Interest Rate
- Down Payment Type + Down Payment Value
- Start Time + End Time

**Violation Conditions:**
- Related inputs are unnecessarily separated into multiple rows causing avoidable scroll.
- Switching modes changes row structure (layout instability).

**Test Strategy:**
- Detect related input pairs defined in the calculator spec.
- Assert they render within the same logical row/container.

---

### ISS-UI-FDP-005 — Scroll Usage Justification (P1)
**Rule:**  
Scrolling inside the Calculation Pane is permitted only when justified.

**Acceptable Causes:**
- Optional / advanced inputs inside disclosure sections
- Extended configuration panels

**Unacceptable Causes:**
- Required inputs hidden below the fold
- Primary CTA unreachable without scroll

**Test Strategy:**
- Assert Calculate button is reachable without scrolling when only core inputs are present.
- Assert scroll is required only after optional sections expand.

---

### ISS-UI-FDP-006 — No Density at the Cost of Clarity (P0)
**Rule:**  
Improving form density must not reduce usability or comprehension.

**Violation Conditions:**
- Labels removed or replaced with placeholders only
- Inputs compressed into ambiguous groupings
- One row contains unrelated controls
- Tap targets become too small for touch use

**Test Strategy:**
- Assert every input has an explicit label.
- Assert row groupings align with calculator spec definitions.
- Spot-check touch target sizing for mobile (minimum ~44px height recommended).

---

### ISS-UI-FDP-007 — Layout Stability Under Interaction (P0)
**Rule:**  
User interactions must not cause layout shifts inside the Calculation Pane.

**Violation Conditions:**
- Switching modes (Amount ↔ Percent) changes row count or pushes inputs vertically.
- Rendering results causes input rows to move.
- Expand/collapse transitions cause measurable layout shift (CLS-like behavior).

**Test Strategy:**
- Capture DOM structure and bounding boxes before/after:
  - mode switch
  - optional section expand/collapse
  - calculation execution
- Assert row structure (count/order) remains stable and core inputs/CTA do not move unexpectedly.

---

### ISS-UI-FDP-008 — Calculator-Specific Compliance Declaration (P1)
**Rule:**  
Each calculator must comply with these rules when modified; no explicit opt-in is required.

**Violation Conditions:**
- Update introduces new scroll requirements for core inputs without justification.
- Layout changes are made without referencing FDP rule IDs in PR notes.

**Test Strategy:**
- Compare pre-change and post-change Calculation Pane height/structure.
- Flag regressions that increase scroll for core inputs or introduce layout instability.

---

## 4) Enforcement Notes (Agent Guardrails)

**Agents MUST NOT:**
- Redesign global UI
- Change breakpoints or spacing tokens
- Apply FDP rules retroactively to untouched calculators

**Agents MAY:**
- Reorder inputs to surface core fields earlier
- Combine related inputs into shared rows
- Add progressive disclosure for optional/advanced inputs

---

## 5) Placement & Wiring (Repo Contract)

**File path (required):**
- `requirements/universal-rules/calculation_pane_rules.md`

**Must be referenced from:**
- `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` → UI & Interaction section (reference only; do not duplicate rules)
- `requirements/universal-rules/TESTING_RULES.md` → UI regression category (Calculation Pane density + progressive disclosure)

---

## 6) Testing Notes

- This document is the canonical input for Calculation Pane UI regression checks (ISS layout stability suite).
- When any calculator’s Calculation Pane is changed:
  1. Run the layout stability suite
  2. Confirm PR notes reference the relevant ISS-UI-FDP rule IDs
  3. Verify no regressions in core-input visibility and CTA accessibility

**Suggested test hook:**
- `requirements/specs/e2e/iss-design-001.spec.js` (or equivalent canonical spec path)

---

## 7) Reference Statement

Use this document (not `UNIVERSAL_REQUIREMENTS.md`) when updating or reviewing Calculation Pane form density. Any future clarifications or updates must be made here to keep the contract single-sourced.
