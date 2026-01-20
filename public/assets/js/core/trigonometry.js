const SPECIAL_ANGLE_TABLE = [
  { deg: 0, sin: '0', cos: '1', tan: '0' },
  { deg: 30, sin: '1/2', cos: 'sqrt(3)/2', tan: '1/sqrt(3)' },
  { deg: 45, sin: 'sqrt(2)/2', cos: 'sqrt(2)/2', tan: '1' },
  { deg: 60, sin: 'sqrt(3)/2', cos: '1/2', tan: 'sqrt(3)' },
  { deg: 90, sin: '1', cos: '0', tan: 'undefined' },
  { deg: 120, sin: 'sqrt(3)/2', cos: '-1/2', tan: '-sqrt(3)' },
  { deg: 135, sin: 'sqrt(2)/2', cos: '-sqrt(2)/2', tan: '-1' },
  { deg: 150, sin: '1/2', cos: '-sqrt(3)/2', tan: '-1/sqrt(3)' },
  { deg: 180, sin: '0', cos: '-1', tan: '0' },
  { deg: 210, sin: '-1/2', cos: '-sqrt(3)/2', tan: '1/sqrt(3)' },
  { deg: 225, sin: '-sqrt(2)/2', cos: '-sqrt(2)/2', tan: '1' },
  { deg: 240, sin: '-sqrt(3)/2', cos: '-1/2', tan: 'sqrt(3)' },
  { deg: 270, sin: '-1', cos: '0', tan: 'undefined' },
  { deg: 300, sin: '-sqrt(3)/2', cos: '1/2', tan: '-sqrt(3)' },
  { deg: 315, sin: '-sqrt(2)/2', cos: 'sqrt(2)/2', tan: '-1' },
  { deg: 330, sin: '-1/2', cos: 'sqrt(3)/2', tan: '-1/sqrt(3)' },
  { deg: 360, sin: '0', cos: '1', tan: '0' },
];

const RADIAN_LABELS = {
  0: '0',
  30: 'pi/6',
  45: 'pi/4',
  60: 'pi/3',
  90: 'pi/2',
  120: '2pi/3',
  135: '3pi/4',
  150: '5pi/6',
  180: 'pi',
  210: '7pi/6',
  225: '5pi/4',
  240: '4pi/3',
  270: '3pi/2',
  300: '5pi/3',
  315: '7pi/4',
  330: '11pi/6',
  360: '2pi',
};

export const SPECIAL_ANGLES = SPECIAL_ANGLE_TABLE.map((entry) => entry.deg);

export function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians) {
  return (radians * 180) / Math.PI;
}

export function normalizeDegrees(degrees) {
  if (!Number.isFinite(degrees)) {
    return 0;
  }
  const normalized = degrees % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function getQuadrantFromDegrees(degrees) {
  const angle = normalizeDegrees(degrees);
  if (angle === 0 || angle === 90 || angle === 180 || angle === 270 || angle === 360) {
    return 'Axis';
  }
  if (angle > 0 && angle < 90) {
    return 'I';
  }
  if (angle > 90 && angle < 180) {
    return 'II';
  }
  if (angle > 180 && angle < 270) {
    return 'III';
  }
  return 'IV';
}

export function getReferenceAngleDegrees(degrees) {
  const angle = normalizeDegrees(degrees);
  if (angle >= 0 && angle <= 90) {
    return angle;
  }
  if (angle > 90 && angle <= 180) {
    return 180 - angle;
  }
  if (angle > 180 && angle <= 270) {
    return angle - 180;
  }
  return 360 - angle;
}

export function getSpecialAngleInfo(degrees, tolerance = 1e-6) {
  const normalized = normalizeDegrees(degrees);
  const match = SPECIAL_ANGLE_TABLE.find((entry) => Math.abs(entry.deg - normalized) <= tolerance);
  if (!match) {
    return null;
  }
  return {
    ...match,
    radLabel: RADIAN_LABELS[match.deg],
  };
}

export function formatRadiansFromDegrees(degrees, options = {}) {
  const { maximumFractionDigits = 6, normalize = true } = options;
  const normalized = normalize ? normalizeDegrees(degrees) : degrees;
  const sign = normalized < 0 ? '-' : '';
  const absDegrees = Math.abs(normalized);
  const label = RADIAN_LABELS[absDegrees];
  if (label) {
    return sign ? `${sign}${label}` : label;
  }
  return degToRad(normalized).toLocaleString(undefined, {
    maximumFractionDigits,
  });
}

export function formatAnglePair(degrees, options = {}) {
  const { maximumFractionDigits = 6, normalize = true } = options;
  const normalized = normalize ? normalizeDegrees(degrees) : degrees;
  const radLabel = formatRadiansFromDegrees(degrees, { maximumFractionDigits, normalize });
  const degLabel = normalized.toLocaleString(undefined, { maximumFractionDigits });
  return `${degLabel} deg (${radLabel} rad)`;
}

export function computeTrigValues(angleRadians) {
  const sin = Math.sin(angleRadians);
  const cos = Math.cos(angleRadians);
  const tan = Math.abs(cos) < 1e-12 ? null : sin / cos;
  const sec = Math.abs(cos) < 1e-12 ? null : 1 / cos;
  const csc = Math.abs(sin) < 1e-12 ? null : 1 / sin;
  const cot = Math.abs(sin) < 1e-12 ? null : cos / sin;

  return {
    sin,
    cos,
    tan,
    sec,
    csc,
    cot,
  };
}

function clampCos(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(1, Math.max(-1, value));
}

function triangleArea(a, b, c) {
  const semi = (a + b + c) / 2;
  const areaSquared = semi * (semi - a) * (semi - b) * (semi - c);
  if (areaSquared <= 0) {
    return 0;
  }
  return Math.sqrt(areaSquared);
}

function solveSSS(values) {
  const { a, b, c } = values;
  if (a + b <= c || a + c <= b || b + c <= a) {
    return { error: 'Triangle inequality failed.' };
  }

  const angleA = radToDeg(Math.acos(clampCos((b * b + c * c - a * a) / (2 * b * c))));
  const angleB = radToDeg(Math.acos(clampCos((a * a + c * c - b * b) / (2 * a * c))));
  const angleC = 180 - angleA - angleB;

  return {
    solutions: [
      {
        a,
        b,
        c,
        A: angleA,
        B: angleB,
        C: angleC,
        area: triangleArea(a, b, c),
        method: 'SSS',
      },
    ],
  };
}

function solveSAS(values) {
  const { a, b, C } = values;
  if (C <= 0 || C >= 180) {
    return { error: 'Included angle must be between 0 and 180 degrees.' };
  }
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(degToRad(C)));
  if (!Number.isFinite(c) || c <= 0) {
    return { error: 'Unable to compute third side.' };
  }
  const angleA = radToDeg(Math.acos(clampCos((b * b + c * c - a * a) / (2 * b * c))));
  const angleB = 180 - angleA - C;

  return {
    solutions: [
      {
        a,
        b,
        c,
        A: angleA,
        B: angleB,
        C,
        area: triangleArea(a, b, c),
        method: 'SAS',
      },
    ],
  };
}

function solveASA(values) {
  const { A, B, c } = values;
  const angleC = 180 - A - B;
  if (angleC <= 0) {
    return { error: 'Angles do not form a valid triangle.' };
  }
  const a = (c * Math.sin(degToRad(A))) / Math.sin(degToRad(angleC));
  const b = (c * Math.sin(degToRad(B))) / Math.sin(degToRad(angleC));

  return {
    solutions: [
      {
        a,
        b,
        c,
        A,
        B,
        C: angleC,
        area: triangleArea(a, b, c),
        method: 'ASA',
      },
    ],
  };
}

function solveAAS(values) {
  const { A, B, a } = values;
  const angleC = 180 - A - B;
  if (angleC <= 0) {
    return { error: 'Angles do not form a valid triangle.' };
  }
  const b = (a * Math.sin(degToRad(B))) / Math.sin(degToRad(A));
  const c = (a * Math.sin(degToRad(angleC))) / Math.sin(degToRad(A));

  return {
    solutions: [
      {
        a,
        b,
        c,
        A,
        B,
        C: angleC,
        area: triangleArea(a, b, c),
        method: 'AAS',
      },
    ],
  };
}

function solveSSA(values) {
  const { A, a, b } = values;
  if (A <= 0 || A >= 180) {
    return { error: 'Angle A must be between 0 and 180 degrees.' };
  }
  const ratio = (b * Math.sin(degToRad(A))) / a;
  if (ratio > 1 + 1e-10) {
    return { error: 'No triangle satisfies the given SSA inputs.' };
  }

  const solutions = [];
  const angleB1 = radToDeg(Math.asin(Math.min(1, Math.max(-1, ratio))));
  const angleC1 = 180 - A - angleB1;
  if (angleC1 > 0) {
    const c1 = (a * Math.sin(degToRad(angleC1))) / Math.sin(degToRad(A));
    solutions.push({
      a,
      b,
      c: c1,
      A,
      B: angleB1,
      C: angleC1,
      area: triangleArea(a, b, c1),
      method: 'SSA',
    });
  }

  const angleB2 = 180 - angleB1;
  const angleC2 = 180 - A - angleB2;
  if (angleB2 !== angleB1 && angleC2 > 0) {
    const c2 = (a * Math.sin(degToRad(angleC2))) / Math.sin(degToRad(A));
    solutions.push({
      a,
      b,
      c: c2,
      A,
      B: angleB2,
      C: angleC2,
      area: triangleArea(a, b, c2),
      method: 'SSA',
    });
  }

  if (solutions.length === 0) {
    return { error: 'No valid triangle found for SSA inputs.' };
  }

  return {
    solutions,
    notes: solutions.length > 1 ? 'Ambiguous case produced two solutions.' : null,
  };
}

export function solveTriangle(type, values) {
  const safeValues = {
    a: values.a,
    b: values.b,
    c: values.c,
    A: values.A,
    B: values.B,
    C: values.C,
  };

  if (type === 'SSS') {
    return solveSSS(safeValues);
  }
  if (type === 'SAS') {
    return solveSAS(safeValues);
  }
  if (type === 'ASA') {
    return solveASA(safeValues);
  }
  if (type === 'AAS') {
    return solveAAS(safeValues);
  }
  if (type === 'SSA') {
    return solveSSA(safeValues);
  }

  return { error: 'Unknown triangle type.' };
}

export function detectTriangleType(values) {
  const hasA = Number.isFinite(values.A);
  const hasB = Number.isFinite(values.B);
  const hasC = Number.isFinite(values.C);
  const hasSideA = Number.isFinite(values.a);
  const hasSideB = Number.isFinite(values.b);
  const hasSideC = Number.isFinite(values.c);

  if (hasSideA && hasSideB && hasSideC) {
    return 'SSS';
  }

  if (hasSideA && hasSideB && hasC) {
    return 'SAS';
  }
  if (hasSideA && hasSideC && hasB) {
    return 'SAS';
  }
  if (hasSideB && hasSideC && hasA) {
    return 'SAS';
  }

  if (hasA && hasB && hasSideC) {
    return 'ASA';
  }
  if (hasA && hasC && hasSideB) {
    return 'ASA';
  }
  if (hasB && hasC && hasSideA) {
    return 'ASA';
  }

  if (hasA && hasB && hasSideA) {
    return 'AAS';
  }
  if (hasA && hasC && hasSideA) {
    return 'AAS';
  }
  if (hasB && hasC && hasSideB) {
    return 'AAS';
  }

  if (hasSideA && hasSideB && hasA) {
    return 'SSA';
  }
  if (hasSideA && hasSideC && hasA) {
    return 'SSA';
  }
  if (hasSideB && hasSideC && hasB) {
    return 'SSA';
  }

  return null;
}

function collectAngleSolutions(baseValues, period, startRad, endRad) {
  const solutions = [];
  baseValues.forEach((base) => {
    const minK = Math.floor((startRad - base) / period) - 1;
    const maxK = Math.ceil((endRad - base) / period) + 1;
    for (let k = minK; k <= maxK; k += 1) {
      const candidate = base + k * period;
      if (candidate >= startRad - 1e-6 && candidate <= endRad + 1e-6) {
        solutions.push(candidate);
      }
    }
  });

  const unique = [];
  solutions.forEach((value) => {
    if (!unique.some((existing) => Math.abs(existing - value) < 1e-6)) {
      unique.push(value);
    }
  });

  return unique.sort((a, b) => a - b);
}

export function getInverseTrigSolutions(func, value, startRad, endRad) {
  const start = Math.min(startRad, endRad);
  const end = Math.max(startRad, endRad);

  if ((func === 'arcsin' || func === 'arccos') && (value < -1 || value > 1)) {
    return { error: 'Input must be between -1 and 1 for arcsin/arccos.' };
  }

  let principal = null;
  let baseValues = [];
  let period = Math.PI * 2;

  if (func === 'arcsin') {
    principal = Math.asin(value);
    baseValues = [principal, Math.PI - principal];
  } else if (func === 'arccos') {
    principal = Math.acos(value);
    baseValues = [principal, -principal];
  } else if (func === 'arctan') {
    principal = Math.atan(value);
    baseValues = [principal];
    period = Math.PI;
  } else {
    return { error: 'Unknown inverse trig function.' };
  }

  return {
    principal,
    solutions: collectAngleSolutions(baseValues, period, start, end),
  };
}
