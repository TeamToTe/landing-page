import React from 'react';
import { Gamepad2, FileText, ArrowRight } from 'lucide-react';
import AsciiRobot from './AsciiRobot';
import HeroAsciiBackground from './HeroAsciiBackground';

// 4-Pointed Sparkle Star matching idea.png
function SparkleStar({ className = '', size = 22 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`fill-amber-500 text-amber-500 pointer-events-none ${className}`}
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

export default function Hero({ isDark, onExplorePosts, onExploreGames }) {
  return (
    <section className="relative overflow-hidden pt-4 pb-16 px-4 sm:px-6">
      {/* Floating ASCII Code Dust & Neural Constellation Background */}
      <HeroAsciiBackground />

      {/* Background ambient warm glows matching idea.png */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] h-[580px] bg-gradient-to-tr from-orange-200/45 via-amber-100/35 to-rose-100/25 dark:from-orange-950/25 dark:via-zinc-900/20 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* CENTERPIECE: Full-Orbit Interactive Canvas + 3 Floating Badges */}
        <div className="relative w-full max-w-[820px] md:max-w-[920px] aspect-[940/520] mx-auto mb-6 select-none flex items-center justify-center">
          
          {/* 1. Large Outer Orbit Ellipse & Connecting Arcs (Matching idea.png in 940x520 space) */}
          <svg
            viewBox="0 0 940 520"
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            aria-hidden="true"
          >
            {/* Main Wide Dashed Elliptical Orbit */}
            <g transform="rotate(-4 470 264)">
              <ellipse
                cx="470"
                cy="264"
                rx="388"
                ry="182"
                className="stroke-orange-400/55 dark:stroke-orange-400/40"
                fill="none"
                strokeWidth="2"
                strokeDasharray="8 9"
              />
            </g>

            {/* Subtle Secondary Inner Orbit Arcs from idea.png */}
            <path
              d="M 255 190 Q 258 247 308 267"
              className="stroke-orange-400/50 dark:stroke-orange-400/35"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="308" cy="267" r="3.5" className="fill-orange-400/70 dark:fill-orange-400/50" />

            <path
              d="M 695 250 Q 698 307 635 331"
              className="stroke-orange-400/50 dark:stroke-orange-400/35"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="635" cy="331" r="3.5" className="fill-orange-400/70 dark:fill-orange-400/50" />
          </svg>

          {/* 2. Sparkle Stars (4-point stars placed along the wide orbit) */}
          {/* Top-Right Sparkle */}
          <div className="absolute top-[10%] right-[25%] z-10 animate-pulse pointer-events-none">
            <SparkleStar size={24} className="fill-orange-400 dark:fill-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
          </div>

          {/* Mid-Left Sparkle */}
          <div className="absolute top-[49%] left-[13%] z-10 animate-pulse [animation-delay:700ms] pointer-events-none">
            <SparkleStar size={26} className="fill-orange-400 dark:fill-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
          </div>

          {/* Soft Warm Dot near Mid-Left */}
          <div className="absolute top-[60%] left-[19%] w-3.5 h-3.5 rounded-full bg-orange-300/75 dark:bg-orange-400/40 pointer-events-none" />

          {/* Bottom-Left Sparkle */}
          <div className="absolute bottom-[14%] left-[14%] z-10 animate-pulse [animation-delay:1200ms] pointer-events-none">
            <SparkleStar size={20} className="fill-amber-500 dark:fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          </div>

          {/* 3. FLOATING BADGE 1: Code </> (Top-Left on the wide orbit) */}
          <div
            onClick={onExplorePosts}
            className="absolute top-[10%] left-[14%] sm:left-[17%] z-20 cursor-pointer group"
          >
            <div className="relative -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 ease-out animate-bounce-slow">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FFF8F2]/95 dark:bg-zinc-900/90 border-2 border-orange-400/90 dark:border-orange-500/80 shadow-lg shadow-orange-500/15 backdrop-blur-md flex items-center justify-center p-3 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/30 group-hover:border-orange-500">
                <svg
                  viewBox="0 0 40 40"
                  className="w-8 h-8 sm:w-11 sm:h-11 text-orange-500 dark:text-orange-400 transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 13L6 20L13 27" />
                  <path d="M17 29L23 11" />
                  <path d="M27 13L34 20L27 27" />
                </svg>
              </div>
            </div>
          </div>

          {/* 4. FLOATING BADGE 2: Gamepad (Top-Right on the wide orbit) */}
          <div
            onClick={onExploreGames}
            className="absolute top-[15%] right-[11%] sm:right-[14%] z-20 cursor-pointer group"
          >
            <div className="relative rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 ease-out animate-bounce-slow-delayed">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FFF8F2]/95 dark:bg-zinc-900/90 border-2 border-orange-400/90 dark:border-orange-500/80 shadow-lg shadow-orange-500/15 backdrop-blur-md flex items-center justify-center p-3 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/30 group-hover:border-orange-500">
                <svg
                  viewBox="0 0 48 36"
                  className="w-9 h-9 sm:w-11 sm:h-11 text-orange-500 dark:text-orange-400 transition-transform duration-300 group-hover:scale-105"
                  fill="currentColor"
                >
                  {/* Retro Controller Silhouette */}
                  <path d="M10 4C5 4 1 8 1 14C1 20 3.5 28 6 32C7.5 34.5 11 35 13.5 32.5L18.5 27.5C19.5 26.5 21 26 22.5 26H25.5C27 26 28.5 26.5 29.5 27.5L34.5 32.5C37 35 40.5 34.5 42 32C44.5 28 47 20 47 14C47 8 43 4 38 4H10Z" />
                  {/* White D-Pad */}
                  <path d="M13 10V18M9 14H17" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
                  {/* White Action Plus Button */}
                  <path d="M36 10V18M32 14H40" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* 5. FLOATING BADGE 3: Menu / 3-Stripes (Bottom-Right on the wide orbit) */}
          <div
            onClick={onExplorePosts}
            className="absolute bottom-[15%] right-[13%] sm:right-[16%] z-20 cursor-pointer group"
          >
            <div className="relative rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 ease-out animate-bounce-slow">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FFF8F2]/95 dark:bg-zinc-900/90 border-2 border-orange-400/90 dark:border-orange-500/80 shadow-lg shadow-orange-500/15 backdrop-blur-md flex items-center justify-center p-3 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/30 group-hover:border-orange-500">
                <svg
                  viewBox="0 0 40 40"
                  className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 dark:text-orange-400 transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                >
                  <line x1="8" y1="12" x2="32" y2="12" />
                  <line x1="8" y1="20" x2="32" y2="20" />
                  <line x1="8" y1="28" x2="32" y2="28" />
                </svg>
              </div>
            </div>
          </div>

          {/* 6. FULL-ORBIT INTERACTIVE CANVAS: Spans entire 940x520 orbit area so the cursor circle never clips */}
          <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto">
            <AsciiRobot isDark={isDark} />
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
