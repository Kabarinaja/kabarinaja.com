import React, { useEffect, useState } from 'react';
import type { Advertisement, AdPlacement } from '../../types';
import { getActiveAds } from '../../services/db';

interface AdSlotProps {
  placement: AdPlacement;
  pageTarget?: 'all' | 'homepage' | 'article' | 'category';
  categoryId?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  placement,
  pageTarget = 'all',
  categoryId,
  className = '',
}) => {
  const [ad, setAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    let mounted = true;
    getActiveAds().then((ads) => {
      if (!mounted) return;
      // Filter matching ads
      const matches = ads.filter((item) => {
        if (!item.active) return false;
        if (item.placement !== placement) return false;

        // check page target
        if (item.pageTarget !== 'all' && item.pageTarget !== pageTarget) return false;
        if (item.categoryId && categoryId && item.categoryId !== categoryId) return false;

        // check date range
        const now = new Date();
        if (item.startAt && new Date(item.startAt) > now) return false;
        if (item.endAt && new Date(item.endAt) < now) return false;

        return true;
      });

      if (matches.length > 0) {
        // Sort by priority descending
        matches.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        setAd(matches[0]);
      } else {
        setAd(null);
      }
    });

    return () => {
      mounted = false;
    };
  }, [placement, pageTarget, categoryId]);

  if (!ad) {
    return null; // Return nothing if no ad is active (per instruction section 19)
  }

  return (
    <div className={`my-4 border border-gray-200 bg-white p-2 text-center text-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-100 pb-1 mb-2 text-[10px] text-gray-400 uppercase tracking-wider">
        <span>Sponsor / Iklan</span>
        <span>{ad.advertiser || 'KABARIN AJA Media'}</span>
      </div>

      {ad.type === 'image' && ad.imageUrl && (
        ad.targetUrl ? (
          <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="block group overflow-hidden">
            <img src={ad.imageUrl} alt={ad.name} className="w-full h-auto max-h-56 object-cover mx-auto transition-transform group-hover:scale-[1.01]" loading="lazy" />
          </a>
        ) : (
          <div className="block overflow-hidden">
            <img src={ad.imageUrl} alt={ad.name} className="w-full h-auto max-h-56 object-cover mx-auto" loading="lazy" />
          </div>
        )
      )}

      {ad.type === 'text' && (
        <div className="py-3 px-4 bg-gray-50 text-left border-l-2 border-[#0b4f8a]">
          <p className="text-sm font-medium text-gray-800 mb-1">{ad.name}</p>
          <p className="text-xs text-gray-600 mb-2 leading-relaxed">{ad.textContent}</p>
          {ad.targetUrl && (
            <a
              href={ad.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-semibold text-[#0b4f8a] hover:underline"
            >
              Kunjungi Tautan &rarr;
            </a>
          )}
        </div>
      )}

      {ad.type === 'html' && ad.htmlCode && (
        <div
          className="overflow-x-auto py-2"
          dangerouslySetInnerHTML={{ __html: ad.htmlCode }}
        />
      )}
    </div>
  );
};
