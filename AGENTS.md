AGENTS.md — Agent Operating Contract (Entry Point)
========================================================
## Cold Start Instruction (Read First)

Read AGENTS.md and WORKFLOW.md as authoritative law. Do not reinterpret rules.
Load only the active REQ from requirement_tracker.md and its active ITER file.
Apply rules verbatim; update ledgers with deltas only. No history, no archives.



This repository uses a deterministic finite-state workflow to ship calculator changes with traceability.

Flow:
REQ → BUILD → TEST → SEO → COMPLIANCE

All state is stored in requirements/compliance/.
If this file conflicts with WORKFLOW.md, WORKFLOW.md takes precedence.


======================================================================
Actors (Strict Roles)
  HUMAN
    Triggers builds
    Runs local build/test commands
    Opens pull requests
    Must not write trackers unless explicitly instructed.

COPILOT (Requirements Agent)
  Creates requirements
  Assigns REQ IDs
  Writes or updates calculator rules
  Creates SEO placeholders
  Must not build, test, or update build/test/issue/compliance trackers.

CODEX  or  Claude Code ==> (Implementer Agent)
  Implements code changes
  Runs build and test steps
  Updates trackers and compliance records
  Prepares pull requests
  Must not create new requirements or start work without an explicit trigger.
  Codex and Claude Code are equivalent implementers and must follow the same rules.
===========================================================


File Classification (Critical)
===============================
  LAW (Authoritative Rules)
  Define behavior. Do not reinterpret.
    UNIVERSAL_REQUIREMENTS.md
    WORKFLOW.md
    AGENTS.md

REFERENCE (Conditional Manuals)
===============================
  Load only when relevant to the change.
  testing_requirements.md (when selecting tests)
  seo_requirements.md (when pages, URLs, or metadata change)
  Calculator rules under requirements/rules/

LEDGER (State Tables)
===========================
Do not analyze. Only update rows.
  requirement_tracker.md
  build_tracker.md
  testing_tracker.md
  seo_tracker.md
  issue_tracker.md
  iteration_tracker.md
  compliance-report.md
  idea_tracker.md

How Work Starts
======================
Step 1 — Create Requirement (Copilot)

User command:
Copilot: create requirement for <X>

Copilot must:
  Add a new REQ row in requirement_tracker.md (Status: NEW)
  Add or update calculator rules
  Add an SEO placeholder if applicable
  Co Pilot Must never ever build 
  Stop

Step 2 — Start Implementation (Human)
  User command:
  EVT_START_BUILD REQ-YYYYMMDD-###
  Codex must refuse to proceed without this trigger.

Deterministic IDs
=======================
  Requirement: REQ-YYYYMMDD-###
  Build: BUILD-YYYYMMDD-HHMMSS
  Test: TEST-YYYYMMDD-HHMMSS
  Iteration: ITER-YYYYMMDD-HHMMSS
  Issue: ISSUE-YYYYMMDD-###

Rules:
  IDs must be unique
  No duplicate rows for the same ID
  RUNNING rows must be closed in place

Test Policy
=============================
The test selection matrix in testing_requirements.md is authoritative.
  Principles:
    Select tests strictly by Change Type
    Prefer unit tests when possible
    Scope E2E tests to affected calculators only
    Do not run full E2E for single-calculator changes
    Record required vs executed tests in compliance-report.md

Compliance Gate
===============================
A requirement is complete only when all of the following are closed:
  requirement_tracker.md
  build_tracker.md
  testing_tracker.md
  seo_tracker.md (PASS or NA)
  compliance-report.md (exactly one row per REQ)
  No merge or release without COMPLIANCE PASS.

Sitemap Rule (P0)
========================
Any calculator that is:
  visible in navigation, or
  reachable via a public URL
must appear in the sitemap.
Missing sitemap coverage is a hard failure for BUILD, TEST, and COMPLIANCE.

Enforcement
=======================
Invalid FSM transitions must stop immediately
No tracker updates outside the allowed state
No exceptions without an explicit waiver recorded

Related Documents
========================
  Universal Requirements: requirements/universal/UNIVERSAL_REQUIREMENTS.md
  Workflow FSM: requirements/compliance/WORKFLOW.md
  Testing Rules: requirements/compliance/testing_requirements.md
  SEO Rules: requirements/compliance/seo_requirements.md
  Calculator Hierarchy: requirements/universal/calculator-hierarchy.md

One-line intent
========================
Copilot defines work.
Human authorizes work.
Codex executes work.

Everything else is a record.