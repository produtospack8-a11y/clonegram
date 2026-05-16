import { normalizeInstagramUsername } from './instagram';
import { fetchProfileFromApify, isApifyConfigured } from './apify';

export { normalizeInstagramUsername };

const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

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

/**
 * Snapshot único para UI (Step1 → Step2 e resto do fluxo).
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
      picUrl: data.profile_pic_url?.trim() || null,
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

/** Pesquisa ao clicar em "Buscar Perfil". Usa Apify se configurado; senão mock. */
export async function fetchProfileForSearch(rawInput) {
  const clean = normalizeInstagramUsername(rawInput);
  if (!clean) {
    throw new Error('Digite um nome de utilizador ou URL do Instagram válidos.');
  }

  if (isApifyConfigured()) {
    const normalized = await fetchProfileFromApify(clean);
    const snap = mapProfileApiToAppSnapshot(clean, normalized);
    if (!snap) throw new Error('Não foi possível mapear os dados do perfil.');
    return snap;
  }

  await simulateDelay(500);
  const mock = mockProfile(clean);
  const snap = mapProfileApiToAppSnapshot(clean, mock);
  if (!snap) throw new Error('Erro interno ao gerar dados de perfil.');
  return snap;
}

export const getProfileInfo = async (username) => {
  const clean = normalizeInstagramUsername(username);
  if (!clean) {
    await simulateDelay(200);
    return mockProfile('user');
  }

  if (isApifyConfigured()) {
    try {
      return await fetchProfileFromApify(clean);
    } catch (e) {
      console.warn('[getProfileInfo] Apify:', e?.message || e);
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
