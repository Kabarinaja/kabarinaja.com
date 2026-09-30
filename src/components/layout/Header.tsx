import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Flame } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import { getCategories } from '../../services/db';
import type { Category } from '../../types';

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });
  }, []);

  // Format today's date in Indonesian
  const getTodayDateIndonesian = () => {
    const today = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
      {/* 2. MAIN BRAND HEADER */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: [ ☰ Menu Button ] [ Logo KABARIN AJA ] */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1 text-gray-800 hover:text-[#0b4f8a] focus:outline-none flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Toggle navigasi"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center justify-start gap-2.5 sm:gap-4 shrink-0 min-w-0">
            <img
              src="https://cdn.phototourl.com/member/2026-09-30-8cf912e0-15fa-419a-8730-cf9bd68d8b65.png"
              alt="KABARIN AJA"
              className="block h-12 sm:h-14 md:h-16 w-[138px] sm:w-[165px] md:w-[185px] max-w-[42vw] object-contain object-left shrink-0"
            />
            <div className="hidden sm:block border-l-2 border-gray-300 pl-3.5 py-1">
              <span className="block text-[11px] uppercase font-bold tracking-widest text-[#0b4f8a]">
                Portal Berita Nasional
              </span>
              <span className="block text-xs font-semibold text-gray-600">
                Kabar Jujur untuk Indonesia
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: [ 🔍 Search ] */}
        <div className="flex items-center justify-end shrink-0">
          {/* Search Bar (Desktop / Tablet) */}
          <div className="hidden md:flex items-center max-w-sm w-56 lg:w-72">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Cari berita, topik, atau peristiwa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-gray-300 rounded-xs pl-3 pr-9 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0b4f8a] focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0b4f8a] cursor-pointer"
                aria-label="Cari"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Mobile Search Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-700 hover:text-[#0b4f8a] cursor-pointer"
              aria-label="Cari berita"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Input (Mobile) */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xs pl-3 pr-9 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#0b4f8a]"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0b4f8a] cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 3. CATEGORY NAVIGATION BAR (12 Categories) */}
      <nav className="bg-[#0b4f8a] text-white overflow-x-auto no-scrollbar shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center whitespace-nowrap">
          <Link
            to="/"
            className={`py-2.5 px-3 text-xs md:text-sm font-bold tracking-wide uppercase transition-colors border-b-2 ${
              location.pathname === '/'
                ? 'border-[#e65100] text-white bg-black/15'
                : 'border-transparent text-white/90 hover:text-white hover:bg-black/10'
            }`}
          >
            Home
          </Link>

          {categories.map((cat) => {
            const isActive = location.pathname === `/kategori/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                to={`/kategori/${cat.slug}`}
                className={`py-2.5 px-3 text-xs md:text-sm font-semibold tracking-wide uppercase transition-colors border-b-2 ${
                  isActive
                    ? 'border-[#e65100] text-white bg-black/15'
                    : 'border-transparent text-white/90 hover:text-white hover:bg-black/10'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 4. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] sm:top-[120px] bg-black/50 z-50 flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-xl overflow-y-auto p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-gray-200 pb-3 mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Kategori Berita
                </span>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1.5 px-2 font-bold text-[#0b4f8a] hover:bg-gray-100 rounded-xs"
                  >
                    Beranda
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/kategori/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1.5 px-2 font-medium text-gray-800 hover:bg-gray-100 rounded-xs"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Informasi Redaksi
                </span>
                <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                  <Link to="/tentang" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0b4f8a]">
                    Tentang Kami
                  </Link>
                  <Link to="/redaksi" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0b4f8a]">
                    Susunan Redaksi
                  </Link>
                  <Link to="/pedoman-media" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0b4f8a]">
                    Pedoman Media Siber
                  </Link>
                  <Link to="/kebijakan-editorial" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0b4f8a]">
                    Kebijakan Editorial
                  </Link>
                  <Link to="/kebijakan-koreksi" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0b4f8a]">
                    Kebijakan Koreksi & Hak Jawab
                  </Link>
                  <Link to="/kontak" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0b4f8a]">
                    Kontak Redaksi
                  </Link>
                  <Link to="/iklan" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0b4f8a]">
                    Info Pasang Iklan
                  </Link>
                  <Link to="/peta-situs" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0b4f8a]">
                    Peta Situs
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
