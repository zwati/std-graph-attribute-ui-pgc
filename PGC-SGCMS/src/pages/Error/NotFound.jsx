// src/pages/Error/NotFound.jsx
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--pgc-navy)', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎓</div>
      <h1 style={{ color: '#fff', fontSize: '5rem', fontWeight: 900, lineHeight: 1 }}>404</h1>
      <p style={{ color: 'rgba(255,255,255,.55)', margin: '1rem 0 2rem', fontSize: '1.1rem' }}>
        Page not found
      </p>
      <button className="btn" onClick={() => navigate('/')}
        style={{ background: 'var(--pgc-red)', color: '#fff' }}>← Back to Home</button>
    </div>
  );
}
