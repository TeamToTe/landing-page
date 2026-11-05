import React from 'react';
import { Users, Sparkles, Terminal, Rocket, Heart } from 'lucide-react';

export default function AboutSection({ stats }) {
  const teamMembers = [
    {
      name: "Tố Tề AI Lab",
      role: "AI & Small Language Models",
      desc: "Nghiên cứu kiến trúc SLM, mô hình hóa suy luận cục bộ và RAG pipelines.",
      avatar: "🤖",
    },
    {
      name: "Tố Tề Game Studio",
      role: "Game Development & Engine",
      desc: "Thiết kế game 2D/3D bằng Godot 4 và phát triển Canvas WebGL Arcade.",
      avatar: "🎮",
    },
    {
      name: "Tố Tề Core Infra",
      role: "Backend & Systems",
      desc: "Xây dựng hạ tầng microservices tốc độ cao, API và cơ chế đóng gói container.",
      avatar: "⚡",
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Team Introduction Card */}
      <div className="bg-gradient-to-br from-white via-orange-50/40 to-white dark:from-[#1A1C22] dark:via-zinc-900 dark:to-[#1A1C22] border border-orange-100 dark:border-zinc-800 rounded-[32px] p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <div className="p-3 bg-orange-100 dark:bg-orange-950/60 rounded-2xl text-orange-600 dark:text-orange-400 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-3">
            Về Team Tố Tề
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
            Team Tố Tề là tập hợp những kỹ sư đam mê trí tuệ nhân tạo, thiết kế game độc lập và sáng tạo sản phẩm công nghệ. Mục tiêu của chúng tôi là mang lại những bài viết chất lượng cao và các tựa game đầy niềm vui cho cộng đồng.
          </p>
        </div>

        {/* Dynamic Metrics */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-orange-100/60 dark:border-zinc-700/60 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-orange-500 mb-1">
                {stats.posts_count || 3}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Bài viết
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-orange-100/60 dark:border-zinc-700/60 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-amber-500 mb-1">
                {stats.games_count || 3}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Tựa Game
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-orange-100/60 dark:border-zinc-700/60 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-rose-500 mb-1">
                {stats.total_views || '1.4k'}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Lượt đọc
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-orange-100/60 dark:border-zinc-700/60 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-500 mb-1">
                {stats.total_plays || '4.2k'}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Lượt chơi
              </span>
            </div>
          </div>
        )}

        {/* Pillars / Subteams */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-800/40 border border-orange-100/60 dark:border-zinc-800 flex flex-col justify-between hover:border-orange-200 transition-colors"
            >
              <div>
                <span className="text-3xl mb-3 block">{m.avatar}</span>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-1">
                  {m.name}
                </h3>
                <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold block mb-2">
                  {m.role}
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
