Objective
===============================
Add a Math category to the application with a Simple sub-section containing three calculators:
	Basic
	Percentage Calculator
	Fraction Calculator

Each calculator must load dynamically into the existing page shell without full page reload, using a strict folder-based contract:
	index.html → Main Calculation pane content
	module.js → Calculation logic (ES module)
	explanation.html → Static explanation content

The Percentage Calculator and Fraction Calculator must each be a single page with multiple calculation modes and must display static explanations with worked examples in the Explanation pane.

Navigation, deep linking, UI state, and calculator loading must remain consistent and stable across category switches and direct URL visits.

Requirements
=======================
1) Navigation Schema (Config) Update

Add category Math with subheading Simple containing:
	Basic
	Percentage Calculator
	Fraction Calculator

Each calculator must define:
	stable id
	display name
	deep-linkable url/path

Deep linking rules:
	activate Math in top navigation
	expand Simple in the left pane
	highlight the correct calculator item
	load the calculator and explanation content

2) Top Navigation Button (UI)
	Add a Math button to the top category navigation.
	Clicking Math must:
		activate Math (visual state)
		populate left pane with Simple and the three calculators
		default-select Basic if no deep link is present

3) Left Side Pane (Structure + Behavior)

When Math is active, left pane must show:
Simple
	Basic
	Percentage Calculator
	Fraction Calculator

Behavior rules:
	Exactly one selection active at a time.
	Selecting an item:
		updates URL to that calculator’s path
		loads that calculator in the Main Calculation pane
		loads corresponding explanation in the Explanation pane

4) Percentage Calculator — Logic Pane Requirements (Single Page, Multi-Mode)

Percentage must be one calculator page with one UI that can perform all of these operations inside the same logic pane:

	4.1 Supported Operations (must)

		Provide a mode selector (tabs, dropdown, segmented control, etc.) with these modes:
			Percentage Increase
				Inputs: original value, new value
				Output: increase amount and % increase

		Percentage Decrease
			Inputs: original value, new value
			Output: decrease amount and % decrease
			
		What % of what
			Inputs: part value, whole value
			Output: percent (part/whole * 100)

		What is X% of Y
			Inputs: percent X, base value Y
			Output: result (X/100 * Y)

	4.2 UX Rules
		Only show inputs relevant to the selected mode.
		Outputs update only when inputs are valid (calculate click or debounced input).
		Handle invalid cases cleanly (e.g., whole = 0).
		Keep the pane height stable (avoid layout jumping between modes).

5) Fraction Calculator — Logic Pane Requirements (Single Page, Multi-Mode)
Fraction must be one calculator page supporting multiple operations:

	5.1 Supported Operations (must)
		Provide a mode selector with:
		Add fractions
		Subtract fractions
		Multiply fractions
		Divide fractions
		Simplify fraction
		Convert improper ↔ mixed number

	5.2 Output Rules
		Show simplified result by default.
		Provide mixed form where applicable (optional but recommended).

6) Explanation Pane Requirements (Static HTML + Examples)
	
	6.1 Percentage Calculator Explanation (must)
		Explanation pane must contain static HTML (not JS-generated) including:
		Short explanation for each of the four percentage modes
		At least one worked example per mode:
		Increase example: 80 → 100
		Decrease example: 100 → 75
		What % of what: 25 of 200 = 12.5%
		What is X% of Y: 15% of 80 = 12
		Clarify “relative to original” for increase/decrease
		Mention divide-by-zero handling for “what % of what” when whole = 0

	6.2 Fraction Calculator Explanation (must)
		Static HTML including examples for:
		1/4 + 1/8 = 3/8
		3/4 − 1/6 = 7/12
		2/3 × 3/5 = 2/5
		2/3 ÷ 4/5 = 5/6
		Simplify 6/8 = 3/4
		Convert 7/3 = 2 1/3 and 1 2/5 = 7/5
		Content must be visible without JS execution.

7) Non-Functional Constraints
	No full page reload when switching categories or calculators
	Calculator modules must re-initialize correctly when switching
	No duplicate DOM IDs in the page shell
	No layout shift when switching calculators or modes
	No console errors
	Heavy libraries must not load unless required (future-proofing)

Checklist (Pass/Fail)
===============================
Navigation/UI
	 Math button exists in top nav
	 Clicking Math shows Simple section in left pane
	 Left pane lists: Basic, Percentage Calculator, Fraction Calculator
	 Selecting each updates URL and highlights exactly one item
	 Deep link to each calculator URL restores correct selection
	 
File Structure
	Each calculator folder exists under /calculators/math/
	Each folder contains:
		index.html
		module.js
		explanation.html
	No references to non-existent files

Dynamic Loading
	index.html injected into Main Calculation pane
	explanation.html injected into Explanation pane
	Previous calculator DOM is cleared on switch
	Previous calculator module script is removed before loading the next
	Module logic runs after HTML injection

Percentage Calculator (Single Page)
	 Single Percentage Calculator page exists
	 Has 4 modes: Increase, Decrease, What % of what, What is X% of Y
	 Inputs change based on selected mode
	 Invalid inputs handled (whole=0 etc.)
	 No layout jump between modes

Fraction Calculator (Single Page)
	 Single Fraction Calculator page exists
	 Supports add/subtract/multiply/divide/simplify/convert
	 Outputs are simplified

Explanation Pane
	 Percentage explanation is static HTML and includes examples for all 4 modes
	 Fraction explanation is static HTML and includes examples for all modes
	 Explanation visible with JS disabled

Stability
	No console errors
	No 404s in network tab
	No duplicate element IDs
	No layout shift during navigation