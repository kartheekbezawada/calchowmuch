import {
  calculateBirthdayWeekdays,
  calculateDaysUntil,
  getWeekdayName,
  isLeapYear,
} from '../../../assets/js/core/date-diff-utils.js';

const WEEKEND_DAYS = ['Friday', 'Saturday', 'Sunday'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function isValidDateInstance(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function normalizeDate(date) {
  if (!isValidDateInstance(date)) {
    return null;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatLongDate(date, { includeWeekday = false } = {}) {
  const normalized = normalizeDate(date);
  if (!normalized) {
    return '';
  }

  const day = normalized.getDate();
  const month = MONTH_NAMES[normalized.getMonth()] ?? '';
  const year = normalized.getFullYear();
  const base = `${month} ${day}, ${year}`;

  if (!includeWeekday) {
    return base;
  }

  const weekday = getWeekdayName(normalized);
  return weekday ? `${weekday}, ${base}` : base;
}

export function getBirthdayDateForYear(birthDate, year) {
  if (!isValidDateInstance(birthDate) || !Number.isInteger(year)) {
    return null;
  }

  const month = birthDate.getMonth();
  const day = birthDate.getDate();
  const safeDay = month === 1 && day === 29 && !isLeapYear(year) ? 28 : day;
  return new Date(year, month, safeDay);
}

export function getNextBirthdaySnapshot(birthDate, referenceDate = new Date()) {
  const normalizedBirthDate = normalizeDate(birthDate);
  const normalizedReferenceDate = normalizeDate(referenceDate);

  if (!normalizedBirthDate || !normalizedReferenceDate) {
    return null;
  }

  let nextYear = normalizedReferenceDate.getFullYear();
  let nextBirthday = getBirthdayDateForYear(normalizedBirthDate, nextYear);
  if (!nextBirthday) {
    return null;
  }

  if (nextBirthday < normalizedReferenceDate) {
    nextYear += 1;
    nextBirthday = getBirthdayDateForYear(normalizedBirthDate, nextYear);
  }

  if (!nextBirthday) {
    return null;
  }

  const weekday = getWeekdayName(nextBirthday);
  const daysRemaining = calculateDaysUntil(nextBirthday, normalizedReferenceDate);

  if (!weekday || daysRemaining === null) {
    return null;
  }

  return {
    date: nextBirthday,
    year: nextYear,
    weekday,
    daysRemaining,
    ageTurning: nextYear - normalizedBirthDate.getFullYear(),
    usesLeapDayFallback:
      normalizedBirthDate.getMonth() === 1 &&
      normalizedBirthDate.getDate() === 29 &&
      nextBirthday.getMonth() === 1 &&
      nextBirthday.getDate() === 28,
  };
}

export function buildRecurrenceStrip(birthDate, startYear, count = 12, referenceDate = new Date()) {
  const normalizedBirthDate = normalizeDate(birthDate);
  const normalizedReferenceDate = normalizeDate(referenceDate);

  if (!normalizedBirthDate || !normalizedReferenceDate) {
    return [];
  }

  if (!Number.isInteger(startYear) || !Number.isInteger(count) || count < 1) {
    return [];
  }

  const recurrence = [];

  for (let index = 0; index < count; index += 1) {
    const year = startYear + index;
    const date = getBirthdayDateForYear(normalizedBirthDate, year);
    const weekday = getWeekdayName(date);
    const daysUntil = date ? calculateDaysUntil(date, normalizedReferenceDate) : null;

    if (!date || !weekday || daysUntil === null) {
      continue;
    }

    recurrence.push({
      year,
      date,
      weekday,
      daysUntil,
      ageTurning: year - normalizedBirthDate.getFullYear(),
      isWeekend: WEEKEND_DAYS.includes(weekday),
      isPast: daysUntil < 0,
      usesLeapDayFallback:
        normalizedBirthDate.getMonth() === 1 &&
        normalizedBirthDate.getDate() === 29 &&
        date.getMonth() === 1 &&
        date.getDate() === 28,
    });
  }

  return recurrence;
}

export function extractWeekendHighlights(recurrence) {
  if (!Array.isArray(recurrence)) {
    return [];
  }

  return WEEKEND_DAYS.map((weekday) => ({
    weekday,
    entry: recurrence.find((item) => item.weekday === weekday && item.daysUntil >= 0) ?? null,
  }));
}

export function buildBirthdaySummary({
  birthDate,
  birthWeekday,
  targetYear,
  targetWeekday,
  nextBirthday,
  weekendHighlights,
}) {
  const normalizedBirthDate = normalizeDate(birthDate);
  if (!normalizedBirthDate || !birthWeekday || !Number.isInteger(targetYear) || !targetWeekday) {
    return '';
  }

  const summaryParts = [
    `${formatLongDate(normalizedBirthDate)} was a ${birthWeekday}.`,
    `In ${targetYear}, your birthday falls on ${targetWeekday}.`,
  ];

  if (nextBirthday) {
    const dayLabel = nextBirthday.daysRemaining === 1 ? 'day' : 'days';
    summaryParts.push(
      `Your next birthday is ${formatLongDate(nextBirthday.date, { includeWeekday: true })}, ${nextBirthday.daysRemaining} ${dayLabel} away, and you turn ${nextBirthday.ageTurning}.`
    );
  }

  const nextWeekendEntry = Array.isArray(weekendHighlights)
    ? weekendHighlights.find((item) => item?.entry)
    : null;

  if (nextWeekendEntry?.entry) {
    summaryParts.push(
      `The next weekend-friendly option in the 12-year map is ${nextWeekendEntry.weekday}, ${formatLongDate(
        nextWeekendEntry.entry.date,
        { includeWeekday: false }
      )}.`
    );
  }

  return summaryParts.join(' ');
}

export function buildBirthdayViewModel(birthDate, targetYear, referenceDate = new Date()) {
  const normalizedBirthDate = normalizeDate(birthDate);
  const normalizedReferenceDate = normalizeDate(referenceDate);

  if (!normalizedBirthDate || !normalizedReferenceDate || !Number.isInteger(targetYear)) {
    return null;
  }

  const weekdays = calculateBirthdayWeekdays(normalizedBirthDate, targetYear);
  if (!weekdays) {
    return null;
  }

  const startYear = normalizedReferenceDate.getFullYear();
  const nextBirthday = getNextBirthdaySnapshot(normalizedBirthDate, normalizedReferenceDate);
  const recurrence = buildRecurrenceStrip(
    normalizedBirthDate,
    startYear,
    12,
    normalizedReferenceDate
  );
  const weekendHighlights = extractWeekendHighlights(recurrence);

  return {
    birthDate: normalizedBirthDate,
    birthWeekday: weekdays.birthWeekday,
    targetYear,
    targetDate: weekdays.targetDate,
    targetWeekday: weekdays.targetWeekday,
    nextBirthday,
    recurrence,
    weekendHighlights,
    summary: buildBirthdaySummary({
      birthDate: normalizedBirthDate,
      birthWeekday: weekdays.birthWeekday,
      targetYear,
      targetWeekday: weekdays.targetWeekday,
      nextBirthday,
      weekendHighlights,
    }),
  };
}
