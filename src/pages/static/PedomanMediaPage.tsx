import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

export const PedomanMediaPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO
        title="Pedoman Pemberitaan Media Siber - KABARIN AJA"
        description="Pedoman Pemberitaan Media Siber yang diberlakukan di portal berita KABARIN AJA sesuai ketentuan Dewan Pers."
        canonicalUrl="https://kabarinaja.com/pedoman-media"
      />

      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Pedoman Media Siber</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a]">
            Standar Regulasi Pers Indonesia
          </span>
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
            Pedoman Pemberitaan Media Siber
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            KABARIN AJA tunduk dan patuh pada Surat Keputusan Dewan Pers Nomor 01/K-DP/III/2012
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi manusia yang dilindungi Pancasila, Undang-Undang Dasar 1945, dan Deklarasi Universal Hak Asasi Manusia PBB. Pengelolaan media siber di <strong>KABARIN AJA</strong> dilaksanakan dengan berpedoman pada prinsip-prinsip berikut:
          </p>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              1. Ruang Lingkup
            </h2>
            <p className="text-xs text-gray-600">
              Media Siber adalah segala bentuk media yang menggunakan wahana internet dan melaksanakan kegiatan jurnalistik, serta memenuhi persyaratan Undang-Undang Pers dan Standar Perusahaan Pers yang ditetapkan Dewan Pers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              2. Verifikasi dan Keberimbangan Berita
            </h2>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
              <li>Setiap berita harus melalui proses verifikasi fakta secara berlapis.</li>
              <li>Berita yang dapat merugikan pihak lain memerlukan verifikasi pada berita yang sama demi memenuhi prinsip keberimbangan (cover both sides).</li>
              <li>Dalam kondisi mendesak untuk kepentingan publik, berita yang belum lengkap verifikasinya dapat disiarkan dengan syarat mencantumkan keterangan bahwa berita tersebut masih memerlukan verifikasi lebih lanjut dan redaksi terus berupaya melengkapinya dalam pembaruan berikutnya.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              3. Isi Buatan Pengguna (User Generated Content)
            </h2>
            <p className="text-xs text-gray-600">
              KABARIN AJA mewajibkan setiap pengguna yang menyampaikan tanggapan atau komentar untuk mematuhi ketentuan perundang-undangan. Redaksi berhak menyunting atau menghapus komentar yang memuat fitnah, kebencian SARA, pornografi, atau ajakan kekerasan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              4. Ralat, Koreksi, dan Hak Jawab
            </h2>
            <p className="text-xs text-gray-600">
              Ralat, koreksi, dan hak jawab mengacu pada Undang-Undang Pers, Kode Etik Jurnalistik, dan Pedoman Pemberitaan Media Siber. Setiap ralat atau koreksi ditautkan langsung pada berita yang bersangkutan dengan mencantumkan waktu ralat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              5. Pencabutan Berita
            </h2>
            <p className="text-xs text-gray-600">
              Berita yang sudah dipublikasikan tidak dapat dicabut karena alasan penyensoran dari pihak luar redaksi, kecuali terkait masalah SARA, kesusilaan, masa depan anak korban kejahatan, atau atas rekomendasi resmi Dewan Pers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-headline text-base font-bold text-gray-900">
              6. Iklan dan Konten Berbayar
            </h2>
            <p className="text-xs text-gray-600">
              KABARIN AJA membedakan secara tegas dan transparan antara artikel berita murni (editorial) dan konten komersial/iklan (advertorial/sponsor).
            </p>
          </section>

          <div className="pt-6 border-t border-gray-200">
            <Link to="/kebijakan-koreksi" className="text-xs font-bold text-[#0b4f8a] hover:underline">
              Pelajari Prosedur Pengajuan Hak Jawab & Koreksi Berita &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
