UNIVERSAL_REQUIREMENTS.md — Finite State Machine (FSM)
==================================================
## Cold Start Instruction (Read First)

This workflow is authoritative. Do not reinterpret or restate rules.
Load only the active REQ, its BUILD row, and its active ITER file.
Execute the current FSM state; record deltas only. Ignore archives and history.


This file defines the only valid workflow for implementing requirements.
It governs state transitions, file loading, and enforcement.

If this file conflicts with AGENTS.md, this file wins.

Hard Stop:
=====================
If you propose loading any file outside the current FSM state scope, stop and restate the loading plan before doing work.


Purpose
============================
Ship calculator changes with:
   deterministic flow
   traceable evidence
   minimal context load

GTEP pages (e.g., /sitemap/, /privacy/, /terms/, /contact/, /faqs/) are supported non-calculator pages.
They must remain standalone HTML and must not be wrapped back into the calculator shell.

FSM:
REQ → BUILD ↔ TEST → SEO → COMPLIANCE → COMPLETE
Failure at any step may create an ISSUE.

File Loading Rules (Critical) Always load
=================================
   UNIVERSAL_REQUIREMENTS.md
   UNIVERSAL_REQUIREMENTS.md
   AGENTS.md

   Notes on paths
   --------------
   - Rule files (including this file) live in `requirements/universal-rules/`
   - Tracker/ledger files live in `requirements/compliance/`

When Building a New Calculator (brand new calculator page)
=========================================================
   UNIVERSAL_REQUIREMENTS.md for calculation pane
   UNIVERSAL_REQUIREMENTS.md for explanation pane
   UNIVERSAL_REQUIREMENTS.md for search engine optimization
   UNIVERSAL_REQUIREMENTS.md

When Changing Calculation Pane or Updating a Calculation Pane
==========================================================
   UNIVERSAL_REQUIREMENTS.md for calculation pane
   UNIVERSAL_REQUIREMENTS.md for explanation pane
   UNIVERSAL_REQUIREMENTS.md for search engine optimization
   UNIVERSAL_REQUIREMENTS.md

When Changing Explanation Pane or Updating an Explanation Pane
==========================================================
   UNIVERSAL_REQUIREMENTS.md for calculation pane
   UNIVERSAL_REQUIREMENTS.md for explanation pane
   UNIVERSAL_REQUIREMENTS.md for search engine optimization
   UNIVERSAL_REQUIREMENTS.md

Never load
==========
   Archived sections
   Historical iteration files
   Iteration logs for other REQs
   Old compliance reports
   Context must stay minimal.


Allowed Files by FSM State (Enforced)
=====================================
   REQ:
   - AGENTS.md
   - UNIVERSAL_REQUIREMENTS.md
   - requirement_tracker.md (active rows only)

   BUILD:
   - AGENTS.md
   - UNIVERSAL_REQUIREMENTS.md
   - requirement_tracker.md (single active REQ row)
   - build_tracker.md
   - active ITER file
   - affected implementation files only
   - UNIVERSAL_REQUIREMENTS.md (for Auto-Test Mode selection)
   - testing_tracker.md (Auto-Test Mode: permitted to record executed tests during BUILD)
   - affected test files only (when tests are executed during BUILD)

   TEST:
   - All BUILD files
   - UNIVERSAL_REQUIREMENTS.md
   - testing_tracker.md
   - affected test files only

   SEO:
   - All TEST files
   - UNIVERSAL_REQUIREMENTS.md
   - seo_tracker.md
   - affected SEO artifacts only

   COMPLIANCE:
   - All prior state files
   - compliance-report.md only



State Definitions
=======================
   REQ
   =====
      Requirement exists in requirement_tracker.md
      Status: NEW
      No implementation allowed
      Requirement completeness gate (for calculators with many inputs, mode toggles, or dynamic rows):
         REQ must include a "Calculation Pane Interaction Contract" with:
            - mode control type and labels (switch or segmented button-group)
            - default mode on page load
            - field visibility mapping per mode
            - dynamic-row layout parity requirement (Add Item rows match initial rows)
            - button-only calculation trigger contract
      If missing, REQ is invalid for BUILD start and must be returned for requirement update.
      Transition allowed:
         REQ → BUILD (only via trigger)

   BUILD
   =====
      Triggered by human command
      EVT_START_BUILD REQ-YYYYMMDD-###
      Create new ITER file
      Add BUILD row (Status: RUNNING)
      Run build steps (lint, compile)

      Auto-Test Mode (Enabled)
      ------------------------
      After BUILD PASS, the Implementer MUST immediately run the required tests (per TESTING_RULES) without waiting for an additional human confirmation.
      In Auto-Test Mode, recording test execution in `testing_tracker.md` is permitted during the BUILD state as part of the single continuous BUILD→TEST execution.
      If tests fail, transition returns to BUILD.
      Outcomes:
         PASS → TEST
         FAIL → retry (max 25 iterations)
         BLOCKER → ISSUE

   TEST
   ====
      Select tests strictly via UNIVERSAL_REQUIREMENTS.md
      Run required tests only
      Begin TEST execution immediately after BUILD PASS without waiting for another human confirmation.
      For calculator trigger-behavior changes, execute the relevant button-only trigger regression spec(s).
      Minimum required command when Finance/Percentage calculators are affected:
      `npm run test:e2e -- requirements/specs/e2e/button-only-recalc-finance-percentage.spec.js`
      For dense input + mode-toggle layout changes, ISS-001 layout stability validation is also mandatory:
      `npm run test:iss001`
      Record TEST rows
      Outcomes:
         PASS → SEO (if applicable) or COMPLIANCE
         FAIL → BUILD
         Iterations ≥ 25 → ISSUE (MAX_ITERATIONS)

   SEO
   ====
      Required for all calculator-related REQs and any change affecting a public route.
      Validate per UNIVERSAL_REQUIREMENTS.md
      Any Lighthouse/Chrome/Puppeteer run that uses a profile directory must set output/profile paths outside the repository (for example `/tmp/lighthouse-*`).
      Recommended WSL Lighthouse template (safe defaults):
      `CHROME_PATH="$(node -e "const { chromium } = require('playwright'); console.log(chromium.executablePath())")" && npx lighthouse "http://127.0.0.1:8002/<route>/" --only-categories=performance --chrome-path="$CHROME_PATH" --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage --user-data-dir=/tmp/lighthouse-$$" --output=json --output-path="test-results/seo/<slug>/lighthouse-performance.json"`
      Record PASS, FAIL, WAIVED (per SEO_RULES), or NA
      Outcomes:
         PASS / WAIVED / NA → COMPLIANCE
         FAIL → BUILD or ISSUE

   COMPLIANCE
   =========
      Verify all gates passed
      Update exactly one row in compliance-report.md
      Status must be PASS or FAIL
      PASS conditions:
         BUILD_PASS
         TEST_PASS
         SEO_PASS or SEO_WAIVED or SEO_NA
         No P0/P1 violations
      PASS → COMPLETE
      FAIL → ISSUE

   ISSUE
      Log problem in issue_tracker.md
      Assign type and severity
      Decide: fix now or defer
      Resolved issues must extract patterns into `requirements/compliance/lessons_learned.md`.

   COMPLETE
      Requirement ready to archive
      No further edits allowed without new REQ

   Iteration Rules (Hard)
      One ITER file per EVT_START_BUILD
      ITER file is the only mutable log during work
      Max iterations: 25
      On reaching limit: stop, log ISSUE, exit

   Deterministic IDs
      REQ: REQ-YYYYMMDD-###
      BUILD: BUILD-YYYYMMDD-HHMMSS
      TEST: TEST-YYYYMMDD-HHMMSS
      ITER: ITER-YYYYMMDD-HHMMSS
      ISSUE: ISSUE-YYYYMMDD-###
      IDs are unique and never reused.

   Compliance Formula
      OVERALL_PASS =
      BUILD_PASS
      AND TEST_PASS
      AND (SEO_PASS OR SEO_WAIVED OR SEO_NA)
      AND UNIVERSAL_RULES_PASS
      No shortcuts.

   Enforcement
      Invalid state transitions must stop immediately
      No tracker updates outside the current state (exception: `testing_tracker.md` updates during BUILD are permitted in Auto-Test Mode as defined above)
      Workspace hygiene gate is mandatory before COMPLIANCE PASS:
      - No tool-generated browser profile/cache directories under repo root (including `lighthouse.*` profile folders)
      - `.gitignore` must not contain machine-specific absolute per-file cache/profile paths; use generalized wildcard rules only
      Calculation trigger gate is mandatory before COMPLIANCE PASS (when applicable):
      - For calculators with an explicit Calculate CTA, results and explanation updates must be button-only after page-load baseline (no live input auto-recalc)
      - Evidence must include passing run of relevant trigger-regression tests (minimum: `requirements/specs/e2e/button-only-recalc-finance-percentage.spec.js` when Finance/Percentage routes are in scope)
      Dense toggle/input contract gate is mandatory before COMPLIANCE PASS (when applicable):
      - For calculators with high input density and mode switching, requirement + implementation must agree on mode control type, default state, and field visibility mapping
      - Added dynamic rows (if present) must preserve the same row-density layout as initial rows
      - Evidence must include ISS-001 coverage and route-level E2E evidence for mode-toggle and Add Item behavior
      If violated, return to BUILD and remediate before proceeding.
      No merge or release without COMPLIANCE PASS
      Exceptions require explicit, logged waiver

   Minimal Startup Checklist (Cold Start)
      Read AGENTS.md
      Read UNIVERSAL_REQUIREMENTS.md
      Read requirement_tracker.md (Active only)
      Read build_tracker.md to find ITER
      Load that single ITER file
      Start work
      Nothing else.

   Intent (Plain Language)
      Rules are fixed.
      State is logged.
      Only one thing happens at a time.
