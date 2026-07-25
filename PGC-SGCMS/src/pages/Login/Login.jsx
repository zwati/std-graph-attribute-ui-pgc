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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login, user } = useAuth();

  const initRole = params.get('role') ?? 'parent';
  const [tab, setTab] = useState(() => {
    const idx = tabs.findIndex(t => t.role === initRole);
    return idx >= 0 ? idx : 0;
  });
  const current = tabs[tab];

  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [loading, setL] = useState(false);
  const [error, setErr] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials when active tab changes
  useEffect(() => {
    const savedUser = localStorage.getItem(`saved_user_${current.role}`);
    const savedPass = localStorage.getItem(`saved_pass_${current.role}`);
    const savedRemember = localStorage.getItem(`saved_remember_${current.role}`) === 'true';
    if (savedRemember && savedUser) {
      setU(savedUser);
      setP(savedPass || '');
      setRememberMe(true);
    } else {
      setU('');
      setP('');
      setRememberMe(false);
    }
  }, [tab, current.role]);

  // Auto-redirect if user already has an active session
  useEffect(() => {
    if (user) {
      navigate(redirectMap[user.role] ?? '/');
    }
  }, [user, navigate]);



  const expiredMsg = params.get('expired') === 'true';
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');

    if (!navigator.onLine) {
      setErr('You are offline. Please check your internet connection.');
      return;
    }

    setL(true);
    try {
      const loggedUser = await login(username.trim(), password);

      // Save or remove credentials based on Remember Me checkbox state
      if (rememberMe) {
        localStorage.setItem(`saved_user_${current.role}`, username.trim());
        localStorage.setItem(`saved_pass_${current.role}`, password);
        localStorage.setItem(`saved_remember_${current.role}`, 'true');
      } else {
        localStorage.removeItem(`saved_user_${current.role}`);
        localStorage.removeItem(`saved_pass_${current.role}`);
        localStorage.removeItem(`saved_remember_${current.role}`);
      }

      navigate(redirectMap[loggedUser.role] ?? '/');
    } catch (err) {
      if (!navigator.onLine || err.message === 'Network Error' || !err.response) {
        setErr('You are offline. Please check your internet connection.');
      } else {
        setErr(err?.response?.data?.error ?? 'Invalid credentials. Please verify your server connection.');
      }
    } finally {
      setL(false);
    }
  }
  return (
    <div className="login-page">
      <div className="login-card animate-fade">
        {/* Session Expired Alert Banner */}
        {expiredMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '.65rem 1rem', marginBottom: '1.25rem', color: '#991b1b', fontSize: '.8rem', fontWeight: 600 }}>
            ⏳ Your session has expired due to inactivity. Please login again.
          </div>
        )}

        {/* PGC Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.5rem' }}>
          <img src={logoImg} alt="PGC Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)' }}>SGCMS Login</div>
            <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>Student Growth & Character System</div>
          </div>
        </div>
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

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.25rem', userSelect: 'none' }}>
            <input 
              id="rememberMe" 
              type="checkbox" 
              checked={rememberMe} 
              onChange={e => setRememberMe(e.target.checked)} 
              style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--pgc-navy)' }} 
            />
            <label htmlFor="rememberMe" style={{ fontSize: '.85rem', color: 'var(--gray-700)', cursor: 'pointer', fontWeight: 500 }}>
              Remember Me
            </label>
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

