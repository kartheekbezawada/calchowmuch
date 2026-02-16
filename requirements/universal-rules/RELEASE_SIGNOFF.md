# 📝 Release Sign-Off Template

> [!IMPORTANT]
> **This file is a TEMPLATE.** Copy to `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | |
| **Release Type** | |
| **Scope (Global/Target)** | |
| **Branch / Tag** | |
| **Commit SHA** | |
| **Environment** | |
| **Owner** | |
| **Date** | |

---

## 2) Release Checklist

| ID | Category | Criteria | Result (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **A1** | **Rendering** | • Calculator UI renders immediately (no ads blocking)<br>• Initial state in HTML (no JS-only)<br>• No runtime injection above-fold | |
| **A2** | **CSS Arch** | • No `@import`<br>• Critical CSS early<br>• Max 5 blocking files | |
| **A3** | **CLS Control** | • No layout shift on load/interaction<br>• Reserved space for ads/images | |
| **A4** | **JS Discipline** | • No heavy tasks >50ms<br>• Smooth slider/typing interaction | |
| **A5** | **Caching** | • Long-TTL for static assets<br>• Versioned URLs | |
| **B1** | **Mobile Layout** | • Single-column layout<br>• No horizontal overflow<br>• Burger nav stable | |
| **B2** | **Mobile Inputs** | • Numeric keyboard for numbers<br>• Min/max attributes used | |
| **B3** | **Mobile Ads** | • **No ads above H1** (Hard Rule)<br>• No overlap with UI | |
| **C1** | **Field Metrics** | • LCP ≤ 2.5s<br>• CLS ≤ 0.10<br>• INP ≤ 200ms | |
| **C2** | **Lab Gates** | • No filmstrip shifts<br>• No long tasks near start | |
| **D1-D4**| **CWV Guard** | • `npm run test:cwv:target` (or all) passed<br>• No regression >20% | |
| **E1** | **Ad Slots** | • Reserved `min-height`<br>• Non-collapsing | |
| **E2** | **Ad Loading** | • Lazy loaded (requestIdleCallback)<br>• Single loader script | |
| **E3** | **Ad Policy** | • No policy violations (AdSense)<br>• No misleading placement | |
| **F** | **Animation** | • `opacity`/`transform` only<br>• Reduced motion support | |
| **G1** | **First Load** | • No FOUC/Jump<br>• Usable <3s (throttled) | |
| **G2** | **Interaction** | • Smooth slider drag<br>• Instant mode toggle | |
| **G3** | **Navigation** | • Full `href` links<br>• Subcategories collapsed | |
| **H** | **Accessibility** | • Keyboard navigable<br>• `aria-live` for results<br>• Zoom 200% valid | |
| **I1** | **Metadata** | • Unique Title/Desc<br>• Canonical URL present | |
| **I2** | **Schema** | • `SoftwareApplication`<br>• `FAQPage`<br>• `BreadcrumbList` | |
| **I3** | **Indexability** | • Content in initial HTML<br>• Crawlable without JS | |
| **I4** | **Sitemap** | • Route present in sitemap.xml | |
| **J** | **Content** | • Explanation present<br>• Worked example<br>• 3+ FAQs | |
| **K** | **Security** | • HTTPS only<br>• Privacy/Terms linked | |

---

## 3) 🏆 Elite Performance (Addendum)

| ID | Category | Criteria | Result |
| :--- | :--- | :--- | :--- |
| **X1** | **Investigate** | • LCP Element identified<br>• Mobile FCP ≤ 1.8s | |
| **X2** | **Stress Test** | • CPU 4× / Slow 3G<br>• Stress LCP ≤ 2.3s | |

---

## 4) Evidence & Metrics

### Performance (Mobile Lab)
| Metric | Value | Status |
| :--- | :--- | :--- |
| **LCP** | | |
| **CLS** | | |
| **INP** | | |

### Exceptions
| ID | Issue | Severity | Owner |
| :--- | :--- | :--- | :--- |
| | | | |

---

## 4) Final Sign-Off

**Decision:** [ ] APPROVED / [ ] REJECTED

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| Owner | | | |
