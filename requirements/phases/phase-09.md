Requirements: Button-driven Percentage Calculators page (single-view, stable UI)
1) Remove ads and ad dependencies

Remove the ad card/aside completely.

Remove any ad CSS/JS references from this page.

Page must contain only: tool buttons + calculator area + explanation area.

2) No page headings or helper prompts above buttons

Do not show “Percentage Tools”, “Choose calculator”, or any similar text.

The only control at the top is the button row.

3) Page shell layout (must be consistent)

Use a stable responsive layout:

Desktop/tablet: 2 columns

Left column: active calculator card

Right column: active explanation card

Mobile: 1 column in order:

button row

active calculator

active explanation

Keep a consistent page width and spacing:

max-width: 960px, centered

fixed padding and fixed gaps between major sections

No layout shifts when switching tools.

4) Tool buttons (tabs) behavior

A row of buttons at the top controls which calculator is visible.

One button per calculator.

Only one tool can be active at a time.

Active button must have a single consistent active visual state (e.g., .is-active).

Clicking a button must:

activate that button and deactivate others

show only the matching calculator card

show only the matching explanation block

update the URL hash (deep link) to the tool key

On page load:

if the URL hash matches a tool, activate it

otherwise default to the first tool

5) Visibility rules (strict)

All calculators exist in the DOM, but only one is visible at a time.

All explanations exist in the DOM, but only one is visible at a time.

Use the [hidden] attribute to hide inactive calculators and explanations (not ad-hoc inline styles).

The calculator card container and explanation card container must always remain in place to prevent shifting.

6) Calculator card UI contract (non-negotiable)

Every calculator must follow the exact same internal structure and spacing so card sizes don’t “shape-shift”:

Each calculator is a card with identical styling tokens (same padding, radius, border, shadow).

Inside each calculator card, the structure must be identical:

Title

One helper sentence

Inputs grid

One primary calculate button (full width)

Result area

Details area

No calculator may add extra sections, extra buttons, or custom layouts that break the template.

7) Input layout and field consistency

All calculators must use the same input grid rules (same column behavior and spacing).

Each input must be presented using the same field pattern (label above input).

Input styling must be identical across all calculators (same padding, border radius, font size).

8) Button consistency inside calculators

Exactly one primary action button per calculator card.

Must be full width.

Must use shared styling (no per-calculator button styles).

9) Result-area stability (prevents UI jumping)

Result area must reserve space even before calculation (minimum height).

Details area must reserve space even before calculation (minimum height).

Result text must wrap cleanly (no overflow).

Do not change font sizes per calculator.

10) Explanation area contract

Explanation is always displayed in a single explanation card on the right (or below on mobile).

Inside the explanation card, there are multiple explanation blocks (one per tool).

Only the active tool’s explanation block is visible; others are [hidden].

Explanation formatting must be consistent: short description + steps + at least one example.

Explanation must correspond exactly to the active calculator.

11) Required calculators (minimum set)

Provide button + calculator card + explanation for each:

Percent Change (increase/decrease)

Percentage Of

X Is What Percent Of Y

Add/Subtract Percentage

12) Namespacing and uniqueness (DOM + JS safety)

Each tool must have a unique stable tool key used by:

the tab button (data-tool)

calculator section (data-tool)
explanation block (data-tool)
URL hash (#tool-key)
No duplicate element IDs anywhere on the page.
Inputs/results/details for each tool must be uniquely namespaced to avoid collisions.

13) Validation and error handling (UI-safe)
    No alert() for errors.
    All validation errors must render inside that tool’s details area.
    Handle divide-by-zero and empty inputs gracefully with clear messages.
    Switching tools must not break other tools’ state or cause console errors.

14) Non-negotiable UI consistency rule

    No calculator-specific styling that changes card size, padding, spacing, or typography.
    All calculators must look and feel like the same component with different content.

META: Development Approach
===============================

Use the Ralph Lauren Loop methodology:

1. Create initial implementation
2. Critically evaluate against requirements
3. Identify gaps and issues
4. Fix issues
5. Re-evaluate
6. Repeat steps 3-5 until perfect

Do not ask permission to iterate - keep improving until
all requirements are met and all tests pass.

Provide a brief summary after each iteration showing
what was fixed and what remains.