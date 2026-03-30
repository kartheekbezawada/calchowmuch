import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  BREAK_OPTIONS,
  calculateSegmentMinutes,
  calculateTotalWithBreak,
  calculateWeeklyTotals,
  formatDecimalHours,
  formatHHMM,
  parseTimeString,
} from '/assets/js/core/work-hours-utils.js';

const modeGroup = document.querySelector('[data-button-group="work-hours-mode"]');
const singleSection = document.querySelector('#work-hours-single');
const splitSection = document.querySelector('#work-hours-split');
const weeklySection = document.querySelector('#work-hours-weekly');

const singleStartInput = document.querySelector('#work-hours-single-start');
const singleEndInput = document.querySelector('#work-hours-single-end');
const singleNextDayInput = document.querySelector('#work-hours-single-next-day');
const singleBreakGroup = document.querySelector('[data-button-group="work-hours-single-break"]');

const splitStartInput = document.querySelector('#work-hours-split-1-start');
const splitEndInput = document.querySelector('#work-hours-split-1-end');
const splitNextDayInput = document.querySelector('#work-hours-split-1-next-day');
const split2StartInput = document.querySelector('#work-hours-split-2-start');
const split2EndInput = document.querySelector('#work-hours-split-2-end');
const split2NextDayInput = document.querySelector('#work-hours-split-2-next-day');
const splitBreakGroup = document.querySelector('[data-button-group="work-hours-split-break"]');

const calculateButton = document.querySelector('#work-hours-calculate');
const resultsList = document.querySelector('#work-hours-results-list');
const placeholder = document.querySelector('#work-hours-placeholder');
const errorMessage = document.querySelector('#work-hours-error');

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I calculate hours for a night shift?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enable "Ends next day" when your shift ends after midnight.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this include paid breaks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Only unpaid breaks that you enter are subtracted.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do I see both HH:MM and decimal hours?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Different systems use different formats. HH:MM is easier to read, while decimal hours are often used for payroll.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it round time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It uses the exact times you enter. If your employer rounds to the nearest 5, 10, or 15 minutes, you should apply that policy separately.',
      },
    },
  ],
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Work Hours Calculator | Shifts, Breaks and Totals',
      url: 'https://calchowmuch.com/time-and-date/work-hours-calculator/',
      description:
        'Calculate single, split, or weekly work hours, subtract unpaid breaks, and view totals in HH:MM and decimal hours.',
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Work Hours Calculator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: 'https://calchowmuch.com/time-and-date/work-hours-calculator/',
      description:
        'Free work hours calculator for single shifts, split shifts, weekly totals, and unpaid break deductions.',
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
          name: 'Work Hours Calculator',
          item: 'https://calchowmuch.com/time-and-date/work-hours-calculator/',
        },
      ],
    },
  ],
};

const metadata = {
  title: 'Work Hours Calculator | Shift, Break & Weekly Hour Totals',
  description:
    'Calculate shift hours, split shifts, unpaid breaks, and weekly totals in HH:MM and decimal hours for timesheets, rotas, and payroll checks.',
  canonical: 'https://calchowmuch.com/time-and-date/work-hours-calculator/',
  structuredData: STRUCTURED_DATA,
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
};

setPageMetadata(metadata);

function ensureH1Title() {
  const title = document.getElementById('calculator-title');
  if (!title || title.tagName === 'H1') {
    return;
  }
  const h1 = document.createElement('h1');
  h1.id = 'calculator-title';
  h1.textContent = 'Work Hours Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

function updateDataPlaceholders(attribute, values) {
  document.querySelectorAll(`[data-${attribute}]`).forEach((node) => {
    const key = node.getAttribute(`data-${attribute}`);
    if (!key || !Object.prototype.hasOwnProperty.call(values, key)) {
      return;
    }
    node.textContent = String(values[key]);
  });
}

function formatTimeRange(startValue, endValue) {
  if (!startValue || !endValue) {
    return 'Not set';
  }
  return `${startValue} to ${endValue}`;
}

const weeklyRows = Array.from(document.querySelectorAll('[data-weekly-day]')).map((row) => ({
  label: row.dataset.weeklyLabel,
  startInput: row.querySelector('[data-weekly-start]'),
  endInput: row.querySelector('[data-weekly-end]'),
  nextDayInput: row.querySelector('[data-weekly-next-day]'),
  breakGroup: setupButtonGroup(row.querySelector('[data-weekly-break]'), {
    defaultValue: '0',
    onChange: () => showPlaceholder(),
  }),
}));

const singleBreakButtons = setupButtonGroup(singleBreakGroup, {
  defaultValue: '30',
  onChange: () => showPlaceholder(),
});

const splitBreakButtons = setupButtonGroup(splitBreakGroup, {
  defaultValue: '30',
  onChange: () => showPlaceholder(),
});

function setSectionVisibility(section, isVisible) {
  if (!section) {
    return;
  }
  section.classList.toggle('is-collapsed', !isVisible);
  section.setAttribute('aria-hidden', String(!isVisible));
}

function updateModeVisibility(mode) {
  setSectionVisibility(singleSection, mode === 'single');
  setSectionVisibility(splitSection, mode === 'split');
  setSectionVisibility(weeklySection, mode === 'weekly');
  showPlaceholder();
}

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'single',
  onChange: (value) => updateModeVisibility(value),
});

updateModeVisibility(modeButtons?.getValue() ?? 'single');

function getBreakMinutes(buttonGroup, fallback) {
  const value = Number.parseInt(buttonGroup?.getValue() ?? '', 10);
  if (BREAK_OPTIONS.includes(value)) {
    return value;
  }
  return fallback;
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

function addResultLine(text) {
  if (!resultsList) {
    return;
  }
  const line = document.createElement('div');
  line.className = 'result-line';
  line.textContent = text;
  resultsList.appendChild(line);
}

function buildExplanationData(result, totalHHMM, decimalHours) {
  const grossMinutes = result.totalMinutes + result.totalBreakMinutes;
  const grossHHMM = formatHHMM(grossMinutes);

  const summaryData = {
    mode:
      result.mode === 'single'
        ? 'single shift'
        : result.mode === 'split'
          ? 'split shift'
          : 'weekly total',
    primaryInput: result.primaryInput,
    secondaryInput: result.secondaryInput,
    breakMinutes: result.totalBreakMinutes,
    totalHHMM,
    totalDecimal: decimalHours,
  };

  const scenarioData = {
    modeLabel:
      result.mode === 'single'
        ? 'Single Shift'
        : result.mode === 'split'
          ? 'Split Shift'
          : 'Weekly Total',
    primaryWindow: result.primaryInput,
    secondaryWindow: result.secondaryInput,
    breakValue: `${result.totalBreakMinutes} minutes`,
    overnightValue: result.overnightLabel,
  };

  const metricData = {
    workedHhmm: totalHHMM,
    workedDecimal: decimalHours,
    breakMinutes: result.totalBreakMinutes,
    grossHhmm: grossHHMM,
  };

  const explData = {
    modeNarrative: summaryData.mode,
    totalHHMM,
    totalDecimal: decimalHours,
    grossHHMM,
    breakMinutes: result.totalBreakMinutes,
  };

  updateDataPlaceholders('work-summary', summaryData);
  updateDataPlaceholders('work-scenario', scenarioData);
  updateDataPlaceholders('work-metric', metricData);
  updateDataPlaceholders('work-expl', explData);
}

function buildResults(result) {
  if (!resultsList || !placeholder) {
    return;
  }
  const { mode, totalMinutes, totalBreakMinutes, segmentMinutes, dailyLines } = result;
  resultsList.innerHTML = '';
  const totalHHMM = formatHHMM(totalMinutes);
  const decimalHours = formatDecimalHours(totalMinutes);

  addResultRow('Total worked time', totalHHMM);
  addResultRow('Total hours (decimal)', `${decimalHours} hours`);
  addResultRow('Total break deducted', `${totalBreakMinutes} minutes`);

  if (mode === 'split' && segmentMinutes?.length) {
    addResultLine(`Segment 1: ${formatHHMM(segmentMinutes[0])}`);
    if (segmentMinutes[1] !== undefined) {
      addResultLine(`Segment 2: ${formatHHMM(segmentMinutes[1])}`);
    }
  }

  if (mode === 'weekly' && dailyLines?.length) {
    dailyLines.forEach((line) => addResultLine(line));
  }

  buildExplanationData(result, totalHHMM, decimalHours);
  placeholder.classList.add('is-hidden');
  resultsList.classList.remove('is-hidden');
}

function calculateSingle() {
  const start = parseTimeString(singleStartInput?.value ?? '');
  const end = parseTimeString(singleEndInput?.value ?? '');
  if (!start || !end) {
    return { error: 'Please enter both start and end times.' };
  }
  const segmentMinutes = calculateSegmentMinutes(start, end, singleNextDayInput?.checked);
  if (segmentMinutes === null) {
    return {
      error: 'End time must be after start time unless "Ends next day" is checked.',
    };
  }
  const breakMinutes = getBreakMinutes(singleBreakButtons, 30);
  if (breakMinutes > segmentMinutes) {
    return { error: 'Break minutes cannot exceed worked minutes.' };
  }
  return {
    mode: 'single',
    totalMinutes: segmentMinutes - breakMinutes,
    totalBreakMinutes: breakMinutes,
    primaryInput: formatTimeRange(singleStartInput?.value ?? '', singleEndInput?.value ?? ''),
    secondaryInput: 'Not used',
    overnightLabel: singleNextDayInput?.checked ? 'Yes' : 'No',
  };
}

function calculateSplit() {
  const start1 = parseTimeString(splitStartInput?.value ?? '');
  const end1 = parseTimeString(splitEndInput?.value ?? '');
  if (!start1 || !end1) {
    return { error: 'Segment 1 requires start and end times.' };
  }
  const segment1 = calculateSegmentMinutes(start1, end1, splitNextDayInput?.checked);
  if (segment1 === null) {
    return {
      error: 'Segment 1 end time must be after start time unless "Ends next day" is checked.',
    };
  }

  const start2Raw = split2StartInput?.value ?? '';
  const end2Raw = split2EndInput?.value ?? '';
  const hasSegment2 = Boolean(start2Raw || end2Raw);
  const segments = [{ start: start1, end: end1, endsNextDay: splitNextDayInput?.checked }];

  if (hasSegment2) {
    const start2 = parseTimeString(start2Raw);
    const end2 = parseTimeString(end2Raw);
    if (!start2 || !end2) {
      return { error: 'Segment 2 requires both start and end times when used.' };
    }
    const segment2 = calculateSegmentMinutes(start2, end2, split2NextDayInput?.checked);
    if (segment2 === null) {
      return {
        error: 'Segment 2 end time must be after start time unless "Ends next day" is checked.',
      };
    }
    segments.push({ start: start2, end: end2, endsNextDay: split2NextDayInput?.checked });
  }

  const breakMinutes = getBreakMinutes(splitBreakButtons, 30);
  const total = calculateTotalWithBreak(segments, breakMinutes);
  if (!total) {
    return { error: 'Break minutes cannot exceed worked minutes.' };
  }

  return {
    mode: 'split',
    totalMinutes: total.totalMinutes,
    totalBreakMinutes: total.totalBreakMinutes,
    segmentMinutes: total.segmentMinutes,
    primaryInput: formatTimeRange(splitStartInput?.value ?? '', splitEndInput?.value ?? ''),
    secondaryInput: hasSegment2
      ? formatTimeRange(split2StartInput?.value ?? '', split2EndInput?.value ?? '')
      : 'Not used',
    overnightLabel:
      splitNextDayInput?.checked || split2NextDayInput?.checked
        ? 'Yes (one or more segments)'
        : 'No',
  };
}

function calculateWeekly() {
  const days = [];
  weeklyRows.forEach((row) => {
    const startValue = row.startInput?.value ?? '';
    const endValue = row.endInput?.value ?? '';
    const hasAny = Boolean(startValue || endValue);
    if (!hasAny) {
      days.push({
        label: row.label,
        start: null,
        end: null,
        endsNextDay: row.nextDayInput?.checked,
        breakMinutes: 0,
      });
      return;
    }
    const start = parseTimeString(startValue);
    const end = parseTimeString(endValue);
    if (!start || !end) {
      days.push({
        label: row.label,
        start: null,
        end: null,
        endsNextDay: row.nextDayInput?.checked,
        breakMinutes: 0,
        error: true,
      });
      return;
    }
    const breakMinutes = getBreakMinutes(row.breakGroup, 0);
    days.push({
      label: row.label,
      start,
      end,
      endsNextDay: row.nextDayInput?.checked,
      breakMinutes,
    });
  });

  const filledDays = days.filter((day) => day.start && day.end);
  if (!filledDays.length) {
    return { error: 'Please enter at least one day with start and end times.' };
  }
  if (days.some((day) => day.error)) {
    return { error: 'Please enter both start and end times for each day you use.' };
  }

  const totals = calculateWeeklyTotals(filledDays);
  if (!totals) {
    return { error: 'Check that end times are valid and breaks do not exceed worked minutes.' };
  }

  const dailyLines = filledDays.map(
    (day, index) => `${day.label}: ${formatHHMM(totals.dailyMinutes[index])}`
  );

  return {
    mode: 'weekly',
    totalMinutes: totals.totalMinutes,
    totalBreakMinutes: totals.totalBreakMinutes,
    dailyLines,
    primaryInput: `${filledDays.length} day(s) entered`,
    secondaryInput: 'Per-day windows listed below',
    overnightLabel: filledDays.some((day) => day.endsNextDay) ? 'Yes (one or more days)' : 'No',
  };
}

function calculate() {
  const mode = modeButtons?.getValue() ?? 'single';
  let result;
  if (mode === 'single') {
    result = calculateSingle();
  } else if (mode === 'split') {
    result = calculateSplit();
  } else {
    result = calculateWeekly();
  }

  if (result?.error) {
    showError(result.error);
    return;
  }
  if (!result) {
    showError('Please check your inputs and try again.');
    return;
  }
  buildResults(result);
}

calculateButton?.addEventListener('click', () => calculate());

const inputs = document.querySelectorAll('#calc-work-hours input');
inputs.forEach((input) => {
  input.addEventListener('input', () => showPlaceholder());
  input.addEventListener('change', () => showPlaceholder());
});

showPlaceholder();
