Folder Structure Contract (NON-NEGOTIABLE)
===============================================
This repository follows a static-site modular calculator architecture. The structure below is the contract. Do not deviate.

1) Root structure
    /public/ is the deploy root (what gets served by the website/CDN).
    Anything outside /public/ is for development only (tests, docs, tooling).

2) Required folders and purpose
    
    /public/layout/ — shared page shell
    Contains shared layout fragments used across all pages.
        header
        footer
        page shell / pane structure
    Rules
        No calculator-specific logic here
        No calculator-specific content here
        Only shared UI structure

    /public/assets/ — shared static assets
        Contains reusable site-wide assets.

    /public/assets/css/
        Global and shared styles.
        base.css (reset, typography, base rules)
        layout.css (page shell grid/panes)
        optional: calculator.css (shared calculator UI styles)
    Rules
        Do not duplicate styles inside calculator folders unless unavoidable
        Layout styles stay in layout.css, calculator UI styles stay in calculator.css

    /public/assets/js/core/
        Shared JavaScript utilities used by many calculators.
        Examples:
            formatting (numbers, currency, percent)
            validation helpers
            small math helpers
            state helpers for navigation selection
    Rules
        Shared logic MUST live here
        Calculator folders MUST NOT duplicate core logic
        No calculator-specific logic in core

    /public/assets/js/vendors/ (optional)
        Third-party libraries (charts, etc.)
    Rules
        Must be versioned/hashed filenames
        Must not load on initial page load unless required

    /public/config/
    Configuration files that drive navigation and site structure.
        Example:
        navigation.json
    Rules
        Navigation must be config-driven
        No hard-coded calculator lists in layout code
    
    /public/calculators/ — calculators directory (source of truth)
        This folder contains all calculators grouped by category.
        
        Expected structure:
        /public/calculators/<category>/<calculator-slug>/
            Each calculator folder must contain:
            index.html (SEO entry page)
            module.js (calculator-specific logic)
            explanation.html (static explanation content)
        Rules
            One calculator = one folder
            One calculator = one index.html
            explanation.html must be crawlable (not injected by JS)
            Calculator folders must not import each other

    /public/calculators/index.html
        The master listing page for calculators (directory / landing page).
    Rules
        Must link to all active calculators
        Should reflect navigation structure

    /public/sitemap.xml and /public/robots.txt
    SEO and indexing files.
    Rules
        Every active calculator URL must appear in sitemap.xml
        robots.txt must not accidentally block calculator pages

3) Naming Rules (NON-NEGOTIABLE)
    Folder names must be lowercase and hyphen-separated.    
    ✅ credit-card-payoff
    ✅ percentage-calculator
    ❌ CreditCardPayoff

Display names in navigation can be title case, but docs must reference folder slug.