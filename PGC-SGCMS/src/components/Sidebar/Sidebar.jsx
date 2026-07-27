// src/components/Sidebar/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import logoImg from '../../assets/logo.png';

// Modern SVG icon components (Feather/Lucide style)
const Icon = ({ d, children, viewBox = "0 0 24 24", ...rest }) => (
  <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17" {...rest}>
    {children || <path d={d} />}
  </svg>
);

const icons = {
  dashboard: () => (
    <Icon><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></Icon>
  ),
  students: () => (
    <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>
  ),
  evaluate: () => (
    <Icon><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>
  ),
  history: () => (
    <Icon><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>
  ),
  reports: () => (
    <Icon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Icon>
  ),
  add: () => (
    <Icon><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></Icon>
  ),
  teachers: () => (
    <Icon><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>
  ),
  parents: () => (
    <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>
  ),
  analytics: () => (
    <Icon><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Icon>
  ),
  profile: () => (
    <Icon><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></Icon>
  ),
  progress: () => (
    <Icon><path d="M18 20V10M12 20V4M6 20v-6"/></Icon>
  ),
  download: () => (
    <Icon><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Icon>
  ),
  list: () => (
    <Icon><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></Icon>
  ),
  logout: () => (
    <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
  ),
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
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{typeof icon === 'function' ? icon() : icon}</span>
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
          <span style={{ display: 'flex', alignItems: 'center' }}>{icons.logout()}</span><span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

