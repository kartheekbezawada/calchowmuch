
# ISS-UI-FDP — Form Density & Progressive Disclosure Rules

**Source Requirements:**
UUI-FDP-001
UUI-FDP-002
UUI-FDP-003
UUI-FDP-004
UUI-FDP-005
UUI-FDP-006
UUI-FDP-007

**Scope:** Calculation Pane only  
**Applies to:** All calculators  
**Does NOT apply to:** GTEP pages (Sitemap, Privacy, Terms, Contact, FAQs)

---

## ISS-UI-FDP-001 — Core Inputs Visibility (P0)
**Rule:**
All core inputs required to produce the primary result must be accessible without mandatory scrolling inside the Calculation Pane.

**Violation Conditions:**
- A user must scroll before reaching the minimum set of inputs required to calculate.
- Required inputs are placed below optional inputs.

**Test Strategy:**
- Identify the calculator’s “primary calculate” action.
- Identify required inputs for that action.
- Assert that all required inputs are present in the initial scroll viewport of the Calculation Pane.

---

## ISS-UI-FDP-002 — Optional Inputs Must Not Block Calculation (P0)
**Rule:**
Optional or advanced inputs must not prevent a user from calculating the primary result.

**Violation Conditions:**
- Optional inputs are placed between required inputs.
- Optional inputs visually interrupt the core calculation flow.
- Calculation cannot proceed unless optional inputs are interacted with.

**Test Strategy:**
- Attempt calculation using only required inputs.
- Assert calculation succeeds without interaction with optional fields.

---

## ISS-UI-FDP-003 — Progressive Disclosure for Excess Inputs (P0)
**Rule:**
When the number of inputs exceeds comfortable density, progressive disclosure must be used instead of linear vertical stacking.

**Allowed Mechanisms:**
- Collapsible “Advanced / Optional” sections
- Mode-based input switching (e.g., Amount vs Percent)
- Logical grouping

**Violation Conditions:**
- More than one screen-height of inputs stacked without grouping.
- Optional inputs permanently expanded without justification.

**Test Strategy:**
- Count visible inputs before calculation.
- If input count exceeds threshold defined in calculator spec, assert presence of a disclosure mechanism.

---

## ISS-UI-FDP-004 — Row Efficiency for Related Inputs (P1)
**Rule:**
Conceptually related inputs may share a row to reduce vertical depth, provided clarity is maintained.

**Examples (Non-exhaustive):**
- Loan Term + Interest Rate
- Down Payment Type + Down Payment Value
- Start Time + End Time

**Violation Conditions:**
- Related inputs are unnecessarily separated into multiple rows, causing avoidable scroll.
- Switching modes changes row structure (layout instability).

**Test Strategy:**
- Detect related input pairs defined in calculator spec.
- Assert they render within the same logical row/container.

---

## ISS-UI-FDP-005 — Scroll Usage Justification (P1)
**Rule:**
Scrolling inside the Calculation Pane is permitted only when justified.

**Acceptable Causes:**
- Optional / advanced inputs
- Extended configuration sections

**Unacceptable Causes:**
- Required inputs hidden below the fold
- Primary CTA unreachable without scroll

**Test Strategy:**
- Assert Calculate button is reachable without scrolling when only core inputs are present.
- Assert scroll is required only after optional sections expand.

---

## ISS-UI-FDP-006 — No Density at the Cost of Clarity (P0)
**Rule:**
Improving form density must not reduce usability or comprehension.

**Violation Conditions:**
- Labels removed or replaced with placeholders only
- Inputs compressed into ambiguous groupings
- One row contains unrelated controls

**Test Strategy:**
- Assert every input has an explicit label.
- Assert row groupings align with calculator spec definitions.

---

## ISS-UI-FDP-007 — Layout Stability Under Interaction (P0)
**Rule:**
User interactions must not cause layout shifts inside the Calculation Pane.

**Violation Conditions:**
- Switching modes (e.g., Amount ↔ Percent) changes row count or pushes inputs vertically.
- Calculation results cause input rows to move.

**Test Strategy:**
- Capture DOM structure before and after mode switch.
- Assert row structure remains stable.

---

## ISS-UI-FDP-008 — Calculator-Specific Compliance Declaration (P1)
**Rule:**
Each calculator must implicitly comply with these rules when modified. No explicit opt-in is required.

**Violation Conditions:**
- A calculator update introduces new scroll requirements without justification.
- Agent introduces layout changes without referencing FDP rules.

**Test Strategy:**
- Compare pre-change and post-change Calculation Pane height and structure.
- Flag regressions that increase scroll for core inputs.

---

## ISS Enforcement Notes (Agent Guardrails)

**Agents MUST NOT:**
- Redesign global UI
- Change breakpoints or spacing tokens
- Apply FDP rules retroactively unless touching that calculator

**Agents MAY:**
- Combine rows for related inputs
- Add progressive disclosure
- Reorder inputs to surface core fields earlier

---

## Placement & Wiring

- Add this file as: requirements/rules/iss/ISS-UI-FDP.md
- Reference it from:
  - UNIVERSAL_REQUIREMENTS.md → UI & Interaction section
  - testing_requirements.md → UI regression category
