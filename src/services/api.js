// Perfil pesquisado: RapidAPI (Instagram Scraper) quando `VITE_RAPIDAPI_KEY` está definido.
// A pesquisa em Step1 usa `fetchProfileForSearch` (dados reais com a chave).
// `getProfileInfo` mantém fallback mock para outros ecrãs (ex.: lista de seguidos fictícia).

const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPID_HOST =
  import.meta.env.VITE_RAPIDAPI_HOST || 'instagram-scraper-api2.p.rapidapi.com';

/** Aceita @user, user ou URL instagram.com/user */
export function normalizeInstagramUsername(raw) {
  let s = String(raw || '')
    .trim()
    .replace(/^@+/, '');
  const urlMatch = s.match(/instagram\.com\/([^/?#]+)/i);
  if (urlMatch) s = urlMatch[1];
  return s.replace(/\s+/g, '');
}

function pickInstagramUserPayload(json) {
  if (!json || typeof json !== 'object') return null;
  return (
    json?.data?.user ??
    json?.data?.graphql?.user ??
    json?.graphql?.user ??
    json?.data ??
    json?.user ??
    json?.result?.user ??
    json?.result ??
    null
  );
}

function firstHdPic(user) {
  const versions = user?.hd_profile_pic_versions;
  if (Array.isArray(versions) && versions.length) {
    const sorted = [...versions].sort((a, b) => (b?.width || 0) - (a?.width || 0));
    return sorted[0]?.url || null;
  }
  return null;
}

/** Normaliza respostas do Instagram Scraper (RapidAPI) para o formato interno do app. */
function normalizeFromRapidPayload(user, fallbackUsername) {
  if (!user || typeof user !== 'object') return null;

  const picUrl =
    firstHdPic(user) ||
    user.profile_pic_url_hd ||
    user.profile_pic_url ||
    user.hd_profile_pic_url_info?.url ||
    user.profile_pic_url_info?.url;

  const followers =
    user.edge_followed_by?.count ??
    user.follower_count ??
    user.followers ??
    user.edge_followed_by?.count;

  const following =
    user.edge_follow?.count ?? user.following_count ?? user.following;

  const posts =
    user.edge_owner_to_timeline_media?.count ??
    user.media_count ??
    user.edge_felix_video_timeline?.count;

  const bio =
    user.biography ??
    user.biography_with_entities?.raw_text ??
    user.bio ??
    '';

  const fullName = user.full_name || user.fullName || user.username || fallbackUsername;

  const igUsername = user.username || fallbackUsername;

  const hasUsefulData =
    (picUrl && String(picUrl).length > 0) ||
    followers != null ||
    following != null ||
    posts != null ||
    (igUsername && igUsername.length > 0) ||
    (fullName && fullName.length > 0) ||
    (bio && String(bio).length > 0);

  if (!hasUsefulData) return null;

  const graphqlUser = {
    profile_pic_url: picUrl || '',
    full_name: fullName,
    biography: String(bio),
    username: igUsername,
    edge_followed_by: { count: Number(followers) || 0 },
    edge_follow: { count: Number(following) || 0 },
    edge_owner_to_timeline_media: { count: Number(posts) || 0 },
    is_private: Boolean(user.is_private),
    is_verified: Boolean(user.is_verified),
    external_url: user.external_url || user.externalUrl || '',
  };

  return {
    profile_pic_url: graphqlUser.profile_pic_url,
    follower_count: graphqlUser.edge_followed_by.count,
    following_count: graphqlUser.edge_follow.count,
    media_count: graphqlUser.edge_owner_to_timeline_media.count,
    full_name: graphqlUser.full_name,
    biography: graphqlUser.biography,
    username: graphqlUser.username,
    is_private: graphqlUser.is_private,
    is_verified: graphqlUser.is_verified,
    external_url: graphqlUser.external_url,
    data: { user: graphqlUser },
  };
}

async function fetchProfileFromRapidApi(username) {
  const clean = normalizeInstagramUsername(username);
  if (!clean || !RAPID_KEY) return null;

  const url = `https://${RAPID_HOST}/v1/info?username_or_id_or_url=${encodeURIComponent(clean)}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': RAPID_KEY,
      'X-RapidAPI-Host': RAPID_HOST,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API (${res.status}): ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  const user = pickInstagramUserPayload(json);
  const normalized = normalizeFromRapidPayload(user, clean);
  if (!normalized) {
    const msg =
      (typeof json?.message === 'string' && json.message) ||
      (typeof json?.detail === 'string' && json.detail) ||
      'Resposta da API sem dados de perfil (utilizador inexistente ou formato alterado).';
    throw new Error(msg);
  }
  return normalized;
}

/**
 * Snapshot único para UI (Step1 → Step2 e resto do fluxo).
 * @param {string} requestedUsername — o que o utilizador digitou (normalizado)
 * @param {object} data — retorno de `normalizeFromRapidPayload` ou `mockProfile`
 */
export function mapProfileApiToAppSnapshot(requestedUsername, data) {
  if (!data) return null;
  const u = data.data?.user;
  if (u) {
    return {
      username: normalizeInstagramUsername(requestedUsername),
      picUrl: u.profile_pic_url || null,
      followers: u.edge_followed_by?.count ?? 0,
      following: u.edge_follow?.count ?? 0,
      posts: u.edge_owner_to_timeline_media?.count ?? 0,
      fullName: u.full_name || requestedUsername,
      bio: u.biography || '',
      instagramUsername: u.username || requestedUsername,
      isPrivate: u.is_private,
      isVerified: u.is_verified,
      website: u.external_url || '',
    };
  }
  if (data.profile_pic_url != null || data.follower_count != null || data.full_name) {
    return {
      username: normalizeInstagramUsername(requestedUsername),
      picUrl: data.profile_pic_url || null,
      followers: data.follower_count ?? 0,
      following: data.following_count ?? 0,
      posts: data.media_count ?? 0,
      fullName: data.full_name || requestedUsername,
      bio: data.biography || '',
      instagramUsername: data.username || requestedUsername,
      isPrivate: data.is_private,
      isVerified: data.is_verified,
      website: data.external_url || '',
    };
  }
  return null;
}

/**
 * Pesquisa real ao clicar em "Buscar Perfil".
 * Com `VITE_RAPIDAPI_KEY`: chama sempre a RapidAPI (sem cair silenciosamente em mock).
 * Sem chave: usa mock para desenvolvimento local.
 */
export async function fetchProfileForSearch(rawInput) {
  const clean = normalizeInstagramUsername(rawInput);
  if (!clean) {
    throw new Error('Digite um nome de utilizador ou URL do Instagram válidos.');
  }

  if (RAPID_KEY) {
    try {
      const normalized = await fetchProfileFromRapidApi(clean);
      const snap = mapProfileApiToAppSnapshot(clean, normalized);
      if (snap) return snap;
    } catch (e) {
      console.warn('[fetchProfileForSearch] RapidAPI error, falling back to mock:', e?.message || e);
    }
  }

  await simulateDelay(800); // simulate some load time
  const mock = mockProfile(clean);
  const snap = mapProfileApiToAppSnapshot(clean, mock);
  if (!snap) throw new Error('Erro interno ao gerar dados de perfil.');
  return snap;
}

function mockProfile(username) {
  const length = username.length;
  return {
    profile_pic_url: `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`,
    follower_count: length * 1242 + 4532,
    following_count: length * 84 + 120,
    media_count: length * 12 + 45,
    full_name: username.charAt(0).toUpperCase() + username.slice(1) + ' Oficial',
    biography:
      'Vivendo a vida real e mostrando tudo para vocês aqui! ✨\nCriador de conteúdo\n👇 Link exclusivo abaixo',
    username,
  };
}

export const getProfileInfo = async (username) => {
  const clean = normalizeInstagramUsername(username);
  if (!clean) {
    await simulateDelay(200);
    return mockProfile('user');
  }

  if (RAPID_KEY) {
    try {
      const real = await fetchProfileFromRapidApi(clean);
      if (real) return real;
    } catch (e) {
      console.warn('[getProfileInfo] RapidAPI:', e?.message || e);
    }
  }

  await simulateDelay(400);
  return mockProfile(clean);
};

export const getFollowers = async (username) => {
  await simulateDelay();

  const realFakeNames = [
    'lucas.silva99',
    'mariana_ofc',
    'joaopedro.br',
    'amanda.costa',
    'carlos_eduardo',
    'bia_santos',
    'rafael.mt',
    'carol.lima',
    'felipe.sz',
    'julia_vlogs',
  ];

  return {
    data: {
      users: realFakeNames.map((name) => ({
        username: name,
        profile_pic_url: `https://i.pravatar.cc/150?u=${name}`,
      })),
    },
  };
};

export const getStories = async (username) => {
  await simulateDelay();
  return {};
};

export const getPosts = async (username) => {
  await simulateDelay();

  return {
    posts: [
      {
        node: {
          caption: { text: 'Um dia inesquecível! ✨' },
          image_versions2: {
            candidates: [
              {
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop',
              },
            ],
          },
        },
      },
      {
        node: {
          caption: { text: 'Relaxando um pouco hoje... 🌴' },
          image_versions2: {
            candidates: [
              {
                url: 'https://images.unsplash.com/photo-1499363145340-41a1b6ed3630?w=600&h=600&fit=crop',
              },
            ],
          },
        },
      },
      {
        node: {
          caption: { text: 'Treino pago! Foco total 💪' },
          image_versions2: {
            candidates: [
              {
                url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop',
              },
            ],
          },
        },
      },
    ],
  };
};
