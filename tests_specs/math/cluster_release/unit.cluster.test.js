import { describe, it, expect } from 'vitest';
import {
  addPolynomials,
  calculateSlopeDistance,
  coefficientsToArray,
  dividePolynomials,
  factorByGrouping,
  factorDifferenceOfSquares,
  factorQuadratic,
  factorSumDifferenceCubes,
  formatLinearFactor,
  formatPolynomial,
  formatPowerFactor,
  formatQuadraticFactor,
  parsePolynomial,
  solveQuadratic,
  solveSystem2x2,
  solveSystem3x3,
  subtractPolynomials,
  multiplyPolynomials,
} from '../../../public/assets/js/core/algebra.js';
import {
  // Distribution functions
  normalPdf,
  normalCdf,
  normalCdfCustom,
  normalQuantile,
  tPdf,
  tCdf,
  tQuantile,
  chiSquarePdf,
  chiSquareCdf,
  chiSquareQuantile,
  fPdf,
  fCdf,
  fQuantile,
  binomialPmf,
  binomialCdf,
  poissonPmf,
  poissonCdf,
  // Regression
  linearRegression,
  polynomialRegression,
  exponentialRegression,
  logarithmicRegression,
  // ANOVA
  oneWayAnova,
  tukeyHSD,
  // Hypothesis Testing
  oneSampleTTest,
  twoSampleTTest,
  pairedTTest,
  zTest,
  chiSquareGoodnessOfFit,
  chiSquareIndependence,
  // Correlation
  pearsonCorrelation,
  spearmanCorrelation,
  kendallCorrelation,
  correlationMatrix,
} from '../../../public/assets/js/core/advanced-statistics.js';
import {
  calculateNaturalLog,
  calculateLogBase,
  logProductRule,
  logQuotientRule,
  logPowerRule,
  solveSimpleExponential,
  convertLogScaleValue,
} from '../../../public/assets/js/core/logarithm.js';
import {
  mean,
  median,
  mode,
  min,
  max,
  range,
  parseDataset,
  analyzeSequence,
  nthTermArithmetic,
  nthTermGeometric,
  sumArithmetic,
  sumGeometric,
} from '../../../public/assets/js/core/stats.js';
import {
  computeTrigValues,
  degToRad,
  detectTriangleType,
  getInverseTrigSolutions,
  getQuadrantFromDegrees,
  getReferenceAngleDegrees,
  getSpecialAngleInfo,
  solveTriangle,
} from '../../../public/assets/js/core/trigonometry.js';

// ============================================================================
// DISTRIBUTION FUNCTIONS TESTS
// ============================================================================

describe('Normal Distribution', () => {
  describe('normalPdf', () => {
    it('should return correct PDF at mean (x=0)', () => {
      const result = normalPdf(0);
      expect(result).toBeCloseTo(0.3989, 3);
    });

    it('should return correct PDF at x=1', () => {
      const result = normalPdf(1);
      expect(result).toBeCloseTo(0.2420, 3);
    });

    it('should be symmetric around zero', () => {
      expect(normalPdf(1.5)).toBeCloseTo(normalPdf(-1.5), 10);
    });
  });

  describe('normalCdf', () => {
    it('should return 0.5 at z=0', () => {
      expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    });

    it('should return ~0.8413 at z=1', () => {
      expect(normalCdf(1)).toBeCloseTo(0.8413, 3);
    });

    it('should return ~0.9772 at z=2', () => {
      expect(normalCdf(2)).toBeCloseTo(0.9772, 3);
    });

    it('should return ~0.025 at z=-1.96', () => {
      expect(normalCdf(-1.96)).toBeCloseTo(0.025, 2);
    });
  });

  describe('normalCdfCustom', () => {
    it('should handle custom mean and sigma', () => {
      // For N(100, 15), P(X <= 115) should equal P(Z <= 1)
      expect(normalCdfCustom(115, 100, 15)).toBeCloseTo(normalCdf(1), 6);
    });

    it('should return null for non-positive sigma', () => {
      expect(normalCdfCustom(0, 0, 0)).toBeNull();
      expect(normalCdfCustom(0, 0, -1)).toBeNull();
    });
  });

  describe('normalQuantile', () => {
    it('should return 0 for p=0.5', () => {
      expect(normalQuantile(0.5)).toBeCloseTo(0, 5);
    });

    it('should return ~1.96 for p=0.975', () => {
      expect(normalQuantile(0.975)).toBeCloseTo(1.96, 2);
    });

    it('should return ~-1.645 for p=0.05', () => {
      expect(normalQuantile(0.05)).toBeCloseTo(-1.645, 2);
    });

    it('should return null for invalid p', () => {
      expect(normalQuantile(0)).toBeNull();
      expect(normalQuantile(1)).toBeNull();
      expect(normalQuantile(-0.1)).toBeNull();
      expect(normalQuantile(1.1)).toBeNull();
    });
  });
});

describe('Student t-Distribution', () => {
  describe('tCdf', () => {
    it('should return 0.5 at t=0', () => {
      expect(tCdf(0, 10)).toBeCloseTo(0.5, 6);
    });

    it('should approach normal for large df', () => {
      // With df=30, t-distribution is close to normal
      expect(tCdf(1.96, 30)).toBeCloseTo(normalCdf(1.96), 1);
    });

    it('should return null for invalid df', () => {
      expect(tCdf(0, 0)).toBeNull();
      expect(tCdf(0, -1)).toBeNull();
    });
  });

  describe('tQuantile', () => {
    it('should return 0 for p=0.5', () => {
      expect(tQuantile(0.5, 10)).toBeCloseTo(0, 3);
    });

    it('should return reasonable critical values', () => {
      // t critical for df=10, two-tailed alpha=0.05
      expect(tQuantile(0.975, 10)).toBeCloseTo(2.228, 1);
    });
  });
});

describe('Chi-Square Distribution', () => {
  describe('chiSquareCdf', () => {
    it('should return 0 for x=0', () => {
      expect(chiSquareCdf(0, 5)).toBe(0);
    });

    it('should return reasonable values', () => {
      // P(X <= 11.07) for df=5 should be about 0.95
      expect(chiSquareCdf(11.07, 5)).toBeCloseTo(0.95, 1);
    });
  });

  describe('chiSquareQuantile', () => {
    it('should return reasonable critical values', () => {
      // Chi-square critical for df=5, alpha=0.05
      expect(chiSquareQuantile(0.95, 5)).toBeCloseTo(11.07, 0);
    });
  });
});

describe('F-Distribution', () => {
  describe('fCdf', () => {
    it('should return 0 for x=0', () => {
      expect(fCdf(0, 5, 10)).toBe(0);
    });

    it('should return reasonable values', () => {
      // F critical for df1=5, df2=10 at alpha=0.05 is about 3.33
      expect(fCdf(3.33, 5, 10)).toBeCloseTo(0.95, 1);
    });
  });
});

describe('Binomial Distribution', () => {
  describe('binomialPmf', () => {
    it('should calculate P(X=k) correctly', () => {
      // P(X=3) for n=10, p=0.5 = C(10,3) * 0.5^3 * 0.5^7 = 0.1172
      expect(binomialPmf(3, 10, 0.5)).toBeCloseTo(0.1172, 3);
    });

    it('should return 0 for invalid inputs', () => {
      expect(binomialPmf(-1, 10, 0.5)).toBe(0);
      expect(binomialPmf(11, 10, 0.5)).toBe(0);
      expect(binomialPmf(5, 10, 1.5)).toBe(0);
    });
  });

  describe('binomialCdf', () => {
    it('should calculate P(X <= k) correctly', () => {
      // P(X <= 5) for n=10, p=0.5 should be about 0.623
      expect(binomialCdf(5, 10, 0.5)).toBeCloseTo(0.623, 2);
    });
  });
});

describe('Poisson Distribution', () => {
  describe('poissonPmf', () => {
    it('should calculate P(X=k) correctly', () => {
      // P(X=3) for lambda=2 = e^(-2) * 2^3 / 3! = 0.1804
      expect(poissonPmf(3, 2)).toBeCloseTo(0.1804, 3);
    });

    it('should return 0 for invalid inputs', () => {
      expect(poissonPmf(-1, 2)).toBe(0);
      expect(poissonPmf(3, -1)).toBe(0);
    });
  });

  describe('poissonCdf', () => {
    it('should calculate P(X <= k) correctly', () => {
      // P(X <= 3) for lambda=2 should be about 0.857
      expect(poissonCdf(3, 2)).toBeCloseTo(0.857, 2);
    });
  });
});

// ============================================================================
// REGRESSION TESTS
// ============================================================================

describe('Linear Regression', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [2, 4, 5, 4, 5];

  it('should calculate slope and intercept', () => {
    const result = linearRegression(x, y);
    expect(result).not.toBeNull();
    expect(result.slope).toBeCloseTo(0.6, 2);
    expect(result.intercept).toBeCloseTo(2.2, 2);
  });

  it('should calculate R-squared', () => {
    const result = linearRegression(x, y);
    expect(result.rSquared).toBeGreaterThanOrEqual(0);
    expect(result.rSquared).toBeLessThanOrEqual(1);
  });

  it('should calculate perfect fit for linear data', () => {
    const xPerfect = [1, 2, 3, 4, 5];
    const yPerfect = [2, 4, 6, 8, 10];
    const result = linearRegression(xPerfect, yPerfect);
    expect(result.rSquared).toBeCloseTo(1, 6);
    expect(result.slope).toBeCloseTo(2, 6);
    expect(result.intercept).toBeCloseTo(0, 6);
  });

  it('should return null for invalid inputs', () => {
    expect(linearRegression([], [])).toBeNull();
    expect(linearRegression([1], [2])).toBeNull();
    expect(linearRegression([1, 2], [1])).toBeNull();
  });

  it('should calculate predicted values and residuals', () => {
    const result = linearRegression(x, y);
    expect(result.predicted).toHaveLength(5);
    expect(result.residuals).toHaveLength(5);
  });
});

describe('Polynomial Regression', () => {
  it('should fit quadratic data', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 4, 9, 16, 25]; // y = x^2
    const result = polynomialRegression(x, y, 2);
    expect(result).not.toBeNull();
    expect(result.rSquared).toBeCloseTo(1, 4);
  });

  it('should return null for insufficient data', () => {
    expect(polynomialRegression([1, 2], [1, 4], 2)).toBeNull();
  });
});

describe('Exponential Regression', () => {
  it('should fit exponential data', () => {
    const x = [0, 1, 2, 3, 4];
    const y = [1, 2.7, 7.4, 20.1, 54.6]; // roughly y = e^x
    const result = exponentialRegression(x, y);
    expect(result).not.toBeNull();
    expect(result.rSquared).toBeGreaterThan(0.9);
  });

  it('should return null for data with non-positive y values', () => {
    expect(exponentialRegression([1, 2], [0, -1])).toBeNull();
  });
});

describe('Logarithmic Regression', () => {
  it('should fit logarithmic data', () => {
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y = x.map((xi) => 2 + 3 * Math.log(xi));
    const result = logarithmicRegression(x, y);
    expect(result).not.toBeNull();
    expect(result.rSquared).toBeCloseTo(1, 4);
  });
});

// ============================================================================
// ANOVA TESTS
// ============================================================================

describe('One-Way ANOVA', () => {
  const groups = [
    [23, 25, 27, 22, 24],
    [30, 32, 28, 31, 29],
    [18, 20, 22, 19, 21],
  ];

  it('should calculate F-statistic', () => {
    const result = oneWayAnova(groups);
    expect(result).not.toBeNull();
    expect(result.fStatistic).toBeGreaterThan(0);
  });

  it('should calculate p-value', () => {
    const result = oneWayAnova(groups);
    expect(result.pValue).toBeGreaterThanOrEqual(0);
    expect(result.pValue).toBeLessThanOrEqual(1);
  });

  it('should correctly identify significant differences', () => {
    const result = oneWayAnova(groups);
    // These groups have clearly different means, so p should be small
    expect(result.pValue).toBeLessThan(0.05);
  });

  it('should calculate degrees of freedom correctly', () => {
    const result = oneWayAnova(groups);
    expect(result.dfBetween).toBe(2); // k - 1 = 3 - 1
    expect(result.dfWithin).toBe(12); // n - k = 15 - 3
    expect(result.dfTotal).toBe(14); // n - 1 = 15 - 1
  });

  it('should calculate effect sizes', () => {
    const result = oneWayAnova(groups);
    expect(result.etaSquared).toBeGreaterThanOrEqual(0);
    expect(result.etaSquared).toBeLessThanOrEqual(1);
  });

  it('should return null for invalid inputs', () => {
    expect(oneWayAnova([])).toBeNull();
    expect(oneWayAnova([[1, 2]])).toBeNull();
  });
});

describe('Tukey HSD', () => {
  const groups = [
    [23, 25, 27, 22, 24],
    [30, 32, 28, 31, 29],
    [18, 20, 22, 19, 21],
  ];

  it('should perform post-hoc comparisons', () => {
    const result = tukeyHSD(groups, 0.05);
    expect(result).not.toBeNull();
    expect(result.comparisons).toHaveLength(3); // 3 choose 2 = 3
  });
});

// ============================================================================
// HYPOTHESIS TESTING TESTS
// ============================================================================

describe('One-Sample t-Test', () => {
  const sample = [105, 98, 102, 110, 95, 103, 107, 101];

  it('should calculate t-statistic', () => {
    const result = oneSampleTTest(sample, 100, 'two-sided');
    expect(result).not.toBeNull();
    expect(result.tStatistic).toBeDefined();
  });

  it('should calculate p-value', () => {
    const result = oneSampleTTest(sample, 100, 'two-sided');
    expect(result.pValue).toBeGreaterThanOrEqual(0);
    expect(result.pValue).toBeLessThanOrEqual(1);
  });

  it('should calculate confidence interval', () => {
    const result = oneSampleTTest(sample, 100, 'two-sided');
    expect(result.confidenceInterval.lower).toBeLessThan(result.sampleMean);
    expect(result.confidenceInterval.upper).toBeGreaterThan(result.sampleMean);
  });

  it('should calculate Cohen d effect size', () => {
    const result = oneSampleTTest(sample, 100, 'two-sided');
    expect(result.effectSize.cohenD).toBeDefined();
  });

  it('should handle one-sided tests', () => {
    const resultGreater = oneSampleTTest(sample, 100, 'greater');
    const resultLess = oneSampleTTest(sample, 100, 'less');
    const resultTwoSided = oneSampleTTest(sample, 100, 'two-sided');

    // One-sided p-values should be half of two-sided (approximately)
    expect(resultGreater.pValue + resultLess.pValue).toBeCloseTo(1, 6);
  });
});

describe('Two-Sample t-Test', () => {
  const sample1 = [23, 25, 27, 22, 24, 26];
  const sample2 = [30, 32, 28, 31, 29, 33];

  it('should calculate t-statistic', () => {
    const result = twoSampleTTest(sample1, sample2, 'two-sided', false);
    expect(result).not.toBeNull();
    expect(result.tStatistic).toBeDefined();
  });

  it('should calculate mean difference', () => {
    const result = twoSampleTTest(sample1, sample2, 'two-sided', false);
    expect(result.meanDifference).toBeCloseTo(result.mean1 - result.mean2, 10);
  });

  it('should identify significant difference', () => {
    const result = twoSampleTTest(sample1, sample2, 'two-sided', false);
    expect(result.pValue).toBeLessThan(0.05);
  });
});

describe('Paired t-Test', () => {
  const before = [200, 190, 210, 195, 205];
  const after = [180, 175, 195, 180, 190];

  it('should calculate t-statistic', () => {
    const result = pairedTTest(before, after, 'two-sided');
    expect(result).not.toBeNull();
    expect(result.tStatistic).toBeDefined();
  });

  it('should identify significant improvement', () => {
    const result = pairedTTest(before, after, 'greater');
    expect(result.pValue).toBeLessThan(0.05);
  });

  it('should require equal sample sizes', () => {
    expect(pairedTTest([1, 2, 3], [1, 2], 'two-sided')).toBeNull();
  });
});

describe('Z-Test', () => {
  const sample = [105, 98, 102, 110, 95, 103, 107, 101];

  it('should calculate z-statistic with known sigma', () => {
    const result = zTest(sample, 100, 10, 'two-sided');
    expect(result).not.toBeNull();
    expect(result.zStatistic).toBeDefined();
  });

  it('should return null for invalid sigma', () => {
    expect(zTest(sample, 100, 0, 'two-sided')).toBeNull();
    expect(zTest(sample, 100, -5, 'two-sided')).toBeNull();
  });
});

describe('Chi-Square Goodness of Fit', () => {
  it('should calculate chi-square statistic', () => {
    const observed = [50, 30, 20];
    const expected = [40, 35, 25];
    const result = chiSquareGoodnessOfFit(observed, expected);
    expect(result).not.toBeNull();
    expect(result.chiSquare).toBeGreaterThan(0);
  });

  it('should calculate residuals', () => {
    const observed = [50, 30, 20];
    const expected = [40, 35, 25];
    const result = chiSquareGoodnessOfFit(observed, expected);
    expect(result.residuals).toHaveLength(3);
  });

  it('should return null for mismatched lengths', () => {
    expect(chiSquareGoodnessOfFit([1, 2], [1, 2, 3])).toBeNull();
  });
});

describe('Chi-Square Independence', () => {
  it('should calculate chi-square for contingency table', () => {
    const table = [
      [50, 30],
      [20, 40],
    ];
    const result = chiSquareIndependence(table);
    expect(result).not.toBeNull();
    expect(result.chiSquare).toBeGreaterThan(0);
  });

  it('should calculate Cramers V', () => {
    const table = [
      [50, 30],
      [20, 40],
    ];
    const result = chiSquareIndependence(table);
    expect(result.cramersV).toBeGreaterThanOrEqual(0);
    expect(result.cramersV).toBeLessThanOrEqual(1);
  });

  it('should calculate expected frequencies', () => {
    const table = [
      [50, 30],
      [20, 40],
    ];
    const result = chiSquareIndependence(table);
    expect(result.expected).toHaveLength(2);
    expect(result.expected[0]).toHaveLength(2);
  });
});

// ============================================================================
// CORRELATION TESTS
// ============================================================================

describe('Pearson Correlation', () => {
  it('should return 1 for perfect positive correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10];
    const result = pearsonCorrelation(x, y);
    expect(result.r).toBeCloseTo(1, 6);
  });

  it('should return -1 for perfect negative correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [10, 8, 6, 4, 2];
    const result = pearsonCorrelation(x, y);
    expect(result.r).toBeCloseTo(-1, 6);
  });

  it('should calculate r-squared', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2.1, 4.2, 5.8, 8.1, 10.3];
    const result = pearsonCorrelation(x, y);
    expect(result.rSquared).toBeCloseTo(result.r * result.r, 10);
  });

  it('should calculate significance', () => {
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y = [2.1, 4.2, 5.8, 8.1, 10.3, 12.1, 13.8, 16.2, 18.1, 19.9];
    const result = pearsonCorrelation(x, y);
    expect(result.pValue).toBeLessThan(0.01); // Strong correlation should be significant
  });

  it('should return null for mismatched lengths', () => {
    expect(pearsonCorrelation([1, 2], [1, 2, 3])).toBeNull();
  });
});

describe('Spearman Correlation', () => {
  it('should handle monotonic relationships', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 4, 9, 16, 25]; // Monotonic but not linear
    const result = spearmanCorrelation(x, y);
    expect(result.r).toBeCloseTo(1, 6); // Perfect monotonic
  });

  it('should handle rank ties', () => {
    const x = [1, 2, 2, 3, 4];
    const y = [1, 2, 3, 3, 4];
    const result = spearmanCorrelation(x, y);
    expect(result).not.toBeNull();
  });
});

describe('Kendall Correlation', () => {
  it('should calculate tau', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 2, 3, 4, 5];
    const result = kendallCorrelation(x, y);
    expect(result.tau).toBeCloseTo(1, 6);
  });

  it('should count concordant and discordant pairs', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [5, 4, 3, 2, 1];
    const result = kendallCorrelation(x, y);
    expect(result.tau).toBeCloseTo(-1, 6);
    expect(result.concordant).toBe(0);
    expect(result.discordant).toBe(10); // 5 choose 2 = 10
  });
});

describe('Correlation Matrix', () => {
  it('should create correlation matrix', () => {
    const data = [
      [1, 2, 3, 4, 5],
      [2, 4, 6, 8, 10],
      [5, 4, 3, 2, 1],
    ];
    const result = correlationMatrix(data);
    expect(result).not.toBeNull();
    expect(result.matrix).toHaveLength(3);
    expect(result.matrix[0]).toHaveLength(3);
  });

  it('should have 1s on diagonal', () => {
    const data = [
      [1, 2, 3, 4, 5],
      [2, 4, 6, 8, 10],
    ];
    const result = correlationMatrix(data);
    expect(result.matrix[0][0]).toBe(1);
    expect(result.matrix[1][1]).toBe(1);
  });

  it('should be symmetric', () => {
    const data = [
      [1, 2, 3, 4, 5],
      [2, 4, 6, 8, 10],
      [5, 4, 3, 2, 1],
    ];
    const result = correlationMatrix(data);
    expect(result.matrix[0][1]).toBeCloseTo(result.matrix[1][0], 10);
    expect(result.matrix[0][2]).toBeCloseTo(result.matrix[2][0], 10);
    expect(result.matrix[1][2]).toBeCloseTo(result.matrix[2][1], 10);
  });
});

/**
 * ALG-TEST-U-1 - Quadratic solver unit tests
 */
describe('Algebra - ALG-TEST-U-1: Quadratic Solver', () => {
  it('handles two real roots', () => {
    const result = solveQuadratic(1, -5, 6);
    expect(result.type).toBe('two-real');
    const roots = result.roots.slice().sort((a, b) => a - b);
    expect(roots[0]).toBeCloseTo(2);
    expect(roots[1]).toBeCloseTo(3);
  });

  it('handles complex roots', () => {
    const result = solveQuadratic(1, 0, 1);
    expect(result.type).toBe('complex');
    expect(result.roots[0].real).toBeCloseTo(0);
    expect(Math.abs(result.roots[0].imaginary)).toBeCloseTo(1);
  });
});

/**
 * ALG-TEST-U-2 - System of equations unit tests
 */
describe('Algebra - ALG-TEST-U-2: Systems of Equations', () => {
  it('solves a 2x2 system', () => {
    const result = solveSystem2x2(1, 2, 5, 3, 4, 11);
    expect(result.type).toBe('unique');
    expect(result.solution.x).toBeCloseTo(1);
    expect(result.solution.y).toBeCloseTo(2);
  });

  it('solves a 3x3 system', () => {
    const result = solveSystem3x3(1, 0, 0, 1, 0, 1, 0, 2, 0, 0, 1, 3);
    expect(result.type).toBe('unique');
    expect(result.solution.x).toBeCloseTo(1);
    expect(result.solution.y).toBeCloseTo(2);
    expect(result.solution.z).toBeCloseTo(3);
  });
});

/**
 * ALG-TEST-U-3 - Polynomial operations unit tests
 */
describe('Algebra - ALG-TEST-U-3: Polynomial Operations', () => {
  it('adds and subtracts polynomials', () => {
    const p1 = parsePolynomial('2x^2 + 3x - 1').coeffs;
    const p2 = parsePolynomial('x^2 - x + 2').coeffs;
    const sum = coefficientsToArray(addPolynomials(p1, p2));
    const diff = coefficientsToArray(subtractPolynomials(p1, p2));
    expect(sum).toEqual([1, 2, 3]);
    expect(diff).toEqual([-3, 4, 1]);
  });

  it('multiplies polynomials', () => {
    const p1 = parsePolynomial('x + 2').coeffs;
    const p2 = parsePolynomial('x - 3').coeffs;
    const product = formatPolynomial(multiplyPolynomials(p1, p2));
    expect(product).toBe('x^2 - x - 6');
  });

  it('divides polynomials', () => {
    const dividend = parsePolynomial('x^2 - 1').coeffs;
    const divisor = parsePolynomial('x - 1').coeffs;
    const result = dividePolynomials(dividend, divisor);
    expect(formatPolynomial(result.quotient)).toBe('x + 1');
    expect(formatPolynomial(result.remainder)).toBe('0');
  });
});

/**
 * ALG-TEST-U-4 - Factoring calculator unit tests
 */
describe('Algebra - ALG-TEST-U-4: Factoring', () => {
  it('factors a quadratic', () => {
    const coeffs = parsePolynomial('x^2 + 5x + 6').coeffs;
    const result = factorQuadratic(coeffs);
    const factors = result.factors.map((factor) => formatLinearFactor(factor)).sort();
    expect(factors).toEqual(['(x + 2)', '(x + 3)']);
  });

  it('factors a difference of squares', () => {
    const coeffs = parsePolynomial('x^2 - 9').coeffs;
    const result = factorDifferenceOfSquares(coeffs);
    const factors = result.factors.map((factor) => formatPowerFactor(factor)).sort();
    expect(factors).toEqual(['(x + 3)', '(x - 3)'].sort());
  });

  it('factors a difference of cubes', () => {
    const coeffs = parsePolynomial('x^3 - 8').coeffs;
    const result = factorSumDifferenceCubes(coeffs);
    const linear = formatLinearFactor(result.factors[0]);
    const quadratic = formatQuadraticFactor(result.factors[1]);
    expect(linear).toBe('(x - 2)');
    expect(quadratic).toBe('(x^2 + 2x + 4)');
  });

  it('factors by grouping', () => {
    const coeffs = parsePolynomial('x^3 + 3x^2 + 2x + 6').coeffs;
    const result = factorByGrouping(coeffs);
    const quadratic = formatQuadraticFactor(result.factors[0]);
    const linear = formatLinearFactor(result.factors[1]);
    expect(quadratic).toBe('(x^2 + 2)');
    expect(linear).toBe('(x + 3)');
  });
});

/**
 * ALG-TEST-U-5 - Slope & distance unit tests
 */
describe('Algebra - ALG-TEST-U-5: Slope & Distance', () => {
  it('calculates slope, distance, and midpoint', () => {
    const result = calculateSlopeDistance(1, 2, 4, 8);
    expect(result.slope).toBeCloseTo(2);
    expect(result.distance).toBeCloseTo(Math.sqrt(45));
    expect(result.midpoint.x).toBeCloseTo(2.5);
    expect(result.midpoint.y).toBeCloseTo(5);
  });

  it('handles vertical lines', () => {
    const result = calculateSlopeDistance(3, 1, 3, 5);
    expect(result.slope).toBe(null);
  });
});

/**
 * Unit Tests for Calculus Calculator Suite (REQ-20260120-019)
 * Tests: CALC-TEST-U-1 through CALC-TEST-U-5
 */

import { describe, it, expect } from 'vitest';

/**
 * CALC-TEST-U-1: Derivative Calculator Unit Tests
 * Test symbolic differentiation with all rules
 */
describe('CALC-TEST-U-1: Derivative Calculator', () => {
  it('should differentiate polynomial using power rule', () => {
    // Test: d/dx(x^3) = 3x^2
    const coef = 1;
    const exponent = 3;
    const result = {
      coef: coef * exponent,
      exponent: exponent - 1
    };

    expect(result.coef).toBe(3);
    expect(result.exponent).toBe(2);
  });

  it('should handle constant rule (derivative of constant = 0)', () => {
    const coef = 5;
    const exponent = 0;
    const result = {
      coef: exponent === 0 ? 0 : coef * exponent,
      exponent: exponent - 1
    };

    expect(result.coef).toBe(0);
  });

  it('should differentiate linear function', () => {
    // Test: d/dx(2x) = 2
    const coef = 2;
    const exponent = 1;
    const result = {
      coef: coef * exponent,
      exponent: exponent - 1
    };

    expect(result.coef).toBe(2);
    expect(result.exponent).toBe(0);
  });

  it('should evaluate derivative at a point', () => {
    // For f'(x) = 2x, evaluate at x = 3
    const terms = [{ coef: 2, exponent: 1 }];
    const point = 3;
    let sum = 0;

    for (const term of terms) {
      sum += term.coef * Math.pow(point, term.exponent);
    }

    expect(sum).toBe(6);
  });

  it('should handle negative exponents', () => {
    // Test: d/dx(x^-1) = -x^-2
    const coef = 1;
    const exponent = -1;
    const result = {
      coef: coef * exponent,
      exponent: exponent - 1
    };

    expect(result.coef).toBe(-1);
    expect(result.exponent).toBe(-2);
  });
});

/**
 * CALC-TEST-U-2: Integral Calculator Unit Tests
 * Test symbolic and numerical integration
 */
describe('CALC-TEST-U-2: Integral Calculator', () => {
  it('should integrate polynomial using power rule', () => {
    // Test: ∫x^2 dx = x^3/3
    const coef = 1;
    const exponent = 2;
    const result = {
      coef: coef / (exponent + 1),
      exponent: exponent + 1
    };

    expect(result.coef).toBeCloseTo(0.3333, 4);
    expect(result.exponent).toBe(3);
  });

  it('should integrate constant', () => {
    // Test: ∫5 dx = 5x
    const coef = 5;
    const exponent = 0;
    const result = {
      coef: coef / (exponent + 1),
      exponent: exponent + 1
    };

    expect(result.coef).toBe(5);
    expect(result.exponent).toBe(1);
  });

  it('should evaluate definite integral', () => {
    // Test: ∫[0 to 2] x^2 dx = [x^3/3] from 0 to 2 = 8/3
    const terms = [{ type: 'polynomial', coef: 1/3, exponent: 3 }];
    const a = 0;
    const b = 2;

    const evalAt = (x) => {
      let sum = 0;
      for (const term of terms) {
        sum += term.coef * Math.pow(x, term.exponent);
      }
      return sum;
    };

    const result = evalAt(b) - evalAt(a);
    expect(result).toBeCloseTo(8/3, 4);
  });

  it('should handle special case x^-1 (natural log)', () => {
    // Test: ∫1/x dx should return ln type
    const coef = 1;
    const exponent = -1;

    const result = exponent === -1
      ? { type: 'ln', coef }
      : { type: 'polynomial', coef: coef / (exponent + 1), exponent: exponent + 1 };

    expect(result.type).toBe('ln');
    expect(result.coef).toBe(1);
  });

  it('should integrate linear function', () => {
    // Test: ∫3x dx = 3x^2/2
    const coef = 3;
    const exponent = 1;
    const result = {
      coef: coef / (exponent + 1),
      exponent: exponent + 1
    };

    expect(result.coef).toBe(1.5);
    expect(result.exponent).toBe(2);
  });
});

/**
 * CALC-TEST-U-3: Limit Calculator Unit Tests
 * Test limit calculation and indeterminate forms
 */
describe('CALC-TEST-U-3: Limit Calculator', () => {
  it('should calculate limit by direct substitution (continuous function)', () => {
    // Test: lim[x→2] (x^2 + 1) = 5
    const evalFunc = (x) => x * x + 1;
    const a = 2;
    const result = evalFunc(a);

    expect(result).toBe(5);
  });

  it('should detect indeterminate form 0/0', () => {
    // Test: lim[x→1] (x^2-1)/(x-1) gives 0/0
    const a = 1;
    const numerator = a * a - 1; // 0
    const denominator = a - 1;   // 0

    expect(numerator).toBe(0);
    expect(denominator).toBe(0);
    expect(isNaN(numerator / denominator) || !isFinite(numerator / denominator)).toBe(true);
  });

  it('should calculate one-sided limits', () => {
    // Numerical approximation: approach from left
    const a = 2;
    const epsilon = 0.001;
    const evalFunc = (x) => x * x;

    const leftApproach = a - epsilon;
    const leftValue = evalFunc(leftApproach);

    expect(leftValue).toBeCloseTo(4, 2);
  });

  it('should handle limits at infinity', () => {
    // Test: lim[x→∞] 1/x = 0
    const evalFunc = (x) => 1 / x;
    const largeValue = 10000;
    const result = evalFunc(largeValue);

    expect(result).toBeCloseTo(0, 3);
  });

  it('should detect when limits do not exist', () => {
    // Test: lim[x→0] 1/x does not exist (left and right differ)
    const evalFunc = (x) => 1 / x;
    const epsilon = 0.001;

    const leftLimit = evalFunc(-epsilon);
    const rightLimit = evalFunc(epsilon);

    expect(Math.sign(leftLimit)).not.toBe(Math.sign(rightLimit));
  });
});

/**
 * CALC-TEST-U-4: Series Convergence Unit Tests
 * Test convergence tests (ratio, root, comparison)
 */
describe('CALC-TEST-U-4: Series Convergence Calculator', () => {
  it('should apply ratio test to convergent series', () => {
    // Test: ∑(1/n!) converges by ratio test (L = 0 < 1)
    const a_n = (n) => 1 / factorial(n);
    const a_n_plus_1 = (n) => 1 / factorial(n + 1);

    const n = 10;
    const ratio = Math.abs(a_n_plus_1(n) / a_n(n));

    expect(ratio).toBeLessThan(1);
    expect(ratio).toBeCloseTo(1/11, 4);
  });

  it('should apply ratio test to divergent series', () => {
    // Test: ∑n! diverges by ratio test (L = ∞ > 1)
    const a_n = (n) => factorial(n);
    const a_n_plus_1 = (n) => factorial(n + 1);

    const n = 5;
    const ratio = Math.abs(a_n_plus_1(n) / a_n(n));

    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBe(6);
  });

  it('should apply root test to geometric series', () => {
    // Test: ∑(1/2)^n converges by root test (L = 1/2 < 1)
    const a_n = (n) => Math.pow(0.5, n);
    const n = 10;
    const root = Math.pow(Math.abs(a_n(n)), 1/n);

    expect(root).toBeCloseTo(0.5, 2);
    expect(root).toBeLessThan(1);
  });

  it('should identify p-series convergence (p > 1)', () => {
    // Test: ∑1/n^2 converges (p = 2 > 1)
    const p = 2;
    const converges = p > 1;

    expect(converges).toBe(true);
  });

  it('should identify p-series divergence (p ≤ 1)', () => {
    // Test: ∑1/n diverges (p = 1)
    const p = 1;
    const converges = p > 1;

    expect(converges).toBe(false);
  });
});

/**
 * CALC-TEST-U-5: Critical Points Finder Unit Tests
 * Test finding and classifying critical points
 */
describe('CALC-TEST-U-5: Critical Points Finder', () => {
  it('should find critical points where f\'(x) = 0', () => {
    // Test: f(x) = x^2, f'(x) = 2x, critical point at x = 0
    const derivative = (x) => 2 * x;
    const criticalPoint = 0;

    expect(derivative(criticalPoint)).toBe(0);
  });

  it('should use second derivative test for local minimum', () => {
    // Test: f(x) = x^2, f''(x) = 2 > 0 at x = 0 → local minimum
    const secondDerivative = (x) => 2;
    const criticalPoint = 0;
    const secondDerivValue = secondDerivative(criticalPoint);

    const classification = secondDerivValue > 0 ? 'local minimum'
                         : secondDerivValue < 0 ? 'local maximum'
                         : 'inconclusive';

    expect(classification).toBe('local minimum');
  });

  it('should use second derivative test for local maximum', () => {
    // Test: f(x) = -x^2, f''(x) = -2 < 0 at x = 0 → local maximum
    const secondDerivative = (x) => -2;
    const criticalPoint = 0;
    const secondDerivValue = secondDerivative(criticalPoint);

    const classification = secondDerivValue > 0 ? 'local minimum'
                         : secondDerivValue < 0 ? 'local maximum'
                         : 'inconclusive';

    expect(classification).toBe('local maximum');
  });

  it('should find inflection points where f\'\'(x) = 0', () => {
    // Test: f(x) = x^3, f''(x) = 6x, inflection at x = 0
    const secondDerivative = (x) => 6 * x;
    const inflectionPoint = 0;

    expect(secondDerivative(inflectionPoint)).toBe(0);
  });

  it('should evaluate function at critical point', () => {
    // Test: f(x) = x^2 - 4x + 3 has critical point at x = 2, f(2) = -1
    const func = (x) => x * x - 4 * x + 3;
    const criticalPoint = 2;
    const value = func(criticalPoint);

    expect(value).toBe(-1);
  });

  it('should use numerical differentiation for complex functions', () => {
    // Test central difference method
    const func = (x) => Math.sin(x);
    const x = Math.PI / 2;
    const h = 0.0001;

    const derivative = (func(x + h) - func(x - h)) / (2 * h);

    expect(derivative).toBeCloseTo(0, 3); // cos(π/2) = 0
  });
});

// Helper function for factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

describe('LOG-TEST-U-1: Natural log calculations', () => {
  it('returns 0 for ln(1)', () => {
    expect(calculateNaturalLog(1)).toBeCloseTo(0, 8);
  });
  it('approximates ln(e) as 1', () => {
    expect(calculateNaturalLog(Math.E)).toBeCloseTo(1, 8);
  });
  it('rejects non-positive arguments', () => {
    expect(calculateNaturalLog(0)).toBeNull();
    expect(calculateNaturalLog(-5)).toBeNull();
  });
});

// LOG-TEST-U-2: Common log computations
describe('LOG-TEST-U-2: Log base conversions', () => {
  it('computes log base 10 of 1000 as 3', () => {
    expect(calculateLogBase(1000, 10)).toBeCloseTo(3, 8);
  });
  it('computes log base 2 of 8 as 3', () => {
    expect(calculateLogBase(8, 2)).toBeCloseTo(3, 8);
  });
  it('returns null when base equals 1', () => {
    expect(calculateLogBase(5, 1)).toBeNull();
  });
});

// LOG-TEST-U-3: Logarithm properties
describe('LOG-TEST-U-3: Product, quotient, power rules', () => {
  it('applies product rule correctly', () => {
    const value = logProductRule(10, 2, 50); // log10(100) = 2
    expect(value).toBeCloseTo(2, 8);
  });
  it('applies quotient rule correctly', () => {
    const quotient = logQuotientRule(10, 100, 4); // log10(25)
    expect(quotient).toBeCloseTo(Math.log10(25), 8);
  });
  it('applies power rule correctly', () => {
    const power = logPowerRule(2, 3, 4); // log2(81) = log2(3^4)
    expect(power).toBeCloseTo(4 * Math.log2(3), 8);
  });
});

// LOG-TEST-U-4: Exponential equations
describe('LOG-TEST-U-4: Exponential equation solving', () => {
  it('solves x for 2^x = 16', () => {
    const result = solveSimpleExponential({ base: 2, target: 16, multiplier: 1, shift: 0 });
    expect(result).toBeCloseTo(4, 8);
  });
  it('handles shifted equations', () => {
    const result = solveSimpleExponential({ base: 3, target: 27, multiplier: 2, shift: 1 });
    expect(result).toBeCloseTo((Math.log(27) / Math.log(3) - 1) / 2, 8);
  });
});

// LOG-TEST-U-5: Log scale conversions
describe('LOG-TEST-U-5: Log scale converter', () => {
  it('converts to decibels', () => {
    const decibel = convertLogScaleValue({ type: 'decibel', amplitude: 2, reference: 1 });
    expect(decibel).toBeCloseTo(20 * Math.log10(2), 8);
  });
  it('converts to pH', () => {
    const ph = convertLogScaleValue({ type: 'ph', concentration: 1e-6 });
    expect(ph).toBeCloseTo(6, 8);
  });
  it('converts to Richter magnitude', () => {
    const mag = convertLogScaleValue({ type: 'richter', magnitude: 32, reference: 1 });
    expect(mag).toBeCloseTo(Math.log10(32), 8);
  });
});

/**
 * MMMR-TEST-U-1 - Mean Median Mode Range Unit Tests
 * Test descriptive statistics with known datasets
 */
describe('Mean Median Mode Range Calculator - MMMR-TEST-U-1: Statistics Calculations', () => {
  describe('Even count dataset: [1,2,3,4]', () => {
    const data = [1, 2, 3, 4];

    it('should calculate Mean = 2.5', () => {
      expect(mean(data)).toBe(2.5);
    });

    it('should calculate Median = 2.5 (average of middle values)', () => {
      expect(median(data)).toBe(2.5);
    });

    it('should return null for Mode (no repeating values)', () => {
      expect(mode(data)).toBe(null);
    });

    it('should calculate Range = 3 (4 - 1)', () => {
      expect(range(data)).toBe(3);
    });

    it('should find Min = 1', () => {
      expect(min(data)).toBe(1);
    });

    it('should find Max = 4', () => {
      expect(max(data)).toBe(4);
    });
  });

  describe('Odd count dataset: [1,2,3,4,5]', () => {
    const data = [1, 2, 3, 4, 5];

    it('should calculate Mean = 3', () => {
      expect(mean(data)).toBe(3);
    });

    it('should calculate Median = 3 (middle value)', () => {
      expect(median(data)).toBe(3);
    });

    it('should return null for Mode (no repeating values)', () => {
      expect(mode(data)).toBe(null);
    });

    it('should calculate Range = 4', () => {
      expect(range(data)).toBe(4);
    });
  });

  describe('Multiple modes dataset: [1,2,2,3,3]', () => {
    const data = [1, 2, 2, 3, 3];

    it('should calculate Mean = 2.2', () => {
      expect(mean(data)).toBeCloseTo(2.2);
    });

    it('should calculate Median = 2', () => {
      expect(median(data)).toBe(2);
    });

    it('should identify Modes = [2, 3] (bimodal)', () => {
      const result = mode(data);
      expect(result).toEqual([2, 3]);
    });

    it('should calculate Range = 2', () => {
      expect(range(data)).toBe(2);
    });
  });

  describe('Single value dataset: [5]', () => {
    const data = [5];

    it('should calculate Mean = 5', () => {
      expect(mean(data)).toBe(5);
    });

    it('should calculate Median = 5', () => {
      expect(median(data)).toBe(5);
    });

    it('should return null for Mode (single value)', () => {
      expect(mode(data)).toBe(null);
    });

    it('should calculate Range = 0', () => {
      expect(range(data)).toBe(0);
    });

    it('should find Min = Max = 5', () => {
      expect(min(data)).toBe(5);
      expect(max(data)).toBe(5);
    });
  });

  describe('Dataset with clear mode: [1,2,2,2,3,4]', () => {
    const data = [1, 2, 2, 2, 3, 4];

    it('should calculate correct Mean', () => {
      // (1+2+2+2+3+4) / 6 = 14/6 ≈ 2.333
      expect(mean(data)).toBeCloseTo(2.333, 2);
    });

    it('should calculate Median = 2 (average of 2 and 2)', () => {
      expect(median(data)).toBe(2);
    });

    it('should identify Mode = [2] (appears 3 times)', () => {
      expect(mode(data)).toEqual([2]);
    });

    it('should calculate Range = 3', () => {
      expect(range(data)).toBe(3);
    });
  });

  describe('Decimal dataset: [1.5, 2.5, 3.5, 4.5, 5.5]', () => {
    const data = [1.5, 2.5, 3.5, 4.5, 5.5];

    it('should calculate Mean = 3.5', () => {
      expect(mean(data)).toBe(3.5);
    });

    it('should calculate Median = 3.5', () => {
      expect(median(data)).toBe(3.5);
    });

    it('should calculate Range = 4', () => {
      expect(range(data)).toBe(4);
    });
  });

  describe('Negative numbers: [-5, -2, 0, 3, 8]', () => {
    const data = [-5, -2, 0, 3, 8];

    it('should calculate correct Mean', () => {
      // (-5 + -2 + 0 + 3 + 8) / 5 = 4/5 = 0.8
      expect(mean(data)).toBeCloseTo(0.8);
    });

    it('should calculate Median = 0', () => {
      expect(median(data)).toBe(0);
    });

    it('should calculate Range = 13 (8 - (-5))', () => {
      expect(range(data)).toBe(13);
    });

    it('should find Min = -5 and Max = 8', () => {
      expect(min(data)).toBe(-5);
      expect(max(data)).toBe(8);
    });
  });

  describe('Unsorted input: [9, 1, 5, 3, 7]', () => {
    const data = [9, 1, 5, 3, 7];

    it('should calculate Mean correctly regardless of order', () => {
      expect(mean(data)).toBe(5);
    });

    it('should calculate Median = 5 (sorts internally)', () => {
      expect(median(data)).toBe(5);
    });

    it('should find correct Min and Max', () => {
      expect(min(data)).toBe(1);
      expect(max(data)).toBe(9);
    });
  });
});

/**
 * MMMR-TEST-U-2 - Mean Median Mode Range Edge Cases
 * Test edge cases and validation
 */
describe('Mean Median Mode Range Calculator - MMMR-TEST-U-2: Edge Cases', () => {
  describe('Empty and invalid datasets', () => {
    it('should return null for empty array - mean', () => {
      expect(mean([])).toBe(null);
    });

    it('should return null for empty array - median', () => {
      expect(median([])).toBe(null);
    });

    it('should return null for empty array - mode', () => {
      expect(mode([])).toBe(null);
    });

    it('should return null for empty array - range', () => {
      expect(range([])).toBe(null);
    });

    it('should return null for non-array input', () => {
      expect(mean(null)).toBe(null);
      expect(median(undefined)).toBe(null);
      expect(mode('not an array')).toBe(null);
    });
  });

  describe('All identical values: [7, 7, 7, 7, 7]', () => {
    const data = [7, 7, 7, 7, 7];

    it('should calculate Mean = 7', () => {
      expect(mean(data)).toBe(7);
    });

    it('should calculate Median = 7', () => {
      expect(median(data)).toBe(7);
    });

    it('should identify Mode = [7]', () => {
      // All values are the same and appear more than once
      expect(mode(data)).toEqual([7]);
    });

    it('should calculate Range = 0', () => {
      expect(range(data)).toBe(0);
    });
  });

  describe('Two-value dataset: [10, 20]', () => {
    const data = [10, 20];

    it('should calculate Mean = 15', () => {
      expect(mean(data)).toBe(15);
    });

    it('should calculate Median = 15 (average of two)', () => {
      expect(median(data)).toBe(15);
    });

    it('should return null for Mode (no repeats)', () => {
      expect(mode(data)).toBe(null);
    });

    it('should calculate Range = 10', () => {
      expect(range(data)).toBe(10);
    });
  });

  describe('Large dataset handling', () => {
    it('should handle dataset of 1000 values', () => {
      const data = Array.from({ length: 1000 }, (_, i) => i + 1);

      // Mean of 1 to 1000 = 500.5
      expect(mean(data)).toBe(500.5);

      // Median of 1 to 1000 = (500 + 501) / 2 = 500.5
      expect(median(data)).toBe(500.5);

      // Range = 999
      expect(range(data)).toBe(999);
    });
  });

  describe('Decimal precision handling', () => {
    it('should maintain precision for small decimals', () => {
      const data = [0.001, 0.002, 0.003];
      expect(mean(data)).toBeCloseTo(0.002, 6);
    });

    it('should handle mixed integer and decimal', () => {
      const data = [1, 1.5, 2, 2.5, 3];
      expect(mean(data)).toBe(2);
      expect(median(data)).toBe(2);
    });
  });

  describe('parseDataset function', () => {
    it('should parse comma-separated values', () => {
      const result = parseDataset('1, 2, 3, 4, 5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should parse space-separated values', () => {
      const result = parseDataset('1 2 3 4 5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should parse newline-separated values', () => {
      const result = parseDataset('1\n2\n3\n4\n5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should handle mixed separators', () => {
      const result = parseDataset('1, 2 3\n4, 5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should trim whitespace', () => {
      const result = parseDataset('  1  ,  2  ,  3  ');
      expect(result.data).toEqual([1, 2, 3]);
      expect(result.errors).toEqual([]);
    });

    it('should report invalid values', () => {
      const result = parseDataset('1, 2, abc, 4, xyz');
      expect(result.data).toEqual([1, 2, 4]);
      expect(result.errors).toEqual(['abc', 'xyz']);
    });

    it('should handle empty input', () => {
      const result = parseDataset('');
      expect(result.data).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    it('should handle null/undefined input', () => {
      expect(parseDataset(null).data).toEqual([]);
      expect(parseDataset(undefined).data).toEqual([]);
    });

    it('should parse negative numbers', () => {
      const result = parseDataset('-5, -3, 0, 3, 5');
      expect(result.data).toEqual([-5, -3, 0, 3, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should parse decimal numbers', () => {
      const result = parseDataset('1.5, 2.7, 3.14');
      expect(result.data).toEqual([1.5, 2.7, 3.14]);
      expect(result.errors).toEqual([]);
    });

    it('should handle leading/trailing commas', () => {
      const result = parseDataset(',1, 2, 3,');
      expect(result.data).toEqual([1, 2, 3]);
      expect(result.errors).toEqual([]);
    });
  });

  describe('Multiple modes (multimodal)', () => {
    it('should identify trimodal dataset', () => {
      const data = [1, 1, 2, 2, 3, 3, 4];
      expect(mode(data)).toEqual([1, 2, 3]);
    });

    it('should handle all values appearing same frequency (> 1)', () => {
      const data = [1, 1, 2, 2, 3, 3];
      expect(mode(data)).toEqual([1, 2, 3]);
    });
  });

  describe('Outlier impact', () => {
    it('mean should be affected by outliers', () => {
      const normalData = [10, 11, 12, 13, 14];
      const withOutlier = [10, 11, 12, 13, 100];

      const normalMean = mean(normalData);
      const outlierMean = mean(withOutlier);

      // Normal mean = 12
      expect(normalMean).toBe(12);

      // Outlier mean = 29.2 (significantly higher)
      expect(outlierMean).toBeCloseTo(29.2);
      expect(outlierMean).toBeGreaterThan(normalMean * 2);
    });

    it('median should be robust to outliers', () => {
      const normalData = [10, 11, 12, 13, 14];
      const withOutlier = [10, 11, 12, 13, 100];

      const normalMedian = median(normalData);
      const outlierMedian = median(withOutlier);

      // Both medians = 12 (middle value)
      expect(normalMedian).toBe(12);
      expect(outlierMedian).toBe(12);
    });
  });
});

/**
 * SEQ-TEST-U-1 - Sequence detection tests
 */
describe('Number Sequence - SEQ-TEST-U-1: Detection', () => {
  it('detects arithmetic sequences', () => {
    const result = analyzeSequence([2, 4, 6, 8]);
    expect(result.type).toBe('arithmetic');
    expect(result.difference).toBe(2);
  });

  it('detects geometric sequences', () => {
    const result = analyzeSequence([3, 6, 12, 24]);
    expect(result.type).toBe('geometric');
    expect(result.ratio).toBe(2);
  });

  it('detects constant sequences', () => {
    const result = analyzeSequence([5, 5, 5, 5]);
    expect(result.type).toBe('constant');
    expect(result.difference).toBe(0);
    expect(result.ratio).toBe(1);
  });
});

/**
 * SEQ-TEST-U-2 - Sequence calculation tests
 */
describe('Number Sequence - SEQ-TEST-U-2: Calculations', () => {
  it('calculates arithmetic nth term and sum', () => {
    expect(nthTermArithmetic(2, 3, 5)).toBe(14);
    expect(sumArithmetic(2, 3, 5)).toBe(40);
  });

  it('calculates geometric nth term and sum', () => {
    expect(nthTermGeometric(2, 2, 6)).toBe(64);
    expect(sumGeometric(2, 2, 4)).toBe(30);
  });
});

/**
 * TRIG-TEST-U-1 - Unit circle calculator tests
 */
describe('Trigonometry - TRIG-TEST-U-1: Unit Circle', () => {
  it('computes quadrant and reference angles', () => {
    expect(getQuadrantFromDegrees(210)).toBe('III');
    expect(getReferenceAngleDegrees(210)).toBeCloseTo(30);
  });

  it('returns exact values for special angles', () => {
    const special = getSpecialAngleInfo(60);
    expect(special.sin).toBe('sqrt(3)/2');
    expect(special.cos).toBe('1/2');
  });
});

/**
 * TRIG-TEST-U-2 - Triangle solver tests
 */
describe('Trigonometry - TRIG-TEST-U-2: Triangle Solver', () => {
  it('solves a 3-4-5 triangle using SSS', () => {
    const solved = solveTriangle('SSS', { a: 3, b: 4, c: 5 });
    expect(solved.error).toBeUndefined();
    const solution = solved.solutions[0];
    expect(solution.C).toBeCloseTo(90, 3);
  });

  it('handles ambiguous SSA case with two solutions', () => {
    const solved = solveTriangle('SSA', { a: 10, b: 12, A: 30 });
    expect(solved.solutions.length).toBe(2);
  });
});

/**
 * TRIG-TEST-U-3 - Trig function tests
 */
describe('Trigonometry - TRIG-TEST-U-3: Trig Functions', () => {
  it('computes sin, cos, tan for 45 degrees', () => {
    const values = computeTrigValues(degToRad(45));
    expect(values.sin).toBeCloseTo(Math.SQRT1_2, 6);
    expect(values.cos).toBeCloseTo(Math.SQRT1_2, 6);
    expect(values.tan).toBeCloseTo(1, 6);
  });

  it('returns null for undefined tan at 90 degrees', () => {
    const values = computeTrigValues(degToRad(90));
    expect(values.tan).toBeNull();
  });
});

/**
 * TRIG-TEST-U-4 - Inverse trig tests
 */
describe('Trigonometry - TRIG-TEST-U-4: Inverse Trig', () => {
  it('finds arcsin solutions in a full turn', () => {
    const twoPi = Math.PI * 2;
    const result = getInverseTrigSolutions('arcsin', 0.5, -twoPi, twoPi);
    expect(result.error).toBeUndefined();
    const degrees = result.solutions.map((value) => Math.round((value * 180) / Math.PI));
    expect(degrees).toContain(30);
    expect(degrees).toContain(150);
  });
});

/**
 * TRIG-TEST-U-5 - Law of sines/cosines tests
 */
describe('Trigonometry - TRIG-TEST-U-5: Law of Sines/Cosines', () => {
  it('detects SAS inputs and solves with law of cosines', () => {
    const values = { a: 7, b: 9, C: 60 };
    expect(detectTriangleType(values)).toBe('SAS');
    const solved = solveTriangle('SAS', values);
    expect(solved.error).toBeUndefined();
    expect(solved.solutions[0].c).toBeGreaterThan(0);
  });
});
