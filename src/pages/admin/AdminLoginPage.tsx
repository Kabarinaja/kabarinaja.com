import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('kabarterbaru.id@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.warn('Firebase login attempt failed:', err);
      setError('Email atau kata sandi salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b4f8a] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border-t-4 border-[#e65100] shadow-2xl p-6 sm:p-8">
        
        {/* LOGO & TITLE */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-3">
            <img
              src="https://cdn.phototourl.com/member/2026-09-30-8cf912e0-15fa-419a-8730-cf9bd68d8b65.png"
              alt="KABARIN AJA"
              className="h-12 mx-auto object-contain"
            />
          </Link>
          <h1 className="font-serif-headline text-xl font-bold text-gray-900">
            Sistem Manajemen Redaksi
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Akses Terbatas: Publisher & Pemimpin Redaksi
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">
              Email Redaksi
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email admin"
                className="w-full border border-gray-300 rounded-xs pl-9 pr-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0b4f8a]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-xs pl-9 pr-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#0b4f8a]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b4f8a] text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#083b68] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <Link to="/" className="hover:text-[#0b4f8a] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Ke Halaman Depan
          </Link>
          <span>kabarinaja.com</span>
        </div>
      </div>
    </div>
  );
};
