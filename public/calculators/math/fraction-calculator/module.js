import { setupButtonGroup } from '/assets/js/core/ui.js';
import { toNumber } from '/assets/js/core/validate.js';

// Fraction math utilities
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function simplifyFraction(numerator, denominator) {
  if (denominator === 0) {
    return null;
  }
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function addFractions(num1, den1, num2, den2) {
  const commonDen = lcm(den1, den2);
  const newNum1 = num1 * (commonDen / den1);
  const newNum2 = num2 * (commonDen / den2);
  const resultNum = newNum1 + newNum2;
  return simplifyFraction(resultNum, commonDen);
}

function subtractFractions(num1, den1, num2, den2) {
  const commonDen = lcm(den1, den2);
  const newNum1 = num1 * (commonDen / den1);
  const newNum2 = num2 * (commonDen / den2);
  const resultNum = newNum1 - newNum2;
  return simplifyFraction(resultNum, commonDen);
}

function multiplyFractions(num1, den1, num2, den2) {
  const resultNum = num1 * num2;
  const resultDen = den1 * den2;
  return simplifyFraction(resultNum, resultDen);
}

function divideFractions(num1, den1, num2, den2) {
  if (num2 === 0) {
    return null;
  }
  // Multiply by reciprocal
  const resultNum = num1 * den2;
  const resultDen = den1 * num2;
  return simplifyFraction(resultNum, resultDen);
}

function improperToMixed(numerator, denominator) {
  if (denominator === 0) {
    return null;
  }
  const whole = Math.floor(Math.abs(numerator) / Math.abs(denominator));
  const remainder = Math.abs(numerator) % Math.abs(denominator);
  const sign = numerator * denominator < 0 ? -1 : 1;

  return {
    whole: sign * whole,
    numerator: remainder,
    denominator: Math.abs(denominator),
  };
}

function mixedToImproper(whole, numerator, denominator) {
  if (denominator === 0) {
    return null;
  }
  const improperNum = Math.abs(whole) * denominator + numerator;
  const sign = whole < 0 ? -1 : 1;
  return {
    numerator: sign * improperNum,
    denominator: denominator,
  };
}

function formatFraction(numerator, denominator) {
  if (denominator === 1) {
    return `${numerator}`;
  }
  return `${numerator}/${denominator}`;
}

function formatMixed(whole, numerator, denominator) {
  if (numerator === 0) {
    return `${whole}`;
  }
  if (whole === 0) {
    return `${numerator}/${denominator}`;
  }
  return `${whole} ${numerator}/${denominator}`;
}

// Mode switching
const modeGroup = document.querySelector('[data-button-group="fraction-mode"]');
const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'add',
  onChange: (mode) => {
    switchMode(mode);
  },
});
const inputSections = document.querySelectorAll('.input-section');
const resultDiv = document.querySelector('#fraction-result');
const explanationContainer = document.querySelector('[data-fraction-explanation]');
const explanationSections = explanationContainer
  ? Array.from(explanationContainer.querySelectorAll('[data-mode]'))
  : [];

// Input elements
const addInputs = {
  num1: document.querySelector('#add-num1'),
  den1: document.querySelector('#add-den1'),
  num2: document.querySelector('#add-num2'),
  den2: document.querySelector('#add-den2'),
};

const subInputs = {
  num1: document.querySelector('#sub-num1'),
  den1: document.querySelector('#sub-den1'),
  num2: document.querySelector('#sub-num2'),
  den2: document.querySelector('#sub-den2'),
};

const mulInputs = {
  num1: document.querySelector('#mul-num1'),
  den1: document.querySelector('#mul-den1'),
  num2: document.querySelector('#mul-num2'),
  den2: document.querySelector('#mul-den2'),
};

const divInputs = {
  num1: document.querySelector('#div-num1'),
  den1: document.querySelector('#div-den1'),
  num2: document.querySelector('#div-num2'),
  den2: document.querySelector('#div-den2'),
};

const simpInputs = {
  num: document.querySelector('#simp-num'),
  den: document.querySelector('#simp-den'),
};

const convInputs = {
  impNum: document.querySelector('#conv-imp-num'),
  impDen: document.querySelector('#conv-imp-den'),
  mixWhole: document.querySelector('#conv-mix-whole'),
  mixNum: document.querySelector('#conv-mix-num'),
  mixDen: document.querySelector('#conv-mix-den'),
};

// Calculate buttons
const calculateButtons = document.querySelectorAll('[data-calculate]');

// Mode switching functionality
function switchMode(mode) {
  inputSections.forEach((section) => {
    section.classList.toggle('active', section.dataset.mode === mode);
  });

  resultDiv.innerHTML = '';
  updateExplanation(mode);
}

function updateExplanation(mode) {
  if (!explanationContainer || explanationSections.length === 0) {
    return;
  }

  explanationSections.forEach((section) => {
    section.hidden = section.dataset.mode !== mode;
  });
}

// Calculation functions
function calculateAdd() {
  const num1 = toNumber(addInputs.num1.value);
  const den1 = toNumber(addInputs.den1.value);
  const num2 = toNumber(addInputs.num2.value);
  const den2 = toNumber(addInputs.den2.value);

  if (den1 === 0 || den2 === 0) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot calculate: denominator cannot be zero.</div>`;
    return;
  }

  const result = addFractions(num1, den1, num2, den2);
  const mixed = improperToMixed(result.numerator, result.denominator);

  resultDiv.innerHTML = `
    <div>${formatFraction(num1, den1)} + ${formatFraction(num2, den2)} = ${formatFraction(result.numerator, result.denominator)}</div>
    ${Math.abs(result.numerator) > result.denominator ? `<div class="result-detail">Mixed form: ${formatMixed(mixed.whole, mixed.numerator, mixed.denominator)}</div>` : ''}
  `;
}

function calculateSubtract() {
  const num1 = toNumber(subInputs.num1.value);
  const den1 = toNumber(subInputs.den1.value);
  const num2 = toNumber(subInputs.num2.value);
  const den2 = toNumber(subInputs.den2.value);

  if (den1 === 0 || den2 === 0) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot calculate: denominator cannot be zero.</div>`;
    return;
  }

  const result = subtractFractions(num1, den1, num2, den2);
  const mixed = improperToMixed(result.numerator, result.denominator);

  resultDiv.innerHTML = `
    <div>${formatFraction(num1, den1)} − ${formatFraction(num2, den2)} = ${formatFraction(result.numerator, result.denominator)}</div>
    ${Math.abs(result.numerator) > result.denominator ? `<div class="result-detail">Mixed form: ${formatMixed(mixed.whole, mixed.numerator, mixed.denominator)}</div>` : ''}
  `;
}

function calculateMultiply() {
  const num1 = toNumber(mulInputs.num1.value);
  const den1 = toNumber(mulInputs.den1.value);
  const num2 = toNumber(mulInputs.num2.value);
  const den2 = toNumber(mulInputs.den2.value);

  if (den1 === 0 || den2 === 0) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot calculate: denominator cannot be zero.</div>`;
    return;
  }

  const result = multiplyFractions(num1, den1, num2, den2);
  const mixed = improperToMixed(result.numerator, result.denominator);

  resultDiv.innerHTML = `
    <div>${formatFraction(num1, den1)} × ${formatFraction(num2, den2)} = ${formatFraction(result.numerator, result.denominator)}</div>
    ${Math.abs(result.numerator) > result.denominator ? `<div class="result-detail">Mixed form: ${formatMixed(mixed.whole, mixed.numerator, mixed.denominator)}</div>` : ''}
  `;
}

function calculateDivide() {
  const num1 = toNumber(divInputs.num1.value);
  const den1 = toNumber(divInputs.den1.value);
  const num2 = toNumber(divInputs.num2.value);
  const den2 = toNumber(divInputs.den2.value);

  if (den1 === 0 || den2 === 0) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot calculate: denominator cannot be zero.</div>`;
    return;
  }

  const result = divideFractions(num1, den1, num2, den2);
  if (result === null) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot divide by zero.</div>`;
    return;
  }

  const mixed = improperToMixed(result.numerator, result.denominator);

  resultDiv.innerHTML = `
    <div>${formatFraction(num1, den1)} ÷ ${formatFraction(num2, den2)} = ${formatFraction(result.numerator, result.denominator)}</div>
    ${Math.abs(result.numerator) > result.denominator ? `<div class="result-detail">Mixed form: ${formatMixed(mixed.whole, mixed.numerator, mixed.denominator)}</div>` : ''}
  `;
}

function calculateSimplify() {
  const num = toNumber(simpInputs.num.value);
  const den = toNumber(simpInputs.den.value);

  if (den === 0) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot calculate: denominator cannot be zero.</div>`;
    return;
  }

  const result = simplifyFraction(num, den);
  const divisor = gcd(num, den);

  resultDiv.innerHTML = `
    <div>${formatFraction(num, den)} = ${formatFraction(result.numerator, result.denominator)}</div>
    <div class="result-detail">GCD: ${divisor}</div>
  `;
}

function calculateConvert() {
  // Convert improper to mixed
  const impNum = toNumber(convInputs.impNum.value);
  const impDen = toNumber(convInputs.impDen.value);

  // Convert mixed to improper
  const mixWhole = toNumber(convInputs.mixWhole.value);
  const mixNum = toNumber(convInputs.mixNum.value);
  const mixDen = toNumber(convInputs.mixDen.value);

  let output = '';

  if (impDen !== 0) {
    const mixed = improperToMixed(impNum, impDen);
    if (mixed) {
      output += `<div>${formatFraction(impNum, impDen)} = ${formatMixed(mixed.whole, mixed.numerator, mixed.denominator)}</div>`;
    }
  }

  if (mixDen !== 0) {
    const improper = mixedToImproper(mixWhole, mixNum, mixDen);
    if (improper) {
      if (output) output += `<div style="margin-top: 12px;"></div>`;
      output += `<div>${formatMixed(mixWhole, mixNum, mixDen)} = ${formatFraction(improper.numerator, improper.denominator)}</div>`;
    }
  }

  if (!output) {
    output = `<div style="color: #dc2626;">Cannot calculate: denominator cannot be zero.</div>`;
  }

  resultDiv.innerHTML = output;
}

// Event listeners for calculate buttons
calculateButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.calculate;
    switch (mode) {
      case 'add':
        calculateAdd();
        break;
      case 'subtract':
        calculateSubtract();
        break;
      case 'multiply':
        calculateMultiply();
        break;
      case 'divide':
        calculateDivide();
        break;
      case 'simplify':
        calculateSimplify();
        break;
      case 'convert':
        calculateConvert();
        break;
    }
  });
});

const initialMode = modeButtons?.getValue() ?? 'add';
updateExplanation(initialMode);

// Initialize with first calculation
calculateAdd();
