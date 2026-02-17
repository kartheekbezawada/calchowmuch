> Policy status: RATIONALE ONLY. Runtime-enforced settings are governed by `requirements/universal-rules/lighthouse_policy.json`.

Below is an explicit “code diff instruction” template you can give Codex. It’s designed to force minimal, safe edits (small diffs, no refactors) aligned with industry guidance on keeping changes small and reviewable.

You can also paste the Universal Requirement section directly into your repo docs.

What you tell Codex (copy/paste)
0) Non-negotiables (diff discipline)

Do not refactor or reorganize functions.

Do not rename existing functions unless required for the change.

Only add code where needed (guards + flags + small helpers).

Keep the change as a small CL: targeted edits, easy to review.

Preserve current behavior unless an env flag is explicitly set.

Add/update only the minimum documentation needed (usage examples).

Patch 1 — Speed defaults (smallest safe diff)
1) Default Lighthouse categories to performance-only

Edit DEFAULTS.categories:

Change from:

performance,accessibility,best-practices

To:

performance

Rules

Keep LH_CATEGORIES override working exactly as it does now.

Acceptance

With no env overrides, Lighthouse runs only performance audits.

Script still runs successfully for an example route.

2) Make mixed-content scan optional (disabled by default)

Add env flag

LH_SCAN_MIXED_CONTENT (default off)

Implementation

In main(), replace unconditional call:

const mixedContent = await scanMixedContent(url);

With:

If process.env.LH_SCAN_MIXED_CONTENT is truthy → call it

Else → set:

mixedContentFound: null

offenders: []

Acceptance

Default run does not perform extra fetch/JSDOM parse.

When LH_SCAN_MIXED_CONTENT=1, behavior matches current output.

3) Allow skipping server auto-start

Add env flag

LH_ASSUME_SERVER_RUNNING (default off)

Implementation

In main(), before calling ensureServer(baseUrl):

If LH_ASSUME_SERVER_RUNNING=1, skip ensureServer.

Otherwise keep existing server startup logic.

Acceptance

With flag on: no python server is spawned.

With flag off: existing behavior unchanged.

Patch 2 — Determinism (minimal changes, high impact)
4) Force throttling method for ALL runs

Goal: reduce variance by removing implicit defaults.

Implementation

Always include in Lighthouse args:

--throttling-method=devtools

Acceptance

Both mobile and desktop invocations include --throttling-method=devtools.

5) Make form-factor explicit for both modes

Implementation

For mobile runs add:

--form-factor=mobile

keep screen emulation enabled (do NOT add --screenEmulation.disabled)

For desktop runs keep existing:

--form-factor=desktop

--screenEmulation.disabled

--throttling-method=devtools (already ensured above)

Acceptance

The CLI args show explicit form-factor for both presets.

6) Add multi-run median mode (optional via env)

Add env var

LH_RUNS (default 1)

Implementation

If LH_RUNS > 1:

Run Lighthouse N times.

Save raw reports as:

${slugFolder}.${preset}.run1.json, .run2.json, …

Compute median for:

performance score

LCP (ms)

CLS

INP (ms)

Write summary JSON with median metrics.

If LH_RUNS=1, keep current single run behavior and output paths.

Acceptance

LH_RUNS=3 produces 3 raw reports + one summary.

Median values appear in summary.

(Why: multiple runs reduce noise; small-change discipline keeps it safe.)

7) Add Chrome stability flags (append-only)

Implementation

In buildChromeFlags(profileDir), append these flags (no removals):

--disable-background-networking

--disable-background-timer-throttling

--disable-renderer-backgrounding

--disable-features=Translate,BackForwardCache

--no-first-run

--no-default-browser-check

Acceptance

Printed error logs include these flags in the command line when Lighthouse fails.

Patch 3 — Documentation + release gate usage (tiny diff)
8) Document 3 run modes in the repo

Add to your README or a docs/lighthouse-gate.md:

FAST (local dev)

LH_CATEGORIES=performance

LH_RUNS=1

LH_ASSUME_SERVER_RUNNING=1

LH_SCAN_MIXED_CONTENT=0

STABLE (pre-release)

LH_CATEGORIES=performance

LH_RUNS=3

LH_SCAN_MIXED_CONTENT=0

FULL AUDIT (occasional)

LH_CATEGORIES=performance,accessibility,best-practices

LH_RUNS=1

LH_SCAN_MIXED_CONTENT=1

Acceptance

Commands are copy/paste runnable.

Universal Requirement text (add to your UNIVERSAL_REQUIREMENTS.md)

You can paste this as-is:

UR-TEST-LH-001 — Small diffs only for test tooling

Any change to test tooling must be a small, reviewable diff (no refactors unless explicitly required).

Prefer feature flags for new behavior; keep defaults stable.

Each change must include clear acceptance criteria and runnable commands.

UR-TEST-LH-002 — Lighthouse gate determinism

Release gates must run Lighthouse with:

explicit --throttling-method=devtools

explicit --form-factor matching the gate mode

Variance control:

default LH_RUNS=1 for local speed

LH_RUNS=3 required for pre-release gate (median aggregation).

UR-TEST-LH-003 — Optional slow checks

Mixed-content scanning must be opt-in via LH_SCAN_MIXED_CONTENT=1.

Full category audits (a11y/best-practices) are audit mode, not release gate default.

Release checklist entries (add to RELEASE_CHECKLIST.md)

 Lighthouse Gate Mode used: LH_CATEGORIES=performance

 Determinism flags present: --throttling-method=devtools, explicit form-factor

 Pre-release gate uses LH_RUNS=3 and summary reports median CWV metrics

 Mixed-content scan is optional and only enabled when needed (LH_SCAN_MIXED_CONTENT=1)
