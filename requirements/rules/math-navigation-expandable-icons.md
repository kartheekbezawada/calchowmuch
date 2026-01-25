# Math Navigation Expandable Icons

**REQ-ID:** REQ-20260125-007  
**Title:** Math Navigation Expandable Icons  
**Type:** Navigation UI/Flow  
**Priority:** HIGH  
**Status:** BLOCKED  
**Created:** 2026-01-25
**Status Reason:** Rolled back per request (design choice rejected).

---

## Scope

**In Scope:** Math section navigation only, including category headers, expand/collapse behavior, and calculator item styling.  
**Out of Scope:** Home Loan, Credit Cards, Auto Loans navigation (must remain simple), calculator content, layout sizing outside the nav container, SEO, and calculation logic.  
**Authority:** Universal UI rules in requirements/universal/UNIVERSAL_REQUIREMENTS.md (UI-2.*, UI-3.*, UI-4.*).  
**Change Type:** UI/Flow (reference: testing_requirements.md §3).

---

## Requirements

### NAV-MATH-001 — Scope by Section

**Requirement**
- The expandable navigation with icons applies ONLY to the Math section.
- Home Loan, Credit Cards, and Auto Loans sections use simple list navigation (no icons, no expand/collapse).

**Acceptance Criteria**
- [ ] Math nav shows expandable categories with icons.
- [ ] Home Loan, Credit Cards, Auto Loans show simple lists without icons or expand/collapse.

### NAV-MATH-002 — Container Styling

**Requirement**
- Navigation container uses: rounded-lg, shadow-lg, p-4, w-64.
- Do NOT include a “Navigation” header.
- Do NOT include a search input box.

**Acceptance Criteria**
- [ ] Container has rounded-lg, shadow-lg, p-4, w-64.
- [ ] No header text labeled “Navigation.”
- [ ] No search input field.

### NAV-MATH-003 — Math Categories and Icons

**Requirement**
- Six main categories with collapsible sub-items and lucide-react icons:
  1. SIMPLE — Calculator
  2. ALGEBRA — PlusCircle
  3. TRIGONOMETRY — TrendingUp
  4. CALCULUS — Activity
  5. LOG — BarChart2
  6. STATISTICS — Sigma

**Acceptance Criteria**
- [ ] All six categories exist and display specified icons.
- [ ] Icons come from lucide-react.

### NAV-MATH-004 — Category Header Button

**Requirement**
- Category header button styling:
  - Full width: w-full
  - Layout: flex items-center justify-between
  - Padding: px-3 py-2.5
  - Rounded corners: rounded-lg
  - Background default: transparent
  - Hover background: hover:bg-indigo-50
  - Transition: transition-colors
  - Gap: gap-2

**Acceptance Criteria**
- [ ] Category headers match the required classes and hover behavior.

### NAV-MATH-005 — Category Header Left Side (Icon + Text)

**Requirement**
- Left-side container: flex items-center gap-2
- Icon size: w-4 h-4
- Icon color default: text-gray-500
- Icon hover color: group-hover:text-indigo-600
- Text size: text-sm
- Text weight: font-semibold
- Text color default: text-gray-700
- Text hover color: group-hover:text-indigo-700

**Acceptance Criteria**
- [ ] Icon and text styling match requirements.
- [ ] Hover colors update via group-hover.

### NAV-MATH-006 — Category Header Right Side (Chevron)

**Requirement**
- ChevronDown when expanded, ChevronRight when collapsed.
- Icon size: w-4 h-4
- Icon default: text-gray-400
- Icon hover: group-hover:text-indigo-600

**Acceptance Criteria**
- [ ] Chevron icon toggles based on expanded state.
- [ ] Chevron color and sizing match requirements.

### NAV-MATH-007 — Expanded Items Container

**Requirement**
- Left margin: ml-6
- Top margin: mt-1
- Spacing: space-y-1
- Left border: border-l-2 border-gray-200
- Left padding: pl-3

**Acceptance Criteria**
- [ ] Expanded container matches spacing and border rules.

### NAV-MATH-008 — Calculator Item Buttons

**Requirement**
- Base styling: w-full, text-left, px-3 py-2, rounded, text-sm, transition-colors.
- Default state: background transparent, text-gray-600, hover:bg-gray-100, hover:text-gray-900.
- Active state: bg-indigo-600, text-white, font-medium.

**Acceptance Criteria**
- [ ] Calculator buttons match base, default, and active styles.
- [ ] Only one item active at a time.

### NAV-MATH-009 — Spacing Between Categories

**Requirement**
- Vertical spacing between categories: space-y-1.

**Acceptance Criteria**
- [ ] Category list uses space-y-1.

### NAV-MATH-010 — State Management

**Requirement**
- Track expanded categories via array of category names.
- Track active calculator item.
- Toggle expand/collapse on header click.
- Set active item on calculator click.
- Default expanded: SIMPLE.
- Categories can be independently expanded/collapsed.

**Acceptance Criteria**
- [ ] Simple category expanded by default.
- [ ] Expand/collapse works on header click.
- [ ] Active item is exclusive.

### NAV-MATH-011 — Other Sections Simple List

**Requirement**
- Home Loan, Credit Cards, Auto Loans use a simple list:
  - Section label: text-xs font-semibold text-gray-500 px-3 py-1
  - Buttons use same styling as calculator items above
- No expand/collapse functionality.

**Acceptance Criteria**
- [ ] Non-Math sections render as simple lists.
- [ ] Buttons match calculator item styling.

---

## Future Math Additions (Mandatory)

1. Always follow the expandable category structure above.  
2. Every Math category must have a lucide-react icon.  
3. Icons should be w-4 h-4, text-gray-500 default, indigo-600 on hover.  
4. Maintain spacing, hover, and active states exactly.  
5. Use group-hover for icon + text hover colors.  
6. No flat lists in Math section.

---

## Completion Checklist (for implementer)

- [ ] Update Math navigation UI per NAV-MATH-001 to NAV-MATH-011.
- [ ] Keep non-Math sections simple (no icons, no expand/collapse).
- [ ] Verify hover, active, and expanded states match requirements.
- [ ] Update compliance trackers after implementation begins (per WORKFLOW).
