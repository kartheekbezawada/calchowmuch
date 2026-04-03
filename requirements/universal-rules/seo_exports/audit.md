MASTER SEO DIAGNOSTIC ROADMAP (FOR CODEX)

This is designed for your architecture (MPA, generator, Cloudflare, no bundler).

📊 PHASE 0 — SITE INVENTORY (Ground Truth)
🎯 Goal

Understand exactly what exists vs what you think exists.

Check	What to Extract	Codex Prompt
All routes	Full list of generated URLs	“List all final generated public URLs from generator, sitemap, and route configs. Deduplicate and give final canonical set.”
Route sources	Where routes come from	“Show all files responsible for route generation (navigation.json, route-ownership.json, generator scripts).”
Duplicate routes	Competing URLs	“Find all URLs that resolve to same calculator (canonical vs /calculators/* vs legacy). Group them.”
Missing pages	In nav but not generated	“Find any routes in navigation.json that are not generated into HTML.”
📊 PHASE 1 — INDEXABILITY & CRAWL CONTROL
🎯 Goal

Ensure Google sees only what you want.

Check	What to Extract	Codex Prompt
Robots meta	Index/noindex correctness	“Scan all HTML templates and confirm <meta name="robots"> exists and is static.”
Headers	/calculators/* behavior	“Show Cloudflare _headers file rules and identify which paths are indexable.”
Canonical tags	Correct canonical mapping	“Extract canonical tag from each page and compare with URL.”
Sitemap	Clean canonical list	“List all URLs in sitemap.xml and confirm no duplicates or non-canonical routes.”
Crawl leaks	Hidden pages exposed	“Find any HTML files under /calculators/* or other paths that are publicly accessible.”
📊 PHASE 2 — URL & STRUCTURE HYGIENE
🎯 Goal

One URL = one intent.

Check	What to Extract	Codex Prompt
Trailing slash	Consistency	“Check if slashless URLs redirect to trailing slash versions.”
Slug consistency	Naming patterns	“List all calculator slugs and identify inconsistent naming patterns.”
Category alignment	URL hierarchy	“Map all URLs to categories and check for misplacement.”
Legacy slugs	Old URLs still referenced	“Find any references to old slugs like countdown-timer-generator.”
📊 PHASE 3 — ON-PAGE SEO STRUCTURE
🎯 Goal

Ensure every page is SERP-optimized.

Check	What to Extract	Codex Prompt
Title tags	Quality + format	“Extract title tags for all calculator pages.”
H1 tags	Exact match keyword	“Extract H1 for all pages and compare with URL slug.”
Meta descriptions	Present + optimized	“Extract meta descriptions and check length + duplication.”
Heading structure	H2/H3 hierarchy	“Show heading structure for top 20 pages.”
Intro blocks	Snippet readiness	“Extract first 100 words of each page.”
📊 PHASE 4 — CONTENT DEPTH & INTENT MATCH
🎯 Goal

Match what Google expects.

Check	What to Extract	Codex Prompt
Word count	Content depth	“Calculate word count for each page explanation section.”
FAQ presence	Query targeting	“List pages with FAQ sections and their questions.”
Examples	Practical content	“Find pages that include worked examples.”
Tables	Structured data	“Find pages with tables or structured outputs.”
📊 PHASE 5 — INTERNAL LINKING & CLUSTERS
🎯 Goal

Build topical authority.

Check	What to Extract	Codex Prompt
Internal links	Link graph	“Extract all internal links between calculator pages.”
Orphan pages	No links	“Find pages with zero internal links pointing to them.”
Cluster strength	Topic grouping	“Group pages into clusters (credit cards, loans, percentage, time/date).”
Cross-linking	Related calculators	“Check if related calculators are linked within each page.”
📊 PHASE 6 — TECHNICAL PERFORMANCE (CRITICAL FOR YOU)
🎯 Goal

Pass CWV + avoid ranking suppression.

Check	What to Extract	Codex Prompt
CSS loading	Render blocking	“List all CSS files loaded per page and check for @import usage.”
JS loading	Blocking scripts	“List JS files and identify blocking vs deferred.”
CLS risk	Layout shifts	“Identify elements that load late and may cause layout shift.”
LCP element	What Google sees	“Identify largest element in above-the-fold content.”
📊 PHASE 7 — STRUCTURED DATA
🎯 Goal

Maximize SERP features.

Check	What to Extract	Codex Prompt
JSON-LD presence	Schema coverage	“Extract JSON-LD from each page.”
Schema types	Correct usage	“List schema types used (WebPage, SoftwareApplication, FAQPage).”
Duplication	Multiple injections	“Check if JSON-LD is duplicated or injected via JS.”
Visibility match	FAQ mismatch	“Verify FAQ schema matches visible content.”

PHASE 9 — CONTENT FARM RISK AUDIT
🎯 Goal

Avoid Google suppression.

Check	What to Extract	Codex Prompt
Thin pages	Low value	“Find pages with low word count and no examples.”
Duplicate patterns	Same template content	“Compare explanation sections across pages.”
Value differentiation	Unique content	“Identify pages with identical structure and wording.”