import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateSimpleInterest } from '/assets/js/core/time-value-utils.js';

/* ── DOM refs: calculator inputs ── */
const principalInput = document.querySelector('#si-principal');
const rateInput = document.querySelector('#si-rate');
const timeInput = document.querySelector('#si-time');
const calculateButton = document.querySelector('#si-calc');
const resultDiv = document.querySelector('#si-result');
const summaryDiv = document.querySelector('#si-result-detail');

/* ── DOM refs: slider value displays ── */
const principalDisplay = document.querySelector('#si-principal-display');
const rateDisplay = document.querySelector('#si-rate-display');
const timeDisplay = document.querySelector('#si-time-display');

/* ── DOM refs: snapshot rows ── */
const snapPrincipal = document.querySelector('[data-si="snap-principal"]');
const snapRate = document.querySelector('[data-si="snap-rate"]');
const snapTime = document.querySelector('[data-si="snap-time"]');
const snapBasis = document.querySelector('[data-si="snap-basis"]');
const snapYears = document.querySelector('[data-si="snap-years"]');
const snapInterest = document.querySelector('[data-si="snap-interest"]');

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector('#si-explanation');
const valueTargets = explanationRoot
  ? {
      principal: explanationRoot.querySelectorAll('[data-si="principal"]'),
      rate: explanationRoot.querySelectorAll('[data-si="rate"]'),
      time: explanationRoot.querySelectorAll('[data-si="time"]'),
      timeUnit: explanationRoot.querySelectorAll('[data-si="time-unit"]'),
      basis: explanationRoot.querySelectorAll('[data-si="basis"]'),
      totalInterest: explanationRoot.querySelectorAll('[data-si="total-interest"]'),
      endingAmount: explanationRoot.querySelectorAll('[data-si="ending-amount"]'),
      years: explanationRoot.querySelectorAll('[data-si="years"]'),
      rateDecimal: explanationRoot.querySelectorAll('[data-si="rate-decimal"]'),
    }
  : null;

/* ── Button groups ── */
const timeUnitGroup = document.querySelector('[data-button-group="si-time-unit"]');
const basisGroup = document.querySelector('[data-button-group="si-basis"]');

const timeUnitButtons = setupButtonGroup(timeUnitGroup, {
  defaultValue: 'years',
  onChange() {
    calculate();
  },
});

const basisButtons = setupButtonGroup(basisGroup, {
  defaultValue: 'per-year',
  onChange() {
    calculate();
  },
});

/* ── SEO / Schema ── */
export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is simple interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest is interest calculated only on the original principal amount — it never compounds on previously earned interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the simple interest formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I = P × r × t, where P is principal, r is the rate as a decimal, and t is time in years (or months if using per-month basis).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between simple and compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest applies only to the principal, growing linearly. Compound interest earns interest on both principal and accumulated interest, growing exponentially.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for loans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many short-term loans, auto loans, and personal loans use simple interest. This calculator estimates the total interest owed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does simple interest grow linearly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. With a fixed rate the interest earned each period is the same, producing a straight-line growth pattern.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate interest for months?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Set the time unit to Months. The calculator converts months to years by dividing by 12, then applies the standard formula.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Total interest is zero and the ending amount equals the principal — your money neither grows nor shrinks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Interest Basis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Per Year treats the entered rate as an annual rate. Per Month treats it as a monthly rate, which dramatically changes the result over longer periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is simple interest used for savings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rarely for long-term savings — most savings accounts compound. But simple interest is useful for quick comparisons and short-term estimates.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I use simple interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use it for short-term loans, quick estimates, certificates of deposit with simple interest, and educational comparisons.',
      },
    },
  ],
};

const metadata = {
  title: 'Simple Interest Calculator | Interest & Final Amount',
  description:
    'Estimate simple interest, total interest, and ending amount using principal, rate, and time period.',
  canonical: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Simple Interest Calculator | Interest & Final Amount',
        url: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
        description:
          'Estimate simple interest, total interest, and ending amount using principal, rate, and time period.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Simple Interest Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Interest & Growth Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
        description:
          'Free simple interest calculator to compute total interest and ending amount using principal, rate, and time.',
        browserRequirements: 'Requires JavaScript enabled',
        softwareVersion: '1.0',
        creator: { '@type': 'Organization', name: 'CalcHowMuch' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://calchowmuch.com/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Finance',
            item: 'https://calchowmuch.com/finance-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Simple Interest',
            item: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

/* ── Helpers ── */

function fmt(value, opts = {}) {
  return formatNumber(value, {
    minimumFractionDigits: opts.minimumFractionDigits ?? 2,
    maximumFractionDigits: opts.maximumFractionDigits ?? 2,
    ...opts,
  });
}

function setSliderFill(input) {
  if (!input) {return;}
  const min = Number(input.min) || 0;
  const max = Number(input.max) || 100;
  const val = Number(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

function updateSliderDisplays() {
  if (principalInput && principalDisplay) {
    setSliderFill(principalInput);
    principalDisplay.textContent = fmt(Number(principalInput.value), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  if (rateInput && rateDisplay) {
    setSliderFill(rateInput);
    rateDisplay.textContent = `${Number(rateInput.value)}%`;
  }
  if (timeInput && timeDisplay) {
    setSliderFill(timeInput);
    const timeUnit = timeUnitButtons?.getValue() ?? 'years';
    timeDisplay.textContent = `${Number(timeInput.value)} ${timeUnit === 'months' ? 'mo' : 'yrs'}`;
  }
}

function updateTargets(targets, value) {
  if (!targets) {return;}
  targets.forEach((node) => {
    node.textContent = value;
  });
}

function setError(message) {
  if (resultDiv) {resultDiv.textContent = message;}
  if (summaryDiv) {summaryDiv.textContent = '';}
}

/* ── Core calculate ── */

function calculate() {
  if (!resultDiv || !summaryDiv) {return;}

  const principal = Number(principalInput?.value);
  const rate = Number(rateInput?.value);
  const timePeriod = Number(timeInput?.value);
  const timeUnit = timeUnitButtons?.getValue() ?? 'years';
  const interestBasis = basisButtons?.getValue() ?? 'per-year';

  if (!Number.isFinite(principal) || principal < 0) {
    setError('Principal must be 0 or more.');
    return;
  }
  if (!Number.isFinite(rate) || rate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(timePeriod) || timePeriod < 0) {
    setError('Time must be 0 or more.');
    return;
  }

  const result = calculateSimpleInterest({
    principal,
    rate,
    timePeriod,
    timeUnit,
    interestBasis,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const principalStr = fmt(result.principal);
  const rateStr = formatPercent(result.rate);
  const timeStr = fmt(result.timePeriod, { maximumFractionDigits: 2 });
  const timeUnitStr = result.timeUnit === 'months' ? 'Months' : 'Years';
  const basisStr = result.interestBasis === 'per-month' ? 'Per Month' : 'Per Year';
  const yearsStr = fmt(result.years, { maximumFractionDigits: 4 });
  const rateDecimalStr = fmt(result.rate / 100, { maximumFractionDigits: 6 });
  const totalInterestStr = fmt(result.totalInterest);
  const endingAmountStr = fmt(result.endingAmount);

  /* Preview panel — show total interest as the hero number */
  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${totalInterestStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {setTimeout(() => valueEl.classList.remove('is-updated'), 420);}

  summaryDiv.innerHTML = `<p><strong>Ending amount:</strong> ${endingAmountStr}</p>`;

  /* Snapshot rows */
  if (snapPrincipal) {snapPrincipal.textContent = principalStr;}
  if (snapRate) {snapRate.textContent = rateStr;}
  if (snapTime) {snapTime.textContent = `${timeStr} ${timeUnitStr.toLowerCase()}`;}
  if (snapBasis) {snapBasis.textContent = basisStr;}
  if (snapYears) {snapYears.textContent = yearsStr;}
  if (snapInterest) {snapInterest.textContent = totalInterestStr;}

  /* Explanation targets */
  if (valueTargets) {
    updateTargets(valueTargets.principal, principalStr);
    updateTargets(valueTargets.rate, rateStr);
    updateTargets(valueTargets.time, timeStr);
    updateTargets(valueTargets.timeUnit, timeUnitStr.toLowerCase());
    updateTargets(valueTargets.basis, basisStr);
    updateTargets(valueTargets.totalInterest, totalInterestStr);
    updateTargets(valueTargets.endingAmount, endingAmountStr);
    updateTargets(valueTargets.years, yearsStr);
    updateTargets(valueTargets.rateDecimal, rateDecimalStr);
  }
}

/* ── Event wiring ── */

[principalInput, rateInput, timeInput].forEach((input) => {
  input?.addEventListener('input', () => {
    updateSliderDisplays();
    calculate();
  });
});

calculateButton?.addEventListener('click', calculate);

/* ── Init ── */
updateSliderDisplays();
calculate();
