import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, AlertCircle } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const KebijakanKoreksiPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Kebijakan Koreksi & Hak Jawab - KABARIN AJA"
        description="Tata cara pengajuan hak jawab, hak koreksi, dan ralat pemberitaan di portal berita KABARIN AJA."
        canonicalUrl="https://kabarinaja.com/kebijakan-koreksi"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Kebijakan Koreksi & Hak Jawab</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a]">
            Layanan Pembaca & Hak Jawab
          </span>
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
            Kebijakan Koreksi, Ralat, dan Hak Jawab
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Berdasarkan Pasal 1, Pasal 5, dan Pasal 6 UU No. 40 Tahun 1999 tentang Pers
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            KABARIN AJA menyadari sepenuhnya bahwa kekeliruan fakta, ejaan, nama, angka statistik, atau konteks peristiwa dapat terjadi dalam dinamika penerbitan berita digital. Kami berkomitmen untuk segera memperbaiki setiap kesalahan data secara terbuka dan akuntabel.
          </p>

          <div className="p-4 bg-[#f8fafc] border-l-4 border-[#0b4f8a] text-xs text-gray-700 space-y-2">
            <h2 className="font-bold text-sm text-gray-900">Definisi Hak Jawab & Hak Koreksi:</h2>
            <p>
              <strong>Hak Jawab:</strong> Hak seseorang atau sekelompok orang untuk memberikan tanggapan atau sanggahan terhadap pemberitaan berupa peristiwa yang merugikan nama baiknya.
            </p>
            <p>
              <strong>Hak Koreksi:</strong> Hak setiap orang untuk mengoreksi atau membetulkan kekeliruan informasi yang diberitakan oleh pers, baik tentang dirinya maupun tentang orang lain.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              Tata Cara Mengajukan Hak Jawab / Koreksi:
            </h2>
            <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
              <li>
                Kirimkan surat atau pernyataan resmi melalui email redaksi ke:{' '}
                <a href="mailto:kabarterbaru.id@gmail.com" className="text-[#0b4f8a] font-bold underline">
                  kabarterbaru.id@gmail.com
                </a>{' '}
                dengan subjek: <strong>[PERMOHONAN HAK JAWAB / KOREKSI] - Judul Berita</strong>.
              </li>
              <li>Sertakan tautan (URL) artikel yang bersangkutan di KABARIN AJA.</li>
              <li>Jelaskan secara spesifik bagian kalimat, data, atau kutipan yang dinilai keliru beserta fakta/bukti pendukung yang sahih.</li>
              <li>Lampirkan identitas resmi pemohon (KTP/identitas instansi resmi).</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              Tindakan Redaksi:
            </h2>
            <p className="text-xs text-gray-600">
              Setelah verifikasi data selesai dilakukan, redaksi akan:
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
              <li>Memperbarui dan meralat langsung naskah artikel yang bersangkutan.</li>
              <li>Menyematkan boks catatan ralat (editor's note) di bagian bawah atau atas artikel dengan mencantumkan tanggal dan rincian koreksi.</li>
              <li>Jika dipandang perlu, redaksi akan mempublikasikan artikel hak jawab terpisah yang ditautkan ke artikel awal.</li>
            </ul>
          </section>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Kontak Cepat Redaksi: WhatsApp <strong>082379474173</strong> | Email:{' '}
              <a href="mailto:kabarterbaru.id@gmail.com" className="text-[#0b4f8a] underline">
                kabarterbaru.id@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
