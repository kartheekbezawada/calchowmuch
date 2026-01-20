const EPSILON = 1e-10;

function nearlyZero(value) {
  return Math.abs(value) < EPSILON;
}

function normalizeNumber(value) {
  return nearlyZero(value) ? 0 : value;
}

function formatCoefficientValue(value, precision = 4) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  const fixed = value.toFixed(precision);
  return fixed.replace(/\.?0+$/, '');
}

function normalizeInput(input) {
  return input
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/X/g, 'x');
}

export function parsePolynomial(input) {
  const errors = [];
  const coeffs = new Map();

  if (typeof input !== 'string' || input.trim() === '') {
    return { coeffs, errors: ['Polynomial input is empty.'] };
  }

  let normalized = normalizeInput(input);
  normalized = normalized.replace(/-/g, '+-');
  if (normalized.startsWith('+-')) {
    normalized = normalized.slice(1);
  }

  const terms = normalized.split('+').filter(Boolean);
  if (terms.length === 0) {
    return { coeffs, errors: ['Polynomial input is empty.'] };
  }

  terms.forEach((term) => {
    if (!term) {
      return;
    }
    if (term.includes('x')) {
      const match = term.match(/^([+-]?\d*\.?\d*)x(?:\^([+-]?\d+))?$/);
      if (!match) {
        errors.push(term);
        return;
      }
      const coeffStr = match[1];
      const expStr = match[2];
      let coeff;
      if (coeffStr === '' || coeffStr === '+') {
        coeff = 1;
      } else if (coeffStr === '-') {
        coeff = -1;
      } else {
        coeff = Number(coeffStr);
      }
      if (!Number.isFinite(coeff)) {
        errors.push(term);
        return;
      }
      const exponent = expStr ? Number(expStr) : 1;
      if (!Number.isInteger(exponent) || exponent < 0) {
        errors.push(term);
        return;
      }
      const existing = coeffs.get(exponent) ?? 0;
      coeffs.set(exponent, normalizeNumber(existing + coeff));
    } else {
      const value = Number(term);
      if (!Number.isFinite(value)) {
        errors.push(term);
        return;
      }
      const existing = coeffs.get(0) ?? 0;
      coeffs.set(0, normalizeNumber(existing + value));
    }
  });

  return { coeffs, errors };
}

export function coefficientsToArray(coeffs) {
  if (Array.isArray(coeffs)) {
    return coeffs.slice();
  }
  const maxDegree = Math.max(...coeffs.keys(), 0);
  const arr = Array(maxDegree + 1).fill(0);
  coeffs.forEach((value, degree) => {
    arr[degree] = normalizeNumber(value);
  });
  return trimPolynomial(arr);
}

export function arrayToCoefficients(arr) {
  const coeffs = new Map();
  arr.forEach((value, degree) => {
    if (!nearlyZero(value)) {
      coeffs.set(degree, normalizeNumber(value));
    }
  });
  return coeffs;
}

export function trimPolynomial(arr) {
  let lastIndex = arr.length - 1;
  while (lastIndex > 0 && nearlyZero(arr[lastIndex])) {
    lastIndex -= 1;
  }
  return arr.slice(0, lastIndex + 1).map((value) => normalizeNumber(value));
}

export function getDegree(arr) {
  const trimmed = trimPolynomial(arr);
  return trimmed.length - 1;
}

export function formatPolynomial(coeffs, options = {}) {
  const { variable = 'x', precision = 4 } = options;
  const arr = coefficientsToArray(coeffs);
  const parts = [];

  for (let degree = arr.length - 1; degree >= 0; degree -= 1) {
    const coeff = arr[degree];
    if (nearlyZero(coeff)) {
      continue;
    }
    const absCoeff = Math.abs(coeff);
    let term = '';
    if (degree === 0) {
      term = formatCoefficientValue(absCoeff, precision);
    } else if (degree === 1) {
      term = absCoeff === 1 ? variable : `${formatCoefficientValue(absCoeff, precision)}${variable}`;
    } else {
      term = absCoeff === 1
        ? `${variable}^${degree}`
        : `${formatCoefficientValue(absCoeff, precision)}${variable}^${degree}`;
    }

    if (parts.length === 0) {
      parts.push(coeff < 0 ? `-${term}` : term);
    } else {
      parts.push(coeff < 0 ? `- ${term}` : `+ ${term}`);
    }
  }

  if (parts.length === 0) {
    return '0';
  }
  return parts.join(' ');
}

export function addPolynomials(a, b) {
  const arrA = coefficientsToArray(a);
  const arrB = coefficientsToArray(b);
  const max = Math.max(arrA.length, arrB.length);
  const result = Array(max).fill(0);
  for (let i = 0; i < max; i += 1) {
    result[i] = normalizeNumber((arrA[i] ?? 0) + (arrB[i] ?? 0));
  }
  return trimPolynomial(result);
}

export function subtractPolynomials(a, b) {
  const arrA = coefficientsToArray(a);
  const arrB = coefficientsToArray(b);
  const max = Math.max(arrA.length, arrB.length);
  const result = Array(max).fill(0);
  for (let i = 0; i < max; i += 1) {
    result[i] = normalizeNumber((arrA[i] ?? 0) - (arrB[i] ?? 0));
  }
  return trimPolynomial(result);
}

export function multiplyPolynomials(a, b) {
  const arrA = coefficientsToArray(a);
  const arrB = coefficientsToArray(b);
  const result = Array(arrA.length + arrB.length - 1).fill(0);
  for (let i = 0; i < arrA.length; i += 1) {
    for (let j = 0; j < arrB.length; j += 1) {
      result[i + j] += arrA[i] * arrB[j];
    }
  }
  return trimPolynomial(result.map((value) => normalizeNumber(value)));
}

export function dividePolynomials(dividend, divisor) {
  const dividendArr = coefficientsToArray(dividend);
  const divisorArr = coefficientsToArray(divisor);
  const divisorDegree = getDegree(divisorArr);

  if (divisorDegree === 0 && nearlyZero(divisorArr[0])) {
    return null;
  }

  let remainder = dividendArr.slice();
  const quotient = Array(Math.max(0, dividendArr.length - divisorArr.length + 1)).fill(0);

  while (getDegree(remainder) >= divisorDegree && !nearlyZero(remainder[getDegree(remainder)])) {
    const degreeDiff = getDegree(remainder) - divisorDegree;
    const leadCoeff = remainder[getDegree(remainder)] / divisorArr[divisorDegree];
    quotient[degreeDiff] = normalizeNumber(leadCoeff);

    for (let i = 0; i <= divisorDegree; i += 1) {
      const index = i + degreeDiff;
      remainder[index] = normalizeNumber(remainder[index] - leadCoeff * divisorArr[i]);
    }
    remainder = trimPolynomial(remainder);
  }

  return {
    quotient: trimPolynomial(quotient),
    remainder: trimPolynomial(remainder),
  };
}

export function evaluatePolynomial(coeffs, x) {
  const arr = coefficientsToArray(coeffs);
  return arr.reduce((sum, coeff, degree) => sum + coeff * Math.pow(x, degree), 0);
}

export function solveQuadratic(a, b, c) {
  if (nearlyZero(a)) {
    return { error: 'Coefficient "a" cannot be zero.' };
  }
  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  if (discriminant > EPSILON) {
    const sqrtDisc = Math.sqrt(discriminant);
    const x1 = (-b + sqrtDisc) / (2 * a);
    const x2 = (-b - sqrtDisc) / (2 * a);
    return {
      type: 'two-real',
      discriminant,
      roots: [x1, x2],
      vertex: { x: vertexX, y: vertexY },
    };
  }
  if (Math.abs(discriminant) <= EPSILON) {
    const x = -b / (2 * a);
    return {
      type: 'one-real',
      discriminant: 0,
      roots: [x],
      vertex: { x: vertexX, y: vertexY },
    };
  }
  const realPart = -b / (2 * a);
  const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
  return {
    type: 'complex',
    discriminant,
    roots: [
      { real: realPart, imaginary: imaginaryPart },
      { real: realPart, imaginary: -imaginaryPart },
    ],
    vertex: { x: vertexX, y: vertexY },
  };
}

export function solveSystem2x2(a11, a12, b1, a21, a22, b2) {
  const determinant = a11 * a22 - a12 * a21;

  if (Math.abs(determinant) < EPSILON) {
    const ratio1 = Math.abs(a21) > EPSILON ? a11 / a21 : null;
    const ratio2 = Math.abs(a22) > EPSILON ? a12 / a22 : null;
    const ratio3 = Math.abs(b2) > EPSILON ? b1 / b2 : null;
    const isDependent = ratio1 !== null
      && ratio2 !== null
      && ratio3 !== null
      && Math.abs(ratio1 - ratio2) < EPSILON
      && Math.abs(ratio1 - ratio3) < EPSILON;
    return {
      type: isDependent ? 'infinite' : 'none',
      determinant,
    };
  }

  const x = (b1 * a22 - b2 * a12) / determinant;
  const y = (a11 * b2 - a21 * b1) / determinant;
  return {
    type: 'unique',
    determinant,
    solution: { x, y },
  };
}

export function solveSystem3x3(a11, a12, a13, b1, a21, a22, a23, b2, a31, a32, a33, b3) {
  const determinant = a11 * (a22 * a33 - a23 * a32)
    - a12 * (a21 * a33 - a23 * a31)
    + a13 * (a21 * a32 - a22 * a31);

  if (Math.abs(determinant) < EPSILON) {
    return { type: 'none', determinant };
  }

  const detX = b1 * (a22 * a33 - a23 * a32)
    - a12 * (b2 * a33 - a23 * b3)
    + a13 * (b2 * a32 - a22 * b3);
  const detY = a11 * (b2 * a33 - a23 * b3)
    - b1 * (a21 * a33 - a23 * a31)
    + a13 * (a21 * b3 - b2 * a31);
  const detZ = a11 * (a22 * b3 - b2 * a32)
    - a12 * (a21 * b3 - b2 * a31)
    + b1 * (a21 * a32 - a22 * a31);

  return {
    type: 'unique',
    determinant,
    solution: {
      x: detX / determinant,
      y: detY / determinant,
      z: detZ / determinant,
    },
  };
}

function gcdInt(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

function getIntegerFactors(value) {
  const factors = [];
  const absValue = Math.abs(value);
  if (absValue === 0) {
    return [0];
  }
  for (let i = 1; i <= Math.sqrt(absValue); i += 1) {
    if (absValue % i === 0) {
      factors.push(i, -i);
      const pair = absValue / i;
      if (pair !== i) {
        factors.push(pair, -pair);
      }
    }
  }
  return factors;
}

function isPerfectSquare(value) {
  if (!Number.isInteger(value) || value < 0) {
    return false;
  }
  const root = Math.sqrt(value);
  return Number.isInteger(root);
}

function isPerfectCube(value) {
  if (!Number.isInteger(value)) {
    return false;
  }
  const root = Math.round(Math.cbrt(value));
  return root * root * root === value;
}

export function extractGcf(coeffs) {
  const arr = coefficientsToArray(coeffs);
  const nonZero = arr
    .map((value, degree) => ({ value, degree }))
    .filter((item) => !nearlyZero(item.value));

  if (nonZero.length === 0) {
    return null;
  }

  let gcfCoeff = null;
  for (const term of nonZero) {
    if (!Number.isInteger(term.value)) {
      gcfCoeff = 1;
      break;
    }
    gcfCoeff = gcfCoeff === null ? Math.abs(term.value) : gcdInt(gcfCoeff, term.value);
  }
  if (gcfCoeff === null || gcfCoeff === 0) {
    gcfCoeff = 1;
  }

  let gcfPower = Math.min(...nonZero.map((term) => term.degree));
  if (!Number.isFinite(gcfPower)) {
    gcfPower = 0;
  }

  if (gcfCoeff === 1 && gcfPower === 0) {
    return null;
  }

  const reduced = Array(arr.length - gcfPower).fill(0);
  for (let degree = gcfPower; degree < arr.length; degree += 1) {
    reduced[degree - gcfPower] = arr[degree] / gcfCoeff;
  }

  return {
    gcfCoeff,
    gcfPower,
    remaining: trimPolynomial(reduced),
  };
}

export function factorQuadratic(coeffs) {
  const arr = coefficientsToArray(coeffs);
  if (getDegree(arr) !== 2) {
    return null;
  }
  const a = arr[2];
  const b = arr[1];
  const c = arr[0];
  if (!Number.isInteger(a) || !Number.isInteger(b) || !Number.isInteger(c) || a === 0) {
    return null;
  }

  const factorsA = getIntegerFactors(a);
  const factorsC = getIntegerFactors(c);

  for (const p of factorsA) {
    if (p === 0) {
      continue;
    }
    const r = a / p;
    for (const q of factorsC) {
      if (q === 0) {
        continue;
      }
      const s = c / q;
      if (p * s + q * r === b) {
        return {
          factors: [
            { a: p, b: q },
            { a: r, b: s },
          ],
        };
      }
    }
  }
  return null;
}

export function factorDifferenceOfSquares(coeffs) {
  const arr = coefficientsToArray(coeffs);
  const nonZero = arr
    .map((value, degree) => ({ value, degree }))
    .filter((item) => !nearlyZero(item.value));

  if (nonZero.length !== 2) {
    return null;
  }

  const high = nonZero.find((item) => item.degree !== 0);
  const constant = nonZero.find((item) => item.degree === 0);
  if (!high || !constant || high.degree % 2 !== 0) {
    return null;
  }

  const a = high.value;
  const b = -constant.value;
  if (a <= 0 || b <= 0) {
    return null;
  }
  if (!isPerfectSquare(a) || !isPerfectSquare(b)) {
    return null;
  }
  const sqrtA = Math.sqrt(a);
  const sqrtB = Math.sqrt(b);
  return {
    factors: [
      { coeff: sqrtA, power: high.degree / 2, constant: -sqrtB },
      { coeff: sqrtA, power: high.degree / 2, constant: sqrtB },
    ],
  };
}

export function factorSumDifferenceCubes(coeffs) {
  const arr = coefficientsToArray(coeffs);
  const nonZero = arr
    .map((value, degree) => ({ value, degree }))
    .filter((item) => !nearlyZero(item.value));
  if (nonZero.length !== 2) {
    return null;
  }
  const high = nonZero.find((item) => item.degree === 3);
  const constant = nonZero.find((item) => item.degree === 0);
  if (!high || !constant) {
    return null;
  }

  if (!isPerfectCube(high.value) || !isPerfectCube(constant.value)) {
    return null;
  }

  const a = Math.round(Math.cbrt(high.value));
  const b = Math.round(Math.cbrt(Math.abs(constant.value)));
  const isSum = high.value > 0 && constant.value > 0;
  const isDifference = high.value > 0 && constant.value < 0;
  if (!isSum && !isDifference) {
    return null;
  }

  return {
    factors: [
      { type: 'linear', a: a, b: isSum ? b : -b },
      { type: 'quadratic', a: a * a, b: isSum ? -a * b : a * b, c: b * b },
    ],
  };
}

export function factorByGrouping(coeffs) {
  const arr = coefficientsToArray(coeffs);
  if (getDegree(arr) !== 3) {
    return null;
  }
  const a = arr[3];
  const b = arr[2];
  const c = arr[1];
  const d = arr[0];
  if (!Number.isInteger(a) || !Number.isInteger(b) || !Number.isInteger(c) || !Number.isInteger(d)) {
    return null;
  }

  const g1Coeff = gcdInt(a, b);
  const g2Coeff = gcdInt(c, d);
  if (g1Coeff === 0 || g2Coeff === 0) {
    return null;
  }

  const first = { a: a / g1Coeff, b: b / g1Coeff };
  const second = { a: c / g2Coeff, b: d / g2Coeff };

  if (first.a === second.a && first.b === second.b) {
    return {
      factors: [
        { type: 'quadratic', a: g1Coeff, b: 0, c: g2Coeff },
        { type: 'linear', a: first.a, b: first.b },
      ],
    };
  }
  return null;
}

export function formatLinearFactor(factor) {
  const { a, b } = factor;
  const aText = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
  if (b === 0) {
    return `(${aText})`;
  }
  return `(${aText}${b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`})`;
}

export function formatPowerFactor(factor) {
  const coeffText = factor.coeff === 1 ? '' : factor.coeff === -1 ? '-' : factor.coeff;
  const powerText = factor.power === 1 ? 'x' : `x^${factor.power}`;
  if (factor.constant === 0) {
    return `(${coeffText}${powerText})`;
  }
  const constantText = factor.constant > 0 ? ` + ${factor.constant}` : ` - ${Math.abs(factor.constant)}`;
  return `(${coeffText}${powerText}${constantText})`;
}

export function formatQuadraticFactor(factor) {
  const { a, b, c } = factor;
  const coeffs = [c, b, a];
  return `(${formatPolynomial(coeffs)})`;
}

export function calculateSlopeDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const slope = nearlyZero(dx) ? null : dy / dx;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const midpoint = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  const slopeIntercept = slope === null ? null : { m: slope, b: y1 - slope * x1 };
  return { slope, distance, midpoint, slopeIntercept, dx, dy };
}
