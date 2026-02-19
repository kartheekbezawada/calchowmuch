# Port Governance Decision (2026-02-19)

## Context
Recurring local and CI failures were observed from hard-coded local server ports (`8000`, `8001`) across:
- local static hosting
- Playwright web server startup
- Lighthouse route audits
- scoped CWV validation
- parallel jobs/workers

Failures were often intermittent because port ownership was not tracked as policy, and conflicts depended on run ordering.

## Problem Statement
The project had no canonical, machine-enforced port policy. Multiple scripts assumed fixed ports and started servers independently, causing:
- `EADDRINUSE` and failed runs
- flaky CI/retries
- unclear ownership of currently in-use ports
- wasted operator time identifying PID/process collisions

## Decision
Adopt port governance as policy-as-code with automatic allocation and release.

### Canonical Policy
- Canonical source: `config/ports.json`
- Human-readable status remains script-derived; no manual runtime updates required.

### Fixed + Dynamic Split
- Fixed port:
  - `8000` reserved for admin/manual live-server use
- Dynamic ranges for automation (total managed ports <= 200):
  - Playwright: `3100-3169`
  - Lighthouse: `3170-3229`
  - Scoped CWV: `3230-3299`

### Status Model (Simple)
Only three statuses are used:
1. `reserved`
2. `in-use`
3. `available`

### Runtime Behavior
- Server-starting scripts must allocate from policy-managed ports.
- Lease lifecycle is automatic:
  - acquire before server start
  - release after run completion/failure
- If a requested fixed/preferred port is busy, automation falls back to the approved dynamic range.

## Alternatives Considered
1. Keep markdown/manual catalog only.
- Rejected: not enforceable and drifts quickly.

2. Hard-code one port per tool.
- Rejected: fails under parallel CI/local overlap.

3. Live-scan only with no lease state.
- Rejected: no ownership trail, weak race handling.

## Consequences
### Positive
- Fewer port collision failures
- Deterministic, auditable allocation behavior
- Better CI parallel safety
- Lower cognitive load for local testing

### Negative / Trade-offs
- Added utility complexity (`scripts/ports.mjs`)
- Lease-state file lifecycle must be maintained (`tmp/ports-state.json`)

## Rollback Plan
If required:
1. Revert allocator integrations in runner scripts.
2. Restore prior fixed-port behavior.
3. Keep decision record for traceability.

## Operational Examples
- List current policy + effective status:
  - `npm run ports:list`
- Get next free Playwright port:
  - `npm run ports:next-free -- --group=playwright`
- Acquire/release explicitly:
  - `npm run ports:acquire -- --group=lighthouse`
  - `npm run ports:release -- --lease-id=<lease-id>`
