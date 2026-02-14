import { describe, it, expect } from 'vitest';
import {
  bayesProbability,
  binomialProbability,
  conditionalProbability,
  normalApproxBinomialProbability,
  probabilityAndIndependent,
  probabilityFromOutcomes,
  probabilityOrIndependent,
} from '../../public/assets/js/core/stats.js';

/**
 * PROB-TEST-U-1 - Basic probability operations
 */
describe('Probability - PROB-TEST-U-1: Basic operations', () => {
  it('calculates probability from outcomes', () => {
    expect(probabilityFromOutcomes(3, 10)).toBeCloseTo(0.3);
  });

  it('calculates AND and OR for independent events', () => {
    expect(probabilityAndIndependent(0.3, 0.5)).toBeCloseTo(0.15);
    expect(probabilityOrIndependent(0.3, 0.5)).toBeCloseTo(0.65);
  });
});

/**
 * PROB-TEST-U-2 - Conditional, Bayes, and distribution
 */
describe('Probability - PROB-TEST-U-2: Conditional and distribution', () => {
  it('calculates conditional probability', () => {
    expect(conditionalProbability(0.12, 0.3)).toBeCloseTo(0.4);
  });

  it('calculates Bayes theorem', () => {
    expect(bayesProbability(0.3, 0.5, 0.25)).toBeCloseTo(0.6);
  });

  it('calculates binomial and normal approximation', () => {
    expect(binomialProbability(10, 3, 0.4)).toBeCloseTo(0.21499, 4);
    expect(normalApproxBinomialProbability(10, 3, 0.4)).toBeGreaterThan(0);
  });
});
