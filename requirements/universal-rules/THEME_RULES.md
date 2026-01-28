# Theme Rules — Single Source of Truth

> **Requirement:** This document is the canonical authority for both universal tokens and the premium-dark global default (see REQ-20260128-014). All calculators, content pages, and shared UI must reference these rules and no other theme specification.

## Scope & Authority
- Define every color, typography stack, spacing token, and component contract that calculators and adjacent UI surfaces must consume.
- Lock in premium-dark as the global theme and document how it is loaded through the base layout, not per-page scripts or links.
- Signal to design, engineering, and QA that this file is the single point of truth; all future theme updates must land here and be referenced from build/test/docs.

## Theme Tokens (Authoritative)

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
- Use the shared button classes (`.calculator-button`) with the following semantics:
  - **Primary** buttons: accent background, white text, `font-weight: 600`, `white-space: nowrap`.
  - **Secondary** buttons: `#e2e8f0` background with dark text. No custom palettes per component.
- Inputs must always have visible labels and numeric entries should be validated in JS (no `maxlength` on `type="number"`, enforce via scripts).
- No `<select>` controls; use segmented buttons or slider-based toggles to keep the calculator interactions consistent.
- Input values should remain within 12 characters; use `maxlength="12"` for text inputs and logic validation for numbers.

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
- Body font: `Trebuchet MS` stack.
- Display font (headers): `Iowan Old Style` stack.
- Calculator input font: 16px.
- Helper/label text: 14px.
- Result text: 18px, `font-weight: 600`.

## Global Premium-Dark Default
- `theme-premium-dark.css` (located at `/public/assets/css/theme-premium-dark.css`) is the single global theme file and must always be the default palette for every page and calculator.
- The base layout imports the theme once (`public/assets/css/base.css` already contains `@import url('/assets/css/theme-premium-dark.css?v=20260127');`). Do **not** add any additional `<link rel="stylesheet" href="/assets/css/theme-premium-dark.css" ...>` tags to calculators or content pages.
- Visual appearance and gradients must continue to match the current premium-dark implementation; if any regression is observed, stop and revert.
- Guarantee performance by loading the theme once through the shared layout (base.css, layout.css, or the page shell) rather than repeated per-page requests.

## Layout System Integration
- All navigation panes, calculator shells, and content columns inherit the premium-dark tokens because the layout imports `theme-premium-dark.css` globally through `base.css` and the shared shell files.
- When building new calculators or content shells, rely on `THEME_RULES.md` for colors/breakpoints and do not duplicate them in component-level CSS.
- Verify that the theme is applied consistently across calculators, nav, and content before marking a change as complete.

## Build, Testing, and Documentation Updates
- Reference `THEME_RULES.md` wherever documentation, build scripts, or release notes previously pointed to `requirements/rules/premium_dark_theme_global_009.md` or any other theme guidance file.
- Ensure the build process preserves cache versioning for `theme-premium-dark.css` (the current query string `v=20260127` is an example of the strategy).
- Required tests for Layout/CSS changes (per `testing_requirements.md`) include the ISS-001 suite (`npm run test:iss001`). Run this suite after any theme update and log the results in `testing_tracker.md`.

## Archival & Cleanup
- `requirements/rules/premium_dark_theme_global_009.md` has been superseded by this document. Archive or remove the old file so it no longer appears in active rule inventories.
- Any future theme requirements must update this file and follow the FSM (REQ → BUILD → TEST → SEO → COMPLIANCE) before touching tracker entries or deploying changes.
