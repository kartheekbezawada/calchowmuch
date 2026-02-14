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

## 5) Ads Stability Verification (CLS Zero-Tolerance)

### 5.1 Ad slot contract verification

| Page | Slot(s) Verified | Reserved Space (Y/N) | No Layout Shift (Y/N) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `<page-1>` | | | | |
| `<page-2>` | | | | |

### 5.2 Load order verification

- [ ] Ads did not block initial render
- [ ] Ads loaded after initial render and idle/interaction
- [ ] No slot height changes after ad fill
- [ ] No overlap with inputs/results on mobile

## 6) Manual Regression Scenarios (Pass/Fail)

| Scenario | Pass/Fail | Notes |
| :--- | :--- | :--- |
| First load has no visible jump | | |
| Slider drag remains smooth (5–10 seconds) | | |
| Fast typing has no lag | | |
| Mode toggle causes no layout shift | | |
| Nav expand/collapse causes no main content shift | | |
| Deep-link opens only correct subcategory | | |
| Ads appear with zero CLS | | |

## 7) Exceptions & Follow-Up Tickets

List any allowed exceptions (must not include CLS or interaction lag).

| Exception | Severity | Ticket ID | Owner | Due Date |
| :--- | :--- | :--- | :--- | :--- |
| | LOW / MED | | | |

## 8) Final Sign-Off

### 8.1 Release decision

- [ ] **APPROVED** (all HARD gates passed)
- [ ] **REJECTED** (HARD blocker found)

### 8.2 Signatures

| Role | Name | Date (UTC) | Signature/Note |
| :--- | :--- | :--- | :--- |
| Release Owner | | | |
| Reviewer (optional) | | | |
