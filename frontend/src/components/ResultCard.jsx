import React, { useEffect, useRef } from 'react';
import { Download, Share2, RefreshCcw } from 'lucide-react';

export function ResultCard({ imageUrl, shareUrl, onReset }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current || window.innerWidth < 768) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = -(y / rect.height) * 15;
      const rotateY = (x / rect.width) * 15;
      
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
    };
    
    const handleMouseLeave = () => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    };

    const el = cardRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = imageUrl.split('/').pop() || 'hh-goa-builder-id.png';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      window.open(imageUrl, '_blank');
    }
  };

  const tweetText = encodeURIComponent(`Built different. Goa bound. 🌴⚡\n\nMy HH Goa 2026 Builder ID is ready.\n\n#FrameInGoa`);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="animate-in" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', textAlign: 'center', transformStyle: 'preserve-3d' }}>
      
      <div className="mono floating" style={{ color: 'var(--success)', letterSpacing: '2px', fontSize: '13px', marginBottom: '24px' }}>
        [ IDENTITY CONFIRMED ]
      </div>
      
      <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '16px', fontWeight: 700, letterSpacing: '-1px' }}>
        YOUR BUILDER PASS IS READY
      </h2>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '18px' }}>
        Download it. Share it. We'll see you in Goa.
      </p>
      
      <div style={{ perspective: '1000px', marginBottom: '48px' }}>
        <div 
          ref={cardRef}
          style={{ 
            borderRadius: '16px', 
            overflow: 'hidden',
            transition: 'transform 0.1s ease-out',
            transformStyle: 'preserve-3d',
            backgroundColor: 'transparent',
            maxHeight: '65vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img 
            src={imageUrl} 
            alt="Generated Builder ID" 
            style={{ 
              display: 'block',
              width: '100%',
              height: '100%',
              maxHeight: '65vh',
              objectFit: 'contain'
            }} 
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', transform: 'translateZ(10px)' }}>
        <button onClick={handleDownload} className="btn" style={{ minWidth: '240px' }}>
          <Download size={20} />
          DOWNLOAD 
        </button>
        
        <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="btn btn-twitter" style={{ minWidth: '240px', textDecoration: 'none' }}>
          <Share2 size={20} />
          SHARE TO X
        </a>
      </div>
      
      <div style={{ marginTop: '64px' }}>
        <button onClick={onReset} className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '13px' }}>
          <RefreshCcw size={16} />
          INITIALIZE NEW IDENTITY
        </button>
      </div>
    </div>
  );
}
