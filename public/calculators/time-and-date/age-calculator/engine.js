import {
  calculateBirthdayWeekdays,
  calculateDaysUntil,
  calculateExactAge,
  getWeekdayName,
} from '../../../assets/js/core/date-diff-utils.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function toStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffInDays(start, end) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / DAY_MS);
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatWholeNumber(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function formatWeeks(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function pluralize(value, singular, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function formatAgeValue({ years, months, days }) {
  return `${pluralize(years, 'year')}, ${pluralize(months, 'month')}, ${pluralize(days, 'day')}`;
}

export function getNextBirthdayModel(birthDate, asOfDate, currentAgeYears = 0) {
  if (!isValidDate(birthDate) || !isValidDate(asOfDate)) {
    return null;
  }

  const comparisonDate = toStartOfDay(asOfDate);
  const currentYear = comparisonDate.getFullYear();

  let birthdayData = calculateBirthdayWeekdays(birthDate, currentYear);
  if (!birthdayData) {
    return null;
  }

  let targetDate = toStartOfDay(birthdayData.targetDate);
  if (targetDate < comparisonDate) {
    birthdayData = calculateBirthdayWeekdays(birthDate, currentYear + 1);
    if (!birthdayData) {
      return null;
    }
    targetDate = toStartOfDay(birthdayData.targetDate);
  }

  const daysRemaining = calculateDaysUntil(targetDate, comparisonDate);
  const isToday = daysRemaining === 0;
  const upcomingAge = isToday ? currentAgeYears : currentAgeYears + 1;
  const dateLabel = formatLongDate(targetDate);
  const weekday = birthdayData.targetWeekday;

  return {
    isToday,
    daysRemaining,
    weekday,
    dateLabel,
    headline: isToday ? 'Birthday today' : `In ${pluralize(daysRemaining, 'day')}`,
    detail: isToday
      ? `Turns ${upcomingAge} today (${weekday}, ${dateLabel})`
      : `Turns ${upcomingAge} on ${weekday}, ${dateLabel}`,
  };
}

export function buildAgeViewModel({ birthDate, asOfDate }) {
  if (!isValidDate(birthDate) || !isValidDate(asOfDate) || asOfDate < birthDate) {
    return null;
  }

  const birth = toStartOfDay(birthDate);
  const asOf = toStartOfDay(asOfDate);
  const exactAge = calculateExactAge(birth, asOf);
  if (!exactAge) {
    return null;
  }

  const totalDays = diffInDays(birth, asOf);
  const totalMonths = exactAge.years * 12 + exactAge.months;
  const totalWeeks = totalDays / 7;
  const bornWeekday = getWeekdayName(birth) ?? 'Unknown';
  const birthDateLabel = formatLongDate(birth);
  const asOfLabel = formatLongDate(asOf);
  const headline = formatAgeValue(exactAge);
  const nextBirthday = getNextBirthdayModel(birth, asOf, exactAge.years);

  const copySummary = [
    `Born ${bornWeekday}, ${birthDateLabel}.`,
    `As of ${asOfLabel}, exact age is ${headline}.`,
    `${formatWholeNumber(totalDays)} total days and ${formatWholeNumber(totalMonths)} completed months.`,
    nextBirthday
      ? nextBirthday.isToday
        ? `${nextBirthday.detail}.`
        : `Next birthday is ${nextBirthday.headline.toLowerCase()} on ${nextBirthday.weekday}, ${nextBirthday.dateLabel}.`
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    exactAge,
    headline,
    summary: `As of ${asOfLabel}. Born on ${bornWeekday}.`,
    asOfLabel,
    bornWeekday,
    birthDateLabel,
    totals: {
      months: totalMonths,
      weeks: totalWeeks,
      days: totalDays,
    },
    totalsFormatted: {
      months: formatWholeNumber(totalMonths),
      weeks: formatWeeks(totalWeeks),
      days: formatWholeNumber(totalDays),
    },
    nextBirthday,
    copySummary,
  };
}
