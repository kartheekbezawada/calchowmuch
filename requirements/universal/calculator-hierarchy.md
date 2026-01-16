# Calculator Hierarchy (Source of Truth)
Version: 1.0

This document defines the **ONLY** allowed hierarchy for:
- Top navigation (horizontal)
- Left navigation pane (vertical)
- Deep-link routing behavior

Any implementation MUST follow this hierarchy exactly.

---

## 1) Top Navigation - Left Navigation Mapping

### 1.1 Math (Top Nav)
When user clicks **Math** in the top navigation bar, the left navigation pane MUST show:

Math
- Simple
  - Basic Calculator
  - Percentage Calculator
  - Fraction Calculator
- Algebra
- Trigonometry
- Calculus
- Log
- Statistics

Notes:
- Sections like Algebra/Trigonometry/Calculus/Log/Statistics may be empty initially.
- Empty sections MUST still appear as headings (unless explicitly removed by requirements).

---

### 1.2 Loans (Top Nav)
When user clicks **Loans** in the top navigation bar, the left navigation pane MUST show:

Loans
- Home
  - Home Loan
  - How Much Can I Borrow
  - Remortgage / Switching
  - Buy-to-Let Calculator
  - Overpayment / Additional Payment
  - Offset Calculator
  - Interest Rate Change Calculator
  - Loan-to-Value (LTV) Calculator
- Credit Cards
  - Repayment / Payoff Calculator
  - Minimum Payment Calculator
  - Balance Transfer / Installment Plan Calculator
  - Credit Card Consolidation Calculator
- Auto Loans
  - Car Loan Calculator
  - Multiple Car Loan Calculator

---

## 2) Routing + Deep Linking Rules

### 2.1 Top Nav Active State
When user visits ANY calculator page directly (deep link), the system MUST:
- Automatically set the correct Top Nav active item based on the calculator's category.
  - Example: Visiting a Loans/Home calculator MUST activate **Loans** in top nav.

### 2.2 Left Nav Rendering
On page load (including deep links), the system MUST:
- Render the correct left navigation for the active Top Nav category.
- Expand the correct section (e.g., Loans -> Home).
- Highlight the current calculator item.

### 2.3 One Page = One Calculator
Each calculator page MUST map to exactly one leaf item in this hierarchy.

---

## 3) Naming Conventions (Canonical)
- Category names use Title Case (Math, Loans, Home, Credit Cards, Auto Loans)
- Calculator display names use Title Case and must match this document exactly.
- URLs must be stable and deep-linkable.
