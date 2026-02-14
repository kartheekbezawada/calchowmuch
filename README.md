# CalcHowMuch

CalcHowMuch is a static, SEO-focused multi-page calculator platform.
It serves calculators across finance, loans, math, percentage, and time/date categories.

## What This Project Is

- Frontend-only calculator platform (no backend runtime).
- MPA architecture with full-page navigation via static `<a href>` links.
- Route pages are generated into `public/` and served as static HTML.
- Governance and quality gates are defined in:
  - `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`

## Core Architecture

- Source route fragments live under `public/calculators/<category>/<slug>/`
  - Common files: `index.html`, `explanation.html`, `module.js`, `calculator.css`
  - Archetype-based routes also support `content.html` where applicable.
- Generated route pages are written to:
  - `public/<category>/<slug>/index.html`
- Route navigation source of truth:
  - `public/config/navigation.json`
- MPA generation script:
  - `scripts/generate-mpa-pages.js`

## Build and Runtime Tooling

### Required Software

- Node.js `>=18` (defined in `package.json`)
- npm (scripts are npm-based)
- Python 3 for local static hosting

### Main Build/Dev Commands

- Install dependencies:
  - `npm install`
- Serve static site locally:
  - `python3 -m http.server 8000 --directory public`
- Regenerate MPA pages/navigation outputs:
  - `node scripts/generate-mpa-pages.js`
- Lint JS:
  - `npm run lint`
- Format check:
  - `npm run format:check`

## Packages Used (Build + Dev)

From `package.json`:

- `@playwright/test`
- `vitest`
- `@vitest/coverage-v8`
- `jsdom`
- `eslint`
- `prettier`

## Testing Strategy

The project uses layered testing:

- Unit and core behavior tests (Vitest + JSDOM)
- Route and interaction E2E tests (Playwright)
- SEO-specific E2E checks (Playwright specs)
- Static SEO/schema source guard tests (Vitest)
- Local SEO+Lighthouse audit runs (custom script)
- Layout stability ISS checks for shell-impacting changes

### Test Types and Locations

All tests live under `tests_specs/` categorized by calculator domain:

- Unit tests: `tests_specs/{category}/unit/*.test.js`
- E2E specs: `tests_specs/{category}/e2e/*.spec.js`
- ISS tests: `tests_specs/infrastructure/e2e/iss-design-001.spec.js`, `tests_specs/infrastructure/e2e/iss/`
- CWV guard: `tests_specs/infrastructure/e2e/cls-guard-all-calculators.spec.js`
- Schema guards: `tests_specs/infrastructure/unit/page-metadata-schema-guard.test.js`, `tests_specs/finance/unit/finance-static-schema-source-parity.test.js`

Categories: `loans`, `credit-cards`, `finance`, `percentage`, `math`, `time-and-date`, `sleep-and-nap`, `infrastructure`

### Test Commands

- Run unit/core test suite:
  - `npm run test`
- Run E2E suite:
  - `npm run test:e2e`
- Run ISS subset:
  - `npm run test:iss`
- Run ISS-001:
  - `npm run test:iss001`
- Run finance static SEO source parity:
  - `npm run test:seo:source-finance`
- Run local SEO + Lighthouse audit:
  - `npm run audit:local-seo -- --base-url http://127.0.0.1:8000 --slugs <slugs-file> --audit-md <audit-output.md> --out-dir <artifact-dir>`

## Where Tests Are Conducted

- Vitest tests run in Node with `jsdom` environment.
- Playwright tests run Chromium locally using:
  - Base URL: `http://localhost:8001`
  - Auto web server command from config:
    - `python3 -m http.server 8001 --directory public`
- Local SEO audit runs against a manually provided local base URL.
  - Default in script is `http://127.0.0.1:8000`.
  - Artifacts are written under `test-results/seo/local-audit/`.

## Pass Criteria (Practical + Governance)

At minimum, a high-confidence pass for a calculator change means:

- No lint failures for changed JS scope.
- Required Vitest suites pass for affected logic.
- Required Playwright route specs pass for affected routes.
- ISS checks pass when layout/shell behavior is impacted.
- SEO checks pass for required priorities and schema contracts:
  - Required metadata present.
  - Required JSON-LD types present per route archetype.
  - FAQ/schema parity checks pass where required.
- Sitemap coverage is present for any public/live route.

Governance source:

- `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md`

## Compliance and Tracking

Release governance follows the document chain:

- `requirements/compliance/requirement_tracker.md` — REQ lifecycle
- `requirements/universal-rules/RELEASE_CHECKLIST.md` — pre-release gate
- `requirements/universal-rules/RELEASE_SIGNOFF.md` — release sign-off template
- `requirements/universal-rules/release-signoffs/` — per-release evidence files
- `requirements/universal-rules/Release Sign-Off Master Table.md` — historical ledger

## Chromium and WSL Notes

- Playwright uses Chromium for E2E and will download browser binaries via:
  - `npx playwright install --with-deps chromium`
- Lighthouse audits must run against a Linux Chromium binary when you are inside WSL.
  - Do not rely on Windows Chrome from WSL.
- Install Chromium in WSL using your distro package manager, then verify binary path:
  - Ubuntu:
    - `sudo apt update && sudo apt install -y chromium-browser`
  - Debian:
    - `sudo apt update && sudo apt install -y chromium`
  - Fedora:
    - `sudo dnf install -y chromium`
  - `which chromium`
  - `which chromium-browser`
- If needed, force the executable path explicitly for audit runs:
  - `CHROME_PATH=/usr/bin/chromium node scripts/local-seo-performance-audit.mjs --base-url http://127.0.0.1:8000 --slugs <slugs-file> --audit-md <audit-output.md> --out-dir <artifact-dir>`
- Common failure signal when Chromium is missing/misresolved:
  - `Lighthouse desktop/mobile unavailable (Unable to connect to Chrome)`

## Useful Notes

- This repo is static-first: generated HTML in `public/` is expected output.
- `scripts/local-seo-performance-audit.mjs` uses `CHROME_PATH` resolution to stabilize Lighthouse runs in WSL/Linux environments.
