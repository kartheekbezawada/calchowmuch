import { setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { roundToMinute } from '/assets/js/core/sleep-utils.js';
import { calculateCountdown } from '/assets/js/core/date-diff-utils.js';

const EVENT_TYPES = {
  launch: { label: 'Launch', kicker: 'Launch countdown', defaultName: 'Product launch' },
  birthday: { label: 'Birthday', kicker: 'Birthday countdown', defaultName: 'Birthday party' },
  trip: { label: 'Trip', kicker: 'Trip countdown', defaultName: 'Vacation departure' },
  exam: { label: 'Exam', kicker: 'Exam countdown', defaultName: 'Exam day' },
  deadline: { label: 'Deadline', kicker: 'Deadline countdown', defaultName: 'Project deadline' },
  holiday: { label: 'Holiday', kicker: 'Holiday countdown', defaultName: 'Holiday countdown' },
};

const MILESTONES = [
  { label: '30 days left', thresholdSeconds: 30 * 24 * 60 * 60 },
  { label: '7 days left', thresholdSeconds: 7 * 24 * 60 * 60 },
  { label: '24 hours left', thresholdSeconds: 24 * 60 * 60 },
  { label: 'Final hour', thresholdSeconds: 60 * 60 },
];

const STATIC_REGION_EVENTS = {
  'United States': [
    { id: 'us-memorial-day', name: 'Memorial Day', date: '2026-05-25', time: '09:00' },
    { id: 'us-independence-day', name: 'Independence Day', date: '2026-07-04', time: '09:00' },
    { id: 'us-thanksgiving', name: 'Thanksgiving Day', date: '2026-11-26', time: '09:00' },
    { id: 'us-new-year', name: 'New Year', date: '2027-01-01', time: '00:00' },
  ],
  'United Kingdom': [
    {
      id: 'uk-early-may-bank-holiday',
      name: 'Early May Bank Holiday',
      date: '2026-05-04',
      time: '09:00',
    },
    { id: 'uk-summer-bank-holiday', name: 'Summer Bank Holiday', date: '2026-08-31', time: '09:00' },
    { id: 'uk-guy-fawkes-night', name: 'Guy Fawkes Night', date: '2026-11-05', time: '19:00' },
    { id: 'uk-boxing-day', name: 'Boxing Day', date: '2026-12-26', time: '09:00' },
  ],
  Canada: [
    { id: 'ca-victoria-day', name: 'Victoria Day', date: '2026-05-18', time: '09:00' },
    { id: 'ca-canada-day', name: 'Canada Day', date: '2026-07-01', time: '09:00' },
    { id: 'ca-thanksgiving', name: 'Thanksgiving Day', date: '2026-10-12', time: '09:00' },
    { id: 'ca-boxing-day', name: 'Boxing Day', date: '2026-12-26', time: '09:00' },
  ],
};

const dateTimeInput = document.querySelector('#countdown-datetime');
const dateTimeRow = document.querySelector('#countdown-datetime-row');
const regionInput = document.querySelector('#countdown-region');
const regionEventInput = document.querySelector('#countdown-region-event');
const eventNameInput = document.querySelector('#countdown-event-name');
const holidayField = document.querySelector('#countdown-holiday-field');
const fallbackWrap = document.querySelector('#countdown-fallback');
const fallbackDateInput = document.querySelector('#countdown-date');
const fallbackTimeInput = document.querySelector('#countdown-time');
const startButton = document.querySelector('#countdown-start');
const stopButton = document.querySelector('#countdown-stop');
const errorMessage = document.querySelector('#countdown-error');
const previewCard = document.querySelector('#countdown-preview-card');
const previewBadge = document.querySelector('#countdown-preview-badge');
const previewKicker = document.querySelector('#countdown-preview-heading');
const previewTitle = document.querySelector('#countdown-preview-title');
const previewDate = document.querySelector('#countdown-preview-date');
const previewSummary = document.querySelector('#countdown-preview-summary');
const statusMessage = document.querySelector('#countdown-status');
const timezoneMessage = document.querySelector('#countdown-timezone');
const milestonesWrap = document.querySelector('#countdown-milestones');
const milestonesSection = document.querySelector('#countdown-milestones-wrap');
const actionsWrap = document.querySelector('#countdown-actions');
const expiredBanner = document.querySelector('#countdown-expired');
const copySummaryButton = document.querySelector('#countdown-copy-summary');
const copyDateButton = document.querySelector('#countdown-copy-date');
const addGoogleButton = document.querySelector('#countdown-add-google');
const addOutlookButton = document.querySelector('#countdown-add-outlook');
const downloadIcsButton = document.querySelector('#countdown-download-ics');
const generateShareCardButton = document.querySelector('#countdown-generate-share-card');
const downloadSharePngButton = document.querySelector('#countdown-download-share-png');
const copyShareImageButton = document.querySelector('#countdown-copy-share-image');
const copyFeedback = document.querySelector('#countdown-copy-feedback');
const countdownDays = document.querySelector('#countdown-days');
const countdownHours = document.querySelector('#countdown-hours');
const countdownMinutes = document.querySelector('#countdown-minutes');
const countdownSeconds = document.querySelector('#countdown-seconds');
const eventTypeButtons = Array.from(document.querySelectorAll('[data-event-type]'));
const themeButtons = Array.from(document.querySelectorAll('#countdown-theme-group [data-theme]'));
const optionsDetails = document.querySelector('#countdown-options');

function openOptions() {
  if (optionsDetails && !optionsDetails.open) {
    optionsDetails.open = true;
  }
}

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I make a countdown timer for a future date?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Enter an event name, choose the future date and time, then start the countdown to see the live time remaining.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the countdown use my local time zone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The countdown follows your device clock and local time zone.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add the event to Google Calendar or Outlook?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. After you start the countdown, you can copy the summary or send the event to Google Calendar, Outlook, or an .ics file.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens when the timer reaches zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The countdown reaches zero and shows that the event is live.',
      },
    },
  ],
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Countdown Timer | Live Time Left to Any Date',
      url: 'https://calchowmuch.com/time-and-date/countdown-timer/',
      description:
        'Create a live countdown timer for birthdays, launches, trips, deadlines, and holidays. Set a future date, track time left, and add the event to your calendar.',
      inLanguage: 'en',
    },
  ],
};

const metadata = {
  title: 'Countdown Timer | Live Time Left to Any Date',
  description:
    'Create a live countdown timer for birthdays, launches, trips, deadlines, and holidays. Set a future date, track time left, and add the event to your calendar.',
  canonical: 'https://calchowmuch.com/time-and-date/countdown-timer/',
  structuredData: STRUCTURED_DATA,
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
};

setPageMetadata(metadata);

function ensureH1Title() {
  const title = document.getElementById('calculator-title');
  if (!title) {
    return;
  }
  const desired = 'Countdown Timer';
  if (title.tagName !== 'H1') {
    const h1 = document.createElement('h1');
    h1.id = 'calculator-title';
    h1.textContent = desired;
    title.replaceWith(h1);
  } else {
    title.textContent = desired;
  }
}

ensureH1Title();

function supportsDateTimeLocal() {
  if (!dateTimeInput) {
    return false;
  }
  const test = document.createElement('input');
  test.setAttribute('type', 'datetime-local');
  return test.type === 'datetime-local';
}

const hasDateTimeSupport = supportsDateTimeLocal();
if (!hasDateTimeSupport && fallbackWrap) {
  dateTimeRow?.classList.add('is-hidden');
  fallbackWrap.classList.remove('is-hidden');
  dateTimeInput?.setAttribute('disabled', 'true');
}

function formatDateTimeLocalValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time';
}

function parseDateValue(value) {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function parseTimeValue(value) {
  if (!value) {
    return null;
  }
  const [hours, minutes] = value.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }
  return { hours, minutes };
}

function getTargetDate() {
  if (hasDateTimeSupport && dateTimeInput) {
    const value = dateTimeInput.value;
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed;
  }

  if (fallbackDateInput && fallbackTimeInput) {
    const dateValue = fallbackDateInput.value;
    const timeValue = fallbackTimeInput.value;
    if (!dateValue || !timeValue) {
      return null;
    }
    const date = parseDateValue(dateValue);
    const time = parseTimeValue(timeValue);
    if (!date || !time) {
      return null;
    }
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.hours,
      time.minutes,
      0,
      0
    );
  }

  return null;
}

function setTargetInputs(target) {
  if (dateTimeInput) {
    dateTimeInput.value = formatDateTimeLocalValue(target);
  }
  if (fallbackDateInput) {
    fallbackDateInput.value = formatDateValue(target);
  }
  if (fallbackTimeInput) {
    fallbackTimeInput.value = formatTimeValue(target);
  }
}

function getRegionEvents() {
  const region = regionInput?.value || 'United States';
  return STATIC_REGION_EVENTS[region] || [];
}

function populateRegionEventOptions() {
  if (!regionEventInput) {
    return;
  }

  const previousValue = regionEventInput.value;
  regionEventInput.innerHTML = '';

  const customOption = document.createElement('option');
  customOption.value = '';
  customOption.textContent = 'Custom event';
  regionEventInput.appendChild(customOption);

  const events = getRegionEvents();
  events.forEach((eventPreset) => {
    const option = document.createElement('option');
    option.value = eventPreset.id;
    option.textContent = eventPreset.name;
    regionEventInput.appendChild(option);
  });

  const hasPrevious = events.some((eventPreset) => eventPreset.id === previousValue);
  regionEventInput.value = hasPrevious ? previousValue : '';
}

function getStaticRegionEventById(eventId) {
  if (!eventId) {
    return null;
  }
  return getRegionEvents().find((eventPreset) => eventPreset.id === eventId) || null;
}

function buildStaticRegionTarget(eventPreset) {
  if (!eventPreset) {
    return null;
  }
  const date = parseDateValue(eventPreset.date);
  const time = parseTimeValue(eventPreset.time);
  if (!date || !time) {
    return null;
  }
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.hours,
    time.minutes,
    0,
    0
  );
}

function applyStaticRegionEvent(eventId) {
  const eventPreset = getStaticRegionEventById(eventId);
  if (!eventPreset) {
    return;
  }
  if (eventNameInput) {
    eventNameInput.value = eventPreset.name;
  }
  const target = buildStaticRegionTarget(eventPreset);
  if (target) {
    setTargetInputs(target);
  }
  markPreviewStale();
}

function clearRegionEventSelection() {
  if (regionEventInput && regionEventInput.value) {
    regionEventInput.value = '';
  }
}

function setSelectedButton(buttons, selectedValue, key) {
  buttons.forEach((button) => {
    const isSelected = button.dataset[key] === selectedValue;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
}

let selectedEventType = 'launch';
let selectedTheme = 'launch';
let activeBuild = null;
let countdownInterval = null;
let shareCardCache = null;

function updateHolidayFieldVisibility() {
  const showHoliday = selectedEventType === 'holiday';
  holidayField?.classList.toggle('is-hidden', !showHoliday);
  if (showHoliday) {
    openOptions();
  }
}

function clearError() {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.add('is-hidden');
  }
}

function showError(message) {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
}

function clearCopyFeedback() {
  if (!copyFeedback) {
    return;
  }
  copyFeedback.textContent = '';
  copyFeedback.classList.add('is-hidden');
}

function clearShareCardCache() {
  shareCardCache = null;
}

function showCopyFeedback(message) {
  if (!copyFeedback) {
    return;
  }
  copyFeedback.textContent = message;
  copyFeedback.classList.remove('is-hidden');
}

function padDisplayNumber(value) {
  return String(value).padStart(2, '0');
}

function updateCountdownTiles(countdown) {
  if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) {
    return;
  }
  countdownDays.textContent =
    typeof countdown.days === 'number'
      ? formatNumber(countdown.days, { maximumFractionDigits: 0 })
      : String(countdown.days);
  countdownHours.textContent =
    typeof countdown.hours === 'number' ? padDisplayNumber(countdown.hours) : String(countdown.hours);
  countdownMinutes.textContent =
    typeof countdown.minutes === 'number'
      ? padDisplayNumber(countdown.minutes)
      : String(countdown.minutes);
  countdownSeconds.textContent =
    typeof countdown.seconds === 'number'
      ? padDisplayNumber(countdown.seconds)
      : String(countdown.seconds);
}

function formatTargetLabel(target) {
  return target.toLocaleString(undefined, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function pluralize(value, label) {
  return `${value} ${label}${value === 1 ? '' : 's'}`;
}

function formatCountdownSummary(countdown) {
  if (countdown.days > 0) {
    return [
      pluralize(countdown.days, 'day'),
      pluralize(countdown.hours, 'hour'),
      pluralize(countdown.minutes, 'minute'),
    ].join(', ');
  }

  if (countdown.hours > 0) {
    return [
      pluralize(countdown.hours, 'hour'),
      pluralize(countdown.minutes, 'minute'),
      pluralize(countdown.seconds, 'second'),
    ].join(', ');
  }

  if (countdown.minutes > 0) {
    return [pluralize(countdown.minutes, 'minute'), pluralize(countdown.seconds, 'second')].join(
      ', '
    );
  }

  return pluralize(countdown.seconds, 'second');
}

function getEventName() {
  const fallback = EVENT_TYPES[selectedEventType]?.defaultName || 'Upcoming event';
  const value = eventNameInput?.value.trim() || '';
  return value || fallback;
}

function renderMilestones(totalSeconds, isComplete = false) {
  if (!milestonesWrap) {
    return;
  }

  milestonesWrap.innerHTML = '';
  if (typeof totalSeconds !== 'number' && !isComplete) {
    return;
  }

  MILESTONES.forEach((milestone) => {
    const item = document.createElement('article');
    item.className = 'countdown-milestone';

    const label = document.createElement('p');
    label.className = 'countdown-milestone-label';
    label.textContent = milestone.label;

    const state = document.createElement('p');
    state.className = 'countdown-milestone-state';

    if (isComplete) {
      item.classList.add('is-passed');
      state.textContent = 'Reached';
    } else if (totalSeconds > milestone.thresholdSeconds) {
      state.textContent = 'Upcoming';
    } else if (totalSeconds > 0) {
      item.classList.add('is-live');
      state.textContent = 'Active now';
    } else {
      item.classList.add('is-passed');
      state.textContent = 'Reached';
    }

    item.append(label, state);
    milestonesWrap.appendChild(item);
  });
}

function setPreviewWaitingState() {
  clearShareCardCache();
  previewCard?.setAttribute('data-theme', selectedTheme);
  previewCard?.classList.add('is-hidden');
  actionsWrap?.classList.add('is-hidden');
  milestonesSection?.classList.add('is-hidden');
  expiredBanner?.classList.add('is-hidden');
  if (previewBadge) {
    previewBadge.textContent = 'Ready';
  }
  if (previewKicker) {
    previewKicker.textContent = 'Counting down to';
  }
  if (previewTitle) {
    previewTitle.textContent = 'Your event countdown';
  }
  if (previewDate) {
    previewDate.textContent = 'Date & time: --';
  }
  if (previewSummary) {
    previewSummary.textContent = 'Live countdown appears after Start.';
  }
  if (statusMessage) {
    statusMessage.textContent = 'Live updates Every Second';
  }
  if (timezoneMessage) {
    timezoneMessage.textContent = `Local time zone: ${getLocalTimeZone()}`;
  }
  updateCountdownTiles({ days: '--', hours: '--', minutes: '--', seconds: '--' });
  renderMilestones();
}

function buildBadgeText(countdown, isComplete) {
  if (isComplete) {
    return 'Event reached';
  }
  if (countdown.days > 0) {
    return `${countdown.days} day${countdown.days === 1 ? '' : 's'} left`;
  }
  if (countdown.hours > 0) {
    return `${countdown.hours} hour${countdown.hours === 1 ? '' : 's'} left`;
  }
  if (countdown.minutes > 0) {
    return `${countdown.minutes} min left`;
  }
  return 'Final seconds';
}

function renderPreview(target, countdown, isComplete = false) {
  if (!activeBuild) {
    return;
  }

  const eventName = activeBuild.eventName;

  previewCard?.setAttribute('data-theme', activeBuild.theme);
  previewCard?.classList.remove('is-hidden');
  milestonesSection?.classList.remove('is-hidden');
  expiredBanner?.classList.toggle('is-hidden', !isComplete);
  if (previewKicker) {
    previewKicker.textContent = 'Counting down to';
  }
  if (previewBadge) {
    previewBadge.textContent = buildBadgeText(countdown, isComplete);
  }
  if (previewTitle) {
    previewTitle.textContent = eventName;
  }
  if (previewDate) {
    previewDate.textContent = `Date & time: ${formatTargetLabel(target)}`;
  }
  if (previewSummary) {
    previewSummary.textContent = isComplete
      ? `${eventName} is happening now.`
      : `${formatCountdownSummary(countdown)} left until ${eventName}.`;
  }
  if (statusMessage) {
    statusMessage.textContent = isComplete
      ? 'This moment has arrived.'
      : 'Live updates Every Second';
  }
  if (timezoneMessage) {
    timezoneMessage.textContent = `Local time zone: ${getLocalTimeZone()}`;
  }

  updateCountdownTiles(countdown);
  renderMilestones(countdown.totalSeconds, isComplete);
  milestonesSection?.classList.toggle('is-hidden', milestonesWrap ? milestonesWrap.children.length === 0 : true);
  actionsWrap?.classList.remove('is-hidden');
}

function buildZeroCountdown() {
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
  };
}

function clearCountdownInterval() {
  if (countdownInterval) {
    window.clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function updateCountdown(target) {
  const now = new Date();
  if (target.getTime() <= now.getTime()) {
    renderPreview(target, buildZeroCountdown(), true);
    clearCountdownInterval();
    return;
  }

  const countdown = calculateCountdown(target, now);
  if (!countdown) {
    showError('Please enter a valid future date and time.');
    clearCountdownInterval();
    return;
  }

  renderPreview(target, countdown, false);
}

function markPreviewStale() {
  clearError();
  clearCopyFeedback();
  clearShareCardCache();
  if (!activeBuild) {
    return;
  }
  if (previewBadge) {
    previewBadge.textContent = 'Needs update';
  }
  if (statusMessage) {
    statusMessage.textContent = 'Inputs changed. Press Start to update.';
  }
}

function stopCountdown() {
  clearCountdownInterval();
  if (previewBadge) {
    previewBadge.textContent = 'Paused';
  }
  if (statusMessage) {
    statusMessage.textContent = 'Countdown stopped.';
  }
}

function calculate(startTimer = true) {
  clearError();
  clearCopyFeedback();
  clearShareCardCache();

  const target = getTargetDate();
  if (!target) {
    showError('Please choose a valid future date and time.');
    return;
  }

  if (target.getTime() <= Date.now()) {
    showError('Please choose a future date and time.');
    return;
  }

  activeBuild = {
    eventName: getEventName(),
    eventType: selectedEventType,
    theme: selectedTheme,
    target,
  };

  updateCountdown(target);

  if (startTimer) {
    clearCountdownInterval();
    countdownInterval = window.setInterval(() => updateCountdown(target), 1000);
  }
}

async function copyText(text, successMessage) {
  if (!text) {
    showCopyFeedback('Build the countdown first.');
    return;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', 'true');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    showCopyFeedback(successMessage);
  } catch (error) {
    showCopyFeedback('Copy failed on this device.');
  }
}

function formatCompactCountdown(countdown, isComplete) {
  if (isComplete) {
    return 'Event live now';
  }
  if (!countdown) {
    return '--';
  }
  if (countdown.days > 0) {
    return `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;
  }
  if (countdown.hours > 0) {
    return `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
  }
  if (countdown.minutes > 0) {
    return `${countdown.minutes}m ${countdown.seconds}s`;
  }
  return `${countdown.seconds}s`;
}

function getShareCardSnapshot() {
  if (!activeBuild || !activeBuild.target) {
    return null;
  }
  const now = new Date();
  const target = activeBuild.target;
  const isComplete = target.getTime() <= now.getTime();
  const countdown = isComplete ? buildZeroCountdown() : calculateCountdown(target, now);
  if (!isComplete && !countdown) {
    return null;
  }
  return {
    title: activeBuild.eventName,
    target,
    timezone: getLocalTimeZone(),
    targetLabel: formatTargetLabel(target),
    countdown: countdown || buildZeroCountdown(),
    isComplete,
  };
}

function getShareCardCacheKey(snapshot) {
  const { countdown, isComplete, title, target, timezone } = snapshot;
  return [
    title,
    target.getTime(),
    timezone,
    isComplete ? '1' : '0',
    countdown.days,
    countdown.hours,
    countdown.minutes,
  ].join('|');
}

function drawRoundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (context.measureText(next).width <= maxWidth || !current) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) {
    lines.push(current);
  }

  const limit = Math.max(1, maxLines || lines.length);
  const visibleLines = lines.slice(0, limit);
  if (lines.length > limit) {
    const lastIndex = visibleLines.length - 1;
    let clipped = visibleLines[lastIndex];
    while (clipped.length > 1 && context.measureText(`${clipped}...`).width > maxWidth) {
      clipped = clipped.slice(0, -1);
    }
    visibleLines[lastIndex] = `${clipped}...`;
  }

  visibleLines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
  return y + visibleLines.length * lineHeight;
}

function renderShareCardBlob(snapshot) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext('2d');
  if (!context) {
    return Promise.reject(new Error('Canvas not available.'));
  }

  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, '#0e1c36');
  background.addColorStop(1, '#081227');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const glow = context.createRadialGradient(940, 84, 20, 940, 84, 340);
  glow.addColorStop(0, 'rgba(232, 201, 122, 0.30)');
  glow.addColorStop(1, 'rgba(232, 201, 122, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawRoundedRect(context, 62, 58, 1076, 514, 28);
  const cardGradient = context.createLinearGradient(62, 58, 1138, 572);
  cardGradient.addColorStop(0, 'rgba(17, 24, 39, 0.94)');
  cardGradient.addColorStop(1, 'rgba(11, 18, 33, 0.96)');
  context.fillStyle = cardGradient;
  context.fill();
  context.strokeStyle = 'rgba(232, 201, 122, 0.35)';
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = '#e8c97a';
  context.font = "600 26px 'DM Sans', 'Segoe UI', sans-serif";
  context.fillText('COUNTDOWN SHARE CARD', 110, 130);

  context.fillStyle = '#f3f4f6';
  context.font = "700 66px 'DM Serif Display', Georgia, serif";
  const titleBottom = drawWrappedText(context, snapshot.title, 110, 212, 980, 74, 2);

  context.fillStyle = '#8ea0c8';
  context.font = "500 26px 'DM Sans', 'Segoe UI', sans-serif";
  context.fillText('TIME LEFT', 110, titleBottom + 44);

  context.fillStyle = '#ffffff';
  context.font = "700 72px 'DM Mono', Consolas, monospace";
  context.fillText(
    formatCompactCountdown(snapshot.countdown, snapshot.isComplete),
    110,
    titleBottom + 128
  );

  context.fillStyle = '#9fb0d6';
  context.font = "500 28px 'DM Sans', 'Segoe UI', sans-serif";
  context.fillText(`Target: ${snapshot.targetLabel}`, 110, titleBottom + 184);
  context.fillText(`Time zone: ${snapshot.timezone}`, 110, titleBottom + 222);

  context.fillStyle = 'rgba(232, 201, 122, 0.94)';
  context.font = "600 24px 'DM Sans', 'Segoe UI', sans-serif";
  context.fillText('Generated on CalcHowMuch', 110, 540);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Could not create PNG.'));
      }
    }, 'image/png');
  });
}

async function ensureShareCardBlob() {
  const snapshot = getShareCardSnapshot();
  if (!snapshot) {
    showCopyFeedback('Build the countdown first.');
    return null;
  }

  const cacheKey = getShareCardCacheKey(snapshot);
  if (shareCardCache?.key === cacheKey && shareCardCache.blob) {
    return { blob: shareCardCache.blob, snapshot };
  }

  const blob = await renderShareCardBlob(snapshot);
  shareCardCache = { key: cacheKey, blob };
  return { blob, snapshot };
}

function toSafeSlug(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function downloadBlob(blob, filename) {
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(fileUrl);
}

async function generateShareCard() {
  try {
    const payload = await ensureShareCardBlob();
    if (!payload) {
      return;
    }
    showCopyFeedback('Share card generated.');
  } catch (error) {
    showCopyFeedback('Could not generate share card.');
  }
}

async function downloadShareCardPng() {
  try {
    const payload = await ensureShareCardBlob();
    if (!payload) {
      return;
    }
    const slug = toSafeSlug(payload.snapshot.title) || 'countdown';
    downloadBlob(payload.blob, `${slug}-share-card.png`);
    showCopyFeedback('Share card PNG downloaded.');
  } catch (error) {
    showCopyFeedback('Could not download share card.');
  }
}

async function copyShareCardImage() {
  try {
    const payload = await ensureShareCardBlob();
    if (!payload) {
      return;
    }

    if (navigator.clipboard?.write && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': payload.blob })]);
      showCopyFeedback('Share card image copied.');
      return;
    }

    const fallbackText = getActiveCountdownSnapshot();
    if (fallbackText) {
      await copyText(fallbackText, 'Image copy not supported. Summary copied instead.');
      return;
    }
    showCopyFeedback('Image copy not supported on this device.');
  } catch (error) {
    showCopyFeedback('Could not copy share card image.');
  }
}

function getActiveCountdownSnapshot() {
  if (!activeBuild) {
    return null;
  }
  const target = activeBuild.target;
  if (!target || target.getTime() <= Date.now()) {
    return `${activeBuild.eventName} is happening now.`;
  }
  const countdown = calculateCountdown(target, new Date());
  if (!countdown) {
    return null;
  }
  return `${formatCountdownSummary(countdown)} left until ${activeBuild.eventName} on ${formatTargetLabel(
    target
  )}.`;
}

function getActiveDateSnapshot() {
  if (!activeBuild) {
    return null;
  }
  const target = activeBuild.target;
  if (!target) {
    return null;
  }
  return `${activeBuild.eventName}: ${formatTargetLabel(target)}`;
}

function getCalendarSnapshot() {
  if (!activeBuild || !activeBuild.target) {
    return null;
  }
  const start = new Date(activeBuild.target.getTime());
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return {
    title: activeBuild.eventName,
    start,
    end,
    details: `Countdown event from CalcHowMuch: ${activeBuild.eventName}`,
  };
}

function toIcsUtcStamp(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
    date.getUTCHours()
  )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function toIsoNoMillis(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function openCalendarUrl(url) {
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  if (!opened) {
    showCopyFeedback('Popup blocked. Please allow popups for calendar links.');
    return;
  }
  showCopyFeedback('Calendar opened.');
}

function addToGoogleCalendar() {
  const snapshot = getCalendarSnapshot();
  if (!snapshot) {
    showCopyFeedback('Build the countdown first.');
    return;
  }
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', snapshot.title);
  url.searchParams.set(
    'dates',
    `${toIcsUtcStamp(snapshot.start)}/${toIcsUtcStamp(snapshot.end)}`
  );
  url.searchParams.set('details', snapshot.details);
  url.searchParams.set('ctz', getLocalTimeZone());
  openCalendarUrl(url.toString());
}

function addToOutlookCalendar() {
  const snapshot = getCalendarSnapshot();
  if (!snapshot) {
    showCopyFeedback('Build the countdown first.');
    return;
  }
  const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  url.searchParams.set('subject', snapshot.title);
  url.searchParams.set('body', snapshot.details);
  url.searchParams.set('startdt', toIsoNoMillis(snapshot.start));
  url.searchParams.set('enddt', toIsoNoMillis(snapshot.end));
  openCalendarUrl(url.toString());
}

function downloadIcsFile() {
  const snapshot = getCalendarSnapshot();
  if (!snapshot) {
    showCopyFeedback('Build the countdown first.');
    return;
  }

  const uid = `countdown-${snapshot.start.getTime()}@calchowmuch.com`;
  const nowStamp = toIcsUtcStamp(new Date());
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalcHowMuch//Countdown Timer//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${toIcsUtcStamp(snapshot.start)}`,
    `DTEND:${toIcsUtcStamp(snapshot.end)}`,
    `SUMMARY:${snapshot.title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${snapshot.details.replace(/\n/g, ' ')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = `${snapshot.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'event'}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(fileUrl);
  showCopyFeedback('.ics file downloaded.');
}

const defaultTarget = roundToMinute(new Date());
defaultTarget.setDate(defaultTarget.getDate() + 30);
defaultTarget.setHours(9, 0, 0, 0);
if (eventNameInput) {
  eventNameInput.value = EVENT_TYPES.launch.defaultName;
}
setTargetInputs(defaultTarget);

startButton?.addEventListener('click', () => calculate(true));
stopButton?.addEventListener('click', stopCountdown);
copySummaryButton?.addEventListener('click', async () => {
  await copyText(getActiveCountdownSnapshot(), 'Countdown summary copied.');
});
copyDateButton?.addEventListener('click', async () => {
  await copyText(getActiveDateSnapshot(), 'Event date copied.');
});
addGoogleButton?.addEventListener('click', addToGoogleCalendar);
addOutlookButton?.addEventListener('click', addToOutlookCalendar);
downloadIcsButton?.addEventListener('click', downloadIcsFile);
generateShareCardButton?.addEventListener('click', generateShareCard);
downloadSharePngButton?.addEventListener('click', downloadShareCardPng);
copyShareImageButton?.addEventListener('click', copyShareCardImage);

regionInput?.addEventListener('change', () => {
  populateRegionEventOptions();
  markPreviewStale();
});

regionEventInput?.addEventListener('change', () => {
  const eventId = regionEventInput.value;
  if (!eventId) {
    markPreviewStale();
    return;
  }
  applyStaticRegionEvent(eventId);
});

eventTypeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedEventType = button.dataset.eventType || 'launch';
    setSelectedButton(eventTypeButtons, selectedEventType, 'eventType');
    updateHolidayFieldVisibility();
    if (eventNameInput && !eventNameInput.value.trim()) {
      eventNameInput.placeholder = EVENT_TYPES[selectedEventType].defaultName;
    }
    markPreviewStale();
  });
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedTheme = button.dataset.theme || 'launch';
    setSelectedButton(themeButtons, selectedTheme, 'theme');
    markPreviewStale();
  });
});

[eventNameInput, dateTimeInput, fallbackDateInput, fallbackTimeInput].forEach((input) => {
  input?.addEventListener('input', () => {
    clearRegionEventSelection();
    markPreviewStale();
  });
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculate(true);
    }
  });
});

setSelectedButton(eventTypeButtons, selectedEventType, 'eventType');
setSelectedButton(themeButtons, selectedTheme, 'theme');
if (regionInput && !regionInput.value) {
  regionInput.value = 'United States';
}
populateRegionEventOptions();
updateHolidayFieldVisibility();
setPreviewWaitingState();
calculate(true);
