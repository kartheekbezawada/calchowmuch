# Explanation Pane — Universal Standard (All Calculators)

**Doc ID:** UI-EXP-PANE-STD  
**Status:** Mandatory  
**Applies to:** Every calculator page  
**Owner:** Platform / UI Governance  
**Goal:** Consistent UX + SEO-friendly content + agent-implementable structure

---

## 0) Definitions

- **Calculation Pane:** The inputs UI (and any live input validation).
- **Calculator Engine:** Logic producing outputs from inputs.
- **Explanation Pane:** The narrative + tables + FAQs that explain results.
- **Dynamic:** Uses actual user input/output values (no hardcoded sample values).

---

## 1) Governance & Placement

### 1.1 Single Source of Truth

**File path (mandatory):**

### 1.2 Universal Requirements Linkage

Universal Requirements MUST include a clause that references this document as mandatory (see §10).

---

## 2) Mandatory Section Order & Heading Hierarchy

### 2.1 Non-Negotiable Layout (Order is fixed)

Every Explanation Pane MUST render the following sections in this exact order:

1. **H2:** Summary (dynamic, intent-first)
2. **H3:** Scenario Summary
3. **H3:** Results Table (Universal Table Standard)
4. **H3:** Explanation (plain language)
5. **H3:** Frequently Asked Questions (FAQ)

### 2.2 Heading Rules

- Only the **main Summary** uses **H2**
- All other sections use **H3**
- No additional headings (H4/H5/etc.) inside Explanation Pane
- Do not change the order

**Rule IDs**

- EXP-STRUCT-1 — Section order must match §2.1 (P0)
- EXP-STRUCT-2 — Summary must be H2 and only one H2 in pane (P0)
- EXP-STRUCT-3 — All other section headers must be H3 (P0)
- EXP-STRUCT-4 — No extra headings/sections allowed (P0)

---

## 3) Heading Styling Contract (H2 + H3) — Mandatory CSS

### 3.1 Requirement

All Explanation Pane section headings (H2 and H3) MUST use the shared styling contract:

- Bottom border line
- Bottom padding
- Relative positioning
- Decorative `::after` element anchored to left

### 3.2 CSS Contract (Shared)

Implement in shared CSS (site-wide), not page-specific CSS.

```css
/* Explanation Pane headings (H2 + H3) */
#loan-mtg-explanation h2,
#loan-mtg-explanation h3 {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 6px;
  position: relative;
}

/* Decorative after element (must exist for H2 as baseline) */
#loan-mtg-explanation h2::after {
  content: '';
  position: absolute;
  left: 0;
  /* NOTE: Additional styling may be defined in theme tokens if needed:
     e.g., bottom: -1px; height: 2px; width: 48px; background: var(--accent); */
}

```

### 3.3 H2 Top Margin Alignment (Mandatory)

To align Explanation H2 with Calculation Pane H1, the Explanation Pane H2 MUST have top margin removed.

```css
/* Align Explanation Pane H2 with Calculation Pane H1 */
.calculator-ui h2 {
  margin-top: 0;
}

```

**Rule IDs**

- EXP-HDR-STYLE-1 — H2/H3 must have border-bottom + padding-bottom + relative (P0)
- EXP-HDR-STYLE-2 — H2 must define a ::after pseudo-element anchored left (P1)
- EXP-HDR-ALIGN-1 — Explanation H2 top margin must be 0 via shared CSS (P0)
- EXP-HDR-STYLE-3 — Styling must be shared/global, not per calculator (P1)

---

## 4) H2 — Summary (Dynamic, intent-first)

### 4.1 Requirements

- Must be H2
- Length: 2–3 sentences
- Must reference both:
  - At least 2 key inputs from Calculation Pane
  - At least 1 key output from Calculator Engine
- Must include an interpretation or “what this means” statement
- Must be user-specific (no generic-only summary)
- No static sample values

**Rule IDs**

- EXP-SUM-1 — Summary length 2–3 sentences (P0)
- EXP-SUM-2 — Include ≥2 inputs and ≥1 output (P0)
- EXP-SUM-3 — Must include an interpretation sentence (P1)
- EXP-SUM-4 — No static sample values (P0)

### 4.2 Agent Template (Pattern Only)

Use calculator-defined variables:
```css
“Based on your inputs of {INPUT_A}, {INPUT_B}, and {INPUT_C}, your estimated result is {OUTPUT_X} over {TIME_OR_TERM}. This suggests {INSIGHT}.”
```
---

## 5) H3 — Scenario Summary (Compact table from inputs/outputs)

### 5.1 Requirements

- Must be H3
- Must present a compact table summarizing scenario
- Table rows MUST be derived from:
  - Calculation Pane inputs (selected key fields)
  - Key outputs (selected key results)
- No static values

### 5.2 Mandatory Table Columns

    Category Value Source
    Input / Output {VALUE} Calculation Pane / Calculator Engine

**Rule IDs**

- EXP-SCEN-1 — Scenario table required (P0)
- EXP-SCEN-2 — Uses mandatory columns exactly (P0)
- EXP-SCEN-3 — All values dynamic (P0)

---

## 6) H3 — Results Table (Universal Table Standard)

### 6.1 Requirements

- Must be H3
- Must use the universal results schema below
- Agents MUST populate from calculator outputs (no static placeholders at runtime)

### 6.2 Mandatory Results Schema

    Metric Value Unit Explanation
    {METRIC_1} {VALUE} {UNIT} Short meaning
    {METRIC_2} {VALUE} {UNIT} Short meaning
    {METRIC_3} {VALUE} {UNIT} Short meaning
    {METRIC_4} {VALUE} {UNIT} Short meaning

**Rule IDs**

- EXP-RES-1 — Must use the mandatory schema (P0)
- EXP-RES-2 — No ad-hoc columns allowed (P0)
- EXP-RES-3 — Explanation text ≤ 12 words per row (P1)
- EXP-RES-4 — Values must be calculator outputs (P0)

---

## 7) H3 — Explanation (Plain language narrative)

### 7.1 Requirements

This section must:

- Be clear and non-technical
- Explain why the result makes sense
- Reference at least two metrics from Results Table
- Avoid formulas unless strictly required
- Avoid country/currency-specific assumptions unless explicitly localized

**Rule IDs**

- EXP-TEXT-1 — Plain language required (P0)
- EXP-TEXT-2 — References ≥2 Results metrics (P1)
- EXP-TEXT-3 — Avoid formulas unless required (P2)
- EXP-TEXT-4 — No country-specific assumptions by default (P1)

---

## 8) H3 — Frequently Asked Questions (FAQ)

### 8.1 Requirements (Content)

- Section header must be H3: “Frequently Asked Questions”
- Exactly 10 FAQs per calculator
- Questions must be SEO-friendly and match user intent
- Answers must be concise and structured
- No informal language/emojis

**Rule IDs**

- EXP-FAQ-1 — Exactly 10 FAQs (P0)
- EXP-FAQ-2 — SEO-friendly questions (P1)
- EXP-FAQ-3 — No informal language/emojis (P1)

### 8.2 Requirements (Layout / Styling)

No underline under the H3 header (note: the universal border-bottom is allowed; do not add text underline)

**Spacing**:
- 6px gap between H3 header and first FAQ box
- 6px gap between FAQ boxes
- Each FAQ must be in a bordered container
- Each FAQ must have consistent indentation:
- Q: bolded
- A: indented
- Rule IDs
  - EXP-FAQ-UI-1 — No text underline for FAQ H3 (P1)
  - EXP-FAQ-UI-2 — 6px gap after H3 and between boxes (P0)
  - EXP-FAQ-UI-3 — Each FAQ must be in bordered container (P0)
  - EXP-FAQ-UI-4 — Q/A indentation required (P1)

### 8.3 FAQ Container Contract

Each FAQ must render as:

Q: [Question]

A: [Answer line 1]
[Answer continuation lines aligned]

### 8.4 Reference CSS Contract

FAQ container must be wrapped in .faq-box:

.faq-box {
  border: 1px solid var(--border);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px; /*allowed if it still yields 6px visual gap per design*/
}

1) Universal Table Rules (UTBL-*) — Embedded Standard

All tables in the Explanation Pane (Scenario Summary and Results Table) MUST comply with UTBL rules.

## Tables

- **9.1 Table Structure**
  - **UTBL-STRUCT-1 (P0):** Semantic HTML tables required: `<table>`, `<thead>`, `<tbody>`, `<tfoot>`.
  - **UTBL-STRUCT-2 (P0):** Header row required inside `<thead>`.
  - **UTBL-STRUCT-3 (P1):** Totals/summaries must be in `<tfoot>`, not body rows.

- **9.2 Table Borders**
  - **UTBL-BORDER-1 (P0):** Full outer border on all four sides.
  - **UTBL-BORDER-2 (P0):** Full grid lines between all columns and rows.
  - **UTBL-BORDER-3 (P1):** Grid lines visually consistent (no missing separators).
  - **UTBL-BORDER-4 (P1):** Excel-style layout, not "card" or "list".

- **9.3 Table Scroll Behavior**
  - **UTBL-SCROLL-1 (P0):** Every table wrapped in dedicated container.
  - **UTBL-SCROLL-2 (P0):** Vertical and horizontal scrollbars enabled by default.
  - **UTBL-SCROLL-3 (P1):** Scrollbars visible even if content fits.
  - **UTBL-SCROLL-4 (P0):** Tables must never expand page height.

- **9.4 Table Size & Containment**
  - **UTBL-SIZE-1 (P0):** Tables must not control page layout.
  - **UTBL-SIZE-2 (P0):** Table height constrained by parent pane.
  - **UTBL-SIZE-3 (P1):** Overflow: `overflow-x: scroll`, `overflow-y: scroll`.
  - **UTBL-SIZE-4 (P1):** Readable at standard desktop widths.

- **9.5 Header & Footer**
  - **UTBL-HEADER-1 (P1):** Headers visually distinct from body rows.
  - **UTBL-HEADER-2 (P1):** Headers aligned with columns during horizontal scroll.
  - **UTBL-HEADER-3 (P2):** Sticky headers allowed but must not overlap content.
  - **UTBL-FOOTER-1 (P1):** Footer rows (totals) visually distinct from body rows.

- **9.6 Text Formatting**
  - **UTBL-TEXT-1 (P1):** No cell wrapping (`white-space: nowrap`).
  - **UTBL-TEXT-2 (P1):** Numeric columns right-aligned.
  - **UTBL-TEXT-3 (P1):** Concise, unambiguous headers.
  - **UTBL-TEXT-4 (P2):** Body text 14–15px, headers 13–14px.
  - **UTBL-TEXT-5 (P1):** No currency symbols in cells—establish in headers.
  - **UTBL-TEXT-6 (P2):** Consistent decimal precision; padding ≥ 8px 12px.

- **9.7 Visual Consistency**
  - **UTBL-STYLE-1 (P1):** All tables use same base styling.
  - **UTBL-STYLE-2 (P0):** No custom border styles outside universal theme.
  - **UTBL-STYLE-3 (P2):** Match other components visually.

- **9.8 Forbidden**
  - **UTBL-FORBID-1 (P0):** List-style tables (rows without borders).
  - **UTBL-FORBID-2 (P0):** Plain text block tables.
  - **UTBL-FORBID-3 (P0):** Tables relying on page scrolling.
  - **UTBL-FORBID-4 (P0):** Borderless data tables.

- **9.9 Accessibility**
  - **UTBL-ACCESS-1 (P1):** Keyboard-scrollable.
  - **UTBL-ACCESS-2 (P1):** Screen readers identify headers/data cells correctly.

- **9.10 Table Pass/Fail Criteria**
  - **FAIL:** Borders missing on any side.
  - **FAIL:** Grid lines missing between rows/columns.
  - **FAIL:** Scrollbars not visible by default.
  - **FAIL:** Table expands page height.
  - **FAIL:** Headers/totals mixed into body rows.
  - **PASS:** All UTBL-* rules pass.

## 10) Mandatory Universal Requirements Clause (Copy/Paste)

Add the following clause into UNIVERSAL_REQUIREMENTS.md:

EXPLANATION PANE RULE (MANDATORY):
All calculators MUST implement the Explanation Pane exactly as defined in requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md, including:

H2 Summary (dynamic, 2–3 lines; uses inputs + outputs)

H3 Scenario Summary (table from Calculation Pane inputs + key outputs)

H3 Results Table (mandatory schema + UTBL-* compliance)

H3 Explanation (plain English; references ≥2 metrics)

H3 Frequently Asked Questions (exactly 10 FAQs; each in bordered container; required spacing)

Heading styling contract in §3 (H2/H3 border-bottom + ::after + H2 margin-top alignment)

1) Compliance Checklist (Build Gate)

A calculator page FAILS review if any of the following are true:

 Missing H2 Summary or it is not dynamic

 Scenario Summary missing or wrong columns

 Results Table deviates from mandatory schema

 UTBL-* table requirements violated

 Explanation does not reference ≥2 metrics

 FAQ count != 10

 Any FAQ is not in a bordered container

 Extra headings/sections exist in Explanation Pane

 Heading styling contract not implemented (H2/H3 + H2 top margin = 0)
