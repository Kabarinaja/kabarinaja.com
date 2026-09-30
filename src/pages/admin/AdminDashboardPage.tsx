import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Eye,
  FolderTree,
  Megaphone,
  PlusCircle,
  ExternalLink,
  Edit,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { getAllArticlesAdmin, deleteArticle, getCategories, getAllAdsAdmin } from '../../services/db';
import type { Article, Category, Advertisement } from '../../types';
import { formatDateIndonesian } from '../../components/common/ArticleCard';

export const AdminDashboardPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    const [artData, catData, adData] = await Promise.all([
      getAllArticlesAdmin(),
      getCategories(),
      getAllAdsAdmin(),
    ]);
    setArticles(artData);
    setCategories(catData);
    setAds(adData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus artikel: "${title}"?`)) {
      try {
        await deleteArticle(id);
        loadData();
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.message || 'Artikel gagal dihapus.');
      }
    }
  };

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const activeAdsCount = ads.filter((a) => a.active).length;

  return (
    <div className="space-y-6">
      {errorMsg && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs">{errorMsg}</div>}
      {/* HEADER & QUICK CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif-headline text-2xl font-bold text-gray-900">
            Pusat Kendali Redaksi
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Selamat datang di panel redaksi portal berita KABARIN AJA (kabarinaja.com).
          </p>
        </div>

        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-[#0b4f8a] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#083b68] self-start transition-colors rounded-xs shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Tulis Artikel Baru
        </Link>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold">Artikel Terbit</span>
            <FileText className="w-4 h-4 text-[#0b4f8a]" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{publishedCount}</p>
          <span className="text-[11px] text-gray-500">{draftCount} draf disimpan</span>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold">Total Pembaca</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{totalViews.toLocaleString()}</p>
          <span className="text-[11px] text-gray-500">Tayangan halaman</span>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold">Kanal Kategori</span>
            <FolderTree className="w-4 h-4 text-[#e65100]" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{categories.length}</p>
          <span className="text-[11px] text-gray-500">Kategori aktif</span>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold">Slot Iklan</span>
            <Megaphone className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{activeAdsCount}</p>
          <span className="text-[11px] text-gray-500">Iklan aktif tayang</span>
        </div>
      </div>

      {/* RECENT ARTICLES TABLE */}
      <div className="bg-white border border-gray-200 shadow-2xs">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-serif-headline text-base font-bold text-gray-900">
            Daftar Artikel Redaksi Terbaru
          </h2>
          <Link
            to="/admin/articles"
            className="text-xs font-semibold text-[#0b4f8a] hover:underline"
          >
            Lihat Semua ({articles.length}) &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Memuat artikel...</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            Belum ada artikel. Klik "Tulis Artikel Baru" untuk mulai mempublikasikan berita.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#f8fafc] text-gray-500 uppercase font-bold border-b border-gray-200 text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Judul Berita</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Pembaca</th>
                  <th className="p-3">Waktu</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.slice(0, 10).map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3 font-semibold text-gray-900 max-w-xs truncate">
                      <Link
                        to={`/admin/articles/edit/${art.id}`}
                        className="hover:text-[#0b4f8a]"
                      >
                        {art.title}
                      </Link>
                      {art.isHeadline && (
                        <span className="ml-2 bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-xs uppercase">
                          Headline
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-medium text-gray-600">{art.categoryName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                          art.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {art.status === 'published' ? 'Terbit' : 'Draf'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-gray-500">{art.views || 0}</td>
                    <td className="p-3 text-gray-500 whitespace-nowrap">
                      {formatDateIndonesian(art.publishedAt || art.createdAt || '').split(',')[0]}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {art.status === 'published' && (
                          <Link
                            to={`/berita/${art.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-[#0b4f8a]"
                            title="Lihat Pratinjau Publik"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/articles/edit/${art.id}`}
                          className="p-1 text-gray-400 hover:text-emerald-600"
                          title="Sunting Artikel"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(art.id || '', art.title)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
