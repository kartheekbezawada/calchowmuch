# WORK_HOURS_CALCULATOR_RULES.md

**REQ_ID:** REQ-20260126-014  
**Title:** Work Hours Calculator (Time & Date)  
**Change Type:** New Calculator + SEO  

---

## 1. Page Metadata & Navigation

### Top Navigation
- Uses existing Time & Date top-nav button (same placement/styling/icon rules)

### Left Navigation
**Hierarchy:**
- Time & Date
  - Work Hours Calculator

### Routing
- **URL:** `/time-and-date/work-hours-calculator`
- **Deep linking must:**
  - Activate Time & Date in top nav
  - Highlight Work Hours Calculator in left nav

### SEO Metadata
- **Title:** `Work Hours Calculator – Calculate Hours Worked (With Breaks)`
- **Meta Description:** `Calculate total hours worked between start and end times, subtract breaks, and view results in hours and decimal format. Simple, fast, and free.`
- **H1:** `Work Hours Calculator`

---

## 2. Scope & General Characteristics

- Single dedicated calculator page
- Low-maintenance logic (time arithmetic only)
- Fast-loading, static-friendly
- No accounts, saved history, or personalization
- Not a payroll system; no tax/NI deductions; no legal compliance claims

---

## 3. Calculation Pane (Interactive)

### Purpose
User enters start/end times (optionally multiple work segments) and breaks to calculate total hours worked.

### Inputs

**Mode (segmented buttons; no dropdown)**
- Label: Mode
- Single Shift
- Split Shift (2 segments)
- Weekly Total (Mon–Sun)
- Default: Single Shift

**Mode A — Single Shift**
- Start time (required, time-only)
- End time (required, time-only)
- Unpaid break (optional)
  - Button group: 0 / 15 / 30 / 45 / 60 minutes
  - Default: 30 minutes
- Rollover rule (night shift)
  - Checkbox: Ends next day
  - Default: off

**Mode B — Split Shift (2 segments)**
- Segment 1:
  - Start time (required)
  - End time (required)
  - Checkbox: Ends next day (default off)
- Segment 2:
  - Start time (optional; if empty, segment ignored)
  - End time (optional; if empty, segment ignored)
  - Checkbox: Ends next day (default off)
- Unpaid break (total):
  - Same button group 0/15/30/45/60
  - Default: 30

**Mode C — Weekly Total (Mon–Sun)**
For each day (Mon–Sun):
- Start time (optional)
- End time (optional)
- Checkbox: Ends next day (default off)
- Daily unpaid break (optional)
  - Button group 0/15/30/45/60
  - Default: 0

### Validation (All Modes)
- Required fields must be present for computation in that mode
- If end time is earlier than start time:
  - Allowed only when "Ends next day" is checked
- Break minutes must not exceed computed worked minutes for that segment/day
- Inline errors only; do not compute when invalid

---

## 4. Outputs (Compact, Calculation Pane)

### Always show (when valid)
- Total worked time: HH:MM
- Total hours (decimal): X.XX hours
- Total break deducted: MM minutes

### Mode-specific extra output
- Split Shift: show "Segment 1: HH:MM" and "Segment 2: HH:MM" (text lines only)
- Weekly: show Daily totals as text lines only (no table in v1)

**Rules:**
- No tables, no charts, no graphs in v1
- No currency symbols

---

## 5. Core Logic (Fixed Rules)

### Definitions
- Convert each start/end time into minutes since 00:00
- If "Ends next day" checked: end_minutes += 1440 when end < start or always add 1440 (deterministic)
- Segment_minutes = end_minutes - start_minutes
- Apply break deduction:
  - Single/Split: total_break deducted from sum of segment_minutes
  - Weekly: break deducted per day
- Clamp: total must be ≥ 0 (but validation should prevent negatives)

### Decimal Hours
- decimal_hours = total_minutes / 60
- Display with 2 decimals

---

## 6. Explanation Pane (SEO & Content)

**Implementation rule:** The following text must be used exactly as written. Codex may only:
- Wrap content in required layout containers
- Insert placeholders like `{TOTAL_HHMM}`, `{TOTAL_DECIMAL}`, `{BREAK_MINUTES}`
- No rewording
- Table for worked hours from inputs outputs calculations hours days from calculation pane

### H2: What is a Work Hours Calculator?

A Work Hours Calculator helps you measure the time you worked between a start time and an end time. It can subtract unpaid breaks and show your total as both hours and minutes and as decimal hours.

### H2: Why Decimal Hours Matter

Some timesheets and payroll systems use decimal hours. For example, 7 hours 30 minutes is 7.50 hours. This calculator shows both formats so you can copy the one you need.

### H2: Breaks and Unpaid Time

If you take an unpaid break, your paid time is usually your shift length minus the break. This calculator subtracts your selected break minutes from your total.

### H2: Night Shifts (Ends Next Day)

If your shift ends after midnight, your end time can look earlier than your start time. Use the "Ends next day" option so the calculator treats the end time as the next calendar day.

### H2: Examples

If you work 09:00 to 17:30 with a 30 minute unpaid break, your total worked time is 8:00, which is 8.00 hours.
If you work 22:00 to 06:00 and it ends after midnight, enable "Ends next day" to calculate 8:00 hours correctly.

### H2: Assumptions and Limitations

This calculator:

Works with time-of-day inputs and does not require dates

Subtracts unpaid breaks that you select

Does not calculate pay, overtime rules, taxes, or legal compliance requirements

Is a general timesheet helper and may not match every employer's rounding policy

### H2: Frequently Asked Questions

**Can I calculate hours for a night shift?**
Yes. Enable "Ends next day" when your shift ends after midnight.

**Does this include paid breaks?**
No. Only unpaid breaks that you enter are subtracted.

**Why do I see both HH:MM and decimal hours?**
Different systems use different formats. HH:MM is easier to read, while decimal hours are often used for payroll.

**Does it round time?**
No. It uses the exact times you enter. If your employer rounds to the nearest 5, 10, or 15 minutes, you should apply that policy separately.

### Structured Data
Add FAQPage structured data for the FAQ section.

---

## 7. UI & Layout Rules

- Must follow the universal calculator layout
- Calculation pane: inputs + compact results only
- Explanation pane: text-only for v1
- Internal scrolling only
- No layout shifts on interaction

---

## 8. Non-Goals (Explicit Exclusions)

- No wage/pay calculation
- No overtime law rules
- No automatic rounding policies (v1)
- No exports (CSV/PDF) or saving history (v1)
- No tables/charts (v1)

---

## 9. Change Type
New Calculator (time arithmetic + new route + SEO content)

---

## 10. Testing Strategy (Resource Optimized)

**Basic testing approach to save time and resources:**

### Required Tests (Minimal)
- **Unit Tests:** Time arithmetic logic, break deduction, decimal conversion, night shift handling
- **Functional Tests:** Mode switching, input validation, output formatting
- **Skip E2E Tests:** No browser automation tests for this calculator

### Test Coverage Focus
- Core calculation functions only
- Time arithmetic edge cases (midnight rollover, break validation)
- Mode-specific logic (Single/Split/Weekly)

---

## Acceptance Criteria

**MUST HAVE:**
- [ ] URL routing: `/time-and-date/work-hours-calculator`
- [ ] Deep linking activates correct navigation states
- [ ] Modes implemented as segmented buttons: Single / Split / Weekly
- [ ] Start/end time inputs work and validate correctly
- [ ] Break deduction works and cannot exceed worked time
- [ ] "Ends next day" works for night shifts
- [ ] Outputs show HH:MM, decimal hours, and break deducted
- [ ] Explanation pane content is verbatim as specified
- [ ] FAQPage structured data present
- [ ] SEO metadata as specified
- [ ] No layout shifts during interaction
- [ ] **MPA Architecture:** Standalone HTML page with full page reload navigation
- [ ] **Navigation:** Uses `<a href>` links, not JavaScript routing

**SHOULD HAVE:**
- [ ] Keyboard navigation support
- [ ] Accessible labels and focus states

**WON'T HAVE (v1):**
- Pay/overtime calculations
- Data storage, accounts, exports

**TESTING (Resource Optimized):**
- [ ] **Unit tests only:** Core time arithmetic logic, break calculations
- [ ] **Functional tests only:** UI mode switching, input validation
- [ ] **Skip E2E tests:** No browser automation to save resources

---

## MPA Architecture Compliance

This calculator MUST follow the enforced MPA architecture as defined in UNIVERSAL_REQUIREMENTS.md:
- Standalone HTML document at `/time-and-date/work-hours-calculator`
- Full page reload when navigating to/from this calculator
- No SPA routing, hash URLs, or dynamic content swapping
- Complete page shell with own ads, metadata, and navigation state