export const NAP_TYPES = {
  quick: { label: 'Quick Nap', minutes: 20 },
  power: { label: 'Power Nap', minutes: 30 },
  afternoon: { label: 'Afternoon Nap', minutes: 90 },
};

export const DEFAULT_NAP_TYPE = 'power';
export const DEFAULT_BUFFER_MINUTES = 5;
export const BUFFER_OPTIONS = [0, 5, 10];

export function getNapType(type) {
  return NAP_TYPES[type] ?? NAP_TYPES[DEFAULT_NAP_TYPE];
}

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

export function calculateWakeTime(startTime, napMinutes, bufferMinutes) {
  if (!startTime || !Number.isFinite(napMinutes) || !Number.isFinite(bufferMinutes)) {
    return null;
  }
  const startTotal = startTime.hours * 60 + startTime.minutes;
  if (!Number.isFinite(startTotal)) {
    return null;
  }
  const totalMinutes = startTotal + napMinutes + bufferMinutes;
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return { hours, minutes };
}
