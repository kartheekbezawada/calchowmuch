// Pure symbolic integration helpers for the integral calculator.

export class SymbolicIntegrator {
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

  integratePowerRule(coef, exponent) {
    if (exponent === -1) {
      return { type: 'ln', coef };
    }

    return {
      type: 'polynomial',
      coef: coef / (exponent + 1),
      exponent: exponent + 1,
      variable: this.variable,
    };
  }

  integratePolynomial(expr) {
    this.steps = [];
    this.steps.push(`Original function: f(x) = ${expr}`);

    const terms = this.parsePolynomial(expr);
    const integrals = [];

    this.steps.push('\nApplying power rule to each term:');

    for (const term of terms) {
      if (term.variable !== this.variable && term.variable !== '') continue;

      const original = this.formatTerm(term);
      const integral = this.integratePowerRule(term.coef, term.exponent);

      if (integral.type === 'ln') {
        integrals.push(integral);
        this.steps.push(`  ∫${original} dx = ${integral.coef}·ln|${this.variable}|`);
      } else {
        integrals.push(integral);
        const integralStr = this.formatIntegral(integral);
        this.steps.push(`  ∫${original} dx = ${integralStr}`);
      }
    }

    return integrals;
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

  formatIntegral(integral) {
    if (integral.type === 'ln') {
      return `${integral.coef}·ln|${this.variable}|`;
    }

    let str = '';

    if (integral.coef !== 1) {
      str += integral.coef.toFixed(4).replace(/\.?0+$/, '');
    }

    if (integral.exponent !== 0) {
      str += this.variable;
      if (integral.exponent !== 1) {
        str += '^' + integral.exponent;
      }
    }

    return str || integral.coef.toString();
  }

  formatExpression(terms) {
    if (terms.length === 0) return '0';

    let expr = '';
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const termStr = this.formatIntegral(term);

      if (i === 0) {
        expr += term.coef < 0 ? '-' : '';
        expr += termStr;
      } else {
        expr += term.coef < 0 ? ' - ' : ' + ';
        expr += termStr;
      }
    }

    return expr + ' + C';
  }

  integrate(expr) {
    const integrals = this.integratePolynomial(expr);
    const result = this.formatExpression(integrals);
    this.steps.push(`\nFinal result: ∫f(x)dx = ${result}`);

    return {
      integral: result,
      steps: this.steps,
      terms: integrals,
    };
  }

  evaluateDefinite(terms, a, b) {
    const evalAt = (x) => {
      let sum = 0;
      for (const term of terms) {
        if (term.type === 'ln') {
          sum += term.coef * Math.log(Math.abs(x));
        } else {
          sum += term.coef * Math.pow(x, term.exponent);
        }
      }
      return sum;
    };

    return evalAt(b) - evalAt(a);
  }
}
