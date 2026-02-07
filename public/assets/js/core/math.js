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

export function calculateCommission({ sales, mode = 'flat', rate = 0, tiers = [] }) {
  const salesValue = Number(sales);
  if (!Number.isFinite(salesValue) || salesValue < 0) {
    return null;
  }

  if (mode === 'flat') {
    const rateValue = Number(rate);
    if (!Number.isFinite(rateValue) || rateValue < 0) {
      return null;
    }
    const totalCommission = (salesValue * rateValue) / 100;
    const effectiveRate = salesValue === 0 ? 0 : (totalCommission / salesValue) * 100;
    return {
      mode: 'flat',
      sales: salesValue,
      totalCommission,
      effectiveRate,
      formula: 'Commission = Sales × (Rate / 100)',
      breakdown: [],
    };
  }

  if (mode !== 'tiered' || !Array.isArray(tiers) || tiers.length === 0) {
    return null;
  }

  const normalized = [];
  let previousUpper = 0;

  for (let i = 0; i < tiers.length; i += 1) {
    const tier = tiers[i] ?? {};
    const rateValue = Number(tier.rate);
    const hasUpper = tier.upTo !== null && tier.upTo !== undefined && String(tier.upTo) !== '';
    const upperValue = hasUpper ? Number(tier.upTo) : null;

    if (!Number.isFinite(rateValue) || rateValue < 0) {
      return null;
    }

    if (hasUpper) {
      if (!Number.isFinite(upperValue) || upperValue <= previousUpper) {
        return null;
      }
      previousUpper = upperValue;
    }

    normalized.push({
      upTo: hasUpper ? upperValue : null,
      rate: rateValue,
    });
  }

  const breakdown = [];
  let totalCommission = 0;
  let lowerBound = 0;

  for (let i = 0; i < normalized.length; i += 1) {
    const tier = normalized[i];
    const upperBound = tier.upTo === null ? Infinity : tier.upTo;
    const tierCapacity = upperBound - lowerBound;
    const tierSales = Math.max(0, Math.min(salesValue - lowerBound, tierCapacity));
    const tierCommission = (tierSales * tier.rate) / 100;

    breakdown.push({
      index: i + 1,
      from: lowerBound,
      to: Number.isFinite(upperBound) ? upperBound : null,
      sales: tierSales,
      rate: tier.rate,
      commission: tierCommission,
    });

    totalCommission += tierCommission;

    if (!Number.isFinite(upperBound) || salesValue <= upperBound) {
      lowerBound = upperBound;
      break;
    }

    lowerBound = upperBound;
  }

  if (salesValue > lowerBound && Number.isFinite(lowerBound)) {
    const fallbackRate = normalized[normalized.length - 1].rate;
    const remainingSales = salesValue - lowerBound;
    const extraCommission = (remainingSales * fallbackRate) / 100;
    breakdown.push({
      index: breakdown.length + 1,
      from: lowerBound,
      to: null,
      sales: remainingSales,
      rate: fallbackRate,
      commission: extraCommission,
    });
    totalCommission += extraCommission;
  }

  const effectiveRate = salesValue === 0 ? 0 : (totalCommission / salesValue) * 100;

  return {
    mode: 'tiered',
    sales: salesValue,
    totalCommission,
    effectiveRate,
    formula: 'Total Commission = Sum(Tier Sales × Tier Rate / 100)',
    breakdown,
  };
}
