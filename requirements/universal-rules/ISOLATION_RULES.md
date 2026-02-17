# Isolation Rules (Loans-First)

## Purpose
Define strict route-level isolation defaults so a single calculator change does not unintentionally affect unrelated calculators.

## Scope
- Initial rollout: Loans category (`/loans/*`).
- Enforcement scripts:
  - `scripts/validate-isolation-scope.mjs`
  - `scripts/build-route-css-bundles.mjs`

## Isolation Contract
1. Default boundary is **route-level** (`isolationBoundary = route`).
2. Calculator-local changes should only impact:
- `public/calculators/<category>/<calculator-id>/*`
- Matching generated route: `public/<category>/<calculator-id>/index.html`
- Matching route CSS bundles for that route slug
- Shared generated manifests (`public/config/asset-manifest.json`, `public/assets/css/route-bundles/manifest.json`)
3. Cross-route impact is only allowed when changing shared contract files and explicitly opting in.

## Shared Contract Files (Allowlist)
- `public/layout/header.html`
- `public/layout/footer.html`
- `public/config/navigation.json`
- `public/config/asset-manifest.json`
- `public/assets/css/core-tokens.css`
- `public/assets/css/core-shell.css`
- `public/assets/js/core-shell.js`
- `public/assets/css/theme-premium-dark.css`
- `public/assets/css/base.css`
- `public/assets/css/layout.css`
- `public/assets/css/calculator.css`
- `public/assets/css/shared-calculator-ui.css`
- `scripts/generate-mpa-pages.js`
- `scripts/build-route-css-bundles.mjs`
- `scripts/validate-isolation-scope.mjs`

## Shared Change Opt-In
- Shared contract changes require explicit opt-in via environment variable:
- `ALLOW_SHARED_CONTRACT_CHANGE=1`

## Manual Route Override
- Manual route generation overrides must be declared in `public/config/asset-manifest.json` under `options.generationMode = "manual"`.
- Hidden hardcoded skip lists are not allowed.
