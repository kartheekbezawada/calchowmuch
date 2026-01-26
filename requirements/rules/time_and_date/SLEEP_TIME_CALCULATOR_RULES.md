# Sleep Time Calculator — Requirements with Rule IDs

Calculator ID: TIME-SLEEP  
Purpose: Calculate optimal sleep and wake times based on 90-minute sleep cycles.

> **⚠️ IMPORTANT FOR IMPLEMENTING AGENTS:**  
> This calculator MUST comply with all rules in [UNIVERSAL_REQUIREMENTS.md](../../universal/UNIVERSAL_REQUIREMENTS.md).  
> Pay special attention to: UI-1.x (colors/typography), UI-2.x (components), UI-3.x (layout), UI-4.x (scrollbars), and TEST-x.x (testing standards).

---

## Requirement ID Mapping

| Requirement ID | Calculator | Associated Rule IDs | Associated Test IDs | Date Created |
|----------------|------------|---------------------|---------------------|---------------|
| REQ-20260126-005 | Sleep Time Calculator | • SLEEP-NAV-1<br>• SLEEP-NAV-2<br>• SLEEP-NAV-3<br>• SLEEP-SEO-1<br>• SLEEP-SEO-2<br>• SLEEP-SEO-3<br>• SLEEP-INPUT-1<br>• SLEEP-INPUT-2<br>• SLEEP-INPUT-3<br>• SLEEP-CALC-1<br>• SLEEP-CALC-2<br>• SLEEP-OUT-1<br>• SLEEP-OUT-2<br>• SLEEP-CONTENT-1<br>• SLEEP-CONTENT-2 | • SLEEP-TEST-U-1<br>• SLEEP-TEST-U-2<br>• SLEEP-TEST-E2E-1<br>• SLEEP-TEST-E2E-2<br>• SLEEP-TEST-SEO-1 | 2026-01-26 |

---

## SLEEP-NAV — Navigation & Routing

**SLEEP-NAV-1**  
Top Navigation Addition:
- Add new top-nav button: "Time & Date"
- Placement: immediately to the right of "Auto Loans" button
- Styling: must match existing top-nav buttons exactly (size, shape, typography, colors, active state)
- Icon: add small date/time logo inside button before text "Time & Date"
- Must activate when any Time & Date calculator is accessed

**SLEEP-NAV-2**  
Left Navigation Hierarchy:
- Add new section: "Time & Date" 
- Under Time & Date: "Sleep Time Calculator"
- Must follow expandable/collapsible behavior of other navigation sections
- Must highlight "Sleep Time Calculator" when active

**SLEEP-NAV-3**  
URL Routing:
- URL: `/time-and-date/sleep-time-calculator`
- Deep linking must activate both:
  - Top nav: "Time & Date" button in active state
  - Left nav: "Time & Date" section expanded with "Sleep Time Calculator" highlighted
- Must be accessible via direct URL entry

---

## SLEEP-SEO — SEO Metadata

**SLEEP-SEO-1**  
Page Title & Meta Description:
- `<title>`: "Sleep Time Calculator – Best Time to Sleep and Wake Up"
- `<meta name="description">`: "Calculate the best time to sleep or wake up based on natural sleep cycles. Simple, fast, and free sleep time calculator."
- Must follow site's title format and meta description length guidelines

**SLEEP-SEO-2**  
Page Heading Structure:
- `<h1>`: "Sleep Time Calculator"
- Must be the only H1 on the page
- Must appear in the calculator pane header area

**SLEEP-SEO-3**  
Structured Data:
- Add FAQPage structured data for the FAQ section in explanation pane
- Must include all FAQ questions and answers specified in SLEEP-CONTENT-2
- Must validate against schema.org standards

---

## SLEEP-INPUT — Input Controls

**SLEEP-INPUT-1**  
Mode Toggle (no dropdowns):
- Button group with two options:
  - "I want to wake up at..." (default selected)
  - "I want to fall asleep at..."
- Must use button group pattern (no dropdown selects)
- Active state must be clearly visible
- Default: "wake up" mode selected

**SLEEP-INPUT-2**  
Date/Time Input:
- Use datetime input/picker (no free-text entry)
- Must prevent invalid date/time entry
- Must support browser's native datetime picker when available
- Fallback for browsers without native support

**SLEEP-INPUT-3**  
Input Defaults:
- Default date/time: current local date/time rounded to next 15-minute increment
- Default mode: "I want to wake up at..." selected
- Must use browser's local timezone automatically

---

## SLEEP-CALC — Calculation Logic

**SLEEP-CALC-1**  
Fixed Calculation Assumptions:
- Sleep cycle length: exactly 90 minutes
- Fall-asleep latency: exactly 15 minutes  
- Cycles to show: 4, 5, and 6 cycles only
- No personalization or user-specific adjustments

**SLEEP-CALC-2**  
Computation Rules:
- Wake-up mode: `bedtime = wake_time - (cycles × 90 min) - 15 min`
- Fall-asleep mode: `wake_time = sleep_time + (cycles × 90 min) + 15 min`
- Handle timezone calculations using browser local time
- Round results to nearest minute

---

## SLEEP-OUT — Output Display

**SLEEP-OUT-1**  
Compact Results Display:
- Show exactly 3 recommendations: 4 cycles, 5 cycles, 6 cycles
- Format: human-readable sentences
- Example wake-up mode: "Fall asleep by 10:45 PM to wake at 6:00 AM (5 cycles)."
- Example fall-asleep mode: "Wake up at 8:15 AM after falling asleep at 11:30 PM (5 cycles)."

**SLEEP-OUT-2**  
Primary Recommendation Highlighting:
- Highlight 5 cycles (7.5 hours) as primary recommendation
- Use visual emphasis (bold, color, or styling) to distinguish primary option
- Other options (4 and 6 cycles) shown but not highlighted

---

## SLEEP-CONTENT — Explanation Pane Content

**SLEEP-CONTENT-1**  
Required Explanation Content (EXACT TEXT):
- The following content must be used exactly as written
- Only container elements/classes may be added for styling
- Simple placeholders like {MODE}/{TIME} allowed if supported
- NO rewording permitted

### H2: What is a Sleep Time Calculator?

A Sleep Time Calculator suggests bedtimes or wake-up times that align with typical sleep cycles. It helps you aim to wake up at the end of a cycle, which can feel easier than waking in the middle of deep sleep.

### H2: How This Sleep Time Calculator Works

Most people move through sleep in repeating cycles that average about 90 minutes. The calculator uses 90-minute cycles and adds about 15 minutes to allow time to fall asleep.

• If you choose a wake-up time, it works backwards to suggest bedtimes.
• If you choose a fall-asleep time, it works forwards to suggest wake-up times.

### H2: Best Time to Sleep and Wake Up (Examples)

If you want to wake up at 6:00 AM, you may feel better waking after 4, 5, or 6 full cycles. That's why the calculator shows several options.

Example: If you fall asleep at 11:30 PM, your wake-up options are roughly 6:45 AM (4 cycles), 8:15 AM (5 cycles), or 9:45 AM (6 cycles).

### H2: Assumptions and Limitations

This calculator uses averages:

• Sleep cycle length is assumed to be 90 minutes (real cycles can vary).
• Time to fall asleep is assumed to be 15 minutes.

Results are general estimates and are not medical advice. If you have persistent sleep problems, consider speaking with a healthcare professional.

**SLEEP-CONTENT-2**  
FAQ Section (EXACT TEXT):

### H2: Frequently Asked Questions

**How many hours of sleep do I need?**
Most adults do best with 7–9 hours per night (about 5–6 cycles).

**What is a sleep cycle?**
A sleep cycle is a repeating pattern of light sleep, deep sleep, and REM sleep that often lasts about 90 minutes.

**Is 6 hours of sleep enough?**
Six hours is roughly 4 cycles. Some people manage short-term, but many perform better with 7+ hours consistently.

**Why are multiple sleep times shown?**
The calculator shows options for 4, 5, and 6 cycles so you can choose a schedule that fits your day.

**Why might I still feel tired after following the suggestions?**
Cycle length varies by person and by night, and factors like stress, caffeine, sleep debt, or sleep disorders can affect how rested you feel.

---

## SLEEP-UI — UI & Layout Rules

**SLEEP-UI-1**  
Universal Layout Compliance:
- Must follow universal 3-pane layout (navigation, calculation, explanation)
- Calculation pane: inputs + compact results only
- Explanation pane: text content only for v1 (no graphs/tables)
- Must maintain fixed-height panes with internal scrolling

**SLEEP-UI-2**  
No Layout Shifts:
- No page height changes on user interaction
- No dynamic content loading that causes layout shifts
- Results must appear in pre-allocated space

---

## SLEEP-EXCLUDE — Explicit Non-Goals

**SLEEP-EXCLUDE-1**  
Features NOT included:
- No personalization (age/health/sleep debt adjustments)
- No nap calculators or multiple sleep schedules
- No region-specific adjustments beyond browser local time
- No medical or professional recommendations beyond general disclaimer
- No user accounts, saved history, or personalization
- No dependency on external APIs or time services

---

## SLEEP-TEST — Testing Requirements

### Unit Tests

**SLEEP-TEST-U-1**  
Calculation Logic Verification:
- Test wake-up mode: given 6:00 AM wake time, verify 4/5/6 cycle bedtime calculations
- Test fall-asleep mode: given 11:30 PM sleep time, verify 4/5/6 cycle wake times
- Verify 90-minute cycle + 15-minute latency calculations are exact
- Test edge cases: midnight crossovers, invalid times

**SLEEP-TEST-U-2**  
Input Validation Testing:
- Test datetime input validation and formatting
- Test mode toggle functionality  
- Test default value generation (current time + 15 min rounding)
- Test timezone handling with browser local time

### End-to-End Tests

**SLEEP-TEST-E2E-1**  
User Journey Testing:
- Navigate to `/time-and-date/sleep-time-calculator`
- Verify navigation states (top nav active, left nav expanded)
- Test both modes with different times
- Verify results display correctly with proper formatting
- Verify primary recommendation highlighting

**SLEEP-TEST-E2E-2**  
Layout and Content Verification:
- Verify fixed-height panes with no layout shifts
- Verify all explanation content displays correctly
- Verify FAQ section renders properly
- Test responsive behavior at different viewport sizes

### SEO Tests

**SLEEP-TEST-SEO-1**  
SEO Metadata Verification:
- Verify page title, meta description match specifications
- Verify H1 and heading structure is correct
- Verify FAQ structured data is present and valid
- Verify page is accessible via direct URL and sitemap

---

## SLEEP-IMPL — Implementation Notes

**SLEEP-IMPL-1**  
File Structure:
- Create `/public/calculators/time-and-date/sleep-time-calculator/`
- Files: `index.html`, `module.js`, `calculator.css` (if needed)
- Add entry to navigation.json
- Update sitemap.xml

**SLEEP-IMPL-2**  
Change Classification:
- Change Type: New Calculator + SEO
- SEO Impact: YES (new page, new URL, structured data)
- Navigation Impact: YES (new top nav button, new left nav section)

---

## Priority & Dependencies

**Priority**: HIGH  
**Dependencies**: Navigation system updates, sitemap updates  
**Estimated Complexity**: Medium (new category + calculator logic + navigation changes)