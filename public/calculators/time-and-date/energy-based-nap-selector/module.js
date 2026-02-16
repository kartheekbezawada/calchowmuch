import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  calculateWakeTime,
  parseTimeString,
  getEnergyNapRecommendation,
  ENERGY_NAP_GOALS,
  ENERGY_NAP_DEFAULT_GOAL,
} from '/assets/js/core/nap-utils.js';

const startTimeInput = document.querySelector('#energy-nap-start-time');
const useNowButton = document.querySelector('#energy-nap-use-now');
const calculateButton = document.querySelector('#energy-nap-calculate');
const goalButtons = Array.from(
  document.querySelectorAll('[data-button-group="energy-goal"] button')
);
const placeholder = document.querySelector('#energy-nap-placeholder');
const errorMessage = document.querySelector('#energy-nap-error');
const primaryCard = document.querySelector('#energy-nap-primary');
const alternativesList = document.querySelector('#energy-nap-alternatives');
const warningBox = document.querySelector('#energy-nap-warning');

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    question: 'What does the Energy-Based Nap Selector do?',
    answer:
      'It recommends a nap length based on your selected goal and start time, then shows wake-up times for the primary and alternative options.',
  },
  {
    question: 'How are Quick, Strong, and Full goals mapped?',
    answer: 'Quick maps to 15 minutes, Strong maps to 25 minutes, and Full maps to 90 minutes.',
  },
  {
    question: 'Why does the recommendation change at night?',
    answer:
      'Late-night long naps can disrupt normal sleep timing, so inferred Full goals at night are downgraded to a shorter recommendation.',
  },
  {
    question: 'When is a Full nap not downgraded?',
    answer:
      'If you explicitly choose Full, the tool keeps the 90-minute recommendation and shows a warning instead of downgrading.',
  },
  {
    question: 'Does this calculator account for bedtime routines?',
    answer:
      'No. It applies deterministic nap-duration rules and does not model personal bedtime habits.',
  },
  {
    question: 'What time buckets are used for warnings?',
    answer:
      'The calculator groups time into Day, Afternoon, and Night buckets and applies late-night warnings to long naps.',
  },
  {
    question: 'Can I use the selector for shift work?',
    answer:
      'Yes. The logic is based on local clock time and works for any schedule, including overnight routines.',
  },
  {
    question: 'Does the calculator set an alarm for me?',
    answer: 'No. It gives wake-up times that you can use to set an alarm manually.',
  },
  {
    question: 'Will changing inputs recalculate instantly?',
    answer: 'No. After page load, results update only when you click Calculate.',
  },
  {
    question: 'Is this tool medical advice?',
    answer:
      'No. It is a planning aid and does not diagnose sleep conditions or replace professional medical guidance.',
  },
];

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Energy-Based Nap Selector',
      url: 'https://calchowmuch.com/time-and-date/energy-based-nap-selector/',
      description:
        'Select an energy goal and nap start time to get a recommended nap length with wake-up time alternatives.',
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Energy-Based Nap Selector',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: 'https://calchowmuch.com/time-and-date/energy-based-nap-selector/',
      description:
        'Free energy-based nap selector that maps Quick, Strong, and Full goals to deterministic nap durations and wake-up recommendations.',
      browserRequirements: 'Requires JavaScript enabled',
      softwareVersion: '1.0',
      creator: {
        '@type': 'Organization',
        name: 'CalcHowMuch',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://calchowmuch.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Time & Date',
          item: 'https://calchowmuch.com/time-and-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Energy-Based Nap Selector',
          item: 'https://calchowmuch.com/time-and-date/energy-based-nap-selector/',
        },
      ],
    },
  ],
};

setPageMetadata({
  title: 'Energy-Based Nap Selector - Quick, Strong, or Full Nap Timing',
  description:
    'Pick Quick, Strong, or Full and get deterministic nap recommendations with wake-up times, alternatives, and late-night guidance.',
  canonical: 'https://calchowmuch.com/time-and-date/energy-based-nap-selector/',
  structuredData: STRUCTURED_DATA,
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
});

const explanationPlaceholders = {
  summaryGoal: document.querySelector('[data-placeholder="summary-goal"]'),
  summaryDuration: document.querySelector('[data-placeholder="summary-duration"]'),
  summaryWake: document.querySelector('[data-placeholder="summary-wake"]'),
  scenarioStart: document.querySelector('[data-placeholder="scenario-start"]'),
  scenarioGoal: document.querySelector('[data-placeholder="scenario-goal"]'),
  scenarioBucket: document.querySelector('[data-placeholder="scenario-bucket"]'),
  scenarioPrimary: document.querySelector('[data-placeholder="scenario-primary"]'),
  resultMetricDuration: document.querySelector('[data-placeholder="result-duration"]'),
  resultMetricWake: document.querySelector('[data-placeholder="result-wake"]'),
  resultMetricBucket: document.querySelector('[data-placeholder="result-bucket"]'),
  resultMetricOverride: document.querySelector('[data-placeholder="result-override"]'),
};

let selectedGoal = ENERGY_NAP_DEFAULT_GOAL;
let goalSelectionExplicit = false;

function formatTimeInput(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatTimeDisplay(hours, minutes) {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function setActiveGoalButton(goal) {
  goalButtons.forEach((button) => {
    const isActive = button.dataset.value === goal;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function hideResults() {
  primaryCard?.classList.add('is-hidden');
  alternativesList?.classList.add('is-hidden');
  warningBox?.classList.add('is-hidden');
  if (primaryCard) {
    primaryCard.innerHTML = '';
  }
  if (alternativesList) {
    alternativesList.innerHTML = '';
  }
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
  placeholder?.classList.add('is-hidden');
  hideResults();
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  hideResults();
}

function addAlternativeRow(label, wakeTime, minutes) {
  if (!alternativesList) {
    return;
  }
  const row = document.createElement('div');
  row.className = 'energy-alt-row';

  const name = document.createElement('span');
  name.textContent = `${label} (${minutes} min)`;

  const time = document.createElement('span');
  time.textContent = wakeTime;

  row.append(name, time);
  alternativesList.appendChild(row);
}

function updateExplanation(result) {
  const goalLabel = ENERGY_NAP_GOALS[result.selectedGoal].label;
  const primaryWake = result.primaryWakeLabel;

  if (explanationPlaceholders.summaryGoal) {
    explanationPlaceholders.summaryGoal.textContent = goalLabel;
  }
  if (explanationPlaceholders.summaryDuration) {
    explanationPlaceholders.summaryDuration.textContent = `${result.recommendedMinutes} minutes`;
  }
  if (explanationPlaceholders.summaryWake) {
    explanationPlaceholders.summaryWake.textContent = primaryWake;
  }

  if (explanationPlaceholders.scenarioStart) {
    explanationPlaceholders.scenarioStart.textContent = result.startLabel;
  }
  if (explanationPlaceholders.scenarioGoal) {
    explanationPlaceholders.scenarioGoal.textContent = goalLabel;
  }
  if (explanationPlaceholders.scenarioBucket) {
    explanationPlaceholders.scenarioBucket.textContent = result.timeBucket;
  }
  if (explanationPlaceholders.scenarioPrimary) {
    explanationPlaceholders.scenarioPrimary.textContent = `${result.recommendedMinutes} min`;
  }

  if (explanationPlaceholders.resultMetricDuration) {
    explanationPlaceholders.resultMetricDuration.textContent = `${result.recommendedMinutes}`;
  }
  if (explanationPlaceholders.resultMetricWake) {
    explanationPlaceholders.resultMetricWake.textContent = primaryWake;
  }
  if (explanationPlaceholders.resultMetricBucket) {
    explanationPlaceholders.resultMetricBucket.textContent = result.timeBucket;
  }
  if (explanationPlaceholders.resultMetricOverride) {
    explanationPlaceholders.resultMetricOverride.textContent = result.overridden ? 'Yes' : 'No';
  }
}

function getAlternativeGoalOrder(primaryMinutes) {
  if (primaryMinutes === 15) {
    return ['strong', 'full'];
  }
  if (primaryMinutes === 25) {
    return ['quick', 'full'];
  }
  return ['strong', 'quick'];
}

function renderPrimaryResult(result) {
  if (!primaryCard) {
    return;
  }

  const reason = result.overridden
    ? 'Night-time inferred Full goal was downgraded to keep the nap shorter.'
    : `Selected ${ENERGY_NAP_GOALS[result.effectiveGoal].label} goal recommendation.`;

  primaryCard.innerHTML = `
    <h4>Primary recommendation</h4>
    <p class="energy-primary-metrics">
      <span>${result.recommendedMinutes} min</span>
      <span>${result.primaryWakeLabel}</span>
    </p>
    <p class="energy-primary-reason">${reason}</p>
  `;
}

function calculate() {
  const startValue = parseTimeString(startTimeInput?.value ?? '');
  if (!startValue) {
    showError('Please enter a valid nap start time.');
    return;
  }

  const recommendation = getEnergyNapRecommendation(
    selectedGoal,
    startValue,
    goalSelectionExplicit
  );

  const primaryWake = calculateWakeTime(startValue, recommendation.recommendedMinutes, 0);
  if (!primaryWake) {
    showError('Unable to calculate wake-up time.');
    return;
  }

  clearError();
  if (alternativesList) {
    alternativesList.innerHTML = '';
  }

  const startLabel = formatTimeDisplay(startValue.hours, startValue.minutes);
  const primaryWakeLabel = formatTimeDisplay(primaryWake.hours, primaryWake.minutes);

  const alternativeGoals = getAlternativeGoalOrder(recommendation.recommendedMinutes);
  alternativeGoals.forEach((goal) => {
    const minutes = ENERGY_NAP_GOALS[goal].minutes;
    const altWake = calculateWakeTime(startValue, minutes, 0);
    if (!altWake) {
      return;
    }
    addAlternativeRow(
      ENERGY_NAP_GOALS[goal].label,
      formatTimeDisplay(altWake.hours, altWake.minutes),
      minutes
    );
  });

  const result = {
    ...recommendation,
    startLabel,
    primaryWakeLabel,
  };

  renderPrimaryResult(result);
  updateExplanation(result);

  if (recommendation.warning) {
    warningBox.textContent = recommendation.warning;
    warningBox.classList.remove('is-hidden');
  } else {
    warningBox?.classList.add('is-hidden');
  }

  placeholder?.classList.add('is-hidden');
  primaryCard?.classList.remove('is-hidden');
  alternativesList?.classList.remove('is-hidden');
}

function setNowValue() {
  if (!startTimeInput) {
    return;
  }
  const now = new Date();
  now.setSeconds(0, 0);
  startTimeInput.value = formatTimeInput(now);
}

setNowValue();
setActiveGoalButton(selectedGoal);
showPlaceholder();

calculateButton?.addEventListener('click', () => calculate());

useNowButton?.addEventListener('click', () => {
  setNowValue();
  showPlaceholder();
});

startTimeInput?.addEventListener('change', () => {
  showPlaceholder();
});

startTimeInput?.addEventListener('input', () => {
  showPlaceholder();
});

goalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const goal = button.dataset.value;
    if (!goal || !ENERGY_NAP_GOALS[goal]) {
      return;
    }
    selectedGoal = goal;
    goalSelectionExplicit = true;
    setActiveGoalButton(goal);
    showPlaceholder();
  });
});
