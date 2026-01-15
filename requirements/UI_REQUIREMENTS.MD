# Universal Calculator UI Requirements

These requirements define the single, universal look and feel for all calculators. The Basic Calculator is the source of truth for theme tokens, typography, spacing, and component styling. No calculator may deviate from this contract.

## 1) Theme Tokens (must match Basic Calculator exactly)

Source: `public/assets/css/base.css` and `public/calculators/math/basic/calculator.css`.

### 1.1 Colors
- Primary brand (accent): `#2563eb` (`--accent`)
- Accent strong: `#1d4ed8` (`--accent-strong`)
- Backgrounds: `#ffffff` (`--page-bg`, `--page-bg-accent`, `--shell-bg`, `--panel-bg`, `--header-bg`)
- Borders: `#e5e7eb` (`--border-color`, `--shell-border`, `--pill-border`)
- Text: `#111827` (`--header-text`)
- Muted text: `#6b7280` (`--muted-text`)
- Secondary button background: `#e2e8f0`
- Secondary button text: `#1f2937`
- Neutral pill background: `#f3f4f6` (`--pill-bg`)

### 1.2 Typography
- Body font: `"Trebuchet MS", "Gill Sans", "Candara", "Segoe UI", sans-serif` (`--font-body`)
- Display font (headers): `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif` (`--font-display`)
- Calculator label size: `14px`
- Calculator input size: `16px`
- Helper text size: `14px`
- Result size: `18px`, font-weight `600`

### 1.3 Calculator UI Spacing Tokens
- Input padding: `10px 12px` (`--calculator-input-padding`)
- Input radius: `10px` (`--calculator-input-radius`)
- Button padding: `10px 12px` (`--calculator-button-padding`)
- Button radius: `10px` (`--calculator-button-radius`)
- UI gaps: `calculator-ui` `18px`, `input-stack` `16px`, `button-row` `12px`, `toolbar-actions` `12px`

## 2) Component Requirements (shared classes only)

### 2.1 Buttons (non-negotiable)
- All buttons must use shared classes (ex: `.calculator-button`, `.primary`, `.secondary`).
- Primary buttons: background `#2563eb`, text `#ffffff`, font-weight `600`, border `none`.
- Secondary buttons: background `#e2e8f0`, text `#1f2937`, border `none`.
- Hover/active/focus states must match Basic behavior; no custom palettes.
- Buttons must not wrap text. Keep labels on a single line using `white-space: nowrap`.
- Button sizing is standard (padding/radius above). If a label is too long, adjust width or shorten label; only minimal padding tweaks are allowed to keep one-line labels.

### 2.2 Inputs
- Inputs must use shared classes and tokens from Basic.
- Use `font-size: 16px`, border `1px solid #e5e7eb`, radius `10px`, padding `10px 12px`.
- Input values must be limited to 12 characters.
  - For `type="text"` inputs: set `maxlength="12"`.
  - For `type="number"` inputs: enforce a 12-character limit via JS input handler (since `maxlength` is not honored).

### 2.3 No Dropdowns
- `select` elements are not allowed in calculators.
- Replace dropdown choices with button groups or segmented controls using shared button styles.
- All user actions should be button-based.

## 3) Layout Contract (page must never grow)

### 3.1 Fixed App Shell Size
- The Basic Calculator page size is the maximum allowed layout size.
- App shell must be constrained to the viewport, e.g. `height: calc(100vh - 48px)` and `max-height: calc(100vh - 48px)`.
- Content must never increase the overall page height. Overflow must be internal.

### 3.2 Universal 3-Column Structure
- Left: Navigation (scrollable)
- Middle: Calculation canvas (scrollable)
- Right: Explanation (scrollable)
- No calculator may change the column ratios or take over more space.

Baseline grid from Basic layout (`public/assets/css/layout.css`):
- Shell: `width: min(1920px, calc(100vw - 48px))`, `margin: 8px auto`, `padding: 20px`, `border-radius: 28px`, `border: 2px solid #e5e7eb`
- Main grid: `grid-template-columns: minmax(200px, 230px) minmax(0, 1fr) minmax(180px, 220px)`, gap `16px`
- Panels: `border-radius: 32px`, `padding: 24px`, `border: 2px solid #e5e7eb`, `box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08)`

### 3.3 Pane Scrolling (must-have)
- Navigation pane: `overflow-y: scroll`, internal scrollbar
- Calculation pane: `overflow-y: scroll`, internal scrollbar
- Explanation pane: `overflow-y: scroll`, internal scrollbar
- Overflow content must never increase page height.

### 3.4 Page Scroll Policy
- Full-page vertical scrolling should be minimal and never required to use a calculator.
- Primary scrolling happens inside the panes listed above.

## 4) Scrollbar Styling (global and consistent)

All scrollable panes must share the same theme styling:
- Thumb: `#2563eb`
- Track: `#f3f4f6`
- Radius: `999px`
- Width: `10px` (or closest supported width per browser)

Use global styling so all panes match:
- `scrollbar-color: var(--accent) var(--pill-bg);`
- `scrollbar-width: thin;`
- `::-webkit-scrollbar`, `::-webkit-scrollbar-thumb`, `::-webkit-scrollbar-track` rules applied globally.

## 5) Calculator Content Rules (prevent layout blow-up)

### 5.1 Results Must Be Compact
- The calculation pane shows inputs, action buttons, and a concise result summary.
- Long explanations, formulas, and steps belong in the Explanation pane.
- If detailed output is needed in the calculation pane, it must be collapsible (accordion) or inside a scrollable result box.

### 5.2 Long Output Handling
- Any large output must be placed inside a fixed-height, scrollable container.
- No output is allowed to increase the height of the calculation pane container.

## 6) Shared UI System Requirement

- There must be a single shared UI stylesheet or design system used by every calculator.
- Shared classes must cover: buttons, inputs, cards/panels, headings, and spacing utilities.
- Per-calculator styling must not redefine theme tokens, button styles, or typography.
- Do not introduce new fonts, color palettes, or spacing rules in calculator-specific CSS.

## 7) Interaction and Navigation Consistency

- Switching calculators must not cause layout shifts, page growth, or visual "flash" of old styling.
- No "old calculator" look should appear even briefly when navigating.
- Consistent panel sizing and spacing should make navigation feel stable and smooth.

## 8) Acceptance Criteria (pass/fail)

- Visual consistency: all calculators match Basic Calculator colors, fonts, buttons, and spacing.
- No page growth: switching calculators does not change overall page height.
- Internal scroll only: navigation, calculation, and explanation panes always scroll internally.
- Scrollbars are blue and consistent across all panes.
- No dropdowns; button-only controls for selections.
- Input values limited to 12 characters.
- Responsive safety: no horizontal scroll on common desktop widths; smaller widths adapt without breaking the fixed-height shell rule.

## 9) Definition of Done

A change is done only when:
- Every calculator uses the Basic theme tokens and shared UI system.
- The overall layout never grows beyond the Basic Calculator baseline.
- All overflow is handled by internal, blue-themed scrollbars.
- No calculator contains custom styling that deviates from the shared design system.
- Input length and control-type rules are enforced across all calculators.
