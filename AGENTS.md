# AGENTS.md — Agent Operating Contract

> Entry point for all agent behavior. Read this file first.

---

## Table of Contents

0. [Cold Start Instruction](#0-cold-start-instruction)
1. [ADMIN Absolute Override](#1-admin-absolute-override)
2. [Deterministic Workflow (Default Mode)](#2-deterministic-workflow-default-mode)
3. [Actors (Strict Roles)](#3-actors-strict-roles)
4. [How Work Starts](#4-how-work-starts)
5. [File Classification](#5-file-classification)
6. [Calculator Architecture Rules](#6-calculator-architecture-rules)
7. [Test Policy](#7-test-policy)
8. [Compliance Gate](#8-compliance-gate)
9. [Sitemap Rule (P0)](#9-sitemap-rule-p0)
10. [Enforcement Summary](#10-enforcement-summary)

---

## 0. Cold Start Instruction

> **Read this section first. No exceptions.**

- `AGENTS.md`, `UNIVERSAL_REQUIREMENTS.md`, and `Project Bible.md` are **authoritative law**.
- Do not reinterpret rules. Apply rules **verbatim**.
- Update ledgers with **deltas only** (no history, no archives).

**Precedence order:**

1. `UNIVERSAL_REQUIREMENTS.md` (highest — wins on conflict)
2. `AGENTS.md`
3. `Project Bible.md` (governs strategy / design intent)

---

## 1. ADMIN Absolute Override

> **Checked first on every message. Supersedes all other rules.**

### Activation

If a HUMAN message contains the exact keyword **`ADMIN`**, then ADMIN Mode is active for that message.

### Effect (While Active)

When ADMIN Mode is active:

- The FSM **does not apply**
- No Copilot-created REQ is required
- No `EVT_START_BUILD` is required
- Ignore FSM state restrictions
- Ignore role separation (Copilot vs Codex)
- Ignore release sign-off rules
- Ignore build and test sequencing rules
- The agent must **execute the HUMAN instruction immediately**

ADMIN has **absolute precedence** over all other rules in this file and in `UNIVERSAL_REQUIREMENTS.md`.

### Hard Limits (Always Apply)

Even in ADMIN Mode, the agent must not:

- Perform illegal or unsafe actions
- Violate platform safety policies
- Exfiltrate secrets or credentials
- Fabricate results when verification is required

### Deactivation

- ADMIN Mode applies **only** to the message containing `ADMIN`
- If `ADMIN` is not present, normal LAW applies immediately

---

## 2. Deterministic Workflow (Default Mode)

When ADMIN Mode is **not** active, this repository uses a deterministic finite-state machine (FSM) to ship calculator changes with traceability.

### Document Chain

```
Requirement Tracker → UNIVERSAL_REQUIREMENTS.md → Project Bible.md → RELEASE_CHECKLIST.md → RELEASE_SIGNOFF.md → Release Sign-Off Master Table.md
```

| Step | Document | Purpose |
|------|----------|---------|
| 1 | `requirements/compliance/requirement_tracker.md` | Captures what needs to be done (REQ lifecycle) |
| 2 | `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` | Defines how it must be built (rules & constraints) |
| 3 | `requirements/universal-rules/Project Bible.md` | Defines why — strategy, design intent, SERP system |
| 4 | `requirements/universal-rules/RELEASE_CHECKLIST.md` | Pre-release gate — every item must pass before release |
| 5 | `requirements/universal-rules/RELEASE_SIGNOFF.md` | Per-release evidence — filled out for each release candidate |
| 6 | `requirements/universal-rules/Release Sign-Off Master Table.md` | Historical record — one row per release, cumulative sign-off ledger |

### Rules

- All workflow state is stored under `requirements/compliance/`
- Invalid transitions must **stop immediately**
- No exceptions unless ADMIN Mode is explicitly active

---

## 3. Actors (Strict Roles)

### HUMAN

- Triggers builds
- Runs local build and test commands
- Opens pull requests
- Must **not** write release sign-off docs unless explicitly instructed

### COPILOT (Requirements Agent)

- Creates requirements
- Assigns REQ IDs
- Writes or updates calculator rules
- Creates SEO placeholders
- Must **never** build, test, or update release sign-off docs

### CODEX / Claude Code (Implementer Agent)

- Implements code changes
- Runs build and test steps
- Fills out `RELEASE_SIGNOFF.md` evidence
- Prepares pull requests
- Must **not** create new requirements
- Must **not** start work without an explicit trigger

> Codex and Claude Code are equivalent implementers.

---

## 4. How Work Starts

### Step 1 — Create Requirement (Copilot)

**User command:**

```
Copilot: create requirement for <X>
```

**Copilot must:**

1. Add a new REQ row in `requirement_tracker.md` (Status: `NEW`)
2. Add or update calculator rules
3. Add SEO placeholders if applicable
4. **Stop** — must not build or test

### Step 2 — Start Implementation (Human)

**User command:**

```
EVT_START_BUILD REQ-YYYYMMDD-###
```

**Rules:**

- **Without ADMIN:** Codex must refuse to proceed without this trigger
- **With ADMIN:** Codex must proceed immediately and ignore this requirement

---

## 5. File Classification

### LAW (Authoritative — Do Not Reinterpret)

| File | Purpose |
|------|---------|
| `AGENTS.md` | Agent operating contract |
| `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` | Universal rules (highest authority) |
| `requirements/universal-rules/Project Bible.md` | Strategy / design intent |

---

## 6. Calculator Architecture Rules

> **Always enforced** — regardless of FSM state or ADMIN mode.

- All calculators use **MPA** by default
- No SPA routing for calculator navigation
- Navigation must be `<a href>` with **full page reloads**

### GTEP Pages

- Standalone HTML only
- No calculator shell
- No nav panes
- No calculator JavaScript

---

## 7. Test Policy

> **Default Mode only.** `UNIVERSAL_REQUIREMENTS.md` (UR-TEST section) is authoritative.

- Select tests **strictly by change type**
- Prefer **unit tests**
- Scope E2E tests to **affected calculators only**
- Do not run full E2E for single-calculator changes
- Record test evidence in `RELEASE_SIGNOFF.md` (Section 4)

---

## 8. Compliance Gate

A release is complete **only when**:

| Gate | Document | Required Status |
|------|----------|----------------|
| Pre-release checks | `RELEASE_CHECKLIST.md` | All HARD items pass |
| Per-release evidence | `RELEASE_SIGNOFF.md` | Filled out and APPROVED |
| Historical record | `Release Sign-Off Master Table.md` | One row added for this release |

**No merge or release without a completed sign-off.**

---

## 9. Sitemap Rule (P0)

> **Always enforced.** Priority zero — no exceptions.

Any calculator that is:

- Visible in navigation, **or**
- Reachable via a public URL

**must appear in the sitemap.**

Missing sitemap coverage is a **hard failure** for: BUILD, TEST, and COMPLIANCE.

---

## 10. Enforcement Summary

| Principle | Rule |
|-----------|------|
| Default behavior | Strict, deterministic, auditable |
| ADMIN Mode | Explicit, manual, absolute |
| Silence | ≠ permission |
| Keyword `ADMIN` | Immediate human control |

### One-Line Intent

> **Copilot defines work. Human authorizes work. Codex executes work. ADMIN overrides everything.**
