import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ExternalLink, Send, CheckCircle, ChevronRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const KontakPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Informasi Berita / Liputan',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Kontak Redaksi - KABARIN AJA"
        description="Hubungi redaksi KABARIN AJA untuk pengiriman informasi peristiwa, rilis pers, hak jawab, atau kerja sama media."
        canonicalUrl="https://kabarinaja.com/kontak"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Kontak Redaksi</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a]">
            Hubungi Kami
          </span>
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
            Kontak Redaksi & Kantor KABARIN AJA
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kami siap menerima informasi berita, siaran pers, dan pertanyaan publik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* CONTACT DETAILS (5 cols) */}
          <div className="md:col-span-5 space-y-6 text-sm text-gray-700">
            <div className="bg-[#f8fafc] border border-gray-200 p-4 space-y-4 text-xs">
              <div>
                <span className="font-bold text-gray-900 text-sm block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0b4f8a]" />
                  Alamat Redaksi:
                </span>
                <p className="text-gray-600 leading-relaxed">
                  M7F6+Q6P Lamarantarung, Kabupaten Indramayu, Jawa Barat
                </p>
                <a
                  href="https://goo.gl/maps/D5wCcmjDQW8Fnor79?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#0b4f8a] font-bold mt-2 hover:underline"
                >
                  Buka Lokasi di Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <span className="font-bold text-gray-900 text-sm block mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#0b4f8a]" />
                  Email Resmi:
                </span>
                <a
                  href="mailto:kabarterbaru.id@gmail.com"
                  className="text-gray-700 hover:text-[#0b4f8a] font-medium"
                >
                  kabarterbaru.id@gmail.com
                </a>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <span className="font-bold text-gray-900 text-sm block mb-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#0b4f8a]" />
                  Telepon / WhatsApp Hotline:
                </span>
                <a
                  href="tel:082379474173"
                  className="text-gray-700 hover:text-[#0b4f8a] font-medium"
                >
                  082379474173
                </a>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Senin - Sabtu: 08.00 - 18.00 WIB
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-[#0b4f8a] text-xs text-blue-900">
              <p className="font-bold mb-1">Kirimkan Siaran Pers (Press Release):</p>
              <p className="leading-relaxed">
                Siaran pers dari lembaga resmi, kementerian, BUMN, swasta, atau komunitas dapat dikirim langsung dalam format teks / PDF melalui email redaksi.
              </p>
            </div>
          </div>

          {/* CONTACT FORM (7 cols) */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-center text-emerald-900">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-serif-headline text-lg font-bold">Pesan Berhasil Terkirim</h3>
                <p className="text-xs text-emerald-800 mt-1 max-w-sm mx-auto">
                  Terima kasih telah menghubungi redaksi KABARIN AJA. Tim jurnalis kami akan segera menindaklanjuti informasi Anda.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#0b4f8a] hover:underline"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full bg-[#f8fafc] border border-gray-300 p-2 text-xs focus:outline-none focus:border-[#0b4f8a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@contoh.com"
                      className="w-full bg-[#f8fafc] border border-gray-300 p-2 text-xs focus:outline-none focus:border-[#0b4f8a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Nomor HP / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812xxxxxxx"
                      className="w-full bg-[#f8fafc] border border-gray-300 p-2 text-xs focus:outline-none focus:border-[#0b4f8a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Kategori Keperluan
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#f8fafc] border border-gray-300 p-2 text-xs focus:outline-none focus:border-[#0b4f8a]"
                  >
                    <option value="Informasi Berita / Liputan">Informasi Berita / Tip Liputan</option>
                    <option value="Hak Jawab / Koreksi">Hak Jawab / Permohonan Koreksi</option>
                    <option value="Siaran Pers">Pengiriman Siaran Pers</option>
                    <option value="Pemasangan Iklan">Informasi Pemasangan Iklan</option>
                    <option value="Lainnya">Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Isi Pesan / Informasi *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan keterangan detail kejadian, waktu, lokasi, atau sanggahan Anda..."
                    className="w-full bg-[#f8fafc] border border-gray-300 p-2 text-xs focus:outline-none focus:border-[#0b4f8a]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0b4f8a] text-white py-2.5 px-4 text-xs font-bold uppercase tracking-wider hover:bg-[#083b68] flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Pesan ke Redaksi
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
