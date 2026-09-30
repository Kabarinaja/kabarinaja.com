# KABARIN AJA

Portal berita React + Vite untuk `https://kabarinaja.com`.

## Stack
- React + TypeScript + Vite
- React Router (URL bersih tanpa `#`)
- Firebase Authentication
- Cloud Firestore
- Cloudinary
- Vercel

## 1. Install

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
```

## 2. Environment variables

Salin `.env.example` menjadi `.env.local` untuk development atau masukkan variable yang sama ke Vercel.

**Jangan pernah memasukkan Cloudinary API Secret atau Firebase service-account private key ke frontend.**

## 3. Firebase Authentication

Aktifkan **Email/Password** pada Firebase Authentication.

Buat satu akun publisher/admin secara manual di Firebase Authentication. Login website **tidak mempunyai fitur register/auto-register**.

Email admin default yang dipakai oleh project:

`kabarterbaru.id@gmail.com`

Password tidak disimpan di source code.

## 4. Profil admin Firestore

Rules production menggunakan email admin utama sebagai bootstrap authorization. Setelah login pertama kali, buka `/admin/profile` dan simpan profil penulis.

Dokumen profil akan berada di:

`authors/{UID_AKUN_FIREBASE}`

Contoh field:

```json
{
  "uid": "UID_AKUN_FIREBASE",
  "name": "Nama Publisher",
  "slug": "nama-publisher",
  "role": "superadmin",
  "profileImage": "https://...",
  "bio": "...",
  "skillsDescription": "...",
  "email": "kabarterbaru.id@gmail.com"
}
```

Jika halaman profil mengatakan dokumen belum ada, buat dokumen tersebut sekali di Firestore Console dengan ID UID akun admin dan `role: "superadmin"`, lalu refresh.

## 5. Firestore

Deploy rules dan indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Jika Firebase CLI tidak dipakai, salin isi `firestore.rules` dan `firestore.indexes.json` ke konfigurasi Firebase masing-masing.

## 6. Cloudinary

Cloud name:

`vemsqxke`

Preset artikel:

`kabar_terbaru_articles`

Preset author:

`kabar_terbaru_authors`

Upload dilakukan langsung dari browser memakai unsigned upload preset. API Secret tidak diperlukan di frontend.

## 7. XML otomatis

Vercel menyediakan endpoint serverless yang membaca artikel `published` dari Firestore REST API:

- `/sitemap.xml`
- `/news-sitemap.xml`
- `/rss.xml`

Saat artikel baru diterbitkan, endpoint akan otomatis membaca data terbaru tanpa perlu mengedit file XML secara manual.

## 8. Routing

Project menggunakan React Router dengan URL bersih:

- `/`
- `/kategori/nasional`
- `/berita/slug-berita`
- `/penulis/slug-penulis`
- `/search?q=kata`
- `/admin`
- `/admin/login`

`vercel.json` sudah menangani SPA refresh dan endpoint XML.

## 9. Security

- Tidak ada auto-register.
- Admin route membutuhkan Firebase Auth + authorization role.
- Public dapat mengirim komentar pada artikel yang sudah terbit; komentar bersifat permanen dan hanya field like yang dapat diperbarui.
- Draft tidak dapat dibaca publik.
- Artikel/iklan/kategori tidak dianggap berhasil jika Firestore gagal.
- localStorage hanya dipakai untuk mencegah satu browser mengirim like yang sama berulang kali; jumlah like tetap disimpan di Firestore.
- Media file disimpan di Cloudinary, metadata di Firestore.
- Base64 tidak dipakai sebagai fallback upload.

## 10. Deploy Vercel

Import repository ke Vercel dan masukkan environment variables dari `.env.example`.

Build command:

`npm run build`

Output directory:

`dist`

Tidak perlu menjalankan server Express.
