Change Type: New Calculator + SEO

1. Page Metadata & Navigation
Top Navigation

Uses existing Time & Date top-nav button (same placement/styling/icon rules).

Left Navigation

Hierarchy:

Time & Date

Countdown Timer Generator

Routing

URL: /time-and-date/countdown-timer-generator

Deep linking must:

Activate Time & Date in top nav

Highlight Countdown Timer Generator in left nav

SEO Metadata

Title: Countdown Timer Generator – Create a Share Link or Embed Timer

Meta Description: Generate a countdown timer for any date or duration. Get a share link, embed code, and a live preview. Simple, fast, and free countdown timer generator.

H1: Countdown Timer Generator

2. Scope & General Characteristics

Single dedicated generator page

Very low-maintenance logic (time difference + formatting)

Fast-loading, static-friendly

No accounts, saved history, or personalization

No legal/official deadline guarantees (informational/utility only)

Key deliverables:

A live timer preview on the page

A share link that reproduces the timer settings via query params

An embed code (iframe) that users can copy into websites

3. Calculation Pane (Interactive)
Purpose

User configures a countdown and the page generates:

Live countdown preview

Share URL

Embed code snippet

Mode (segmented buttons; no dropdown)

Label: Countdown type

Target date & time

Duration

Default: Target date & time

A) Target Date & Time (Default)
Inputs

Event label (optional, max 12 characters)

Text input, maxlength="12"

Default: empty

Target date (required)

Date input

Target time (required)

Time input

Time basis (segmented buttons)

Label: Time basis

UTC (recommended for sharing/embedding)

Local time

Default: UTC

B) Duration Mode
Inputs

Event label (optional, max 12 characters)

Text input, maxlength="12"

Hours (required)

Number input, max 12 characters enforced in JS

Minutes (required)

Number input, max 12 characters enforced in JS

Rules:

Minutes range 0–59

Hours range 0–9999 (enforced via validation)

Common Settings (All Modes)
Display format (segmented buttons)

Label: Display format

Days + HH:MM:SS

HH:MM:SS

MM:SS

Default: Days + HH:MM:SS

When countdown ends (segmented buttons)

Label: When it ends

Show 00:00:00

Show “Ended”

Default: Show “Ended”

Embed size (optional)

Embed width (px) number input, default 320

Embed height (px) number input, default 140

Must enforce 12-character max per input

Buttons

Generate (primary)

Reset (secondary)

Optional quality-of-life: “Use now + 1 hour” button in Duration mode (secondary), not required.

Validation (All Modes)

Required fields must be present

Target datetime must be parseable

Duration must be > 0 (at least 1 minute total)

Inline errors only; do not generate outputs if invalid

4. Outputs (Calculation Pane)
Live Preview (Required)

A countdown display that updates at least once per second

Must not change shell height (fixed-height container)

Generated outputs (Required)

Share link (read-only text area)

Embed code (read-only text area)

Copy buttons:

Copy share link

Copy embed code

Rules:

Outputs must regenerate automatically when inputs change OR only after clicking Generate (choose one approach; must be consistent).

No tables and no charts in calculation pane.

5. Core Logic (Fixed Rules)
5.1 Countdown calculation

Use Date.now() as the current reference time

Remaining milliseconds: remaining = targetMs - nowMs

If remaining <= 0:

End state depends on “When it ends” setting

5.2 Constructing target timestamp

UTC mode: build a UTC timestamp from target date + time

Local mode: build a local timestamp from target date + time

5.3 Duration mode target

targetMs = nowMs + (hours * 3600 + minutes * 60) * 1000

5.4 Formatting

Days + HH:MM:SS:

days = floor(remainingSeconds / 86400)

hours = floor((remainingSeconds % 86400) / 3600)

minutes = floor((remainingSeconds % 3600) / 60)

seconds = remainingSeconds % 60

HH:MM:SS:

totalHours can exceed 24

MM:SS:

totalMinutes can exceed 60

5.5 Query params contract (Share + Embed)

The share link must fully reproduce the timer state using query params.

Required params (exact keys):

v=1

mode=target|duration

label= (0–12 chars, URL-encoded)

If mode=target:

date=YYYY-MM-DD

time=HH:MM

basis=utc|local

If mode=duration:

h=<int>

m=<int>

Common:

fmt=dhms|hms|ms

end=zero|ended

6. Embed Output (iframe)
Embed code format

Generate an iframe snippet:

src points to the same page route with query params

Width/height from user inputs

Must include title attribute for accessibility

Example (template):

<iframe
  src="{SITE_ORIGIN}/time-and-date/countdown-timer-generator?{QUERY_STRING}"
  width="{EMBED_WIDTH}"
  height="{EMBED_HEIGHT}"
  title="Countdown timer"
  loading="lazy"
></iframe>


Rules:

Embed code is output only (not executed as HTML in the page)

No third-party scripts

No tracking

7. Explanation Pane (Blog-Style + Tables + FAQs)

Implementation rule: The following text must be used exactly as written. Codex may only:

Wrap content in required layout containers

Insert placeholders like {MODE}, {LABEL}, {TARGET_DESC}, {FMT_DESC}, {SHARE_LINK}, {EMBED_CODE}

No rewording

Two tables are required:

A Dynamic Settings Summary table that pulls live values from calculation state

A Static Use-Case Table for SEO content

All tables must comply with UTBL-* rules (semantic thead/tbody/tfoot, full borders/grid, scroll container, no cell wrapping).

H2: What is a Countdown Timer Generator?

A Countdown Timer Generator helps you create a countdown for a specific date and time or for a duration. It also generates a share link and an embed code so you can reuse the same timer settings anywhere.

H2: How to Use This Calculator

Choose a countdown type: Target date & time or Duration.

Enter your event label (optional) and your target time or duration.

Choose a display format.

Click Generate to create a share link and embed code.

Use the live preview to confirm the countdown looks right.

H2: Timer Settings Summary (Updates As You Change Inputs)
Table: Current Timer Settings (Dynamic)
Setting	Value
Mode	{MODE}
Event label	{LABEL}
Target	{TARGET_DESC}
Display format	{FMT_DESC}
Share link	{SHARE_LINK}
Embed code	{EMBED_CODE}

Dynamic table rules

The table structure must exist in explanation.html (not injected).

Only the cell values update.

If a field is not applicable, show —.

H2: Common Uses for Countdown Timers
Table: Countdown Timer Use Cases
Use case	Example	Why it helps
Product launch	“Launch in 3 days”	Builds anticipation and clarity
Sale ending	“Sale ends tonight”	Adds urgency without confusion
Exams and study	“Exam in 12 hours”	Helps planning and pacing
Fitness and routines	“Next workout in 45 minutes”	Keeps momentum and structure
Events and travel	“Flight in 1 day”	Reduces last-minute mistakes
H2: Share Links vs Embed Timers

A share link recreates the timer on this site with the same settings. An embed timer lets you place the timer on another website using the generated iframe code.

H2: Assumptions and Limitations

This generator:

Uses your device clock to measure time remaining

Cannot guarantee accuracy if a device clock is incorrect

Does not provide legal or official timing guarantees

Is intended for planning and display purposes

H2: Frequently Asked Questions

Does the timer work on any website?
Yes, if the website allows iframes and you paste the embed code into HTML.

What is the difference between UTC and local time?
UTC is a fixed global reference time. Local time depends on the viewer’s device and location. UTC is often better for sharing and embedding.

Will the timer be the same for everyone?
If you use UTC mode for a target date/time, the countdown is consistent globally. If you use local time, different viewers may see different results.

Can I use this for a duration like 25 minutes?
Yes. Use Duration mode and set hours and minutes.

Does the generator store my countdown?
No. It runs in your browser and does not store your settings.

Can I customize colors and fonts?
Not in v1. The embed uses a clean default style for reliability and simplicity.

Structured Data

Add FAQPage structured data for the FAQ section. Also add WebPage or Calculator structured data for the page.

8. SEO & Content Implementation Requirements

Explanation pane must be crawlable HTML (no injected blog text)

Add a table-of-contents list linking to:

#how-to-use

#timer-settings-summary

#use-cases

#share-vs-embed

#faq

Include both tables in the explanation pane (dynamic + static)

No currency symbols anywhere on the page

9. UI & Layout Rules

Must follow the universal calculator layout

Calculation pane: inputs + live preview + compact outputs only

Explanation pane: long-form content + tables allowed

Internal scrolling only

No layout shifts during interaction

10. Testing Requirements (Per Matrix)

Change Type: New Calculator → required tests:

Unit ✅

E2E - Not required

SEO Auto ✅

ISS-001 ❌ (unless shared layout/CSS is modified)

Minimum Unit Test Cases

Target mode UTC: known timestamp produces expected formatted output (non-negative)

Local mode parses and counts down without crashing

Duration mode: 0 hours 25 minutes generates targetMs correctly

Formatting: dhms/hms/ms formats render correctly with leading zeros

End behavior: “Ended” vs “00:00:00” after target passes

Query param encode/decode round-trips state correctly

Acceptance Criteria

MUST HAVE:

 URL routing: /time-and-date/countdown-timer-generator

 Deep linking activates correct navigation states

 Mode selection: Target date & time / Duration (segmented buttons)

 UTC vs Local basis option for target mode (segmented buttons)

 Display format options (segmented buttons)

 Live preview updates at least once per second

 Share link generated and copyable

 Embed code (iframe) generated and copyable

 Explanation pane is blog-style, includes TOC anchors, includes two tables (one dynamic), and many FAQs

 FAQPage structured data present

 SEO metadata as specified

 No layout shifts during interaction

SHOULD HAVE:

 Keyboard navigation support

 Accessible labels and focus states

 Clear inline error messages