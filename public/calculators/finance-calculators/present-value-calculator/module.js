import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculatePresentValue, resolveCompounding } from '/assets/js/core/time-value-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const fvInput = document.querySelector('#pv-future-value');
const rateInput = document.querySelector('#pv-discount-rate');
const timeInput = document.querySelector('#pv-time-period');

const fvField = document.querySelector('#pv-future-value-field');
const rateField = document.querySelector('#pv-discount-rate-field');
const timeField = document.querySelector('#pv-time-period-field');

const calculateButton = document.querySelector('#pv-calc');
const previewPanel = document.querySelector('#pv-preview');
const staleNote = document.querySelector('#pv-stale-note');
const resultDiv = document.querySelector('#pv-result');

const fvDisplay = document.querySelector('#pv-fv-display');
const rateDisplay = document.querySelector('#pv-rate-display');
const timeDisplay = document.querySelector('#pv-time-display');

const snapFv = document.querySelector('[data-pv="snap-fv"]');
const snapRate = document.querySelector('[data-pv="snap-rate"]');
const snapTime = document.querySelector('[data-pv="snap-time"]');
const snapCompounding = document.querySelector('[data-pv="snap-compounding"]');
const snapPeriods = document.querySelector('[data-pv="snap-periods"]');

const metricDiscountLost = document.querySelector('[data-pv="metric-discount-lost"]');
const metricCompounding = document.querySelector('[data-pv="metric-compounding"]');
const metricPeriods = document.querySelector('[data-pv="metric-periods"]');
const metricPeriodicRate = document.querySelector('[data-pv="metric-periodic-rate"]');

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

const periodGroup = document.querySelector('[data-button-group="pv-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="pv-compounding"]');

const periodButtons = setupButtonGroup(periodGroup, {
  defaultValue: 'years',
  onChange: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'annual',
  onChange: () => {
    staleController.sync();
  },
});

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Present value is the amount a future cash sum is worth in today's money.",
      },
    },
    {
      '@type': 'Question',
      name: 'Why is present value lower than future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because money available today can be invested, saved, or otherwise put to work immediately.',
      },
    },
    {
      '@type': 'Question',
      name: 'What discount rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use a rate that reflects your real opportunity cost, required return, or planning assumption.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does a longer time period always reduce present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, assuming the discount rate is positive and the future amount stays constant.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does compounding change here?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It changes the per-period rate and the number of periods used in the discounting process.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use months instead of years?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Use months when the timing is short and you want the answer to reflect that precision.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the discount rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The present value equals the future value because no discounting is applied.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator for recurring payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Use an annuity calculator when you need to value a series of recurring cash flows.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why can spreadsheet results differ slightly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Display rounding can differ even when the underlying formula logic matches.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is present value most useful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is useful when comparing future payouts, settlements, bonuses, or deferred cash offers.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Present Value Calculator | Future Cash Flow Discounting',
  description:
    'Discount future cash flow into today\'s value using rate, time period, and compounding to compare offers, projects, or investments.',
  canonical: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Present Value Calculator | Future Cash Flow Discounting',
        url: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
        description:
          'Discount future cash flow into today\'s value using rate, time period, and compounding to compare offers, projects, or investments.',
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
          'Discount a future amount into today\'s value using rate, time period, and compounding frequency.',
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
});

function fmt(value, options = {}) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
}

function parseLooseNumber(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatFieldValue(value, fractionDigits = 0) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
    useGrouping: false,
  });
}

function setText(node, value) {
  if (node && node.textContent !== value) {
    node.textContent = value;
  }
}

function updateTargets(targets, value) {
  targets?.forEach((node) => setText(node, value));
}

function buildStateSignature() {
  return JSON.stringify({
    futureValue: fvInput?.value ?? '',
    discountRate: rateInput?.value ?? '',
    timePeriod: timeInput?.value ?? '',
    periodType: periodButtons?.getValue() ?? 'years',
    compounding: compoundingButtons?.getValue() ?? 'annual',
  });
}

const staleController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: buildStateSignature,
});

function updateSliderDisplays() {
  const periodType = periodButtons?.getValue() ?? 'years';

  updateRangeFill(fvInput);
  updateRangeFill(rateInput);
  updateRangeFill(timeInput);

  setText(fvDisplay, fmt(Number(fvInput?.value), { maximumFractionDigits: 0 }));
  setText(rateDisplay, formatPercent(Number(rateInput?.value)));
  setText(
    timeDisplay,
    `${fmt(Number(timeInput?.value), { maximumFractionDigits: 0 })} ${
      periodType === 'months' ? 'mo' : 'yrs'
    }`
  );
}

wireRangeWithField({
  rangeInput: fvInput,
  textInput: fvField,
  formatFieldValue: (value) => formatFieldValue(value, 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

wireRangeWithField({
  rangeInput: rateInput,
  textInput: rateField,
  formatFieldValue: (value) => formatFieldValue(value, 1),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

wireRangeWithField({
  rangeInput: timeInput,
  textInput: timeField,
  formatFieldValue: (value) => formatFieldValue(value, 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

staleController.watchElements([periodGroup, compoundingGroup], ['click']);

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  setText(metricDiscountLost, '0');
  setText(metricCompounding, 'Check inputs');
  setText(metricPeriods, '0');
  setText(metricPeriodicRate, '0%');
  staleController.markFresh();
}

function calculate({ reveal = false } = {}) {
  if (!resultDiv) {
    return;
  }

  const futureValue = Number(fvInput?.value);
  const discountRate = Number(rateInput?.value);
  const timePeriod = Number(timeInput?.value);
  const periodType = periodButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(futureValue) || futureValue < 0) {
    setError('Future value must be 0 or more.');
    return;
  }
  if (!Number.isFinite(discountRate) || discountRate < 0) {
    setError('Discount rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(timePeriod) || timePeriod < 0) {
    setError('Time period must be 0 or more.');
    return;
  }

  const result = calculatePresentValue({
    futureValue,
    discountRate,
    timePeriod,
    periodType,
    compounding,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const appliedRatePct = result.periodicRate * 100;
  const denominator = Math.pow(1 + result.periodicRate, result.totalPeriods);
  const discountLost = futureValue - result.presentValue;

  const fvStr = fmt(futureValue);
  const rateStr = formatPercent(discountRate);
  const timeStr = `${fmt(timePeriod, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const compoundingStr = compoundingInfo.label;
  const pvStr = fmt(result.presentValue);
  const discountLostStr = fmt(discountLost);
  const totalPeriodsStr = fmt(result.totalPeriods, { maximumFractionDigits: 2 });
  const appliedRateStr = fmt(appliedRatePct, { maximumFractionDigits: 4 });
  const denominatorStr = fmt(denominator, { maximumFractionDigits: 6 });
  const appliedRateDecimalStr = fmt(result.periodicRate, { maximumFractionDigits: 6 });

  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${pvStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {
    window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
  }

  setText(metricDiscountLost, discountLostStr);
  setText(metricCompounding, compoundingStr);
  setText(metricPeriods, totalPeriodsStr);
  setText(metricPeriodicRate, `${appliedRateStr}%`);

  setText(snapFv, fvStr);
  setText(snapRate, rateStr);
  setText(snapTime, timeStr);
  setText(snapCompounding, compoundingStr);
  setText(snapPeriods, totalPeriodsStr);

  updateTargets(valueTargets?.futureValue, fvStr);
  updateTargets(valueTargets?.discountRate, rateStr);
  updateTargets(valueTargets?.timePeriod, timeStr);
  updateTargets(valueTargets?.compoundingFrequency, compoundingStr);
  updateTargets(valueTargets?.presentValue, pvStr);
  updateTargets(valueTargets?.effectivePeriods, totalPeriodsStr);
  updateTargets(valueTargets?.appliedRate, appliedRateStr);
  updateTargets(valueTargets?.formulaDenominator, denominatorStr);
  updateTargets(valueTargets?.formulaDiscountLost, discountLostStr);
  updateTargets(valueTargets?.appliedRateDecimal, appliedRateDecimalStr);
  updateTargets(
    valueTargets?.effectivePeriodsPerYear,
    String(compoundingInfo.periodsPerYear)
  );

  staleController.markFresh();

  if (reveal) {
    revealResultPanel({
      resultPanel: previewPanel,
      focusTarget: resultDiv,
    });
  }
}

calculateButton?.addEventListener('click', () => {
  calculate({ reveal: true });
});

updateSliderDisplays();
calculate();

const pvScenarioRoot = document.querySelector('[data-pv-scenario="section"]');
const pvScenarioButton = document.querySelector('#pv-calc');

function pvScenarioText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function pvScenarioNumber(value, digits = 1) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function pvScenarioNumeric(selector) {
  return Number(document.querySelector(selector)?.value ?? NaN);
}

function pvScenarioActive(groupName, fallback) {
  const active = document.querySelector(`[data-button-group="${groupName}"] .is-active`) ??
    document.querySelector(`[data-button-group="${groupName}"] [aria-pressed="true"]`);
  return active?.dataset.value ?? fallback;
}

function pvScenarioBound(selector, bound, fallback) {
  const raw = Number(document.querySelector(selector)?.[bound]);
  return Number.isFinite(raw) ? raw : fallback;
}

function pvScenarioClamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pvScenarioShiftRate(value, direction, selector) {
  const step = Math.abs(pvScenarioBound(selector, 'step', 0.1)) || 0.1;
  const min = pvScenarioBound(selector, 'min', 0);
  const max = pvScenarioBound(selector, 'max', 100);
  const delta = Math.max(Math.abs(value) * 0.15, step, 0.5);
  return pvScenarioClamp(value + direction * delta, min, max);
}

function pvScenarioShiftTime(value, direction, selector) {
  const step = Math.abs(pvScenarioBound(selector, 'step', 1)) || 1;
  const min = pvScenarioBound(selector, 'min', 1);
  const max = pvScenarioBound(selector, 'max', Number.MAX_SAFE_INTEGER);
  const delta = Math.max(Math.abs(value) * 0.2, step, 1);
  return pvScenarioClamp(value + direction * delta, min, max);
}

function pvScenarioStepCompounding(value, direction) {
  const ladder = ['annual', 'semiannual', 'quarterly', 'monthly', 'daily'];
  const index = ladder.indexOf(value);
  if (index === -1) {
    return value;
  }
  return ladder[pvScenarioClamp(index + direction, 0, ladder.length - 1)];
}

function pvScenarioRelativeImpact(baseValue, nextValue, label) {
  if (!Number.isFinite(baseValue) || !Number.isFinite(nextValue)) {
    return `${label} needs a fresh calculation to compare properly.`;
  }
  if (Math.abs(baseValue) < 1e-9) {
    if (Math.abs(nextValue) < 1e-9) {
      return `${label} stays close to the current baseline.`;
    }
    return `${label} moves off the current baseline once these drivers change together.`;
  }
  const deltaRatio = (nextValue - baseValue) / Math.abs(baseValue);
  const pct = Math.abs(deltaRatio) * 100;
  if (pct < 0.35) {
    return `${label} stays close to the current baseline.`;
  }
  const approx = pvScenarioNumber(pct, pct >= 10 ? 0 : 1);
  return deltaRatio >= 0
    ? `${label} improves by about ${approx}% versus the current baseline.`
    : `${label} softens by about ${approx}% versus the current baseline.`;
}

function pvScenarioMaterial(baseValue, nextValue) {
  if (!Number.isFinite(baseValue) || !Number.isFinite(nextValue)) {
    return false;
  }
  if (Math.abs(baseValue) < 1e-9) {
    return Math.abs(nextValue) > 0;
  }
  return Math.abs((nextValue - baseValue) / Math.abs(baseValue)) >= 0.03;
}

function pvScenarioDrivers(listNode, drivers) {
  if (!listNode) {
    return;
  }
  listNode.innerHTML = (drivers ?? []).map((driver) => `<li>${driver}</li>`).join('');
}

function pvScenarioRenderCard(key, payload) {
  const card = pvScenarioRoot?.querySelector(`[data-pv-scenario-card="${key}"]`);
  if (!card || !payload) {
    return;
  }
  card.hidden = Boolean(payload.hidden);
  card.dataset.tone = payload.tone ?? key;
  pvScenarioText(card.querySelector('[data-pv-scenario-question]'), payload.question);
  pvScenarioText(card.querySelector('[data-pv-scenario-impact]'), payload.impact);
  pvScenarioText(card.querySelector('[data-pv-scenario-insight]'), payload.insight);
  pvScenarioText(card.querySelector('[data-pv-scenario-action]'), payload.action);
  pvScenarioDrivers(card.querySelector('[data-pv-scenario-drivers]'), payload.drivers ?? []);
}

function pvScenarioRenderQa(index, payload) {
  const qa = pvScenarioRoot?.querySelector(`[data-pv-scenario-qa="${index}"]`);
  if (!qa || !payload) {
    return;
  }
  pvScenarioText(qa.querySelector('[data-pv-scenario-qa-question]'), payload.question);
  pvScenarioText(qa.querySelector('[data-pv-scenario-qa-answer]'), payload.answer);
}

function pvScenarioUnavailable(message) {
  pvScenarioRenderCard('baseline', {
    tone: 'baseline',
    question: 'What does the current discount setup imply?',
    impact: message,
    insight: 'Adjust the current inputs and recalculate to compare scenarios.',
    action: 'Use the refreshed baseline as the benchmark for every other path.',
    drivers: ['Current inputs'],
  });
  pvScenarioRenderCard('optimized', {
    tone: 'optimized',
    question: 'What if discount drag eases and the wait is shorter?',
    impact: 'Improvement scenarios appear after a valid calculation.',
    insight: 'The upside path needs a valid baseline first.',
    action: 'Run the main calculator again after fixing the inputs.',
    drivers: ['Improved assumptions'],
  });
  pvScenarioRenderCard('stress', {
    tone: 'stress',
    question: 'What if rate pressure and delay both rise?',
    impact: 'Stress testing appears after a valid calculation.',
    insight: 'The downside path needs a valid baseline first.',
    action: 'Recalculate to unlock the stress comparison.',
    drivers: ['Tougher assumptions'],
  });
  const optionalCard = pvScenarioRoot?.querySelector('[data-pv-scenario-card="optional"]');
  if (optionalCard) {
    optionalCard.hidden = true;
  }
  pvScenarioRenderQa(0, {
    question: 'Which lever moves present value fastest here?',
    answer: 'The biggest drivers become visible after a valid calculation.',
  });
  pvScenarioRenderQa(1, {
    question: 'What is the main downside risk to watch?',
    answer: 'The stress path becomes visible after a valid calculation.',
  });
}

function renderPvScenarioAnalysis() {
  if (!pvScenarioRoot) {
    return;
  }

  const input = {
    futureValue: pvScenarioNumeric('#pv-future-value'),
    discountRate: pvScenarioNumeric('#pv-discount-rate'),
    timePeriod: pvScenarioNumeric('#pv-time-period'),
    periodType: pvScenarioActive('pv-period-type', 'years'),
    compounding: pvScenarioActive('pv-compounding', 'annual'),
  };

  const baselineResult = calculatePresentValue(input);
  if (!baselineResult) {
    pvScenarioUnavailable('Enter a valid future amount, discount rate, and time period to compare scenarios.');
    return;
  }

  const baselineMetric = baselineResult.presentValue;
  const optimizedInput = {
    ...input,
    discountRate: pvScenarioShiftRate(input.discountRate, -1, '#pv-discount-rate'),
    timePeriod: pvScenarioShiftTime(input.timePeriod, -1, '#pv-time-period'),
  };
  const stressInput = {
    ...input,
    discountRate: pvScenarioShiftRate(input.discountRate, 1, '#pv-discount-rate'),
    timePeriod: pvScenarioShiftTime(input.timePeriod, 1, '#pv-time-period'),
  };
  const optionalInput = {
    ...input,
    compounding: pvScenarioStepCompounding(input.compounding, 1),
    timePeriod: pvScenarioShiftTime(input.timePeriod, -1, '#pv-time-period'),
  };
  const optimizedResult = calculatePresentValue(optimizedInput);
  const stressResult = calculatePresentValue(stressInput);
  const optionalResult = calculatePresentValue(optionalInput);

  const optimized = {
    tone: 'optimized',
    question: 'What if discount drag eases and the wait is shorter?',
    impact: pvScenarioRelativeImpact(baselineMetric, optimizedResult?.presentValue, 'Present value'),
    insight:
      'A lower discount rate and a shorter holding period preserve more of the future amount in today’s money at the same time.',
    action:
      'If this is the target zone, focus on shortening the wait or easing the required return assumption.',
    drivers: ['Lower discount rate', 'Shorter wait', 'Same future amount'],
  };

  const stress = {
    tone: 'stress',
    question: 'What if rate pressure and delay both rise?',
    impact: pvScenarioRelativeImpact(baselineMetric, stressResult?.presentValue, 'Present value'),
    insight:
      'A tougher discount rate combined with a longer wait compounds the valuation haircut across more periods.',
    action: 'Use this case to set a downside floor before relying on the current estimate.',
    drivers: ['Higher discount rate', 'Longer wait', 'Same future amount'],
  };

  const optional = {
    tone: 'optional',
    show: pvScenarioMaterial(baselineMetric, optionalResult?.presentValue),
    question: 'What if valuation cadence changes too?',
    impact: pvScenarioRelativeImpact(baselineMetric, optionalResult?.presentValue, 'Present value'),
    insight:
      'Denser compounding changes how often discounting bites, so timing conventions can matter even when the cash amount does not.',
    action: 'Use this comparison when the payment or reporting cadence is not fixed.',
    drivers: ['Different compounding cadence', 'Adjusted wait', 'Same future amount'],
  };

  pvScenarioRenderCard('baseline', {
    tone: 'baseline',
    question: 'What does the current discount setup imply?',
    impact: 'This baseline keeps the current future amount, discount rate, and wait time as the reference case.',
    insight:
      input.timePeriod > 0
        ? 'The current answer is mostly being shaped by how long the cash stays discounted and how demanding the rate assumption is.'
        : 'With almost no waiting period, discounting has less room to erode today’s value.',
    action: 'Treat this as the benchmark before testing alternative valuation assumptions.',
    drivers: [
      'Current discount rate',
      input.periodType === 'months' ? 'Current month horizon' : 'Current year horizon',
      'Current compounding',
    ],
  });
  pvScenarioRenderCard('optimized', optimized);
  pvScenarioRenderCard('stress', stress);
  if (optional.show) {
    pvScenarioRenderCard('optional', { ...optional, hidden: false });
  } else {
    const optionalCard = pvScenarioRoot?.querySelector('[data-pv-scenario-card="optional"]');
    if (optionalCard) {
      optionalCard.hidden = true;
    }
  }

  pvScenarioRenderQa(0, {
    question: 'Which lever moves present value fastest here?',
    answer: `${optimized.impact} Shortening the wait and easing discount pressure usually move this answer faster than cosmetic frequency changes alone.`,
  });
  pvScenarioRenderQa(1, {
    question: 'What is the main downside risk to watch?',
    answer: `${stress.impact} A tougher rate assumption plus extra delay is the combination most likely to undermine the valuation.`,
  });
}

pvScenarioButton?.addEventListener('click', () => {
  renderPvScenarioAnalysis();
});

renderPvScenarioAnalysis();
