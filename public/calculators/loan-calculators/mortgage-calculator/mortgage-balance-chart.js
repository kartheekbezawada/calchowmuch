function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatAmount(value) {
  if (!Number.isFinite(value)) return '-';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatAxisValue(value) {
  if (!Number.isFinite(value)) return '-';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  }
  return formatAmount(value);
}

function formatMonthLabel(month) {
  if (!Number.isFinite(month) || month <= 0) return 'Start';
  if (month % 12 === 0) return `${month / 12}y`;
  return `${month}m`;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function resizeCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { width, height };
}

function findNearestIndex(points, x) {
  if (!Array.isArray(points) || points.length === 0) return -1;
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  for (let index = 0; index < points.length; index += 1) {
    const distance = Math.abs(points[index].x - x);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return nearestIndex;
}

function drawChartFrame(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(2, 6, 23, 0.98)');
  gradient.addColorStop(1, 'rgba(15, 23, 42, 0.96)');

  drawRoundedRect(ctx, 1, 1, width - 2, height - 2, 16);
  ctx.fillStyle = gradient;
  ctx.fill();

  const topGlow = ctx.createLinearGradient(0, 0, width, 0);
  topGlow.addColorStop(0, 'rgba(34, 211, 238, 0.16)');
  topGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.12)');
  topGlow.addColorStop(1, 'rgba(245, 158, 11, 0.14)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(8, 8, width - 16, 40);

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.26)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 1, 1, width - 2, height - 2, 16);
  ctx.stroke();
}

function buildGeometry({ width, height, series }) {
  const padding = {
    top: 24,
    right: 18,
    bottom: 54,
    left: 64,
  };

  const plot = {
    left: padding.left,
    right: width - padding.right,
    top: padding.top,
    bottom: height - padding.bottom,
  };
  plot.width = Math.max(1, plot.right - plot.left);
  plot.height = Math.max(1, plot.bottom - plot.top);

  const maxBalance = Math.max(
    1,
    ...series.points.map((point) => Math.max(point.baselineBalance, point.extraBalance, 0))
  );

  const xStep = plot.width / Math.max(series.points.length - 1, 1);

  function yFor(balance) {
    const ratio = clamp(balance / maxBalance, 0, 1);
    return plot.bottom - ratio * plot.height;
  }

  const baselineCoords = series.points.map((point, index) => ({
    x: plot.left + xStep * index,
    y: yFor(point.baselineBalance),
    point,
  }));

  const extraCoords = series.points.map((point, index) => ({
    x: plot.left + xStep * index,
    y: yFor(point.extraBalance),
    point,
  }));

  const yTicks = [];
  for (let step = 0; step <= 4; step += 1) {
    const value = (maxBalance / 4) * step;
    yTicks.push({
      value,
      y: yFor(value),
    });
  }

  const xTicks = [];
  const tickCount = Math.min(6, series.points.length);
  for (let idx = 0; idx < tickCount; idx += 1) {
    const pointIndex = Math.round((series.points.length - 1) * (idx / Math.max(1, tickCount - 1)));
    const point = series.points[pointIndex];
    xTicks.push({
      x: plot.left + xStep * pointIndex,
      label: formatMonthLabel(point.month),
    });
  }

  return {
    plot,
    baselineCoords,
    extraCoords,
    yTicks,
    xTicks,
  };
}

function drawAxes(ctx, width, height, geometry) {
  const { plot, yTicks, xTicks } = geometry;

  yTicks.forEach((tick) => {
    ctx.beginPath();
    ctx.moveTo(plot.left, tick.y);
    ctx.lineTo(plot.right, tick.y);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(226, 232, 240, 0.86)';
    ctx.font = '500 12px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatAxisValue(tick.value), plot.left - 10, tick.y);
  });

  xTicks.forEach((tick) => {
    ctx.beginPath();
    ctx.moveTo(tick.x, plot.top);
    ctx.lineTo(tick.x, plot.bottom);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(191, 219, 254, 0.94)';
    ctx.font = '500 11px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(tick.label, tick.x, plot.bottom + 8);
  });

  ctx.beginPath();
  ctx.moveTo(plot.left, plot.bottom);
  ctx.lineTo(plot.right, plot.bottom);
  ctx.moveTo(plot.left, plot.bottom);
  ctx.lineTo(plot.left, plot.top);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.52)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(191, 219, 254, 0.92)';
  ctx.font = '600 12px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Time (months)', (plot.left + plot.right) / 2, height - 12);

  ctx.save();
  ctx.translate(18, (plot.top + plot.bottom) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Remaining Balance', 0, 0);
  ctx.restore();
}

function drawLine(ctx, coords, { color, shadowColor, width = 2.8, dash = [] }) {
  if (!coords.length) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(coords[0].x, coords[0].y);
  for (let index = 1; index < coords.length; index += 1) {
    ctx.lineTo(coords[index].x, coords[index].y);
  }
  ctx.strokeStyle = color;
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = 10;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineDashOffset = 0;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

function drawGapFill(ctx, baselineCoords, extraCoords) {
  if (!baselineCoords.length || !extraCoords.length || baselineCoords.length !== extraCoords.length) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(baselineCoords[0].x, baselineCoords[0].y);
  for (let index = 1; index < baselineCoords.length; index += 1) {
    ctx.lineTo(baselineCoords[index].x, baselineCoords[index].y);
  }
  for (let index = extraCoords.length - 1; index >= 0; index -= 1) {
    ctx.lineTo(extraCoords[index].x, extraCoords[index].y);
  }
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, baselineCoords[0].y, 0, extraCoords[extraCoords.length - 1].y);
  gradient.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
  gradient.addColorStop(1, 'rgba(245, 158, 11, 0.06)');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawHover(ctx, geometry, hoverIndex) {
  if (!Number.isInteger(hoverIndex) || hoverIndex < 0) return;
  const baselinePoint = geometry.baselineCoords[hoverIndex];
  const extraPoint = geometry.extraCoords[hoverIndex];
  if (!baselinePoint || !extraPoint) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(baselinePoint.x, geometry.plot.top);
  ctx.lineTo(baselinePoint.x, geometry.plot.bottom);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(baselinePoint.x, baselinePoint.y, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(extraPoint.x, extraPoint.y, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#22d3ee';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
  ctx.restore();
}

function hideTooltip(tooltip) {
  if (!tooltip) return;
  tooltip.hidden = true;
  tooltip.innerHTML = '';
}

function showTooltip({ tooltip, geometry, hoverIndex, hostRect }) {
  if (!tooltip || hoverIndex < 0) {
    hideTooltip(tooltip);
    return;
  }

  const baselinePoint = geometry.baselineCoords[hoverIndex];
  const extraPoint = geometry.extraCoords[hoverIndex];
  if (!baselinePoint || !extraPoint) {
    hideTooltip(tooltip);
    return;
  }

  const month = baselinePoint.point.month;
  const baselineBalance = baselinePoint.point.baselineBalance;
  const extraBalance = extraPoint.point.extraBalance;
  const gap = Math.max(0, baselineBalance - extraBalance);

  tooltip.innerHTML =
    `<p class="mtg-tooltip-period">${month === 0 ? 'Start' : `Month ${month}`}</p>` +
    `<p><span>Baseline balance</span><strong>${formatAmount(baselineBalance)}</strong></p>` +
    `<p><span>With extras</span><strong>${formatAmount(extraBalance)}</strong></p>` +
    `<p><span>Balance gap</span><strong>${formatAmount(gap)}</strong></p>`;
  tooltip.hidden = false;

  const left = clamp(baselinePoint.x + 12, 8, hostRect.width - (tooltip.offsetWidth || 220) - 8);
  const top = clamp(
    Math.min(baselinePoint.y, extraPoint.y) - 12,
    8,
    hostRect.height - (tooltip.offsetHeight || 120) - 8
  );

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

export function createMortgageBalanceChart({ canvas, tooltip, status }) {
  if (!canvas) {
    return {
      update() {},
      destroy() {},
    };
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      update() {},
      destroy() {},
    };
  }

  const state = {
    series: null,
    geometry: null,
    hoverIndex: -1,
  };

  function setStatus(message) {
    if (!status) return;
    if (!message) {
      status.textContent = '';
      return;
    }
    status.textContent = message;
  }

  function redraw() {
    const { width, height } = resizeCanvas(canvas, ctx);
    drawChartFrame(ctx, width, height);

    if (!state.series || !Array.isArray(state.series.points) || state.series.points.length < 2) {
      state.geometry = null;
      hideTooltip(tooltip);
      setStatus('Run a valid calculation to view the mortgage balance graph.');
      ctx.fillStyle = 'rgba(191, 219, 254, 0.85)';
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Graph data will appear after calculation.', width / 2, height / 2);
      return;
    }

    const geometry = buildGeometry({ width, height, series: state.series });
    state.geometry = geometry;

    drawAxes(ctx, width, height, geometry);
    drawGapFill(ctx, geometry.baselineCoords, geometry.extraCoords);
    drawLine(ctx, geometry.extraCoords, {
      color: '#22d3ee',
      shadowColor: 'rgba(34, 211, 238, 0.45)',
      width: 3,
      dash: [],
    });
    drawLine(ctx, geometry.baselineCoords, {
      color: '#f59e0b',
      shadowColor: 'rgba(245, 158, 11, 0.45)',
      width: 2.6,
      dash: [7, 5],
    });
    drawHover(ctx, geometry, state.hoverIndex);

    const hostRect = canvas.parentElement?.getBoundingClientRect();
    if (hostRect) {
      showTooltip({
        tooltip,
        geometry,
        hoverIndex: state.hoverIndex,
        hostRect,
      });
    }

    setStatus('');
  }

  function onPointerMove(event) {
    if (!state.geometry || !state.series?.points?.length) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { plot, baselineCoords } = state.geometry;

    if (x < plot.left || x > plot.right || y < plot.top || y > plot.bottom) {
      state.hoverIndex = -1;
      hideTooltip(tooltip);
      redraw();
      return;
    }

    state.hoverIndex = findNearestIndex(baselineCoords, x);
    redraw();
  }

  function clearHover() {
    state.hoverIndex = -1;
    hideTooltip(tooltip);
    redraw();
  }

  const resizeObserver =
    typeof window !== 'undefined' && 'ResizeObserver' in window
      ? new ResizeObserver(() => redraw())
      : null;

  if (resizeObserver && canvas.parentElement) {
    resizeObserver.observe(canvas.parentElement);
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerMove);
  canvas.addEventListener('pointerleave', clearHover);
  canvas.addEventListener('pointercancel', clearHover);

  redraw();

  return {
    update(series) {
      state.series = series;
      state.hoverIndex = -1;
      redraw();
    },
    destroy() {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerMove);
      canvas.removeEventListener('pointerleave', clearHover);
      canvas.removeEventListener('pointercancel', clearHover);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      hideTooltip(tooltip);
      setStatus('');
    },
  };
}
