# Salary Calculator — UI Design Specification

Companion to `salary-calculator-build-checklist.md` (the authoritative task list),
`salary-calculator-tax-engine-spec.md`, and the two testing docs.

**Working mockup:** `mockup/salary-calculator-mockup.html` in this folder.
Serve locally with:

```bash
cd "docs/salary calculator/mockup"
python -m http.server 8090
# → http://localhost:8090/salary-calculator-mockup.html
```

The mockup is deliberately **outside `public/`** so it can never be deployed or crawled. It also
carries `<meta name="robots" content="noindex, nofollow">` as a second safeguard. (Precedent: the
orphaned `public/homepage-sample/` page found during the 2026-08 SEO audit was live and
unprotected for months — don't repeat that.)

Numbers in the mockup are illustrative. No tax engine is wired up.

---

## 1. Page structure (top to bottom)

```
┌─ Mode toggle:  [Gross Pay] [UK] [USA]  ───────────────────────┐
│                                                               │
├─ INPUTS (fixed 470px) ─┬─ RESULTS (fills remainder, sticky) ──┤
│  Amount                │  Hero take-home figure               │
│  Pay frequency chips   │  Stacked deduction bar + legend      │
│  Region / State        │  Period cards (mo/4wk/biwk/wk/hr)     │
│  Optional reveal chips │  ▸ See how this was calculated       │
│  [Calculate]           │                                      │
├────────────────────────┴──────────────────────────────────────┤
│  PAY SHEET — full width, frequency toggle, proper table       │
├───────────────────────────────────────────────────────────────┤
│  LONG-FORM CONTENT — 2,000–5,000 words                        │
└───────────────────────────────────────────────────────────────┘
```

## 2. Layout rules (confirmed 2026-08-23)

- **Fixed column widths.** Left input card is a fixed `470px`; the results card fills the
  remainder. Neither column resizes when optional panels open or close — the layout must not
  shift under the user. Implemented as `grid-template-columns: var(--col-left) minmax(0, 1fr)`
  with no JS-driven column changes.
- **Results card is sticky** (`position: sticky; top: 96px`). The input column grows tall when
  optional panels open; without stickiness this left a large dead gap down the right side.
- **Roomier spacing than the current page.** Container `1400px` (was 1180px), card padding
  `32px` (was 22px), long-form content padding `40px 48px`, input min-height `48px`.
- **Both cards carry `min-height: 560px`** so the initial view is balanced before any panels open.
- **Single-column stack below 1080px**, sticky disabled at that breakpoint.

## 3. Mode toggle

Three options: **`Gross Pay` · `UK` · `USA`**.

- `Gross Pay` reproduces today's behaviour exactly — hides region, state, filing status, all
  optional tax fields, the deduction bar, the effective-rate pill, and the pay sheet.
- `UK` reveals region chips (England / Wales / N. Ireland / Scotland).
- `USA` reveals the state typeahead and filing-status chips.
- Currency follows mode automatically: `formatCurrency(value, 'GBP' | 'USD')`.

Implemented via `data-only="gross|uk|us|tax"` attributes toggled in one place — no per-control
show/hide logic scattered through the file.

## 4. Progressive disclosure (the anti-"text dump" rule)

Default view shows **four controls only**: amount, pay frequency, mode, region/state.

Everything else sits behind dashed reveal chips that turn solid green when active:

| Chip | Reveals |
|---|---|
| `+ Bonus` | Bonus amount + **typical bonus month** dropdown |
| `+ Pension` | Contribution % |
| `+ Student loan` | Plan selector (1 / 2 / 4 / 5 / Postgraduate) |
| `+ Pay schedule` | First pay date + weekend-adjustment rule → **refines** the pay sheet |

Each chip opens only its own panel. A first-time user sees a simple form; someone modelling a
complex package can open everything.

## 5. State selector

Searchable typeahead, **not** a 51-item native `<select>`. Type "cali" → California in two
keystrokes. On selection, the hint line below updates to state a relevant fact, e.g.:

- No-tax states: *"Texas has no state income tax — federal + FICA only."*
- Others: *"State income tax for California will be included."*

**No default state.** The hint reads *"No state selected — required for an accurate estimate."*
until the user picks one (spec §8.4 — assuming a state silently produces a wrong number).

## 6. Results presentation

- **One hero number** (take-home pay), `clamp(2.5rem, 5vw, 4.1rem)`, weight 800.
- **Stacked horizontal bar** replacing prose: Net / Income tax / NI-FICA / Pension, with a
  legend showing each amount. Colours: net `#16a34a`, tax `#ef4444`, NI `#f59e0b`,
  pension `#6366f1`.
- **Period cards** — monthly, 4-weekly, bi-weekly, weekly, hourly as small support figures.
- **Effective-rate pill** top-right, kept visually distinct from marginal rate (which appears in
  the expanded breakdown) — conflating the two is a common user misunderstanding.
- **Local-tax disclaimer (USA mode only).** V1 ships without local/municipal income tax (B2
  decision — see checklist). Whenever USA mode is active, the results card must carry a visible
  line: *"Local income taxes may not be included in this estimate."* Placed near the result, not
  in footer text — a NYC or Philadelphia user needs to see it without scrolling, since their real
  take-home will be materially lower than shown.
  **Status: done (2026-08-24).** Amber `.local-note` band sitting directly under the deduction
  bar, above the period cards — `data-only="us"`, so it appears and disappears with the mode. It
  names NYC / Philadelphia / Detroit by way of example and links down to the full list in the US
  deductions card, which also carries a `Local and city income taxes` subsection + callout
  (§8.1 card 4). Two levels: at-a-glance next to the number, full detail in the content.
- **"See how this was calculated"** — `<details>`, collapsed by default, expands to the
  band-by-band breakdown: each tax band, the amount landing in it, every deduction, and the
  marginal rate. Satisfies tax-engine spec §13's auditability requirement without cluttering the
  default view.

### 6.1 Nothing in the results card is a fixed string

Bar widths, legend, period cards, breakdown bands, the effective-rate pill and the pay sheet's
column headers are **all rendered from one per-mode model object**. Switching mode has to change
currency symbol, terminology and figures *together* — a card that says `$71,284` next to the
label `NI` is worse than one that is merely wrong, because it looks authoritative while using
another country's vocabulary.

Terminology by mode:

| | UK | USA |
|---|---|---|
| Tax | Income tax | Federal + state tax |
| Insurance | NI | FICA |
| Retirement | Pension | 401(k) |
| Currency | `formatCurrency(v, 'GBP')` | `formatCurrency(v, 'USD')` |
| Date locale | `en-GB` | `en-US` |

Each model must satisfy `gross − tax − insurance − pension === net`, and the itemised breakdown
bands must sum to the same deduction total shown in the legend. The mockup asserts both — a
results card that does not reconcile with its own breakdown destroys trust the moment anyone
checks it.

## 7. Pay sheet

Full-width section at the **bottom**, above the long-form content.

### 7.1 Always visible (changed 2026-08-24)

The pay sheet was originally gated behind the `+ Pay schedule` chip. **That was wrong** — the pay
sheet is a headline feature of this calculator, and hiding it behind an optional chip meant most
visitors would calculate, see a number, and never discover it existed.

It now renders on first paint and after every calculation. To make that possible without asking
for input first, the first pay date **defaults to the next Friday** and the sheet carries a
dashed note above the table:

> Dates assume your first payday is **Fri, 28 Aug 2026**. [Set your actual pay date →]

The link opens the `+ Pay schedule` panel and focuses the date field. Once the user sets a real
date the note disappears. `+ Pay schedule` now *refines* the sheet rather than unlocking it.

**Columns:** `#` · `Pay date` · `Gross` · `<tax>` · `<insurance>` · `<pension>` · `Net pay`

The three deduction column headers are **not fixed strings** — they come from the active mode:

| Mode | Tax column | Insurance column | Pension column |
|---|---|---|---|
| UK | Income tax | NI | Pension |
| USA | Federal + state tax | FICA | 401(k) |
| Gross Pay | *hidden* | *hidden* | *hidden* |

In Gross Pay mode the sheet degrades to `#` · `Pay date` · `Gross` — "when do I get paid and how
much" is still a real question with no tax applied. Column hiding is done in CSS
(`#paySheet.is-gross [data-col="tax"]`) rather than JS so it survives every re-render.

**Default frequency follows the country** until the user picks one: Monthly for UK, Bi-weekly for
USA. Once they choose — via either the input-side pay frequency or the sheet's own toggle — their
choice sticks across mode changes.

### 7.2 Table details

- Proper `<thead>` with `scope="col"`, right-aligned numerics with `font-variant-numeric:
  tabular-nums`, `<tfoot>` carrying annual totals.
- Dates formatted with weekday, in the **mode's own locale**: `Fri, 4 Sept 2026` in UK mode,
  `Fri, Sep 4, 2026` in USA mode. The weekday is not decoration — the weekend-adjustment rule is
  illegible without it.
- **Weekend adjustment is applied to the dates**, not just offered as a setting. `Previous` moves
  a Saturday back 1 day and a Sunday back 2; `Next` moves them forward 2 and 1; `No adjustment`
  leaves them. A shifted row carries a small `MOVED` pill so the rule is visibly doing something.
  **Critical:** each period must be stepped from the *unadjusted* base date and adjusted only for
  display. Adjusting in place makes the shift compound and the schedule drifts further out every
  period.
- **Frequency toggle** (Weekly / Bi-weekly / 4-weekly / Monthly) defaults to whatever pay
  frequency is selected above, but can be switched independently — lets a bi-weekly-paid user
  see what a monthly rhythm would look like for budgeting.
- Period counts update with the toggle: 52 / 26 / 13 / 12.
- **Bonus row highlighting.** The payday falling in the selected bonus month is highlighted
  (`#fffbeb`) with a `BONUS` badge and shows the larger gross/net. The bonus is *not* smeared
  evenly across all periods — that's the behaviour most competing calculators get wrong.
- Shows next 12 paydays by default.

## 8. Long-form content

**Target: 2,000–5,000 words.** Mockup currently sits at ~2,619 in the DOM.

Ordering is **not a free choice** — `scripts/content-quality-thin-score.mjs` enforces it via
`validateRequiredBlockOrder()`: `How to Guide` → `FAQ` → `Important Notes`, with Important Notes
as the **last** heading on the page (the check is literally
`importantNotesIndex === headingCount - 1`). Violating this is a hard flag that fails the
content-quality gate.

### 8.1 One card per section (confirmed 2026-08-24)

The explanation is **not one long card**. It is nine sibling `<section class="card">` blocks, each
opening with an `<h2>` that matches its table-of-contents entry, with `<h3>` subsections inside.
This replaces the previous single-card wall of text.

| # | Card | Visibility |
|---|---|---|
| 1 | Salary and take-home pay: a complete guide (intro + TOC) | always |
| 2 | **How to Guide** — 6 steps | always |
| 3 | **UK deductions explained** | `data-only="uk"` |
| 4 | **US deductions explained** | `data-only="us"` |
| 5 | Pay, bonuses and your pay sheet | always |
| 6 | Worked examples | always (examples inside are mode-gated) |
| 7 | Common mistakes when comparing salaries | always |
| 8 | **FAQ** — 8 questions | always |
| 9 | **Important Notes** | always — **must stay last** |

CSS support: `.content .card + .card { margin-top: 22px }` for the stack, and a
`.content .card > h2 + *` margin reset so the first child sits flush under the card title.

### 8.2 Country sections follow the mode toggle

The UK and US deduction cards carry the same `data-only` attribute used by the input controls, so
`applyMode()` drives them with **zero additional JS** — one mechanism, not two. A `.card-tag` pill
(`UK MODE` / `USA MODE`) sits beside each card title so it is obvious why the card appears and
disappears.

Also mode-gated:

- **TOC entries** for the two country sections (`<li data-only="uk">` / `"us"`), so the contents
  list never links to a hidden card.
- **Worked examples** — England + Scotland under `data-only="uk"`, Texas vs California under
  `data-only="us"`, plus a short `data-only="gross"` line for Gross Pay mode so the card is never
  empty.

In Gross Pay mode **neither** country card shows, which is correct: no tax is applied.

**SEO note — this is presentation-only.** Both country sections stay in the DOM at all times and
are hidden with `display: none`, never removed. Crawlers and `content-quality-thin-score.mjs`
(which parses static HTML) see the full ~2,619 words regardless of mode; only ~2,183 are on screen
in UK mode. Do **not** "optimise" this into conditional rendering or lazy injection — that would
cut the indexable word count roughly in half and put the page back into thin-content territory.

`Important Notes` must contain all five keys the scorer checks (`Last updated:`, `Accuracy:`,
`Disclaimer:`, `Assumptions:`, `Privacy:`), a `Month YYYY` last-updated date, and the privacy
line verbatim: *"All calculations run locally in your browser - no data is stored."*

## 9. Formatting

`formatCurrency(value, currency)` in `public/assets/js/core/format.js` already handles symbol +
thousands separators + 2 decimals via `Intl`. Pass `'GBP'` or `'USD'` per mode — no new
formatting code needed.

Fix required: the **static pre-JS placeholder** numbers in the page template currently render
without a currency symbol. Only affects the no-JS/crawler view, but should carry the symbol.

## 10. Accessibility

- All chips are real `<button>` elements with `aria-pressed`, inside `role="group"` containers
  with `aria-label`.
- Typeahead needs keyboard support (arrow keys + Enter) before ship — the mockup is
  mouse-only.
- Every input has an associated `<label for>`.
- The `<details>` breakdown is natively keyboard-accessible.
- Verify with `@axe-core/playwright` (installed 2026-08-23) — see QA strategy §11.

## 11. Open design questions

- [ ] Left column fixed at `470px` — confirm, or adjust?
- [ ] Should the pay sheet be printable / CSV-exportable? (Not in the mockup; would be a natural
      companion to "Copy summary".)
