/**
 * Vercel Serverless Function - Mercadona API Proxy
 * Single endpoint that proxies requests to Mercadona's API
 * Usage: /api/proxy?endpoint=categories&lang=es&wh=08001
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the endpoint path from query params
    const { endpoint, ...queryParams } = req.query;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    // Build query string
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      params.append(key, String(value));
    }

    const queryString = params.toString();
    const url = `https://tienda.mercadona.es/api/${endpoint}${queryString ? '?' + queryString : ''}`;

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

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
