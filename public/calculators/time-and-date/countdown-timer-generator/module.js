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

const PRESETS = [
  {
    label: "New Year's Day",
    rule: { type: 'fixed', month: 0, day: 1 },
    eventType: 'holiday',
    theme: 'celebration',
  },
  {
    label: "Valentine's Day",
    rule: { type: 'fixed', month: 1, day: 14 },
    eventType: 'birthday',
    theme: 'celebration',
  },
  {
    label: 'Earth Day',
    rule: { type: 'fixed', month: 3, day: 22 },
    eventType: 'deadline',
    theme: 'travel',
  },
  {
    label: "Mother's Day",
    rule: { type: 'nthWeekday', month: 4, weekday: 0, nth: 2 },
    eventType: 'birthday',
    theme: 'celebration',
  },
  {
    label: "Father's Day",
    rule: { type: 'nthWeekday', month: 5, weekday: 0, nth: 3 },
    eventType: 'birthday',
    theme: 'celebration',
  },
  {
    label: 'Memorial Day',
    rule: { type: 'lastWeekday', month: 4, weekday: 1 },
    eventType: 'holiday',
    theme: 'focus',
  },
  {
    label: 'Independence Day',
    rule: { type: 'fixed', month: 6, day: 4 },
    eventType: 'holiday',
    theme: 'celebration',
  },
  {
    label: 'Labor Day',
    rule: { type: 'nthWeekday', month: 8, weekday: 1, nth: 1 },
    eventType: 'holiday',
    theme: 'focus',
  },
  {
    label: 'Halloween',
    rule: { type: 'fixed', month: 9, day: 31 },
    eventType: 'holiday',
    theme: 'celebration',
  },
  {
    label: 'Thanksgiving',
    rule: { type: 'nthWeekday', month: 10, weekday: 4, nth: 4 },
    eventType: 'holiday',
    theme: 'celebration',
  },
  {
    label: 'Christmas Eve',
    rule: { type: 'fixed', month: 11, day: 24 },
    eventType: 'holiday',
    theme: 'celebration',
  },
  {
    label: 'Christmas Day',
    rule: { type: 'fixed', month: 11, day: 25 },
    eventType: 'holiday',
    theme: 'celebration',
  },
  {
    label: "New Year's Eve",
    rule: { type: 'fixed', month: 11, day: 31 },
    eventType: 'holiday',
    theme: 'celebration',
  },
];

const HOLIDAY_PRESET_LABELS = new Set([
  "New Year's Day",
  'Memorial Day',
  'Independence Day',
  'Labor Day',
  'Halloween',
  'Thanksgiving',
  'Christmas Eve',
  'Christmas Day',
  "New Year's Eve",
]);

const dateTimeInput = document.querySelector('#countdown-datetime');
const dateTimeRow = document.querySelector('#countdown-datetime-row');
const eventNameInput = document.querySelector('#countdown-event-name');
const annualPresetInput = document.querySelector('#countdown-annual-preset');
const holidayPresetInput = document.querySelector('#countdown-holiday-preset');
const holidayField = document.querySelector('#countdown-holiday-field');
const fallbackWrap = document.querySelector('#countdown-fallback');
const fallbackDateInput = document.querySelector('#countdown-date');
const fallbackTimeInput = document.querySelector('#countdown-time');
const startButton = document.querySelector('#countdown-start');
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
const actionsWrap = document.querySelector('#countdown-actions');
const copySummaryButton = document.querySelector('#countdown-copy-summary');
const copyDateButton = document.querySelector('#countdown-copy-date');
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
      name: 'Can I use this for birthdays, launches, or trips?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. It works for any event where you want a clear live countdown.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this use my local time zone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. The countdown follows your device clock and local time zone.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I jump to common yearly dates quickly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. Open Presets and options and use Quick preset to fill the next upcoming occurrence for common annual dates and holidays.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens when the event time arrives?',
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
      name: 'Countdown Page Builder | Annual Dates and Holiday Presets',
      url: 'https://calchowmuch.com/time-and-date/countdown-timer-generator/',
      description:
        'Build a live countdown page for launches, deadlines, annual dates, holidays, birthdays, and trips.',
      inLanguage: 'en',
    },
  ],
};

const metadata = {
  title: 'Countdown Page Builder | Annual Dates and Holiday Presets',
  description:
    'Build a live countdown page for launches, deadlines, annual dates, holidays, birthdays, and trips.',
  canonical: 'https://calchowmuch.com/time-and-date/countdown-timer-generator/',
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
  if (title.tagName !== 'H1') {
    const h1 = document.createElement('h1');
    h1.id = 'calculator-title';
    h1.textContent = 'Countdown Page Builder';
    title.replaceWith(h1);
  } else {
    title.textContent = 'Countdown Page Builder';
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

function getSelectedTimeParts() {
  if (hasDateTimeSupport && dateTimeInput?.value) {
    const parsed = new Date(dateTimeInput.value);
    if (!Number.isNaN(parsed.getTime())) {
      return { hours: parsed.getHours(), minutes: parsed.getMinutes() };
    }
  }

  if (fallbackTimeInput?.value) {
    const time = parseTimeValue(fallbackTimeInput.value);
    if (time) {
      return time;
    }
  }

  return { hours: 9, minutes: 0 };
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
  const formatted = target.toLocaleString(undefined, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${formatted} (${getLocalTimeZone()})`;
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
      state.textContent = 'Event reached';
    } else if (typeof totalSeconds !== 'number') {
      state.textContent = 'Build the countdown to activate this marker';
    } else if (totalSeconds > milestone.thresholdSeconds) {
      state.textContent = 'Ahead of this milestone';
    } else if (totalSeconds > 0) {
      item.classList.add('is-live');
      state.textContent = 'Active now';
    } else {
      item.classList.add('is-passed');
      state.textContent = 'Passed';
    }

    item.append(label, state);
    milestonesWrap.appendChild(item);
  });
}

function setPreviewWaitingState() {
  previewCard?.setAttribute('data-theme', selectedTheme);
  if (previewBadge) {
    previewBadge.textContent = 'Waiting';
  }
  if (previewKicker) {
    previewKicker.textContent = `${EVENT_TYPES[selectedEventType].label} countdown`;
  }
  if (previewTitle) {
    previewTitle.textContent = 'Your event countdown';
  }
  if (previewDate) {
    previewDate.textContent = 'Enter a name and date, then press Start.';
  }
  if (previewSummary) {
    previewSummary.textContent = 'Keep one important moment visible.';
  }
  if (statusMessage) {
    statusMessage.textContent = 'Ready when you are.';
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

  const eventType = EVENT_TYPES[activeBuild.eventType];
  const eventName = activeBuild.eventName;

  previewCard?.setAttribute('data-theme', activeBuild.theme);
  if (previewKicker) {
    previewKicker.textContent = eventType.kicker;
  }
  if (previewBadge) {
    previewBadge.textContent = buildBadgeText(countdown, isComplete);
  }
  if (previewTitle) {
    previewTitle.textContent = eventName;
  }
  if (previewDate) {
    previewDate.textContent = formatTargetLabel(target);
  }
  if (previewSummary) {
    previewSummary.textContent = isComplete
      ? `${eventName} is happening now.`
      : `${formatCountdownSummary(countdown)} left until ${eventName}.`;
  }
  if (statusMessage) {
    statusMessage.textContent = isComplete
      ? 'The countdown has reached zero.'
      : 'Live preview updates every second in your local time zone.';
  }
  if (timezoneMessage) {
    timezoneMessage.textContent = `Local time zone: ${getLocalTimeZone()}`;
  }

  updateCountdownTiles(countdown);
  renderMilestones(countdown.totalSeconds, isComplete);
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
  if (!activeBuild) {
    return;
  }
  if (previewBadge) {
    previewBadge.textContent = 'Needs rebuild';
  }
  if (statusMessage) {
    statusMessage.textContent = 'Inputs changed. Click Build countdown to refresh the preview.';
  }
}

function getNthWeekday(year, month, weekday, nth) {
  const date = new Date(year, month, 1);
  const offset = (weekday - date.getDay() + 7) % 7;
  date.setDate(1 + offset + (nth - 1) * 7);
  return date;
}

function getLastWeekday(year, month, weekday) {
  const date = new Date(year, month + 1, 0);
  while (date.getDay() !== weekday) {
    date.setDate(date.getDate() - 1);
  }
  return date;
}

function buildPresetDate(preset, year, timeParts) {
  let date;
  if (preset.rule.type === 'fixed') {
    date = new Date(year, preset.rule.month, preset.rule.day, timeParts.hours, timeParts.minutes, 0, 0);
  } else if (preset.rule.type === 'nthWeekday') {
    date = getNthWeekday(year, preset.rule.month, preset.rule.weekday, preset.rule.nth);
    date.setHours(timeParts.hours, timeParts.minutes, 0, 0);
  } else {
    date = getLastWeekday(year, preset.rule.month, preset.rule.weekday);
    date.setHours(timeParts.hours, timeParts.minutes, 0, 0);
  }
  return date;
}

function getPresetByLabel(label, holidayOnly = false) {
  const normalized = (label || '').trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  return (
    PRESETS.find((preset) => {
      if (holidayOnly && !HOLIDAY_PRESET_LABELS.has(preset.label)) {
        return false;
      }
      return preset.label.toLowerCase() === normalized;
    }) || null
  );
}

function applyPreset(preset, source) {
  if (!preset) {
    return;
  }

  const timeParts = getSelectedTimeParts();
  const now = new Date();
  let target = buildPresetDate(preset, now.getFullYear(), timeParts);
  if (target.getTime() <= now.getTime()) {
    target = buildPresetDate(preset, now.getFullYear() + 1, timeParts);
  }

  eventNameInput && (eventNameInput.value = preset.label);
  setTargetInputs(target);

  selectedEventType = preset.eventType;
  selectedTheme = preset.theme;
  setSelectedButton(eventTypeButtons, selectedEventType, 'eventType');
  setSelectedButton(themeButtons, selectedTheme, 'theme');
  updateHolidayFieldVisibility();

  if (source === 'annual' && annualPresetInput) {
    annualPresetInput.value = preset.label;
  }
  if ((source === 'holiday' || preset.eventType === 'holiday') && holidayPresetInput) {
    holidayPresetInput.value = preset.label;
  }

  markPreviewStale();
}

function handlePresetInput(input, holidayOnly = false, source = 'annual') {
  const preset = getPresetByLabel(input?.value, holidayOnly);
  if (!preset) {
    return;
  }
  applyPreset(preset, source);
}

function calculate(startTimer = true) {
  clearError();
  clearCopyFeedback();

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

const defaultTarget = roundToMinute(new Date());
defaultTarget.setDate(defaultTarget.getDate() + 30);
defaultTarget.setHours(9, 0, 0, 0);
if (eventNameInput) {
  eventNameInput.value = EVENT_TYPES.launch.defaultName;
}
setTargetInputs(defaultTarget);

startButton?.addEventListener('click', () => calculate(true));
copySummaryButton?.addEventListener('click', async () => {
  await copyText(getActiveCountdownSnapshot(), 'Countdown summary copied.');
});
copyDateButton?.addEventListener('click', async () => {
  await copyText(getActiveDateSnapshot(), 'Event date copied.');
});

annualPresetInput?.addEventListener('input', () => handlePresetInput(annualPresetInput, false, 'annual'));
annualPresetInput?.addEventListener('change', () => handlePresetInput(annualPresetInput, false, 'annual'));
annualPresetInput?.addEventListener('blur', () => handlePresetInput(annualPresetInput, false, 'annual'));
holidayPresetInput?.addEventListener('input', () => handlePresetInput(holidayPresetInput, true, 'holiday'));
holidayPresetInput?.addEventListener('change', () => handlePresetInput(holidayPresetInput, true, 'holiday'));
holidayPresetInput?.addEventListener('blur', () => handlePresetInput(holidayPresetInput, true, 'holiday'));

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

[eventNameInput, dateTimeInput, fallbackDateInput, fallbackTimeInput, annualPresetInput, holidayPresetInput].forEach(
  (input) => {
    input?.addEventListener('input', markPreviewStale);
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        calculate(true);
      }
    });
  }
);

setSelectedButton(eventTypeButtons, selectedEventType, 'eventType');
setSelectedButton(themeButtons, selectedTheme, 'theme');
updateHolidayFieldVisibility();
setPreviewWaitingState();
