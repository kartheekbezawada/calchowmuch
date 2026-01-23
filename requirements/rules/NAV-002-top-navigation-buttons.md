# REQ-20260122-002: Top Navigation Button Visual System

**Type:** Layout/CSS  
**Priority:** P1  
**Change Type:** Layout/CSS  
**SEO Impact:** No  

## Summary

Convert all top navigation items from plain text links to buttons with a consistent visual system featuring cosmic black default state and inverted selected state.

## Business Logic

### Scope
All top navigation items must be rendered as buttons:
- Math
- Home Loan  
- Credit Cards
- Auto Loans
- Any future top-level navigation item

### Button Visual System (Frozen)

#### Default State (Unselected)
- **Background:** Cosmic Black (near-black, not pure #000)
- **Text color:** White
- **Font weight:** Medium (not bold, not light)
- **Font case:** Sentence Case (no ALL CAPS)
- **Shape:** Rounded rectangle (same radius as calculator buttons)
- **Size:** Slightly larger than body text; clearly tappable
- **Padding:** Balanced horizontal padding (button, not pill)
- **Border:** None
- **Shadow:** None or very subtle (optional)

#### Selected State (Active)
- **Background:** White
- **Text color:** Cosmic Black  
- **Border:** 1px solid Cosmic Black
- **Font weight:** Same as default (do not bold)
- **Shadow:** None

#### Interactive States
- **Hover:** Slightly lighten or darken cosmic black background, cursor pointer
- **Focus:** Visible focus outline (accessible), must not rely on color alone

### Design Constraints

#### Consistency Rules
- All top navigation buttons must share the same component
- Same size, shape, colors, font, spacing
- No one-off styling
- Cosmic black must be reused everywhere (define once as CSS variable)

#### Explicit Non-Goals
❌ Do NOT:
- Add icons
- Add animations  
- Add gradients
- Change wording
- Change layout spacing
- Introduce new colors

## Acceptance Criteria

**Visual Requirements:**
- [ ] Math, Home Loan, Credit Cards, Auto Loans appear as buttons
- [ ] All buttons share identical style
- [ ] Default state = cosmic black background + white text
- [ ] Selected state = white background + black text + black border
- [ ] Selected button is obvious at a glance
- [ ] Works visually on white page background

**Technical Requirements:**
- [ ] Cosmic black defined as CSS variable/token
- [ ] Component-based styling (no duplicated styles)
- [ ] Accessibility: keyboard focus visible
- [ ] Hover states implemented
- [ ] Future buttons automatically inherit style

**Consistency Requirements:**
- [ ] All buttons same dimensions
- [ ] All buttons same border radius
- [ ] All buttons same typography
- [ ] All buttons same spacing/padding

## One-Line Design Intent

"Top navigation should feel like a calm control panel, not a slogan or a menu."

## Implementation Notes

### CSS Architecture
- Define `--cosmic-black` CSS custom property
- Create `.top-nav-button` base class
- Use `.top-nav-button.is-active` for selected state
- Inherit border radius from existing calculator button system

### Human Logic Rationale
- White page + black button → strong contrast
- Selected = inverted → intuitive  
- No extra colours → calm, professional
- Consistent sizing → feels intentional, not random

## Definition of Done

- All top navigation items render as buttons with specified styling
- Selected state clearly distinguishes active navigation item
- Hover and focus states provide appropriate feedback
- Visual consistency maintained across all navigation buttons
- Future navigation items automatically inherit button styling