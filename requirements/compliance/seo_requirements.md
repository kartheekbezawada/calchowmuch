

## SEO Requirements 

| Heading              | Subheading            | Description                                                       | Priority | Checkable     |
| -------------------- | --------------------- | ----------------------------------------------------------------- | -------- | ------------- |
| Indexing & Canonical | Crawlable & Indexable | Page must not be blocked by `robots.txt` or unintended `noindex`. | P1       | Auto + Manual |
| Indexing & Canonical | Canonical Present     | Page must define exactly one canonical URL.                       | P1       | Auto          |
| Indexing & Canonical | Canonical Accuracy    | Canonical path must match the actual page path.                   | P1       | Auto          |
| Indexing & Canonical | HTTPS Enforcement     | Page must load over HTTPS with no mixed content.                  | P1       | Auto          |
| URL Structure        | URL Format            | URLs must be lowercase and hyphen-separated.                      | P1       | Auto          |
| URL Structure        | URL Pattern           | URLs must follow `/calculators/{category}/{calculator-name}`.     | P1       | Auto          |
| URL Structure        | No Query Params       | Static calculator pages must not use query parameters or hashes.  | P1       | Auto          |
| URL Structure        | No Orphan Pages       | Page must be reachable via internal links.                        | P1       | Manual        |
| Titles & Meta        | Title Tag             | Unique, descriptive `<title>` with primary keyword.               | P1       | Auto          |
| Titles & Meta        | Meta Description      | Unique `<meta name="description">` (~150–160 chars).              | P1       | Auto          |
| Titles & Meta        | Single H1             | Exactly one `<h1>` aligned with page topic.                       | P1       | Auto          |
| Sitemap              | Sitemap Inclusion     | Page must be listed in `sitemap.xml`.                             | P1       | Auto          |
| Sitemap              | Sitemap Updated       | Sitemap must be updated when calculators are added.               | P1       | Auto          |
| Structured Data      | JSON-LD Present       | Calculator page must include JSON-LD structured data.             | P1       | Auto          |
| Structured Data      | Required Fields       | JSON-LD must include `@type`, `name`, `description`, `url`.       | P1       | Auto          |
| Structured Data      | Schema Validity       | Structured data must validate in Rich Results Test.               | P1       | Auto          |
| Content Quality      | Intent Intro          | Page must clearly state the user problem at the top.              | P2       | Auto          |
| Content Quality      | Usage Instructions    | Page must explain how to use the calculator and inputs.           | P2       | Auto          |
| Content Quality      | Result Explanation    | Page must explain what the result means.                          | P2       | Auto          |
| Content Quality      | Example Scenario      | Page must include a worked example.                               | P2       | Auto          |
| Content Quality      | FAQ / Q&A             | FAQ or Q&A should be present where applicable.                    | P2       | Auto          |
| Content Structure    | Heading Hierarchy     | Content must use logical H2/H3 structure.                         | P2       | Auto          |
| Internal Linking     | Related Links         | Page must link to relevant calculators/content.                   | P2       | Auto          |
| Internal Linking     | Anchor Text           | Internal links must use descriptive anchors.                      | P2       | Manual        |
| Taxonomy             | Category Grouping     | Calculators must belong to a clear category.                      | P3       | Manual        |
| Taxonomy             | Breadcrumbs           | Breadcrumb navigation should be implemented if applicable.        | P3       | Auto + Manual |
| Programmatic SEO     | Template Consistency  | Pages should be generated from consistent templates.              | P3       | Manual        |
| Programmatic SEO     | Content Uniqueness    | Programmatic pages must not reuse identical content blocks.       | P3       | Manual        |
| Mobile UX            | Mobile Usability      | Page must be usable on mobile (no broken layout).                 | P4       | Manual        |
| Mobile UX            | No Intrusive Overlays | No pop-ups blocking content, especially on mobile.                | P4       | Manual        |
| Performance          | LCP Target            | LCP target < 2.5s.                                                | P5       | Manual        |
| Performance          | CLS Target            | CLS target < 0.1.                                                 | P5       | Manual        |
| Performance          | Interaction Metric    | FID/INP should meet Google thresholds.                            | P5       | Manual        |


##### How to use this table operationally #####

    P1 → must pass for release (most are auto-checkable via Playwright SEO tests)
    P2 → required for strong rankings (manual content validation)
    P3 → scaling hygiene (checked when adding categories/templates)
    P4 → baseline usability (desktop-first allowed)
    P5 → tracked and optimized later (non-blocking unless explicitly required



---

## Additional SEO Requirements (Placeholder)

> **Note**: Additional SEO requirements will be added here as they are defined.
> This section is reserved for future Search Engine Requirements specification.

### Coming Soon
- [ ] Open Graph meta tags requirements
- [ ] Twitter Card requirements  
- [ ] Schema.org markup requirements
- [ ] Accessibility (A11y) requirements
- [ ] International SEO requirements (hreflang)
