# Release Checklist — Sign-Off Section

Copy/paste this section at the bottom of the release checklist file for each release candidate.

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| **Release ID** | REL-YYYYMMDD-### |
| **Release Type** | UI / Logic / SEO / Performance / Ads / Nav / Other |
| **Branch / Tag** | `<git-branch-or-tag>` |
| **Commit SHA** | `<commit-sha>` |
| **Environment Tested** | Localhost / Preview / Staging / Production |
| **Release Owner** | `<name>` |
| **Date (UTC)** | YYYY-MM-DD |

## 2) Pages Tested (Coverage Required)

### 2.1 Mandatory coverage (minimum)

| Page Type | Slug / URL Path | Notes |
| :--- | :--- | :--- |
| Category Hub | `/finance/` (example) | Must include left-nav + internal links |
| Calculator (Top Traffic) | `/<category>/<calculator-1>/` | Must include ads + FAQ + results |
| Calculator (Top Traffic) | `/<category>/<calculator-2>/` | Must include mode toggles if any |
| Calculator (Heavy Table) | `/<category>/<calculator-3>/` | Must include scenario table/schedule |
| Calculator (New / Modified) | `/<category>/<calculator-changed>/` | This release’s main target |

### 2.2 Optional extra coverage (recommended)

| Page Type | Slug / URL Path | Notes |
| :--- | :--- | :--- |
| Landing from Google (deep link) | `/<category>/<calculator>/` | Validate correct subcategory auto-open |
| One non-finance page | `/privacy/` or `/about/` | Ensure shared layout stable |

## 3) Device & Browser Matrix (Minimum Required)

### 3.1 Desktop

| Device | OS | Browser | Version | Tested (Y/N) |
| :--- | :--- | :--- | :--- | :--- |
| Desktop/Laptop | Windows | Chrome | Latest | |
| Desktop/Laptop | macOS | Safari | Latest | |

### 3.2 Mobile

| Device | OS | Browser | Version | Tested (Y/N) |
| :--- | :--- | :--- | :--- | :--- |
| Phone | Android | Chrome | Latest | |
| iPhone | iOS | Safari | Latest | |

### 3.3 Tablet (if layout differs)

| Device | OS | Browser | Version | Tested (Y/N) |
| :--- | :--- | :--- | :--- | :--- |
| iPad | iOS/iPadOS | Safari | Latest | |

## 4) Performance & CWV Results (Record Evidence)

### 4.1 Lighthouse (Lab) — Mobile profile

Run Lighthouse on the pages listed in Section 2. Record results below.

| Page | LCP (s) | CLS | INP/TBT Proxy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `<page-1>` | | | | |
| `<page-2>` | | | | |
| `<page-3>` | | | | |

### 4.2 Field Metrics Snapshot (If available)

If this is a production follow-up or you have RUM/CrUX snapshots:

| Metric | P75 Value | Source | URL Group / Notes |
| :--- | :--- | :--- | :--- |
| **LCP** | | GSC CWV / RUM | |
| **INP** | | GSC CWV / RUM | |
| **CLS** | | GSC CWV / RUM | |

## 5) Global CWV Regression Guard (Automated WSL)

### 5.1 Guard Results

| Scope | Routes Checked | Violations | Highest Normal LCP (ms) | Highest Stress LCP (ms) | Highest Normal INP Proxy (ms) | Highest Stress INP Proxy (ms) | Highest Normal CLS | Highest Stress CLS | Highest Single Shift | Status (Pass/Fail) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **All calculators (`public/config/navigation.json`)** | | | | | | | | | | |

- [ ] Command executed: `npm run test:cwv:all` (or `npm run test:cls:all` alias)
- [ ] Evidence attached: `test-results/performance/cls-guard-all-calculators.json`

### 5.2 Root Cause Analysis (If Failed/Warned)
*If any page triggered a warning (> 0.05) or fail (> 0.10), document the cause:*

- [ ] Late CSS / FOUC
- [ ] Webfont Swap
- [ ] Component Resize
- [ ] Dynamic Injection

## 6) Ads Stability Verification (CLS Zero-Tolerance)

### 6.1 Ad slot contract verification

| Page | Slot(s) Verified | Reserved Space (Y/N) | No Layout Shift (Y/N) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `<page-1>` | | | | |
| `<page-2>` | | | | |

### 6.2 Load order verification

- [ ] Ads did not block initial render
- [ ] Ads loaded after initial render and idle/interaction
- [ ] No slot height changes after ad fill
- [ ] No overlap with inputs/results on mobile
- [ ] Exactly one AdSense loader in rendered `<head>`; no body-level loader duplication from ad unit snippets

## 7) Manual Regression Scenarios (Pass/Fail)

| Scenario | Pass/Fail | Notes |
| :--- | :--- | :--- |
| First load has no visible jump | | |
| Slider drag remains smooth (5–10 seconds) | | |
| Fast typing has no lag | | |
| Mode toggle causes no layout shift | | |
| Nav expand/collapse causes no main content shift | | |
| Deep-link opens only correct subcategory | | |
| Ads appear with zero CLS | | |

## 8) SERP Readiness Verification (All Calculators)

### 8.1 Metadata & Canonical Verification

Verify on all calculator pages touched in this release + 2–3 untouched sample pages.

| Page | `<title>` Unique (Y/N) | Meta Desc Intent-Aligned (Y/N) | Canonical Correct (Y/N) | No Duplicate Metas (Y/N) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<page-1>` | | | | | |
| `<page-2>` | | | | | |
| `<page-3>` | | | | | |

### 8.2 Structured Data Verification

| Page | Schema Bundle Correct (Y/N) | Validates Rich Results Test (Y/N) | JSON-LD Matches Visible Content (Y/N) | No Duplicate FAQPage (Y/N) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<page-1>` | | | | | |
| `<page-2>` | | | | | |
| `<page-3>` | | | | | |

**Safe schema set:** `WebPage`, `SoftwareApplication`, `FAQPage` (when visible), `BreadcrumbList`.

### 8.3 Content Indexability Checklist

- [ ] Explanation section present in initial HTML (all calculator pages)
- [ ] FAQs present in initial HTML (all calculator pages with FAQs)
- [ ] Key formulas present in initial HTML (where applicable)
- [ ] Primary headings (H1, H2) present in initial HTML
- [ ] No critical content gated behind JS rendering, tabs, or user interaction

### 8.4 Internal Linking Verification

- [ ] Category → calculator links present and crawlable
- [ ] Calculator → parent category link present
- [ ] Calculator → related calculators links present
- [ ] Calculator → reverse/comparison calculator links present (where applicable)
- [ ] All internal links are in HTML (not JS-injected)

### 8.5 Intent Coverage Verification

- [ ] Primary intent reflected in title, H1, opening paragraph, and meta description
- [ ] Secondary intents addressed via explanation, scenario tables, FAQ, or related links
- [ ] Long-tail coverage via natural language phrasing (no keyword stuffing)

### 8.6 Scenario Content (Finance / Percentage Only)

- [ ] Scenario tables or worked examples present
- [ ] What-if exploratory prompts present in initial HTML
- [ ] N/A (pure math calculator — skip)

## 9) Exceptions & Follow-Up Tickets

List any allowed exceptions (must not include CLS or interaction lag).

| Exception | Severity | Ticket ID | Owner | Due Date |
| :--- | :--- | :--- | :--- | :--- |
| | LOW / MED | | | |

## 10) Final Sign-Off

### 10.1 Release decision

- [ ] **APPROVED** (all HARD gates passed)
- [ ] **REJECTED** (HARD blocker found)

### 10.2 Signatures

| Role | Name | Date (UTC) | Signature/Note |
| :--- | :--- | :--- | :--- |
| Release Owner | | | |
| Reviewer (optional) | | | |
