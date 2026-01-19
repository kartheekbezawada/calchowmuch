export function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function clamp(value, min, max) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

export function hasMaxDigits(value, maxDigits) {
  if (!Number.isFinite(maxDigits) || maxDigits <= 0) {
    return true;
  }
  if (value === null || value === undefined) {
    return true;
  }
  const raw = String(value).trim();
  if (!raw) {
    return true;
  }
  const digitsOnly = raw.replace(/\D/g, '');
  return digitsOnly.length <= maxDigits;
}
