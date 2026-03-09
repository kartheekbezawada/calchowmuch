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
    summary: 'To add fractions, first make the bottom numbers the same. Then add the top numbers.',
    easyRuleTitle: 'Same-size pieces first',
    easyRuleText: 'Make both bottom numbers match before you add anything.',
    watchTitle: 'Common mistake',
    watchText: 'Do not add the bottom numbers together.',
    lessonTitle: 'Adding fractions with a common denominator plan',
    lessonCopy:
      'Start by making the denominators match, then work only with the numerators, and simplify the final answer if possible.',
    tips: [
      { title: 'Remember', body: 'Denominator = bottom number' },
      { title: 'Tip', body: 'LCM helps add and subtract' },
      { title: 'Shortcut', body: 'Always simplify at the end' },
    ],
  },
  subtract: {
    label: 'Subtract fractions',
    summary: 'To subtract fractions, first make the bottom numbers the same. Then subtract the top numbers.',
    easyRuleTitle: 'Keep the parts the same size',
    easyRuleText: 'Match the bottom numbers first, then take away from the top numbers only.',
    watchTitle: 'Common mistake',
    watchText: 'Do not change the size of the parts while subtracting.',
    lessonTitle: 'Subtracting fractions without changing the size of the parts',
    lessonCopy:
      'Use the same denominator idea as addition, then subtract only how many equal parts remain.',
    tips: [
      { title: 'Remember', body: 'Same denominator first' },
      { title: 'Tip', body: 'Only the numerators are subtracted' },
      { title: 'Shortcut', body: 'Check the sign before you simplify' },
    ],
  },
  multiply: {
    label: 'Multiply fractions',
    summary: 'To multiply fractions, multiply the top numbers together and the bottom numbers together.',
    easyRuleTitle: 'Top with top, bottom with bottom',
    easyRuleText: 'Multiply straight across. You do not need to match the bottom numbers first.',
    watchTitle: 'Common mistake',
    watchText: 'Do not stop to find a common denominator for multiplication.',
    lessonTitle: 'Multiplying fractions by using the top and bottom rows',
    lessonCopy:
      'This is the quickest operation because you do not rename the fractions first. Multiply and then reduce the answer.',
    tips: [
      { title: 'Remember', body: 'Multiply top with top' },
      { title: 'Tip', body: 'Look for common factors before or after' },
      { title: 'Shortcut', body: 'Cancellation can keep numbers small' },
    ],
  },
  divide: {
    label: 'Divide fractions',
    summary: 'To divide fractions, keep the first one, flip the second one, and then multiply.',
    easyRuleTitle: 'Keep, flip, multiply',
    easyRuleText: 'Leave the first fraction alone. Turn the second one upside down, then multiply.',
    watchTitle: 'Common mistake',
    watchText: 'Only flip the second fraction, not the first one.',
    lessonTitle: 'Dividing fractions by flipping the second fraction',
    lessonCopy:
      'Turn the division into multiplication by reversing the second fraction. Then solve like a multiplication question.',
    tips: [
      { title: 'Remember', body: 'Keep the first fraction the same' },
      { title: 'Tip', body: 'Flip only the second fraction' },
      { title: 'Shortcut', body: 'Division becomes multiplication after the flip' },
    ],
  },
  simplify: {
    label: 'Simplify a fraction',
    summary: 'To simplify a fraction, find a number that goes into the top and bottom, then divide both by it.',
    easyRuleTitle: 'Use the same number on both',
    easyRuleText: 'Divide the top and bottom by the same biggest factor you can find.',
    watchTitle: 'Common mistake',
    watchText: 'If you divide only one part, the fraction changes value.',
    lessonTitle: 'Simplifying fractions without changing their value',
    lessonCopy:
      'A simpler fraction still means the same amount. You are only rewriting it in its cleanest form.',
    tips: [
      { title: 'Remember', body: 'Look for the biggest common factor' },
      { title: 'Tip', body: 'GCD tells you what to divide by' },
      { title: 'Shortcut', body: 'If top and bottom share no factor, you are done' },
    ],
  },
  convert: {
    label: 'Convert fraction forms',
    summary: 'To convert fractions, change the form but keep the value the same.',
    easyRuleTitle: 'Same value, different look',
    easyRuleText: 'Use division to make a mixed number. Use whole x bottom + top to make an improper fraction.',
    watchTitle: 'Common mistake',
    watchText: 'Keep the same bottom number in the fractional part of a mixed number.',
    lessonTitle: 'Converting between improper fractions and mixed numbers',
    lessonCopy:
      'Improper and mixed forms look different, but they represent the same value. Use the correct conversion rule for each direction.',
    tips: [
      { title: 'Remember', body: 'Quotient gives the whole-number part' },
      { title: 'Tip', body: 'Remainder becomes the new numerator' },
      { title: 'Shortcut', body: 'Whole x denominator + numerator makes an improper fraction' },
    ],
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

function parseIntegerInput(input) {
  const value = Number.parseFloat(input?.value ?? '');
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
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

function buildMetricPair(primaryLabel, primaryValue, secondaryLabel, secondaryValue) {
  return {
    primaryLabel,
    primaryValue,
    secondaryLabel,
    secondaryValue,
  };
}

function buildErrorState(message) {
  return {
    primaryHtml: `<span>${message}</span>`,
    secondaryText: '',
    metrics: buildMetricPair('Simplest form', 'Check the input', 'Mixed form', 'Not available'),
    steps: [
      {
        tag: 'Check input',
        note: message,
        expression: '<span>Correct the input values and try again.</span>',
      },
    ],
    teacherNote: message,
  };
}

function buildResultMetrics(resultFraction) {
  const mixed = improperToMixed(resultFraction.numerator, resultFraction.denominator);
  return buildMetricPair(
    'Simplest form',
    fractionToText(resultFraction),
    'Mixed form',
    Math.abs(resultFraction.numerator) >= resultFraction.denominator ? mixedToText(mixed) : 'Not needed'
  );
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
  const simplified = fractionToText(unsimplified) !== fractionToText(result);

  return {
    primaryHtml: fractionToHtml(result),
    secondaryText: `${fractionToText(left)} + ${fractionToText(right)} = ${fractionToText(result)}`,
    metrics: buildResultMetrics(result),
    steps: [
      {
        tag: 'Start',
        expression: expressionHtml([fractionToHtml(left), '<span>+</span>', fractionToHtml(right)]),
      },
      {
        tag: 'Common denominator',
        note: `LCM of ${left.denominator} and ${right.denominator} = ${commonDenominator}`,
        expression: expressionHtml([
          fractionToHtml({ numerator: equivalentLeft, denominator: commonDenominator }),
          '<span>+</span>',
          fractionToHtml({ numerator: equivalentRight, denominator: commonDenominator }),
        ]),
      },
      {
        tag: 'Add numerators',
        expression: fractionToHtml(unsimplified),
      },
      {
        tag: simplified ? 'Simplify result' : 'Result',
        note: simplified ? `${fractionToText(unsimplified)} simplifies to ${fractionToText(result)}` : 'Already in simplest form.',
        expression: fractionToHtml(result),
        isResult: true,
      },
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
  const simplified = fractionToText(unsimplified) !== fractionToText(result);

  return {
    primaryHtml: fractionToHtml(result),
    secondaryText: `${fractionToText(left)} - ${fractionToText(right)} = ${fractionToText(result)}`,
    metrics: buildResultMetrics(result),
    steps: [
      {
        tag: 'Start',
        expression: expressionHtml([fractionToHtml(left), '<span>-</span>', fractionToHtml(right)]),
      },
      {
        tag: 'Common denominator',
        note: `LCM of ${left.denominator} and ${right.denominator} = ${commonDenominator}`,
        expression: expressionHtml([
          fractionToHtml({ numerator: equivalentLeft, denominator: commonDenominator }),
          '<span>-</span>',
          fractionToHtml({ numerator: equivalentRight, denominator: commonDenominator }),
        ]),
      },
      {
        tag: 'Subtract numerators',
        expression: fractionToHtml(unsimplified),
      },
      {
        tag: simplified ? 'Simplify result' : 'Result',
        note: simplified ? `${fractionToText(unsimplified)} simplifies to ${fractionToText(result)}` : 'Already in simplest form.',
        expression: fractionToHtml(result),
        isResult: true,
      },
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
  const simplified = fractionToText(unsimplified) !== fractionToText(result);

  return {
    primaryHtml: fractionToHtml(result),
    secondaryText: `${fractionToText(left)} x ${fractionToText(right)} = ${fractionToText(result)}`,
    metrics: buildResultMetrics(result),
    steps: [
      {
        tag: 'Start',
        expression: expressionHtml([fractionToHtml(left), '<span>x</span>', fractionToHtml(right)]),
      },
      {
        tag: 'Multiply across',
        note: `${left.numerator} x ${right.numerator} = ${unsimplified.numerator} and ${left.denominator} x ${right.denominator} = ${unsimplified.denominator}`,
        expression: fractionToHtml(unsimplified),
      },
      {
        tag: simplified ? 'Simplify result' : 'Result',
        note: simplified ? `${fractionToText(unsimplified)} simplifies to ${fractionToText(result)}` : 'Already in simplest form.',
        expression: fractionToHtml(result),
        isResult: true,
      },
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
  const simplified = fractionToText(unsimplified) !== fractionToText(result);

  return {
    primaryHtml: fractionToHtml(result),
    secondaryText: `${fractionToText(left)} / ${fractionToText(right)} = ${fractionToText(result)}`,
    metrics: buildResultMetrics(result),
    steps: [
      {
        tag: 'Start',
        expression: expressionHtml([fractionToHtml(left), '<span>/</span>', fractionToHtml(right)]),
      },
      {
        tag: 'Flip second fraction',
        expression: expressionHtml([fractionToHtml(left), '<span>x</span>', fractionToHtml(reciprocal)]),
      },
      {
        tag: 'Multiply across',
        expression: fractionToHtml(unsimplified),
      },
      {
        tag: simplified ? 'Simplify result' : 'Result',
        note: simplified ? `${fractionToText(unsimplified)} simplifies to ${fractionToText(result)}` : 'Already in simplest form.',
        expression: fractionToHtml(result),
        isResult: true,
      },
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

  return {
    primaryHtml: fractionToHtml(result),
    secondaryText: `${fractionToText(original)} = ${fractionToText(result)}`,
    metrics: buildMetricPair('Simplest form', fractionToText(result), 'Greatest common divisor', String(divisor)),
    steps: [
      {
        tag: 'Start',
        expression: fractionToHtml(original),
      },
      {
        tag: 'Find GCD',
        note: `gcd(${original.numerator}, ${original.denominator}) = ${divisor}`,
        expression: '<span>Use the biggest common factor.</span>',
      },
      {
        tag: `Divide by ${divisor}`,
        note: `${original.numerator} / ${divisor} = ${result.numerator} and ${original.denominator} / ${divisor} = ${result.denominator}`,
        expression: fractionToHtml(result),
      },
      {
        tag: 'Result',
        note: 'The fraction is now in its simplest form.',
        expression: fractionToHtml(result),
        isResult: true,
      },
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
    primaryHtml: expressionHtml([
      fractionToHtml(improper),
      '<span>&#8646;</span>',
      mixedToHtml(mixed),
      '<span>|</span>',
      mixedToHtml({ whole: values.mixWhole, numerator: values.mixNum, denominator: values.mixDen }),
      '<span>&#8646;</span>',
      fractionToHtml(improperFromMixed),
    ]),
    secondaryText: `${fractionToText(improper)} = ${mixedToText(mixed)} | ${values.mixWhole} ${values.mixNum}/${values.mixDen} = ${fractionToText(improperFromMixed)}`,
    metrics: buildMetricPair('Improper to mixed', mixedToText(mixed), 'Mixed to improper', fractionToText(improperFromMixed)),
    steps: [
      {
        tag: 'Start',
        expression: expressionHtml([fractionToHtml(improper), '<span>&#8646;</span>', mixedToHtml({ whole: values.mixWhole, numerator: values.mixNum, denominator: values.mixDen })]),
      },
      {
        tag: 'Improper to mixed',
        note: `${improper.numerator} / ${improper.denominator} gives ${mixed.whole} remainder ${mixed.numerator}`,
        expression: mixedToHtml(mixed),
      },
      {
        tag: 'Mixed to improper',
        note: `(${values.mixWhole} x ${values.mixDen}) + ${values.mixNum} = ${safeAbs(values.mixWhole) * values.mixDen + safeAbs(values.mixNum)}`,
        expression: fractionToHtml(improperFromMixed),
      },
      {
        tag: 'Result',
        note: 'Both forms show the same value in different ways.',
        expression: expressionHtml([mixedToHtml(mixed), '<span>|</span>', fractionToHtml(improperFromMixed)]),
        isResult: true,
      },
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
  const solveButton = root.querySelector('#fc-solve-btn');
  const resultMain = root.querySelector('#fc-result-main');
  const resultSub = root.querySelector('#fc-result-sub');
  const stepsList = root.querySelector('#fc-steps');
  const teacherNote = root.querySelector('#fc-teacher-note');
  const modeLabel = root.querySelector('#fc-mode-label');
  const modeSummary = root.querySelector('#fc-mode-summary-text');
  const simpleRuleTitle = root.querySelector('#fc-simple-rule-title');
  const simpleRuleText = root.querySelector('#fc-simple-rule-text');
  const watchTitle = root.querySelector('#fc-watch-title');
  const watchText = root.querySelector('#fc-watch-text');
  const explanationLessonTitle = document.querySelector('#fc-lesson-title');
  const explanationLessonCopy = document.querySelector('#fc-lesson-copy');
  const tipNodes = [1, 2, 3].map((index) => ({
    title: root.querySelector(`#fc-tip-${index}-title`),
    body: root.querySelector(`#fc-tip-${index}-body`),
  }));

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
    simpleRuleTitle.textContent = copy.easyRuleTitle;
    simpleRuleText.textContent = copy.easyRuleText;
    watchTitle.textContent = copy.watchTitle;
    watchText.textContent = copy.watchText;

    if (explanationLessonTitle) {
      explanationLessonTitle.textContent = copy.lessonTitle;
    }
    if (explanationLessonCopy) {
      explanationLessonCopy.textContent = copy.lessonCopy;
    }

    copy.tips.forEach((tip, index) => {
      const node = tipNodes[index];
      if (!node) {
        return;
      }
      node.title.textContent = tip.title;
      node.body.textContent = tip.body;
    });
  }

  function renderSteps(steps) {
    stepsList.innerHTML = steps
      .map(
        (step, index) => `
          <div class="fc-step-row${step.isResult ? ' is-result' : ''}">
            <div class="fc-step-meta">
              <div class="fc-step-head">
                <span class="fc-step-index">STEP ${index + 1}</span>
                <span class="fc-step-tag">${step.tag}</span>
              </div>
              ${step.note ? `<span class="fc-step-note">${step.note}</span>` : ''}
            </div>
            <div class="fc-step-expression">${step.expression}</div>
          </div>`
      )
      .join('');
  }

  function renderState(state) {
    resultMain.innerHTML = state.primaryHtml;
    resultSub.textContent = state.secondaryText;
    renderSteps(state.steps);
    teacherNote.textContent = state.teacherNote;
  }

  function calculateAndRender(mode) {
    const values = readValues(mode);
    const state = evaluateFractionMode(mode, values);
    renderState(state);
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

  solveButton?.addEventListener('click', () => {
    calculateAndRender(currentMode);
  });

  Object.entries(inputGroups).forEach(([mode, group]) => {
    Object.values(group).forEach((input) => {
      input?.addEventListener('input', () => {
        if (currentMode === mode) {
          updateModeCopy(mode);
        }
      });
    });
  });

  activateMode(currentMode);
}

initFractionCalculator();
