import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatCurrency, formatPercent, formatNumber } from '/assets/js/core/format.js';
import { calculateInvestmentGrowth } from '/assets/js/core/time-value-utils.js';

const initialInput = document.querySelector('#ig-initial');
const initialDisplay = document.querySelector('#ig-initial-display');

const returnInput = document.querySelector('#ig-return');
const returnDisplay = document.querySelector('#ig-return-display');

const yearsInput = document.querySelector('#ig-years');
const yearsDisplay = document.querySelector('#ig-years-display');

const monthsInput = document.querySelector('#ig-months');
const monthsDisplay = document.querySelector('#ig-months-display');

const contributionInput = document.querySelector('#ig-contribution');
const contributionDisplay = document.querySelector('#ig-contribution-display');

const inflationInput = document.querySelector('#ig-inflation');
const inflationDisplay = document.querySelector('#ig-inflation-display');

const calculateButton = document.querySelector('#ig-calc');
const resultOutput = document.querySelector('#ig-result');
const resultDetail = document.querySelector('#ig-result-detail');

const compoundingGroup = document.querySelector('[data-button-group="ig-compounding"]');

// Snapshot elements
const snapInitial = document.querySelector('[data-ig="snap-initial"]');
const snapReturn = document.querySelector('[data-ig="snap-return"]');
const snapTime = document.querySelector('[data-ig="snap-time"]');
const snapContribution = document.querySelector('[data-ig="snap-contribution"]');
const snapCompounding = document.querySelector('[data-ig="snap-compounding"]');
const snapTotalContributions = document.querySelector('[data-ig="snap-total-contributions"]');
const snapTotalGains = document.querySelector('[data-ig="snap-total-gains"]');
const snapInflation = document.querySelector('[data-ig="snap-inflation"]');
const snapInflationRow = document.querySelector('#ig-snap-inflation-row');

// Helper to remove currency symbol
const formatMoney = (val) => formatNumber(val, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatInput = (val) => formatNumber(val, { maximumFractionDigits: 0 });

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is investment growth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Investment growth refers to the increase in value of an investment over time due to compound interest and additional contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does compound interest work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compound interest allows you to earn interest on both your initial principal and the accumulated interest from previous periods, accelerating growth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does inflation matter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Inflation reduces the purchasing power of money over time. Adjusting for inflation gives you a realistic view of your investment\'s future real value.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a good rate of return?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Historically, the stock market has returned about 7-10% annually before inflation. However, returns vary by asset class and risk tolerance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often should I contribute?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Regular contributions (e.g., monthly) take advantage of dollar-cost averaging and maximize the time your money has to grow.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does compounding frequency affect the result?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The more frequently interest is compounded (e.g., monthly vs. annually), the faster your investment grows.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the future value formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r], where PV is present value, r is periodic rate, n is number of periods, and PMT is contribution.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I lose money investing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, all investments carry risk. This calculator assumes a constant positive rate of return, but actual markets fluctuate.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do taxes impact growth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Taxes on gains (capital gains) or income can reduce your net return. This calculator shows pre-tax growth unless you adjust the return rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the rule of 72?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Rule of 72 is a shortcut to estimate how long it takes to double your money: divide 72 by the annual return rate.',
      },
    },
  ],
};

const metadata = {
  title: 'Investment Growth Calculator - Estimate Future Value',
  description:
    'Calculate how your investments will grow over time with compound interest, regular contributions, and inflation adjustments.',
  canonical: 'https://calchowmuch.com/finance/investment-growth/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Investment Growth Calculator',
        url: 'https://calchowmuch.com/finance/investment-growth/',
        description: 'Estimate future investment value with compound interest and contributions.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Investment Growth Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/investment-growth/',
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
            name: 'Investment Growth',
            item: 'https://calchowmuch.com/finance/investment-growth/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'monthly',
  onChange: () => {
    calculate();
  },
});

function updateSnapshots(data) {
  if (!snapInitial) return;

  snapInitial.textContent = formatInput(data.initialInvestment);
  snapReturn.textContent = formatPercent(data.expectedReturn);
  snapTime.textContent = data.timeDisplay;
  snapContribution.textContent = formatInput(data.monthlyContribution);
  snapCompounding.textContent = data.compoundingLabel;

  // Animate large numbers
  snapTotalContributions.textContent = formatMoney(data.totalContributions);
  snapTotalGains.textContent = formatMoney(data.totalGains);

  if (data.inflationAdjustedFV !== null && data.inflationAdjustedFV !== undefined) {
    snapInflationRow.style.display = 'flex';
    snapInflation.textContent = formatMoney(data.inflationAdjustedFV);
  } else {
    snapInflationRow.style.display = 'none';
    snapInflation.textContent = '';
  }
}

function showError(message) {
  if (resultOutput) {
    resultOutput.innerHTML = `<span style="color: #ef4444; font-size: 1.5rem;">${message}</span>`;
  }
  if (resultDetail) {
    resultDetail.textContent = '';
  }
}

function calculate() {
  const initialInvestment = Number.parseFloat(initialInput.value);
  const expectedReturn = Number.parseFloat(returnInput.value);
  const years = Number.parseFloat(yearsInput.value);
  const months = Number.parseFloat(monthsInput.value);
  const monthlyContribution = Number.parseFloat(contributionInput.value);
  const inflationRate = Number.parseFloat(inflationInput.value);
  const compounding = compoundingButtons.getValue();

  // Update displays with NO currency symbol
  initialDisplay.textContent = formatInput(initialInvestment);
  returnDisplay.textContent = formatPercent(expectedReturn);
  yearsDisplay.textContent = years;
  monthsDisplay.textContent = months;
  contributionDisplay.textContent = formatInput(monthlyContribution);
  inflationDisplay.textContent = formatPercent(inflationRate);

  const totalYears = years + (months / 12);

  // Only calculate if we have some time period, even if it's 0 (start value)
  if (totalYears < 0) return;

  const result = calculateInvestmentGrowth({
    initialInvestment,
    expectedReturn,
    timePeriod: totalYears,
    periodType: 'years',
    compounding,
    monthlyContribution,
    inflationRate,
  });

  if (!result) {
    showError('Invalid input values');
    return;
  }

  if (resultOutput) {
    resultOutput.textContent = formatMoney(result.futureValue);
  }

  let detailHtml =
    `<p><strong>Total Contributions:</strong> ${formatMoney(result.totalContributions)}</p>` +
    `<p><strong>Total Interest Earned:</strong> ${formatMoney(result.totalGains)}</p>`;

  if (result.inflationAdjustedFV !== null) {
    detailHtml += `<p class="mt-2 text-sm text-blue-200">Inflation Adjusted: ${formatMoney(result.inflationAdjustedFV)}</p>`;
  }

  if (resultDetail) {
    resultDetail.innerHTML = detailHtml;
  }

  const timeLabel = months > 0
    ? `${years} yr ${months} mo`
    : `${years} years`;

  updateSnapshots({
    initialInvestment,
    expectedReturn,
    timeDisplay: timeLabel,
    monthlyContribution,
    compoundingLabel: result.compoundingLabel,
    totalContributions: result.totalContributions,
    totalGains: result.totalGains,
    inflationAdjustedFV: result.inflationAdjustedFV
  });
}

// Event Listeners for Sliders
[initialInput, returnInput, yearsInput, monthsInput, contributionInput, inflationInput].forEach(input => {
  if (input) {
    input.addEventListener('input', calculate);
  }
});

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

// Initial calculation
calculate();
