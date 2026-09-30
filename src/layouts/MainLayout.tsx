import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#111827]">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-4 md:py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
