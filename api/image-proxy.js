const ALLOWED_HOST = /(^|\.)((cdninstagram|fbcdn|instagram)\.com|fbcdn\.net)$/i;

export default async function handler(req, res) {
  const target = req.query.url;
  
  if (!target) {
    return res.status(400).send('Missing url');
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return res.status(400).send('Invalid url');
  }

  if (parsed.protocol !== 'https:' || !ALLOWED_HOST.test(parsed.hostname)) {
    return res.status(403).send('Host not allowed');
  }

  try {
    const upstream = await fetch(parsed.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/*,*/*;q=0.8',
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).send('Upstream error');
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    // Ler os dados binários
    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Image Proxy Error:', error);
    res.status(502).send('Proxy error');
  }
}
