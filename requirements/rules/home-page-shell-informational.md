# Home Page Shell-Only Content Requirements

**REQ-ID:** REQ-20260125-005  
**Title:** Home Page Shell-Only Content  
**Type:** UI / Layout / Governance  
**Priority:** HIGH (P0)  
**Status:** NEW  
**Created:** 2026-01-25

---

## Intent

The Home page (`/`) must act as a discovery and guidance page, not a calculator, while reusing the exact same shell layout to preserve consistency and avoid special-case UI.

---

## Scope

**In Scope:** Home page only (`/`) and global shell behavior (top nav, panes, footer).  
**Out of Scope:** Calculator logic, navigation data model, SEO for calculator pages, build tooling.  
**Authority:** Universal UI Contract (UI-3.1, UI-3.2, UI-3.5) and Architecture rules (ARCH-1.*).  
**Change Type:** UI/Flow.

---

## UI Requirements

### UI-HP-1 — Shell Reuse (Mandatory)

**Requirement**
- The Home page MUST render inside the standard calculator shell, including:
  - Header
  - Top navigation
  - Calculation pane
  - Explanation pane
  - Footer
- No alternative layouts or landing-page-only layouts are allowed.

**Acceptance Criteria**
- [ ] Home page uses the same shell structure as calculator pages.

### UI-HP-2 — Calculation Pane (Home Overview)

**Requirement**
- The Calculation Pane on Home MUST contain informational content only.
- It may include category overviews and links.
- It MUST NOT contain input fields, buttons that trigger calculations, tables, charts/graphs, or compute logic.

**Acceptance Criteria**
- [ ] No `<input>`, `<select>`, `<textarea>` elements in the Home calculation pane.
- [ ] No calculation triggers or compute scripts added for Home content.
- [ ] No tables, charts, or graphs in the Home calculation pane.

### UI-HP-3 — Explanation Pane (Home Guidance)

**Requirement**
- The Explanation Pane on Home MUST be populated.
- It MUST include a brief explanation of what the site does, guidance on how to choose calculators, and trust/disclaimer copy.
- It MUST NOT be empty, mirror calculator explanations, or contain interactive elements.

**Acceptance Criteria**
- [ ] Explanation pane has visible static text content.
- [ ] No interactive elements in the explanation pane.

### UI-HP-4 — Left Navigation Behavior

**Requirement**
- On Home, the Left Navigation MUST be either hidden or rendered in a neutral, non-selectable state.
- It MUST NOT display calculator lists, highlight any calculator, or show an active category.

**Acceptance Criteria**
- [ ] No calculator list items rendered in the left nav on Home.
- [ ] No active states shown in left nav on Home.

### UI-HP-5 — Top Navigation Behavior

**Requirement**
- Top navigation MUST be visible on Home.
- No category button may appear active by default.
- Clicking a category transitions the user into calculator views normally.

**Acceptance Criteria**
- [ ] Top nav visible and no default active state.

### UI-HP-6 — Footer Consistency

**Requirement**
- Footer MUST match calculator pages exactly.
- Footer links MUST include Sitemap.

**Acceptance Criteria**
- [ ] Footer content and order match calculator pages.

---

## Hard Prohibitions (P0)

- Home page MUST NOT behave like a calculator.
- Home page MUST NOT activate any calculator state.
- Home page MUST NOT introduce new layout dimensions.
- Home page MUST NOT bypass shell scroll rules.

---

## Acceptance Criteria

- **AC-1:** Home page renders using the standard shell.
- **AC-2:** No calculator inputs or compute logic present on Home.
- **AC-3:** Both Calculation Pane and Explanation Pane contain static content.
- **AC-4:** Left navigation is hidden or neutral.
- **AC-5:** Footer matches calculator pages exactly.

---

## ISS-001-HOME — Home Page Visual Regression Rules

**Purpose:** Prevent Home page from regressing into a calculator, a marketing landing page, or a special-case layout.

### ISS-HOME-1 — Shell Integrity

- Header, panes, and footer positions MUST match calculator pages pixel-for-pixel (within existing tolerance).
- Pane widths MUST follow universal ratios.

### ISS-HOME-2 — No Inputs Rule

- Home page MUST contain zero `<input>`, `<select>`, or `<textarea>` elements.
- Presence of any input element → FAIL.

### ISS-HOME-3 — No Tables / Graphs Rule

- Home page MUST contain zero `<table>` elements and zero chart containers.
- Presence → FAIL.

### ISS-HOME-4 — Left Navigation Neutrality

- Left navigation MUST NOT show calculator list items or active highlights.
- Any calculator entry visible → FAIL.

### ISS-HOME-5 — Explanation Pane Non-Empty

- Explanation Pane MUST contain visible text content.
- Empty or collapsed explanation pane → FAIL.

### ISS-HOME-6 — Scroll & Layout Stability

- No horizontal scroll introduced.
- Page height MUST remain constrained to shell rules.
- CLS regression > threshold → FAIL.

---

## ISS-001 Test Scope

- Run ISS-001-HOME on initial Home load.
- Run ISS-001-HOME on window resize (desktop breakpoints).
- Screenshot comparison baseline required.

---

## Enforcement Rule

If any ISS-001-HOME rule fails:
- TEST = FAIL
- BUILD cannot be promoted
- REQ cannot be marked COMPLETE

---

## One-Line Invariant (for agents)

Home looks like a calculator page, but must never act like one.
