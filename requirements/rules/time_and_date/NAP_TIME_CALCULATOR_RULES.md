# NAP_TIME_CALCULATOR_RULES.md

**REQ_ID:** REQ-20260126-013  
**Title:** Nap Time Calculator (Time & Date)  
**Change Type:** New Calculator + SEO  

---

## 1. Page Metadata & Navigation

### Top Navigation
- Uses existing Time & Date top-nav button (same placement/styling/icon rules)

### Left Navigation
**Hierarchy:**
- Time & Date
  - Nap Time Calculator

### Routing
- **URL:** `/time-and-date/nap-time-calculator`
- **Deep linking must:**
  - Activate Time & Date in top nav
  - Highlight Nap Time Calculator in left nav

### SEO Metadata
- **Title:** `Nap Time Calculator – Quick Nap, Power Nap, or Afternoon Nap`
- **Meta Description:** `Choose a nap type and start time to get a recommended wake-up time. Compare quick naps, power naps, and afternoon naps with pros, cons, and FAQs.`
- **H1:** `Nap Time Calculator`

---

## 2. Scope & General Characteristics

- Single dedicated calculator page
- Very low-maintenance logic (fixed nap durations)
- Fast-loading, static-friendly
- No accounts, saved history, or personalization
- No medical claims or sleep disorder guidance (general informational tool only)

---

## 3. Calculation Pane (Interactive)

### Purpose
User selects a nap type and a start time to calculate a recommended wake-up time.

### Inputs

**Nap Type (segmented buttons; no dropdown)**
- Button group labeled: Nap type
- Quick Nap (10–20 min)
- Power Nap (25–30 min)
- Afternoon Nap (60–90 min)
- Default: Power Nap

**Nap Start Time**
- Time input labeled: Nap start time
- Default: now (local browser time)
- Provide a small secondary button: Use now

**Optional Wake Buffer**
- Button group labeled: Wake buffer
- 0 min
- 5 min
- 10 min
- Default: 5 min

### Validation
- Start time must be valid time-of-day
- No date selection required (time-only)
- If invalid, show inline error and do not compute

### Outputs (Compact)
- Recommended wake-up time: {WAKE_TIME}
- Nap length: {NAP_MINUTES} minutes (excluding buffer)
- Buffer applied: {BUFFER_MINUTES} minutes

**Rules:**
- No tables, no charts, no graphs in v1
- Results must update immediately when inputs change

---

## 4. Core Logic (Fixed Rules)

### Definitions
Nap duration is chosen by nap type:
- Quick Nap: 20 minutes
- Power Nap: 30 minutes
- Afternoon Nap: 90 minutes

Buffer is added after nap duration:
- `wake_time = start_time + nap_duration + buffer_minutes`

### Notes
- Calculation is time-of-day only
- Handle wrap past midnight correctly (e.g., 23:50 + 30 min → 00:20 next day)
- Do not show date rollover; show time only

---

## 5. Explanation Pane (SEO & Content)

**Implementation rule:** The following text must be used exactly as written. Codex may only:
- Wrap content in required layout containers
- Insert placeholders like `{NAP_TYPE}`, `{NAP_MINUTES}`, `{BUFFER_MINUTES}`, `{WAKE_TIME}`, `{START_TIME}`
- No rewording

### H2: What is a Nap Time Calculator?

A Nap Time Calculator helps you choose a wake-up time based on when you start your nap and the type of nap you want. If you start at {START_TIME} and choose {NAP_TYPE}, this calculator suggests waking up at {WAKE_TIME}.

### H2: Quick Naps (10–20 minutes)

Quick naps are short and focused. They are often used when you want a fast reset without feeling heavy or groggy afterward.

**Pros**

Fast boost in alertness

Easy to fit into a busy day

Lower chance of waking up feeling sluggish

**Cons**

Short naps may not feel "restful" if you are very tired

Benefits can be brief if you are sleep-deprived

### H2: Power Naps (25–30 minutes)

Power naps are a common middle-ground. They are long enough to feel restorative but short enough to avoid a deep, hard-to-wake phase for many people.

**Pros**

Stronger refresh than a very short nap

Often improves focus and mood

Still relatively easy to schedule

**Cons**

Some people may still feel groggy if they wake at the wrong moment

Can affect nighttime sleep if taken too late in the day

### H2: Afternoon Naps (60–90 minutes)

Afternoon naps are longer naps typically taken when you have more time. They can feel more like a full recharge, but they also come with a higher chance of waking up groggy.

**Pros**

More recovery than shorter naps

Can feel like a full reset

Useful after a very early morning or poor sleep

**Cons**

Higher chance of sleep inertia (waking up groggy)

More likely to interfere with nighttime sleep, especially if taken late

### H2: When to Use a Wake Buffer

A wake buffer adds extra minutes after your nap time so you can wake up gradually. A small buffer can help you sit up, drink water, and get oriented before you need to perform a task.

### H2: Assumptions and Limitations

This calculator:

Uses fixed nap durations for simplicity

Uses your local browser time for "now"

Does not diagnose sleep problems or provide medical advice

Is a general planning tool and results may feel different for different people

### H2: Frequently Asked Questions

**Which nap is best for work breaks?**
Quick naps and power naps are usually the easiest to fit into a workday because they are shorter.

**Why do I sometimes feel worse after a nap?**
If you wake up during deeper sleep, you may feel groggy for a while. A shorter nap or a different nap length can help.

**Will napping ruin my sleep at night?**
Naps taken too late in the day can make it harder to fall asleep at night. If this happens, try a shorter nap or nap earlier.

**What is the best time of day to nap?**
Many people prefer early afternoon. If you nap late, it may affect nighttime sleep.

**Does the calculator set an alarm?**
No. It only suggests a wake-up time. You can set an alarm on your phone or device.

### Structured Data
Add FAQPage structured data for the FAQ section.

---

## 6. UI & Layout Rules

- Must follow the universal calculator layout
- Calculation pane: inputs + compact results only
- Explanation pane: text-only for v1
- Internal scrolling only
- No layout shifts on interaction

---

## 7. Non-Goals (Explicit Exclusions)

- No sleep stage tracking
- No wearable integration
- No medical recommendations
- No reminders, notifications, or alarm-setting in v1
- No data storage or history

---

## 8. Change Type
New Calculator (simple fixed-time logic + new route + SEO content)

---

## 9. Testing Strategy (Resource Optimized)

**Optimized approach to save time and resources:**

### Required Tests (Minimal)
- **Unit Tests:** Time calculation logic, nap duration mapping, midnight rollover
- **Functional Tests:** Input validation, button group interactions, output formatting
- **Skip E2E Tests:** No browser automation tests for this calculator

### Test Coverage Focus
- Core calculation functions only
- Input/output boundary conditions
- Time arithmetic edge cases (midnight, invalid times)

---

## Acceptance Criteria

**MUST HAVE:**
- [ ] URL routing: `/time-and-date/nap-time-calculator`
- [ ] Deep linking activates correct navigation states (top nav + left nav highlight)
- [ ] Nap type selection as button group (no dropdown)
- [ ] Nap start time input with default to now and "Use now" shortcut
- [ ] Wake buffer selection as button group (0/5/10) default 5
- [ ] Wake time computed correctly including midnight rollover
- [ ] Outputs: wake time, nap length minutes, buffer minutes
- [ ] Explanation pane content is verbatim as specified
- [ ] FAQPage structured data present
- [ ] SEO metadata as specified
- [ ] No layout shifts during interaction
- [ ] **MPA Architecture:** Standalone HTML page with full page reload navigation
- [ ] **Navigation:** Uses `<a href>` links, not JavaScript routing

**SHOULD HAVE:**
- [ ] Keyboard navigation support
- [ ] Accessibility: labels associated with inputs and clear focus states

**WON'T HAVE (v1):**
- Alarm creation, notifications, or calendar integration
- Personalized sleep recommendations
- Any medical or diagnostic features

**TESTING (Resource Optimized):**
- [ ] **Unit tests only:** Core calculation logic (time arithmetic, nap durations)
- [ ] **Functional tests only:** UI interactions, input validation
- [ ] **Skip E2E tests:** No browser automation to save resources

---

## MPA Architecture Compliance

This calculator MUST follow the enforced MPA architecture as defined in UNIVERSAL_REQUIREMENTS.md:
- Standalone HTML document at `/time-and-date/nap-time-calculator`
- Full page reload when navigating to/from this calculator
- No SPA routing, hash URLs, or dynamic content swapping
- Complete page shell with own ads, metadata, and navigation state