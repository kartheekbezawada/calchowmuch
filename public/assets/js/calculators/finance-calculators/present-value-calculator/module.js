import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculatePresentValue, resolveCompounding } from '/assets/js/core/time-value-utils.js';

/* ── DOM refs: sliders ── */
const fvInput = document.querySelector('#pv-future-value');
const rateInput = document.querySelector('#pv-discount-rate');
const timeInput = document.querySelector('#pv-time-period');
const calculateButton = document.querySelector('#pv-calc');

/* ── DOM refs: displays ── */
const fvDisplay = document.querySelector('#pv-fv-display');
const rateDisplay = document.querySelector('#pv-rate-display');
const timeDisplay = document.querySelector('#pv-time-display');

/* ── DOM refs: preview panel ── */
const resultDiv = document.querySelector('#pv-result');
const summaryDiv = document.querySelector('#pv-result-detail');

const snapFv = document.querySelector('[data-pv="snap-fv"]');
const snapRate = document.querySelector('[data-pv="snap-rate"]');
const snapTime = document.querySelector('[data-pv="snap-time"]');
const snapCompounding = document.querySelector('[data-pv="snap-compounding"]');
const snapPeriods = document.querySelector('[data-pv="snap-periods"]');
const snapPeriodicRate = document.querySelector('[data-pv="snap-periodic-rate"]');

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector('#pv-explanation');
const valueTargets = explanationRoot
  ? {
      futureValue: explanationRoot.querySelectorAll('[data-pv="future-value"]'),
      discountRate: explanationRoot.querySelectorAll('[data-pv="discount-rate"]'),
      timePeriod: explanationRoot.querySelectorAll('[data-pv="time-period"]'),
      compoundingFrequency: explanationRoot.querySelectorAll('[data-pv="compounding-frequency"]'),
      presentValue: explanationRoot.querySelectorAll('[data-pv="present-value"]'),
      effectivePeriods: explanationRoot.querySelectorAll('[data-pv="effective-periods"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-pv="applied-rate"]'),
      formulaDenominator: explanationRoot.querySelectorAll('[data-pv="formula-denominator"]'),
      formulaDiscountLost: explanationRoot.querySelectorAll('[data-pv="formula-discount-lost"]'),
      appliedRateDecimal: explanationRoot.querySelectorAll('[data-pv="applied-rate-decimal"]'),
      effectivePeriodsPerYear: explanationRoot.querySelectorAll(
        '[data-pv="effective-periods-per-year"]'
      ),
    }
  : null;

/* ── Button groups ── */
const periodGroup = document.querySelector('[data-button-group="pv-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="pv-compounding"]');

const periodButtons = setupButtonGroup(periodGroup, {
  defaultValue: 'years',
  onChange: () => {
    hydrateOnUserIntent();
    calculate();
  },
});

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'annual',
  onChange: () => {
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
      name: 'What is present value (PV)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Present value is the current worth of a future amount of money after accounting for the time value of money.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is present value lower than future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because money today can earn returns, a future amount is discounted to reflect lost earning potential.',
      },
    },
    {
      '@type': 'Question',
      name: 'What discount rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use a rate that reflects inflation, investment returns, or the opportunity cost relevant to your decision.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the time period affect present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Longer time periods increase discounting, which lowers the present value of a future amount.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is compounding frequency?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compounding frequency defines how often the discount rate is applied, such as annually, quarterly, or monthly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can present value be higher than future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, with a positive discount rate, present value will always be lower than future value.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens when the discount rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At a 0% discount rate, present value equals future value because no discounting is applied.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I calculate PV using months instead of years?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Switch the period type to months to model shorter time horizons with the same formula.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does compounding frequency change present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. More frequent compounding changes the per-period rate and total periods, which can change PV.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator for single future cash flows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. This PV calculator discounts one future amount; annuity calculators are used for recurring cash flows.',
      },
    },
  ],
};

const metadata = {
  title: 'Present Value Calculator | Discount Future Money',
  description:
    'Estimate the present value of future money using discount rate, time period, and compounding frequency.',
  canonical: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Present Value Calculator | Discount Future Money',
        url: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
        description:
          'Estimate the present value of future money using discount rate, time period, and compounding frequency.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Present Value Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
        description:
          'Calculate the present value of a future amount using discount rate, time period, and compounding frequency.',
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
            name: 'Present Value (PV)',
            item: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
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
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty('--fill', `${Math.min(100, Math.max(0, pct))}%`);
}

function updateSliderDisplays() {
  const periodType = periodButtons?.getValue() ?? 'years';

  if (fvDisplay && fvInput) {
    setTextIfChanged(fvDisplay, fmt(Number(fvInput.value)));
  }
  if (rateDisplay && rateInput) {
    setTextIfChanged(rateDisplay, formatPercent(Number(rateInput.value)));
  }
  if (timeDisplay && timeInput) {
    const v = Number(timeInput.value);
    setTextIfChanged(
      timeDisplay,
      periodType === 'months'
        ? `${fmt(v, { maximumFractionDigits: 0 })} mo`
        : `${fmt(v, { maximumFractionDigits: 0 })} yrs`
    );
  }

  [fvInput, rateInput, timeInput].forEach(setSliderFill);
}

function updateTargets(targets, value) {
  if (!targets) {return;}
  targets.forEach((node) => {
    if (node.textContent !== value) {
      node.textContent = value;
    }
  });
}

function setError(message) {
  if (resultDiv) {resultDiv.textContent = message;}
  if (summaryDiv) {summaryDiv.textContent = '';}
}

/* ── Core calculate ── */

function calculate() {
  if (!resultDiv || !summaryDiv) {return;}

  const fv = Number(fvInput?.value);
  const rate = Number(rateInput?.value);
  const period = Number(timeInput?.value);
  const periodType = periodButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(fv) || fv < 0) {
    setError('Future value must be 0 or more.');
    return;
  }
  if (!Number.isFinite(rate) || rate < 0) {
    setError('Discount rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(period) || period < 0) {
    setError('Time period must be 0 or more.');
    return;
  }

  const result = calculatePresentValue({
    futureValue: fv,
    discountRate: rate,
    timePeriod: period,
    periodType,
    compounding,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const appliedRatePct = result.periodicRate * 100;
  const totalPeriodsStr = fmt(result.totalPeriods, { maximumFractionDigits: 2 });
  const fvStr = fmt(fv);
  const rateStr = formatPercent(rate);
  const timeStr = `${fmt(period, { maximumFractionDigits: 2 })} ${periodType === 'months' ? 'months' : 'years'}`;
  const compoundingStr = compoundingInfo.label;
  const pvStr = fmt(result.presentValue);
  const appliedRateStr = fmt(appliedRatePct, { maximumFractionDigits: 4 });

  /* Formula walkthrough values */
  const appliedRateDecimal = result.periodicRate;
  const denominator = Math.pow(1 + appliedRateDecimal, result.totalPeriods);
  const discountLost = fv - result.presentValue;
  const periodsPerYear = compoundingInfo.periodsPerYear;

  const appliedRateDecimalStr = fmt(appliedRateDecimal, { maximumFractionDigits: 6 });
  const denominatorStr = fmt(denominator, { maximumFractionDigits: 6 });
  const discountLostStr = fmt(discountLost);
  const periodsPerYearStr = String(periodsPerYear);

  /* Preview panel */
  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${pvStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {setTimeout(() => valueEl.classList.remove('is-updated'), 420);}

  summaryDiv.innerHTML =
    `<p><strong>Discount lost:</strong> ${discountLostStr}</p>` +
    `<p><strong>Compounding:</strong> ${compoundingStr}</p>`;

  /* Snapshot rows */
  if (snapFv) {snapFv.textContent = fvStr;}
  if (snapRate) {snapRate.textContent = rateStr;}
  if (snapTime) {snapTime.textContent = timeStr;}
  if (snapCompounding) {snapCompounding.textContent = compoundingStr;}
  if (snapPeriods) {snapPeriods.textContent = totalPeriodsStr;}
  if (snapPeriodicRate) {snapPeriodicRate.textContent = `${appliedRateStr}%`;}

  /* Explanation targets */
  if (valueTargets) {
    updateTargets(valueTargets.futureValue, fvStr);
    updateTargets(valueTargets.discountRate, rateStr);
    updateTargets(valueTargets.timePeriod, timeStr);
    updateTargets(valueTargets.compoundingFrequency, compoundingStr);
    updateTargets(valueTargets.presentValue, pvStr);
    updateTargets(valueTargets.effectivePeriods, totalPeriodsStr);
    updateTargets(valueTargets.appliedRate, appliedRateStr);
    updateTargets(valueTargets.formulaDenominator, denominatorStr);
    updateTargets(valueTargets.formulaDiscountLost, discountLostStr);
    updateTargets(valueTargets.appliedRateDecimal, appliedRateDecimalStr);
    updateTargets(valueTargets.effectivePeriodsPerYear, periodsPerYearStr);
  }
}

/* ── Event wiring ── */

[fvInput, rateInput, timeInput].forEach((input) => {
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
