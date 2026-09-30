import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Mail, Phone, ChevronRight, Check } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const IklanPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Informasi Pasang Iklan - KABARIN AJA"
        description="Peluang periklanan digital, banner promosi, dan advertorial profesional di portal berita KABARIN AJA."
        canonicalUrl="https://kabarinaja.com/iklan"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Informasi Pasang Iklan</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a]">
            Media Kit & Kemitraan Komersial
          </span>
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
            Pasang Iklan di KABARIN AJA
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Jangkau pembaca loyal, terpelajar, dan pengambil keputusan di seluruh penjuru Indonesia
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            KABARIN AJA membuka kesempatan kemitraan promosi bisnis, publikasi kampanye sosial pemerintah, serta peluncuran produk melalui slot banner digital terukur dan artikel advertorial beretika.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="border border-gray-200 p-4 bg-[#f8fafc]">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Display Banner</h3>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Top Leaderboard
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  In-Article Rectangle
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Sticky Sidebar
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 p-4 bg-[#f8fafc]">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Advertorial Berita</h3>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Artikel ulasan mendalam
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Label Sponsor Transparan
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Terindeks Google & SEO
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 p-4 bg-[#f8fafc]">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Kemitraan Daerah</h3>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Publikasi Pemda & BUMD
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Liputan Khusus Lapangan
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Distribusi Kanal Nasional
                </li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm mb-2">
              Hubungi Divisi Iklan & Kerja Sama:
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Dapatkan proposal rate-card resmi dan estimasi jangkauan tayangan dengan menghubungi:
            </p>
            <div className="flex flex-wrap gap-6 text-xs font-semibold">
              <a href="mailto:kabarterbaru.id@gmail.com" className="text-[#0b4f8a] hover:underline flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> kabarterbaru.id@gmail.com
              </a>
              <a href="tel:082379474173" className="text-[#0b4f8a] hover:underline flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> WhatsApp: 082379474173
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
