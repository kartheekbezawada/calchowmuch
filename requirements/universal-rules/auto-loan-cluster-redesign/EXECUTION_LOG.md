# Auto Loan Cluster Execution Log

## 2026-03-19 — Rollout Start

Status:

- scope approved
- documentation pack started
- implementation not started yet at this entry

Scope:

- `car-loan`
- `multiple-car-loan`
- `hire-purchase`
- `pcp-calculator`
- `leasing-calculator`

Allowed files:

- `requirements/universal-rules/auto-loan-cluster-redesign/**`
- `public/calculators/car-loan-calculators/**`
- `public/car-loan-calculators/**`
- `scripts/generate-mpa-pages.js`
- `config/testing/test-scope-map.json`
- `tests_specs/auto-loans/**`
- `tests_specs/loans/**` for Auto Loan release surface cleanup
- `config/clusters/route-ownership.json`
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_REL-*-AUTO-LOAN-REDESIGN.md`

Initial findings:

- Auto Loan navigation already declares `designFamily: "auto-loans"` and `paneLayout: "single"` for all 5 routes.
- Generated Auto Loan pages still load the legacy dark shell, top nav, left nav, ad column, and shared shell CSS.
- Auto Loan source fragments still use Home Loan wrapper names such as `#calc-home-loan` and `.home-loan-ui`.
- Auto Loan release coverage still lives under the mixed `tests_specs/loans/**` surface.
- `config/clusters/route-ownership.json` does not currently include the 5 Auto Loan routes.

Execution order:

1. `car-loan`
2. `multiple-car-loan`
3. `hire-purchase`
4. `pcp-calculator`
5. `leasing-calculator`

Notes:

- This log is append-only.
- Each route completion entry must record files touched, what changed, evidence, test results, and notes.

## 2026-03-19 — Cluster Foundation Complete

Status:

- complete

Files touched:

- `public/calculators/car-loan-calculators/shared/cluster-light.css`
- `public/calculators/car-loan-calculators/shared/cluster-ux.js`
- `scripts/generate-mpa-pages.js`
- `config/testing/test-scope-map.json`
- `tests_specs/auto-loans/**`
- `tests_specs/loans/cluster_release/*`
- `config/clusters/route-ownership.json`

What changed:

- Added the dedicated Auto Loan light shell, shared interaction helpers, generator migration list, and related-calculator block.
- Split Auto Loan release coverage out of the mixed `loans` surface into `tests_specs/auto-loans/**`.
- Removed the 5 Auto Loan calculators from the legacy `loans` release scope and kept Home Loan cluster coverage separate.
- Added rollback-tagged route ownership entries for all 5 Auto Loan routes.

Evidence:

- `config/testing/test-scope-map.json` now declares the `auto-loans` cluster and route-level release dirs.
- `config/clusters/route-ownership.json` now declares all 5 public Auto Loan routes with `activeOwnerClusterId: "auto-loans"`.

Tests:

- `node --check scripts/generate-mpa-pages.js` — pass
- `CLUSTER=auto-loans npm run test:cluster:unit` — pass
- `CLUSTER=auto-loans npm run test:cluster:e2e` — pass
- `CLUSTER=auto-loans npm run test:cluster:seo` — pass
- `CLUSTER=auto-loans npm run test:cluster:cwv` — pass
- `npm run test:cluster:contracts` — pass
- `ALLOW_SHARED_CONTRACT_CHANGE=1 npm run test:isolation:scope` — pass
- `CLUSTER=auto-loans npm run test:schema:dedupe -- --scope=cluster` — pass

Notes:

- The dedicated cluster regression surface passed before repo-wide release gates were attempted.

## 2026-03-19 — `car-loan` Complete

Status:

- complete

Files touched:

- `public/calculators/car-loan-calculators/car-loan-calculator/index.html`
- `public/calculators/car-loan-calculators/car-loan-calculator/calculator.css`
- `public/calculators/car-loan-calculators/car-loan-calculator/explanation.html`
- `public/calculators/car-loan-calculators/car-loan-calculator/module.js`
- `public/car-loan-calculators/car-loan-calculator/index.html`
- `tests_specs/auto-loans/car-loan_release/e2e.calc.spec.js`

What changed:

- Rebuilt the reference route on the Auto Loan light shell and removed Home Loan wrapper leakage.
- Added precise companion inputs for price, deposit, trade-in, fees, tax, APR, and term.
- Standardized baseline-on-load plus CTA-only recalculation and mobile preview reveal.

Evidence:

- Generated route now renders `data-design-family="auto-loans"`, the Auto Loan site header, and the `#car-auto-loan-explanation` root.

Tests:

- `TARGET_CALC_ID=car-loan node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=auto-loans CALC=car-loan npm run test:calc:unit` — pass
- `CLUSTER=auto-loans CALC=car-loan npm run test:calc:e2e` — pass
- `CLUSTER=auto-loans CALC=car-loan npm run test:calc:seo` — pass
- `CLUSTER=auto-loans CALC=car-loan npm run test:calc:cwv` — pass
- `CLUSTER=auto-loans CALC=car-loan npm run test:schema:dedupe -- --scope=calc` — pass

Notes:

- Route-level CWV output was reported to `test-results/performance/scoped-cwv/auto-loans/car-loan.json` during the scoped pass.

## 2026-03-19 — `multiple-car-loan` Complete

Status:

- complete

Files touched:

- `public/calculators/car-loan-calculators/auto-loan-calculator/index.html`
- `public/calculators/car-loan-calculators/auto-loan-calculator/calculator.css`
- `public/calculators/car-loan-calculators/auto-loan-calculator/explanation.html`
- `public/calculators/car-loan-calculators/auto-loan-calculator/module.js`
- `public/car-loan-calculators/auto-loan-calculator/index.html`
- `tests_specs/auto-loans/multiple-car-loan_release/e2e.calc.spec.js`

What changed:

- Rebuilt the comparison route on the Auto Loan shell and clarified combined-payment hierarchy.
- Added precise companion inputs for both loan amounts, APRs, and terms.
- Renamed the explanation contract to `#multi-auto-loan-explanation` and aligned tests to the new shell.

Evidence:

- Generated route now renders the Auto Loan shell and `#multi-auto-loan-explanation`.

Tests:

- `TARGET_CALC_ID=multiple-car-loan node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:calc:unit` — pass
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:calc:e2e` — pass
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:calc:seo` — pass
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:calc:cwv` — pass
- `CLUSTER=auto-loans CALC=multiple-car-loan npm run test:schema:dedupe -- --scope=calc` — pass

Notes:

- Scoped SEO reported a thin-content warn-only artifact for this route.
- Scoped CWV reported `test-results/performance/scoped-cwv/auto-loans/multiple-car-loan.json`.

## 2026-03-19 — `hire-purchase` Complete

Status:

- complete

Files touched:

- `public/calculators/car-loan-calculators/hire-purchase-calculator/index.html`
- `public/calculators/car-loan-calculators/hire-purchase-calculator/calculator.css`
- `public/calculators/car-loan-calculators/hire-purchase-calculator/explanation.html`
- `public/calculators/car-loan-calculators/hire-purchase-calculator/module.js`
- `public/car-loan-calculators/hire-purchase-calculator/index.html`
- `tests_specs/auto-loans/hire-purchase_release/e2e.calc.spec.js`

What changed:

- Rebuilt the balloon-payment route on the Auto Loan shell with a calmer answer-first hierarchy.
- Added precise companion inputs for price, deposit, APR, term, and balloon.
- Preserved term-unit toggles while keeping recalculation on the primary CTA only.

Evidence:

- Generated route now renders the Auto Loan shell and `#hp-auto-loan-explanation`.

Tests:

- `TARGET_CALC_ID=hire-purchase node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:unit` — pass
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:e2e` — pass
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:seo` — pass
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:calc:cwv` — pass
- `CLUSTER=auto-loans CALC=hire-purchase npm run test:schema:dedupe -- --scope=calc` — pass

Notes:

- Scoped SEO reported a thin-content warn-only artifact for this route.
- Scoped CWV reported `test-results/performance/scoped-cwv/auto-loans/hire-purchase.json`.

## 2026-03-19 — `pcp-calculator` Complete

Status:

- complete

Files touched:

- `public/calculators/car-loan-calculators/pcp-calculator/index.html`
- `public/calculators/car-loan-calculators/pcp-calculator/calculator.css`
- `public/calculators/car-loan-calculators/pcp-calculator/explanation.html`
- `public/calculators/car-loan-calculators/pcp-calculator/module.js`
- `public/car-loan-calculators/pcp-calculator/index.html`
- `tests_specs/auto-loans/pcp-calculator_release/e2e.calc.spec.js`

What changed:

- Rebuilt the PCP route on the Auto Loan shell and simplified the GFV/final-payment hierarchy.
- Added precise companion inputs for deposit, APR, term, GFV, and option fee.
- Preserved deposit-type and term-unit toggles while keeping the post-load calculate contract deliberate.

Evidence:

- Generated route now renders the Auto Loan shell and `#pcp-auto-loan-explanation`.

Tests:

- `TARGET_CALC_ID=pcp-calculator node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:calc:unit` — pass
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:calc:e2e` — pass
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:calc:seo` — pass
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:calc:cwv` — pass
- `CLUSTER=auto-loans CALC=pcp-calculator npm run test:schema:dedupe -- --scope=calc` — pass

Notes:

- Scoped SEO reported a thin-content warn-only artifact for this route.
- Scoped CWV reported `test-results/performance/scoped-cwv/auto-loans/pcp-calculator.json`.

## 2026-03-19 — `leasing-calculator` Complete

Status:

- complete

Files touched:

- `public/calculators/car-loan-calculators/car-lease-calculator/index.html`
- `public/calculators/car-loan-calculators/car-lease-calculator/calculator.css`
- `public/calculators/car-loan-calculators/car-lease-calculator/explanation.html`
- `public/calculators/car-loan-calculators/car-lease-calculator/module.js`
- `public/car-loan-calculators/car-lease-calculator/index.html`
- `tests_specs/auto-loans/leasing-calculator_release/e2e.calc.spec.js`

What changed:

- Rebuilt the densest Auto Loan route on the cluster shell and reduced the previous visual heaviness.
- Added precise companion inputs for price, residual, term, money factor, and upfront payment.
- Preserved residual-type and term-unit toggles plus monthly, yearly, and cost table modes.

Evidence:

- Generated route now renders the Auto Loan shell and `#lease-auto-loan-explanation`.

Tests:

- `TARGET_CALC_ID=leasing-calculator node scripts/generate-mpa-pages.js` — pass
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:calc:unit` — pass
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:calc:e2e` — pass
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:calc:seo` — pass
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:calc:cwv` — pass
- `CLUSTER=auto-loans CALC=leasing-calculator npm run test:schema:dedupe -- --scope=calc` — pass

Notes:

- Scoped SEO reported a thin-content warn-only artifact for this route.
- Scoped CWV reported `test-results/performance/scoped-cwv/auto-loans/leasing-calculator.json`.

## 2026-03-19 — Repo-Wide Release Gate Hold

Status:

- blocked outside approved scope

Files touched:

- none

What changed:

- Completed the required repo-wide release checklist up to the first failing global gate.
- Stopped further repo-wide gate execution when out-of-scope suites failed, per `AGENTS.md`.

Evidence:

- `npm run lint` — pass
- `npm run test` — pass
- `npm run test:e2e` surfaced unrelated failures before the run was stopped:
  - `tests_specs/credit-cards/credit-card-consolidation_release/e2e.calc.spec.js`
  - `tests_specs/credit-cards/credit-card-consolidation_release/seo.calc.spec.js`
  - `tests_specs/finance/cluster_release/cwv.cluster.spec.js`
  - `tests_specs/finance/effective-annual-rate_release/cwv.calc.spec.js`

Tests:

- `npm run lint` — pass
- `npm run test` — pass
- `npm run test:e2e` — fail outside scope
- `npm run test:cwv:all` — not run after out-of-scope failure
- `npm run test:iss001` — not run after out-of-scope failure
- `npm run test:schema:dedupe` — not run after out-of-scope failure

Notes:

- Failure artifacts were written under `test-results/credit-cards-credit-card-c-0853e-late-donut-and-table-toggle-chromium/`, `test-results/credit-cards-credit-card-c-360a1-hema-FAQ-parity-and-sitemap-chromium/`, `test-results/finance-cluster_release-cw-d66a8--satisfy-CLS-LCP-thresholds-chromium/`, and `test-results/finance-effective-annual-r-a28c7-atisfies-CLS-LCP-thresholds-chromium/`.
