# Wake-Up Time Calculator — Requirements with Rule IDs

Calculator ID: TIME-WAKEUP  
Purpose: Calculate optimal wake-up times based on sleep start time and 90-minute sleep cycles.

> **⚠️ IMPORTANT FOR IMPLEMENTING AGENTS:**  
> This calculator MUST comply with all rules in [UNIVERSAL_REQUIREMENTS.md](../../universal/UNIVERSAL_REQUIREMENTS.md).  
> Pay special attention to: UI-1.x (colors/typography), UI-2.x (components), UI-3.x (layout), UI-4.x (scrollbars), and TEST-x.x (testing standards).

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-20260126-006 | Wake-Up Time Calculator | • WAKEUP-NAV-1<br>• WAKEUP-NAV-2<br>• WAKEUP-NAV-3<br>• WAKEUP-SEO-1<br>• WAKEUP-SEO-2<br>• WAKEUP-SEO-3<br>• WAKEUP-INPUT-1<br>• WAKEUP-INPUT-2<br>• WAKEUP-INPUT-3<br>• WAKEUP-INPUT-4<br>• WAKEUP-CALC-1<br>• WAKEUP-CALC-2<br>• WAKEUP-OUT-1<br>• WAKEUP-OUT-2<br>• WAKEUP-CONTENT-1<br>• WAKEUP-CONTENT-2 | • WAKEUP-TEST-U-1<br>• WAKEUP-TEST-U-2<br>• WAKEUP-TEST-E2E-1<br>• WAKEUP-TEST-E2E-2<br>• WAKEUP-TEST-SEO-1 | 2026-01-26 |

---

## WAKEUP-NAV — Navigation & Routing

**WAKEUP-NAV-1**  
Top Navigation Usage:
- Use existing "Time & Date" top-nav button (already implemented for Sleep Time Calculator)
- Same placement, styling, icon, and active state behavior
- Must activate when any Time & Date calculator is accessed

**WAKEUP-NAV-2**  
Left Navigation Hierarchy:
- Use existing "Time & Date" section (already implemented)
- Add new item under Time & Date: "Wake-Up Time Calculator"
- Must follow expandable/collapsible behavior of other navigation sections
- Must highlight "Wake-Up Time Calculator" when active

**WAKEUP-NAV-3**  
URL Routing:
- URL: `/time-and-date/wake-up-time-calculator`
- Deep linking must activate both:
  - Top nav: "Time & Date" button in active state
  - Left nav: "Time & Date" section expanded with "Wake-Up Time Calculator" highlighted
- Must be accessible via direct URL entry

---

## WAKEUP-SEO — SEO Metadata

**WAKEUP-SEO-1**  
Page Title & Meta Description:
- `<title>`: "Wake-Up Time Calculator – When Should I Wake Up?"
- `<meta name="description">`: "Calculate the best wake-up time based on when you go to sleep and full sleep cycles. Simple, fast, and free wake-up time calculator."
- Must follow site's title format and meta description length guidelines

**WAKEUP-SEO-2**  
Page Heading Structure:
- `<h1>`: "Wake-Up Time Calculator"
- Must be the only H1 on the page
- Must appear in the calculator pane header area

**WAKEUP-SEO-3**  
Structured Data:
- Add FAQPage structured data for the FAQ section in explanation pane
- Must include all FAQ questions and answers specified in WAKEUP-CONTENT-2
- Must validate against schema.org standards

---

## WAKEUP-INPUT — Input Controls

**WAKEUP-INPUT-1**  
Mode Toggle (no dropdowns):
- Button group with two options:
  - "I plan to fall asleep at..." (default selected)
  - "I plan to go to bed at..." (secondary option)
- Must use button group pattern (no dropdown selects)
- Active state must be clearly visible
- Default: "fall asleep" mode selected

**WAKEUP-INPUT-2**  
Date/Time Input:
- Use datetime input/picker (no free-text entry)
- Must prevent invalid date/time entry
- Must support browser's native datetime picker when available
- Fallback for browsers without native support

**WAKEUP-INPUT-3**  
Optional Fall-Asleep Latency Control:
- Only shown when mode = "I plan to go to bed at..."
- Hidden when mode = "I plan to fall asleep at..."
- Default latency = 15 minutes
- Allow user to adjust latency value
- Must be clearly labeled and optional

**WAKEUP-INPUT-4**  
Input Defaults:
- Default date/time: current local date/time rounded to next 15-minute increment
- Default mode: "I plan to fall asleep at..." selected
- Must use browser's local timezone automatically

---

## WAKEUP-CALC — Calculation Logic

**WAKEUP-CALC-1**  
Fixed Calculation Assumptions:
- Sleep cycle length: exactly 90 minutes
- Fall-asleep latency: exactly 15 minutes (when mode is "go to bed")
- Cycles to show: 4, 5, and 6 cycles only
- No personalization or user-specific adjustments

**WAKEUP-CALC-2**  
Computation Rules:
- Fall-asleep mode: `wake_time = sleep_time + (cycles × 90 min)`
- Go-to-bed mode: `estimated_sleep_time = bed_time + latency_minutes`, then `wake_time = estimated_sleep_time + (cycles × 90 min)`
- Handle timezone calculations using browser local time
- Round results to nearest minute

---

## WAKEUP-OUT — Output Display

**WAKEUP-OUT-1**  
Compact Results Display:
- Show exactly 3 recommendations: 4 cycles, 5 cycles, 6 cycles
- Format: human-readable sentences
- Example: "Wake up at 6:45 AM after 5 cycles (7.5 hours)."
- Include cycle count and total sleep duration in parentheses

**WAKEUP-OUT-2**  
Primary Recommendation Highlighting:
- Highlight 5 cycles (7.5 hours) as primary recommendation
- Use visual emphasis (bold, color, or styling) to distinguish primary option
- Other options (4 and 6 cycles) shown but not highlighted

---

## WAKEUP-CONTENT — Explanation Pane Content

**WAKEUP-CONTENT-1**  
Required Explanation Content (EXACT TEXT):
- The following content must be used exactly as written
- Only container elements/classes may be added for styling
- Simple placeholders like {MODE}/{TIME} allowed if supported
- NO rewording permitted

### H2: What is a Wake-Up Time Calculator?

A Wake-Up Time Calculator suggests the best times to wake up based on when you fall asleep. It aims to line up your wake-up time with the end of a sleep cycle, which can help reduce grogginess.

### H2: How This Wake-Up Time Calculator Works

Sleep typically happens in repeating cycles that average about 90 minutes. This calculator uses 90-minute cycles to estimate wake-up times after 4, 5, or 6 full cycles.

• If you enter a fall-asleep time, it adds full cycles to suggest wake-up times.
• If you enter a bedtime, it adds about 15 minutes first to estimate when you fall asleep, then adds full cycles.

### H2: Best Wake-Up Times (Examples)

If you fall asleep at 11:30 PM, your wake-up options are roughly 5:30 AM (4 cycles), 7:00 AM (5 cycles), or 8:30 AM (6 cycles).

If you go to bed at 11:30 PM, the calculator first assumes you fall asleep around 11:45 PM, then shows wake-up options from there.

### H2: Assumptions and Limitations

This calculator uses averages:

• Sleep cycle length is assumed to be 90 minutes (real cycles can vary).
• Time to fall asleep is assumed to be 15 minutes when you enter a bedtime.

Results are general estimates and are not medical advice. If you have persistent sleep problems, consider speaking with a healthcare professional.

**WAKEUP-CONTENT-2**  
FAQ Section (EXACT TEXT):

### H2: Frequently Asked Questions

**How many sleep cycles should I aim for?**
Many adults feel best with 5–6 cycles (about 7.5–9 hours), but needs vary.

**What is a sleep cycle?**
A sleep cycle is a repeating pattern of light sleep, deep sleep, and REM sleep that often lasts about 90 minutes.

**Why does the calculator show multiple wake-up times?**
It shows options for 4, 5, and 6 cycles so you can pick what fits your schedule.

**Why might I still feel tired even if I wake up after full cycles?**
Cycle length varies, and factors like stress, caffeine, irregular schedules, or sleep disorders can affect sleep quality.

**Does the calculator account for naps or sleep debt?**
No. It provides simple estimates based on typical cycles and does not model naps or long-term sleep patterns.

---

## WAKEUP-UI — UI & Layout Rules

**WAKEUP-UI-1**  
Universal Layout Compliance:
- Must follow universal 3-pane layout (navigation, calculation, explanation)
- Calculation pane: inputs + compact results only
- Explanation pane: text content only for v1 (no graphs/tables)
- Must maintain fixed-height panes with internal scrolling

**WAKEUP-UI-2**  
No Layout Shifts:
- No page height changes on user interaction
- No dynamic content loading that causes layout shifts
- Results must appear in pre-allocated space
- Latency control must show/hide without affecting other elements

---

## WAKEUP-EXCLUDE — Explicit Non-Goals

**WAKEUP-EXCLUDE-1**  
Features NOT included:
- No personalization (age/health/sleep debt adjustments)
- No nap calculators or multiple sleep schedules
- No region-specific adjustments beyond browser local time
- No medical or professional recommendations beyond general disclaimer
- No user accounts, saved history, or personalization
- No dependency on external APIs or time services

---

## WAKEUP-TEST — Testing Requirements

### Unit Tests

**WAKEUP-TEST-U-1**  
Calculation Logic Verification:
- Test fall-asleep mode: given 11:30 PM sleep time, verify 4/5/6 cycle wake-up calculations
- Test go-to-bed mode: given 11:30 PM bed time with 15-min latency, verify wake-up times
- Test custom latency: verify calculations with different latency values
- Test edge cases: midnight crossovers, invalid times

**WAKEUP-TEST-U-2**  
Input Validation and UI Testing:
- Test datetime input validation and formatting
- Test mode toggle functionality and latency control show/hide
- Test default value generation (current time + 15 min rounding)
- Test timezone handling with browser local time

### End-to-End Tests

**WAKEUP-TEST-E2E-1**  
User Journey Testing:
- Navigate to `/time-and-date/wake-up-time-calculator`
- Verify navigation states (top nav active, left nav expanded)
- Test both modes with latency control behavior
- Verify results display correctly with proper formatting
- Verify primary recommendation highlighting

**WAKEUP-TEST-E2E-2**  
Layout and Content Verification:
- Verify fixed-height panes with no layout shifts
- Verify latency control shows/hides without layout impact
- Verify all explanation content displays correctly
- Verify FAQ section renders properly
- Test responsive behavior at different viewport sizes

### SEO Tests

**WAKEUP-TEST-SEO-1**  
SEO Metadata Verification:
- Verify page title, meta description match specifications
- Verify H1 and heading structure is correct
- Verify FAQ structured data is present and valid
- Verify page is accessible via direct URL and sitemap

---

## WAKEUP-IMPL — Implementation Notes

**WAKEUP-IMPL-1**  
File Structure:
- Create `/public/calculators/time-and-date/wake-up-time-calculator/`
- Files: `index.html`, `module.js`, `calculator.css` (if needed)
- Update existing entry in navigation.json (add to Time & Date section)
- Update sitemap.xml

**WAKEUP-IMPL-2**  
Change Classification:
- Change Type: New Calculator + SEO
- SEO Impact: YES (new page, new URL, structured data)
- Navigation Impact: YES (new left nav item under existing Time & Date section)

---

## Priority & Dependencies

**Priority**: HIGH  
**Dependencies**: Time & Date navigation section (already exists from Sleep Time Calculator)  
**Estimated Complexity**: Low-Medium (reuses existing navigation structure, simpler than Sleep Time Calculator)