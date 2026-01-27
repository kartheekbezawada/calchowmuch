import { setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { roundToMinute } from '/assets/js/core/sleep-utils.js';
import { calculateCountdown } from '/assets/js/core/date-diff-utils.js';

const dateTimeInput = document.querySelector('#countdown-datetime');
const dateTimeRow = document.querySelector('#countdown-datetime-row');
const fallbackWrap = document.querySelector('#countdown-fallback');
const fallbackDateInput = document.querySelector('#countdown-date');
const fallbackTimeInput = document.querySelector('#countdown-time');
const startButton = document.querySelector('#countdown-start');
const resultsList = document.querySelector('#countdown-results-list');
const placeholder = document.querySelector('#countdown-placeholder');
const errorMessage = document.querySelector('#countdown-error');
const statusMessage = document.querySelector('#countdown-status');

const metadata = {
  title: 'Countdown Timer Generator – Live Countdown to a Date',
  description:
    'Create a live countdown to any future date and time. Simple, fast, and free countdown timer generator.',
  canonical: 'https://calchowmuch.com/calculators/time-and-date/countdown-timer-generator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Does the countdown include the current second?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. It counts the full time remaining between now and the target time.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens if the target time is in the past?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The calculator will show an error and ask for a future date and time.',
        },
      },
      {
        '@type': 'Question',
        name: 'Will daylight saving time affect the countdown?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It can. The countdown uses your local time and will follow daylight saving changes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use this for long term events?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The countdown will show days and hours remaining, even for dates months away.',
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
  h1.textContent = 'Countdown Timer Generator';
  title.replaceWith(h1);
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

const defaultTarget = roundToMinute(new Date());
defaultTarget.setHours(defaultTarget.getHours() + 24);
if (dateTimeInput) {
  dateTimeInput.value = formatDateTimeLocalValue(defaultTarget);
}
if (fallbackDateInput) {
  fallbackDateInput.value = formatDateValue(defaultTarget);
}
if (fallbackTimeInput) {
  fallbackTimeInput.value = formatTimeValue(defaultTarget);
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
  statusMessage?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  statusMessage?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
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

function formatTargetLabel(target) {
  const date = target.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const time = target.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${date} at ${time}`;
}

function showResults(countdown, target, isComplete = false) {
  if (!resultsList || !placeholder) {
    return;
  }

  clearError();
  resultsList.innerHTML = '';

  addResultRow('days', 'Days', formatNumber(countdown.days, { maximumFractionDigits: 0 }));
  addResultRow('hours', 'Hours', formatNumber(countdown.hours, { maximumFractionDigits: 0 }));
  addResultRow('minutes', 'Minutes', formatNumber(countdown.minutes, { maximumFractionDigits: 0 }));
  addResultRow('seconds', 'Seconds', formatNumber(countdown.seconds, { maximumFractionDigits: 0 }));
  addResultRow('total-hours', 'Total hours', formatNumber(countdown.totalHours, { maximumFractionDigits: 2 }));
  addResultRow('total-minutes', 'Total minutes', formatNumber(countdown.totalMinutes, { maximumFractionDigits: 0 }));
  addResultRow('total-seconds', 'Total seconds', formatNumber(countdown.totalSeconds, { maximumFractionDigits: 0 }));

  if (statusMessage) {
    statusMessage.textContent = isComplete
      ? 'Countdown complete.'
      : `Counting down to ${formatTargetLabel(target)}.`;
    statusMessage.classList.remove('is-hidden');
  }

  placeholder.classList.add('is-hidden');
  resultsList.classList.remove('is-hidden');
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

let countdownInterval = null;

function clearCountdownInterval() {
  if (countdownInterval) {
    window.clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function updateCountdown(target) {
  const now = new Date();
  if (target.getTime() <= now.getTime()) {
    showResults(buildZeroCountdown(), target, true);
    clearCountdownInterval();
    return;
  }

  const countdown = calculateCountdown(target, now);
  if (!countdown) {
    showError('Please enter a valid future date and time.');
    clearCountdownInterval();
    return;
  }

  showResults(countdown, target, false);
}

function calculate(startTimer = true) {
  const target = getTargetDate();
  if (!target) {
    showPlaceholder();
    clearCountdownInterval();
    return;
  }

  if (target.getTime() <= Date.now()) {
    showError('Please choose a future date and time.');
    clearCountdownInterval();
    return;
  }

  updateCountdown(target);

  if (startTimer) {
    clearCountdownInterval();
    countdownInterval = window.setInterval(() => updateCountdown(target), 1000);
  }
}

startButton?.addEventListener('click', () => calculate(true));

[dateTimeInput, fallbackDateInput, fallbackTimeInput].forEach((input) => {
  input?.addEventListener('change', () => {
    if (!resultsList?.classList.contains('is-hidden')) {
      calculate(false);
    }
  });
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculate(true);
    }
  });
});

showPlaceholder();
