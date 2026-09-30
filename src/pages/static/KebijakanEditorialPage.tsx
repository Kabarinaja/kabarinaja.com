import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const KebijakanEditorialPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Kebijakan Editorial - KABARIN AJA"
        description="Kebijakan redaksional, independensi jurnalisme, standar penulisan fakta, dan larangan intervensi di KABARIN AJA."
        canonicalUrl="https://kabarinaja.com/kebijakan-editorial"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Kebijakan Editorial</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a]">
            Standar Kerja Redaksi
          </span>
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
            Kebijakan Editorial KABARIN AJA
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pedoman integritas penulisan dan peliputan jurnalistik berimbang
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Kebijakan Editorial <strong>KABARIN AJA</strong> dirancang untuk memastikan seluruh konten yang disajikan kepada publik memiliki nilai kejujuran, akurasi data, keberimbangan perspektif, dan penghormatan terhadap martabat manusia.
          </p>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              1. Independensi Redaksional
            </h2>
            <p className="text-xs text-gray-600">
              Redaksi KABARIN AJA memegang teguh otonomi ruang redaksi (newsroom autonomy). Keputusan peliputan, sudut pandang penulisan, dan penyuntingan tidak dapat diintervensi oleh pemilik modal, pihak sponsor komersial, maupun kekuasaan politik manapun.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              2. Disiplin Verifikasi & Anti-Clickbait
            </h2>
            <p className="text-xs text-gray-600">
              Kami menolak penggunaan judul umpan klik (clickbait) yang memanipulasi rasa penasaran dengan menyembunyikan substansi atau menyajikan informasi yang bertentangan dengan isi artikel. Setiap kutipan dan angka wajib memiliki rujukan sumber yang kredibel dan dapat dipertanggungjawabkan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              3. Perlindungan Narasumber & Korban
            </h2>
            <p className="text-xs text-gray-600">
              KABARIN AJA tidak mempublikasikan identitas, foto, maupun alamat anak di bawah umur yang berhadapan dengan hukum, korban kekerasan seksual, maupun penderita penyakit dengan stigma sosial berat, demi melindungi masa depan dan privasi mereka.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              4. Transparansi Atribusi Sumber
            </h2>
            <p className="text-xs text-gray-600">
              Jika sebuah laporan merujuk pada siaran pers, laporan riset lembaga independen, atau publikasi media lain, redaksi secara transparan mencantumkan nama sumber dan tautan langsung ke dokumen rujukan tersebut.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
