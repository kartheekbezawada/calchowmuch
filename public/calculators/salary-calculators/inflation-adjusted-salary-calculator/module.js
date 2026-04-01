import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateInflationAdjustedSalary,
  formatCurrency,
  formatPercent,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What does inflation adjusted salary mean?', acceptedAnswer: { '@type': 'Answer', text: 'It means salary viewed in real purchasing-power terms rather than only nominal dollars.' } },
    { '@type': 'Question', name: 'How do you compare a raise against inflation?', acceptedAnswer: { '@type': 'Answer', text: 'Calculate the salary needed to match inflation, then compare the actual new salary with that target.' } },
    { '@type': 'Question', name: 'What salary keeps pace with inflation?', acceptedAnswer: { '@type': 'Answer', text: 'It is the original salary multiplied by the inflation growth factor across the selected period.' } },
    { '@type': 'Question', name: 'What does salary in today\'s dollars mean?', acceptedAnswer: { '@type': 'Answer', text: 'It shows what the new salary is worth after removing the inflation effect over the selected years.' } },
    { '@type': 'Question', name: 'Does this include taxes or deductions?', acceptedAnswer: { '@type': 'Answer', text: 'No. It compares gross salary only and does not model payroll deductions.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Inflation Adjusted Salary Calculator | Real Raise vs Inflation',
    description:
      'Compare current salary, new salary, inflation rate, and years between pay points to see whether a raise beats inflation in real terms.',
    canonical: 'https://calchowmuch.com/salary-calculators/inflation-adjusted-salary-calculator/',
    name: 'Inflation Adjusted Salary Calculator',
    appDescription:
      'Compare current salary and new salary against inflation to see the required keep-pace salary, real salary gap, and salary in today\'s dollars.',
    featureList: [
      'Required salary to keep pace with inflation',
      'Nominal salary change',
      'Real salary change',
      'Salary in today\'s dollars',
      'Inflation sensitivity scenarios',
    ],
    keywords:
      'inflation adjusted salary calculator, real salary calculator, salary raise vs inflation',
    faqSchema: FAQ_SCHEMA,
  })
);

const currentSalaryInput = document.querySelector('#inflation-salary-current');
const newSalaryInput = document.querySelector('#inflation-salary-new');
const inflationRateInput = document.querySelector('#inflation-salary-rate');
const yearsInput = document.querySelector('#inflation-salary-years');
const errorNode = document.querySelector('#inflation-salary-error');

const outputs = {
  realGap: document.querySelector('#inflation-salary-real-gap'),
  requiredSalary: document.querySelector('#inflation-salary-required'),
  nominalChange: document.querySelector('#inflation-salary-nominal'),
  realChange: document.querySelector('#inflation-salary-real-percent'),
  todayDollars: document.querySelector('#inflation-salary-today-dollars'),
  note: document.querySelector('#inflation-salary-note'),
  context: document.querySelector('#inflation-salary-context'),
  breakdown: document.querySelector('#inflation-salary-breakdown'),
  lowLabel: document.querySelector('#inflation-salary-low-label'),
  lowOutput: document.querySelector('#inflation-salary-low-output'),
  baseLabel: document.querySelector('#inflation-salary-base-label'),
  baseOutput: document.querySelector('#inflation-salary-base-output'),
  highLabel: document.querySelector('#inflation-salary-high-label'),
  highOutput: document.querySelector('#inflation-salary-high-output'),
  sensitivityCopy: document.querySelector('#inflation-salary-sensitivity-copy'),
};

function showError(message) {
  if (!errorNode) {
    return;
  }
  errorNode.hidden = false;
  errorNode.textContent = message;
}

function clearError() {
  if (!errorNode) {
    return;
  }
  errorNode.hidden = true;
  errorNode.textContent = '';
}

function formatScenarioLabel(label, rate) {
  return `${label} (${formatPercent(rate)})`;
}

function buildScenarioRows({ currentSalary, yearsBetween, annualInflationRate }) {
  const scenarioRates = [
    { label: 'Lower-rate scenario', rate: Math.max(0, annualInflationRate - 2) },
    { label: 'Entered-rate scenario', rate: annualInflationRate },
    { label: 'Higher-rate scenario', rate: annualInflationRate + 2 },
  ];

  return scenarioRates.map((scenario) => {
    const requiredSalary = currentSalary * Math.pow(1 + scenario.rate / 100, yearsBetween);
    return {
      ...scenario,
      requiredSalary,
    };
  });
}

function buildVerdict(result) {
  if (result.realRaiseAmount > 0.005) {
    return {
      note: `This salary change beats inflation by ${formatCurrency(result.realRaiseAmount)} over the selected period.`,
      realGap: formatCurrency(result.realRaiseAmount),
    };
  }

  if (result.realRaiseAmount < -0.005) {
    return {
      note: `This salary change falls short of inflation by ${formatCurrency(Math.abs(result.realRaiseAmount))} over the selected period.`,
      realGap: formatCurrency(result.realRaiseAmount),
    };
  }

  return {
    note: 'This salary change exactly matches the inflation-adjusted target over the selected period.',
    realGap: formatCurrency(0),
  };
}

function calculate() {
  const result = calculateInflationAdjustedSalary({
    currentSalary: getInputNumber(currentSalaryInput),
    newSalary: getInputNumber(newSalaryInput),
    annualInflationRate: getInputNumber(inflationRateInput),
    yearsBetween: getInputNumber(yearsInput),
  });

  if (!result) {
    showError('Enter current salary, new salary, inflation rate, and years using valid positive values.');
    return;
  }

  clearError();

  const verdict = buildVerdict(result);
  const scenarios = buildScenarioRows(result);

  setText(outputs.realGap, verdict.realGap);
  setText(outputs.requiredSalary, formatCurrency(result.requiredSalary));
  setText(
    outputs.nominalChange,
    `${formatCurrency(result.nominalRaiseAmount)} (${formatPercent(result.nominalRaisePercent)})`
  );
  setText(
    outputs.realChange,
    `${formatCurrency(result.realRaiseAmount)} (${formatPercent(result.realRaisePercent)})`
  );
  setText(outputs.todayDollars, formatCurrency(result.newSalaryInTodayDollars));
  setText(outputs.note, verdict.note);
  setText(
    outputs.context,
    `Based on a current salary of ${formatCurrency(result.currentSalary)}, a new salary of ${formatCurrency(result.newSalary)}, ${formatPercent(result.annualInflationRate)} average annual inflation, and ${result.yearsBetween} years between pay points.`
  );
  setText(
    outputs.breakdown,
    'Required salary = current salary × (1 + inflation rate)^years. Real salary gap = new salary − required salary. Salary in today\'s dollars = new salary ÷ (1 + inflation rate)^years.'
  );
  setText(outputs.lowLabel, formatScenarioLabel(scenarios[0].label, scenarios[0].rate));
  setText(outputs.lowOutput, formatCurrency(scenarios[0].requiredSalary));
  setText(outputs.baseLabel, formatScenarioLabel(scenarios[1].label, scenarios[1].rate));
  setText(outputs.baseOutput, formatCurrency(scenarios[1].requiredSalary));
  setText(outputs.highLabel, formatScenarioLabel(scenarios[2].label, scenarios[2].rate));
  setText(outputs.highOutput, formatCurrency(scenarios[2].requiredSalary));
  setText(
    outputs.sensitivityCopy,
    `At the entered horizon, the keep-pace salary ranges from ${formatCurrency(scenarios[0].requiredSalary)} to ${formatCurrency(scenarios[2].requiredSalary)} across the lower and higher inflation scenarios.`
  );
}

document.querySelector('#inflation-salary-button')?.addEventListener('click', calculate);
