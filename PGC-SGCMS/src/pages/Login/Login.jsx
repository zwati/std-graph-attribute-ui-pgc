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

  // Server Host Config state
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const { login, apiUrl, updateServerUrl } = useAuth();
  const [customServerUrl, setCustomServerUrl] = useState(apiUrl);

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

  function handleSaveServerUrl(e) {
    e.preventDefault();
    updateServerUrl(customServerUrl);
    setShowServerConfig(false);
  }

  function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    } else {
      setShowInstallGuide(v => !v);
    }
  }

  function fillAdminDemo() {
    setTab(2); // Switch to admin tab
    setU('admin@pgc.com');
    setP('adminpgc');
  }

  function fillTeacherDemo() {
    setTab(1); // Switch to teacher tab
    setU('teacher@pgc.com');
    setP('teacherpgc');
  }


  const current = tabs[tab];

  return (
    <div className="login-page">
      <div className="login-card animate-fade">
        {/* PGC Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <img src={logoImg} alt="PGC Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)' }}>SGCMS Login</div>
              <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>Student Growth & Character System</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowServerConfig(s => !s)}
            style={{ background: 'none', border: '1px solid var(--gray-200)', borderRadius: 6, padding: '.3rem .6rem', fontSize: '.75rem', cursor: 'pointer' }}
            title="Configure Server IP & Port"
          >
            ⚙ Server Host
          </button>
        </div>

        {/* Server IP Config panel */}
        {showServerConfig && (
          <form onSubmit={handleSaveServerUrl} style={{ background: 'var(--gray-50)', padding: '.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--pgc-navy)', marginBottom: '.3rem' }}>
              Central Server Endpoint URL
            </div>
            <input
              type="text"
              className="input"
              style={{ fontSize: '.82rem', padding: '.4rem .6rem', marginBottom: '.5rem' }}
              value={customServerUrl}
              onChange={e => setCustomServerUrl(e.target.value)}
              placeholder="http://192.168.1.100:5000/api"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.5rem' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowServerConfig(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save Host</button>
            </div>
          </form>
        )}

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


        {/* Quick Demo Fill links */}
        <div style={{ textAlign: 'center', marginTop: '.75rem', fontSize: '.78rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button type="button" onClick={fillTeacherDemo} style={{ background: 'none', border: 'none', color: 'var(--pgc-navy)', textDecoration: 'underline', cursor: 'pointer' }}>
            Autofill Teacher (teacher@pgc.com)
          </button>
          <span>·</span>
          <button type="button" onClick={fillAdminDemo} style={{ background: 'none', border: 'none', color: 'var(--pgc-navy)', textDecoration: 'underline', cursor: 'pointer' }}>
            Autofill Admin (admin@pgc.com)
          </button>
        </div>


        <div style={{ textAlign: 'center', marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none',
            color: 'var(--gray-400)', fontSize: '.82rem', cursor: 'pointer'
          }}>
            ← Back to home
          </button>
          <span style={{ fontSize: '.72rem', color: 'var(--gray-400)' }}>
            Server: {apiUrl.replace('/api', '')}
          </span>
        </div>
      </div>
    </div>
  );
}


