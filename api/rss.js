import { getPublishedArticles, xmlEscape, isoDate } from './_firestore.js';

function rssDate(value) { return new Date(isoDate(value)).toUTCString(); }
function stripHtml(value) { return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }

export default async function handler(req, res) {
  try {
    const articles = (await getPublishedArticles(50));
    const items = articles.map(article => `\n    <item><title>${xmlEscape(article.title)}</title><link>https://kabarinaja.com/berita/${xmlEscape(article.slug)}</link><guid isPermaLink="true">https://kabarinaja.com/berita/${xmlEscape(article.slug)}</guid><pubDate>${xmlEscape(rssDate(article.publishedAt))}</pubDate><category>${xmlEscape(article.categoryName)}</category><author>${xmlEscape(article.authorName || '')}</author><description>${xmlEscape(stripHtml(article.excerpt || ''))}</description></item>`).join('');
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>KABARIN AJA - Kabar Jujur untuk Indonesia</title><link>https://kabarinaja.com</link><description>Portal berita KABARIN AJA.</description><language>id</language><atom:link href="https://kabarinaja.com/rss.xml" rel="self" type="application/rss+xml"/>${items}\n  </channel></rss>`;
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(body);
  } catch (error) {
    console.error(error);
    return res.status(503).setHeader('Content-Type', 'application/rss+xml; charset=utf-8').send('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>KABARIN AJA</title></channel></rss>');
  }
}
