# REQ-20260127-UI-Theme-001 — Premium Dark Theme Migration (No Layout/Logic Changes)

## Goal
Update CalcHowMuch UI **theme only** to match the Claude “PerfectLayout” premium dark style, focusing on:
- Colors + gradients
- Button styling (nav + primary CTA)
- Slider styling (track + thumb)
- Shadows, borders, radius, typography (visual only)

**Do NOT change:**
- Pane widths/heights, grid layout, or scroll containers
- Calculator logic or formulas
- Data contract between panes
- Explanation pane content structure, FAQs, SEO copy
- Navigation structure / URLs

Reference style spec: `PerfectLayout` component. :contentReference[oaicite:0]{index=0}

---

## Inputs / Source of Truth
- **Style reference implementation**: `perfect-layout.jsx` :contentReference[oaicite:1]{index=1}
- (Optional duplicate) `import React, { useState } from 're.txt` :contentReference[oaicite:2]{index=2}

The agent must treat these as *visual spec only*. No functional parity required with the demo logic inside the file.

---

## Non-Goals
- Introducing Tailwind, React refactors, componentization, or changing framework
- Moving charts/tables between panes (separate requirements)
- Adding new UI sections (search bar, premium badge, etc.) unless they already exist
- Adding or removing inputs

---

## Layout Contract (Hard Lock)
### Absolute constraints (must remain identical)
- Grid column definitions (pane spans)
- Pane container heights
- `overflow-y-auto` regions (which elements scroll)
- Header/footer heights (if fixed)
- Existing DOM structure for pane containers (no wrapper reshaping)

### Enforcement rule
If a change causes pane width/height/scroll behavior differences, **revert immediately** and restyle using only CSS classes/tokens.

---

## Delivery Strategy
Implement the new theme as **tokenized CSS** + **small, targeted class updates**, gated behind a theme flag:
- `data-theme="premium-dark"` on `<html>` or `<body>`
- Default stays current until explicitly toggled

This reduces risk and makes rollback trivial.

---

## Agent Tasks (Step-by-step)

### TASK 0 — Baseline Snapshot (Pre-change)
**Objective:** Capture current layout and confirm layout contract.
- Take screenshots of:
  - A representative calculator page at desktop width
  - Left nav scrolled mid-way
  - Calculation pane scrolled mid-way
  - Explanation pane top + mid + bottom
- Record:
  - Pane column spans (e.g., 2/3/5/2 style)
  - Which elements have `overflow-y-auto`

**Acceptance Criteria**
- Screenshots saved/attached (or committed under `docs/ui-baselines/`)
- Notes added to this requirement under “Layout Contract Notes”

---

### TASK 1 — Add Theme Flag + Token File (No Visual Change Yet)
**Objective:** Introduce theme token system without changing appearance.
1. Add theme flag support:
   - Add `data-theme="premium-dark"` but keep it **off by default**
   - Provide a simple dev toggle (temporary) if you already have settings UI; otherwise keep manual.
2. Create new CSS file: `assets/css/theme-premium-dark.css` (name can vary)
3. Define tokens (CSS variables) inside:
   - `--bg-main`, `--bg-pane`, `--text-primary`, `--text-muted`
   - `--border-soft`, `--shadow-soft`
   - `--accent-1`, `--accent-2` (blue/cyan)
4. Include the new CSS file after existing CSS files in HTML.

**Acceptance Criteria**
- No visible UI change when theme flag is OFF
- Theme file loads with zero console errors
- Code is structured so future tasks only modify variables/classes

---

### TASK 2 — Premium Dark Background + Pane Surfaces (Still No Layout Changes)
**Objective:** Match the “premium dark” pane surface style.
Implement only under `[data-theme="premium-dark"]`:
- Page background gradient (dark slate/blue)
- Pane backgrounds: subtle gradients + translucency feel
- Borders: low-contrast, soft
- Radius: keep current radius unless already compatible (do not change layout geometry)

**Acceptance Criteria**
- Pane sizes/scroll remain identical
- Only color/paint changes visible
- No new horizontal scrollbars introduced

---

### TASK 3 — Buttons: Nav + Primary CTA (Visual Only)
**Objective:** Match the glossy gradient button style for:
- Top category buttons
- Left nav active item
- Primary calculate button

Rules:
- No DOM structure changes
- No handler/event logic changes
- Only classes / CSS selectors / variables

Implement:
- Active state gradient (blue → cyan)
- Hover state (subtle lightening)
- Focus ring (accessible)
- Shadow (soft, not huge)

**Acceptance Criteria**
- Click behavior unchanged
- Keyboard focus visible
- Active state consistent across nav + left list + CTA

---

### TASK 4 — Sliders (Track + Thumb) Premium Styling
**Objective:** Upgrade range inputs to match reference style, without changing min/max/step/value logic.
Implement:
- Thumb style (rounded, accent)
- Track style (muted track + accent fill illusion)

If you currently render sliders without custom CSS:
- Use vendor selectors:
  - `::-webkit-slider-thumb`, `::-moz-range-thumb`
  - `::-webkit-slider-runnable-track`, `::-moz-range-track`

**Acceptance Criteria**
- Slider values update exactly as before
- No jitter/drag issues
- Works on Chromium browsers at minimum (primary); Firefox styling best-effort

---

### TASK 5 — Typography + Icon Color Harmonization
**Objective:** Improve perceived quality without altering content layout.
- Apply tokenized text colors:
  - headings = `--text-primary`
  - labels = `--text-muted`
- If icons exist, align icon stroke colors to theme tokens

Constraint:
- Do not change font sizes in a way that causes wrapping/reflow in tight rows.

**Acceptance Criteria**
- No line breaks introduced in critical UI rows (inputs, labels, nav items)
- Contrast is readable

---

### TASK 6 — Pane Headers (Only Visual)
**Objective:** Give pane headers a premium treatment (gradient/soft highlight), similar to reference.
- Pane header backgrounds: subtle gradient overlay
- Keep current padding and height (no reflow)
- Keep semantics unchanged (H tags remain)

**Acceptance Criteria**
- Header heights unchanged
- No scroll container changes

---

### TASK 7 — Visual Regression + Functional Sanity
**Objective:** Prove theme changes did not break layout or functionality.

Checks:
- Pane widths/scrollbars match baseline screenshots
- Calculation outputs identical for same inputs
- No content moved between panes
- No console errors

Artifacts:
- After screenshots in `docs/ui-baselines/after/`
- Short checklist recorded in PR/commit message

**Acceptance Criteria**
- Before/after images show only paint/styling changes
- Calculator results identical

---

### TASK 8 — Cleanup + Documentation
**Objective:** Make theme repeatable across calculators.
- Document:
  - How to enable theme flag
  - Where tokens live
  - Which selectors define buttons/sliders/panes
- Ensure theme does not require page-specific hacks

**Acceptance Criteria**
- Single theme CSS file drives the look
- No duplicated magic numbers in multiple CSS files

---

## Implementation Notes (Mapping to PerfectLayout)
Use these as *visual targets* (not code to copy):
- Background: dark slate/blue gradient
- Accent: blue/cyan
- Active buttons: gradient + soft shadow
- Pane surfaces: dark, slightly translucent, soft borders
- Sliders: accent fill + rounded thumb

Reference: `perfect-layout.jsx` :contentReference[oaicite:3]{index=3}

---

## Definition of Done
- Theme is applied only when `data-theme="premium-dark"` is enabled
- No layout/logic/content changes (verified with screenshots + sanity checks)
- Buttons + sliders match the premium feel
- Ready to apply across all calculator pages without per-page overrides

---

## Rollback Plan
- Remove `data-theme="premium-dark"` (or disable toggle)
- Theme CSS can remain in place but unused
- No functional code paths depend on the theme
