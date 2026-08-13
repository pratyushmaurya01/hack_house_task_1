import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { BuilderForm } from './components/BuilderForm';
import { ResultCard } from './components/ResultCard';

function App() {
  const [resultData, setResultData] = useState(null);

  return (
    <>
      {/* 3D Background System */}
      <div className="bg-layers">
        <div className="bg-base"></div>
        <div className="bg-orb-1"></div>
        <div className="bg-orb-2"></div>
        <div className="bg-grid"></div>
        <div className="bg-noise"></div>
        
        {/* Floating decorations */}
        <div className="dec-meta floating" style={{ top: '15%', left: '5%' }}>
          [ SYS.INIT.GOA_2026 ]
        </div>
        <div className="dec-meta floating" style={{ top: '40%', right: '4%', animationDelay: '1s', transform: 'rotate(90deg)' }}>
          LAT: 15.2993° N<br/>LON: 73.9690° E
        </div>
        <div className="dec-meta floating" style={{ bottom: '20%', left: '8%', animationDelay: '2s' }}>
          #FRAMEINGOA // BUILD
        </div>
      </div>
      
      <div className="container">
        {/* Event Minimal Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '24px 0',
          marginBottom: '60px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--primary)', opacity: 0.8 }}>//</span> HH GOA 2026
          </div>
          <nav className="mono" style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span className="nav-item" style={{ color: 'var(--primary)' }}>BUILDER ID</span>
          </nav>
        </header>

        <main style={{ position: 'relative', zIndex: 10 }}>
          {!resultData ? (
            <div className="layout-grid">
              <Hero />
              <BuilderForm onGenerateSuccess={setResultData} />
            </div>
          ) : (
            <ResultCard 
              imageUrl={resultData.imageUrl} 
              shareUrl={resultData.shareUrl} 
              onReset={() => setResultData(null)} 
            />
          )}
        </main>
        
        {/* Editorial Footer */}
        <footer style={{ 
          marginTop: '80px', 
          padding: '40px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          borderTop: '1px solid var(--border-light)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '4px' }}>
            HH GOA <span style={{ color: 'var(--primary)' }}>2026</span>
          </div>
          <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '2px' }}>
            BUILD SOMETHING WORTH SHARING
          </div>
          <div className="mono" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '16px' }}>
            BUILT FOR THE BUILDERS
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
