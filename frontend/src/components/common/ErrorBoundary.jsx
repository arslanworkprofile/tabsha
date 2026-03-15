import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 400 }}>Something went wrong</h2>
        <p style={{ color: '#888', fontSize: 14, maxWidth: 400, lineHeight: 1.7 }}>An unexpected error occurred. Please refresh the page.</p>
        {process.env.NODE_ENV === 'development' && this.state.error && (
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, fontSize: 11, maxWidth: 600, overflow: 'auto', textAlign: 'left', color: '#c0392b' }}>
            {this.state.error.toString()}
          </pre>
        )}
        <button onClick={() => window.location.reload()} style={{ padding: '12px 28px', background: '#111', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Reload Page
        </button>
      </div>
    );
  }
}
