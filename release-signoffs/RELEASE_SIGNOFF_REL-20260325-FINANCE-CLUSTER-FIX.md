# Release Sign-off: Finance Cluster 410 reroute fix

## Summary
- Identified residual worker function at `functions/calculators/finance-calculators/[[path]].js` returning HTTP 410.
- This route conflicted with desired calculator pages and caused production content to return Gone.
- Fixed by moving the file to `functions/finance-calculators_DELETED/[[path]].js`.

## Validation performed
- `npm run test:calc:unit` passed: 1 test file, 9 assertions.
- `npm run test:cluster:unit` passed: 2 test files, 2 assertions.

## URL checks (recommendation for production/edge)
- Re-run post-deploy:
  - `curl -I https://<site>/finance-calculators/inflation-calculator/` should return 200.
  - `curl -I https://<site>/calculators/finance-calculators/inflation-calculator/` should return 200.

## Notes
- No redirect files updated; legacy URL behavior remains in public assets and sitemaps.
- Monitoring to ensure no revert of 410 file in future patches.
