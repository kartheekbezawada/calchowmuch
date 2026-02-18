# AGENTS.md — Agent Operating Contract

> **Entry Point:** Read this first. Apply rules verbatim. Do not reinterpret.

## 0. Cold Start & Precedence
- **Law:** `AGENTS.md`, `UNIVERSAL_REQUIREMENTS.md`, and `Project Bible.md` are authoritative.
- **Precedence:**
    1. `UNIVERSAL_REQUIREMENTS.md` (Highest — wins on conflict)
    2. `AGENTS.md` (Operating rules)
    3. `Project Bible.md` (Strategy/Design)
- **Constraint:** Update ledgers with **deltas only** (no history rewrites).

---

## 1. ADMIN Absolute Override
> **Keyword:** `ADMIN` | **Effect:** Immediate Execution | **Scope:** Single Message

- **Activation:** Message contains keyword `ADMIN`.
- **Effect:**
    - Ignore FSM, sequencing, gates, and sign-offs.
    - Execute instruction **immediately**.
- **Hard Limits:** No unsafe actions, no secret exfiltration, no fabrication.
- **Deactivation:** Applies only to the current message. Next message reverts to Law.

---

## 2. Factory Pipeline (Build → Checklist → Sign-off → Release)
> **Visual Reference:** See `WORKFLOW_DIAGRAMS.md` for full flow.

**Pipeline:** `REQUIREMENT -> BUILD -> RELEASE CHECKLIST -> RELEASE SIGN-OFF -> READY`

### Step 1: Requirement In
- Read: `UNIVERSAL_REQUIREMENTS.md` (How), `Project Bible.md` (Why), Calc Rules.

### Step 2: Build
- Implement change.
- Enforce MPA architecture (No SPA, `<a href>` hard nav).
- Ensure sitemap coverage.

### Step 3: Release Checklist (All Gates)
- **Trigger:** Run immediately after build. No human wait.
- **Gates:**
    - `lint` (Code quality)
    - `unit` (Logic - `npm run test`)
    - `e2e` (Flow - `npm run test:e2e` scoped)
    - `cwv:all` (Perf - `npm run test:cwv:all`)
    - `iss-001` (Layout - `npm run test:iss001`)
    - `SEO/SERP/FAQ` (Per `RELEASE_CHECKLIST.md`)
- **Rule:** Any fail = Fix & Re-test.

### Step 4: Release Sign-off
- **Create:** `release-signoffs/RELEASE_SIGNOFF_{ID}.md` from template.
- **Fill:** Test results, CWV data, Verification evidence.
- **Log:** Update `Release Sign-Off Master Table.md`.

### Step 5: Ready
- **Action:** Inform human "Ready to merge".
- **Constraint:** Agent does **NOT** merge.

---

## 3. Actors
- **HUMAN:** Provides requirements, Reviews code, Merges code (Final Authority).
- **AGENT:** Builds, Runs Checklist, Creates Sign-off, Confirms Ready. **Never merges.**

---

## 4. Document Chain
`Req -> UNIVERSAL_REQUIREMENTS -> Project Bible -> RELEASE_CHECKLIST -> RELEASE_SIGNOFF -> Master Table`

- **UNIVERSAL_REQUIREMENTS.md:** The "How" (Rules).
- **Project Bible.md:** The "Why" (Strategy).
- **RELEASE_CHECKLIST.md:** Pre-release Gate.
- **RELEASE_SIGNOFF.md:** Template for evidence.

---

## 5. Calculator Architecture Rules
- **MPA Default:** All calculators use Multi-Page Architecture.
- **No SPA:** Calculator nav must be full page reloads.
- **GTEP Pages:** Standalone HTML, No Calculator Shell/Scripts/Panes.

---

## 6. Test Policy
> Authority: `UNIVERSAL_REQUIREMENTS.md` (UR-TEST)

- **Execution:** Run **all applicable tests**. No cherry-picking.
- **Scope:** Unit (All), E2E (Affected), CWV (All Calcs), SEO (P1-P5), ISS-001 (Layout).
- **Evidence:** Must be recorded in `release-signoffs/RELEASE_SIGNOFF_{ID}.md`.

---

## 7. Release Gate
**Release Condition:**
1.  **Checklist:** Every HARD item passes.
2.  **Evidence:** Sign-off file created & filled.
3.  **Log:** Master table updated.
4.  **Ready:** Agent confirms.

---

## 8. Sitemap Rule (P0)
- **Rule:** Visible nav OR public URL = **Must be in sitemap**.
- **Failure:** Missing sitemap = Hard Fail for Build/Test/Compliance.

---

## 9. Enforcement Summary
- **Default:** Pipeline (Build->Checklist->Sign-off->Ready).
- **ADMIN:** Explicit override.
- **Silence:** ≠ Permission.

---

## 10. Scope Control Checklist (Mandatory)

Before any implementation:
- **Declare scope:** list target calculator(s), routes, and files.
- **Confirm scope:** get explicit HUMAN confirmation.

If tests fail outside declared scope:
- **Stop and ask:** modify test or expand scope.
- **Do not** change other calculators without approval.

For UX changes:
- **Approval required** before adding/changing inputs or controls.

If file list changes mid-work:
- **Re-confirm** scope with HUMAN before editing additional files.

### 10.1 Scope Contract (Agent/Copilot Execution Format)

Any Agent/Copilot creating scope must declare this contract before edits:

1. Allowed files (explicit paths)
2. Forbidden files (explicit paths/prefixes; include shared/core defaults)
3. Allowed commands
4. Forbidden commands
5. Stop rule: if a fix needs forbidden files/commands, stop and ask HUMAN
6. Out-of-scope violation rule: stop, revert own out-of-scope edits, report why

Mandatory behavior:
- Do not start edits until HUMAN replies with explicit scope approval.
- Do not widen scope silently.
- If tests fail outside approved scope, stop and ask whether to expand scope or isolate the failing test.
