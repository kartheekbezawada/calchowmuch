# Explanation Pane Requirements

**REQ:** REQ-20260202-001  
**Status:** NEW  
**Purpose:** Define requirements for explanation content structure, table formatting, summary writing, and FAQ guidelines

---

## Scope

This document governs all calculator explanation panes including:
- Summary sections
- FAQ sections  
- Tables and data presentation
- Content structure and formatting

---

## Table Rules

### UTBL-BORDER-1: Full Excel-Style Grid Borders
All tables must use complete grid borders (row and column lines).

**CSS Implementation:**
```css
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #e5e7eb;
}
```

### UTBL-WRAP-1: Scrollable Container
Tables must be wrapped in a scrollable container to prevent horizontal overflow.

**HTML Implementation:**
```html
<div class="table-container">
  <table>...</table>
</div>
```

**CSS Implementation:**
```css
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

### UTBL-SYMBOL-1: No Currency/Percent Symbols in Cells
Table cells must contain raw numbers only. Units belong in column headers.

**Correct:**
| Amount | Rate |
|--------|------|
| 100000 | 3.5  |

**Incorrect:**
| Amount    | Rate |
|-----------|------|
| £100,000  | 3.5% |

---

## Summary Section Rules

(To be defined by Codex implementation)

---

## FAQ Section Rules

(To be defined by Codex implementation)

---

## Content Structure Rules

(To be defined by Codex implementation)

---

## Compliance

All explanation panes must comply with:
- This document (EXPLANATION_PANE_REQUIREMENTS.md)
- UNIVERSAL_REQUIREMENTS.md (UI, accessibility, navigation)
- Calculator-specific rules in requirements/rules/

---

## Notes

This document extracts table rules from UNIVERSAL_REQUIREMENTS.md and consolidates all explanation pane writing guidelines in one authoritative location.
