import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildWeekCycle,
  buildWeekRangeLabel,
  calculateNightOvertime,
  formatDateShort,
  formatDecimalHours,
  formatHHMM,
  getNightOverlapMinutes,
  getSegmentMinutes,
  parseTimeString,
  ROUNDING_OPTIONS,
  splitDailyOvertime,
  splitDailyWeeklyOvertime,
  splitWeeklyOvertime,
  WEEK_DAYS,
} from '/assets/js/core/overtime-utils.js';

const modeGroup = document.querySelector('[data-button-group="overtime-mode"]');
const ruleGroup = document.querySelector('[data-button-group="overtime-rule"]');
const roundingGroup = document.querySelector('[data-button-group="overtime-rounding"]');
const breakGroup = document.querySelector('[data-button-group="overtime-break"]');
const breakRow = document.querySelector('#overtime-break-label')?.closest('.input-row');

const singleSection = document.querySelector('#overtime-single');
const splitSection = document.querySelector('#overtime-split');
const weeklySection = document.querySelector('#overtime-weekly');

const singleStartInput = document.querySelector('#overtime-single-start');
const singleEndInput = document.querySelector('#overtime-single-end');
const singleNextDayInput = document.querySelector('#overtime-single-next-day');

const splitStartInput = document.querySelector('#overtime-split-1-start');
const splitEndInput = document.querySelector('#overtime-split-1-end');
const splitNextDayInput = document.querySelector('#overtime-split-1-next-day');
const split2StartInput = document.querySelector('#overtime-split-2-start');
const split2EndInput = document.querySelector('#overtime-split-2-end');
const split2NextDayInput = document.querySelector('#overtime-split-2-next-day');

const dailyLimitInput = document.querySelector('#overtime-daily-limit');
const weeklyLimitInput = document.querySelector('#overtime-weekly-limit');

const nightToggle = document.querySelector('#overtime-night-toggle');
const nightSettings = document.querySelector('#overtime-night-settings');
const nightStartInput = document.querySelector('#overtime-night-start');
const nightEndInput = document.querySelector('#overtime-night-end');
const nightCrossesInput = document.querySelector('#overtime-night-crosses');

const weekStartGroup = document.querySelector('[data-button-group="overtime-week-start"]');
const weekStartDateInput = document.querySelector('#overtime-week-start-date');
const weeklyRows = Array.from(document.querySelectorAll('[data-weekly-index]')).map((row) => ({
  label: row.querySelector('[data-weekly-label]'),
  startInput: row.querySelector('[data-weekly-start]'),
  endInput: row.querySelector('[data-weekly-end]'),
  nextDayInput: row.querySelector('[data-weekly-next-day]'),
  breakGroup: setupButtonGroup(row.querySelector('[data-weekly-break]'), {
    defaultValue: '0',
    onChange: () => calculate({ showErrors: hasCalculated }),
  }),
}));

const calculateButton = document.querySelector('#overtime-calculate');
const resultsList = document.querySelector('#overtime-results-list');
const placeholder = document.querySelector('#overtime-placeholder');
const errorMessage = document.querySelector('#overtime-error');

const placeholderElements = Array.from(document.querySelectorAll('[data-placeholder]')).reduce(
  (acc, element) => {
    const key = element.dataset.placeholder;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(element);
    return acc;
  },
  {}
);

const metadata = {
  title: 'Overtime Hours Calculator – Regular Hours vs Overtime (Daily & Weekly)',
  description:
    'Calculate total work hours and split them into regular and overtime hours. Supports single shifts, split shifts, custom weekly cycles, night shifts, and night overtime.',
  canonical: 'https://calchowmuch.com/time-and-date/overtime-hours-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the difference between regular hours and overtime hours?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Regular hours are counted up to your limit. Overtime hours are the remaining hours above that limit.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which overtime rule should I choose?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Use the rule that matches your timesheet policy. If you only have a weekly limit, choose Weekly. If you track overtime per day, choose Daily. If both are relevant, choose Daily + Weekly.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does “Daily + Weekly” avoid double counting overtime?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'The calculator computes daily overtime and weekly overtime, then uses the larger overtime result as the final overtime amount so overtime is counted once.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I calculate overtime for split shifts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. Split shifts add segments together for the day, subtract the break once, and then apply the overtime rule.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does “Ends next day” do?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It treats the end time as the next day so night shifts are counted correctly.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is night overtime in this calculator?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Night overtime is a classification of overtime that occurs during your night window. It does not calculate pay rates.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does this calculator round time the way my employer does?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'It can. Choose the rounding option that matches your policy. If your employer uses a different rounding method, results may differ.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I set a custom week like Sunday–Saturday or Friday–Thursday?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. Choose the week start day in weekly mode. The calculator treats the next 6 days as the rest of your week.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does the calculator save my hours?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. It runs in your browser and does not store your inputs.',
            },
          },
        ],
      },
      {
        '@type': 'WebPage',
        name: 'Overtime Hours Calculator',
        description:
          'Calculate total work hours and split them into regular and overtime hours. Supports single shifts, split shifts, custom weekly cycles, night shifts, and night overtime.',
        url: 'https://calchowmuch.com/time-and-date/overtime-hours-calculator/',
      },
    ],
  },
};

setPageMetadata(metadata);

function ensureH1Title() {
  const title = document.getElementById('calculator-title');
  if (!title || title.tagName === 'H1') {
    return;
  }
  const h1 = document.createElement('h1');
  h1.id = 'calculator-title';
  h1.textContent = 'Overtime Hours Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'single',
  onChange: (value) => {
    updateModeVisibility(value);
    calculate({ showErrors: hasCalculated });
  },
});

const ruleButtons = setupButtonGroup(ruleGroup, {
  defaultValue: 'weekly',
  onChange: () => calculate({ showErrors: hasCalculated }),
});

const roundingButtons = setupButtonGroup(roundingGroup, {
  defaultValue: '0',
  onChange: () => calculate({ showErrors: hasCalculated }),
});

const breakButtons = setupButtonGroup(breakGroup, {
  defaultValue: '30',
  onChange: () => calculate({ showErrors: hasCalculated }),
});

const weekStartButtons = setupButtonGroup(weekStartGroup, {
  defaultValue: '1',
  onChange: () => {
    updateWeekLabels();
    calculate({ showErrors: hasCalculated });
  },
});

let hasCalculated = false;

function setPlaceholder(key, value) {
  const nodes = placeholderElements[key] || [];
  nodes.forEach((node) => {
    node.textContent = value;
  });
}

function setDefaultSummary({
  modeLabel,
  ruleLabel,
  roundingLabel,
  dailyLimit,
  weeklyLimit,
  weekRangeLabel,
  breakMinutes,
}) {
  setPlaceholder('mode', modeLabel);
  setPlaceholder('ot-rule-label', ruleLabel);
  setPlaceholder('rounding', roundingLabel);
  setPlaceholder('daily-limit', dailyLimit ?? '—');
  setPlaceholder('weekly-limit', weeklyLimit ?? '—');
  setPlaceholder('week-range-label', weekRangeLabel ?? '—');
  setPlaceholder('break-minutes', breakMinutes ?? '—');
  setPlaceholder('total-hhmm', '—');
  setPlaceholder('regular-hhmm', '—');
  setPlaceholder('ot-hhmm', '—');
  setPlaceholder('total-decimal', '—');
  setPlaceholder('night-hhmm', '—');
  setPlaceholder('night-ot-hhmm', '—');
}

function setResultSummary({
  totalMinutes,
  regularMinutes,
  overtimeMinutes,
  totalDecimal,
  breakMinutes,
  nightMinutes,
  nightOvertimeMinutes,
}) {
  setPlaceholder('total-hhmm', formatHHMM(totalMinutes));
  setPlaceholder('regular-hhmm', formatHHMM(regularMinutes));
  setPlaceholder('ot-hhmm', formatHHMM(overtimeMinutes));
  setPlaceholder('total-decimal', totalDecimal);
  setPlaceholder('break-minutes', String(breakMinutes));
  setPlaceholder('night-hhmm', nightMinutes !== null ? formatHHMM(nightMinutes) : '—');
  setPlaceholder('night-ot-hhmm', nightOvertimeMinutes !== null ? formatHHMM(nightOvertimeMinutes) : '—');
}

function updateModeVisibility(mode) {
  if (singleSection) {
    singleSection.classList.toggle('is-collapsed', mode !== 'single');
    singleSection.setAttribute('aria-hidden', String(mode !== 'single'));
  }
  if (splitSection) {
    splitSection.classList.toggle('is-collapsed', mode !== 'split');
    splitSection.setAttribute('aria-hidden', String(mode !== 'split'));
  }
  if (weeklySection) {
    weeklySection.classList.toggle('is-collapsed', mode !== 'weekly');
    weeklySection.setAttribute('aria-hidden', String(mode !== 'weekly'));
  }
  if (breakRow) {
    breakRow.classList.toggle('is-collapsed', mode === 'weekly');
  }
}

updateModeVisibility(modeButtons?.getValue() ?? 'single');

function getLimitValue(input, fallback, min, max) {
  const raw = input?.value?.trim() ?? '';
  if (!raw) {
    return { value: fallback, valid: true };
  }
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) {
    return { value: null, valid: false };
  }
  if (parsed < min || parsed > max) {
    return { value: null, valid: false };
  }
  if (Math.round(parsed * 2) !== parsed * 2) {
    return { value: null, valid: false };
  }
  return { value: parsed, valid: true };
}

function getRoundingInterval() {
  const value = Number.parseInt(roundingButtons?.getValue() ?? '0', 10);
  if (ROUNDING_OPTIONS.includes(value)) {
    return value;
  }
  return 0;
}

function getBreakMinutes() {
  const value = Number.parseInt(breakButtons?.getValue() ?? '30', 10);
  return Number.isFinite(value) ? value : 30;
}

function getNightWindow() {
  const start = parseTimeString(nightStartInput?.value ?? '');
  const end = parseTimeString(nightEndInput?.value ?? '');
  if (!start || !end) {
    return null;
  }
  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;
  const crosses = nightCrossesInput?.checked || endMinutes < startMinutes;
  if (endMinutes < startMinutes && nightCrossesInput) {
    nightCrossesInput.checked = true;
  }
  return { startMinutes, endMinutes, crosses };
}

function addResultLine(text) {
  if (!resultsList) {
    return;
  }
  const line = document.createElement('div');
  line.className = 'result-line';
  line.textContent = text;
  resultsList.appendChild(line);
}

function showError(message, showErrors) {
  if (!showErrors) {
    showPlaceholder();
    return;
  }
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function clearError() {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.add('is-hidden');
  }
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function parseDateInput(value) {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function updateWeekLabels() {
  const weekStartIndex = Number.parseInt(weekStartButtons?.getValue() ?? '1', 10);
  const resolvedStartIndex = Number.isNaN(weekStartIndex) ? 1 : weekStartIndex;
  const startDate = parseDateInput(weekStartDateInput?.value ?? '');
  if (!startDate) {
    setPlaceholder('week-range-label', '—');
    weeklyRows.forEach((row, index) => {
      if (row.label) {
        row.label.textContent = `${WEEK_DAYS[(resolvedStartIndex + index) % 7]} —`;
      }
    });
    return;
  }

  const weekRangeLabel = buildWeekRangeLabel(startDate, resolvedStartIndex);
  setPlaceholder('week-range-label', weekRangeLabel);

  const cycle = buildWeekCycle(startDate, resolvedStartIndex);
  weeklyRows.forEach((row, index) => {
    const entry = cycle[index];
    if (row.label && entry) {
      row.label.textContent = `${entry.dayName} ${formatDateShort(entry.date)}`;
    }
  });
}

function buildSegmentsFromInputs(startInput, endInput, endsNextDay, roundingInterval) {
  const start = parseTimeString(startInput?.value ?? '');
  const end = parseTimeString(endInput?.value ?? '');
  if (!start || !end) {
    return null;
  }
  return getSegmentMinutes(start, end, endsNextDay?.checked, roundingInterval);
}

function computeNightMinutes(segments, nightWindow) {
  if (!nightWindow) {
    return 0;
  }
  return segments.reduce(
    (sum, segment) =>
      sum +
      getNightOverlapMinutes(
        segment.startMinutes,
        segment.endMinutes,
        nightWindow.startMinutes,
        nightWindow.endMinutes,
        nightWindow.crosses
      ),
    0
  );
}

function calculateSingle(helpers) {
  const segment = buildSegmentsFromInputs(
    singleStartInput,
    singleEndInput,
    singleNextDayInput,
    helpers.roundingInterval
  );
  if (!segment) {
    return { error: 'Please enter valid start and end times.' };
  }
  const breakMinutes = helpers.breakMinutes;
  if (breakMinutes > segment.minutes) {
    return { error: 'Break minutes cannot exceed worked minutes.' };
  }
  const totalBeforeBreak = segment.minutes;
  const totalMinutes = totalBeforeBreak - breakMinutes;
  let nightMinutes = helpers.nightEnabled ? computeNightMinutes([segment], helpers.nightWindow) : 0;
  if (helpers.nightEnabled && totalBeforeBreak > 0 && breakMinutes > 0) {
    nightMinutes = Math.round(nightMinutes * (totalMinutes / totalBeforeBreak));
  }
  return {
    totalMinutes,
    totalBreakMinutes: breakMinutes,
    dailyTotals: [totalMinutes],
    nightMinutes,
  };
}

function calculateSplit(helpers) {
  const segment1 = buildSegmentsFromInputs(
    splitStartInput,
    splitEndInput,
    splitNextDayInput,
    helpers.roundingInterval
  );
  if (!segment1) {
    return { error: 'Segment 1 requires start and end times.' };
  }
  const segment2Filled = Boolean(split2StartInput?.value || split2EndInput?.value);
  const segments = [segment1];
  if (segment2Filled) {
    const segment2 = buildSegmentsFromInputs(
      split2StartInput,
      split2EndInput,
      split2NextDayInput,
      helpers.roundingInterval
    );
    if (!segment2) {
      return { error: 'Segment 2 requires both start and end times when used.' };
    }
    segments.push(segment2);
  }

  const totalBeforeBreak = segments.reduce((sum, segment) => sum + segment.minutes, 0);
  if (helpers.breakMinutes > totalBeforeBreak) {
    return { error: 'Break minutes cannot exceed worked minutes.' };
  }
  const totalMinutes = totalBeforeBreak - helpers.breakMinutes;
  let nightMinutes = helpers.nightEnabled ? computeNightMinutes(segments, helpers.nightWindow) : 0;
  if (helpers.nightEnabled && totalBeforeBreak > 0 && helpers.breakMinutes > 0) {
    nightMinutes = Math.round(nightMinutes * (totalMinutes / totalBeforeBreak));
  }

  return {
    totalMinutes,
    totalBreakMinutes: helpers.breakMinutes,
    dailyTotals: [totalMinutes],
    nightMinutes,
  };
}

function calculateWeekly(helpers) {
  const dayTotals = [];
  const dayLines = [];
  let totalMinutes = 0;
  let totalBreakMinutes = 0;
  let nightMinutes = 0;

  weeklyRows.forEach((row) => {
    const startValue = row.startInput?.value ?? '';
    const endValue = row.endInput?.value ?? '';
    const hasAny = Boolean(startValue || endValue);
    if (!hasAny) {
      return;
    }
    const segment = buildSegmentsFromInputs(row.startInput, row.endInput, row.nextDayInput, helpers.roundingInterval);
    if (!segment) {
      dayTotals.push({ error: true });
      return;
    }
    const breakMinutes = Number.parseInt(row.breakGroup?.getValue() ?? '0', 10) || 0;
    if (breakMinutes > segment.minutes) {
      dayTotals.push({ error: true });
      return;
    }
    const dayTotal = segment.minutes - breakMinutes;
    let dayNightMinutes = helpers.nightEnabled ? computeNightMinutes([segment], helpers.nightWindow) : 0;
    if (helpers.nightEnabled && segment.minutes > 0 && breakMinutes > 0) {
      dayNightMinutes = Math.round(dayNightMinutes * (dayTotal / segment.minutes));
    }
    dayTotals.push({ minutes: dayTotal, label: row.label?.textContent ?? 'Day', nightMinutes: dayNightMinutes });
    totalMinutes += dayTotal;
    totalBreakMinutes += breakMinutes;
    nightMinutes += dayNightMinutes;
  });

  if (!dayTotals.length) {
    return { error: 'Please enter at least one day with start and end times.' };
  }
  if (dayTotals.some((day) => day.error)) {
    return { error: 'Please enter valid start and end times and break minutes for each day used.' };
  }

  dayTotals.forEach((day) => {
    if (day.label) {
      dayLines.push(`${day.label}: ${formatHHMM(day.minutes)}`);
    }
  });

  return {
    totalMinutes,
    totalBreakMinutes,
    dailyTotals: dayTotals.map((day) => day.minutes),
    nightMinutes,
    dayLines,
  };
}

function calculate({ showErrors = true } = {}) {
  const mode = modeButtons?.getValue() ?? 'single';
  const rule = ruleButtons?.getValue() ?? 'weekly';
  const roundingInterval = getRoundingInterval();
  const breakMinutes = getBreakMinutes();
  const nightEnabled = nightToggle?.checked;
  const nightWindow = nightEnabled ? getNightWindow() : null;

  const dailyLimit = getLimitValue(dailyLimitInput, 8, 0, 24);
  const weeklyLimit = getLimitValue(weeklyLimitInput, 40, 0, 168);

  const modeLabelMap = {
    single: 'Single Shift',
    split: 'Split Shift',
    weekly: 'Weekly Shift',
  };
  const ruleLabelMap = {
    daily: 'Daily',
    weekly: 'Weekly',
    both: 'Daily + Weekly',
  };
  const roundingLabelMap = {
    0: 'None',
    5: 'Nearest 5 minutes',
    10: 'Nearest 10 minutes',
    15: 'Nearest 15 minutes',
  };

  const modeLabel = modeLabelMap[mode] ?? 'Single Shift';
  const ruleLabel = ruleLabelMap[rule] ?? 'Weekly';
  const roundingLabel = roundingLabelMap[roundingInterval] ?? 'None';
  const weekStartIndex = Number.parseInt(weekStartButtons?.getValue() ?? '1', 10);
  const resolvedStartIndex = Number.isNaN(weekStartIndex) ? 1 : weekStartIndex;
  const weekStartDate = parseDateInput(weekStartDateInput?.value ?? '');
  const weekRangeLabel =
    mode === 'weekly' && weekStartDate ? buildWeekRangeLabel(weekStartDate, resolvedStartIndex) : '—';

  updateWeekLabels();

  setDefaultSummary({
    modeLabel,
    ruleLabel,
    roundingLabel,
    dailyLimit: dailyLimit.valid ? String(dailyLimit.value) : '—',
    weeklyLimit: weeklyLimit.valid ? String(weeklyLimit.value) : '—',
    weekRangeLabel,
    breakMinutes: mode === 'weekly' ? '—' : String(breakMinutes),
  });

  if (!dailyLimit.valid || !weeklyLimit.valid) {
    showError('Please enter valid daily and weekly limits.', showErrors);
    return;
  }

  const helpers = { roundingInterval, breakMinutes, nightEnabled, nightWindow };
  let result;
  if (mode === 'single') {
    result = calculateSingle(helpers);
  } else if (mode === 'split') {
    result = calculateSplit(helpers);
  } else {
    result = calculateWeekly(helpers);
  }

  if (result?.error) {
    showError(result.error, showErrors);
    return;
  }

  const totalMinutes = result.totalMinutes ?? 0;
  const dailyTotals = result.dailyTotals ?? [totalMinutes];
  const totalBreakMinutes = result.totalBreakMinutes ?? 0;

  const dailyLimitMinutes = dailyLimit.value * 60;
  const weeklyLimitMinutes = weeklyLimit.value * 60;
  const dailyOvertimeTotal = dailyTotals.reduce(
    (sum, dayMinutes) => sum + splitDailyOvertime(dayMinutes, dailyLimitMinutes).overtime,
    0
  );
  const weeklyOvertimeTotal = splitWeeklyOvertime(totalMinutes, weeklyLimitMinutes).overtime;

  let overtimeMinutes = 0;
  let regularMinutes = 0;
  if (rule === 'daily') {
    overtimeMinutes = dailyOvertimeTotal;
    regularMinutes = Math.max(0, totalMinutes - overtimeMinutes);
  } else if (rule === 'weekly') {
    overtimeMinutes = weeklyOvertimeTotal;
    regularMinutes = Math.max(0, totalMinutes - overtimeMinutes);
  } else {
    const split = splitDailyWeeklyOvertime(dailyOvertimeTotal, weeklyOvertimeTotal, totalMinutes);
    overtimeMinutes = split.overtime;
    regularMinutes = split.regular;
  }

  const nightMinutes = nightEnabled ? Math.min(result.nightMinutes ?? 0, totalMinutes) : null;
  const nightOvertimeMinutes = nightEnabled
    ? calculateNightOvertime(overtimeMinutes, nightMinutes ?? 0, totalMinutes)
    : null;

  const totalDecimal = formatDecimalHours(totalMinutes);

  setResultSummary({
    totalMinutes,
    regularMinutes,
    overtimeMinutes,
    totalDecimal,
    breakMinutes: totalBreakMinutes,
    nightMinutes,
    nightOvertimeMinutes,
  });

  if (resultsList) {
    resultsList.innerHTML = '';
  }
  addResultLine(`Total worked: ${formatHHMM(totalMinutes)}`);
  addResultLine(`Regular hours: ${formatHHMM(regularMinutes)}`);
  addResultLine(`Overtime hours: ${formatHHMM(overtimeMinutes)}`);
  addResultLine(`Decimal total: ${totalDecimal} hours`);
  addResultLine(`Rule used: ${ruleLabel}`);

  if (nightEnabled) {
    addResultLine(`Night hours: ${formatHHMM(nightMinutes ?? 0)}`);
    addResultLine(`Night overtime hours: ${formatHHMM(nightOvertimeMinutes ?? 0)}`);
  }

  if (mode === 'weekly' && result.dayLines?.length) {
    result.dayLines.forEach((line) => addResultLine(line));
  }

  clearError();
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.remove('is-hidden');
}

if (dailyLimitInput) {
  dailyLimitInput.value = '8';
}
if (weeklyLimitInput) {
  weeklyLimitInput.value = '40';
}
if (nightStartInput) {
  nightStartInput.value = '22:00';
}
if (nightEndInput) {
  nightEndInput.value = '06:00';
}
if (nightCrossesInput) {
  nightCrossesInput.checked = true;
}
if (weekStartDateInput) {
  const today = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  weekStartDateInput.value = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;
}

updateWeekLabels();

nightToggle?.addEventListener('change', () => {
  const enabled = nightToggle.checked;
  if (nightSettings) {
    nightSettings.classList.toggle('is-collapsed', !enabled);
    nightSettings.setAttribute('aria-hidden', String(!enabled));
  }
  calculate({ showErrors: hasCalculated });
});

nightStartInput?.addEventListener('change', () => calculate({ showErrors: hasCalculated }));
nightEndInput?.addEventListener('change', () => calculate({ showErrors: hasCalculated }));
nightCrossesInput?.addEventListener('change', () => calculate({ showErrors: hasCalculated }));

weekStartDateInput?.addEventListener('change', () => {
  updateWeekLabels();
  calculate({ showErrors: hasCalculated });
});

const inputs = document.querySelectorAll('#calc-overtime-hours input');
inputs.forEach((input) => {
  input.addEventListener('input', () => calculate({ showErrors: hasCalculated }));
});

calculateButton?.addEventListener('click', () => {
  hasCalculated = true;
  calculate({ showErrors: true });
});
