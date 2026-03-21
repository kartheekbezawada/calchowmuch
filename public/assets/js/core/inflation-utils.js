import {
  US_CPI_BY_YEAR,
  US_CPI_FIRST_MONTH,
  US_CPI_LAST_MONTH,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE,
} from './us-cpi-data.js';

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function parseMonthValue(value) {
  const normalized = String(value || '').trim();
  const match = normalized.match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = match[1];
  const monthIndex = Number(match[2]) - 1;

  if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  return {
    key: normalized,
    year,
    monthIndex,
  };
}

function monthPosition({ year, monthIndex }) {
  return Number(year) * 12 + monthIndex;
}

export function getAvailableCpiMonthRange() {
  return {
    min: US_CPI_FIRST_MONTH,
    max: US_CPI_LAST_MONTH,
  };
}

export function getLatestAvailableCpiMonth() {
  return US_CPI_LAST_MONTH;
}

export function getCpiValue(monthValue) {
  const parsed = parseMonthValue(monthValue);

  if (!parsed) {
    return null;
  }

  const row = US_CPI_BY_YEAR[parsed.year];
  const value = Array.isArray(row) ? row[parsed.monthIndex] : null;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function isCpiMonthAvailable(monthValue) {
  return getCpiValue(monthValue) !== null;
}

export function formatCpiMonth(monthValue) {
  const parsed = parseMonthValue(monthValue);

  if (!parsed) {
    return '';
  }

  return MONTH_FORMATTER.format(new Date(Date.UTC(Number(parsed.year), parsed.monthIndex, 1)));
}

export function validateInflationInputs({ amount, fromMonth, toMonth }) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return 'Amount must be greater than 0.';
  }

  const from = parseMonthValue(fromMonth);
  const to = parseMonthValue(toMonth);

  if (!from || !to) {
    return 'Choose both a start month and an end month.';
  }

  if (monthPosition(to) < monthPosition(from)) {
    return 'End month must be the same as or later than start month.';
  }

  if (getCpiValue(fromMonth) === null || getCpiValue(toMonth) === null) {
    return 'CPI data is unavailable for one of the selected months.';
  }

  return null;
}

export function calculateInflationAdjustment({ amount, fromMonth, toMonth }) {
  const error = validateInflationInputs({ amount, fromMonth, toMonth });

  if (error) {
    return { error };
  }

  const numericAmount = Number(amount);
  const from = parseMonthValue(fromMonth);
  const to = parseMonthValue(toMonth);
  const startCpi = getCpiValue(fromMonth);
  const endCpi = getCpiValue(toMonth);
  const monthSpan = monthPosition(to) - monthPosition(from);
  const inflationFactor = endCpi / startCpi;
  const equivalentValue = numericAmount * inflationFactor;
  const absoluteChange = equivalentValue - numericAmount;
  const cumulativeInflationRate = inflationFactor - 1;
  const annualizedInflationRate =
    monthSpan === 0 ? 0 : Math.pow(inflationFactor, 12 / monthSpan) - 1;

  return {
    amount: numericAmount,
    fromMonth,
    toMonth,
    fromLabel: formatCpiMonth(fromMonth),
    toLabel: formatCpiMonth(toMonth),
    startCpi,
    endCpi,
    monthSpan,
    inflationFactor,
    equivalentValue,
    absoluteChange,
    cumulativeInflationRate,
    annualizedInflationRate,
    seriesId: US_CPI_SERIES_ID,
    source: US_CPI_SOURCE,
  };
}
