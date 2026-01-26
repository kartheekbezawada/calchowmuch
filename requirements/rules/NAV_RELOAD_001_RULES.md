# NAV_RELOAD_001_RULES.md

**REQ_ID:** REQ-20260126-010  
**Title:** Switch Calculator Navigation to Full Page Loads (MPA)  
**Change Type:** Architecture  

---

## Goal

Convert calculator navigation from SPA-style dynamic swapping to full page reloads, so that each calculator view is a real page view for AdSense, analytics, and SEO.

---

## Context (Do Not Rebuild Calculators)

- Each calculator already exists as its own HTML fragment
- Calculator UI, logic, and explanation content must remain unchanged
- Only navigation and routing behavior must change

---

## Functional Requirements

### 1. Calculator Navigation Must Use Real Page Navigation

**Left navigation calculator items must be rendered as:**
```html
<a href="/time-and-date/sleep-time-calculator">...</a>
```

**NOT:**
```html
<button>...</button> <!-- with JS handlers -->
```

- Clicking a calculator must trigger a full browser reload
- Network tab should show document reload on navigation

### 2. Each Calculator Must Be Served as a Standalone Page

Each calculator URL must return:
- Full HTML document
- Header, top nav, left nav, calculator pane, explanation pane, ads pane
- No dynamic injection of calculator HTML into a shared shell

### 3. URL Handling

- **Remove hash-based routing** (`#/…`) for calculators
- **Use clean URLs:**
  - `/time-and-date/sleep-time-calculator`
  - `/math/basic-calculator`
  - `/loans/home-loan`
- Back/forward must work natively via browser navigation

### 4. Ads

- Ads must load per page load
- No shared global ad instance across calculators
- Reserve ad container space to avoid layout shift

### 5. Navigation State on Load

On direct URL visit:
- Correct top nav must be active
- Correct left nav section expanded  
- Current calculator highlighted

---

## Non-Goals

- Do not change calculator UI or logic
- Do not add SPA routing
- Do not add ad refresh logic
- Do not redesign layout

---

## Migration Guidance (Important)

- This is a **navigation + routing refactor**, not a calculator rewrite
- Reuse existing HTML fragments as full pages or templates
- Prefer duplication of shell markup over runtime JS complexity

---

## Acceptance Criteria

**MUST HAVE:**
- [ ] Clicking a calculator visibly reloads the page
- [ ] Network tab shows a document reload (not XHR/fetch)
- [ ] URL no longer uses `#` for calculator routing
- [ ] AdSense requests fire on each calculator page load
- [ ] All 60+ calculators still function identically
- [ ] Clean URLs for all calculators (`/category/calculator-name`)
- [ ] Browser back/forward works natively
- [ ] Direct URL visits activate correct navigation states
- [ ] Calculator HTML fragments reused as page templates
- [ ] Navigation items use `<a href>` not `<button>` with JS handlers

**SHOULD HAVE:**
- [ ] Fast page load times maintained
- [ ] SEO metadata properly set per page
- [ ] Ad loading optimized per page
- [ ] Navigation state persistence across page loads

**ARCHITECTURE CONSTRAINTS:**
- [ ] Each calculator = standalone HTML document
- [ ] No SPA JavaScript routing logic
- [ ] No dynamic content injection
- [ ] Calculator logic/UI unchanged from current implementation

**VALIDATION:**
- [ ] All existing calculator functionality preserved
- [ ] Navigation UX remains intuitive
- [ ] Analytics/AdSense tracking improved
- [ ] URL structure SEO-friendly

---

## Technical Considerations

### Current Architecture (SPA)
- Single `index.html` with JavaScript content swapping
- Hash-based routing (`#/calculators/...`)
- Dynamic fetch of calculator HTML fragments
- Shared navigation state in JavaScript

### Target Architecture (MPA)
- Individual HTML document per calculator
- Server-side or build-time generation of full pages
- Clean URL routing (`/calculator-name`)
- Native browser navigation

### Implementation Options
1. **Server-side rendering** with templates
2. **Build-time generation** of static HTML pages
3. **Hybrid approach** with shared templates

---

## Change Type
Architecture (SPA → MPA navigation conversion)

---

## Revenue Impact
**HIGH** - Proper page views enable better AdSense performance and analytics tracking.

---

## Risk Assessment
**MEDIUM** - Significant architecture change but calculator logic remains unchanged.