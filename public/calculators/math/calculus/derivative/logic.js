// Pure symbolic differentiation helpers for the derivative calculator.

export class SymbolicDifferentiator {
  constructor(variable = 'x') {
    this.variable = variable;
    this.steps = [];
  }

  parsePolynomial(expr) {
    const cleaned = expr.replace(/\s/g, '');
    if (!cleaned) {
      return [];
    }

    const normalized = cleaned.startsWith('-') ? cleaned : `+${cleaned}`;
    const rawTerms = normalized.replace(/-/g, '+-').split('+').filter(Boolean);

    return rawTerms.map((rawTerm) => {
      const variableMatch = rawTerm.match(/^([+-]?\d*\.?\d*)\*?([a-z])(?:\^([+-]?\d*\.?\d+))?$/i);
      if (variableMatch) {
        const [, rawCoef, variable, rawExponent] = variableMatch;
        const coef =
          rawCoef === '' || rawCoef === '+'
            ? 1
            : rawCoef === '-'
              ? -1
              : parseFloat(rawCoef);
        const exponent = rawExponent ? parseFloat(rawExponent) : 1;

        if (!Number.isFinite(coef) || !Number.isFinite(exponent)) {
          throw new Error(`Unsupported term: ${rawTerm}`);
        }

        return { coef, variable, exponent };
      }

      const constantMatch = rawTerm.match(/^([+-]?\d*\.?\d+)$/);
      if (constantMatch) {
        const coef = parseFloat(constantMatch[1]);
        if (!Number.isFinite(coef)) {
          throw new Error(`Unsupported constant: ${rawTerm}`);
        }
        return { coef, variable: '', exponent: 0 };
      }

      throw new Error(`Unsupported expression term: ${rawTerm}`);
    });
  }

  differentiatePowerRule(coef, exponent) {
    if (exponent === 0) return { coef: 0, exponent: 0 };
    return {
      coef: coef * exponent,
      exponent: exponent - 1,
    };
  }

  differentiatePolynomial(expr) {
    this.steps = [];
    this.steps.push(`Original function: f(x) = ${expr}`);

    const terms = this.parsePolynomial(expr);
    const derivatives = [];

    this.steps.push('\nApplying power rule to each term:');

    for (const term of terms) {
      if (term.variable !== this.variable && term.variable !== '') continue;

      const original = this.formatTerm(term);
      const deriv = {
        ...this.differentiatePowerRule(term.coef, term.exponent),
        variable: term.variable || this.variable,
      };

      if (deriv.coef !== 0) {
        derivatives.push(deriv);
        const derivStr = this.formatDerivative(term, deriv);
        this.steps.push(`  d/dx(${original}) = ${derivStr}`);
      } else {
        this.steps.push(`  d/dx(${original}) = 0 (constant rule)`);
      }
    }

    return derivatives;
  }

  formatTerm(term) {
    let str = '';

    if (term.coef === 0) return '0';

    if (Math.abs(term.coef) !== 1 || term.exponent === 0) {
      str += Math.abs(term.coef);
    }

    if (term.variable && term.exponent !== 0) {
      str += term.variable;
      if (term.exponent !== 1) {
        str += '^' + term.exponent;
      }
    }

    return str || '1';
  }

  formatDerivative(original, deriv) {
    if (deriv.exponent === 0) {
      return deriv.coef.toString();
    }

    let str = deriv.coef !== 1 ? deriv.coef.toString() : '';
    str += this.variable;
    if (deriv.exponent !== 1) {
      str += '^' + deriv.exponent;
    }

    return str;
  }

  formatExpression(terms) {
    if (terms.length === 0) return '0';

    let expr = '';
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const termStr = this.formatTerm(term);

      if (i === 0) {
        expr += term.coef < 0 ? '-' : '';
        expr += termStr;
      } else {
        expr += term.coef < 0 ? ' - ' : ' + ';
        expr += termStr;
      }
    }

    return expr;
  }

  differentiate(expr, order = 1) {
    let currentExpr = expr;
    let allSteps = [];

    for (let i = 0; i < order; i++) {
      const derivatives = this.differentiatePolynomial(currentExpr);
      allSteps.push(...this.steps);

      if (i < order - 1) {
        currentExpr = this.formatExpression(derivatives);
        allSteps.push(`\n--- Computing derivative ${i + 2} ---`);
      } else {
        const result = this.formatExpression(derivatives);
        allSteps.push(`\nFinal derivative: f${"'".repeat(order)}(x) = ${result}`);
        return {
          derivative: result,
          steps: allSteps,
          terms: derivatives,
        };
      }
    }
  }

  evaluateAt(terms, point) {
    let sum = 0;
    for (const term of terms) {
      sum += term.coef * Math.pow(point, term.exponent);
    }
    return sum;
  }
}
