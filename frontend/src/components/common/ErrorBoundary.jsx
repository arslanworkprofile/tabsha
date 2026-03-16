import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error);
    console.error('Component stack:', info?.componentStack);
    this.setState({ info });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg = this.state.error?.message || 'Unknown error';
    const stack = this.state.info?.componentStack || '';

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16, padding: 40, textAlign: 'center',
        fontFamily: 'Inter, sans-serif', background: '#fff'
      }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 400 }}>
          Something went wrong
        </h2>

        {/* Always show the error message to help debug */}
        <div style={{
          background: '#fff5f5', border: '1px solid #fed7d7',
          borderRadius: 8, padding: '12px 20px',
          maxWidth: 600, width: '100%', textAlign: 'left'
        }}>
          <p style={{ fontSize: 13, color: '#c53030', fontFamily: 'monospace', wordBreak: 'break-word' }}>
            {msg}
          </p>
          {stack && (
            <pre style={{
              fontSize: 10, color: '#9b2c2c', marginTop: 8,
              overflow: 'auto', maxHeight: 150, whiteSpace: 'pre-wrap'
            }}>
              {stack.trim().split('\n').slice(0, 8).join('\n')}
            </pre>
          )}
        </div>

        <p style={{ fontSize: 13, color: '#888', maxWidth: 400 }}>
          Check the browser Console (F12) for more details.
        </p>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 28px', background: '#111', color: '#fff',
            border: 'none', borderRadius: 4, fontSize: 13,
            fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
          }}
        >
          Reload Page
        </button>

        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 24px', background: 'transparent', color: '#666',
            border: '1px solid #ddd', borderRadius: 4, fontSize: 13,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif'
          }}
        >
          Go to Homepage
        </button>
      </div>
    );
  }
}
