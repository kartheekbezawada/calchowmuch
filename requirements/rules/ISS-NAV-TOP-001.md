# REQ-20260122-003: ISS-NAV-TOP-001 — Top Navigation Visual Regression Contract

**Type:** Testing Contract  
**Priority:** P0  
**Change Type:** Layout/CSS  
**SEO Impact:** No  

## Summary

Lock in automated visual regression coverage for the top navigation buttons (Math, Home Loan, Credit Cards, Auto Loans) through deterministic markup hooks, frozen color tokens, and a dedicated Playwright ISS test.

## Scope

- Top navigation button wrapper and buttons only
- Default, hover, focus, and active states
- No calculator logic, routing, left navigation, explanation pane, ads, or copy changes

## Markup Requirements

### MRK-1 (Top Nav Container)
- Add `data-testid="top-nav"` to the top navigation wrapper element.

### MRK-2 (Top Nav Buttons)
- Each top navigation button must include:
  - `data-testid="top-nav-btn"`
  - `data-nav-id` attribute with one of the canonical values:
    - `math`
    - `home-loan`
    - `credit-cards`
    - `auto-loans`

## Styling Requirements

### STY-1 (Cosmic Black Token)
- Define `--cosmic-black: #0b0f14` in a shared CSS scope.
- Reuse `var(--cosmic-black)` for all top navigation button styling.

### STY-2 (Default Button State)
- Background: `var(--cosmic-black)`
- Text color: white (`#ffffff`)
- No border
- Rounded rectangle matching calculator button radius
- Medium weight typography, sentence case, balanced horizontal padding

### STY-3 (Active Button State)
- Background: white
- Text color: `var(--cosmic-black)`
- Border: `1px solid var(--cosmic-black)`
- No shadow, no weight change

### STY-4 (Hover & Focus)
- Hover: subtle lightening or darkening of cosmic black + pointer cursor
- Focus: visible outline meeting accessibility contrast guidelines; must not rely on color shift alone

### STY-5 (Consistency)
- All top nav buttons share identical border-radius, font-size, font-weight, padding, and spacing rules.

## Test Automation Requirements

### TST-1 (Test File)
- Create Playwright spec at `tests/e2e/iss/iss-nav-top-001.spec.js`.
- Content must match the canonical contract provided in ISS-NAV-TOP-001 instructions (no deviations).

### TST-2 (Baseline Data)
- Commit snapshot reference `iss-nav-top-001.png` produced by the test when layout is correct.

### TST-3 (NPM Script)
- Add npm script: `"test:iss": "playwright test tests/e2e/iss"` to package.json scripts map.

### TST-4 (Evidence Retention)
- Ensure Playwright configuration retains:
  - Screenshots: `only-on-failure`
  - Traces: `retain-on-failure`

## Acceptance Criteria

- [ ] Markup exposes `data-testid="top-nav"` on container.
- [ ] Each top nav button includes required data attributes with canonical IDs.
- [ ] `--cosmic-black` CSS variable defined and reused.
- [ ] Default/active/interactive states match styling contract.
- [ ] ISS spec exists at required path with mandated content.
- [ ] npm script `test:iss` runs ISS suite.
- [ ] Snapshot `iss-nav-top-001.png` committed.
- [ ] Playwright retains failure artifacts per policy.
- [ ] Running `npm run test:iss` validates default + active + consistency contract without regressions.

## Change Management Notes

- Future top navigation entries must reuse the same button component and inherit all selectors/styles automatically.
- Any deviation from the canonical contract must raise a new requirement ID prior to implementation.

## Definition of Done

- All acceptance criteria met and verified through ISS-NAV-TOP-001 run.
- Requirement status updated through compliance workflow with evidence captured in trackers and compliance report.
