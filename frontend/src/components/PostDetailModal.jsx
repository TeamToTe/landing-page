import React from 'react';
import { X, Calendar, User, Eye, Share2, Tag, BookOpen, Check } from 'lucide-react';
import { useState } from 'react';

export default function PostDetailModal({ post, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '20/10/2026';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic markdown-like rendering for headers, code blocks, lists and paragraphs
  const renderContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBuffer = [];

    const elements = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // end code block
          elements.push(
            <pre key={`code-${index}`} className="my-4 p-4 rounded-2xl bg-zinc-900 text-zinc-100 font-mono text-xs sm:text-sm overflow-x-auto border border-zinc-800">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-6 mb-3">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-5 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('* ')) {
        elements.push(
          <li key={index} className="ml-5 list-disc text-zinc-600 dark:text-zinc-300 my-1 leading-relaxed text-sm sm:text-base">
            {line.replace('* ', '')}
          </li>
        );
      } else if (line.trim() === '---') {
        elements.push(<hr key={index} className="my-6 border-zinc-200 dark:border-zinc-800" />);
      } else if (line.trim() !== '') {
        elements.push(
          <p key={index} className="text-zinc-600 dark:text-zinc-300 my-2 leading-relaxed text-sm sm:text-base">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#1A1C22] rounded-[32px] overflow-hidden shadow-2xl border border-orange-100 dark:border-zinc-800 flex flex-col">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-orange-100 dark:border-zinc-800 bg-white/90 dark:bg-[#1A1C22]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#FDEEE2] dark:bg-orange-950/60 text-[#D8681A] dark:text-orange-300 font-semibold text-xs rounded-full">
              {post.category || 'Tech'}
            </span>
            <span className="text-xs text-zinc-400">• Team Tố Tề Blog</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Sao chép liên kết"
              className="p-2 rounded-xl text-zinc-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6">
          {/* Article Header */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pb-6 border-b border-zinc-100 dark:border-zinc-800/80 mb-6">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-zinc-700 dark:text-zinc-200">{post.author || 'Team Tố Tề'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0} lượt đọc</span>
            </div>
          </div>

          {/* Cover image if available */}
          {post.cover_image && (
            <div className="mb-6 rounded-2xl overflow-hidden bg-orange-50 dark:bg-zinc-800 max-h-72">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/post-ai.png';
                }}
              />
            </div>
          )}

          {/* Post Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg italic text-zinc-700 dark:text-zinc-300 bg-orange-50/50 dark:bg-zinc-800/40 p-4 rounded-2xl border-l-4 border-orange-400 mb-6">
              "{post.excerpt}"
            </p>
          )}

          {/* Render Markdown Content */}
          <div className="article-body">
            {renderContent(post.content)}
          </div>
        </div>
      </div>
    </div>
  );
}
