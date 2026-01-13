PHASE 5 — SEO + Sitemap + Ads Hooks
Objective

Production readiness.

Required GitHub Structure
/public
  sitemap.xml
  robots.txt
  /seo
    structured-data.json

Requirements
================
Each calculator page must have:
	unique title
	unique meta description
	canonical URL

Explanation content must be visible without JS execution.
All calculators must be listed in sitemap.
Structured data support (FAQ / HowTo) per calculator.
Ads load asynchronously inside fixed containers.
Ads must not block calculation or affect layout.

Completion Criteria
=====================
Pages are indexable, fast, and monetization-ready.


Phase 5 — SEO + Sitemap + Ads Hooks

File structure
	 public/sitemap.xml exists
	 public/robots.txt exists
	 public/seo/structured-data.json exists (or equivalent per-calculator data file)

SEO tags per calculator
	 Unique <title> per calculator
	 Unique meta description per calculator
	 Canonical URL present per calculator
	 Headings follow semantic structure (h1 then h2/h3)

Indexing
	 All calculator URLs appear in sitemap.xml
	 Calculators index page lists calculators by category/subcategory

Ads hooks
	 Ad containers exist (fixed size placeholders)
	 Ad loading is async and non-blocking
	 Ads do not interfere with calculator compute or input responsiveness

Global “Red Flag” Violations (Auto-Fail)
	 Any single JS bundle includes multiple calculators together (monolith bundle)
	 Explanation content is injected via JS only (not present in HTML)
	 Layout shell contains calculator-specific logic
	 Chart library loads on initial page load
	 Calculator modules reference each other directly
	 URL cannot deep-link to a specific calculator selection