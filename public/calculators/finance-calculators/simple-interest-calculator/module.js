import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import {
  calculateCompoundInterest,
  calculateSimpleInterest,
} from '/assets/js/core/time-value-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const principalInput = document.querySelector('#si-principal');
const rateInput = document.querySelector('#si-rate');
const timeInput = document.querySelector('#si-time');

const principalField = document.querySelector('#si-principal-field');
const rateField = document.querySelector('#si-rate-field');
const timeField = document.querySelector('#si-time-field');

const calculateButton = document.querySelector('#si-calc');
const previewPanel = document.querySelector('#si-preview');
const staleNote = document.querySelector('#si-stale-note');
const resultDiv = document.querySelector('#si-result');

const principalDisplay = document.querySelector('#si-principal-display');
const rateDisplay = document.querySelector('#si-rate-display');
const timeDisplay = document.querySelector('#si-time-display');

const snapPrincipal = document.querySelector('[data-si="snap-principal"]');
const snapRate = document.querySelector('[data-si="snap-rate"]');
const snapTime = document.querySelector('[data-si="snap-time"]');
const snapBasis = document.querySelector('[data-si="snap-basis"]');
const snapYears = document.querySelector('[data-si="snap-years"]');
const snapInterest = document.querySelector('[data-si="snap-interest"]');

const metricEndingAmount = document.querySelector('[data-si="metric-ending-amount"]');
const metricBasis = document.querySelector('[data-si="metric-basis"]');
const metricYears = document.querySelector('[data-si="metric-years"]');
const metricTimeUnit = document.querySelector('[data-si="metric-time-unit"]');

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
      normalizedTime: explanationRoot.querySelectorAll('[data-si="normalized-time"]'),
      normalizedTimeLabel: explanationRoot.querySelectorAll('[data-si="normalized-time-label"]'),
    }
  : null;

const timeUnitGroup = document.querySelector('[data-button-group="si-time-unit"]');
const basisGroup = document.querySelector('[data-button-group="si-basis"]');

const timeUnitButtons = setupButtonGroup(timeUnitGroup, {
  defaultValue: 'years',
  onChange: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

const basisButtons = setupButtonGroup(basisGroup, {
  defaultValue: 'per-year',
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
      name: 'What is simple interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest is interest calculated only on the original principal amount. It does not compound on previously earned interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the simple interest formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I = P x r x t, where P is principal, r is the rate as a decimal, and t is time in years or months depending on the basis you choose.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between simple and compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest applies only to the principal and grows linearly. Compound interest earns interest on both principal and accumulated interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for loans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many short-term loans, auto loans, and personal loans use simple interest, and this calculator estimates the total interest owed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does simple interest grow linearly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. With a fixed rate, the interest earned each period stays constant, creating a straight-line pattern.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate interest for months?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Set the time unit to months. The calculator converts the time appropriately and applies the selected yearly or monthly basis.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Total interest is zero and the ending amount equals the principal because there is no growth or borrowing cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Interest Basis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Per Year treats the rate as annual. Per Month treats the rate as monthly, which can materially increase the result over longer schedules.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is simple interest used for savings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is less common for long-term savings because most savings accounts compound, but it is still useful for short-term estimates and comparisons.',
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

setPageMetadata({
  title: 'Simple Interest Calculator | Interest Earned & Final Balance',
  description:
    'Calculate simple interest, total interest earned, and ending balance from principal, rate, and time for loans or savings.',
  canonical: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Simple Interest Calculator | Interest Earned & Final Balance',
        url: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
        description:
          'Calculate simple interest, total interest earned, and ending balance from principal, rate, and time for loans or savings.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Simple Interest Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Interest and Growth Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
        description:
          'Calculate simple interest to compute total interest earned and ending balance using principal, rate, and time.',
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
    principal: principalInput?.value ?? '',
    rate: rateInput?.value ?? '',
    time: timeInput?.value ?? '',
    timeUnit: timeUnitButtons?.getValue() ?? 'years',
    interestBasis: basisButtons?.getValue() ?? 'per-year',
  });
}

const staleController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: buildStateSignature,
});

function updateSliderDisplays() {
  const timeUnit = timeUnitButtons?.getValue() ?? 'years';

  updateRangeFill(principalInput);
  updateRangeFill(rateInput);
  updateRangeFill(timeInput);

  setText(principalDisplay, fmt(Number(principalInput?.value), { maximumFractionDigits: 0 }));
  setText(rateDisplay, formatPercent(Number(rateInput?.value)));
  setText(
    timeDisplay,
    `${fmt(Number(timeInput?.value), { maximumFractionDigits: 0 })} ${
      timeUnit === 'months' ? 'mo' : 'yrs'
    }`
  );
}

wireRangeWithField({
  rangeInput: principalInput,
  textInput: principalField,
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

staleController.watchElements([timeUnitGroup, basisGroup], ['click']);

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  setText(metricEndingAmount, '0');
  setText(metricBasis, 'Check inputs');
  setText(metricYears, '0');
  setText(metricTimeUnit, '0');
  staleController.markFresh();
}

function calculate({ reveal = false } = {}) {
  if (!resultDiv) {
    return;
  }

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
  const normalizedTime = result.interestBasis === 'per-month' ? result.months : result.years;
  const normalizedTimeStr = fmt(normalizedTime, { maximumFractionDigits: 4 });
  const normalizedTimeLabel = result.interestBasis === 'per-month' ? 'months' : 'years';
  const rateDecimalStr = fmt(result.rate / 100, { maximumFractionDigits: 6 });
  const totalInterestStr = fmt(result.totalInterest);
  const endingAmountStr = fmt(result.endingAmount);

  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${totalInterestStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {
    window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
  }

  setText(metricEndingAmount, endingAmountStr);
  setText(metricBasis, basisStr);
  setText(metricYears, yearsStr);
  setText(metricTimeUnit, timeUnitStr);

  setText(snapPrincipal, principalStr);
  setText(snapRate, rateStr);
  setText(snapTime, `${timeStr} ${timeUnitStr.toLowerCase()}`);
  setText(snapBasis, basisStr);
  setText(snapYears, yearsStr);
  setText(snapInterest, totalInterestStr);

  updateTargets(valueTargets?.principal, principalStr);
  updateTargets(valueTargets?.rate, rateStr);
  updateTargets(valueTargets?.time, timeStr);
  updateTargets(valueTargets?.timeUnit, timeUnitStr.toLowerCase());
  updateTargets(valueTargets?.basis, basisStr);
  updateTargets(valueTargets?.totalInterest, totalInterestStr);
  updateTargets(valueTargets?.endingAmount, endingAmountStr);
  updateTargets(valueTargets?.years, yearsStr);
  updateTargets(valueTargets?.rateDecimal, rateDecimalStr);
  updateTargets(valueTargets?.normalizedTime, normalizedTimeStr);
  updateTargets(valueTargets?.normalizedTimeLabel, normalizedTimeLabel);

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

const siScenarioRoot = document.querySelector('[data-si-scenario="section"]');
const siScenarioButton = document.querySelector('#si-calc');

function siScenarioText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function siScenarioNumber(value, digits = 1) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function siScenarioNumeric(selector) {
  return Number(document.querySelector(selector)?.value ?? NaN);
}

function siScenarioActive(groupName, fallback) {
  const active = document.querySelector(`[data-button-group="${groupName}"] .is-active`) ??
    document.querySelector(`[data-button-group="${groupName}"] [aria-pressed="true"]`);
  return active?.dataset.value ?? fallback;
}

function siScenarioBound(selector, bound, fallback) {
  const raw = Number(document.querySelector(selector)?.[bound]);
  return Number.isFinite(raw) ? raw : fallback;
}

function siScenarioClamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function siScenarioShiftAmount(value, direction, selector, fallbackBase = value) {
  const step = Math.abs(siScenarioBound(selector, 'step', 1)) || 1;
  const min = siScenarioBound(selector, 'min', 0);
  const max = siScenarioBound(selector, 'max', Number.MAX_SAFE_INTEGER);
  const base = Math.abs(value) > 0 ? Math.abs(value) : Math.abs(fallbackBase);
  const delta = Math.max(base * 0.1, step);
  return siScenarioClamp(value + direction * delta, min, max);
}

function siScenarioShiftRate(value, direction, selector) {
  const step = Math.abs(siScenarioBound(selector, 'step', 0.1)) || 0.1;
  const min = siScenarioBound(selector, 'min', 0);
  const max = siScenarioBound(selector, 'max', 100);
  const delta = Math.max(Math.abs(value) * 0.15, step, 0.5);
  return siScenarioClamp(value + direction * delta, min, max);
}

function siScenarioShiftTime(value, direction, selector) {
  const step = Math.abs(siScenarioBound(selector, 'step', 1)) || 1;
  const min = siScenarioBound(selector, 'min', 1);
  const max = siScenarioBound(selector, 'max', Number.MAX_SAFE_INTEGER);
  const delta = Math.max(Math.abs(value) * 0.2, step, 1);
  return siScenarioClamp(value + direction * delta, min, max);
}

function siScenarioRelativeImpact(baseValue, nextValue, label, higherIsBetter = true) {
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
  const approx = siScenarioNumber(pct, pct >= 10 ? 0 : 1);
  const directionText = deltaRatio >= 0
    ? (higherIsBetter ? 'improves' : 'moves higher')
    : (higherIsBetter ? 'softens' : 'comes down');
  return `${label} ${directionText} by about ${approx}% versus the current baseline.`;
}

function siScenarioMaterial(baseValue, nextValue) {
  if (!Number.isFinite(baseValue) || !Number.isFinite(nextValue)) {
    return false;
  }
  if (Math.abs(baseValue) < 1e-9) {
    return Math.abs(nextValue) > 0;
  }
  return Math.abs((nextValue - baseValue) / Math.abs(baseValue)) >= 0.03;
}

function siScenarioDrivers(listNode, drivers) {
  if (!listNode) {
    return;
  }
  listNode.innerHTML = (drivers ?? []).map((driver) => `<li>${driver}</li>`).join('');
}

function siScenarioRenderCard(key, payload) {
  const card = siScenarioRoot?.querySelector(`[data-si-scenario-card="${key}"]`);
  if (!card || !payload) {
    return;
  }
  card.hidden = Boolean(payload.hidden);
  card.dataset.tone = payload.tone ?? key;
  siScenarioText(card.querySelector('[data-si-scenario-question]'), payload.question);
  siScenarioText(card.querySelector('[data-si-scenario-impact]'), payload.impact);
  siScenarioText(card.querySelector('[data-si-scenario-insight]'), payload.insight);
  siScenarioText(card.querySelector('[data-si-scenario-action]'), payload.action);
  siScenarioDrivers(card.querySelector('[data-si-scenario-drivers]'), payload.drivers ?? []);
}

function siScenarioRenderQa(index, payload) {
  const qa = siScenarioRoot?.querySelector(`[data-si-scenario-qa="${index}"]`);
  if (!qa || !payload) {
    return;
  }
  siScenarioText(qa.querySelector('[data-si-scenario-qa-question]'), payload.question);
  siScenarioText(qa.querySelector('[data-si-scenario-qa-answer]'), payload.answer);
}

function siScenarioUnavailable(message) {
  siScenarioRenderCard('baseline', {
    tone: 'baseline',
    question: 'What does the current simple-interest path suggest?',
    impact: message,
    insight: 'Adjust the current inputs and recalculate to compare scenarios.',
    action: 'Use the refreshed baseline as the benchmark for every other path.',
    drivers: ['Current inputs'],
  });
  siScenarioRenderCard('optimized', {
    tone: 'optimized',
    question: 'What if rate pressure and time both ease?',
    impact: 'Improvement scenarios appear after a valid calculation.',
    insight: 'The upside path needs a valid baseline first.',
    action: 'Run the main calculator again after fixing the inputs.',
    drivers: ['Improved assumptions'],
  });
  siScenarioRenderCard('stress', {
    tone: 'stress',
    question: 'What if the rate and schedule both work against you?',
    impact: 'Stress testing appears after a valid calculation.',
    insight: 'The downside path needs a valid baseline first.',
    action: 'Recalculate to unlock the stress comparison.',
    drivers: ['Tougher assumptions'],
  });
  const optionalCard = siScenarioRoot?.querySelector('[data-si-scenario-card="optional"]');
  if (optionalCard) {
    optionalCard.hidden = true;
  }
  siScenarioRenderQa(0, {
    question: 'What changes simple-interest cost the most here?',
    answer: 'The biggest drivers become visible after a valid calculation.',
  });
  siScenarioRenderQa(1, {
    question: 'What is the main downside risk?',
    answer: 'The stress path becomes visible after a valid calculation.',
  });
}

function renderSiScenarioAnalysis() {
  if (!siScenarioRoot) {
    return;
  }

  const input = {
    principal: siScenarioNumeric('#si-principal'),
    rate: siScenarioNumeric('#si-rate'),
    timePeriod: siScenarioNumeric('#si-time'),
    timeUnit: siScenarioActive('si-time-unit', 'years'),
    interestBasis: siScenarioActive('si-basis', 'per-year'),
  };

  const baselineResult = calculateSimpleInterest(input);
  if (!baselineResult) {
    siScenarioUnavailable('Enter a valid principal, rate, and time period to compare scenarios.');
    return;
  }

  const baselineMetric = baselineResult.totalInterest;
  const optimizedInput = {
    ...input,
    rate: siScenarioShiftRate(input.rate, -1, '#si-rate'),
    timePeriod: siScenarioShiftTime(input.timePeriod, -1, '#si-time'),
    interestBasis: 'per-year',
  };
  const stressInput = {
    ...input,
    rate: siScenarioShiftRate(input.rate, 1, '#si-rate'),
    timePeriod: siScenarioShiftTime(input.timePeriod, 1, '#si-time'),
    interestBasis: 'per-month',
  };

  const compoundAnnualRate = input.interestBasis === 'per-month' ? input.rate * 12 : input.rate;
  const compoundCompounding = input.interestBasis === 'per-month' ? 'monthly' : 'annual';
  const optimizedResult = calculateSimpleInterest(optimizedInput);
  const stressResult = calculateSimpleInterest(stressInput);
  const optionalResult = calculateCompoundInterest({
    principal: input.principal,
    annualRate: compoundAnnualRate,
    timePeriod: input.timePeriod,
    periodType: input.timeUnit,
    compounding: compoundCompounding,
    contribution: 0,
  });
  const optionalMetric = optionalResult ? optionalResult.endingBalance - input.principal : NaN;

  const optimized = {
    tone: 'optimized',
    question: 'What if rate pressure and time both ease?',
    impact: siScenarioRelativeImpact(
      baselineMetric,
      optimizedResult?.totalInterest,
      'Total interest cost',
      false
    ),
    insight:
      'Simple-interest cost falls quickly when the rate and the schedule both ease because the charge stays tied to the original principal.',
    action:
      'Use this when testing how much relief comes from cheaper terms and a shorter payoff window.',
    drivers: ['Lower rate', 'Shorter schedule', 'Per-year basis'],
  };

  const stress = {
    tone: 'stress',
    question: 'What if the rate and schedule both work against you?',
    impact: siScenarioRelativeImpact(
      baselineMetric,
      stressResult?.totalInterest,
      'Total interest cost',
      false
    ),
    insight:
      'A higher rate plus a longer schedule increases cost in a straight line, but the effect still adds up fast over time.',
    action: 'Use this to estimate how exposed the plan is to tougher loan terms.',
    drivers: ['Higher rate', 'Longer schedule', 'Per-month basis'],
  };

  const optional = {
    tone: 'optional',
    show: siScenarioMaterial(baselineMetric, optionalMetric),
    question: 'What if the balance were allowed to compound instead?',
    impact: siScenarioRelativeImpact(
      baselineMetric,
      optionalMetric,
      'Total interest cost',
      false
    ),
    insight:
      'Once interest starts earning interest, the cost path stops being linear and can separate materially from the simple-interest assumption.',
    action:
      'Use this comparison when you need to confirm whether the product is really simple-interest based.',
    drivers: ['Compounding logic', 'Same principal', 'Same stated rate'],
  };

  siScenarioRenderCard('baseline', {
    tone: 'baseline',
    question: 'What does the current simple-interest path suggest?',
    impact: 'This baseline keeps the current principal, rate, schedule, and basis assumptions together.',
    insight:
      'Because the cost is calculated on the original principal only, the main levers are the rate, the time, and the basis used to apply it.',
    action: 'Use this as the benchmark before testing cheaper or riskier terms.',
    drivers: [
      'Current principal',
      'Current rate',
      input.interestBasis === 'per-month' ? 'Per-month basis' : 'Per-year basis',
    ],
  });
  siScenarioRenderCard('optimized', optimized);
  siScenarioRenderCard('stress', stress);
  if (optional.show) {
    siScenarioRenderCard('optional', { ...optional, hidden: false });
  } else {
    const optionalCard = siScenarioRoot?.querySelector('[data-si-scenario-card="optional"]');
    if (optionalCard) {
      optionalCard.hidden = true;
    }
  }

  siScenarioRenderQa(0, {
    question: 'What changes simple-interest cost the most here?',
    answer: `${optimized.impact} In a simple-interest model, rate and time are the biggest cost levers because the formula scales directly with both.`,
  });
  siScenarioRenderQa(1, {
    question: 'What is the main downside risk?',
    answer: `${stress.impact} Even without compounding, a longer schedule can add more cost than many users expect when paired with a heavier rate basis.`,
  });
}

siScenarioButton?.addEventListener('click', () => {
  renderSiScenarioAnalysis();
});

renderSiScenarioAnalysis();
