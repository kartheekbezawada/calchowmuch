const CONFIDENCE_LABELS = new Map([
  ['1.645', '90%'],
  ['1.960', '95%'],
  ['2.576', '99%'],
]);

const PROPORTION_SENSITIVITY_MARGINS = [1, 2, 3, 4, 5, 7, 10];
const MEAN_SENSITIVITY_MARGINS = [0.5, 1, 1.5, 2, 3, 5, 10];

export const MODE_CONTENT = {
  proportion: {
    label: 'Proportion study',
    hero:
      'Plan a proportion or prevalence estimate with optional finite-population correction.',
    marginLabel: 'Margin of error (%)',
    marginHint: 'Percent precision around the estimated proportion.',
    variableLabel: 'Estimated proportion',
    idleAssumptions: [
      'Use proportion mode for surveys, prevalence studies, and other percentage-based outcomes.',
      'Choose 50% when prior evidence is limited and you want the largest conservative planning estimate.',
      'Add population size only when the full study population is known and relatively small.',
    ],
  },
  mean: {
    label: 'Mean study',
    hero:
      'Plan a mean estimate when the outcome is continuous and the population standard deviation is known.',
    marginLabel: 'Margin of error (units)',
    marginHint: 'Precision in the original measurement units.',
    variableLabel: 'Population standard deviation',
    idleAssumptions: [
      'Use mean mode for continuous outcomes such as scores, time, weight, concentration, or signal level.',
      'The mean formula assumes the population standard deviation is known or credibly justified.',
      'Add population size only when the available cohort is bounded and correction will materially change the plan.',
    ],
  },
};

export const RESEARCH_PRESETS = [
  {
    id: 'general-survey',
    mode: 'proportion',
    title: 'General survey baseline',
    stateLabel: 'Loaded preset: General survey baseline',
    values: {
      confidenceZ: '1.96',
      margin: '5',
      proportion: '50',
      sigma: '8',
      population: '',
    },
  },
  {
    id: 'prevalence-study',
    mode: 'proportion',
    title: 'Prevalence planning',
    stateLabel: 'Loaded preset: Prevalence planning',
    values: {
      confidenceZ: '1.96',
      margin: '3',
      proportion: '20',
      sigma: '8',
      population: '',
    },
  },
  {
    id: 'finite-survey',
    mode: 'proportion',
    title: 'Campus population survey',
    stateLabel: 'Loaded preset: Campus population survey',
    values: {
      confidenceZ: '1.96',
      margin: '5',
      proportion: '50',
      sigma: '8',
      population: '1200',
    },
  },
  {
    id: 'lab-mean',
    mode: 'mean',
    title: 'Laboratory mean estimate',
    stateLabel: 'Loaded preset: Laboratory mean estimate',
    values: {
      confidenceZ: '1.96',
      margin: '2',
      proportion: '50',
      sigma: '8',
      population: '',
    },
  },
];

function isProvided(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function normalizeConfidenceKey(value) {
  return Number(value).toFixed(3);
}

function pickFirstError(errors) {
  return Object.values(errors).find(Boolean) || '';
}

function formatEquationNumber(value, digits = 4) {
  return Number(value).toFixed(digits).replace(/\.?0+$/, '');
}

function formatFinalSummaryLabel(mode) {
  return mode === 'mean' ? 'observations' : 'responses';
}

export function getConfidenceLabel(value) {
  return CONFIDENCE_LABELS.get(normalizeConfidenceKey(value)) || 'Custom';
}

export function applyFinitePopulationCorrection(n0, populationSize) {
  if (!Number.isFinite(n0) || !Number.isFinite(populationSize) || populationSize < 1) {
    return Number.NaN;
  }

  return n0 / (1 + (n0 - 1) / populationSize);
}

export function validateSampleSizeInputs(input = {}) {
  const mode = input.mode === 'mean' ? 'mean' : 'proportion';
  const errors = {};

  const z = Number(input.z ?? input.confidenceZ);
  if (!Number.isFinite(z) || z <= 0) {
    errors.confidence = 'Select a valid confidence level.';
  }

  const marginValue = Number(input.margin);
  if (!Number.isFinite(marginValue) || marginValue <= 0) {
    errors.margin =
      mode === 'proportion'
        ? 'Margin of error must be greater than 0%.'
        : 'Margin of error must be greater than 0.';
  }

  let populationSize = null;
  let hasPopulation = false;
  const populationRaw = input.populationSize ?? input.population;
  if (isProvided(populationRaw)) {
    populationSize = Number(populationRaw);
    if (!Number.isFinite(populationSize) || populationSize < 1) {
      errors.population = 'Population size must be at least 1 if provided.';
    } else {
      hasPopulation = true;
    }
  }

  const normalized = {
    mode,
    z,
    confidenceLabel: getConfidenceLabel(z),
    marginValue,
    populationSize,
    hasPopulation,
  };

  if (mode === 'proportion') {
    const proportionPercent = Number(input.proportion);
    if (!Number.isFinite(proportionPercent) || proportionPercent < 0 || proportionPercent > 100) {
      errors.proportion = 'Estimated proportion must be between 0% and 100%.';
    } else {
      normalized.proportionPercent = proportionPercent;
      normalized.proportion = proportionPercent / 100;
      normalized.marginDecimal = marginValue / 100;
    }
  } else {
    const sigmaValue = Number(input.sigma);
    if (!Number.isFinite(sigmaValue) || sigmaValue <= 0) {
      errors.sigma = 'Population standard deviation must be greater than 0.';
    } else {
      normalized.sigmaValue = sigmaValue;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    message: pickFirstError(errors),
    normalized,
  };
}

export function calculateProportionSampleSize(input = {}) {
  const validation = validateSampleSizeInputs({ ...input, mode: 'proportion' });
  if (!validation.valid) {
    return {
      ok: false,
      mode: 'proportion',
      errors: validation.errors,
      message: validation.message,
    };
  }

  const {
    z,
    confidenceLabel,
    marginValue,
    marginDecimal,
    proportion,
    proportionPercent,
    populationSize,
    hasPopulation,
  } = validation.normalized;

  const varianceTerm = proportion * (1 - proportion);
  const n0 = (z * z * varianceTerm) / (marginDecimal * marginDecimal);
  const correctedN = hasPopulation ? applyFinitePopulationCorrection(n0, populationSize) : null;
  const finalWorkingN = hasPopulation ? correctedN : n0;
  const requiredSampleSize = Math.ceil(finalWorkingN);

  return {
    ok: true,
    mode: 'proportion',
    methodLabel: 'Proportion estimate',
    variableLabel: 'Estimated proportion',
    confidenceLabel,
    z,
    marginPercent: marginValue,
    marginValue,
    proportionPercent,
    populationSize,
    hasPopulation,
    n0,
    correctedN,
    finalWorkingN,
    requiredSampleSize,
    summary: `Plan for at least ${requiredSampleSize} ${formatFinalSummaryLabel(
      'proportion'
    )} at ${confidenceLabel} confidence with a +/- ${marginValue}% margin of error.`,
    interpretation: hasPopulation
      ? `With ${confidenceLabel} confidence, a +/- ${marginValue}% margin of error, an estimated proportion of ${proportionPercent}%, and a known population of ${populationSize}, the corrected sample target is ${requiredSampleSize}. The uncorrected base sample is ${formatEquationNumber(
          n0,
          2
        )}, and finite-population correction lowers the working estimate to ${formatEquationNumber(
          correctedN,
          2
        )} before rounding up.`
      : `With ${confidenceLabel} confidence, a +/- ${marginValue}% margin of error, and an estimated proportion of ${proportionPercent}%, you need at least ${requiredSampleSize} responses. The base formula gives n0 = ${formatEquationNumber(
          n0,
          2
        )}, which is rounded up to the next whole response.`,
    assumptions: [
      'Uses the standard normal-approximation formula for a single proportion.',
      'Assumes simple random sampling and independent observations.',
      proportionPercent === 50
        ? 'A 50% planning proportion is conservative because it maximizes the variance term.'
        : 'The estimated proportion should come from prior evidence, pilot data, or a defensible planning assumption.',
      hasPopulation
        ? 'Finite-population correction is applied because a total population size was provided.'
        : 'Population size was left blank, so the calculator uses the standard infinite-population formula.',
    ],
    steps: [
      {
        label: 'Identify the confidence z-score',
        text: `${confidenceLabel} confidence maps to z = ${formatEquationNumber(z, 3)}.`,
      },
      {
        label: 'Convert the planning inputs',
        text: `Margin ${marginValue}% becomes ${formatEquationNumber(
          marginDecimal,
          4
        )}, and estimated proportion ${proportionPercent}% becomes ${formatEquationNumber(
          proportion,
          4
        )}.`,
      },
      {
        label: 'Compute the variance term',
        text: `p x (1 - p) = ${formatEquationNumber(proportion, 4)} x ${formatEquationNumber(
          1 - proportion,
          4
        )} = ${formatEquationNumber(varianceTerm, 4)}.`,
      },
      {
        label: 'Calculate the base sample size n0',
        text: `n0 = z^2 x p x (1 - p) / E^2 = (${formatEquationNumber(
          z,
          3
        )}^2 x ${formatEquationNumber(varianceTerm, 4)}) / ${formatEquationNumber(
          marginDecimal,
          4
        )}^2 = ${formatEquationNumber(n0, 2)}.`,
      },
      hasPopulation
        ? {
            label: 'Apply finite-population correction',
            text: `n = n0 / (1 + (n0 - 1) / N) = ${formatEquationNumber(
              correctedN,
              2
            )} when N = ${formatEquationNumber(populationSize, 0)}.`,
          }
        : {
            label: 'Keep the infinite-population result',
            text: `No population correction is applied, so the working sample remains ${formatEquationNumber(
              n0,
              2
            )}.`,
          },
      {
        label: 'Round up to the final sample target',
        text: `Round ${formatEquationNumber(finalWorkingN, 2)} up to ${requiredSampleSize} so the planned sample is large enough for the requested precision.`,
      },
    ],
  };
}

export function calculateMeanSampleSize(input = {}) {
  const validation = validateSampleSizeInputs({ ...input, mode: 'mean' });
  if (!validation.valid) {
    return {
      ok: false,
      mode: 'mean',
      errors: validation.errors,
      message: validation.message,
    };
  }

  const {
    z,
    confidenceLabel,
    marginValue,
    sigmaValue,
    populationSize,
    hasPopulation,
  } = validation.normalized;

  const n0 = (z * z * sigmaValue * sigmaValue) / (marginValue * marginValue);
  const correctedN = hasPopulation ? applyFinitePopulationCorrection(n0, populationSize) : null;
  const finalWorkingN = hasPopulation ? correctedN : n0;
  const requiredSampleSize = Math.ceil(finalWorkingN);

  return {
    ok: true,
    mode: 'mean',
    methodLabel: 'Mean estimate',
    variableLabel: 'Population standard deviation',
    confidenceLabel,
    z,
    marginValue,
    sigmaValue,
    populationSize,
    hasPopulation,
    n0,
    correctedN,
    finalWorkingN,
    requiredSampleSize,
    summary: `Plan for at least ${requiredSampleSize} ${formatFinalSummaryLabel(
      'mean'
    )} at ${confidenceLabel} confidence with a margin of error of ${formatEquationNumber(
      marginValue,
      2
    )} units.`,
    interpretation: hasPopulation
      ? `With ${confidenceLabel} confidence, a margin of error of ${formatEquationNumber(
          marginValue,
          2
        )} units, a population standard deviation of ${formatEquationNumber(
          sigmaValue,
          2
        )}, and a finite cohort of ${populationSize}, the corrected sample target is ${requiredSampleSize}. The uncorrected base sample is ${formatEquationNumber(
          n0,
          2
        )}, and correction lowers the working estimate to ${formatEquationNumber(
          correctedN,
          2
        )} before rounding up.`
      : `With ${confidenceLabel} confidence, a margin of error of ${formatEquationNumber(
          marginValue,
          2
        )} units, and a population standard deviation of ${formatEquationNumber(
          sigmaValue,
          2
        )}, you need at least ${requiredSampleSize} observations. The base formula gives n0 = ${formatEquationNumber(
          n0,
          2
        )}, which is rounded up to the next whole observation.`,
    assumptions: [
      'Uses the z-based formula for planning the sample size of a single mean.',
      'Assumes the population standard deviation is known or credibly justified from prior evidence.',
      'Assumes simple random sampling and independent observations.',
      hasPopulation
        ? 'Finite-population correction is applied because a total cohort size was provided.'
        : 'Population size was left blank, so the calculator uses the standard infinite-population formula.',
    ],
    steps: [
      {
        label: 'Identify the confidence z-score',
        text: `${confidenceLabel} confidence maps to z = ${formatEquationNumber(z, 3)}.`,
      },
      {
        label: 'Substitute sigma and precision',
        text: `sigma = ${formatEquationNumber(
          sigmaValue,
          2
        )} and margin = ${formatEquationNumber(marginValue, 2)} units.`,
      },
      {
        label: 'Calculate the base sample size n0',
        text: `n0 = (z x sigma / E)^2 = (${formatEquationNumber(z, 3)} x ${formatEquationNumber(
          sigmaValue,
          2
        )} / ${formatEquationNumber(marginValue, 2)})^2 = ${formatEquationNumber(n0, 2)}.`,
      },
      hasPopulation
        ? {
            label: 'Apply finite-population correction',
            text: `n = n0 / (1 + (n0 - 1) / N) = ${formatEquationNumber(
              correctedN,
              2
            )} when N = ${formatEquationNumber(populationSize, 0)}.`,
          }
        : {
            label: 'Keep the infinite-population result',
            text: `No population correction is applied, so the working sample remains ${formatEquationNumber(
              n0,
              2
            )}.`,
          },
      {
        label: 'Round up to the final sample target',
        text: `Round ${formatEquationNumber(finalWorkingN, 2)} up to ${requiredSampleSize} so the planned sample is large enough for the requested precision.`,
      },
    ],
  };
}

export function generateSensitivityTable(result) {
  if (!result || !result.ok) return [];

  const margins =
    result.mode === 'proportion'
      ? PROPORTION_SENSITIVITY_MARGINS
      : MEAN_SENSITIVITY_MARGINS;

  const currentMargin =
    result.mode === 'proportion' ? result.marginPercent : result.marginValue;

  return margins.map((margin) => {
    let baseN;
    if (result.mode === 'proportion') {
      const E = margin / 100;
      const p = result.proportionPercent / 100;
      baseN = (result.z * result.z * p * (1 - p)) / (E * E);
    } else {
      baseN = (result.z * result.z * result.sigmaValue * result.sigmaValue) / (margin * margin);
    }

    const finalWorkingN = result.hasPopulation
      ? applyFinitePopulationCorrection(baseN, result.populationSize)
      : baseN;

    return {
      margin,
      marginLabel: result.mode === 'proportion' ? `${margin}%` : `${margin}`,
      baseN,
      finalN: finalWorkingN,
      baseRounded: Math.ceil(baseN),
      finalRounded: Math.ceil(finalWorkingN),
      isActive: margin === currentMargin,
    };
  });
}
