import { calculatePercentageOfNumber } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const percentInput = document.querySelector('#pon-percent');
const numberInput = document.querySelector('#pon-number');
const calculateButton = document.querySelector('#pon-calc');
const resultOutput = document.querySelector('#pon-result');
const resultDetail = document.querySelector('#pon-result-detail');

const explanationRoot = document.querySelector('#pon-explanation');
const valueTargets = explanationRoot
  ? {
      percent: explanationRoot.querySelectorAll('[data-pon="percent"]'),
      number: explanationRoot.querySelectorAll('[data-pon="number"]'),
      result: explanationRoot.querySelectorAll('[data-pon="result"]'),
      formula: explanationRoot.querySelectorAll('[data-pon="formula"]'),
    }
  : null;

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    q: 'What does percentage of a number mean?',
    a: 'It means calculating how much a given percentage represents out of a total value.',
  },
  {
    q: 'How do you calculate X% of Y?',
    a: 'Divide X by 100 and multiply the result by Y.',
  },
  {
    q: 'What is the formula for percentage of a number?',
    a: 'The formula is (X / 100) x Y.',
  },
  {
    q: 'Can percentages be greater than 100%?',
    a: 'Yes, percentages greater than 100% represent values larger than the original number.',
  },
  {
    q: 'Can the number be negative?',
    a: 'Yes, percentage calculations work with negative numbers.',
  },
  {
    q: 'Can percentages include decimals?',
    a: 'Yes, percentages can include decimal values such as 2.5% or 12.75%.',
  },
  {
    q: 'Is this calculator accurate for large numbers?',
    a: 'Yes, it accurately calculates percentages for both small and large numbers.',
  },
  {
    q: 'How are percentages used in real life?',
    a: 'Percentages are used for discounts, taxes, interest rates, grades, and financial comparisons.',
  },
  {
    q: 'What is 0% of a number?',
    a: 'Zero percent of any number is always zero.',
  },
  {
    q: 'Why do we divide by 100 in percentage calculations?',
    a: 'Because a percentage represents a fraction out of 100.',
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
  title: 'Find Percentage of a Number Calculator – CalcHowMuch',
  description:
    'Calculate what X% of Y is instantly. Use our free Find Percentage of a Number calculator for fast, accurate results.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-of-a-number/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Find Percentage of a Number Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-of-a-number/',
        description: 'Calculate what X% of Y is instantly using our free Find Percentage of a Number calculator.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Find Percentage of a Number Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-of-a-number/',
        description: 'Free calculator to find what X percent of Y is using a simple percentage formula.',
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
            name: 'Find Percentage of a Number',
            item: 'https://calchowmuch.com/percentage-calculators/percentage-of-a-number/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

function fmt(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

function calculate() {
  const x = Number.parseFloat(percentInput?.value ?? '');
  const y = Number.parseFloat(numberInput?.value ?? '');

  if (!Number.isFinite(x)) {
    resultOutput.textContent = 'Enter a valid percentage value (X).';
    resultDetail.textContent = '';
    return;
  }

  if (!Number.isFinite(y)) {
    resultOutput.textContent = 'Enter a valid number value (Y).';
    resultDetail.textContent = '';
    return;
  }

  const result = calculatePercentageOfNumber(x, y);
  if (!result) {
    resultOutput.textContent = 'Unable to calculate result for the provided values.';
    resultDetail.textContent = '';
    return;
  }

  resultOutput.textContent = `Result: ${fmt(result.result)}`;
  resultDetail.textContent = `Formula: (${fmt(result.percent)} / 100) x ${fmt(result.number)} = ${fmt(result.result)}`;

  updateTargets(valueTargets?.percent, `${fmt(result.percent)}%`);
  updateTargets(valueTargets?.number, fmt(result.number));
  updateTargets(valueTargets?.result, fmt(result.result));
  updateTargets(valueTargets?.formula, result.formula);

  hasCalculated = true;
}

calculateButton?.addEventListener('click', calculate);

[percentInput, numberInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (hasCalculated) {
      calculate();
    }
  });
});

calculate();
