import { getPublishedArticles, xmlEscape, isoDate } from './_firestore.js';

const categories = ['nasional','daerah','politik','ekonomi','bisnis','teknologi','internasional','otomotif','bola','hiburan','gaya-hidup','pendidikan'];
const pages = ['/','/tentang','/redaksi','/pedoman-media','/kebijakan-editorial','/kebijakan-koreksi','/kontak','/iklan','/kebijakan-privasi','/syarat-ketentuan','/disclaimer','/peta-situs'];

export default async function handler(req, res) {
  try {
    const articles = await getPublishedArticles(1000);
    const urls = [
      ...pages.map(path => ({ loc: `https://kabarinaja.com${path}`, lastmod: new Date().toISOString() })),
      ...categories.map(slug => ({ loc: `https://kabarinaja.com/kategori/${slug}`, lastmod: new Date().toISOString() })),
      ...articles.map(article => ({
        loc: `https://kabarinaja.com/berita/${article.slug}`,
        lastmod: isoDate(article.updatedAt || article.publishedAt)
      }))
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(item => `\n  <url><loc>${xmlEscape(item.loc)}</loc><lastmod>${xmlEscape(item.lastmod)}</lastmod></url>`).join('')}\n</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(body);
  } catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(503).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
}
