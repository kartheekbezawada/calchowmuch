AGENTS.md — Agent Operating Contract (Entry Point)

========================================================

0. Cold Start Instruction (Read First)

AGENTS.md and WORKFLOW.md are authoritative law.

Do not reinterpret rules.

Apply rules verbatim.

Update ledgers with deltas only (no history, no archives).

If this file conflicts with WORKFLOW.md, WORKFLOW.md takes precedence.

1. ADMIN ABSOLUTE OVERRIDE (CHECKED FIRST)
Activation

If a HUMAN message contains the exact keyword:

ADMIN

then ADMIN Mode is active for that message.

Effect (While ADMIN Is Active)

When ADMIN Mode is active:

The FSM DOES NOT APPLY

No Copilot-created REQ is required

No EVT_START_BUILD is required

Ignore FSM state restrictions

Ignore role separation (Copilot vs Codex)

Ignore tracker update rules

Ignore build and test sequencing rules

The agent must execute the HUMAN instruction immediately.

ADMIN has absolute precedence over all other rules in this file and in WORKFLOW.md.

Hard Limits (Always Apply)

Even in ADMIN Mode, the agent must not:

Perform illegal or unsafe actions

Violate platform safety policies

Exfiltrate secrets or credentials

Fabricate results when verification is required

Deactivation

ADMIN Mode applies only to the message containing ADMIN

If ADMIN is not present, normal LAW applies immediately

2. Deterministic Workflow (Default Mode)

When ADMIN Mode is NOT active, this repository uses a deterministic finite-state machine (FSM) to ship calculator changes with traceability.

FSM Flow

REQ → BUILD → TEST → SEO → COMPLIANCE

All workflow state is stored under requirements/compliance/

Invalid FSM transitions must stop immediately

No tracker updates outside the allowed FSM state

No exceptions unless ADMIN Mode is explicitly active

3. Actors (Strict Roles — Default Mode)
HUMAN

Triggers builds

Runs local build and test commands

Opens pull requests

Must not write trackers unless explicitly instructed

COPILOT (Requirements Agent)

Creates requirements

Assigns REQ IDs

Writes or updates calculator rules

Creates SEO placeholders

Must never build, test, or update trackers

CODEX / Claude Code (Implementer Agent)

Implements code changes

Runs build and test steps

Updates trackers and compliance records

Prepares pull requests

Must not create new requirements

Must not start work without an explicit trigger

Codex and Claude Code are equivalent implementers.

4. How Work Starts (Default Mode)
Step 1 — Create Requirement (Copilot)

User command:

Copilot: create requirement for <X>

Copilot must:

Add a new REQ row in requirement_tracker.md (Status: NEW)

Add or update calculator rules

Add SEO placeholders if applicable

Must not build or test

Stop

Step 2 — Start Implementation (Human)

User command:

EVT_START_BUILD REQ-YYYYMMDD-###

Rules:

Without ADMIN: Codex must refuse to proceed without this trigger

With ADMIN: Codex must proceed immediately and ignore this requirement

5. File Classification
LAW (Authoritative — Do Not Reinterpret)

AGENTS.md

requirements/compliance/WORKFLOW.md

requirements/universal/UNIVERSAL_REQUIREMENTS.md

REFERENCE (Load Only When Relevant)

requirements/compliance/testing_requirements.md

requirements/compliance/seo_requirements.md

Calculator rules under requirements/rules/

LEDGER (State Tables — Update Only When Allowed)

requirement_tracker.md

build_tracker.md

testing_tracker.md

seo_tracker.md

issue_tracker.md

iteration_tracker.md

compliance-report.md

idea_tracker.md

6. Calculator Architecture Rules (Always Enforced)

All calculators use MPA by default

No SPA routing for calculator navigation

Navigation must be <a href> with full page reloads

GTEP Pages

Standalone HTML only

No calculator shell

No nav panes

No calculator JavaScript

7. Test Policy (Default Mode)

testing_requirements.md is authoritative

Select tests strictly by change type

Prefer unit tests

Scope E2E tests to affected calculators only

Do not run full E2E for single-calculator changes

Record required vs executed tests in compliance-report.md

8. Compliance Gate (Default Mode)

A requirement is complete only when all are closed:

requirement_tracker.md

build_tracker.md

testing_tracker.md

seo_tracker.md (PASS or NA)

compliance-report.md (exactly one row per REQ)

No merge or release without COMPLIANCE PASS.

9. Sitemap Rule (P0 — Always Enforced)

Any calculator that is:

Visible in navigation, or

Reachable via a public URL

Must appear in the sitemap.

Missing sitemap coverage is a hard failure for:

BUILD

TEST

COMPLIANCE

10. Enforcement Summary

Default behavior is strict, deterministic, auditable

ADMIN Mode is explicit, manual, and absolute

Silence ≠ permission

Keyword ADMIN = immediate human control

One-Line Intent

Copilot defines work.
Human authorizes work.
Codex executes work.
ADMIN overrides everything.