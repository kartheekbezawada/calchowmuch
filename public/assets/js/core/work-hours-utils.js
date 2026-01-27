export const BREAK_OPTIONS = [0, 15, 30, 45, 60];

export function parseTimeString(value) {
  if (!value) {
    return null;
  }
  const [hoursRaw, minutesRaw] = value.split(':');
  const hours = Number.parseInt(hoursRaw, 10);
  const minutes = Number.parseInt(minutesRaw, 10);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return null;
  }
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return { hours, minutes };
}

export function toMinutes(time) {
  return time.hours * 60 + time.minutes;
}

export function calculateSegmentMinutes(startTime, endTime, endsNextDay) {
  if (!startTime || !endTime) {
    return null;
  }
  const startMinutes = toMinutes(startTime);
  let endMinutes = toMinutes(endTime);
  if (endsNextDay) {
    endMinutes += 1440;
  } else if (endMinutes < startMinutes) {
    return null;
  }
  return endMinutes - startMinutes;
}

export function formatHHMM(totalMinutes) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}

export function formatDecimalHours(totalMinutes) {
  const safeMinutes = Math.max(0, totalMinutes);
  return (safeMinutes / 60).toFixed(2);
}

export function calculateTotalWithBreak(segments, breakMinutes) {
  const segmentMinutes = segments.map((segment) =>
    calculateSegmentMinutes(segment.start, segment.end, segment.endsNextDay)
  );
  if (segmentMinutes.some((value) => value === null)) {
    return null;
  }
  const totalSegmentMinutes = segmentMinutes.reduce((sum, value) => sum + value, 0);
  if (breakMinutes > totalSegmentMinutes) {
    return null;
  }
  return {
    totalMinutes: totalSegmentMinutes - breakMinutes,
    totalBreakMinutes: breakMinutes,
    segmentMinutes,
  };
}

export function calculateWeeklyTotals(days) {
  const dailyMinutes = [];
  let totalMinutes = 0;
  let totalBreakMinutes = 0;

  days.forEach((day) => {
    if (!day.start && !day.end) {
      return;
    }
    const minutes = calculateSegmentMinutes(day.start, day.end, day.endsNextDay);
    if (minutes === null) {
      dailyMinutes.push(null);
      return;
    }
    if (day.breakMinutes > minutes) {
      dailyMinutes.push(null);
      return;
    }
    const workedMinutes = minutes - day.breakMinutes;
    dailyMinutes.push(workedMinutes);
    totalMinutes += workedMinutes;
    totalBreakMinutes += day.breakMinutes;
  });

  if (dailyMinutes.some((value) => value === null)) {
    return null;
  }

  return { totalMinutes, totalBreakMinutes, dailyMinutes };
}
