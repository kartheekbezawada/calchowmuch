# CREDIT_CARD_SEO_JSONLD_PLAN_LOG

## Scope
- Mode: `SCHEMA_DEDUPE_MAINTENANCE` (human-locked `SEO + schema only`)
- Working-tree policy: layer on top of existing uncommitted changes
- Release scope: 9 calculators (4 credit-cards + 5 car-loans)

## Execution Order and Status

| # | Cluster | CALC | Route | Generate | `test:calc:seo` | `test:schema:dedupe -- --scope=calc` | Status |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | credit-cards | balance-transfer-installment-plan | `/credit-card-calculators/balance-transfer-credit-card-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |
| 2 | credit-cards | credit-card-consolidation | `/credit-card-calculators/credit-card-consolidation-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |
| 3 | credit-cards | credit-card-minimum-payment | `/credit-card-calculators/credit-card-minimum-payment-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |
| 4 | credit-cards | credit-card-repayment-payoff | `/credit-card-calculators/credit-card-payment-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |
| 5 | loans | multiple-car-loan | `/car-loan-calculators/auto-loan-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |
| 6 | loans | leasing-calculator | `/car-loan-calculators/car-lease-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |
| 7 | loans | car-loan | `/car-loan-calculators/car-loan-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |
| 8 | loans | hire-purchase | `/car-loan-calculators/hire-purchase-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |
| 9 | loans | pcp-calculator | `/car-loan-calculators/pcp-calculator/` | Pass | Pass | Pass (`changed=0`) | Complete |

## Contract Validation Notes
- Shared head contract now emits `charset`, title/description/canonical, OG/Twitter mirrors, and `robots=index,follow`.
- Head text normalization removes ellipsis (`...`, `…`) and fixes broken dash encoding (`â€“`).
- Calculator-path detection uses: `pathname.includes('-calculators/') || pathname.endsWith('-calculator/')`.
- Calculator JSON-LD fallback injected in shared head path only for calculator pages (`SoftwareApplication` + `BreadcrumbList`, no per-page `WebSite`).
- Runtime metadata sync keeps OG/Twitter aligned to resolved title/description/canonical.
- Credit-card target routes now regenerate with exact required `<title>`, description, and H1 values.
- Car-loan targets validate `primaryImageOfPage.url = https://calchowmuch.com/assets/images/og-default.png` in SEO specs.

## Per-Calculator Checklist (Completed)
- [x] Head contract-compliant title/description/OG/Twitter
- [x] No ellipsis / bad dash encoding
- [x] Canonical confirmed
- [x] H1 updated (credit-card targets)
- [x] JSON-LD contract satisfied
- [x] Route regenerated
- [x] `test:calc:seo` passed
- [x] `test:schema:dedupe -- --scope=calc` passed
- [x] Evidence row appended
- [x] Sign-off files created
- [x] Master table rows appended
