/**
 * Safe Expression Parser
 * Provides safe mathematical expression evaluation without using eval()
 */

export class ExpressionParser {
  constructor() {
    this.functionsMap = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      sqrt: Math.sqrt,
      ln: Math.log,
      log: value => Math.log10(value),
      exp: Math.exp,
      abs: Math.abs,
      neg: value => -value
    };

    this.precedence = {
      '^': 4,
      '*': 3,
      '/': 3,
      '+': 2,
      '-': 2
    };

    this.rightAssociative = {
      '^': true
    };
  }

  // Tokenize a mathematical expression into numbers, identifiers, operators, and parentheses
  tokenizeExpression(expr) {
    const tokens = [];
    const cleaned = expr.replace(/\s+/g, '');
    let i = 0;

    while (i < cleaned.length) {
      const ch = cleaned[i];

      // Number (integer or decimal)
      if (/[0-9.]/.test(ch)) {
        let numStr = ch;
        i++;
        while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) {
          numStr += cleaned[i];
          i++;
        }
        const value = Number(numStr);
        if (Number.isNaN(value)) {
          throw new Error(`Invalid number: ${numStr}`);
        }
        tokens.push({ type: 'number', value });
        continue;
      }

      // Identifier (variables and functions: x, n, sin, cos, etc.)
      if (/[a-zA-Z]/.test(ch)) {
        let id = ch;
        i++;
        while (i < cleaned.length && /[a-zA-Z0-9_]/.test(cleaned[i])) {
          id += cleaned[i];
          i++;
        }
        tokens.push({ type: 'identifier', value: id });
        continue;
      }

      // Parentheses
      if (ch === '(' || ch === ')') {
        tokens.push({ type: 'parenthesis', value: ch });
        i++;
        continue;
      }

      // Operators
      if ('+-*/^'.includes(ch)) {
        tokens.push({ type: 'operator', value: ch });
        i++;
        continue;
      }

      throw new Error(`Unexpected character: '${ch}'`);
    }

    return tokens;
  }

  // Convert tokens to Reverse Polish Notation (RPN) using the shunting-yard algorithm
  toRPN(tokens, variable = 'x') {
    const output = [];
    const operators = [];

    const isFunction = id => Object.keys(this.functionsMap).includes(id);

    let previousToken = null;

    for (const token of tokens) {
      if (token.type === 'number') {
        output.push(token);
      } else if (token.type === 'identifier') {
        if (token.value === variable) {
          output.push({ type: 'variable', value: variable });
        } else if (isFunction(token.value)) {
          operators.push({ type: 'function', value: token.value });
        } else {
          throw new Error(`Unknown identifier: ${token.value}`);
        }
      } else if (token.type === 'operator') {
        // Handle unary minus: treat as a special function 'neg'
        const isUnaryMinus =
          token.value === '-' &&
          (previousToken === null ||
            (previousToken.type === 'operator' ||
              (previousToken.type === 'parenthesis' && previousToken.value === '(') ||
              previousToken.type === 'function'));

        if (isUnaryMinus) {
          operators.push({ type: 'function', value: 'neg' });
        } else {
          while (operators.length > 0) {
            const top = operators[operators.length - 1];
            if (top.type === 'operator') {
              const o1 = token.value;
              const o2 = top.value;
              const p1 = this.precedence[o1];
              const p2 = this.precedence[o2];
              if (
                (this.rightAssociative[o1] && p1 < p2) ||
                (!this.rightAssociative[o1] && p1 <= p2)
              ) {
                output.push(operators.pop());
                continue;
              }
            } else if (top.type === 'function') {
              output.push(operators.pop());
              continue;
            }
            break;
          }
          operators.push({ type: 'operator', value: token.value });
        }
      } else if (token.type === 'parenthesis') {
        if (token.value === '(') {
          operators.push(token);
        } else {
          // token.value === ')'
          let foundLeftParen = false;
          while (operators.length > 0) {
            const op = operators.pop();
            if (op.type === 'parenthesis' && op.value === '(') {
              foundLeftParen = true;
              break;
            }
            output.push(op);
          }
          if (!foundLeftParen) {
            throw new Error('Mismatched parentheses');
          }
          // After ')', if there is a function at the top of the stack, pop it
          if (operators.length > 0 && operators[operators.length - 1].type === 'function') {
            output.push(operators.pop());
          }
        }
      }

      previousToken = token;
    }

    while (operators.length > 0) {
      const op = operators.pop();
      if (op.type === 'parenthesis') {
        throw new Error('Mismatched parentheses');
      }
      output.push(op);
    }

    return output;
  }

  // Evaluate an RPN expression at a given variable value
  evaluateRPN(rpn, varValue) {
    const stack = [];

    for (const token of rpn) {
      if (token.type === 'number') {
        stack.push(token.value);
      } else if (token.type === 'variable') {
        stack.push(varValue);
      } else if (token.type === 'operator') {
        if (stack.length < 2) {
          throw new Error('Insufficient values in expression');
        }
        const b = stack.pop();
        const a = stack.pop();
        let result;
        switch (token.value) {
          case '+':
            result = a + b;
            break;
          case '-':
            result = a - b;
            break;
          case '*':
            result = a * b;
            break;
          case '/':
            result = a / b;
            break;
          case '^':
            result = Math.pow(a, b);
            break;
          default:
            throw new Error(`Unsupported operator: ${token.value}`);
        }
        stack.push(result);
      } else if (token.type === 'function') {
        const fn = this.functionsMap[token.value];
        if (!fn) {
          throw new Error(`Unsupported function: ${token.value}`);
        }
        if (stack.length < 1) {
          throw new Error('Insufficient values for function');
        }
        const v = stack.pop();
        const result = fn(v);
        stack.push(result);
      } else {
        throw new Error('Invalid token in RPN expression');
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid expression');
    }

    return stack[0];
  }

  // Main evaluation function
  evaluate(expr, varValue, variable = 'x') {
    try {
      // Normalize exponent operator to '^' if user used '**'
      let normalizedExpr = expr.replace(/\*\*/g, '^');
      const tokens = this.tokenizeExpression(normalizedExpr);
      const rpn = this.toRPN(tokens, variable);
      return this.evaluateRPN(rpn, varValue);
    } catch (e) {
      throw new Error(`Cannot evaluate expression at ${variable}=${varValue}: ${e.message}`);
    }
  }
}

// Create singleton instance
export const expressionParser = new ExpressionParser();
