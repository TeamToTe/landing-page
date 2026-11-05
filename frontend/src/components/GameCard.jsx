import React from 'react';
import { Play, Sparkles, Gamepad2, Flame } from 'lucide-react';

export default function GameCard({ game, onPlay }) {
  const coverImage = game.cover_image || '/images/post-game.png';

  return (
    <div className="group bg-white dark:bg-[#1A1C22] border border-orange-100/80 dark:border-zinc-800/80 rounded-[28px] overflow-hidden p-3.5 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Thumbnail with Play Hover Overlay */}
        <div className="relative w-full h-44 sm:h-48 rounded-[20px] overflow-hidden bg-orange-50 dark:bg-zinc-800 mb-4 group/thumb">
          <img
            src={coverImage}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/images/post-game.png';
            }}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/thumb:opacity-100 transition-all duration-200 flex items-center justify-center">
            <button
              onClick={() => onPlay(game)}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-sm shadow-lg shadow-orange-500/40 transform scale-90 group-hover/thumb:scale-100 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Chơi ngay</span>
            </button>
          </div>

          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>{game.plays_count || 0} lượt chơi</span>
          </div>
        </div>

        {/* Category Pill Tag */}
        <div className="px-1 mb-2">
          <span className="inline-block px-3 py-1 bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold text-xs rounded-full">
            {game.category || 'Arcade'}
          </span>
        </div>

        {/* Title */}
        <h3 className="px-1 text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors line-clamp-1 mb-2">
          {game.title}
        </h3>

        {/* Description */}
        <p className="px-1 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
          {game.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="px-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-medium">
          Dev: {game.developer || 'Team Tố Tề'}
        </span>
        <button
          onClick={() => onPlay(game)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FDEEE2] hover:bg-[#FCD8BE] dark:bg-orange-950/60 dark:hover:bg-orange-900/60 text-[#D8681A] dark:text-orange-300 rounded-xl text-xs font-bold transition-colors"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Vào game</span>
        </button>
      </div>
    </div>
  );
}
