function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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

function findNearestPoint(points, x) {
  if (!points.length) {
    return -1;
  }
  let nearest = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  points.forEach((point, index) => {
    const distance = Math.abs(point.x - x);
    if (distance < nearestDistance) {
      nearest = index;
      nearestDistance = distance;
    }
  });

  return nearest;
}

function drawLine(ctx, coords, color, width = 2.5, dash = []) {
  if (!coords.length) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(coords[0].x, coords[0].y);
  for (let index = 1; index < coords.length; index += 1) {
    ctx.lineTo(coords[index].x, coords[index].y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

function monthLabel(month) {
  if (month <= 0) {
    return '0m';
  }
  if (month % 12 === 0) {
    return `${month / 12}y`;
  }
  if (month < 12) {
    return `${month}m`;
  }
  const years = Math.floor(month / 12);
  const remainder = month % 12;
  return remainder === 0 ? `${years}y` : `${years}y ${remainder}m`;
}

export function createPersonalLoanChart({ canvas, tooltip, status, formatMoney }) {
  if (!canvas) {
    return {
      setData: () => {},
      clear: () => {},
      destroy: () => {},
    };
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      setData: () => {},
      clear: () => {},
      destroy: () => {},
    };
  }

  const state = {
    points: [],
    hoverIndex: -1,
  };

  function hideTooltip() {
    if (!tooltip) {
      return;
    }
    tooltip.hidden = true;
    tooltip.textContent = '';
  }

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function clear() {
    const { width, height } = resizeCanvas(canvas, ctx);
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    gradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    setStatus('Run a calculation to view the balance chart.');
    hideTooltip();
  }

  function render() {
    const { width, height } = resizeCanvas(canvas, ctx);
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    gradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (!state.points.length) {
      setStatus('Run a calculation to view the balance chart.');
      hideTooltip();
      return;
    }

    const padding = { top: 16, right: 14, bottom: 32, left: 72 };
    const plotLeft = padding.left;
    const plotTop = padding.top;
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const maxBalance = Math.max(
      1,
      ...state.points.map((point) => Math.max(point.baselineBalance, point.extraBalance))
    );
    const maxMonth = Math.max(1, state.points[state.points.length - 1].month);

    const scaleX = (month) => plotLeft + (month / maxMonth) * plotWidth;
    const scaleY = (value) => plotTop + plotHeight - (value / maxBalance) * plotHeight;

    const yTicks = plotHeight <= 180 ? 3 : 4;
    for (let tick = 0; tick <= yTicks; tick += 1) {
      const value = (maxBalance / yTicks) * tick;
      const y = scaleY(value);

      ctx.beginPath();
      ctx.moveTo(plotLeft, y);
      ctx.lineTo(plotLeft + plotWidth, y);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
      ctx.font = '500 10px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatMoney(value), plotLeft - 10, y);
    }

    const xTicks = [0, Math.round(maxMonth * 0.25), Math.round(maxMonth * 0.5), Math.round(maxMonth * 0.75), maxMonth]
      .map((value) => clamp(value, 0, maxMonth))
      .filter((value, index, arr) => arr.indexOf(value) === index)
      .sort((a, b) => a - b);

    xTicks.forEach((tickMonth) => {
      const x = scaleX(tickMonth);
      ctx.beginPath();
      ctx.moveTo(x, plotTop);
      ctx.lineTo(x, plotTop + plotHeight);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = 'rgba(191, 219, 254, 0.84)';
      ctx.font = '500 11px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(monthLabel(tickMonth), x, plotTop + plotHeight + 8);
    });

    ctx.beginPath();
    ctx.moveTo(plotLeft, plotTop);
    ctx.lineTo(plotLeft, plotTop + plotHeight);
    ctx.lineTo(plotLeft + plotWidth, plotTop + plotHeight);
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    const baselineCoords = state.points.map((point) => ({
      x: scaleX(point.month),
      y: scaleY(point.baselineBalance),
    }));

    const extraCoords = state.points.map((point) => ({
      x: scaleX(point.month),
      y: scaleY(point.extraBalance),
    }));

    drawLine(ctx, baselineCoords, 'rgba(236, 72, 153, 0.86)', 2.1, [7, 5]);
    drawLine(ctx, extraCoords, 'rgba(34, 211, 238, 0.96)', 2.4);

    if (state.hoverIndex >= 0 && state.hoverIndex < state.points.length) {
      const point = state.points[state.hoverIndex];
      const x = scaleX(point.month);
      const yBase = scaleY(point.baselineBalance);
      const yExtra = scaleY(point.extraBalance);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, plotTop);
      ctx.lineTo(x, plotTop + plotHeight);
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.26)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = 'rgba(244, 114, 182, 1)';
      ctx.beginPath();
      ctx.arc(x, yBase, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(34, 211, 238, 1)';
      ctx.beginPath();
      ctx.arc(x, yExtra, 4, 0, Math.PI * 2);
      ctx.fill();

      if (tooltip) {
        tooltip.hidden = false;
        tooltip.innerHTML =
          `<p><span>Month</span><strong>${point.month}</strong></p>` +
          `<p><span>Baseline</span><strong>${formatMoney(point.baselineBalance)}</strong></p>` +
          `<p><span>With Extra</span><strong>${formatMoney(point.extraBalance)}</strong></p>`;

        const hostRect = canvas.parentElement?.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        if (hostRect) {
          const xOffset = x + canvasRect.left - hostRect.left;
          const tooltipWidth = tooltip.offsetWidth || 170;
          const clampedX = clamp(xOffset - tooltipWidth / 2, 8, hostRect.width - tooltipWidth - 8);
          const top = clamp(Math.min(yExtra, yBase) - 74, 8, Math.max(8, hostRect.height - 84));
          tooltip.style.left = `${clampedX}px`;
          tooltip.style.top = `${top}px`;
        }
      }
    } else {
      hideTooltip();
    }

    setStatus('Hover the chart to compare monthly balance paths.');
  }

  function onPointerMove(event) {
    if (!state.points.length) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const padding = { left: 72, right: 14 };
    const plotWidth = rect.width - padding.left - padding.right;
    const maxMonth = Math.max(1, state.points[state.points.length - 1].month);

    const coords = state.points.map((point) => ({
      x: padding.left + (point.month / maxMonth) * plotWidth,
    }));

    state.hoverIndex = findNearestPoint(coords, x);
    render();
  }

  function clearHover() {
    state.hoverIndex = -1;
    render();
  }

  const resizeObserver =
    typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => {
          render();
        })
      : null;

  if (resizeObserver && canvas.parentElement) {
    resizeObserver.observe(canvas.parentElement);
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerMove);
  canvas.addEventListener('pointerleave', clearHover);
  canvas.addEventListener('pointercancel', clearHover);

  clear();

  return {
    setData(points) {
      state.points = Array.isArray(points) ? points : [];
      state.hoverIndex = -1;
      render();
    },
    clear,
    destroy() {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerMove);
      canvas.removeEventListener('pointerleave', clearHover);
      canvas.removeEventListener('pointercancel', clearHover);
      resizeObserver?.disconnect();
      hideTooltip();
    },
  };
}
