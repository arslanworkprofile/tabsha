import React from 'react';

export function LoadingSpinner({ size = 40, center = false }) {
  const spinner = (
    <div
      className="spinner"
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 12) }}
    />
  );

  if (center) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        width: '100%',
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '32px',
          fontWeight: 400,
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
        }}>
          <span style={{ color: '#c9a84c' }}>T</span>absha
        </div>
        <div className="spinner" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div>
      <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: '8px' }} />
      <div className="skeleton" style={{ height: '14px', marginTop: '12px', width: '75%' }} />
      <div className="skeleton" style={{ height: '12px', marginTop: '8px', width: '45%' }} />
      <div className="skeleton" style={{ height: '16px', marginTop: '8px', width: '55%' }} />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
