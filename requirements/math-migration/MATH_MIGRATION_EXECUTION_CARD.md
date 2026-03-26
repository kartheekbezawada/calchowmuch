# Math Migration Execution Card

Status:

- Created on `2026-03-26`
- Highest authority for CalcHowMuch math migration execution

## Mission

Execute the CalcHowMuch Math Migration with strict, low-regression, documentation-first discipline.

## Unified Definition Of Done

A route is complete only if all pass.

### Engineering

- single-pane `calc_exp`
- light answer-first layout
- no legacy dark markers: `theme-premium-dark.css`, old nav, split-shell chrome
- MPA `<a href>` preserved
- logic, hooks, IDs, and schema intent unchanged
- verified from generated output, not config

### Design

- `Simple Smooth Wow`
- clear hierarchy: primary -> secondary -> advanced
- no clutter and no duplicate UI
- advanced options collapsed where needed
- first screen usable without scrolling
- CLS-safe with no layout shift

### SEO / Content

- 40-60 word snippet intro
- bullets or table for quick answer
- formula when applicable
- worked example
- FAQs visible in HTML
- internal links to related calculators
- JSON-LD in static HTML: `WebPage`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`
- simple human-readable content, not academic

Important:

- `Release passed` does not mean `Redesign complete`.

## Execution Flow Per Route

1. Inspect generated HTML output.
2. Inspect logic, hooks, IDs, and schema.
3. Inspect layout and CSS for legacy markers.
4. Inspect design quality: clutter, hierarchy, UX.
5. Inspect SEO/content quality.
6. Classify migration type:
   - `Type 1` = shell only
   - `Type 2` = shell plus cleanup
   - `Type 3` = rebuild
7. Apply changes:
   - fix shell
   - fix design
   - fix content only where needed
8. Validate:
   - logic unchanged
   - layout correct
   - content structured
9. Run checks:
   - engineering
   - design
   - SEO
   - CWV
10. Capture evidence.
11. Update tracker.

Do not:

- trust config alone
- rewrite logic without proof of an existing blocking defect
- break IDs or hooks
- expand scope silently
- inject schema via JS
- leave thin content
- keep legacy CSS

## Context Refresh Protocol

- Re-read this execution card before starting work.
- Re-read this execution card after every `2-3` routes.
- Re-read this execution card whenever switching waves.
- Reload this execution card immediately if uncertainty or drift appears.

Priority order:

1. this execution card
2. master plan and tracker
3. repo patterns
4. reasoning

## Wave Rules

- Work in small waves of `3-5` routes.
- Group similar routes.
- Start with low-risk routes.
- Entry: routes audited and approved.
- Exit: all routes pass Definition Of Done.
- Rollback: any regression stops the wave.
- Active execution is one calculator at a time.
- Do not begin the next route until the current route fully passes.
- When the current route fully passes, immediately continue to the next approved route in sequence.
- Do not pause for HUMAN permission between normal route completions.
- Only stop for a real blocker: failed gate, scope-breaking conflict, or evidence that the route is actually `Type 3`.

## Quality Gates

### Engineering Pass

- calculations correct
- hooks and IDs unchanged
- MPA navigation works

### Design Pass

- no clutter
- clear hierarchy
- no layout shift
- first screen usable

### SEO Pass

- snippet-ready intro present
- structured sections exist
- FAQs visible
- internal links present
- schema matches HTML

### CWV Pass

- CLS `<= 0.10`
- no late layout shifts
- no render-blocking issues that damage first-screen usability

## Risk Control

Watch for:

- hidden CSS dependencies
- broken bindings
- layout shifts after load
- missing schema in HTML
- thin content

If found:

- stop
- fix before continuing

## Minimal Templates

### Route Audit

```md
- Route:
- Layout: split | single
- Legacy markers:
- Design issues:
- SEO issues:
- Logic risk:
- Type: 1 | 2 | 3
- Notes:
```

### Wave Checklist

```md
- Routes:
- Approved scope:
- Migration done:
- Engineering pass:
- Design pass:
- SEO pass:
- CWV pass:
- Evidence:
- Status:
```

## Final Rule

If any of Engineering, Design, SEO, or CWV fails, the route is not complete.

Do not proceed unless the current route fully passes.
