/**
 * Statistics utility functions for CalcHowMuch calculators.
 * These functions provide core statistical operations used across multiple calculators.
 */

/**
 * Calculate the sum of all values in a dataset.
 * @param {number[]} data - Array of numbers
 * @returns {number} Sum of all values
 */
export function sum(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return 0;
  }
  return data.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculate the arithmetic mean (average) of a dataset.
 * @param {number[]} data - Array of numbers
 * @returns {number|null} Mean value or null if dataset is empty
 */
export function mean(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  return sum(data) / data.length;
}

/**
 * Calculate the median (middle value) of a dataset.
 * @param {number[]} data - Array of numbers
 * @returns {number|null} Median value or null if dataset is empty
 */
export function median(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate the mode(s) (most frequent values) of a dataset.
 * @param {number[]} data - Array of numbers
 * @returns {number[]|null} Array of mode values, or null if no mode exists
 */
export function mode(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const frequency = new Map();
  let maxFreq = 0;

  for (const val of data) {
    const count = (frequency.get(val) || 0) + 1;
    frequency.set(val, count);
    if (count > maxFreq) {
      maxFreq = count;
    }
  }

  // If all values appear only once, there is no mode
  if (maxFreq === 1) {
    return null;
  }

  const modes = [];
  for (const [val, count] of frequency) {
    if (count === maxFreq) {
      modes.push(val);
    }
  }

  // Sort modes for consistent output
  return modes.sort((a, b) => a - b);
}

/**
 * Find the minimum value in a dataset.
 * @param {number[]} data - Array of numbers
 * @returns {number|null} Minimum value or null if dataset is empty
 */
export function min(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  return Math.min(...data);
}

/**
 * Find the maximum value in a dataset.
 * @param {number[]} data - Array of numbers
 * @returns {number|null} Maximum value or null if dataset is empty
 */
export function max(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  return Math.max(...data);
}

/**
 * Calculate the range (max - min) of a dataset.
 * @param {number[]} data - Array of numbers
 * @returns {number|null} Range value or null if dataset is empty
 */
export function range(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  return max(data) - min(data);
}

/**
 * Calculate variance of a dataset.
 * @param {number[]} data - Array of numbers
 * @param {boolean} [sample=true] - If true, use sample variance (n-1), else population variance (n)
 * @returns {number|null} Variance value or null if dataset is invalid
 */
export function variance(data, sample = true) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Sample variance requires at least 2 values
  if (sample && data.length < 2) {
    return null;
  }

  const dataMean = mean(data);
  const squaredDiffs = data.map((val) => Math.pow(val - dataMean, 2));
  const sumSquaredDiffs = sum(squaredDiffs);

  const divisor = sample ? data.length - 1 : data.length;
  return sumSquaredDiffs / divisor;
}

/**
 * Calculate standard deviation of a dataset.
 * @param {number[]} data - Array of numbers
 * @param {boolean} [sample=true] - If true, use sample std dev (n-1), else population std dev (n)
 * @returns {number|null} Standard deviation value or null if dataset is invalid
 */
export function standardDeviation(data, sample = true) {
  const varianceValue = variance(data, sample);
  if (varianceValue === null) {
    return null;
  }
  return Math.sqrt(varianceValue);
}

/**
 * Parse a dataset string (comma, space, or newline separated) into an array of numbers.
 * @param {string} input - Input string containing numbers
 * @returns {{ data: number[], errors: string[] }} Parsed data and any invalid tokens
 */
export function parseDataset(input) {
  if (!input || typeof input !== 'string') {
    return { data: [], errors: [] };
  }

  // Split by comma, space, or newline and filter empty tokens
  const tokens = input
    .split(/[,\s\n]+/)
    .map((token) => token.trim())
    .filter((token) => token !== '');

  const data = [];
  const errors = [];

  for (const token of tokens) {
    const num = Number(token);
    if (Number.isFinite(num)) {
      data.push(num);
    } else {
      errors.push(token);
    }
  }

  return { data, errors };
}

/**
 * Calculate factorial of a non-negative integer.
 * Uses BigInt to handle large numbers up to n = 170 for Number compatibility.
 * @param {number} n - Non-negative integer
 * @returns {bigint|null} Factorial value or null if invalid input
 */
export function factorial(n) {
  if (!Number.isInteger(n) || n < 0) {
    return null;
  }
  if (n > 170) {
    return null; // Would overflow Number; return null to indicate error
  }
  let result = BigInt(1);
  for (let i = 2; i <= n; i++) {
    result *= BigInt(i);
  }
  return result;
}

/**
 * Calculate permutation nPr = n! / (n-r)!
 * @param {number} n - Total number of items
 * @param {number} r - Number of items to arrange
 * @returns {bigint|null} Permutation value or null if invalid input
 */
export function permutation(n, r) {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    return null;
  }
  if (n > 170) {
    return null;
  }
  // nPr = n! / (n-r)!
  let result = BigInt(1);
  for (let i = n - r + 1; i <= n; i++) {
    result *= BigInt(i);
  }
  return result;
}

/**
 * Calculate combination nCr = n! / (r! * (n-r)!)
 * @param {number} n - Total number of items
 * @param {number} r - Number of items to choose
 * @returns {bigint|null} Combination value or null if invalid input
 */
export function combination(n, r) {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    return null;
  }
  if (n > 170) {
    return null;
  }
  // Optimize by using the smaller of r and n-r
  const k = r < n - r ? r : n - r;
  let result = BigInt(1);
  for (let i = 0; i < k; i++) {
    result = (result * BigInt(n - i)) / BigInt(i + 1);
  }
  return result;
}

/**
 * Calculate z-score for a value given mean and standard deviation.
 * @param {number} x - The value
 * @param {number} mu - The mean
 * @param {number} sigma - The standard deviation (must be > 0)
 * @returns {number|null} Z-score or null if invalid input
 */
export function zScore(x, mu, sigma) {
  if (typeof x !== 'number' || typeof mu !== 'number' || typeof sigma !== 'number') {
    return null;
  }
  if (sigma <= 0) {
    return null;
  }
  return (x - mu) / sigma;
}

/**
 * Z-values for common confidence levels.
 * @type {Object.<string, number>}
 */
export const Z_VALUES = {
  '90%': 1.645,
  '95%': 1.96,
  '99%': 2.576,
};

/**
 * Calculate confidence interval for a population proportion.
 * @param {number} phatPercent - Sample proportion as a percentage (0-100)
 * @param {number} n - Sample size
 * @param {number} z - Z-value for confidence level
 * @returns {{ lower: number, upper: number, se: number, me: number }} Confidence interval bounds, standard error, and margin of error
 */
export function calculateProportionCI(phatPercent, n, z) {
  const phat = phatPercent / 100;
  const se = Math.sqrt((phat * (1 - phat)) / n);
  const me = z * se;
  const lower = Math.max(0, phat - me);
  const upper = Math.min(1, phat + me);
  return { lower, upper, se, me };
}

/**
 * Calculate confidence interval for a population mean with known standard deviation.
 * @param {number} xbar - Sample mean
 * @param {number} sigma - Population standard deviation
 * @param {number} n - Sample size
 * @param {number} z - Z-value for confidence level
 * @returns {{ lower: number, upper: number, se: number, me: number }} Confidence interval bounds, standard error, and margin of error
 */
export function calculateMeanCI(xbar, sigma, n, z) {
  const se = sigma / Math.sqrt(n);
  const me = z * se;
  const lower = xbar - me;
  const upper = xbar + me;
  return { lower, upper, se, me };
}
