export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
export const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;
export const DAY_MS = MINUTES_PER_DAY * 60 * 1000;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
export const SECONDS_PER_DAY = SECONDS_PER_HOUR * HOURS_PER_DAY;

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function isLeapYear(year) {
  return Number.isInteger(year) && (year % 4 === 0 ? year % 100 !== 0 || year % 400 === 0 : false);
}

export function getWeekdayName(date) {
  if (!isValidDate(date)) {
    return null;
  }
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return names[date.getDay()] ?? null;
}

export function calculateBirthdayWeekdays(birthDate, targetYear) {
  if (!isValidDate(birthDate) || !Number.isInteger(targetYear)) {
    return null;
  }

  const birthWeekday = getWeekdayName(birthDate);
  if (!birthWeekday) {
    return null;
  }

  const month = birthDate.getMonth();
  const day = birthDate.getDate();
  const safeDay = month === 1 && day === 29 && !isLeapYear(targetYear) ? 28 : day;
  const targetDate = new Date(targetYear, month, safeDay);
  const targetWeekday = getWeekdayName(targetDate);

  if (!targetWeekday) {
    return null;
  }

  return { birthWeekday, targetWeekday, targetDate };
}

export function calculateCalendarDiff(start, end) {
  if (!isValidDate(start) || !isValidDate(end) || end < start) {
    return null;
  }

  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();

  let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

  const startDay = start.getDate();
  const endDay = end.getDate();

  const startTimeTotal =
    start.getHours() * MINUTES_PER_HOUR + start.getMinutes() + start.getSeconds() / 60;
  const endTimeTotal =
    end.getHours() * MINUTES_PER_HOUR + end.getMinutes() + end.getSeconds() / 60;

  const endBeforeStartInMonth =
    endDay < startDay || (endDay === startDay && endTimeTotal < startTimeTotal);

  if (endBeforeStartInMonth) {
    totalMonths -= 1;
  }

  const safeTotalMonths = Math.max(0, totalMonths);
  const years = Math.floor(safeTotalMonths / 12);
  const months = safeTotalMonths % 12;

  return { years, months, totalMonths: safeTotalMonths };
}

export function calculateDaysUntil(targetDate, referenceDate = new Date()) {
  if (!isValidDate(targetDate) || !isValidDate(referenceDate)) {
    return null;
  }

  const targetUtc = Date.UTC(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );
  const referenceUtc = Date.UTC(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  return Math.round((targetUtc - referenceUtc) / DAY_MS);
}

export function calculateTimeBetweenDates({ start, end, includeTime = false }) {
  if (!isValidDate(start) || !isValidDate(end) || end < start) {
    return null;
  }

  const diffMs = end.getTime() - start.getTime();
  const totalMinutes = Math.round(diffMs / (60 * 1000));
  const totalHours = totalMinutes / MINUTES_PER_HOUR;
  const totalDays = includeTime ? totalHours / HOURS_PER_DAY : Math.floor(diffMs / DAY_MS);
  const totalWeeks = totalDays / DAYS_PER_WEEK;
  const calendar = calculateCalendarDiff(start, end);

  return {
    totalMinutes,
    totalHours,
    totalDays,
    totalWeeks,
    years: calendar?.years ?? 0,
    months: calendar?.months ?? 0,
    totalMonths: calendar?.totalMonths ?? 0,
  };
}

export function calculateCountdown(targetDate, referenceDate = new Date()) {
  if (!isValidDate(targetDate) || !isValidDate(referenceDate)) {
    return null;
  }

  const diffMs = targetDate.getTime() - referenceDate.getTime();
  if (diffMs < 0) {
    return null;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = totalSeconds / SECONDS_PER_MINUTE;
  const totalHours = totalMinutes / MINUTES_PER_HOUR;
  const totalDays = totalHours / HOURS_PER_DAY;
  const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
  const remainingAfterDays = totalSeconds % SECONDS_PER_DAY;
  const hours = Math.floor(remainingAfterDays / SECONDS_PER_HOUR);
  const remainingAfterHours = remainingAfterDays % SECONDS_PER_HOUR;
  const minutes = Math.floor(remainingAfterHours / SECONDS_PER_MINUTE);
  const seconds = remainingAfterHours % SECONDS_PER_MINUTE;

  return {
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    days,
    hours,
    minutes,
    seconds,
  };
}

function createClampedDate(year, monthIndex, day) {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const safeDay = Math.min(day, lastDay);
  return new Date(year, monthIndex, safeDay);
}

function addMonthsClamped(date, months) {
  const baseYear = date.getFullYear();
  const baseMonth = date.getMonth();
  const targetMonth = baseMonth + months;
  const targetYear = baseYear + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  return createClampedDate(targetYear, normalizedMonth, date.getDate());
}

function diffInDays(start, end) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / DAY_MS);
}

export function calculateExactAge(birthDate, asOfDate) {
  if (!isValidDate(birthDate) || !isValidDate(asOfDate) || asOfDate < birthDate) {
    return null;
  }

  const birth = createClampedDate(
    birthDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  const asOf = createClampedDate(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate());

  let years = asOf.getFullYear() - birth.getFullYear();
  let anniversary = createClampedDate(birth.getFullYear() + years, birth.getMonth(), birth.getDate());
  if (anniversary > asOf) {
    years -= 1;
    anniversary = createClampedDate(
      birth.getFullYear() + years,
      birth.getMonth(),
      birth.getDate()
    );
  }

  let months = asOf.getMonth() - anniversary.getMonth();
  if (months < 0) {
    months += 12;
  }

  let monthAnchor = addMonthsClamped(anniversary, months);
  if (monthAnchor > asOf) {
    months -= 1;
    monthAnchor = addMonthsClamped(anniversary, months);
  }

  if (months < 0) {
    months = 0;
    monthAnchor = anniversary;
  }

  const days = diffInDays(monthAnchor, asOf);

  return { years, months, days };
}
