import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  addDoc,
  serverTimestamp,
  onSnapshot,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';
import type { Article, ArticleComment, Category, Author, Advertisement, SiteSettings, MediaItem } from '../types';
import { INITIAL_CATEGORIES, INITIAL_SITE_SETTINGS } from '../data/initialData';

const COLLECTIONS = {
  articles: 'articles',
  categories: 'categories',
  authors: 'authors',
  ads: 'ads',
  settings: 'siteSettings',
  media: 'media',
  comments: 'comments',
} as const;

const toIso = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const date = (value as Timestamp).toDate();
    return date.toISOString();
  }
  return '';
};

const articleFromDoc = (snap: QueryDocumentSnapshot): Article => {
  const data = snap.data();
  return {
    ...(data as Article),
    id: snap.id,
    publishedAt: toIso(data.publishedAt),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
};

const authorFromData = (id: string, data: Record<string, unknown>): Author => ({
  ...(data as Author),
  id,
  createdAt: toIso(data.createdAt),
  updatedAt: toIso(data.updatedAt),
});

const authorFromDoc = (snap: QueryDocumentSnapshot): Author => authorFromData(snap.id, snap.data());

const categoryFromDoc = (snap: QueryDocumentSnapshot): Category => ({
  id: snap.id,
  ...(snap.data() as Omit<Category, 'id'>),
});

const adFromDoc = (snap: QueryDocumentSnapshot): Advertisement => {
  const data = snap.data();
  return {
    ...(data as Advertisement),
    id: snap.id,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    startAt: toIso(data.startAt) || undefined,
    endAt: toIso(data.endAt) || undefined,
  };
};

const mediaFromDoc = (snap: QueryDocumentSnapshot): MediaItem => {
  const data = snap.data();
  return {
    ...(data as MediaItem),
    id: snap.id,
    createdAt: toIso(data.createdAt),
  };
};

// ---------------- ARTICLES ---------------- //

export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.articles),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map(articleFromDoc);
  } catch (error) {
    console.error('Gagal mengambil artikel published dari Firestore:', error);
    return [];
  }
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  try {
    const q = query(collection(db, COLLECTIONS.articles), orderBy('createdAt', 'desc'), limit(500));
    const snap = await getDocs(q);
    return snap.docs.map(articleFromDoc);
  } catch (error) {
    console.error('Gagal mengambil artikel admin dari Firestore:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.articles),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const article = articleFromDoc(snap.docs[0]);
    try {
      await updateDoc(doc(db, COLLECTIONS.articles, snap.docs[0].id), {
        views: increment(1),
      });
      article.views = (article.views || 0) + 1;
    } catch (viewError) {
      // A failed view counter must never make the article disappear.
      console.warn('Counter views tidak dapat diperbarui:', viewError);
    }
    return article;
  } catch (error) {
    console.error(`Gagal mengambil artikel dengan slug ${slug}:`, error);
    return null;
  }
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  try {
    const categories = await getCategories();
    const category = categories.find((item) => item.slug === categorySlug);
    if (!category) return [];

    const q = query(
      collection(db, COLLECTIONS.articles),
      where('status', '==', 'published'),
      where('categoryId', '==', category.id),
      orderBy('publishedAt', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map(articleFromDoc);
  } catch (error) {
    console.error(`Gagal mengambil artikel kategori ${categorySlug}:`, error);
    return [];
  }
}

export async function getArticlesByAuthor(authorSlug: string): Promise<Article[]> {
  try {
    const author = await getAuthorProfile(authorSlug);
    if (!author?.id) return [];

    const q = query(
      collection(db, COLLECTIONS.articles),
      where('status', '==', 'published'),
      where('authorSlug', '==', authorSlug),
      orderBy('publishedAt', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map(articleFromDoc);
  } catch (error) {
    console.error(`Gagal mengambil artikel author ${authorSlug}:`, error);
    return [];
  }
}

export async function searchArticles(queryStr: string): Promise<Article[]> {
  const published = await getPublishedArticles();
  const q = queryStr.toLowerCase().trim();
  if (!q) return published;

  return published.filter((article) => (
    article.title.toLowerCase().includes(q) ||
    article.excerpt.toLowerCase().includes(q) ||
    article.categoryName.toLowerCase().includes(q) ||
    article.tags?.some((tag) => tag.toLowerCase().includes(q))
  ));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export async function saveArticle(article: Partial<Article>): Promise<Article> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Sesi admin tidak ditemukan. Silakan login kembali.');

  const author = await getCurrentAuthorProfile();
  if (!author) throw new Error('Profil penulis belum tersedia. Lengkapi profil redaksi terlebih dahulu.');

  const now = new Date().toISOString();
  const title = article.title?.trim();
  if (!title) throw new Error('Judul berita wajib diisi.');
  if (!article.content?.trim()) throw new Error('Isi berita wajib diisi.');
  if (!article.featuredImage?.trim()) throw new Error('Gambar utama wajib diunggah ke Cloudinary.');

  const requestedSlug = article.slug?.trim() || generateSlug(title);
  if (!requestedSlug) throw new Error('Slug artikel tidak valid.');

  const existing = await getAllArticlesAdmin();
  let uniqueSlug = requestedSlug;
  let counter = 2;
  while (existing.some((item) => item.slug === uniqueSlug && item.id !== article.id)) {
    uniqueSlug = `${requestedSlug}-${counter++}`;
  }

  const existingArticle = article.id ? existing.find((item) => item.id === article.id) : undefined;
  const status = article.status === 'draft' ? 'draft' : 'published';
  const publishedAt = status === 'published'
    ? (existingArticle?.publishedAt || article.publishedAt || now)
    : '';

  const payload: Article = {
    id: article.id || `art-${Date.now()}`,
    title,
    slug: uniqueSlug,
    excerpt: article.excerpt?.trim() || '',
    content: article.content.trim(),
    featuredImage: article.featuredImage.trim(),
    featuredImageAlt: article.featuredImageAlt?.trim() || title,
    captionImage: article.captionImage?.trim() || '',
    categoryId: article.categoryId || 'cat-nasional',
    categoryName: article.categoryName || 'Nasional',
    authorId: author.id || currentUser.uid,
    authorName: author.name,
    authorSlug: author.slug,
    authorImage: author.profileImage || '',
    tags: article.tags || [],
    status,
    publishedAt,
    updatedAt: now,
    createdAt: existingArticle?.createdAt || now,
    seoTitle: article.seoTitle?.trim() || title,
    seoDescription: article.seoDescription?.trim() || article.excerpt?.trim().slice(0, 160) || '',
    canonicalUrl: `https://kabarinaja.com/berita/${uniqueSlug}`,
    readingTime: calculateReadingTime(article.content),
    views: existingArticle?.views || article.views || 0,
    sourceName: article.sourceName?.trim() || '',
    sourceUrl: article.sourceUrl?.trim() || '',
    sourceNote: article.sourceNote?.trim() || '',
    isHeadline: !!article.isHeadline,
    isEditorPick: !!article.isEditorPick,
  };

  try {
    await setDoc(doc(db, COLLECTIONS.articles, payload.id), payload);
    return payload;
  } catch (error) {
    console.error('Gagal menyimpan artikel ke Firestore:', error);
    throw new Error('Artikel gagal disimpan ke database. Tidak ada perubahan yang dianggap berhasil.');
  }
}


// ---------------- ARTICLE COMMENTS ---------------- //

export async function getArticleComments(articleId: string): Promise<ArticleComment[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.comments),
      where('articleId', '==', articleId),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((item) => {
        const data = item.data();
        return {
          id: item.id,
          articleId: String(data.articleId || articleId),
          name: String(data.name || ''),
          message: String(data.message || ''),
          createdAt: toIso(data.createdAt),
          likes: Number(data.likes || 0),
        } satisfies ArticleComment;
      })
      .reverse();
  } catch (error) {
    console.error('Gagal mengambil komentar artikel:', error);
    return [];
  }
}

export function subscribeToArticleComments(
  articleId: string,
  onChange: (comments: ArticleComment[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const q = query(
    collection(db, COLLECTIONS.comments),
    where('articleId', '==', articleId),
    orderBy('createdAt', 'desc'),
    limit(500)
  );

  return onSnapshot(
    q,
    (snap) => {
      const comments = snap.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          articleId: String(data.articleId || articleId),
          name: String(data.name || ''),
          message: String(data.message || ''),
          createdAt: toIso(data.createdAt),
          likes: Number(data.likes || 0),
        } satisfies ArticleComment;
      }).reverse();
      onChange(comments);
    },
    (error) => {
      console.error('Gagal memantau komentar artikel:', error);
      onError?.(error);
    },
  );
}

export async function addArticleComment(articleId: string, name: string, message: string): Promise<ArticleComment> {
  const cleanName = name.trim();
  const cleanMessage = message.trim();
  if (cleanName.length < 1 || cleanName.length > 80) {
    throw new Error('Nama wajib diisi dan maksimal 80 karakter.');
  }
  if (cleanMessage.length < 1 || cleanMessage.length > 1000) {
    throw new Error('Pesan wajib diisi dan maksimal 1.000 karakter.');
  }

  try {
    const ref = await addDoc(collection(db, COLLECTIONS.comments), {
      articleId,
      name: cleanName,
      message: cleanMessage,
      createdAt: serverTimestamp(),
      likes: 0,
    });

    return {
      id: ref.id,
      articleId,
      name: cleanName,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
  } catch (error) {
    console.error('Gagal menambahkan komentar artikel:', error);
    throw new Error('Komentar gagal ditambahkan. Silakan coba lagi.');
  }
}

export async function likeArticleComment(commentId: string): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.comments, commentId), {
      likes: increment(1),
    });
  } catch (error) {
    console.error('Gagal menyukai komentar:', error);
    throw new Error('Like komentar gagal disimpan.');
  }
}

export async function deleteArticle(articleId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.articles, articleId));
    return true;
  } catch (error) {
    console.error('Gagal menghapus artikel dari Firestore:', error);
    throw new Error('Artikel gagal dihapus dari database.');
  }
}

// ---------------- CATEGORIES ---------------- //

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, COLLECTIONS.categories), orderBy('order', 'asc'), limit(50));
    const snap = await getDocs(q);
    if (snap.empty) return INITIAL_CATEGORIES;
    return snap.docs.map(categoryFromDoc).filter((category) => category.active !== false);
  } catch (error) {
    console.error('Gagal mengambil kategori dari Firestore:', error);
    return INITIAL_CATEGORIES;
  }
}

export async function updateCategory(category: Category): Promise<Category> {
  try {
    await setDoc(doc(db, COLLECTIONS.categories, category.id), category);
    return category;
  } catch (error) {
    console.error('Gagal menyimpan kategori:', error);
    throw new Error('Kategori gagal disimpan ke database.');
  }
}

export async function ensureInitialCategories(): Promise<Category[]> {
  const snap = await getDocs(query(collection(db, COLLECTIONS.categories), limit(1)));
  if (!snap.empty) return getCategories();
  try {
    await Promise.all(INITIAL_CATEGORIES.map((category) =>
      setDoc(doc(db, COLLECTIONS.categories, category.id), category)
    ));
    return INITIAL_CATEGORIES;
  } catch (error) {
    console.error('Gagal membuat 12 kategori awal:', error);
    throw new Error('Kategori awal gagal dibuat di Firestore.');
  }
}

// ---------------- AUTHOR ---------------- //

export async function getAuthorProfile(authorSlug: string): Promise<Author | null> {
  try {
    const q = query(collection(db, COLLECTIONS.authors), where('slug', '==', authorSlug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return authorFromDoc(snap.docs[0]);
  } catch (error) {
    console.error(`Gagal mengambil profil author ${authorSlug}:`, error);
    return null;
  }
}

export async function getPrimaryAuthorProfile(): Promise<Author | null> {
  try {
    const q = query(collection(db, COLLECTIONS.authors), orderBy('updatedAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return authorFromDoc(snap.docs[0]);
  } catch (error) {
    console.error('Gagal mengambil author utama:', error);
    return null;
  }
}

export async function getCurrentAuthorProfile(): Promise<Author | null> {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.authors, uid));
    return snap.exists() ? authorFromData(snap.id, snap.data() as Record<string, unknown>) : null;
  } catch (error) {
    console.error('Gagal mengambil profil author saat ini:', error);
    return null;
  }
}

export async function saveAuthorProfile(author: Author): Promise<Author> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Sesi admin tidak ditemukan.');

  const updated: Author = {
    ...author,
    id: uid,
    email: author.email || auth.currentUser?.email || '',
    updatedAt: new Date().toISOString(),
    createdAt: author.createdAt || new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, COLLECTIONS.authors, uid), updated, { merge: true });
    return updated;
  } catch (error) {
    console.error('Gagal menyimpan profil author:', error);
    throw new Error('Profil penulis gagal disimpan ke database.');
  }
}

// ---------------- ADS ---------------- //

export async function getActiveAds(): Promise<Advertisement[]> {
  try {
    const q = query(collection(db, COLLECTIONS.ads), where('active', '==', true), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map(adFromDoc);
  } catch (error) {
    console.error('Gagal mengambil iklan aktif:', error);
    return [];
  }
}

export async function getAllAdsAdmin(): Promise<Advertisement[]> {
  try {
    const snap = await getDocs(query(collection(db, COLLECTIONS.ads), limit(500)));
    return snap.docs.map(adFromDoc);
  } catch (error) {
    console.error('Gagal mengambil semua iklan:', error);
    return [];
  }
}

export async function saveAd(ad: Advertisement): Promise<Advertisement> {
  const id = ad.id || `ad-${Date.now()}`;
  const payload: Advertisement = {
    ...ad,
    id,
    updatedAt: new Date().toISOString(),
    createdAt: ad.createdAt || new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, COLLECTIONS.ads, id), payload);
    return payload;
  } catch (error) {
    console.error('Gagal menyimpan iklan:', error);
    throw new Error('Iklan gagal disimpan ke database.');
  }
}

export async function deleteAd(adId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.ads, adId));
    return true;
  } catch (error) {
    console.error('Gagal menghapus iklan:', error);
    throw new Error('Iklan gagal dihapus dari database.');
  }
}

// ---------------- MEDIA ---------------- //

export async function getMediaItems(): Promise<MediaItem[]> {
  try {
    const snap = await getDocs(query(collection(db, COLLECTIONS.media), orderBy('createdAt', 'desc'), limit(200)));
    return snap.docs.map(mediaFromDoc);
  } catch (error) {
    console.error('Gagal mengambil galeri media:', error);
    return [];
  }
}

export async function saveMediaItem(item: MediaItem): Promise<MediaItem> {
  try {
    await setDoc(doc(db, COLLECTIONS.media, item.id), item);
    return item;
  } catch (error) {
    console.error('Gagal menyimpan metadata media:', error);
    throw new Error('Metadata media gagal disimpan ke database.');
  }
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.media, id));
    return true;
  } catch (error) {
    console.error('Gagal menghapus metadata media:', error);
    throw new Error('Media gagal dihapus dari database.');
  }
}

// ---------------- SITE SETTINGS ---------------- //

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.settings, 'general'));
    if (snap.exists()) return snap.data() as SiteSettings;
  } catch (error) {
    console.error('Gagal mengambil site settings:', error);
  }
  return INITIAL_SITE_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  try {
    await setDoc(doc(db, COLLECTIONS.settings, 'general'), settings);
    return settings;
  } catch (error) {
    console.error('Gagal menyimpan site settings:', error);
    throw new Error('Pengaturan portal gagal disimpan ke database.');
  }
}
