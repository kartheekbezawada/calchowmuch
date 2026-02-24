<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Countdown — Track What Matters</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f7f6f2;
  --surface: #ffffff;
  --surface2: #f0efe9;
  --border: #e5e3db;
  --text: #1a1917;
  --muted: #9b9890;
  --accent: #e8391e;
  --accent2: #d4700a;
  --accent3: #1a6ef5;
  --green: #1a9e5c;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Mono', monospace;
  min-height: 100vh;
}

/* Topbar */
.topbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo { font-family: 'DM Serif Display', serif; font-size: 1.4rem; letter-spacing: -0.02em; }
.logo span { color: var(--accent); }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.tz-badge {
  font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--muted); background: var(--surface2); border: 1px solid var(--border);
  padding: 5px 10px; border-radius: 100px;
}
.btn-notify {
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--accent3); background: rgba(26,110,245,0.08);
  border: 1px solid rgba(26,110,245,0.2); padding: 6px 14px;
  border-radius: 100px; cursor: pointer; font-family: 'DM Mono', monospace; transition: all 0.2s;
}
.btn-notify:hover { background: rgba(26,110,245,0.14); }

/* Layout */
.main {
  max-width: 1100px; margin: 0 auto; padding: 32px 24px;
  display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start;
}
.sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }

/* Cards */
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; box-shadow: var(--shadow); overflow: hidden;
}
.card-header {
  padding: 14px 18px; border-bottom: 1px solid var(--border);
  font-family: 'DM Serif Display', serif; font-size: 0.95rem;
}
.card-body { padding: 18px; }
.field { margin-bottom: 13px; }
.field label {
  display: block; font-size: 0.58rem; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 5px;
}
.field input[type="text"],
.field input[type="datetime-local"] {
  width: 100%; background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-family: 'DM Mono', monospace; font-size: 0.8rem;
  padding: 9px 11px; outline: none; border-radius: 8px;
  transition: border-color 0.2s; color-scheme: light;
}
.field input:focus { border-color: var(--accent3); }

.emoji-picker { display: flex; gap: 5px; flex-wrap: wrap; }
.emoji-btn {
  width: 34px; height: 34px; background: var(--surface2);
  border: 1.5px solid var(--border); border-radius: 7px; font-size: 1rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.emoji-btn:hover, .emoji-btn.selected { border-color: var(--accent3); background: rgba(26,110,245,0.08); }

.notify-select {
  width: 100%; background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-family: 'DM Mono', monospace; font-size: 0.8rem;
  padding: 9px 11px; border-radius: 8px; outline: none;
}

.btn-add {
  width: 100%; background: var(--accent); color: white; border: none;
  font-family: 'DM Mono', monospace; font-size: 0.72rem; letter-spacing: 0.15em;
  text-transform: uppercase; padding: 11px; border-radius: 8px;
  cursor: pointer; transition: all 0.15s; margin-top: 2px;
}
.btn-add:hover { background: #c52e14; transform: translateY(-1px); }

/* Presets */
.presets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding: 14px; }
.preset-btn {
  background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
  padding: 9px; cursor: pointer; text-align: left; transition: all 0.15s; font-family: 'DM Mono', monospace;
}
.preset-btn:hover { border-color: var(--accent3); background: rgba(26,110,245,0.05); transform: translateY(-1px); }
.preset-icon { font-size: 1.1rem; margin-bottom: 3px; }
.preset-name { font-size: 0.62rem; color: var(--text); }
.preset-date { font-size: 0.52rem; color: var(--muted); margin-top: 1px; }

/* ── HERO always visible ───────────────────────────────────── */
.content { display: flex; flex-direction: column; gap: 20px; }

.hero-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden;
}
.hero-banner { height: 5px; background: linear-gradient(90deg, var(--accent), var(--accent2)); }
.hero-body { padding: 26px; }

.hero-top {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 20px; gap: 12px;
}
.hero-event-name {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(1.4rem, 3vw, 2rem);
  letter-spacing: -0.02em; line-height: 1.2;
  display: flex; align-items: center; gap: 8px;
}
.hero-meta {
  font-size: 0.6rem; color: var(--muted); letter-spacing: 0.1em;
  text-transform: uppercase; margin-top: 4px;
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}
.hero-meta .tz { color: var(--accent3); }

/* Flip clock */
.flip-clock {
  display: flex; gap: clamp(6px, 1.5vw, 14px);
  margin-bottom: 22px; align-items: flex-start;
}
.flip-unit { display: flex; flex-direction: column; align-items: center; gap: 7px; }
.flip-box {
  position: relative;
  width: clamp(64px, 9vw, 100px);
  height: clamp(74px, 10.5vw, 116px);
}
.flip-face {
  position: absolute; inset: 0;
  background: var(--text); border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Serif Display', serif;
  font-size: clamp(2.4rem, 4.5vw, 4rem);
  color: #fff; overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.12);
}
.flip-face::after {
  content: ''; position: absolute; left: 0; right: 0; top: 50%;
  height: 1px; background: rgba(255,255,255,0.1);
}
.flip-face::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(0,0,0,0.08) 100%);
  pointer-events: none;
}
.flip-face.flash { animation: flipFlash 0.3s cubic-bezier(0.22,1,0.36,1); }
@keyframes flipFlash {
  0% { transform: rotateX(-18deg) scale(0.97); }
  100% { transform: rotateX(0deg) scale(1); }
}
.flip-label { font-size: 0.52rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); }
.flip-sep {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  color: var(--border); padding-top: clamp(8px, 1.2vw, 16px);
  animation: sepBlink 1s step-end infinite;
}
@keyframes sepBlink { 0%,100%{opacity:1} 50%{opacity:0.15} }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 18px; }
.stat-box {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px; text-align: center;
}
.stat-num { font-family: 'DM Serif Display', serif; font-size: 1.2rem; }
.stat-lbl { font-size: 0.48rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-top: 3px; }

/* Progress */
.progress-track {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 100px; height: 5px; overflow: hidden; margin-bottom: 7px;
}
.progress-fill {
  height: 100%; border-radius: 100px;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  transition: width 1s linear;
}
.progress-labels {
  display: flex; justify-content: space-between;
  font-size: 0.52rem; color: var(--muted); margin-bottom: 16px;
}

/* Milestones */
.milestones { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 16px; }
.milestone {
  font-size: 0.58rem; letter-spacing: 0.08em; padding: 4px 10px;
  border-radius: 100px; border: 1px solid var(--border);
  color: var(--muted); background: var(--surface2); transition: all 0.3s;
}
.milestone.reached { border-color: var(--green); color: var(--green); background: rgba(26,158,92,0.07); }
.milestone.next { border-color: var(--accent2); color: var(--accent2); background: rgba(212,112,10,0.07); animation: mlPulse 2s ease-in-out infinite; }
@keyframes mlPulse { 0%,100%{opacity:1} 50%{opacity:0.55} }

/* Fun fact */
.fun-fact {
  background: linear-gradient(135deg, rgba(26,110,245,0.04), rgba(26,110,245,0.02));
  border: 1px solid rgba(26,110,245,0.13); border-radius: 10px;
  padding: 12px 15px; font-size: 0.68rem; line-height: 1.7; color: var(--muted);
  min-height: 46px;
}
.fun-fact strong { color: var(--accent3); font-weight: 500; }

/* Share bar */
.share-bar {
  display: flex; gap: 7px; align-items: center;
  padding-top: 16px; border-top: 1px solid var(--border); margin-top: 16px; flex-wrap: wrap;
}
.share-label { font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
.btn-share {
  font-size: 0.62rem; padding: 6px 13px; border-radius: 100px;
  border: 1px solid var(--border); background: var(--surface2);
  cursor: pointer; font-family: 'DM Mono', monospace; color: var(--text); transition: all 0.15s;
}
.btn-share:hover { border-color: var(--text); }
.btn-share.blue { border-color: rgba(26,110,245,0.3); color: var(--accent3); background: rgba(26,110,245,0.05); }
.btn-share.blue:hover { background: rgba(26,110,245,0.1); }

/* Finished */
.finished-banner {
  display: none; text-align: center; padding: 28px;
  font-family: 'DM Serif Display', serif; font-size: 2.2rem;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: mlPulse 1.2s ease-in-out infinite alternate;
}

/* Event cards */
.section-head {
  font-size: 0.58rem; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 11px;
}
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 11px; }
.event-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 11px; padding: 14px; cursor: pointer;
  transition: all 0.18s; box-shadow: var(--shadow); position: relative; overflow: hidden;
}
.event-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.event-card.active { border-color: var(--accent3); box-shadow: 0 0 0 2px rgba(26,110,245,0.12), var(--shadow); }
.ec-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.ec-emoji { font-size: 1.4rem; }
.ec-delete {
  font-size: 0.75rem; color: var(--muted); background: none; border: none;
  cursor: pointer; padding: 2px 5px; border-radius: 4px; transition: all 0.15s; opacity: 0;
}
.event-card:hover .ec-delete { opacity: 1; }
.ec-delete:hover { color: var(--accent); background: rgba(232,57,30,0.08); }
.ec-name { font-family: 'DM Serif Display', serif; font-size: 0.95rem; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ec-date { font-size: 0.56rem; color: var(--muted); margin-bottom: 9px; }
.ec-countdown { font-size: 0.72rem; font-weight: 500; }
.ec-mini-progress { height: 3px; background: var(--surface2); border-radius: 100px; margin-top: 9px; overflow: hidden; }
.ec-mini-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 1s linear; }
.empty-state { grid-column: 1/-1; text-align: center; padding: 36px; color: var(--muted); font-size: 0.72rem; }
.empty-state .big { font-size: 2.4rem; margin-bottom: 8px; }

/* Toast */
.toast {
  position: fixed; bottom: 22px; right: 22px;
  background: var(--text); color: #fff; padding: 12px 18px;
  border-radius: 11px; font-size: 0.72rem; box-shadow: var(--shadow-lg);
  transform: translateY(70px); opacity: 0; transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
  z-index: 999; max-width: 280px; line-height: 1.5;
}
.toast.show { transform: translateY(0); opacity: 1; }
.toast-title { font-family: 'DM Serif Display', serif; font-size: 0.95rem; margin-bottom: 1px; }

/* Confetti */
.confetti-wrap { position: fixed; inset: 0; pointer-events: none; z-index: 500; overflow: hidden; }
.confetti-piece { position: absolute; top: -10px; animation: fall linear forwards; }
@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }

/* Responsive */
@media (max-width: 800px) {
  .main { grid-template-columns: 1fr; }
  .sidebar { position: static; order: 2; }
  .content { order: 1; }
  .events-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .events-grid { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: repeat(3,1fr); }
}
</style>
</head>
<body>

<div class="topbar">
  <div class="logo">count<span>.</span>down</div>
  <div class="topbar-right">
    <div class="tz-badge" id="tzBadge">🌍 —</div>
    <button class="btn-notify" id="btnNotify" onclick="requestNotifications()">🔔 Enable Alerts</button>
  </div>
</div>

<div class="main">

  <!-- ── Sidebar ───────────────────────────────────────────── -->
  <div class="sidebar">

    <!-- New Countdown form -->
    <div class="card">
      <div class="card-header">New Countdown</div>
      <div class="card-body">
        <div class="field">
          <label>Event Name</label>
          <input type="text" id="newName" placeholder="e.g. Summer Holiday" oninput="liveUpdate()" />
        </div>
        <div class="field">
          <label>Date & Time</label>
          <input type="datetime-local" id="newDate" onchange="liveUpdate()" />
        </div>
        <div class="field">
          <label>Icon</label>
          <div class="emoji-picker" id="emojiPicker">
            <button class="emoji-btn selected" data-emoji="🎯" onclick="selectEmoji(this)">🎯</button>
            <button class="emoji-btn" data-emoji="✈️" onclick="selectEmoji(this)">✈️</button>
            <button class="emoji-btn" data-emoji="🎂" onclick="selectEmoji(this)">🎂</button>
            <button class="emoji-btn" data-emoji="💍" onclick="selectEmoji(this)">💍</button>
            <button class="emoji-btn" data-emoji="🎓" onclick="selectEmoji(this)">🎓</button>
            <button class="emoji-btn" data-emoji="🏆" onclick="selectEmoji(this)">🏆</button>
            <button class="emoji-btn" data-emoji="🚀" onclick="selectEmoji(this)">🚀</button>
            <button class="emoji-btn" data-emoji="🏖️" onclick="selectEmoji(this)">🏖️</button>
            <button class="emoji-btn" data-emoji="🎵" onclick="selectEmoji(this)">🎵</button>
            <button class="emoji-btn" data-emoji="🎃" onclick="selectEmoji(this)">🎃</button>
          </div>
        </div>
        <div class="field">
          <label>Notify me before</label>
          <select class="notify-select" id="notifyBefore">
            <option value="0">No notification</option>
            <option value="1">1 day before</option>
            <option value="3">3 days before</option>
            <option value="7" selected>7 days before</option>
            <option value="14">2 weeks before</option>
            <option value="30">1 month before</option>
          </select>
        </div>
        <button class="btn-add" onclick="addEvent()">+ Save to My Countdowns</button>
      </div>
    </div>

    <!-- Quick Presets -->
    <div class="card">
      <div class="card-header">Quick Presets</div>
      <div class="presets-grid" id="presetsGrid"></div>
    </div>

  </div>

  <!-- ── Main content ──────────────────────────────────────── -->
  <div class="content">

    <!-- Hero — always visible -->
    <div class="hero-card">
      <div class="hero-banner" id="heroBanner"></div>
      <div class="hero-body">

        <div class="hero-top">
          <div>
            <div class="hero-event-name" id="heroName">⏳ Set an event</div>
            <div class="hero-meta">
              <span id="heroDateStr">Pick a date on the left to begin</span>
              <span class="tz" id="heroTz"></span>
            </div>
          </div>
        </div>

        <!-- Flip clock -->
        <div class="flip-clock" id="flipClock">
          <div class="flip-unit">
            <div class="flip-box"><div class="flip-face" id="fd">00</div></div>
            <div class="flip-label">Days</div>
          </div>
          <div class="flip-sep">:</div>
          <div class="flip-unit">
            <div class="flip-box"><div class="flip-face" id="fh">00</div></div>
            <div class="flip-label">Hours</div>
          </div>
          <div class="flip-sep">:</div>
          <div class="flip-unit">
            <div class="flip-box"><div class="flip-face" id="fm">00</div></div>
            <div class="flip-label">Mins</div>
          </div>
          <div class="flip-sep">:</div>
          <div class="flip-unit">
            <div class="flip-box"><div class="flip-face" id="fs">00</div></div>
            <div class="flip-label">Secs</div>
          </div>
        </div>

        <div class="finished-banner" id="finishedBanner">🎉 It's Time!</div>

        <div class="stats-row">
          <div class="stat-box"><div class="stat-num" id="sh">—</div><div class="stat-lbl">Total Hours</div></div>
          <div class="stat-box"><div class="stat-num" id="sm">—</div><div class="stat-lbl">Total Minutes</div></div>
          <div class="stat-box"><div class="stat-num" id="ss">—</div><div class="stat-lbl">Total Seconds</div></div>
        </div>

        <div class="progress-track"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>
        <div class="progress-labels">
          <span id="pStart">—</span>
          <span id="pPct">—</span>
          <span id="pEnd">—</span>
        </div>

        <div class="milestones" id="milestones"></div>

        <div class="fun-fact" id="funFact">Enter an event name and date to start your countdown.</div>

        <div class="share-bar">
          <span class="share-label">Share</span>
          <button class="btn-share" onclick="copyLink()">🔗 Copy Link</button>
          <button class="btn-share" onclick="shareText()">💬 Share Text</button>
          <button class="btn-share blue" onclick="openFullscreen()">⛶ Fullscreen</button>
        </div>
      </div>
    </div>

    <!-- Saved countdowns -->
    <div id="eventsSection">
      <div class="section-head" id="eventsCount">Saved Countdowns (0)</div>
      <div class="events-grid" id="eventsGrid">
        <div class="empty-state" id="emptyState">
          <div class="big">🗓️</div>
          <p>No saved countdowns yet.<br>Fill in the form and hit <strong>Save</strong>.</p>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast">
  <div class="toast-title" id="toastTitle"></div>
  <div id="toastBody"></div>
</div>
<div class="confetti-wrap" id="confettiWrap"></div>

<script>
// ── State ──────────────────────────────────────────────────────────────────────
let events     = JSON.parse(localStorage.getItem('cd_events') || '[]');
let activeId   = localStorage.getItem('cd_active') || null;
let heroTarget = null;   // timestamp currently shown in hero
let heroStart  = null;
let tickId     = null;
let factId     = null;
let factIdx    = 0;
let prevVals   = {};
let selectedEmoji = '🎯';
let notifGranted  = false;
let notifiedMap   = JSON.parse(localStorage.getItem('cd_notified') || '{}');
let milestoneMap  = {};

const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
document.getElementById('tzBadge').textContent = `🌍 ${userTz}`;
document.getElementById('heroTz').textContent  = `🌍 ${userTz}`;

// ── Fun facts ──────────────────────────────────────────────────────────────────
const factFns = [
  s => `In this time you could watch <strong>${Math.floor(s/7200)}</strong> full movies.`,
  s => `You could sleep <strong>${(s/28800).toFixed(1)}</strong> full nights.`,
  s => `Your heart will beat about <strong>${Math.round(s*1.17).toLocaleString()}</strong> more times.`,
  s => `You could fly London → New York <strong>${Math.floor(s/25200)}</strong> times.`,
  s => `That's roughly <strong>${Math.round(s/3600).toLocaleString()}</strong> cups of coffee worth of time.`,
  s => `You could read <strong>${Math.floor(s/18000)}</strong> novels in this time.`,
  s => `The Earth will rotate <strong>${(s/86400).toFixed(2)}</strong> times before then.`,
  s => `You could binge <strong>${Math.floor(s/2700)}</strong> TV episodes.`,
];

// ── Milestones ─────────────────────────────────────────────────────────────────
const MS = [
  { days:365, label:'1 year' }, { days:180, label:'6 months' },
  { days:100, label:'100 days' }, { days:30, label:'1 month' },
  { days:14,  label:'2 weeks' }, { days:7, label:'1 week' },
  { days:1,   label:'24 hours' },
];

// ── Presets ────────────────────────────────────────────────────────────────────
function getPresets() {
  const now = new Date(), y = now.getFullYear();
  const friday = new Date(now); friday.setDate(now.getDate()+((5-now.getDay()+7)%7||7)); friday.setHours(18,0,0,0);
  let xmas = new Date(y,11,25,9,0,0); if(xmas<now) xmas=new Date(y+1,11,25,9,0,0);
  const ny = new Date(y+1,0,1,0,0,0);
  let pay = new Date(y,now.getMonth(),25,9,0,0); if(pay<now) pay=new Date(y,now.getMonth()+1,25,9,0,0);
  let summer = new Date(y,5,21,12,0,0); if(summer<now) summer=new Date(y+1,5,21,12,0,0);
  let halloween = new Date(y,9,31,18,0,0); if(halloween<now) halloween=new Date(y+1,9,31,18,0,0);
  return [
    { name:'Next Friday', emoji:'🍻', date:friday },
    { name:'Christmas',   emoji:'🎄', date:xmas },
    { name:'New Year',    emoji:'🎆', date:ny },
    { name:'Payday',      emoji:'💰', date:pay },
    { name:'Summer',      emoji:'☀️', date:summer },
    { name:'Halloween',   emoji:'🎃', date:halloween },
  ];
}

function renderPresets() {
  const grid = document.getElementById('presetsGrid');
  grid.innerHTML = '';
  getPresets().forEach(p => {
    const days = Math.ceil((p.date - new Date()) / 86400000);
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.innerHTML = `<div class="preset-icon">${p.emoji}</div><div class="preset-name">${p.name}</div><div class="preset-date">${days}d away</div>`;
    btn.onclick = () => loadPresetToHero(p);
    grid.appendChild(btn);
  });
}

function loadPresetToHero(p) {
  // Fill the form
  document.getElementById('newName').value = p.name;
  const iso = new Date(p.date.getTime() - p.date.getTimezoneOffset()*60000).toISOString().slice(0,16);
  document.getElementById('newDate').value = iso;
  // Find matching emoji
  const emojiBtn = [...document.querySelectorAll('.emoji-btn')].find(b=>b.dataset.emoji===p.emoji);
  if (emojiBtn) selectEmoji(emojiBtn); else selectedEmoji = p.emoji;
  // Start hero
  startHero(p.name, p.emoji, p.date.getTime(), Date.now());
  showToast('⚡ Loaded!', `"${p.name}" is now counting down.`);
}

// ── Live update from form ──────────────────────────────────────────────────────
function liveUpdate() {
  const name = document.getElementById('newName').value.trim() || 'Your Event';
  const dateVal = document.getElementById('newDate').value;
  if (!dateVal) return;
  const target = new Date(dateVal).getTime();
  if (isNaN(target)) return;
  startHero(name, selectedEmoji, target, Date.now());
  // deselect saved cards since this is a live preview
  activeId = null;
  localStorage.setItem('cd_active','');
  document.querySelectorAll('.event-card').forEach(c=>c.classList.remove('active'));
}

// ── Save to list ───────────────────────────────────────────────────────────────
function addEvent() {
  const name = document.getElementById('newName').value.trim();
  const dateVal = document.getElementById('newDate').value;
  if (!name) { showToast('⚠️ Missing name','Please enter an event name.'); return; }
  if (!dateVal) { showToast('⚠️ Missing date','Please pick a date and time.'); return; }
  const target = new Date(dateVal).getTime();
  if (isNaN(target) || target < Date.now()) { showToast('⚠️ Invalid date','Choose a future date.'); return; }

  const id = Date.now().toString();
  const ev = { id, name, emoji: selectedEmoji, target, startTime: Date.now(), notifyBefore: parseInt(document.getElementById('notifyBefore').value) };
  events.push(ev);
  saveEvents();
  activeId = id; localStorage.setItem('cd_active', id);
  renderEventCards();
  showToast('✅ Saved!', `"${name}" added to your countdowns.`);
  // hero is already running — just highlight the card
  document.querySelectorAll('.event-card').forEach(c => c.classList.toggle('active', c.dataset.id === id));
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function startHero(name, emoji, target, start) {
  clearInterval(tickId); clearInterval(factId);
  prevVals = {}; factIdx = 0; milestoneMap = {};
  heroTarget = target; heroStart = start;

  document.getElementById('finishedBanner').style.display = 'none';
  document.getElementById('flipClock').style.display = 'flex';
  document.getElementById('heroName').textContent = `${emoji} ${name}`;
  document.getElementById('heroDateStr').textContent = new Date(target).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});
  document.getElementById('pStart').textContent = new Date(start).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
  document.getElementById('pEnd').textContent   = new Date(target).toLocaleDateString('en-GB',{day:'numeric',month:'short'});

  buildMilestones(target);
  heroTick(name, emoji, target, start);
  tickId = setInterval(() => heroTick(name, emoji, target, start), 1000);
  updateFact(Math.floor((target - Date.now()) / 1000));
  factId = setInterval(() => updateFact(Math.floor((target - Date.now()) / 1000)), 12000);
}

function heroTick(name, emoji, target, start) {
  const now  = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    clearInterval(tickId); clearInterval(factId);
    ['fd','fh','fm','fs'].forEach(id => setFlip(id, 0));
    document.getElementById('flipClock').style.display = 'none';
    document.getElementById('finishedBanner').style.display = 'block';
    document.getElementById('funFact').innerHTML = `<strong>${emoji} ${name}</strong> has arrived! 🎉`;
    triggerConfetti();
    return;
  }

  const totalSecs = Math.floor(diff / 1000);
  setFlip('fd', Math.floor(totalSecs / 86400));
  setFlip('fh', Math.floor((totalSecs % 86400) / 3600));
  setFlip('fm', Math.floor((totalSecs % 3600) / 60));
  setFlip('fs', totalSecs % 60);

  document.getElementById('sh').textContent = (totalSecs/3600).toFixed(1);
  document.getElementById('sm').textContent = Math.floor(totalSecs/60).toLocaleString();
  document.getElementById('ss').textContent = totalSecs.toLocaleString();

  const elapsed = now - start;
  const total   = target - start;
  const pct     = total > 0 ? Math.min(100, (elapsed/total)*100) : 0;
  document.getElementById('progressFill').style.width = pct.toFixed(2) + '%';
  document.getElementById('pPct').textContent = pct.toFixed(1) + '% elapsed';

  tickMilestones(name, emoji, totalSecs);
  checkNotification({ name, emoji, target, notifyBefore: 7 }, totalSecs);
}

function setFlip(id, val) {
  const str = String(Math.floor(val)).padStart(2,'0');
  if (prevVals[id] !== str) {
    const el = document.getElementById(id);
    el.textContent = str;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    prevVals[id] = str;
  }
}

function updateFact(totalSecs) {
  if (totalSecs <= 0) return;
  document.getElementById('funFact').innerHTML = factFns[factIdx % factFns.length](totalSecs);
  factIdx++;
}

// ── Milestones ─────────────────────────────────────────────────────────────────
function buildMilestones(target) {
  const container = document.getElementById('milestones');
  container.innerHTML = '';
  const daysLeft = (target - Date.now()) / 86400000;
  MS.forEach(m => {
    const div = document.createElement('div');
    div.className = 'milestone' + (daysLeft < m.days ? ' reached' : '');
    div.dataset.days = m.days; div.textContent = m.label;
    container.appendChild(div);
  });
}

function tickMilestones(name, emoji, totalSecs) {
  const daysLeft = totalSecs / 86400;
  MS.forEach(m => {
    const el = document.querySelector(`.milestone[data-days="${m.days}"]`);
    if (!el) return;
    if (daysLeft < m.days) { el.classList.add('reached'); el.classList.remove('next'); return; }
    if (daysLeft - m.days < 0.012 && !milestoneMap[m.days]) {
      milestoneMap[m.days] = true;
      el.classList.add('next');
      showToast('🎯 Milestone!', `${emoji} ${name} is ${m.label} away!`);
    }
  });
}

// ── Notifications ──────────────────────────────────────────────────────────────
function requestNotifications() {
  if (!('Notification' in window)) { showToast('⚠️ Unsupported','Not available in this browser.'); return; }
  Notification.requestPermission().then(p => {
    notifGranted = p === 'granted';
    document.getElementById('btnNotify').textContent = notifGranted ? '🔔 Alerts On' : '🔕 Blocked';
    if (notifGranted) showToast('🔔 Enabled!','You\'ll get browser alerts before your events.');
  });
}

function checkNotification(ev, totalSecs) {
  if (!notifGranted || !ev.notifyBefore) return;
  const daysLeft = totalSecs / 86400;
  const key = `${ev.name}_${ev.target}_${ev.notifyBefore}`;
  if (Math.abs(daysLeft - ev.notifyBefore) < 0.012 && !notifiedMap[key]) {
    notifiedMap[key] = true;
    localStorage.setItem('cd_notified', JSON.stringify(notifiedMap));
    new Notification(`⏰ ${ev.name}`, { body: `Only ${ev.notifyBefore} day${ev.notifyBefore>1?'s':''} to go!` });
  }
}

// ── Event cards ────────────────────────────────────────────────────────────────
function renderEventCards() {
  const grid  = document.getElementById('eventsGrid');
  const empty = document.getElementById('emptyState');
  grid.querySelectorAll('.event-card').forEach(c => c.remove());
  document.getElementById('eventsCount').textContent = `Saved Countdowns (${events.length})`;
  if (!events.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  events.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'event-card' + (ev.id === activeId ? ' active' : '');
    card.dataset.id = ev.id;
    const diff = ev.target - Date.now();
    const totalSecs = Math.max(0, Math.floor(diff/1000));
    const d = Math.floor(totalSecs/86400), h = Math.floor((totalSecs%86400)/3600), m = Math.floor((totalSecs%3600)/60);
    const cdStr = diff<=0 ? '🎉 Finished!' : d>0 ? `${d}d ${h}h ${m}m` : h>0 ? `${h}h ${m}m` : `${m}m ${totalSecs%60}s`;
    const pct = Math.min(100, Math.max(0, ((Date.now()-(ev.startTime||Date.now()))/(ev.target-(ev.startTime||Date.now())))*100));
    card.innerHTML = `
      <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--accent),var(--accent2));border-radius:11px 0 0 11px;"></div>
      <div class="ec-top">
        <div class="ec-emoji">${ev.emoji}</div>
        <button class="ec-delete" onclick="deleteEvent('${ev.id}',event)">✕</button>
      </div>
      <div class="ec-name">${ev.name}</div>
      <div class="ec-date">${new Date(ev.target).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
      <div class="ec-countdown">${cdStr}</div>
      <div class="ec-mini-progress"><div class="ec-mini-fill" style="width:${pct.toFixed(1)}%"></div></div>`;
    card.addEventListener('click', () => {
      activeId = ev.id; localStorage.setItem('cd_active', ev.id);
      document.querySelectorAll('.event-card').forEach(c => c.classList.toggle('active', c.dataset.id === ev.id));
      startHero(ev.name, ev.emoji, ev.target, ev.startTime || Date.now());
      // Sync form
      document.getElementById('newName').value = ev.name;
      const iso = new Date(ev.target - (new Date(ev.target).getTimezoneOffset()*60000)).toISOString().slice(0,16);
      document.getElementById('newDate').value = iso;
    });
    grid.appendChild(card);
  });
}

// Mini tick cards
setInterval(() => {
  document.querySelectorAll('.event-card').forEach(card => {
    const ev = events.find(e => e.id === card.dataset.id); if (!ev) return;
    const diff = ev.target - Date.now(), totalSecs = Math.max(0,Math.floor(diff/1000));
    const d=Math.floor(totalSecs/86400),h=Math.floor((totalSecs%86400)/3600),m=Math.floor((totalSecs%3600)/60);
    const cdEl = card.querySelector('.ec-countdown');
    if (cdEl) cdEl.textContent = diff<=0?'🎉 Finished!':d>0?`${d}d ${h}h ${m}m`:h>0?`${h}h ${m}m`:`${m}m ${totalSecs%60}s`;
    const fillEl = card.querySelector('.ec-mini-fill');
    const pct = Math.min(100,Math.max(0,((Date.now()-(ev.startTime||Date.now()))/(ev.target-(ev.startTime||Date.now())))*100));
    if (fillEl) fillEl.style.width = pct.toFixed(1)+'%';
  });
}, 1000);

function deleteEvent(id, e) {
  e.stopPropagation();
  events = events.filter(ev => ev.id !== id);
  if (activeId === id) activeId = null;
  saveEvents(); renderEventCards();
  showToast('🗑️ Removed','Countdown deleted.');
}

function saveEvents() { localStorage.setItem('cd_events', JSON.stringify(events)); }

// ── Share ──────────────────────────────────────────────────────────────────────
function copyLink() {
  if (!heroTarget) return;
  const name = document.getElementById('newName').value.trim() || 'Event';
  const url = `${location.href.split('?')[0]}?event=${encodeURIComponent(name)}&date=${heroTarget}`;
  navigator.clipboard.writeText(url).then(() => showToast('🔗 Copied!','Share link in clipboard.'));
}

function shareText() {
  if (!heroTarget) return;
  const name = document.getElementById('newName').value.trim() || 'Event';
  const days = Math.floor((heroTarget - Date.now()) / 86400000);
  const text = `${selectedEmoji} ${days} days until ${name}! ⏱️`;
  if (navigator.share) navigator.share({text, url: location.href});
  else navigator.clipboard.writeText(text).then(() => showToast('💬 Copied!','Share text in clipboard.'));
}

function openFullscreen() {
  if (!heroTarget) { showToast('⚠️','Start a countdown first.'); return; }
  const name = document.getElementById('newName').value.trim() || 'Event';
  const emoji = selectedEmoji;
  const w = window.open('','_blank','width=960,height=600');
  const diff = heroTarget - Date.now(), t0 = Math.max(0,Math.floor(diff/1000));
  const d=Math.floor(t0/86400),h=Math.floor((t0%86400)/3600),m=Math.floor((t0%3600)/60),s=t0%60;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${name}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0d0d0f;color:#fff;font-family:'DM Mono',monospace;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;gap:12px}
.name{font-family:'DM Serif Display',serif;font-size:clamp(2rem,5vw,3.5rem);background:linear-gradient(135deg,#e8391e,#d4700a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.dt{font-size:0.65rem;letter-spacing:0.2em;opacity:0.35;text-transform:uppercase;margin-bottom:16px}
.clock{display:flex;gap:clamp(8px,2vw,20px);align-items:flex-start}
.unit{display:flex;flex-direction:column;align-items:center;gap:8px}
.digit{width:clamp(90px,14vw,150px);height:clamp(104px,16vw,172px);background:#1a1a24;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;font-size:clamp(3.5rem,8vw,6rem);box-shadow:0 8px 32px rgba(0,0,0,0.5)}
.lbl{font-size:0.55rem;letter-spacing:0.3em;text-transform:uppercase;opacity:0.35}
.sep{font-family:'DM Serif Display',serif;font-size:clamp(2rem,5vw,4.5rem);opacity:0.15;padding-top:clamp(12px,2vw,20px);animation:blink 1s step-end infinite}
@keyframes blink{0%,100%{opacity:.15}50%{opacity:.04}}</style></head>
<body>
<div class="name">${emoji} ${name}</div>
<div class="dt">${new Date(heroTarget).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
<div class="clock">
<div class="unit"><div class="digit" id="xd">${String(d).padStart(2,'0')}</div><div class="lbl">Days</div></div>
<div class="sep">:</div>
<div class="unit"><div class="digit" id="xh">${String(h).padStart(2,'0')}</div><div class="lbl">Hours</div></div>
<div class="sep">:</div>
<div class="unit"><div class="digit" id="xm">${String(m).padStart(2,'0')}</div><div class="lbl">Mins</div></div>
<div class="sep">:</div>
<div class="unit"><div class="digit" id="xs">${String(s).padStart(2,'0')}</div><div class="lbl">Secs</div></div>
</div>
<script>var T=${heroTarget};setInterval(function(){var diff=T-Date.now();if(diff<0)diff=0;var t=Math.floor(diff/1000);document.getElementById('xd').textContent=String(Math.floor(t/86400)).padStart(2,'0');document.getElementById('xh').textContent=String(Math.floor((t%86400)/3600)).padStart(2,'0');document.getElementById('xm').textContent=String(Math.floor((t%3600)/60)).padStart(2,'0');document.getElementById('xs').textContent=String(t%60).padStart(2,'0');},1000);<\/script>
</body></html>`);
  w.document.close();
}

// ── Toast & Confetti ───────────────────────────────────────────────────────────
let toastTimer;
function showToast(title, body) {
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastBody').textContent  = body;
  const t = document.getElementById('toast');
  t.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

function triggerConfetti() {
  const wrap = document.getElementById('confettiWrap');
  wrap.innerHTML = '';
  const colors = ['#e8391e','#d4700a','#1a6ef5','#1a9e5c','#7c3aed','#fde047'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'2px'};width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*.5}s;`;
    wrap.appendChild(p);
  }
  setTimeout(() => wrap.innerHTML = '', 6000);
}

// ── Emoji select ───────────────────────────────────────────────────────────────
function selectEmoji(btn) {
  document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedEmoji = btn.dataset.emoji;
  liveUpdate();
}

// ── URL params ─────────────────────────────────────────────────────────────────
function checkUrlParams() {
  const p = new URLSearchParams(location.search);
  const name = p.get('event'), date = p.get('date');
  if (name && date && !isNaN(parseInt(date))) {
    const target = parseInt(date);
    document.getElementById('newName').value = name;
    const iso = new Date(target - new Date(target).getTimezoneOffset()*60000).toISOString().slice(0,16);
    document.getElementById('newDate').value = iso;
    startHero(name, '🔗', target, Date.now());
    showToast('🔗 Shared link loaded!', `Counting down to "${name}".`);
  }
}

// ── Notifications check ────────────────────────────────────────────────────────
if ('Notification' in window && Notification.permission === 'granted') {
  notifGranted = true;
  document.getElementById('btnNotify').textContent = '🔔 Alerts On';
}

// ── Init ───────────────────────────────────────────────────────────────────────
function init() {
  renderPresets();
  renderEventCards();
  checkUrlParams();

  // Default date = tomorrow
  const tmrw = new Date(Date.now() + 86400000);
  tmrw.setSeconds(0,0);
  document.getElementById('newDate').value = new Date(tmrw - tmrw.getTimezoneOffset()*60000).toISOString().slice(0,16);

  // Restore last active saved countdown, or just kick off hero with default date
  if (activeId) {
    const ev = events.find(e => e.id === activeId);
    if (ev) { startHero(ev.name, ev.emoji, ev.target, ev.startTime||Date.now()); return; }
  }
  if (events.length) {
    const ev = events[0];
    activeId = ev.id;
    document.getElementById('newName').value = ev.name;
    startHero(ev.name, ev.emoji, ev.target, ev.startTime||Date.now());
  } else {
    // Start hero with whatever is in the form (tomorrow by default)
    liveUpdate();
  }
}

init();
</script>
</body>
</html>