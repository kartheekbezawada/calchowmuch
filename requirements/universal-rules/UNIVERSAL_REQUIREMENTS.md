## Universal Contract (Read First)

This file is the single source of truth for universal requirements. Rule IDs below remain authoritative.

How to read this file:

- Always read: Document Control (DC-*), Authority/Precedence (AP-*), Folder/URL integrity (FS-*, DOC-SITEMAP-*), and any P0 “Never” rules (NEVER-*).
- Read other sections only when triggered by the change. Do not scan the whole document by default.
- Use Rule IDs in all reviews, tracker notes, issues, and compliance evidence.



## Section Loading Map (Trigger-Based)

Always load (P0 core):

- DC-* Document Control
- AP-* Authority/Precedence
- FS-* Folder structure contract
- DOC-SITEMAP-* Sitemap coverage
- NEVER-* Hard never-do rules

Load only if triggered:

- UI-* / UTBL-* / UIGRAPH-* when UI, tables, or graphs change
- TEST-* when selecting or changing tests
- SEO-* when URLs/metadata/content change
- DIAG-* / AGENT-* only when diagnosing failures or environment issues




**Use case:** Humans + LLM reviewers (Claude/Codex) must be able to cite an exact rule ID when something is violated.

---

## Quick Reference â€” Rule ID Tables

### Document Control


| Rule ID | Requirement                                                       | Severity |
| --------- | ------------------------------------------------------------------- | ---------- |
| DC-0.1  | This file is the canonical universal requirements document        | P0       |
| DC-0.2  | Rules apply to ALL calculators, ALL phases, ALL PRs               | P0       |
| DC-0.3  | Review comments must reference rule IDs (e.g.,`UI-2.3`, `FS-3.1`) | P1       |
| DC-0.4  | If older documents conflict, this file governs                    | P0       |

### Product Intent


| Rule ID | Requirement                                                                                           | Severity |
| --------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| PI-1.1  | Modular, high-performance, SEO-friendly calculator platform                                           | P1       |
| PI-1.2  | Target users: general users, students, financially conscious, search users                            | P2       |
| PI-1.3  | Value: one calculator = one question, simple UI, static explanations, fast load, modular architecture | P1       |

### Authority and Precedence


| Rule ID | Requirement                                                       | Severity |
| --------- | ------------------------------------------------------------------- | ---------- |
| AP-2.1  | This file governs if anything conflicts                           | P0       |
| AP-2.2  | Phase requirements add scope but must not violate universal rules | P0       |
| AP-2.3  | Documentation must reflect actual repository state                | P1       |

### Excluded Page Types


| Rule ID | Requirement                                                                                                           | Severity |
| --------- | ----------------------------------------------------------------------------------------------------------------------- | ---------- |
| EXCL-1.1 | General Terms Excluded Pages (GTEP) must not use calculator shell layout regions (top nav, left nav, calc/explanation panes, ads). | P0       |
| EXCL-1.2 | GTEP pages must be plain HTML-first and crawlable.                                                                     | P0       |
| EXCL-1.3 | GTEP pages must have internal scrolling and must not depend on calculator navigation state.                           | P0       |
| EXCL-1.4 | GTEP pages must not load calculator-specific JS modules.                                                               | P0       |

---

## Table of Contents

0. [Document Control](#0-document-control)
1. [Product Intent](#1-product-intent)
2. [Authority and Precedence](#2-authority-and-precedence)
3. [Universal UI Contract](#3-universal-ui-contract)
4. [Universal Layout and Architecture Boundaries](#4-universal-layout-and-architecture-boundaries)
5. [Folder Structure Contract](#5-folder-structure-contract)
6. [Coding Standards](#6-coding-standards)
7. [Testing Standards](#7-testing-standards)
8. [SEO and URL Rules](#8-seo-and-url-rules)
9. [Inventory and Documentation Accuracy](#9-inventory-and-documentation-accuracy)
10. [PR and Phase Workflow](#10-pr-and-phase-workflow)
11. [Hard "Never Do" Rules](#11-hard-never-do-rules)
12. [Definition of Done](#12-definition-of-done)
13. [How to Report Violations](#13-how-to-report-violations)
14. [Agent Diagnostic Command Requirements](#14-agent-diagnostic-command-requirements)
15. [Agent Environment and Cache Policy](#15-agent-environment-and-cache-policy)

---

## 0) Document Control


| Rule ID | Requirement                                                                                  |
| --------- | ---------------------------------------------------------------------------------------------- |
| DC-0.1  | **Single source of truth** â€” This file is the canonical universal requirements document |
| DC-0.2  | **Applies everywhere** â€” These rules apply to ALL calculators, ALL phases, ALL PRs      |
| DC-0.3  | **Rule IDs are mandatory** â€” Any review comment must reference one or more rule IDs     |
| DC-0.4  | **Ignore duplicates elsewhere** â€” If older documents conflict, this file governs        |

---

## 1) Product Intent


| Rule ID | Requirement                                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PI-1.1  | **What this project is** â€” A modular, high-performance, SEO-friendly calculator platform answering real-world "How much?" questions using transparent logic |
| PI-1.2  | **Target users** â€” general users, students/learners, financially conscious users, search users from long-tail intent                                        |
| PI-1.3  | **Value proposition** â€” One calculator = one focused question; Simple UI; Static explanations build trust + SEO; Fast load times; Modular architecture      |

---

## 2) Authority and Precedence


| Rule ID | Requirement                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------- |
| AP-2.1  | **This file governs** â€” If anything conflicts, this document wins                                 |
| AP-2.2  | **Universal vs Phase** â€” Phase requirements add new scope, but must not violate universal rules   |
| AP-2.3  | **Repo truth beats assumptions** â€” Documentation and reviews must reflect actual repository state |

---


## 3) Universal UI Contract


## UI & Interaction Principles


**See also:** [ISS-UI-FDP — Form Density & Progressive Disclosure Rules](../rules/iss/ISS-UI-FDP.md)

### Traceability: Universal Requirements ↔ ISS Enforcement

| Universal Requirement | Severity | Enforced By (ISS Rule IDs) |
|----------------------|----------|---------------------------|
| UUI-FDP-001 Core inputs should not require mandatory scroll | P0 | ISS-UI-FDP-001, ISS-UI-FDP-005 |
| UUI-FDP-002 Optional inputs must not block calculation | P0 | ISS-UI-FDP-002 |
| UUI-FDP-003 Use progressive disclosure when input set is large | P0 | ISS-UI-FDP-003 |
| UUI-FDP-004 Row efficiency for related inputs | P1 | ISS-UI-FDP-004 |
| UUI-FDP-006 Density must not remove clarity/labels | P0 | ISS-UI-FDP-006 |
| UUI-FDP-007 Layout stability under interaction | P0 | ISS-UI-FDP-007 |

### Form Density & Progressive Disclosure (Calculation Pane)

The public calculation-pane form density and ISS expectations are centralized in `requirements/universal-rules/iss_form_density_calculation_pane_rules.md`. That document is now the authoritative source for UUI-FDP/ISS rules (core inputs above the fold, optional sections, progressive disclosure, row efficiency, layout stability, etc.). When reviewing or updating calculation panes, cite and follow the canonical file rather than restating the requirements here; this section remains to highlight the intent and traceability links.

### 3.1 Theme Tokens


| Rule ID | Category   | Token                  | Value                      |
| --------- | ------------ | ------------------------ | ---------------------------- |
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

### 3.2 Components


| Rule ID | Requirement                                                                                                                                                        | Severity |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| UI-2.1  | Use shared button classes only (`.calculator-button`). Primary: accent bg, white text, `font-weight: 600`. Secondary: `#e2e8f0` bg, dark text. No custom palettes. | P0       |
| UI-2.2  | Buttons must not wrap. Enforce`white-space: nowrap`.                                                                                                               | P1       |
| UI-2.3  | Use shared input classes/tokens. Must have labels. Must validate all input.                                                                                        | P0       |
| UI-2.4  | Input values limited to**12 characters**. For `type="text"`: use `maxlength="12"`. For `type="number"`: enforce via JS.                                            | P1       |
| UI-2.5  | **No dropdowns** â€” `select` elements not allowed. Replace with button groups / segmented controls.                                                            | P0       |

### 3.3 Layout Contract

Applies to calculator shell pages only. GTEP pages are excluded per EXCL-1.


| Rule ID | Requirement                                                                                                                            | Severity |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| UI-3.1  | **Fixed-height shell** â€” Layout must not exceed Basic Calculator baseline. Constrain to `100vh`.                                  | P0       |
| UI-3.2  | **Internal scrolling** â€” Left nav, calculation pane, explanation pane must scroll internally.                                     | P0       |
| UI-3.3  | **No horizontal scroll** â€” Common desktop widths must not introduce horizontal scroll.                                            | P1       |
| UI-3.4  | **Frameless header + primary nav** â€” No bordered panel or background card.                                                        | P1       |
| UI-3.5  | **Minimal footer links** â€” Link-only, 15px size, underline, minimal padding.                                                      | P2       |
| UI-3.6  | **Clean navigation hierarchy** â€” Navigation elements without visual containers, button-only styling for optimal space utilization | P1       |

### 3.4 Scrollbar Styling


| Rule ID | Requirement                                                                                                                          | Value                 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| UI-4.1  | Thumb color                                                                                                                          | `#94a3b8` (slate-400) |
| UI-4.1  | Thumb hover                                                                                                                          | `#64748b` (slate-500) |
| UI-4.1  | Track color                                                                                                                          | `#f1f5f9` (slate-100) |
| UI-4.1  | Width                                                                                                                                | 8px                   |
| UI-4.2  | **Always visible** â€” Use `overflow-y: scroll` and `scrollbar-gutter: stable`                                                    | P1                    |
| UI-4.3  | **Styling** â€” WebKit: `::-webkit-scrollbar-*`. Firefox: `scrollbar-width: thin`, `scrollbar-color`. Thumb `border-radius: 4px`. | P2                    |

### 3.5 Toggle Components


| Rule ID | Requirement                                                                 | Severity |
| --------- | ----------------------------------------------------------------------------- | ---------- |
| UITGL-1 | Use button groups, not dropdowns                                            | P0       |
| UITGL-2 | Toggle state must be visually obvious                                       | P1       |
| UITGL-3 | Toggles must not change page height or shell size                           | P0       |
| UITGL-4 | Toggle interaction must update all dependent UI (tables, graphs, summaries) | P1       |

### 3.6 Tables (Universal)

**Scope:** ALL tables everywhere â€” calculation panes, explanation panes, amortization, comparison, summary. No exceptions.

#### Table Structure


| Rule ID       | Requirement                                                              | Severity |
| --------------- | -------------------------------------------------------------------------- | ---------- |
| UTBL-STRUCT-1 | Semantic HTML tables required:`<table>`, `<thead>`, `<tbody>`, `<tfoot>` | P0       |
| UTBL-STRUCT-2 | Header row required inside`<thead>`                                      | P0       |
| UTBL-STRUCT-3 | Totals/summaries MUST be in`<tfoot>`, not body rows                      | P1       |

#### Table Borders


| Rule ID       | Requirement                                            | Severity |
| --------------- | -------------------------------------------------------- | ---------- |
| UTBL-BORDER-1 | Full outer border on all four sides                    | P0       |
| UTBL-BORDER-2 | Full grid lines between all columns and rows           | P0       |
| UTBL-BORDER-3 | Grid lines visually consistent (no missing separators) | P1       |
| UTBL-BORDER-4 | Excel-style layout, not "card" or "list"               | P1       |

#### Table Scroll Behavior


| Rule ID       | Requirement                                           | Severity |
| --------------- | ------------------------------------------------------- | ---------- |
| UTBL-SCROLL-1 | Every table wrapped in dedicated container            | P0       |
| UTBL-SCROLL-2 | Vertical and horizontal scrollbars enabled by default | P0       |
| UTBL-SCROLL-3 | Scrollbars visible even if content fits               | P1       |
| UTBL-SCROLL-4 | Tables must never expand page height                  | P0       |

#### Table Size & Containment


| Rule ID     | Requirement                                         | Severity |
| ------------- | ----------------------------------------------------- | ---------- |
| UTBL-SIZE-1 | Tables must NOT control page layout                 | P0       |
| UTBL-SIZE-2 | Table height constrained by parent pane             | P0       |
| UTBL-SIZE-3 | Overflow:`overflow-x: scroll`, `overflow-y: scroll` | P1       |
| UTBL-SIZE-4 | Readable at standard desktop widths                 | P1       |

#### Table Header & Footer


| Rule ID       | Requirement                                           | Severity |
| --------------- | ------------------------------------------------------- | ---------- |
| UTBL-HEADER-1 | Headers visually distinct from body rows              | P1       |
| UTBL-HEADER-2 | Headers aligned with columns during horizontal scroll | P1       |
| UTBL-HEADER-3 | Sticky headers allowed but must not overlap content   | P2       |
| UTBL-FOOTER-1 | Footer rows (totals) visually distinct from body rows | P1       |

#### Table Text Formatting


| Rule ID     | Requirement                                                  | Value/Severity             |
| ------------- | -------------------------------------------------------------- | ---------------------------- |
| UTBL-TEXT-1 | No cell wrapping                                             | `white-space: nowrap` / P1 |
| UTBL-TEXT-2 | Numeric columns right-aligned                                | P1                         |
| UTBL-TEXT-3 | Concise, unambiguous headers                                 | P1                         |
| UTBL-TEXT-4 | Body text 14-15px, headers 13-14px                           | P2                         |
| UTBL-TEXT-5 | **No currency symbols** in cells â€” establish in headers | P1                         |
| UTBL-TEXT-6 | Consistent decimal precision, padding`8px 12px` min          | P2                         |

#### Table Visual Consistency


| Rule ID      | Requirement                                     | Severity |
| -------------- | ------------------------------------------------- | ---------- |
| UTBL-STYLE-1 | All tables use same base styling                | P1       |
| UTBL-STYLE-2 | No custom border styles outside universal theme | P0       |
| UTBL-STYLE-3 | Match other components visually                 | P2       |

#### Table Forbidden


| Rule ID       | Forbidden Item                           | Severity |
| --------------- | ------------------------------------------ | ---------- |
| UTBL-FORBID-1 | List-style tables (rows without borders) | P0       |
| UTBL-FORBID-2 | Plain text block tables                  | P0       |
| UTBL-FORBID-3 | Tables relying on page scrolling         | P0       |
| UTBL-FORBID-4 | Borderless data tables                   | P0       |

#### Table Accessibility


| Rule ID       | Requirement                                          | Severity |
| --------------- | ------------------------------------------------------ | ---------- |
| UTBL-ACCESS-1 | Keyboard-scrollable                                  | P1       |
| UTBL-ACCESS-2 | Screen readers identify headers/data cells correctly | P1       |

#### Table Pass/Fail Criteria


| Condition                               | Result |
| ----------------------------------------- | -------- |
| Borders missing on any side             | FAIL   |
| Grid lines missing between rows/columns | FAIL   |
| Scrollbars not visible by default       | FAIL   |
| Table expands page height               | FAIL   |
| Headers/totals mixed into body rows     | FAIL   |
| All UTBL-* rules pass                   | PASS   |

### 3.7 Graphs and Visualizations


| Rule ID   | Requirement                                       | Severity |
| ----------- | --------------------------------------------------- | ---------- |
| UIGRAPH-1 | Fixed-height container                            | P0       |
| UIGRAPH-2 | Must not increase page height                     | P0       |
| UIGRAPH-3 | Reactive to state changes (inputs, toggles)       | P1       |
| UIGRAPH-4 | Horizontal scrolling allowed (`overflow-x: auto`) | P2       |
| UIGRAPH-5 | X-axis and Y-axis labels required                 | P1       |
| UIGRAPH-6 | Axis value markers at meaningful intervals        | P1       |
| UIGRAPH-7 | Legend required for multiple data series          | P1       |

### 3.8 Content Placement Rules


| Rule ID   | Requirement                                                                                                                                                        | Severity |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| UIPLACE-1 | **Tables in Explanation Pane** â€” All data tables (results, comparisons, amortization) must be placed in Explanation Pane, never in Calculation Pane           | P0       |
| UIPLACE-2 | **Graphs in Explanation Pane** â€” All graphs, charts, visualizations must be placed in Explanation Pane, never in Calculation Pane                             | P0       |
| UIPLACE-3 | **Calculation Pane for Inputs/Results Only** â€” Calculation Pane limited to input fields, buttons, and simple result displays (single values, brief summaries) | P0       |
| UIPLACE-4 | **Complex Output Segregation** â€” Multi-row tables, step-by-step breakdowns, detailed explanations belong in Explanation Pane                                  | P1       |
| UIGRAPH-3 | Reactive to state changes (inputs, toggles)                                                                                                                        | P1       |
| UIGRAPH-4 | Horizontal scrolling allowed (`overflow-x: auto`)                                                                                                                  | P2       |
| UIGRAPH-5 | X-axis and Y-axis labels required                                                                                                                                  | P1       |
| UIGRAPH-6 | Axis value markers at meaningful intervals                                                                                                                         | P1       |
| UIGRAPH-7 | Legend required for multiple data series                                                                                                                           | P1       |

---

## Navigation Architecture (Authoritative)

- Calculator pages MUST be implemented as Multi-Page Application (MPA).
- Calculator navigation MUST use standard `<a href>` links.
- Full page reloads are REQUIRED when switching calculators.
- SPA-style routing (hash routing, history.pushState, dynamic content swapping)
  is NOT permitted for calculators.
- Each calculator MUST be a standalone HTML document with its own ads,
  metadata, and explanation content.

---

## 4) Universal Layout and Architecture Boundaries

### EXCL-1 Excluded Page Types (P0)

| Rule ID  | Requirement                                                                                                  | Severity |
| ---------- | -------------------------------------------------------------------------------------------------------------- | ---------- |
| EXCL-1.1 | General Terms Excluded Pages (GTEP) must not use calculator shell layout regions (top nav, left nav, calc/explanation panes, ads). | P0       |
| EXCL-1.2 | GTEP pages must be plain HTML-first and crawlable.                                                            | P0       |
| EXCL-1.3 | GTEP pages must have internal scrolling and must not depend on calculator navigation state.                  | P0       |
| EXCL-1.4 | GTEP pages must not load calculator-specific JS modules.                                                      | P0       |

The UI rules below describe the **calculator container framework** for calculator pages only.
GTEP pages are explicitly excluded per EXCL-1 and must not be forced into the calculator shell.

### 4.1 Page Regions


| Rule ID  | Region                      | Purpose                    |
| ---------- | ----------------------------- | ---------------------------- |
| ARCH-1.1 | Global Header               | Site-wide header           |
| ARCH-1.1 | Primary Category Navigation | Domain switching           |
| ARCH-1.1 | Left Navigation Pane        | Calculator selector        |
| ARCH-1.1 | Main Calculation Pane       | Calculator inputs/results  |
| ARCH-1.1 | Explanation Pane            | Static explanation content |
| ARCH-1.1 | Right Monetization Panes    | Ads (stable containers)    |
| ARCH-1.1 | Footer                      | Site-wide footer           |

### 4.1.1 Pane Width Distribution (Universal Requirement)


| Rule ID  | Requirement                                                                                                                                    | Severity |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| ARCH-1.2 | **Calculation Pane width reduction** â€” Main Calculation Pane must reduce width by 25% from its right edge                                 | P0       |
| ARCH-1.3 | **Explanation Pane width increase** â€” Explanation Pane must increase width by 25% to occupy the space released by Calculation Pane        | P0       |
| ARCH-1.4 | **Width transfer direction** â€” Width reduction must occur from Calculation Pane's right edge toward left; Explanation Pane grows leftward | P0       |
| ARCH-1.5 | **Total width preserved** â€” Combined width of Calculation Pane + Explanation Pane must remain unchanged; only the split ratio changes     | P0       |
| ARCH-1.6 | **Responsive behavior** â€” Width ratios must be maintained across all supported viewport widths                                            | P1       |
| ARCH-1.7 | **Navigation elements styling** â€” Math/Loans buttons and header text must not have border/box styling (clean button-only appearance)      | P0       |
| ARCH-1.8 | **Footer positioning** â€” Footer links (Privacy, Terms, Contact) must be positioned to maximize vertical content space                     | P1       |
| ARCH-1.9 | **Horizontal layout preservation** â€” No horizontal spacing or sizing changes during vertical optimizations                                | P0       |

#### Pane Width Specification


| Pane                  | Previous Ratio | New Ratio | Change          |
| ----------------------- | ---------------- | ----------- | ----------------- |
| Main Calculation Pane | 50%            | 37.5%     | -25% (relative) |
| Explanation Pane      | 50%            | 62.5%     | +25% (relative) |

#### Implementation Notes


| Aspect                 | Requirement                                                       |
| ------------------------ | ------------------------------------------------------------------- |
| CSS Implementation     | Use`flex-basis`, `width`, or CSS Grid `fr` units to achieve ratio |
| Breakpoint consistency | Ratio must apply at desktop widths (â‰¥1024px)                 |
| No shell height change | Width redistribution must not affect page shell height (UI-3.1)   |
| Internal scrolling     | Both panes must continue to scroll internally (UI-3.2)            |

### 4.2 Responsibility Boundaries


| Rule ID  | Boundary          | Requirement                                                      | Severity |
| ---------- | ------------------- | ------------------------------------------------------------------ | ---------- |
| ARCH-2.1 | Layout Shell      | Contains header/footer/panes/ads. No calculator-specific logic.  | P0       |
| ARCH-2.2 | Navigation        | Config-driven. No hard-coded calculator lists.                   | P0       |
| ARCH-2.3 | Calculator Module | Owns inputs/compute/results/explanation.                         | P1       |
| ARCH-2.4 | Shared Utilities  | Live in`/public/assets/js/core/`. No duplication in calculators. | P1       |
| ARCH-2.5 | Ads Isolation     | Load async, no layout shift (CLS).                               | P1       |

### 4.3 Navigation and Switching


| Rule ID  | Requirement                                                                                                | Severity |
| ---------- | ------------------------------------------------------------------------------------------------------------ | ---------- |
| ARCH-3.1 | **Deep-linking** â€” Each calculator addressable by URL. Switching updates URL, title, meta, canonical. | P0       |
| ARCH-3.2 | **One active calculator** â€” Only active calculator's UI + logic runs.                                 | P0       |

### 4.4 Explanation Pane Rules


| Rule ID          | Requirement                                                                            | Severity |
| ------------------ | ---------------------------------------------------------------------------------------- | ---------- |
| ARCH-4.1         | **Crawlable** â€” Explanation must exist as HTML, not injected. Use semantic H2/H3. | P0       |
| ARCH-4.2         | **Multi-mode** â€” Show only active mode explanation.                               | P1       |
| UI-EXP-CLARIFY-1 | Text, tables, graphs allowed but never change shell height.                            | P0       |

### 4.5 Universal Domain Navigation


| Rule ID     | Requirement                                                                                      | Severity |
| ------------- | -------------------------------------------------------------------------------------------------- | ---------- |
| UNAV-ROOT-1 | Domain buttons required (Math, Loans, Finance, etc.)                                             | P0       |
| UNAV-ROOT-2 | Only one domain active at a time                                                                 | P1       |
| UNAV-ROOT-3 | Domain activation replaces left nav, resets scroll, preserves shell height, no full reload       | P0       |
| UNAV-ROOT-4 | No cross-domain navigation leakage                                                               | P1       |
| UNAV-HIER-1 | Navigation matches`requirements/universal/calculator-hierarchy.md`                               | P0       |
| UNAV-HIER-2 | Empty sections still render as headings                                                          | P2       |
| UNAV-HIER-3 | Active calculators must be present in`public/config/navigation.json` to be visible in navigation | P0       |

### 4.6 Navigation Scalability


| Rule ID      | Constraint    | Limit                               | Severity |
| -------------- | --------------- | ------------------------------------- | ---------- |
| UNAV-SCALE-1 | Flat list     | Max 15 items                        | P1       |
| UNAV-SCALE-2 | Category size | Max 25 calculators                  | P1       |
| UNAV-SCALE-3 | Subdivision   | Required if > 25 calculators        | P1       |
| UNAV-SCALE-4 | Search        | Required if domain > 30 calculators | P1       |

### 4.7 Navigation Search


| Rule ID       | Requirement                         | Severity |
| --------------- | ------------------------------------- | ---------- |
| UNAV-SEARCH-1 | Visible at top of navigation pane   | P1       |
| UNAV-SEARCH-2 | Real-time filtering                 | P1       |
| UNAV-SEARCH-3 | No auto-navigation                  | P1       |
| UNAV-SEARCH-4 | Clear restores full navigation tree | P1       |

---

## 5) Folder Structure Contract

### 5.1 Deploy Root


| Rule ID | Requirement                                                        | Severity |
| --------- | -------------------------------------------------------------------- | ---------- |
| FS-1.1  | `/public` is deploy root. Everything served lives under `/public`. | P0       |

### 5.2 Required Folders


| Rule ID | Folder                       | Purpose                                                    | Severity |
| --------- | ------------------------------ | ------------------------------------------------------------ | ---------- |
| FS-2.1  | `/public/layout/`            | Shared page shell fragments. No calculator-specific logic. | P0       |
| FS-2.2  | `/public/assets/`            | Site-wide assets                                           | P1       |
| FS-2.2  | `/public/assets/css/`        | Shared CSS (base/layout/calculator UI)                     | P1       |
| FS-2.2  | `/public/assets/js/core/`    | Shared JS utilities                                        | P1       |
| FS-2.2  | `/public/assets/js/vendors/` | Third-party libs (versioned, load only if needed)          | P2       |
| FS-2.3  | `/public/config/`            | Config-driven navigation (`navigation.json`)               | P0       |

### 5.3 Calculator Folders


| Rule ID | Requirement                                                                                                      | Severity |
| --------- | ------------------------------------------------------------------------------------------------------------------ | ---------- |
| FS-3.1  | Structure:`/public/calculators/<category>/<calculator-slug>/` with `index.html`, `module.js`, `explanation.html` | P0       |
| FS-3.2  | Calculator folders must not import each other. No circular deps.                                                 | P0       |
| FS-3.3  | Folder slugs:**lowercase**, **hyphen-separated** (e.g., `credit-card-payoff`)                                    | P1       |

### 5.4 Indexing Files


| Rule ID | Requirement                                                                              | Severity |
| --------- | ------------------------------------------------------------------------------------------ | ---------- |
| FS-4.1  | `/public/calculators/index.html` links to all active calculators                         | P1       |
| FS-4.2  | `sitemap.xml` lists every active calculator URL. `robots.txt` doesn't block calculators. | P0       |

---

## 6) Coding Standards

### 6.1 JavaScript


| Rule ID | Requirement                                                                  | Severity |
| --------- | ------------------------------------------------------------------------------ | ---------- |
| CS-1.1  | Plain JavaScript (no TypeScript assumptions)                                 | P1       |
| CS-1.2  | No duplicated utility logic â€” shared logic in`/public/assets/js/core/`  | P1       |
| CS-1.3  | Validate all user inputs (empty, divide-by-zero)                             | P0       |
| CS-1.4  | Safe error handling â€” no unhandled exceptions, return clear error state | P0       |
| CS-1.5  | Avoid globals â€” scope to modules                                        | P1       |

### 6.2 HTML


| Rule ID | Requirement                                                                 | Severity |
| --------- | ----------------------------------------------------------------------------- | ---------- |
| CS-2.1  | Unique`<title>`, unique meta description, exactly one `<h1>` per calculator | P0       |
| CS-2.2  | Explanation is static HTML (crawlable, not injected)                        | P0       |
| CS-2.3  | Semantic headings (H2/H3) in explanation pane                               | P1       |
| CS-2.4  | Every input has a label for accessibility                                   | P1       |

### 6.3 CSS


| Rule ID | Requirement                                                                            | Severity |
| --------- | ---------------------------------------------------------------------------------------- | ---------- |
| CS-3.1  | Layout CSS in shared layout stylesheet. Calculator UI in shared calculator stylesheet. | P1       |
| CS-3.2  | No inline styles in calculator HTML                                                    | P1       |
| CS-3.3  | No duplicated CSS rules across calculator folders                                      | P2       |

---

## 7) Testing Standards


| Rule ID  | Requirement                                                                                                                                                                          | Severity |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| TEST-1.1 | All new calculator compute logic must have unit tests                                                                                                                                | P0       |
| TEST-1.2 | Minimum**80% coverage** for new compute logic                                                                                                                                        | P1       |
| TEST-1.3 | **ISS-001 regression check** â€” Verify no layout shifts, scrollbars visible, no navigation ping-pong                                                                             | P1       |
| TEST-1.4 | Dependency/browser installs are one-time per environment; do not rerun`pnpm install` or `npx playwright install chromium` before every test run unless dependencies or cache changed | P1       |
| TEST-1.5 | **Screenshot optimization** â€” Screenshots only on failure (`screenshot: 'only-on-failure'`). No routine visual regression screenshots in development.                           | P1       |
| TEST-1.6 | **Trace optimization** â€” Traces only on failure (`trace: 'retain-on-failure'`). No routine trace collection during passing tests.                                               | P1       |
| TEST-1.7 | **Resource efficiency** â€” Test execution should prioritize functional validation over visual artifact generation                                                                | P1       |

### Minimal Required Tests by Change Type


| Change Type                                 | Required Tests (per TEST-1.*)                                                                                                          | Optional/Deferred Tests                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Any change scope (general rule)             | Run E2E only for calculators you changed; untouched calculators do not need E2E unless it is a full release sweep                      | Full-sweep E2E is limited to 1 calculator per category   |
| Calculator compute logic change             | Unit tests for compute logic (`{PREFIX}-TEST-U-*`) per `TEST-1.1`; meet `TEST-1.2` 80% coverage                                        | E2E only if UI/flow also changed                         |
| Calculator UI/flow change                   | `*-TEST-E2E-LOAD`, `*-TEST-E2E-WORKFLOW` for affected calculators                                                                      | `*-TEST-E2E-NAV`, `*-TEST-E2E-MOBILE`, `*-TEST-E2E-A11Y` |
| Graph/table change (calculator-scoped only) | Unit/integration test validating data mapping; DOM structure check for table semantics (thead/tbody/tfoot) or graph container presence | `*-TEST-E2E-WORKFLOW` only if user interaction changed   |
| Layout/CSS/shared shell change              | `ISS-001` regression E2E check (no layout shifts, scrollbars visible, no nav ping-pong)                                                | Full E2E suite                                           |
| Navigation/config change                    | `*-TEST-E2E-NAV` for affected domain + `ISS-001`                                                                                       | Full E2E suite                                           |
| Accessibility-only change                   | `*-TEST-E2E-A11Y` for affected calculators                                                                                             | Full E2E suite                                           |
| No UI changes (pure logic)                  | Unit tests only (`TEST-1.1`, `TEST-1.2`)                                                                                               | E2E skip                                                 |

Note: Full release sweep = run the full unit test suite plus E2E for only 1 representative calculator per category (not every calculator).

---

## 8) SEO and URL Rules


| Rule ID | Requirement                                                                                                      | Severity |
| --------- | ------------------------------------------------------------------------------------------------------------------ | ---------- |
| SEO-1.1 | Each calculator directly accessible via URL                                                                      | P0       |
| SEO-1.2 | Changing calculator selection updates title/description/canonical                                                | P0       |
| SEO-1.3 | Explanation pane contains long-form content (examples, assumptions, edge cases). Calculation pane stays compact. | P1       |
| SEO-1.4 | Live calculators must be listed in`public/calculators/index.html` for crawlable discovery                        | P1       |

---

## 9) Inventory and Documentation Accuracy


| Rule ID | Requirement                                                                                                                       | Severity |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| DOC-1.1 | Documentation must list all calculator folders under`/public/calculators/`                                                        | P0       |
| DOC-1.2 | Every calculator labeled: Active, Work-in-progress, or Deprecated                                                                 | P1       |
| DOC-1.3 | No silent omission â€” unlisted folders must be acknowledged with status                                                       | P1       |
| DOC-1.4 | Calculators are considered**live/visible** only when added to `public/config/navigation.json` and `public/calculators/index.html` | P0       |

### 9.1 Sitemap Coverage (Build-Blocking)


| Rule ID       | Requirement                                                                                                                                                   | Severity |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| DOC-SITEMAP-1 | **Mandatory sitemap coverage** â€” All live calculators MUST appear in the human-readable `/sitemap` page                                                  | P0       |
| DOC-SITEMAP-2 | **Live calculator definition** â€” A calculator is LIVE if it appears in navigation or is directly accessible via a public URL                             | P0       |
| DOC-SITEMAP-3 | **Sitemap source of truth** â€” Sitemap content must be derived from the same navigation source-of-truth (no hardcoded lists)                              | P0       |
| DOC-SITEMAP-4 | **Build/compliance hard fail** â€” If any LIVE calculator is missing from the sitemap: BUILD = FAIL, TEST = FAIL, COMPLIANCE = FAIL. No waivers by default | P0       |
| DOC-SITEMAP-5 | **REQ acceptance criterion** â€” Any new calculator REQ must include: “Calculator appears in the Sitemap page.” Missing this AC invalidates the REQ      | P0       |

---

## 10) PR and Phase Workflow

### 10.1 Required Reading Order


| Rule ID | Actor  | Must Read                                                                              |
| --------- | -------- | ---------------------------------------------------------------------------------------- |
| WF-1.1  | Claude | 1. This Universal Requirements file 2. Phase tracker (`INDEX.MD`) 3. Active phase file |
| WF-1.2  | Codex  | Same as Claude                                                                         |

### 10.2 Development Loop


| Rule ID | Step | Action                                 |
| --------- | ------ | ---------------------------------------- |
| WF-2.1  | 1    | Implement                              |
| WF-2.1  | 2    | Evaluate vs requirements               |
| WF-2.1  | 3    | Identify gaps                          |
| WF-2.1  | 4    | Fix                                    |
| WF-2.1  | 5    | Repeat until requirements + tests pass |

### 10.3 After PR Merge


| Rule ID | Requirement                                                                                          | Severity |
| --------- | ------------------------------------------------------------------------------------------------------ | ---------- |
| WF-3.1  | Update`INDEX.MD`: mark phase âœ…, progress 100%, add PR number, update current phase, update date | P1       |

---

## 11) Hard "Never Do" Rules


| Rule ID   | Never Do This                            | Severity |
| ----------- | ------------------------------------------ | ---------- |
| NEVER-1.1 | Delete data without soft-delete strategy | P0       |
| NEVER-1.2 | Bypass authentication (if applicable)    | P0       |
| NEVER-1.3 | Commit directly to`main`                 | P0       |
| NEVER-1.4 | Ignore runtime or linting errors         | P0       |
| NEVER-1.5 | Hardcode environment-specific values     | P0       |
| NEVER-1.6 | Merge PRs that violate universal rules   | P0       |

---

## 12) Definition of Done


| Rule ID | Criterion                          | Required |
| --------- | ------------------------------------ | ---------- |
| DOD-1.1 | Code works as intended             | âœ…   |
| DOD-1.2 | Unit tests pass                    | âœ…   |
| DOD-1.3 | No runtime or lint errors          | âœ…   |
| DOD-1.4 | Reviewed by Codex                  | âœ…   |
| DOD-1.5 | PR approved + merged               | âœ…   |
| DOD-1.6 | Phase tracker updated (`INDEX.MD`) | âœ…   |

**If any item is missing, the task is NOT done.**

---

## 13) How to Report Violations

### Violation Template


| Field             | Description                              |
| ------------------- | ------------------------------------------ |
| **Rule ID(s)**    | e.g.,`UI-2.5`, `FS-3.1`, `CS-1.3`        |
| **Severity**      | P0 Block / P1 Fix / P2 Suggest           |
| **Where**         | File path(s) + line(s) if possible       |
| **What happened** | Short factual description                |
| **Expected**      | Quote the requirement from this document |
| **Proposed fix**  | Concrete action                          |

### Severity Guidance


| Severity   | When to Use                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------- |
| P0 Block   | Breaks non-negotiables: folder contract, security, page growth, no-dropdown rule, missing tests |
| P1 Fix     | Validation gaps, duplicated utilities, SEO metadata not unique, explanation not crawlable       |
| P2 Suggest | Naming, readability, minor refactors                                                            |

---

## 14) Agent Diagnostic Command Requirements

### 14.1 Approved Diagnostic Commands


| Rule ID  | Requirement                            | Commands Allowed                                                     |
| ---------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| DIAG-1.1 | **Read-only diagnostic commands only** | `rg`, `ls`, `cat`, `sed -n`                                          |
| DIAG-1.2 | **No destructive operations**          | Agent must request explicit approval for any write/modify operations |
| DIAG-1.3 | **Limited scope inspection**           | Restrict to approved paths only (see DIAG-1.4)                       |

### 14.2 Approved Inspection Paths


| Rule ID  | Path Category       | Allowed Paths                                              |
| ---------- | --------------------- | ------------------------------------------------------------ |
| DIAG-1.4 | Configuration Files | `playwright.config.js`, `package.json`, `vitest.config.js` |
| DIAG-1.4 | Test Directories    | `tests/e2e/**`, `tests/calculators/**`, `tests/core/**`    |
| DIAG-1.4 | Documentation       | `README.md`                                                |
| DIAG-1.4 | Compliance Files    | `requirements/compliance/**` (all .md files)               |
| DIAG-1.4 | Requirements        | `requirements/universal/UNIVERSAL_REQUIREMENTS.md`         |
| DIAG-1.4 | Build Rules         | `requirements/build_rules/**/*.md`                         |

### 14.3 Command Usage Guidelines


| Rule ID  | Requirement           | Usage                                                                         |
| ---------- | ----------------------- | ------------------------------------------------------------------------------- |
| DIAG-2.1 | **File location**     | Use`rg` to locate configuration files and tests                               |
| DIAG-2.2 | **Path confirmation** | Use`ls` to confirm directory structures and file existence                    |
| DIAG-2.3 | **File inspection**   | Use`cat` or `sed -n` to read specific files for analysis                      |
| DIAG-2.4 | **Scope limitation**  | Agent must not access paths outside approved list without explicit permission |

### 14.4 Test Failure Diagnosis Process


| Step | Action                | Command Pattern                                      |
| ------ | ----------------------- | ------------------------------------------------------ |
| 1    | Locate test files     | `rg "test|spec" --type js --type ts`                 |
| 2    | Check configuration   | `cat playwright.config.js vitest.config.js`          |
| 3    | Inspect failing tests | `cat tests/e2e/[specific-test].spec.js`              |
| 4    | Review requirements   | `cat requirements/compliance/requirement_tracker.md` |

### 14.5 Permission Request Format


| Rule ID  | When Required                  | Format                                                                                    |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| DIAG-3.1 | **Additional commands needed** | Agent must explicitly request: "I need permission to use [command] to [specific purpose]" |
| DIAG-3.2 | **Path expansion needed**      | Agent must request: "I need access to [specific path] to [diagnostic reason]"             |
| DIAG-3.3 | **Write operations**           | Agent must request: "I need write permission to [file] to [specific fix]"                 |

---

## 15) Agent Environment and Cache Policy

### 15.1 Cache Policy (Do Not Modify)


| Rule ID   | Requirement                                                                                                                   | Severity |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| AGENT-1.1 | **Do not delete caches** â€” Playwright, npm, and pip caches must never be deleted                                         | P0       |
| AGENT-1.2 | **Do not move caches into the repo** â€” Cache directories must remain outside versioned paths                             | P0       |
| AGENT-1.3 | **Do not commit cache directories** â€” Cache folders are forbidden from git commits                                       | P0       |
| AGENT-1.4 | **Do not override Playwright cache path** â€” `PLAYWRIGHT_BROWSERS_PATH` must not be set or changed                        | P1       |
| AGENT-1.5 | **Assume browsers/deps are installed** â€” Do not reinstall Playwright browsers or dependencies unless explicitly required | P1       |

**Cache locations (reference):**

- Playwright browsers: `~/.cache/ms-playwright`
- npm cache: `~/.npm`
- pip cache: `~/.cache/pip`

### 15.2 Test Execution Environment


| Rule ID   | Requirement                                                                                                          | Severity |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- |
| AGENT-2.1 | **WSL-only test execution** â€” All tests must run inside WSL (Linux)                                             | P0       |
| AGENT-2.2 | **Remote WSL VS Code** â€” Use VS Code Remote â€“ WSL when applicable                                          | P1       |
| AGENT-2.3 | **No Windows-shell installs** â€” Do not run Playwright or npm installs from Windows shells                       | P0       |
| AGENT-2.4 | **Cache issues stop-and-report** â€” If a cache issue is suspected, stop and report; do not attempt cache cleanup | P0       |

---

**End of Universal Requirements Document**

> For site copy and content requirements, see `requirements/universal/SITE_COPY.md`
> Last Updated: 2026-01-22
