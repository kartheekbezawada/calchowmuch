# Testing Requirements

> **Purpose:** Defines test taxonomy, selection matrix, and execution rules  
> **Authority:** This document determines which tests are required for each change type  
> **Last Updated:** 2026-01-22

---

## §1 Test Pyramid (Cost Order)

```
         ┌─────────────────┐
         │   Full Sweep    │  ← Release only
         │    (highest)    │
         ├─────────────────┤
         │      E2E        │  ← UI/Flow changes
         ├─────────────────┤
         │    ISS-001      │  ← Layout/CSS
         ├─────────────────┤
         │    SEO Auto     │  ← SEO/Metadata
         ├─────────────────┤
         │  Integration    │  ← API changes
         ├─────────────────┤
         │      Unit       │  ← Compute logic
         │    (cheapest)   │
         └─────────────────┘
```

**Principle:** Prefer tests lower in the pyramid. They're cheaper and faster.

---

## §2 Test Types Defined

| Test Type | What It Tests | Command | Cost | Typical Duration |
|-----------|---------------|---------|------|------------------|
| `Unit` | Individual functions, calculations | `npm run test:unit` | Low | < 30s |
| `Integration` | API endpoints, service interactions | `npm run test:integration` | Medium | 1-2 min |
| `SEO Auto` | Meta tags, structured data, canonicals | `npm run test:seo` | Medium | 30s-1 min |
| `ISS-001` | Visual regression, layout shift | `npm run test:iss001` | Medium | 1-2 min |
| `E2E` | User flows, mode switching | `npm run test:e2e` | High | 3-5 min |
| `Full Sweep` | Everything, all calculators | `npm run test:all` | Very High | 10+ min |

---

## §3 Test Selection Matrix

**This matrix is authoritative.** Select tests based on Change Type.

| Change Type | Unit | Integration | SEO Auto | ISS-001 | E2E | Notes |
|-------------|:----:|:-----------:|:--------:|:-------:|:---:|-------|
| Compute logic change | ✅ | — | — | — | — | Test the calculation |
| API/service change | — | ✅ | — | — | — | Test endpoints |
| SEO/metadata change | — | — | ✅ | — | — | Validate meta tags |
| Layout/CSS change | — | — | — | ✅ | — | Check for visual regression |
| UI/flow change | — | — | — | — | ✅ | Test user interactions |
| New calculator | ✅ | — | ✅ | — | ✅ | Full coverage for new |
| Bug fix (compute) | ✅ | — | — | — | — | Regression test |
| Bug fix (UI) | — | — | — | — | ✅ | Regression test |
| Refactor (no behavior change) | ✅ | — | — | — | — | Ensure no regression |

### Reading the Matrix

- ✅ = **Required** — must pass for compliance
- — = **Not required** — may run optionally
- Multiple ✅ = **All required** — must all pass

---

## §4 E2E Scoping Rules

E2E tests are expensive. Scope them appropriately.

| Scenario | E2E Scope |
|----------|-----------|
| Single calculator change | E2E for **that calculator only** |
| Shared component change | E2E for **all affected calculators** |
| Navigation change | E2E for **mode switching + affected flows** |
| New calculator | E2E for **new calculator + integration with nav** |
| Release candidate | **Full sweep** |

**Never** run full E2E sweep for single-calculator changes.

---

## §5 Test Evidence Requirements

Each test run must record:

| Field | Required | Example |
|-------|----------|---------|
| TEST_ID | Yes | `TEST-20260122-142455` |
| Test Type | Yes | `Unit`, `E2E`, etc. |
| Tests Run | Yes | `12/12 passed`, `10/12 passed` |
| Duration | Optional | `28s` |
| Iteration Count | Yes | `5/25` |
| ITER_ID | Yes | Links to iteration_tracker |

---

## §6 Test Failure Handling

When tests fail within the Ralph Lauren Loop:

1. **Log failure in iteration_tracker.md**
   - Iteration number
   - Test that failed
   - Error message
   - Phase = TEST

2. **Decide fix strategy:**
   - Code fix needed → Go to BUILD phase, fix, rebuild
   - Test fix needed → Fix test, re-run TEST phase
   - Flaky test → Document, retry up to 2x, then escalate

3. **Increment iteration counter**

4. **If iteration >= 25:**
   - Mark TEST status = ABORTED
   - Create ISSUE with MAX_ITERATIONS type
   - Stop loop

---

## §7 Required vs Optional Tests

| Context | Required Tests | Optional Tests |
|---------|----------------|----------------|
| Local development | Per matrix | Any additional |
| PR validation | Per matrix | Reviewer's choice |
| Release candidate | Full sweep | — |

**Recording in compliance-report.md:**
```
Tests Required: Unit (per matrix)
Tests Run: Unit (12/12), E2E (optional, 3/3)
```

---

## §8 Test Commands Reference

```bash
# Unit tests
npm run test:unit

# Integration tests  
npm run test:integration

# SEO validation
npm run test:seo

# ISS-001 (layout shift/visual)
npm run test:iss001

# E2E - specific calculator
npm run test:e2e -- --grep "percentage"

# E2E - mode switching
npm run test:e2e -- --grep "mode"

# Full sweep (all tests)
npm run test:all
```

---

## §9 Test Configuration

Tests should be configured to:

- ✅ Exit with non-zero code on failure
- ✅ Output machine-readable results (JSON or TAP)
- ✅ Support filtering by test name/tag
- ✅ Generate coverage reports (for Unit)
- ✅ Take screenshots on failure (for E2E)

---

## §10 Coverage Thresholds

| Test Type | Minimum Coverage | Target |
|-----------|------------------|--------|
| Unit (new code) | 80% | 90% |
| Unit (existing) | No regression | — |
| E2E (critical paths) | 100% | 100% |

---

*The matrix is the law. Test what's required, no more, no less.*
