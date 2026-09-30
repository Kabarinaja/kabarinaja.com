import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../data/initialData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#111827] text-gray-300 border-t-4 border-[#0b4f8a] mt-12">
      {/* 1. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-3">
              <img
                src="https://cdn.phototourl.com/member/2026-09-30-8535215e-32e4-475a-bc68-2b77533dbc41.png"
                alt="KABARIN AJA"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-[#e65100] font-bold text-xs uppercase tracking-widest mb-2 font-serif-headline">
              KABAR JUJUR UNTUK INDONESIA
            </p>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              KABARIN AJA adalah portal berita independen yang berkomitmen menyajikan fakta akurat, terverifikasi, dan bebas dari distorsi opini. Dikelola secara profesional dengan berpedoman pada Kode Etik Jurnalistik dan Undang-Undang Pers Republik Indonesia.
            </p>

            {/* Redaksi Contact Details */}
            <div className="space-y-2.5 text-xs text-gray-300 border-t border-gray-800 pt-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#e65100] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Alamat Redaksi:</p>
                  <p className="text-gray-400">M7F6+Q6P Lamarantarung, Kabupaten Indramayu, Jawa Barat</p>
                  <a
                    href="https://goo.gl/maps/D5wCcmjDQW8Fnor79?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#38bdf8] hover:underline mt-0.5"
                  >
                    Buka di Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e65100] shrink-0" />
                <div>
                  <span className="text-gray-400">Email: </span>
                  <a href="mailto:kabarterbaru.id@gmail.com" className="text-white hover:text-[#38bdf8]">
                    kabarterbaru.id@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e65100] shrink-0" />
                <div>
                  <span className="text-gray-400">Telepon / WhatsApp: </span>
                  <a href="tel:082379474173" className="text-white hover:text-[#38bdf8]">
                    082379474173
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: 12 Kategori (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-gray-800 pb-2 mb-3 font-serif-headline">
              Kanal Berita
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {INITIAL_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/kategori/${cat.slug}`}
                  className="text-gray-400 hover:text-white transition-colors py-0.5 flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 bg-[#0b4f8a] rounded-full" />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Redaksi & Legal (4 cols) */}
          <div className="lg:col-span-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider border-b border-gray-800 pb-2 mb-3 font-serif-headline">
              Pedoman & Kebijakan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 text-xs mb-6">
              <Link to="/tentang" className="text-gray-400 hover:text-white transition-colors">
                Tentang Kami
              </Link>
              <Link to="/redaksi" className="text-gray-400 hover:text-white transition-colors">
                Susunan Redaksi
              </Link>
              <Link to="/pedoman-media" className="text-gray-400 hover:text-white transition-colors">
                Pedoman Media Siber
              </Link>
              <Link to="/kebijakan-editorial" className="text-gray-400 hover:text-white transition-colors">
                Kebijakan Editorial
              </Link>
              <Link to="/kebijakan-koreksi" className="text-gray-400 hover:text-white transition-colors">
                Kebijakan Koreksi & Ralat
              </Link>
              <Link to="/kontak" className="text-gray-400 hover:text-white transition-colors">
                Kontak Redaksi
              </Link>
              <Link to="/iklan" className="text-gray-400 hover:text-white transition-colors">
                Informasi Pasang Iklan
              </Link>
              <Link to="/peta-situs" className="text-gray-400 hover:text-white transition-colors">
                Peta Situs (Sitemap)
              </Link>
            </div>

            <h3 className="text-white text-xs font-bold uppercase tracking-wider border-b border-gray-800 pb-1.5 mb-2.5 font-serif-headline">
              Ketentuan Hukum
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
              <Link to="/kebijakan-privasi" className="hover:text-white">
                Kebijakan Privasi
              </Link>
              <Link to="/syarat-ketentuan" className="hover:text-white">
                Syarat & Ketentuan
              </Link>
              <Link to="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 2. BOTTOM COPYRIGHT & RSS BAR */}
      <div className="bg-[#090d16] border-t border-gray-800 text-[11px] text-gray-400 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            &copy; {currentYear} <span className="text-white font-semibold">KABARIN AJA</span> (kabarinaja.com). Seluruh hak cipta dilindungi undang-undang.
          </p>

          <div className="flex items-center gap-4 text-gray-400">
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e65100] flex items-center gap-1 transition-colors"
            >
              <span>RSS Feed</span>
            </a>
            <span>•</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <span>Sitemap XML</span>
            </a>
            <span>•</span>
            <a
              href="/news-sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <span>Google News Sitemap</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
