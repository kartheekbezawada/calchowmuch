# Loans Navigation — Universal Rules (Hybrid Model)

## Scope
Applies to all **Loans** calculators and navigation behavior.
This document is authoritative for LLM review and CI checks.

---

## LN-NAV-ROOT — Top-Level Rules

**LN-NAV-ROOT-1**  
There must be a **Loans** button in the top navigation bar.

**LN-NAV-ROOT-2**  
Only one top-level domain may be active at a time:
- Math
- Loans

**LN-NAV-ROOT-3**  
When **Loans** is active:
- Left navigation pane must show ONLY loan-related navigation
- Math navigation must be completely hidden (not collapsed)

**LN-NAV-ROOT-4**  
Switching Math ↔ Loans must:
- Preserve page shell height
- Reset left navigation scroll to top
- Not trigger a full page reload

---

## LN-NAV-STRUCT — Left Navigation Structure

**LN-NAV-STRUCT-1**  
Loans navigation must consist of:
1. A search box (always visible at top)
2. Collapsible loan categories

No other persistent sections are allowed.

---

## LN-NAV-SEARCH — Search Rules

**LN-NAV-SEARCH-1**  
Search input must be visible at the top of Loans navigation.

**LN-NAV-SEARCH-2**  
Search must filter calculators in real time as the user types.

**LN-NAV-SEARCH-3**  
Search scope must include:
- Calculator display name
- Calculator keywords (EMI, mortgage, interest, payoff, etc.)

**LN-NAV-SEARCH-4**  
Search must NOT:
- Auto-navigate
- Auto-select calculators
- Change active calculator without user click

**LN-NAV-SEARCH-5**  
Clearing search restores full Loans navigation.

---

## LN-NAV-CAT — Loan Categories

**LN-NAV-CAT-1**  
Loan calculators must be grouped into logical categories, e.g.:
- Home Loans
- Personal Loans
- Credit Cards
- Auto Loans
- Education Loans
- General Loan Tools

**LN-NAV-CAT-2**  
Each category:
- Must have a visible header
- Must be collapsible
- Must default to expanded

**LN-NAV-CAT-3**  
Collapsing or expanding a category must not:
- Affect page layout height
- Affect other categories
- Change active calculator

---

## LN-NAV-ITEM — Calculator Items

**LN-NAV-ITEM-1**  
Each calculator must belong to exactly ONE loan category.

**LN-NAV-ITEM-2**  
Calculator items must:
- Use universal button styles
- Never wrap text
- Highlight when active

**LN-NAV-ITEM-3**  
Clicking a calculator must:
- Load calculation pane
- Load explanation pane
- Update URL (deep link)
- Update page metadata

---

## LN-NAV-LIMITS — Human Scale Limits

**LN-NAV-LIMIT-1**  
A loan category must not exceed **25 calculators**.

**LN-NAV-LIMIT-2**  
If a category exceeds 25 calculators, it MUST be subdivided.

---

## LN-NAV-FORBIDDEN — Explicitly Forbidden

**LN-NAV-FORBID-1**  
No flat list of all loan calculators.

**LN-NAV-FORBID-2**  
No dropdown (`<select>`) based navigation.

**LN-NAV-FORBID-3**  
No “recently used” or behavior-based sections.

---

## Acceptance

Navigation passes only if **all LN-NAV-* rules pass**.
