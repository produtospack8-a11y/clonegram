/** Aceita @user, user ou URL instagram.com/user */
export function normalizeInstagramUsername(raw) {
  let s = String(raw || '')
    .trim()
    .replace(/^@+/, '');
  const urlMatch = s.match(/instagram\.com\/([^/?#]+)/i);
  if (urlMatch) s = urlMatch[1];
  return s.replace(/\s+/g, '');
}
