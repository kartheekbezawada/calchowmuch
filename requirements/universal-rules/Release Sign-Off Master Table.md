# Release Sign-Off Master Table

> Each release has its own sign-off file in `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`.
> Template: [`RELEASE_SIGNOFF.md`](RELEASE_SIGNOFF.md)

| Release ID | Date (UTC) | Type | Scope | Status | Sign-Off File | Notes |
|:---|:---|:---|:---|:---|:---|:---|
| REL-20260214-001 | 2026-02-14 | Audit | Home Loan Calculators (7) | CONDITIONAL PASS | [View](release-signoffs/RELEASE_SIGNOFF_REL-20260214-001.md) | 2 remaining issues: missing key formulas, missing reverse cross-links. AdSense issue RESOLVED. |
| REL-20260215-001 | 2026-02-15 | Performance / UI / SEO | Home Loan Calculator | APPROVED | [View](release-signoffs/RELEASE_SIGNOFF_REL-20260215-001.md) | CLS deep audit + fixes. All HARD gates pass. 9 known issues resolved (see known_issues.md). |
| RELEASE-YYYYMMDD-XXX | 2026-02-16 | Single Calculator (expanded) | /finance/future-value-of-annuity/ + /finance/future-value/ + /finance/present-value/ | READY | [View](release-signoffs/RELEASE_SIGNOFF_RELEASE-YYYYMMDD-XXX.md) | CWV guard pass; ISS-001 + mobile UX + above-fold guards pass. Accessibility UX + interaction guard pass. Lighthouse (perf 98 / a11y 96) OK; render-blocking savings 300ms (SOFT). Manual Annex: ads/HTTPS/caching non-blocking. |
