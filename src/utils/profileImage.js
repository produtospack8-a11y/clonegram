const CDN_HOST =
  /(^|\.)((cdninstagram|fbcdn|instagram)\.com|fbcdn\.net)$/i;

/** URL servida pelo proxy local em dev/preview (Instagram bloqueia hotlink direto). */
export function getProxiedProfileImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http')) return null;

  try {
    const { hostname, protocol } = new URL(trimmed);
    if (protocol !== 'https:' || !CDN_HOST.test(hostname)) return trimmed;
    return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
  } catch {
    return null;
  }
}
