const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const DAYS_PER_WEEK = 7;

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const LONG_DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export const DATE_DIFF_PRESETS = [
  { id: 'today-plus-7', label: 'Today → +7 days' },
  { id: 'today-plus-30', label: 'Today → +30 days' },
  { id: 'this-month', label: 'This month' },
  { id: 'custom', label: 'Custom' },
];

function isValidDateInstance(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function cloneDate(value) {
  return new Date(value.getTime());
}

function startOfDay(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function addDays(value, days) {
  const next = cloneDate(value);
  next.setDate(next.getDate() + days);
  return next;
}

function createClampedDateTime(year, monthIndex, day, hours, minutes) {
  const safeDay = Math.min(day, new Date(year, monthIndex + 1, 0).getDate());
  return new Date(year, monthIndex, safeDay, hours, minutes, 0, 0);
}

function addMonthsClamped(value, months) {
  const monthIndex = value.getMonth() + months;
  const year = value.getFullYear() + Math.floor(monthIndex / 12);
  const normalizedMonth = ((monthIndex % 12) + 12) % 12;
  return createClampedDateTime(
    year,
    normalizedMonth,
    value.getDate(),
    value.getHours(),
    value.getMinutes()
  );
}

function diffUtcDays(start, end) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / DAY_MS);
}

function formatPart(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

function formatParts(parts, limit = parts.length) {
  return parts.filter(Boolean).slice(0, limit).join(', ');
}

function formatCalendarHeadline(calendar, fallbackDays) {
  const parts = [];
  if (calendar.years) {
    parts.push(formatPart(calendar.years, 'year'));
  }
  if (calendar.months) {
    parts.push(formatPart(calendar.months, 'month'));
  }
  if (calendar.days) {
    parts.push(formatPart(calendar.days, 'day'));
  }
  if (!parts.length) {
    return formatPart(fallbackDays, 'day');
  }
  return formatParts(parts, 2);
}

function formatElapsedHeadline(elapsed) {
  const parts = [];
  if (elapsed.days) {
    parts.push(formatPart(elapsed.days, 'day'));
  }
  if (elapsed.hours) {
    parts.push(formatPart(elapsed.hours, 'hour'));
  }
  if (elapsed.minutes || !parts.length) {
    parts.push(formatPart(elapsed.minutes, 'minute'));
  }
  return formatParts(parts, 3);
}

function formatWeeksAndDays(totalDays) {
  const weeks = Math.floor(totalDays / DAYS_PER_WEEK);
  const days = totalDays % DAYS_PER_WEEK;
  if (!weeks) {
    return formatPart(days, 'day');
  }
  if (!days) {
    return formatPart(weeks, 'week');
  }
  return `${formatPart(weeks, 'week')} + ${formatPart(days, 'day')}`;
}

function calculateCalendarBreakdown(start, end) {
  if (!isValidDateInstance(start) || !isValidDateInstance(end) || end < start) {
    return null;
  }

  let totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  let anchor = addMonthsClamped(start, totalMonths);

  while (totalMonths > 0 && anchor > end) {
    totalMonths -= 1;
    anchor = addMonthsClamped(start, totalMonths);
  }

  while (addMonthsClamped(start, totalMonths + 1) <= end) {
    totalMonths += 1;
    anchor = addMonthsClamped(start, totalMonths);
  }

  let cursor = cloneDate(anchor);
  let days = 0;
  while (addDays(cursor, 1) <= end) {
    cursor = addDays(cursor, 1);
    days += 1;
  }

  const remainderMinutes = Math.max(0, Math.round((end.getTime() - cursor.getTime()) / MINUTE_MS));
  const hours = Math.floor(remainderMinutes / MINUTES_PER_HOUR);
  const minutes = remainderMinutes % MINUTES_PER_HOUR;

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days,
    hours,
    minutes,
    totalMonths,
  };
}

function calculateElapsedBreakdown(totalMinutes) {
  const safeMinutes = Math.max(0, totalMinutes);
  const days = Math.floor(safeMinutes / MINUTES_PER_DAY);
  const remainingAfterDays = safeMinutes % MINUTES_PER_DAY;
  const hours = Math.floor(remainingAfterDays / MINUTES_PER_HOUR);
  const minutes = remainingAfterDays % MINUTES_PER_HOUR;
  return { days, hours, minutes };
}

function countBusinessDays(start, endExclusive) {
  if (!isValidDateInstance(start) || !isValidDateInstance(endExclusive) || endExclusive < start) {
    return 0;
  }

  let count = 0;
  const cursor = startOfDay(start);
  const limit = startOfDay(endExclusive);

  while (cursor < limit) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

function formatRangeLabel(start, end, includeTime) {
  const formatter = includeTime ? LONG_DATE_TIME_FORMATTER : LONG_DATE_FORMATTER;
  return {
    startLabel: formatter.format(start),
    endLabel: formatter.format(end),
  };
}

function buildDirectionMetadata({ reversed, sameMoment }) {
  if (sameMoment) {
    return {
      directionLabel: 'Same moment',
      directionNote: 'Start and end are identical.',
    };
  }

  if (reversed) {
    return {
      directionLabel: 'Past interval',
      directionNote: 'Start is after end, so the calculator shows the absolute duration.',
    };
  }

  return {
    directionLabel: 'Future interval',
    directionNote: 'End is after start.',
  };
}

function buildDateModeResult({
  orderedStart,
  orderedEnd,
  originalStart,
  originalEnd,
  reversed,
  sameMoment,
  includeEndDate,
}) {
  const effectiveStart = startOfDay(orderedStart);
  const baseEnd = startOfDay(orderedEnd);
  const effectiveEnd = includeEndDate ? addDays(baseEnd, 1) : baseEnd;
  const totalDays = diffUtcDays(effectiveStart, effectiveEnd);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalWeeks = totalDays / DAYS_PER_WEEK;
  const calendar = calculateCalendarBreakdown(effectiveStart, effectiveEnd);
  const businessDays = countBusinessDays(effectiveStart, effectiveEnd);
  const weekendDays = totalDays - businessDays;
  const inclusiveDayCount = includeEndDate ? totalDays : null;
  const exclusiveDayCount = includeEndDate ? diffUtcDays(effectiveStart, baseEnd) : totalDays;
  const { startLabel, endLabel } = formatRangeLabel(originalStart, originalEnd, false);
  const { directionLabel, directionNote } = buildDirectionMetadata({ reversed, sameMoment });
  const headline = formatCalendarHeadline(calendar, totalDays);
  const weeksAndDays = formatWeeksAndDays(totalDays);
  const optionsLabel = includeEndDate ? 'End date included' : 'End date excluded';
  const summary = `From ${startLabel} to ${endLabel}: ${headline}, ${formatPart(
    totalDays,
    'day'
  )} total, ${weeksAndDays}, and ${formatPart(businessDays, 'business day')}.`;
  const copySummary = includeEndDate
    ? `${summary} End date included in day counts.`
    : summary;

  return {
    mode: 'date',
    includeEndDate,
    reversed,
    sameMoment,
    directionLabel,
    directionNote,
    optionsLabel,
    startLabel,
    endLabel,
    headline,
    summary,
    copySummary,
    calendar,
    elapsed: {
      days: totalDays,
      hours: 0,
      minutes: 0,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      weeksAndDays,
    },
    counts: {
      businessDays,
      weekendDays,
      inclusiveDayCount,
      exclusiveDayCount,
    },
  };
}

function buildDateTimeModeResult({
  orderedStart,
  orderedEnd,
  originalStart,
  originalEnd,
  reversed,
  sameMoment,
  includeEndDate,
}) {
  const totalMinutes = Math.max(0, Math.round((orderedEnd.getTime() - orderedStart.getTime()) / MINUTE_MS));
  const totalHours = totalMinutes / MINUTES_PER_HOUR;
  const totalDays = totalHours / 24;
  const totalWeeks = totalDays / DAYS_PER_WEEK;
  const calendar = calculateCalendarBreakdown(orderedStart, orderedEnd);
  const elapsed = calculateElapsedBreakdown(totalMinutes);
  const countEnd = includeEndDate
    ? addDays(startOfDay(orderedEnd), 1)
    : startOfDay(orderedEnd);
  const exclusiveDayCount = diffUtcDays(startOfDay(orderedStart), startOfDay(orderedEnd));
  const inclusiveDayCount = includeEndDate ? exclusiveDayCount + 1 : null;
  const businessDays = countBusinessDays(startOfDay(orderedStart), countEnd);
  const weekendDays = Math.max(0, (includeEndDate ? inclusiveDayCount : exclusiveDayCount) - businessDays);
  const { startLabel, endLabel } = formatRangeLabel(originalStart, originalEnd, true);
  const { directionLabel, directionNote } = buildDirectionMetadata({ reversed, sameMoment });
  const headline = formatElapsedHeadline(elapsed);
  const optionsLabel = includeEndDate ? 'End date included in day counts' : 'Exact elapsed time';
  const summary = `From ${startLabel} to ${endLabel}: ${headline} elapsed, ${totalDays.toFixed(
    2
  )} total days, and ${formatPart(businessDays, 'business day')} across the calendar dates.`;
  const copySummary = includeEndDate ? `${summary} End date included in day counts.` : summary;

  return {
    mode: 'datetime',
    includeEndDate,
    reversed,
    sameMoment,
    directionLabel,
    directionNote,
    optionsLabel,
    startLabel,
    endLabel,
    headline,
    summary,
    copySummary,
    calendar,
    elapsed: {
      ...elapsed,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      weeksAndDays: null,
    },
    counts: {
      businessDays,
      weekendDays,
      inclusiveDayCount,
      exclusiveDayCount,
    },
  };
}

export function buildPresetRange(presetId, referenceDate = new Date()) {
  const base = isValidDateInstance(referenceDate) ? cloneDate(referenceDate) : new Date();
  const start = cloneDate(base);

  switch (presetId) {
    case 'today-plus-7':
      return {
        id: presetId,
        label: 'Today → +7 days',
        start,
        end: addDays(start, 7),
        includeEndDate: false,
      };
    case 'today-plus-30':
      return {
        id: presetId,
        label: 'Today → +30 days',
        start,
        end: addDays(start, 30),
        includeEndDate: false,
      };
    case 'this-month': {
      const monthStart = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(
        base.getFullYear(),
        base.getMonth() + 1,
        0,
        0,
        0,
        0,
        0
      );
      return {
        id: presetId,
        label: 'This month',
        start: monthStart,
        end: monthEnd,
        includeEndDate: true,
      };
    }
    default:
      return null;
  }
}

export function calculateDateDiffViewModel({ start, end, mode = 'date', includeEndDate = false }) {
  if (!isValidDateInstance(start) || !isValidDateInstance(end)) {
    return null;
  }

  const reversed = start.getTime() > end.getTime();
  const sameMoment = start.getTime() === end.getTime();
  const orderedStart = reversed ? cloneDate(end) : cloneDate(start);
  const orderedEnd = reversed ? cloneDate(start) : cloneDate(end);

  if (mode === 'datetime') {
    return buildDateTimeModeResult({
      orderedStart,
      orderedEnd,
      originalStart: cloneDate(start),
      originalEnd: cloneDate(end),
      reversed,
      sameMoment,
      includeEndDate: Boolean(includeEndDate),
    });
  }

  return buildDateModeResult({
    orderedStart,
    orderedEnd,
    originalStart: cloneDate(start),
    originalEnd: cloneDate(end),
    reversed,
    sameMoment,
    includeEndDate: Boolean(includeEndDate),
  });
}
