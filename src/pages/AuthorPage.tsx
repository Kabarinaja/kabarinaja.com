import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Globe, Award, ChevronRight, Twitter, Facebook, Instagram } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ArticleCard } from '../components/common/ArticleCard';
import { getAuthorProfile, getArticlesByAuthor } from '../services/db';
import type { Author, Article } from '../types';

export const AuthorPage: React.FC = () => {
  const { authorSlug: slug } = useParams<{ authorSlug: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (slug) {
      Promise.all([getAuthorProfile(slug), getArticlesByAuthor(slug)]).then(([authData, arts]) => {
        if (!mounted) return;
        setAuthor(authData);
        setArticles(arts);
        setLoading(false);
      });
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#0b4f8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Memuat profil penulis...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-bold font-serif-headline text-gray-900 mb-2">
          Profil Penulis Tidak Ditemukan
        </h1>
        <p className="text-xs text-gray-500 mb-4">
          Penulis yang Anda cari tidak terdaftar dalam database redaksi.
        </p>
        <Link to="/" className="text-xs font-semibold text-[#0b4f8a] underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const canonical = `https://kabarinaja.com/penulis/${author.slug}`;

  // JSON-LD Person
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: canonical,
    image: author.profileImage,
    jobTitle: 'Pemimpin Redaksi & Penulis',
    worksFor: {
      '@type': 'NewsMediaOrganization',
      name: 'KABARIN AJA',
    },
    description: author.bio,
  };

  return (
    <div className="space-y-6">
      <SEO
        title={`Profil Penulis: ${author.name} - KABARIN AJA`}
        description={author.bio}
        canonicalUrl={canonical}
        imageUrl={author.profileImage}
        jsonLd={jsonLd}
      />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400">Penulis</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">{author.name}</span>
      </nav>

      {/* AUTHOR HERO BIO CARD */}
      <div className="bg-white border border-gray-200 p-6 md:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={author.profileImage}
            alt={author.name}
            className="w-28 h-28 md:w-36 md:h-36 rounded-xs object-cover border-2 border-gray-200 shrink-0"
          />

          <div className="flex-grow text-center md:text-left space-y-3">
            <div>
              <span className="bg-blue-50 text-[#0b4f8a] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-blue-200">
                Pimpinan Redaksi & Jurnalis Utama
              </span>
              <h1 className="font-serif-headline text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
                {author.name}
              </h1>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed max-w-2xl text-left">
              {author.bio}
            </p>

            {author.skillsDescription && (
              <div className="bg-gray-50 border-l-2 border-[#0b4f8a] p-3 text-xs text-gray-600">
                <span className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                  <Award className="w-4 h-4 text-[#0b4f8a]" />
                  Keahlian & Spesialisasi Liputan:
                </span>
                <p className="text-left">{author.skillsDescription}</p>
              </div>
            )}

            {/* Contact & Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-gray-600">
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="flex items-center gap-1 text-[#0b4f8a] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{author.email}</span>
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-600 hover:text-[#0b4f8a]"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website Resmi</span>
                </a>
              )}
              {author.socialLinks?.twitter && (
                <a
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {author.socialLinks?.facebook && (
                <a
                  href={author.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {author.socialLinks?.instagram && (
                <a
                  href={author.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-600"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLES WRITTEN BY AUTHOR */}
      <section className="bg-white border border-gray-200 p-4 md:p-6 shadow-2xs">
        <div className="border-b-2 border-[#0b4f8a] pb-2 mb-4 flex items-center justify-between">
          <h2 className="font-serif-headline text-lg sm:text-xl font-bold text-gray-900">
            Karya Berita & Analisis Oleh {author.name}
          </h2>
          <span className="text-xs text-gray-500 font-semibold">
            {articles.length} Artikel Diterbitkan
          </span>
        </div>

        {articles.length === 0 ? (
          <p className="text-xs text-gray-400 py-8 text-center">
            Belum ada artikel publikasi untuk penulis ini.
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="horizontal" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
