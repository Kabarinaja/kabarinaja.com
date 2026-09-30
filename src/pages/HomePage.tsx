import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Award, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ArticleCard } from '../components/common/ArticleCard';
import { AdSlot } from '../components/ads/AdSlot';
import { getPublishedArticles, getPrimaryAuthorProfile } from '../services/db';
import type { Article, Author } from '../types';

export const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getPublishedArticles(), getPrimaryAuthorProfile()]).then(([arts, authData]) => {
      if (!mounted) return;
      setArticles(arts);
      setAuthor(authData);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Filter headlines and category groupings
  const headlineArticle = articles.find((a) => a.isHeadline) || articles[0];
  const secondaryArticles = articles
    .filter((a) => a.id !== headlineArticle?.id)
    .slice(0, 2);

  // Latest news stream (terkini)
  const latestNews = [...articles].slice(0, 8);

  // Most popular / most viewed
  const popularArticles = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  // Editor's picks
  const editorPicks = articles.filter((a) => a.isEditorPick).slice(0, 4);

  // Category specific groups
  const getCategoryArticles = (catSlug: string) => {
    return articles.filter(
      (a) =>
        a.categoryId.toLowerCase().includes(catSlug.toLowerCase()) ||
        a.categoryName.toLowerCase() === catSlug.toLowerCase()
    );
  };

  const nasionalArticles = getCategoryArticles('nasional');
  const daerahArticles = getCategoryArticles('daerah');
  const politikArticles = getCategoryArticles('politik');
  const ekonomiArticles = getCategoryArticles('ekonomi');
  const teknologiArticles = getCategoryArticles('teknologi');
  const bisnisArticles = getCategoryArticles('bisnis');
  const bolaArticles = getCategoryArticles('bola');
  const hiburanArticles = getCategoryArticles('hiburan');

  // JSON-LD for news media organization & website
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'KABARIN AJA',
    url: 'https://kabarinaja.com',
    logo: 'https://cdn.phototourl.com/member/2026-09-30-8cf912e0-15fa-419a-8730-cf9bd68d8b65.png',
    slogan: 'KABAR JUJUR UNTUK INDONESIA',
    email: 'kabarterbaru.id@gmail.com',
    telephone: '+6282379474173',
  };

  if (loading && articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#0b4f8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-gray-500">Memuat kabar terkini Indonesia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <SEO
        title="KABARIN AJA - Kabar Jujur untuk Indonesia"
        description="Portal Berita Terpercaya dan Jujur untuk Indonesia. Menyajikan berita nasional, daerah, politik, ekonomi, bisnis, teknologi, dan terkini secara berimbang dan akurat."
        canonicalUrl="https://kabarinaja.com/"
        jsonLd={jsonLd}
      />

      {/* TOP AD SLOT */}
      <AdSlot placement="homepage-top" pageTarget="homepage" />

      {/* 1. BREAKING NEWS / TRENDING STRIP */}
      {articles.length > 0 && (
        <div className="bg-white border-y border-gray-200 py-2 px-3 flex items-center gap-3 text-xs">
          <span className="bg-[#e65100] text-white px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            Topik Utama
          </span>
          <div className="overflow-hidden whitespace-nowrap text-gray-700 font-medium truncate">
            <Link
              to={`/berita/${articles[0].slug}`}
              className="hover:text-[#0b4f8a] transition-colors"
            >
              {articles[0].title}
            </Link>
          </div>
        </div>
      )}

      {/* 2. AREA BERITA UTAMA / HERO EDITORIAL SECTION */}
      {headlineArticle && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main big headline (7 cols) */}
          <div className="lg:col-span-7">
            <ArticleCard article={headlineArticle} variant="hero" />
          </div>

          {/* Secondary headlines (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="border-b-2 border-[#0b4f8a] pb-1 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a]">
                Sorotan Utama Hari Ini
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {secondaryArticles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="secondary" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MID AD SLOT */}
      <AdSlot placement="homepage-middle" pageTarget="homepage" />

      {/* 3. MAIN PORTAL BODY: 2 COLUMNS (CONTENT 8 COLS vs SIDEBAR 4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: News Stream & Category Sections (8 cols) */}
        <div className="lg:col-span-8 space-y-10">

          {/* SECTION: BERITA TERKINI */}
          <section className="bg-white border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between border-b-2 border-[#0b4f8a] pb-2 mb-4">
              <h2 className="font-serif-headline text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0b4f8a]" />
                Berita Terkini
              </h2>
              <span className="text-xs text-gray-500 font-medium">Update Terus 24 Jam</span>
            </div>

            <div className="divide-y divide-gray-100">
              {latestNews.map((art) => (
                <ArticleCard key={art.id} article={art} variant="horizontal" />
              ))}
            </div>
          </section>

          {/* SECTION: NASIONAL */}
          {nasionalArticles.length > 0 && (
            <section className="bg-white border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between border-b-2 border-[#0b4f8a] pb-2 mb-4">
                <h2 className="font-serif-headline text-lg sm:text-xl font-bold text-gray-900">
                  Kabar Nasional
                </h2>
                <Link
                  to="/kategori/nasional"
                  className="text-xs font-semibold text-[#0b4f8a] hover:text-[#e65100] flex items-center gap-0.5"
                >
                  Lihat Semua <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ArticleCard article={nasionalArticles[0]} variant="secondary" />
                <div className="divide-y divide-gray-100">
                  {nasionalArticles.slice(1, 4).map((art) => (
                    <ArticleCard key={art.id} article={art} variant="compact" />
                  ))}
                  {nasionalArticles.length <= 1 && (
                    <p className="text-xs text-gray-400 py-4 italic">Berita nasional lainnya sedang disiapkan redaksi.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* SECTION: 2-COLUMN SPLIT (POLITIK & EKONOMI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Politik */}
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between border-b-2 border-[#0b4f8a] pb-1.5 mb-3">
                <h3 className="font-serif-headline text-base font-bold text-gray-900">
                  Politik
                </h3>
                <Link to="/kategori/politik" className="text-[11px] font-semibold text-[#0b4f8a] hover:underline">
                  Kanal Politik &rarr;
                </Link>
              </div>
              {politikArticles.length > 0 ? (
                <div>
                  <ArticleCard article={politikArticles[0]} variant="secondary" showExcerpt={false} />
                  <div className="mt-2 divide-y divide-gray-100">
                    {politikArticles.slice(1, 3).map((art) => (
                      <ArticleCard key={art.id} article={art} variant="compact" />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic py-4">Memuat kanal politik...</p>
              )}
            </div>

            {/* Ekonomi */}
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between border-b-2 border-[#0b4f8a] pb-1.5 mb-3">
                <h3 className="font-serif-headline text-base font-bold text-gray-900">
                  Ekonomi
                </h3>
                <Link to="/kategori/ekonomi" className="text-[11px] font-semibold text-[#0b4f8a] hover:underline">
                  Kanal Ekonomi &rarr;
                </Link>
              </div>
              {ekonomiArticles.length > 0 ? (
                <div>
                  <ArticleCard article={ekonomiArticles[0]} variant="secondary" showExcerpt={false} />
                  <div className="mt-2 divide-y divide-gray-100">
                    {ekonomiArticles.slice(1, 3).map((art) => (
                      <ArticleCard key={art.id} article={art} variant="compact" />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic py-4">Memuat kanal ekonomi...</p>
              )}
            </div>
          </div>

          {/* SECTION: 2-COLUMN SPLIT (TEKNOLOGI & BISNIS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teknologi */}
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between border-b-2 border-[#0b4f8a] pb-1.5 mb-3">
                <h3 className="font-serif-headline text-base font-bold text-gray-900">
                  Teknologi
                </h3>
                <Link to="/kategori/teknologi" className="text-[11px] font-semibold text-[#0b4f8a] hover:underline">
                  Kanal Teknologi &rarr;
                </Link>
              </div>
              {teknologiArticles.length > 0 ? (
                <div>
                  <ArticleCard article={teknologiArticles[0]} variant="secondary" showExcerpt={false} />
                  <div className="mt-2 divide-y divide-gray-100">
                    {teknologiArticles.slice(1, 3).map((art) => (
                      <ArticleCard key={art.id} article={art} variant="compact" />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Bisnis */}
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between border-b-2 border-[#0b4f8a] pb-1.5 mb-3">
                <h3 className="font-serif-headline text-base font-bold text-gray-900">
                  Bisnis & Pasar
                </h3>
                <Link to="/kategori/bisnis" className="text-[11px] font-semibold text-[#0b4f8a] hover:underline">
                  Kanal Bisnis &rarr;
                </Link>
              </div>
              {bisnisArticles.length > 0 ? (
                <div>
                  <ArticleCard article={bisnisArticles[0]} variant="secondary" showExcerpt={false} />
                  <div className="mt-2 divide-y divide-gray-100">
                    {bisnisArticles.slice(1, 3).map((art) => (
                      <ArticleCard key={art.id} article={art} variant="compact" />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* SECTION: DAERAH & INTERNASIONAL */}
          {daerahArticles.length > 0 && (
            <section className="bg-white border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between border-b-2 border-[#0b4f8a] pb-2 mb-4">
                <h2 className="font-serif-headline text-lg sm:text-xl font-bold text-gray-900">
                  Kabar Daerah Nusantara
                </h2>
                <Link
                  to="/kategori/daerah"
                  className="text-xs font-semibold text-[#0b4f8a] hover:text-[#e65100] flex items-center gap-0.5"
                >
                  Lihat Semua Daerah &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {daerahArticles.slice(0, 2).map((art) => (
                  <ArticleCard key={art.id} article={art} variant="secondary" />
                ))}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN: EDITORIAL SIDEBAR (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">

          {/* 1. PROFIL PENULIS & PEMIMPIN REDAKSI BOX */}
          {author && (
            <div className="bg-white border border-gray-200 p-4 shadow-xs">
              <div className="border-b border-gray-100 pb-2 mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#0b4f8a] uppercase tracking-wider">
                  Pengelola & Penulis Redaksi
                </span>
                <span className="text-[10px] bg-blue-50 text-[#0b4f8a] px-1.5 py-0.5 font-semibold">
                  Pemimpin Redaksi
                </span>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Link to={`/penulis/${author.slug}`}>
                  <img
                    src={author.profileImage}
                    alt={author.name}
                    className="w-14 h-14 object-cover rounded-xs border border-gray-200 shrink-0"
                  />
                </Link>
                <div>
                  <Link
                    to={`/penulis/${author.slug}`}
                    className="font-serif-headline font-bold text-base text-gray-900 hover:text-[#0b4f8a] block"
                  >
                    {author.name}
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                    {author.bio}
                  </p>
                </div>
              </div>
              <Link
                to={`/penulis/${author.slug}`}
                className="block text-center text-xs font-semibold text-[#0b4f8a] bg-gray-50 hover:bg-gray-100 border border-gray-200 py-1.5 transition-colors"
              >
                Lihat Profil Lengkap & Semua Artikel &rarr;
              </Link>
            </div>
          )}

          {/* 2. SIDEBAR AD */}
          <AdSlot placement="sidebar" pageTarget="homepage" />

          {/* 3. BERITA TERPOPULER (RANKED 1-5) */}
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 border-b-2 border-[#0b4f8a] pb-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#e65100]" />
              <h3 className="font-serif-headline font-bold text-base text-gray-900">
                Berita Terpopuler
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {popularArticles.map((art, idx) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  variant="compact"
                  rank={idx + 1}
                />
              ))}
            </div>
          </div>

          {/* 4. PILIHAN EDITOR */}
          {editorPicks.length > 0 && (
            <div className="bg-white border border-gray-200 p-4">
              <div className="flex items-center gap-2 border-b-2 border-[#0b4f8a] pb-2 mb-3">
                <Award className="w-4 h-4 text-[#0b4f8a]" />
                <h3 className="font-serif-headline font-bold text-base text-gray-900">
                  Pilihan Editor
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {editorPicks.map((art) => (
                  <ArticleCard key={art.id} article={art} variant="compact" />
                ))}
              </div>
            </div>
          )}

          {/* 5. LAPORKAN KOREKSI / HAK JAWAB BOX */}
          <div className="bg-[#f1f5f9] border border-gray-300 p-4 text-xs text-gray-700">
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-1.5">
              <AlertCircle className="w-4 h-4 text-[#0b4f8a]" />
              <span>Layanan Hak Jawab & Koreksi</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-3">
              KABARIN AJA menjunjung tinggi akurasi dan keberimbangan. Jika menemukan kekeliruan data atau memerlukan hak jawab, hubungi redaksi kami.
            </p>
            <Link
              to="/kebijakan-koreksi"
              className="inline-block text-[#0b4f8a] font-semibold hover:underline"
            >
              Kirim Permohonan Koreksi &rarr;
            </Link>
          </div>

        </aside>

      </div>

      {/* BOTTOM AD SLOT */}
      <AdSlot placement="homepage-bottom" pageTarget="homepage" />
    </div>
  );
};
