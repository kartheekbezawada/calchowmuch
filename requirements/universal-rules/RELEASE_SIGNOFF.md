# Release Sign-Off Template (Compact)

> [!IMPORTANT]
> Copy this template to `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_{RELEASE_ID}.md`.

## 1) Release Identity

| Field | Value |
| :--- | :--- |
| Release ID | |
| Release Type | |
| Scope (Global/Cluster/Calc/Route) | |
| Cluster ID | |
| Calculator ID (CALC) | |
| Primary Route | |
| Owner | |
| Date | |
| Commit SHA | |
| Environment | |

---

## 2) Gates Executed

| Gate | Command | Result (Pass/Fail/Skipped) | Evidence Path |
| :--- | :--- | :--- | :--- |
| Lint | `npm run lint` | | |
| Unit | `npm run test` or scoped equivalent | | |
| E2E | `npm run test:e2e` or scoped equivalent | | |
| SEO | scoped SEO command | | |
| CWV | `npm run test:cwv:all` or scoped equivalent | | |
| ISS-001 | `npm run test:iss001` (if applicable) | | |
| Schema Dedupe | `npm run test:schema:dedupe` (if applicable) | | |

---

## 3) Required Evidence

| Evidence | Path / Notes |
| :--- | :--- |
| Release checklist reference | |
| Scoped route proof (target route + scope lock) | |
| SEO/schema evidence | |
| CWV artifact (`scoped-cwv` or global) | |
| Thin-content artifact (if `calc_exp` / `exp_only`) | |
| Important Notes contract proof (if applicable) | |
| Pane layout proof (for `calc_exp`) | |

Notes:
- Attach only evidence relevant to this release scope.
- `Release Sign-Off Master Table.md` update is optional historical logging, not a release blocker.

---

## 4) Exceptions / Known Risks

| ID | Description | Severity | Mitigation / Follow-up |
| :--- | :--- | :--- | :--- |
| | | | |

---

## 5) Final Decision

Decision: [ ] APPROVED  [ ] REJECTED

| Role | Name | Date |
| :--- | :--- | :--- |
| Owner | | |
