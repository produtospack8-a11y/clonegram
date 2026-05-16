import React, { useState } from 'react';

function Step1_Search({ onSearchProfile }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const checkoutUrl = 'https://seguropagamentos.com.br/CLONE';

  const handleSearch = async () => {
    if (!inputValue.trim()) {
      setError('Por favor, digite um @ válido ou URL do perfil.');
      return;
    }

    const normalizedInput = inputValue.trim().toLowerCase();
    const previousSearch = localStorage.getItem('searchedProfile');

    if (previousSearch && previousSearch !== normalizedInput) {
      setLimitReached(true);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await onSearchProfile(inputValue);
      localStorage.setItem('searchedProfile', normalizedInput);
    } catch (e) {
      setError(e?.message || 'Não foi possível carregar este perfil. Tente outro utilizador.');
    } finally {
      setLoading(false);
    }
  };

  if (limitReached) {
    return (
      <div className="container animate-fade-in" style={{ padding: '24px', backgroundColor: '#000', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
           <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
             <circle cx="12" cy="12" r="10"></circle>
             <line x1="12" y1="8" x2="12" y2="12"></line>
             <line x1="12" y1="16" x2="12.01" y2="16"></line>
           </svg>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>Limite de Pesquisa Atingido</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px', lineHeight: '1.5' }}>
          Você atingiu o limite de 1 pesquisa gratuita por dispositivo. Para pesquisar novos perfis ou desbloquear todas as informações detalhadas deste perfil, você precisa ativar o acesso Premium.
        </p>
        
        <div style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '8px', marginBottom: '32px', border: '1px solid #333' }}>
          <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>Acesso Premium Ilimitado</p>
          <p style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', margin: '8px 0' }}>Por apenas R$ 29,90</p>
        </div>

        <a
          href={checkoutUrl}
          className="btn-primary"
          style={{ padding: '16px', borderRadius: '8px', display: 'block', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}
        >
          Desbloquear Agora
        </a>
        
        <button 
          onClick={() => setLimitReached(false)}
          style={{ marginTop: '24px', background: 'none', border: 'none', color: '#8e8e8e', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '0', backgroundColor: '#000' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #262626' }}>
        <div style={{ flex: 1 }}>
           <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Pesquisar</h2>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Qual perfil você deseja analisar anonimamente?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            
            <input
              type="text"
              className="input-field"
              placeholder="@utilizador ou link do Instagram"
              style={{ paddingLeft: '40px', backgroundColor: '#262626', border: 'none', borderRadius: '8px' }}
              value={inputValue}
              disabled={loading}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) handleSearch();
              }}
            />
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '8px', paddingLeft: '8px' }}>{error}</p>}
          </div>
          
          <button
            type="button"
            className="btn-primary"
            onClick={handleSearch}
            disabled={loading}
            style={{ padding: '14px', borderRadius: '8px', opacity: loading ? 0.75 : 1 }}
          >
            {loading ? 'Procurando conta…' : 'Buscar Perfil'}
          </button>
        </div>

        <div style={{ marginTop: '24px' }}>
           <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Recentes</h3>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#8e8e8e', fontSize: '0.9rem' }}>
             {localStorage.getItem('searchedProfile') ? (
               <div style={{ textAlign: 'center' }}>
                 Última pesquisa: <strong style={{ color: '#fff' }}>{localStorage.getItem('searchedProfile')}</strong>
                 <br/>
                 <span style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                   Limite de pesquisas gratuitas esgotado.
                 </span>
               </div>
             ) : (
               'Nenhuma pesquisa recente.'
             )}
           </div>
        </div>
      </div>
      
    </div>
  );
}

export default Step1_Search;
