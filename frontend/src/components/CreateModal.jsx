import React, { useState } from 'react';
import { X, FileText, Gamepad2, Plus, Sparkles, Loader2 } from 'lucide-react';
import { createPost, createGame } from '../services/api';

export default function CreateModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('post'); // 'post' or 'game'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Post form fields
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('AI');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [postCover, setPostCover] = useState('/images/post-ai.png');

  // Game form fields
  const [gameTitle, setGameTitle] = useState('');
  const [gameCategory, setGameCategory] = useState('Arcade');
  const [gameDescription, setGameDescription] = useState('');
  const [gameDetails, setGameDetails] = useState('');
  const [gameCover, setGameCover] = useState('/images/post-game.png');

  if (!isOpen) return null;

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postExcerpt.trim() || !postContent.trim()) {
      setError('Vui lòng điền đầy đủ tiêu đề, tóm tắt và nội dung bài viết!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await createPost({
        title: postTitle,
        category: postCategory,
        excerpt: postExcerpt,
        content: postContent,
        author: postAuthor || 'Thành viên Team Tố Tề',
        cover_image: postCover,
      });
      onSuccess('post');
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGame = async (e) => {
    e.preventDefault();
    if (!gameTitle.trim() || !gameDescription.trim()) {
      setError('Vui lòng điền đầy đủ tên game và mô tả ngắn!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await createGame({
        title: gameTitle,
        category: gameCategory,
        description: gameDescription,
        details: gameDetails || 'Điều khiển bằng bàn phím hoặc cảm ứng.',
        cover_image: gameCover,
        play_url: 'embedded-runner',
        developer: 'Team Tố Tề Games',
      });
      onSuccess('game');
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi khi thêm game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#1A1C22] rounded-[32px] overflow-hidden shadow-2xl border border-orange-100 dark:border-zinc-800 flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-orange-100 dark:border-zinc-800 bg-[#FBF9F7] dark:bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-white text-lg">Đóng góp nội dung mới</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => { setActiveTab('post'); setError(''); }}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'post'
                ? 'bg-[#FDEEE2] text-[#D8681A] shadow-sm dark:bg-orange-500/20 dark:text-orange-300'
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Đăng bài Blog</span>
          </button>

          <button
            onClick={() => { setActiveTab('game'); setError(''); }}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'game'
                ? 'bg-[#FDEEE2] text-[#D8681A] shadow-sm dark:bg-orange-500/20 dark:text-orange-300'
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Thêm Game mới</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {activeTab === 'post' ? (
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giới thiệu kiến trúc Agentic AI mới..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Chuyên mục
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="AI">AI (Artificial Intelligence)</option>
                    <option value="Game">Game Development</option>
                    <option value="Research">Research &amp; Papers</option>
                    <option value="Engineering">Engineering &amp; Backend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tác giả
                  </label>
                  <input
                    type="text"
                    placeholder="Tên tác giả hoặc nhóm"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Hình ảnh thumbnail
                </label>
                <select
                  value={postCover}
                  onChange={(e) => setPostCover(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="/images/post-ai.png">Mẫu AI (Desert Dunes Warm Sun)</option>
                  <option value="/images/post-game.png">Mẫu Game (Pixel Forest &amp; Flag)</option>
                  <option value="/images/post-research.png">Mẫu Research (Isometric 3D Blocks)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tóm tắt ngắn (Excerpt) *
                </label>
                <textarea
                  rows={2}
                  placeholder="Một hoặc hai câu tóm tắt nội dung chính để hiển thị ngoài trang chủ..."
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nội dung chi tiết (Markdown) *
                </label>
                <textarea
                  rows={6}
                  placeholder="Viết nội dung bài viết bằng Markdown (hỗ trợ # Tiêu đề, ```code, * danh sách)..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                <span>Xuất bản bài viết</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitGame} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tên game *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cyber Tank Battle 2D..."
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Thể loại
                  </label>
                  <select
                    value={gameCategory}
                    onChange={(e) => setGameCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Arcade">Arcade / Runner</option>
                    <option value="Puzzle">Puzzle / Giải đố</option>
                    <option value="RPG">RPG / Nhập vai</option>
                    <option value="Action">Hành động / Bắn súng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Hình ảnh cover
                  </label>
                  <select
                    value={gameCover}
                    onChange={(e) => setGameCover(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="/images/post-game.png">Mẫu Game Pixel Platformer</option>
                    <option value="/images/post-ai.png">Mẫu Sci-fi Desert</option>
                    <option value="/images/post-research.png">Mẫu Geometric Cyber</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Mô tả ngắn *
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả gameplay, cốt truyện hoặc phong cách của trò chơi..."
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Hướng dẫn điều khiển
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phím Space để nhảy, các phím WASD để di chuyển..."
                  value={gameDetails}
                  onChange={(e) => setGameDetails(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                <span>Đăng tải Game</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
