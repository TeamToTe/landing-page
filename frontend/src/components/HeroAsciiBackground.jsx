import React, { useEffect, useRef } from 'react';

const ASCII_GLYPHS = [
  '0', '1', '{ }', '</>', '//', '+', '*', '✦', '✧',
  'λ', '∆', '∞', '>>', '[ ]', '01', '10', 'AI', '::', '#',
];

const ACCENT_COLORS_DARK = [
  '#FF8A3D', // Tote Orange
  '#FFB366', // Warm Amber
  '#FBBF24', // Gold Star
  '#38BDF8', // Cyan AI
  '#A78BFA', // Violet Qwen
  '#34D399', // Emerald GPT
  '#F472B6', // Coral Pink
];

const ACCENT_COLORS_LIGHT = [
  '#EA580C', // Rich Orange
  '#D97706', // Warm Amber
  '#0284C7', // Deep Sky
  '#7C3AED', // Violet
  '#059669', // Emerald
  '#DB2777', // Pink
  '#C2410C', // Rust Orange
];

export default function HeroAsciiBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let width = 0;
    let height = 0;
    let particles = [];

    const initParticles = (w, h) => {
      // Rich density on left & right wings so it is immediately noticeable
      const count = 88;
      const list = [];

      for (let i = 0; i < count; i++) {
        // Place 80% of particles on the left wing (2%..28%) and right wing (72%..98%)
        // so the empty sides of the screen are richly decorated while center text remains legible
        let rx;
        if (i % 5 !== 0) {
          rx = i % 2 === 0
            ? 0.02 + ((i * 37) % 100) / 100 * 0.26
            : 0.72 + ((i * 53) % 100) / 100 * 0.26;
        } else {
          rx = 0.04 + ((i * 71) % 100) / 100 * 0.92;
        }
        const ry = 0.04 + ((i * 29 + 13) % 100) / 100 * 0.92;

        const isNode = i % 2 === 0;
        const colorIdx = i % ACCENT_COLORS_DARK.length;

        list.push({
          x: rx * w,
          y: ry * h,
          vx: ((i % 2 === 0 ? 1 : -1) * (0.18 + (i % 5) * 0.06)),
          vy: (((i % 3 === 0 ? 1 : -1) * (0.15 + (i % 4) * 0.05))),
          glyph: ASCII_GLYPHS[i % ASCII_GLYPHS.length],
          size: isNode ? 13 + (i % 4) : 11 + (i % 3),
          baseAlpha: isNode ? 0.68 + (i % 3) * 0.1 : 0.45 + (i % 3) * 0.1,
          twinkleSpeed: 0.002 + (i % 6) * 0.0005,
          phase: i * 1.13,
          colorIdx,
          isNode,
        });
      }
      particles = list;
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(width, height);
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const LINK_DIST = 165;
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
    const MOUSE_DIST = 190;
    const MOUSE_DIST_SQ = MOUSE_DIST * MOUSE_DIST;

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      const dark = document.documentElement.classList.contains('dark');
      const palette = dark ? ACCENT_COLORS_DARK : ACCENT_COLORS_LIGHT;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 1. Update particle positions & draw neural constellation lines between nearby nodes
      ctx.lineWidth = 1.25;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Keep wing particles on their respective left/right wings so wings never become empty
        if (i % 5 !== 0) {
          if (i % 2 === 0) {
            const maxLeft = width * 0.30;
            if (p.x < 12) p.vx = Math.abs(p.vx);
            if (p.x > maxLeft) p.vx = -Math.abs(p.vx);
          } else {
            const minRight = width * 0.70;
            if (p.x < minRight) p.vx = Math.abs(p.vx);
            if (p.x > width - 12) p.vx = -Math.abs(p.vx);
          }
        } else {
          if (p.x < 12) p.x = width - 12;
          if (p.x > width - 12) p.x = 12;
        }

        if (p.y < 12) p.y = height - 12;
        if (p.y > height - 12) p.y = 12;

        if (!p.isNode) continue;

        // Connect nearby neural constellation nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (!p2.isNode) continue;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dSq = dx * dx + dy * dy;

          if (dSq < LINK_DIST_SQ) {
            const dist = Math.sqrt(dSq);
            const alpha = (1 - dist / LINK_DIST) * (dark ? 0.36 : 0.28);
            ctx.strokeStyle = dark
              ? `rgba(255, 138, 61, ${alpha})`
              : `rgba(234, 88, 12, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect nodes near mouse cursor
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mSq = mdx * mdx + mdy * mdy;
        if (mSq < MOUSE_DIST_SQ) {
          const mDist = Math.sqrt(mSq);
          const mAlpha = (1 - mDist / MOUSE_DIST) * (dark ? 0.55 : 0.45);
          ctx.strokeStyle = dark
            ? `rgba(255, 179, 102, ${mAlpha})`
            : `rgba(234, 88, 12, ${mAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }

      // 2. Draw floating ASCII glyphs & twinkling stardust
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const twinkle = 0.65 + 0.35 * Math.sin(time * p.twinkleSpeed + p.phase);
        let alpha = p.baseAlpha * twinkle;
        let color = palette[p.colorIdx];
        let fontSize = p.size;

        // Brighten and slightly enlarge glyphs when cursor passes nearby
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mSq = mdx * mdx + mdy * mdy;
        if (mSq < MOUSE_DIST_SQ) {
          const boost = 1 - mSq / MOUSE_DIST_SQ;
          alpha = Math.min(1.0, alpha + boost * 0.45);
          fontSize = Math.round(p.size + boost * 3);
          color = dark ? '#FFB366' : '#EA580C';
        }

        ctx.font = `bold ${fontSize}px "Courier New", Courier, monospace`;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillText(p.glyph, p.x, p.y);
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
