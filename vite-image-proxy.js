const ALLOWED_HOST =
  /(^|\.)((cdninstagram|fbcdn|instagram)\.com|fbcdn\.net)$/i;

/** Proxy de imagens do Instagram/CDN (evita bloqueio por Referer no browser). */
export function imageProxyPlugin() {
  return {
    name: 'image-proxy',
    configureServer(server) {
      server.middlewares.use('/api/image-proxy', imageProxyHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/image-proxy', imageProxyHandler);
    },
  };
}

async function imageProxyHandler(req, res) {
  try {
    const reqUrl = new URL(req.url || '', 'http://localhost');
    const target = reqUrl.searchParams.get('url');
    if (!target) {
      res.statusCode = 400;
      res.end('Missing url');
      return;
    }

    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      res.statusCode = 400;
      res.end('Invalid url');
      return;
    }

    if (parsed.protocol !== 'https:' || !ALLOWED_HOST.test(parsed.hostname)) {
      res.statusCode = 403;
      res.end('Host not allowed');
      return;
    }

    const upstream = await fetch(parsed.href, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/*,*/*;q=0.8',
      },
    });

    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.end('Upstream error');
      return;
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = 200;
    res.end(buffer);
  } catch {
    res.statusCode = 502;
    res.end('Proxy error');
  }
}
