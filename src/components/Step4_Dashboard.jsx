import React, { useState, useEffect } from 'react';
import { getFollowers, getProfileInfo, getPosts } from '../services/api';
import PublicImage from './PublicImage';

/** Bases de ficheiro em `public/` (sem extensão). PublicImage tenta .webp, .jpg, .jpeg, .png e capitalização. */
const FEED_IMAGE_BASES = [['postinsta1'], ['postinsta4', 'post4'], ['postinsta3']];
const DM_MESSAGE_AVATAR_BASES = [
  ['perfil 3', 'perfil3'],
  ['perfil 4', 'perfil4'],
];
const STORY_RING_BASES = [
  ['sotry1', 'story1'],
  [
    'sotry2',
    'story2',
    'sotry 2',
    'story 2',
    'sotry02',
    'story02',
    'Sotry2',
    'Story2',
  ],
  ['sotry3', 'story3', 'sotry 3', 'story 3'],
];
const STORY_FULL_BASES = [
  ['story1'],
  ['story2', 'story 2', 'sotry2', 'sotry 2', 'story02', 'sotry02'],
  ['story3', 'story 3'],
];

function Step4_Dashboard({ nextStep, username, profileSnapshot }) {
  const [view, setView] = useState('home'); // 'home' or 'dms'
  const [avatars, setAvatars] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStory, setActiveStory] = useState(null); // the user object whose story is being viewed
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const data = await getFollowers(username);
        let followingUsers = [];
        
        if (isMounted) {
          if (data && data.data && data.data.users && data.data.users.length > 0) {
            followingUsers = data.data.users.slice(0, 10);
            setAvatars(followingUsers);
          } else {
            // API failed or returned empty. Fetch real celebrity profiles as a realistic fallback
            // This guarantees we use the API to get REAL photos of REAL people
            const realFallbacks = ['neymarjr', 'virginia', 'anitta', 'whinderssonnunes', 'tatawerneck'];
            const profiles = await Promise.all(realFallbacks.map(name => getProfileInfo(name)));
            followingUsers = profiles.map((p, i) => {
               if (p && p.profile_pic_url) {
                 return { username: p.full_name || realFallbacks[i], profile_pic_url: p.profile_pic_url };
               }
               return { username: `User${i}*****`, profile_pic_url: `https://ui-avatars.com/api/?name=U${i}&background=random` };
            });
            // Fill the rest up to 10
            for (let i = followingUsers.length; i < 10; i++) {
              followingUsers.push({ username: `User${i}*****`, profile_pic_url: `https://ui-avatars.com/api/?name=U${i}&background=random` });
            }
            setAvatars(followingUsers);
          }

          // Fetch posts for the first followed user to populate the feed
          if (followingUsers.length > 0 && followingUsers[0].username && !followingUsers[0].username.includes('*')) {
             try {
               const postsData = await getPosts(followingUsers[0].username);
               if (isMounted && postsData && postsData.posts) {
                 let posts = postsData.posts.slice(0, 3).map((item) => ({
                   author: followingUsers[0],
                   caption: item.node?.caption?.text || 'Visualizar conteúdo oculto',
                 }));
                 while (posts.length < 3) {
                   posts.push({
                     author: followingUsers[0],
                     caption: 'Visualizar conteúdo oculto',
                   });
                 }
                 setFeedPosts(posts);
               } else {
                 setFeedPosts(
                   FEED_IMAGE_BASES.map(() => ({
                     author: followingUsers[0],
                     caption: 'Visualizar conteúdo oculto',
                   }))
                 );
               }
             } catch(e) {
                 if (isMounted) {
                   setFeedPosts(
                     FEED_IMAGE_BASES.map(() => ({
                       author: followingUsers[0],
                       caption: 'Visualizar conteúdo oculto',
                     }))
                   );
                 }
             }
          } else {
             if (isMounted) {
               setFeedPosts(
                 FEED_IMAGE_BASES.map(() => ({
                   author: followingUsers[0],
                   caption: 'Visualizar conteúdo oculto',
                 }))
               );
             }
          }

          setIsLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          const fallbackUsers = Array.from({ length: 10 }).map((_, i) => ({
            username: `User${i}*****`,
            profile_pic_url: `https://ui-avatars.com/api/?name=U${i}&background=random`
          }));
          setAvatars(fallbackUsers);
          setFeedPosts(
            FEED_IMAGE_BASES.map(() => ({
              author: fallbackUsers[0],
              caption: 'Visualizar conteúdo oculto',
            }))
          );
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [username]);

  const maskUsername = (name) => {
    if (!name) return 'User*****';
    if (name.includes('*')) return name;
    return name.substring(0, 3) + '*****';
  };

  const handleVIPClick = () => {
    nextStep();
  };

  const openStory = (user, storyIndex) => {
    setActiveStory(user);
    setActiveStoryIndex(storyIndex);
  };

  const closeStory = () => {
    setActiveStory(null);
    setActiveStoryIndex(null);
  };

  const HomeView = () => (
    <div style={{ paddingBottom: '120px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #262626' }}>
        <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.8rem', fontWeight: 'bold' }}>Instagram</div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <div style={{ position: 'relative' }} onClick={() => setView('dms')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <div style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#ed4956', color: 'white', borderRadius: '50%', fontSize: '0.65rem', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</div>
          </div>
        </div>
      </div>

      {/* Stories */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '12px 16px', borderBottom: '1px solid #262626' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', position: 'relative', marginBottom: '4px' }}>
             {profileSnapshot?.picUrl ? (
               <img
                 src={profileSnapshot.picUrl}
                 alt="Seu story"
                 width={64}
                 height={64}
                 loading="eager"
                 decoding="async"
                 style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
               />
             ) : (
               <img
                 src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username.charAt(0) || '?')}&background=333&color=fff`}
                 alt="Seu story"
                 width={64}
                 height={64}
                 loading="eager"
                 decoding="async"
                 style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
               />
             )}
             <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#0095f6', borderRadius: '50%', border: '2px solid black', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
             </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#8e8e8e' }}>Seu story</span>
        </div>
        
        {!isLoading && avatars.map((user, idx) => (
          <div key={idx} onClick={() => (idx < 3 ? openStory(user, idx) : null)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div className="story-border" style={{ marginBottom: '4px', borderColor: idx < 3 ? '#d92a7e' : '#262626' }}>
              {idx < 3 ? (
                <PublicImage
                  names={STORY_RING_BASES[idx]}
                  alt=""
                  width={60}
                  height={60}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  sizes="60px"
                  style={{ width: '60px', height: '60px', borderRadius: '50%', filter: 'blur(3px)', cursor: 'pointer', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <img
                  src={user.profile_pic_url}
                  alt=""
                  width={60}
                  height={60}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '60px', height: '60px', borderRadius: '50%', filter: 'blur(3px)', cursor: 'default', objectFit: 'cover' }}
                />
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#f5f5f5' }}>{maskUsername(user.username)}</span>
          </div>
        ))}
      </div>

      {/* Feed Area */}
      <div style={{ padding: '0' }}>
        {!isLoading && feedPosts.map((post, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #262626',
              contentVisibility: 'auto',
              containIntrinsicSize: '400px 620px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="story-border"
                  style={{
                    padding: '2px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#1a1a1a',
                    flexShrink: 0,
                  }}
                  title="Perfil bloqueado"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #2a2a2a 0%, #121212 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" aria-hidden>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {maskUsername(post.author?.username)}
                    <span style={{ color: '#8e8e8e', fontSize: '0.8rem', fontWeight: 'normal' }}>• Há algumas horas</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#f5f5f5' }}>Áudio original</div>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </div>
            
            <div style={{ width: '100%', minHeight: '350px', backgroundColor: '#262626', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <PublicImage
                names={FEED_IMAGE_BASES[idx] || FEED_IMAGE_BASES[0]}
                alt="Conteúdo do post"
                width={720}
                height={900}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'low'}
                decoding="async"
                sizes="(max-width: 430px) 100vw, 430px"
                style={{ width: '100%', height: '100%', minHeight: '350px', objectFit: 'cover', filter: 'blur(10px) brightness(0.5)', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>Post Oculto</span>
              </div>
            </div>
            
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>Curtido por VIPs e outras pessoas</div>
              <div style={{ fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 'bold', marginRight: '6px' }}>{maskUsername(post.author?.username)}</span>
                <span style={{ color: '#8e8e8e' }}>Conteúdo restrito apenas para assinantes...</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DmsView = () => (
    <div style={{ padding: '0', paddingBottom: '120px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #262626' }}>
        <svg onClick={() => setView('home')} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '16px' }}><polyline points="15 18 9 12 15 6"></polyline></svg>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {username}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ background: '#262626', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(45deg, #a855f7, #3b82f6)' }}></div>
          <span style={{ color: '#8e8e8e', fontSize: '0.95rem' }}>Pesquisar</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', background: '#262626', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', color: '#8e8e8e', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Nota...</div>
            <img
              src={
                profileSnapshot?.picUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(username.charAt(0) || '?')}&background=333&color=fff`
              }
              style={{ width: '70px', height: '70px', borderRadius: '50%', marginTop: '16px', objectFit: 'cover' }}
              alt=""
              width={70}
              height={70}
              loading="lazy"
              decoding="async"
            />
            <span style={{ fontSize: '0.75rem', color: '#8e8e8e', marginTop: '6px' }}>Sua nota</span>
          </div>
          
          {!isLoading && avatars.slice(1, 4).map((user, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
               <div style={{ position: 'absolute', top: '-15px', background: '#262626', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', color: '#f5f5f5', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                 {['Tô entediada', 'Bora sair?', 'Saudade de vc'][idx]}
               </div>
               <img src={user.profile_pic_url} style={{ width: '70px', height: '70px', borderRadius: '50%', marginTop: '16px', filter: 'blur(4px)' }} alt="" />
               <span style={{ fontSize: '0.75rem', color: '#f5f5f5', marginTop: '6px' }}>{maskUsername(user.username)}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Mensagens</div>
          <div style={{ color: '#0095f6', fontSize: '0.9rem', fontWeight: '600' }}>Pedidos (4)</div>
        </div>

        <div>
          {!isLoading && avatars.slice(0, 6).map((user, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {idx < 2 ? (
                <PublicImage
                  names={DM_MESSAGE_AVATAR_BASES[idx]}
                  alt=""
                  width={56}
                  height={56}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  sizes="56px"
                  style={{ width: '56px', height: '56px', borderRadius: '50%', filter: 'blur(4px)', objectFit: 'cover', display: 'block', flexShrink: 0 }}
                />
              ) : (
                <img
                  src={user.profile_pic_url}
                  alt=""
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '56px', height: '56px', borderRadius: '50%', filter: 'blur(4px)', objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '2px', color: idx < 2 ? '#f5f5f5' : '#8e8e8e' }}>{maskUsername(user.username)}</div>
                <div style={{ color: idx < 2 ? '#f5f5f5' : '#8e8e8e', fontSize: '0.85rem', fontWeight: idx < 2 ? '600' : 'normal' }}>
                  {['Oi, tá fazendo oq? Posso te li... • Agora', 'Vem aqui em casa hj • 33 min', 'Diz depois a gente se fala • 2 h', 'Reagiu com 🔥 à sua mensagem • 6 h', '3 novas mensagens • 22 h', 'Te espero no mesmo lugar • 1 d'][idx]}
                </div>
              </div>
              {idx < 2 || idx === 4 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#0095f6', borderRadius: '50%' }}></div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ height: '100vh', width: '100%', backgroundColor: '#000', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
      
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}
      </style>

      {/* Aviso de Prévia */}
      <div style={{
        background: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)',
        color: '#fff',
        padding: '12px 16px',
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }} onClick={handleVIPClick}>
        <span style={{ textTransform: 'uppercase', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', marginRight: '4px' }}>Prévia</span>
        <span>Para clonar a conta desbloqueie o acesso VIP!</span>
      </div>

      {view === 'home' ? <HomeView /> : <DmsView />}

      {/* Story Viewer Modal */}
      {activeStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', gap: '4px', padding: '12px 8px', position: 'absolute', width: '100%', top: 0, zIndex: 101 }}>
            <div style={{ flex: 1, height: '2px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
               <div style={{ width: '50%', height: '100%', backgroundColor: '#fff', borderRadius: '2px' }}></div>
            </div>
          </div>
          
          {/* Story Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 12px 12px 12px', position: 'absolute', width: '100%', top: 0, zIndex: 101 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activeStoryIndex != null && activeStoryIndex < STORY_RING_BASES.length ? (
                <PublicImage
                  names={STORY_RING_BASES[activeStoryIndex]}
                  alt=""
                  width={32}
                  height={32}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  sizes="32px"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', filter: 'blur(3px)', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <img
                  src={activeStory.profile_pic_url}
                  alt=""
                  width={32}
                  height={32}
                  decoding="async"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', filter: 'blur(3px)', objectFit: 'cover' }}
                />
              )}
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>{maskUsername(activeStory.username)}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>4 h</span>
            </div>
            <svg onClick={closeStory} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>

          {/* Story Image Area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {activeStoryIndex != null && activeStoryIndex < STORY_FULL_BASES.length ? (
              <>
                <PublicImage
                  names={STORY_FULL_BASES[activeStoryIndex]}
                  alt="Story"
                  width={1080}
                  height={1920}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  sizes="100vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px) brightness(0.6)', display: 'block' }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>Story Privado</span>
                  <button type="button" onClick={handleVIPClick} className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.9rem', marginTop: '8px' }}>Desbloquear para ver</button>
                </div>
              </>
            ) : (
              <div style={{ color: '#fff' }}>Erro ao carregar story.</div>
            )}
          </div>

          {/* Story Footer */}
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', position: 'absolute', bottom: 0, width: '100%', zIndex: 101, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.3)', borderRadius: '24px', padding: '10px 16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Enviar mensagem...</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav */}
      {view === 'home' && !activeStory && (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', height: '50px', background: '#000', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #262626', zIndex: 10 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8v10h-6v-6H9v6H3V11l9-8z"></path></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#262626', border: '1px solid #fff' }}></div>
        </div>
      )}

      {/* Sneaky Sales Banner */}
      {!activeStory && (
        <div style={{
          position: 'fixed',
          bottom: view === 'home' ? '60px' : '10px',
          left: '10px',
          right: '10px',
          background: '#121212',
          border: '1px solid #262626',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0095f6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Acesso Limitado</div>
                <div style={{ fontSize: '0.8rem', color: '#8e8e8e' }}>Prévia de 10 min ativa.</div>
              </div>
            </div>
            <div style={{ color: '#ed4956', fontWeight: 'bold', fontSize: '0.9rem' }}>09:46</div>
          </div>
          
          <button 
            onClick={handleVIPClick}
            className="btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
          >
            Desbloquear Acesso Total
          </button>
        </div>
      )}

    </div>
  );
}

export default Step4_Dashboard;
