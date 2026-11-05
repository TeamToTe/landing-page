import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Gamepad2, ArrowRight } from 'lucide-react';
import { fetchPosts, fetchGames } from '../services/api';

export default function SearchModal({ isOpen, onClose, onSelectPost, onSelectGame }) {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setPosts([]);
        setGames([]);
        return;
      }
      setLoading(true);
      try {
        const [postsRes, gamesRes] = await Promise.all([
          fetchPosts({ q: query }),
          fetchGames({ q: query })
        ]);
        setPosts(postsRes || []);
        setGames(gamesRes || []);
      } catch (e) {
        // silent error in search
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A1C22] rounded-[28px] overflow-hidden shadow-2xl border border-orange-100 dark:border-zinc-800 flex flex-col">
        {/* Search input line */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-orange-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-orange-500 stroke-[2.2]" />
          <input
            type="text"
            autoFocus
            placeholder="Tìm kiếm bài viết, chủ đề AI, Game, bài nghiên cứu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base sm:text-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results view */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="text-center py-8 text-zinc-400 text-sm">
              Đang tìm kiếm...
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="text-center py-8 text-zinc-400 text-sm">
              Nhập từ khóa như <span className="text-orange-500 font-semibold cursor-pointer" onClick={() => setQuery('AI')}>"AI"</span>, <span className="text-orange-500 font-semibold cursor-pointer" onClick={() => setQuery('Godot')}>"Godot"</span>, hoặc <span className="text-orange-500 font-semibold cursor-pointer" onClick={() => setQuery('Runner')}>"Runner"</span>
            </div>
          )}

          {!loading && query.trim() && posts.length === 0 && games.length === 0 && (
            <div className="text-center py-8 text-zinc-400 text-sm">
              Không tìm thấy kết quả nào cho "{query}"
            </div>
          )}

          {/* Posts results */}
          {posts.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-2 block mb-2">
                Bài viết Blog ({posts.length})
              </span>
              <div className="space-y-1">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPost(p);
                      onClose();
                    }}
                    className="p-3 rounded-2xl hover:bg-orange-50/80 dark:hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-1">
                          {p.title}
                        </h4>
                        <span className="text-xs text-zinc-400">Chuyên mục: {p.category}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Games results */}
          {games.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-2 block mb-2">
                Games ({games.length})
              </span>
              <div className="space-y-1">
                {games.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      onSelectGame(g);
                      onClose();
                    }}
                    className="p-3 rounded-2xl hover:bg-amber-50/80 dark:hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 line-clamp-1">
                          {g.title}
                        </h4>
                        <span className="text-xs text-zinc-400">Thể loại: {g.category}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
