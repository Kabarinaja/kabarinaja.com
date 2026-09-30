import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Filter,
} from 'lucide-react';
import { getAllArticlesAdmin, deleteArticle, getCategories } from '../../services/db';
import type { Article, Category } from '../../types';
import { formatDateIndonesian } from '../../components/common/ArticleCard';

export const AdminArticlesListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [arts, cats] = await Promise.all([getAllArticlesAdmin(), getCategories()]);
    setArticles(arts);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus artikel: "${title}" secara permanen?`)) {
      try {
        await deleteArticle(id);
        loadData();
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.message || 'Artikel gagal dihapus.');
      }
    }
  };

  const filteredArticles = articles.filter((art) => {
    // search
    if (
      searchQuery.trim() &&
      !art.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
      !art.slug.toLowerCase().includes(searchQuery.toLowerCase().trim())
    ) {
      return false;
    }

    // category
    if (selectedCategory !== 'all' && art.categoryId !== selectedCategory) {
      return false;
    }

    // status
    if (selectedStatus !== 'all' && art.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {errorMsg && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs">{errorMsg}</div>}
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif-headline text-2xl font-bold text-gray-900">
            Daftar Semua Artikel
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola, sunting, dan pantau performa artikel berita di KABARIN AJA.
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

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-gray-200 p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Cari judul berita atau permalink..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8fafc] border border-gray-300 rounded-xs pl-8 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#0b4f8a]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#f8fafc] border border-gray-300 rounded-xs p-2 text-xs text-gray-800 focus:outline-none focus:border-[#0b4f8a]"
            >
              <option value="all">Semua Kanal Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#f8fafc] border border-gray-300 rounded-xs p-2 text-xs text-gray-800 focus:outline-none focus:border-[#0b4f8a]"
            >
              <option value="all">Semua Status</option>
              <option value="published">Terbit (Published)</option>
              <option value="draft">Draf (Draft)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ARTICLES TABLE */}
      <div className="bg-white border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-600 flex justify-between items-center">
          <span>
            Menampilkan <strong className="text-gray-900">{filteredArticles.length}</strong> artikel
          </span>
          <span className="text-[11px] text-gray-400">Total database: {articles.length}</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Memuat data artikel...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Tidak ada artikel yang cocok dengan kriteria filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#f8fafc] text-gray-500 uppercase font-bold border-b border-gray-200 text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 w-16">Foto</th>
                  <th className="p-3">Judul Berita</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Pembaca</th>
                  <th className="p-3">Waktu Terbit</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3">
                      <img
                        src={art.featuredImage}
                        alt=""
                        className="w-12 h-8 object-cover rounded-xs border border-gray-200"
                      />
                    </td>
                    <td className="p-3 font-semibold text-gray-900 max-w-sm">
                      <Link
                        to={`/admin/articles/edit/${art.id}`}
                        className="hover:text-[#0b4f8a] block"
                      >
                        {art.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {art.isHeadline && (
                          <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1 rounded-xs uppercase">
                            Headline
                          </span>
                        )}
                        {art.isEditorPick && (
                          <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1 rounded-xs uppercase">
                            Editor's Pick
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono">
                          /{art.slug}
                        </span>
                      </div>
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
                    <td className="p-3 font-mono text-gray-600">{art.views || 0}</td>
                    <td className="p-3 text-gray-500 whitespace-nowrap">
                      {formatDateIndonesian(art.publishedAt || art.createdAt || '')}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {art.status === 'published' && (
                          <Link
                            to={`/berita/${art.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-[#0b4f8a] hover:bg-gray-100 rounded-xs"
                            title="Buka Halaman Publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/articles/edit/${art.id}`}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-xs"
                          title="Sunting Artikel"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(art.id || '', art.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-xs"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-4 h-4" />
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
