import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildBirthdayViewModel,
  formatLongDate,
} from './engine.js';

const dobInput = document.querySelector('#birthday-dow-dob');
const yearInput = document.querySelector('#birthday-dow-year');
const calculateButton = document.querySelector('#birthday-dow-calculate');
const copySummaryButton = document.querySelector('#birthday-dow-copy-summary');
const yearPresetButtons = Array.from(document.querySelectorAll('[data-year-preset]'));
const resultsList = document.querySelector('#birthday-dow-results-list');
const placeholder = document.querySelector('#birthday-dow-placeholder');
const errorMessage = document.querySelector('#birthday-dow-error');
const copyFeedback = document.querySelector('#birthday-dow-copy-feedback');

const heroWeekday = document.querySelector('#birthday-dow-hero-weekday');
const heroDate = document.querySelector('#birthday-dow-hero-date');
const heroTargetYear = document.querySelector('#birthday-dow-hero-target-year');
const heroTargetWeekday = document.querySelector('#birthday-dow-hero-target-weekday');
const birthWeekdayCard = document.querySelector('#birthday-dow-birth-weekday');
const birthNote = document.querySelector('#birthday-dow-birth-note');
const targetLabel = document.querySelector('#birthday-dow-target-label');
const targetWeekdayCard = document.querySelector('#birthday-dow-target-weekday-card');
const targetNote = document.querySelector('#birthday-dow-target-note');
const nextWeekday = document.querySelector('#birthday-dow-next-weekday');
const nextDate = document.querySelector('#birthday-dow-next-date');
const nextAge = document.querySelector('#birthday-dow-next-age');
const nextDays = document.querySelector('#birthday-dow-next-days');
const summaryLine = document.querySelector('#birthday-dow-summary-line');
const recurrenceWrap = document.querySelector('#birthday-dow-recurrence');
const weekendWrap = document.querySelector('#birthday-dow-weekend-highlights');

const explanationFields = {
  dobLabel: document.querySelector('[data-birthday-field="dob-label"]'),
  birthWeekday: document.querySelector('[data-birthday-field="birth-weekday"]'),
  targetYear: document.querySelector('[data-birthday-field="target-year"]'),
  targetWeekday: document.querySelector('[data-birthday-field="target-weekday"]'),
  nextBirthday: document.querySelector('[data-birthday-field="next-birthday"]'),
};

let activeViewModel = null;

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the birth weekday accurate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The weekday is calculated using standard Gregorian calendar rules for the date entered.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does the same birthday move to different weekdays?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because calendar years are not made of an exact number of full weeks. The leftover day or leap day shifts the weekday each year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this to plan future birthday weekends?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The 12-year recurrence map and weekend radar help you spot Friday, Saturday, and Sunday birthday years ahead of time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens for February 29 birthdays?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Leap-day birthdays stay on February 29 in leap years and use February 28 in non-leap preview years.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this store my birthday?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The calculator runs in your browser and does not save the birthday you enter.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far forward can I preview?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can preview target years from 1600 to 2100 inside the supported range of the calculator.',
      },
    },
  ],
};

const metadata = {
  title: 'Birthday Day-of-Week Calculator | Find Your Birth Weekday',
  description:
    'Find the weekday you were born on, preview future birthday weekdays, and spot the next weekend-friendly birthday years.',
  canonical: 'https://calchowmuch.com/time-and-date/birthday-day-of-week/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Birthday Day-of-Week Calculator | Find Your Birth Weekday',
        url: 'https://calchowmuch.com/time-and-date/birthday-day-of-week/',
        description:
          'Find the weekday you were born on, preview future birthday weekdays, and spot the next weekend-friendly birthday years.',
        inLanguage: 'en',
      },
    ],
  },
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
    h1.textContent = 'Birthday Day-of-Week Calculator';
    title.replaceWith(h1);
    return;
  }
  title.textContent = 'Birthday Day-of-Week Calculator';
}

ensureH1Title();

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

function parseTargetYear(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isInteger(parsed) ? parsed : null;
}

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDayCount(value) {
  if (!Number.isInteger(value)) {
    return '--';
  }
  return String(value);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function syncYearPresetButtons() {
  const currentYear = new Date().getFullYear();
  const selectedYear = parseTargetYear(yearInput?.value ?? '');
  const matchingPreset = {
    current: currentYear,
    next: currentYear + 1,
    'plus-5': currentYear + 5,
  };

  yearPresetButtons.forEach((button) => {
    const preset = button.dataset.yearPreset;
    const isActive = selectedYear === matchingPreset[preset];
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function setIdleInsights() {
  if (recurrenceWrap) {
    recurrenceWrap.innerHTML =
      '<p class="birthday-dow-empty-state">Calculate to reveal the 12-year recurrence map.</p>';
  }

  if (weekendWrap) {
    weekendWrap.innerHTML =
      '<p class="birthday-dow-empty-state">Calculate to reveal the weekend radar for Friday, Saturday, and Sunday birthdays.</p>';
  }
}

function setExplanationDefaults() {
  if (explanationFields.dobLabel) {
    explanationFields.dobLabel.textContent = 'your birthday date';
  }
  if (explanationFields.birthWeekday) {
    explanationFields.birthWeekday.textContent = 'its birth weekday';
  }
  if (explanationFields.targetYear) {
    explanationFields.targetYear.textContent = 'the selected year';
  }
  if (explanationFields.targetWeekday) {
    explanationFields.targetWeekday.textContent = 'that year\'s weekday';
  }
  if (explanationFields.nextBirthday) {
    explanationFields.nextBirthday.textContent = 'still to be calculated';
  }
}

function setIdleSummary() {
  if (heroWeekday) {
    heroWeekday.textContent = 'Waiting for a date';
  }
  if (heroDate) {
    heroDate.textContent = 'Add your birthday to turn this into a clean planning view.';
  }
  if (heroTargetYear) {
    heroTargetYear.textContent = '----';
  }
  if (heroTargetWeekday) {
    heroTargetWeekday.textContent = '--';
  }
  if (birthWeekdayCard) {
    birthWeekdayCard.textContent = '--';
  }
  if (birthNote) {
    birthNote.textContent = 'Your birth weekday appears here.';
  }
  if (targetLabel) {
    targetLabel.textContent = 'Birthday in ----';
  }
  if (targetWeekdayCard) {
    targetWeekdayCard.textContent = '--';
  }
  if (targetNote) {
    targetNote.textContent = 'Your selected-year weekday appears here.';
  }
  if (nextWeekday) {
    nextWeekday.textContent = '--';
  }
  if (nextDate) {
    nextDate.textContent = '--';
  }
  if (nextAge) {
    nextAge.textContent = '--';
  }
  if (nextDays) {
    nextDays.textContent = '--';
  }
  if (summaryLine) {
    summaryLine.textContent = '';
  }
}

function clearError() {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = '';
  errorMessage.classList.add('is-hidden');
}

function showCopyFeedback(message) {
  if (!copyFeedback) {
    return;
  }
  copyFeedback.textContent = message;
  copyFeedback.classList.remove('is-hidden');
  window.clearTimeout(showCopyFeedback.timeoutId);
  showCopyFeedback.timeoutId = window.setTimeout(() => {
    copyFeedback.classList.add('is-hidden');
  }, 2200);
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  copySummaryButton?.setAttribute('disabled', 'true');
  activeViewModel = null;
  setIdleSummary();
  setIdleInsights();
  setExplanationDefaults();
}

function showError(message) {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  copySummaryButton?.setAttribute('disabled', 'true');
  activeViewModel = null;
  setIdleSummary();
  setIdleInsights();
  setExplanationDefaults();
}

function renderRecurrence(recurrence, selectedYear) {
  if (!recurrenceWrap) {
    return;
  }

  recurrenceWrap.innerHTML = '';

  recurrence.forEach((entry) => {
    const item = document.createElement('article');
    item.className = 'birthday-dow-recurrence-item';
    if (entry.year === selectedYear) {
      item.classList.add('is-selected');
    }
    if (entry.isWeekend) {
      item.classList.add('is-weekend');
    }

    const badgeLabel = entry.daysUntil < 0 ? 'Passed' : `Turns ${entry.ageTurning}`;
    item.innerHTML = `
      <p class="birthday-dow-mini-year">${entry.year}</p>
      <h4 class="birthday-dow-mini-weekday">${entry.weekday}</h4>
      <p class="birthday-dow-mini-date">${formatShortDate(entry.date)}</p>
      <span class="birthday-dow-mini-badge">${badgeLabel}</span>
    `;
    recurrenceWrap.appendChild(item);
  });
}

function renderWeekendHighlights(highlights) {
  if (!weekendWrap) {
    return;
  }

  weekendWrap.innerHTML = '';

  highlights.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'birthday-dow-weekend-item';

    if (item.entry) {
      const dayLabel = item.entry.daysUntil === 1 ? 'day' : 'days';
      card.innerHTML = `
        <p class="birthday-dow-weekend-day">${item.weekday}</p>
        <h4 class="birthday-dow-weekend-title">${item.entry.year}</h4>
        <p class="birthday-dow-weekend-copy">${formatShortDate(item.entry.date)}. Turns ${item.entry.ageTurning} in ${item.entry.daysUntil} ${dayLabel}.</p>
      `;
    } else {
      card.innerHTML = `
        <p class="birthday-dow-weekend-day">${item.weekday}</p>
        <h4 class="birthday-dow-weekend-title">No upcoming match</h4>
        <p class="birthday-dow-weekend-copy">No ${item.weekday.toLowerCase()} birthday appears in the current 12-year map.</p>
      `;
    }

    weekendWrap.appendChild(card);
  });
}

function updateExplanation(viewModel) {
  if (explanationFields.dobLabel) {
    explanationFields.dobLabel.textContent = formatLongDate(viewModel.birthDate);
  }
  if (explanationFields.birthWeekday) {
    explanationFields.birthWeekday.textContent = viewModel.birthWeekday;
  }
  if (explanationFields.targetYear) {
    explanationFields.targetYear.textContent = String(viewModel.targetYear);
  }
  if (explanationFields.targetWeekday) {
    explanationFields.targetWeekday.textContent = viewModel.targetWeekday;
  }
  if (explanationFields.nextBirthday) {
    explanationFields.nextBirthday.textContent = formatLongDate(viewModel.nextBirthday.date, {
      includeWeekday: true,
    });
  }
}

function showResults(viewModel) {
  clearError();
  activeViewModel = viewModel;

  if (heroWeekday) {
    heroWeekday.textContent = viewModel.birthWeekday;
  }
  if (heroDate) {
    heroDate.textContent = `${formatLongDate(viewModel.birthDate)} landed on ${viewModel.birthWeekday}.`;
  }
  if (heroTargetYear) {
    heroTargetYear.textContent = String(viewModel.targetYear);
  }
  if (heroTargetWeekday) {
    heroTargetWeekday.textContent = viewModel.targetWeekday;
  }

  if (birthWeekdayCard) {
    birthWeekdayCard.textContent = viewModel.birthWeekday;
  }
  if (birthNote) {
    birthNote.textContent = formatLongDate(viewModel.birthDate);
  }
  if (targetLabel) {
    targetLabel.textContent = `Birthday in ${viewModel.targetYear}`;
  }
  if (targetWeekdayCard) {
    targetWeekdayCard.textContent = viewModel.targetWeekday;
  }
  if (targetNote) {
    targetNote.textContent = formatLongDate(viewModel.targetDate, { includeWeekday: true });
  }
  if (nextWeekday) {
    nextWeekday.textContent = viewModel.nextBirthday.weekday;
  }
  if (nextDate) {
    nextDate.textContent = formatLongDate(viewModel.nextBirthday.date);
  }
  if (nextAge) {
    nextAge.textContent = String(viewModel.nextBirthday.ageTurning);
  }
  if (nextDays) {
    nextDays.textContent = formatDayCount(viewModel.nextBirthday.daysRemaining);
  }
  if (summaryLine) {
    summaryLine.textContent = viewModel.summary;
  }

  renderRecurrence(viewModel.recurrence, viewModel.targetYear);
  renderWeekendHighlights(viewModel.weekendHighlights);
  updateExplanation(viewModel);

  placeholder?.classList.add('is-hidden');
  resultsList?.classList.remove('is-hidden');
  copySummaryButton?.removeAttribute('disabled');
}

async function copySummary() {
  if (!activeViewModel?.summary) {
    showCopyFeedback('Calculate a birthday summary first.');
    return;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(activeViewModel.summary);
    } else {
      const helper = document.createElement('textarea');
      helper.value = activeViewModel.summary;
      helper.setAttribute('readonly', 'true');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    showCopyFeedback('Birthday summary copied.');
  } catch (error) {
    showCopyFeedback('Copy failed on this device.');
  }
}

function calculate() {
  const birthDate = parseDate(dobInput?.value ?? '');
  if (!birthDate) {
    showError('Please enter a valid date of birth.');
    return;
  }

  const today = normalizeDate(new Date());
  if (birthDate > today) {
    showError('Date of birth cannot be in the future.');
    return;
  }

  const targetYear = parseTargetYear(yearInput?.value ?? '');
  if (!Number.isInteger(targetYear) || targetYear < 1600 || targetYear > 2100) {
    showError('Enter a target year between 1600 and 2100.');
    return;
  }

  const viewModel = buildBirthdayViewModel(birthDate, targetYear, today);
  if (!viewModel) {
    showError('Please enter a supported date and year.');
    return;
  }

  showResults(viewModel);
}

const initialYear = new Date().getFullYear();
if (yearInput) {
  yearInput.value = String(initialYear);
}

yearPresetButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const currentYear = new Date().getFullYear();
    const preset = button.dataset.yearPreset;
    const yearMap = {
      current: currentYear,
      next: currentYear + 1,
      'plus-5': currentYear + 5,
    };
    const nextYearValue = yearMap[preset];
    if (Number.isInteger(nextYearValue) && yearInput) {
      yearInput.value = String(nextYearValue);
      syncYearPresetButtons();
    }
  });
});

calculateButton?.addEventListener('click', calculate);
copySummaryButton?.addEventListener('click', copySummary);

yearInput?.addEventListener('input', syncYearPresetButtons);
dobInput?.addEventListener('input', clearError);
yearInput?.addEventListener('input', clearError);

syncYearPresetButtons();
showPlaceholder();
