import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  getAllArticlesAdmin,
  saveArticle,
  getCategories,
  getCurrentAuthorProfile,
  generateSlug,
  calculateReadingTime,
} from '../../services/db';
import { uploadToCloudinary } from '../../lib/cloudinary';

import type { Article, Category, Author } from '../../types';

export const AdminArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('cat-nasional');
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [captionImage, setCaptionImage] = useState('');
  const [tagsInput, setTagsInput] = useState('Nasional');
  const [isHeadline, setIsHeadline] = useState(false);
  const [isEditorPick, setIsEditorPick] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  
  // Sources / References
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceNote, setSourceNote] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getCategories(), getAllArticlesAdmin(), getCurrentAuthorProfile()]).then(([cats, allArticles, currentAuthor]) => {
      if (!mounted) return;
      setCategories(cats);
      setAuthor(currentAuthor);

      if (isEditing && id) {
        const found = allArticles.find((a) => a.id === id);
        if (found) {
          setTitle(found.title);
          setSlug(found.slug);
          setAutoSlug(false);
          setExcerpt(found.excerpt);
          setContent(found.content);
          setCategoryId(found.categoryId);
          setFeaturedImage(found.featuredImage);
          setFeaturedImageAlt(found.featuredImageAlt || '');
          setCaptionImage(found.captionImage || '');
          setTagsInput(found.tags?.join(', ') || '');
          setIsHeadline(Boolean(found.isHeadline));
          setIsEditorPick(Boolean(found.isEditorPick));
          setStatus(found.status);
          setSourceName(found.sourceName || '');
          setSourceUrl(found.sourceUrl || '');
          setSourceNote(found.sourceNote || '');
          setSeoTitle(found.seoTitle || '');
          setSeoDescription(found.seoDescription || '');
        }
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [id, isEditing]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  // Helper for inserting formatting tags into textarea
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selectedText = previousText.substring(start, end);

    const replacement = `${before}${selectedText || 'Teks di sini'}${after}`;
    const newContent =
      previousText.substring(0, start) + replacement + previousText.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selectedText.length || 12)
      );
    }, 0);
  };

  // Cloudinary image upload handler
  const handleImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage(null);

    try {
      const res = await uploadToCloudinary(file);
      setFeaturedImage(res.secure_url);
      setMessage({ type: 'success', text: 'Foto berita berhasil diunggah ke Cloudinary!' });
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setMessage({ type: 'error', text: 'Upload foto gagal. Foto tidak disimpan sebagai Base64. Silakan coba lagi.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (publishStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Judul berita tidak boleh kosong.' });
      return;
    }
    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Isi naskah berita tidak boleh kosong.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const categoryName = selectedCategory ? selectedCategory.name : 'Nasional';

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const payload: Partial<Article> = {
        id: id || `art-${Date.now()}`,
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        excerpt: excerpt.trim(),
        content: content.trim(),
        categoryId,
        categoryName,
        featuredImage: featuredImage.trim(),
        featuredImageAlt: featuredImageAlt.trim() || title.trim(),
        captionImage: captionImage.trim(),
        tags,
        status: publishStatus,
        isHeadline,
        isEditorPick,
        sourceName: sourceName.trim(),
        sourceUrl: sourceUrl.trim(),
        sourceNote: sourceNote.trim(),
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || excerpt.trim().slice(0, 160),
        authorId: author?.id,
        authorName: author?.name,
        authorSlug: author?.slug,
        authorImage: author?.profileImage,
      };

      if (!author) throw new Error('Profil penulis belum tersedia. Buka /admin/profile dan simpan profil terlebih dahulu.');

      const saved = await saveArticle(payload);
      setMessage({
        type: 'success',
        text: `Artikel berhasil ${publishStatus === 'published' ? 'diterbitkan' : 'disimpan sebagai draf'}!`,
      });

      setTimeout(() => {
        navigate('/admin/articles');
      }, 800);
    } catch (err: any) {
      console.error('Save article error:', err);
      setMessage({ type: 'error', text: 'Gagal menyimpan artikel. Periksa koneksi data.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-gray-500">
        Memuat editor berita...
      </div>
    );
  }

  const readingTimeEstimate = calculateReadingTime(content);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-600"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif-headline text-xl sm:text-2xl font-bold text-gray-900">
              {isEditing ? 'Sunting Artikel Berita' : 'Tulis Berita Baru'}
            </h1>
            <p className="text-xs text-gray-500">
              {readingTimeEstimate} menit estimasi baca • Dikelola oleh akun redaksi aktif
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Simpan Draf
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="bg-[#0b4f8a] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#083b68] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Menyimpan...' : 'Terbitkan Sekarang'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 text-xs flex items-center gap-2 border-l-4 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
              : 'bg-red-50 text-red-800 border-red-500'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* FORM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* MAIN COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. TITLE & SLUG */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 space-y-4 shadow-2xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Judul Berita (Headline) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Pemerintah Resmikan Jalur Tol Baru, Perpendek Waktu Tempuh Antarprovinsi"
                className="w-full font-serif-headline text-lg sm:text-xl font-bold p-3 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <label className="font-bold uppercase text-gray-700">
                  Slug Tautan (Permalink)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAutoSlug(false);
                    setSlug(generateSlug(title));
                  }}
                  className="text-[#0b4f8a] hover:underline text-[11px]"
                >
                  Regenerasi dari Judul
                </button>
              </div>
              <div className="flex items-center bg-gray-50 border border-gray-300 px-3 py-1.5 text-xs text-gray-600">
                <span className="text-gray-400 select-none">https://kabarinaja.com/berita/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setSlug(e.target.value);
                  }}
                  className="flex-grow bg-transparent border-none text-xs font-mono text-gray-800 focus:outline-none px-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Ringkasan Berita (Lead / Excerpt)
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="1-2 kalimat ringkasan inti peristiwa sebagai pengantar pembaca dan deskripsi cuplikan..."
                className="w-full text-xs text-gray-800 p-2.5 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
              />
            </div>
          </div>

          {/* 2. RICH TEXT CONTENT */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Isi Naskah Berita *
              </label>
              <span className="text-[11px] text-gray-400">
                Mendukung tag HTML standar (p, h2, h3, blockquote, ul, ol)
              </span>
            </div>

            {/* Quick formatting toolbar */}
            <div className="flex flex-wrap items-center gap-1 bg-[#f8fafc] border border-gray-300 p-1.5 rounded-xs text-xs">
              <button
                type="button"
                onClick={() => insertFormatting('<strong>', '</strong>')}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700 font-bold"
                title="Tebal (Bold)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<em>', '</em>')}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700 italic"
                title="Miring (Italic)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700 font-bold flex items-center gap-0.5 text-[11px]"
                title="Sub-judul H2"
              >
                <Heading2 className="w-3.5 h-3.5" /> H2
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<h3>', '</h3>')}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700 font-bold flex items-center gap-0.5 text-[11px]"
                title="Sub-judul H3"
              >
                <Heading3 className="w-3.5 h-3.5" /> H3
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700"
                title="Kutipan Narasumber (Blockquote)"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700"
                title="Daftar Poin (List)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700"
                title="Daftar Angka (Ordered List)"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Masukkan tautan URL:');
                  if (url) insertFormatting(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
                }}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700"
                title="Sisipkan Tautan"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const img = prompt('Masukkan URL Gambar:');
                  if (img) insertFormatting(`<img src="${img}" alt="Foto liputan" class="w-full my-4" />`);
                }}
                className="p-1.5 hover:bg-gray-200 rounded-xs text-gray-700"
                title="Sisipkan Gambar dalam Artikel"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <textarea
              ref={contentTextareaRef}
              required
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan berita lengkap di sini dengan mematuhi prinsip 5W+1H (Apa, Siapa, Di mana, Kapan, Mengapa, dan Bagaimana)..."
              className="w-full font-serif-headline text-sm leading-relaxed text-gray-900 p-3 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>

          {/* 3. ATRIBUSI SUMBER & CATATAN VERIFIKASI (Section 53) */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 space-y-3 shadow-2xs">
            <h3 className="font-serif-headline text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
              Transparansi Sumber Berita & Catatan Redaksi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nama Sumber / Narasumber
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Contoh: Humas Kementerian / Kantor Berita Antara"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tautan Referensi Sumber (URL)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://sumber-resmi.gov/siaran-pers"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Catatan Verifikasi Redaksi
              </label>
              <input
                type="text"
                value={sourceNote}
                onChange={(e) => setSourceNote(e.target.value)}
                placeholder="Contoh: Telah dikonfirmasi ulang via sambungan telepon kepada juru bicara resmi."
                className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
              />
            </div>
          </div>

          {/* 4. SEO META */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 space-y-3 shadow-2xs">
            <h3 className="font-serif-headline text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
              Pengaturan SEO & Pratinjau Google
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Meta Title SEO
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Judul artikel untuk Google'}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Meta Description SEO (Maks. 160 Karakter)
                </label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={excerpt || 'Deskripsi singkat cuplikan untuk Google'}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
                />
              </div>

              {/* Live Google Search Preview Snippet */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xs">
                <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Pratinjau Hasil Pencarian Google:
                </span>
                <div className="text-xs text-[#202124]">
                  <p className="text-[11px] text-[#202124]">https://kabarinaja.com &gt; berita &gt; {slug || 'slug'}</p>
                  <p className="text-base text-[#1a0dab] font-medium hover:underline leading-snug cursor-pointer">
                    {seoTitle || title || 'Judul Berita KABARIN AJA'} - KABARIN AJA
                  </p>
                  <p className="text-xs text-[#4d5156] leading-relaxed mt-0.5 line-clamp-2">
                    {seoDescription || excerpt || 'Ringkasan berita aktual dan terpercaya Indonesia...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SIDEBAR SETTINGS (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PUBLICATION CONTROLS */}
          <div className="bg-white border border-gray-200 p-4 space-y-4 shadow-2xs text-xs">
            <h3 className="font-serif-headline text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
              Status & Penempatan
            </h3>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Kanal Kategori *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 border border-gray-300 bg-white font-medium focus:outline-none focus:border-[#0b4f8a]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHeadline}
                  onChange={(e) => setIsHeadline(e.target.checked)}
                  className="rounded-xs text-[#0b4f8a]"
                />
                <span className="font-bold text-gray-800">Jadikan Berita Utama (Headline)</span>
              </label>
              <p className="text-[11px] text-gray-500 pl-5">
                Akan ditampilkan paling besar di bagian atas Beranda.
              </p>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isEditorPick}
                  onChange={(e) => setIsEditorPick(e.target.checked)}
                  className="rounded-xs text-[#0b4f8a]"
                />
                <span className="font-bold text-gray-800">Pilihan Editor</span>
              </label>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block font-bold text-gray-700 mb-1">Tags (Pisahkan Koma)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Nasional, Politik, DPR, Ekonomi"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
              />
            </div>
          </div>

          {/* FEATURED IMAGE & CLOUDINARY UPLOAD */}
          <div className="bg-white border border-gray-200 p-4 space-y-3 shadow-2xs text-xs">
            <h3 className="font-serif-headline text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
              Foto Utama (Featured Image)
            </h3>

            {featuredImage && (
              <div className="relative aspect-video bg-gray-100 border border-gray-200 overflow-hidden">
                <img
                  src={featuredImage}
                  alt={featuredImageAlt || 'Pratinjau gambar'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileSelected}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-gray-300 font-semibold text-gray-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Mengunggah ke Cloudinary...' : 'Unggah Foto dari Komputer'}</span>
              </button>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Atau Masukkan URL Gambar:</label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://..."
                className="w-full p-2 border border-gray-300 font-mono text-[11px] focus:outline-none focus:border-[#0b4f8a]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Teks Alt Gambar (SEO / Aksesibilitas)</label>
              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Deskripsi foto berita"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Keterangan Foto (Caption):</label>
              <input
                type="text"
                value={captionImage}
                onChange={(e) => setCaptionImage(e.target.value)}
                placeholder="Foto: Dokumentasi KABARIN AJA"
                className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
              />
            </div>
          </div>

          {/* PENULIS INFO */}
          <div className="bg-white border border-gray-200 p-4 shadow-2xs text-xs space-y-2">
            <h3 className="font-serif-headline text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
              Penulis & Editor Berita
            </h3>
            <div className="flex items-center gap-3 pt-1">
              <img
                src={author?.profileImage || "https://cdn.phototourl.com/member/2026-09-30-8cf912e0-15fa-419a-8730-cf9bd68d8b65.png"}
                alt={author?.name || "Penulis aktif"}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <div>
                <p className="font-bold text-gray-900">{author?.name || "Profil penulis belum tersedia"}</p>
                <p className="text-[11px] text-gray-500">Identitas diambil dari profil redaksi Firebase saat artikel diterbitkan.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
