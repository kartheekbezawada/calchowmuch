import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildBusinessDaysViewModel,
  describeWorkweek,
  getDefaultBusinessDaysState,
  normalizeWorkweek,
} from './engine.js';

const modeButtons = Array.from(document.querySelectorAll('[data-mode]'));
const holidayButtons = Array.from(document.querySelectorAll('[data-holiday]'));
const weekdayButtons = Array.from(document.querySelectorAll('[data-day]'));

const startDateInput = document.querySelector('#business-days-start-date');
const endDateInput = document.querySelector('#business-days-end-date');
const offsetInput = document.querySelector('#business-days-offset');
const calculateButton = document.querySelector('#business-days-calculate');
const resetButton = document.querySelector('#business-days-reset');
const copyButton = document.querySelector('#business-days-copy-summary');
const exportButton = document.querySelector('#business-days-export-calendar');
const errorMessage = document.querySelector('#business-days-error');
const headline = document.querySelector('#business-days-headline');
const summary = document.querySelector('#business-days-summary');
const direction = document.querySelector('#business-days-direction');
const summaryGrid = document.querySelector('#business-days-summary-grid');
const noteList = document.querySelector('#business-days-note-list');
const rulesChip = document.querySelector('#business-days-rules-chip');
const holidayChip = document.querySelector('#business-days-holiday-chip');
const copyFeedback = document.querySelector('#business-days-copy-feedback');
const betweenOnly = Array.from(document.querySelectorAll('.bd-between-only'));
const shiftOnly = Array.from(document.querySelectorAll('.bd-shift-only'));

let exportUrl = null;

const state = {
  mode: 'between',
  holidayPreset: 'none',
  workweek: [1, 2, 3, 4, 5],
  lastViewModel: null,
  copyTimer: null,
};

const FAQ_ENTITIES = [
  ['Does the count include the start and end dates?', 'Yes in count mode. The page counts the full span, then removes weekends and observed holidays from that inclusive calendar range.'],
  ['How does add or subtract mode treat the start date?', 'The anchor date is the reference point. The calculator moves away from it and counts only the business days that are actually traversed.'],
  ['What if I need total days instead of business days?', 'Use the full date-difference calculator when weekends and holidays should stay inside the answer.'],
  ['Can I use this as a countdown tool?', 'Use this page for schedule math first. If you want to track how many calendar days are left, switch to the days-until countdown view.'],
];

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

setPageMetadata({
  title: 'Business Days Calculator | Count Working Days and Shift Deadlines',
  description:
    'Count business days between two dates or add and subtract working days with a custom workweek plus US and UK observed holiday presets.',
  canonical: 'https://calchowmuch.com/time-and-date/business-days-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Business Days Calculator',
        url: 'https://calchowmuch.com/time-and-date/business-days-calculator/',
        description:
          'Count business days between dates or move forward and backward by business days with custom workweek rules and observed holiday presets.',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Business Days Calculator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/time-and-date/business-days-calculator/',
        description:
          'Free business days calculator for working-day counts, date shifting, custom workweeks, and US or UK observed holidays.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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
            name: 'Business Days Calculator',
            item: 'https://calchowmuch.com/time-and-date/business-days-calculator/',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ENTITIES.map(([name, text]) => ({
          '@type': 'Question',
          name,
          acceptedAnswer: {
            '@type': 'Answer',
            text,
          },
        })),
      },
    ],
  },
  pageSchema,
});

function ensureTitle() {
  const title = document.querySelector('#calculator-title');
  if (!title) {
    return;
  }
  title.textContent = 'Business Days Calculator';
}

function formatDateInputValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateInput(value) {
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

function setMode(mode) {
  state.mode = mode;
  modeButtons.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  betweenOnly.forEach((node) => node.classList.toggle('is-hidden', mode !== 'between'));
  shiftOnly.forEach((node) => node.classList.toggle('is-hidden', mode !== 'shift'));
}

function setHolidayPreset(preset) {
  state.holidayPreset = preset;
  holidayButtons.forEach((button) => {
    const active = button.dataset.holiday === preset;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function setWorkweek(days) {
  state.workweek = normalizeWorkweek(days);
  weekdayButtons.forEach((button) => {
    const day = Number(button.dataset.day);
    const active = state.workweek.includes(day);
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function updateSummaryCards(cards) {
  summaryGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="bd-summary-card">
          <strong>${card.label}</strong>
          <div class="bd-summary-value">${card.value}</div>
          <p>${card.helper}</p>
        </article>
      `
    )
    .join('');
}

function updateNotes(notes) {
  noteList.innerHTML = notes.map((note) => `<div class="bd-note-item">${note}</div>`).join('');
}

function cleanupExportUrl() {
  if (exportUrl) {
    URL.revokeObjectURL(exportUrl);
    exportUrl = null;
  }
}

function buildIcsFile(viewModel) {
  const formatStamp = (date) => {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
  };
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalcHowMuch//Business Days Calculator//EN',
    'BEGIN:VEVENT',
    `UID:business-days-${Date.now()}@calchowmuch.com`,
    `DTSTAMP:${formatStamp(new Date())}T000000Z`,
    `DTSTART;VALUE=DATE:${formatStamp(viewModel.export.startDate)}`,
    `DTEND;VALUE=DATE:${formatStamp(viewModel.export.endDate)}`,
    `SUMMARY:${viewModel.export.title}`,
    `DESCRIPTION:${viewModel.export.description.replace(/\n/g, ' ')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

function showCopyFeedback() {
  copyFeedback.classList.remove('is-hidden');
  window.clearTimeout(state.copyTimer);
  state.copyTimer = window.setTimeout(() => {
    copyFeedback.classList.add('is-hidden');
  }, 1600);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('is-hidden');
}

function render(viewModel) {
  state.lastViewModel = viewModel;
  direction.textContent = viewModel.directionLabel;
  headline.textContent = viewModel.headline;
  summary.textContent = viewModel.summary;
  updateSummaryCards(viewModel.cards);
  updateNotes(viewModel.notes);
  rulesChip.textContent = describeWorkweek(state.workweek);
  holidayChip.textContent = holidayButtons.find((button) => button.dataset.holiday === state.holidayPreset)?.textContent || 'No holidays';
  cleanupExportUrl();
  exportUrl = URL.createObjectURL(new Blob([buildIcsFile(viewModel)], { type: 'text/calendar' }));
  exportButton.href = exportUrl;
}

function readInputs() {
  const startDate = parseDateInput(startDateInput.value);
  const endDate = parseDateInput(endDateInput.value);
  const offset = Number(offsetInput.value || 0);
  if (!startDate) {
    showError('Choose a valid start date.');
    return null;
  }
  if (state.mode === 'between' && !endDate) {
    showError('Choose a valid end date.');
    return null;
  }
  if (state.mode === 'shift' && !Number.isFinite(offset)) {
    showError('Enter a whole business-day offset.');
    return null;
  }
  clearError();
  return {
    mode: state.mode,
    startDate,
    endDate,
    offset: Math.trunc(offset),
    workweek: state.workweek,
    holidayPreset: state.holidayPreset,
  };
}

function calculate() {
  const inputs = readInputs();
  if (!inputs) {
    return;
  }
  const viewModel = buildBusinessDaysViewModel(inputs);
  if (!viewModel) {
    showError('Unable to calculate a business-day answer from the current inputs.');
    return;
  }
  render(viewModel);
}

function resetToDefault() {
  const defaults = getDefaultBusinessDaysState();
  startDateInput.value = formatDateInputValue(defaults.startDate);
  endDateInput.value = formatDateInputValue(defaults.endDate);
  offsetInput.value = String(defaults.offset);
  setMode(defaults.mode);
  setHolidayPreset(defaults.holidayPreset);
  setWorkweek(defaults.workweek);
  clearError();
  const viewModel = buildBusinessDaysViewModel(defaults);
  if (viewModel) {
    render(viewModel);
  }
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode || 'between'));
});

holidayButtons.forEach((button) => {
  button.addEventListener('click', () => setHolidayPreset(button.dataset.holiday || 'none'));
});

weekdayButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const day = Number(button.dataset.day);
    const activeSet = new Set(state.workweek);
    if (activeSet.has(day)) {
      activeSet.delete(day);
    } else {
      activeSet.add(day);
    }
    setWorkweek(Array.from(activeSet));
  });
});

calculateButton?.addEventListener('click', calculate);
resetButton?.addEventListener('click', resetToDefault);
copyButton?.addEventListener('click', async () => {
  if (!state.lastViewModel) {
    return;
  }
  await navigator.clipboard.writeText(state.lastViewModel.copySummary);
  showCopyFeedback();
});

window.addEventListener('beforeunload', cleanupExportUrl);

ensureTitle();
resetToDefault();
