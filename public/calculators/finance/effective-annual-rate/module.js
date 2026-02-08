import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import {
  calculateEffectiveAnnualRate,
  resolveCompounding,
} from '/assets/js/core/time-value-utils.js';

const nominalRateInput = document.querySelector('#ear-nominal-rate');
const customPeriodsInput = document.querySelector('#ear-custom-periods');
const calculateButton = document.querySelector('#ear-calc');
const resultOutput = document.querySelector('#ear-result');
const resultDetail = document.querySelector('#ear-result-detail');
const optionalToggle = document.querySelector('#ear-optional-toggle');
const optionalSection = document.querySelector('#ear-optional-section');

const frequencyGroup = document.querySelector('[data-button-group="ear-frequency"]');

const explanationRoot = document.querySelector('#ear-explanation');
const valueTargets = explanationRoot
  ? {
      nominalRate: explanationRoot.querySelectorAll('[data-ear="nominal-rate"]'),
      frequency: explanationRoot.querySelectorAll('[data-ear="frequency"]'),
      periods: explanationRoot.querySelectorAll('[data-ear="periods"]'),
      earRate: explanationRoot.querySelectorAll('[data-ear="ear-rate"]'),
    }
  : null;

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the effective annual rate (EAR)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The effective annual rate is the true annual interest rate after accounting for compounding.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is EAR different from a nominal interest rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nominal rates do not include compounding effects, while EAR does.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is EAR higher than the nominal rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because interest compounds multiple times per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate the effective annual rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'By applying the EAR formula using the nominal rate and compounding frequency.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does compounding frequency mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It refers to how often interest is added to the balance each year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EAR the same as APR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. APR may exclude compounding, while EAR always includes it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can EAR be used for loan comparison?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. EAR provides an accurate basis for comparing loans.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does monthly compounding increase EAR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. More frequent compounding increases EAR.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if interest compounds daily?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Daily compounding produces a higher EAR than monthly or annual compounding.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EAR useful for savings and investments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It reflects the real annual return on interest-bearing accounts.',
      },
    },
  ],
};

const metadata = {
  title: 'Effective Annual Rate (EAR) Calculator – CalcHowMuch',
  description:
    'Calculate the effective annual rate (EAR) from a nominal interest rate and compounding frequency. Compare true annual interest rates accurately.',
  canonical: 'https://calchowmuch.com/finance/effective-annual-rate/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Effective Annual Rate Calculator',
        url: 'https://calchowmuch.com/finance/effective-annual-rate/',
        description:
          'Convert a nominal interest rate into an effective annual rate using compounding frequency.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Effective Annual Rate Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/effective-annual-rate/',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        creator: {
          '@type': 'Organization',
          name: 'CalcHowMuch',
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
            name: 'Finance',
            item: 'https://calchowmuch.com/finance/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Effective Annual Rate',
            item: 'https://calchowmuch.com/finance/effective-annual-rate/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

const frequencyButtons = setupButtonGroup(frequencyGroup, {
  defaultValue: 'monthly',
  onChange: () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  },
});

let hasCalculated = false;
const liveUpdatesEnabled = false;

function setOptionalVisibility(expanded) {
  if (!optionalSection || !optionalToggle) {
    return;
  }
  optionalSection.classList.toggle('is-hidden', !expanded);
  optionalSection.hidden = !expanded;
  optionalSection.setAttribute('aria-hidden', String(!expanded));
  optionalToggle.setAttribute('aria-expanded', String(expanded));
  optionalToggle.textContent = expanded ? 'Hide Optional Inputs' : 'Show Optional Inputs';
}

setOptionalVisibility(false);

if (optionalToggle) {
  optionalToggle.addEventListener('click', () => {
    const expanded = optionalToggle.getAttribute('aria-expanded') === 'true';
    setOptionalVisibility(!expanded);
  });
}

function formatPercent(value, maxFraction = 4) {
  return `${formatNumber(value, { maximumFractionDigits: maxFraction })}%`;
}

function updateTargets(targets, value) {
  if (!targets) {
    return;
  }
  targets.forEach((node) => {
    node.textContent = value;
  });
}

function updateExplanation({ nominalRate, frequency, periods, earRate }) {
  if (!valueTargets) {
    return;
  }
  updateTargets(valueTargets.nominalRate, nominalRate);
  updateTargets(valueTargets.frequency, frequency);
  updateTargets(valueTargets.periods, periods);
  updateTargets(valueTargets.earRate, earRate);
}

function showError(message) {
  if (resultOutput) {
    resultOutput.textContent = message;
  }
  if (resultDetail) {
    resultDetail.textContent = '';
  }

  updateExplanation({
    nominalRate: 'N/A',
    frequency: 'N/A',
    periods: 'N/A',
    earRate: 'N/A',
  });
}

function calculate() {
  const nominalRate = Number.parseFloat(nominalRateInput?.value ?? '');
  const selectedFrequency = frequencyButtons?.getValue() ?? 'monthly';
  const customPeriodsRaw = customPeriodsInput?.value?.trim() ?? '';
  const customPeriods = customPeriodsRaw === '' ? null : Number.parseFloat(customPeriodsRaw);

  if (!Number.isFinite(nominalRate)) {
    showError('Enter a valid nominal interest rate.');
    return;
  }

  if (nominalRate < 0) {
    showError('Nominal interest rate must be zero or greater.');
    return;
  }

  if (customPeriods !== null && (!Number.isFinite(customPeriods) || customPeriods <= 0)) {
    showError('Custom compounding periods must be greater than zero.');
    return;
  }

  const result = calculateEffectiveAnnualRate({
    nominalRate,
    compounding: selectedFrequency,
    customPeriods,
  });

  if (!result) {
    showError('Check your values and try again.');
    return;
  }

  hasCalculated = true;

  const effectiveRatePercent = result.effectiveAnnualRate * 100;
  const periodsDisplay = formatNumber(result.periodsPerYear, { maximumFractionDigits: 2 });
  const frequencyDisplay = customPeriods !== null ? 'Custom' : result.compoundingLabel;

  if (resultOutput) {
    resultOutput.textContent = `Effective Annual Rate (EAR): ${formatPercent(effectiveRatePercent, 4)}`;
  }

  if (resultDetail) {
    resultDetail.innerHTML =
      `<p><strong>Nominal rate used:</strong> ${formatPercent(nominalRate, 2)}</p>` +
      `<p><strong>Compounding frequency:</strong> ${frequencyDisplay}</p>` +
      `<p><strong>Compounding periods per year:</strong> ${periodsDisplay}</p>`;
  }

  updateExplanation({
    nominalRate: formatPercent(nominalRate, 2),
    frequency: frequencyDisplay,
    periods: periodsDisplay,
    earRate: formatPercent(effectiveRatePercent, 4),
  });
}

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

if (nominalRateInput) {
  nominalRateInput.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
}

if (customPeriodsInput) {
  customPeriodsInput.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
}

if (nominalRateInput) {
  calculate();
}
