import React, { useEffect, useState, useRef } from 'react';
import { getCurrentAuthorProfile, saveAuthorProfile } from '../../services/db';
import { uploadToCloudinary } from '../../lib/cloudinary';
import type { Author } from '../../types';
import { User, Save, Upload, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AdminProfilePage: React.FC = () => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    getCurrentAuthorProfile().then((data) => {
      if (data) {
        setAuthor(data);
      } else if (currentUser) {
        setAuthor({
          id: currentUser.uid,
          role: 'superadmin',
          name: currentUser.displayName || 'Publisher KABARIN AJA',
          slug: 'publisher-kabarin-aja',
          profileImage: 'https://cdn.phototourl.com/member/2026-09-30-8cf912e0-15fa-419a-8730-cf9bd68d8b65.png',
          bio: '',
          skillsDescription: '',
          email: currentUser.email || 'kabarterbaru.id@gmail.com',
          website: 'https://kabarinaja.com',
          socialLinks: {},
        });
      }
      setLoading(false);
    });
  }, [currentUser]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !author) return;

    setUploadingImage(true);
    try {
      const res = await uploadToCloudinary(file, 'author');
      setAuthor({ ...author, profileImage: res.secure_url });
    } catch (err) {
      console.error('Cloudinary profile upload failed:', err);
      setSuccessMsg('Upload foto profil gagal. Silakan coba lagi.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author) return;

    setSaving(true);
    try {
      const saved = await saveAuthorProfile(author);
      setAuthor(saved);
      setSuccessMsg('Profil penulis berhasil diperbarui.');
    } catch (err: any) {
      console.error(err);
      setSuccessMsg(err?.message || 'Profil penulis gagal disimpan.');
    } finally {
      setSaving(false);
    }
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-gray-500">Memuat profil penulis...</div>;
  }

  if (!author) {
    return <div className="py-20 text-center text-xs text-gray-500">Menyiapkan profil publisher...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif-headline text-2xl font-bold text-gray-900">
            Profil Penulis & Pemimpin Redaksi
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola nama, foto, bio, dan deskripsi kemampuan publisher/penulis yang akan tampil pada setiap artikel.
          </p>
        </div>

        <Link
          to={`/penulis/${author.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#0b4f8a] font-semibold flex items-center gap-1 hover:underline"
        >
          <span>Halaman Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-gray-200 p-6 shadow-2xs space-y-4 text-xs">
        {/* AVATAR & UPLOAD */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <img
            src={author.profileImage}
            alt={author.name}
            className="w-20 h-20 rounded-xs object-cover border border-gray-300"
          />
          <div className="space-y-1.5">
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
              className="bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1.5 font-semibold text-gray-700 rounded-xs flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploadingImage ? 'Mengunggah ke Cloudinary...' : 'Ganti Foto Profil'}
            </button>
            <p className="text-[11px] text-gray-400">
              Format JPG, PNG, atau WebP. Gambar dioptimalkan otomatis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={author.name}
              onChange={(e) => setAuthor({ ...author, name: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Slug URL Profil</label>
            <input
              type="text"
              required
              value={author.slug}
              onChange={(e) => setAuthor({ ...author, slug: e.target.value })}
              className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Biografi Singkat (Bio) *</label>
          <textarea
            rows={3}
            required
            value={author.bio}
            onChange={(e) => setAuthor({ ...author, bio: e.target.value })}
            className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Deskripsi Keahlian & Spesialisasi Liputan</label>
          <textarea
            rows={3}
            value={author.skillsDescription || ''}
            onChange={(e) => setAuthor({ ...author, skillsDescription: e.target.value })}
            className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Korespondensi</label>
            <input
              type="email"
              value={author.email || ''}
              onChange={(e) => setAuthor({ ...author, email: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Website Pribadi</label>
            <input
              type="url"
              value={author.website || ''}
              onChange={(e) => setAuthor({ ...author, website: e.target.value })}
              placeholder="https://..."
              className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Twitter / X</label>
            <input
              type="url"
              value={author.socialLinks?.twitter || ''}
              onChange={(e) =>
                setAuthor({
                  ...author,
                  socialLinks: { ...author.socialLinks, twitter: e.target.value },
                })
              }
              placeholder="https://x.com/..."
              className="w-full p-2 border border-gray-300 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Facebook</label>
            <input
              type="url"
              value={author.socialLinks?.facebook || ''}
              onChange={(e) =>
                setAuthor({
                  ...author,
                  socialLinks: { ...author.socialLinks, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/..."
              className="w-full p-2 border border-gray-300 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Instagram</label>
            <input
              type="url"
              value={author.socialLinks?.instagram || ''}
              onChange={(e) =>
                setAuthor({
                  ...author,
                  socialLinks: { ...author.socialLinks, instagram: e.target.value },
                })
              }
              placeholder="https://instagram.com/..."
              className="w-full p-2 border border-gray-300 font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0b4f8a] text-white px-6 py-2 font-bold uppercase tracking-wider hover:bg-[#083b68] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </div>
  );
};
