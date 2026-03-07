# How to Build a Calculator

## 1. Goal
Build a production-ready calculator that helps users calculate a clear output from clear inputs, with results and explanations users can trust.

## 2. Scope
In scope:
- New calculator page route at `/calculators/[slug]/`
- Input form, result section, and formula explanation section
- Validation, error states, reset behavior
- SEO metadata, FAQ section, and structured data support
- Sitemap entry for the new public route
- Long-form "How to Guide" content block

Out of scope:
- User account features
- Saved result history
- Third-party integrations unless explicitly required

## 3. Functional Requirements
- Users can enter all required inputs with units.
- Users can enter optional inputs where applicable.
- System validates required fields, type, and range.
- System calculates outputs only when input is valid.
- Output includes:
- Primary result with unit
- Secondary results if relevant
- Plain-English formula explanation
- User can recalculate after changing inputs.
- User can reset to defaults.
- Validation errors are shown near relevant fields.

## 4. Calculation Rules
- Define exact formulas used by the calculator.
- Define each variable name and unit.
- Define rounding method and visible precision.
- Define handling for edge cases:
- Zero input values
- Negative values
- Empty optional values
- Define assumptions clearly.

## 5. UX and Architecture Rules
- Use MPA architecture.
- No SPA navigation behavior.
- Use hard navigation with `<a href>`.
- Calculator page must be responsive on mobile and desktop.
- Use accessible labels and keyboard-friendly inputs.
- Keep result visibility clear after submit.

### 5.1 Global UI/UX Baseline (Apply to Every Calculator)
- Design standard: simple, attractive, smooth, and trustworthy.
- No overwhelm:
- Show essential inputs first.
- Keep optional/advanced controls collapsed by default.
- No underwhelm:
- Show one clear primary result and useful secondary insights.
- Use plain-English labels and helper text.

### 5.2 Required Layout Blueprint
- Section order for calculator pages:
- Hero intent line
- Calculator interaction block (inputs + results)
- Optional deeper insight block (table/chart/details)
- FAQ block
- How to Guide block
- Important Notes block
- Calculator interaction block should prioritize:
- Inputs that can be completed quickly
- Results visible without confusion

### 5.3 Input and Interaction Rules
- Required inputs must be immediately visible.
- Advanced disclosure label pattern must be compact:
- `Advanced Options` and `Optional` must appear in one row (single-line summary) with a single caret state icon.
- Numeric inputs must use appropriate input modes.
- Real-time inline validation required for invalid values.
- Provide `Calculate` and `Reset` actions.
- Avoid interaction lag, jitter, and layout shift during input.
- Input and slider updates must remain smooth on desktop and mobile.

### 5.4 Result Presentation Rules
- Must include:
- Primary result card (most important output)
- Secondary result cards (supporting outputs)
- Assumption/context line near results
- Values must use consistent units and formatting.
- Result copy must explain what the number means, not just show numbers.
- Default render rule (mandatory):
- On first page load, results must be pre-populated using approved default input values.
- Graph, table, and answer cards must show meaningful default calculations (not empty placeholders).
- Users should see a complete working example immediately before any interaction.

### 5.5 Visual and Motion Rules
- Use strong visual hierarchy:
- H1 intent
- Input labels
- Primary result value
- Supporting text
- Use clean spacing and readable contrast.
- Use subtle transitions only (focus, result update, collapsible areas).
- Avoid flashy effects, clutter, or decorative overload.

### 5.6 Mobile and Accessibility Rules
- Mobile-first readable at `360px+`.
- Tap targets must be comfortable.
- Keyboard-only completion flow must work end-to-end.
- Labels and errors must be screen-reader friendly.
- Color cannot be the only status indicator.

### 5.7 UI/UX Acceptance Checklist (Universal)
- User can complete core calculation in under 30 seconds.
- User can understand the primary result in one glance.
- Layout remains clear on both desktop and mobile.
- No visual clutter around inputs/results.
- Interaction feels smooth without stutter.

### 5.8 How to Build Graphs (Mandatory)
- Goal:
- Graph must help a decision quickly, not decorate the page.
- Data integrity first:
- Month `0` (or start point) must represent the true opening value.
- No synthetic spikes caused by wrong initialization.
- Series policy:
- Default maximum 2 primary lines (for example baseline vs with-extra).
- Additional data should be shown in tooltip/table, not by adding many lines.
- Axis policy:
- Y-axis: 4-6 ticks maximum.
- X-axis: sparse key ticks (start, key intervals, end).
- Labels must never overlap, clip, or overflow.
- Chart sizing policy:
- Desktop chart height should usually be `240px-320px`.
- Mobile chart height should usually be `180px-260px`.
- Do not shrink below readability thresholds.
- Legend and context policy:
- Keep legend compact and near top-right/top area.
- Avoid large boxed KPI cards above chart unless explicitly required.
- Tooltip policy:
- Keep tooltip copy minimal: period + key series values.
- Tooltip must clamp to container bounds (no off-screen clipping).
- Accessibility policy:
- Keep semantic labels (`role`, `aria-label`) for chart.
- Keep live region available for screen readers if needed, even if visually hidden.
- Visual policy:
- Subtle gridlines, clear line contrast, consistent stroke styles.
- Avoid heavy containers, excessive shadows, or cluttered chrome around chart.

### 5.9 Table and Toggle Standard (Mandatory)
- Table heading and view toggle:
- On desktop/tablet, title and toggle must share the same row to save vertical space.
- On mobile, they may wrap cleanly (title first, toggle next line).
- Toggle design:
- Use a segmented control with clear active/inactive states.
- Place toggle on the right side in desktop layouts.
- Keep keyboard focus-visible styling.
- Data policy:
- Do not silently truncate total data unless requirement explicitly asks for truncation.
- If data is long, keep full data and provide internal scrolling.
- Viewport policy:
- Table container height must be fixed (stable viewport).
- Header must remain sticky while body scrolls.
- Support horizontal scrolling for narrow screens.
- Stability policy:
- Table area height must not jump when switching yearly/monthly.
- Scroll behavior must remain smooth on desktop and mobile.

### 5.10 Graph/Table Anti-Patterns (Do Not Repeat)
- Oversized KPI cards that push graph below the fold without adding decision value.
- Cropped or overlapping axis labels.
- Chart start-point errors that create fake vertical spikes.
- Dynamic table heights that expand/shrink with data and cause layout shift.
- Toggle styles that look disconnected from page design or hide active state.

## 6. Non-Functional Requirements
- Performance must pass CWV checks.
- Reliability must be deterministic for same input values.
- Accessibility must follow semantic and contrast standards.
- Content must use simple English and practical examples.

### 6.1 Mandatory "How to Guide" Requirement
- Include one long-form "How to Guide" section on the calculator page.
- Word count must be between 800 and 1200 words.
- Heading order must be exactly:
- Intent
- Complete Practical Guide
- Important Notes
- Heading simplification rule:
- If the page already uses an intent-led `H2` such as `"[Calculator Name] Complete Practical Guide"`, do not add a redundant `H3` titled `How to Guide`.
- In this pattern, start directly with `H4` blocks (`Intent`, `Complete Practical Guide`) under the `H2`.

Intent section must include:
- What this calculator is for
- Who should use it
- When to use it and when not to use it
- What the output means in practical terms

Complete Practical Guide section must include:
- Step-by-step usage instructions
- Input field explanations with units
- Formula explanation in plain English
- At least one worked example with real numbers
- How input changes affect outputs
- Common mistakes and how to avoid them
- How to interpret the result for real decisions

Important Notes section must include:
- Assumptions
- Limitations
- Rounding and precision notes
- Appropriate disclaimer for topic type
- Statement that results are estimates, not professional advice

Writing standards:
- Simple English, short paragraphs, clear flow
- Define terms before use
- Avoid filler and marketing language
- Keep the guide practical and action-oriented

## 7. SEO and Sitemap Requirements
- Unique page title and meta description
- FAQ content aligned to user intent
- Structured FAQ data where applicable
- Public route must be included in sitemap

## 8. Test and Release Gate Requirements
- Run and pass `npm run lint`.
- Run and pass `npm run test`.
- Run and pass `npm run test:e2e` for affected scope.
- Run and pass `npm run test:cwv:all`.
- Run and pass `npm run test:iss001`.
- Run and pass SEO, SERP, and FAQ checks in `RELEASE_CHECKLIST.md`.

## 9. Release Evidence Requirements
- Create release sign-off file from template:
- `requirements/universal-rules/release-signoffs/RELEASE_SIGNOFF_{ID}.md`
- Record evidence for every required gate.
- Confirm sitemap inclusion as a hard release requirement.

## 10. Acceptance Criteria
- All functional requirements implemented and validated.
- Formula outputs match approved test vectors.
- Mandatory 800-1200 word guide is present and follows required heading order.
- Universal UI/UX baseline and checklist in section 5 are satisfied.
- All release gates pass with evidence.
- Work is ready for human review and merge.
