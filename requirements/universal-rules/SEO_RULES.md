# SEO Requirements

> **Purpose:** Defines SEO validation rules by priority level  
> **Authority:** These rules determine SEO compliance for new/updated pages  
> **Last Updated:** 2026-01-22

---

## Priority Levels Overview

| Priority | Focus Area | When Required |
|----------|------------|---------------|
| **P1** | Critical SEO | All new pages, all public routes |
| **P2** | Enhanced SEO | Public-facing pages, marketing pages |
| **P3** | Performance SEO | All pages (Core Web Vitals) |
| **P4** | Accessibility Overlap | As needed, WCAG compliance |
| **P5** | Advanced SEO | Site-wide changes, technical SEO |

---

## P1 - Critical SEO (Mandatory)

Every public page **must** pass all P1 checks.

### Checklist

| Rule | Requirement | Validation |
|------|-------------|------------|
| P1.1 | Unique `<title>` tag | 50-60 characters, contains primary keyword |
| P1.2 | Unique `<meta name="description">` | 150-160 characters, compelling, contains keyword |
| P1.3 | Canonical URL | `<link rel="canonical">` points to correct URL |
| P1.4 | Single H1 tag | Exactly one `<h1>`, contains primary keyword |
| P1.5 | No duplicate content | Page content is unique across site |
| P1.6 | Mobile viewport | `<meta name="viewport">` present |
| P1.7 | Language attribute | `<html lang="en">` (or appropriate lang) |

### Automated Check

```bash
npm run test:seo -- --level p1
```

---

## P2 - Enhanced SEO (Recommended)

Public-facing and marketing pages should pass P2 checks.

### Checklist

| Rule | Requirement | Validation |
|------|-------------|------------|
| P2.1 | OpenGraph title | `<meta property="og:title">` present |
| P2.2 | OpenGraph description | `<meta property="og:description">` present |
| P2.3 | OpenGraph image | `<meta property="og:image">` with valid URL |
| P2.4 | OpenGraph type | `<meta property="og:type">` (website, article) |
| P2.5 | Twitter card | `<meta name="twitter:card">` present |
| P2.6 | Structured data | Valid JSON-LD (WebPage, Calculator, etc.) |
| P2.7 | Breadcrumb markup | BreadcrumbList schema if applicable |

### Automated Check

```bash
npm run test:seo -- --level p2
```

---

## P3 - Performance SEO (Required for Launch)

Core Web Vitals must meet thresholds.

### Checklist

| Rule | Metric | Threshold | Tool |
|------|--------|-----------|------|
| P3.1 | Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| P3.2 | First Input Delay (FID) | < 100ms | Lighthouse |
| P3.3 | Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| P3.4 | First Contentful Paint (FCP) | < 1.8s | Lighthouse |
| P3.5 | Time to Interactive (TTI) | < 3.8s | Lighthouse |
| P3.6 | Total Blocking Time (TBT) | < 200ms | Lighthouse |

### Additional P3 Rules

| Rule | Requirement |
|------|-------------|
| P3.7 | All images have `alt` text |
| P3.8 | No render-blocking resources above fold |
| P3.9 | Images properly sized and optimized |
| P3.10 | Fonts preloaded or use `font-display: swap` |

### Automated Check

```bash
npm run test:seo -- --level p3
# or
npx lighthouse <url> --only-categories=performance
```

---

## P4 - Accessibility Overlap (As Needed)

Accessibility that affects SEO.

### Checklist

| Rule | Requirement |
|------|-------------|
| P4.1 | Proper heading hierarchy (H1 → H2 → H3) |
| P4.2 | Link text is descriptive (not "click here") |
| P4.3 | Form labels associated with inputs |
| P4.4 | Color contrast meets WCAG AA (4.5:1) |
| P4.5 | Focus states visible for keyboard navigation |
| P4.6 | ARIA labels where needed |

### Automated Check

```bash
npm run test:a11y
# or
npx pa11y <url>
```

---

## P5 - Advanced SEO (Site-Wide)

Technical SEO for site infrastructure.

### Checklist

| Rule | Requirement | When |
|------|-------------|------|
| P5.1 | `sitemap.xml` exists and is valid | Any page add/remove |
| P5.2 | `robots.txt` allows crawling | Initial setup |
| P5.3 | XML sitemap submitted to Search Console | After major changes |
| P5.4 | 301 redirects for changed URLs | URL structure changes |
| P5.5 | Hreflang tags for multi-language | If applicable |
| P5.6 | HTTPS enforced | Always |
| P5.7 | WWW/non-WWW canonical decided | Initial setup |

### Automated Check

```bash
npm run test:seo -- --level p5
```

---

## SEO Validation by Change Type

| Change Type | P1 | P2 | P3 | P4 | P5 |
|-------------|:--:|:--:|:--:|:--:|:--:|
| New calculator page | ✅ | ✅ | ✅ | — | — |
| Metadata update | ✅ | ✅ | — | — | — |
| Content update | ✅ | — | — | — | — |
| Layout/styling | — | — | ✅ | ✅ | — |
| URL structure change | ✅ | — | — | — | ✅ |
| New site section | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Recording in seo_tracker.md

```markdown
| SEO_ID | REQ_ID | Page/Route | Checks Required | Status | P1 | P2 | P3 |
|--------|--------|------------|-----------------|--------|----|----|-----|
| SEO-REQ-20260122-001 | REQ-20260122-001 | /calc/tip | P1, P2, P3 | PASS | ✅ | ✅ | ✅ |
```

---

## Common SEO Issues

| Issue | Impact | Fix |
|-------|--------|-----|
| Missing meta description | Low click-through | Add unique description |
| Duplicate title tags | Confusion in SERP | Make titles unique |
| Missing canonical | Duplicate content risk | Add canonical tag |
| Slow LCP | Poor rankings | Optimize images, fonts |
| High CLS | Poor UX signal | Reserve space for dynamic content |
| Missing alt text | Accessibility + image SEO | Add descriptive alt |

---

*SEO is discoverability. Don't ship without validation.*
