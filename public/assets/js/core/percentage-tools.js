import { divide, percentOf, percentageChange } from "./math.js";

function isInvalidNumber(value) {
  return !Number.isFinite(value);
}

export function calculatePercentageChange(startValue, endValue) {
  if (isInvalidNumber(startValue) || isInvalidNumber(endValue)) {
    return { error: "Enter valid numbers for the starting and ending values." };
  }

  const change = percentageChange(startValue, endValue);
  if (change === null) {
    return { error: "Starting value must be greater than zero to calculate percent change." };
  }

  return { value: change };
}

export function calculatePercentOf(percent, value) {
  if (isInvalidNumber(percent) || isInvalidNumber(value)) {
    return { error: "Enter valid numbers for the percentage and value." };
  }

  return { value: percentOf(percent, value) };
}

export function calculateWhatPercent(part, whole) {
  if (isInvalidNumber(part) || isInvalidNumber(whole)) {
    return { error: "Enter valid numbers for the part and whole." };
  }

  const ratio = divide(part, whole);
  if (ratio === null) {
    return { error: "Whole value must be greater than zero." };
  }

  return { value: ratio * 100 };
}

export function calculateAddSubtractPercent(value, percent) {
  if (isInvalidNumber(value) || isInvalidNumber(percent)) {
    return { error: "Enter valid numbers for the value and percentage." };
  }

  const multiplier = percent / 100;
  return {
    addValue: value * (1 + multiplier),
    subtractValue: value * (1 - multiplier),
  };
}
