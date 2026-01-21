# SEO Requirements and Tracker

This document defines SEO requirements and tracks SEO compliance for FSM runs.

## FSM SEO Status Definitions
- **PENDING**: SEO entry created but not yet validated.
- **PASS**: SEO validated (or placeholder used per missing SEO rule).
- **FAIL**: SEO validation failed (issue must be created, but release can still proceed).

---

## FSM SEO Tracker (Authoritative)

| SEO ID | Requirement ID | Page/Scope | Status | Evidence/Notes |
|--------|----------------|------------|--------|----------------|
| SEO-PENDING-REQ-20260119-001 | REQ-20260119-001 | Buy-to-Let Calculator page | PASS | No SEO-critical markup changes; layout verified visually |
| SEO-PENDING-REQ-20260119-002 | REQ-20260119-002 | Math/Simple/Percentage Calculator page | PENDING | Fixing calculation functionality will improve user engagement metrics and reduce bounce rate |
| SEO-PENDING-REQ-20260119-003 | REQ-20260119-003 | Math/Simple/Fraction Calculator page | PENDING | Fixing fraction operations will improve user engagement metrics and reduce bounce rate |
| SEO-PENDING-REQ-20260119-008 | REQ-20260119-008 | Math/Advanced/Number Sequence page | PASS | Calculator logic/UI updates only; no SEO markup changes |
| SEO-PENDING-REQ-20260119-009 | REQ-20260119-009 | Math/Advanced/Permutation Combination page | PASS | Calculator logic/UI updates only; no SEO markup changes |
| SEO-PENDING-REQ-20260119-010 | REQ-20260119-010 | Math/Advanced/Probability Calculator page | PASS | Calculator logic/UI updates only; no SEO markup changes |
| SEO-PENDING-REQ-20260120-017 | REQ-20260120-017 | Math/Algebra calculator suite | PASS | New calculator pages listed in navigation, index, and sitemap |
| SEO-PENDING-REQ-20260120-017 | REQ-20260120-017 | Math/Algebra/* (5 calculator pages) | PENDING | New Algebra Calculator Suite: Quadratic, System of Equations, Polynomial, Factoring, Slope & Distance. Requires meta tags, structured data, and sitemaps for 5 new pages. |
| SEO-PENDING-REQ-20260120-018 | REQ-20260120-018 | Math/Trigonometry/* (5 calculator pages) | PASS | SEO metadata, structured data, and sitemap entries added for the trigonometry suite (setPageMetadata helper + updated structured-data.json and sitemap). |
| SEO-PENDING-REQ-20260120-019 | REQ-20260120-019 | Math/Calculus/* (5 calculator pages) | PASS | Calculus Calculator Suite SEO metadata added: structured data in structured-data.json for all 5 calculators (Derivative, Integral, Limit, Series Convergence, Critical Points). Navigation entries added to navigation.json. |
| SEO-PENDING-REQ-20260120-020 | REQ-20260120-020 | Math/Logarithm/* (5 calculator pages) | PENDING | New Logarithm Calculator Suite: Natural Log, Common Log, Log Properties, Exponential Equations, Log Scale. Requires meta tags, structured data, and sitemaps for 5 new pages. |
| SEO-PENDING-REQ-20260120-021 | REQ-20260120-021 | Math/Statistics/* (5 calculator pages) | PASS | Advanced Statistics Suite implemented: Regression Analysis, ANOVA, Hypothesis Testing, Correlation, Distribution. Navigation entries added to navigation.json with keywords for discoverability. Explanation.html files added for each calculator. |

Notes:
- Use SEO-... when known; otherwise use SEO-PENDING-REQ-XXXX or SEO-N/A.
- If SEO items are missing for changed pages, add a placeholder entry and create a follow-up issue.

---

## SEO Requirements (To Be Defined)

### General SEO Rules

**SEO-GEN-1**  
Each calculator page must have unique, descriptive `<title>` tag.

**SEO-GEN-2**  
Each calculator page must have unique `<meta name="description">` tag (150-160 characters).

**SEO-GEN-3**  
All pages must have canonical URL defined.

**SEO-GEN-4**  
All images must have descriptive `alt` attributes.

**SEO-GEN-5**  
Page must be mobile-friendly and pass Core Web Vitals.

---

### URL Structure Rules

**SEO-URL-1**  
URLs must be lowercase and hyphen-separated.

**SEO-URL-2**  
URLs must follow the pattern: `/calculators/{category}/{calculator-name}`

**SEO-URL-3**  
No query parameters for static content.

---

### Structured Data Rules

**SEO-SD-1**  
Each calculator must have JSON-LD structured data.

**SEO-SD-2**  
Structured data must include: `@type`, `name`, `description`, `url`.

**SEO-SD-3**  
Structured data must be valid (test with Google Rich Results Test).

---

### Sitemap Rules

**SEO-SITEMAP-1**  
All calculator pages must be included in sitemap.xml.

**SEO-SITEMAP-2**  
Sitemap must be updated when new calculators are added.

**SEO-SITEMAP-3**  
Sitemap must include `<lastmod>`, `<changefreq>`, `<priority>`.

---

### Performance Rules

**SEO-PERF-1**  
Largest Contentful Paint (LCP) < 2.5 seconds.

**SEO-PERF-2**  
Cumulative Layout Shift (CLS) < 0.1.

**SEO-PERF-3**  
First Input Delay (FID) < 100ms.

---

## Current SEO Status

| Domain | Tests | Passed | Failed | Compliance Rate |
|--------|-------|--------|--------|--------------------|
| Math Calculators | 10 | 8 | 2 | 80% |
| Loan Calculators | 12 | 10 | 2 | 83% |
| Navigation | 3 | 3 | 0 | 100% |
| **Overall** | **25** | **21** | **4** | **84%** |

---

## SEO Summary by Priority

| Priority | Total Rules | Passed | Failed | Rate |
|----------|-------------|--------|---------|---------
| P0 (Critical) | 8 | 8 | 0 | 100% |
| P1 (Important) | 12 | 10 | 2 | 83% |
| P2 (Enhancement) | 5 | 3 | 2 | 60% |

---

## Template for New FSM SEO Entries

```markdown
| SEO-... | REQ-YYYYMMDD-### | [Page/Scope] | PENDING/PASS/FAIL | [Evidence/Notes] |
```

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
