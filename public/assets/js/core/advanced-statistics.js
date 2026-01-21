/**
 * Advanced Statistics utility functions for CalcHowMuch calculators.
 * Provides functions for regression, ANOVA, hypothesis testing, correlation, and distributions.
 */

import { mean, variance, standardDeviation, sum, parseDataset } from './stats.js';

// ============================================================================
// MATHEMATICAL HELPER FUNCTIONS
// ============================================================================

/**
 * Error function (erf) approximation using Horner's method.
 * @param {number} x - Input value
 * @returns {number} Error function value
 */
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * absX);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

/**
 * Gamma function approximation using Lanczos approximation.
 * @param {number} z - Input value (z > 0)
 * @returns {number} Gamma function value
 */
function gamma(z) {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

/**
 * Beta function B(a, b) = Gamma(a) * Gamma(b) / Gamma(a+b)
 * @param {number} a - First parameter
 * @param {number} b - Second parameter
 * @returns {number} Beta function value
 */
function beta(a, b) {
  return (gamma(a) * gamma(b)) / gamma(a + b);
}

/**
 * Incomplete beta function using continued fraction expansion.
 * @param {number} x - Input value (0 <= x <= 1)
 * @param {number} a - First parameter
 * @param {number} b - Second parameter
 * @returns {number} Incomplete beta function value
 */
function incompleteBeta(x, a, b) {
  if (x === 0) {return 0;}
  if (x === 1) {return 1;}

  const maxIterations = 200;
  const epsilon = 1e-10;

  const bt =
    Math.exp(
      a * Math.log(x) + b * Math.log(1 - x) - Math.log(a) - Math.log(beta(a, b))
    );

  if (x < (a + 1) / (a + b + 2)) {
    return bt * betaContinuedFraction(x, a, b, maxIterations, epsilon);
  }
  return 1 - bt * betaContinuedFraction(1 - x, b, a, maxIterations, epsilon);
}

/**
 * Continued fraction expansion for incomplete beta function.
 */
function betaContinuedFraction(x, a, b, maxIterations, epsilon) {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;

  if (Math.abs(d) < 1e-30) {d = 1e-30;}
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) {d = 1e-30;}
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) {c = 1e-30;}
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) {d = 1e-30;}
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) {c = 1e-30;}
    d = 1 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1) < epsilon) {break;}
  }
  return h;
}

/**
 * Regularized incomplete gamma function P(a, x).
 * @param {number} a - Shape parameter
 * @param {number} x - Input value
 * @returns {number} Regularized incomplete gamma value
 */
function regularizedGammaP(a, x) {
  if (x < 0 || a <= 0) {return NaN;}
  if (x === 0) {return 0;}

  if (x < a + 1) {
    return gammaSeries(a, x);
  }
  return 1 - gammaContinuedFraction(a, x);
}

/**
 * Series expansion for regularized incomplete gamma.
 */
function gammaSeries(a, x) {
  const maxIterations = 200;
  const epsilon = 1e-10;

  let sum = 1 / a;
  let del = sum;

  for (let n = 1; n <= maxIterations; n++) {
    del *= x / (a + n);
    sum += del;
    if (Math.abs(del) < Math.abs(sum) * epsilon) {break;}
  }

  return sum * Math.exp(-x + a * Math.log(x) - Math.log(gamma(a)));
}

/**
 * Continued fraction for regularized incomplete gamma.
 */
function gammaContinuedFraction(a, x) {
  const maxIterations = 200;
  const epsilon = 1e-10;

  let b = x + 1 - a;
  let c = 1 / 1e-30;
  let d = 1 / b;
  let h = d;

  for (let i = 1; i <= maxIterations; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-30) {d = 1e-30;}
    c = b + an / c;
    if (Math.abs(c) < 1e-30) {c = 1e-30;}
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < epsilon) {break;}
  }

  return Math.exp(-x + a * Math.log(x) - Math.log(gamma(a))) * h;
}

// ============================================================================
// DISTRIBUTION FUNCTIONS
// ============================================================================

/**
 * Standard normal PDF.
 * @param {number} x - Input value
 * @returns {number} PDF value
 */
export function normalPdf(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Standard normal CDF.
 * @param {number} x - Input value
 * @returns {number} CDF value (probability P(Z <= x))
 */
export function normalCdf(x) {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

/**
 * Normal CDF with custom mean and standard deviation.
 * @param {number} x - Input value
 * @param {number} mu - Mean
 * @param {number} sigma - Standard deviation
 * @returns {number} CDF value
 */
export function normalCdfCustom(x, mu, sigma) {
  if (sigma <= 0) {return null;}
  return normalCdf((x - mu) / sigma);
}

/**
 * Standard normal inverse CDF (quantile function).
 * Uses rational approximation.
 * @param {number} p - Probability (0 < p < 1)
 * @returns {number} Z-score corresponding to p
 */
export function normalQuantile(p) {
  if (p <= 0 || p >= 1) {return null;}

  // Rational approximation for lower region
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
    -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q, r;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
}

/**
 * Student's t-distribution PDF.
 * @param {number} t - t-value
 * @param {number} df - Degrees of freedom
 * @returns {number} PDF value
 */
export function tPdf(t, df) {
  if (df <= 0) {return null;}
  const coef = gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2));
  return coef * Math.pow(1 + (t * t) / df, -(df + 1) / 2);
}

/**
 * Student's t-distribution CDF.
 * @param {number} t - t-value
 * @param {number} df - Degrees of freedom
 * @returns {number} CDF value P(T <= t)
 */
export function tCdf(t, df) {
  if (df <= 0) {return null;}
  const x = df / (df + t * t);
  const ib = 0.5 * incompleteBeta(x, df / 2, 0.5);
  return t >= 0 ? 1 - ib : ib;
}

/**
 * Student's t-distribution inverse CDF (quantile function).
 * Uses Newton-Raphson iteration.
 * @param {number} p - Probability (0 < p < 1)
 * @param {number} df - Degrees of freedom
 * @returns {number} t-value corresponding to p
 */
export function tQuantile(p, df) {
  if (p <= 0 || p >= 1 || df <= 0) {return null;}

  // Initial guess using normal approximation
  let t = normalQuantile(p);

  // Newton-Raphson refinement
  for (let i = 0; i < 10; i++) {
    const cdf = tCdf(t, df);
    const pdf = tPdf(t, df);
    if (pdf === 0) {break;}
    const delta = (cdf - p) / pdf;
    t -= delta;
    if (Math.abs(delta) < 1e-10) {break;}
  }

  return t;
}

/**
 * Chi-square distribution PDF.
 * @param {number} x - Input value (x >= 0)
 * @param {number} df - Degrees of freedom
 * @returns {number} PDF value
 */
export function chiSquarePdf(x, df) {
  if (x < 0 || df <= 0) {return 0;}
  if (x === 0) {return df === 2 ? 0.5 : 0;}
  const k = df / 2;
  return (Math.pow(x, k - 1) * Math.exp(-x / 2)) / (Math.pow(2, k) * gamma(k));
}

/**
 * Chi-square distribution CDF.
 * @param {number} x - Input value (x >= 0)
 * @param {number} df - Degrees of freedom
 * @returns {number} CDF value P(X <= x)
 */
export function chiSquareCdf(x, df) {
  if (x < 0 || df <= 0) {return 0;}
  return regularizedGammaP(df / 2, x / 2);
}

/**
 * Chi-square distribution inverse CDF.
 * @param {number} p - Probability (0 < p < 1)
 * @param {number} df - Degrees of freedom
 * @returns {number} Chi-square value corresponding to p
 */
export function chiSquareQuantile(p, df) {
  if (p <= 0 || p >= 1 || df <= 0) {return null;}

  // Initial guess
  let x = df * Math.pow(1 - 2 / (9 * df) + normalQuantile(p) * Math.sqrt(2 / (9 * df)), 3);
  if (x < 0) {x = 0.1;}

  // Newton-Raphson refinement
  for (let i = 0; i < 20; i++) {
    const cdf = chiSquareCdf(x, df);
    const pdf = chiSquarePdf(x, df);
    if (pdf === 0) {break;}
    const delta = (cdf - p) / pdf;
    x -= delta;
    if (x < 0) {x = 0.01;}
    if (Math.abs(delta) < 1e-10) {break;}
  }

  return x;
}

/**
 * F-distribution PDF.
 * @param {number} x - Input value (x >= 0)
 * @param {number} d1 - Numerator degrees of freedom
 * @param {number} d2 - Denominator degrees of freedom
 * @returns {number} PDF value
 */
export function fPdf(x, d1, d2) {
  if (x < 0 || d1 <= 0 || d2 <= 0) {return 0;}
  if (x === 0) {return d1 < 2 ? Infinity : d1 === 2 ? 1 : 0;}

  const num = Math.pow(d1 * x, d1) * Math.pow(d2, d2);
  const den = Math.pow(d1 * x + d2, d1 + d2);
  return Math.sqrt(num / den) / (x * beta(d1 / 2, d2 / 2));
}

/**
 * F-distribution CDF.
 * @param {number} x - Input value (x >= 0)
 * @param {number} d1 - Numerator degrees of freedom
 * @param {number} d2 - Denominator degrees of freedom
 * @returns {number} CDF value P(F <= x)
 */
export function fCdf(x, d1, d2) {
  if (x < 0 || d1 <= 0 || d2 <= 0) {return 0;}
  return incompleteBeta((d1 * x) / (d1 * x + d2), d1 / 2, d2 / 2);
}

/**
 * F-distribution inverse CDF.
 * @param {number} p - Probability (0 < p < 1)
 * @param {number} d1 - Numerator degrees of freedom
 * @param {number} d2 - Denominator degrees of freedom
 * @returns {number} F-value corresponding to p
 */
export function fQuantile(p, d1, d2) {
  if (p <= 0 || p >= 1 || d1 <= 0 || d2 <= 0) {return null;}

  // Initial guess
  let f = 1;

  // Newton-Raphson refinement
  for (let i = 0; i < 30; i++) {
    const cdf = fCdf(f, d1, d2);
    const pdf = fPdf(f, d1, d2);
    if (pdf === 0 || !isFinite(pdf)) {break;}
    const delta = (cdf - p) / pdf;
    f -= delta;
    if (f < 0.001) {f = 0.001;}
    if (Math.abs(delta) < 1e-10) {break;}
  }

  return f;
}

/**
 * Binomial distribution PMF.
 * @param {number} k - Number of successes
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @returns {number} Probability P(X = k)
 */
export function binomialPmf(k, n, p) {
  if (!Number.isInteger(k) || !Number.isInteger(n) || k < 0 || n < 0 || k > n) {return 0;}
  if (p < 0 || p > 1) {return 0;}

  // Use log to avoid overflow for large n
  let logCoeff = 0;
  for (let i = 0; i < k; i++) {
    logCoeff += Math.log(n - i) - Math.log(i + 1);
  }

  return Math.exp(logCoeff + k * Math.log(p) + (n - k) * Math.log(1 - p));
}

/**
 * Binomial distribution CDF.
 * @param {number} k - Number of successes
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @returns {number} Probability P(X <= k)
 */
export function binomialCdf(k, n, p) {
  if (!Number.isInteger(n) || n < 0 || p < 0 || p > 1) {return null;}
  k = Math.floor(k);
  if (k < 0) {return 0;}
  if (k >= n) {return 1;}

  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += binomialPmf(i, n, p);
  }
  return sum;
}

/**
 * Poisson distribution PMF.
 * @param {number} k - Number of events
 * @param {number} lambda - Expected number of events
 * @returns {number} Probability P(X = k)
 */
export function poissonPmf(k, lambda) {
  if (!Number.isInteger(k) || k < 0 || lambda < 0) {return 0;}

  // Use log to avoid overflow
  let logProb = k * Math.log(lambda) - lambda;
  for (let i = 2; i <= k; i++) {
    logProb -= Math.log(i);
  }

  return Math.exp(logProb);
}

/**
 * Poisson distribution CDF.
 * @param {number} k - Number of events
 * @param {number} lambda - Expected number of events
 * @returns {number} Probability P(X <= k)
 */
export function poissonCdf(k, lambda) {
  if (lambda < 0) {return null;}
  k = Math.floor(k);
  if (k < 0) {return 0;}

  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += poissonPmf(i, lambda);
  }
  return sum;
}

// ============================================================================
// REGRESSION ANALYSIS
// ============================================================================

/**
 * Perform linear regression (y = ax + b) using least squares.
 * @param {number[]} x - Independent variable values
 * @param {number[]} y - Dependent variable values
 * @returns {Object|null} Regression results or null if invalid input
 */
export function linearRegression(x, y) {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length || x.length < 2) {
    return null;
  }

  const n = x.length;
  const xMean = mean(x);
  const yMean = mean(y);

  let ssXY = 0;
  let ssXX = 0;
  let ssYY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - xMean;
    const dy = y[i] - yMean;
    ssXY += dx * dy;
    ssXX += dx * dx;
    ssYY += dy * dy;
  }

  if (ssXX === 0) {return null;}

  const slope = ssXY / ssXX;
  const intercept = yMean - slope * xMean;

  // Calculate predicted values and residuals
  const predicted = x.map((xi) => slope * xi + intercept);
  const residuals = y.map((yi, i) => yi - predicted[i]);

  // Calculate R-squared
  const ssRes = sum(residuals.map((r) => r * r));
  const ssTot = ssYY;
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  // Adjusted R-squared
  const adjustedRSquared = 1 - ((1 - rSquared) * (n - 1)) / (n - 2);

  // Standard error of regression
  const standardError = Math.sqrt(ssRes / (n - 2));

  // Standard error of coefficients
  const seSlope = standardError / Math.sqrt(ssXX);
  const seIntercept = standardError * Math.sqrt(1 / n + (xMean * xMean) / ssXX);

  // t-statistics
  const tSlope = slope / seSlope;
  const tIntercept = intercept / seIntercept;

  // p-values
  const pSlope = 2 * (1 - tCdf(Math.abs(tSlope), n - 2));
  const pIntercept = 2 * (1 - tCdf(Math.abs(tIntercept), n - 2));

  // Correlation coefficient
  const r = ssYY === 0 ? 1 : ssXY / Math.sqrt(ssXX * ssYY);

  return {
    slope,
    intercept,
    rSquared,
    adjustedRSquared,
    r,
    standardError,
    predicted,
    residuals,
    coefficients: {
      slope: { value: slope, se: seSlope, t: tSlope, p: pSlope },
      intercept: { value: intercept, se: seIntercept, t: tIntercept, p: pIntercept },
    },
    n,
    df: n - 2,
  };
}

/**
 * Perform polynomial regression of specified degree.
 * @param {number[]} x - Independent variable values
 * @param {number[]} y - Dependent variable values
 * @param {number} degree - Polynomial degree (1-5)
 * @returns {Object|null} Regression results or null if invalid input
 */
export function polynomialRegression(x, y, degree = 2) {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length) {
    return null;
  }
  if (degree < 1 || degree > 5 || x.length < degree + 1) {
    return null;
  }

  const n = x.length;

  // Build Vandermonde matrix
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j <= degree; j++) {
      row.push(Math.pow(x[i], j));
    }
    X.push(row);
  }

  // Solve normal equations: (X'X)^-1 X'y
  const coefficients = solveNormalEquations(X, y);
  if (!coefficients) {return null;}

  // Calculate predicted values
  const predicted = x.map((xi) => {
    let yPred = 0;
    for (let j = 0; j <= degree; j++) {
      yPred += coefficients[j] * Math.pow(xi, j);
    }
    return yPred;
  });

  // Calculate residuals
  const residuals = y.map((yi, i) => yi - predicted[i]);

  // Calculate R-squared
  const yMean = mean(y);
  const ssTot = sum(y.map((yi) => Math.pow(yi - yMean, 2)));
  const ssRes = sum(residuals.map((r) => r * r));
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  // Adjusted R-squared
  const adjustedRSquared = 1 - ((1 - rSquared) * (n - 1)) / (n - degree - 1);

  // Standard error
  const standardError = Math.sqrt(ssRes / (n - degree - 1));

  return {
    coefficients,
    degree,
    rSquared,
    adjustedRSquared,
    standardError,
    predicted,
    residuals,
    n,
    df: n - degree - 1,
  };
}

/**
 * Solve normal equations using Gaussian elimination.
 */
function solveNormalEquations(X, y) {
  const n = X.length;
  const m = X[0].length;

  // X'X
  const XtX = [];
  for (let i = 0; i < m; i++) {
    XtX[i] = [];
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += X[k][i] * X[k][j];
      }
      XtX[i][j] = sum;
    }
  }

  // X'y
  const Xty = [];
  for (let i = 0; i < m; i++) {
    let sum = 0;
    for (let k = 0; k < n; k++) {
      sum += X[k][i] * y[k];
    }
    Xty[i] = sum;
  }

  // Gaussian elimination with partial pivoting
  const A = XtX.map((row, i) => [...row, Xty[i]]);

  for (let i = 0; i < m; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < m; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];

    if (Math.abs(A[i][i]) < 1e-12) {return null;}

    // Eliminate
    for (let k = i + 1; k < m; k++) {
      const factor = A[k][i] / A[i][i];
      for (let j = i; j <= m; j++) {
        A[k][j] -= factor * A[i][j];
      }
    }
  }

  // Back substitution
  const result = new Array(m);
  for (let i = m - 1; i >= 0; i--) {
    result[i] = A[i][m];
    for (let j = i + 1; j < m; j++) {
      result[i] -= A[i][j] * result[j];
    }
    result[i] /= A[i][i];
  }

  return result;
}

/**
 * Perform exponential regression (y = a * e^(bx)).
 * @param {number[]} x - Independent variable values
 * @param {number[]} y - Dependent variable values (must be positive)
 * @returns {Object|null} Regression results or null if invalid input
 */
export function exponentialRegression(x, y) {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length || x.length < 2) {
    return null;
  }

  // Filter positive y values
  const validIndices = y.map((yi, i) => (yi > 0 ? i : -1)).filter((i) => i >= 0);
  if (validIndices.length < 2) {return null;}

  const xValid = validIndices.map((i) => x[i]);
  const yValid = validIndices.map((i) => y[i]);
  const logY = yValid.map((yi) => Math.log(yi));

  // Linear regression on log-transformed data
  const linReg = linearRegression(xValid, logY);
  if (!linReg) {return null;}

  const a = Math.exp(linReg.intercept);
  const b = linReg.slope;

  // Calculate predicted values
  const predicted = x.map((xi) => a * Math.exp(b * xi));
  const residuals = y.map((yi, i) => yi - predicted[i]);

  // Calculate R-squared on original scale
  const yMean = mean(y);
  const ssTot = sum(y.map((yi) => Math.pow(yi - yMean, 2)));
  const ssRes = sum(residuals.map((r) => r * r));
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return {
    a,
    b,
    rSquared,
    predicted,
    residuals,
    n: x.length,
    equation: `y = ${a.toFixed(4)} × e^(${b.toFixed(4)}x)`,
  };
}

/**
 * Perform logarithmic regression (y = a + b * ln(x)).
 * @param {number[]} x - Independent variable values (must be positive)
 * @param {number[]} y - Dependent variable values
 * @returns {Object|null} Regression results or null if invalid input
 */
export function logarithmicRegression(x, y) {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length || x.length < 2) {
    return null;
  }

  // Filter positive x values
  const validIndices = x.map((xi, i) => (xi > 0 ? i : -1)).filter((i) => i >= 0);
  if (validIndices.length < 2) {return null;}

  const xValid = validIndices.map((i) => x[i]);
  const yValid = validIndices.map((i) => y[i]);
  const logX = xValid.map((xi) => Math.log(xi));

  // Linear regression on log-transformed x
  const linReg = linearRegression(logX, yValid);
  if (!linReg) {return null;}

  const a = linReg.intercept;
  const b = linReg.slope;

  // Calculate predicted values
  const predicted = x.map((xi) => (xi > 0 ? a + b * Math.log(xi) : NaN));
  const residuals = y.map((yi, i) => yi - predicted[i]);

  // Calculate R-squared
  const yMean = mean(y);
  const ssTot = sum(y.map((yi) => Math.pow(yi - yMean, 2)));
  const ssRes = sum(residuals.filter((r) => !isNaN(r)).map((r) => r * r));
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return {
    a,
    b,
    rSquared,
    predicted,
    residuals,
    n: x.length,
    equation: `y = ${a.toFixed(4)} + ${b.toFixed(4)} × ln(x)`,
  };
}

// ============================================================================
// ANOVA (Analysis of Variance)
// ============================================================================

/**
 * Perform one-way ANOVA.
 * @param {number[][]} groups - Array of groups, each group is an array of values
 * @returns {Object|null} ANOVA results or null if invalid input
 */
export function oneWayAnova(groups) {
  if (!Array.isArray(groups) || groups.length < 2) {return null;}
  if (groups.some((g) => !Array.isArray(g) || g.length < 1)) {return null;}

  const k = groups.length; // Number of groups
  const groupMeans = groups.map((g) => mean(g));
  const groupSizes = groups.map((g) => g.length);
  const n = sum(groupSizes); // Total observations

  // Grand mean
  const allValues = groups.flat();
  const grandMean = mean(allValues);

  // Sum of Squares Between (SSB)
  let ssb = 0;
  for (let i = 0; i < k; i++) {
    ssb += groupSizes[i] * Math.pow(groupMeans[i] - grandMean, 2);
  }

  // Sum of Squares Within (SSW)
  let ssw = 0;
  for (let i = 0; i < k; i++) {
    for (const value of groups[i]) {
      ssw += Math.pow(value - groupMeans[i], 2);
    }
  }

  // Total Sum of Squares (SST)
  const sst = ssb + ssw;

  // Degrees of freedom
  const dfBetween = k - 1;
  const dfWithin = n - k;
  const dfTotal = n - 1;

  // Mean Squares
  const msb = ssb / dfBetween;
  const msw = ssw / dfWithin;

  // F-statistic
  const fStatistic = msw === 0 ? Infinity : msb / msw;

  // p-value
  const pValue = 1 - fCdf(fStatistic, dfBetween, dfWithin);

  // Effect size (eta-squared)
  const etaSquared = sst === 0 ? 0 : ssb / sst;

  // Omega-squared (less biased estimate)
  const omegaSquared = (ssb - dfBetween * msw) / (sst + msw);

  return {
    fStatistic,
    pValue,
    dfBetween,
    dfWithin,
    dfTotal,
    ssb,
    ssw,
    sst,
    msb,
    msw,
    etaSquared,
    omegaSquared,
    groupMeans,
    groupSizes,
    grandMean,
    k,
    n,
  };
}

/**
 * Calculate Tukey HSD (Honestly Significant Difference) post-hoc test.
 * @param {number[][]} groups - Array of groups
 * @param {number} alpha - Significance level (default 0.05)
 * @returns {Object|null} Tukey HSD results or null if invalid input
 */
export function tukeyHSD(groups, alpha = 0.05) {
  const anovaResult = oneWayAnova(groups);
  if (!anovaResult) {return null;}

  const { msw, dfWithin, groupMeans, groupSizes, k } = anovaResult;
  const comparisons = [];

  // Get critical q value (approximation)
  // For proper implementation, would need studentized range distribution
  // Using approximation based on alpha and k
  const qCritical = getQCritical(alpha, k, dfWithin);

  for (let i = 0; i < k; i++) {
    for (let j = i + 1; j < k; j++) {
      const meanDiff = Math.abs(groupMeans[i] - groupMeans[j]);
      const se = Math.sqrt(msw * (1 / groupSizes[i] + 1 / groupSizes[j]) / 2);
      const q = meanDiff / se;
      const significant = q > qCritical;

      comparisons.push({
        group1: i,
        group2: j,
        meanDiff,
        se,
        q,
        qCritical,
        significant,
      });
    }
  }

  return { comparisons, alpha, qCritical };
}

/**
 * Approximate critical q value for Tukey HSD.
 */
function getQCritical(alpha, k, _df) {
  // Approximation using normal distribution for large df
  // For accurate values, a table or more complex algorithm would be needed
  const z = normalQuantile(1 - alpha / 2);
  return z * Math.sqrt(2) * (1 + 0.05 * (k - 2));
}

// ============================================================================
// HYPOTHESIS TESTING
// ============================================================================

/**
 * Perform one-sample t-test.
 * @param {number[]} sample - Sample data
 * @param {number} mu0 - Hypothesized population mean
 * @param {string} alternative - 'two-sided', 'greater', or 'less'
 * @returns {Object|null} Test results or null if invalid input
 */
export function oneSampleTTest(sample, mu0, alternative = 'two-sided') {
  if (!Array.isArray(sample) || sample.length < 2) {return null;}

  const n = sample.length;
  const sampleMean = mean(sample);
  const sampleStd = standardDeviation(sample, true);
  const se = sampleStd / Math.sqrt(n);

  if (se === 0) {return null;}

  const tStatistic = (sampleMean - mu0) / se;
  const df = n - 1;

  let pValue;
  switch (alternative) {
    case 'greater':
      pValue = 1 - tCdf(tStatistic, df);
      break;
    case 'less':
      pValue = tCdf(tStatistic, df);
      break;
    default:
      pValue = 2 * (1 - tCdf(Math.abs(tStatistic), df));
  }

  // Confidence interval
  const tCritical = tQuantile(0.975, df);
  const ciLower = sampleMean - tCritical * se;
  const ciUpper = sampleMean + tCritical * se;

  // Effect size (Cohen's d)
  const cohenD = (sampleMean - mu0) / sampleStd;

  return {
    tStatistic,
    df,
    pValue,
    sampleMean,
    sampleStd,
    se,
    mu0,
    alternative,
    confidenceInterval: { lower: ciLower, upper: ciUpper, level: 0.95 },
    effectSize: { cohenD },
    n,
  };
}

/**
 * Perform two-sample t-test (independent samples).
 * @param {number[]} sample1 - First sample
 * @param {number[]} sample2 - Second sample
 * @param {string} alternative - 'two-sided', 'greater', or 'less'
 * @param {boolean} equalVariance - Assume equal variances (default false for Welch's t-test)
 * @returns {Object|null} Test results or null if invalid input
 */
export function twoSampleTTest(sample1, sample2, alternative = 'two-sided', equalVariance = false) {
  if (!Array.isArray(sample1) || !Array.isArray(sample2)) {return null;}
  if (sample1.length < 2 || sample2.length < 2) {return null;}

  const n1 = sample1.length;
  const n2 = sample2.length;
  const mean1 = mean(sample1);
  const mean2 = mean(sample2);
  const var1 = variance(sample1, true);
  const var2 = variance(sample2, true);

  let df, se;

  if (equalVariance) {
    // Pooled variance
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    se = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
    df = n1 + n2 - 2;
  } else {
    // Welch's t-test
    se = Math.sqrt(var1 / n1 + var2 / n2);
    // Welch-Satterthwaite degrees of freedom
    const num = Math.pow(var1 / n1 + var2 / n2, 2);
    const den = Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1);
    df = num / den;
  }

  if (se === 0) {return null;}

  const tStatistic = (mean1 - mean2) / se;

  let pValue;
  switch (alternative) {
    case 'greater':
      pValue = 1 - tCdf(tStatistic, df);
      break;
    case 'less':
      pValue = tCdf(tStatistic, df);
      break;
    default:
      pValue = 2 * (1 - tCdf(Math.abs(tStatistic), df));
  }

  // Confidence interval for difference
  const tCritical = tQuantile(0.975, df);
  const ciLower = mean1 - mean2 - tCritical * se;
  const ciUpper = mean1 - mean2 + tCritical * se;

  // Effect size (Cohen's d)
  const pooledStd = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));
  const cohenD = (mean1 - mean2) / pooledStd;

  return {
    tStatistic,
    df,
    pValue,
    mean1,
    mean2,
    meanDifference: mean1 - mean2,
    se,
    alternative,
    equalVariance,
    confidenceInterval: { lower: ciLower, upper: ciUpper, level: 0.95 },
    effectSize: { cohenD },
    n1,
    n2,
  };
}

/**
 * Perform paired t-test.
 * @param {number[]} sample1 - First sample
 * @param {number[]} sample2 - Second sample (paired with first)
 * @param {string} alternative - 'two-sided', 'greater', or 'less'
 * @returns {Object|null} Test results or null if invalid input
 */
export function pairedTTest(sample1, sample2, alternative = 'two-sided') {
  if (!Array.isArray(sample1) || !Array.isArray(sample2)) {return null;}
  if (sample1.length !== sample2.length || sample1.length < 2) {return null;}

  const differences = sample1.map((v, i) => v - sample2[i]);
  return oneSampleTTest(differences, 0, alternative);
}

/**
 * Perform one-sample z-test (known population variance).
 * @param {number[]} sample - Sample data
 * @param {number} mu0 - Hypothesized population mean
 * @param {number} sigma - Known population standard deviation
 * @param {string} alternative - 'two-sided', 'greater', or 'less'
 * @returns {Object|null} Test results or null if invalid input
 */
export function zTest(sample, mu0, sigma, alternative = 'two-sided') {
  if (!Array.isArray(sample) || sample.length < 1 || sigma <= 0) {return null;}

  const n = sample.length;
  const sampleMean = mean(sample);
  const se = sigma / Math.sqrt(n);
  const zStatistic = (sampleMean - mu0) / se;

  let pValue;
  switch (alternative) {
    case 'greater':
      pValue = 1 - normalCdf(zStatistic);
      break;
    case 'less':
      pValue = normalCdf(zStatistic);
      break;
    default:
      pValue = 2 * (1 - normalCdf(Math.abs(zStatistic)));
  }

  // Confidence interval
  const zCritical = normalQuantile(0.975);
  const ciLower = sampleMean - zCritical * se;
  const ciUpper = sampleMean + zCritical * se;

  return {
    zStatistic,
    pValue,
    sampleMean,
    sigma,
    se,
    mu0,
    alternative,
    confidenceInterval: { lower: ciLower, upper: ciUpper, level: 0.95 },
    n,
  };
}

/**
 * Perform chi-square goodness of fit test.
 * @param {number[]} observed - Observed frequencies
 * @param {number[]} expected - Expected frequencies
 * @returns {Object|null} Test results or null if invalid input
 */
export function chiSquareGoodnessOfFit(observed, expected) {
  if (!Array.isArray(observed) || !Array.isArray(expected)) {return null;}
  if (observed.length !== expected.length || observed.length < 2) {return null;}
  if (expected.some((e) => e <= 0)) {return null;}

  const k = observed.length;
  let chiSquare = 0;

  for (let i = 0; i < k; i++) {
    chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
  }

  const df = k - 1;
  const pValue = 1 - chiSquareCdf(chiSquare, df);

  // Standardized residuals
  const residuals = observed.map((o, i) => (o - expected[i]) / Math.sqrt(expected[i]));

  return {
    chiSquare,
    df,
    pValue,
    observed,
    expected,
    residuals,
  };
}

/**
 * Perform chi-square test of independence.
 * @param {number[][]} contingencyTable - 2D array of observed frequencies
 * @returns {Object|null} Test results or null if invalid input
 */
export function chiSquareIndependence(contingencyTable) {
  if (!Array.isArray(contingencyTable) || contingencyTable.length < 2) {return null;}
  const cols = contingencyTable[0].length;
  if (cols < 2 || contingencyTable.some((row) => row.length !== cols)) {return null;}

  const rows = contingencyTable.length;
  const rowTotals = contingencyTable.map((row) => sum(row));
  const colTotals = [];

  for (let j = 0; j < cols; j++) {
    colTotals.push(sum(contingencyTable.map((row) => row[j])));
  }

  const grandTotal = sum(rowTotals);
  if (grandTotal === 0) {return null;}

  // Calculate expected frequencies
  const expected = [];
  for (let i = 0; i < rows; i++) {
    expected[i] = [];
    for (let j = 0; j < cols; j++) {
      expected[i][j] = (rowTotals[i] * colTotals[j]) / grandTotal;
    }
  }

  // Calculate chi-square statistic
  let chiSquare = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (expected[i][j] > 0) {
        chiSquare += Math.pow(contingencyTable[i][j] - expected[i][j], 2) / expected[i][j];
      }
    }
  }

  const df = (rows - 1) * (cols - 1);
  const pValue = 1 - chiSquareCdf(chiSquare, df);

  // Cramer's V effect size
  const minDim = Math.min(rows - 1, cols - 1);
  const cramersV = Math.sqrt(chiSquare / (grandTotal * minDim));

  return {
    chiSquare,
    df,
    pValue,
    expected,
    rowTotals,
    colTotals,
    grandTotal,
    cramersV,
  };
}

// ============================================================================
// CORRELATION
// ============================================================================

/**
 * Calculate Pearson correlation coefficient.
 * @param {number[]} x - First variable
 * @param {number[]} y - Second variable
 * @returns {Object|null} Correlation results or null if invalid input
 */
export function pearsonCorrelation(x, y) {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length || x.length < 2) {
    return null;
  }

  const n = x.length;
  const xMean = mean(x);
  const yMean = mean(y);

  let ssXY = 0;
  let ssXX = 0;
  let ssYY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - xMean;
    const dy = y[i] - yMean;
    ssXY += dx * dy;
    ssXX += dx * dx;
    ssYY += dy * dy;
  }

  if (ssXX === 0 || ssYY === 0) {return { r: NaN, pValue: NaN, n };}

  const r = ssXY / Math.sqrt(ssXX * ssYY);

  // t-test for significance
  const tStatistic = r * Math.sqrt((n - 2) / (1 - r * r));
  const df = n - 2;
  const pValue = 2 * (1 - tCdf(Math.abs(tStatistic), df));

  // Confidence interval (Fisher's z-transformation)
  const zr = 0.5 * Math.log((1 + r) / (1 - r));
  const seZ = 1 / Math.sqrt(n - 3);
  const zCritical = normalQuantile(0.975);
  const zLower = zr - zCritical * seZ;
  const zUpper = zr + zCritical * seZ;
  const ciLower = (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1);
  const ciUpper = (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1);

  return {
    r,
    rSquared: r * r,
    tStatistic,
    df,
    pValue,
    confidenceInterval: { lower: ciLower, upper: ciUpper, level: 0.95 },
    n,
  };
}

/**
 * Calculate Spearman rank correlation coefficient.
 * @param {number[]} x - First variable
 * @param {number[]} y - Second variable
 * @returns {Object|null} Correlation results or null if invalid input
 */
export function spearmanCorrelation(x, y) {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length || x.length < 2) {
    return null;
  }

  // Compute ranks
  const rankX = computeRanks(x);
  const rankY = computeRanks(y);

  // Calculate Pearson correlation on ranks
  return pearsonCorrelation(rankX, rankY);
}

/**
 * Compute ranks for an array (with average rank for ties).
 */
function computeRanks(arr) {
  const n = arr.length;
  const sorted = arr.map((v, i) => ({ value: v, index: i })).sort((a, b) => a.value - b.value);

  const ranks = new Array(n);
  let i = 0;

  while (i < n) {
    let j = i;
    // Find all tied values
    while (j < n - 1 && sorted[j].value === sorted[j + 1].value) {
      j++;
    }
    // Average rank for tied values
    const avgRank = (i + j + 2) / 2;
    for (let k = i; k <= j; k++) {
      ranks[sorted[k].index] = avgRank;
    }
    i = j + 1;
  }

  return ranks;
}

/**
 * Calculate Kendall's tau correlation coefficient.
 * @param {number[]} x - First variable
 * @param {number[]} y - Second variable
 * @returns {Object|null} Correlation results or null if invalid input
 */
export function kendallCorrelation(x, y) {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length || x.length < 2) {
    return null;
  }

  const n = x.length;
  let concordant = 0;
  let discordant = 0;
  let tiesX = 0;
  let tiesY = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const xDiff = x[i] - x[j];
      const yDiff = y[i] - y[j];

      if (xDiff === 0 && yDiff === 0) {
        // Tie in both
        tiesX++;
        tiesY++;
      } else if (xDiff === 0) {
        tiesX++;
      } else if (yDiff === 0) {
        tiesY++;
      } else if (xDiff * yDiff > 0) {
        concordant++;
      } else {
        discordant++;
      }
    }
  }

  const n0 = (n * (n - 1)) / 2;
  const tau = (concordant - discordant) / Math.sqrt((n0 - tiesX) * (n0 - tiesY));

  // Approximate significance test
  const variance = (2 * (2 * n + 5)) / (9 * n * (n - 1));
  const zStatistic = tau / Math.sqrt(variance);
  const pValue = 2 * (1 - normalCdf(Math.abs(zStatistic)));

  return {
    tau,
    concordant,
    discordant,
    tiesX,
    tiesY,
    zStatistic,
    pValue,
    n,
  };
}

/**
 * Calculate correlation matrix for multiple variables.
 * @param {number[][]} data - Array of variables (each inner array is a variable)
 * @returns {Object|null} Correlation matrix or null if invalid input
 */
export function correlationMatrix(data) {
  if (!Array.isArray(data) || data.length < 2) {return null;}

  const k = data.length;
  const n = data[0].length;

  if (data.some((d) => d.length !== n)) {return null;}

  const matrix = [];
  const pValues = [];

  for (let i = 0; i < k; i++) {
    matrix[i] = [];
    pValues[i] = [];
    for (let j = 0; j < k; j++) {
      if (i === j) {
        matrix[i][j] = 1;
        pValues[i][j] = 0;
      } else if (j < i) {
        matrix[i][j] = matrix[j][i];
        pValues[i][j] = pValues[j][i];
      } else {
        const result = pearsonCorrelation(data[i], data[j]);
        matrix[i][j] = result ? result.r : NaN;
        pValues[i][j] = result ? result.pValue : NaN;
      }
    }
  }

  return { matrix, pValues, k, n };
}

// ============================================================================
// EXPORTS FOR RE-USE
// ============================================================================

export { parseDataset, mean, variance, standardDeviation, sum };
