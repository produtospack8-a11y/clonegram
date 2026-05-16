import { normalizeInstagramUsername } from './instagram';

const DEFAULT_ACTOR = 'instagram-scraper~instagram-profile-scraper';
const RUN_TIMEOUT_SEC = 120;
const FETCH_TIMEOUT_MS = (RUN_TIMEOUT_SEC + 30) * 1000;

const APIFY_ACTOR = import.meta.env.VITE_APIFY_ACTOR_ID || DEFAULT_ACTOR;

/**
 * Apify só via proxy do Vite (/api/apify). O token fica em APIFY_TOKEN no .env.local
 * (servidor) e nunca é enviado ao browser.
 */
export function isApifyConfigured() {
  return import.meta.env.VITE_APIFY_ENABLED === 'true';
}

function buildHeaders() {
  return { 'Content-Type': 'application/json' };
}

function pickProfileItem(items, username) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const clean = normalizeInstagramUsername(username);
  const match = items.find(
    (row) => normalizeInstagramUsername(row?.username) === clean,
  );
  return match || items[0];
}

/** Converte item do dataset Apify para o formato interno do app. */
export function normalizeFromApifyItem(item, fallbackUsername) {
  if (!item || typeof item !== 'object') return null;
  if (item.ig_status === 'not_found' || item.error) return null;

  const picUrl =
    item.profile_pic_url_hd ||
    item.profile_pic_url ||
    item.profilePictureUrl ||
    item.profile_picture_url;
  const username = item.username || fallbackUsername;

  const hasData =
    username ||
    picUrl ||
    item.followers != null ||
    item.following != null ||
    item.post_count != null ||
    item.full_name ||
    item.biography;

  if (!hasData) return null;

  return {
    profile_pic_url: picUrl || null,
    follower_count: Number(item.followers) || 0,
    following_count: Number(item.following) || 0,
    media_count: Number(item.post_count) || 0,
    full_name: item.full_name || username,
    biography: item.biography || '',
    username,
    is_private: Boolean(item.is_private),
    is_verified: Boolean(item.is_verified),
    external_url: item.external_url || '',
  };
}

/**
 * Executa o actor Apify (sync) e devolve um perfil normalizado.
 * @see https://apify.com/instagram-scraper/instagram-profile-scraper
 */
export async function fetchProfileFromApify(username) {
  const clean = normalizeInstagramUsername(username);
  if (!clean) {
    throw new Error('Digite um nome de utilizador ou URL do Instagram válidos.');
  }
  if (!isApifyConfigured()) {
    throw new Error(
      'Apify não configurada. Defina VITE_APIFY_ENABLED=true e APIFY_TOKEN em .env.local, depois reinicie o servidor.',
    );
  }

  const url = `/api/apify/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?timeout=${RUN_TIMEOUT_SEC}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ instagramUsernames: [clean] }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new Error('A Apify demorou demasiado. Tente novamente.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const msg =
      payload?.error?.message ||
      payload?.message ||
      (typeof payload?.error === 'string' ? payload.error : null) ||
      text?.slice(0, 200) ||
      `Erro Apify (${res.status})`;
    if (res.status === 401) {
      throw new Error(
        'Token Apify inválido ou em falta. Verifique APIFY_TOKEN em .env.local e reinicie o npm run dev.',
      );
    }
    if (res.status === 404) {
      throw new Error(
        'Proxy Apify indisponível. Use npm run dev (não abra só o ficheiro dist/).',
      );
    }
    throw new Error(msg);
  }

  const item = pickProfileItem(payload, clean);
  const normalized = normalizeFromApifyItem(item, clean);

  if (!normalized) {
    const reason =
      item?.ig_status === 'not_found'
        ? 'Perfil não encontrado ou privado/restrito.'
        : 'A Apify não devolveu dados de perfil para este utilizador.';
    throw new Error(reason);
  }

  return normalized;
}
