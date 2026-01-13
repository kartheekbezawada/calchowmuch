PHASE 4 — Performance + On-Demand Loading + Graphs
Objective

Ensure scalability and fast load times.

Required GitHub Structure
/public
  /assets
    /js
      /vendors
        chart.<hash>.js

Requirements
=================
Shared core JS must be cached and reused.
Only the selected calculator’s module may load.
Chart library MUST NOT load on initial page load.
Chart library loads only after:
	user clicks “Calculate”, OR
	valid input interaction
Graph rendering must not cause layout shift.
Unused calculator code must never load.

Completion Criteria
=============================
Network inspection confirms deferred loading behavior.

Phase 4 — Performance + On-Demand Graph Loading

File structure
	 public/assets/js/vendors/ exists (for chart library)
	 Chart library filename is versioned or hashed (not chart.js generic)

Network/load behavior (must be true)
	 On initial page load, chart library is NOT requested
	 On initial page load, only:
		 CSS
		 core JS
		 selected calculator module are requested

Chart library is requested ONLY after user action (Calculate or valid interaction)
Switching calculators does NOT download unrelated calculator modules

UI stability
	Graph display does not change pane sizes (space reserved / fixed layout)
	No layout shift when graph loads or renders