import React from 'react';

function Step0_Landing({ nextStep }) {
  return (
    <div className="container animate-fade-in" style={{ justifyContent: 'center', textAlign: 'center', height: '100vh', padding: '0 32px' }}>
      
      {/* Import Instagram Font for the logo */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}
      </style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ 
          fontFamily: "'Dancing Script', cursive", 
          fontSize: '3.5rem', 
          marginBottom: '40px',
          fontWeight: 'bold'
        }}>
          Instagram
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px', lineHeight: '1.4' }}>
          Faça login para ver o que <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>seu parceiro</span> anda curtindo e comentando quando você não está perto.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="btn-primary" onClick={nextStep}>
            Fazer Login com Meta
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#363636' }}></div>
            <div style={{ padding: '0 16px', color: '#8e8e8e', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>ou</div>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#363636' }}></div>
          </div>

          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary-color)', 
            fontWeight: '600', 
            fontSize: '0.9rem',
            cursor: 'pointer'
          }} onClick={nextStep}>
            Acessar modo anônimo
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #363636', padding: '24px 0', marginTop: 'auto' }}>
        <p style={{ fontSize: '0.8rem', color: '#8e8e8e' }}>
          de <span style={{ fontWeight: 'bold' }}>Meta</span>
        </p>
      </div>
    </div>
  );
}

export default Step0_Landing;
