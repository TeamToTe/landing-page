import React, { useEffect, useRef, useState } from 'react';

// Cute mini ASCII representations of the 5 AI brands from assets/
const AI_MASCOTS = [
  {
    id: 'antigravity',
    name: 'Antigravity',
    cx: 312,
    cy: 56,
    phase: 0.0,
    lines: [
      '      .ooo.      ',
      '     oOOOOOo     ',
      '    oOOOOOOOo    ',
      '   oOOOOOOOOOo   ',
      '  oOOO.   .OOOo  ',
      ' oOO.       .OOo ',
      'oO.           .Oo',
    ],
    getColor: (r, c, dark) => {
      if (r <= 1) return dark ? '#FB923C' : '#EA580C'; // Sunset orange peak
      if (r === 2) {
        if (c < 7) return dark ? '#34D399' : '#059669'; // Emerald left
        if (c > 9) return dark ? '#F472B6' : '#DB2777'; // Coral pink right
        return dark ? '#38BDF8' : '#0284C7';
      }
      return dark ? '#60A5FA' : '#2563EB'; // Electric blue arch & legs
    },
    labelDark: '#60A5FA',
    labelLight: '#2563EB',
  },
  {
    id: 'gpt',
    name: 'ChatGPT',
    cx: 638,
    cy: 60,
    phase: 1.3,
    lines: [
      '    .o###o.    ',
      '  o###. .###o  ',
      ' ###. .o. .### ',
      ' ###  o o  ### ',
      ' ###. .o. .### ',
      '  o###. .###o  ',
      '    .o###o.    ',
    ],
    getColor: (_r, _c, dark) => (dark ? '#34D399' : '#059669'),
    labelDark: '#34D399',
    labelLight: '#059669',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    cx: 152,
    cy: 215,
    phase: 2.5,
    lines: [
      '         _   ## ##',
      '    .#####\\   ### ',
      '   ########\\  ##  ',
      '  #####o####\\##   ',
      '  ###...########  ',
      '   ###....####\\   ',
      '    .#######.     ',
    ],
    getColor: (_r, _c, dark, ch) => {
      if (ch === 'o') return dark ? '#FFFFFF' : '#1E3A8A';
      if (ch === '.') return dark ? '#93C5FD' : '#60A5FA';
      return dark ? '#60A5FA' : '#2563EB';
    },
    labelDark: '#60A5FA',
    labelLight: '#2563EB',
  },
  {
    id: 'claude',
    name: 'Claude',
    cx: 186,
    cy: 382,
    phase: 3.8,
    lines: [
      '  ############  ',
      '  ##  ####  ##  ',
      '################',
      '################',
      '  ############  ',
      '  ## ##  ## ##  ',
      '  ## ##  ## ##  ',
    ],
    getColor: (_r, _c, dark) => (dark ? '#FB923C' : '#D97706'),
    labelDark: '#FB923C',
    labelLight: '#D97706',
  },
  {
    id: 'qwen',
    name: 'Qwen',
    cx: 778,
    cy: 262,
    phase: 5.1,
    lines: [
      '     /###\\     ',
      '  ###########  ',
      '   \\##\\ /##/   ',
      '    \\##v##/    ',
      '   /##/ \\##\\   ',
      '  ###########  ',
      '     \\###/     ',
    ],
    getColor: (_r, _c, dark) => (dark ? '#A78BFA' : '#7C3AED'),
    labelDark: '#A78BFA',
    labelLight: '#7C3AED',
  },
];

export default function AsciiRobot() {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use refs for mouse tracking so mousemove NEVER triggers React re-renders
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const isInsideOrbitRef = useRef(false);
  const clickWaveRef = useRef({ active: false, x: 0, y: 0, startTime: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/images/robot-only-clean.png?v=3';

    let animId;
    let frame = 0;

    // Full centerpiece canvas dimensions (matches Hero SVG viewBox 940x520 so the 52px circle NEVER clips!)
    const displayW = 940;
    const displayH = 520;

    // Robot region centered inside the 940x520 orbit space
    const robotW = 500;
    const robotH = 380;
    const offsetX = (displayW - robotW) / 2; // 220
    const offsetY = (displayH - robotH) / 2 + 6; // 76

    const handleWindowMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const mx = (e.clientX - rect.left) * (displayW / rect.width);
      const my = (e.clientY - rect.top) * (displayH / rect.height);

      // Check if cursor is within the elliptical orbit zone (rx=415, ry=208 around center 470, 260)
      const normX = (mx - 470) / 415;
      const normY = (my - 260) / 208;
      const inside = normX * normX + normY * normY <= 1.0;

      isInsideOrbitRef.current = inside;
      if (inside) {
        mousePosRef.current.x = mx;
        mousePosRef.current.y = my;
      } else {
        mousePosRef.current.x = -1000;
        mousePosRef.current.y = -1000;
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });

    img.onload = () => {
      setIsLoaded(true);

      const cols = 68;
      const rows = 46;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = cols;
      offCanvas.height = rows;
      const offCtx = offCanvas.getContext('2d');
      offCtx.imageSmoothingEnabled = false;
      offCtx.drawImage(img, 0, 0, cols, rows);

      const imgData = offCtx.getImageData(0, 0, cols, rows).data;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      ctx.scale(dpr, dpr);

      const cellW = robotW / cols;
      const cellH = robotH / rows;
      const baseFontPx = Math.round(cellH * 1.08);
      const CIRCLE_RADIUS = 52;
      const CIRCLE_RADIUS_SQ = CIRCLE_RADIUS * CIRCLE_RADIUS;

      const points = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4;
          const red = imgData[idx];
          const green = imgData[idx + 1];
          const blue = imgData[idx + 2];
          const alpha = imgData[idx + 3];

          const isLaptopTopEdge = r === 21 && c >= 6 && c <= 16;
          if (alpha < 50 && !isLaptopTopEdge) continue;

          let activeType = 'highlight';
          let baseChar = 'o';

          if (alpha >= 50 && alpha < 200 && !isLaptopTopEdge) {
            activeType = 'shadow';
            baseChar = '=';
          } else {
            const lum = 0.299 * red + 0.587 * green + 0.114 * blue;
            const isOrange = red > 150 && green > 60 && blue < 145 && red - blue > 35;
            const isLeftEye = r >= 14 && r <= 17 && c >= 28 && c <= 30;
            const isRightEye = r >= 15 && r <= 18 && c >= 39 && c <= 41;
            const isEye = isLeftEye || isRightEye;
            const isVisor =
              r >= 8 &&
              r <= 22 &&
              c >= 25 &&
              c <= 47 &&
              !(r === 22 && c <= 34) &&
              !isEye &&
              (lum < 160 || (r >= 13 && r <= 19 && c >= 27 && c <= 43)) &&
              !isOrange;

            if (isLaptopTopEdge) {
              activeType = 'outline';
              baseChar = '@';
            } else if (isEye) {
              activeType = 'eye';
              baseChar = '●';
            } else if (isVisor) {
              activeType = 'visor';
              baseChar = '#';
            } else if (isOrange) {
              if (r >= 24 && r <= 33 && c >= 14 && c <= 26) {
                activeType = 'laptopLogo';
                baseChar = '/';
              } else {
                activeType = 'orange';
                const oRamp = ['8', '#', 'O', '*'];
                baseChar = oRamp[(r + c) % oRamp.length];
              }
            } else if (lum < 165 || (r === 22 && c >= 6 && c <= 16)) {
              activeType = 'outline';
              const outRamp = ['@', '#', '@', '*'];
              baseChar = outRamp[(r + c) % outRamp.length];
            } else if (lum > 228) {
              activeType = 'highlight';
              const hiRamp = ['O', 'o', '+', '*'];
              baseChar = hiRamp[(r + c) % hiRamp.length];
            } else {
              activeType = 'body';
              const bodyRamp = ['+', ':', 'o', '.'];
              baseChar = bodyRamp[(r + c) % bodyRamp.length];
            }
          }

          let darkColor = '#CBD5E1';
          let lightColor = '#C28E68';

          switch (activeType) {
            case 'eye':
              darkColor = '#38BDF8';
              lightColor = '#FFFBEB';
              break;
            case 'visor':
              darkColor = '#475569';
              lightColor = '#6D5444';
              break;
            case 'laptopLogo':
            case 'orange':
              darkColor = '#FF8A3D';
              lightColor = '#EA580C';
              break;
            case 'shadow':
              darkColor = 'rgba(251, 146, 60, 0.6)';
              lightColor = 'rgba(234, 88, 12, 0.55)';
              break;
            case 'outline':
              darkColor = '#64748B';
              lightColor = '#1C1917';
              break;
            case 'highlight':
              darkColor = '#F8FAFC';
              lightColor = '#8C7E72';
              break;
            default:
              darkColor = '#CBD5E1';
              lightColor = '#C28E68';
          }

          const px = offsetX + c * cellW;
          const py = offsetY + r * cellH;

          points.push({
            x: px,
            y: py,
            cx: px + cellW / 2,
            cy: py + cellH / 2,
            activeType,
            baseChar,
            darkColor,
            lightColor,
          });
        }
      }

      // Precompute mini ASCII AI mascot points
      const mCellW = 4.6;
      const mCellH = 5.6;
      const mascotGroups = AI_MASCOTS.map((m) => {
        const mRows = m.lines.length;
        const mCols = m.lines[0].length;
        const startX = m.cx - (mCols * mCellW) / 2;
        const startY = m.cy - (mRows * mCellH) / 2;
        const cells = [];

        for (let r = 0; r < mRows; r++) {
          const line = m.lines[r];
          for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch === ' ') continue;
            cells.push({
              baseX: startX + c * mCellW + mCellW / 2,
              baseY: startY + r * mCellH + mCellH / 2,
              char: ch,
              darkColor: m.getColor(r, c, true, ch),
              lightColor: m.getColor(r, c, false, ch),
            });
          }
        }

        return {
          ...m,
          cells,
          labelY: startY + mRows * mCellH + 9,
        };
      });

      // Pre-bake static cell backgrounds for Dark & Light mode once
      const createBgLayer = (forDark) => {
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = displayW * dpr;
        bgCanvas.height = displayH * dpr;
        const bgCtx = bgCanvas.getContext('2d');
        bgCtx.scale(dpr, dpr);

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          if (pt.activeType === 'visor' || pt.activeType === 'eye') {
            bgCtx.fillStyle = forDark ? 'rgba(17, 21, 30, 0.92)' : 'rgba(52, 36, 26, 0.94)';
            bgCtx.fillRect(pt.x - 0.4, pt.y - 0.4, cellW + 0.8, cellH + 0.8);
          } else if (!forDark && (pt.activeType === 'highlight' || pt.activeType === 'body')) {
            bgCtx.fillStyle =
              pt.activeType === 'highlight'
                ? 'rgba(255, 255, 255, 0.88)'
                : 'rgba(254, 236, 218, 0.85)';
            bgCtx.fillRect(pt.x - 0.3, pt.y - 0.3, cellW + 0.6, cellH + 0.6);
          }
        }
        return bgCanvas;
      };

      const darkBgLayer = createBgLayer(true);
      const lightBgLayer = createBgLayer(false);
      const shimmerChars = ['/', '\\', '{', '}', '<', '>', '*', '#'];

      const render = (time) => {
        frame++;
        ctx.clearRect(0, 0, displayW, displayH);

        const dark = document.documentElement.classList.contains('dark');
        const hovered = isInsideOrbitRef.current;
        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;

        // Draw pre-baked background layer in 1 drawImage call
        ctx.drawImage(dark ? darkBgLayer : lightBgLayer, 0, 0, displayW, displayH);

        // Draw circular orange lens anywhere inside the entire orbit region
        if (hovered && mx >= 0 && my >= 0) {
          ctx.beginPath();
          ctx.arc(mx, my, CIRCLE_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = dark ? 'rgba(255, 138, 61, 0.11)' : 'rgba(249, 115, 22, 0.11)';
          ctx.fill();
          ctx.strokeStyle = dark ? 'rgba(255, 138, 61, 0.6)' : 'rgba(234, 88, 12, 0.55)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const blinkCycle = frame % 280;
        const isBlinking = blinkCycle > 268 && blinkCycle < 278;

        const clickWave = clickWaveRef.current;
        let waveRadius = -1;
        if (clickWave.active) {
          if (clickWave.startTime === 0) {
            clickWave.startTime = time;
          }
          const elapsed = Math.max(0, (time - clickWave.startTime) / 1000);
          const duration = 1.65;
          if (elapsed < duration) {
            const waveProgress = elapsed / duration;
            // Expand all the way across the entire 940x520 orbit & robot (up to 920px radius)
            waveRadius = Math.max(1, waveProgress * 920);

            // Draw smooth expanding ripple ring across the orbit space
            const ringAlpha = Math.max(0, (1 - waveProgress) * 0.55);
            ctx.beginPath();
            ctx.arc(clickWave.x, clickWave.y, waveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = dark
              ? `rgba(255, 138, 61, ${ringAlpha})`
              : `rgba(234, 88, 12, ${ringAlpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            clickWave.active = false;
          }
        }

        const hoverOrangeColor = dark ? '#FF8A3D' : '#EA580C';
        const hoverBrightOrange = dark ? '#FFB366' : '#F97316';

        // 1. Render Floating Cute Mini ASCII AI Mascots around the Robot
        ctx.font = 'bold 7.5px "Courier New", Courier, monospace';
        for (let mIdx = 0; mIdx < mascotGroups.length; mIdx++) {
          const mg = mascotGroups[mIdx];
          const bobX = Math.cos(frame * 0.028 + mg.phase) * 2.5;
          const bobY = Math.sin(frame * 0.042 + mg.phase) * 5.0;

          for (let cIdx = 0; cIdx < mg.cells.length; cIdx++) {
            const cell = mg.cells[cIdx];
            const px = cell.baseX + bobX;
            const py = cell.baseY + bobY;
            let cChar = cell.char;
            let cColor = dark ? cell.darkColor : cell.lightColor;

            if (hovered) {
              const dx = px - mx;
              const dy = py - my;
              const distSq = dx * dx + dy * dy;
              if (distSq < CIRCLE_RADIUS_SQ) {
                cColor = distSq < CIRCLE_RADIUS_SQ * 0.4 ? hoverBrightOrange : hoverOrangeColor;
                if (((frame + cIdx) & 7) === 0) {
                  cChar = shimmerChars[(frame + cIdx) & 7];
                }
              }
            }

            if (waveRadius > 0) {
              const distWave = Math.hypot(px - clickWave.x, py - clickWave.y);
              const diff = Math.abs(distWave - waveRadius);
              if (diff < 34) {
                cColor = diff < 16 ? hoverBrightOrange : hoverOrangeColor;
                cChar = diff < 16 ? '*' : '+';
              }
            }

            ctx.fillStyle = cColor;
            ctx.fillText(cChar, px, py);
          }

          // Subtle mini label below each AI mascot
          ctx.save();
          ctx.font = 'bold 8px "Courier New", Courier, monospace';
          ctx.globalAlpha = 0.78;
          ctx.fillStyle = dark ? mg.labelDark : mg.labelLight;
          ctx.fillText(mg.name, mg.cx + bobX, mg.labelY + bobY);
          ctx.restore();
        }

        // 2. Render Main Center ASCII Robot
        ctx.font = `bold ${baseFontPx}px "Courier New", Courier, monospace`;

        let eyeDx = 0;
        let eyeDy = 0;
        if (hovered) {
          eyeDx = Math.max(-1.5, Math.min(1.5, (mx - displayW * 0.5) * 0.006));
          eyeDy = Math.max(-1.0, Math.min(1.0, (my - displayH * 0.42) * 0.006));
        }

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          let drawChar = pt.baseChar;
          let drawColor = dark ? pt.darkColor : pt.lightColor;
          let posX = pt.cx;
          let posY = pt.cy;

          if (pt.activeType === 'eye') {
            posX += eyeDx;
            posY += eyeDy;
            if (isBlinking) {
              drawChar = '^';
            }
          }

          // Turn characters inside the circular cursor area into warm orange shades
          if (hovered) {
            const dx = posX - mx;
            const dy = posY - my;
            const distSq = dx * dx + dy * dy;

            if (distSq < CIRCLE_RADIUS_SQ) {
              drawColor = distSq < CIRCLE_RADIUS_SQ * 0.4 ? hoverBrightOrange : hoverOrangeColor;
              if (pt.activeType !== 'eye' && ((frame + i) & 7) === 0) {
                drawChar = shimmerChars[(frame + i) & 7];
              }
            }
          }

          if (waveRadius > 0) {
            const distWave = Math.hypot(posX - clickWave.x, posY - clickWave.y);
            const diff = Math.abs(distWave - waveRadius);
            if (diff < 34) {
              drawColor = diff < 16 ? hoverBrightOrange : hoverOrangeColor;
              if (pt.activeType !== 'eye') {
                drawChar = diff < 16 ? '*' : '+';
              }
            }
          }

          ctx.fillStyle = drawColor;
          ctx.fillText(drawChar, posX, posY);
        }

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);
    };

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !isInsideOrbitRef.current) return;
    const rect = canvas.getBoundingClientRect();
    clickWaveRef.current = {
      active: true,
      x: (e.clientX - rect.left) * (940 / rect.width),
      y: (e.clientY - rect.top) * (520 / rect.height),
      startTime: 0,
    };
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-full flex items-center justify-center select-none cursor-crosshair"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-orange-500 animate-pulse">
          Đang kết xuất ASCII Robot...
        </div>
      )}
    </div>
  );
}
