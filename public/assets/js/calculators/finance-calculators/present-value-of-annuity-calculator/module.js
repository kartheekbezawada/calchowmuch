import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import {
  calculatePresentValueOfAnnuity,
  resolveCompounding,
} from '/assets/js/core/time-value-utils.js';

/* ── DOM refs: calculator inputs ── */
const pmtInput = document.querySelector('#pva-payment');
const rateInput = document.querySelector('#pva-discount-rate');
const periodsInput = document.querySelector('#pva-periods');
const calculateButton = document.querySelector('#pva-calc');
const resultDiv = document.querySelector('#pva-result');
const summaryDiv = document.querySelector('#pva-result-detail');

/* ── DOM refs: slider value displays ── */
const pmtDisplay = document.querySelector('#pva-pmt-display');
const rateDisplay = document.querySelector('#pva-rate-display');
const periodsDisplay = document.querySelector('#pva-periods-display');

/* ── DOM refs: snapshot rows ── */
const snapPayment = document.querySelector('[data-pva="snap-payment"]');
const snapRate = document.querySelector('[data-pva="snap-rate"]');
const snapPeriods = document.querySelector('[data-pva="snap-periods"]');
const snapAnnuityType = document.querySelector('[data-pva="snap-annuity-type"]');
const snapCompounding = document.querySelector('[data-pva="snap-compounding"]');
const snapEffectivePeriods = document.querySelector('[data-pva="snap-effective-periods"]');
const snapPeriodicRate = document.querySelector('[data-pva="snap-periodic-rate"]');

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector('#pva-explanation');
const valueTargets = explanationRoot
  ? {
      paymentAmount: explanationRoot.querySelectorAll('[data-pva="payment-amount"]'),
      discountRate: explanationRoot.querySelectorAll('[data-pva="discount-rate"]'),
      periodCount: explanationRoot.querySelectorAll('[data-pva="period-count"]'),
      annuityType: explanationRoot.querySelectorAll('[data-pva="annuity-type"]'),
      compoundingFrequency: explanationRoot.querySelectorAll('[data-pva="compounding-frequency"]'),
      presentValue: explanationRoot.querySelectorAll('[data-pva="present-value"]'),
      totalPayments: explanationRoot.querySelectorAll('[data-pva="total-payments"]'),
      effectivePeriods: explanationRoot.querySelectorAll('[data-pva="effective-periods"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-pva="applied-rate"]'),
      appliedRateDecimal: explanationRoot.querySelectorAll('[data-pva="applied-rate-decimal"]'),
      formulaAnnuityFactor: explanationRoot.querySelectorAll('[data-pva="formula-annuity-factor"]'),
      formulaDiscountSaved: explanationRoot.querySelectorAll('[data-pva="formula-discount-saved"]'),
      periodsPerYear: explanationRoot.querySelectorAll('[data-pva="periods-per-year"]'),
    }
  : null;

/* ── Button groups ── */
const periodGroup = document.querySelector('[data-button-group="pva-period-type"]');
const annuityGroup = document.querySelector('[data-button-group="pva-annuity-type"]');
const compoundingGroup = document.querySelector('[data-button-group="pva-compounding"]');

const periodButtons = setupButtonGroup(periodGroup, {
  defaultValue: 'years',
  onChange() {
    hydrateOnUserIntent();
    calculate();
  },
});

const annuityButtons = setupButtonGroup(annuityGroup, {
  defaultValue: 'ordinary',
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
      name: 'What is the present value of an annuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "It is today's value of a series of equal future payments, discounted using a specific interest or discount rate.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between ordinary annuity and annuity due?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ordinary annuities pay at the end of each period. Annuity due pays at the beginning, resulting in a higher present value.',
      },
    },
    {
      '@type': 'Question',
      name: 'What discount rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use a rate reflecting interest rates, investment returns, inflation, or borrowing costs relevant to the cash flow.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is PV of annuity useful for loans and mortgages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, PV of annuity calculations are commonly used to value loan repayments, mortgages, and lease payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the discount rate is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the rate is zero, the present value equals the total of all payments — no discounting is applied.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this useful for retirement planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it helps estimate the value of pensions, retirement income streams, and long-term annuity payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I switch between years and months?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, use the period toggle to model either annual or monthly cash-flow timelines.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does compounding frequency affect PVA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'More frequent compounding changes per-period rates and periods, which changes the annuity factor and PV.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does annuity due always have a higher PV?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Usually yes, because each payment is discounted for one less period compared with ordinary annuity.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator suitable for lease and pension valuation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is suitable for valuing fixed periodic payment streams under a chosen discount rate.',
      },
    },
  ],
};

const metadata = {
  title: 'Present Value of Annuity Calculator (Ordinary & Due) – CalcHowMuch',
  description:
    'Calculate the present value of an annuity. Compare ordinary annuity vs annuity due using payment amount, rate, and periods with our free calculator.',
  canonical: 'https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Present Value of Annuity Calculator (Ordinary & Due)',
        url: 'https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/',
        description:
          'Calculate the present value of an annuity. Compare ordinary annuity and annuity due using payment amount, discount rate, and number of periods.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Present Value of Annuity Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/',
        description:
          'Free present value of annuity calculator for ordinary annuity and annuity due. Calculates PV using payment amount, rate, and timing.',
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
            name: 'Present Value of Annuity',
            item: 'https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/',
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
  if (pmtInput && pmtDisplay) {
    setSliderFill(pmtInput);
    setTextIfChanged(
      pmtDisplay,
      fmt(Number(pmtInput.value), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );
  }
  if (rateInput && rateDisplay) {
    setSliderFill(rateInput);
    setTextIfChanged(rateDisplay, `${Number(rateInput.value)}%`);
  }
  if (periodsInput && periodsDisplay) {
    setSliderFill(periodsInput);
    const periodType = periodButtons?.getValue() ?? 'years';
    setTextIfChanged(
      periodsDisplay,
      `${Number(periodsInput.value)} ${periodType === 'months' ? 'mo' : 'yrs'}`
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

  const pmt = Number(pmtInput?.value);
  const rate = Number(rateInput?.value);
  const periods = Number(periodsInput?.value);
  const periodType = periodButtons?.getValue() ?? 'years';
  const annuityType = annuityButtons?.getValue() ?? 'ordinary';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(pmt) || pmt < 0) {
    setError('Payment must be 0 or more.');
    return;
  }
  if (!Number.isFinite(rate) || rate < 0) {
    setError('Discount rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(periods) || periods < 0) {
    setError('Periods must be 0 or more.');
    return;
  }

  const result = calculatePresentValueOfAnnuity({
    payment: pmt,
    discountRate: rate,
    periods,
    periodType,
    compounding,
    annuityType,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const appliedRatePct = result.periodicRate * 100;
  const effectivePeriodsStr = fmt(result.totalPeriods, { maximumFractionDigits: 2 });
  const pmtStr = fmt(pmt);
  const rateStr = formatPercent(rate);
  const periodsStr = `${fmt(periods, { maximumFractionDigits: 2 })} ${periodType === 'months' ? 'months' : 'years'}`;
  const annuityTypeStr = annuityType === 'due' ? 'Annuity Due' : 'Ordinary Annuity';
  const compoundingStr = compoundingInfo.label;
  const pvStr = fmt(result.presentValue);
  const appliedRateStr = fmt(appliedRatePct, { maximumFractionDigits: 4 });
  const totalPaymentsStr = fmt(result.totalPayments);

  /* Formula walkthrough values */
  const appliedRateDecimal = result.periodicRate;
  let annuityFactor = 0;
  if (appliedRateDecimal !== 0 && result.totalPeriods > 0) {
    annuityFactor =
      (1 - Math.pow(1 + appliedRateDecimal, -result.totalPeriods)) / appliedRateDecimal;
  } else if (result.totalPeriods > 0) {
    annuityFactor = result.totalPeriods;
  }
  if (annuityType === 'due') {
    annuityFactor *= 1 + appliedRateDecimal;
  }
  const discountSaved = result.totalPayments - result.presentValue;
  const periodsPerYear = result.periodsPerYear;

  const appliedRateDecimalStr = fmt(appliedRateDecimal, { maximumFractionDigits: 6 });
  const annuityFactorStr = fmt(annuityFactor, { maximumFractionDigits: 6 });
  const discountSavedStr = fmt(discountSaved);
  const periodsPerYearStr = String(periodsPerYear);

  /* Preview panel */
  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${pvStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {setTimeout(() => valueEl.classList.remove('is-updated'), 420);}

  summaryDiv.innerHTML =
    `<p><strong>Type:</strong> ${annuityTypeStr}</p>` +
    `<p><strong>Total payments:</strong> ${totalPaymentsStr}</p>` +
    `<p><strong>Discount saved:</strong> ${discountSavedStr}</p>`;

  /* Snapshot rows */
  if (snapPayment) {snapPayment.textContent = pmtStr;}
  if (snapRate) {snapRate.textContent = rateStr;}
  if (snapPeriods) {snapPeriods.textContent = periodsStr;}
  if (snapAnnuityType) {snapAnnuityType.textContent = annuityTypeStr;}
  if (snapCompounding) {snapCompounding.textContent = compoundingStr;}
  if (snapEffectivePeriods) {snapEffectivePeriods.textContent = effectivePeriodsStr;}
  if (snapPeriodicRate) {snapPeriodicRate.textContent = `${appliedRateStr}%`;}

  /* Explanation targets */
  if (valueTargets) {
    updateTargets(valueTargets.paymentAmount, pmtStr);
    updateTargets(valueTargets.discountRate, rateStr);
    updateTargets(valueTargets.periodCount, periodsStr);
    updateTargets(valueTargets.annuityType, annuityTypeStr);
    updateTargets(valueTargets.compoundingFrequency, compoundingStr);
    updateTargets(valueTargets.presentValue, pvStr);
    updateTargets(valueTargets.totalPayments, totalPaymentsStr);
    updateTargets(valueTargets.effectivePeriods, effectivePeriodsStr);
    updateTargets(valueTargets.appliedRate, appliedRateStr);
    updateTargets(valueTargets.appliedRateDecimal, appliedRateDecimalStr);
    updateTargets(valueTargets.formulaAnnuityFactor, annuityFactorStr);
    updateTargets(valueTargets.formulaDiscountSaved, discountSavedStr);
    updateTargets(valueTargets.periodsPerYear, periodsPerYearStr);
  }
}

/* ── Event wiring ── */

[pmtInput, rateInput, periodsInput].forEach((input) => {
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
