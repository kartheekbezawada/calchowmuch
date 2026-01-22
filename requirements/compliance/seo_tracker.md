# SEO Tracker

> **Purpose:** Track SEO validation status for each requirement that impacts pages/URLs.

---

## Tracker Contract

| Rule | Description |
|------|-------------|
| **One row per REQ** | Each Requirement ID appears exactly once |
| **SEO ID format** | `SEO-REQ-YYYYMMDD-###` |
| **Status lifecycle** | `PENDING` → `PASS` / `FAIL` / `NA` |
| **Link to seo_requirements.md** | Reference specific P1 rules validated |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **PENDING** | SEO entry created, validation not yet run |
| **PASS** | SEO auto tests pass, P1 rules validated |
| **FAIL** | SEO validation failed (issue must be created) |
| **NA** | No SEO impact (compute-only change, no page/URL changes) |

---

## FSM SEO Tracker Table (Authoritative)

| Requirement ID | SEO ID | Page/Scope | Status | P1 Rules Checked | Test Command | Evidence |
|----------------|--------|------------|--------|------------------|--------------|----------|
| *(Fresh start — populate as REQs complete)* | | | | | | |

---

## Template for New SEO Entry

```markdown
| REQ-YYYYMMDD-### | SEO-REQ-YYYYMMDD-### | /calculators/{category}/{slug}/ | PENDING | 1-16 (P1 rules) | `REQ_ID=REQ-... npx playwright test tests/seo/seo-auto.spec.js` | — |
```

---

## SEO Auto Test Commands

### Run for specific requirement
```bash
REQ_ID=REQ-20260120-021 npx playwright test tests/seo/seo-auto.spec.js
```

### Run for specific URLs
```bash
SEO_URLS="/calculators/math/log/natural-log/,/calculators/math/log/common-log/" npx playwright test tests/seo/seo-auto.spec.js
```

### Run with default targets
```bash
npx playwright test tests/seo/seo-auto.spec.js
```

---

## P1 SEO Rules Reference (Auto-Checkable)

From [seo_requirements.md](seo_requirements.md):

| Rule # | Heading | Subheading | Auto-Checkable |
|--------|---------|------------|----------------|
| 1 | Indexing & Canonical | Crawlable & Indexable | ✅ Auto + Manual |
| 2 | Indexing & Canonical | Canonical Present | ✅ Auto |
| 3 | Indexing & Canonical | Canonical Accuracy | ✅ Auto |
| 4 | Indexing & Canonical | HTTPS Enforcement | ✅ Auto |
| 5 | URL Structure | URL Format | ✅ Auto |
| 6 | URL Structure | URL Pattern | ✅ Auto |
| 7 | URL Structure | No Query Params | ✅ Auto |
| 8 | URL Structure | No Orphan Pages | Manual |
| 9 | Titles & Meta | Title Tag | ✅ Auto |
| 10 | Titles & Meta | Meta Description | ✅ Auto |
| 11 | Titles & Meta | Single H1 | ✅ Auto |
| 12 | Sitemap | Sitemap Inclusion | ✅ Auto |
| 13 | Sitemap | Sitemap Updated | ✅ Auto |
| 14 | Structured Data | JSON-LD Present | ✅ Auto |
| 15 | Structured Data | Required Fields | ✅ Auto |
| 16 | Structured Data | Schema Validity | ✅ Auto |

---

## SEO Target Configuration

SEO test targets are defined in `tests/seo/seo.targets.json`:

```json
{
  "default": ["/calculators/math/percentage-increase/"],
  "REQ-YYYYMMDD-###": ["/calculators/{category}/{slug}/", ...]
}
```

When adding a new requirement with SEO impact:
1. Add URL targets to `seo.targets.json` under the REQ ID key
2. Create a row in this tracker with status `PENDING`
3. Run the SEO auto tests after implementation
4. Update status to `PASS` or `FAIL`

---

## Current SEO Summary

| Metric | Count |
|--------|-------|
| Total Entries | 0 |
| PASS | 0 |
| PENDING | 0 |
| FAIL | 0 |
| NA | 0 |

*Note: This tracker was reset on 2026-01-22.*

---

## Notes

- SEO validation is required for any REQ that adds/changes pages or URLs
- P1 rules must pass for release; P2+ are enhancements
- Failed SEO creates an issue but doesn't block release (unless P1)
- See [seo_requirements.md](seo_requirements.md) for full rule definitions

---

**Last Updated:** 2026-01-22  
**Status:** Fresh Start


