import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import InstagramProfileTabs from './InstagramProfileTabs';

function snapshotToProfileData(snap) {
  if (!snap) return null;
  return {
    picUrl: snap.picUrl,
    followers: snap.followers,
    following: snap.following,
    posts: snap.posts,
    fullName: snap.fullName,
    bio: snap.bio || '',
    website: snap.website || '',
    instagramUsername: snap.instagramUsername || snap.username,
    isPrivate: Boolean(snap.isPrivate),
    isVerified: Boolean(snap.isVerified),
  };
}

function Step2_ProfileConfirm({ nextStep, prevStep, username, profileSnapshot }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fromSnap =
      profileSnapshot &&
      profileSnapshot.username === username &&
      snapshotToProfileData(profileSnapshot);

    if (fromSnap) {
      setProfileData(fromSnap);
      setIsLoading(false);
      return;
    }

    setProfileData(
      snapshotToProfileData({
        username,
        picUrl: null,
        followers: username.length * 142 + 532,
        following: username.length * 84 + 120,
        posts: username.length * 12 + 45,
        fullName: username,
        bio: '',
        website: '',
        instagramUsername: username,
        isPrivate: false,
        isVerified: false,
      }),
    );
    setIsLoading(false);
  }, [username, profileSnapshot]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 10000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: '#000' }}>
        <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid #262626', borderTop: '3px solid var(--text-muted)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '0', backgroundColor: '#000' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #262626' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} onClick={prevStep}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {profileData?.instagramUsername || username}
            {profileData?.isVerified && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0095f6" aria-label="Verificado"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
            )}
          </div>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
          <div className="story-border">
            <ProfileAvatar
              src={profileData?.picUrl}
              alt={profileData?.instagramUsername || username}
              size={80}
              fallbackLetter={(profileData?.instagramUsername || username).charAt(0).toUpperCase()}
            />
          </div>

          <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatNumber(profileData?.posts || 0)}</div>
              <div style={{ fontSize: '0.85rem' }}>Publicações</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatNumber(profileData?.followers || 0)}</div>
              <div style={{ fontSize: '0.85rem' }}>Seguidores</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatNumber(profileData?.following || 0)}</div>
              <div style={{ fontSize: '0.85rem' }}>Seguindo</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px', fontSize: '0.9rem' }}>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {profileData?.fullName || username}
            {profileData?.isPrivate && (
              <span style={{ fontSize: '0.75rem', color: '#8e8e8e', fontWeight: '600', border: '1px solid #363636', padding: '2px 8px', borderRadius: '4px' }}>Privada</span>
            )}
          </div>
          {profileData?.bio && <div style={{ marginTop: '6px', whiteSpace: 'pre-line', color: '#e5e5e5' }}>{profileData.bio}</div>}
          {profileData?.website && (
            <a
              href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: '8px', color: '#0095f6', fontSize: '0.85rem', wordBreak: 'break-all' }}
            >
              {profileData.website}
            </a>
          )}
          <div style={{ color: '#e0e0e0', marginTop: '8px', fontSize: '0.8rem' }}>Conta monitorada com segurança.</div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 1, padding: '8px 0', borderRadius: '8px' }}
            onClick={nextStep}
          >
            Monitorar Conta
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ flex: 1, padding: '8px 0', borderRadius: '8px', border: 'none', backgroundColor: '#262626' }}
            onClick={prevStep}
          >
            Cancelar
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', overflowX: 'hidden', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#262626', border: '1px solid #363636', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
              </div>
              <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Destaque</span>
            </div>
          ))}
        </div>
      </div>

      <InstagramProfileTabs />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ aspectRatio: '1/1', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Step2_ProfileConfirm;
