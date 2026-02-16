# 📝 Release Sign-Off

## 1) Release Identity

| Field                     | Value                                                                                                                            |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| **Release ID**            | RELEASE-YYYYMMDD-XXX                                                                                                             |
| **Release Type**          | Category (Finance LCP Stabilization Pilot)                                                                                       |
| **Scope (Global/Target)** | `/finance/present-value/`, `/finance/future-value/`, `/finance/future-value-of-annuity/`, `/finance/present-value-of-annuity/` |
| **Branch / Tag**          | local                                                                                                                            |
| **Commit SHA**            | 84cdb27f4f3258e31627707361795942695ae8c3                                                                                         |
| **Environment**           | local                                                                                                                            |
| **Owner**                 | TBD                                                                                                                              |
| **Date**                  | 2026-02-16                                                                                                                       |

---

## 2) Release Checklist

| ID        | Category          | Criteria                                                                                                                           | Result (Pass/Fail)                                                                          |
| :-------- | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| **A1**    | **Rendering**     | • Calculator UI renders immediately (no ads blocking)<br>• Initial state in HTML (no JS-only)<br>• No runtime injection above-fold | PASS (`test:above-fold` pass on all 4 routes)                                               |
| **A2**    | **CSS Arch**      | • No `@import`<br>• Critical CSS early<br>• Pilot inline-critical + deferred bundle                                               | PASS (inline critical CSS + deferred full route bundle per pilot route)                    |
| **A3**    | **CLS Control**   | • No layout shift on load/interaction<br>• Reserved space for ads/images                                                           | PASS (CWV guard + ISS-001)                                                                  |
| **A4**    | **JS Discipline** | • No heavy tasks >50ms<br>• Smooth slider/typing interaction                                                                       | PASS (`test:interaction:guard`)                                                             |
| **A5**    | **Caching**       | • Long-TTL for static assets<br>• Versioned URLs                                                                                   | MANUAL ANNEX (Cloudflare-managed)                                                           |
| **B1**    | **Mobile Layout** | • Single-column layout<br>• No horizontal overflow<br>• Burger nav stable                                                          | PASS (`test:mobile:ux`)                                                                     |
| **B2**    | **Mobile Inputs** | • Numeric keyboard for numbers<br>• Min/max attributes used                                                                        | PASS (`test:mobile:ux`)                                                                     |
| **B3**    | **Mobile Ads**    | • **No ads above H1** (Hard Rule)<br>• No overlap with UI                                                                          | MANUAL ANNEX                                                                                |
| **C1**    | **Field Metrics** | • LCP ≤ 2.5s<br>• CLS ≤ 0.10<br>• INP ≤ 200ms                                                                                      | **FAIL** (Lighthouse LCP remains >2500ms on all 4 routes; CLS/INP pass)                    |
| **C2**    | **Lab Gates**     | • No filmstrip shifts<br>• No long tasks near start                                                                                | PASS (`test:iss001`, `test:interaction:guard`)                                              |
| **D1-D4** | **CWV Guard**     | • `npm run test:cwv:target` passed<br>• No regression >20%                                                                         | PASS (all 4 route artifacts, `violationCount=0`)                                            |
| **E1**    | **Ad Slots**      | • Reserved `min-height`<br>• Non-collapsing                                                                                        | MANUAL ANNEX                                                                                |
| **E2**    | **Ad Loading**    | • Lazy loaded (requestIdleCallback)<br>• Single loader script                                                                      | MANUAL ANNEX                                                                                |
| **E3**    | **Ad Policy**     | • No policy violations (AdSense)<br>• No misleading placement                                                                      | MANUAL ANNEX                                                                                |
| **F**     | **Animation**     | • `opacity`/`transform` only<br>• Reduced motion support                                                                           | PASS (`test:iss001`)                                                                        |
| **G1**    | **First Load**    | • No FOUC/Jump<br>• Usable <3s (throttled)                                                                                         | PARTIAL (render-blocking CSS removed; Lighthouse LCP still above target)                   |
| **G2**    | **Interaction**   | • Smooth slider drag<br>• Instant mode toggle                                                                                      | PASS (`test:interaction:guard`)                                                             |
| **G3**    | **Navigation**    | • Full `href` links<br>• Subcategories collapsed                                                                                   | PASS (finance E2E + nav stability checks)                                                   |
| **H**     | **Accessibility** | • Keyboard navigable<br>• `aria-live` for results<br>• Zoom 200% valid                                                             | PASS (`test:accessibility:ux`, Lighthouse accessibility score 96 on all 4)                |
| **I1**    | **Metadata**      | • Unique Title/Desc<br>• Canonical URL present                                                                                     | PASS (finance SEO E2E specs pass)                                                           |
| **I2**    | **Schema**        | • `SoftwareApplication`<br>• `FAQPage`<br>• `BreadcrumbList`                                                                       | PASS (finance SEO E2E + source parity test)                                                 |
| **I3**    | **Indexability**  | • Content in initial HTML<br>• Crawlable without JS                                                                                | PASS (SEO E2E + static HTML structure)                                                      |
| **I4**    | **Sitemap**       | • Route present in sitemap.xml                                                                                                     | PASS (SEO E2E)                                                                              |
| **J**     | **Content**       | • Explanation present<br>• Worked example<br>• 3+ FAQs                                                                             | PASS (route fragments include explanation + FAQ content)                                    |
| **K**     | **Security**      | • HTTPS only<br>• Privacy/Terms linked                                                                                             | MANUAL ANNEX (local run) + AUTO PASS for mixed-content scan                                |

---

## 3) Evidence & Metrics

### Bundle Integrity

- `npm run build:css:route-bundles` PASS
- `npm run verify:css:route-bundles` PASS
- Manifest: `public/assets/css/route-bundles/manifest.json`
- Pilot bundle mode: `inline-critical-deferred-bundle`
- Full route bundles:
  - `/assets/css/route-bundles/finance-present-value.556be6da.css`
  - `/assets/css/route-bundles/finance-future-value.4ae3d18e.css`
  - `/assets/css/route-bundles/finance-future-value-of-annuity.6720900d.css`
  - `/assets/css/route-bundles/finance-present-value-of-annuity.f40b1695.css`
- Critical artifacts:
  - `/assets/css/route-bundles/finance-present-value.critical.3374e94c.css`
  - `/assets/css/route-bundles/finance-future-value.critical.427376fa.css`
  - `/assets/css/route-bundles/finance-future-value-of-annuity.critical.baa55d3f.css`
  - `/assets/css/route-bundles/finance-present-value-of-annuity.critical.4ba46f25.css`

### Render-Blocking CSS (Pilot Requirement)

- Render-blocking CSS request count: **0** on each pilot route.
- Lighthouse render-blocking savings:
  - PV: 0ms
  - FV: 0ms
  - FVA: 0ms
  - PVOA: 0ms

### Lighthouse (Local, Headless Chromium)

- Script: `scripts/lighthouse-target.mjs`
- Chromium flags: `--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage`
- Artifacts directory: `compliance/lighthouse-pilot`

| Route                                | Perf | A11y |  BP | LCP (ms) |    CLS | INP (ms) | LCP Element                                                                    |
| :----------------------------------- | ---: | ---: | --: | -------: | -----: | -------: | :----------------------------------------------------------------------------- |
| `/finance/present-value/`            |   92 |   96 |  79 |  3086.00 |      0 |      105 | `div.mtg-form-panel > div.input-row > div.slider-header > span#pv-fv-display` |
| `/finance/future-value/`             |   92 |   96 |  79 |  3109.00 |      0 |      103 | `div.mtg-form-panel > div.input-row > div.slider-header > span#fv-pv-display` |
| `/finance/future-value-of-annuity/`  |   93 |   96 |  79 |  3010.00 | 0.0018 |      105 | `div.calculator-ui > section.mtg-hero > div.mtg-form-panel > p.helper`        |
| `/finance/present-value-of-annuity/` |   92 |   96 |  79 |  3014.00 | 0.0018 |      125 | `div.calculator-ui > section.mtg-hero > div.mtg-form-panel > p.helper`        |

### CWV Guard (Targeted)

- Commands: `TARGET=<route> npm run test:cwv:target` for all 4 routes
- Artifacts directory: `compliance/cwv-pilot`

| Route                                | Normal CLS | Stress CLS | Stress maxShift | Normal LCP (ms) | Stress LCP (ms) | Normal INP Proxy (ms) | Stress INP Proxy (ms) | Violations |
| :----------------------------------- | ---------: | ---------: | --------------: | --------------: | --------------: | --------------------: | --------------------: | ---------: |
| `/finance/present-value/`            |          0 |     0.0087 |          0.0087 |             132 |             716 |                    96 |                    64 |          0 |
| `/finance/future-value/`             |          0 |      0.007 |           0.007 |             172 |             704 |                    80 |                    64 |          0 |
| `/finance/future-value-of-annuity/`  |          0 |     0.0075 |           0.007 |             124 |             604 |                    96 |                    72 |          0 |
| `/finance/present-value-of-annuity/` |          0 |     0.0073 |           0.007 |             204 |             648 |                   104 |                   104 |          0 |

### Additional Automation

- `TARGET_ROUTE=<route> npm run test:above-fold` PASS on all 4 routes
- `TARGET_ROUTE=<route> npm run test:mobile:ux` PASS on all 4 routes
- `TARGET_ROUTE=<route> npm run test:accessibility:ux` PASS on all 4 routes
- `TARGET_ROUTE=<route> npm run test:interaction:guard` PASS on all 4 routes
- Finance E2E calculator specs PASS (4/4)
- Finance E2E SEO specs PASS (4/4)
- `npm run test -- <4 finance unit specs>` PASS
- `npm run test:seo:source-finance` PASS
- `npm run test:iss001` PASS
- `npm run validate` PASS

### Manual Annex (Non-Blocking)

- Ads policy/placement: E1–E3, B3 (manual on staging/prod with ad fill)
- HTTPS validation: K (manual on staging/prod)
- Caching headers: A5 (Cloudflare-managed)

### Exceptions

| ID     | Issue                                                                                                                   | Severity | Owner |
| :----- | :---------------------------------------------------------------------------------------------------------------------- | :------- | :---- |
| EX-001 | Lighthouse LCP remains above 2500ms on all 4 pilot routes after inline-critical/deferred-bundle and startup JS changes. | HARD     | TBD   |

---

## 4) Final Sign-Off

**Decision:** [ ] APPROVED / [x] REJECTED

| Role  | Name | Signature | Date |
| :---- | :--- | :-------- | :--- |
| Owner |      |           |      |
