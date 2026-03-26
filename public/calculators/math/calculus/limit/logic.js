import { expressionParser } from '../../../../assets/js/core/expression-parser.js';

export class LimitCalculator {
  constructor(variable = 'x') {
    this.variable = variable;
    this.steps = [];
  }

  evaluateFunction(expr, value) {
    try {
      return expressionParser.evaluate(expr, value, this.variable);
    } catch {
      return NaN;
    }
  }

  calculateLimit(expr, a, direction = 'both', epsilon = 0.0001) {
    this.steps = [];

    let approachValue;
    let isInfinity = false;

    if (
      typeof a === 'string' &&
      (a.toLowerCase() === 'inf' || a.toLowerCase() === 'infinity' || a === '∞')
    ) {
      isInfinity = true;
      approachValue = Infinity;
    } else if (
      typeof a === 'string' &&
      (a.toLowerCase() === '-inf' || a.toLowerCase() === '-infinity' || a === '-∞')
    ) {
      isInfinity = true;
      approachValue = -Infinity;
    } else {
      approachValue = parseFloat(a);
    }

    this.steps.push(`Calculating lim[${this.variable}→${a}] f(${this.variable})`);
    this.steps.push(`Function: f(${this.variable}) = ${expr}\n`);

    if (isInfinity) {
      return this.calculateInfinityLimit(expr, approachValue);
    }

    const directValue = this.evaluateFunction(expr, approachValue);

    if (Number.isFinite(directValue)) {
      this.steps.push('Direct substitution:');
      this.steps.push(`f(${approachValue}) = ${directValue.toFixed(6)}`);
      this.steps.push('\nFunction is continuous at this point.');
      this.steps.push(`Limit = ${directValue.toFixed(6)}`);

      return {
        value: directValue,
        exists: true,
        continuous: true,
        leftLimit: directValue,
        rightLimit: directValue,
        form: 'direct',
      };
    }

    this.steps.push('Direct substitution yields an undefined or indeterminate form.');
    this.steps.push('Using numerical approximation...\n');

    let leftLimit;
    let rightLimit;

    if (direction === 'both' || direction === 'left') {
      leftLimit = this.numericalLimit(expr, approachValue, 'left', epsilon);
      this.steps.push(`Left-hand limit (x→${approachValue}⁻): ${leftLimit.toFixed(6)}`);
    }

    if (direction === 'both' || direction === 'right') {
      rightLimit = this.numericalLimit(expr, approachValue, 'right', epsilon);
      this.steps.push(`Right-hand limit (x→${approachValue}⁺): ${rightLimit.toFixed(6)}`);
    }

    let limitExists;
    let limitValue;

    if (direction === 'both') {
      const tolerance = 0.001;
      limitExists = Math.abs(leftLimit - rightLimit) < tolerance;

      if (limitExists) {
        limitValue = (leftLimit + rightLimit) / 2;
        this.steps.push('\nBoth one-sided limits agree.');
        this.steps.push(`Two-sided limit = ${limitValue.toFixed(6)}`);
      } else {
        this.steps.push('\nLeft and right limits differ.');
        this.steps.push('Two-sided limit does not exist.');
      }
    } else if (direction === 'left') {
      limitExists = Number.isFinite(leftLimit);
      limitValue = leftLimit;
    } else {
      limitExists = Number.isFinite(rightLimit);
      limitValue = rightLimit;
    }

    return {
      value: limitValue,
      exists: limitExists,
      continuous: false,
      leftLimit,
      rightLimit,
      form: Number.isNaN(directValue) ? 'indeterminate' : 'undefined',
    };
  }

  numericalLimit(expr, a, direction, epsilon) {
    const steps = 10;
    let sum = 0;
    let count = 0;

    for (let i = 1; i <= steps; i += 1) {
      const h = epsilon / Math.pow(2, i);
      const x = direction === 'left' ? a - h : a + h;
      const value = this.evaluateFunction(expr, x);

      if (Number.isFinite(value)) {
        sum += value;
        count += 1;
      }
    }

    return count > 0 ? sum / count : NaN;
  }

  calculateInfinityLimit(expr, infinity) {
    this.steps.push('Calculating limit at infinity using large values...\n');

    const sign = infinity > 0 ? 1 : -1;
    const values = [100, 1000, 10000, 100000].map((value) => value * sign);
    const results = values.map((value) => this.evaluateFunction(expr, value));

    this.steps.push('Sample values:');
    values.forEach((value, index) => {
      this.steps.push(`  f(${value}) = ${results[index].toFixed(6)}`);
    });

    const lastTwo = results.slice(-2);
    const convergenceCheck = Math.abs(lastTwo[1] - lastTwo[0]);
    const limitValue = lastTwo[1];

    if (convergenceCheck < 0.001) {
      this.steps.push(`\nFunction appears to converge to ${limitValue.toFixed(6)}`);
    } else if (!Number.isFinite(limitValue)) {
      this.steps.push('\nLimit is infinite or does not exist.');
    } else {
      this.steps.push(`\nLimit ≈ ${limitValue.toFixed(6)}`);
    }

    return {
      value: limitValue,
      exists: Number.isFinite(limitValue),
      continuous: false,
      form: 'infinity',
    };
  }
}
