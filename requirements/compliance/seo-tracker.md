# SEO Requirements & Tests Tracker

This document defines SEO requirements and tracks SEO compliance testing for all calculators.

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

## SEO Tests Tracking Table

| SEO Test ID | Requirement ID | Build ID | SEO Rule IDs | Component | Test Description | Status | Test Date | Pass/Fail | Notes |
|-------------|---------------|----------|--------------|-----------|------------------|--------|-----------|-----------|-------|
| SEO-001 | REQ-AUTO-001 | BUILD-001 | SEO-GEN-1,2,3 | Car Loan Calculator | Meta tags validation | Not Started | - | - | - |
| SEO-002 | REQ-BTL-001 | BUILD-002 | SEO-GEN-1,2,3 | Buy-to-Let Calculator | Meta tags validation | Not Started | - | - | - |
| SEO-003 | REQ-CC-001 | BUILD-003 | SEO-GEN-1,2,3 | Credit Card Payoff | Meta tags validation | Not Started | - | - | - |
| SEO-004 | REQ-MTG-001 | BUILD-004 | SEO-GEN-1,2,3 | Mortgage Calculator | Meta tags validation | Not Started | - | - | - |
| SEO-005 | REQ-BOR-001 | BUILD-005 | SEO-GEN-1,2,3 | Borrow Calculator | Meta tags validation | Not Started | - | - | - |
| SEO-006 | REQ-EMI-001 | BUILD-006 | SEO-GEN-1,2,3 | Loan EMI Calculator | Meta tags validation | Not Started | - | - | - |
| SEO-007 | REQ-STAT-001 | BUILD-007 | SEO-GEN-1,2,3 | Statistics Calculators | Meta tags validation | Not Started | - | - | - |

---

## SEO Summary

| Date | Total SEO Tests | Not Started | Pass | Fail |
|------|----------------|-------------|------|------|
| 2026-01-19 | 7 | 7 | 0 | 0 |

---

## Template for New SEO Tests

```markdown
| SEO-XXX | REQ-XXX | BUILD-XXX | [SEO Rule IDs] | [Component] | [Description] | Not Started | - | - | - |
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
