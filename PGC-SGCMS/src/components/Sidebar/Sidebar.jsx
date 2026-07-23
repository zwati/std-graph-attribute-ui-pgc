// src/components/Sidebar/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import logoImg from '../../assets/logo.png';

const icons = {
  dashboard: '📊', students: '👨‍🎓', evaluate: '⭐', history: '📋',
  reports: '📄', add: '➕', teachers: '👨‍🏫', parents: '👪',
  analytics: '📈', settings: '⚙️', profile: '👤', progress: '📉',
  download: '⬇️', list: '📝',
};

const navConfig = {
  admin: [
    { section: 'Overview', links: [{ to: '/admin', icon: icons.dashboard, label: 'Dashboard' }] },
    {
      section: 'Students & Classes', links: [
        { to: '/admin/students', icon: icons.students, label: 'Student Database' },
        { to: '/admin/classes', icon: icons.add, label: 'Class Management' },
      ]
    },

    {
      section: 'People', links: [
        { to: '/admin/teachers', icon: icons.teachers, label: 'Teachers' },
        { to: '/admin/parents', icon: icons.parents, label: 'Parents' },
      ]
    },
    {
      section: 'Insights', links: [
        { to: '/admin/analytics', icon: icons.analytics, label: 'Analytics' },
      ]
    },
  ],
  teacher: [
    { section: 'Overview', links: [{ to: '/teacher', icon: icons.dashboard, label: 'Dashboard' }] },
    {
      section: 'Students', links: [
        { to: '/teacher/students', icon: icons.list, label: 'My Students' },
        { to: '/teacher/evaluate', icon: icons.evaluate, label: 'Evaluate' },
        { to: '/teacher/history', icon: icons.history, label: 'History' },
      ]
    },
    {
      section: 'Reports', links: [
        { to: '/teacher/reports', icon: icons.reports, label: 'Reports' },
      ]
    },
  ],
  parent: [
    {
      section: 'My Child', links: [
        { to: '/parent', icon: icons.dashboard, label: 'Dashboard' },
        { to: '/parent/profile', icon: icons.profile, label: 'Profile' },
        { to: '/parent/progress', icon: icons.progress, label: 'Progress' },
        { to: '/parent/reports', icon: icons.reports, label: 'Remarks' },
        { to: '/parent/download', icon: icons.download, label: 'Download PDF' },
      ]
    },
  ],
};

const roleLabel = { admin: 'Admin Portal', teacher: 'Teacher Portal', parent: 'Parent Portal' };

export default function Sidebar({ mobileOpen = false, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role ?? 'admin';
  const links = navConfig[role] ?? [];

  function handleLogout() {
    logout();
    onClose?.();
    navigate('/login');
  }

  return (
    <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
      <div className="sidebar-logo" style={{ padding: '1rem 0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', flex: 1, minWidth: 0 }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 6,
            padding: '2px 6px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}>
            <img
              src={logoImg}
              alt="PGC Logo"
              style={{ width: 'auto', height: 40, maxHeight: 40, objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '.02em', display: 'block', lineHeight: 1.2 }}>
              PGC SGCMS
            </span>
            <small style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {roleLabel[role]}
            </small>
          </div>
        </div>



        {/* Close Button for Mobile Drawer */}
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ section, links: sLinks }) => (
          <div key={section}>
            <div className="nav-section">{section}</div>
            {sLinks.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin' || to === '/teacher' || to === '/parent'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => onClose?.()}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ color: 'rgba(255,255,255,.55)', fontSize: '.75rem', marginBottom: '.4rem', paddingLeft: '.25rem' }}>
          Logged in as <strong style={{ color: '#fff' }}>{user?.username}</strong>
        </div>
        <button
          className="nav-link"
          onClick={handleLogout}
          style={{
            width: '100%',
            color: '#ff6b6b',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            padding: '.55rem .75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(200, 16, 46, 0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
        >
          <span>🚪</span><span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

