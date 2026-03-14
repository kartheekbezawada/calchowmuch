import { setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { calculateDaysUntil } from '/assets/js/core/date-diff-utils.js';

const doc = typeof document !== 'undefined' ? document : null;
const query = (selector) => doc?.querySelector(selector) ?? null;

const dateInput = query('#days-until-date');
const startDateInput = query('#days-until-start-date');
const presetInput = query('#days-until-preset');
const includeEndInput = query('#days-until-include-end');
const businessDaysInput = query('#days-until-business-days');
const calculateButton = query('#days-until-calculate');
const resetButton = query('#days-until-reset');
const errorMessage = query('#days-until-error');
const timezoneMeta = query('#days-until-timezone');
const todayMeta = query('#days-until-today');
const resultKicker = query('#days-until-result-kicker');
const resultValue = query('#days-until-result-value');
const resultUnit = query('#days-until-result-unit');
const resultSummary = query('#days-until-result-summary');
const clarification = query('#days-until-clarification');
const breakdownWrap = query('#days-until-breakdown');
const statusWrap = query('#days-until-status');
const milestonesWrap = query('#days-until-milestones');
const milestonesSection = query('#days-until-milestones-wrap');
const actionsWrap = query('#days-until-actions');
const feedback = query('#days-until-copy-feedback');
const startWrap = query('#days-until-start-wrap');
const modeButtons = Array.from(doc?.querySelectorAll('[data-mode]') ?? []);
const copySummaryButton = query('#days-until-copy-summary');
const copyDatesButton = query('#days-until-copy-dates');
const addGoogleButton = query('#days-until-add-google');
const addOutlookButton = query('#days-until-add-outlook');
const downloadIcsButton = query('#days-until-download-ics');
const generateShareCardButton = query('#days-until-generate-share-card');
const downloadSharePngButton = query('#days-until-download-share-png');
const copyShareImageButton = query('#days-until-copy-share-image');

const PRESET_LABELS = {
  'next-7': 'In 7 days',
  'next-30': 'In 30 days',
  'next-weekend': 'Next weekend',
  'end-of-month': 'End of this month',
  'first-next-month': 'First day of next month',
  'new-year': 'Next New Year',
};

const MARKERS = [
  { label: 'Tomorrow', threshold: 1 },
  { label: '7 days', threshold: 7 },
  { label: '30 days', threshold: 30 },
  { label: '90 days', threshold: 90 },
];

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I use this for past dates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The result automatically switches to days since the selected date.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does weekdays only mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It excludes Saturdays and Sundays and gives a workweek-style count.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does include both dates do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It adds the start date into the count, which is useful for itinerary or schedule planning.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share the result?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can copy the summary, copy the dates, export to calendar, or create a share card image.',
      },
    },
  ],
};

const metadata = {
  title: 'Days Until Date Calculator | Business Days, Date Range, and Share Tools',
  description:
    'Calculate days until, days since, business days, and custom date ranges with presets, planning breakdowns, and share tools.',
  canonical: 'https://calchowmuch.com/time-and-date/days-until-a-date-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
};

if (doc) {
  setPageMetadata(metadata);
}

export function getDateOnlyToday(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateInput(value) {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function addDays(date, days) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

function formatLongDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatShortDate(date) {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time';
}

function formatCount(value, label) {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} ${label}${value === 1 ? '' : 's'}`;
}

function getNextWeekend(anchorDate) {
  const day = anchorDate.getDay();
  let diff = (6 - day + 7) % 7;
  if (diff === 0) {
    diff = 7;
  }
  return addDays(anchorDate, diff);
}

export function resolvePresetDate(presetKey, anchorDate) {
  switch (presetKey) {
    case 'next-7':
      return addDays(anchorDate, 7);
    case 'next-30':
      return addDays(anchorDate, 30);
    case 'next-weekend':
      return getNextWeekend(anchorDate);
    case 'end-of-month':
      return new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);
    case 'first-next-month':
      return new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1);
    case 'new-year':
      return new Date(anchorDate.getFullYear() + 1, 0, 1);
    default:
      return null;
  }
}

export function countWeekdaysInRange(
  startDate,
  endDate,
  { includeStart = false, includeEnd = true } = {}
) {
  if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
    return null;
  }
  if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
    return null;
  }

  if (startDate.getTime() === endDate.getTime()) {
    if (!(includeStart && includeEnd)) {
      return 0;
    }
    const isWeekday = startDate.getDay() !== 0 && startDate.getDay() !== 6;
    return isWeekday ? 1 : 0;
  }

  const isForward = startDate.getTime() < endDate.getTime();
  const from = isForward ? startDate : endDate;
  const to = isForward ? endDate : startDate;
  let current = includeStart ? new Date(from.getTime()) : addDays(from, 1);
  let count = 0;

  while (current.getTime() < to.getTime() || (includeEnd && current.getTime() === to.getTime())) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
    current = addDays(current, 1);
  }

  return isForward ? count : -count;
}

function getAdjustedSignedDays(rawDiff, includeBothDates) {
  if (!includeBothDates) {
    return rawDiff;
  }
  if (rawDiff === 0) {
    return 1;
  }
  return rawDiff > 0 ? rawDiff + 1 : rawDiff - 1;
}

function buildStatusChips({
  direction,
  mode,
  includeBothDates,
  useBusinessDays,
  targetDate,
  absoluteCalendarDays,
}) {
  const chips = [];
  chips.push(mode === 'range' ? 'Custom range' : 'From today');
  chips.push(direction === 'future' ? 'Future date' : direction === 'past' ? 'Past date' : 'Same day');
  chips.push(useBusinessDays ? 'Weekdays only' : 'Calendar days');
  if (includeBothDates) {
    chips.push('Inclusive count');
  }
  chips.push(targetDate.getDay() === 0 || targetDate.getDay() === 6 ? 'Weekend target' : 'Weekday target');
  if (direction === 'future' && absoluteCalendarDays === 1) {
    chips.push('Tomorrow');
  } else if (direction === 'future' && absoluteCalendarDays <= 7) {
    chips.push('This week');
  } else if (direction === 'future' && absoluteCalendarDays <= 30) {
    chips.push('This month');
  }
  return chips;
}

function buildMilestoneData(direction, absoluteCalendarDays) {
  return MARKERS.map((item) => {
    let state = 'Ahead';
    if (direction === 'today') {
      state = item.threshold === 1 ? 'Live now' : 'Ahead';
    } else if (direction === 'future') {
      state = absoluteCalendarDays <= item.threshold ? 'Inside range' : 'Ahead';
    } else {
      state = absoluteCalendarDays <= item.threshold ? 'Recently passed' : 'Passed';
    }
    return { ...item, state };
  });
}

export function calculateDatePlan({
  startDate,
  targetDate,
  includeBothDates = false,
  useBusinessDays = false,
  mode = 'today',
}) {
  if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
    return null;
  }
  if (!(targetDate instanceof Date) || Number.isNaN(targetDate.getTime())) {
    return null;
  }

  const rawDiff = calculateDaysUntil(targetDate, startDate);
  if (rawDiff === null) {
    return null;
  }

  const signedCalendarDays = getAdjustedSignedDays(rawDiff, includeBothDates);
  const absoluteCalendarDays = Math.abs(signedCalendarDays);
  const signedBusinessDays = countWeekdaysInRange(startDate, targetDate, {
    includeStart: includeBothDates,
    includeEnd: true,
  });
  const absoluteBusinessDays = Math.abs(signedBusinessDays ?? 0);
  const primaryValue = useBusinessDays ? absoluteBusinessDays : absoluteCalendarDays;
  const primaryUnit = useBusinessDays
    ? primaryValue === 1
      ? 'business day'
      : 'business days'
    : primaryValue === 1
      ? 'day'
      : 'days';
  const direction = rawDiff > 0 ? 'future' : rawDiff < 0 ? 'past' : 'today';
  const weeks = Math.floor(absoluteCalendarDays / 7);
  const remainingDays = absoluteCalendarDays % 7;
  const approxMonths = absoluteCalendarDays >= 30 ? (absoluteCalendarDays / 30.44).toFixed(1) : null;
  const approxYears = absoluteCalendarDays >= 365 ? (absoluteCalendarDays / 365.25).toFixed(1) : null;
  const startLabel = formatLongDate(startDate);
  const targetLabel = formatLongDate(targetDate);
  let kicker = 'Date result';
  let summary = `Target date: ${targetLabel}`;
  let clarificationText = `That's ${formatCount(absoluteCalendarDays, 'calendar day')}.`;

  if (direction === 'future') {
    kicker = useBusinessDays ? 'Weekdays until target' : 'Days until target';
    summary =
      mode === 'range'
        ? `From ${formatShortDate(startDate)} to ${formatShortDate(targetDate)}.`
        : `Target date: ${targetLabel}.`;
    clarificationText = useBusinessDays
      ? `${formatCount(absoluteBusinessDays, 'business day')} and ${formatCount(
          absoluteCalendarDays,
          'calendar day'
        )}${includeBothDates ? ', including both dates.' : '.'}`
      : `${formatCount(absoluteCalendarDays, 'calendar day')}${
          includeBothDates ? ', including both dates.' : '.'
        }`;
  } else if (direction === 'past') {
    kicker = useBusinessDays ? 'Weekdays since target' : 'Days since target';
    summary =
      mode === 'range'
        ? `From ${formatShortDate(startDate)} back to ${formatShortDate(targetDate)}.`
        : `Selected date: ${targetLabel}.`;
    clarificationText = useBusinessDays
      ? `${formatCount(absoluteBusinessDays, 'business day')} and ${formatCount(
          absoluteCalendarDays,
          'calendar day'
        )} have passed${includeBothDates ? ', including both dates.' : '.'}`
      : `${formatCount(absoluteCalendarDays, 'calendar day')} have passed${
          includeBothDates ? ', including both dates.' : '.'
        }`;
  } else {
    kicker = includeBothDates ? 'Same-day inclusive result' : 'That date is today';
    summary = mode === 'range' ? `Both selected dates land on ${targetLabel}.` : 'The target date is today.';
    clarificationText = includeBothDates
      ? 'Inclusive count treats the same day as 1 day.'
      : 'No full days separate the selected dates.';
  }

  const shareSummary =
    direction === 'future'
      ? `${formatCount(primaryValue, useBusinessDays ? 'business day' : 'day')} until ${targetLabel}. ${clarificationText}`
      : direction === 'past'
        ? `${formatCount(primaryValue, useBusinessDays ? 'business day' : 'day')} since ${targetLabel}. ${clarificationText}`
        : clarificationText;

  return {
    direction,
    mode,
    includeBothDates,
    useBusinessDays,
    startDate,
    targetDate,
    startLabel,
    targetLabel,
    primaryValue,
    primaryUnit,
    kicker,
    summary,
    clarificationText,
    absoluteCalendarDays,
    absoluteBusinessDays,
    weeks,
    remainingDays,
    approxMonths,
    approxYears,
    weekdayLabel: targetDate.toLocaleDateString(undefined, { weekday: 'long' }),
    statusChips: buildStatusChips({
      direction,
      mode,
      includeBothDates,
      useBusinessDays,
      targetDate,
      absoluteCalendarDays,
    }),
    milestones: buildMilestoneData(direction, absoluteCalendarDays),
    shareSummary,
  };
}

let selectedMode = 'today';
let resultState = null;
let shareCardCache = null;

function ensureH1Title() {
  const title = query('#calculator-title');
  if (!title) {
    return;
  }
  const desired = 'Days Until Date Calculator';
  if (title.tagName !== 'H1') {
    const h1 = doc.createElement('h1');
    h1.id = 'calculator-title';
    h1.textContent = desired;
    title.replaceWith(h1);
  } else {
    title.textContent = desired;
  }
}

function setSelectedMode(nextMode) {
  selectedMode = nextMode;
  modeButtons.forEach((button) => {
    const isSelected = button.dataset.mode === nextMode;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
  startWrap?.classList.toggle('is-hidden', nextMode !== 'range');
}

function clearError() {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = '';
  errorMessage.classList.add('is-hidden');
}

function showError(message) {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
}

function clearFeedback() {
  if (!feedback) {
    return;
  }
  feedback.textContent = '';
  feedback.classList.add('is-hidden');
}

function showFeedback(message) {
  if (!feedback) {
    return;
  }
  feedback.textContent = message;
  feedback.classList.remove('is-hidden');
}

function clearShareCardCache() {
  shareCardCache = null;
}

function renderBreakdown(result) {
  if (!breakdownWrap) {
    return;
  }
  breakdownWrap.innerHTML = '';
  const cards = [
    {
      label: 'Calendar days',
      value: formatNumber(result.absoluteCalendarDays, { maximumFractionDigits: 0 }),
    },
    {
      label: 'Business days',
      value: formatNumber(result.absoluteBusinessDays, { maximumFractionDigits: 0 }),
    },
    {
      label: 'Weeks + days',
      value: result.weeks > 0 ? `${result.weeks}w ${result.remainingDays}d` : `${result.remainingDays}d`,
    },
    result.approxYears
      ? { label: 'Approx years', value: result.approxYears }
      : result.approxMonths
        ? { label: 'Approx months', value: result.approxMonths }
        : { label: 'Target weekday', value: result.weekdayLabel },
    {
      label: 'Target date',
      value: result.targetLabel,
    },
  ];

  cards.forEach((card) => {
    const item = doc.createElement('article');
    item.className = 'du-breakdown-card';

    const label = doc.createElement('p');
    label.className = 'du-breakdown-label';
    label.textContent = card.label;

    const value = doc.createElement('p');
    value.className = 'du-breakdown-value';
    value.textContent = card.value;

    item.append(label, value);
    breakdownWrap.appendChild(item);
  });
}

function renderStatusChips(chips) {
  if (!statusWrap) {
    return;
  }
  statusWrap.innerHTML = '';
  chips.forEach((chip) => {
    const item = doc.createElement('span');
    item.className = 'du-status-chip';
    item.textContent = chip;
    statusWrap.appendChild(item);
  });
}

function renderMilestones(result) {
  if (!milestonesWrap || !milestonesSection) {
    return;
  }
  milestonesWrap.innerHTML = '';

  result.milestones.forEach((milestone) => {
    const item = doc.createElement('article');
    item.className = 'du-milestone-card';

    const label = doc.createElement('p');
    label.className = 'du-milestone-label';
    label.textContent = milestone.label;

    const state = doc.createElement('p');
    state.className = 'du-milestone-state';
    state.textContent = milestone.state;

    item.append(label, state);
    milestonesWrap.appendChild(item);
  });

  milestonesSection.classList.remove('is-hidden');
}

function renderWaitingState() {
  resultKicker && (resultKicker.textContent = 'Date result');
  resultValue && (resultValue.textContent = '--');
  resultUnit && (resultUnit.textContent = 'days');
  resultSummary && (resultSummary.textContent = 'Choose a target date to see the date plan.');
  clarification && (clarification.textContent = 'The result updates using your local date.');
  if (statusWrap) {
    statusWrap.innerHTML = '';
  }
  if (breakdownWrap) {
    breakdownWrap.innerHTML = '';
  }
  if (milestonesWrap) {
    milestonesWrap.innerHTML = '';
  }
  milestonesSection?.classList.add('is-hidden');
  actionsWrap?.classList.add('is-hidden');
  resultState = null;
  clearShareCardCache();
}

function renderResult(result) {
  resultState = result;
  clearShareCardCache();
  resultKicker && (resultKicker.textContent = result.kicker);
  resultValue &&
    (resultValue.textContent = formatNumber(result.primaryValue, {
      maximumFractionDigits: 0,
    }));
  resultUnit && (resultUnit.textContent = result.primaryUnit);
  resultSummary && (resultSummary.textContent = result.summary);
  clarification && (clarification.textContent = result.clarificationText);
  renderStatusChips(result.statusChips);
  renderBreakdown(result);
  renderMilestones(result);
  actionsWrap?.classList.remove('is-hidden');
}

function getAnchorDate() {
  return selectedMode === 'range'
    ? parseDateInput(startDateInput?.value || '')
    : getDateOnlyToday();
}

function updateMetaLines() {
  const today = getDateOnlyToday();
  timezoneMeta && (timezoneMeta.textContent = `Local time zone: ${getLocalTimeZone()}`);
  todayMeta && (todayMeta.textContent = `Today: ${formatLongDate(today)}`);
}

function calculateAndRender() {
  clearError();
  clearFeedback();

  const anchorDate = getAnchorDate();
  const targetDate = parseDateInput(dateInput?.value || '');
  if (!anchorDate || !targetDate) {
    showError('Choose valid dates first.');
    renderWaitingState();
    return null;
  }

  const result = calculateDatePlan({
    startDate: anchorDate,
    targetDate,
    includeBothDates: Boolean(includeEndInput?.checked),
    useBusinessDays: Boolean(businessDaysInput?.checked),
    mode: selectedMode,
  });

  if (!result) {
    showError('Could not calculate the selected date range.');
    renderWaitingState();
    return null;
  }

  renderResult(result);
  return result;
}

function applyPreset(presetKey) {
  if (!presetKey || !dateInput) {
    return;
  }
  const anchorDate = getAnchorDate() || getDateOnlyToday();
  const target = resolvePresetDate(presetKey, anchorDate);
  if (!target) {
    return;
  }
  dateInput.value = formatDateValue(target);
}

function resetCalculator() {
  const today = getDateOnlyToday();
  setSelectedMode('today');
  startDateInput && (startDateInput.value = formatDateValue(today));
  dateInput && (dateInput.value = formatDateValue(addDays(today, 30)));
  presetInput && (presetInput.value = '');
  includeEndInput && (includeEndInput.checked = false);
  businessDaysInput && (businessDaysInput.checked = false);
  clearError();
  clearFeedback();
  calculateAndRender();
}

async function copyText(text, successMessage) {
  if (!text) {
    showFeedback('Calculate the result first.');
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const helper = doc.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', 'true');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      doc.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    showFeedback(successMessage);
  } catch (error) {
    showFeedback('Copy failed on this device.');
  }
}

function getSummarySnapshot() {
  if (!resultState) {
    return null;
  }
  return resultState.shareSummary;
}

function getDatesSnapshot() {
  if (!resultState) {
    return null;
  }
  return selectedMode === 'range'
    ? `From ${resultState.startLabel} to ${resultState.targetLabel}`
    : `Today to ${resultState.targetLabel}`;
}

function getCalendarSnapshot() {
  if (!resultState) {
    return null;
  }
  const start = new Date(
    resultState.targetDate.getFullYear(),
    resultState.targetDate.getMonth(),
    resultState.targetDate.getDate(),
    9,
    0,
    0,
    0
  );
  const end = addDays(start, 1);
  return {
    title: `Date plan: ${formatShortDate(resultState.targetDate)}`,
    start,
    end,
    details: resultState.shareSummary,
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
    showFeedback('Popup blocked. Allow popups for calendar links.');
    return;
  }
  showFeedback('Calendar opened.');
}

function addToGoogleCalendar() {
  const snapshot = getCalendarSnapshot();
  if (!snapshot) {
    showFeedback('Calculate the result first.');
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
    showFeedback('Calculate the result first.');
    return;
  }
  const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  url.searchParams.set('subject', snapshot.title);
  url.searchParams.set('body', snapshot.details);
  url.searchParams.set('startdt', toIsoNoMillis(snapshot.start));
  url.searchParams.set('enddt', toIsoNoMillis(snapshot.end));
  openCalendarUrl(url.toString());
}

function downloadBlob(blob, filename) {
  const fileUrl = URL.createObjectURL(blob);
  const link = doc.createElement('a');
  link.href = fileUrl;
  link.download = filename;
  doc.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(fileUrl);
}

function downloadIcsFile() {
  const snapshot = getCalendarSnapshot();
  if (!snapshot) {
    showFeedback('Calculate the result first.');
    return;
  }

  const uid = `date-plan-${snapshot.start.getTime()}@calchowmuch.com`;
  const nowStamp = toIcsUtcStamp(new Date());
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalcHowMuch//Date Calculator//EN',
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
  downloadBlob(blob, `date-plan-${formatDateValue(resultState.targetDate)}.ics`);
  showFeedback('.ics file downloaded.');
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

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  });

  if (current) {
    lines.push(current);
  }

  const limited = lines.slice(0, Math.max(1, maxLines));
  limited.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
  return y + limited.length * lineHeight;
}

function getShareCardSnapshot() {
  if (!resultState) {
    return null;
  }
  return {
    title: selectedMode === 'range' ? 'Date Range Plan' : 'Days Until Plan',
    result: `${formatNumber(resultState.primaryValue, { maximumFractionDigits: 0 })} ${resultState.primaryUnit}`,
    summary: resultState.summary,
    targetLabel: resultState.targetLabel,
    clarification: resultState.clarificationText,
    timezone: getLocalTimeZone(),
  };
}

function renderShareCardBlob(snapshot) {
  const canvas = doc.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext('2d');
  if (!context) {
    return Promise.reject(new Error('Canvas not available.'));
  }

  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, '#f7fafc');
  background.addColorStop(1, '#e9f1ff');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawRoundedRect(context, 62, 58, 1076, 514, 28);
  const cardGradient = context.createLinearGradient(62, 58, 1138, 572);
  cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
  cardGradient.addColorStop(1, 'rgba(244, 248, 255, 0.98)');
  context.fillStyle = cardGradient;
  context.fill();
  context.strokeStyle = 'rgba(38, 98, 220, 0.18)';
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = '#2b5fd9';
  context.font = "700 26px 'DM Sans', 'Segoe UI', sans-serif";
  context.fillText(snapshot.title.toUpperCase(), 110, 130);

  context.fillStyle = '#111827';
  context.font = "700 84px 'DM Serif Display', Georgia, serif";
  context.fillText(snapshot.result, 110, 252);

  context.fillStyle = '#3f5478';
  context.font = "600 30px 'DM Sans', 'Segoe UI', sans-serif";
  const summaryBottom = drawWrappedText(context, snapshot.summary, 110, 320, 920, 40, 2);

  context.fillStyle = '#5b6f92';
  context.font = "500 26px 'DM Sans', 'Segoe UI', sans-serif";
  context.fillText(`Target: ${snapshot.targetLabel}`, 110, summaryBottom + 40);
  context.fillText(snapshot.clarification, 110, summaryBottom + 86);
  context.fillText(`Local time zone: ${snapshot.timezone}`, 110, summaryBottom + 132);

  context.fillStyle = '#2b5fd9';
  context.font = "600 24px 'DM Sans', 'Segoe UI', sans-serif";
  context.fillText('Generated on CalcHowMuch', 110, 540);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('PNG generation failed.'));
      }
    }, 'image/png');
  });
}

function getShareCardKey(snapshot) {
  return [snapshot.title, snapshot.result, snapshot.summary, snapshot.targetLabel].join('|');
}

async function ensureShareCardBlob() {
  const snapshot = getShareCardSnapshot();
  if (!snapshot) {
    showFeedback('Calculate the result first.');
    return null;
  }
  const key = getShareCardKey(snapshot);
  if (shareCardCache?.key === key && shareCardCache.blob) {
    return { blob: shareCardCache.blob, snapshot };
  }
  const blob = await renderShareCardBlob(snapshot);
  shareCardCache = { key, blob };
  return { blob, snapshot };
}

async function generateShareCard() {
  try {
    const payload = await ensureShareCardBlob();
    if (!payload) {
      return;
    }
    showFeedback('Share card generated.');
  } catch (error) {
    showFeedback('Could not generate share card.');
  }
}

async function downloadShareCard() {
  try {
    const payload = await ensureShareCardBlob();
    if (!payload) {
      return;
    }
    downloadBlob(payload.blob, `date-plan-${formatDateValue(resultState.targetDate)}.png`);
    showFeedback('Share card PNG downloaded.');
  } catch (error) {
    showFeedback('Could not download share card.');
  }
}

async function copyShareCardImage() {
  try {
    const payload = await ensureShareCardBlob();
    if (!payload) {
      return;
    }
    if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': payload.blob })]);
      showFeedback('Share card image copied.');
      return;
    }
    await copyText(getSummarySnapshot(), 'Image copy not supported. Summary copied instead.');
  } catch (error) {
    showFeedback('Could not copy share card image.');
  }
}

function bindEvents() {
  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setSelectedMode(button.dataset.mode || 'today');
      clearShareCardCache();
      if (presetInput) {
        presetInput.value = '';
      }
      calculateAndRender();
    });
  });

  presetInput?.addEventListener('change', () => {
    applyPreset(presetInput.value);
    calculateAndRender();
  });

  [dateInput, startDateInput, includeEndInput, businessDaysInput].forEach((input) => {
    input?.addEventListener('change', calculateAndRender);
  });

  dateInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculateAndRender();
    }
  });

  startDateInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculateAndRender();
    }
  });

  calculateButton?.addEventListener('click', calculateAndRender);
  resetButton?.addEventListener('click', resetCalculator);
  copySummaryButton?.addEventListener('click', async () => {
    await copyText(getSummarySnapshot(), 'Summary copied.');
  });
  copyDatesButton?.addEventListener('click', async () => {
    await copyText(getDatesSnapshot(), 'Dates copied.');
  });
  addGoogleButton?.addEventListener('click', addToGoogleCalendar);
  addOutlookButton?.addEventListener('click', addToOutlookCalendar);
  downloadIcsButton?.addEventListener('click', downloadIcsFile);
  generateShareCardButton?.addEventListener('click', generateShareCard);
  downloadSharePngButton?.addEventListener('click', downloadShareCard);
  copyShareImageButton?.addEventListener('click', copyShareCardImage);
}

if (doc) {
  ensureH1Title();
  updateMetaLines();
  const today = getDateOnlyToday();
  startDateInput && (startDateInput.value = formatDateValue(today));
  dateInput && (dateInput.value = formatDateValue(addDays(today, 30)));
  setSelectedMode('today');
  bindEvents();
  calculateAndRender();
}
