import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="mt-20 border-t border-orange-100 dark:border-zinc-800 bg-[#FBF9F7] dark:bg-[#111215] transition-colors py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="overflow-hidden rounded-lg shadow-sm border border-zinc-200/70 dark:border-zinc-700/70 shrink-0">
            <img
              src="/images/web-icon.png"
              alt="Team Tố Tề Logo"
              className="w-8 h-8 object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">Team Tố Tề</span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Nền tảng chia sẻ tri thức công nghệ &amp; trò chơi sáng tạo</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <button onClick={() => onNavigate('home')} className="hover:text-orange-500 transition-colors">Trang chủ</button>
          <button onClick={() => onNavigate('blog')} className="hover:text-orange-500 transition-colors">Bài viết</button>
          <button onClick={() => onNavigate('games')} className="hover:text-orange-500 transition-colors">Games</button>
          <button onClick={() => onNavigate('about')} className="hover:text-orange-500 transition-colors">Về chúng tôi</button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1">
          <span>© {new Date().getFullYear()} Team Tố Tề. Phát triển với</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </footer>
  );
}
