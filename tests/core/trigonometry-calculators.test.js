import { describe, it, expect } from 'vitest';
import {
  computeTrigValues,
  degToRad,
  detectTriangleType,
  getInverseTrigSolutions,
  getQuadrantFromDegrees,
  getReferenceAngleDegrees,
  getSpecialAngleInfo,
  solveTriangle,
} from '../../public/assets/js/core/trigonometry.js';

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
