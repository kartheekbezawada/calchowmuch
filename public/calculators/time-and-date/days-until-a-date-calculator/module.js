import { setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { calculateDaysUntil } from '/assets/js/core/date-diff-utils.js';

const dateInput = document.querySelector('#days-until-date');
const calculateButton = document.querySelector('#days-until-calculate');
const resultsList = document.querySelector('#days-until-results-list');
const placeholder = document.querySelector('#days-until-placeholder');
const errorMessage = document.querySelector('#days-until-error');
const clarification = document.querySelector('#days-until-clarification');

const metadata = {
  title: 'Days Until a Date Calculator – How Many Days Until',
  description:
    'Calculate how many days are left until a specific date. Simple, fast, and free days until a date calculator.',
  canonical: 'https://calchowmuch.com/calculators/time-and-date/days-until-a-date-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Does the calculator include today in the count?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. It counts the number of full days between today and the selected date.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use this for past dates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes. If the date is in the past, the calculator shows how many days have passed since then.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does daylight saving time affect the result?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The calculator works with dates only, not hours.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this suitable for deadlines or legal use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            "It's useful for planning, but always verify important deadlines with official sources.",
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
  h1.textContent = 'Days Until a Date Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

const today = new Date();
if (dateInput) {
  dateInput.value = formatDateValue(addDays(today, 30));
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

function formatDayLabel(days) {
  return days === 1 ? 'day' : 'days';
}

function showResults(diffDays) {
  if (!resultsList || !placeholder || !clarification) {
    return;
  }

  clearError();
  resultsList.innerHTML = '';

  const absoluteDays = Math.abs(diffDays);
  addResultRow('Total days', formatNumber(absoluteDays, { maximumFractionDigits: 0 }));

  if (diffDays > 0) {
    clarification.textContent = `That's in ${absoluteDays} ${formatDayLabel(absoluteDays)}.`;
  } else if (diffDays === 0) {
    clarification.textContent = 'That date is today.';
  } else {
    clarification.textContent = `That date was ${absoluteDays} ${formatDayLabel(absoluteDays)} ago.`;
  }

  placeholder.classList.add('is-hidden');
  resultsList.classList.remove('is-hidden');
  clarification.classList.remove('is-hidden');
}

function calculate() {
  if (!dateInput?.value) {
    showPlaceholder();
    return;
  }

  const [year, month, day] = dateInput.value.split('-').map(Number);
  if (!year || !month || !day) {
    showError('Please enter a valid date.');
    return;
  }

  const targetDate = new Date(year, month - 1, day);
  const diffDays = calculateDaysUntil(targetDate, new Date());
  if (diffDays === null) {
    showError('Please enter a valid date.');
    return;
  }

  showResults(diffDays);
}

calculateButton?.addEventListener('click', calculate);
dateInput?.addEventListener('change', () => {
  if (!resultsList?.classList.contains('is-hidden')) {
    calculate();
  }
});
