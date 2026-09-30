import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#0b4f8a] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-[#475569]">Memverifikasi akses redaksi...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif-headline text-xl font-bold text-gray-900">Akses administrator ditolak</h1>
        <p className="text-sm text-gray-600 max-w-md mt-2">
          Akun ini berhasil login, tetapi belum memiliki peran redaksi yang diizinkan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
