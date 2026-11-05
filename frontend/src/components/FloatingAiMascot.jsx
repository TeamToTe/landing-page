import React, { useState } from 'react';

// Perfectly balanced ASCII art for AI mascots
const MASCOTS = {
  // DeepSeek Whale: Scaled down to be balanced and cute
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🐳',
    lines: [
      "      @@@@@   @     ",
      "    @@@@@@@@  @@@ @@",
      "   @@@@@@@@@@ @@@@@@",
      "  @@@@@@@@@@@@@@@@@ ",
      "  @@.....@@@@ @@@@  ",
      "  @@@......@@@.@@@  ",
      "   @@@......@@@@@   ",
      "    @@@@...@@.@@    ",
      "     @@@@@@@@@@@    ",
      "     ..@@@@@@@      "
    ],
    lightColor: '#2563EB', // Vibrant royal blue
    darkColor: '#60A5FA',  // Glowing ice blue
    glowColor: 'rgba(37, 99, 235, 0.25)',
  },

  // Claude: Scaled up to match DeepSeek with 4 EVEN, SYMMETRICAL LEGS
  claude: {
    id: 'claude',
    name: 'Claude',
    icon: '👾',
    lines: [
      "        @@@@@@@@@@@@@@        ",
      "        @@  @@@@@@  @@        ",
      "    @@@@@@  @@@@@@  @@@@@@    ",
      "    @@@@@@@@@@@@@@@@@@@@@@    ",
      "        @@@@@@@@@@@@@@        ",
      "        @@@@@@@@@@@@@@        ",
      "        @@  @@  @@  @@        ",
      "        @@  @@  @@  @@        ",
      "        @@  @@  @@  @@        "
    ],
    lightColor: '#D97706', // Warm amber / terracotta
    darkColor: '#FB923C',  // Radiant coral
    glowColor: 'rgba(217, 119, 6, 0.25)',
  }
};

export default function FloatingAiMascot({ side = 'left', isDark, disableFloat = true }) {
  const [isHovered, setIsHovered] = useState(false);
  const [wobble, setWobble] = useState(false);

  const mascotKey = side === 'left' ? 'deepseek' : 'claude';
  const mascot = MASCOTS[mascotKey];

  const handleClick = () => {
    setWobble(true);
    setTimeout(() => setWobble(false), 800);
  };

  const activeColor = isDark ? mascot.darkColor : mascot.lightColor;
  const floatClass = disableFloat
    ? ''
    : side === 'left'
    ? 'animate-bounce-slow'
    : 'animate-bounce-slow-delayed';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`${mascot.name} AI Mascot (${side === 'left' ? 'DeepSeek' : 'Claude'})`}
      className={`cursor-pointer select-none flex flex-col items-center justify-center transition-all duration-300 ${floatClass} ${
        wobble ? 'scale-110 rotate-3' : isHovered ? 'scale-105' : ''
      }`}
      style={{
        filter: isHovered ? `drop-shadow(0 0 16px ${mascot.glowColor})` : 'none',
      }}
    >
      {/* Crisp Solid ASCII Matrix Art */}
      <pre
        className="font-mono text-center text-[9px] sm:text-[10px] md:text-[11px] leading-[1.12] font-black tracking-[0.08em] sm:tracking-[0.1em] transition-colors duration-200"
        style={{ color: activeColor }}
      >
        {mascot.lines.join('\n')}
      </pre>

      {/* Elegant minimalist label */}
      <span
        className="mt-1.5 text-[9.5px] font-mono tracking-widest font-bold uppercase opacity-70 hover:opacity-100 transition-opacity"
        style={{ color: activeColor }}
      >
        {mascot.icon} {mascot.name}
      </span>
    </div>
  );
}
