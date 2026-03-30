import { calculatePercentageOfNumber } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/percentage-calculators/shared/cluster-ux.js';

const percentInput = document.querySelector('#pon-percent');
const numberInput = document.querySelector('#pon-number');
const calculateButton = document.querySelector('#pon-calc');
const answerCard = document.querySelector('#pon-answer-card');
const staleNote = document.querySelector('#pon-stale-note');
const resultOutput = document.querySelector('#pon-result');
const resultDetail = document.querySelector('#pon-result-detail');
const resultContext = document.querySelector('#pon-result-context');

const snapshotTargets = {
  percent: document.querySelector('[data-pon-snap="percent"]'),
  number: document.querySelector('[data-pon-snap="number"]'),
  result: document.querySelector('[data-pon-snap="result"]'),
};

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

setPageMetadata({
  title: 'Percentage of a Number Calculator | Calculate X% of Y',
  description:
    'Calculate what X% of Y equals with the standard percent-to-decimal formula for discounts, tax, tips, commission, and quick percentage checks.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-of-a-number-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percentage of a Number Calculator | Find X% of Y',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-of-a-number-calculator/',
        description:
          'Calculate what X percent of Y equals using the standard percent-to-decimal formula.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Find Percentage of a Number Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-of-a-number-calculator/',
        description:
          'Free calculator for finding what X percent of Y is using the standard percentage formula.',
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
            item: 'https://calchowmuch.com/percentage-calculators/percentage-of-a-number-calculator/',
          },
        ],
      },
    ],
  },
});

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

function updateSnapshot(key, value) {
  const node = snapshotTargets[key];
  if (node) {
    node.textContent = value;
  }
}

const staleController = createStaleResultController({
  resultPanel: answerCard,
  staleTargets: [staleNote],
  getSignature: () => `${percentInput?.value ?? ''}|${numberInput?.value ?? ''}`,
});

staleController.watchElements([percentInput, numberInput]);

function finishCalculation({ reveal = false } = {}) {
  staleController.markFresh();
  if (reveal) {
    revealResultPanel({ resultPanel: answerCard, focusTarget: resultOutput });
  }
}

function calculate({ reveal = false } = {}) {
  const x = Number.parseFloat(percentInput?.value ?? '');
  const y = Number.parseFloat(numberInput?.value ?? '');

  if (!Number.isFinite(x)) {
    resultOutput.textContent = 'Enter a valid percentage value (X).';
    resultDetail.textContent = 'Add a valid percentage to see the answer.';
    resultContext.textContent = 'The main answer uses the percentage and base number together.';
    finishCalculation({ reveal });
    return;
  }

  if (!Number.isFinite(y)) {
    resultOutput.textContent = 'Enter a valid number value (Y).';
    resultDetail.textContent = 'Add a valid base number to see the result.';
    resultContext.textContent = 'The answer appears after you calculate again.';
    finishCalculation({ reveal });
    return;
  }

  const result = calculatePercentageOfNumber(x, y);
  if (!result) {
    resultOutput.textContent = 'Unable to calculate result for the provided values.';
    resultDetail.textContent = 'Unable to calculate the result for the provided values.';
    resultContext.textContent = 'Check the inputs and try again.';
    finishCalculation({ reveal });
    return;
  }

  const percentText = `${fmt(result.percent)}%`;
  const numberText = fmt(result.number);
  const resultText = fmt(result.result);

  resultOutput.textContent = `Result: ${resultText}`;
  resultDetail.textContent = `Formula: (${fmt(result.percent)} / 100) x ${numberText} = ${resultText} | ${percentText} of ${numberText} is ${resultText}.`;
  resultContext.textContent = `Formula: ${result.formula}.`;

  updateSnapshot('percent', percentText);
  updateSnapshot('number', numberText);
  updateSnapshot('result', resultText);

  updateTargets(valueTargets?.percent, percentText);
  updateTargets(valueTargets?.number, numberText);
  updateTargets(valueTargets?.result, resultText);
  updateTargets(valueTargets?.formula, result.formula);

  finishCalculation({ reveal });
}

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

calculate();
