# 📝 Release Sign-Off

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | RELEASE-YYYYMMDD-XXX |
| **Release Type** | Single Calculator (expanded scope due to formatting + ISS/CWV gates) |
| **Scope (Global/Target)** | Target: `/finance/future-value-of-annuity/`<br>Expanded: `/finance/future-value/`, `/finance/present-value/` |
| **Branch / Tag** | local |
| **Commit SHA** | 08cb1bd9868d515fdfa40a794421dc3dc42a01b8 |
| **Environment** | local |
| **Owner** | TBD |
| **Date** | 2026-02-16 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | • Calculator UI renders immediately (no ads blocking)<br>• Initial state in HTML (no JS-only)<br>• No runtime injection above-fold | PASS (above-fold mutation guard) |
| **A2** | **CSS Arch** | • No `@import`<br>• Critical CSS early<br>• Max 5 blocking files | PASS (lint:css-import + format check) |
| **A3** | **CLS Control** | • No layout shift on load/interaction<br>• Reserved space for ads/images | PASS (CWV guard + LH CLS) |
| **A4** | **JS Discipline** | • No heavy tasks >50ms<br>• Smooth slider/typing interaction | PASS (interaction guard) |
| **A5** | **Caching** | • Long-TTL for static assets<br>• Versioned URLs | MANUAL ANNEX |
| **B1** | **Mobile Layout** | • Single-column layout<br>• No horizontal overflow<br>• Burger nav stable | PASS (mobile UX automation + overflow check) |
| **B2** | **Mobile Inputs** | • Numeric keyboard for numbers<br>• Min/max attributes used | PASS (input attribute checks) |
| **B3** | **Mobile Ads** | • **No ads above H1** (Hard Rule)<br>• No overlap with UI | MANUAL ANNEX |
| **C1** | **Field Metrics** | • LCP ≤ 2.5s<br>• CLS ≤ 0.10<br>• INP ≤ 200ms | PASS (LH + CWV guard) |
| **C2** | **Lab Gates** | • No filmstrip shifts<br>• No long tasks near start | PASS (ISS-001 snapshots updated) |
| **D1-D4**| **CWV Guard** | • `npm run test:cwv:target` (or all) passed<br>• No regression >20% | PASS |
| **E1** | **Ad Slots** | • Reserved `min-height`<br>• Non-collapsing | MANUAL ANNEX |
| **E2** | **Ad Loading** | • Lazy loaded (requestIdleCallback)<br>• Single loader script | MANUAL ANNEX |
| **E3** | **Ad Policy** | • No policy violations (AdSense)<br>• No misleading placement | MANUAL ANNEX |
| **F** | **Animation** | • `opacity`/`transform` only<br>• Reduced motion support | PASS (CSS scan + ISS) |
| **G1** | **First Load** | • No FOUC/Jump<br>• Usable <3s (throttled) | PASS (LH perf + ISS) |
| **G2** | **Interaction** | • Smooth slider drag<br>• Instant mode toggle | PASS (interaction guard) |
| **G3** | **Navigation** | • Full `href` links<br>• Subcategories collapsed | PASS (nav stability guard + existing nav tests) |
| **H** | **Accessibility** | • Keyboard navigable<br>• `aria-live` for results<br>• Zoom 200% valid | PASS (accessibility UX automation + LH a11y) |
| **I1** | **Metadata** | • Unique Title/Desc<br>• Canonical URL present | PASS (E2E SEO) |
| **I2** | **Schema** | • `SoftwareApplication`<br>• `FAQPage`<br>• `BreadcrumbList` | PASS (E2E SEO) |
| **I3** | **Indexability** | • Content in initial HTML<br>• Crawlable without JS | PASS (HTML inspection) |
| **I4** | **Sitemap** | • Route present in sitemap.xml | PASS (E2E SEO) |
| **J** | **Content** | • Explanation present<br>• Worked example<br>• 3+ FAQs | PASS (HTML inspection, 10 FAQs) |
| **K** | **Security** | • HTTPS only<br>• Privacy/Terms linked | MANUAL ANNEX (HTTPS requires staging/prod; mixed content scan pass) |

---

## 3) 🏆 Elite Performance (Addendum)

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| **X1** | **Investigate** | • LCP Element identified<br>• Mobile FCP ≤ 1.8s | PARTIAL (LCP element identified; FCP not recorded) |
| **X2** | **Stress Test** | • CPU 4× / Slow 3G<br>• Stress LCP ≤ 2.3s | PASS (CWV guard stress LCP 1204ms) |

---

## 4) Evidence & Metrics

### Performance (Mobile Lab)
| Metric | Value | Status |
| :--- | :--- | :--- |
| **LCP** | Lighthouse: 2257.25ms | PASS |
| **CLS** | Lighthouse: 0.0050 | PASS |
| **INP** | Lighthouse: 115ms; CWV guard stress proxy: 128ms | PASS |

**LCP Element Selector (LH):** `div.calculator-ui > section.mtg-hero > div.mtg-form-panel > p.helper`

### Automation Evidence
- Validation gate: `npm run validate` (PASS)
- Lighthouse summary: `test-results/lighthouse/finance-future-value-of-annuity.summary.json`
  - Performance 98, Accessibility 96, Best Practices 79
  - Render-blocking savings 300ms (SOFT threshold)
  - Mixed content scan: none
  - Headless Chromium flags (from scripts/lighthouse-target.mjs): `--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage` (requires `CHROME_PATH`)
- Above-the-fold mutation guard: `npm run test:above-fold` (PASS)
- Mobile UX: `npm run test:mobile:ux` (PASS)
  - Screenshot: `tests_specs/infrastructure/e2e/mobile-ux.spec.js-snapshots/mobile-finance-future-value-of-annuity-chromium-linux.png`
  - Tap targets ≥ 48×48: PASS
  - No horizontal overflow: PASS
  - Input attributes: PASS (range inputs include min/max/step)
- Accessibility UX: `npm run test:accessibility:ux` (PASS)
  - Keyboard traversal + focus visibility: PASS
  - 200% zoom overflow check: PASS
  - `aria-live="polite"` present: PASS
- Interaction guard: `npm run test:interaction:guard` (PASS)
  - Long task guard: PASS
  - Interaction latency proxy: PASS
  - Nav stability: PASS

### Manual Annex (Non-Blocking)
- Ads policy & placement (E1–E3, B3) — requires ad fill on staging/prod.
- HTTPS validation (K) — requires staging/prod over HTTPS.
- Caching headers (A5) — Cloudflare-managed; verify in staging/prod if needed.

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| EX-001 | Render-blocking savings 300ms (Lighthouse) — SOFT per checklist; investigate. | SOFT | TBD |

---

## 4) Final Sign-Off

**Decision:** [ ] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | | | |
