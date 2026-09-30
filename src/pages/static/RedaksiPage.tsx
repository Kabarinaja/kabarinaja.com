import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { getPrimaryAuthorProfile } from '../../services/db';
import type { Author } from '../../types';

export const RedaksiPage: React.FC = () => {
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => { getPrimaryAuthorProfile().then(setAuthor); }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEO title="Redaksi - KABARIN AJA" description="Informasi redaksi, prinsip editorial, dan kontak KABARIN AJA." canonicalUrl="https://kabarinaja.com/redaksi" />
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 border-b border-gray-200">
        <Link to="/" className="hover:text-[#0b4f8a]">Beranda</Link><ChevronRight className="w-3.5 h-3.5" /><span className="text-gray-900 font-bold">Redaksi</span>
      </nav>

      <div className="bg-white border border-gray-200 p-6 md:p-10 shadow-2xs space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a]">Transparansi Redaksi</span>
          <h1 className="font-serif-headline text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">Redaksi KABARIN AJA</h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">KABARIN AJA dikelola sebagai portal berita dengan satu publisher/penulis utama. Informasi mengenai penulis, kontak, dan kebijakan editorial ditampilkan secara terbuka.</p>
        </div>

        {author && (
          <div className="p-5 bg-[#f8fafc] border border-gray-200">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0b4f8a] mb-3">Publisher / Penulis Utama</div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img src={author.profileImage} alt={author.name} className="w-20 h-20 rounded-full object-cover border border-gray-300" />
              <div className="flex-1">
                <Link to={`/penulis/${author.slug}`} className="font-serif-headline text-xl font-bold text-gray-900 hover:text-[#0b4f8a]">{author.name}</Link>
                <p className="text-xs text-gray-500 mt-1">Publisher / Penulis KABARIN AJA</p>
                {author.bio && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{author.bio}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <section className="border border-gray-200 p-5">
            <h2 className="font-serif-headline text-base font-bold text-[#0b4f8a] border-b border-gray-200 pb-2 mb-3">Prinsip Editorial</h2>
            <ul className="list-disc pl-5 space-y-2 text-xs leading-relaxed">
              <li>Mengutamakan akurasi dan konteks informasi.</li>
              <li>Memeriksa sumber sebelum publikasi sejauh informasi dan waktu memungkinkan.</li>
              <li>Membedakan fakta, kutipan, data, dan pendapat.</li>
              <li>Melakukan koreksi jika ditemukan kesalahan.</li>
              <li>Memberikan ruang untuk hak jawab sesuai kebijakan yang berlaku.</li>
            </ul>
          </section>
          <section className="border border-gray-200 p-5">
            <h2 className="font-serif-headline text-base font-bold text-[#0b4f8a] border-b border-gray-200 pb-2 mb-3">Kontak Redaksi</h2>
            <div className="space-y-3 text-xs">
              <a href="mailto:kabarterbaru.id@gmail.com" className="flex items-center gap-2 hover:text-[#0b4f8a]"><Mail className="w-4 h-4" />kabarterbaru.id@gmail.com</a>
              <a href="tel:+6282379474173" className="flex items-center gap-2 hover:text-[#0b4f8a]"><Phone className="w-4 h-4" />082379474173</a>
              <a href="https://goo.gl/maps/D5wCcmjDQW8Fnor79?g_st=ac" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-[#0b4f8a]"><MapPin className="w-4 h-4 shrink-0" />M7F6+Q6P Lamarantarung, Kabupaten Indramayu, Jawa Barat</a>
            </div>
          </section>
        </div>

        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-xs text-emerald-900 leading-relaxed flex gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <p>KABARIN AJA menyediakan halaman redaksi, kontak, kebijakan privasi, disclaimer, kebijakan editorial, dan kebijakan koreksi sebagai bagian dari transparansi pengelolaan portal.</p>
        </div>
      </div>
    </div>
  );
};
