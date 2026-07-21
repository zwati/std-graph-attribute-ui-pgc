// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import logoImg from '../../assets/logo.png';

const tabs = [
  { role: 'parent',  label: '👪 Parent',  userLabel: 'Roll Number', passLabel: 'Password' },
  { role: 'teacher', label: '👨‍🏫 Teacher', userLabel: 'Username',   passLabel: 'Password' },
  { role: 'admin',   label: '🛠 Admin',   userLabel: 'Username',   passLabel: 'Password' },
];

const redirectMap = { parent: '/parent', teacher: '/teacher', admin: '/admin' };

export default function Login() {
  const [params]     = useSearchParams();
  const initRole     = params.get('role') ?? 'parent';
  const [tab, setTab]     = useState(tabs.findIndex(t => t.role === initRole) || 0);
  const [username, setU]  = useState('');
  const [password, setP]  = useState('');
  const [loading, setL]   = useState(false);
  const [error, setErr]   = useState('');
  const { login }    = useAuth();
  const navigate     = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setL(true);
    try {
      const user = await login(username.trim(), password);
      navigate(redirectMap[user.role] ?? '/');
    } catch (err) {
      setErr(err?.response?.data?.error ?? 'Invalid credentials. Please try again.');
    } finally {
      setL(false);
    }
  }

  const current = tabs[tab];

  return (
    <div className="login-page">
      <div className="login-card animate-fade">
        {/* PGC Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.75rem' }}>
          <img src={logoImg} alt="PGC Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)' }}>SGCMS Login</div>
            <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>Student Growth & Character System</div>
          </div>
        </div>

        {/* Portal tabs */}
        <div className="login-tabs">
          {tabs.map((t, i) => (
            <button key={t.role} className={`login-tab${tab === i ? ' active' : ''}`} onClick={() => { setTab(i); setErr(''); }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="username">{current.userLabel}</label>
            <input id="username" className="input" type="text" required
              placeholder={current.role === 'parent' ? 'e.g. CS-2024-001' : 'Enter username'}
              value={username} onChange={e => setU(e.target.value)} autoFocus />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password">{current.passLabel}</label>
            <input id="password" className="input" type="password" required
              placeholder="Enter password" value={password} onChange={e => setP(e.target.value)} />
          </div>
          {error && <div className="error-msg" style={{ marginBottom: '.75rem' }}>⚠ {error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '.75rem' }}
            disabled={loading}>
            {loading ? 'Signing in…' : `Sign in as ${current.label.split(' ').slice(1).join(' ')}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none',
            color: 'var(--gray-400)', fontSize: '.82rem', cursor: 'pointer' }}>
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
