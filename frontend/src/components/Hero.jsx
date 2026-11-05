import React from 'react';
import { Gamepad2, FileText, ArrowRight, Sparkles } from 'lucide-react';
import AsciiRobot from './AsciiRobot';
import FloatingAiMascot from './FloatingAiMascot';

export default function Hero({ isDark, onExplorePosts, onExploreGames }) {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 px-4 sm:px-6">
      {/* Background ambient warm glows matching idea.png */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[560px] bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-rose-100/20 dark:from-orange-950/20 dark:via-zinc-900/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* CENTERPIECE: The Round ASCII Robot with Concentric Elliptical Orbiting AI Mascots */}
        <div className="relative w-full max-w-[560px] aspect-[560/400] mx-auto mb-8 select-none flex items-center justify-center">
          {/* Mathematical SVG Ellipse Orbit Track (Centered precisely on Robot) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            aria-hidden="true"
          >
            <ellipse
              cx="50%"
              cy="50%"
              style={{ rx: 'var(--orbit-rx)', ry: 'var(--orbit-ry)' }}
              className="stroke-orange-400/35 dark:stroke-orange-500/30 orbit-svg-track"
              fill="none"
              strokeWidth="1.5"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Main Round Tố Tề ASCII Robot */}
          <div className="relative z-10 w-full h-full pointer-events-auto">
            <AsciiRobot />
          </div>

          {/* ORBITING MASCOT 1: DeepSeek Whale (Starts Left, orbits in 3D ellipse) */}
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{ width: 0, height: 0 }}
          >
            <div className="animate-orbit-deepseek pointer-events-auto">
              <div style={{ transform: 'translate(-50%, -50%)' }}>
                <FloatingAiMascot side="left" isDark={isDark} />
              </div>
            </div>
          </div>

          {/* ORBITING MASCOT 2: Claude Alien (Starts Right, orbits in 3D ellipse) */}
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{ width: 0, height: 0 }}
          >
            <div className="animate-orbit-claude pointer-events-auto">
              <div style={{ transform: 'translate(-50%, -50%)' }}>
                <FloatingAiMascot side="right" isDark={isDark} />
              </div>
            </div>
          </div>
        </div>

        {/* HERO TITLE & SUBTITLE */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-normal leading-[1.35] sm:leading-[1.4] mb-6 sm:mb-8">
            Khám phá Tri thức <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">AI</span> &amp; Thế giới <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Game</span> Độc đáo
          </h1>

          <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg mb-8 sm:mb-10 leading-loose max-w-2xl mx-auto px-4">
            Nơi Team Tố Tề chia sẻ những nghiên cứu công nghệ mới nhất, ghi chép hành trình phát triển và các tựa game thú vị bạn có thể chơi ngay trên trình duyệt.
          </p>

          {/* Call to actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1">
            <button
              onClick={onExplorePosts}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Đọc bài viết mới nhất</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreGames}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-semibold border border-orange-200/80 dark:border-zinc-700 hover:bg-orange-50/50 dark:hover:bg-zinc-700/60 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Gamepad2 className="w-4 h-4 text-orange-500" />
              <span>Trải nghiệm Games</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
