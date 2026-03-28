# Universal Rules — Folder Guide

This folder contains project-wide governance and companion documents. Only a small set of files should be treated as active working documents.

## Active Files

| File | Status | Purpose | Load when |
|---|---|---|---|
| `UNIVERSAL_REQUIREMENTS.md` | Authoritative | Single source of project law | Always |
| `CALCULATOR_BUILD_GUIDE.md` | Active companion | Practical calculator build, UX, content, graph, and table guidance | When building or revising calculator pages |
| `RELEASE_CHECKLIST.md` | Active companion | Release pass/fail gate | Before release readiness |
| `RELEASE_SIGNOFF.md` | Active companion | Release evidence template | When recording sign-off evidence |

## Support Folders

| Folder | Status | Purpose | Load when |
|---|---|---|---|
| `reference/` | Active support | Secondary policy and support docs referenced by active rules or checklists | Only when cited |
| `decisions/` | Historical support | Decision records for prior implementation choices | When prior decisions matter |
| `incidents/` | Historical support | Incident writeups and failure context | When investigating regressions |
| `release-signoffs/` | Evidence | Completed release records | When reviewing prior releases |
| `salary-calculators-cluster-redesign/` | Program-specific | Active planning and rollout docs for that program | Only when working that program |
| `archive/legacy-notes/` | Archive | Legacy notes kept for history only | Only on explicit request |

## Special Cases

| File | Role |
|---|---|
| `About Us.md` | Legacy content file retained outside governance. It is not used by the MPA generator as a build source. |
| `NON_MATH_SEO_WAVE_PLAN.md` | Working tracker for a specific SEO rollout wave. It is not project law. |
| `cluster_migration_plane.md` | Planning baseline for the cluster-isolation migration. Use only for migration work. |
| `Archive Rules/` | Older archived material retained in place. Do not treat it as active governance. |

## Recommended Loading Order

1. `README.md`
2. `UNIVERSAL_REQUIREMENTS.md`
3. `CALCULATOR_BUILD_GUIDE.md` if calculator build guidance is needed
4. `RELEASE_CHECKLIST.md` when release gating is in scope
5. `RELEASE_SIGNOFF.md` when evidence must be recorded
6. `reference/`, `decisions/`, `incidents/`, or program folders only if the task requires them

## Rule Of Thumb

If a document is not one of the four active files above, do not treat it as project law unless `UNIVERSAL_REQUIREMENTS.md` or the HUMAN explicitly tells you to.
