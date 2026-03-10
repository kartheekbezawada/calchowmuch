# Loan Legacy URL Audit Decision Log - 2026-03-10

## Decision ID
- DEC-URL-20260310-001

## Scope
- Home + auto loan URL families only.
- Canonical families: `/loan-calculators/*` and `/car-loan-calculators/*`.
- Legacy mapped family: `/loans/*` slugs that map to those canonical families.
- This entry is documentation-only; no runtime URL behavior changes are executed in this step.

## Findings (Audit Date: 2026-03-10)
1. Scoped legacy `/loans/*` slugs currently resolve as `200` with homepage fallback content in production.
2. Legacy fragment index URLs under `/calculators/loan-calculators/*` and `/calculators/car-loan-calculators/*` are currently reachable in production.
3. Canonical loan/auto-loan pages still depend on `/calculators/...` runtime asset paths (JS/CSS), so hard deletion of those paths is not yet safe.

## Decisions
1. No immediate deletion of `/calculators/...` loan/auto-loan assets.
2. Treat `/loans/*` as a public legacy slug set requiring an explicit redirect strategy, not fallback `200` behavior.
3. Define and enforce retirement prerequisites by legacy family before any decommission action.

## Retirement Prerequisites
### `/loans/*` legacy public slugs
- Define one-to-one legacy-to-canonical redirect mapping for all in-scope loan and auto-loan slugs.
- Verify production behavior for each mapping with status + location checks.
- Confirm canonical targets remain stable in sitemap, canonical tags, and cluster test scope map.

### `/calculators/...` fragment index URL surfaces
- Decouple index URL behavior from runtime asset delivery.
- Ensure index URL handling is explicit and non-canonical for public search indexing.
- Apply retirement behavior only after runtime dependencies are migrated.

### `/calculators/...` runtime asset paths used by canonical pages
- Migrate canonical route runtime imports/manifests away from `/calculators/loan-calculators/*` and `/calculators/car-loan-calculators/*`.
- Verify no required JS/CSS runtime references remain in generated public route HTML and active asset manifest mappings.
- Only after dependency removal, execute retirement behavior for legacy fragment index paths.

## Evidence References
- `public/config/asset-manifest.json`
- `config/testing/PERF_BUDGETS.json`
- `functions/calculators/finance-calculators/[[path]].js` (decommission precedent: legacy finance calculator prefix returns `410`)
- Audited production URL matrix run dated `2026-03-10` (captured below).

## Audit Matrix Snapshot (2026-03-10)
- `/loans/home-loan/` -> `200`, homepage fallback metadata
- `/loans/how-much-can-i-borrow/` -> `200`, homepage fallback metadata
- `/loans/remortgage-switching/` -> `200`, homepage fallback metadata
- `/loans/buy-to-let/` -> `200`, homepage fallback metadata
- `/loans/offset-calculator/` -> `200`, homepage fallback metadata
- `/loans/interest-rate-change-calculator/` -> `200`, homepage fallback metadata
- `/loans/loan-to-value/` -> `200`, homepage fallback metadata
- `/loans/car-loan/` -> `200`, homepage fallback metadata
- `/loans/multiple-car-loan/` -> `200`, homepage fallback metadata
- `/loans/hire-purchase/` -> `200`, homepage fallback metadata
- `/loans/pcp-calculator/` -> `200`, homepage fallback metadata
- `/loans/leasing-calculator/` -> `200`, homepage fallback metadata
- `/calculators/loan-calculators/mortgage-calculator/` -> `200`, reachable fragment index surface
- `/calculators/car-loan-calculators/car-loan-calculator/` -> `200`, reachable fragment index surface

## Next-Phase Actions (Not Executed In This Step)
1. Implement explicit `/loans/*` redirect mappings for scoped legacy slugs.
2. Introduce explicit handling strategy for `/calculators/...` fragment index URLs after runtime dependency migration.
3. Migrate canonical loan/auto-loan runtime asset references off `/calculators/...` legacy prefixes.
4. Run release checklist gates and capture sign-off evidence for the execution phase.

## Decommission Readiness Exit Criteria
- All in-scope `/loans/*` legacy slugs return expected redirects to canonical targets.
- Canonical `/loan-calculators/*` and `/car-loan-calculators/*` routes remain functional and SEO-valid.
- No required runtime JS/CSS dependencies remain on legacy `/calculators/loan-calculators/*` or `/calculators/car-loan-calculators/*` prefixes.
- Legacy fragment index URL behavior is explicit and non-canonical per approved retirement strategy.

## Public Interfaces / Types
- No public API, route schema, runtime module contract, or type/interface changes in this logging step.
