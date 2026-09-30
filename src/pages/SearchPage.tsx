import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ArticleCard } from '../components/common/ArticleCard';
import { searchArticles, getCategories } from '../services/db';
import type { Article, Category } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(queryParam);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  useEffect(() => {
    setInputQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([searchArticles(queryParam), getCategories()]).then(([results, cats]) => {
      if (!mounted) return;
      setArticles(results);
      setCategories(cats);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [queryParam]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(inputQuery.trim() ? { q: inputQuery.trim() } : {});
  };

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory === 'all') return true;
    return (
      art.categoryId.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      art.categoryName.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <SEO
        title={queryParam ? `Hasil Pencarian: "${queryParam}" - KABARIN AJA` : 'Pencarian Berita - KABARIN AJA'}
        description={`Hasil pencarian berita dan topik "${queryParam}" di portal berita KABARIN AJA.`}
        canonicalUrl={`https://kabarinaja.com/search?q=${encodeURIComponent(queryParam)}`}
      />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Pencarian Berita</span>
      </nav>

      {/* SEARCH BOX & FILTERS */}
      <div className="bg-white border border-gray-200 p-5 md:p-6 shadow-2xs">
        <h1 className="font-serif-headline text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Pencarian Berita KABARIN AJA
        </h1>

        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Masukkan kata kunci, topik nasional, atau nama tokoh..."
              className="w-full bg-[#f8fafc] border border-gray-300 rounded-xs pl-4 pr-10 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0b4f8a] focus:bg-white transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="bg-[#0b4f8a] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#083b68] transition-colors shrink-0"
          >
            Cari Berita
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100 text-xs">
          <span className="font-semibold text-gray-500 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter Kanal:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xs shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#0b4f8a] text-white font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium'
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1 rounded-xs shrink-0 transition-colors ${
                selectedCategory === c.slug
                  ? 'bg-[#0b4f8a] text-white font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH RESULTS LIST */}
      <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-2xs">
        <div className="border-b-2 border-[#0b4f8a] pb-2 mb-4 flex items-center justify-between">
          <h2 className="font-serif-headline text-base sm:text-lg font-bold text-gray-900">
            {queryParam ? (
              <>
                Hasil Pencarian untuk: <span className="text-[#0b4f8a]">"{queryParam}"</span>
              </>
            ) : (
              'Semua Berita Publikasi'
            )}
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Ditemukan <strong className="text-gray-800">{filteredArticles.length}</strong> artikel
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-[#0b4f8a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500">Mencari artikel berita...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-sm font-semibold mb-1">Tidak ada berita yang cocok dengan kata kunci</p>
            <p className="text-xs text-gray-400">
              Coba gunakan istilah yang lebih umum, periksa ejaan, atau pilih filter kanal berita lainnya.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {displayedArticles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="horizontal" />
            ))}
          </div>
        )}

        {visibleCount < filteredArticles.length && (
          <div className="pt-6 text-center border-t border-gray-100">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="bg-white hover:bg-gray-50 text-[#0b4f8a] border border-[#0b4f8a] font-semibold text-xs px-6 py-2.5 transition-colors cursor-pointer"
            >
              Muat Berita Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
