const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function fetchPosts(params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.category && params.category !== 'All') query.append('category', params.category);

  const res = await fetch(`${API_BASE_URL}/api/posts?${query.toString()}`);
  if (!res.ok) throw new Error('Không thể tải danh sách bài viết');
  return res.json();
}

export async function fetchPost(idOrSlug) {
  const res = await fetch(`${API_BASE_URL}/api/posts/${idOrSlug}`);
  if (!res.ok) throw new Error('Không tìm thấy bài viết');
  return res.json();
}

export async function createPost(postData) {
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error('Không thể đăng bài viết');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/api/posts/categories`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchGames(params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.category && params.category !== 'All') query.append('category', params.category);

  const res = await fetch(`${API_BASE_URL}/api/games?${query.toString()}`);
  if (!res.ok) throw new Error('Không thể tải danh sách games');
  return res.json();
}

export async function fetchGame(idOrSlug) {
  const res = await fetch(`${API_BASE_URL}/api/games/${idOrSlug}`);
  if (!res.ok) throw new Error('Không tìm thấy game');
  return res.json();
}

export async function recordGamePlay(idOrSlug) {
  const res = await fetch(`${API_BASE_URL}/api/games/${idOrSlug}/play`, { method: 'POST' });
  if (!res.ok) return null;
  return res.json();
}

export async function createGame(gameData) {
  const res = await fetch(`${API_BASE_URL}/api/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData),
  });
  if (!res.ok) throw new Error('Không thể thêm game');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE_URL}/api/stats`);
  if (!res.ok) return { posts_count: 0, games_count: 0, total_views: 0, total_plays: 0 };
  return res.json();
}
