<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sleep Planner — Dream Better</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0a0a1a;
    --deep: #07091a;
    --mid: #0f1535;
    --mist: #1a2048;
    --lavender: #8b8fff;
    --moon: #e8e4d8;
    --gold: #f5c842;
    --rose: #ff7b9c;
    --teal: #5ee8c8;
    --soft-white: rgba(232, 228, 216, 0.85);
  }

  html, body {
    height: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--deep);
    color: var(--moon);
    min-height: 100vh;
    position: relative;
  }

  /* ── Starfield ── */
  .starfield {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    overflow: hidden;
  }
  .star {
    position: absolute;
    border-radius: 50%;
    background: white;
    animation: twinkle var(--dur, 3s) ease-in-out infinite alternate;
    opacity: var(--base-op, 0.5);
  }
  @keyframes twinkle {
    from { opacity: var(--base-op, 0.3); transform: scale(1); }
    to   { opacity: 1; transform: scale(1.4); }
  }

  /* ── Aurora BG ── */
  .aurora {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 80% 40% at 20% 0%, rgba(94,232,200,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 30% at 80% 10%, rgba(139,143,255,0.15) 0%, transparent 60%),
      radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,123,156,0.07) 0%, transparent 70%);
    animation: aurora-shift 12s ease-in-out infinite alternate;
  }
  @keyframes aurora-shift {
    0%   { opacity: 0.6; transform: translateY(0) scaleX(1); }
    50%  { opacity: 1;   transform: translateY(-20px) scaleX(1.05); }
    100% { opacity: 0.7; transform: translateY(5px) scaleX(0.97); }
  }

  /* ── Moon ── */
  .moon-wrap {
    position: fixed; top: 40px; right: 80px; z-index: 1; pointer-events: none;
  }
  .moon-circle {
    width: 90px; height: 90px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #fff8dc, #f5c842 40%, #d4a017 80%);
    box-shadow: 0 0 40px 15px rgba(245,200,66,0.25), 0 0 80px 30px rgba(245,200,66,0.1);
    animation: moon-glow 6s ease-in-out infinite alternate;
  }
  @keyframes moon-glow {
    from { box-shadow: 0 0 40px 15px rgba(245,200,66,0.2), 0 0 80px 30px rgba(245,200,66,0.08); }
    to   { box-shadow: 0 0 60px 25px rgba(245,200,66,0.35), 0 0 100px 50px rgba(245,200,66,0.15); }
  }

  /* ── Layout ── */
  .container {
    position: relative; z-index: 2;
    max-width: 640px;
    margin: 0 auto;
    padding: 60px 24px 80px;
  }

  /* ── Header ── */
  .hero-tag {
    font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--teal); opacity: 0.8; margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .hero-tag::before { content: ''; display: block; width: 30px; height: 1px; background: var(--teal); }
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    font-weight: 700;
    line-height: 1.1;
    color: var(--moon);
    margin-bottom: 8px;
  }
  h1 em { color: var(--lavender); font-style: italic; }
  .tagline {
    font-size: 15px; color: rgba(232,228,216,0.55); font-weight: 300;
    margin-bottom: 52px; line-height: 1.6;
  }

  /* ── Card ── */
  .card {
    background: rgba(15,21,53,0.7);
    border: 1px solid rgba(139,143,255,0.15);
    border-radius: 24px;
    padding: 36px;
    backdrop-filter: blur(20px);
    box-shadow: 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
    animation: card-in 0.9s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Mode Toggle ── */
  .mode-label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(232,228,216,0.4); margin-bottom: 10px; }
  .toggle-wrap { display: flex; gap: 8px; margin-bottom: 28px; }
  .toggle-btn {
    flex: 1; padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(139,143,255,0.2);
    background: transparent; color: rgba(232,228,216,0.5); font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s;
  }
  .toggle-btn.active {
    background: linear-gradient(135deg, rgba(139,143,255,0.3), rgba(94,232,200,0.2));
    border-color: rgba(139,143,255,0.5);
    color: var(--moon);
    box-shadow: 0 0 20px rgba(139,143,255,0.2);
  }
  .toggle-btn:not(.active):hover { border-color: rgba(139,143,255,0.35); color: rgba(232,228,216,0.75); }

  /* ── Time Input ── */
  .field-label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(232,228,216,0.4); margin-bottom: 10px; }
  .time-input-wrap { position: relative; margin-bottom: 28px; }
  .time-input {
    width: 100%; padding: 18px 20px;
    background: rgba(7,9,26,0.6);
    border: 1px solid rgba(139,143,255,0.2);
    border-radius: 14px;
    color: var(--moon);
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    letter-spacing: 0.05em;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    cursor: pointer;
    color-scheme: dark;
  }
  .time-input:focus {
    border-color: rgba(139,143,255,0.6);
    box-shadow: 0 0 0 3px rgba(139,143,255,0.12);
  }

  /* ── CTA Button ── */
  .calc-btn {
    width: 100%; padding: 18px;
    background: linear-gradient(135deg, #6b6fff 0%, #5ee8c8 100%);
    border: none; border-radius: 14px;
    color: var(--ink); font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.3s;
    box-shadow: 0 10px 30px rgba(107,111,255,0.35);
  }
  .calc-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .calc-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 40px rgba(107,111,255,0.5); }
  .calc-btn:hover::before { opacity: 1; }
  .calc-btn:active { transform: translateY(0); }

  /* ── Results ── */
  .results { margin-top: 36px; animation: fade-up 0.6s ease both; }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .results-header {
    font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(232,228,216,0.35); margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .results-header::after { content: ''; flex: 1; height: 1px; background: rgba(139,143,255,0.15); }

  .cycle-cards { display: flex; flex-direction: column; gap: 12px; }
  .cycle-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px;
    background: rgba(7,9,26,0.5);
    border: 1px solid rgba(139,143,255,0.12);
    border-radius: 14px;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    cursor: default;
    animation: card-pop 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  .cycle-card:nth-child(1) { animation-delay: 0.05s; }
  .cycle-card:nth-child(2) { animation-delay: 0.12s; }
  .cycle-card:nth-child(3) { animation-delay: 0.19s; }
  @keyframes card-pop {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .cycle-card:hover { transform: translateX(4px); border-color: rgba(139,143,255,0.3); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
  .cycle-card.recommended {
    border-color: rgba(94,232,200,0.4);
    background: rgba(94,232,200,0.06);
    box-shadow: 0 0 30px rgba(94,232,200,0.1);
  }

  .cycle-info { display: flex; flex-direction: column; gap: 2px; }
  .cycle-num { font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(232,228,216,0.4); }
  .cycle-card.recommended .cycle-num { color: var(--teal); }
  .cycle-hours { font-size: 13px; color: rgba(232,228,216,0.5); }
  .cycle-time {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700;
    color: var(--moon);
    letter-spacing: 0.03em;
  }
  .cycle-card.recommended .cycle-time { color: var(--teal); }
  .rec-badge {
    display: none; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    background: rgba(94,232,200,0.15); border: 1px solid rgba(94,232,200,0.3);
    color: var(--teal); padding: 4px 10px; border-radius: 20px;
  }
  .cycle-card.recommended .rec-badge { display: block; }

  /* ── Sleep tip ── */
  .sleep-tip {
    margin-top: 28px; padding: 18px 22px;
    background: rgba(139,143,255,0.07);
    border-left: 3px solid rgba(139,143,255,0.4);
    border-radius: 0 12px 12px 0;
    font-size: 13px; line-height: 1.6; color: rgba(232,228,216,0.6);
    font-style: italic;
  }
  .sleep-tip strong { color: var(--lavender); font-style: normal; }

  /* ── Footer note ── */
  .footer-note {
    margin-top: 40px; text-align: center;
    font-size: 12px; color: rgba(232,228,216,0.25); line-height: 1.8;
  }
  .footer-note span { color: rgba(94,232,200,0.5); }

  /* ── Shooting star ── */
  .shooting-star {
    position: fixed; pointer-events: none; z-index: 1;
    width: 2px; height: 2px; border-radius: 50%; background: white;
    top: var(--sy); left: -10px;
    animation: shoot var(--sd, 5s) var(--delay, 3s) ease-in infinite;
    opacity: 0;
  }
  @keyframes shoot {
    0%   { opacity: 0; transform: translate(0, 0) scaleX(1); }
    5%   { opacity: 1; }
    40%  { opacity: 1; box-shadow: -60px 0 20px 2px rgba(255,255,255,0.6); transform: translate(120vw, 40px) scaleX(30); }
    42%  { opacity: 0; }
    100% { opacity: 0; }
  }
</style>
</head>
<body>

<div class="starfield" id="starfield"></div>
<div class="aurora"></div>
<div class="moon-wrap"><div class="moon-circle"></div></div>

<!-- Shooting stars -->
<div class="shooting-star" style="--sy:15%;--sd:8s;--delay:2s"></div>
<div class="shooting-star" style="--sy:30%;--sd:11s;--delay:7s"></div>
<div class="shooting-star" style="--sy:8%;--sd:9s;--delay:14s"></div>

<div class="container">
  <div class="hero-tag">Sleep Science</div>
  <h1>Rest like the <em>stars</em><br>sleep in cycles</h1>
  <p class="tagline">Each 90-minute cycle brings you deeper rest. Wake at the right moment — refreshed, not groggy.</p>

  <div class="card">
    <div class="mode-label">I want to know my…</div>
    <div class="toggle-wrap">
      <button class="toggle-btn active" id="wakeBtn" onclick="setMode('wake')">🌅 Wake-Up Time</button>
      <button class="toggle-btn" id="sleepBtn" onclick="setMode('sleep')">🌙 Bedtime</button>
    </div>

    <div class="field-label" id="fieldLabel">I want to wake up at…</div>
    <div class="time-input-wrap">
      <input type="time" class="time-input" id="timeInput" value="07:00" />
    </div>

    <button class="calc-btn" onclick="calculate()">✦ Calculate My Sleep Plan</button>

    <div class="results" id="results" style="display:none">
      <div class="results-header">Your ideal options</div>
      <div class="cycle-cards" id="cycleCards"></div>
      <div class="sleep-tip" id="sleepTip"></div>
    </div>
  </div>

  <div class="footer-note">
    Based on <span>90-minute ultradian sleep cycles</span> + ~14 min to fall asleep.<br>
    Your body knows the rhythm — trust the science.
  </div>
</div>

<script>
  // Starfield
  const sf = document.getElementById('starfield');
  for (let i = 0; i < 180; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --dur:${(Math.random()*4+2).toFixed(1)}s;
      --base-op:${(Math.random()*0.4+0.2).toFixed(2)};
      animation-delay:${(Math.random()*5).toFixed(1)}s;
    `;
    sf.appendChild(s);
  }

  let mode = 'wake'; // wake = user sets wake time, calc bedtime; sleep = user sets bedtime, calc wake

  function setMode(m) {
    mode = m;
    document.getElementById('wakeBtn').classList.toggle('active', m === 'wake');
    document.getElementById('sleepBtn').classList.toggle('active', m === 'sleep');
    document.getElementById('fieldLabel').textContent =
      m === 'wake' ? 'I want to wake up at…' : 'I plan to fall asleep at…';
    document.getElementById('results').style.display = 'none';
  }

  const tips = [
    '<strong>Pro tip:</strong> Keep the room cool — around 18°C (65°F) signals your body it\'s time to rest.',
    '<strong>Did you know?</strong> The 5-cycle option gives you 7.5 hours — hitting the sweet spot most adults need.',
    '<strong>Wind down:</strong> Dim lights 30 minutes before your bedtime to boost natural melatonin.',
    '<strong>Morning light:</strong> Step outside within 30 mins of waking to lock in your circadian rhythm.',
  ];

  function formatTime(date) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function calculate() {
    const val = document.getElementById('timeInput').value;
    if (!val) return;
    const [h, m] = val.split(':').map(Number);
    const base = new Date(); base.setHours(h, m, 0, 0);

    const FALL_ASLEEP = 14; // minutes
    const cycles = [4, 5, 6];
    const hoursLabel = [6, 7.5, 9];

    const cards = document.getElementById('cycleCards');
    cards.innerHTML = '';

    cycles.forEach((c, i) => {
      const totalMins = c * 90;
      let targetDate = new Date(base);
      if (mode === 'wake') {
        // subtract total sleep + fall asleep time = bedtime
        targetDate = new Date(base.getTime() - (totalMins + FALL_ASLEEP) * 60000);
      } else {
        // add fall asleep + cycles = wake time
        targetDate = new Date(base.getTime() + (totalMins + FALL_ASLEEP) * 60000);
      }

      const div = document.createElement('div');
      div.className = 'cycle-card' + (c === 5 ? ' recommended' : '');
      div.innerHTML = `
        <div class="cycle-info">
          <div class="cycle-num">${c} cycles</div>
          <div class="cycle-hours">${hoursLabel[i]} hours of sleep</div>
        </div>
        <div class="cycle-time">${formatTime(targetDate)}</div>
        <div class="rec-badge">★ Best</div>
      `;
      cards.appendChild(div);
    });

    document.getElementById('sleepTip').innerHTML = tips[Math.floor(Math.random() * tips.length)];

    const res = document.getElementById('results');
    res.style.display = 'block';
    res.style.animation = 'none';
    void res.offsetWidth;
    res.style.animation = 'fade-up 0.6s ease both';
  }
</script>
</body>
</html>