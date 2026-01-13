PHASE 3 — Calculator Module Contract + Initial Calculators

Objective
===================
Introduce modular calculator plugins.

Required GitHub Structure
/public
  /calculators
    /math
      /percentage-increase
        index.html
        module.js
        explanation.html
    /finance
      /credit-card-payoff
        index.html
        module.js
        explanation.html
  /assets
    /js
      /core
        math.js
        format.js
        validate.js

Requirements
=============================
Each calculator has its own folder.

index.html:
	SEO entry page
	contains inputs + explanation placeholders

module.js:
	calculator-specific logic only
	input handling
	computation
	output rendering

explanation.html:
	static HTML content
	crawlable

Core utilities must be reused (no duplication).
Implement at least two calculators:
	one simple math under math
	one percentage-increase / decrease calculator under math
	one finance “how much” calculator

Completion Criteria
	Calculators work end-to-end via navigation.