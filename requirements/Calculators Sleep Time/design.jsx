import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #16161f;
    --border: rgba(255,255,255,0.06);
    --border-bright: rgba(255,255,255,0.12);
    --accent: #e8c97a;
    --accent-dim: rgba(232,201,122,0.12);
    --accent-glow: rgba(232,201,122,0.25);
    --text: #f0ede8;
    --muted: #6b6878;
    --muted2: #9996a8;
    --red: #e87a7a;
    --green: #7ae8a8;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .page {
    max-width: 760px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* Header */
  .page-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
  }
  .breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .breadcrumb span { color: var(--accent); }

  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 5vw, 42px);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }
  .page-title em {
    font-style: italic;
    color: var(--accent);
  }
  .page-subtitle {
    color: var(--muted2);
    font-size: 14px;
    font-weight: 300;
  }

  /* Input card */
  .input-card {
    background: var(--surface);
    border: 1px solid var(--border-bright);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 24px;
  }

  .input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  .input-full { grid-column: 1 / -1; }

  .field-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--muted);
    margin-bottom: 8px;
    display: block;
  }

  .field-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 13px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    color-scheme: dark;
  }
  .field-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }
  .field-input::placeholder { color: var(--muted); }

  .start-btn {
    width: 100%;
    background: var(--accent);
    color: #0a0a0f;
    border: none;
    border-radius: 10px;
    padding: 15px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .start-btn:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px var(--accent-glow);
  }
  .start-btn:active { transform: translateY(0); }

  /* Countdown Display */
  .countdown-card {
    background: var(--surface);
    border: 1px solid var(--border-bright);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 20px;
    animation: slideUp 0.4s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .countdown-header {
    padding: 28px 32px 24px;
    border-bottom: 1px solid var(--border);
  }
  .event-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--accent);
    margin-bottom: 8px;
  }
  .event-name {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(22px, 4vw, 34px);
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 6px;
  }
  .event-date {
    color: var(--muted2);
    font-size: 13px;
    font-weight: 300;
  }

  /* Digit blocks */
  .digits-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
  }

  .digit-block {
    background: var(--surface2);
    padding: 32px 12px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .digit-block::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .digit-block.active::before { opacity: 1; }

  .digit-number {
    font-family: 'DM Mono', monospace;
    font-size: clamp(36px, 6vw, 58px);
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 1;
    color: var(--text);
    display: block;
    margin-bottom: 10px;
    transition: transform 0.15s ease;
  }
  .digit-block.tick .digit-number {
    animation: tick 0.15s ease;
  }
  @keyframes tick {
    0% { transform: translateY(-4px); opacity: 0.6; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .digit-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--muted);
  }

  .countdown-footer {
    padding: 0 32px 6px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    position: relative;
    min-height: 52px;
  }

  .live-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: var(--muted);
    font-size: 12px;
    width: max-content;
    text-align: center;
    margin: 0;
    position: absolute;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* Milestones */
  .milestones-section {
    margin-bottom: 20px;
  }
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .milestones-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  @media (max-width: 520px) {
    .milestones-grid { grid-template-columns: repeat(2, 1fr); }
    .input-grid { grid-template-columns: 1fr; }
  }

  .milestone-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 14px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .milestone-card.passed {
    border-color: rgba(232,201,122,0.2);
  }
  .milestone-card.passed::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent-dim);
    pointer-events: none;
  }
  .milestone-card.upcoming {
    border-color: var(--border);
  }

  .milestone-name {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .milestone-status {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
  }
  .milestone-card.passed .milestone-status { color: var(--accent); }
  .milestone-check {
    position: absolute;
    top: 12px; right: 12px;
    font-size: 14px;
  }

  /* Share row */
  .share-row {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  .share-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--muted);
  }
  .share-btn {
    background: var(--surface2);
    border: 1px solid var(--border-bright);
    color: var(--text);
    border-radius: 8px;
    padding: 9px 16px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .share-btn:hover {
    border-color: var(--accent);
    background: var(--accent-dim);
  }
  .copied-flash {
    color: var(--green);
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    animation: fadeOut 2s ease forwards;
  }
  @keyframes fadeOut {
    0%, 60% { opacity: 1; }
    100% { opacity: 0; }
  }

  /* Expired state */
  .expired-banner {
    background: rgba(232,122,122,0.08);
    border: 1px solid rgba(232,122,122,0.2);
    border-radius: 12px;
    padding: 16px 20px;
    color: var(--red);
    font-size: 14px;
    margin-top: 16px;
    font-family: 'DM Mono', monospace;
    text-align: center;
    letter-spacing: 0.04em;
  }

  .reset-btn {
    background: transparent;
    border: 1px solid var(--border-bright);
    color: var(--muted2);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.06em;
  }
  .reset-btn:hover { border-color: var(--accent); color: var(--accent); }
`;

const MILESTONES = [
  { label: "30 days", seconds: 30 * 86400 },
  { label: "7 days", seconds: 7 * 86400 },
  { label: "24 hours", seconds: 86400 },
  { label: "Final hour", seconds: 3600 },
];

const STATIC_REGION_EVENTS = {
  India: [
    { id: "india-independence-day", name: "Independence Day", date: "2026-08-15", time: "09:00" },
    { id: "india-gandhi-jayanti", name: "Gandhi Jayanti", date: "2026-10-02", time: "09:00" },
    { id: "india-diwali", name: "Diwali", date: "2026-11-08", time: "19:00" },
    { id: "india-republic-day", name: "Republic Day", date: "2027-01-26", time: "09:00" },
  ],
  "Muslim Events": [
    { id: "muslim-eid-al-fitr", name: "Eid al-Fitr (Estimated)", date: "2026-03-20", time: "07:00" },
    { id: "muslim-eid-al-adha", name: "Eid al-Adha (Estimated)", date: "2026-05-27", time: "07:00" },
    { id: "muslim-islamic-new-year", name: "Islamic New Year (Estimated)", date: "2026-06-16", time: "09:00" },
    { id: "muslim-mawlid", name: "Mawlid (Estimated)", date: "2026-09-15", time: "09:00" },
  ],
  "United States": [
    { id: "us-memorial-day", name: "Memorial Day", date: "2026-05-25", time: "09:00" },
    { id: "us-independence-day", name: "Independence Day", date: "2026-07-04", time: "09:00" },
    { id: "us-thanksgiving", name: "Thanksgiving Day", date: "2026-11-26", time: "09:00" },
    { id: "us-new-year", name: "New Year", date: "2027-01-01", time: "00:00" },
  ],
  "United Kingdom": [
    { id: "uk-early-may-bank-holiday", name: "Early May Bank Holiday", date: "2026-05-04", time: "09:00" },
    { id: "uk-summer-bank-holiday", name: "Summer Bank Holiday", date: "2026-08-31", time: "09:00" },
    { id: "uk-guy-fawkes-night", name: "Guy Fawkes Night", date: "2026-11-05", time: "19:00" },
    { id: "uk-boxing-day", name: "Boxing Day", date: "2026-12-26", time: "09:00" },
  ],
};

const REGION_OPTIONS = Object.keys(STATIC_REGION_EVENTS);

function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }

function getTimeLeft(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    total: diff,
    days: Math.floor(diff / 86400000),
    hrs: Math.floor((diff % 86400000) / 3600000),
    min: Math.floor((diff % 3600000) / 60000),
    sec: Math.floor((diff % 60000) / 1000),
  };
}

function formatTarget(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-GB", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });
}

export default function CountdownTimer() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);
  tomorrow.setHours(9, 0, 0, 0);

  const [selectedRegion, setSelectedRegion] = useState("India");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventName, setEventName] = useState("Product launch");
  const [dateStr, setDateStr] = useState(tomorrow.toISOString().slice(0, 10));
  const [timeStr, setTimeStr] = useState("09:00");
  const [target, setTarget] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [copied, setCopied] = useState(null);
  const [ticking, setTicking] = useState({ days: false, hrs: false, min: false, sec: false });
  const prevRef = useRef({});
  const regionEvents = STATIC_REGION_EVENTS[selectedRegion] || [];

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => {
      const tl = getTimeLeft(target);
      setTimeLeft(tl);

      // tick animation triggers
      const prev = prevRef.current;
      const newTick = {};
      ["days","hrs","min","sec"].forEach(k => {
        newTick[k] = prev[k] !== undefined && prev[k] !== tl[k];
      });
      if (Object.values(newTick).some(Boolean)) {
        setTicking(newTick);
        setTimeout(() => setTicking({ days:false, hrs:false, min:false, sec:false }), 200);
      }
      prevRef.current = { days: tl.days, hrs: tl.hrs, min: tl.min, sec: tl.sec };
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  function handleRegionChange(e) {
    setSelectedRegion(e.target.value);
    setSelectedEvent("");
  }

  function handleStaticEventChange(e) {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    if (!eventId) return;
    const preset = regionEvents.find(item => item.id === eventId);
    if (!preset) return;
    setEventName(preset.name);
    setDateStr(preset.date);
    setTimeStr(preset.time);
  }

  function handleStart() {
    if (!dateStr || !timeStr || !eventName.trim()) return;
    const ts = new Date(`${dateStr}T${timeStr}`).getTime();
    if (isNaN(ts)) return;
    setTarget(ts);
    setTimeLeft(getTimeLeft(ts));
    prevRef.current = {};
  }

  function handleCopy(type) {
    if (!target || !timeLeft) return;
    const text = type === "summary"
      ? `${eventName} — ${pad(timeLeft.days)}d ${pad(timeLeft.hrs)}h ${pad(timeLeft.min)}m left`
      : formatTarget(target);
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  const digits = timeLeft ? [
    { val: pad(timeLeft.days), label: "Days", key: "days" },
    { val: pad(timeLeft.hrs), label: "Hrs", key: "hrs" },
    { val: pad(timeLeft.min), label: "Min", key: "min" },
    { val: pad(timeLeft.sec), label: "Sec", key: "sec" },
  ] : null;

  const expired = timeLeft && timeLeft.total === 0;

  const milestoneStatuses = target ? MILESTONES.map(m => ({
    ...m,
    passed: (target - Date.now()) > m.seconds * 1000
      ? false  // haven't reached milestone yet — upcoming
      : true,  // we're past this milestone threshold
    active: timeLeft && timeLeft.total > 0 && timeLeft.total <= m.seconds * 1000 + 60000,
  })) : [];

  return (
    <>
      <style>{FONTS}</style>
      <style>{CSS}</style>
      <div className="page">
        <div style={{ marginBottom: 8 }}>
          <div className="breadcrumb">Time & Date → <span>Countdown Timer</span></div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">Countdown <em>Timer</em><br/>Generator</h1>
          <p className="page-subtitle">Set one event. Watch it live.</p>
        </div>

        {/* Input Card */}
        <div className="input-card">
          <div className="input-grid">
            <div>
              <label className="field-label">Region</label>
              <select
                className="field-input"
                value={selectedRegion}
                onChange={handleRegionChange}
              >
                {REGION_OPTIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Event</label>
              <select
                className="field-input"
                value={selectedEvent}
                onChange={handleStaticEventChange}
              >
                <option value="">Custom event</option>
                {regionEvents.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="input-full">
              <label className="field-label">Event name</label>
              <input
                className="field-input"
                value={eventName}
                onChange={e => {
                  setEventName(e.target.value);
                  if (selectedEvent) setSelectedEvent("");
                }}
                placeholder="e.g. Product launch, Wedding..."
              />
            </div>
            <div>
              <label className="field-label">Target date</label>
              <input
                type="date"
                className="field-input"
                value={dateStr}
                onChange={e => {
                  setDateStr(e.target.value);
                  if (selectedEvent) setSelectedEvent("");
                }}
              />
            </div>
            <div>
              <label className="field-label">Time</label>
              <input
                type="time"
                className="field-input"
                value={timeStr}
                onChange={e => {
                  setTimeStr(e.target.value);
                  if (selectedEvent) setSelectedEvent("");
                }}
              />
            </div>
          </div>
          <button className="start-btn" onClick={handleStart}>
            {target ? "Update countdown" : "Start countdown →"}
          </button>
        </div>

        {/* Countdown Display */}
        {timeLeft && (
          <div className="countdown-card">
            <div className="countdown-header">
              <div className="event-label">Counting down to</div>
              <div className="event-name">{eventName || "Your event"}</div>
              <div className="event-date">{formatTarget(target)}</div>
            </div>

            <div className="digits-row">
              {digits.map(({ val, label, key }) => (
                <div key={key} className={`digit-block ${ticking[key] ? "tick active" : ""}`}>
                  <span className="digit-number">{val}</span>
                  <span className="digit-label">{label}</span>
                </div>
              ))}
            </div>

            {expired && (
              <div className="expired-banner">🎉 This moment has arrived!</div>
            )}

            <div className="countdown-footer">
              <div className="live-indicator">
                <div className="live-dot" />
                <span>Live Updates Every Second</span>
              </div>
            </div>
          </div>
        )}

        {/* Milestones */}
        {target && (
          <div className="milestones-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label">Milestones</div>
              <button className="reset-btn" onClick={() => { setTarget(null); setTimeLeft(null); }}>
                ✕ reset
              </button>
            </div>
            <div className="milestones-grid">
              {MILESTONES.map((m, i) => {
                const secsLeft = target ? (target - Date.now()) / 1000 : Infinity;
                const passed = secsLeft <= m.seconds;
                return (
                  <div key={i} className={`milestone-card ${passed ? "passed" : "upcoming"}`}>
                    <div className="milestone-check">{passed ? "✓" : "○"}</div>
                    <div className="milestone-name">{m.label} left</div>
                    <div className="milestone-status">{passed ? "Active now" : "Upcoming"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Share */}
        {target && timeLeft && (
          <div className="share-row">
            <span className="share-label">Share</span>
            <button className="share-btn" onClick={() => handleCopy("summary")}>
              <span>📋</span> Copy summary
            </button>
            <button className="share-btn" onClick={() => handleCopy("date")}>
              <span>📅</span> Copy date
            </button>
            {copied && (
              <span className="copied-flash" key={copied}>Copied!</span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
