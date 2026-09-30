import { getPublishedArticles, xmlEscape, isoDate } from './_firestore.js';

export default async function handler(req, res) {
  try {
    const now = Date.now();
    const articles = (await getPublishedArticles(1000))
      .filter(article => {
        const published = new Date(article.publishedAt || 0).getTime();
        return Number.isFinite(published) && now - published <= 48 * 60 * 60 * 1000;
      })
      .slice(0, 1000);

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articles.map(article => `\n  <url><loc>https://kabarinaja.com/berita/${xmlEscape(article.slug)}</loc><news:news><news:publication><news:name>KABARIN AJA</news:name><news:language>id</news:language></news:publication><news:publication_date>${xmlEscape(isoDate(article.publishedAt))}</news:publication_date><news:title>${xmlEscape(article.title)}</news:title></news:news></url>`).join('')}\n</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(body);
  } catch (error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(503).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"></urlset>');
  }
}
