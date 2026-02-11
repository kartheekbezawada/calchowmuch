# Home Loan Category — Design Standards

This document defines the visual and interaction design standards for all calculators in the **Home Loan** category. Every calculator in this category must follow these patterns to ensure a consistent, polished, and engaging user experience.

The standard is design-focused — it describes layout, components, colors, spacing, hover effects, and animations. Calculator-specific logic (formulas, field names, validation rules) is outside the scope of this document.

**Reference implementation:** Home Loan Mortgage Payment Calculator (`/loans/home-loan/`)

---

## 1. Page Layout

### Single-Pane Mode

All Home Loan calculators use `paneLayout: 'single'`, which merges the calculator form and explanation into one continuous panel (`.panel.panel-span-all`).

```
.calculator-page-single
  └── flex column, gap: 1.25rem
```

### Hero Section (Form + Preview)

The top section uses a 2-column grid:

```
.mtg-hero
  ├── .mtg-form-panel    (left — inputs)
  └── .mtg-preview-panel (right — live results)
```

| Property | Value |
|----------|-------|
| Display | `grid` |
| Columns | `minmax(0, 1.15fr) minmax(290px, 0.85fr)` |
| Gap | `1.5rem` |
| Align | `start` |
| Background | `none` (transparent) |
| Border | `none` |

At **1220px** breakpoint, collapses to single column (`grid-template-columns: 1fr`).

---

## 2. Color Palette

### Core Colors

| Name | Hex / RGBA | Usage |
|------|-----------|-------|
| **Primary Green** | `#22c55e` / `rgba(34, 197, 94, ...)` | Slider track fill start, donut principal segment, legend dot |
| **Accent Pink** | `#fb7185` / `rgba(251, 113, 133, ...)` | Slider track fill end, donut interest segment, hover accent |
| **Light Green** | `#4ade80` / `rgba(74, 222, 128, ...)` | Slider value badge text, glow source |
| **Cyan/Blue** | `rgba(56, 189, 248, ...)` | Toggle active border, advanced options border, FAQ accent |
| **Light Cyan** | `rgba(125, 211, 252, ...)` | Focus rings, preview panel border, section accents |
| **Blue Gradient Start** | `rgba(37, 99, 235, ...)` | Toggle active gradient, button glow |
| **Blue Gradient End** | `rgba(14, 165, 233, ...)` | Toggle active gradient |

### Background Tones

| Name | Value | Usage |
|------|-------|-------|
| **Deep Dark** | `rgba(15, 23, 42, ...)` | Input backgrounds, donut hole, badge background |
| **Slate Dark** | `rgba(30, 41, 59, ...)` | Section backgrounds, table header, card backgrounds |
| **Blue Dark** | `rgba(30, 64, 175, 0.1)` | Preview inner card tint |

### Text Hierarchy

| Level | Value | Usage |
|-------|-------|-------|
| **Brightest** | `rgba(248, 250, 252, 0.98)` | Values, totals, strong text |
| **Primary** | `rgba(226, 232, 240, 0.94–0.97)` | Labels, headings, question text |
| **Result** | `#e0f2fe` | Large result number |
| **Secondary** | `rgba(203, 213, 225, 0.9)` | Body text, descriptions, answers |
| **Muted** | `rgba(148, 163, 184, 0.78–0.85)` | Snapshot labels, card labels |
| **Toggle text** | `rgba(191, 219, 254, 0.92–0.94)` | Toggle buttons, section headers |

---

## 3. Typography

| Element | Size | Weight | Other |
|---------|------|--------|-------|
| Labels | `0.78rem` | 600 | `line-height: 1.28` |
| Helper text | `0.84rem` | normal | `line-height: 1.45` |
| Body / descriptions | `0.84rem` | normal | `line-height: 1.55` |
| Section headers (h3) | `0.88rem` | 700 | `text-transform: uppercase; letter-spacing: 0.04em` |
| Page heading (h2) | `1.08rem` | 700 | — |
| Result value | `clamp(2.4rem, 4.5vw, 3.4rem)` | 800 | `letter-spacing: -0.02em` |
| Result label | `0.74rem` | 700 | `text-transform: uppercase; letter-spacing: 0.05em` |
| Slider value badge | `0.9rem` | 700 | `font-variant-numeric: tabular-nums` |
| Snapshot label | `0.75rem` | normal | Muted color |
| Snapshot value | `0.88rem` | 700 | Bright white |
| Table header | `0.74rem` | normal | `text-transform: uppercase; letter-spacing: 0.03em` |
| Table cell | `0.79rem` | normal | `white-space: nowrap` |
| Toggle button | `0.76rem` | 600 | — |
| FAQ question (h4) | `0.86rem` | normal | `line-height: 1.3` |
| FAQ answer | `0.8rem` | normal | `line-height: 1.5` |

**Numeric formatting:** Always use `font-variant-numeric: tabular-nums` for values that change dynamically (totals, percentages, slider badges).

---

## 4. Slider Input Pattern

The slider is the primary input component. All main inputs (price, amounts, terms, rates) use this pattern.

### HTML Structure

```html
<div class="input-row slider-row">
  <div class="slider-header">
    <label for="[id]">[Label Text]</label>
    <span class="slider-value" id="[id]-display">[formatted value]</span>
  </div>
  <input id="[id]" type="range" value="[default]" min="[min]" max="[max]" step="[step]" />
</div>
```

### Layout

- All sliders stacked in a **single vertical column**
- Form panel gap: **1.65rem** between each slider row
- Slider row internal gap: **0.52rem** (between header and track)

### Slider Header

- Flexbox row: label left, value badge right
- `justify-content: space-between`

### Value Badge (`.slider-value`)

| Property | Default State | Hover State (row hover) |
|----------|--------------|------------------------|
| Background | `rgba(15, 23, 42, 0.92)` | same |
| Border | `1px solid rgba(34, 197, 94, 0.45)` | `rgba(251, 113, 133, 0.55)` |
| Text color | `#4ade80` (green) | `#fb7185` (pink) |
| Font | `0.9rem`, weight 700, `tabular-nums` | same |
| Padding | `0.24rem 0.72rem` | same |
| Border radius | `0.52rem` | same |
| Text shadow | 3 layers — `8px 0.7`, `20px 0.4`, `40px 0.2` green | 3 layers pink at same radii |
| Box shadow | 2 layers — `8px 0.2`, `20px 0.08` green | 2 layers pink at same radii |
| Transition | `0.25s ease` on border-color, color, text-shadow, box-shadow | — |

### Slider Track

| Property | Value |
|----------|-------|
| Height | `5px` |
| Border radius | `9999px` |
| Background | `linear-gradient(90deg, #22c55e 0%, #fb7185 var(--fill, 50%), rgba(148,163,184,0.14) var(--fill, 50%))` |
| Hover | `box-shadow: 0 0 10px rgba(34, 197, 94, 0.15)` |
| Focus | `box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.35)` |

The `--fill` CSS custom property is set by JavaScript based on slider position.

### Slider Thumb

| Property | Value |
|----------|-------|
| Size | `18px` circle |
| Background | `#fff` |
| Border | `2px solid rgba(34, 197, 94, 0.5)` |
| Box shadow | `0 1px 6px rgba(0, 0, 0, 0.25)` |
| Cursor | `grab` (default), `grabbing` (active) |
| Hover | `scale(1.18)`, border shifts to pink `rgba(251, 113, 133, 0.7)` |
| Active | `scale(1.08)` |
| Transition | `0.15s ease` on transform, box-shadow, border-color |

Must include both `-webkit-slider-thumb` and `-moz-range-thumb` vendor prefixes.

### JavaScript Slider Functions

```javascript
// Set --fill CSS property based on slider position
function updateSliderFill(input) {
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

// Update all slider display values and fill positions
function updateSliderDisplays() {
  // Format each slider's display span with appropriate formatting
  // Call updateSliderFill() for each slider
}
```

Listen on `input` event (not `change`) for real-time updates as user drags.

---

## 5. Segmented Toggle Control

Used for binary choices (Amount/Percent, Monthly/Yearly).

### HTML Structure

```html
<div class="button-group" role="group" aria-labelledby="[label-id]" data-button-group="[group-name]">
  <button class="calculator-button secondary is-active" type="button" data-value="[value1]" aria-pressed="true">
    [Label 1]
  </button>
  <button class="calculator-button secondary" type="button" data-value="[value2]" aria-pressed="false">
    [Label 2]
  </button>
</div>
```

### Capsule Container

| Property | Value |
|----------|-------|
| Display | `inline-flex` |
| Padding | `3px` |
| Border radius | `9999px` |
| Border | `1px solid rgba(148, 163, 184, 0.36)` |
| Background | `rgba(15, 23, 42, 0.78)` |

### Pill Buttons

| State | Styles |
|-------|--------|
| Default | `transparent` background, `rgba(191, 219, 254, 0.92)` text, `9999px` radius |
| Active (`.is-active`) | `linear-gradient(140deg, rgba(37, 99, 235, 0.95), rgba(14, 165, 233, 0.82))`, `rgba(56, 189, 248, 0.82)` border, `#fff` text |
| Hover (inactive) | `rgba(59, 130, 246, 0.12)` background, `#e0f2fe` text |

Minimum height: `32px` (form toggles), `34px` (table view toggles).

Use `setupButtonGroup()` from `/assets/js/core/ui.js` with `data-button-group` attribute.

---

## 6. Advanced Options (Collapsible)

Secondary inputs that are optional go inside a `<details>` collapsible.

### Summary Bar

| Property | Value |
|----------|-------|
| Border | `1px solid rgba(56, 189, 248, 0.56)` |
| Background | `linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(14, 165, 233, 0.18))` |
| Border radius | `0.78rem` |
| Font | `0.78rem`, weight 700 |
| Hover | Border brightens to `0.72`, background opacity increases |

Includes an expand/close pill indicator that toggles visibility based on `[open]` state.

### Advanced Input Layout

- Inputs arranged in **2-column grid pairs** (`.advanced-pair`)
- `grid-template-columns: repeat(2, minmax(0, 1fr))`
- Gap: `1.1rem` between columns, `0.72rem` between rows
- Collapses to single column at **900px** breakpoint

### Number Inputs (secondary fields)

| Property | Value |
|----------|-------|
| Min height | `38px` |
| Border radius | `0.78rem` |
| Border | `1px solid rgba(148, 163, 184, 0.42)` |
| Background | `rgba(15, 23, 42, 0.72)` |
| Font | `0.84rem`, white text |
| Focus | `2px` cyan outline, border brightens |
| Hover | Border brightens to `0.62` |

---

## 7. Calculate Button

| Property | Value |
|----------|-------|
| Width | Full-width |
| Min height | `50px` |
| Border radius | `0.82rem` |
| Font | `0.88rem`, weight 700 |
| Hover | `box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45)`, `translateY(-1px)` |
| Active | `translateY(0)`, reduced shadow |
| Transition | `box-shadow 0.25s ease, transform 0.15s ease` |
| Margin top | `0.35rem` |

---

## 8. Preview Panel (Right Sidebar)

The preview panel shows live calculation results.

### Outer Container

| Property | Value |
|----------|-------|
| Border radius | `1.15rem` |
| Border | `1px solid rgba(125, 211, 252, 0.22)` |
| Background | `linear-gradient(160deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.92))` |
| Padding | `1.15rem` |
| Gap | `1rem` |
| Box shadow | `0 4px 24px rgba(2, 6, 23, 0.45), 0 0 40px rgba(59, 130, 246, 0.06)` |

### Result Card

- **Label:** Uppercase, `0.73rem`, `letter-spacing: 0.06em`, blue-tinted text
- **Value:** `clamp(2.4rem, 4.5vw, 3.4rem)`, weight 800, `#e0f2fe` color
- **Glow:** `text-shadow: 0 0 20px rgba(125, 211, 252, 0.35), 0 0 40px rgba(59, 130, 246, 0.15)`

### Result Animation

```css
@keyframes mtg-result-pop {
  0%   { opacity: 0.4; transform: scale(0.92); }
  50%  { opacity: 1;   transform: scale(1.03); }
  100% { opacity: 1;   transform: scale(1);    }
}
```

Triggered by adding `.is-updated` class on calculate. JS must remove the class, force reflow (`void element.offsetWidth`), then re-add it.

### Snapshot List

Key-value rows showing all input parameters:

| Property | Value |
|----------|-------|
| Row padding | `0.55rem 0` |
| Divider | `1px solid rgba(148, 163, 184, 0.1)` (no border on last) |
| Label | `0.75rem`, muted `rgba(148, 163, 184, 0.85)` |
| Value | `0.88rem`, weight 700, bright `rgba(248, 250, 252, 0.99)` |

---

## 9. Explanation Sections (Container)

All explanation content (Lifetime Totals, Amortization, FAQ) shares a common section container:

| Property | Value |
|----------|-------|
| Display | `grid` |
| Gap | `0.72rem` |
| Padding | `1rem` (0.85rem on mobile) |
| Border radius | `0.95rem` |
| Border | `1px solid rgba(148, 163, 184, 0.16)` |
| Background | `linear-gradient(160deg, rgba(15, 23, 42, 0.38), rgba(30, 41, 59, 0.3))` |

Section header (h3): `0.88rem`, weight 700, uppercase, `letter-spacing: 0.04em`, blue-tinted text. No bottom border or `::after` decorations.

---

## 10. Lifetime Totals Section

### Layout

2-column grid: visual column (donut + legend) on the left, totals column on the right.

```css
grid-template-columns: auto 1fr;
```

Header spans full width: `grid-column: 1 / -1`.
Collapses to single column at **720px**.

### Donut Chart

| Property | Value |
|----------|-------|
| Size | `200px` (160px on mobile) |
| Shape | Circle with `conic-gradient` |
| Colors | `#22c55e` (principal) → `#fb7185` (interest) |
| CSS property | `--principal-share` controls split (set by JS) |
| Hole | `::after` pseudo at `inset: 26%`, dark background `rgba(15, 23, 42, 0.96)` |
| Cursor | `pointer` |
| Transition | `0.35s ease` on box-shadow, transform |

**Hover effect:**
```css
box-shadow:
  0 0 32px rgba(34, 197, 94, 0.35),
  0 0 60px rgba(251, 113, 133, 0.22),
  0 0 80px rgba(34, 197, 94, 0.1);
transform: scale(1.06);
```

### Legend

Vertical stack below the donut, full width:

| Property | Value |
|----------|-------|
| Gap | `0.35rem` |
| Item padding | `0.45rem 0.62rem` |
| Item border radius | `0.62rem` |
| Dot size | `10px` circle |
| Principal dot | `#22c55e`, `box-shadow: 0 0 6px rgba(34, 197, 94, 0.4)` |
| Interest dot | `#fb7185`, `box-shadow: 0 0 6px rgba(251, 113, 133, 0.4)` |
| Label text | `0.74rem`, secondary color |
| Value text | `0.82rem`, weight 700, bright white |
| Hover | Blue tint background, cyan border, subtle shadow |

### Totals Grid (Right Column)

Stacked cards, `align-self: center`:

| Property | Value |
|----------|-------|
| Card layout | Flex row, `space-between`, baseline alignment |
| Card padding | `0.72rem 0.8rem` |
| Divider | `1px solid rgba(148, 163, 184, 0.08)` (bottom, except last) |
| Label | `0.72rem`, uppercase, muted |
| Value | `1.05rem`, weight 800, `tabular-nums` |
| Hover | Blue tint, cyan border, shadow, `translateX(4px)` slide |
| Transition | `0.25s ease` on background, border, box-shadow; `0.2s ease` on transform |

---

## 11. Amortization Table Section

### Header

Flex row with title left and toggle right:
- Stacks vertically at **900px** breakpoint

### Table View Toggle

Same segmented toggle pattern as Section 5, with:
- Min-width per button: `90px`
- Min-height: `34px`
- Full-width on mobile (720px)

### Scrollable Container

| Property | Value |
|----------|-------|
| Max height | `320px` |
| Overflow | `auto` |
| Border radius | `0.82rem` |
| Border | `1px solid rgba(148, 163, 184, 0.32)` |
| Background | `rgba(15, 23, 42, 0.56)` |
| Tab index | `0` (keyboard scrollable) |

### Table Styling

| Element | Styles |
|---------|--------|
| Min width | `640px` |
| Header (`thead th`) | Sticky top, `z-index: 3`, uppercase, `0.74rem`, dark background `rgba(30, 41, 59, 0.98)` |
| All cells | `text-align: center` |
| Body cells | `0.79rem`, `white-space: nowrap` |
| Even rows | `rgba(30, 41, 59, 0.22)` stripe |

### Table Columns

**Monthly view:** Month | Payment | Principal | Interest | Extra | Balance

**Yearly view:** Year | Total Paid | Total Principal | Total Interest | Total Extra | Ending Balance

### View Toggle Behavior

- Default view: Monthly
- Toggle switches visibility using `.is-hidden` class
- Active button gets `.is-active` class

---

## 12. FAQ Section

| Property | Value |
|----------|-------|
| Grid | Single column, `0.6rem` gap |
| Item padding | `0.75rem 0.86rem` |
| Left accent | `3px solid rgba(56, 189, 248, 0.52)` |
| Background | `rgba(30, 41, 59, 0.44)` |
| Border radius | `0.74rem` |
| Question (h4) | `0.86rem`, bright text `rgba(226, 232, 240, 0.98)` |
| Answer (p) | `0.8rem`, secondary text, `line-height: 1.5` |
| Internal gap | `0.4rem` (between question and answer) |

Each calculator should include **10 FAQ items** relevant to its topic.

---

## 13. Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| **1220px** | Hero grid → single column |
| **900px** | Advanced option pairs → single column; amortization header stacks vertically |
| **720px** | Section padding reduces to `0.85rem`; toggle buttons become `flex: 1 1 auto` (full-width); lifetime totals grid → single column; donut shrinks to `160px` |

---

## 14. Accessibility

| Feature | Implementation |
|---------|---------------|
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables result pop animation and button transitions |
| Live regions | `aria-live="polite"` on result and summary containers |
| Donut chart | `role="img"` with `aria-label="Principal vs interest breakdown"` |
| Toggle groups | `role="group"` with `aria-label`, `aria-pressed` on each button |
| Scrollable areas | `tabindex="0"` on table scroll containers |
| Focus visibility | `2px` cyan outline with `1–2px` offset on interactive elements |

---

## 15. Formatting Rules

| Rule | Details |
|------|---------|
| **No currency symbols** | Never display £, $, or € in any result, summary, table, or total |
| **Number formatting** | Use `formatNumber()` with locale-aware commas (e.g., `728,142`) |
| **Percentages** | Display as `XX.X%` (one decimal place) |
| **Loan terms** | Display as `XX yrs` in slider badges |
| **Table values** | Use `formatExplanationNumber()` — same no-currency format |

---

## 16. Transitions & Timing Reference

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Slider value badge | border, color, text-shadow, box-shadow | `0.25s` | ease |
| Slider track | box-shadow | `0.2s` | ease |
| Slider thumb | transform, box-shadow, border-color | `0.15s` | ease |
| Toggle buttons | background, border-color, color | `0.2s` | ease |
| Calculate button | box-shadow | `0.25s` | ease |
| Calculate button | transform | `0.15s` | ease |
| Result pop animation | opacity, transform | `0.4s` | ease-out |
| Donut chart | box-shadow, transform | `0.35s` | ease |
| Legend items | background, border-color, box-shadow | `0.25s` | ease |
| Totals cards | background, border-color, box-shadow | `0.25s` | ease |
| Totals cards | transform | `0.2s` | ease |
| Advanced summary | border-color, background | `0.2s` | ease |
| Number inputs | border-color, box-shadow | `0.2s` | ease |

---

## 17. File Structure Convention

Each Home Loan category calculator should follow this file structure:

```
public/calculators/loans/[calculator-name]/
  ├── calculator.css       # All visual styles (following this standard)
  ├── index.html           # Calculator form HTML fragment
  ├── explanation.html      # Explanation content (totals, table, FAQ)
  └── module.js            # Calculator logic + slider/UI management
```

The generated output page is at:
```
public/loans/[calculator-name]/index.html
```

Generated via `node scripts/generate-mpa-pages.js`.
