import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateExactAge } from '/assets/js/core/date-diff-utils.js';

const dobInput = document.querySelector('#age-dob');
const asOfInput = document.querySelector('#age-as-of');
const calculateButton = document.querySelector('#age-calculate');
const resultsList = document.querySelector('#age-results-list');
const placeholder = document.querySelector('#age-placeholder');
const errorMessage = document.querySelector('#age-error');
const clarification = document.querySelector('#age-clarification');

const metadata = {
  title: 'Age Calculator – Exact Age in Years, Months, and Days',
  description:
    'Calculate your exact age in years, months, and days based on your date of birth. Simple, fast, and free age calculator.',
  canonical: 'https://calchowmuch.com/calculators/time-and-date/age-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How accurate is this age calculator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It is accurate to the calendar day, using real month lengths and leap years.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does it handle leap years correctly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. February 29 is accounted for when calculating years, months, and days.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I calculate my age on a past or future date?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You can select a different "as of" date to see your age at that time.',
        },
      },
      {
        '@type': 'Question',
        name: "Why doesn't the calculator show hours or minutes?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It focuses on exact calendar age, which is typically expressed in years, months, and days.',
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
  h1.textContent = 'Age Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const today = new Date();
if (asOfInput) {
  asOfInput.value = formatDateValue(today);
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
  clarification?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  clarification?.classList.add('is-hidden');
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

function formatAgeValue({ years, months, days }) {
  const yearLabel = years === 1 ? 'year' : 'years';
  const monthLabel = months === 1 ? 'month' : 'months';
  const dayLabel = days === 1 ? 'day' : 'days';
  return `${years} ${yearLabel}, ${months} ${monthLabel}, ${days} ${dayLabel}`;
}

function showResults(age, comparisonValue) {
  if (!resultsList || !placeholder || !clarification) {
    return;
  }

  clearError();
  resultsList.innerHTML = '';
  addResultRow('Exact age', formatAgeValue(age));
  clarification.textContent = `That is your exact age as of ${comparisonValue}.`;

  placeholder.classList.add('is-hidden');
  resultsList.classList.remove('is-hidden');
  clarification.classList.remove('is-hidden');
}

function parseDate(value) {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function calculate() {
  const dobValue = dobInput?.value ?? '';
  const asOfValue = asOfInput?.value ?? '';
  const birthDate = parseDate(dobValue);
  const comparisonDate = parseDate(asOfValue);

  if (!birthDate) {
    showError('Please enter a valid date of birth.');
    return;
  }
  if (!comparisonDate) {
    showError('Please enter a valid comparison date.');
    return;
  }
  if (birthDate > comparisonDate) {
    showError('Date of birth must be on or before the comparison date.');
    return;
  }

  const age = calculateExactAge(birthDate, comparisonDate);
  if (!age) {
    showPlaceholder();
    return;
  }

  showResults(age, asOfValue);
}

calculateButton?.addEventListener('click', calculate);

const inputs = [dobInput, asOfInput].filter(Boolean);
inputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (!resultsList?.classList.contains('is-hidden')) {
      calculate();
    }
  });
});
