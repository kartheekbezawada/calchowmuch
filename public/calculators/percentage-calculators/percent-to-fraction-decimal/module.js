import { calculatePercentToFractionDecimal } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const percentInput = document.querySelector('#ptfd-percent');
const calculateButton = document.querySelector('#ptfd-calc');
const resultOutput = document.querySelector('#ptfd-result');
const resultDetail = document.querySelector('#ptfd-result-detail');

const explanationRoot = document.querySelector('#ptfd-explanation');
const valueTargets = explanationRoot
  ? {
      percent: explanationRoot.querySelectorAll('[data-ptfd="percent"]'),
      decimal: explanationRoot.querySelectorAll('[data-ptfd="decimal"]'),
      fraction: explanationRoot.querySelectorAll('[data-ptfd="fraction"]'),
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
  title: 'Percent to Fraction & Decimal Converter – CalcHowMuch',
  description:
    'Convert any percentage to a decimal and simplified fraction instantly. Free percent to fraction and percent to decimal converter with steps.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percent to Fraction & Decimal Converter',
        url: 'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal/',
        description: 'Convert any percentage to a decimal and simplified fraction instantly using our free percent converter.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percent to Fraction & Decimal Converter',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal/',
        description: 'Free percent to fraction and percent to decimal converter that outputs simplified fractions and decimals with steps.',
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
            item: 'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal/',
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

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculate() {
  const inputText = String(percentInput?.value ?? '').trim();
  const result = calculatePercentToFractionDecimal(inputText);

  if (!result) {
    resultOutput.textContent = 'Enter a valid percentage (for example: 12.5 or 12.5%).';
    resultDetail.textContent = '';
    return;
  }

  const normalizedPercent = `${fmt(result.percent)}%`;
  const decimalValue = fmt(result.decimal);
  const mixedText = result.mixedNumber ? ` | Mixed: ${result.mixedNumber}` : '';

  resultOutput.textContent = `Decimal: ${decimalValue} | Fraction: ${result.fraction}${mixedText}`;
  resultDetail.textContent = `Steps: ${result.steps.join(' -> ')}`;

  updateTargets(valueTargets?.percent, normalizedPercent);
  updateTargets(valueTargets?.decimal, decimalValue);
  updateTargets(valueTargets?.fraction, result.fraction);
  updateTargets(valueTargets?.steps, result.steps.join(' -> '));
  updateTargets(valueTargets?.formulaDecimal, 'Decimal = X / 100');
  updateTargets(valueTargets?.formulaFraction, 'Fraction = X / 100 (simplified)');

  hasCalculated = true;
}

calculateButton?.addEventListener('click', calculate);

percentInput?.addEventListener('input', () => {
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

calculate();
