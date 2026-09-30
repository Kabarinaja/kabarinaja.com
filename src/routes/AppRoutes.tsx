import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { ArticlePage } from '../pages/ArticlePage';
import { CategoryPage } from '../pages/CategoryPage';
import { AuthorPage } from '../pages/AuthorPage';
import { SearchPage } from '../pages/SearchPage';

// Static & Institutional Pages
import { TentangPage } from '../pages/static/TentangPage';
import { RedaksiPage } from '../pages/static/RedaksiPage';
import { PedomanMediaPage } from '../pages/static/PedomanMediaPage';
import { KebijakanEditorialPage } from '../pages/static/KebijakanEditorialPage';
import { KebijakanKoreksiPage } from '../pages/static/KebijakanKoreksiPage';
import { KontakPage } from '../pages/static/KontakPage';
import { IklanPage } from '../pages/static/IklanPage';
import { KebijakanPrivasiPage } from '../pages/static/KebijakanPrivasiPage';
import { SyaratKetentuanPage } from '../pages/static/SyaratKetentuanPage';
import { DisclaimerPage } from '../pages/static/DisclaimerPage';
import { PetaSitusPage } from '../pages/static/PetaSitusPage';

// Admin CMS Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminArticlesListPage } from '../pages/admin/AdminArticlesListPage';
import { AdminArticleEditorPage } from '../pages/admin/AdminArticleEditorPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminAdsPage } from '../pages/admin/AdminAdsPage';
import { AdminProfilePage } from '../pages/admin/AdminProfilePage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminMediaPage } from '../pages/admin/AdminMediaPage';

// 404 Page
const NotFoundPage: React.FC = () => (
  <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
    <span className="font-serif-headline text-6xl font-extrabold text-[#0b4f8a]">404</span>
    <h1 className="font-serif-headline text-2xl font-bold text-gray-900">
      Halaman Tidak Ditemukan
    </h1>
    <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
      Mohon maaf, halaman berita atau arsip yang Anda tuju mungkin telah dipindahkan, berganti judul permalink, atau sudah tidak aktif.
    </p>
    <div className="pt-4">
      <Link
        to="/"
        className="inline-block bg-[#0b4f8a] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-[#083b68] transition-colors"
      >
        Kembali ke Beranda KABARIN AJA
      </Link>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC PORTAL ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/berita/:slug" element={<ArticlePage />} />
        <Route path="/kategori/:categorySlug" element={<CategoryPage />} />
        <Route path="/penulis/:authorSlug" element={<AuthorPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cari" element={<SearchPage />} />

        {/* Institutional & Legal Pages */}
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/redaksi" element={<RedaksiPage />} />
        <Route path="/pedoman-media" element={<PedomanMediaPage />} />
        <Route path="/kebijakan-editorial" element={<KebijakanEditorialPage />} />
        <Route path="/kebijakan-koreksi" element={<KebijakanKoreksiPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="/iklan" element={<IklanPage />} />
        <Route path="/kebijakan-privasi" element={<KebijakanPrivasiPage />} />
        <Route path="/syarat-ketentuan" element={<SyaratKetentuanPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/peta-situs" element={<PetaSitusPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ADMIN AUTH */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ADMIN PROTECTED CMS */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="articles" element={<AdminArticlesListPage />} />
        <Route path="articles/new" element={<AdminArticleEditorPage />} />
        <Route path="articles/edit/:id" element={<AdminArticleEditorPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="ads" element={<AdminAdsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="media" element={<AdminMediaPage />} />
      </Route>
    </Routes>
  );
};
