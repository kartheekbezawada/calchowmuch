const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_WORKWEEK = [1, 2, 3, 4, 5];

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const HOLIDAY_PRESETS = {
  none: { id: 'none', label: 'No holidays' },
  us: { id: 'us', label: 'US observed holidays' },
  uk: { id: 'uk', label: 'UK observed holidays' },
};

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

function dateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatLongDate(date) {
  return LONG_DATE_FORMATTER.format(date);
}

function formatShortDate(date) {
  return SHORT_DATE_FORMATTER.format(date);
}

function formatSignedNumber(value) {
  if (value > 0) {
    return `+${value}`;
  }
  return `${value}`;
}

function formatBusinessDaysLabel(value) {
  return `${value} business day${value === 1 ? '' : 's'}`;
}

function formatCalendarDaysLabel(value) {
  return `${value} calendar day${value === 1 ? '' : 's'}`;
}

function formatDayCount(value) {
  return `${value} day${value === 1 ? '' : 's'}`;
}

function compactWorkweekLabel(label) {
  return String(label || '').replace(/\s+workweek$/i, '');
}

function compactHolidayLabel(presetId) {
  if (presetId === 'us') {
    return 'US holidays';
  }
  if (presetId === 'uk') {
    return 'UK holidays';
  }
  return 'No holidays';
}

function diffUtcDaysInclusive(start, end) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / DAY_MS) + 1;
}

function nthWeekdayOfMonth(year, monthIndex, weekday, occurrence) {
  const first = new Date(year, monthIndex, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, monthIndex, 1 + offset + (occurrence - 1) * 7);
}

function lastWeekdayOfMonth(year, monthIndex, weekday) {
  const last = new Date(year, monthIndex + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  return new Date(year, monthIndex + 1, 0 - offset);
}

function observedDate(year, monthIndex, day) {
  const date = new Date(year, monthIndex, day);
  const weekday = date.getDay();
  if (weekday === 6) {
    return addDays(date, -1);
  }
  if (weekday === 0) {
    return addDays(date, 1);
  }
  return date;
}

function ukSubstituteDates(year, monthIndex, day) {
  const base = new Date(year, monthIndex, day);
  const dates = [];
  const weekday = base.getDay();
  if (weekday >= 1 && weekday <= 5) {
    dates.push(base);
    return dates;
  }

  const substitute = startOfDay(base);
  while (substitute.getDay() === 0 || substitute.getDay() === 6) {
    substitute.setDate(substitute.getDate() + 1);
  }
  dates.push(new Date(substitute));
  return dates;
}

function computeEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getUsObservedHolidays(year) {
  const dates = [
    observedDate(year, 0, 1),
    nthWeekdayOfMonth(year, 0, 1, 3),
    nthWeekdayOfMonth(year, 1, 1, 3),
    lastWeekdayOfMonth(year, 4, 1),
    observedDate(year, 5, 19),
    observedDate(year, 6, 4),
    nthWeekdayOfMonth(year, 8, 1, 1),
    nthWeekdayOfMonth(year, 9, 1, 2),
    observedDate(year, 10, 11),
    nthWeekdayOfMonth(year, 10, 4, 4),
    observedDate(year, 11, 25),
  ];
  return dates.map(startOfDay);
}

function getUkObservedHolidays(year) {
  const easterSunday = computeEasterSunday(year);
  const goodFriday = addDays(easterSunday, -2);
  const easterMonday = addDays(easterSunday, 1);
  const dates = [
    ...ukSubstituteDates(year, 0, 1),
    goodFriday,
    easterMonday,
    nthWeekdayOfMonth(year, 4, 1, 1),
    lastWeekdayOfMonth(year, 4, 1),
    lastWeekdayOfMonth(year, 7, 1),
    ...ukSubstituteDates(year, 11, 25),
  ];

  const boxingCandidates = ukSubstituteDates(year, 11, 26);
  for (const date of boxingCandidates) {
    let candidate = startOfDay(date);
    while (dates.some((existing) => dateKey(existing) === dateKey(candidate))) {
      candidate = addDays(candidate, 1);
      while (candidate.getDay() === 0 || candidate.getDay() === 6) {
        candidate = addDays(candidate, 1);
      }
    }
    dates.push(candidate);
  }

  return dates.map(startOfDay);
}

export function buildHolidaySet(presetId, startYear, endYear) {
  const preset = HOLIDAY_PRESETS[presetId] ? presetId : 'none';
  const dates = [];
  for (let year = startYear; year <= endYear; year += 1) {
    if (preset === 'us') {
      dates.push(...getUsObservedHolidays(year));
    } else if (preset === 'uk') {
      dates.push(...getUkObservedHolidays(year));
    }
  }
  return new Set(dates.map(dateKey));
}

export function normalizeWorkweek(days) {
  if (!Array.isArray(days)) {
    return [...DEFAULT_WORKWEEK];
  }
  const clean = Array.from(new Set(days.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))).sort(
    (left, right) => left - right
  );
  return clean.length ? clean : [...DEFAULT_WORKWEEK];
}

export function describeWorkweek(days) {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const normalized = normalizeWorkweek(days);
  const picked = normalized.map((day) => labels[day]);
  const mondayFriday =
    normalized.length === DEFAULT_WORKWEEK.length &&
    normalized.every((day, index) => day === DEFAULT_WORKWEEK[index]);
  return mondayFriday ? 'Mon-Fri workweek' : `${picked.join(', ')} workweek`;
}

function isBusinessDay(date, workweek, holidaySet) {
  return workweek.includes(date.getDay()) && !holidaySet.has(dateKey(date));
}

export function countBusinessDaysBetween(start, end, options = {}) {
  if (!isValidDate(start) || !isValidDate(end)) {
    return null;
  }

  const orderedStart = startOfDay(start <= end ? start : end);
  const orderedEnd = startOfDay(start <= end ? end : start);
  const workweek = normalizeWorkweek(options.workweek);
  const holidaySet = buildHolidaySet(options.holidayPreset || 'none', orderedStart.getFullYear(), orderedEnd.getFullYear());

  let businessDays = 0;
  let holidayHits = 0;
  const includedHolidays = [];
  let cursor = orderedStart;
  while (cursor <= orderedEnd) {
    const workingWeekday = workweek.includes(cursor.getDay());
    const holidayHit = holidaySet.has(dateKey(cursor));
    if (workingWeekday && holidayHit) {
      holidayHits += 1;
      includedHolidays.push(formatShortDate(cursor));
    }
    if (workingWeekday && !holidayHit) {
      businessDays += 1;
    }
    cursor = addDays(cursor, 1);
  }

  const totalDays = diffUtcDaysInclusive(orderedStart, orderedEnd);
  const nonBusinessDays = totalDays - businessDays;

  return {
    start: orderedStart,
    end: orderedEnd,
    reversed: start > end,
    businessDays,
    totalDays,
    nonBusinessDays,
    holidayHits,
    holidayLabels: includedHolidays.slice(0, 3),
    workweek,
    holidayPreset: options.holidayPreset || 'none',
  };
}

export function shiftBusinessDays(start, offset, options = {}) {
  if (!isValidDate(start) || !Number.isFinite(offset)) {
    return null;
  }

  const anchor = startOfDay(start);
  const workweek = normalizeWorkweek(options.workweek);
  const direction = offset >= 0 ? 1 : -1;
  const holidaySet = buildHolidaySet(
    options.holidayPreset || 'none',
    anchor.getFullYear() - 1,
    anchor.getFullYear() + 5
  );

  if (offset === 0) {
    return {
      start: anchor,
      end: anchor,
      traversed: 0,
      calendarDays: 0,
      workweek,
      holidayPreset: options.holidayPreset || 'none',
    };
  }

  let cursor = anchor;
  let remaining = Math.abs(offset);
  while (remaining > 0) {
    cursor = addDays(cursor, direction);
    if (isBusinessDay(cursor, workweek, holidaySet)) {
      remaining -= 1;
    }
  }

  return {
    start: anchor,
    end: cursor,
    traversed: offset,
    calendarDays: Math.abs(diffUtcDaysInclusive(anchor, cursor)) - 1,
    workweek,
    holidayPreset: options.holidayPreset || 'none',
  };
}

function buildRelatedNotes({ workweekLabel, holidayLabel, holidayHits, holidayLabels, totalDays }) {
  const notes = [
    `Using ${workweekLabel}.`,
    `${holidayLabel} applied.`,
    `The selected span covers ${formatCalendarDaysLabel(totalDays)}.`,
  ];
  if (holidayHits > 0) {
    const suffix = holidayLabels.length ? ` for ${holidayLabels.join(', ')}.` : '.';
    notes.push(`${holidayHits} observed holiday${holidayHits === 1 ? '' : 's'} removed from the working count${suffix}`);
  }
  return notes;
}

export function buildBusinessDaysViewModel({
  mode = 'between',
  startDate,
  endDate,
  offset = 0,
  workweek = DEFAULT_WORKWEEK,
  holidayPreset = 'none',
}) {
  const normalizedWorkweek = normalizeWorkweek(workweek);
  const workweekLabel = describeWorkweek(normalizedWorkweek);
  const holidayLabel = HOLIDAY_PRESETS[holidayPreset]?.label || HOLIDAY_PRESETS.none.label;
  const compactWorkweek = compactWorkweekLabel(workweekLabel);
  const compactHoliday = compactHolidayLabel(holidayPreset);

  if (mode === 'shift') {
    const shifted = shiftBusinessDays(startDate, offset, { workweek: normalizedWorkweek, holidayPreset });
    if (!shifted) {
      return null;
    }
    const directionLabel = shifted.traversed === 0 ? 'No shift applied' : shifted.traversed > 0 ? 'Forward business-day shift' : 'Backward business-day shift';
    const summary = shifted.traversed === 0
      ? `${formatLongDate(shifted.start)} stays unchanged because the offset is 0.`
      : `${formatShortDate(shifted.start)} to ${formatShortDate(shifted.end)}: ${formatSignedNumber(shifted.traversed)} business days, ${compactWorkweek}, ${compactHoliday.toLowerCase()}.`;

    return {
      mode: 'shift',
      headline: formatLongDate(shifted.end),
      summary,
      directionLabel,
      copySummary: `Business Days Calculator: ${summary}`,
      cards: [
        { label: 'Business-day shift', value: formatDayCount(Math.abs(shifted.traversed)), helper: shifted.traversed >= 0 ? 'Forward' : 'Backward' },
        { label: 'Calendar days moved', value: formatDayCount(shifted.calendarDays), helper: 'Start date excluded.' },
        { label: 'Rule set', value: compactWorkweek, helper: compactHoliday },
      ],
      notes: [
        `Start date: ${formatLongDate(shifted.start)}.`,
        `Result date: ${formatLongDate(shifted.end)}.`,
        `The shift skips weekends and observed holidays under the active rule set.`,
      ],
      export: {
        title: `Business-day target: ${formatShortDate(shifted.end)}`,
        description: summary,
        startDate: shifted.end,
        endDate: addDays(shifted.end, 1),
      },
    };
  }

  const counted = countBusinessDaysBetween(startDate, endDate, {
    workweek: normalizedWorkweek,
    holidayPreset,
  });
  if (!counted) {
    return null;
  }

  const orderedRange = `${formatShortDate(counted.start)} to ${formatShortDate(counted.end)}`;
  const summary = `${orderedRange}: ${formatBusinessDaysLabel(counted.businessDays)}, ${compactWorkweek}, ${compactHoliday.toLowerCase()}.`;
  const rangeDirection = counted.reversed ? 'Reverse range normalised' : 'Forward range';

  return {
    mode: 'between',
    headline: formatBusinessDaysLabel(counted.businessDays),
    summary,
    directionLabel: rangeDirection,
    copySummary: `Business Days Calculator: ${summary}`,
    cards: [
      { label: 'Calendar span', value: formatDayCount(counted.totalDays), helper: 'Both dates included.' },
      { label: 'Non-business days', value: formatDayCount(counted.nonBusinessDays), helper: 'Weekends and holidays removed.' },
      { label: 'Rule set', value: compactWorkweek, helper: compactHoliday },
    ],
    notes: buildRelatedNotes({
      workweekLabel,
      holidayLabel,
      holidayHits: counted.holidayHits,
      holidayLabels: counted.holidayLabels,
      totalDays: counted.totalDays,
    }),
    export: {
      title: `Business-day window: ${orderedRange}`,
      description: summary,
      startDate: counted.start,
      endDate: addDays(counted.end, 1),
    },
  };
}

export function getDefaultBusinessDaysState(now = new Date()) {
  const startDate = startOfDay(now);
  const endDate = addDays(startDate, 13);
  return {
    mode: 'between',
    startDate,
    endDate,
    offset: 10,
    workweek: [...DEFAULT_WORKWEEK],
    holidayPreset: 'none',
  };
}
