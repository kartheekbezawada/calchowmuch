

## SEO Requirements 

| Rule | Heading              | Subheading            | Description                                                       | Priority | Checkable     |
| ---- | -------------------- | --------------------- | ----------------------------------------------------------------- | -------- | ------------- |
| 1    | Indexing & Canonical | Crawlable & Indexable | Page must not be blocked by `robots.txt` or unintended `noindex`. | P1       | Auto + Manual |
| 2    | Indexing & Canonical | Canonical Present     | Page must define exactly one canonical URL.                       | P1       | Auto          |
| 3    | Indexing & Canonical | Canonical Accuracy    | Canonical path must match the actual page path.                   | P1       | Auto          |
| 4    | Indexing & Canonical | HTTPS Enforcement     | Page must load over HTTPS with no mixed content.                  | P1       | Auto          |
| 5    | URL Structure        | URL Format            | URLs must be lowercase and hyphen-separated.                      | P1       | Auto          |
| 6    | URL Structure        | URL Pattern           | URLs must follow `/calculators/{category}/{calculator-name}`.     | P1       | Auto          |
| 7    | URL Structure        | No Query Params       | Static calculator pages must not use query parameters or hashes.  | P1       | Auto          |
| 8    | URL Structure        | No Orphan Pages       | Page must be reachable via internal links.                        | P1       | Manual        |
| 9    | Titles & Meta        | Title Tag             | Unique, descriptive `<title>` with primary keyword.               | P1       | Auto          |
| 10   | Titles & Meta        | Meta Description      | Unique `<meta name="description">` (~150–160 chars).              | P1       | Auto          |
| 11   | Titles & Meta        | Single H1             | Exactly one `<h1>` aligned with page topic.                       | P1       | Auto          |
| 12   | Sitemap              | Sitemap Inclusion     | Page must be listed in `sitemap.xml`.                             | P1       | Auto          |
| 13   | Sitemap              | Sitemap Updated       | Sitemap must be updated when calculators are added.               | P1       | Auto          |
| 14   | Structured Data      | JSON-LD Present       | Calculator page must include JSON-LD structured data.             | P1       | Auto          |
| 15   | Structured Data      | Required Fields       | JSON-LD must include `@type`, `name`, `description`, `url`.       | P1       | Auto          |
| 16   | Structured Data      | Schema Validity       | Structured data must validate in Rich Results Test.               | P1       | Auto          |
| 17   | Content Quality      | Intent Intro          | Page must clearly state the user problem at the top.              | P2       | Auto          |
| 18   | Content Quality      | Usage Instructions    | Page must explain how to use the calculator and inputs.           | P2       | Auto          |
| 19   | Content Quality      | Result Explanation    | Page must explain what the result means.                          | P2       | Auto          |
| 20   | Content Quality      | Example Scenario      | Page must include a worked example.                               | P2       | Auto          |
| 21   | Content Quality      | FAQ / Q&A             | FAQ or Q&A should be present where applicable.                    | P2       | Auto          |
| 22   | Content Structure    | Heading Hierarchy     | Content must use logical H2/H3 structure.                         | P2       | Auto          |
| 23   | Internal Linking     | Related Links         | Page must link to relevant calculators/content.                   | P2       | Auto          |
| 24   | Internal Linking     | Anchor Text           | Internal links must use descriptive anchors.                      | P2       | Manual        |
| 25   | Taxonomy             | Category Grouping     | Calculators must belong to a clear category.                      | P3       | Manual        |
| 26   | Taxonomy             | Breadcrumbs           | Breadcrumb navigation should be implemented if applicable.        | P3       | Auto + Manual |
| 27   | Programmatic SEO     | Template Consistency  | Pages should be generated from consistent templates.              | P3       | Manual        |
| 28   | Programmatic SEO     | Content Uniqueness    | Programmatic pages must not reuse identical content blocks.       | P3       | Manual        |
| 29   | Mobile UX            | Mobile Usability      | Page must be usable on mobile (no broken layout).                 | P4       | Manual        |
| 30   | Mobile UX            | No Intrusive Overlays | No pop-ups blocking content, especially on mobile.                | P4       | Manual        |
| 31   | Performance          | LCP Target            | LCP target < 2.5s.                                                | P5       | Manual        |
| 32   | Performance          | CLS Target            | CLS target < 0.1.                                                 | P5       | Manual        |
| 33   | Performance          | Interaction Metric    | FID/INP should meet Google thresholds.                            | P5       | Manual        |



##### How to use this table operationally #####

    P1 → must pass for release (most are auto-checkable via Playwright SEO tests)
    P2 → required for strong rankings (manual content validation)
    P3 → scaling hygiene (checked when adding categories/templates)
    P4 → baseline usability (desktop-first allowed)
    P5 → tracked and optimized later (non-blocking unless explicitly required

