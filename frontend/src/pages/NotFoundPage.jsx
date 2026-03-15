import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(100px,20vw,180px)', fontWeight: 300, color: 'var(--g2)', lineHeight: 1, letterSpacing: '-.05em' }}>404</div>
      <div style={{ width: 56, height: 3, background: 'var(--gold)', margin: '0 auto' }} />
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400 }}>Page Not Found</h1>
      <p style={{ fontSize: 15, color: 'var(--g5)', maxWidth: 380, lineHeight: 1.7 }}>The page you're looking for doesn't exist. Let's get you back on track.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}><FiArrowLeft size={14} /> Go Back</button>
        <Link to="/" className="btn btn-primary"><FiHome size={14} /> Back to Home</Link>
      </div>
    </div>
  );
}
