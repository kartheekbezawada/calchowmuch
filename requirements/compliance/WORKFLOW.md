WORKFLOW.md — Finite State Machine (FSM)
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

FSM:
REQ → BUILD ↔ TEST → SEO → COMPLIANCE → COMPLETE
Failure at any step may create an ISSUE.

File Loading Rules (Critical)
=================================
Always load
   UNIVERSAL_REQUIREMENTS.md
   WORKFLOW.md
   AGENTS.md

Load only when required
   testing_requirements.md → when selecting tests
   seo_requirements.md → when pages, URLs, or metadata change
   Calculator rule files → for the active calculator only
   issue_tracker.md → when creating or resolving an issue

Never load
   Archived sections
   Historical iteration files
   Iteration logs for other REQs
   Old compliance reports
   Context must stay minimal.


Allowed Files by FSM State (Enforced)
=====================================
   REQ:
   - AGENTS.md
   - WORKFLOW.md
   - requirement_tracker.md (active rows only)

   BUILD:
   - AGENTS.md
   - WORKFLOW.md
   - requirement_tracker.md (single active REQ row)
   - build_tracker.md
   - active ITER file
   - affected implementation files only

   TEST:
   - All BUILD files
   - testing_requirements.md
   - testing_tracker.md
   - affected test files only

   SEO:
   - All TEST files
   - seo_requirements.md
   - seo_tracker.md
   - affected SEO artifacts only

   COMPLIANCE:
   - All prior state files
   - compliance-report.md only



State Definitions
=======================
REQ
   Requirement exists in requirement_tracker.md
   Status: NEW
   No implementation allowed
   Transition allowed:
      REQ → BUILD (only via trigger)

BUILD
   Triggered by human command
   EVT_START_BUILD REQ-YYYYMMDD-###
   Create new ITER file
   Add BUILD row (Status: RUNNING)
   Run build steps (lint, compile)
   Outcomes:
      PASS → TEST
      FAIL → retry (max 25 iterations)
      BLOCKER → ISSUE

TEST
   Select tests strictly via testing_requirements.md
   Run required tests only
   Record TEST rows
   Outcomes:
      PASS → SEO (if applicable) or COMPLIANCE
      FAIL → BUILD
      Iterations ≥ 25 → ISSUE (MAX_ITERATIONS)

SEO
   Required only if SEO impact is YES
   Validate per seo_requirements.md
   Record PASS or NA
   Outcomes:
      PASS / NA → COMPLIANCE
      FAIL → BUILD or ISSUE

COMPLIANCE
   Verify all gates passed
   Update exactly one row in compliance-report.md
   Status must be PASS or FAIL
   PASS conditions:
      BUILD_PASS
      TEST_PASS
      SEO_PASS or SEO_NA
      No P0/P1 violations
   PASS → COMPLETE
   FAIL → ISSUE

ISSUE
   Log problem in issue_tracker.md
   Assign type and severity
   Decide: fix now or defer
   Resolved issues must extract patterns into lessons_learned.md.

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
   AND (SEO_PASS OR SEO_NA)
   AND UNIVERSAL_RULES_PASS
   No shortcuts.

Enforcement
   Invalid state transitions must stop immediately
   No tracker updates outside the current state
   No merge or release without COMPLIANCE PASS
   Exceptions require explicit, logged waiver

Minimal Startup Checklist (Cold Start)
   Read AGENTS.md
   Read WORKFLOW.md
   Read requirement_tracker.md (Active only)
   Read build_tracker.md to find ITER
   Load that single ITER file
   Start work
   Nothing else.

Intent (Plain Language)
   Rules are fixed.
   State is logged.
   Only one thing happens at a time.