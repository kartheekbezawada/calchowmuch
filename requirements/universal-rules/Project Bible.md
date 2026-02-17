# CalcHowMuch.com — Project Bible

> **Purpose:** Product Strategy & SERP Growth Rules.
> **Target:** 1M Unique Visitors / Month.

---

## 1. Core Objectives
- **Metric:** 1,000,000 unique visitors/month (excluding bots).
- **Ratio:** Target 1:5 Unique-to-Pageview ratio.
- **Hosting:** Cloudflare Pages (Fast delivery, simple ops).

---

## 2. Design Strategy
**Motto:** `Simple · Smooth · Wow · Addictive`

### 2.1 Philosophy
- **Simple:** One clear calculator per page. No hunting.
- **Smooth:** Sliders preferred. Instant updates. Default values everywhere.
- **Wow:** Premium visual layer (Glow, Glassmorphism, Animation) to differentiate from generic competitors.
- **Addictive:** Functionality that ensures return visits.

### 2.2 Retention Hooks (The "Addictive" Layer)
1.  **Save Scenario:** `localStorage` save + shareable URL (no login).
2.  **Compare Mode:** Base vs Optimistic vs Conservative (Side-by-Side).
3.  **Timeline Table:** Monthly breakdowns as the "hero" output.
4.  **Cluster Chaining:** Next-best calculator links (e.g., Debt -> Balance Transfer).
5.  **Export:** CSV/PDF/Print-friendly.
6.  **"What Changed?":** Mini-explanation when user moves a slider.
7.  **Presets:** "Aggressive", "Conservative" quick-load buttons.

---

## 3. Architecture & Layout
- **MPA Only:** Multi-Page Architecture. No SPA routing.
- **3-Pane Layout:**
    1.  **Left Nav:** Categories (Vertical, Collapsible).
    2.  **Content Pane:** Calc + Explanation combined (Scrollable).
    3.  **Ad Pane:** Fixed right column (Stability focus).
- **Mobile First:** Single column. Burger menu. No ads above H1.

### 3.1 Cluster Isolation Operating Model
- **Rule Reuse, File Isolation:** Universal governance rules are reused globally, but runtime/build ownership is cluster-local.
- **7-Cluster Ownership Model:** `math`, `home-loan`, `credit-cards`, `auto-loans`, `finance`, `time-and-date`, and `percentage` own their shell/assets/build outputs.
- **Immutable Tiny Core:** Shared runtime is limited to immutable low-level primitives under `/assets/core/v{n}/...`; no shared UI ownership in core.
- **Customer Performance Rationale:** This 95/5 model preserves strong isolation while retaining cross-route cache reuse for tiny primitives, avoiding full-duplication byte inflation.
- **Migration Stability Contract:** Visual behavior and public URLs remain stable during migration; changes focus on ownership boundaries, not customer-facing redesign.

---

## 4. SERP-Ready System (Page Quality Contract)
**Definition:** A page is SERP-Ready only if ALL conditions are met.

### 4.1 Foundations
- **Metadata:** Unique Title, Intent-aligned Description, Single Canonical.
- **Indexability:** Explanation & FAQs in initial HTML (Server-rendered).
- **Links:** Bidirectional (Category <-> Calc <-> Related).

### 4.2 Intent Coverage
- **Primary:** Core query (e.g., "Mortgage Calculator").
- **Secondary:** Adjacent questions (e.g., "How is it calculated?").
- **Long-tail:** Natural language variations in FAQs.
- **Scenarios:** Real-world examples (Required for Finance).

### 4.3 Validation Checklist
- [ ] Metadata unique & valid.
- [ ] JSON-LD valid & page-scoped.
- [ ] Content (Exp/FAQ) in initial HTML.
- [ ] Internal links present.
- [ ] Mobile rendering pass (No CLS).

---

## 5. Performance Monitoring (CWV)
**Targets (Field P75):** `LCP ≤ 2.5s`, `INP ≤ 200ms`, `CLS ≤ 0.1`.

### 5.1 Rendering Rules
- **HTML:** Fast TTFB. Aggressive caching for static assets.
- **JS:** Minimal payload. Defer non-critical.
- **Layout:** Stable by default. Reserved space for ads/images/tables.

### 5.2 Ad Engineering (Strict)
- **CLS Zero Tolerance:** Ads must NOT cause layout shifts.
- **Reservation:** Fixed `min-height` containers.
- **Load Order:** Calc UI first -> Idle -> Ads.
- **Mobile:** No ads above H1. No overlap with inputs.

---

## 6. Mobile & Tablet System
- **Layout:** Single column.
- **Inputs:** Numeric keyboards (`inputmode="decimal"`). Touch-friendly targets.
- **Stability:** No font reflow. No ad injection shifts.

---

## 7. Crawl & Index Hygiene
- **Sitemap:** 1:1 sync with Navigation. No orphans.
- **Canonical:** Self-referencing absolute URLs.
- **Robots:** `index,follow` (unless excluded).

---

## 8. AdSense Safety
- **Placement:** Regulated slots only. No Auto-Ads injection in shell.
- **UX:** No intrusion on inputs/results.
- **Lazy Load:** Below-fold ads lazy-loaded.

---

## 9. Schema Strategy
**Rule:** Schema must match visible content exactly.

### Required Bundle
1.  `WebPage`
2.  `SoftwareApplication` (Calculator specifics)
3.  `BreadcrumbList`
4.  `FAQPage` (If FAQs exist visually)

---

## 10. Growth Gates (1M Target)
- **Tech Gate:** Stable CWV, High Cache Hit.
- **SEO Gate:** Cluster ranking, Rich Results.
- **Product Gate:** High repeat usage, Low bounce rate.
