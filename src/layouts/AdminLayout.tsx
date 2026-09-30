import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Megaphone,
  User,
  Settings,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const navItems = [
    { label: 'Ringkasan Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Semua Artikel', to: '/admin/articles', icon: FileText, exact: true },
    { label: 'Tulis Artikel Baru', to: '/admin/articles/new', icon: PlusCircle, exact: false },
    { label: 'Kelola Kategori', to: '/admin/categories', icon: FolderTree, exact: false },
    { label: 'Kelola Iklan', to: '/admin/ads', icon: Megaphone, exact: false },
    { label: 'Galeri Media', to: '/admin/media', icon: ImageIcon, exact: false },
    { label: 'Profil Penulis', to: '/admin/profile', icon: User, exact: false },
    { label: 'Pengaturan Portal', to: '/admin/settings', icon: Settings, exact: false },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      {/* TOP HEADER */}
      <header className="bg-[#0b4f8a] text-white h-14 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-1.5 hover:bg-black/20 rounded-xs"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-serif-headline font-bold text-lg tracking-wide">
              KABARIN AJA
            </span>
            <span className="bg-[#e65100] text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs">
              CMS Redaksi
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xs transition-colors"
          >
            <span>Lihat Portal Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="hidden sm:block text-right">
            <p className="font-semibold">{currentUser?.email || 'Redaktur Pelaksana'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-600/80 hover:bg-red-700 px-2.5 py-1.5 rounded-xs font-semibold transition-colors"
            title="Keluar dari CMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT WITH SIDEBAR */}
      <div className="flex-grow flex">
        {/* SIDEBAR DESKTOP */}
        <aside
          className={`${
            mobileNavOpen ? 'block' : 'hidden'
          } md:block w-64 bg-white border-r border-gray-200 p-4 shrink-0 flex flex-col justify-between`}
        >
          <nav className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
              Menu Pengelolaan
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xs transition-colors ${
                    isActive
                      ? 'bg-[#0b4f8a] text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#0b4f8a]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xs text-[11px] text-gray-600">
              <p className="font-bold text-gray-800 mb-0.5">Sistem Berita Tunggal</p>
              <p className="text-gray-500 leading-tight">
                Dikelola oleh 1 publisher / editor profesional.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN ADMIN WORKSPACE */}
        <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-7xl w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
