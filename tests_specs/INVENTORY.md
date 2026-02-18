# Scoped Test Inventory

Single source of truth for test layout under `tests_specs/` after cluster/calculator isolation migration.

## 1) Required Folder Architecture

```
tests_specs/
├── {cluster}/cluster_release/
│   ├── unit.cluster.test.js
│   ├── contracts.cluster.test.js
│   ├── e2e.cluster.spec.js
│   ├── seo.cluster.spec.js
│   ├── cwv.cluster.spec.js
│   └── README.md
├── {cluster}/{calculator}_release/
│   ├── unit.calc.test.js
│   ├── e2e.calc.spec.js
│   ├── seo.calc.spec.js
│   ├── cwv.calc.spec.js
│   └── README.md
└── infrastructure/
    ├── unit/*.test.js
    └── e2e/*.spec.js
```

## 2) Test Types and File Names

### 2.1 Cluster release tests (`tests_specs/{cluster}/cluster_release/`)

| File name | Type | Scope |
|---|---|---|
| `unit.cluster.test.js` | Unit (Vitest) | Cluster-level non-UI logic and data checks |
| `contracts.cluster.test.js` | Unit (Vitest) | Ownership/isolation/navigation contract assertions |
| `e2e.cluster.spec.js` | E2E (Playwright) | Cluster journey smoke coverage |
| `seo.cluster.spec.js` | E2E (Playwright) | Cluster SEO invariants |
| `cwv.cluster.spec.js` | E2E (Playwright) | Cluster-scoped CWV guard |
| `README.md` | Doc | Scope, commands, pass criteria, ownership |

### 2.2 Calculator release tests (`tests_specs/{cluster}/{calculator}_release/`)

| File name | Type | Scope |
|---|---|---|
| `unit.calc.test.js` | Unit (Vitest) | Formula correctness, edge cases, validation |
| `e2e.calc.spec.js` | E2E (Playwright) | Input -> calculate -> result journey |
| `seo.calc.spec.js` | E2E (Playwright) | Title/meta/h1/schema/canonical/FAQ checks |
| `cwv.calc.spec.js` | E2E (Playwright) | Route-scoped CWV guard |
| `README.md` | Doc | Scope, commands, pass criteria, ownership |

## 3) Runner Isolation

| Runner | Config | Include | Exclude |
|---|---|---|---|
| Vitest | `vitest.config.js` | `tests_specs/**/*.test.js` | all `*.spec.js` |
| Playwright | `playwright.config.js` | `tests_specs/**/*.spec.js` | all `*.test.js` |

Result:
- Unit runs never load Playwright specs.
- E2E runs never load Vitest tests.

## 4) Scoped Commands

### 4.1 Cluster-scoped

- `CLUSTER={cluster} npm run test:cluster:unit`
- `CLUSTER={cluster} npm run test:cluster:e2e`
- `CLUSTER={cluster} npm run test:cluster:seo`
- `CLUSTER={cluster} npm run test:cluster:cwv`

### 4.2 Calculator-scoped

- `CLUSTER={cluster} CALC={calculator} npm run test:calc:unit`
- `CLUSTER={cluster} CALC={calculator} npm run test:calc:e2e`
- `CLUSTER={cluster} CALC={calculator} npm run test:calc:seo`
- `CLUSTER={cluster} CALC={calculator} npm run test:calc:cwv`

### 4.3 Global full-site commands (kept for full-site releases)

- `npm run test`
- `npm run test:e2e`
- `npm run test:cwv:all`
- `npm run test:iss001`

## 5) Active Cluster Coverage (from `config/testing/test-scope-map.json`)

| Cluster | Calculator count | Cluster release folder |
|---|---:|---|
| `credit-cards` | 4 | `tests_specs/credit-cards/cluster_release/` |
| `finance` | 10 | `tests_specs/finance/cluster_release/` |
| `loans` | 12 | `tests_specs/loans/cluster_release/` |
| `math` | 37 | `tests_specs/math/cluster_release/` |
| `percentage` | 13 | `tests_specs/percentage/cluster_release/` |
| `sleep-and-nap` | 5 | `tests_specs/sleep-and-nap/cluster_release/` |
| `time-and-date` | 7 | `tests_specs/time-and-date/cluster_release/` |

## 6) Infrastructure Full-Site Specs

### 6.1 Infrastructure unit files

- `tests_specs/infrastructure/unit/format.test.js`
- `tests_specs/infrastructure/unit/graph-utils.test.js`
- `tests_specs/infrastructure/unit/math.test.js`
- `tests_specs/infrastructure/unit/page-metadata-schema-guard.test.js`
- `tests_specs/infrastructure/unit/stats.test.js`
- `tests_specs/infrastructure/unit/validate.test.js`

### 6.2 Infrastructure e2e files

- `tests_specs/infrastructure/e2e/above-the-fold-mutation.spec.js`
- `tests_specs/infrastructure/e2e/accessibility-ux.spec.js`
- `tests_specs/infrastructure/e2e/button-only-recalc-finance-percentage.spec.js`
- `tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js`
- `tests_specs/infrastructure/e2e/gtep-pages-seo.spec.js`
- `tests_specs/infrastructure/e2e/gtep-pages.spec.js`
- `tests_specs/infrastructure/e2e/home-shell.spec.js`
- `tests_specs/infrastructure/e2e/interaction-guard.spec.js`
- `tests_specs/infrastructure/e2e/iss-001-layout-stability.spec.js`
- `tests_specs/infrastructure/e2e/iss-design-001.spec.js`
- `tests_specs/infrastructure/e2e/mobile-ux.spec.js`
- `tests_specs/infrastructure/e2e/route-archetype-contract.spec.js`
- `tests_specs/infrastructure/e2e/sitemap-footer.spec.js`
- `tests_specs/infrastructure/e2e/sitemap-seo.spec.js`
- `tests_specs/infrastructure/e2e/iss/iss-nav-top-001.spec.js`
