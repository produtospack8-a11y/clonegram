import React, { useState } from 'react';

function Step1_Search({ onSearchProfile }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!inputValue.trim()) {
      setError('Por favor, digite um @ válido ou URL do perfil.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSearchProfile(inputValue);
    } catch (e) {
      setError(e?.message || 'Não foi possível carregar este perfil. Tente outro utilizador.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: '#000', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="loader" style={{ width: '50px', height: '50px', border: '3px solid #262626', borderTop: '3px solid #0095f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Procurando conta...</h2>
        <p style={{ color: '#8e8e8e', fontSize: '0.9rem' }}>Aguarde enquanto localizamos o perfil no Instagram.</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
          Qual perfil você deseja analisar anonimamente? Os dados são carregados na hora pela API.
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
            {loading ? 'Buscando perfil…' : 'Buscar Perfil'}
          </button>
        </div>

        <div style={{ marginTop: '24px' }}>
           <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Recentes</h3>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#8e8e8e', fontSize: '0.9rem' }}>
             Nenhuma pesquisa recente.
           </div>
        </div>
      </div>
      
    </div>
  );
}

export default Step1_Search;
