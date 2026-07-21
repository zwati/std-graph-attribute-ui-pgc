// src/layouts/MainLayout.jsx  — wraps admin/teacher/parent portals with sidebar + topbar
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

const pageTitles = {
  '/admin':              'Dashboard',
  '/admin/students':     'Student Database',
  '/admin/add-student':  'Add Student',
  '/admin/teachers':     'Teachers',
  '/admin/parents':      'Parents',
  '/admin/analytics':    'Analytics',
  '/admin/settings':     'Settings',
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

export default function MainLayout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'PGC SGCMS';

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>
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
