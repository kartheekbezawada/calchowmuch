# 📝 Release Sign-Off

## 1) Release Identity

| Field                     | Value                                                                                                                          |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
| **Release ID**            | RELEASE-YYYYMMDD-XXX                                                                                                           |
| **Release Type**          | Category (Finance Route-Bundle Pilot)                                                                                          |
| **Scope (Global/Target)** | `/finance/present-value/`, `/finance/future-value/`, `/finance/future-value-of-annuity/`, `/finance/present-value-of-annuity/` |
| **Branch / Tag**          | local                                                                                                                          |
| **Commit SHA**            | 0faed45b6063d594783016f24c4da4169f11da96                                                                                       |
| **Environment**           | local                                                                                                                          |
| **Owner**                 | TBD                                                                                                                            |
| **Date**                  | 2026-02-16                                                                                                                     |

---

## 2) Release Checklist

| ID        | Category          | Criteria                                                                                                                           | Result (Pass/Fail)                                                    |
| :-------- | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| **A1**    | **Rendering**     | • Calculator UI renders immediately (no ads blocking)<br>• Initial state in HTML (no JS-only)<br>• No runtime injection above-fold | PASS (`test:above-fold` pass on all 4 routes)                         |
| **A2**    | **CSS Arch**      | • No `@import`<br>• Critical CSS early<br>• Max 5 blocking files                                                                   | PASS (route-bundle model; exactly 1 blocking CSS per pilot route)     |
| **A3**    | **CLS Control**   | • No layout shift on load/interaction<br>• Reserved space for ads/images                                                           | PASS (CWV guard + ISS-001)                                            |
| **A4**    | **JS Discipline** | • No heavy tasks >50ms<br>• Smooth slider/typing interaction                                                                       | PASS (`test:interaction:guard`)                                       |
| **A5**    | **Caching**       | • Long-TTL for static assets<br>• Versioned URLs                                                                                   | MANUAL ANNEX (Cloudflare-managed)                                     |
| **B1**    | **Mobile Layout** | • Single-column layout<br>• No horizontal overflow<br>• Burger nav stable                                                          | PASS (`test:mobile:ux`)                                               |
| **B2**    | **Mobile Inputs** | • Numeric keyboard for numbers<br>• Min/max attributes used                                                                        | PASS (`test:mobile:ux`)                                               |
| **B3**    | **Mobile Ads**    | • **No ads above H1** (Hard Rule)<br>• No overlap with UI                                                                          | MANUAL ANNEX                                                          |
| **C1**    | **Field Metrics** | • LCP ≤ 2.5s<br>• CLS ≤ 0.10<br>• INP ≤ 200ms                                                                                      | **FAIL** (Lighthouse LCP > 2500ms on all 4 routes; CLS/INP pass)      |
| **C2**    | **Lab Gates**     | • No filmstrip shifts<br>• No long tasks near start                                                                                | PASS (`test:iss001`, `test:interaction:guard`)                        |
| **D1-D4** | **CWV Guard**     | • `npm run test:cwv:target` passed<br>• No regression >20%                                                                         | PASS (all 4 route artifacts, violationCount=0)                        |
| **E1**    | **Ad Slots**      | • Reserved `min-height`<br>• Non-collapsing                                                                                        | MANUAL ANNEX                                                          |
| **E2**    | **Ad Loading**    | • Lazy loaded (requestIdleCallback)<br>• Single loader script                                                                      | MANUAL ANNEX                                                          |
| **E3**    | **Ad Policy**     | • No policy violations (AdSense)<br>• No misleading placement                                                                      | MANUAL ANNEX                                                          |
| **F**     | **Animation**     | • `opacity`/`transform` only<br>• Reduced motion support                                                                           | PASS (`test:iss001`)                                                  |
| **G1**    | **First Load**    | • No FOUC/Jump<br>• Usable <3s (throttled)                                                                                         | PARTIAL (no flash reported in automation; Lighthouse LCP still >2.5s) |
| **G2**    | **Interaction**   | • Smooth slider drag<br>• Instant mode toggle                                                                                      | PASS (`test:interaction:guard`)                                       |
| **G3**    | **Navigation**    | • Full `href` links<br>• Subcategories collapsed                                                                                   | PASS (finance E2E + interaction nav stability)                        |
| **H**     | **Accessibility** | • Keyboard navigable<br>• `aria-live` for results<br>• Zoom 200% valid                                                             | PASS (`test:accessibility:ux`, Lighthouse a11y score 96 on all 4)     |
| **I1**    | **Metadata**      | • Unique Title/Desc<br>• Canonical URL present                                                                                     | PASS (finance SEO E2E specs pass)                                     |
| **I2**    | **Schema**        | • `SoftwareApplication`<br>• `FAQPage`<br>• `BreadcrumbList`                                                                       | PASS (finance SEO E2E + source parity test)                           |
| **I3**    | **Indexability**  | • Content in initial HTML<br>• Crawlable without JS                                                                                | PASS (SEO E2E + static HTML structure)                                |
| **I4**    | **Sitemap**       | • Route present in sitemap.xml                                                                                                     | PASS (SEO E2E)                                                        |
| **J**     | **Content**       | • Explanation present<br>• Worked example<br>• 3+ FAQs                                                                             | PASS (route fragments include explanation + FAQ content)              |
| **K**     | **Security**      | • HTTPS only<br>• Privacy/Terms linked                                                                                             | MANUAL ANNEX (local run) + AUTO PASS for mixed-content scan           |

---

## 3) 🏆 Elite Performance (Addendum)

| ID     | Category        | Criteria                                        | Result                                                                      |
| :----- | :-------------- | :---------------------------------------------- | :-------------------------------------------------------------------------- |
| **X1** | **Investigate** | • LCP Element identified<br>• Mobile FCP ≤ 1.8s | PARTIAL (LCP element captured per route; FCP not recorded in script output) |
| **X2** | **Stress Test** | • CPU 4× / Slow 3G<br>• Stress LCP ≤ 2.3s       | PASS (all 4 stress LCP values 1292-1376ms)                                  |

---

## 4) Evidence & Metrics

### Bundle Integrity

- `npm run build:css:route-bundles` PASS
- `npm run verify:css:route-bundles` PASS
- Manifest: `public/assets/css/route-bundles/manifest.json`
- Route bundles:
  - `/assets/css/route-bundles/finance-present-value.556be6da.css`
  - `/assets/css/route-bundles/finance-future-value.4ae3d18e.css`
  - `/assets/css/route-bundles/finance-future-value-of-annuity.6720900d.css`
  - `/assets/css/route-bundles/finance-present-value-of-annuity.f40b1695.css`

### Render-Blocking CSS (Pilot Requirement)

- Render-blocking CSS request count: **1** on each pilot route (from Lighthouse report `render-blocking-resources.details.items`).
- Savings:
  - PV: 450ms
  - FV: 450ms
  - FVA: 300ms
  - PVOA: 300ms

### Lighthouse (Local, Headless Chromium)

- Script: `scripts/lighthouse-target.mjs`
- Chromium flags: `--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage`
- Artifacts directory: `compliance/lighthouse-pilot`

| Route                                | Perf | A11y |  BP | LCP (ms) |    CLS | INP (ms) | LCP Element                     |
| :----------------------------------- | ---: | ---: | --: | -------: | -----: | -------: | :------------------------------ |
| `/finance/present-value/`            |   93 |   96 |  79 |  2762.49 |      0 |      145 | `span#pv-fv-display`            |
| `/finance/future-value/`             |   95 |   96 |  79 |  2695.28 |      0 |      100 | `span#fv-pv-display`            |
| `/finance/future-value-of-annuity/`  |   94 |   96 |  79 |  2600.53 | 0.0018 |      145 | `div.mtg-form-panel > p.helper` |
| `/finance/present-value-of-annuity/` |   94 |   96 |  79 |  2619.89 | 0.0018 |      138 | `div.mtg-form-panel > p.helper` |

### CWV Guard (Targeted)

- Commands: `TARGET=<route> npm run test:cwv:target` for all 4 routes
- Artifacts directory: `compliance/cwv-pilot`

| Route                                | Normal CLS | Stress CLS | Stress maxShift | Normal LCP (ms) | Stress LCP (ms) | Normal INP Proxy (ms) | Stress INP Proxy (ms) | Violations |
| :----------------------------------- | ---------: | ---------: | --------------: | --------------: | --------------: | --------------------: | --------------------: | ---------: |
| `/finance/present-value/`            |          0 |     0.0005 |          0.0005 |             168 |            1292 |                    80 |                    48 |          0 |
| `/finance/future-value/`             |          0 |     0.0005 |          0.0005 |             164 |            1324 |                    80 |                    48 |          0 |
| `/finance/future-value-of-annuity/`  |          0 |     0.0008 |          0.0005 |             164 |            1376 |                    72 |                    80 |          0 |
| `/finance/present-value-of-annuity/` |          0 |     0.0008 |          0.0005 |             160 |            1336 |                    80 |                    48 |          0 |

### Additional Automation

- `TARGET_ROUTE=<route> npm run test:above-fold` PASS on all 4 routes
- `TARGET_ROUTE=<route> npm run test:mobile:ux` PASS on all 4 routes
- `TARGET_ROUTE=<route> npm run test:accessibility:ux` PASS on all 4 routes
- `TARGET_ROUTE=<route> npm run test:interaction:guard` PASS on all 4 routes
- `npm run test:e2e -- <8 finance specs>` PASS
- `npm run test -- <4 finance unit specs>` PASS
- `npm run test:seo:source-finance` PASS
- `npm run test:iss001` PASS
- `npm run validate` PASS

### Global Gate Status

- `npm run validate` PASS (`lint`, `lint:css-import`, unit tests, `format:check`).

### Manual Annex (Non-Blocking)

- Ads policy/placement: E1–E3, B3 (manual on staging/prod with ad fill)
- HTTPS validation: K (manual on staging/prod)
- Caching headers: A5 (Cloudflare-managed)

### Exceptions

| ID     | Issue                                                      | Severity | Owner |
| :----- | :--------------------------------------------------------- | :------- | :---- |
| EX-001 | Lighthouse LCP remains above 2500ms on all 4 pilot routes. | HARD     | TBD   |

---

## 5) Final Sign-Off

**Decision:** [ ] APPROVED / [x] REJECTED

| Role  | Name | Signature | Date |
| :---- | :--- | :-------- | :--- |
| Owner |      |           |      |
