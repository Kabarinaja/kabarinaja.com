export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt?: string;
  captionImage?: string;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  authorSlug: string;
  authorImage?: string;
  tags: string[];
  status: ArticleStatus;
  publishedAt: string; // ISO string
  updatedAt?: string; // ISO string
  createdAt?: string; // ISO string
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  readingTime: number; // in minutes
  views: number;
  // Source Attribution
  sourceName?: string;
  sourceUrl?: string;
  sourceNote?: string;
  // Editorial flags
  isHeadline?: boolean;
  isEditorPick?: boolean;
}


export interface ArticleComment {
  id?: string;
  articleId: string;
  name: string;
  message: string;
  createdAt?: string;
  likes: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  active: boolean;
  articleCount?: number;
}

export interface Author {
  id?: string;
  role?: 'superadmin' | 'writer';
  name: string;
  slug: string;
  profileImage: string;
  bio: string;
  skillsDescription: string;
  email: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type AdType = 'image' | 'html' | 'text';

export type AdPlacement =
  | 'homepage-top'
  | 'homepage-middle'
  | 'homepage-bottom'
  | 'article-top'
  | 'article-middle'
  | 'article-bottom'
  | 'sidebar'
  | 'category-top'
  | 'category-middle'
  | 'footer';

export interface Advertisement {
  id?: string;
  name: string;
  advertiser: string;
  type: AdType;
  imageUrl?: string;
  targetUrl?: string;
  htmlCode?: string;
  textContent?: string;
  placement: AdPlacement;
  pageTarget: 'all' | 'homepage' | 'article' | 'category';
  categoryId?: string;
  active: boolean;
  startAt?: string;
  endAt?: string;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  publicId?: string;
  name: string;
  folder: string;
  size?: number;
  format?: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  domain: string;
  email: string;
  phone: string;
  address: string;
  mapsUrl: string;
  logoUrl: string;
  faviconUrl: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}
