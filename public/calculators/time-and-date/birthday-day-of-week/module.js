import { setPageMetadata } from '/assets/js/core/ui.js';
import { buildBirthdayViewModel, formatLongDate } from './engine.js';

const dobInput = document.querySelector('#birthday-dow-dob');
const yearInput = document.querySelector('#birthday-dow-year');
const calculateButton = document.querySelector('#birthday-dow-calculate');
const copySummaryButton = document.querySelector('#birthday-dow-copy-summary');
const yearPresetButtons = Array.from(document.querySelectorAll('[data-year-preset]'));
const resultsList = document.querySelector('#birthday-dow-results-list');
const placeholder = document.querySelector('#birthday-dow-placeholder');
const errorMessage = document.querySelector('#birthday-dow-error');
const copyFeedback = document.querySelector('#birthday-dow-copy-feedback');

const spotlightKicker = document.querySelector('#birthday-dow-spotlight-kicker');
const spotlightTitle = document.querySelector('#birthday-dow-spotlight-title');
const spotlightText = document.querySelector('#birthday-dow-spotlight-text');
const heroWeekday = document.querySelector('#birthday-dow-hero-weekday');
const weekdayMeaning = document.querySelector('#birthday-dow-weekday-meaning');
const heroDate = document.querySelector('#birthday-dow-hero-date');
const heroTargetYear = document.querySelector('#birthday-dow-hero-target-year');

const targetLabel = document.querySelector('#birthday-dow-target-label');
const targetWeekdayCard = document.querySelector('#birthday-dow-target-weekday-card');
const targetNote = document.querySelector('#birthday-dow-target-note');
const nextWeekday = document.querySelector('#birthday-dow-next-weekday');
const nextDate = document.querySelector('#birthday-dow-next-date');
const nextAge = document.querySelector('#birthday-dow-next-age');
const nextDays = document.querySelector('#birthday-dow-next-days');
const nextPanelTitle = document.querySelector('#birthday-dow-next-panel-title');
const nextPanelCopy = document.querySelector('#birthday-dow-next-panel-copy');
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

// The 10 entries below must stay verbatim-consistent with the `birthday-dow-faq-item` blocks in
// explanation.html — the static build extracts the FAQPage schema from that DOM, and this runtime
// copy replaces it via setPageMetadata(). Order and wording must match exactly.
const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the birth weekday accurate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The result follows standard Gregorian calendar rules across the supported range.',
      },
    },
    {
      '@type': 'Question',
      name: 'What day was I born?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your date of birth above and the calculator shows the day of the week you were born on straight away, along with the full date. For example, someone born on 15 June 1990 was born on a Friday.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find out what day I was born on by date of birth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your date of birth in the field above and the weekday appears immediately - no sign-up and nothing to submit. To check it by hand instead, use the Doomsday rule described above.',
      },
    },
    {
      '@type': 'Question',
      name: 'What day of the week does my birthday fall on this year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your date of birth and leave the target year set to this year. The result shows both the weekday you were born on and the weekday your birthday falls on in the year you selected.',
      },
    },
    {
      '@type': 'Question',
      name: 'What day was my birthday last year, and what day is it this year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Set the target year to last year to read that weekday, then change it to this year. A common year shifts a birthday forward one weekday and a leap year shifts it two, so the two answers are usually one or two days apart.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does the weekday change every year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because a normal year leaves one extra day after complete weeks, and leap years can shift it again.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I plan future birthday weekends here?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Use the Weekend insights section and the 12-year map to find Friday, Saturday, or Sunday birthdays quickly.',
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
      name: 'How far forward can I preview?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The supported target-year range is 1600 to 2100.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this store my birthday?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The planner runs in the browser and does not submit your birthday anywhere.',
      },
    },
  ],
};

// This block is the runtime source of truth — setPageMetadata() replaces the server-rendered
// JSON-LD, so it must stay consistent with CALCULATOR_OVERRIDES['birthday-day-of-week'] and
// TIME_AND_DATE_SCHEMA_CONFIG in scripts/generate-mpa-pages.js and with the _release seo spec.
// Shape mirrors buildTimeAndDateStructuredData(): WebSite + Organization + WebPage + BreadcrumbList,
// with the FAQPage merged in from CALCULATOR_FAQ_SCHEMA by setPageMetadata().
const SITE_URL = 'https://calchowmuch.com';
const OG_IMAGE = `${SITE_URL}/assets/images/og-default.png`;
const CANONICAL = `${SITE_URL}/time-and-date/birthday-day-of-week/`;
const metadata = {
  title: 'What Day of the Week Was I Born? | Birth Day by Date of Birth',
  description:
    'Enter your date of birth to find out what day of the week you were born on. See the weekday for your next birthday, the year ahead, and the next 12 years.',
  canonical: CANONICAL,
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'CalcHowMuch',
        inLanguage: 'en',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'CalcHowMuch',
        url: `${SITE_URL}/`,
        logo: { '@type': 'ImageObject', url: OG_IMAGE },
      },
      {
        '@type': 'WebPage',
        '@id': `${CANONICAL}#webpage`,
        name: 'What Day of the Week Was I Born? | Birth Day by Date of Birth',
        url: CANONICAL,
        description:
          'Enter your date of birth to find the weekday you were born on, preview a future birthday year, and spot the next Friday, Saturday, or Sunday birthday.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
        primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE },
        breadcrumb: { '@id': `${CANONICAL}#breadcrumbs` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${CANONICAL}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Time & Date',
            item: `${SITE_URL}/time-and-date/`,
          },
          {
            // Deliberately a short noun phrase rather than the H1 or the title's second half.
            // Google renders this as the SERP breadcrumb trail, where "What day of the week was
            // I born?" or "by Date of Birth" both read badly.
            '@type': 'ListItem',
            position: 3,
            name: 'Birth Day Calculator',
            item: CANONICAL,
          },
        ],
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
    h1.textContent = 'What day of the week was I born?';
    title.replaceWith(h1);
    return;
  }

  title.textContent = 'What day of the week was I born?';
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

function formatRemainingDays(daysRemaining) {
  if (!Number.isInteger(daysRemaining)) {
    return '';
  }

  const dayLabel = daysRemaining === 1 ? 'day' : 'days';
  return `${daysRemaining} ${dayLabel} away`;
}

function getSoonestWeekendOption(weekendHighlights) {
  if (!Array.isArray(weekendHighlights)) {
    return null;
  }

  return weekendHighlights
    .filter((item) => item?.entry)
    .sort((left, right) => left.entry.daysUntil - right.entry.daysUntil)[0] ?? null;
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

function getIdleSpotlight() {
  return {
    kicker: 'Birth weekday',
    title: 'Enter your date of birth to see the result',
    text: 'One clear answer first. Future birthday details appear below after you calculate.',
    answer: '--',
  };
}

function getSpotlightContent(viewModel) {
  if (!viewModel) {
    return getIdleSpotlight();
  }

  return {
    kicker: 'You were born on',
    title: `${viewModel.birthWeekday}, ${formatLongDate(viewModel.birthDate)}`,
    text: `In ${viewModel.targetYear}, your birthday falls on ${viewModel.targetWeekday}.`,
    answer: viewModel.birthWeekday,
  };
}

// The "Monday's Child" nursery-rhyme line for each weekday — shown under the result as a keepsake,
// mirroring the explanation.html "What your birth weekday means" section.
const WEEKDAY_RHYME_LINE = {
  Monday: 'Monday’s child is fair of face.',
  Tuesday: 'Tuesday’s child is full of grace.',
  Wednesday: 'Wednesday’s child is full of woe.',
  Thursday: 'Thursday’s child has far to go.',
  Friday: 'Friday’s child is loving and giving.',
  Saturday: 'Saturday’s child works hard for a living.',
  Sunday: 'Sunday’s child is bonny and blithe, and good and gay.',
};

function renderSpotlight(viewModel) {
  const content = getSpotlightContent(viewModel);
  if (weekdayMeaning) {
    const line = viewModel ? WEEKDAY_RHYME_LINE[viewModel.birthWeekday] : '';
    weekdayMeaning.textContent = line || '';
    weekdayMeaning.classList.toggle('is-hidden', !line);
  }

  if (spotlightKicker) {
    spotlightKicker.textContent = content.kicker;
  }
  if (spotlightTitle) {
    spotlightTitle.textContent = content.title;
  }
  if (spotlightText) {
    spotlightText.textContent = content.text;
  }
  if (heroWeekday) {
    heroWeekday.textContent = content.answer;
  }

  if (heroDate) {
    heroDate.textContent = viewModel
      ? `You were born on ${formatLongDate(viewModel.birthDate, { includeWeekday: true })}.`
      : 'Waiting for a date';
  }
  if (heroTargetYear) {
    heroTargetYear.textContent = viewModel
      ? `Previewing ${viewModel.targetYear}`
      : 'Add a year to preview a future birthday';
  }
}

function setIdleInsights() {
  if (recurrenceWrap) {
    recurrenceWrap.innerHTML =
      '<p class="birthday-dow-empty-state">Enter your date of birth to see your 12-year birthday map.</p>';
  }

  if (weekendWrap) {
    weekendWrap.innerHTML =
      '<p class="birthday-dow-empty-state">Enter your date of birth to see upcoming Friday, Saturday, and Sunday birthdays.</p>';
  }
}

function setExplanationDefaults() {
  if (explanationFields.dobLabel) {
    explanationFields.dobLabel.textContent = 'your birthday date';
  }
  if (explanationFields.birthWeekday) {
    explanationFields.birthWeekday.textContent = 'still waiting';
  }
  if (explanationFields.targetYear) {
    explanationFields.targetYear.textContent = 'the selected year';
  }
  if (explanationFields.targetWeekday) {
    explanationFields.targetWeekday.textContent = "that year's weekday";
  }
  if (explanationFields.nextBirthday) {
    explanationFields.nextBirthday.textContent = 'still to be calculated';
  }
}

function setIdleSummary() {
  renderSpotlight(null);

  if (targetLabel) {
    targetLabel.textContent = 'Birthday in ----';
  }
  if (targetWeekdayCard) {
    targetWeekdayCard.textContent = '--';
  }
  if (targetNote) {
    targetNote.textContent = 'Your selected-year birthday preview appears here.';
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
  if (nextPanelTitle) {
    nextPanelTitle.textContent = 'Next birthday';
  }
  if (nextPanelCopy) {
    nextPanelCopy.textContent = 'Date, age, countdown.';
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

function applyIdleState() {
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  copySummaryButton?.setAttribute('disabled', 'true');
  activeViewModel = null;
  setIdleSummary();
  setIdleInsights();
  setExplanationDefaults();
}

function showPlaceholder() {
  clearError();
  applyIdleState();
}

function showError(message) {
  applyIdleState();
  if (!errorMessage) {
    return;
  }

  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
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
      <h5 class="birthday-dow-mini-weekday">${entry.weekday}</h5>
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
        <h5 class="birthday-dow-weekend-title">${item.entry.year}</h5>
        <p class="birthday-dow-weekend-copy">Next ${item.weekday.toLowerCase()} birthday: ${formatShortDate(item.entry.date)}. Turns ${item.entry.ageTurning} in ${item.entry.daysUntil} ${dayLabel}.</p>
      `;
    } else {
      card.innerHTML = `
        <p class="birthday-dow-weekend-day">${item.weekday}</p>
        <h5 class="birthday-dow-weekend-title">No match</h5>
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

  renderSpotlight(viewModel);

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
  if (nextPanelTitle) {
    nextPanelTitle.textContent = `${viewModel.nextBirthday.weekday}, ${formatLongDate(viewModel.nextBirthday.date)}`;
  }
  if (nextPanelCopy) {
    nextPanelCopy.textContent = `Your next birthday is on ${formatLongDate(viewModel.nextBirthday.date, { includeWeekday: true })}. You turn ${viewModel.nextBirthday.ageTurning}. ${formatRemainingDays(viewModel.nextBirthday.daysRemaining)}.`;
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
    const presetYear = {
      current: currentYear,
      next: currentYear + 1,
      'plus-5': currentYear + 5,
    }[preset];

    if (yearInput && Number.isInteger(presetYear)) {
      yearInput.value = String(presetYear);
      syncYearPresetButtons();
    }
  });
});

yearInput?.addEventListener('input', syncYearPresetButtons);
dobInput?.addEventListener('input', clearError);
yearInput?.addEventListener('input', clearError);
calculateButton?.addEventListener('click', calculate);
copySummaryButton?.addEventListener('click', copySummary);

syncYearPresetButtons();
showPlaceholder();
