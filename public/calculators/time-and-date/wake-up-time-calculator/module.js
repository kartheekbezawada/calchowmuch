import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  calculateWakeUpRecommendations,
  roundToNextQuarterHour,
  roundToMinute,
  FALL_ASLEEP_MINUTES,
  SLEEP_CYCLES,
  CYCLE_MINUTES,
} from '/assets/js/core/sleep-utils.js';

const modeGroup = document.querySelector('[data-button-group="wake-mode"]');
const fieldLabel = document.querySelector('#wake-field-label');
const primaryTimeInput = document.querySelector('#wake-time-primary');
const timePickerButton = document.querySelector('#wake-time-picker');
const nowButton = document.querySelector('#wake-now');
const calculateButton = document.querySelector('#wake-calculate');
const resultsList = document.querySelector('#wake-results-list');
const placeholder = document.querySelector('#wake-placeholder');
const errorMessage = document.querySelector('#wake-error');
const bufferCopy = document.querySelector('#wake-buffer-copy');

const proxyInput = document.querySelector('#wake-latency-proxy');
const proxyButton = document.querySelector('#wake-calc');
const proxyResult = document.querySelector('#wake-result');

const summaryInputTime = document.querySelector('[data-wake-summary="input-time"]');
const summarySleepStart = document.querySelector('[data-wake-summary="sleep-start"]');
const summaryRecommendedWake = document.querySelector('[data-wake-summary="recommended-wake"]');
const scenarioMode = document.querySelector('[data-wake-scenario="mode"]');
const scenarioInput = document.querySelector('[data-wake-scenario="input"]');
const scenarioSleepStart = document.querySelector('[data-wake-scenario="sleep-start"]');
const scenarioRecommended = document.querySelector('[data-wake-scenario="recommended"]');
const cycle4Value = document.querySelector('[data-wake-metric="cycle-4"]');
const cycle5Value = document.querySelector('[data-wake-metric="cycle-5"]');
const cycle6Value = document.querySelector('[data-wake-metric="cycle-6"]');
const bufferValue = document.querySelector('[data-wake-metric="buffer"]');
const explanationPrimary = document.querySelector('[data-wake-expl="primary"]');
const explanationWindow = document.querySelector('[data-wake-expl="window"]');

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

// These 13 entries must stay verbatim-consistent with the `wake-faq-item` blocks in
// explanation.html — the static build extracts the FAQPage schema from that DOM, and this runtime
// copy replaces it via setPageMetadata(). Order and wording must match exactly.
const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How many sleep cycles should I aim for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most adults feel best after 5 or 6 complete cycles, which is roughly 7.5 to 9 hours of sleep. Four cycles, about 6 hours, works for an occasional early start, but a run of short nights builds sleep debt. Your own ideal number can sit slightly outside that range.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a sleep cycle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A sleep cycle is one full pass through light sleep, deep sleep, and REM sleep. It averages about 90 minutes but realistically ranges from 70 to 120 minutes, and the early cycles of the night hold more deep sleep while later ones hold more REM.',
      },
    },
    {
      '@type': 'Question',
      name: 'What time should I wake up if I go to sleep now?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Add 6 hours for 4 cycles, 7 hours 30 minutes for 5 cycles, or 9 hours for 6 cycles to the time you actually fall asleep. If you are getting into bed now rather than already drifting off, add another 10 to 20 minutes first. The "I\'m going to sleep now" button does this from the current time.',
      },
    },
    {
      '@type': 'Question',
      name: 'If I sleep at 10 and wake up at 6, how many hours is that?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'That is 8 hours, or about five and a third 90-minute cycles. Sleeping from 10 pm to 7 am is 9 hours, which is 6 full cycles, and 10 pm to 5:30 am is 7.5 hours, which is 5 cycles. The sleep-duration table above lists more common pairs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it better to wake up after 5 or 6 sleep cycles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Six cycles gives more total sleep and more REM, so it is the better choice when you can protect the time. Five cycles is the common weekday compromise because it still clears 7 hours while fitting a normal schedule. Pick the option you can repeat consistently rather than the longest single night.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do I still feel groggy after a suggested wake-up time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cycle length varies from night to night, so an alarm set to an average can still land in deep sleep. Sleep debt, alcohol, late caffeine, and waking in darkness all deepen that grogginess, which is called sleep inertia. It usually fades within 15 to 60 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the calculator assume it takes time to fall asleep?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In bedtime mode it adds a fixed 15-minute fall-asleep buffer before the first cycle starts. In fall-asleep mode it assumes you are already asleep at the time you enter, so no buffer is added. Most healthy sleepers take 10 to 20 minutes to drop off.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this if I wake up during the night?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enter the time you expect to fall back asleep and calculate again for updated wake-up options. A long awakening effectively restarts the cycle count for the rest of the night.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my schedule only allows 4 cycles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Four cycles, roughly 6 hours, can carry you through an occasional early start, especially if you wake at a cycle boundary rather than mid-cycle. Repeated 4-cycle nights build a sleep debt that shows up as slower reactions and worse mood. Treat it as a fallback, not a plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does daylight saving time change the result?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The cycle maths is the same, but the clock jump shifts your wall-clock wake time by an hour and your body clock takes a few days to catch up. Around the changeover, lean toward the longer 6-cycle option.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is a wake-up time calculator different from an alarm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An alarm rings at whatever time you set. This tool works back from sleep cycles to suggest times that fall between them, so the alarm is less likely to interrupt deep sleep and trigger sleep inertia.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a medical tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It is a scheduling aid built on population averages and does not diagnose anything. Persistent trouble waking, heavy daytime sleepiness, or unrefreshing sleep is worth raising with a doctor.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it store the times I enter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Every calculation runs locally in your browser, and nothing is sent to a server or saved.',
      },
    },
  ],
};

// Shape mirrors buildTimeAndDateStructuredData() for this calc id in generate-mpa-pages.js:
// WebSite + Organization + WebPage + SoftwareApplication + BreadcrumbList, with the FAQPage
// merged in from CALCULATOR_FAQ_SCHEMA by setPageMetadata(). Keep the two in sync.
const SITE_URL = 'https://calchowmuch.com';
const OG_IMAGE = `${SITE_URL}/assets/images/og-default.png`;
const CANONICAL = `${SITE_URL}/time-and-date/wake-up-time-calculator/`;

const H1_TEXT = 'What time should I wake up?';
const TITLE = 'What Time Should I Wake Up? | Wake-Up Time Calculator';
const DESCRIPTION =
  'Find the best time to wake up if you fall asleep now or at a set bedtime. Compare wake-up times for 4, 5, and 6 full 90-minute sleep cycles before you set an alarm.';

const metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
        name: TITLE,
        url: CANONICAL,
        description: DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
        primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE },
        breadcrumb: { '@id': `${CANONICAL}#breadcrumbs` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${CANONICAL}#softwareapplication`,
        name: 'Wake-Up Time Calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        url: CANONICAL,
        description:
          'Free wake-up time calculator: find the best alarm time from a fall-asleep time, a bedtime, or right now, using 90-minute sleep cycles.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        creator: { '@id': `${SITE_URL}/#organization` },
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
            '@type': 'ListItem',
            position: 3,
            name: 'Wake-Up Time Calculator',
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
    h1.textContent = H1_TEXT;
    title.replaceWith(h1);
    return;
  }
  title.textContent = H1_TEXT;
}

function formatTimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatTime(date) {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function timeValueToMinutes(value) {
  if (typeof value !== 'string' || !value.includes(':')) {
    return null;
  }
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

function minutesToTimeValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  const normalized = ((Math.round(parsed) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getSelectedDate() {
  const timeValue = primaryTimeInput?.value;
  if (!timeValue) {
    return null;
  }
  const [hours, minutes] = timeValue.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const baseDate = new Date();
  baseDate.setHours(hours, minutes, 0, 0);
  return baseDate;
}

function getSleepStart(mode, selectedDate) {
  if (mode === 'bed') {
    return new Date(selectedDate.getTime() + FALL_ASLEEP_MINUTES * 60000);
  }
  return new Date(selectedDate.getTime());
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

function showResults(recommendations) {
  if (!resultsList || !placeholder) {
    return;
  }

  resultsList.innerHTML = '';
  recommendations.forEach((rec) => {
    const item = document.createElement('div');
    item.className = 'wake-result';
    if (rec.cycles === 5) {
      item.classList.add('is-primary');
    }

    const left = document.createElement('div');
    left.className = 'wake-result-info';

    const cycle = document.createElement('div');
    cycle.className = 'cycle-label';
    cycle.textContent = `${rec.cycles} cycles`;

    const hours = document.createElement('div');
    hours.className = 'wake-result-hours';
    hours.textContent = `${(rec.cycles * CYCLE_MINUTES) / 60} hours of sleep`;

    const badge = document.createElement('span');
    badge.className = 'wake-recommended-badge';
    badge.textContent = 'Best balance';

    left.append(cycle, hours, badge);

    const right = document.createElement('div');
    right.className = 'wake-result-time';
    right.textContent = formatTime(rec.wakeTime);

    item.append(left, right);
    resultsList.appendChild(item);
  });

  placeholder.classList.add('is-hidden');
  if (proxyResult && recommendations[0]) {
    proxyResult.textContent = formatTime(recommendations[0].wakeTime);
  }
}

function updateExplanation(mode, selectedDate, sleepStart, recommendations) {
  const modeLabel = mode === 'bed' ? 'Bedtime mode' : 'Fall-asleep mode';
  const primary =
    recommendations.find((rec) => rec.cycles === 5) ?? recommendations[1] ?? recommendations[0];
  const earliest = recommendations[0];
  const latest = recommendations[recommendations.length - 1];

  if (summaryInputTime) {
    summaryInputTime.textContent = formatDateTime(selectedDate);
  }
  if (summarySleepStart) {
    summarySleepStart.textContent = formatDateTime(sleepStart);
  }
  if (summaryRecommendedWake) {
    summaryRecommendedWake.textContent = formatDateTime(primary.wakeTime);
  }
  if (scenarioMode) {
    scenarioMode.textContent = modeLabel;
  }
  if (scenarioInput) {
    scenarioInput.textContent = formatDateTime(selectedDate);
  }
  if (scenarioSleepStart) {
    scenarioSleepStart.textContent = formatDateTime(sleepStart);
  }
  if (scenarioRecommended) {
    scenarioRecommended.textContent = `${formatDateTime(primary.wakeTime)} (5 cycles)`;
  }
  if (cycle4Value) {
    cycle4Value.textContent = formatDateTime(earliest.wakeTime);
  }
  if (cycle5Value) {
    cycle5Value.textContent = formatDateTime(primary.wakeTime);
  }
  if (cycle6Value) {
    cycle6Value.textContent = formatDateTime(latest.wakeTime);
  }
  if (bufferValue) {
    bufferValue.textContent = `${mode === 'bed' ? FALL_ASLEEP_MINUTES : 0}`;
  }
  if (explanationPrimary) {
    explanationPrimary.textContent = `${formatDateTime(primary.wakeTime)} after 5 cycles`;
  }
  if (explanationWindow) {
    explanationWindow.textContent = `${formatDateTime(earliest.wakeTime)} to ${formatDateTime(latest.wakeTime)}`;
  }
}

function updateFieldLabel(mode) {
  if (!fieldLabel) {
    return;
  }
  fieldLabel.textContent =
    mode === 'bed' ? 'I plan to go to bed at...' : 'I plan to fall asleep at...';
  if (bufferCopy) {
    bufferCopy.textContent = mode === 'bed' ? '15-minute' : '0-minute';
  }
}

function calculate() {
  const selectedDate = getSelectedDate();
  if (!selectedDate) {
    showError('Please enter a valid time.');
    return;
  }

  const mode = modeButtons?.getValue() ?? 'sleep';
  const sleepStart = getSleepStart(mode, selectedDate);
  const recommendations = calculateWakeUpRecommendations({
    mode,
    date: selectedDate,
    latencyMinutes: FALL_ASLEEP_MINUTES,
  });

  if (!recommendations.length || recommendations.length !== SLEEP_CYCLES.length) {
    showError('Unable to calculate wake-up times. Please check your input and try again.');
    return;
  }

  clearError();
  showResults(recommendations);
  updateExplanation(mode, selectedDate, sleepStart, recommendations);
}

ensureH1Title();

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'sleep',
  onChange: () => {
    updateFieldLabel(modeButtons?.getValue() ?? 'sleep');
  },
});

const defaultDate = roundToNextQuarterHour(new Date());
if (primaryTimeInput) {
  primaryTimeInput.value = formatTimeValue(defaultDate);
}
if (proxyInput) {
  const initialMinutes = timeValueToMinutes(formatTimeValue(defaultDate));
  proxyInput.value = String(initialMinutes ?? 0);
}

calculateButton?.addEventListener('click', calculate);
proxyButton?.addEventListener('click', calculate);

timePickerButton?.addEventListener('click', () => {
  if (!primaryTimeInput) {
    return;
  }
  if (typeof primaryTimeInput.showPicker === 'function') {
    primaryTimeInput.showPicker();
    return;
  }
  primaryTimeInput.focus();
});

nowButton?.addEventListener('click', () => {
  const nowValue = formatTimeValue(roundToMinute(new Date()));
  if (primaryTimeInput) {
    primaryTimeInput.value = nowValue;
  }
  if (proxyInput) {
    proxyInput.value = String(timeValueToMinutes(nowValue) ?? 0);
  }
  // "Going to sleep now" is a fall-asleep-time scenario, so force that mode.
  modeButtons?.setValue('sleep');
  updateFieldLabel('sleep');
  calculate();
});

proxyInput?.addEventListener('input', () => {
  const next = minutesToTimeValue(proxyInput.value);
  if (next && primaryTimeInput) {
    primaryTimeInput.value = next;
  }
});

proxyInput?.addEventListener('change', () => {
  const next = minutesToTimeValue(proxyInput.value);
  if (next && primaryTimeInput) {
    primaryTimeInput.value = next;
  }
});

primaryTimeInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    calculate();
  }
});

primaryTimeInput?.addEventListener('change', () => {
  const minutes = timeValueToMinutes(primaryTimeInput?.value || '');
  if (minutes !== null && proxyInput) {
    proxyInput.value = String(minutes);
  }
});

updateFieldLabel('sleep');
calculate();
