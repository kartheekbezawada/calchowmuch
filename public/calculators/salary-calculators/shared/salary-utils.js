import {
  formatCurrency as coreFormatCurrency,
  formatPercent as coreFormatPercent,
} from '../../../assets/js/core/format.js';

const SITE_URL = 'https://calchowmuch.com';

export function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function isNonNegativeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function formatCurrency(value) {
  return coreFormatCurrency(value, 'USD');
}

export function formatPercent(value, maximumFractionDigits = 2) {
  return coreFormatPercent(value, { maximumFractionDigits });
}

export function setText(node, value) {
  if (node) {
    node.textContent = String(value);
  }
}

export function setHidden(node, hidden) {
  if (!node) {
    return;
  }
  node.hidden = hidden;
  node.setAttribute('aria-hidden', String(hidden));
}

export function setFieldState({ section, input, active }) {
  setHidden(section, !active);
  if (input) {
    input.disabled = !active;
    input.tabIndex = active ? 0 : -1;
  }
}

export function updateTokens(root, attribute, values) {
  if (!root) {
    return;
  }
  root.querySelectorAll(`[data-${attribute}]`).forEach((node) => {
    const key = node.getAttribute(`data-${attribute}`);
    if (!key || !Object.prototype.hasOwnProperty.call(values, key)) {
      return;
    }
    node.textContent = String(values[key]);
  });
}

export function getInputNumber(input) {
  return parseNumber(input?.value ?? '');
}

export function formatInputValue(input, fallback) {
  const value = String(input?.value ?? '').trim();
  return value || fallback;
}

export async function copyTextToClipboard(text) {
  if (!text) {
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_error) {
    // Fall through to the textarea fallback.
  }

  try {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', 'true');
    helper.style.position = 'absolute';
    helper.style.left = '-9999px';
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand('copy');
    helper.remove();
    return copied;
  } catch (_error) {
    return false;
  }
}

export function getInputMode(group, fallback) {
  const active = group?.querySelector('button.is-active[data-value]');
  return active?.dataset.value ?? fallback;
}

export function toAnnualPay({ amount, frequency, hoursPerWeek, weeksPerYear, daysPerWeek }) {
  if (!isPositiveNumber(amount)) {
    return null;
  }

  switch (frequency) {
    case 'hourly':
      if (!isPositiveNumber(hoursPerWeek) || !isPositiveNumber(weeksPerYear)) {
        return null;
      }
      return amount * hoursPerWeek * weeksPerYear;
    case 'daily':
      if (!isPositiveNumber(daysPerWeek) || !isPositiveNumber(weeksPerYear)) {
        return null;
      }
      return amount * daysPerWeek * weeksPerYear;
    case 'weekly':
      if (!isPositiveNumber(weeksPerYear)) {
        return null;
      }
      return amount * weeksPerYear;
    case 'biweekly':
      return amount * 26;
    case 'monthly':
      return amount * 12;
    case 'annual':
      return amount;
    default:
      return null;
  }
}

export function convertAnnualPay({ annualPay, hoursPerWeek, weeksPerYear, daysPerWeek }) {
  if (!isPositiveNumber(annualPay) || !isPositiveNumber(weeksPerYear)) {
    return null;
  }

  const weeklyPay = annualPay / weeksPerYear;
  const monthlyPay = annualPay / 12;
  const biweeklyPay = annualPay / 26;
  const dailyPay = isPositiveNumber(daysPerWeek) ? weeklyPay / daysPerWeek : null;
  const hourlyPay = isPositiveNumber(hoursPerWeek) ? weeklyPay / hoursPerWeek : null;

  return {
    annualPay,
    monthlyPay,
    biweeklyPay,
    weeklyPay,
    dailyPay,
    hourlyPay,
  };
}

export function calculateSalaryConversion({
  amount,
  frequency,
  hoursPerWeek,
  weeksPerYear,
  daysPerWeek,
}) {
  const annualPay = toAnnualPay({ amount, frequency, hoursPerWeek, weeksPerYear, daysPerWeek });
  if (!isPositiveNumber(annualPay)) {
    return null;
  }

  return convertAnnualPay({ annualPay, hoursPerWeek, weeksPerYear, daysPerWeek });
}

export function calculateHourlyToSalary({ hourlyRate, hoursPerWeek, weeksPerYear }) {
  return calculateSalaryConversion({
    amount: hourlyRate,
    frequency: 'hourly',
    hoursPerWeek,
    weeksPerYear,
    daysPerWeek: 5,
  });
}

export function calculateSalaryToHourly({ annualSalary, hoursPerWeek, weeksPerYear }) {
  return calculateSalaryConversion({
    amount: annualSalary,
    frequency: 'annual',
    hoursPerWeek,
    weeksPerYear,
    daysPerWeek: 5,
  });
}

export function calculateAnnualToMonthly({ annualSalary, weeksPerYear }) {
  if (!isPositiveNumber(annualSalary) || !isPositiveNumber(weeksPerYear)) {
    return null;
  }

  return {
    annualSalary,
    monthlySalary: annualSalary / 12,
    biweeklyPay: annualSalary / 26,
    weeklyPay: annualSalary / weeksPerYear,
  };
}

export function calculateMonthlyToAnnual({ monthlySalary, weeksPerYear }) {
  if (!isPositiveNumber(monthlySalary) || !isPositiveNumber(weeksPerYear)) {
    return null;
  }

  const annualSalary = monthlySalary * 12;
  return {
    monthlySalary,
    annualSalary,
    biweeklyPay: annualSalary / 26,
    weeklyPay: annualSalary / weeksPerYear,
  };
}

export function calculateWeeklyPay({
  mode = 'standard',
  hourlyRate,
  totalWeeklyHours,
  regularHours,
  overtimeHours,
  overtimeMultiplier,
  weeksPerYear,
}) {
  if (!isPositiveNumber(hourlyRate)) {
    return null;
  }

  let weeklyPay;

  if (mode === 'split') {
    if (
      !isNonNegativeNumber(regularHours) ||
      !isNonNegativeNumber(overtimeHours) ||
      !isPositiveNumber(overtimeMultiplier)
    ) {
      return null;
    }
    weeklyPay = regularHours * hourlyRate + overtimeHours * hourlyRate * overtimeMultiplier;
  } else {
    if (!isPositiveNumber(totalWeeklyHours)) {
      return null;
    }
    weeklyPay = totalWeeklyHours * hourlyRate;
  }

  if (!Number.isFinite(weeklyPay)) {
    return null;
  }

  const annualizedPay = isPositiveNumber(weeksPerYear) ? weeklyPay * weeksPerYear : null;
  return {
    weeklyPay,
    annualizedPay,
  };
}

export function calculateOvertimePay({ hourlyRate, overtimeHours, overtimeMultiplier, basePay }) {
  if (
    !isPositiveNumber(hourlyRate) ||
    !isNonNegativeNumber(overtimeHours) ||
    !isPositiveNumber(overtimeMultiplier)
  ) {
    return null;
  }

  if (basePay !== null && basePay !== undefined && !isNonNegativeNumber(basePay)) {
    return null;
  }

  const overtimePay = hourlyRate * overtimeHours * overtimeMultiplier;
  return {
    overtimePay,
    totalPay:
      basePay === null || basePay === undefined ? null : Number(basePay) + Number(overtimePay),
  };
}

export function calculateRaise({ currentSalary, mode = 'percent', raisePercent, raiseAmount }) {
  if (!isPositiveNumber(currentSalary)) {
    return null;
  }

  let resolvedRaiseAmount;

  if (mode === 'amount') {
    if (!isNonNegativeNumber(raiseAmount)) {
      return null;
    }
    resolvedRaiseAmount = raiseAmount;
  } else {
    if (!isNonNegativeNumber(raisePercent)) {
      return null;
    }
    resolvedRaiseAmount = currentSalary * (raisePercent / 100);
  }

  const newSalary = currentSalary + resolvedRaiseAmount;
  const percentIncrease = currentSalary === 0 ? null : (resolvedRaiseAmount / currentSalary) * 100;

  return {
    newSalary,
    raiseAmount: resolvedRaiseAmount,
    percentIncrease,
  };
}

export function calculateBonus({ salaryAmount, mode = 'percent', bonusPercent, bonusAmount }) {
  if (!isPositiveNumber(salaryAmount)) {
    return null;
  }

  let resolvedBonusAmount;

  if (mode === 'amount') {
    if (!isNonNegativeNumber(bonusAmount)) {
      return null;
    }
    resolvedBonusAmount = bonusAmount;
  } else {
    if (!isNonNegativeNumber(bonusPercent)) {
      return null;
    }
    resolvedBonusAmount = salaryAmount * (bonusPercent / 100);
  }

  const totalCompensation = salaryAmount + resolvedBonusAmount;
  const resolvedBonusPercent = salaryAmount === 0 ? null : (resolvedBonusAmount / salaryAmount) * 100;

  return {
    bonusAmount: resolvedBonusAmount,
    totalCompensation,
    bonusPercent: resolvedBonusPercent,
  };
}

export function calculateSalaryCommission({
  salesAmount,
  mode = 'rate',
  commissionRate,
  commissionAmount,
  basePay,
}) {
  if (!isPositiveNumber(salesAmount)) {
    return null;
  }

  let resolvedCommissionAmount;

  if (mode === 'amount') {
    if (!isNonNegativeNumber(commissionAmount)) {
      return null;
    }
    resolvedCommissionAmount = commissionAmount;
  } else {
    if (!isNonNegativeNumber(commissionRate)) {
      return null;
    }
    resolvedCommissionAmount = salesAmount * (commissionRate / 100);
  }

  if (basePay !== null && basePay !== undefined && !isNonNegativeNumber(basePay)) {
    return null;
  }

  const effectiveCommissionRate =
    salesAmount === 0 ? null : (resolvedCommissionAmount / salesAmount) * 100;

  return {
    commissionAmount: resolvedCommissionAmount,
    totalEarnings:
      basePay === null || basePay === undefined ? null : Number(basePay) + Number(resolvedCommissionAmount),
    effectiveCommissionRate,
  };
}

export function calculateInflationAdjustedSalary({
  currentSalary,
  newSalary,
  annualInflationRate,
  yearsBetween,
}) {
  if (!isPositiveNumber(currentSalary) || !isPositiveNumber(newSalary)) {
    return null;
  }

  if (!isNonNegativeNumber(annualInflationRate) || !isNonNegativeNumber(yearsBetween)) {
    return null;
  }

  const inflationMultiplier = Math.pow(1 + annualInflationRate / 100, yearsBetween);
  const requiredSalary = currentSalary * inflationMultiplier;
  const nominalRaiseAmount = newSalary - currentSalary;
  const nominalRaisePercent = (nominalRaiseAmount / currentSalary) * 100;
  const newSalaryInTodayDollars = newSalary / inflationMultiplier;
  const realRaiseAmount = newSalary - requiredSalary;
  const realRaisePercent = requiredSalary === 0 ? null : (realRaiseAmount / requiredSalary) * 100;
  const buyingPowerChange = newSalaryInTodayDollars - currentSalary;

  return {
    currentSalary,
    newSalary,
    annualInflationRate,
    yearsBetween,
    inflationMultiplier,
    requiredSalary,
    nominalRaiseAmount,
    nominalRaisePercent,
    newSalaryInTodayDollars,
    realRaiseAmount,
    realRaisePercent,
    buyingPowerChange,
  };
}

export function buildSalaryMetadata({
  title,
  description,
  canonical,
  name,
  appDescription,
  featureList = [],
  keywords = '',
  faqSchema = null,
}) {
  const metadata = {
    title,
    description,
    canonical,
    pageSchema: {
      calculatorFAQ: Boolean(faqSchema),
      globalFAQ: false,
    },
    calculatorFAQSchema: faqSchema,
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          name: title,
          url: canonical,
          description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          publisher: { '@id': `${SITE_URL}/#organization` },
          inLanguage: 'en',
        },
        {
          '@type': 'SoftwareApplication',
          '@id': `${canonical}#softwareapplication`,
          name,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          url: canonical,
          description: appDescription,
          inLanguage: 'en',
          provider: { '@id': `${SITE_URL}/#organization` },
          featureList,
          keywords,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumbs`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${SITE_URL}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Salary Calculators',
              item: `${SITE_URL}/salary-calculators/`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name,
              item: canonical,
            },
          ],
        },
      ],
    },
  };

  return metadata;
}
