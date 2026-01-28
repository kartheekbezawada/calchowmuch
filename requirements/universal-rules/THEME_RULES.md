# THEME RULES

## Theme Tokens (Authoritative)

The following theme tokens are the single source of truth for all calculators and UI components. These must be used for all new calculators and when updating existing ones.

| Rule ID | Category   | Token                  | Value                      |
| ------- | ---------- | ---------------------- | -------------------------- |
| UI-1.1  | Colors     | Accent                 | `#2563eb`                  |
| UI-1.1  | Colors     | Accent strong          | `#1d4ed8`                  |
| UI-1.1  | Colors     | Backgrounds            | `#ffffff`                  |
| UI-1.1  | Colors     | Borders                | `#e5e7eb`                  |
| UI-1.1  | Colors     | Text                   | `#111827`                  |
| UI-1.1  | Colors     | Muted text             | `#6b7280`                  |
| UI-1.1  | Colors     | Secondary button bg    | `#e2e8f0`                  |
| UI-1.1  | Colors     | Secondary button text  | `#1f2937`                  |
| UI-1.1  | Colors     | Neutral pill bg        | `#f3f4f6`                  |
| UI-1.2  | Typography | Body font              | `Trebuchet MS` stack       |
| UI-1.2  | Typography | Display font (headers) | `Iowan Old Style` stack    |
| UI-1.3  | Sizing     | Calculator input font  | `16px`                     |
| UI-1.3  | Sizing     | Helper/label text      | `14px`                     |
| UI-1.3  | Sizing     | Result text            | `18px`, `font-weight: 600` |

## Component Styling

- Use shared button classes only (`.calculator-button`).
  - Primary: accent background, white text, `font-weight: 600`.
  - Secondary: `#e2e8f0` background, dark text. No custom palettes.
- Buttons must not wrap. Enforce `white-space: nowrap`.
- Use shared input classes/tokens. All inputs must have labels and be validated.
- Input values limited to 12 characters. For `type="text"`: use `maxlength="12"`. For `type="number"`: enforce via JS.
- **No dropdowns** (`select` elements not allowed). Use button groups/segmented controls instead.

## Scrollbar Styling

| Rule ID | Requirement         | Value                  |
| ------- | ------------------- | ---------------------- |
| UI-4.1  | Thumb color         | `#94a3b8` (slate-400)  |
| UI-4.1  | Thumb hover         | `#64748b` (slate-500)  |
| UI-4.1  | Track color         | `#f1f5f9` (slate-100)  |
| UI-4.1  | Width               | 8px                    |
| UI-4.2  | Always visible      | `overflow-y: scroll` and `scrollbar-gutter: stable` |
| UI-4.3  | Styling             | WebKit: `::-webkit-scrollbar-*`, Firefox: `scrollbar-width: thin`, `scrollbar-color`, Thumb `border-radius: 4px` |

## Typography

- Body font: `Trebuchet MS` stack
- Display font (headers): `Iowan Old Style` stack
- Calculator input font: 16px
- Helper/label text: 14px
- Result text: 18px, font-weight: 600

## Visual Source of Truth

The Basic Calculator is the visual source of truth for colors, typography, spacing, and component styling. All new themes or changes must be reflected here and in the shared CSS.
