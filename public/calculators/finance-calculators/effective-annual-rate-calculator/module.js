import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateEffectiveAnnualRate } from '/assets/js/core/time-value-utils.js';

/* ── DOM refs: calculator inputs ── */
const nominalRateInput = document.querySelector('#ear-nominal-rate');
const calculateButton = document.querySelector('#ear-calc');
const resultDiv = document.querySelector('#ear-result');
const summaryDiv = document.querySelector('#ear-result-detail');

/* ── DOM refs: slider value display ── */
const rateDisplay = document.querySelector('#ear-rate-display');

/* ── DOM refs: snapshot rows ── */
const snapNominal = document.querySelector('[data-ear="snap-nominal"]');
const snapCompounding = document.querySelector('[data-ear="snap-compounding"]');
const snapPeriods = document.querySelector('[data-ear="snap-periods"]');
const snapPeriodicRate = document.querySelector('[data-ear="snap-periodic-rate"]');
const snapDifference = document.querySelector('[data-ear="snap-difference"]');

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector('#ear-explanation');
const valueTargets = explanationRoot
  ? {
      nominalRate: explanationRoot.querySelectorAll('[data-ear="nominal-rate"]'),
      frequency: explanationRoot.querySelectorAll('[data-ear="frequency"]'),
      periods: explanationRoot.querySelectorAll('[data-ear="periods"]'),
      earRate: explanationRoot.querySelectorAll('[data-ear="ear-rate"]'),
      periodicRate: explanationRoot.querySelectorAll('[data-ear="periodic-rate"]'),
      periodicRateDecimal: explanationRoot.querySelectorAll('[data-ear="periodic-rate-decimal"]'),
      nominalDecimal: explanationRoot.querySelectorAll('[data-ear="nominal-decimal"]'),
      onePlusRate: explanationRoot.querySelectorAll('[data-ear="one-plus-rate"]'),
      growthFactor: explanationRoot.querySelectorAll('[data-ear="growth-factor"]'),
      earDecimal: explanationRoot.querySelectorAll('[data-ear="ear-decimal"]'),
      difference: explanationRoot.querySelectorAll('[data-ear="difference"]'),
    }
  : null;

/* ── Button groups ── */
const frequencyGroup = document.querySelector('[data-button-group="ear-frequency"]');

const frequencyButtons = setupButtonGroup(frequencyGroup, {
  defaultValue: 'annual',
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
      name: 'What is the Effective Annual Rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EAR is the true annual interest rate after accounting for compounding. It shows the real cost of borrowing or real return on savings.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is EAR different from a nominal rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A nominal rate is the stated headline percentage. EAR includes the effect of compounding, making it higher or equal if compounded annually.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the EAR formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EAR = (1 + r/n)^n − 1, where r is the nominal rate as a decimal and n is the number of compounding periods per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does compounding frequency matter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'More frequent compounding means interest is reinvested sooner, producing a higher effective rate from the same nominal rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EAR the same as APR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. APR typically does not include compounding effects, while EAR always does.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I compare loans using EAR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Converting all loan rates to EAR lets you compare them on equal footing.',
      },
    },
    {
      '@type': 'Question',
      name: 'When does EAR equal the nominal rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When interest compounds only once per year (annually). With annual compounding there is no additional compounding effect.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does quarterly vs annual compounding compare?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quarterly compounding produces a slightly higher EAR than annual because interest is reinvested 4 times instead of once.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EAR useful for savings accounts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. EAR tells you the true annual return on savings, helping you pick the best account regardless of stated rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the nominal rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the nominal rate is 0%, the EAR is also 0% — no interest means no compounding effect.',
      },
    },
  ],
};

const metadata = {
  title: 'Effective Annual Rate (EAR) Calculator – CalcHowMuch',
  description:
    'Calculate the effective annual rate (EAR) from a nominal interest rate and compounding frequency. Compare true annual interest rates accurately.',
  canonical: 'https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Effective Annual Rate Calculator',
        url: 'https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/',
        description:
          'Convert a nominal interest rate into an effective annual rate using compounding frequency.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Effective Annual Rate Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Interest & Growth Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/',
        description:
          'Free EAR calculator. Convert nominal rates to effective annual rates for accurate comparisons.',
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
            name: 'Effective Annual Rate',
            item: 'https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/',
          },
        ],
      },
    ],
  },
};

if (!document.querySelector('script[data-static-ld="true"]')) {
  setPageMetadata(metadata);
}

/* ── Helpers ── */

function fmt(value, opts = {}) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...opts,
  });
}

function fmtPct(value, maxFraction = 4) {
  return formatPercent(value, { maximumFractionDigits: maxFraction });
}

function setSliderFill(input) {
  if (!input) return;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty('--fill', `${Math.min(100, Math.max(0, pct))}%`);
}

function updateSliderDisplays() {
  if (nominalRateInput && rateDisplay) {
    setSliderFill(nominalRateInput);
    rateDisplay.textContent = `${Number(nominalRateInput.value)}%`;
  }
}

function updateTargets(targets, value) {
  if (!targets) return;
  targets.forEach((node) => {
    node.textContent = value;
  });
}

function setError(message) {
  if (resultDiv) resultDiv.textContent = message;
  if (summaryDiv) summaryDiv.textContent = '';
}

/* ── Core calculate ── */

function calculate() {
  if (!resultDiv || !summaryDiv) return;
  try {
    const nominalRate = Number(nominalRateInput?.value);
    const compounding = frequencyButtons?.getValue() ?? 'annual';

    if (!Number.isFinite(nominalRate) || nominalRate < 0) {
      setError('Rate must be 0 or more.');
      return;
    }

    const result = calculateEffectiveAnnualRate({
      nominalRate,
      compounding,
    });

    if (!result) {
      setError('Check your inputs.');
      return;
    }

    /* Derived values */
    const earPct = result.effectiveAnnualRate * 100;
    const nominalDecimal = nominalRate / 100;
    const periodicRateDecimal = nominalDecimal / result.periodsPerYear;
    const periodicRatePct = periodicRateDecimal * 100;
    const onePlusRate = 1 + periodicRateDecimal;
    const growthFactor = Math.pow(onePlusRate, result.periodsPerYear);
    const differencePct = earPct - nominalRate;

    /* Formatted strings */
    const nominalStr = fmtPct(nominalRate, 2);
    const earStr = fmtPct(earPct, 4);
    const compoundingStr = result.compoundingLabel;
    const periodsStr = String(result.periodsPerYear);
    const periodicRateStr = fmtPct(periodicRatePct, 4);
    const periodicRateDecimalStr = fmt(periodicRateDecimal, { maximumFractionDigits: 6 });
    const nominalDecimalStr = fmt(nominalDecimal, { maximumFractionDigits: 4 });
    const onePlusRateStr = fmt(onePlusRate, { maximumFractionDigits: 6 });
    const growthFactorStr = fmt(growthFactor, { maximumFractionDigits: 6 });
    const earDecimalStr = fmt(result.effectiveAnnualRate, { maximumFractionDigits: 6 });
    const differenceStr = fmtPct(differencePct, 4);

    /* Preview panel */
    resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${earStr}</span>`;
    const valueEl = resultDiv.querySelector('.mtg-result-value');
    if (valueEl) setTimeout(() => valueEl.classList.remove('is-updated'), 420);

    summaryDiv.innerHTML =
      `<p><strong>Nominal rate:</strong> ${nominalStr}</p>` +
      `<p><strong>Compounding:</strong> ${compoundingStr}</p>` +
      `<p><strong>Difference:</strong> +${differenceStr}</p>`;

    /* Snapshot rows */
    if (snapNominal) snapNominal.textContent = nominalStr;
    if (snapCompounding) snapCompounding.textContent = compoundingStr;
    if (snapPeriods) snapPeriods.textContent = periodsStr;
    if (snapPeriodicRate) snapPeriodicRate.textContent = periodicRateStr;
    if (snapDifference) snapDifference.textContent = `+${differenceStr}`;

    /* Explanation targets */
    if (valueTargets) {
      updateTargets(valueTargets.nominalRate, nominalStr);
      updateTargets(valueTargets.frequency, compoundingStr);
      updateTargets(valueTargets.periods, periodsStr);
      updateTargets(valueTargets.earRate, earStr);
      updateTargets(valueTargets.periodicRate, periodicRateStr);
      updateTargets(valueTargets.periodicRateDecimal, periodicRateDecimalStr);
      updateTargets(valueTargets.nominalDecimal, nominalDecimalStr);
      updateTargets(valueTargets.onePlusRate, onePlusRateStr);
      updateTargets(valueTargets.growthFactor, growthFactorStr);
      updateTargets(valueTargets.earDecimal, earDecimalStr);
      updateTargets(valueTargets.difference, differenceStr);
    }
  } catch (err) {
    console.error('[EAR Calculator] calculate():', err);
  }
}

/* ── Event wiring ── */

nominalRateInput?.addEventListener('input', () => {
  updateSliderDisplays();
});

calculateButton?.addEventListener('click', calculate);

/* ── Init ── */
updateSliderDisplays();
