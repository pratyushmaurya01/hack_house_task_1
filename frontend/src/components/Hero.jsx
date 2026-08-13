import React from 'react';
import { Sparkles, Calendar, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <div className="animate-in hero-section" style={{ position: 'relative', transformStyle: 'preserve-3d', padding: '20px 0' }}>
      
      <div 
        className="floating depth-item" 
        style={{ 
          color: 'var(--primary)', 
          fontSize: '12px', 
          marginBottom: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(245, 200, 66, 0.1)',
          padding: '8px 20px',
          borderRadius: '30px',
          border: '1px solid rgba(245, 200, 66, 0.3)',
          backdropFilter: 'blur(10px)',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '1px'
        }}
      >
        <Sparkles size={14} className="floating" />
        Official Builder Badge
      </div>
      
      <h1 style={{ 
        fontSize: 'clamp(40px, 8vw, 80px)', 
        lineHeight: 1.1, 
        margin: '0 0 24px 0', 
        fontWeight: 900,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        textShadow: '0 10px 30px rgba(245, 200, 66, 0.3)',
        color: 'var(--primary)',
        transform: 'translateZ(30px)'
      }}>
        HACKER HOUSE<br/>GOA 2026
      </h1>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        fontSize: '12px',
        color: 'var(--text-main)',
        opacity: 0.9,
        fontWeight: 600,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        transform: 'translateZ(20px)'
      }} className="mono">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color="var(--primary)" /> 28-31 OCT 2026
        </span>
        <span style={{ color: 'var(--primary)' }}>·</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={14} color="var(--primary)" /> GOA, INDIA
        </span>
      </div>
    </div>
  );
}
