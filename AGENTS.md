# Agent Workflow Rules (Compliance FSM)

This repo uses a deterministic, unskippable FSM for requirements -> build -> test -> SEO -> release. Agents must follow these rules and the full state definitions in `requirements/compliance/WORKFLOW.md`.

## Actors

- HUMAN_TRIGGER: Starts transitions by requesting Copilot or Codex actions; runs local commands when instructed.
- COPILOT: Requirement authoring + ID assignment.
- CODEX: Implementation + validation + tracker updates.

## System of Record (State Storage)

State is stored in Markdown trackers only (no hidden state). Required files:
- `requirements/compliance/requirement_tracker.md`
- `requirements/compliance/build_tracker.md`
- `requirements/compliance/testing_tracker.md`
- `requirements/compliance/seo_requirements.md`
- `requirements/compliance/issue_tracker.md`

If a required file is missing, Codex creates it using templates during S2_PREFLIGHT.

## Deterministic IDs

- Requirement ID: REQ-YYYYMMDD-###
- Build ID: BUILD-YYYYMMDD-HHMMSS
- Test Run ID: TEST-YYYYMMDD-HHMMSS
- SEO ID:
  - Real: SEO-... (from seo_requirements.md)
  - Placeholder: SEO-PENDING-REQ-XXXX or SEO-N/A
- Issue ID (only when created during this run): ISSUE-YYYYMMDD-###

## Core Rule: Valid Transition Only

- No tracker updates unless the FSM state permits it.
- No skipping states.
- No partial completion without logging.
- Invalid transition response must be:
  "INVALID TRANSITION: current_state -> requested_state; required_state: X"
  and stop.

## FSM States (Summary)

S0_IDLE -> S1_REQUIREMENT_DRAFTED -> S2_PREFLIGHT -> S3_READY_TO_BUILD -> S4_BUILD_RUNNING -> S5_BUILD_FAILED_RETRYABLE/S7_BUILD_PASSED -> S8_TEST_RUNNING -> S9_TEST_FAILED_RETRYABLE/S10_TEST_PASSED -> S11_TRACKERS_UPDATED -> S12_SEO_CHECK -> S13_RELEASE_READY -> S0_IDLE

See `requirements/compliance/WORKFLOW.md` for full definitions, guards, and actions.

## Transition Table (Guardrail)

Allowed transitions only:
- S0 -> S1
- S1 -> S2
- S2 -> S3
- S3 -> S4
- S4 -> S5 or S7
- S5 -> S4 or S6
- S6 -> S14
- S7 -> S8
- S8 -> S9 or S10
- S9 -> S4 or S14
- S10 -> S11
- S11 -> S12
- S12 -> S13
- S13 -> S0
- S14 -> S2

Any other transition is INVALID.

## Agent Enforcement Rules

- Copilot is allowed to act only in S0_IDLE and S1_REQUIREMENT_DRAFTED.
- Copilot may only write the requirement tracker and SEO placeholder (if needed).
- Codex is allowed to act only in S2 through S14.
- Codex must refuse to implement anything if the REQ has not been registered.

## "Next Time" Command Contract

When you say:
- "Copilot: create requirement ..."
  - Copilot produces REQ-... and moves state to S1.
- "Codex: process REQ-YYYYMMDD-###"
  - Codex verifies REQ exists and is NEW/UNVERIFIED.
  - Codex starts at S2_PREFLIGHT.
  - Codex follows transitions until S13 or S14.
  - Codex updates trackers only when allowed by state.
