# NAVIGATION CHANGE REQUIREMENTS (v1)

**REQ-ID:** REQ-20260122-001  
**Title:** Navigation Restructure - Top Level Loan Categories  
**Type:** UI Navigation Hierarchy  
**Priority:** HIGH  
**Status:** NEW  
**Created:** 2026-01-22  

---

## Scope

**In Scope:** Navigation only  
**Out of Scope:** Calculator logic, URLs, data, layouts, explanation pane, ads  
**Authority:** navigation.json is the source of truth  
**Change Type:** UI Navigation Hierarchy  

---

## Requirements

### NAV-001 — Top Navigation Restructure (Loans)

**Problem**

Currently, top navigation shows:
- Math
- Loans

This forces users to do an extra click and hides important loan categories.

**Requirement**

Replace the single "Loans" top-level tab with three explicit loan category tabs:

Top Navigation must show:
- Math
- Home Loan
- Credit Cards  
- Auto Loans

**Mapping Rule (Explicit)**

| Top Nav Label | Maps To navigation.json |
|---------------|-------------------------|
| Math | categories[id=math] |
| Home Loan | categories[id=loans].subcategories[id=home] |
| Credit Cards | categories[id=loans].subcategories[id=credit-cards] |
| Auto Loans | categories[id=loans].subcategories[id=auto-loans] |

No renaming, no regrouping, no inferred categories.

**Acceptance Criteria**
- [ ] "Loans" must not appear as a top-level tab
- [ ] All three loan category tabs must be visible without overflow on desktop
- [ ] URLs and calculator routes remain unchanged

### NAV-002 — Left Navigation Context Switching

**Requirement**

Clicking a top navigation item must fully determine the left navigation contents.

**Behavior Rules**

**When Math is clicked:**
- Left navigation shows only Math subcategories and calculators
- Same behavior as current Math navigation
- No loan calculators visible

**When Home Loan is clicked:**
- Left navigation shows:
  - Section header: Home Loan
  - All calculators from `loans → home → calculators` navigation
- No Credit Card or Auto Loan calculators visible

**When Credit Cards is clicked:**
- Left navigation shows:
  - Section header: Credit Cards
  - All calculators from `loans → credit-cards → calculators` navigation
- No Home Loan or Auto Loan calculators visible

**When Auto Loans is clicked:**
- Left navigation shows:
  - Section header: Auto Loans
  - All calculators from `loans → auto-loans → calculators` navigation
- No Home Loan or Credit Card calculators visible

**Acceptance Criteria**
- [ ] Left navigation never mixes calculators from different loan subcategories
- [ ] Switching top tabs replaces left navigation entirely (no append behavior)

### NAV-003 — Default State & URL Sync

**Requirement**

Navigation state must be derived from the current URL.

**Rules**

If URL matches a calculator under:
- `#/calculators/home-*` → Home Loan tab active
- `#/calculators/credit-card-*` → Credit Cards tab active
- `#/calculators/car-*`, pcp, leasing, etc. → Auto Loans tab active

Page refresh must preserve correct top tab + left nav state.

**Acceptance Criteria**
- [ ] Refreshing the page does not reset navigation to Math
- [ ] Active top tab visually matches the calculator being viewed

### NAV-004 — Visual & Interaction Constraints (Non-Negotiable)

**Explicit Constraints**

❌ **Not Allowed:**
- No new calculator buttons
- No new routes
- No URL changes
- No layout resizing
- No animation redesign
- No CSS restyling beyond what is required for active state

✅ **Allowed Changes:**
- Rendering logic for top navigation
- Rendering logic for left navigation
- Active tab state handling

### NAV-005 — Data Contract Rule

**Requirement**

Navigation rendering must be driven entirely by navigation.json.

**Rules**
- No hardcoded calculator lists
- No duplicated config
- No inferred category logic

**Acceptance Criteria**
- [ ] Removing or adding a calculator in navigation.json updates navigation automatically
- [ ] No navigation text exists outside the JSON (except "Math")

---

## Completion Checklist (for implementer)

- [ ] "Loans" removed from top navigation
- [ ] Home Loan / Credit Cards / Auto Loans added to top navigation
- [ ] Left navigation switches cleanly per top tab
- [ ] URL refresh preserves correct navigation state
- [ ] No calculator logic touched

---

## Business Justification

**Why this is the correct UX move:**
- Reduces cognitive load
- Matches how users think ("I'm looking for a home loan")
- Avoids long scrolling lists
- Scales cleanly as calculators grow

---

## Implementation Notes

**Files Likely to Change:**
- Navigation rendering logic (JavaScript)
- CSS for active tab states
- URL routing logic for tab state detection

**Files That Must NOT Change:**
- navigation.json structure (data only)
- Calculator HTML files
- URL routes
- Layout dimensions