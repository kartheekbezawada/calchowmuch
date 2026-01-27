Title: Overtime Hours Calculator (Time & Date)
Change Type: New Calculator + SEO

1. Page Metadata & Navigation
Top Navigation

Uses existing Time & Date top-nav button (same placement/styling/icon rules).

Left Navigation

Hierarchy:

Time & Date

Overtime Hours Calculator

Routing

URL: /time-and-date/overtime-hours-calculator

Deep linking must:

Activate Time & Date in top nav

Highlight Overtime Hours Calculator in left nav

SEO Metadata

Title: Overtime Hours Calculator – Regular Hours vs Overtime (Daily & Weekly)

Meta Description: Calculate total work hours and split them into regular and overtime hours. Supports single shifts, split shifts, custom weekly cycles, night shifts, and night overtime.

H1: Overtime Hours Calculator

2. Scope & General Characteristics

Single dedicated calculator page

Low-maintenance logic (time arithmetic + threshold splitting)

Fast-loading, static-friendly

No accounts, saved history, or personalization

Hours-only calculator (no pay, wage, or legal compliance claims)

Supports:

Single Shift

Split Shift (2 segments)

Weekly Shift (custom week cycle)

Night shifts (ends next day)

Night overtime classification (hours-only)

3. Calculation Pane (Interactive)
Purpose

User enters shift times and breaks, then selects overtime rules to calculate:

Total worked hours

Regular hours

Overtime hours

Optional: night hours and night overtime hours

Mode (segmented buttons; no dropdown)

Label: Mode

Single Shift

Split Shift (2 segments)

Weekly Shift (Mon–Sun)

Default: Single Shift

Note: While the label shows “Weekly Shift (Mon–Sun)”, the weekly cycle must be user-configurable (see Weekly Shift section).

Common Inputs (All Modes)
Unpaid Break Handling

Break minutes (button group): 0 / 15 / 30 / 45 / 60

Default:

Single Shift: 30

Split Shift: 30 (applied once for the day)

Weekly Shift: per-day default 0 (see Weekly Shift)

Overtime Rule (segmented buttons)

Label: Overtime rule

Daily (over X hours per day)

Weekly (over X hours per week)

Daily + Weekly (both)

Default: Weekly

Thresholds

Daily regular limit (hours) (number input)

Default: 8

Allowed: 0–24 (integer or .5 allowed)

Weekly regular limit (hours) (number input)

Default: 40

Allowed: 0–168 (integer or .5 allowed)

Rounding (segmented buttons)

Label: Rounding

None

Nearest 5 minutes

Nearest 10 minutes

Nearest 15 minutes

Default: None

Rounding applies to each segment/day before break and overtime splitting.

Night Overtime (optional classification)

Checkbox: Track night hours and night overtime

Default: off

If enabled, show:

Night window start (time input) default 22:00

Night window end (time input) default 06:00

Checkbox: Night window crosses midnight default on

Must automatically enable if end < start

Night window is used to classify worked minutes into:

night minutes (within window)

non-night minutes (outside window)

Mode A — Single Shift

Inputs:

Start time (required, time-only)

End time (required, time-only)

Checkbox: Ends next day (default off)

Break:

Uses common Break minutes (applies once)

Mode B — Split Shift (2 segments)

Segment 1:

Start time (required)

End time (required)

Ends next day (default off)

Segment 2:

Start time (optional; if empty, segment ignored)

End time (optional; if empty, segment ignored)

Ends next day (default off)

Break:

Uses common Break minutes (applies once after summing both segments)

Mode C — Weekly Shift (Custom Week Cycle + Dates)
Weekly Cycle Configuration (Required)

Users must be able to define their “week” cycle (not everyone uses Mon–Sun).

Controls (no dropdowns):

Segmented button group: Week starts on

Mon / Tue / Wed / Thu / Fri / Sat / Sun

Default: Mon

Date input: Week start date

Default: today (local browser date)

Used only to label each day’s row with an actual date

Read-only inline label (computed):

This week covers: {WEEK_START_DAY} {WEEK_START_DATE} → {WEEK_END_DAY} {WEEK_END_DATE} (7-day cycle)

Weekly Day Rows (7 rows, generated deterministically)

Render exactly 7 day rows corresponding to the chosen week start day and week start date.

For each day row:

Day label: {DAY_NAME} + {DAY_DATE} (computed from week start date)

Start time (optional, time-only)

End time (optional, time-only)

Ends next day checkbox (default off)

Break minutes per day (button group): 0 / 15 / 30 / 45 / 60 (default 0)

Rules:

If both start and end are empty, that day is ignored.

If one of start/end is entered, the other becomes required for that day.

Validation (All Modes)

Required fields must be present for computation in that mode

If end time < start time:

Allowed only when “Ends next day” is checked

Break minutes must not exceed worked minutes for the day/segment

Threshold fields must be valid numbers within limits

Night window inputs required only when night tracking enabled

Inline errors only; do not compute when invalid

4. Outputs (Compact, Calculation Pane)

Show as short text lines only (no tables/charts in calculation pane):

Total worked: {TOTAL_HHMM}

Regular hours: {REGULAR_HHMM}

Overtime hours: {OT_HHMM}

Decimal total: {TOTAL_DECIMAL} hours

Rule used: {OT_RULE_LABEL}

If night tracking enabled:

Night hours: {NIGHT_HHMM}

Night overtime hours: {NIGHT_OT_HHMM}

5. Core Logic (Fixed Rules)
5.1 Time Conversion

Convert each start/end time to minutes since 00:00

If “Ends next day” is checked: end_minutes += 1440 (deterministic)

Segment minutes = end_minutes − start_minutes

5.2 Rounding

Apply rounding per segment/day before breaks and overtime splitting:

None: no change

Nearest 5/10/15: round start and end to nearest interval (minutes), then recompute minutes

Validation must ensure rounded duration is not negative

5.3 Break Deduction

Single/Split: subtract break minutes once per day total

Weekly: subtract break minutes per day

Enforce non-negative after subtraction (validation should prevent invalid)

5.4 Overtime Splitting (Hours Only)
Daily rule

For each day:

regular_day_minutes = min(worked_day_minutes, daily_limit_minutes)

overtime_day_minutes = max(0, worked_day_minutes − daily_limit_minutes)

Totals:

regular = sum(regular_day_minutes)

overtime = sum(overtime_day_minutes)

Weekly rule

Across total week minutes:

regular_minutes = min(total_week_minutes, weekly_limit_minutes)

overtime_minutes = max(0, total_week_minutes − weekly_limit_minutes)

Daily + Weekly rule (both, no double counting)

Deterministic method:

Compute daily overtime total (Daily rule)

Compute weekly overtime total (Weekly rule)

Final overtime minutes = max(daily_overtime_total, weekly_overtime_total)

Regular minutes = total_week_minutes − final_overtime_minutes

5.5 Night Hours + Night Overtime (Classification Only)

If enabled:

Compute overlap of worked segments with the night window (supports crossing midnight)

night_minutes = sum(overlap_minutes)

Night overtime minutes:

If total_work_minutes > 0:

night_ot_minutes = round( overtime_minutes * (night_minutes / total_work_minutes) )

Clamp: 0 ≤ night_ot_minutes ≤ min(night_minutes, overtime_minutes)

6. Explanation Pane (Blog-Style, SEO-Heavy, Two Tables)

Implementation rule: The following content must be used exactly as written. Codex may only:

Wrap content in required layout containers

Insert placeholders like {MODE}, {TOTAL_HHMM}, {REGULAR_HHMM}, {OT_HHMM}, {TOTAL_DECIMAL}, {OT_RULE_LABEL}, {DAILY_LIMIT}, {WEEKLY_LIMIT}, {ROUNDING}, {BREAK_MINUTES}, {NIGHT_HHMM}, {NIGHT_OT_HHMM}, {WEEK_RANGE_LABEL}

No rewording

Two tables are required in this pane:

A Dynamic Summary Table that pulls values from Calculation Pane state

A Static Policy Table (common overtime policies)

All tables must comply with UTBL-* rules (semantic thead/tbody/tfoot, full borders/grid, wrapped in scroll container, no wrapping).

H2: Quick Summary (Updates As You Change Inputs)

This table updates automatically based on what you enter in the calculator. It shows your current mode, total hours, regular hours, overtime hours, and optional night overtime classification.

Table: Current Calculation Summary (Dynamic)
Field	Value
Mode	{MODE}
Week range (weekly mode only)	{WEEK_RANGE_LABEL}
Total worked (HH:MM)	{TOTAL_HHMM}
Regular hours (HH:MM)	{REGULAR_HHMM}
Overtime hours (HH:MM)	{OT_HHMM}
Decimal total	{TOTAL_DECIMAL} hours
Overtime rule	{OT_RULE_LABEL}
Daily regular limit	{DAILY_LIMIT} hours
Weekly regular limit	{WEEKLY_LIMIT} hours
Rounding	{ROUNDING}
Break deducted	{BREAK_MINUTES} minutes
Night hours (if enabled)	{NIGHT_HHMM}
Night overtime (if enabled)	{NIGHT_OT_HHMM}

Dynamic table rules

The table structure must be in explanation.html (not injected).

Only cell text values update when inputs change.

If a value is not applicable, display — (for example night fields when disabled).

H2: What is an Overtime Hours Calculator?

An Overtime Hours Calculator helps you measure how many hours you worked and split them into regular hours and overtime hours. Your results show Total worked {TOTAL_HHMM}, Regular hours {REGULAR_HHMM}, and Overtime hours {OT_HHMM} based on the overtime rule you selected.

H2: How to Use This Calculator

Choose a mode: Single Shift, Split Shift, or Weekly Shift.

Enter your start and end times. If your shift ends after midnight, enable “Ends next day.”

Enter unpaid break minutes if needed.

Choose an overtime rule: Daily, Weekly, or Daily + Weekly.

Set your regular limits (daily and/or weekly).

(Optional) Enable night hours tracking to classify night hours and night overtime.

Review the summary table and the compact results.

H2: Weekly Mode for Different Work Cycles

Not everyone uses a Monday-to-Sunday week. Weekly mode lets you pick a week start day such as Sunday-to-Saturday or Friday-to-Thursday. Choose your week start day and a week start date to label each day with the correct date, then enter the shifts for that 7-day cycle.

H2: Overtime Rules Explained (Daily vs Weekly)

Different workplaces use different overtime policies. Some count overtime after a certain number of hours in a day. Others count overtime after a certain number of hours in a week.

Table: Common Overtime Policies (Hours-Only)
Policy	What counts as overtime	Best for	Notes
Daily overtime	Time above your daily regular limit	Long single days	Useful when you work very long shifts
Weekly overtime	Time above your weekly regular limit	Variable schedules	Common for weekly timesheets
Daily + Weekly	Overtime if you exceed either rule	Mixed schedules	Helps avoid missing overtime in unusual weeks
H2: Night Shifts and Night Overtime

Night shifts often cross midnight, which is why the calculator includes an “Ends next day” option. Night overtime is a classification of overtime that occurs during a night-time window (for example, 22:00 to 06:00). This calculator shows night overtime as hours only and does not calculate pay rates.

H2: Breaks, Rounding, and Why Results Differ

Breaks and rounding policies can change totals even when shift times look the same. If your employer rounds time to the nearest 5, 10, or 15 minutes, choose the rounding option that matches your policy.

H2: Assumptions and Limitations

This calculator:

Calculates hours only, not pay, wages, or overtime rates

Does not provide legal compliance guidance

Subtracts unpaid breaks that you enter

Uses your selected overtime rule and thresholds to split hours

May not match an employer’s exact rounding rules unless you select the same rounding option

H2: Frequently Asked Questions

What is the difference between regular hours and overtime hours?
Regular hours are counted up to your limit. Overtime hours are the remaining hours above that limit.

Which overtime rule should I choose?
Use the rule that matches your timesheet policy. If you only have a weekly limit, choose Weekly. If you track overtime per day, choose Daily. If both are relevant, choose Daily + Weekly.

How does “Daily + Weekly” avoid double counting overtime?
The calculator computes daily overtime and weekly overtime, then uses the larger overtime result as the final overtime amount so overtime is counted once.

Can I calculate overtime for split shifts?
Yes. Split shifts add segments together for the day, subtract the break once, and then apply the overtime rule.

What does “Ends next day” do?
It treats the end time as the next day so night shifts are counted correctly.

What is night overtime in this calculator?
Night overtime is a classification of overtime that occurs during your night window. It does not calculate pay rates.

Does this calculator round time the way my employer does?
It can. Choose the rounding option that matches your policy. If your employer uses a different rounding method, results may differ.

Can I set a custom week like Sunday–Saturday or Friday–Thursday?
Yes. Choose the week start day in weekly mode. The calculator treats the next 6 days as the rest of your week.

Does the calculator save my hours?
No. It runs in your browser and does not store your inputs.

Structured Data

Add FAQPage structured data for the FAQ section. Also add WebPage or Calculator structured data for the page.

7. SEO & Content Implementation Requirements

Explanation pane is long-form HTML and must be crawlable (no injected blog text).

Add a table-of-contents list near the top linking to:

#quick-summary

#how-to-use

#weekly-mode

#overtime-rules

#night-overtime

#faq

Both explanation tables must be wrapped in dedicated scroll containers and comply with UTBL-* rules.

No currency symbols anywhere on the page.

8. UI & Layout Rules

Must follow universal calculator layout

Calculation pane: inputs + compact results only

Explanation pane: long content allowed, including tables

Internal scrolling only

No layout shifts on interaction

9. Non-Goals (Explicit Exclusions)

No wage/pay calculation, overtime multipliers, or currency outputs

No jurisdiction-specific legal compliance rules

No exporting, saving, accounts, or history in v1

No graphs/charts in v1

10. Testing Requirements (Per Matrix)

Change Type: New Calculator → required tests:

Unit ✅

E2E ✅

SEO Auto ✅

ISS-001 ❌ (unless shared layout/CSS is modified)

Minimum Unit Test Cases

Same-day shift: 09:00–17:00, break 30 → 7:30 total

Night shift rollover: 22:00–06:00 ends next day → 8:00 total

Weekly overtime: total 44:00 vs weekly limit 40:00 → 4:00 OT

Daily overtime: 10:30 vs daily limit 8:00 → 2:30 OT

Daily+Weekly: ensure final OT = max(dailyOT, weeklyOT) and regular = total − OT

Weekly cycle: week starts Sun with a start date; verify generated 7 day labels increment dates correctly

Night classification: night window overlap > 0 and proportional night OT clamped correctly

Acceptance Criteria

MUST HAVE:

 URL routing: /time-and-date/overtime-hours-calculator

 Deep linking activates correct navigation states (top nav + left nav highlight)

 Mode control labeled “Mode” with segmented buttons; default Single Shift

 Weekly mode supports custom week start day (Mon–Sun) and week start date

 Weekly mode renders exactly 7 day rows with computed day+date labels

 Break deduction works and cannot exceed worked time

 Overtime rule selection works: Daily / Weekly / Daily+Weekly

 Threshold inputs work with defaults (8 daily, 40 weekly)

 Night shifts supported via “Ends next day”

 Night tracking option with night window inputs

 Outputs show total, regular, overtime, decimal total; plus night metrics when enabled

 Explanation pane includes:

 Blog-style long content

 TOC anchors

 Static policy table

 Dynamic summary table that pulls values from calculation pane

 FAQPage structured data present

 SEO metadata as specified

 No layout shifts during interaction

SHOULD HAVE:

 Keyboard navigation support

 Accessible labels and focus states

 Clear inline validation messages for all invalid states

 MPA Architecture Features:

✅ Standalone HTML document requirement
✅ Full page reload navigation mandate
✅ No SPA routing/hash URLs prohibited
✅ Complete page shell with own ads/metadata
✅ <a href> navigation links required

WON’T HAVE (v1):

Pay/rate calculations and any currency outputs

Country-specific legal compliance rules

Exporting, saving, or accounts

Charts/graphs