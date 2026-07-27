import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';


const pageTitles = {
  '/admin':              'Dashboard',
  '/admin/students':     'Student Database',
  '/admin/classes':      'Class & Category Management',
  '/admin/add-student':  'Class Management',
  '/admin/teachers':     'Teachers',
  '/admin/parents':      'Parents',
  '/admin/analytics':    'Analytics',
  '/teacher':            'Dashboard',
  '/teacher/students':   'My Students',
  '/teacher/evaluate':   'Evaluate Student',
  '/teacher/history':    'Evaluation History',
  '/teacher/reports':    'Reports',
  '/parent':             'Dashboard',
  '/parent/profile':     'Student Profile',
  '/parent/progress':    'Progress',
  '/parent/reports':     'Remarks',
  '/parent/download':    'Download PDF Report',
};

const dynamicTitlePatterns = [
  { pattern: /^\/admin\/student\/.+\/profile$/, title: 'Student Profile' },
  { pattern: /^\/admin\/edit\/.+$/, title: 'Edit Student' },
];

function getPageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const { pattern, title } of dynamicTitlePatterns) {
    if (pattern.test(pathname)) return title;
  }
  return 'PGC SGCMS';
}

export default function MainLayout() {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="layout">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar with mobileOpen prop */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            {/* Hamburger Button for Mobile */}
            <button
              className="hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <h1 className="topbar-title">{title}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="topbar-date">
              {new Date().toLocaleDateString('en-PK', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>

        <main className="page-body animate-fade">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

