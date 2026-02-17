> Policy status: RATIONALE ONLY. Runtime-enforced settings are governed by `requirements/universal-rules/lighthouse_policy.json`.

PERFORMANCE & DETERMINISM IMPROVEMENTS


SECTION A — SPEED IMPROVEMENTS (IMPLEMENT FIRST)
===========================================

A1) Default to performance-only audits
===========================
	Objective: Reduce Lighthouse runtime.
	Required changes
	Change the default categories from: performance,accessibility,best-practices
	to performance
	Allow override via environment variable LH_CATEGORIES.
	Acceptance criteria
	When no env override is present, only the Performance category runs.
	Runtime is measurably reduced.



A2) Make mixed-content scan optional (disabled by default)
==============================================
Objective: Avoid unnecessary HTML fetch + JSDOM cost.
Required changes
Introduce environment flag:
LH_SCAN_MIXED_CONTENT=1
Only execute scanMixedContent() when this flag is truthy.
When disabled, populate summary with:
mixedContentFound: null,
mixedContentOffenders: []

Acceptance criteria
	Default runs do NOT perform the extra fetch or JSDOM parse.
	Enabling the flag restores current behavior.

A3) Allow skipping local server startup
===================================
Objective: Remove repeated server spawn overhead in batch runs.
Required changes
Introduce environment flag:
LH_ASSUME_SERVER_RUNNING=1

Behavior:
If set → skip ensureServer()
If not set → retain current behavior
	Acceptance criteria
		When flag is set, no Python server is spawned.
		Existing behavior remains unchanged when flag is absent.
		

SECTION B — DETERMINISM IMPROVEMENTS (HIGH PRIORITY)
B1) Force devtools throttling for ALL presets

Objective: Reduce Lighthouse variability.

Required changes

Ensure the Lighthouse CLI always includes:

--throttling-method=devtools


This must apply to:

mobile runs

desktop runs

(not desktop-only as currently)

Acceptance criteria

All Lighthouse invocations explicitly set throttling method.

B2) Make form factor explicit for both modes

Objective: Remove preset ambiguity.

Required changes

Mobile mode must include
--form-factor=mobile
--throttling-method=devtools


Keep screen emulation enabled.

Desktop mode must include
--form-factor=desktop
--screenEmulation.disabled
--throttling-method=devtools


Acceptance criteria

Mobile and desktop runs are fully explicit and symmetric.

No reliance on implicit Lighthouse defaults.

B3) Add multi-run median support

Objective: Stabilize CWV metrics.

Required changes

Introduce environment variable:

LH_RUNS=1


Behavior:

If LH_RUNS > 1:

Run Lighthouse N times.

Collect for each run:

performance score

LCP

CLS

INP

Compute the median for each metric.

Write the median values into the summary JSON.

Save each raw report as:

<slug>.<preset>.run1.json
<slug>.<preset>.run2.json
<slug>.<preset>.run3.json


Acceptance criteria

Default remains single run.

Multi-run mode produces stable median summary.

Individual run artifacts are preserved.

B4) Add stronger Chrome stability flags

Objective: Reduce background browser noise.

Required changes

Extend buildChromeFlags() by appending:

--disable-background-networking
--disable-background-timer-throttling
--disable-renderer-backgrounding
--disable-features=Translate,BackForwardCache
--no-first-run
--no-default-browser-check


Acceptance criteria

Flags appear in the final Chrome launch string.

Existing flags remain intact.

SECTION C — OPTIONAL (RECOMMENDED)
C1) Add warm-up run capability

Objective: Reduce cold-start variance.

Required changes

Add environment flag:

LH_WARMUP_RUN=1


Behavior:

Perform one Lighthouse run and discard results.

Then execute measured runs.

Acceptance criteria

Warm-up run does not affect final metrics.

Works with both single-run and multi-run modes.

C2) Add timing diagnostics

Objective: Improve observability of slow runs.

Required changes

Log durations for:

server startup time

Lighthouse execution time

mixed-content scan time

Acceptance criteria

Timing information appears in console output.

No change to summary schema required.

SECTION D — EXPECTED OPERATING MODES

Codex should document these usage patterns.

Fast Gate Mode (daily)

Environment:

LH_CATEGORIES=performance
LH_RUNS=1
LH_SCAN_MIXED_CONTENT=0
LH_ASSUME_SERVER_RUNNING=1


Purpose:

fastest feedback loop

minimal overhead

Stable CI Mode (pre-release)

Environment:

LH_CATEGORIES=performance
LH_RUNS=3
LH_WARMUP_RUN=1
LH_SCAN_MIXED_CONTENT=0


Purpose:

reduced metric noise

reliable release gating

Full Audit Mode (occasional)

Environment:

LH_CATEGORIES=performance,accessibility,best-practices
LH_SCAN_MIXED_CONTENT=1
LH_RUNS=1


Purpose:

comprehensive quality audit

FINAL ACCEPTANCE GOAL

After implementation:

Lighthouse runs faster in default mode

CWV metrics fluctuate less between runs

Release gate failures become deterministic

Optional deep audit remains available
