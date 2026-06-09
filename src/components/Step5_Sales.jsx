import React from 'react';

function Step5_Sales({ username, profileSnapshot }) {
  const handleCheckout = () => {
    window.location.href = 'https://seguropagamentos.com.br/CLONE';
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '0', backgroundColor: '#000', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #262626' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '16px' }}><polyline points="15 18 9 12 15 6"></polyline></svg>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', marginRight: '40px' }}>
          Assinaturas
        </div>
      </div>

      <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#262626', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid #0095f6',
            overflow: 'hidden'
          }}>
            {profileSnapshot?.picUrl ? (
              <img
                src={profileSnapshot.picUrl}
                alt=""
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#0095f6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
            )}
          </div>
          
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
            Acesso VIP a @{username}
          </h1>
          <p style={{ color: '#8e8e8e', fontSize: '0.9rem' }}>
            Apoie e ganhe acesso a conteúdos exclusivos de monitoramento anonimamente.
          </p>
        </div>

        <div style={{ borderTop: '1px solid #262626', borderBottom: '1px solid #262626', padding: '24px 0', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Benefícios Exclusivos</h3>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Direct Messages</div>
                <div style={{ fontSize: '0.8rem', color: '#8e8e8e' }}>Leia as conversas (mesmo as apagadas).</div>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Mídia Oculta</div>
                <div style={{ fontSize: '0.8rem', color: '#8e8e8e' }}>Acesse fotos e vídeos arquivados.</div>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>100% Anônimo</div>
                <div style={{ fontSize: '0.8rem', color: '#8e8e8e' }}>Nenhuma notificação será enviada ao usuário.</div>
              </div>
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 'auto', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>R$ 47,00</span>
            <span style={{ color: '#8e8e8e', fontSize: '0.9rem' }}> / mês</span>
            <div style={{ textDecoration: 'line-through', color: '#555', fontSize: '0.85rem', marginTop: '4px' }}>De R$ 197,00</div>
          </div>

          <button className="btn-primary" onClick={handleCheckout} style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold' }}>
            Assinar e Acessar Agora
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: '#8e8e8e' }}>
            Você pode cancelar a qualquer momento em Configurações &gt; Assinaturas.<br />
            Cobrado via Meta Pay.
          </div>
        </div>

      </div>
    </div>
  );
}

export default Step5_Sales;
