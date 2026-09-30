import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Folder, Clock } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ArticleCard } from '../components/common/ArticleCard';
import { AdSlot } from '../components/ads/AdSlot';
import { getArticlesByCategory, getCategories, getPublishedArticles } from '../services/db';
import type { Article, Category } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialData';

export const CategoryPage: React.FC = () => {
  const { categorySlug: slug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (slug) {
      // Find category details
      getCategories().then((cats) => {
        if (!mounted) return;
        const found = cats.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
        setCategory(found || null);
      });

      // Fetch articles
      getArticlesByCategory(slug).then((arts) => {
        if (!mounted) return;
        setArticles(arts);
        setLoading(false);
      });

      // Popular overall
      getPublishedArticles().then((all) => {
        if (!mounted) return;
        setPopularArticles(all.slice(0, 5));
      });
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  const catName = category?.name || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Kategori');
  const catDescription =
    category?.description ||
    `Kumpulan berita terkini, ulasan mendalam, dan liputan faktual kanal ${catName} di KABARIN AJA.`;

  const canonical = `https://kabarinaja.com/kategori/${slug}`;

  const displayedArticles = articles.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#0b4f8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Memuat berita kanal {catName}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEO
        title={`Berita ${catName} Terkini - KABARIN AJA`}
        description={catDescription}
        canonicalUrl={canonical}
      />

      {/* TOP AD */}
      <AdSlot placement="category-top" pageTarget="category" categoryId={category?.id} />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400">Kategori</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold uppercase">{catName}</span>
      </nav>

      {/* CATEGORY BANNER HEADER */}
      <div className="bg-white border-l-4 border-[#0b4f8a] border-y border-r border-gray-200 p-5 md:p-6 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0b4f8a] uppercase tracking-wider mb-1">
          <Folder className="w-4 h-4" />
          Kanal Berita
        </div>
        <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          {catName}
        </h1>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          {catDescription}
        </p>
        <div className="mt-3 text-xs text-gray-500">
          Menampilkan <span className="font-bold text-gray-800">{articles.length}</span> artikel terbitan redaksi
        </div>
      </div>

      {/* MAIN LAYOUT: ARTICLES (8 cols) vs SIDEBAR (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ARTICLES STREAM */}
        <div className="lg:col-span-8 space-y-6">
          {articles.length === 0 ? (
            <div className="bg-white border border-gray-200 p-8 text-center text-gray-500">
              <p className="text-base font-semibold mb-2">Belum ada artikel di kanal {catName}</p>
              <p className="text-xs text-gray-400 mb-4">
                Redaksi sedang menyusun liputan terverifikasi untuk kategori ini.
              </p>
              <Link
                to="/"
                className="inline-block bg-[#0b4f8a] text-white text-xs font-semibold px-4 py-2 hover:bg-[#083b68]"
              >
                Kembali ke Beranda
              </Link>
            </div>
          ) : (
            <>
              {/* Featured article of category if available */}
              {articles[0] && (
                <div className="mb-6">
                  <ArticleCard article={articles[0]} variant="hero" />
                </div>
              )}

              {/* MID AD */}
              <AdSlot placement="category-middle" pageTarget="category" categoryId={category?.id} />

              {/* Remaining articles in clean list */}
              <div className="bg-white border border-gray-200 p-4 md:p-6">
                <h3 className="font-serif-headline text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">
                  Daftar Berita {catName}
                </h3>
                <div className="divide-y divide-gray-200">
                  {displayedArticles.slice(1).map((art) => (
                    <ArticleCard key={art.id} article={art} variant="horizontal" />
                  ))}
                </div>

                {visibleCount < articles.length && (
                  <div className="pt-6 text-center border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="bg-white hover:bg-gray-50 text-[#0b4f8a] border border-[#0b4f8a] font-semibold text-xs px-6 py-2.5 transition-colors cursor-pointer"
                    >
                      Muat Berita {catName} Lainnya
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          <AdSlot placement="sidebar" pageTarget="category" categoryId={category?.id} />

          {/* ALL CATEGORIES QUICK NAVIGATION */}
          <div className="bg-white border border-gray-200 p-4">
            <h3 className="font-serif-headline text-sm font-bold uppercase tracking-wider text-gray-900 border-b-2 border-[#0b4f8a] pb-2 mb-3">
              Kanal Lainnya
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {INITIAL_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/kategori/${cat.slug}`}
                  className={`p-2 border transition-colors ${
                    cat.slug === slug
                      ? 'bg-[#0b4f8a] text-white border-[#0b4f8a] font-bold'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 font-medium'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* POPULAR NEWS */}
          <div className="bg-white border border-gray-200 p-4">
            <h3 className="font-serif-headline text-sm font-bold text-gray-900 border-b-2 border-[#0b4f8a] pb-2 mb-3">
              Berita Terpopuler
            </h3>
            <div className="divide-y divide-gray-100">
              {popularArticles.map((art, idx) => (
                <ArticleCard key={art.id} article={art} variant="compact" rank={idx + 1} />
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
