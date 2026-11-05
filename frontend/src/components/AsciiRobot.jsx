import React, { useEffect, useRef, useState } from 'react';

export default function AsciiRobot() {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Synchronize Dark / Light mode dynamically
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/images/robot-clean-source.png';

    let animId;
    let frame = 0;

    img.onload = () => {
      setIsLoaded(true);

      // Grid resolution: 88 cols x 56 rows
      const cols = 88;
      const rows = 56;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = cols;
      offCanvas.height = rows;
      const offCtx = offCanvas.getContext('2d');
      offCtx.drawImage(img, 0, 0, cols, rows);

      const imgData = offCtx.getImageData(0, 0, cols, rows).data;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = 600;
      const displayH = 400;

      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      ctx.scale(dpr, dpr);

      const cellW = displayW / cols;
      const cellH = displayH / rows;

      // Extract ASCII points with explicit mathematical badge & ring closure
      const points = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4;
          const red = imgData[idx];
          const green = imgData[idx + 1];
          const blue = imgData[idx + 2];
          const lum = 0.299 * red + 0.587 * green + 0.114 * blue;

          // 1. CHECK BADGE 1: Top-Left Code </> (cols 10 to 24, rows 5 to 19)
          const b1_dx = Math.max(0, Math.abs(c - 17) - 3.5);
          const b1_dy = Math.max(0, Math.abs(r - 12) - 3.5);
          const inBadge1 = (b1_dx * b1_dx + b1_dy * b1_dy) <= 18;
          const isBadge1Border = inBadge1 && (b1_dx * b1_dx + b1_dy * b1_dy) >= 9.5;
          const isSlash = inBadge1 && (c + r === 29) && c >= 16 && c <= 18;
          const isLess = inBadge1 && (
            (c === 13 && r === 12) ||
            (c === 14 && (r === 11 || r === 13)) ||
            (c === 15 && (r === 10 || r === 14))
          );
          const isGreater = inBadge1 && (
            (c === 21 && r === 12) ||
            (c === 20 && (r === 11 || r === 13)) ||
            (c === 19 && (r === 10 || r === 14))
          );
          const isBadge1Icon = isSlash || isLess || isGreater;

          // 2. CHECK BADGE 2: Top-Right Gamepad (cols 64 to 78, rows 9 to 23)
          const b2_dx = Math.max(0, Math.abs(c - 71) - 3.5);
          const b2_dy = Math.max(0, Math.abs(r - 16) - 3.5);
          const inBadge2 = (b2_dx * b2_dx + b2_dy * b2_dy) <= 18;
          const isBadge2Border = inBadge2 && (b2_dx * b2_dx + b2_dy * b2_dy) >= 9.5;
          const isGamepadBody = inBadge2 && (c >= 67 && c <= 75 && r >= 14 && r <= 18);
          const isBadge2Icon = isGamepadBody;

          // 3. CHECK BADGE 3: Bottom-Right Document (cols 64 to 78, rows 31 to 45)
          const b3_dx = Math.max(0, Math.abs(c - 71) - 3.5);
          const b3_dy = Math.max(0, Math.abs(r - 38) - 3.5);
          const inBadge3 = (b3_dx * b3_dx + b3_dy * b3_dy) <= 18;
          const isBadge3Border = inBadge3 && (b3_dx * b3_dx + b3_dy * b3_dy) >= 9.5;
          const isDocLine = inBadge3 && (
            (r === 36 && c >= 68 && c <= 74) ||
            (r === 38 && c >= 68 && c <= 74) ||
            (r === 40 && c >= 68 && c <= 74)
          );
          const isBadge3Icon = isDocLine;

          // 4. CHECK CONTINUOUS ORBIT RING (Smooth Mathematical Ellipse)
          const c0 = 44.0;
          const r0 = 27.0;
          const semiA = 37.0;
          const semiB = 19.5;
          const norm_x = (c - c0) / semiA;
          const norm_y = (r - r0) / semiB;
          const ring_dist = Math.sqrt(norm_x * norm_x + norm_y * norm_y);
          const isOrbitRing = Math.abs(ring_dist - 1.0) <= 0.042;

          // Slope / tangent for mathematically continuous directional ASCII characters
          const phi = Math.atan2(norm_y, norm_x);
          const dx = -semiA * Math.sin(phi);
          const dy = semiB * Math.cos(phi);
          const slope = Math.abs(dx) < 1e-4 ? 999 : dy / dx;

          let ringChar = '-';
          if (Math.abs(slope) < 0.35) {
            ringChar = '-';
          } else if (Math.abs(slope) > 1.8) {
            ringChar = c < c0 ? '(' : ')';
          } else if (slope > 0) {
            ringChar = '\\';
          } else {
            ringChar = '/';
          }
          
          // Inside robot mask (includes head, headphones, body, and pedestal)
          const inRobotCenter = (c >= 28 && c <= 60 && r >= 11 && r <= 47);

          // 5. ROBOT FEATURES
          const isOrangeSample = (red - blue > 32) && (red > 150) && inRobotCenter;
          const isVisor = inRobotCenter && lum < 105 && !isOrangeSample;
          const isEye = isVisor && (
            (c >= 41 && c <= 43 && r >= 20 && r <= 23) ||
            (c >= 46 && c <= 48 && r >= 20 && r <= 23)
          );
          const isOutline = inRobotCenter && !isVisor && !isOrangeSample && lum < 210;
          const isRobotFill = inRobotCenter && !isVisor && !isOrangeSample && lum >= 210;

          // Pedestal shadow at bottom
          const isPedestal = (c >= 25 && c <= 63 && r >= 46 && r <= 52 && lum < 235);

          // Sparkles
          const isSparkle = (
            (c === 51 && r === 7) || (c === 52 && r === 7) ||
            (c === 13 && r === 24) ||
            (c === 57 && r === 17)
          );

          // Determine if cell is active
          let activeType = null;
          let char = ' ';

          if (isEye) {
            activeType = 'eye';
            char = '●';
          } else if (isVisor) {
            activeType = 'visor';
            const vRamp = ['@', '%', '#', '8'];
            char = vRamp[(r + c) % vRamp.length];
          } else if (isBadge1Icon) {
            activeType = 'orangeIcon';
            char = isSlash ? '/' : isLess ? '<' : '>';
          } else if (isBadge2Icon) {
            activeType = 'orangeIcon';
            char = (c === 69 && r === 16) || (c === 73 && r === 16) ? '+' : '#';
          } else if (isBadge3Icon) {
            activeType = 'orangeIcon';
            char = '=';
          } else if (isBadge1Border || isBadge2Border || isBadge3Border) {
            activeType = 'badgeBorder';
            char = '#';
          } else if (inBadge1 || inBadge2 || inBadge3) {
            activeType = 'badgeFill';
            char = '+';
          } else if (isOrangeSample) {
            activeType = 'orange';
            const oRamp = ['#', '*', '+', '=', 'O'];
            char = oRamp[(r * 2 + c) % oRamp.length];
          } else if (isOrbitRing && !inRobotCenter && !inBadge1 && !inBadge2 && !inBadge3) {
            activeType = 'orbit';
            char = ringChar;
          } else if (isOutline) {
            activeType = 'outline';
            const outRamp = ['@', '#', '*', '%'];
            char = outRamp[(r + c) % outRamp.length];
          } else if (isRobotFill) {
            activeType = 'robotFill';
            const fillRamp = ['+', ':', '.', 'o', '-'];
            char = fillRamp[(r + c) % fillRamp.length];
          } else if (isPedestal) {
            activeType = 'pedestal';
            char = '=';
          } else if (isSparkle) {
            activeType = 'sparkle';
            char = '✦';
          }

          if (activeType) {
            points.push({
              col: c,
              row: r,
              x: c * cellW,
              y: r * cellH,
              activeType,
              char,
            });
          }
        }
      }

      const render = () => {
        frame++;
        ctx.clearRect(0, 0, displayW, displayH);

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = `bold ${Math.round(cellH * 1.05)}px "Courier New", Courier, monospace`;

        const dark = document.documentElement.classList.contains('dark');

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          let drawChar = pt.char;
          let drawColor = '';

          if (dark) {
            // DARK MODE COLOR SCHEME
            switch (pt.activeType) {
              case 'eye':
                drawColor = '#4EF2B8'; // Glowing emerald eyes
                break;
              case 'visor':
                drawColor = '#1F222A'; // Visor screen
                break;
              case 'orangeIcon':
              case 'badgeBorder':
              case 'orange':
              case 'orbit':
              case 'pedestal':
                drawColor = '#FF9A42'; // Vibrant orange
                break;
              case 'badgeFill':
                drawColor = '#7C4A28'; // Subtle peach/amber glow inside badge
                break;
              case 'outline':
                drawColor = '#F1F5F9'; // Bright platinum outlines
                break;
              case 'robotFill':
                drawColor = '#94A3B8'; // Solid light grey body fill
                break;
              case 'sparkle':
                drawColor = '#FBBF24'; // Gold stars
                break;
              default:
                drawColor = '#CBD5E1';
            }
          } else {
            // LIGHT MODE COLOR SCHEME (Rich contrast & zero hollows)
            switch (pt.activeType) {
              case 'eye':
                drawColor = '#FFD54F'; // Shiny warm eyes
                break;
              case 'visor':
                drawColor = '#1E1610'; // Deep espresso screen
                break;
              case 'orangeIcon':
              case 'badgeBorder':
              case 'orange':
              case 'orbit':
              case 'pedestal':
                drawColor = '#EA580C'; // Deep rich saturated burnt orange
                break;
              case 'badgeFill':
                drawColor = '#D4A373'; // Warm peach fill: makes badges 100% closed & filled!
                break;
              case 'outline':
                drawColor = '#2B1D14'; // Dark charcoal brown outlines
                break;
              case 'robotFill':
                drawColor = '#8A6E59'; // Warm mocha body fill: solid 3D round volume
                break;
              case 'sparkle':
                drawColor = '#D97706'; // Amber stars
                break;
              default:
                drawColor = '#4A3B32';
            }
          }

          // Interactive shimmer on mouse hover
          if (isHovered) {
            const dx = pt.x - mousePos.x;
            const dy = pt.y - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 60) {
              const shimmerChars = ['/', '\\', '{', '}', '<', '>', '*', '#'];
              if ((frame + i) % 5 === 0) {
                drawChar = shimmerChars[(frame + i) % shimmerChars.length];
              }
              drawColor = dark ? '#FFB066' : '#C2410C';
            }
          }

          ctx.fillStyle = drawColor;
          ctx.fillText(drawChar, pt.x + cellW / 2, pt.y + cellH / 2);
        }

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);
    };

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isHovered, mousePos, isDark]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center select-none"
    >
      <div className="relative w-full max-w-[560px] aspect-[560/400] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain cursor-crosshair transform transition-transform duration-300 hover:scale-[1.02]"
        />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-orange-500 animate-pulse">
            Đang kết xuất ASCII Robot...
          </div>
        )}
      </div>
    </div>
  );
}
