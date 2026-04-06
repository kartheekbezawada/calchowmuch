import { formatNumber } from '/assets/js/core/format.js';
import { roundToMinute } from '/assets/js/core/sleep-utils.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { buildPresetRange, calculateDateDiffViewModel } from './engine.js';

const modeGroup = document.querySelector('[data-button-group="date-diff-mode"]');
const startDateInput = document.querySelector('#date-diff-start-date');
const endDateInput = document.querySelector('#date-diff-end-date');
const startTimeInput = document.querySelector('#date-diff-start-time');
const endTimeInput = document.querySelector('#date-diff-end-time');
const timeInputsRow = document.querySelector('#date-diff-time-inputs');
const includeEndInput = document.querySelector('#date-diff-include-end');
const calculateButton = document.querySelector('#date-diff-calculate');
const swapButton = document.querySelector('#date-diff-swap');
const copySummaryButton = document.querySelector('#date-diff-copy-summary');
const errorMessage = document.querySelector('#date-diff-error');
const directionLabel = document.querySelector('#date-diff-direction');
const headline = document.querySelector('#date-diff-headline');
const summary = document.querySelector('#date-diff-summary');
const yearsOutput = document.querySelector('#date-diff-years');
const monthsOutput = document.querySelector('#date-diff-months');
const daysOutput = document.querySelector('#date-diff-days');
const totalDaysOutput = document.querySelector('#date-diff-total-days');
const totalDaysA11yOutput = document.querySelector('#date-diff-total-days-a11y');
const totalWeeksOutput = document.querySelector('#date-diff-total-weeks');
const businessDaysOutput = document.querySelector('#date-diff-business-days');
const totalHoursOutput = document.querySelector('#date-diff-total-hours');
const totalMinutesOutput = document.querySelector('#date-diff-total-minutes');
const optionsChip = document.querySelector('#date-diff-options-chip');
const dirtyNote = document.querySelector('#date-diff-dirty-note');
const copyFeedback = document.querySelector('#date-diff-copy-feedback');
const calendarList = document.querySelector('#date-diff-calendar-list');
const elapsedList = document.querySelector('#date-diff-elapsed-list');
const notesList = document.querySelector('#date-diff-notes-list');
const presetButtons = Array.from(document.querySelectorAll('[data-preset]'));

const state = {
  activePresetId: 'today-plus-30',
  lastViewModel: null,
  isDirty: false,
  copyTimer: null,
};

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I calculate the days between two dates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Choose a start date and an end date, then calculate. The page shows a straight answer first, followed by total days, weeks, business days, and time totals.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator show business days?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It shows business days by excluding Saturdays and Sundays.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Include end date do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'It adds the ending calendar date to day-based planning counts, which is useful for schedules, leave windows, and project spans.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can the start date be after the end date?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. The calculator labels the range as a past interval and shows the absolute duration instead of throwing a blocking error.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why can months and days tell different stories?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Calendar months follow real month boundaries, while total days and hours measure elapsed time directly. Both are useful, so the page shows both.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does daylight saving time affect Date and time mode?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. Date and time mode uses your local device clock, so clock changes can affect total hours and minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are business days shown near the top?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Business days are often the first planning question for work, delivery, and schedule decisions, so the page keeps them close to the headline answer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I copy a summary for notes or email?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. Copy summary gives you a clean text version of the main range and the most useful supporting numbers.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I use a preset?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Presets are useful when you want a fast example or a common planning range before you fine-tune the dates yourself.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are my dates stored?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All calculations run locally in your browser and nothing is stored.',
      },
    },
  ],
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Time Between Dates Calculator – Days & Business Days',
      url: 'https://calchowmuch.com/time-and-date/time-between-two-dates-calculator/',
      description:
        'Find days, weeks, months, business days, and exact hours between two dates. Use date-only or date-time mode, inclusive counting, and copy-ready summaries.',
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Time Between Two Dates Calculator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: 'https://calchowmuch.com/time-and-date/time-between-two-dates-calculator/',
      description:
        'Free date difference calculator for days between dates, business days, inclusive counts, and exact time intervals.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      creator: { '@type': 'Organization', name: 'CalcHowMuch' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://calchowmuch.com/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Time & Date',
          item: 'https://calchowmuch.com/time-and-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Time Between Two Dates Calculator',
          item: 'https://calchowmuch.com/time-and-date/time-between-two-dates-calculator/',
        },
      ],
    },
  ],
};

setPageMetadata({
  title: 'Time Between Two Dates Calculator | Days, Business Days, Weeks and Hours',
  description:
    'Find the exact time between two dates in total days, business days, weeks, months, and hours with date-only or date-time mode and copy-ready summaries.',
  canonical: 'https://calchowmuch.com/time-and-date/time-between-two-dates-calculator/',
  structuredData: STRUCTURED_DATA,
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
});

function ensureH1Title() {
  const title = document.getElementById('calculator-title');
  if (!title) {
    return;
  }
  const desired = 'Time Between Two Dates Calculator';
  if (title.tagName !== 'H1') {
    const h1 = document.createElement('h1');
    h1.id = 'calculator-title';
    h1.textContent = desired;
    title.replaceWith(h1);
    return;
  }
  title.textContent = desired;
}

ensureH1Title();

function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
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

function buildDateTime(dateValue, timeValue, includeTime) {
  const date = parseDateValue(dateValue);
  if (!date) {
    return null;
  }
  if (!includeTime) {
    return date;
  }
  const time = parseTimeValue(timeValue);
  if (!time) {
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

function formatSmartNumber(value, digits = 2) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function renderDetailList(container, rows) {
  if (!container) {
    return;
  }
  container.innerHTML = '';
  rows.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'td-detail-row';

    const key = document.createElement('span');
    key.className = 'td-detail-key';
    key.textContent = row.label;

    const value = document.createElement('span');
    value.className = 'td-detail-value';
    value.textContent = row.value;

    item.append(key, value);
    container.appendChild(item);
  });
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

function updateDirtyState() {
  if (!dirtyNote) {
    return;
  }
  dirtyNote.textContent = state.isDirty ? 'Inputs changed' : 'Up to date';
  dirtyNote.classList.toggle('is-warning', state.isDirty);
}

function syncPresetButtons() {
  presetButtons.forEach((button) => {
    const isActive = button.dataset.preset === state.activePresetId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function markDirty() {
  state.isDirty = true;
  if (state.activePresetId !== 'custom') {
    state.activePresetId = 'custom';
    syncPresetButtons();
  }
  updateDirtyState();
}

function markClean() {
  state.isDirty = false;
  updateDirtyState();
}

function updateTimeVisibility(mode) {
  if (!timeInputsRow) {
    return;
  }
  const showTimeInputs = mode === 'datetime';
  timeInputsRow.classList.toggle('is-collapsed', !showTimeInputs);
  timeInputsRow.setAttribute('aria-hidden', String(!showTimeInputs));
  if (startTimeInput) {
    startTimeInput.disabled = !showTimeInputs;
  }
  if (endTimeInput) {
    endTimeInput.disabled = !showTimeInputs;
  }
}

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'date',
  onChange: (value) => {
    updateTimeVisibility(value);
    markDirty();
    clearError();
  },
});

updateTimeVisibility(modeButtons?.getValue() ?? 'date');

function buildShortSummary(viewModel) {
  const range = `${viewModel.startLabel} to ${viewModel.endLabel}`;
  if (viewModel.mode === 'datetime') {
    return `${range}. ${formatSmartNumber(viewModel.elapsed.totalHours, 2)} total hours.`;
  }
  return `${range}. ${formatNumber(viewModel.counts.businessDays)} business days and ${formatSmartNumber(
    viewModel.elapsed.totalDays,
    0
  )} total days.`;
}

function renderViewModel(viewModel) {
  state.lastViewModel = viewModel;

  if (directionLabel) {
    directionLabel.textContent = viewModel.directionLabel;
  }
  if (headline) {
    headline.textContent = viewModel.headline;
  }
  if (summary) {
    summary.textContent = buildShortSummary(viewModel);
  }
  if (yearsOutput) {
    yearsOutput.textContent = formatNumber(viewModel.calendar.years);
  }
  if (monthsOutput) {
    monthsOutput.textContent = formatNumber(viewModel.calendar.months);
  }
  if (daysOutput) {
    daysOutput.textContent = formatNumber(viewModel.calendar.days);
  }
  if (totalDaysOutput) {
    totalDaysOutput.textContent = formatSmartNumber(
      viewModel.elapsed.totalDays,
      viewModel.mode === 'datetime' ? 2 : 0
    );
  }
  if (totalDaysA11yOutput) {
    totalDaysA11yOutput.textContent = formatSmartNumber(
      viewModel.elapsed.totalDays,
      viewModel.mode === 'datetime' ? 2 : 0
    );
  }
  if (totalWeeksOutput) {
    totalWeeksOutput.textContent = formatSmartNumber(viewModel.elapsed.totalWeeks, 2);
  }
  if (businessDaysOutput) {
    businessDaysOutput.textContent = formatNumber(viewModel.counts.businessDays);
  }
  if (totalHoursOutput) {
    totalHoursOutput.textContent = formatSmartNumber(
      viewModel.elapsed.totalHours,
      viewModel.mode === 'datetime' ? 2 : 0
    );
  }
  if (totalMinutesOutput) {
    totalMinutesOutput.textContent = formatNumber(viewModel.elapsed.totalMinutes);
  }
  if (optionsChip) {
    optionsChip.textContent = viewModel.optionsLabel;
  }

  renderDetailList(calendarList, [
    { label: 'Years', value: formatNumber(viewModel.calendar.years) },
    { label: 'Months', value: formatNumber(viewModel.calendar.months) },
    { label: 'Days', value: formatNumber(viewModel.calendar.days) },
    {
      label: 'Total months',
      value: formatNumber(viewModel.calendar.totalMonths),
    },
    {
      label: 'Clock remainder',
      value:
        viewModel.calendar.hours || viewModel.calendar.minutes
          ? `${formatNumber(viewModel.calendar.hours)} h ${formatNumber(viewModel.calendar.minutes)} min`
          : 'None',
    },
  ]);

  renderDetailList(elapsedList, [
    {
      label: 'Total days',
      value: formatSmartNumber(viewModel.elapsed.totalDays, viewModel.mode === 'datetime' ? 2 : 0),
    },
    { label: 'Total weeks', value: formatSmartNumber(viewModel.elapsed.totalWeeks, 2) },
    {
      label: 'Total hours',
      value: formatSmartNumber(
        viewModel.elapsed.totalHours,
        viewModel.mode === 'datetime' ? 2 : 0
      ),
    },
    { label: 'Total minutes', value: formatNumber(viewModel.elapsed.totalMinutes) },
    {
      label: 'Headline breakdown',
      value:
        viewModel.mode === 'datetime'
          ? `${formatNumber(viewModel.elapsed.days)} d ${formatNumber(viewModel.elapsed.hours)} h ${formatNumber(viewModel.elapsed.minutes)} min`
          : viewModel.elapsed.weeksAndDays,
    },
  ]);

  const planningRows = [
    { label: 'Direction', value: viewModel.directionNote },
    { label: 'Business days', value: formatNumber(viewModel.counts.businessDays) },
    { label: 'Weekend days', value: formatNumber(viewModel.counts.weekendDays) },
    {
      label: 'Inclusive day count',
      value:
        viewModel.counts.inclusiveDayCount === null
          ? 'Not applied'
          : formatNumber(viewModel.counts.inclusiveDayCount),
    },
    {
      label: 'Exclusive day count',
      value: formatNumber(viewModel.counts.exclusiveDayCount),
    },
  ];

  renderDetailList(notesList, planningRows);
  markClean();
  clearError();
}

function getCurrentInputs() {
  const mode = modeButtons?.getValue() ?? 'date';
  const includeTime = mode === 'datetime';
  const start = buildDateTime(startDateInput?.value, startTimeInput?.value, includeTime);
  const end = buildDateTime(endDateInput?.value, endTimeInput?.value, includeTime);
  return {
    mode,
    start,
    end,
    includeEndDate: Boolean(includeEndInput?.checked),
  };
}

function calculate() {
  const { start, end, mode, includeEndDate } = getCurrentInputs();

  if (!start || !end) {
    showError('Enter both dates before calculating.');
    return;
  }

  if (mode === 'datetime' && (!startTimeInput?.value || !endTimeInput?.value)) {
    showError('Enter both times to use Date & time mode.');
    return;
  }

  const viewModel = calculateDateDiffViewModel({
    start,
    end,
    mode,
    includeEndDate,
  });

  if (!viewModel) {
    showError('Enter valid dates and try again.');
    return;
  }

  renderViewModel(viewModel);
}

function setCopyFeedback(message) {
  if (!copyFeedback) {
    return;
  }
  copyFeedback.textContent = message;
  copyFeedback.classList.remove('is-hidden');
  window.clearTimeout(state.copyTimer);
  state.copyTimer = window.setTimeout(() => {
    copyFeedback.classList.add('is-hidden');
  }, 1800);
}

async function copySummary() {
  if (!state.lastViewModel?.copySummary) {
    return;
  }
  const text = state.lastViewModel.copySummary;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const fallback = document.createElement('textarea');
      fallback.value = text;
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand('copy');
      fallback.remove();
    }
    setCopyFeedback('Copied');
  } catch (error) {
    setCopyFeedback('Copy failed');
  }
}

function applyPreset(presetId) {
  if (presetId === 'custom') {
    state.activePresetId = 'custom';
    setPresetStatus('Custom range');
    syncPresetButtons();
    markDirty();
    return;
  }

  const preset = buildPresetRange(presetId, roundToMinute(new Date()));
  if (!preset) {
    return;
  }

  if (startDateInput) {
    startDateInput.value = formatDateValue(preset.start);
  }
  if (endDateInput) {
    endDateInput.value = formatDateValue(preset.end);
  }
  if (startTimeInput) {
    startTimeInput.value = formatTimeValue(preset.start);
  }
  if (endTimeInput) {
    endTimeInput.value = formatTimeValue(preset.end);
  }
  if (includeEndInput) {
    includeEndInput.checked = Boolean(preset.includeEndDate);
  }

  state.activePresetId = preset.id;
  syncPresetButtons();
  calculate();
}

function swapInputs() {
  if (!startDateInput || !endDateInput || !startTimeInput || !endTimeInput) {
    return;
  }

  const startDateValue = startDateInput.value;
  const endDateValue = endDateInput.value;
  const startTimeValue = startTimeInput.value;
  const endTimeValue = endTimeInput.value;

  startDateInput.value = endDateValue;
  endDateInput.value = startDateValue;
  startTimeInput.value = endTimeValue;
  endTimeInput.value = startTimeValue;

  state.activePresetId = 'custom';
  setPresetStatus('Custom range');
  syncPresetButtons();
  calculate();
}

const editableInputs = [
  startDateInput,
  endDateInput,
  startTimeInput,
  endTimeInput,
  includeEndInput,
].filter(Boolean);

editableInputs.forEach((input) => {
  input.addEventListener('input', markDirty);
  input.addEventListener('change', markDirty);
});

presetButtons.forEach((button) => {
  button.addEventListener('click', () => applyPreset(button.dataset.preset || 'custom'));
});

calculateButton?.addEventListener('click', calculate);
swapButton?.addEventListener('click', swapInputs);
copySummaryButton?.addEventListener('click', copySummary);

syncPresetButtons();
applyPreset('today-plus-30');
