import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  categoryName?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export const SEO: React.FC<SEOProps> = ({
  title = 'KABARIN AJA - Kabar Jujur untuk Indonesia',
  description = 'Portal Berita Terpercaya dan Jujur untuk Indonesia - Berita Nasional, Daerah, Politik, Ekonomi, Bisnis, Teknologi, Terkini.',
  canonicalUrl = 'https://kabarinaja.com/',
  imageUrl = 'https://cdn.phototourl.com/member/2026-09-30-8cf912e0-15fa-419a-8730-cf9bd68d8b65.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  authorName,
  categoryName,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title.includes('KABARIN AJA') ? title : `${title} - KABARIN AJA`;
    document.title = formattedTitle;

    // Helper function to set or create meta tag
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const nameMatch = selector.match(/meta\[name="([^"]+)"\]/);
          if (nameMatch) (element as HTMLMetaElement).setAttribute('name', nameMatch[1]);
        } else if (selector.startsWith('meta[property=')) {
          const propMatch = selector.match(/meta\[property="([^"]+)"\]/);
          if (propMatch) (element as HTMLMetaElement).setAttribute('property', propMatch[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // 2. Meta description
    setMetaTag('meta[name="description"]', 'content', description);

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. OpenGraph
    setMetaTag('meta[property="og:site_name"]', 'content', 'KABARIN AJA');
    setMetaTag('meta[property="og:title"]', 'content', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:type"]', 'content', type);
    setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'content', imageUrl);

    if (publishedTime) {
      setMetaTag('meta[property="article:published_time"]', 'content', publishedTime);
    }
    if (modifiedTime) {
      setMetaTag('meta[property="article:modified_time"]', 'content', modifiedTime);
    }
    if (authorName) {
      setMetaTag('meta[property="article:author"]', 'content', authorName);
    }
    if (categoryName) {
      setMetaTag('meta[property="article:section"]', 'content', categoryName);
    }

    // 5. Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', imageUrl);

    // 6. JSON-LD Structured Data
    const existingScript = document.getElementById('dynamic-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'dynamic-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [
    title,
    description,
    canonicalUrl,
    imageUrl,
    type,
    publishedTime,
    modifiedTime,
    authorName,
    categoryName,
    jsonLd,
  ]);

  return null;
};
