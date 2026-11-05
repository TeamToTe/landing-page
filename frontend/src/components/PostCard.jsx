import React from 'react';
import { Calendar, Eye, ArrowUpRight } from 'lucide-react';

export default function PostCard({ post, onClick }) {
  // Format date like "Oct 20, 2026"
  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    : 'Oct 20, 2026';

  // Fallback cover image
  const coverImage = post.cover_image || '/images/post-ai.png';

  return (
    <div
      onClick={() => onClick(post)}
      className="group bg-white dark:bg-[#1A1C22] border border-orange-100/80 dark:border-zinc-800/80 rounded-[28px] overflow-hidden p-3.5 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        {/* Cover Thumbnail */}
        <div className="relative w-full h-44 sm:h-48 rounded-[20px] overflow-hidden bg-orange-50 dark:bg-zinc-800 mb-4">
          <img
            src={coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              // fallback if local path issue
              e.currentTarget.src = '/images/post-ai.png';
            }}
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Category Pill Tag */}
        <div className="px-1 mb-2.5">
          <span className="inline-block px-3 py-1 bg-[#FDEEE2] dark:bg-orange-950/60 text-[#D8681A] dark:text-orange-300 font-semibold text-xs rounded-full">
            {post.category || 'Tech'}
          </span>
        </div>

        {/* Title */}
        <h3 className="px-1 text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>

        {/* Excerpt preview if available */}
        {post.excerpt && (
          <p className="px-1 text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Card Footer: Date and Views */}
      <div className="px-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 stroke-[2]" />
          <span>{formattedDate}</span>
        </div>
        {post.views !== undefined && (
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 stroke-[2]" />
            <span>{post.views}</span>
          </div>
        )}
      </div>
    </div>
  );
}
