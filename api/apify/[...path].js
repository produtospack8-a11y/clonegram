const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']);

export const config = {
  maxDuration: 120,
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', [...ALLOWED_METHODS, 'OPTIONS'].join(', '));
    return res.status(204).end();
  }

  if (!ALLOWED_METHODS.has(req.method)) {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const apifyToken = process.env.APIFY_TOKEN;

  if (!apifyToken) {
    return res.status(500).json({
      error: 'Missing APIFY_TOKEN in Vercel environment variables',
    });
  }

  let pathStr = '';
  if (Array.isArray(req.query.path)) {
    pathStr = '/' + req.query.path.join('/');
  } else if (typeof req.query.path === 'string') {
    pathStr = '/' + req.query.path;
  } else {
    pathStr = req.url.replace(/^\/api\/apify/, '').split('?')[0];
  }

  const queryObj = { ...req.query };
  delete queryObj.path;
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryObj)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.set(key, String(value));
    }
  }
  const searchStr = searchParams.toString();

  const targetUrl = `https://api.apify.com${pathStr}${searchStr ? `?${searchStr}` : ''}`;

  try {
    const headers = {
      Authorization: `Bearer ${apifyToken}`,
    };

    const options = { method: req.method, headers };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const contentType = req.headers['content-type'];
      if (contentType) headers['Content-Type'] = contentType;

      if (req.body !== undefined && req.body !== null && req.body !== '') {
        options.body =
          typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
      }
    }

    const response = await fetch(targetUrl, options);
    const data = await response.text();

    if (!response.ok) {
      let message = data;
      try {
        const parsed = JSON.parse(data);
        message = parsed?.error?.message || parsed?.message || data;
      } catch {
        /* keep raw */
      }
      return res.status(response.status).json({
        error: message || `Apify request failed (${response.status})`,
      });
    }

    const contentType =
      response.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);
    return res.status(response.status).send(data);
  } catch (error) {
    console.error('Apify Proxy Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal proxy error',
    });
  }
}
