// src/pages/Login/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import logoImg from '../../assets/logo.png';

const tabs = [
  { role: 'parent', label: '👪 Parent', userLabel: 'Roll Number', passLabel: 'Password' },
  { role: 'teacher', label: '👨‍🏫 Teacher', userLabel: 'Username', passLabel: 'Password' },
  { role: 'admin', label: '🛠 Admin', userLabel: 'Username / Email', passLabel: 'Password' },
];

const redirectMap = { parent: '/parent', teacher: '/teacher', admin: '/admin' };

export default function Login() {
  const [params] = useSearchParams();
  const initRole = params.get('role') ?? 'parent';
  const [tab, setTab] = useState(tabs.findIndex(t => t.role === initRole) || 0);
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [loading, setL] = useState(false);
  const [error, setErr] = useState('');

  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const { login } = useAuth();

  // PWA Install Prompt event
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setL(true);
    try {
      const user = await login(username.trim(), password);
      navigate(redirectMap[user.role] ?? '/');
    } catch (err) {
      setErr(err?.response?.data?.error ?? 'Invalid credentials. Please verify your server connection.');
    } finally {
      setL(false);
    }
  }

  function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    } else {
      setShowInstallGuide(v => !v);
    }
  }

  const current = tabs[tab];

  return (
    <div className="login-page">
      <div className="login-card animate-fade">
        {/* PGC Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.5rem' }}>
          <img src={logoImg} alt="PGC Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)' }}>SGCMS Login</div>
            <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>Student Growth & Character System</div>
          </div>
        </div>

        {/* PWA Always-Visible Install Banner */}
        <div style={{ background: 'rgba(13, 27, 75, 0.05)', border: '1px solid rgba(13, 27, 75, 0.2)', borderRadius: 8, padding: '.65rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--pgc-navy)' }}>
            📲 Mobile & Desktop App
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleInstallClick} style={{ padding: '.3rem .8rem', fontSize: '.78rem' }}>
            Install App 📥
          </button>
        </div>

        {/* Install Guide Modal / Dropdown */}
        {showInstallGuide && (
          <div style={{ background: '#fff', border: '2px solid var(--pgc-navy)', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
              <strong style={{ color: 'var(--pgc-navy)', fontSize: '.9rem' }}>How to Install PGC App:</strong>
              <button onClick={() => setShowInstallGuide(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ fontSize: '.8rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>
              <div><strong>🖥 Desktop (Chrome/Edge):</strong> Click the <strong>Install Icon (⊕ / 📥)</strong> at the top-right of your browser address bar, or click Menu (⋮) → <em>"Install PGC SGCMS"</em>.</div>
              <div style={{ marginTop: '.4rem' }}><strong>📱 Android (Chrome):</strong> Tap Menu (⋮) → tap <em>"Add to Home screen"</em> or <em>"Install app"</em>.</div>
              <div style={{ marginTop: '.4rem' }}><strong>🍎 iPhone (Safari):</strong> Tap Share button (⎋) → tap <em>"Add to Home Screen"</em>.</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="username">ID</label>
            <input id="username" className="input" type="text" required
              placeholder="Enter Id / Roll Number / Email"
              value={username} onChange={e => setU(e.target.value)} autoFocus />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" type="password" required
              placeholder="Enter password" value={password} onChange={e => setP(e.target.value)} />
          </div>
          {error && <div className="error-msg" style={{ marginBottom: '.75rem' }}>⚠ {error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '.75rem' }}
            disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.4rem',
              background: 'rgba(13, 27, 75, 0.05)',
              border: '1px solid rgba(13, 27, 75, 0.15)',
              borderRadius: '20px',
              padding: '.45rem 1.25rem',
              color: 'var(--pgc-navy)',
              fontSize: '.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(13, 27, 75, 0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(13, 27, 75, 0.05)'}
          >
            <span>←</span> Back to Home
          </button>

          <div
            style={{
              fontSize: '.75rem',
              color: '#9ca3af',
              marginTop: '.2rem',
              fontWeight: 500,
              letterSpacing: '.02em',
              userSelect: 'none',
            }}
          >
            Developed by <span style={{ color: '#6b7280', fontWeight: 600 }}>ZWATI Solutions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

