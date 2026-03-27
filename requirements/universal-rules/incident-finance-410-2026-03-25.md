# Incident: Finance calculators served 410 from worker handler

## ID
- INCIDENT-20260325-FINANCE-410

## Date
- 2026-03-25

## Summary
- Production check discovered `/finance-calculators/inflation-calculator/` returning **410 Gone** with `cf-cache-status: DYNAMIC`.
- Local static build showed correct 200, so issue was runtime route override.

## Root cause
- `functions/calculators/finance-calculators/[[path]].js` existed as a Cloudflare Pages Function wildcard handler.
- It returned 410 for any `/calculators/finance-calculators/*` requests, shadowing downstream static page content.

## Actions taken
1. Moved file out of active routes to `functions/finance-calculators_DELETED/[[path]].js`.
2. Re-ran tests:
   - `npm run test:calc:unit` ✓
   - `npm run test:cluster:unit` ✓
3. Added release sign-off file:
   - `release-signoffs/RELEASE_SIGNOFF_REL-20260325-FINANCE-CLUSTER-FIX.md`

## Validation checklist
- [ ] Deploy and verify `/finance-calculators/inflation-calculator/` returns 200.
- [ ] Verify `/calculators/finance-calculators/inflation-calculator/` returns 200.
- [ ] Check `cf-cache-status` in production for expected lifecycle values.

## Follow-up
- Confirm no future code paths reintroduce the legacy 410 wildcard function under `functions/calculators/finance-calculators/`.
- Incorporate this incident into team runbook for geometry of Pages functions vs static file routing.
