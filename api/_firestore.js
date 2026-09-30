const PROJECT_ID = 'kabarterbaru-ed022';
const ENDPOINT = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default):runQuery`;

function valueToJs(value) {
  if (!value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return Boolean(value.booleanValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  return null;
}

export async function getPublishedArticles(limit = 1000) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'articles' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'status' },
            op: 'EQUAL',
            value: { stringValue: 'published' }
          }
        },
        orderBy: [{ field: { fieldPath: 'publishedAt' }, direction: 'DESCENDING' }],
        limit
      }
    })
  });

  if (!response.ok) throw new Error(`Firestore REST error ${response.status}`);
  const rows = await response.json();
  return rows.filter(row => row.document).map(row => {
    const fields = row.document.fields || {};
    const article = {};
    for (const [key, field] of Object.entries(fields)) article[key] = valueToJs(field);
    return { id: row.document.name.split('/').pop(), ...article };
  });
}

export function xmlEscape(input) {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function isoDate(value) {
  const date = new Date(value || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}
