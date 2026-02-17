# 📝 Release Sign-Off: REL-20260217-001

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-20260217-001 |
| **Release Type** | Architecture / Isolation / Performance Pilot |
| **Scope (Global/Target)** | Global shared architecture refactor + Loans-first isolation + Loans LCP hard gate |
| **Branch / Tag** | kartheek_devv_28_01_2026 |
| **Commit SHA** | 6b68ab9 |
| **Environment** | Local (Playwright + Lighthouse) |
| **Owner** | Codex |
| **Date** | 2026-02-17 |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | • Calculator UI renders immediately (no ads blocking)<br>• Initial state in HTML (no JS-only)<br>• No runtime injection above-fold | **PARTIAL** (Loans routes render with asset-manifest includes; legacy routes unchanged) |
| **A2** | **CSS Arch** | • No `@import`<br>• Critical CSS early<br>• Max 5 blocking files | **PASS** (`verify:css:route-bundles` passed; route critical/deferred CSS emitted) |
| **A3** | **CLS Control** | • No layout shift on load/interaction<br>• Reserved space for ads/images | **FAIL** (`npm run test:cwv:all` failed, 20 stress-mode violations) |
| **A4** | **JS Discipline** | • No heavy tasks >50ms<br>• Smooth slider/typing interaction | **FAIL** (interaction guard e2e failures in scoped run) |
| **A5** | **Caching** | • Long-TTL for static assets<br>• Versioned URLs | **PASS** (hashed bundles + versioned core links) |
| **B1** | **Mobile Layout** | • Single-column layout<br>• No horizontal overflow<br>• Burger nav stable | **FAIL** (`iss001` visual regression failure) |
| **B2** | **Mobile Inputs** | • Numeric keyboard for numbers<br>• Min/max attributes used | **PASS** (existing routes retain input constraints) |
| **B3** | **Mobile Ads** | • **No ads above H1** (Hard Rule)<br>• No overlap with UI | **NOT EVALUATED** (no ad-specific gate executed in this cycle) |
| **C1** | **Field Metrics** | • LCP ≤ 2.5s<br>• CLS ≤ 0.10<br>• INP ≤ 200ms | **FAIL** (`npm run test:lcp:loans` failed: 15 mobile profile breaches) |
| **C2** | **Lab Gates** | • No filmstrip shifts<br>• No long tasks near start | **FAIL** (CWV + interaction guard failures) |
| **D1-D4**| **CWV Guard** | • `npm run test:cwv:all` (or scoped policy equivalent) passed<br>• No regression >20% | **FAIL** (`test:cwv:all` failed after 16.8m; finance/home-loan stress violations) |
| **E1** | **Ad Slots** | • Reserved `min-height`<br>• Non-collapsing | **NOT EVALUATED** |
| **E2** | **Ad Loading** | • Lazy loaded (requestIdleCallback)<br>• Single loader script | **NOT EVALUATED** |
| **E3** | **Ad Policy** | • No policy violations (AdSense)<br>• No misleading placement | **NOT EVALUATED** |
| **F** | **Animation** | • `opacity`/`transform` only<br>• Reduced motion support | **NOT EVALUATED** |
| **G1** | **First Load** | • No FOUC/Jump<br>• Usable <3s (throttled) | **PARTIAL** (desktop LCP passes across Loans; mobile still above budget) |
| **G2** | **Interaction** | • Smooth slider drag<br>• Instant mode toggle | **FAIL** (scoped e2e failures in `how-much-can-i-borrow` and `remortgage-switching`) |
| **G3** | **Navigation** | • Full `href` links<br>• Subcategories collapsed | **PASS** (MPA links preserved) |
| **H** | **Accessibility** | • Keyboard navigable<br>• `aria-live` for results<br>• Zoom 200% valid | **NOT EVALUATED** |
| **I1** | **Metadata** | • Unique Title/Desc<br>• Canonical URL present | **PARTIAL** (mostly pass; car-loan SEO test failed in scoped run) |
| **I2** | **Schema** | • `SoftwareApplication`<br>• `FAQPage`<br>• `BreadcrumbList` | **PARTIAL** (same as above) |
| **I3** | **Indexability** | • Content in initial HTML<br>• Crawlable without JS | **PASS** (MPA generated HTML preserved) |
| **I4** | **Sitemap** | • Route present in sitemap.xml | **PASS** (generator preserved sitemap invariants) |
| **J** | **Content** | • Explanation present<br>• Worked example<br>• 3+ FAQs | **PARTIAL** (present for migrated routes; some route-contract tests still failing) |
| **K** | **Security** | • HTTPS only<br>• Privacy/Terms linked | **NOT EVALUATED** |

---

## 3) 🏆 Elite Performance (Addendum)

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| **X1** | **Investigate** | • LCP Element identified<br>• Mobile FCP ≤ 1.8s | **PARTIAL** (Lighthouse summaries generated per route/preset) |
| **X2** | **Stress Test** | • CPU 4× / Slow 3G<br>• Stress LCP ≤ 2.3s | **FAIL** (mobile LCP >2.5s on 15 Loans profiles) |

---

## 4) Evidence & Metrics

### Performance (Mobile Lab)
| Metric | Value | Status |
| :--- | :--- | :--- |
| **LCP** | Loans mobile: **15/15 routes > 2.5s** in policy set | FAIL |
| **CLS** | `test:cwv:all` stress violations: **20** route checks | FAIL |
| **INP** | Interaction guard failures in scoped e2e | FAIL |

### Gate Execution Evidence
- `npm run lint` → PASS
- `npm run test` → PASS (60 files, 911 tests)
- `npm run verify:css:route-bundles` → PASS
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` → PASS (strict single-calc check skipped due shared changes)
- `npm run test:iss001` → FAIL (visual regression in `iss-design-001`)
- `npm run test:cwv:all` → FAIL (20 stress violations)
- `npm run test:lcp:loans` → FAIL (15 profile failures; all mobile)
- Scoped e2e (`loans + infra interaction/nav/mobile`) → FAIL (56 passed, 14 failed)

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| PERF-LOANS-001 | Loans mobile LCP exceeds 2.5s hard budget on all evaluated routes | High | Codex |
| CWV-GLOBAL-001 | Global CWV stress guard fails on 20 route checks | High | Codex |
| E2E-LOANS-001 | Existing route-contract failures in `how-much-can-i-borrow` and `remortgage-switching` | High | Codex |
| VISUAL-ISS-001 | `iss001` snapshot mismatch | Medium | Codex |

---

## 5) Final Sign-Off

**Decision:** [ ] APPROVED / [x] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | Codex | (pending) | 2026-02-17 |
