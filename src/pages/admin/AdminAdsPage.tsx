import React, { useEffect, useState, useRef } from 'react';
import { getAllAdsAdmin, saveAd, deleteAd } from '../../services/db';
import { uploadToCloudinary } from '../../lib/cloudinary';
import type { Advertisement, AdPlacement } from '../../types';
import { Megaphone, Plus, Trash2, Edit, Save, Upload, CheckCircle, Power } from 'lucide-react';

export const AdminAdsPage: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<Partial<Advertisement> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAds = async () => {
    setLoading(true);
    const data = await getAllAdsAdmin();
    setAds(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleToggleActive = async (ad: Advertisement) => {
    const updated = { ...ad, active: !ad.active };
    try { await saveAd(updated); loadAds(); } catch (err) { console.error(err); setSuccessMsg('Status iklan gagal diperbarui.'); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Hapus slot iklan "${name}"?`)) {
      try { await deleteAd(id); loadAds(); } catch (err) { console.error(err); setSuccessMsg('Iklan gagal dihapus.'); }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAd) return;

    setUploadingImage(true);
    try {
      const res = await uploadToCloudinary(file);
      setEditingAd({ ...editingAd, imageUrl: res.secure_url });
    } catch (err) {
      console.error('Cloudinary ad upload failed:', err);
      setSuccessMsg('Upload gambar iklan gagal. Silakan coba lagi.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd || !editingAd.name) return;

    try {
      await saveAd({
      id: editingAd.id || `ad-${Date.now()}`,
      name: editingAd.name,
      type: editingAd.type || 'image',
      placement: (editingAd.placement as AdPlacement) || 'homepage-top',
      pageTarget: editingAd.pageTarget || 'all',
      imageUrl: editingAd.imageUrl || '',
      targetUrl: editingAd.targetUrl || '',
      htmlCode: editingAd.htmlCode || '',
      textContent: editingAd.textContent || '',
      active: editingAd.active !== false,
      advertiser: editingAd.advertiser || 'Mitra Komersial',
      priority: Number(editingAd.priority) || 1,
      ...(editingAd.startAt ? { startAt: editingAd.startAt } : {}),
      ...(editingAd.endAt ? { endAt: editingAd.endAt } : {}),
    } as Advertisement);

      setEditingAd(null);
      setSuccessMsg('Pengaturan iklan berhasil disimpan.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAds();
    } catch (err: any) {
      console.error(err);
      setSuccessMsg(err?.message || 'Iklan gagal disimpan.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif-headline text-2xl font-bold text-gray-900">
            Kelola Slot Iklan & Sponsor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Atur banner promosi, kode iklan HTML, dan advertorial pada berbagai posisi strategis portal.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingAd({
              name: '',
              type: 'image',
              placement: 'homepage-top',
              pageTarget: 'all',
              active: true,
              priority: 1,
              advertiser: 'Sponsor Resmi',
              imageUrl: '',
              targetUrl: '',
            })
          }
          className="inline-flex items-center gap-2 bg-[#0b4f8a] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#083b68] self-start transition-colors rounded-xs"
        >
          <Plus className="w-4 h-4" />
          Tambah Slot Iklan Baru
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* MODAL / FORM EDITOR */}
      {editingAd && (
        <div className="bg-white border-2 border-[#0b4f8a] p-5 shadow-lg">
          <h2 className="font-serif-headline text-base font-bold text-gray-900 mb-4">
            {editingAd.id ? 'Sunting Iklan' : 'Buat Slot Iklan Baru'}
          </h2>

          <form onSubmit={handleSaveAd} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Iklan / Kampanye *</label>
                <input
                  type="text"
                  required
                  value={editingAd.name || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, name: e.target.value })}
                  placeholder="Contoh: Banner Peluncuran Aplikasi"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tipe Iklan *</label>
                <select
                  value={editingAd.type || 'image'}
                  onChange={(e) =>
                    setEditingAd({ ...editingAd, type: e.target.value as any })
                  }
                  className="w-full p-2 border border-gray-300 bg-white focus:outline-none focus:border-[#0b4f8a]"
                >
                  <option value="image">Gambar Banner (Image)</option>
                  <option value="text">Teks Advertorial (Text)</option>
                  <option value="html">Kode Iklan / Script HTML</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Pengiklan / Sponsor</label>
                <input
                  type="text"
                  value={editingAd.advertiser || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, advertiser: e.target.value })}
                  placeholder="Nama Perusahaan / Lembaga"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Posisi Peletakan (Placement) *</label>
                <select
                  value={editingAd.placement || 'homepage-top'}
                  onChange={(e) =>
                    setEditingAd({ ...editingAd, placement: e.target.value as any })
                  }
                  className="w-full p-2 border border-gray-300 bg-white focus:outline-none focus:border-[#0b4f8a]"
                >
                  <option value="homepage-top">Homepage Top (Atas)</option>
                  <option value="homepage-middle">Homepage Middle (Tengah)</option>
                  <option value="homepage-bottom">Homepage Bottom (Bawah)</option>
                  <option value="article-top">Article Top (Atas Berita)</option>
                  <option value="article-middle">Article Middle (Tengah Berita)</option>
                  <option value="article-bottom">Article Bottom (Bawah Berita)</option>
                  <option value="sidebar">Sidebar Kanan (Universal)</option>
                  <option value="category-top">Category Top (Atas Kanal)</option>
                  <option value="category-middle">Category Middle</option>
                  <option value="footer">Footer Area</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Halaman</label>
                <select
                  value={editingAd.pageTarget || 'all'}
                  onChange={(e) =>
                    setEditingAd({ ...editingAd, pageTarget: e.target.value as any })
                  }
                  className="w-full p-2 border border-gray-300 bg-white focus:outline-none focus:border-[#0b4f8a]"
                >
                  <option value="all">Semua Halaman (All)</option>
                  <option value="homepage">Hanya Beranda (Homepage)</option>
                  <option value="article">Halaman Baca Artikel</option>
                  <option value="category">Halaman Kategori Berita</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Prioritas Tampil (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editingAd.priority || 1}
                  onChange={(e) =>
                    setEditingAd({ ...editingAd, priority: parseInt(e.target.value) || 1 })
                  }
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>
            </div>

            {editingAd.type === 'image' && (
              <div className="space-y-3 bg-gray-50 p-3 border border-gray-200">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL Gambar Banner</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingAd.imageUrl || ''}
                      onChange={(e) => setEditingAd({ ...editingAd, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="flex-grow p-2 border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#0b4f8a]"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="bg-[#0b4f8a] text-white px-3 py-2 text-xs font-semibold hover:bg-[#083b68] flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImage ? 'Mengunggah...' : 'Unggah ke Cloudinary'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tautan Tujuan Klik (Target URL)</label>
                  <input
                    type="url"
                    value={editingAd.targetUrl || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, targetUrl: e.target.value })}
                    placeholder="https://sponsor-resmi.com/promo"
                    className="w-full p-2 border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#0b4f8a]"
                  />
                </div>
              </div>
            )}

            {editingAd.type === 'text' && (
              <div className="space-y-2 bg-gray-50 p-3 border border-gray-200">
                <label className="block font-bold text-gray-700">Teks Promosi Advertorial</label>
                <textarea
                  rows={3}
                  value={editingAd.textContent || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, textContent: e.target.value })}
                  placeholder="Teks pesan komersial atau ajakan tindak..."
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tautan Web Sponsor</label>
                  <input
                    type="url"
                    value={editingAd.targetUrl || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, targetUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 border border-gray-300 font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {editingAd.type === 'html' && (
              <div className="space-y-2 bg-gray-50 p-3 border border-gray-200">
                <label className="block font-bold text-gray-700">Kode HTML Iklan (Google AdSense / Custom Script)</label>
                <textarea
                  rows={4}
                  value={editingAd.htmlCode || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, htmlCode: e.target.value })}
                  placeholder="<!-- Sisipkan kode snippet tag iklan di sini -->"
                  className="w-full p-2 border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setEditingAd(null)}
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0b4f8a] text-white font-bold hover:bg-[#083b68] flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Iklan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADS TABLE */}
      <div className="bg-white border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
          Total Slot Terdaftar: <strong className="text-gray-900">{ads.length}</strong>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Memuat data iklan...</div>
        ) : ads.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            Belum ada slot iklan yang dikonfigurasi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#f8fafc] text-gray-500 uppercase font-bold border-b border-gray-200 text-[10px]">
                <tr>
                  <th className="p-3">Nama Kampanye</th>
                  <th className="p-3">Tipe</th>
                  <th className="p-3">Posisi</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-900">
                      {ad.name}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        Sponsor: {ad.advertiser}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-mono text-[10px]">{ad.type}</td>
                    <td className="p-3 font-medium text-gray-600">{ad.placement}</td>
                    <td className="p-3 capitalize text-gray-500">{ad.pageTarget}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(ad)}
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1 ${
                          ad.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        <Power className="w-2.5 h-2.5" />
                        {ad.active ? 'Aktif Tayang' : 'Non-aktif'}
                      </button>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingAd(ad)}
                          className="p-1 text-gray-400 hover:text-emerald-600"
                          title="Sunting Iklan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ad.id || '', ad.name)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Hapus Iklan"
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
