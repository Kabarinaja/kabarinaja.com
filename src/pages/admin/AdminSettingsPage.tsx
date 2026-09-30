import React, { useEffect, useState } from 'react';
import { getSiteSettings, saveSiteSettings } from '../../services/db';
import type { SiteSettings } from '../../types';
import { Settings, Save, CheckCircle, ExternalLink } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getSiteSettings().then((data) => setSettings(data));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setErrorMsg('');
    try {
      await saveSiteSettings(settings);
      setSuccessMsg('Pengaturan situs KABARIN AJA berhasil disimpan.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Pengaturan gagal disimpan.');
    } finally {
      setSaving(false);
    }
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!settings) {
    return <div className="py-20 text-center text-xs text-gray-500">Memuat pengaturan situs...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-serif-headline text-2xl font-bold text-gray-900">
          Pengaturan Portal Berita
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Kelola identitas portal, informasi kontak resmi, dan integrasi teknis.
        </p>
      </div>

      {errorMsg && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs">{errorMsg}</div>}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-gray-200 p-6 shadow-2xs space-y-4 text-xs">
        <h2 className="font-serif-headline text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
          Identitas Portal & Branding
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Nama Portal Berita</label>
            <input
              type="text"
              required
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Tagline Resmi</label>
            <input
              type="text"
              required
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">URL Logo Resmi</label>
          <input
            type="url"
            required
            value={settings.logoUrl}
            onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
            className="w-full p-2 border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#0b4f8a]"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Domain Utama</label>
          <input
            type="text"
            disabled
            value="https://kabarinaja.com"
            className="w-full p-2 border border-gray-300 bg-gray-100 font-mono text-xs text-gray-500 cursor-not-allowed"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Gunakan domain produksi resmi portal KABARIN AJA.
          </p>
        </div>

        <h2 className="font-serif-headline text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 pt-4">
          Kontak & Alamat Kantor Redaksi
        </h2>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Alamat Kantor Redaksi</label>
          <input
            type="text"
            required
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Tautan Google Maps Kantor</label>
          <input
            type="url"
            required
            value={settings.mapsUrl}
            onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
            className="w-full p-2 border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#0b4f8a]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Redaksi</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Nomor Telepon / WhatsApp</label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0b4f8a]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0b4f8a] text-white px-6 py-2 font-bold uppercase tracking-wider hover:bg-[#083b68] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
};
