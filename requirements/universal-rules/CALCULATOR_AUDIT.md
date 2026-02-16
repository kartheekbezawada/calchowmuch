# Calculator Audit Checklist (All Pages)

Use this checklist **for every calculator page**. Copy the per‑calculator section for each route and fill it out.

---

## Per‑Calculator Audit (Copy This Block)

**Calculator Name:**  
**Route:**  
**Fragment File (if any):**  
**Generated Page File:**  
**Date:**  
**Reviewer:**  

### A) UI & UX
- [ ] Calculator renders on first load without blank/flashy layout.
- [ ] Inputs are clear, labeled, and aligned with the design system.
- [ ] Numeric inputs show numeric keyboard (`inputmode` or `numeric`).
- [ ] Sliders display live value labels and are usable on mobile.
- [ ] Buttons are clear and do not trigger unexpected recalculation.
- [ ] Optional inputs are hidden behind a toggle when required.
- [ ] No new inputs/controls were added without approval.

### B) Performance & Render Blocking
- [x] Critical above‑the‑fold CSS is inlined.
- [x] Non‑critical CSS is deferred (`media="print"` + `onload` pattern).
- [x] No runtime CSS `@import` anywhere.
- [ ] Render‑blocking CSS list recorded in sign‑off evidence.
- [ ] LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.10 (lab).

### C) Layout Stability (CLS)
- [ ] No layout shift when results/tables/FAQs render.
- [ ] No layout shift from nav open/close or ads.
- [ ] Reserved space is used for dynamic content.
- [ ] `ISS-001` passes for this route or scope.

### D) SEO & Schema
- [ ] Title and meta description present and accurate.
- [ ] Canonical URL is correct.
- [ ] OpenGraph and Twitter tags present.
- [ ] FAQ schema matches visible FAQ content.
- [ ] Explanation section exists and matches required structure.
- [ ] Page is indexable (`robots` allows indexing).

### E) Ads & Policy
- [ ] No ads above H1 on mobile.
- [ ] Ads do not overlap inputs/results.
- [ ] Ads do not cause CLS.
- [ ] Ads load after initial calculator render.

### F) Tests (All Required)
- [ ] `npm run lint`
- [ ] `npm run lint:css-import`
- [ ] `npm run test`
- [ ] E2E tests for this calculator or subcategory
- [ ] `TARGET=... npm run test:cwv:target`
- [ ] `npm run test:iss001`

### G) Sitemap & Navigation
- [ ] Route appears in sitemap.
- [ ] Navigation links point to correct route.
- [ ] No broken internal links.

### H) Notes & Decisions
- [ ] Any deviations are documented with a reason.
- [ ] Follow‑ups are listed with owners and dates.

---

## Summary Log (Optional)

Use one line per calculator after completing the audit block.

**Date | Calculator | Route | Result | Notes**
---|---|---|---|---
 |  |  |  | 

---

## Per‑Calculator Audit (Copy This Block)

**Calculator Name:** Future Value of Annuity Calculator  
**Route:** /finance/future-value-of-annuity/  
**Fragment File (if any):** N/A  
**Generated Page File:** public/finance/future-value-of-annuity/index.html  
**Date:** 2026-02-16  
**Reviewer:** Codex (Agent)  

### A) UI & UX
- [ ] Calculator renders on first load without blank/flashy layout.
- [ ] Inputs are clear, labeled, and aligned with the design system.
- [ ] Numeric inputs show numeric keyboard (`inputmode` or `numeric`).
- [ ] Sliders display live value labels and are usable on mobile.
- [ ] Buttons are clear and do not trigger unexpected recalculation.
- [ ] Optional inputs are hidden behind a toggle when required.
- [ ] No new inputs/controls were added without approval.

### B) Performance & Render Blocking
- [ ] Critical above‑the‑fold CSS is inlined.
- [ ] Non‑critical CSS is deferred (`media="print"` + `onload` pattern).
- [ ] No runtime CSS `@import` anywhere.
- [ ] Render‑blocking CSS list recorded in sign‑off evidence.
- [ ] LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.10 (lab).

### C) Layout Stability (CLS)
- [ ] No layout shift when results/tables/FAQs render.
- [ ] No layout shift from nav open/close or ads.
- [ ] Reserved space is used for dynamic content.
- [ ] `ISS-001` passes for this route or scope.

### D) SEO & Schema
- [ ] Title and meta description present and accurate.
- [ ] Canonical URL is correct.
- [ ] OpenGraph and Twitter tags present.
- [ ] FAQ schema matches visible FAQ content.
- [ ] Explanation section exists and matches required structure.
- [ ] Page is indexable (`robots` allows indexing).

### E) Ads & Policy
- [ ] No ads above H1 on mobile.
- [ ] Ads do not overlap inputs/results.
- [ ] Ads do not cause CLS.
- [ ] Ads load after initial calculator render.

### F) Tests (All Required)
- [ ] `npm run lint`
- [ ] `npm run lint:css-import`
- [ ] `npm run test`
- [ ] E2E tests for this calculator or subcategory
- [ ] `TARGET=... npm run test:cwv:target`
- [ ] `npm run test:iss001`

### G) Sitemap & Navigation
- [ ] Route appears in sitemap.
- [ ] Navigation links point to correct route.
- [ ] No broken internal links.

### H) Notes & Decisions
- [x] Any deviations are documented with a reason.
- [x] Follow‑ups are listed with owners and dates.

**Notes (Audit Evidence):**
- Local audit (before): `test-results/seo/local-audit/fva-audit.md`
- Local audit (after CSS deferral): `test-results/seo/local-audit/fva-audit-after.md`
- Local audit (after title fix): `test-results/seo/local-audit/fva-audit-after-title-3.md`
- Performance after change: Mobile LCP 6.90s (WARN), Mobile score 74; Desktop LCP 1.86s.
- SEO warning resolved: Title length 48 (PASS).
**Follow‑ups:**
- Owner: AGENT — If approved, continue performance work beyond HTML-only changes.
