import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateBirthdayWeekdays, getWeekdayName } from '/assets/js/core/date-diff-utils.js';

const dobInput = document.querySelector('#birthday-dow-dob');
const yearInput = document.querySelector('#birthday-dow-year');
const calculateButton = document.querySelector('#birthday-dow-calculate');
const resultsList = document.querySelector('#birthday-dow-results-list');
const placeholder = document.querySelector('#birthday-dow-placeholder');
const errorMessage = document.querySelector('#birthday-dow-error');

const metadata = {
  title: 'Birthday Day-of-Week Calculator – What Day Were You Born?',
  description:
    'Find the day of the week you were born on, and see what weekday your birthday falls on in any year. Simple, fast, and free.',
  canonical: 'https://calchowmuch.com/time-and-date/birthday-day-of-week/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is the result accurate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The day-of-week is calculated using standard calendar rules for the date you enter.',
        },
      },
      {
        '@type': 'Question',
        name: 'What if I was born on February 29?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'You were born on the weekday for February 29 in your birth year. For non-leap target years, this calculator uses February 28 for the birthday weekday.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I check future or past years?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Enter any target year from 1600 to 2100.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does this store my birthday?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. This runs in your browser and does not save your inputs.',
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
  h1.textContent = 'Birthday Day-of-Week Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

const weekdayPlaceholders = {
  dob: document.querySelector('[data-placeholder="dob"]'),
  birthWeekday: document.querySelector('[data-placeholder="birth-weekday"]'),
  targetYear: document.querySelector('[data-placeholder="target-year"]'),
  targetWeekday: document.querySelector('[data-placeholder="target-weekday"]'),
};

function formatDateLabel(date) {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatWeekday(date) {
  return getWeekdayName(date) ?? '';
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

function addResultRow(label, value) {
  if (!resultsList) {
    return;
  }
  const row = document.createElement('div');
  row.className = 'result-row';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;

  const valueSpan = document.createElement('span');
  valueSpan.textContent = value;

  row.append(labelSpan, valueSpan);
  resultsList.appendChild(row);
}

function updateExplanation(dobLabel, birthWeekday, targetYear, targetWeekday) {
  if (weekdayPlaceholders.dob) {
    weekdayPlaceholders.dob.textContent = dobLabel;
  }
  if (weekdayPlaceholders.birthWeekday) {
    weekdayPlaceholders.birthWeekday.textContent = birthWeekday;
  }
  if (weekdayPlaceholders.targetYear) {
    weekdayPlaceholders.targetYear.textContent = String(targetYear);
  }
  if (weekdayPlaceholders.targetWeekday) {
    weekdayPlaceholders.targetWeekday.textContent = targetWeekday;
  }
}

function parseDate(value) {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }
  const candidate = new Date(year, month - 1, day);
  if (
    Number.isNaN(candidate.getTime()) ||
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return null;
  }
  return candidate;
}

function parseTargetYear(value, fallbackYear) {
  if (!value) {
    return fallbackYear;
  }
  const year = Number.parseInt(value, 10);
  if (!Number.isInteger(year)) {
    return null;
  }
  return year;
}

function showResults({ birthWeekday, targetWeekday, targetYear }) {
  if (!resultsList || !placeholder) {
    return;
  }
  clearError();
  resultsList.innerHTML = '';

  addResultRow('You were born on:', birthWeekday);
  addResultRow(`In ${targetYear}, your birthday falls on:`, targetWeekday);

  placeholder.classList.add('is-hidden');
  resultsList.classList.remove('is-hidden');
}

function calculate() {
  const birthDate = parseDate(dobInput?.value ?? '');
  if (!birthDate) {
    showError('Please enter a valid date of birth.');
    return;
  }

  const currentYear = new Date().getFullYear();
  const targetYear = parseTargetYear(yearInput?.value ?? '', currentYear);
  if (!Number.isInteger(targetYear) || targetYear < 1600 || targetYear > 2100) {
    showError('Enter a year between 1600 and 2100.');
    return;
  }

  const weekdays = calculateBirthdayWeekdays(birthDate, targetYear);
  if (!weekdays) {
    showError('Please enter a valid date and year.');
    return;
  }

  const dobLabel = formatDateLabel(birthDate);
  updateExplanation(dobLabel, weekdays.birthWeekday, targetYear, weekdays.targetWeekday);
  showResults({
    birthWeekday: weekdays.birthWeekday,
    targetWeekday: weekdays.targetWeekday,
    targetYear,
  });
}

const initialYear = new Date().getFullYear();
if (yearInput) {
  yearInput.value = String(initialYear);
}

calculateButton?.addEventListener('click', calculate);
dobInput?.addEventListener('change', () => {
  if (!resultsList?.classList.contains('is-hidden')) {
    calculate();
  }
});
yearInput?.addEventListener('change', () => {
  if (!resultsList?.classList.contains('is-hidden')) {
    calculate();
  }
});

showPlaceholder();
