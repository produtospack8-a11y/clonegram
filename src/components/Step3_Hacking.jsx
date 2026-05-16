import React, { useState, useEffect } from 'react';

function Step3_Hacking({ nextStep, username, profileSnapshot }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Conectando de forma segura...');

  useEffect(() => {
    const statuses = [
      { p: 10, text: 'Verificando permissões da conta...' },
      { p: 30, text: 'Sincronizando histórico de mensagens...' },
      { p: 45, text: 'Carregando mídias arquivadas...' },
      { p: 60, text: 'Buscando interações recentes...' },
      { p: 80, text: 'Processando dados de atividade...' },
      { p: 95, text: 'Preparando painel de visualização...' },
      { p: 100, text: 'Tudo pronto!' },
    ];

    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < statuses.length) {
        setProgress(statuses[currentIdx].p);
        setStatusText(statuses[currentIdx].text);
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(nextStep, 1500); // Avança após 1.5s
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [nextStep]);

  return (
    <div className="container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: '#000', height: '100vh', padding: '0 32px' }}>
      
      {/* IG Logo subtle */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}
      </style>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        
        <div className="loader" style={{ width: '50px', height: '50px', border: '3px solid #262626', borderTop: '3px solid #8e8e8e', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '32px' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
          Analisando @{username}
        </h2>
        {profileSnapshot?.fullName && (
          <div style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: '16px', maxWidth: '280px' }}>
            {profileSnapshot.fullName}
          </div>
        )}
        
        <div style={{ color: '#8e8e8e', fontSize: '0.9rem', minHeight: '24px', marginBottom: '32px' }}>
          {statusText}
        </div>

        <div style={{ width: '100%', height: '4px', backgroundColor: '#262626', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            backgroundColor: 'var(--primary-color)',
            transition: 'width 0.5s ease-out'
          }}></div>
        </div>
      </div>
      
      <div style={{ padding: '24px 0', color: '#555', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Criptografia de Ponta a Ponta
      </div>

    </div>
  );
}

export default Step3_Hacking;
