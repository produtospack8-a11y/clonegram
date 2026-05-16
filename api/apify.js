export default async function handler(req, res) {
  const apifyToken = process.env.APIFY_TOKEN;
  
  if (!apifyToken) {
    return res.status(500).json({ error: 'Missing APIFY_TOKEN in Vercel environment variables' });
  }

  // A URL da requisição vai ser, por exemplo, /api/apify/v2/acts/xxxx
  // Extraímos tudo depois de /api/apify
  const targetPath = req.url.replace(/^\/api\/apify/, '');
  const targetUrl = `https://api.apify.com${targetPath}`;

  try {
    const options = {
      method: req.method,
      headers: {
        Authorization: `Bearer ${apifyToken}`,
        'Content-Type': 'application/json',
      },
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    }

    const response = await fetch(targetUrl, options);
    
    // Ler como texto primeiro, e tentar passar adiante com os cabeçalhos originais ou ao menos json
    const data = await response.text();
    
    const contentType = response.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);
    
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Apify Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Internal proxy error' });
  }
}
