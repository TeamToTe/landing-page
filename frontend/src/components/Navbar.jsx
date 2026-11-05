import React from 'react';
import { Search, Moon, Sun, Plus, Gamepad2, BookOpen, Sparkles } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  onOpenSearch,
  onOpenCreate
}) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'blog', label: 'Blog' },
    { id: 'games', label: 'Games' },
    { id: 'about', label: 'About Us' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FBF9F7]/85 dark:bg-[#111215]/85 transition-colors duration-200 border-b border-orange-100/50 dark:border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Logo mark with web-icon pixel coffee */}
          <div className="relative flex items-center justify-center overflow-hidden rounded-xl shadow-sm border border-zinc-200/80 dark:border-zinc-700/80 transform group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
            <img
              src="/images/web-icon.png"
              alt="Team Tố Tề Logo"
              className="w-9 h-9 object-cover"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors">
            Team Tố Tề
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-6 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FDEEE2] text-[#E06716] shadow-sm dark:bg-orange-500/20 dark:text-orange-300'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-orange-50/50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Tìm kiếm"
            className="p-2.5 rounded-2xl text-zinc-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-orange-100 dark:hover:border-zinc-700"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Chuyển chế độ sáng/tối"
            className="p-2.5 rounded-2xl text-zinc-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-orange-100 dark:hover:border-zinc-700"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 stroke-[2.2]" />
            ) : (
              <Moon className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>

          {/* Post / Game Creator Button */}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-sm font-semibold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Thêm mới</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex justify-around px-2 py-2 border-t border-orange-100/60 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl ${
                isActive
                  ? 'bg-[#FDEEE2] text-[#E06716] dark:bg-orange-500/25 dark:text-orange-300'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
