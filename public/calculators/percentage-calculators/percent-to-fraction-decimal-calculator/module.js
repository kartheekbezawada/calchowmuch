import { calculatePercentToFractionDecimal } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/percentage-calculators/shared/cluster-ux.js';

const percentInput = document.querySelector('#ptfd-percent');
const calculateButton = document.querySelector('#ptfd-calc');
const answerCard = document.querySelector('#ptfd-answer-card');
const staleNote = document.querySelector('#ptfd-stale-note');
const resultOutput = document.querySelector('#ptfd-result');
const resultDetail = document.querySelector('#ptfd-result-detail');
const resultContext = document.querySelector('#ptfd-result-context');
const breakdownOutput = document.querySelector('#ptfd-breakdown');

const snapshotTargets = {
  percent: document.querySelector('[data-ptfd-snap="percent"]'),
  decimal: document.querySelector('[data-ptfd-snap="decimal"]'),
  fraction: document.querySelector('[data-ptfd-snap="fraction"]'),
  mixed: document.querySelector('[data-ptfd-snap="mixed"]'),
  formula: document.querySelector('[data-ptfd-snap="formula"]'),
};

const explanationRoot = document.querySelector('#ptfd-explanation');
const valueTargets = explanationRoot
  ? {
      percent: explanationRoot.querySelectorAll('[data-ptfd="percent"]'),
      decimal: explanationRoot.querySelectorAll('[data-ptfd="decimal"]'),
      fraction: explanationRoot.querySelectorAll('[data-ptfd="fraction"]'),
      mixed: explanationRoot.querySelectorAll('[data-ptfd="mixed"]'),
      steps: explanationRoot.querySelectorAll('[data-ptfd="steps"]'),
      formulaDecimal: explanationRoot.querySelectorAll('[data-ptfd="formula-decimal"]'),
      formulaFraction: explanationRoot.querySelectorAll('[data-ptfd="formula-fraction"]'),
    }
  : null;

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    q: 'How do you convert a percent to a decimal?',
    a: 'Divide the percent by 100.',
  },
  {
    q: 'How do you convert a percent to a fraction?',
    a: 'Write it over 100 and simplify the fraction.',
  },
  {
    q: 'What is 50% as a decimal?',
    a: '50% equals 0.5.',
  },
  {
    q: 'What is 25% as a fraction?',
    a: '25% equals 1/4.',
  },
  {
    q: 'How do you simplify the percent fraction?',
    a: 'Divide the numerator and denominator by their greatest common divisor.',
  },
  {
    q: 'How do you convert a decimal percent like 12.5% to a fraction?',
    a: 'Convert 12.5 to 125/10, then divide by 100 to get 125/1000 and simplify.',
  },
  {
    q: 'Can a percent be written as a mixed number fraction?',
    a: 'Yes, if the fraction is improper, it can be written as a mixed number.',
  },
  {
    q: 'Do negative percentages work the same way?',
    a: 'Yes, the negative sign carries through to the decimal and fraction.',
  },
  {
    q: 'Why does converting percent to decimal use 100?',
    a: 'Percent means per hundred, so dividing by 100 converts it to a per-one value.',
  },
  {
    q: 'Where is percent to fraction conversion used?',
    a: 'It is used in math education, rates, discounts, and quick equivalence checks.',
  },
];

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const metadata = {
  title: 'Percent to Fraction and Decimal Calculator | Convert %',
  description:
    'Convert a percentage into a decimal and simplified fraction using the standard divide-by-100 method.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percent to Fraction & Decimal Converter',
        url: 'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal-calculator/',
        description:
          'Convert a percentage into a decimal and simplified fraction using the standard divide-by-100 method.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percent to Fraction & Decimal Converter',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal-calculator/',
        description:
          'Free percent converter that shows the decimal form and simplified fraction for any percentage input.',
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
            name: 'Percentage Calculators',
            item: 'https://calchowmuch.com/percentage-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Percent to Fraction/Decimal',
            item: 'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

function fmt(value) {
  return formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 12 });
}

function updateTargets(nodes, value) {
  if (!nodes) {
    return;
  }
  nodes.forEach((node) => {
    node.textContent = value;
  });
}

function updateSnapshot(key, value) {
  const node = snapshotTargets[key];
  if (node) {
    node.textContent = value;
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderBreakdown(items = []) {
  if (!breakdownOutput) {
    return;
  }

  breakdownOutput.innerHTML = items
    .map(
      (item) => `
        <div class="pct-breakdown-item">
          <div class="pct-breakdown-item-name">
            <strong>${escapeHtml(item.label)}</strong>
            <small>${escapeHtml(item.copy)}</small>
          </div>
          <div class="pct-breakdown-item-value">${escapeHtml(item.value)}</div>
        </div>
      `
    )
    .join('');
}

function setResultValue({ decimalValue, fractionValue, mixedValue }) {
  resultOutput.innerHTML = `
    <span class="pct-answer-primary">${escapeHtml(decimalValue)}</span>
    <span class="pct-answer-legacy">
      <span class="pct-answer-legacy-line">Fraction: ${escapeHtml(fractionValue)}</span>
      <span class="pct-answer-legacy-line">Mixed: ${escapeHtml(mixedValue)}</span>
    </span>
  `;
}

const staleController = createStaleResultController({
  resultPanel: answerCard,
  staleTargets: [staleNote],
  getSignature: () => String(percentInput?.value ?? '').trim(),
});

staleController.watchElements([percentInput]);

function finishCalculation({ reveal = false, trend = 'neutral' } = {}) {
  if (answerCard) {
    answerCard.dataset.trend = trend;
  }

  staleController.markFresh();
  if (reveal) {
    revealResultPanel({ resultPanel: answerCard, focusTarget: resultOutput });
  }
}

function calculate({ reveal = false } = {}) {
  const inputText = String(percentInput?.value ?? '').trim();
  const result = calculatePercentToFractionDecimal(inputText);

  if (!result) {
    resultOutput.textContent = 'Enter a percent';
    resultDetail.textContent = 'Use a valid percentage such as 12.5 or 12.5% to see the conversion.';
    resultContext.textContent = 'The converter shows decimal, fraction, and mixed-number forms.';
    renderBreakdown([]);
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const normalizedPercent = `${fmt(result.percent)}%`;
  const decimalValue = fmt(result.decimal);
  const mixedValue = result.mixedNumber || 'N/A (proper fraction)';
  const stepsText = result.steps.join(' -> ');

  setResultValue({
    decimalValue,
    fractionValue: result.fraction,
    mixedValue,
  });
  resultDetail.textContent = `${normalizedPercent} equals ${decimalValue} as a decimal and ${result.fraction} as a simplified fraction.`;
  resultContext.textContent = 'Formula: divide the percent by 100, then simplify X/100.';

  updateSnapshot('percent', normalizedPercent);
  updateSnapshot('decimal', decimalValue);
  updateSnapshot('fraction', result.fraction);
  updateSnapshot('mixed', mixedValue);
  updateSnapshot('formula', 'X / 100');

  updateTargets(valueTargets?.percent, normalizedPercent);
  updateTargets(valueTargets?.decimal, decimalValue);
  updateTargets(valueTargets?.fraction, result.fraction);
  updateTargets(valueTargets?.mixed, mixedValue);
  updateTargets(valueTargets?.steps, stepsText);
  updateTargets(valueTargets?.formulaDecimal, 'Decimal = X / 100');
  updateTargets(valueTargets?.formulaFraction, 'Fraction = X / 100 (simplified)');

  renderBreakdown(
    result.steps.map((step, index) => ({
      label: `Step ${index + 1}`,
      copy: index === 0 ? 'Start from the entered percentage.' : 'Continue the conversion path.',
      value: step,
    }))
  );

  finishCalculation({ reveal });
}

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

calculate();
