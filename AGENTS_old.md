# AGENTS.md — Agent Operating Contract

> Entry point for all agent behavior. Read this file first.

---

## Table of Contents

0. [Cold Start Instruction](#0-cold-start-instruction)
1. [ADMIN Absolute Override](#1-admin-absolute-override)
2. [Factory Pipeline (Build → Test → Release)](#2-factory-pipeline-build--test--release)
3. [Actors](#3-actors)
4. [Document Chain](#4-document-chain)
5. [Calculator Architecture Rules](#5-calculator-architecture-rules)
6. [Test Policy](#6-test-policy)
7. [Release Gate](#7-release-gate)
8. [Sitemap Rule (P0)](#8-sitemap-rule-p0)
9. [Enforcement Summary](#9-enforcement-summary)

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

## 2. Factory Pipeline (Build → Release Checklist → Sign-off → Release)

> Like a factory line: requirement comes in → build it → checklist it → sign-off → ship it.

```
REQUIREMENT → BUILD → RELEASE CHECKLIST → RELEASE SIGN-OFF → READY
```

### Step 1 — Requirement In

Human provides the requirement (what to build). The agent reads:

- `UNIVERSAL_REQUIREMENTS.md` — how to build it
- `Project Bible.md` — why (design intent, SERP strategy)
- Calculator-specific rules if applicable

### Step 2 — Build

Agent implements the change:

- Code the calculator / fix / feature
- Follow all architecture rules (MPA, no SPA, `<a href>` navigation)
- Ensure sitemap coverage for any new public route

### Step 3 — Release Checklist (All Gates)

Agent runs **all applicable tests** immediately after build. No waiting for human confirmation.

| Test Category | What It Covers | Command |
|---------------|----------------|---------|
| Lint | Code quality | `npm run lint` |
| Unit tests | Calculator logic | `npm run test` |
| E2E tests | Route + UI flow | `npm run test:e2e` (scoped to affected routes) |
| CWV guard | CLS ≤ 0.10, LCP ≤ 2.5s, INP ≤ 200ms | `npm run test:cwv:all` |
| SERP readiness | Metadata, schema, indexability, internal links, intent coverage | `RELEASE_CHECKLIST.md` Section I |
| SEO P1–P5 | Title/meta (P1), schema (P2), Lighthouse (P3), accessibility (P4), infra (P5) | Per UR-SEO rules |
| ISS-001 | Shell/layout stability | `npm run test:iss001` (when layout touched) |
| FAQ schema guard | FAQ schema matches visible content | Per UR-TEST-004 |

**If any test fails → fix and re-test. Do not proceed until all pass.**

### Step 4 — Release Sign-off

Agent logs the release evidence:

- Create `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md` from the template in `RELEASE_SIGNOFF.md`
- Fill it out with all test results, CWV data, SERP verification
- Add one row to `Release Sign-Off Master Table.md` linking to the sign-off file

### Step 5 — Ready to Release

Agent informs the human:

> **"All tests pass. Release sign-off complete. Ready to merge."**

The human reviews and merges the code. The agent does **not** merge.

---

## 3. Actors

### HUMAN

- Provides requirements
- Reviews and merges code
- Has final release authority

### AGENT (Copilot / Codex / Claude Code)

- Builds the requirement
- Runs all tests (SERP, performance, P1–P5, unit, E2E, CWV)
- Fills out release sign-off evidence
- Informs human when ready to merge
- Must **not** merge code

---

## 4. Document Chain

```
Requirement → UNIVERSAL_REQUIREMENTS.md → Project Bible.md → RELEASE_CHECKLIST.md → RELEASE_SIGNOFF.md (template) → release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md → Release Sign-Off Master Table.md
```

| Step | Document | Purpose |
|------|----------|---------|
| 1 | `requirements/universal-rules/UNIVERSAL_REQUIREMENTS.md` | How it must be built (rules & constraints) |
| 2 | `requirements/universal-rules/Project Bible.md` | Why — strategy, design intent, SERP system |
| 3 | `requirements/universal-rules/RELEASE_CHECKLIST.md` | Pre-release gate — every item must pass |
| 4a | `requirements/universal-rules/RELEASE_SIGNOFF.md` | Template — copy for each release |
| 4b | `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md` | Per-release evidence — one file per release |
| 5 | `requirements/universal-rules/Release Sign-Off Master Table.md` | Historical record — one row per release |

### LAW (Authoritative — Do Not Reinterpret)

| File | Purpose |
|------|---------|
| `AGENTS.md` | Agent operating contract |
| `UNIVERSAL_REQUIREMENTS.md` | Universal rules (highest authority) |
| `Project Bible.md` | Strategy / design intent |

---

## 5. Calculator Architecture Rules

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

## 6. Test Policy

> `UNIVERSAL_REQUIREMENTS.md` (UR-TEST section) is authoritative.

The agent runs **all applicable tests** as part of the factory pipeline. No cherry-picking.

- **Unit tests** — every calculator must have logic coverage
- **E2E tests** — scoped to affected routes (not full suite for single-calculator changes)
- **CWV guard** — all calculator routes, normal + stress mode
- **SERP readiness** — metadata, schema, indexability, internal links (per `RELEASE_CHECKLIST.md` Section I)
- **SEO P1–P5** — per the UR-SEO matrix in `UNIVERSAL_REQUIREMENTS.md`
- **ISS-001** — when layout/shell is impacted
- **FAQ schema guard** — when calculator has FAQ content

All test evidence goes into `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md` (created from `RELEASE_SIGNOFF.md` template).

---

## 7. Release Gate

A release is ready **only when**:

| Gate | Document | Required Status |
|------|----------|----------------|
| All tests pass | `RELEASE_CHECKLIST.md` | Every HARD item passes |
| Evidence recorded | `release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md` | Created from template, filled with all test results |
| History logged | `Release Sign-Off Master Table.md` | One row added for this release |
| Human informed | — | Agent says "Ready to merge" |

**Human merges. Agent does not merge.**

---

## 8. Sitemap Rule (P0)

> **Always enforced.** Priority zero — no exceptions.

Any calculator that is:

- Visible in navigation, **or**
- Reachable via a public URL

**must appear in the sitemap.**

Missing sitemap coverage is a **hard failure** for: BUILD, TEST, and COMPLIANCE.

---

## 9. Enforcement Summary

| Principle | Rule |
|-----------|------|
| Default behavior | Build → Test → Log → Ready to merge |
| ADMIN Mode | Explicit, manual, absolute |
| Silence | ≠ permission |
| Keyword `ADMIN` | Immediate human control |

### One-Line Intent

> **Requirement comes in. Agent builds, tests, and logs. Human merges. ADMIN overrides everything.**
