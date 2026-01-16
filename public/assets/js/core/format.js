export function formatNumber(value, options = {}) {
  const { maximumFractionDigits = 2, minimumFractionDigits = 0 } = options;
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits,
    minimumFractionDigits,
  });
}

export function formatCurrency(value, currency = 'USD') {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return Number(value).toLocaleString(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value, options = {}) {
  const { maximumFractionDigits = 2 } = options;
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return `${Number(value).toLocaleString(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  })}%`;
}
