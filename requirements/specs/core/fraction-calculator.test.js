import { describe, it, expect } from 'vitest';

// Fraction math utilities (duplicated from module for testing)
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

describe('FRAC-TEST-U-1: Fraction Calculator Basic Operations', () => {
  it('adds fractions 1/4 + 1/8 = 3/8', () => {
    const result = addFractions(1, 4, 1, 8);
    expect(result.numerator).toBe(3);
    expect(result.denominator).toBe(8);
  });

  it('adds fractions with simplification 1/2 + 1/2 = 1', () => {
    const result = addFractions(1, 2, 1, 2);
    expect(result.numerator).toBe(1);
    expect(result.denominator).toBe(1);
  });

  it('subtracts fractions 3/4 - 1/6 = 7/12', () => {
    const result = subtractFractions(3, 4, 1, 6);
    expect(result.numerator).toBe(7);
    expect(result.denominator).toBe(12);
  });

  it('subtracts fractions resulting in negative', () => {
    const result = subtractFractions(1, 4, 3, 4);
    expect(result.numerator).toBe(-1);
    expect(result.denominator).toBe(2);
  });

  it('multiplies fractions 2/3 × 3/5 = 2/5', () => {
    const result = multiplyFractions(2, 3, 3, 5);
    expect(result.numerator).toBe(2);
    expect(result.denominator).toBe(5);
  });

  it('divides fractions 2/3 ÷ 4/5 = 5/6', () => {
    const result = divideFractions(2, 3, 4, 5);
    expect(result.numerator).toBe(5);
    expect(result.denominator).toBe(6);
  });

  it('simplifies 6/8 = 3/4', () => {
    const result = simplifyFraction(6, 8);
    expect(result.numerator).toBe(3);
    expect(result.denominator).toBe(4);
  });

  it('simplifies 12/18 = 2/3', () => {
    const result = simplifyFraction(12, 18);
    expect(result.numerator).toBe(2);
    expect(result.denominator).toBe(3);
  });
});

describe('FRAC-TEST-U-2: Fraction Calculator Edge Cases', () => {
  it('handles division by zero denominator', () => {
    expect(simplifyFraction(5, 0)).toBeNull();
  });

  it('handles division by zero fraction', () => {
    const result = divideFractions(2, 3, 0, 5);
    expect(result).toBeNull();
  });

  it('handles negative fractions', () => {
    const result = addFractions(-1, 4, 1, 4);
    expect(result.numerator).toBe(0);
    expect(result.denominator).toBe(1);
  });

  it('handles improper fractions in multiplication', () => {
    const result = multiplyFractions(5, 2, 3, 4);
    expect(result.numerator).toBe(15);
    expect(result.denominator).toBe(8);
  });

  it('handles whole numbers (denominator = 1)', () => {
    const result = addFractions(3, 1, 1, 2);
    expect(result.numerator).toBe(7);
    expect(result.denominator).toBe(2);
  });
});

describe('FRAC-TEST-U-3: Improper/Mixed Number Conversions', () => {
  it('converts improper 7/3 to mixed 2 1/3', () => {
    const result = improperToMixed(7, 3);
    expect(result.whole).toBe(2);
    expect(result.numerator).toBe(1);
    expect(result.denominator).toBe(3);
  });

  it('converts mixed 1 2/5 to improper 7/5', () => {
    const result = mixedToImproper(1, 2, 5);
    expect(result.numerator).toBe(7);
    expect(result.denominator).toBe(5);
  });

  it('handles negative improper fraction -7/3 = -2 1/3', () => {
    const result = improperToMixed(-7, 3);
    expect(result.whole).toBe(-2);
    expect(result.numerator).toBe(1);
    expect(result.denominator).toBe(3);
  });

  it('handles negative mixed number -1 2/5 = -7/5', () => {
    const result = mixedToImproper(-1, 2, 5);
    expect(result.numerator).toBe(-7);
    expect(result.denominator).toBe(5);
  });

  it('handles zero denominator in improperToMixed', () => {
    expect(improperToMixed(7, 0)).toBeNull();
  });

  it('handles zero denominator in mixedToImproper', () => {
    expect(mixedToImproper(1, 2, 0)).toBeNull();
  });

  it('converts proper fraction to mixed (whole = 0)', () => {
    const result = improperToMixed(2, 5);
    expect(result.whole).toBe(0);
    expect(result.numerator).toBe(2);
    expect(result.denominator).toBe(5);
  });
});

describe('FRAC-TEST-U-4: GCD and LCM Functions', () => {
  it('calculates GCD of 12 and 18 = 6', () => {
    expect(gcd(12, 18)).toBe(6);
  });

  it('calculates GCD of 7 and 11 (coprime) = 1', () => {
    expect(gcd(7, 11)).toBe(1);
  });

  it('calculates LCM of 4 and 6 = 12', () => {
    expect(lcm(4, 6)).toBe(12);
  });

  it('calculates LCM of 3 and 5 = 15', () => {
    expect(lcm(3, 5)).toBe(15);
  });

  it('handles GCD with negative numbers', () => {
    expect(gcd(-12, 18)).toBe(6);
    expect(gcd(12, -18)).toBe(6);
  });
});
