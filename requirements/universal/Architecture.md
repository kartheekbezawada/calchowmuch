Understood. I’ll translate that diagram into engineering-grade requirements and explicitly fold it into the modular structure, without poetry, without code.

# UI + Modular Architecture Requirements

(Derived from provided page layout diagram)

## 1. Page-Level Layout Contract (Global)

Every calculator page MUST conform to the same structural layout skeleton, regardless of category or calculator type.

The page is composed of six fixed regions:

- Global Header
- Primary Category Navigation
- Left Navigation Pane (Calculator Selector)
- Main Calculation Pane
- Explanation Pane
- Right Monetization Panes
- Footer

This layout MUST be consistent across all calculators to ensure:

- predictable UX
- reusable layout logic
- stable ad placement
- consistent SEO signals

## 2. Global Header (Top)

Purpose

- Brand identity
- High-level navigation
- SEO consistency

Requirements

- Displays site name (“Calculate How Much”)
- Fixed height across all pages
- Does NOT change per calculator
- Must not trigger calculator logic reloads

Modularity

- Implemented as a shared layout component
- Loaded once, reused everywhere
- No calculator-specific logic allowed here

## 3. Primary Category Navigation (Top Row Buttons)

Purpose

- Switch between major calculator domains (Math, Finance, Mortgage, etc.)

Requirements

- Each category button maps to a category landing page
- Clicking a category:
  - Updates the left navigation pane
  - Does NOT reload the entire page shell unnecessarily
- Category navigation must be indexable by search engines

Modularity

- Categories are data-driven (config-based)
- Category definition must live outside calculator logic
- Adding a new category must not require modifying calculator modules

## 4. Left Navigation Pane (Calculator Selector)

Purpose

- Hierarchical navigation within a category

Behavior

- Scrollable vertical pane
- Uses radio buttons or equivalent single-selection controls
- Shows:
  - Category heading
  - Sub-category headings (e.g., Algebra, Simple Math)
  - Individual calculators under each sub-category

Interaction Rules

- Selecting a calculator:
  - Loads that calculator into the Main Calculation Pane
  - Updates the URL (deep-linkable)
  - Updates page title, description, and canonical URL
- Left pane content MUST change when category changes

Modularity

- Left pane is driven by a navigation schema
- Calculators declare:
  - category
  - sub-category
  - display name
- No hard-coded calculator lists in layout code

## 5. Main Calculation Pane (Center, Top)

Purpose

- Primary interaction area
- Core value delivery

Requirements

- Pane size MUST be fixed per calculator (no layout jump)
- Contains:
  - calculator inputs
  - calculate action
  - numeric results
- MUST NOT contain side navigation
- MUST NOT contain explanation text

Performance Rules

- Only the active calculator’s logic may run here
- No other calculators’ logic may be loaded or executed
- Graphs in this pane (if any) load only after calculation

Modularity

- Each calculator provides:
  - a calculation pane definition
  - input/output bindings
- Pane rendering logic is shared
- Calculator logic plugs into this pane via a defined interface

## 6. Explanation Pane (Center, Bottom)

Purpose

- Human explanation
- SEO depth
- Trust building

Requirements

- Contains:
  - explanation of “how much” logic
  - assumptions
  - examples
  - edge cases
- Text must be present in HTML (not injected at runtime)
- Has its own optional internal sidebar (right side of this pane only)

SEO Rules

- Explanation content must be crawlable
- Headings must follow semantic order (H2/H3)
- Must not depend on JS execution to appear

Modularity

- Explanation content belongs to the calculator module
- Layout and rendering belong to shared page shell
- Explanation updates must not affect calculation logic

## 7. Right Monetization Panes (Ads)

Purpose

- Revenue generation
- Stable layout for ad networks

Requirements

- Two fixed ad panes:
  - One aligned with calculation pane
  - One aligned with explanation pane
- Ad containers must exist even if ads fail to load
- Ad loading must be async and non-blocking

Performance Rules

- Ads MUST NOT block calculation logic
- Ads MUST NOT shift layout after initial render

Modularity

- Ads are completely decoupled from calculators
- No calculator module may reference ad logic

## 8. Footer

Purpose

- Legal compliance
- Trust
- Secondary navigation

Requirements

- Contains:
  - About
  - Sitemap
  - Terms
  - Privacy Policy
  - Contact
- Same footer across all pages
- Static content (no calculator dependency)

## 9. Modular Responsibility Boundaries (Strict)

| Layer | Responsibility |
| --- | --- |
| Layout Shell | Header, panes, footer, ads |
| Navigation Schema | Categories, subcategories, calculator list |
| Calculator Module | Calculation logic + explanation content |
| Core Runtime | Validation, formatting, shared math |
| Graph Engine | Optional, loaded on demand |

Rules:

- Layout MUST NOT contain calculation logic
- Calculator logic MUST NOT control layout
- Navigation MUST NOT embed calculator logic
- Ads MUST NOT interact with calculators

## 10. SEO + URL Behavior Constraints

- Each calculator must be addressable via direct URL
- URL must reflect category + calculator
- Changing calculator selection must update:
  - URL
  - title
  - meta description
  - canonical
- Page shell remains consistent to avoid CLS (layout shift)

## 11. Scale & Maintainability Requirements

Adding a new calculator must require:

- new calculator folder
- navigation schema update
- sitemap update

No changes to global layout required

No regression risk to existing calculators

## 12. Summary (Engineering Truth)

This UI is not a single calculator page. It is a calculator container framework.

- Layout is fixed and shared
- Navigation is data-driven
- Calculators are plug-ins
- Explanations are first-class SEO content
- Ads are isolated
- Performance cost scales linearly per calculator, not exponentially

This structure is compatible with:

- 10 calculators
- 100 calculators
- 1,000 calculators

without turning into a JS monolith or an SEO disaster.

If you want, next we can:

- define the navigation schema formally
- define calculator module contracts
- or map this layout to SEO page strategy (hub vs spoke)
