
PHASE 2 — Navigation Schema + Routing
Objective

Enable category and calculator selection using configuration.

Required GitHub Structure
/public
  /config
    navigation.json
  /calculators
    index.html

Requirements
=====================
	navigation.json defines:
		categories
		subcategories
		calculators (id, name, url)

	Top category selection updates left pane.
	Left pane selection:
		updates URL
		highlights selected calculator
		loads placeholder content into calculation + explanation panes

	Direct URL access must work (page refresh loads correct calculator).
	Page shell must not reload fully on selection.

Completion Criteria
	Calculator selection works via clicks and direct URLs.

Checklist
=================================
Phase 2 — Navigation + Routing

File structure
	 public/config/navigation.json exists
	 public/calculators/index.html exists

Navigation schema
	 navigation.json contains categories
	 Categories contain subcategories
	 Subcategories contain calculators (id, name, url/path)

Behavior
	 Clicking a top category updates left pane list
	 Left pane selection highlights exactly one calculator
	 Selecting calculator updates the URL (deep link)
	 Refreshing the page preserves selected calculator state from URL
	 The page shell stays intact during navigation (no full redraw)

No violations
	 No hard-coded calculator list in layout files
	 Left pane content is generated from navigation.json