import { setPageMetadata } from '../../../assets/js/core/ui.js';

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

export const FAQ_ITEMS = [
  {
    q: 'What is a fraction?',
    a: 'A fraction shows part of a whole using a numerator on top and a denominator on the bottom.',
  },
  {
    q: 'Why do denominators need to match when adding fractions?',
    a: 'Because you can only combine parts that are measured in the same size pieces.',
  },
  {
    q: 'Do you need a common denominator when multiplying fractions?',
    a: 'No. You multiply the numerators together and the denominators together.',
  },
  {
    q: 'What does reciprocal mean in fraction division?',
    a: 'It means flipping a fraction so the numerator and denominator swap places.',
  },
  {
    q: 'What is the simplest form of a fraction?',
    a: 'It is the version where the numerator and denominator share no factor greater than 1.',
  },
  {
    q: 'What is an improper fraction?',
    a: 'It is a fraction where the numerator is equal to or larger than the denominator.',
  },
  {
    q: 'What is a mixed number?',
    a: 'It is a number made from a whole number and a proper fraction together.',
  },
  {
    q: 'Can fractions be negative?',
    a: 'Yes. A negative fraction means the value is below zero.',
  },
  {
    q: 'Why can a denominator not be zero?',
    a: 'Because a whole cannot be divided into zero equal parts in a valid fraction.',
  },
  {
    q: 'Should I simplify every final answer?',
    a: 'Yes, unless your teacher asks for a different form, simplest form is usually the expected final answer.',
  },
];

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const metadata = {
  title: 'Fraction Calculator - Add, Subtract, Multiply, Divide & Simplify | CalcHowMuch',
  description:
    'Use this free fraction calculator to add, subtract, multiply, divide, simplify, and convert fractions with clear worked steps for students.',
  canonical: 'https://calchowmuch.com/math/fraction-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Fraction Calculator',
        url: 'https://calchowmuch.com/math/fraction-calculator/',
        description:
          'Use this free fraction calculator to add, subtract, multiply, divide, simplify, and convert fractions with clear worked steps for students.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Fraction Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/math/fraction-calculator/',
        description:
          'Student-first fraction calculator with worked steps for adding, subtracting, multiplying, dividing, simplifying, and converting fractions.',
        browserRequirements: 'Requires JavaScript enabled',
        softwareVersion: '2.0',
        creator: {
          '@type': 'Organization',
          name: 'CalcHowMuch',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
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
            name: 'Math',
            item: 'https://calchowmuch.com/math/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Fraction Calculator',
            item: 'https://calchowmuch.com/math/fraction-calculator/',
          },
        ],
      },
    ],
  },
};

const MODE_COPY = {
  add: {
    label: 'Add fractions',
    operationName: 'Addition',
    chip: 'Add',
    summary: 'Find the least common denominator, rename both fractions, then combine the numerators.',
    pattern: 'Make denominators match',
    warning: 'Do not add denominators together',
    rule: 'Match denominators first',
    lessonTitle: 'Adding fractions with a common denominator plan',
    lessonCopy:
      'Match the denominators first, then work with the numerators. The denominator stays fixed once both fractions describe the same size parts.',
  },
  subtract: {
    label: 'Subtract fractions',
    operationName: 'Subtraction',
    chip: 'Subtract',
    summary: 'Rename both fractions with the same denominator, then subtract only the numerators.',
    pattern: 'Keep the denominator size the same',
    warning: 'Only subtract the numerators after renaming',
    rule: 'Match, then subtract',
    lessonTitle: 'Subtracting fractions without changing the size of the parts',
    lessonCopy:
      'Subtraction uses the same denominator idea as addition. Only the numerators change after the fractions have been rewritten in matching parts.',
  },
  multiply: {
    label: 'Multiply fractions',
    operationName: 'Multiplication',
    chip: 'Multiply',
    summary: 'Multiply straight across and then simplify the answer if possible.',
    pattern: 'Top x top, bottom x bottom',
    warning: 'No common denominator is needed',
    rule: 'Multiply straight across',
    lessonTitle: 'Multiplying fractions by using the top and bottom rows',
    lessonCopy:
      'You do not need a common denominator here. Multiply top by top and bottom by bottom, then look for a simpler form.',
  },
  divide: {
    label: 'Divide fractions',
    operationName: 'Division',
    chip: 'Divide',
    summary: 'Flip the second fraction to its reciprocal and then multiply.',
    pattern: 'Keep, flip, multiply',
    warning: 'Flip only the second fraction',
    rule: 'Use the reciprocal first',
    lessonTitle: 'Dividing fractions by flipping the second fraction',
    lessonCopy:
      'Keep the first fraction, flip the second one, and multiply. That reciprocal step is the key idea students need to remember.',
  },
  simplify: {
    label: 'Simplify a fraction',
    operationName: 'Simplifying',
    chip: 'Simplify',
    summary: 'Find the greatest common divisor and divide both numbers by it.',
    pattern: 'Use the greatest common divisor',
    warning: 'Divide top and bottom by the same number',
    rule: 'Reduce both parts together',
    lessonTitle: 'Simplifying fractions without changing their value',
    lessonCopy:
      'A simplified fraction means the same thing as the original one. It just uses the smallest whole-number parts possible.',
  },
  convert: {
    label: 'Convert fraction forms',
    operationName: 'Conversion',
    chip: 'Convert',
    summary: 'Move between improper fractions and mixed numbers using division and multiplication.',
    pattern: 'Quotient and remainder, or whole x denominator + numerator',
    warning: 'Keep the original denominator in the fractional part',
    rule: 'Switch forms without changing value',
    lessonTitle: 'Converting between improper fractions and mixed numbers',
    lessonCopy:
      'Use quotient and remainder for improper to mixed, and use whole times denominator plus numerator for mixed to improper.',
  },
};

function safeAbs(value) {
  return Math.abs(Number(value) || 0);
}

export function gcd(a, b) {
  let x = safeAbs(a);
  let y = safeAbs(b);

  if (x === 0 && y === 0) {
    return 1;
  }

  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }

  return x || 1;
}

export function lcm(a, b) {
  const x = safeAbs(a);
  const y = safeAbs(b);
  if (x === 0 || y === 0) {
    return 0;
  }
  return (x / gcd(x, y)) * y;
}

function normalizeFraction(numerator, denominator) {
  if (denominator === 0) {
    return null;
  }
  let n = Number(numerator);
  let d = Number(denominator);
  if (d < 0) {
    n *= -1;
    d *= -1;
  }
  return { numerator: n, denominator: d };
}

export function simplifyFraction(numerator, denominator) {
  const normalized = normalizeFraction(numerator, denominator);
  if (!normalized) {
    return null;
  }

  if (normalized.numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const divisor = gcd(normalized.numerator, normalized.denominator);
  return {
    numerator: normalized.numerator / divisor,
    denominator: normalized.denominator / divisor,
  };
}

export function addFractions(num1, den1, num2, den2) {
  const left = normalizeFraction(num1, den1);
  const right = normalizeFraction(num2, den2);
  if (!left || !right) {
    return null;
  }
  const commonDenominator = lcm(left.denominator, right.denominator);
  const equivalentLeft = left.numerator * (commonDenominator / left.denominator);
  const equivalentRight = right.numerator * (commonDenominator / right.denominator);
  return simplifyFraction(equivalentLeft + equivalentRight, commonDenominator);
}

export function subtractFractions(num1, den1, num2, den2) {
  const left = normalizeFraction(num1, den1);
  const right = normalizeFraction(num2, den2);
  if (!left || !right) {
    return null;
  }
  const commonDenominator = lcm(left.denominator, right.denominator);
  const equivalentLeft = left.numerator * (commonDenominator / left.denominator);
  const equivalentRight = right.numerator * (commonDenominator / right.denominator);
  return simplifyFraction(equivalentLeft - equivalentRight, commonDenominator);
}

export function multiplyFractions(num1, den1, num2, den2) {
  const left = normalizeFraction(num1, den1);
  const right = normalizeFraction(num2, den2);
  if (!left || !right) {
    return null;
  }
  return simplifyFraction(left.numerator * right.numerator, left.denominator * right.denominator);
}

export function divideFractions(num1, den1, num2, den2) {
  const left = normalizeFraction(num1, den1);
  const right = normalizeFraction(num2, den2);
  if (!left || !right || right.numerator === 0) {
    return null;
  }
  return simplifyFraction(left.numerator * right.denominator, left.denominator * right.numerator);
}

export function improperToMixed(numerator, denominator) {
  const normalized = normalizeFraction(numerator, denominator);
  if (!normalized) {
    return null;
  }

  const sign = normalized.numerator < 0 ? -1 : 1;
  const absNumerator = Math.abs(normalized.numerator);
  const whole = Math.floor(absNumerator / normalized.denominator);
  const remainder = absNumerator % normalized.denominator;

  return {
    whole: whole * sign,
    numerator: remainder,
    denominator: normalized.denominator,
  };
}

export function mixedToImproper(whole, numerator, denominator) {
  const normalizedDenominator = normalizeFraction(1, denominator);
  if (!normalizedDenominator) {
    return null;
  }

  const wholeNumber = Number(whole);
  const partNumerator = Number(numerator);
  const partDenominator = normalizedDenominator.denominator;
  const sign = wholeNumber < 0 ? -1 : 1;
  const improperNumerator = safeAbs(wholeNumber) * partDenominator + safeAbs(partNumerator);

  return simplifyFraction(sign * improperNumerator, partDenominator);
}

function isInteger(value) {
  return Number.isInteger(value);
}

function parseIntegerInput(input) {
  const value = Number.parseFloat(input?.value ?? '');
  if (!Number.isFinite(value) || !isInteger(value)) {
    return null;
  }
  return value;
}

function fractionToText(fraction) {
  if (!fraction) {
    return '';
  }
  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }
  return `${fraction.numerator}/${fraction.denominator}`;
}

function mixedToText(mixed) {
  if (!mixed) {
    return 'Not available';
  }
  if (mixed.numerator === 0) {
    return String(mixed.whole);
  }
  if (mixed.whole === 0) {
    return `${mixed.numerator}/${mixed.denominator}`;
  }
  return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`;
}

function fractionToHtml(fraction) {
  if (!fraction) {
    return '';
  }
  if (fraction.denominator === 1) {
    return `<span>${fraction.numerator}</span>`;
  }
  return `<span class="fc-inline-fraction"><span>${fraction.numerator}</span><span>${fraction.denominator}</span></span>`;
}

function mixedToHtml(mixed) {
  if (!mixed) {
    return '<span>Not available</span>';
  }
  if (mixed.numerator === 0) {
    return `<span>${mixed.whole}</span>`;
  }
  if (mixed.whole === 0) {
    return fractionToHtml({ numerator: mixed.numerator, denominator: mixed.denominator });
  }
  return `<span class="fc-mixed-inline"><span>${mixed.whole}</span>${fractionToHtml({ numerator: mixed.numerator, denominator: mixed.denominator })}</span>`;
}

function expressionHtml(parts) {
  return `<span class="fc-expression">${parts.join(' ')}</span>`;
}

function buildErrorState(message) {
  return {
    primaryHtml: `<span>${message}</span>`,
    primaryText: message,
    secondaryText: '',
    tiles: [
      { label: 'Simplest form', value: 'Check the input' },
      { label: 'Mixed number', value: 'Not available' },
      { label: 'Quick check', value: 'Use whole numbers only' },
    ],
    steps: ['Correct the input values and try again.'],
    teacherNote: message,
  };
}

function commonFractionValidation(values) {
  const entries = Object.entries(values);
  for (const [key, value] of entries) {
    if (!Number.isInteger(value)) {
      return 'Use whole numbers for every numerator and denominator.';
    }
    if (key.toLowerCase().includes('den') && value === 0) {
      return 'A denominator cannot be zero.';
    }
  }
  return null;
}

function buildResultTilesForFraction(resultFraction) {
  const mixed = improperToMixed(resultFraction.numerator, resultFraction.denominator);
  return {
    mixed,
    tiles: [
      { label: 'Simplest form', value: fractionToText(resultFraction) },
      {
        label: 'Mixed number',
        value:
          Math.abs(resultFraction.numerator) >= resultFraction.denominator
            ? mixedToText(mixed)
            : 'Not needed',
      },
      {
        label: 'Quick check',
        value: resultFraction.denominator === 1 ? 'Whole number answer' : 'Answer is already reduced',
      },
    ],
  };
}

function buildAddState(values) {
  const validationMessage = commonFractionValidation(values);
  if (validationMessage) {
    return buildErrorState(validationMessage);
  }

  const left = normalizeFraction(values.num1, values.den1);
  const right = normalizeFraction(values.num2, values.den2);
  const commonDenominator = lcm(left.denominator, right.denominator);
  const equivalentLeft = left.numerator * (commonDenominator / left.denominator);
  const equivalentRight = right.numerator * (commonDenominator / right.denominator);
  const unsimplified = { numerator: equivalentLeft + equivalentRight, denominator: commonDenominator };
  const result = simplifyFraction(unsimplified.numerator, unsimplified.denominator);
  const tileData = buildResultTilesForFraction(result);

  return {
    primaryHtml: expressionHtml([
      fractionToHtml(left),
      '<span>+</span>',
      fractionToHtml(right),
      '<span>=</span>',
      fractionToHtml(result),
    ]),
    primaryText: `${fractionToText(left)} + ${fractionToText(right)} = ${fractionToText(result)}`,
    secondaryText: `Both fractions were renamed in ${commonDenominator}ths before the numerators were added.`,
    tiles: tileData.tiles,
    steps: [
      `Find the least common denominator: lcm(${left.denominator}, ${right.denominator}) = ${commonDenominator}.`,
      `Rename the first fraction: ${fractionToText(left)} = ${equivalentLeft}/${commonDenominator}.`,
      `Rename the second fraction: ${fractionToText(right)} = ${equivalentRight}/${commonDenominator}.`,
      `Add the numerators: ${equivalentLeft} + ${equivalentRight} = ${unsimplified.numerator}, so the fraction becomes ${fractionToText(unsimplified)}.`,
      `Simplify the final answer: ${fractionToText(unsimplified)} = ${fractionToText(result)}.`,
    ],
    teacherNote:
      'When denominators match, the size of each part stays the same. That is why only the numerators are added.',
  };
}

function buildSubtractState(values) {
  const validationMessage = commonFractionValidation(values);
  if (validationMessage) {
    return buildErrorState(validationMessage);
  }

  const left = normalizeFraction(values.num1, values.den1);
  const right = normalizeFraction(values.num2, values.den2);
  const commonDenominator = lcm(left.denominator, right.denominator);
  const equivalentLeft = left.numerator * (commonDenominator / left.denominator);
  const equivalentRight = right.numerator * (commonDenominator / right.denominator);
  const unsimplified = { numerator: equivalentLeft - equivalentRight, denominator: commonDenominator };
  const result = simplifyFraction(unsimplified.numerator, unsimplified.denominator);
  const tileData = buildResultTilesForFraction(result);

  return {
    primaryHtml: expressionHtml([
      fractionToHtml(left),
      '<span>-</span>',
      fractionToHtml(right),
      '<span>=</span>',
      fractionToHtml(result),
    ]),
    primaryText: `${fractionToText(left)} - ${fractionToText(right)} = ${fractionToText(result)}`,
    secondaryText: `The denominators were matched at ${commonDenominator}, then the numerators were subtracted.`,
    tiles: tileData.tiles,
    steps: [
      `Find the least common denominator: lcm(${left.denominator}, ${right.denominator}) = ${commonDenominator}.`,
      `Rename the first fraction: ${fractionToText(left)} = ${equivalentLeft}/${commonDenominator}.`,
      `Rename the second fraction: ${fractionToText(right)} = ${equivalentRight}/${commonDenominator}.`,
      `Subtract the numerators: ${equivalentLeft} - ${equivalentRight} = ${unsimplified.numerator}, so the fraction becomes ${fractionToText(unsimplified)}.`,
      `Simplify the result if needed: ${fractionToText(unsimplified)} = ${fractionToText(result)}.`,
    ],
    teacherNote:
      'The denominator tells you the size of the parts. Keep that size fixed and only subtract how many parts are left.',
  };
}

function buildMultiplyState(values) {
  const validationMessage = commonFractionValidation(values);
  if (validationMessage) {
    return buildErrorState(validationMessage);
  }

  const left = normalizeFraction(values.num1, values.den1);
  const right = normalizeFraction(values.num2, values.den2);
  const unsimplified = {
    numerator: left.numerator * right.numerator,
    denominator: left.denominator * right.denominator,
  };
  const result = simplifyFraction(unsimplified.numerator, unsimplified.denominator);
  const cancelOne = gcd(left.numerator, right.denominator);
  const cancelTwo = gcd(right.numerator, left.denominator);
  const tileData = buildResultTilesForFraction(result);

  return {
    primaryHtml: expressionHtml([
      fractionToHtml(left),
      '<span>x</span>',
      fractionToHtml(right),
      '<span>=</span>',
      fractionToHtml(result),
    ]),
    primaryText: `${fractionToText(left)} x ${fractionToText(right)} = ${fractionToText(result)}`,
    secondaryText: 'Multiply the top numbers together and the bottom numbers together, then simplify.',
    tiles: tileData.tiles,
    steps: [
      `Multiply the numerators: ${left.numerator} x ${right.numerator} = ${unsimplified.numerator}.`,
      `Multiply the denominators: ${left.denominator} x ${right.denominator} = ${unsimplified.denominator}.`,
      cancelOne > 1 || cancelTwo > 1
        ? `A common factor appears across the diagonal, so you could simplify before multiplying to keep the numbers smaller.`
        : 'There is no useful diagonal cancellation in this example, so multiplying straight across is fine.',
      `Write the unsimplified answer: ${fractionToText(unsimplified)}.`,
      `Simplify the final result: ${fractionToText(unsimplified)} = ${fractionToText(result)}.`,
    ],
    teacherNote:
      'Multiplication does not need a common denominator. The shortcut to remember is top with top, bottom with bottom.',
  };
}

function buildDivideState(values) {
  const validationMessage = commonFractionValidation(values);
  if (validationMessage) {
    return buildErrorState(validationMessage);
  }

  const left = normalizeFraction(values.num1, values.den1);
  const right = normalizeFraction(values.num2, values.den2);
  if (right.numerator === 0) {
    return buildErrorState('You cannot divide by a fraction that has a value of zero.');
  }

  const reciprocal = { numerator: right.denominator, denominator: right.numerator };
  const unsimplified = {
    numerator: left.numerator * reciprocal.numerator,
    denominator: left.denominator * reciprocal.denominator,
  };
  const result = simplifyFraction(unsimplified.numerator, unsimplified.denominator);
  const tileData = buildResultTilesForFraction(result);

  return {
    primaryHtml: expressionHtml([
      fractionToHtml(left),
      '<span>/</span>',
      fractionToHtml(right),
      '<span>=</span>',
      fractionToHtml(result),
    ]),
    primaryText: `${fractionToText(left)} / ${fractionToText(right)} = ${fractionToText(result)}`,
    secondaryText: `Division became multiplication by the reciprocal ${fractionToText(reciprocal)}.`,
    tiles: tileData.tiles,
    steps: [
      `Keep the first fraction as ${fractionToText(left)}.`,
      `Flip the second fraction to its reciprocal: ${fractionToText(right)} becomes ${fractionToText(reciprocal)}.`,
      `Multiply instead: ${fractionToText(left)} x ${fractionToText(reciprocal)} = ${fractionToText(unsimplified)}.`,
      `Simplify the answer: ${fractionToText(unsimplified)} = ${fractionToText(result)}.`,
    ],
    teacherNote:
      'The key move in fraction division is flipping only the second fraction. After that, it is a multiplication problem.',
  };
}

function buildSimplifyState(values) {
  const validationMessage = commonFractionValidation(values);
  if (validationMessage) {
    return buildErrorState(validationMessage);
  }

  const original = normalizeFraction(values.num, values.den);
  const result = simplifyFraction(original.numerator, original.denominator);
  const divisor = gcd(original.numerator, original.denominator);
  const mixed = improperToMixed(result.numerator, result.denominator);

  return {
    primaryHtml: expressionHtml([
      fractionToHtml(original),
      '<span>=</span>',
      fractionToHtml(result),
    ]),
    primaryText: `${fractionToText(original)} = ${fractionToText(result)}`,
    secondaryText: `Both the numerator and denominator were divided by ${divisor}.`,
    tiles: [
      { label: 'Simplest form', value: fractionToText(result) },
      { label: 'Greatest common divisor', value: String(divisor) },
      {
        label: 'Mixed number',
        value: Math.abs(result.numerator) >= result.denominator ? mixedToText(mixed) : 'Not needed',
      },
    ],
    steps: [
      `Find the greatest common divisor: gcd(${original.numerator}, ${original.denominator}) = ${divisor}.`,
      `Divide the numerator by ${divisor}: ${original.numerator} / ${divisor} = ${result.numerator}.`,
      `Divide the denominator by ${divisor}: ${original.denominator} / ${divisor} = ${result.denominator}.`,
      `The simplest form is ${fractionToText(result)}.`,
    ],
    teacherNote:
      'Simplifying keeps the value the same. It only rewrites the fraction in a cleaner form.',
  };
}

function buildConvertState(values) {
  const validationMessage = commonFractionValidation(values);
  if (validationMessage) {
    return buildErrorState(validationMessage);
  }

  const improper = normalizeFraction(values.impNum, values.impDen);
  const mixed = improperToMixed(improper.numerator, improper.denominator);
  const improperFromMixed = mixedToImproper(values.mixWhole, values.mixNum, values.mixDen);

  return {
    primaryHtml: `<span class="fc-expression">${fractionToHtml(improper)} <span>=</span> ${mixedToHtml(mixed)} <span>|</span> ${mixedToHtml({ whole: values.mixWhole, numerator: values.mixNum, denominator: values.mixDen })} <span>=</span> ${fractionToHtml(improperFromMixed)}</span>`,
    primaryText: `${fractionToText(improper)} = ${mixedToText(mixed)} | ${values.mixWhole} ${values.mixNum}/${values.mixDen} = ${fractionToText(improperFromMixed)}`,
    secondaryText: 'This mode shows one example in each direction so students can compare both conversion rules side by side.',
    tiles: [
      { label: 'Improper to mixed', value: mixedToText(mixed) },
      { label: 'Mixed to improper', value: fractionToText(improperFromMixed) },
      { label: 'Quick check', value: `${mixed.whole} remainder ${mixed.numerator}` },
    ],
    steps: [
      `Improper to mixed: divide ${improper.numerator} by ${improper.denominator}. The whole-number part is ${mixed.whole} and the remainder is ${mixed.numerator}.`,
      `Write the mixed number as ${mixedToText(mixed)}.`,
      `Mixed to improper: (${values.mixWhole} x ${values.mixDen}) + ${values.mixNum} = ${safeAbs(values.mixWhole) * values.mixDen + safeAbs(values.mixNum)}.`,
      `Write the improper fraction as ${fractionToText(improperFromMixed)}.`,
    ],
    teacherNote:
      'A mixed number splits the answer into whole parts plus leftover parts. An improper fraction keeps everything in one fraction.',
  };
}

export function evaluateFractionMode(mode, values) {
  switch (mode) {
    case 'add':
      return buildAddState(values);
    case 'subtract':
      return buildSubtractState(values);
    case 'multiply':
      return buildMultiplyState(values);
    case 'divide':
      return buildDivideState(values);
    case 'simplify':
      return buildSimplifyState(values);
    case 'convert':
      return buildConvertState(values);
    default:
      return buildErrorState('Choose a valid fraction operation.');
  }
}

function initFractionCalculator() {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.querySelector('#calc-fraction-calculator');
  if (!root) {
    return;
  }

  setPageMetadata(metadata);

  const tabButtons = Array.from(root.querySelectorAll('.fc-op-card'));
  const panels = Array.from(root.querySelectorAll('.fc-mode-panel'));
  const resultMain = root.querySelector('#fc-result-main');
  const resultSub = root.querySelector('#fc-result-sub');
  const stepsList = root.querySelector('#fc-steps');
  const teacherNote = root.querySelector('#fc-teacher-note');
  const modeChip = root.querySelector('#fc-mode-chip');
  const modeLabel = root.querySelector('#fc-mode-label');
  const modeSummary = root.querySelector('#fc-mode-summary-text');
  const answerTitle = root.querySelector('#fc-answer-title');
  const modePattern = root.querySelector('#fc-mode-pattern');
  const modeWarning = root.querySelector('#fc-mode-warning');
  const metricOperation = root.querySelector('#fc-metric-operation');
  const metricSimpleLabel = root.querySelector('#fc-metric-simple-label');
  const metricSimple = root.querySelector('#fc-metric-simple');
  const metricMixedLabel = root.querySelector('#fc-metric-mixed-label');
  const metricMixed = root.querySelector('#fc-metric-mixed');
  const metricRuleLabel = root.querySelector('#fc-metric-rule-label');
  const metricRule = root.querySelector('#fc-metric-rule');
  const lessonTitle = document.querySelector('#fc-lesson-title');
  const lessonCopy = document.querySelector('#fc-lesson-copy');

  const inputGroups = {
    add: {
      num1: document.querySelector('#fc-add-num1'),
      den1: document.querySelector('#fc-add-den1'),
      num2: document.querySelector('#fc-add-num2'),
      den2: document.querySelector('#fc-add-den2'),
    },
    subtract: {
      num1: document.querySelector('#fc-sub-num1'),
      den1: document.querySelector('#fc-sub-den1'),
      num2: document.querySelector('#fc-sub-num2'),
      den2: document.querySelector('#fc-sub-den2'),
    },
    multiply: {
      num1: document.querySelector('#fc-mul-num1'),
      den1: document.querySelector('#fc-mul-den1'),
      num2: document.querySelector('#fc-mul-num2'),
      den2: document.querySelector('#fc-mul-den2'),
    },
    divide: {
      num1: document.querySelector('#fc-div-num1'),
      den1: document.querySelector('#fc-div-den1'),
      num2: document.querySelector('#fc-div-num2'),
      den2: document.querySelector('#fc-div-den2'),
    },
    simplify: {
      num: document.querySelector('#fc-simp-num'),
      den: document.querySelector('#fc-simp-den'),
    },
    convert: {
      impNum: document.querySelector('#fc-conv-imp-num'),
      impDen: document.querySelector('#fc-conv-imp-den'),
      mixWhole: document.querySelector('#fc-conv-mix-whole'),
      mixNum: document.querySelector('#fc-conv-mix-num'),
      mixDen: document.querySelector('#fc-conv-mix-den'),
    },
  };

  let currentMode = 'add';

  function readValues(mode) {
    const group = inputGroups[mode];
    const values = {};
    Object.entries(group).forEach(([key, input]) => {
      values[key] = parseIntegerInput(input);
    });
    return values;
  }

  function updateModeCopy(mode) {
    const copy = MODE_COPY[mode];
    if (!copy) {
      return;
    }
    modeLabel.textContent = copy.label;
    modeSummary.textContent = copy.summary;
    modeChip.textContent = copy.chip;
    if (answerTitle) {
      answerTitle.textContent = `${copy.operationName} answer`;
    }
    if (modePattern) {
      modePattern.textContent = copy.pattern;
    }
    if (modeWarning) {
      modeWarning.textContent = copy.warning;
    }
    if (metricOperation) {
      metricOperation.textContent = copy.operationName;
    }
    if (metricRuleLabel) {
      metricRuleLabel.textContent = 'Main rule';
    }
    if (metricRule) {
      metricRule.textContent = copy.rule;
    }
    if (lessonTitle) {
      lessonTitle.textContent = copy.lessonTitle;
    }
    if (lessonCopy) {
      lessonCopy.textContent = copy.lessonCopy;
    }
  }

  function renderState(mode, state) {
    resultMain.innerHTML = state.primaryHtml;
    resultSub.textContent = state.secondaryText;
    stepsList.innerHTML = state.steps.map((step) => `<li>${step}</li>`).join('');
    teacherNote.textContent = state.teacherNote;
    const [firstTile, secondTile] = state.tiles;
    if (metricSimpleLabel && firstTile) {
      metricSimpleLabel.textContent = firstTile.label;
    }
    if (metricSimple && firstTile) {
      metricSimple.textContent = firstTile.value;
    }
    if (metricMixedLabel && secondTile) {
      metricMixedLabel.textContent = secondTile.label;
    }
    if (metricMixed && secondTile) {
      metricMixed.textContent = secondTile.value;
    }
    if (mode === 'convert' && metricRuleLabel) {
      metricRuleLabel.textContent = 'Conversion rule';
    }
  }

  function calculateAndRender(mode) {
    const values = readValues(mode);
    const state = evaluateFractionMode(mode, values);
    renderState(mode, state);
  }

  function activateMode(mode) {
    currentMode = mode;
    tabButtons.forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      const active = panel.dataset.modePanel === mode;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    updateModeCopy(mode);
    calculateAndRender(mode);
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => activateMode(button.dataset.mode));
  });

  root.querySelectorAll('[data-calc-mode]').forEach((button) => {
    button.addEventListener('click', () => calculateAndRender(button.dataset.calcMode));
  });

  Object.entries(inputGroups).forEach(([mode, group]) => {
    Object.values(group).forEach((input) => {
      input?.addEventListener('change', () => {
        if (currentMode === mode) {
          calculateAndRender(mode);
        }
      });
    });
  });

  activateMode(currentMode);
}

initFractionCalculator();
