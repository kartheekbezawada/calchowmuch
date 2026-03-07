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
- Port policy/status:
  - `npm run ports:list`
  - `npm run ports:next-free -- --group=playwright`
  - `npm run ports:acquire -- --group=lighthouse`
  - `npm run ports:release -- --lease-id=<lease-id>`
- Regenerate one route safely (default workflow):
  - `TARGET_ROUTE=/finance/simple-interest/ node scripts/generate-mpa-pages.js`
- Regenerate one calculator by id:
  - `TARGET_CALC_ID=simple-interest node scripts/generate-mpa-pages.js`
- Full-site regeneration (explicit opt-in only):
  - `node scripts/generate-mpa-pages.js --all`
- Lint JS:
  - `npm run lint`
- Format check:
  - `npm run format:check`

## Codex Usage Modes

Use these chat commands to control Codex response efficiency:

- `MODE: MAX` -> compact responses with reduced token usage.
- `MODE: STANDARD` -> normal response detail and verbosity.
- `MODE: STATUS` -> one-line output of the current mode.

Notes:

- Commands are case-insensitive but must start with `MODE:`.
- Unknown mode values should return one-line guidance with valid options.
- This affects collaboration verbosity only; release/compliance gate requirements stay unchanged.

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
  - Base URL: `PW_BASE_URL` (default `http://localhost:8001`)
  - Auto web server command from config:
    - `python3 -m http.server ${PW_WEB_SERVER_PORT} --directory public` (default `8001`)
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

## Calculator Explanation Authoring Standard

For `calc_exp` and `exp_only` routes, explanation content is mandatory in this order:

- Intent-led heading (calculator purpose/topic; avoid generic `Explanation` headings)
- `How to Guide`
- FAQ (schema-aligned)
- `Important Notes` (must be final section)

`Important Notes` must include:

- `Last updated: <Month YYYY>` (refresh when page content changes in release)
- `Accuracy: ...`
- calculator-relevant disclaimer key (for example `Financial disclaimer`, `Health disclaimer`, or `Disclaimer`)
- `Assumptions: ...` (calculator-specific)
- `Privacy: All calculations run locally in your browser - no data is stored.` (exact text)

Presentation requirements:

- notes use a bullet list (`ul`/`ol`)
- no dedicated notes container box
- key label color is `rgba(186, 230, 253, 0.98)`

If a calculator includes graphs/charts, they must be readable and decision-useful:

- Axes with clear labels and units/time basis
- Distinct data series + legible legend placement
- Mobile readability without horizontal overflow

Source of truth: `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` and `requirements/universal-rules/RELEASE_CHECKLIST.md`

## Thin-Content Governance

Thin-content quality checks are integrated into scoped SEO release commands.

- Primary command:
  - `npm run test:content:quality -- --scope=<full|cluster|calc|route> [--route=/path/]`
- Scoped SEO integration:
  - `CLUSTER={cluster} CALC={calculator} npm run test:calc:seo` runs Playwright SEO specs, then thin-content scoring (`--scope=calc`).
  - `CLUSTER={cluster} npm run test:cluster:seo` runs Playwright SEO specs, then thin-content scoring (`--scope=cluster`).

Rollout policy:

- `soft` mode: evidence + warnings only (non-blocking)
- `hard` mode: blocking fail when score `<70` or hard flags exist

Scoped calc artifact path:

- `test-results/content-quality/scoped/{cluster}/{calc}.json`

## Compliance and Tracking

Release governance follows the document chain:

- `requirements/compliance/requirement_tracker.md` — REQ lifecycle
- `requirements/universal-rules/RELEASE_CHECKLIST.md` — pre-release gate
- `requirements/universal-rules/RELEASE_SIGNOFF.md` — release sign-off template
- `requirements/universal-rules/release-signoffs/` — per-release evidence files

## Token Savings / Fast Execution Mode

Estimated documentation-process savings:

- Remove mandatory `Project Bible` read: `~1,000–2,500` tokens saved per task
- Simplify `RELEASE_SIGNOFF.md`: `~1,500–4,000` tokens saved per release task
- Skip `Release Sign-Off Master Table.md` updates: `~800–2,000` tokens saved per release task

Combined savings:

- Normal coding task: `~1,000–2,500`
- Release/compliance task: `~3,000–8,500` (can be higher on large releases)
- Extra gain from strict file scope: often `5k+` on larger tasks

Operator snippet:

```text
MODE: MAX
Reuse session context; do not reread policy docs unless this task edits them.
Read only these files: <list>
Do not scan outside scope unless blocked.
Do not run full release gates unless I explicitly ask.
```

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
- Cache policy baseline for calculators:
  - HTML routes are short-cache (`max-age=0, must-revalidate`).
  - JS/CSS assets are long-cache (`max-age=2592000, stale-while-revalidate=86400`).
  - Calculator-source imports under `/calculators/...` are versioned by `ROUTE_ASSET_VERSION` in `scripts/generate-mpa-pages.js`.
  - On scoped releases, purge only the changed route path plus changed calculator module/helper asset paths.
