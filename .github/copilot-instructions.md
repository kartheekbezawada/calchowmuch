# Copilot Instructions for calchowmuch

## Architecture Overview

**Static calculator platform** - Each calculator is a self-contained HTML file in `public/calculators/`. No build step, no server-side logic. Served via static hosting with Python HTTP server.

**Three-column layout**: Left nav (category navigation) → Center column (calculator + explanation) → Right column (ads). Layout is fixed-height; content scrolls internally, never the page itself.

**Core separation**:
- `public/assets/js/core/` - Shared pure functions (loan-utils.js, format.js, validate.js, math.js, stats.js)
- `public/calculators/{category}/{calculator}/` - Calculator HTML + optional module.js + calculator.css
- `requirements/` - Domain rules and acceptance criteria (ALWAYS read before implementing)

## Critical Requirements

**ALWAYS read `requirements/universal/UNIVERSAL_REQUIREMENTS.md` first** - Contains indexed rule IDs (e.g., `UI-2.3`, `UTBL-BORDER-1`) that must be cited in reviews.

**Calculator hierarchy**: Follow `requirements/universal/calculator-hierarchy.md` for navigation structure. Categories: Math, Loans. Each calculator maps to exactly one leaf item.

## Code Patterns

**Calculator HTML structure** - See `public/calculators/loans/loan-emi/index.html`:
```html
<div id="calc-{name}">
  <div class="calculator-ui">
    <div class="input-stack">...</div>
    <button class="calculator-button full-width">Calculate</button>
    <div class="result" aria-live="polite"></div>
  </div>
</div>
```

**No dropdowns** - Use button groups (`<div class="button-group">`) instead of `<select>`. Toggle state with `.is-active` class and `aria-pressed`.

**Input validation** - Use `toNumber(value, fallback)` from `validate.js`. Cap inputs to 12 characters.

**Formatting** - Use `formatCurrency()`, `formatNumber()`, `formatPercent()` from `format.js`. Returns em dash `—` for null/undefined/NaN.

**Loan calculations** - `loan-utils.js` contains `computeMonthlyPayment()`, `buildAmortizationSchedule()`, `calculateBuyToLet()`, etc.

## Testing

```bash
npm test              # Vitest unit tests
npm run test:e2e      # Playwright e2e tests (requires server on :8000)
npm run test:coverage # 80% threshold required
```

**Unit tests**: `tests/core/` and `tests/loans/` mirror `public/assets/js/core/`. Use Vitest with jsdom environment.

**E2E tests**: `tests/e2e/` with Playwright. Tests verify layout stability (no page bounce during navigation).

## UI Constraints

- **Fixed shell height**: `calc(100vh - 48px)` - content scrolls internally
- **Always-visible scrollbars**: Use `overflow-y: scroll` (not `auto`) + `scrollbar-gutter: stable`
- **Tables**: Full Excel-style grid borders, wrap in scrollable container, no currency symbols in cells
- **Theme tokens**: Accent `#2563eb`, borders `#e5e7eb`, body font `Trebuchet MS`

## Commands

```bash
npm run serve         # Python HTTP server on :8000
npm run lint          # ESLint for public/assets/js
npm run format        # Prettier for public/**
npm run validate      # lint + test + format:check
```

## File Naming

- Calculator folders: lowercase, hyphen-separated (`loan-emi`, `buy-to-let`)
- Each calculator folder contains: `index.html`, optional `module.js`, optional `calculator.css`, optional `explanation.html`

## Domain Rules

Before implementing any calculator, read its requirements file:
- Loans: `requirements/loans/{CALCULATOR}_RULES.md`
- Math: `requirements/math/*.md`

These contain acceptance criteria, edge cases, and calculation formulas.
