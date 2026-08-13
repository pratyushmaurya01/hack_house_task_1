import React, { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, X } from 'lucide-react';

export function BuilderForm({ onGenerateSuccess }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [stack, setStack] = useState('');
  const [optionalField, setOptionalField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // 3D Tilt Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!formRef.current || window.innerWidth < 768) return;
      const rect = formRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = -(y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      
      formRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    };
    
    const handleMouseLeave = () => {
      if (!formRef.current) return;
      formRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    };

    const el = formRef.current;
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

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!photo || !name || !stack) {
      setError('Please fill all required fields and upload a photo.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('name', name);
    formData.append('stack', stack);
    formData.append('optional_field', optionalField);

    try {
      const res = await fetch('https://hack-house-task-1.onrender.com/api/generate', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to generate card');
      }
      
      onGenerateSuccess({
        imageUrl: `https://hack-house-task-1.onrender.com${data.image_url}`,
        shareUrl: `https://hack-house-task-1.onrender.com${data.share_url}`
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={formRef}
      className="glass-panel animate-in tilt-wrapper" 
      style={{ 
        maxWidth: '640px', 
        margin: '0 auto', 
        padding: '40px',
        position: 'relative'
      }}
    >
      <div className="dec-meta" style={{ top: '20px', right: '20px' }}>SEC.01</div>
      
      <form onSubmit={handleGenerate} className="depth-item">
        
        {/* Photo Upload Area */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }} className="mono">
            <span style={{ color: 'var(--primary)' }}>[01]</span> UPLOAD HERO PHOTO
          </label>
          
          {!preview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '1px dashed rgba(245, 200, 66, 0.4)',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                background: 'rgba(0,0,0,0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.background = 'rgba(245, 200, 66, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245, 200, 66, 0.4)';
                e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
              }}
            >
              <Camera size={40} strokeWidth={1.5} style={{ color: 'var(--primary)', marginBottom: '16px', margin: '0 auto', opacity: 0.8 }} />
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', letterSpacing: '1px' }}>INITIALIZE UPLOAD</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px' }} className="mono">JPG, PNG, HEIC (MAX 10MB)</div>
            </div>
          ) : (
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
              <button 
                type="button"
                onClick={() => { setPhoto(null); setPreview(null); }}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', cursor: 'pointer', backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <X size={20} />
              </button>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/jpeg,image/png,image/heic,image/heif" style={{ display: 'none' }} />
        </div>

        {/* Details */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }} className="mono">
            <span style={{ color: 'var(--primary)' }}>[02]</span> BUILDER METADATA
          </label>
          <input 
            type="text" 
            placeholder="NAME (E.G. SATOSHI)" 
            value={name} 
            onChange={e => setName(e.target.value)}
            style={{ marginBottom: '16px' }}
            maxLength={20}
            required
          />
          <select value={stack} onChange={e => setStack(e.target.value)} required style={{ marginBottom: '16px' }}>
            <option value="" disabled>SELECT PRIMARY STACK / ROLE</option>
            <option value="Frontend Developer">FRONTEND DEVELOPER</option>
            <option value="Backend Developer">BACKEND DEVELOPER</option>
            <option value="Full Stack Developer">FULL STACK DEVELOPER</option>
            <option value="AI Engineer">AI ENGINEER</option>
            <option value="Designer">PRODUCT DESIGNER</option>
            <option value="DevOps Engineer">DEVOPS / CLOUD</option>
            <option value="Web3 Developer">WEB3 DEVELOPER</option>
            <option value="Founder">FOUNDER / PM</option>
            <option value="Student">STUDENT BUILDER</option>
          </select>
        </div>

        {/* Optional */}
        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }} className="mono">
            <span style={{ color: 'var(--primary)' }}>[03]</span> CURRENT OBSESSION (OPTIONAL)
          </label>
          <input 
            type="text" 
            placeholder="E.G. LLMS, RUST, SHIPPING FAST" 
            value={optionalField} 
            onChange={e => setOptionalField(e.target.value)}
            maxLength={30}
          />
        </div>

        {error && (
          <div style={{ color: '#ff4f4f', marginBottom: '32px', fontSize: '13px', padding: '16px', background: 'rgba(255, 79, 79, 0.1)', borderRadius: '4px', borderLeft: '2px solid #ff4f4f' }} className="mono">
            ERR: {error}
          </div>
        )}

        <button type="submit" className="btn depth-item-high" disabled={isLoading} style={{ width: '100%', height: '64px' }}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} />
              COMPILING IDENTITY...
            </>
          ) : (
            'GENERATE IDENTITY'
          )}
        </button>
      </form>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
