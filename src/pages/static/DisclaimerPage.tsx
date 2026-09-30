import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Disclaimer (Penafian) - KABARIN AJA"
        description="Pernyataan penafian tanggung jawab materi dan opini di portal berita KABARIN AJA."
        canonicalUrl="https://kabarinaja.com/disclaimer"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Disclaimer</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950">
            Penafian (Disclaimer)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Ketentuan batas tanggung jawab informasi dan konten pihak ketiga
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Seluruh materi berita yang disajikan di <strong>KABARIN AJA</strong> bertujuan semata-mata untuk penyebaran informasi umum yang mendidik dan faktual bagi masyarakat luas.
          </p>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              1. Akurasi & Perkembangan Peristiwa
            </h2>
            <p className="text-xs text-gray-600">
              Meskipun redaksi berupaya keras menyajikan data yang akurat pada saat berita dipublikasikan, fakta peristiwa di lapangan dapat berkembang seiring berjalannya waktu. Redaksi tidak bertanggung jawab atas keputusan finansial, investasi, atau tindakan hukum pribadi yang diambil pembaca hanya berdasarkan artikel berita tanpa verifikasi profesional independen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              2. Opini Kolumnis & Narasumber
            </h2>
            <p className="text-xs text-gray-600">
              Opini, pandangan politik, atau analisis dalam artikel kolom atau wawancara narasumber merupakan tanggung jawab penuh penulis/narasumber bersangkutan dan tidak selalu mencerminkan sikap resmi institusi KABARIN AJA.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              3. Tautan Pihak Ketiga & Iklan
            </h2>
            <p className="text-xs text-gray-600">
              KABARIN AJA dapat memuat tautan ke situs web eksternal atau materi iklan sponsor. Kami tidak memiliki kendali atas isi, kebijakan privasi, atau keabsahan produk yang ditawarkan di situs pihak ketiga tersebut.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
