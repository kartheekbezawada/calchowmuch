import { formatDecimalHours, formatHHMM, parseTimeString } from './work-hours-utils.js';

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const ROUNDING_OPTIONS = [0, 5, 10, 15];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export { formatDecimalHours, formatHHMM, parseTimeString };

export function formatDateShort(date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function roundMinutes(minutes, interval) {
  if (!interval) {
    return minutes;
  }
  const rounded = Math.round(minutes / interval) * interval;
  return rounded === 1440 ? 0 : rounded;
}

export function getSegmentMinutes(startTime, endTime, endsNextDay, roundingInterval = 0) {
  if (!startTime || !endTime) {
    return null;
  }
  let startMinutes = startTime.hours * 60 + startTime.minutes;
  let endMinutes = endTime.hours * 60 + endTime.minutes;

  if (roundingInterval) {
    startMinutes = roundMinutes(startMinutes, roundingInterval);
    endMinutes = roundMinutes(endMinutes, roundingInterval);
  }

  let adjustedEnd = endMinutes;
  if (endsNextDay) {
    if (adjustedEnd <= startMinutes) {
      adjustedEnd += 1440;
    }
  } else if (adjustedEnd < startMinutes) {
    return null;
  }

  return {
    minutes: adjustedEnd - startMinutes,
    startMinutes,
    endMinutes: adjustedEnd,
  };
}

export function overlapMinutes(startA, endA, startB, endB) {
  return Math.max(0, Math.min(endA, endB) - Math.max(startA, startB));
}

export function getNightOverlapMinutes(startMinutes, endMinutes, nightStart, nightEnd, crossesMidnight) {
  let total = 0;
  let currentStart = startMinutes;
  while (currentStart < endMinutes) {
    const dayStart = Math.floor(currentStart / 1440) * 1440;
    const dayEnd = dayStart + 1440;
    const segmentStart = currentStart - dayStart;
    const segmentEnd = Math.min(endMinutes, dayEnd) - dayStart;

    if (crossesMidnight) {
      total += overlapMinutes(segmentStart, segmentEnd, nightStart, 1440);
      total += overlapMinutes(segmentStart, segmentEnd, 0, nightEnd);
    } else {
      total += overlapMinutes(segmentStart, segmentEnd, nightStart, nightEnd);
    }

    currentStart = dayEnd;
  }
  return total;
}

export function splitDailyOvertime(dayMinutes, dailyLimitMinutes) {
  const regular = Math.min(dayMinutes, dailyLimitMinutes);
  const overtime = Math.max(0, dayMinutes - dailyLimitMinutes);
  return { regular, overtime };
}

export function splitWeeklyOvertime(totalMinutes, weeklyLimitMinutes) {
  const regular = Math.min(totalMinutes, weeklyLimitMinutes);
  const overtime = Math.max(0, totalMinutes - weeklyLimitMinutes);
  return { regular, overtime };
}

export function splitDailyWeeklyOvertime(dailyOvertimeMinutes, weeklyOvertimeMinutes, totalMinutes) {
  const overtime = Math.max(dailyOvertimeMinutes, weeklyOvertimeMinutes);
  return { overtime, regular: Math.max(0, totalMinutes - overtime) };
}

export function calculateNightOvertime(overtimeMinutes, nightMinutes, totalMinutes) {
  if (totalMinutes <= 0) {
    return 0;
  }
  const ratio = nightMinutes / totalMinutes;
  let nightOvertime = Math.round(overtimeMinutes * ratio);
  nightOvertime = Math.max(0, Math.min(nightOvertime, nightMinutes, overtimeMinutes));
  return nightOvertime;
}

export function buildWeekCycle(startDate, weekStartIndex) {
  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dayName = WEEK_DAYS[(weekStartIndex + i) % 7];
    days.push({ dayName, date });
  }
  return days;
}

export function buildWeekRangeLabel(startDate, weekStartIndex) {
  const days = buildWeekCycle(startDate, weekStartIndex);
  const start = days[0];
  const end = days[6];
  return `${start.dayName} ${formatDateShort(start.date)} → ${end.dayName} ${formatDateShort(end.date)}`;
}
