import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateFutureValue, resolveCompounding } from '/assets/js/core/time-value-utils.js';

/* ── DOM refs: calculator inputs ── */
const pvInput = document.querySelector('#fv-present-value');
const rateInput = document.querySelector('#fv-interest-rate');
const timeInput = document.querySelector('#fv-time-period');
const contribInput = document.querySelector('#fv-regular-contribution');
const calculateButton = document.querySelector('#fv-calc');
const resultDiv = document.querySelector('#fv-result');
const summaryDiv = document.querySelector('#fv-result-detail');

/* ── DOM refs: slider value displays ── */
const pvDisplay = document.querySelector('#fv-pv-display');
const rateDisplay = document.querySelector('#fv-rate-display');
const timeDisplay = document.querySelector('#fv-time-display');
const contribDisplay = document.querySelector('#fv-contrib-display');

/* ── DOM refs: snapshot rows ── */
const snapPv = document.querySelector('[data-fv="snap-pv"]');
const snapRate = document.querySelector('[data-fv="snap-rate"]');
const snapTime = document.querySelector('[data-fv="snap-time"]');
const snapCompounding = document.querySelector('[data-fv="snap-compounding"]');
const snapContribution = document.querySelector('[data-fv="snap-contribution"]');
const snapPeriods = document.querySelector('[data-fv="snap-periods"]');
const snapPeriodicRate = document.querySelector('[data-fv="snap-periodic-rate"]');

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector('#fv-explanation');
const valueTargets = explanationRoot
  ? {
      presentValue: explanationRoot.querySelectorAll('[data-fv="present-value"]'),
      interestRate: explanationRoot.querySelectorAll('[data-fv="interest-rate"]'),
      timePeriod: explanationRoot.querySelectorAll('[data-fv="time-period"]'),
      compoundingFrequency: explanationRoot.querySelectorAll('[data-fv="compounding-frequency"]'),
      futureValue: explanationRoot.querySelectorAll('[data-fv="future-value"]'),
      totalContributions: explanationRoot.querySelectorAll('[data-fv="total-contributions"]'),
      totalGrowth: explanationRoot.querySelectorAll('[data-fv="total-growth"]'),
      totalPeriods: explanationRoot.querySelectorAll('[data-fv="total-periods"]'),
      regularContribution: explanationRoot.querySelectorAll('[data-fv="regular-contribution"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-fv="applied-rate"]'),
      appliedRateDecimal: explanationRoot.querySelectorAll('[data-fv="applied-rate-decimal"]'),
      formulaGrowthFactor: explanationRoot.querySelectorAll('[data-fv="formula-growth-factor"]'),
      periodsPerYear: explanationRoot.querySelectorAll('[data-fv="periods-per-year"]'),
    }
  : null;

/* ── Button groups ── */
const periodGroup = document.querySelector('[data-button-group="fv-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="fv-compounding"]');

const periodButtons = setupButtonGroup(periodGroup, {
  defaultValue: 'years',
  onChange() {
    hydrateOnUserIntent();
    calculate();
  },
});

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'annual',
  onChange() {
    hydrateOnUserIntent();
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
      name: 'What is future value (FV)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Future value is the amount your money will be worth at a future date after earning interest or growth over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is future value different from present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Present value is today's worth of money, while future value shows what it grows into over time through compounding.",
      },
    },
    {
      '@type': 'Question',
      name: 'What interest rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use an expected return rate based on savings accounts, investments, or inflation assumptions relevant to your goal.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does compounding affect future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'More frequent compounding increases growth because interest is earned on previously accumulated interest more often.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are regular contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Regular contributions are additional amounts added each period that also earn compound interest, accelerating growth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can future value decrease over time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With a positive interest rate, future value always increases. Only negative rates or withdrawals would reduce it.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if interest rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At 0% interest, future value equals present value plus total contributions because there is no growth from compounding.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I calculate future value in months?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Switching period type to months lets you model shorter horizons with the same compound growth method.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do contributions benefit from compounding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Contributions added each period can also earn interest, which increases total future value over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator suitable for savings goals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It is useful for estimating savings and investment growth under fixed-rate assumptions.',
      },
    },
  ],
};

const metadata = {
  title: 'Future Value (FV) Calculator – CalcHowMuch',
  description:
    'Calculate how much your money could grow in the future using interest rate and time period. Simple FV calculator.',
  canonical: 'https://calchowmuch.com/finance-calculators/future-value-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Future Value (FV) Calculator',
        url: 'https://calchowmuch.com/finance-calculators/future-value-calculator/',
        description:
          'Estimate the future value of money using growth rate, time period, and compounding.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Future Value (FV) Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/future-value-calculator/',
        description:
          'Calculate future value using present value, growth rate, time period, compounding frequency, and optional regular contributions.',
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
            name: 'Future Value (FV)',
            item: 'https://calchowmuch.com/finance-calculators/future-value-calculator/',
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

function setTextIfChanged(node, nextValue) {
  if (!node) {return;}
  if (node.textContent !== nextValue) {
    node.textContent = nextValue;
  }
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
  if (pvInput && pvDisplay) {
    setSliderFill(pvInput);
    setTextIfChanged(
      pvDisplay,
      fmt(Number(pvInput.value), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );
  }
  if (rateInput && rateDisplay) {
    setSliderFill(rateInput);
    setTextIfChanged(rateDisplay, `${Number(rateInput.value)}%`);
  }
  if (timeInput && timeDisplay) {
    setSliderFill(timeInput);
    const periodType = periodButtons?.getValue() ?? 'years';
    setTextIfChanged(
      timeDisplay,
      `${Number(timeInput.value)} ${periodType === 'months' ? 'mo' : 'yrs'}`
    );
  }
  if (contribInput && contribDisplay) {
    setSliderFill(contribInput);
    setTextIfChanged(
      contribDisplay,
      fmt(Number(contribInput.value), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );
  }
}

function updateTargets(targets, value) {
  if (!targets) {return;}
  targets.forEach((node) => setTextIfChanged(node, value));
}

function setError(message) {
  if (resultDiv) {resultDiv.textContent = message;}
  if (summaryDiv) {summaryDiv.textContent = '';}
}

/* ── Core calculate ── */

function calculate() {
  if (!resultDiv || !summaryDiv) {return;}

  const pv = Number(pvInput?.value);
  const rate = Number(rateInput?.value);
  const period = Number(timeInput?.value);
  const contribution = Number(contribInput?.value) || 0;
  const periodType = periodButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(pv) || pv < 0) {
    setError('Present value must be 0 or more.');
    return;
  }
  if (!Number.isFinite(rate) || rate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(period) || period < 0) {
    setError('Time period must be 0 or more.');
    return;
  }

  const result = calculateFutureValue({
    presentValue: pv,
    interestRate: rate,
    timePeriod: period,
    periodType,
    compounding,
    regularContribution: contribution,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const appliedRatePct = result.periodicRate * 100;
  const totalPeriodsStr = fmt(result.totalPeriods, { maximumFractionDigits: 2 });
  const pvStr = fmt(pv);
  const rateStr = formatPercent(rate);
  const timeStr = `${fmt(period, { maximumFractionDigits: 2 })} ${periodType === 'months' ? 'months' : 'years'}`;
  const compoundingStr = compoundingInfo.label;
  const fvStr = fmt(result.futureValue);
  const appliedRateStr = fmt(appliedRatePct, { maximumFractionDigits: 4 });
  const contribStr = fmt(contribution);
  const totalContribStr = fmt(result.totalContributions);
  const totalGrowthStr = fmt(result.totalGrowth);

  /* Formula walkthrough values */
  const appliedRateDecimal = result.periodicRate;
  const growthFactor = Math.pow(1 + appliedRateDecimal, result.totalPeriods);
  const periodsPerYear = compoundingInfo.periodsPerYear;

  const appliedRateDecimalStr = fmt(appliedRateDecimal, { maximumFractionDigits: 6 });
  const growthFactorStr = fmt(growthFactor, { maximumFractionDigits: 6 });
  const periodsPerYearStr = String(periodsPerYear);

  /* Preview panel */
  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${fvStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {setTimeout(() => valueEl.classList.remove('is-updated'), 420);}

  summaryDiv.innerHTML =
    `<p><strong>Total growth:</strong> ${totalGrowthStr}</p>` +
    `<p><strong>Contributions:</strong> ${totalContribStr}</p>` +
    `<p><strong>Compounding:</strong> ${compoundingStr}</p>`;

  /* Snapshot rows */
  if (snapPv) {snapPv.textContent = pvStr;}
  if (snapRate) {snapRate.textContent = rateStr;}
  if (snapTime) {snapTime.textContent = timeStr;}
  if (snapCompounding) {snapCompounding.textContent = compoundingStr;}
  if (snapContribution) {snapContribution.textContent = contribStr;}
  if (snapPeriods) {snapPeriods.textContent = totalPeriodsStr;}
  if (snapPeriodicRate) {snapPeriodicRate.textContent = `${appliedRateStr}%`;}

  /* Explanation targets */
  if (valueTargets) {
    updateTargets(valueTargets.presentValue, pvStr);
    updateTargets(valueTargets.interestRate, rateStr);
    updateTargets(valueTargets.timePeriod, timeStr);
    updateTargets(valueTargets.compoundingFrequency, compoundingStr);
    updateTargets(valueTargets.futureValue, fvStr);
    updateTargets(valueTargets.totalContributions, totalContribStr);
    updateTargets(valueTargets.totalGrowth, totalGrowthStr);
    updateTargets(valueTargets.totalPeriods, totalPeriodsStr);
    updateTargets(valueTargets.regularContribution, contribStr);
    updateTargets(valueTargets.appliedRate, appliedRateStr);
    updateTargets(valueTargets.appliedRateDecimal, appliedRateDecimalStr);
    updateTargets(valueTargets.formulaGrowthFactor, growthFactorStr);
    updateTargets(valueTargets.periodsPerYear, periodsPerYearStr);
  }
}

/* ── Event wiring ── */

[pvInput, rateInput, timeInput, contribInput].forEach((input) => {
  input?.addEventListener('input', () => {
    hydrateOnUserIntent();
    updateSliderDisplays();
    calculate();
  });
});

calculateButton?.addEventListener('click', () => {
  hydrateOnUserIntent();
  calculate();
});

let hydrated = false;
let idleHydrationHandle = null;

function hydrateOnUserIntent() {
  cancelIdleHydration();
  hydrateInitialState();
}

function hydrateInitialState() {
  if (hydrated) {
    return;
  }
  hydrated = true;
  updateSliderDisplays();
  calculate();
}

function cancelIdleHydration() {
  if (idleHydrationHandle === null) {
    return;
  }
  if (typeof window !== 'undefined' && typeof window.cancelIdleCallback === 'function') {
    window.cancelIdleCallback(idleHydrationHandle);
  } else {
    clearTimeout(idleHydrationHandle);
  }
  idleHydrationHandle = null;
}

function scheduleIdleHydration() {
  if (typeof window === 'undefined') {
    return;
  }
  if (typeof window.requestIdleCallback === 'function') {
    idleHydrationHandle = window.requestIdleCallback(
      () => {
        idleHydrationHandle = null;
        hydrateInitialState();
      },
      { timeout: 3200 }
    );
    return;
  }
  idleHydrationHandle = window.setTimeout(() => {
    idleHydrationHandle = null;
    hydrateInitialState();
  }, 2800);
}

window.addEventListener('pointerdown', hydrateOnUserIntent, { once: true, passive: true });
window.addEventListener('touchstart', hydrateOnUserIntent, { once: true, passive: true });
window.addEventListener('keydown', hydrateOnUserIntent, { once: true });
window.addEventListener('focusin', hydrateOnUserIntent, { once: true });

/* ── Init ── */
scheduleIdleHydration();
