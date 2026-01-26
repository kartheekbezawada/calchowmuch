import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { roundToNextQuarterHour } from '/assets/js/core/sleep-utils.js';
import { calculateTimeBetweenDates } from '/assets/js/core/date-diff-utils.js';

const modeGroup = document.querySelector('[data-button-group="date-diff-mode"]');
const startDateInput = document.querySelector('#date-diff-start-date');
const endDateInput = document.querySelector('#date-diff-end-date');
const startTimeInput = document.querySelector('#date-diff-start-time');
const endTimeInput = document.querySelector('#date-diff-end-time');
const timeInputsRow = document.querySelector('#date-diff-time-inputs');
const calculateButton = document.querySelector('#date-diff-calculate');
const resultsList = document.querySelector('#date-diff-results-list');
const placeholder = document.querySelector('#date-diff-placeholder');
const errorMessage = document.querySelector('#date-diff-error');

const metadata = {
  title: 'Time Between Two Dates Calculator – Days, Weeks, Months, Years',
  description:
    'Calculate the time between two dates in days, weeks, months, and years. Simple, fast, and free time between dates calculator.',
  canonical:
    'https://calchowmuch.com/calculators/time-and-date/time-between-two-dates-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Why do months and days give different answers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Days count elapsed time, while months follow calendar boundaries. Month length changes throughout the year.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does the calculator include the start date?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. It calculates the time from the start date/time up to the end date/time.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens if the end date is before the start date?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'The calculator will show an error and ask you to choose an end date that is after the start date.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does daylight saving time affect the result?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'It can affect results in Date & time mode, because a day can be 23 or 25 hours when clocks change.',
        },
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
  h1.textContent = 'Time Between Two Dates Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

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
    if (!resultsList?.classList.contains('is-hidden')) {
      calculate();
    }
  },
});

updateTimeVisibility(modeButtons?.getValue() ?? 'date');

function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

const defaultTime = roundToNextQuarterHour(new Date());
if (startDateInput) {
  startDateInput.value = formatDateValue(defaultTime);
}
if (endDateInput) {
  endDateInput.value = formatDateValue(addDays(defaultTime, 7));
}
if (startTimeInput) {
  startTimeInput.value = formatTimeValue(defaultTime);
}
if (endTimeInput) {
  endTimeInput.value = formatTimeValue(defaultTime);
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
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
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

function formatYearsMonths(years, months) {
  const parts = [];
  if (years) {
    parts.push(`${years} year${years === 1 ? '' : 's'}`);
  }
  if (months || parts.length === 0) {
    parts.push(`${months} month${months === 1 ? '' : 's'}`);
  }
  return parts.join(' ');
}

function addResultRow(key, label, value) {
  if (!resultsList) {
    return;
  }
  const row = document.createElement('div');
  row.className = 'result-row';
  row.dataset.result = key;

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;

  const valueSpan = document.createElement('span');
  valueSpan.textContent = value;

  row.append(labelSpan, valueSpan);
  resultsList.appendChild(row);
}

function showResults(result, includeTime) {
  if (!resultsList || !placeholder) {
    return;
  }

  clearError();
  resultsList.innerHTML = '';

  addResultRow('total-days', 'Total days', formatNumber(result.totalDays, { maximumFractionDigits: 2 }));
  addResultRow('total-weeks', 'Total weeks', formatNumber(result.totalWeeks, { maximumFractionDigits: 2 }));
  addResultRow('years-months', 'Years and months', formatYearsMonths(result.years, result.months));
  addResultRow('total-months', 'Total months', formatNumber(result.totalMonths, { maximumFractionDigits: 0 }));

  if (includeTime) {
    addResultRow('total-hours', 'Total hours', formatNumber(result.totalHours, { maximumFractionDigits: 2 }));
    addResultRow('total-minutes', 'Total minutes', formatNumber(result.totalMinutes, { maximumFractionDigits: 0 }));
  }

  placeholder.classList.add('is-hidden');
  resultsList.classList.remove('is-hidden');
}

function calculate() {
  const mode = modeButtons?.getValue() ?? 'date';
  const includeTime = mode === 'datetime';
  const startDateTime = buildDateTime(
    startDateInput?.value,
    startTimeInput?.value,
    includeTime
  );
  const endDateTime = buildDateTime(endDateInput?.value, endTimeInput?.value, includeTime);

  if (!startDateTime || !endDateTime) {
    showPlaceholder();
    return;
  }

  if (endDateTime < startDateTime) {
    showError('End date/time must be after the start date/time.');
    return;
  }

  const results = calculateTimeBetweenDates({
    start: startDateTime,
    end: endDateTime,
    includeTime,
  });

  if (!results) {
    showPlaceholder();
    return;
  }

  showResults(results, includeTime);
}

calculateButton?.addEventListener('click', calculate);

const inputs = [startDateInput, endDateInput, startTimeInput, endTimeInput].filter(Boolean);
inputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!resultsList?.classList.contains('is-hidden')) {
      calculate();
    }
  });
});
