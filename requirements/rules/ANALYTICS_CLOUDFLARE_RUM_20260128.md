# Cloudflare Web Analytics (RUM) Global Injection Requirement

## REQ_ID
REQ-20260128-001

## Title
Add Cloudflare Web Analytics (RUM) using manual JS snippet, inject globally for all MPA pages

## Type
Analytics

## Change Type
Site-wide Integration

## Priority
HIGH

## Status
COMPLETE

## SEO?
NO

## Description
- Use the Cloudflare-provided Web Analytics snippet (see requirements/universal-rules/snippet.md)
- Inject the snippet into the shared <head> template or generator, NOT into individual calculator pages
- Ensure every generated page (homepage, all calculators under /loans, /math, /time-and-date, etc.) includes the snippet exactly once
- Do NOT duplicate the snippet per page
- Do NOT rely on Cloudflare auto-injection
- If pages are generated via scripts/generate-mpa-pages.js, modify the base HTML head there. Otherwise, modify the shared header template used by all pages

## Acceptance Criteria
- [ ] static.cloudflareinsights.com/beacon.min.js loads on all pages
- [ ] A single POST /cdn-cgi/rum occurs per page load
- [ ] No duplicate beacons exist
- [ ] Snippet is present in the <head> of every page, exactly once
- [ ] No calculator or content page is missing the snippet

## References
- requirements/universal-rules/snippet.md (Cloudflare snippet)
- scripts/generate-mpa-pages.js (if used for page generation)
- public/layout/header.html or page-shell.html (if used as shared head template)
