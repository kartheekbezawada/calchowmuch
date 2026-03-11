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
      'It maps your selected goal and start time to a deterministic nap duration and wake-up recommendation with alternatives.',
  },
  {
    question: 'How are Quick, Strong, and Full goals mapped?',
    answer: 'Quick is 15 minutes, Strong is 25 minutes, and Full is 90 minutes.',
  },
  {
    question: 'Why can a late-night recommendation become shorter?',
    answer:
      'Long late-night naps can delay bedtime, so inferred Full recommendations are shortened to reduce disruption risk.',
  },
  {
    question: 'When does the tool keep a full 90-minute nap at night?',
    answer:
      'If you explicitly choose Full, the recommendation stays at 90 minutes and a warning is shown instead of forcing a downgrade.',
  },
  {
    question: 'Does it account for my personal bedtime habits?',
    answer: 'No. The output is deterministic and does not model individual routines.',
  },
  {
    question: 'Which time buckets are used?',
    answer:
      'Results are classified into Day, Afternoon, and Night buckets for recommendation context.',
  },
  {
    question: 'Can shift workers use this calculator?',
    answer: 'Yes. It uses local clock time and works for daytime or overnight schedules.',
  },
  {
    question: 'Does the calculator set alarms automatically?',
    answer: 'No. It provides wake-up targets that you can copy into your own alarm app.',
  },
  {
    question: 'Will changing inputs auto-calculate?',
    answer: 'No. Results update only when you click Calculate.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is a practical planning tool and does not replace professional medical guidance.',
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
        'Choose Quick, Strong, or Full to get a recommended nap length, wake-up time, and practical alternatives.',
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Energy-Based Nap Selector',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: 'https://calchowmuch.com/time-and-date/energy-based-nap-selector/',
      description:
        'Free energy-based nap selector for matching Quick, Strong, or Full goals to wake-up recommendations.',
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
  title: 'Energy-Based Nap Selector | Quick, Strong or Full',
  description:
    'Choose Quick, Strong, or Full to get a recommended nap length, wake-up time, and practical alternatives.',
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
