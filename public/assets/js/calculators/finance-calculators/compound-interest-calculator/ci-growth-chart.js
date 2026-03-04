const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatAxisCurrency(value) {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(abs >= 10_000_000_000 ? 0 : 1)}B`;
  }
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  }
  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  }

  return CURRENCY_FORMATTER.format(value);
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) return "—";
  return CURRENCY_FORMATTER.format(value);
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

function traceSmoothPath(ctx, points) {
  if (!Array.isArray(points) || points.length === 0) {
    return;
  }

  if (points.length === 1) {
    ctx.moveTo(points[0].x, points[0].y);
    return;
  }

  ctx.moveTo(points[0].x, points[0].y);

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midpointX = (current.x + next.x) * 0.5;
    const midpointY = (current.y + next.y) * 0.5;
    ctx.quadraticCurveTo(current.x, current.y, midpointX, midpointY);

    if (index === points.length - 2) {
      ctx.quadraticCurveTo(next.x, next.y, next.x, next.y);
    }
  }
}

function buildTicks(scale, maxBalance) {
  if (scale === "log") {
    const upper = Math.max(maxBalance, 1);
    const logMax = Math.log10(upper);
    const stepCount = 4;
    const ticks = [];

    for (let index = 0; index <= stepCount; index += 1) {
      const ratio = index / stepCount;
      const transformedValue = ratio * logMax;
      ticks.push(10 ** transformedValue);
    }

    return ticks;
  }

  const upper = Math.max(maxBalance, 1);
  const stepCount = 4;
  const ticks = [];

  for (let index = 0; index <= stepCount; index += 1) {
    ticks.push((upper / stepCount) * index);
  }

  return ticks;
}

function getScaleTransform(scale, maxBalance) {
  if (scale === "log") {
    const maxValue = Math.max(maxBalance, 1);
    const maxTransformed = Math.log10(maxValue);
    const transformedSafe = maxTransformed > 0 ? maxTransformed : 1;

    return {
      map(value) {
        return Math.log10(Math.max(value, 1));
      },
      min: 0,
      max: transformedSafe,
    };
  }

  const maxValue = Math.max(maxBalance, 1);
  return {
    map(value) {
      return value;
    },
    min: 0,
    max: maxValue,
  };
}

function resolvePeriodPrefix(frequencyLabel) {
  if (frequencyLabel === "Quarter") return "Q";
  if (frequencyLabel === "Half-Year") return "H";
  return "Y";
}

function buildPlotGeometry({
  width,
  height,
  points,
  scale,
  frequencyLabel,
  xAxisLabel,
  yAxisLabel,
}) {
  const paddingTop = 28;
  const paddingRight = 26;
  const paddingBottom = 58;
  const paddingLeft = 74;

  const plotLeft = paddingLeft;
  const plotTop = paddingTop;
  const plotRight = width - paddingRight;
  const plotBottom = height - paddingBottom;
  const plotWidth = Math.max(plotRight - plotLeft, 1);
  const plotHeight = Math.max(plotBottom - plotTop, 1);

  const maxBalance = Math.max(...points.map((point) => point.endingBalance), 1);
  const transform = getScaleTransform(scale, maxBalance);
  const xStep = plotWidth / Math.max(points.length - 1, 1);

  function yForValue(value) {
    const mapped = transform.map(Math.max(value, 0));
    const ratio =
      (mapped - transform.min) / Math.max(transform.max - transform.min, 1e-9);
    return plotBottom - ratio * plotHeight;
  }

  const balanceCoords = points.map((point, index) => ({
    x: plotLeft + xStep * index,
    y: yForValue(point.endingBalance),
    point,
  }));

  const principalCoords = points.map((point, index) => ({
    x: plotLeft + xStep * index,
    y: yForValue(point.principalBase),
    point,
  }));

  const ticks = buildTicks(scale, maxBalance).map((value) => ({
    value,
    y: yForValue(value),
  }));

  const tickIndexes = new Set([0, points.length - 1]);
  const xTickCount = Math.min(6, points.length);
  for (let index = 0; index < xTickCount; index += 1) {
    tickIndexes.add(
      Math.round((points.length - 1) * (index / Math.max(xTickCount - 1, 1))),
    );
  }

  const periodPrefix = resolvePeriodPrefix(frequencyLabel);
  const xTicks = Array.from(tickIndexes)
    .sort((a, b) => a - b)
    .map((pointIndex) => {
      const point = points[pointIndex];
      return {
        index: pointIndex,
        x: plotLeft + xStep * pointIndex,
        label: `${periodPrefix}${point.periodIndex}`,
      };
    });

  return {
    width,
    height,
    plotLeft,
    plotTop,
    plotRight,
    plotBottom,
    plotWidth,
    plotHeight,
    xStep,
    balanceCoords,
    principalCoords,
    yTicks: ticks,
    xTicks,
    xAxisLabel,
    yAxisLabel,
  };
}

function drawAxesAndGrid(ctx, geometry) {
  const {
    plotLeft,
    plotTop,
    plotRight,
    plotBottom,
    yTicks,
    xTicks,
    xAxisLabel,
    yAxisLabel,
    width,
    height,
  } = geometry;

  ctx.save();

  ctx.strokeStyle = "rgba(148, 163, 184, 0.26)";
  ctx.lineWidth = 1;

  yTicks.forEach((tick) => {
    ctx.beginPath();
    ctx.moveTo(plotLeft, tick.y);
    ctx.lineTo(plotRight, tick.y);
    ctx.stroke();

    ctx.fillStyle = "rgba(226, 232, 240, 0.88)";
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(formatAxisCurrency(tick.value), plotLeft - 10, tick.y);
  });

  xTicks.forEach((tick) => {
    ctx.beginPath();
    ctx.moveTo(tick.x, plotTop);
    ctx.lineTo(tick.x, plotBottom);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.stroke();

    ctx.fillStyle = "rgba(191, 219, 254, 0.92)";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(tick.label, tick.x, plotBottom + 10);
  });

  ctx.strokeStyle = "rgba(148, 163, 184, 0.42)";
  ctx.beginPath();
  ctx.moveTo(plotLeft, plotBottom);
  ctx.lineTo(plotRight, plotBottom);
  ctx.moveTo(plotLeft, plotBottom);
  ctx.lineTo(plotLeft, plotTop);
  ctx.stroke();

  ctx.fillStyle = "rgba(224, 242, 254, 0.96)";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(xAxisLabel, (plotLeft + plotRight) * 0.5, height - 12);

  ctx.save();
  ctx.translate(18, (plotTop + plotBottom) * 0.5);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(yAxisLabel, 0, 0);
  ctx.restore();

  ctx.restore();
}

function drawAreasAndLine(ctx, geometry) {
  const { plotBottom, balanceCoords, principalCoords } = geometry;
  if (balanceCoords.length === 0) return;

  const principalGradient = ctx.createLinearGradient(0, 0, 0, plotBottom);
  principalGradient.addColorStop(0, "rgba(124, 58, 237, 0.48)");
  principalGradient.addColorStop(1, "rgba(124, 58, 237, 0.08)");

  ctx.beginPath();
  traceSmoothPath(ctx, principalCoords);
  ctx.lineTo(principalCoords[principalCoords.length - 1].x, plotBottom);
  ctx.lineTo(principalCoords[0].x, plotBottom);
  ctx.closePath();
  ctx.fillStyle = principalGradient;
  ctx.fill();

  const interestGradient = ctx.createLinearGradient(0, 0, 0, plotBottom);
  interestGradient.addColorStop(0, "rgba(245, 158, 11, 0.52)");
  interestGradient.addColorStop(1, "rgba(245, 158, 11, 0.1)");

  ctx.beginPath();
  traceSmoothPath(ctx, balanceCoords);
  for (let index = principalCoords.length - 1; index >= 0; index -= 1) {
    ctx.lineTo(principalCoords[index].x, principalCoords[index].y);
  }
  ctx.closePath();
  ctx.fillStyle = interestGradient;
  ctx.fill();

  const lineGradient = ctx.createLinearGradient(0, 0, geometry.width, 0);
  lineGradient.addColorStop(0, "rgba(125, 211, 252, 0.96)");
  lineGradient.addColorStop(1, "rgba(34, 211, 238, 0.96)");

  ctx.save();
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = lineGradient;
  ctx.shadowColor = "rgba(56, 189, 248, 0.45)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  traceSmoothPath(ctx, balanceCoords);
  ctx.stroke();
  ctx.restore();
}

function drawHoverState(ctx, geometry, hoverIndex) {
  if (!Number.isInteger(hoverIndex) || hoverIndex < 0) return;

  const balancePoint = geometry.balanceCoords[hoverIndex];
  const principalPoint = geometry.principalCoords[hoverIndex];
  if (!balancePoint || !principalPoint) return;

  ctx.save();
  ctx.strokeStyle = "rgba(125, 211, 252, 0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(balancePoint.x, geometry.plotTop);
  ctx.lineTo(balancePoint.x, geometry.plotBottom);
  ctx.stroke();

  ctx.fillStyle = "rgba(224, 242, 254, 0.95)";
  ctx.strokeStyle = "rgba(8, 145, 178, 0.95)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(balancePoint.x, balancePoint.y, 4.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(principalPoint.x, principalPoint.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(30, 64, 175, 0.95)";
  ctx.fill();
  ctx.strokeStyle = "rgba(191, 219, 254, 0.95)";
  ctx.stroke();

  ctx.restore();
}

function drawBackground(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
  backgroundGradient.addColorStop(0, "rgba(2, 6, 23, 0.96)");
  backgroundGradient.addColorStop(1, "rgba(15, 23, 42, 0.96)");

  drawRoundedRect(ctx, 1, 1, width - 2, height - 2, 16);
  ctx.fillStyle = backgroundGradient;
  ctx.fill();

  ctx.strokeStyle = "rgba(125, 211, 252, 0.2)";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 1, 1, width - 2, height - 2, 16);
  ctx.stroke();
}

function resizeCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(Math.floor(rect.width), 1);
  const height = Math.max(Math.floor(rect.height), 1);
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { width, height };
}

function hideTooltip(tooltip) {
  if (!tooltip) return;
  tooltip.hidden = true;
  tooltip.innerHTML = "";
}

function showTooltip({ tooltip, geometry, hoverIndex, hostRect }) {
  if (
    !tooltip ||
    !geometry ||
    !Number.isInteger(hoverIndex) ||
    hoverIndex < 0
  ) {
    hideTooltip(tooltip);
    return;
  }

  const hovered = geometry.balanceCoords[hoverIndex];
  if (!hovered) {
    hideTooltip(tooltip);
    return;
  }

  const point = hovered.point;
  const interestShare =
    point.endingBalance > 0
      ? (point.interestTotal / point.endingBalance) * 100
      : 0;

  tooltip.innerHTML = `
    <p class="ci-growth-tooltip-period">${point.periodLabel}</p>
    <p><span>Balance</span><strong>${formatCurrency(point.endingBalance)}</strong></p>
    <p><span>Principal + Contributions</span><strong>${formatCurrency(point.principalBase)}</strong></p>
    <p><span>Interest</span><strong>${formatCurrency(point.interestTotal)}</strong></p>
    <p><span>Interest Share</span><strong>${interestShare.toFixed(1)}%</strong></p>
  `;
  tooltip.hidden = false;

  const localX = hovered.x + 14;
  const localY = hovered.y - 14;

  const tooltipWidth = tooltip.offsetWidth || 220;
  const tooltipHeight = tooltip.offsetHeight || 128;

  const maxLeft = hostRect.width - tooltipWidth - 8;
  const maxTop = hostRect.height - tooltipHeight - 8;

  const left = clamp(localX, 8, Math.max(maxLeft, 8));
  const top = clamp(localY, 8, Math.max(maxTop, 8));

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function drawChart(ctx, canvas, tooltip, state) {
  const { series, scale, hoverIndex } = state;
  const { width, height } = resizeCanvas(canvas, ctx);

  drawBackground(ctx, width, height);

  if (!series || !Array.isArray(series.points) || series.points.length === 0) {
    hideTooltip(tooltip);

    ctx.fillStyle = "rgba(191, 219, 254, 0.86)";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Run a valid calculation to render chart data.",
      width * 0.5,
      height * 0.5,
    );
    return;
  }

  const geometry = buildPlotGeometry({
    width,
    height,
    points: series.points,
    scale,
    frequencyLabel: series.frequencyLabel,
    xAxisLabel: series.xAxisLabel,
    yAxisLabel: series.yAxisLabel,
  });

  state.geometry = geometry;

  drawAxesAndGrid(ctx, geometry);
  drawAreasAndLine(ctx, geometry);
  drawHoverState(ctx, geometry, hoverIndex);

  const hostRect = canvas.parentElement?.getBoundingClientRect();
  if (hostRect) {
    showTooltip({
      tooltip,
      geometry,
      hoverIndex,
      hostRect,
    });
  }
}

export function createCompoundInterestGrowthChart({ canvas, tooltip }) {
  if (!canvas) {
    return {
      update() {},
      destroy() {},
    };
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      update() {},
      destroy() {},
    };
  }

  const state = {
    series: null,
    scale: "linear",
    hoverIndex: -1,
    geometry: null,
  };

  function redraw() {
    drawChart(ctx, canvas, tooltip, state);
  }

  function onPointerMove(event) {
    const geometry = state.geometry;
    if (!geometry || !state.series?.points?.length) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    if (
      pointerX < geometry.plotLeft ||
      pointerX > geometry.plotRight ||
      pointerY < geometry.plotTop ||
      pointerY > geometry.plotBottom
    ) {
      state.hoverIndex = -1;
      redraw();
      return;
    }

    const estimatedIndex = Math.round(
      (pointerX - geometry.plotLeft) / Math.max(geometry.xStep, 1),
    );
    state.hoverIndex = clamp(estimatedIndex, 0, state.series.points.length - 1);
    redraw();
  }

  function clearHover() {
    state.hoverIndex = -1;
    hideTooltip(tooltip);
    redraw();
  }

  const resizeObserver =
    typeof window !== "undefined" && "ResizeObserver" in window
      ? new ResizeObserver(() => {
          redraw();
        })
      : null;

  if (resizeObserver && canvas.parentElement) {
    resizeObserver.observe(canvas.parentElement);
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerMove);
  canvas.addEventListener("pointerleave", clearHover);
  canvas.addEventListener("pointercancel", clearHover);

  return {
    update(series, options = {}) {
      state.series = series && Array.isArray(series.points) ? series : null;
      state.scale = options.scale === "log" ? "log" : "linear";
      if (!state.series) {
        state.hoverIndex = -1;
      } else {
        state.hoverIndex = clamp(
          state.hoverIndex,
          -1,
          state.series.points.length - 1,
        );
      }
      redraw();
    },
    destroy() {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerMove);
      canvas.removeEventListener("pointerleave", clearHover);
      canvas.removeEventListener("pointercancel", clearHover);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      hideTooltip(tooltip);
    },
  };
}
