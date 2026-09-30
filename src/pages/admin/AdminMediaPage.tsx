import React, { useEffect, useRef, useState } from 'react';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { getMediaItems, saveMediaItem, deleteMediaItem } from '../../services/db';
import type { MediaItem } from '../../types';
import { Upload, Copy, Check, Trash2, AlertCircle } from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    setError('');
    const items = await getMediaItems();
    setMediaList(items);
    setLoading(false);
  };

  useEffect(() => { loadMedia(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 10 MB.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const res = await uploadToCloudinary(file);
      if (!res.secure_url || !res.public_id) throw new Error('Respons Cloudinary tidak lengkap.');
      const item: MediaItem = {
        id: `media-${Date.now()}`,
        url: res.secure_url,
        publicId: res.public_id,
        name: file.name,
        folder: 'kabarin-aja',
        size: file.size,
        format: res.format,
        createdAt: new Date().toISOString(),
      };
      await saveMediaItem(item);
      setMediaList((prev) => [item, ...prev]);
    } catch (err) {
      console.error('Media upload failed:', err);
      setError('Upload gagal. File tidak disimpan sebagai Base64 dan metadata tidak dianggap tersimpan.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus metadata media ini dari galeri? File Cloudinary tidak dihapus dari browser.')) return;
    try {
      await deleteMediaItem(id);
      setMediaList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError('Media gagal dihapus dari database.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif-headline text-2xl font-bold text-gray-900">Galeri Media & Foto Cloudinary</h1>
          <p className="text-xs text-gray-500 mt-0.5">Cloudinary menyimpan file; Firestore menyimpan metadata galeri.</p>
        </div>
        <div>
          <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 bg-[#0b4f8a] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#083b68] disabled:opacity-50">
            <Upload className="w-4 h-4" />{uploading ? 'Mengunggah...' : 'Unggah Foto Baru'}
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}

      {loading ? (
        <div className="py-16 text-center text-xs text-gray-500">Memuat galeri...</div>
      ) : mediaList.length === 0 ? (
        <div className="bg-white border border-gray-200 p-10 text-center text-sm text-gray-500">Belum ada media di Firestore.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 overflow-hidden shadow-2xs">
              <div className="aspect-video bg-gray-100 overflow-hidden"><img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" /></div>
              <div className="p-3 text-xs">
                <p className="font-semibold text-gray-800 truncate mb-1" title={item.name}>{item.name}</p>
                <p className="text-[10px] text-gray-400 font-mono mb-3">{new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                  <button type="button" onClick={() => copyToClipboard(item.id, item.url)} className="text-xs font-bold text-[#0b4f8a] hover:underline flex items-center gap-1">
                    {copiedId === item.id ? <><Check className="w-3 h-3 text-emerald-600" />Tersalin</> : <><Copy className="w-3 h-3" />Salin URL</>}
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 p-1" title="Hapus media"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
