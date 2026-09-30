import React, { useEffect, useState } from 'react';
import { getCategories, updateCategory, ensureInitialCategories } from '../../services/db';
import type { Category } from '../../types';
import { FolderTree, Edit, Save, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    ensureInitialCategories().then((data) => setCategories(data)).catch((err) => { console.error(err); getCategories().then(setCategories); });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setErrorMsg('');
    try {
      await updateCategory(editingCategory);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Kategori gagal disimpan.');
      return;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? editingCategory : c))
    );
    setEditingCategory(null);
    setSuccessMsg('Kategori berhasil diperbarui.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-serif-headline text-2xl font-bold text-gray-900">
          Kelola 12 Kanal Berita
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Atur deskripsi, urutan navigasi, dan informasi metadata setiap kanal berita KABARIN AJA.
        </p>
      </div>

      {errorMsg && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs">{errorMsg}</div>}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* EDIT MODAL / DRAWER IF ACTIVE */}
      {editingCategory && (
        <div className="bg-white border-2 border-[#0b4f8a] p-5 shadow-md">
          <h2 className="font-serif-headline text-base font-bold text-gray-900 mb-3">
            Sunting Kanal: {editingCategory.name}
          </h2>
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Kanal</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Deskripsi Kanal</label>
              <textarea
                rows={2}
                value={editingCategory.description}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0b4f8a] text-white font-bold hover:bg-[#083b68] flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORIES TABLE */}
      <div className="bg-white border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#f8fafc] text-gray-500 uppercase font-bold border-b border-gray-200 text-[10px]">
              <tr>
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3">Nama Kanal</th>
                <th className="p-3">Slug URL</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-3 text-center text-gray-400 font-mono">{idx + 1}</td>
                  <td className="p-3 font-bold text-gray-900">{cat.name}</td>
                  <td className="p-3 font-mono text-gray-500">/kategori/{cat.slug}</td>
                  <td className="p-3 text-gray-600 max-w-xs truncate">{cat.description}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/kategori/${cat.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-[#0b4f8a]"
                        title="Buka Halaman Publik"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(cat)}
                        className="p-1 text-gray-400 hover:text-emerald-600"
                        title="Sunting Kanal"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
