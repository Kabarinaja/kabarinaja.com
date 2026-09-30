import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Award, CheckCircle, ChevronRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const TentangPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Tentang Kami - KABARIN AJA"
        description="Mengenal portal berita KABARIN AJA, visi misi jurnalistik, komitmen independensi, dan nilai kejujuran untuk rakyat Indonesia."
        canonicalUrl="https://kabarinaja.com/tentang"
      />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Tentang Kami</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a]">
            Profil Institusi Media
          </span>
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
            Tentang KABARIN AJA
          </h1>
          <p className="text-sm font-semibold text-[#e65100] mt-1 font-serif-headline">
            "KABAR JUJUR UNTUK INDONESIA"
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>KABARIN AJA</strong> (<em>kabarinaja.com</em>) adalah portal media siber nasional independen yang didirikan dengan semangat menyajikan informasi yang jujur, faktual, jernih, dan berimbang bagi seluruh lapisan masyarakat Indonesia.
          </p>

          <p>
            Di era banjir informasi digital yang kerap dicemari berita bohong (hoaks), umpan klik (clickbait) yang menyesatkan, dan polarisasi opini, KABARIN AJA hadir sebagai rujukan terpercaya yang menempatkan kebenaran data dan disiplin verifikasi di atas kecepatan semu.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-5 bg-slate-50 border-t-2 border-[#0b4f8a]">
              <div className="flex items-center gap-2 font-bold text-[#0b4f8a] text-base mb-2 font-serif-headline">
                <Eye className="w-5 h-5" />
                Visi Kami
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Menjadi portal berita digital rujukan nomor satu di Indonesia yang menjunjung tinggi etika jurnalistik, mencerdaskan kehidupan bangsa, serta mengawal transparansi demokrasi secara independen.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border-t-2 border-[#e65100]">
              <div className="flex items-center gap-2 font-bold text-[#e65100] text-base mb-2 font-serif-headline">
                <Shield className="w-5 h-5" />
                Misi Utama
              </div>
              <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                <li>Menyajikan berita dengan disiplin verifikasi ketat (check and recheck).</li>
                <li>Menjaga independensi redaksi dari kepentingan politik praktis dan pemodal.</li>
                <li>Menyediakan ruang klarifikasi dan hak jawab yang setara dan transparan.</li>
                <li>Memberdayakan literasi digital publik melalui liputan mendalam.</li>
              </ul>
            </div>
          </div>

          <h2 className="font-serif-headline text-lg font-bold text-gray-900 pt-4 border-t border-gray-100">
            Komitmen Kejujuran & Independensi
          </h2>
          <p>
            Setiap karya jurnalistik di KABARIN AJA diproduksi dan disunting oleh jurnalis profesional berdedikasi tinggi. Kami mematuhi sepenuhnya Undang-Undang Republik Indonesia Nomor 40 Tahun 1999 tentang Pers serta Kode Etik Jurnalistik yang ditetapkan oleh Dewan Pers.
          </p>

          <div className="bg-[#f8fafc] border border-gray-200 p-4 space-y-2 text-xs text-gray-600">
            <p className="font-bold text-gray-900 text-sm">Prinsip Kerja Redaksi:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Uji Informasi & Verifikasi Sumber</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Keberimbangan & Hak Jawab (Cover Both Sides)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pemisahan Faktual Antara Berita & Opini</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Koreksi Terbuka Tanpa Sembunyi-Sembunyi</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-xs">
            <Link to="/redaksi" className="text-[#0b4f8a] font-bold hover:underline">
              Lihat Struktur Dewan Redaksi &rarr;
            </Link>
            <Link to="/pedoman-media" className="text-[#0b4f8a] font-bold hover:underline">
              Baca Pedoman Pemberitaan Media Siber &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
