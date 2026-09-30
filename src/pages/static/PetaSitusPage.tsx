import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import { getPublishedArticles } from '../../services/db';
import type { Article } from '../../types';

export const PetaSitusPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getPublishedArticles().then((data) => setArticles(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Peta Situs (Sitemap) - KABARIN AJA"
        description="Daftar lengkap kanal, halaman resmi, dan arsip berita portal berita KABARIN AJA."
        canonicalUrl="https://kabarinaja.com/peta-situs"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Peta Situs</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950">
            Peta Situs (HTML Sitemap)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Navigasi menyeluruh ke seluruh kanal dan artikel di KABARIN AJA
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-700">
          
          {/* FEED & XML TECHNICAL LINKS */}
          <div className="p-4 bg-slate-50 border border-gray-200">
            <h2 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
              Berkas Pengindeksan & Sindikasi Konten
            </h2>
            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0b4f8a] hover:underline flex items-center gap-1"
              >
                sitemap.xml (Sitemap Utama) <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/news-sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0b4f8a] hover:underline flex items-center gap-1"
              >
                news-sitemap.xml (Google News) <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0b4f8a] hover:underline flex items-center gap-1"
              >
                rss.xml (Sindikasi RSS Feed) <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0b4f8a] hover:underline flex items-center gap-1"
              >
                robots.txt <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* HALAMAN UTAMA & REDAKSI */}
          <div>
            <h2 className="font-serif-headline text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Halaman Redaksi & Informasi
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <Link to="/" className="text-[#0b4f8a] hover:underline py-1">Beranda</Link>
              <Link to="/tentang" className="text-[#0b4f8a] hover:underline py-1">Tentang Kami</Link>
              <Link to="/redaksi" className="text-[#0b4f8a] hover:underline py-1">Susunan Redaksi</Link>
              <Link to="/pedoman-media" className="text-[#0b4f8a] hover:underline py-1">Pedoman Media Siber</Link>
              <Link to="/kebijakan-editorial" className="text-[#0b4f8a] hover:underline py-1">Kebijakan Editorial</Link>
              <Link to="/kebijakan-koreksi" className="text-[#0b4f8a] hover:underline py-1">Kebijakan Koreksi & Hak Jawab</Link>
              <Link to="/kontak" className="text-[#0b4f8a] hover:underline py-1">Kontak Redaksi</Link>
              <Link to="/iklan" className="text-[#0b4f8a] hover:underline py-1">Informasi Pasang Iklan</Link>
              <Link to="/kebijakan-privasi" className="text-[#0b4f8a] hover:underline py-1">Kebijakan Privasi</Link>
              <Link to="/syarat-ketentuan" className="text-[#0b4f8a] hover:underline py-1">Syarat & Ketentuan</Link>
              <Link to="/disclaimer" className="text-[#0b4f8a] hover:underline py-1">Disclaimer</Link>
              <Link to="/redaksi" className="text-[#0b4f8a] hover:underline py-1">Profil Publisher / Penulis</Link>
            </div>
          </div>

          {/* 12 KANAL BERITA */}
          <div>
            <h2 className="font-serif-headline text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              12 Kanal Berita
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {INITIAL_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/kategori/${cat.slug}`}
                  className="text-gray-700 hover:text-[#0b4f8a] hover:underline py-1 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 bg-[#0b4f8a] rounded-full" />
                  Kanal {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ARSIP ARTIKEL TERKINI */}
          <div>
            <h2 className="font-serif-headline text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
              Indeks Berita Publikasi
            </h2>
            <div className="divide-y divide-gray-100 text-xs">
              {articles.map((art) => (
                <div key={art.id} className="py-2 flex items-center justify-between gap-4">
                  <Link
                    to={`/berita/${art.slug}`}
                    className="text-gray-900 hover:text-[#0b4f8a] font-medium"
                  >
                    {art.title}
                  </Link>
                  <span className="text-gray-400 shrink-0 uppercase text-[10px]">
                    {art.categoryName}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
