export default async function handler(req, res) {
  const apifyToken = process.env.APIFY_TOKEN;
  
  if (!apifyToken) {
    return res.status(500).json({ error: 'Missing APIFY_TOKEN in Vercel environment variables' });
  }

  let pathStr = '';
  if (Array.isArray(req.query.path)) {
    pathStr = '/' + req.query.path.join('/');
  } else if (typeof req.query.path === 'string') {
    pathStr = '/' + req.query.path;
  } else {
    // fallback
    pathStr = req.url.replace(/^\/api\/apify/, '').split('?')[0];
  }

  // Rebuild query string without the 'path' parameter
  const queryObj = { ...req.query };
  delete queryObj.path;
  const searchParams = new URLSearchParams(queryObj);
  const searchStr = searchParams.toString();

  const targetUrl = `https://api.apify.com${pathStr}${searchStr ? '?' + searchStr : ''}`;
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
