import { describe, it, expect } from 'vitest';
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
} from '../../public/assets/js/core/advanced-statistics.js';

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
