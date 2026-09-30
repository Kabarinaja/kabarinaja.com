import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../../types';
import { Clock, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'secondary' | 'horizontal' | 'compact' | 'grid';
  rank?: number;
  showExcerpt?: boolean;
}

export const formatDateIndonesian = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'horizontal',
  rank,
  showExcerpt = true,
}) => {
  const categorySlug = article.categoryName
    ? article.categoryName.toLowerCase().replace(/\s+/g, '-')
    : 'nasional';

  // 1. HERO VARIANT (Main Headline)
  if (variant === 'hero') {
    return (
      <article className="group bg-white border border-gray-200 overflow-hidden">
        <Link to={`/berita/${article.slug}`} className="block relative overflow-hidden bg-gray-100 aspect-video md:aspect-[21/9]">
          <img
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="eager"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-[#0b4f8a] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 shadow-xs">
              {article.categoryName}
            </span>
          </div>
        </Link>
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#0b4f8a]" />
              {formatDateIndonesian(article.publishedAt)}
            </span>
            <span>•</span>
            <Link
              to={`/penulis/${article.authorSlug}`}
              className="flex items-center gap-1 hover:text-[#0b4f8a] font-medium"
            >
              <User className="w-3.5 h-3.5" />
              {article.authorName}
            </Link>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif-headline text-[#111827] group-hover:text-[#0b4f8a] transition-colors leading-tight mb-3">
            <Link to={`/berita/${article.slug}`}>{article.title}</Link>
          </h2>
          {showExcerpt && (
            <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
            <span>{article.readingTime || 3} menit baca</span>
            <Link
              to={`/berita/${article.slug}`}
              className="font-semibold text-[#0b4f8a] hover:text-[#e65100] transition-colors"
            >
              Baca Selengkapnya &rarr;
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // 2. SECONDARY HEADLINE VARIANT
  if (variant === 'secondary') {
    return (
      <article className="group bg-white border border-gray-200 overflow-hidden flex flex-col h-full">
        <Link to={`/berita/${article.slug}`} className="block relative overflow-hidden bg-gray-100 aspect-[16/10]">
          <img
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <span className="absolute top-2 left-2 bg-[#0b4f8a] text-white text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5">
            {article.categoryName}
          </span>
        </Link>
        <div className="p-3.5 flex flex-col flex-grow">
          <div className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-2">
            <span>{formatDateIndonesian(article.publishedAt)}</span>
          </div>
          <h3 className="font-serif-headline font-bold text-base md:text-lg text-gray-900 group-hover:text-[#0b4f8a] transition-colors leading-snug line-clamp-2 mb-2">
            <Link to={`/berita/${article.slug}`}>{article.title}</Link>
          </h3>
          {showExcerpt && (
            <p className="text-xs text-gray-600 line-clamp-2 mt-auto">
              {article.excerpt}
            </p>
          )}
        </div>
      </article>
    );
  }

  // 3. COMPACT / RANKED VARIANT (for sidebar or trending lists)
  if (variant === 'compact') {
    return (
      <article className="group py-2.5 border-b border-gray-100 last:border-b-0 flex items-start gap-3">
        {rank !== undefined && (
          <span className="text-2xl font-extrabold text-[#0b4f8a]/30 group-hover:text-[#0b4f8a] transition-colors w-6 flex-shrink-0 text-center font-serif-headline">
            {rank}
          </span>
        )}
        <div className="flex-grow">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
            <Link
              to={`/kategori/${categorySlug}`}
              className="font-medium text-[#0b4f8a] hover:underline"
            >
              {article.categoryName}
            </Link>
            <span>•</span>
            <span>{formatDateIndonesian(article.publishedAt).split(',')[0]}</span>
          </div>
          <h4 className="font-serif-headline font-bold text-sm text-gray-900 group-hover:text-[#0b4f8a] transition-colors leading-snug line-clamp-2">
            <Link to={`/berita/${article.slug}`}>{article.title}</Link>
          </h4>
        </div>
      </article>
    );
  }

  // 4. GRID CARD VARIANT
  if (variant === 'grid') {
    return (
      <article className="group bg-white border border-gray-200 overflow-hidden flex flex-col">
        <Link to={`/berita/${article.slug}`} className="block relative overflow-hidden bg-gray-100 aspect-[16/10]">
          <img
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <span className="absolute top-2 left-2 bg-[#0b4f8a] text-white text-[11px] font-semibold px-2 py-0.5 uppercase tracking-wide">
            {article.categoryName}
          </span>
        </Link>
        <div className="p-3 flex flex-col flex-grow">
          <span className="text-[11px] text-gray-400 mb-1">
            {formatDateIndonesian(article.publishedAt)}
          </span>
          <h3 className="font-serif-headline font-bold text-sm md:text-base text-gray-900 group-hover:text-[#0b4f8a] transition-colors leading-snug line-clamp-2 mb-2">
            <Link to={`/berita/${article.slug}`}>{article.title}</Link>
          </h3>
          {showExcerpt && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-auto">
              {article.excerpt}
            </p>
          )}
        </div>
      </article>
    );
  }

  // 5. DEFAULT: HORIZONTAL LIST ITEM (Standard news portal stream like Kompas / BBC / Detik)
  return (
    <article className="group py-3.5 border-b border-gray-200 last:border-b-0 flex gap-3 sm:gap-4 items-center">
      <Link
        to={`/berita/${article.slug}`}
        className="w-28 sm:w-40 md:w-48 aspect-[16/10] flex-shrink-0 relative overflow-hidden bg-gray-100 border border-gray-100"
      >
        <img
          src={article.featuredImage}
          alt={article.featuredImageAlt || article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </Link>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
          <Link
            to={`/kategori/${categorySlug}`}
            className="font-semibold text-[#0b4f8a] hover:underline uppercase tracking-wide"
          >
            {article.categoryName}
          </Link>
          <span>•</span>
          <span>{formatDateIndonesian(article.publishedAt)}</span>
        </div>
        <h3 className="font-serif-headline font-bold text-sm sm:text-base md:text-lg text-gray-900 group-hover:text-[#0b4f8a] transition-colors leading-snug line-clamp-2 mb-1">
          <Link to={`/berita/${article.slug}`}>{article.title}</Link>
        </h3>
        {showExcerpt && (
          <p className="hidden sm:block text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </div>
    </article>
  );
};
