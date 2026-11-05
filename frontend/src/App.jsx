import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Filter, RefreshCw, Gamepad2, FileText } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import GameCard from './components/GameCard';
import PostDetailModal from './components/PostDetailModal';
import MiniGamePlayer from './components/MiniGamePlayer';
import CreateModal from './components/CreateModal';
import SearchModal from './components/SearchModal';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import { fetchPosts, fetchGames, fetchStats } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('tote_theme') === 'dark';
  });

  // Data states
  const [posts, setPosts] = useState([]);
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const [selectedPost, setSelectedPost] = useState(null);
  const [playingGame, setPlayingGame] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Synchronize Dark Theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tote_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tote_theme', 'light');
    }
  }, [isDark]);

  // Load Initial Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [postsData, gamesData, statsData] = await Promise.all([
        fetchPosts(),
        fetchGames(),
        fetchStats()
      ]);
      setPosts(postsData || []);
      setGames(gamesData || []);
      setStats(statsData);
    } catch (err) {
      console.warn('API fetch warning, using seeded client fallback:', err);
      // Fallback fallback if backend isn't started yet
      setPosts([
        {
          id: 1,
          slug: 'exploring-small-language-models',
          title: 'Exploring Small Language Models',
          category: 'AI',
          excerpt: 'Tại sao các mô hình ngôn ngữ nhỏ (SLMs) như Phi-3, Gemma-2B đang trở thành tương lai của AI chạy cục bộ trên thiết bị cá nhân.',
          content: '# Exploring Small Language Models\n\nTrong năm 2026, ranh giới giữa LLMs và SLMs đang dần thu hẹp. Team Tố Tề đã dành 3 tháng thử nghiệm SLM trên phần cứng cận biên...',
          cover_image: '/images/post-ai.png',
          author: 'Minh & Team Tố Tề AI',
          created_at: '2026-10-20T14:30:00Z',
          views: 428
        },
        {
          id: 2,
          slug: 'building-a-2d-game-with-godot',
          title: 'Building a 2D Game with Godot',
          category: 'Game',
          excerpt: 'Hành trình từ bản phác thảo ý tưởng đến bản build WebGL hoàn chỉnh trên Godot 4.3 của nhóm phát triển Game Team Tố Tề.',
          content: '# Building a 2D Game with Godot 4.3\n\nGodot Engine đang chứng minh vị thế dẫn đầu trong mảng phát triển game độc lập...',
          cover_image: '/images/post-game.png',
          author: 'Hoàng & Game Dev Team',
          created_at: '2026-10-12T09:15:00Z',
          views: 612
        },
        {
          id: 3,
          slug: 'a-simple-rag-pipeline-with-qdrant',
          title: 'A Simple RAG Pipeline with Qdrant',
          category: 'Research',
          excerpt: 'Cách xây dựng hệ thống Retrieval-Augmented Generation nhẹ, hiệu năng cao và dễ bảo trì sử dụng Qdrant Vector Database.',
          content: '# A Simple RAG Pipeline with Qdrant\n\nRetrieval-Augmented Generation (RAG) là chìa khóa để giúp LLM trả lời chính xác...',
          cover_image: '/images/post-research.png',
          author: 'An & Research Team',
          created_at: '2026-10-05T16:45:00Z',
          views: 389
        }
      ]);
      setGames([
        {
          id: 1,
          slug: 'tote-bot-runner',
          title: 'Tố Tề Bot: Space Runner',
          description: 'Giúp chú robot Tố Tề vượt chướng ngại vật và thu thập năng lượng trên hành tinh bí ẩn.',
          category: 'Arcade',
          cover_image: '/images/post-game.png',
          plays_count: 1240,
          developer: 'Tố Tề Game Studio'
        },
        {
          id: 2,
          slug: 'cyber-puzzle-2048',
          title: 'Cyber Tố Tề 2048',
          description: 'Ghép các khối số để đạt mốc 2048 điểm với phong cách giao diện tương lai.',
          category: 'Puzzle',
          cover_image: '/images/post-research.png',
          plays_count: 890,
          developer: 'Tố Tề Indie Team'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['All', 'AI', 'Game', 'Research'];

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      <main className="flex-1">
        {/* VIEW: HOME */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Section matching idea.png */}
            <Hero
              isDark={isDark}
              onExplorePosts={() => {
                const el = document.getElementById('latest-posts-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreGames={() => {
                const el = document.getElementById('featured-games-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* LATEST POSTS SECTION (Exact Layout from idea.png) */}
            <section id="latest-posts-section" className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-normal">
                  Latest Posts
                </h2>
                <button
                  onClick={() => setActiveTab('blog')}
                  className="group flex items-center gap-1.5 text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* 3-Column Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, 3).map((post) => (
                  <PostCard
                    key={post.id || post.slug}
                    post={post}
                    onClick={(p) => setSelectedPost(p)}
                  />
                ))}
              </div>
            </section>

            {/* FEATURED GAMES SECTION */}
            <section id="featured-games-section" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Gamepad2 className="w-5 h-5 text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Tố Tề Game Arcade
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-normal">
                    Games của Team Tố Tề
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('games')}
                  className="group flex items-center gap-1.5 text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  <span>Tất cả Games</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.slice(0, 3).map((game) => (
                  <GameCard
                    key={game.id || game.slug}
                    game={game}
                    onPlay={(g) => setPlayingGame(g)}
                  />
                ))}
              </div>
            </section>

            {/* Quick About Teaser */}
            <AboutSection stats={stats} />
          </div>
        )}

        {/* VIEW: BLOG */}
        {activeTab === 'blog' && (
          <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Knowledge &amp; Engineering</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-3">
                Tất cả bài viết Blog
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
                Tổng hợp các bài viết nghiên cứu, hướng dẫn kỹ thuật và chia sẻ kiến thức từ Team Tố Tề.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-bold text-zinc-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Lọc theo:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-orange-300'
                  }`}
                >
                  {cat === 'All' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Chưa có bài viết nào thuộc chuyên mục này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id || post.slug}
                    post={post}
                    onClick={(p) => setSelectedPost(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: GAMES */}
        {activeTab === 'games' && (
          <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4" />
                <span>Play &amp; Experience</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-3">
                Khu trò chơi Team Tố Tề
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
                Trải nghiệm trực tiếp các tựa game 2D, Arcade và giải đố do thành viên Team Tố Tề tự tay lập trình.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard
                  key={game.id || game.slug}
                  game={game}
                  onPlay={(g) => setPlayingGame(g)}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ABOUT */}
        {activeTab === 'about' && (
          <div className="py-6">
            <AboutSection stats={stats} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Post Detail Reading Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Playable Mini Game Modal */}
      {playingGame && (
        <MiniGamePlayer
          game={playingGame}
          onClose={() => setPlayingGame(null)}
        />
      )}

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPost={(p) => setSelectedPost(p)}
        onSelectGame={(g) => setPlayingGame(g)}
      />

      {/* Create Post or Game Modal */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(type) => {
          loadData();
          if (type === 'post') setActiveTab('blog');
          if (type === 'game') setActiveTab('games');
        }}
      />
    </div>
  );
}
