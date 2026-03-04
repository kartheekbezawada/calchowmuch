import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatPercent, formatNumber } from '/assets/js/core/format.js';
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
const formatMoney = (val) =>
  formatNumber(val, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
      name: 'What is an investment growth calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An investment growth calculator estimates the future value of an investment based on expected return, time, and contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate investment growth over time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You apply compound growth assumptions using an expected annual return and the investment period, and add contributions if applicable.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is future value in investing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Future value is the estimated amount your investment could grow to after a set time period.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do monthly contributions affect investment growth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly contributions can increase the final balance because added deposits may also earn returns over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does expected annual return mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is the assumed average yearly growth rate used for forecasting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does compounding frequency matter for investment growth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. More frequent compounding can slightly increase estimated growth under the same annual return assumption.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this calculator estimate investment returns?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It estimates future value and total growth based on the return rate you enter.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is inflation-adjusted future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "It estimates your ending balance in today's purchasing power after accounting for inflation.",
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the return rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Future value equals the initial investment plus total contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this investment growth estimate guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It is a projection based on assumptions and actual market returns can vary.',
      },
    },
  ],
};

const metadata = {
  title: 'Investment Growth Calculator - Estimate Future Value',
  description:
    'Calculate how your investments will grow over time with compound interest, regular contributions, and inflation adjustments.',
  canonical: 'https://calchowmuch.com/finance-calculators/investment-growth-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Investment Growth Calculator',
        url: 'https://calchowmuch.com/finance-calculators/investment-growth-calculator/',
        description: 'Estimate future investment value with compound interest and contributions.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Investment Growth Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/investment-growth-calculator/',
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
            item: 'https://calchowmuch.com/finance-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Investment Growth',
            item: 'https://calchowmuch.com/finance-calculators/investment-growth-calculator/',
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
  if (!snapInitial) {return;}

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

  const totalYears = years + months / 12;

  // Only calculate if we have some time period, even if it's 0 (start value)
  if (totalYears < 0) {return;}

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

  const timeLabel = months > 0 ? `${years} yr ${months} mo` : `${years} years`;

  updateSnapshots({
    initialInvestment,
    expectedReturn,
    timeDisplay: timeLabel,
    monthlyContribution,
    compoundingLabel: result.compoundingLabel,
    totalContributions: result.totalContributions,
    totalGains: result.totalGains,
    inflationAdjustedFV: result.inflationAdjustedFV,
  });
}

// Event Listeners for Sliders
[initialInput, returnInput, yearsInput, monthsInput, contributionInput, inflationInput].forEach(
  (input) => {
    if (input) {
      input.addEventListener('input', calculate);
    }
  }
);

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

// Initial calculation
calculate();
