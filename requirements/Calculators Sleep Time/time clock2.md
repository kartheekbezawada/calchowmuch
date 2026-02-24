# Countdown Timer Web App — Agent Build Requirements

**Document Version:** 1.0  
**Date:** February 2026  
**Purpose:** Explicit requirements for an AI agent to build a fully functional, static countdown timer web application as a single HTML file.

---

## 1. Project Overview

Build a **single-file static HTML countdown timer web app** (`countdown.html`). No backend, no database, no build tools, no external dependencies except Google Fonts. All data must persist using `localStorage`. The app must be deployable by simply opening the HTML file in a browser or dropping it onto a static host (Netlify, GitHub Pages, Vercel, Cloudflare Pages).

---

## 2. Tech Stack & Constraints

| Constraint | Requirement |
|---|---|
| Output | Single `.html` file with all CSS and JS inline |
| Backend | None — fully static |
| Data persistence | `localStorage` only |
| External resources | Google Fonts only (loaded via CDN link tag) |
| Frameworks | Vanilla HTML/CSS/JS only — no React, Vue, jQuery |
| Browser support | Chrome, Firefox, Safari, Edge (modern versions) |
| Responsive | Must work on mobile (min 320px) and desktop |
| Fonts | `DM Serif Display` (display/headings) + `DM Mono` (body/UI) from Google Fonts |

---

## 3. Layout Structure

The app uses a **two-column layout** on desktop, stacking to single column on mobile.

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR: Logo | Timezone badge | Enable Alerts button   │
├──────────────────┬──────────────────────────────────────┤
│                  │                                      │
│  SIDEBAR (320px) │  MAIN CONTENT (flex, fills rest)     │
│                  │                                      │
│  ┌────────────┐  │  ┌──────────────────────────────┐   │
│  │ New        │  │  │  HERO CARD (always visible)  │   │
│  │ Countdown  │  │  │  - Coloured top banner       │   │
│  │ Form       │  │  │  - Event name + date         │   │
│  └────────────┘  │  │  - Flip clock (D:H:M:S)      │   │
│                  │  │  - Stats row                 │   │
│  ┌────────────┐  │  │  - Progress bar              │   │
│  │ Quick      │  │  │  - Milestones                │   │
│  │ Presets    │  │  │  - Fun fact                  │   │
│  └────────────┘  │  │  - Share bar                 │   │
│                  │  └──────────────────────────────┘   │
│                  │                                      │
│                  │  ┌──────────────────────────────┐   │
│                  │  │  SAVED COUNTDOWNS GRID       │   │
│                  │  │  (mini cards, always shown)  │   │
│                  │  └──────────────────────────────┘   │
└──────────────────┴──────────────────────────────────────┘
```

### Responsive behaviour
- Below `800px`: sidebar moves below main content, both full width
- Below `480px`: saved countdown grid becomes single column

---

## 4. Colour Palette & Design Tokens

Use CSS custom properties on `:root`:

```css
--bg:        #f7f6f2   /* page background, warm off-white */
--surface:   #ffffff   /* card backgrounds */
--surface2:  #f0efe9   /* input fields, secondary surfaces */
--border:    #e5e3db   /* all borders */
--text:      #1a1917   /* primary text */
--muted:     #9b9890   /* secondary/label text */
--accent:    #e8391e   /* primary red — buttons, banner start */
--accent2:   #d4700a   /* orange — banner end, gradient */
--accent3:   #1a6ef5   /* blue — links, focus, notifications */
--green:     #1a9e5c   /* milestone reached state */
--shadow:    0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)
```

No colour theme picker — one consistent light theme throughout.

---

## 5. Topbar

- **Left:** Logo text `count.down` — `DM Serif Display` font, accent dot
- **Right:**
  - Timezone badge — reads user's timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone`, displays as a pill e.g. `🌍 Europe/London`
  - "Enable Alerts" button — triggers `Notification.requestPermission()`. Changes to `🔔 Alerts On` if granted, `🔕 Blocked` if denied
- Sticky at top, `z-index: 100`, white background, bottom border

---

## 6. Sidebar — New Countdown Form

This card contains all inputs for creating a new countdown. It is **sticky** (`position: sticky; top: 80px`) on desktop.

### Fields

| Field | Type | Behaviour |
|---|---|---|
| Event Name | `text` input | Required. Triggers `liveUpdate()` on every `input` event |
| Date & Time | `datetime-local` input | Required. Triggers `liveUpdate()` on every `change` event |
| Icon | Emoji picker (10 emoji buttons) | Selecting any emoji also calls `liveUpdate()` |
| Notify me before | `<select>` dropdown | Options: No notification / 1 day / 3 days / 7 days (default) / 2 weeks / 1 month |

### Emoji options
`🎯 ✈️ 🎂 💍 🎓 🏆 🚀 🏖️ 🎵 🎃`  
Default selected: `🎯`

### Live Update behaviour (critical)
- Every time the user changes the name, date, or emoji — call `liveUpdate()`
- `liveUpdate()` reads the current form values and calls `startHero(name, emoji, target, Date.now())` immediately
- **The hero countdown starts ticking without any button press**
- This means on page load with default values, the hero is already running

### Save button
- Label: `+ Save to My Countdowns`
- Red background (`--accent`), full width
- On click: validates inputs → creates event object → pushes to `events` array → saves to localStorage → calls `renderEventCards()` → shows toast → highlights the new card as active
- **Does NOT stop or reset the hero timer** — timer keeps running
- If name is empty: show toast `⚠️ Missing name`
- If date is empty: show toast `⚠️ Missing date`
- If date is in the past: show toast `⚠️ Invalid date`

---

## 7. Sidebar — Quick Presets

A 2-column grid of 6 preset buttons. Each preset auto-calculates the next occurrence of that date.

| Preset | Emoji | Logic |
|---|---|---|
| Next Friday | 🍻 | Next Friday at 18:00, skip if today is Friday |
| Christmas | 🎄 | Dec 25 current year at 09:00, or next year if passed |
| New Year | 🎆 | Jan 1 next year at 00:00 |
| Payday | 💰 | 25th of current month at 09:00, or next month if passed |
| Summer | ☀️ | June 21 at 12:00, or next year if passed |
| Halloween | 🎃 | Oct 31 at 18:00, or next year if passed |

Each preset button shows:
- Large emoji
- Preset name
- "Xd away" (days until)

Clicking a preset:
1. Populates the form fields (name, date)
2. Updates the selected emoji
3. Calls `startHero()` immediately — hero begins ticking
4. Shows a toast `⚡ Loaded! "[name]" is now counting down.`
5. Does NOT auto-save — user must still click Save if they want to keep it

---

## 8. Hero Card (Main Countdown Display)

**The hero card is ALWAYS visible.** It never hides, never shows a placeholder screen. On page load it immediately starts running.

### Page load initialisation order:
1. Set default date in form = tomorrow at current time (seconds zeroed)
2. Check for saved active countdown in localStorage → if found, restore it
3. If no saved countdown → call `liveUpdate()` with tomorrow's date as default
4. Hero is ticking from the very first render

### Hero card anatomy

**Top colour banner** — 5px tall gradient bar: `linear-gradient(90deg, --accent, --accent2)`

**Event header**
- Large event name with emoji: `DM Serif Display`, `clamp(1.4rem, 3vw, 2rem)`
- Below: date string in long format e.g. `Tuesday, 25 December 2026 at 09:00`
- Below: timezone string e.g. `🌍 Europe/London`

**Flip clock** — 4 units: Days, Hours, Minutes, Seconds
- Each unit: dark square tile (`background: --text` = near-black), white `DM Serif Display` digit
- Size: `clamp(64px, 9vw, 100px)` wide × `clamp(74px, 10.5vw, 116px)` tall
- Font size: `clamp(2.4rem, 4.5vw, 4rem)`
- Separator `:` between each unit, blinking on 1s interval (opacity: 1 ↔ 0.15)
- On digit change: play `flipFlash` CSS animation (`rotateX(-18deg) scale(0.97)` → identity, 0.3s)
- Shows `00` in all units until a valid date is set

**Finished state** — when timer reaches zero:
- Hide flip clock
- Show `🎉 It's Time!` text in gradient colour, pulsing animation
- Trigger confetti explosion

**Stats row** — 3 equal boxes below the clock:
- Total Hours (e.g. `1,248.5`)
- Total Minutes (e.g. `74,880`)
- Total Seconds (e.g. `4,492,800`)
- All update every second

**Progress bar**
- Thin bar (5px) showing `elapsed / total` as percentage
- Gradient fill: `--accent` → `--accent2`
- Labels below: `[start date]` ... `X% elapsed` ... `[end date]`
- Start date = the moment the countdown was created/loaded

**Milestones row** — pill badges for: `1 year`, `6 months`, `100 days`, `1 month`, `2 weeks`, `1 week`, `24 hours`
- Default: grey pill
- When that threshold is passed (time remaining < milestone): green pill (`--green`)
- When approaching (within 1% of threshold): orange pulsing pill (`--accent2`)
- When a threshold is crossed: show a toast notification

**Fun fact** — rotating sentence updated every 12 seconds
- Examples:
  - `In this time you could watch N full movies.`
  - `You could sleep N full nights.`
  - `Your heart will beat about N more times.`
  - `You could fly London → New York N times.`
  - `That's roughly N cups of coffee worth of time.`
  - `You could read N novels in this time.`
  - `The Earth will rotate N times before then.`
  - `You could binge N TV episodes.`
- Key numbers are `<strong>` and coloured `--accent3` (blue)

**Share bar** — row of small buttons at the bottom of the hero card:
- `🔗 Copy Link` — generates URL with `?event=NAME&date=TIMESTAMP` query params, copies to clipboard, shows toast
- `💬 Share Text` — uses `navigator.share` if available, else copies text to clipboard
- `⛶ Fullscreen` — opens a new browser window with a cinematic dark-mode version of the same countdown (self-contained HTML written dynamically)

---

## 9. Saved Countdowns Grid

Located below the hero card in the main content column.

- Section heading: `Saved Countdowns (N)` — updates dynamically
- CSS grid: `repeat(auto-fill, minmax(220px, 1fr))`, gap 11px
- If no saved countdowns: show empty state with `🗓️` emoji and instructional text

### Event card anatomy
- Left edge: 3px vertical gradient bar (`--accent` → `--accent2`)
- Top row: emoji (left) + delete `✕` button (right, only visible on hover)
- Event name: `DM Serif Display`, truncated with ellipsis if too long
- Date: small muted text e.g. `25 Dec 2026 at 09:00`
- Countdown string: `Xd Xh Xm` or `Xh Xm Xs` or `🎉 Finished!`
- Mini progress bar: 3px, same gradient as main bar
- Click card: loads that event into the hero, syncs form fields, marks card as active (blue border)
- Delete button: removes from array, removes from localStorage, re-renders grid, shows toast

### Mini tick
All event cards update their countdown string and mini progress bar every 1 second using a separate `setInterval`.

---

## 10. Data Model

### Event object (stored in localStorage as JSON array under key `cd_events`)

```js
{
  id: "1709500000000",          // Date.now().toString() at creation
  name: "Summer Holiday",       // string
  emoji: "✈️",                  // single emoji string
  target: 1756339200000,        // Unix timestamp ms — the countdown target
  startTime: 1709500000000,     // Unix timestamp ms — when countdown was created
  notifyBefore: 7               // integer, days before to notify (0 = never)
}
```

### localStorage keys
- `cd_events` — JSON array of event objects
- `cd_active` — string ID of the currently active event
- `cd_notified` — JSON object, keys are `"name_target_notifyBefore"`, values are `true` — prevents duplicate notifications

---

## 11. Hero State Management

The hero operates independently of the saved list. Key rules:

1. **Hero always runs** — it has its own `tickId` (setInterval) and `heroTarget` variable
2. **Form → hero is live** — changing any form field immediately updates the hero (no button press needed)
3. **Saving** adds to the list but does NOT change what's running in the hero
4. **Clicking a saved card** restores that event to the hero AND syncs the form fields
5. **Preset click** loads into form + starts hero immediately, but does NOT auto-save
6. **Page reload** — if `cd_active` is set and that event exists in `cd_events`, restore it; otherwise run `liveUpdate()` with form defaults

---

## 12. Flip Clock Implementation

```js
// prevVals tracks what's currently displayed to avoid unnecessary DOM updates
let prevVals = {};

function setFlip(id, val) {
  const str = String(Math.floor(val)).padStart(2, '0');
  if (prevVals[id] !== str) {
    const el = document.getElementById(id);
    el.textContent = str;
    el.classList.remove('flash');
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add('flash');
    prevVals[id] = str;
  }
}
```

CSS animation:
```css
.flip-face.flash {
  animation: flipFlash 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes flipFlash {
  0%   { transform: rotateX(-18deg) scale(0.97); }
  100% { transform: rotateX(0deg) scale(1); }
}
```

---

## 13. Progress Bar

```js
const elapsed = Date.now() - heroStart;
const total   = heroTarget - heroStart;
const pct     = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;
document.getElementById('progressFill').style.width = pct.toFixed(2) + '%';
document.getElementById('pPct').textContent = pct.toFixed(1) + '% elapsed';
```

---

## 14. Browser Notifications

- Request permission via button click only (browsers block auto-requests)
- After permission granted: button text → `🔔 Alerts On`
- Each saved event has a `notifyBefore` value (days)
- In the hero tick, check: if `daysLeft` is within 1.2% of `notifyBefore` days AND `notifiedMap[key]` is not set → fire `new Notification()`
- Store fired key in `notifiedMap` and persist to `cd_notified` in localStorage
- Notification title: `⏰ [Event Name]`
- Notification body: `Only N day(s) to go!`

---

## 15. Share & Fullscreen

### Copy Link
```
https://yourdomain.com/countdown.html?event=Summer%20Holiday&date=1756339200000
```
On page load, check for `?event` and `?date` URL params. If found, auto-populate the form and start the hero immediately.

### Fullscreen Mode
Opens `window.open('', '_blank', 'width=960,height=600')` and writes a complete self-contained HTML document into it. That document:
- Dark background (`#0d0d0f`)
- Large flip clock (same logic, different scale)
- Event name in gradient text
- Date subtitle
- Ticks every second using its own inline setInterval
- Receives `heroTarget` value at open time

---

## 16. Confetti

Triggered when a countdown finishes (diff ≤ 0). Creates 80 `<div>` elements inside `#confettiWrap`:
- Random left position (0–100%)
- Random colour from: `#e8391e`, `#d4700a`, `#1a6ef5`, `#1a9e5c`, `#7c3aed`, `#fde047`
- Random size (6–14px), circle or square
- CSS `fall` animation: `translateY(110vh) rotate(720deg)`, 2–5s duration, 0–0.5s delay
- Auto-cleared after 6 seconds

---

## 17. Toast Notifications

- Fixed position: bottom-right, `22px` from edges
- Dark background, white text
- Slides up on show, slides down on hide
- Auto-dismisses after 3.2 seconds
- Title uses `DM Serif Display`, body uses `DM Mono`
- Only one toast visible at a time (clear previous timeout on new toast)

Usage:
```js
showToast('✅ Saved!', '"Summer Holiday" added to your countdowns.');
showToast('⚠️ Missing name', 'Please enter an event name.');
showToast('🎯 Milestone!', '✈️ Summer Holiday is 1 week away!');
showToast('🔗 Copied!', 'Share link in clipboard.');
```

---

## 18. Timezone

- Read once on load: `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Display in topbar badge and in hero meta row
- All date formatting uses `en-GB` locale and `toLocaleDateString` / `toLocaleString`
- No timezone conversion needed — all times are in the user's local time

---

## 19. Responsive Breakpoints

```css
/* Desktop: sidebar left, main right */
@media (min-width: 801px) {
  .main { grid-template-columns: 320px 1fr; }
  .sidebar { position: sticky; top: 80px; }
}

/* Tablet/mobile: stack vertically */
@media (max-width: 800px) {
  .main { grid-template-columns: 1fr; }
  .sidebar { position: static; order: 2; }
  .content { order: 1; }
  .events-grid { grid-template-columns: 1fr 1fr; }
}

/* Small mobile */
@media (max-width: 480px) {
  .events-grid { grid-template-columns: 1fr; }
}
```

---

## 20. Function Reference

The agent must implement all of the following functions:

| Function | Purpose |
|---|---|
| `init()` | Called once on load. Sets defaults, restores state, starts hero |
| `liveUpdate()` | Reads form values, calls `startHero()` — no save |
| `startHero(name, emoji, target, start)` | Clears existing intervals, sets hero state, starts tick + fact intervals |
| `heroTick(name, emoji, target, start)` | Called every 1s. Updates flip clock, stats, progress, milestones, notifications |
| `setFlip(id, val)` | Updates a single digit tile with animation if value changed |
| `updateFact(totalSecs)` | Cycles through fun facts array, updates `#funFact` |
| `buildMilestones(target)` | Creates milestone pills in DOM based on current time to target |
| `tickMilestones(name, emoji, totalSecs)` | Updates pill styles, fires toast when threshold crossed |
| `addEvent()` | Validates form, creates event object, saves, renders cards |
| `deleteEvent(id, e)` | Removes event, saves, re-renders, shows toast |
| `saveEvents()` | Writes `events` array to `localStorage` |
| `renderEventCards()` | Full re-render of the saved countdowns grid |
| `setActive(id)` | Sets `activeId`, highlights card, loads event into hero |
| `renderPresets()` | Builds the 6 preset buttons with auto-calculated dates |
| `loadPresetToHero(preset)` | Populates form, starts hero, shows toast |
| `selectEmoji(btn)` | Updates selected emoji, calls `liveUpdate()` |
| `requestNotifications()` | Requests browser notification permission |
| `checkNotification(ev, totalSecs)` | Fires notification if threshold reached and not already fired |
| `copyLink()` | Generates share URL, copies to clipboard |
| `shareText()` | Uses Web Share API or clipboard |
| `openFullscreen()` | Opens new window with cinematic dark countdown |
| `triggerConfetti()` | Spawns confetti elements, auto-clears after 6s |
| `showToast(title, body)` | Shows bottom-right toast, auto-hides after 3.2s |
| `checkUrlParams()` | Reads `?event` and `?date` from URL, auto-loads if present |

---

## 21. Initialisation Sequence

```
Page loads
  ↓
Google Fonts loaded (DM Serif Display + DM Mono)
  ↓
init() called
  ├── renderPresets()
  ├── renderEventCards()
  ├── checkUrlParams()
  ├── Set default date = tomorrow (seconds zeroed)
  ├── Detect notification permission → update button text
  ├── Display user timezone in topbar + hero
  └── Restore state:
        ├── If cd_active exists AND event found in cd_events:
        │     startHero(ev.name, ev.emoji, ev.target, ev.startTime)
        └── Else:
              liveUpdate() ← hero starts with tomorrow's date
```

---

## 22. Deliverable

The agent must produce a **single file** named `countdown.html` containing:
- All HTML structure
- All CSS (inline in `<style>` tag in `<head>`)
- All JavaScript (inline in `<script>` tag before `</body>`)
- One external resource: Google Fonts `<link>` tag only

The file must:
- Open and work correctly from a local filesystem (`file://`) for all features except browser notifications and share links (which require HTTPS)
- Work correctly when deployed to any static host
- Have no console errors on load
- Persist all saved countdowns across page refreshes via localStorage
- Be fully self-contained — no other files needed