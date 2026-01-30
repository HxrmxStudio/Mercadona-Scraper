/**
 * Vercel Serverless Function - Mercadona API Proxy
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the path from query params (set by vercel.json rewrite)
    const pathSegments = req.query.path;
    const apiPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments || '';

    // Build query string excluding 'path' param
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'path') {
        queryParams.append(key, String(value));
      }
    }

    const queryString = queryParams.toString();
    const url = `https://tienda.mercadona.es/api/${apiPath}${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MercadonaScraper/1.0'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Mercadona API error: ${response.status}`
      });
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
