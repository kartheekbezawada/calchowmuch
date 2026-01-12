export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    return null;
  }
  return a / b;
}

export function percentageChange(fromValue, toValue) {
  if (fromValue === 0) {
    return null;
  }

  return ((toValue - fromValue) / fromValue) * 100;
}

export function percentOf(percent, value) {
  return (percent / 100) * value;
}
