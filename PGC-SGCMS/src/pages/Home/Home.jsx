// src/pages/Home/Home.jsx — Landing page
import { useNavigate } from 'react-router-dom';
import heroBg from '../../assets/hero-bg.jpg';
import logoImg from '../../assets/logo.png';

const portals = [
  { role: 'parent',  icon: '👪', label: 'Parent Portal',  desc: 'View your child\'s growth, progress charts, and download the PTM report.', color: '#7c3aed', path: '/login?role=parent' },
  { role: 'teacher', icon: '👨‍🏫', label: 'Teacher Portal', desc: 'Evaluate students on 5 character attributes and track class-wide progress.', color: '#16a34a', path: '/login?role=teacher' },
  { role: 'admin',   icon: '🛠',  label: 'Admin Portal',   desc: 'Manage students, teachers, and access school-wide analytics and reports.', color: '#C8102E', path: '/login?role=admin' },
];

const features = [
  { icon: '🕸', title: 'Radar Analysis', desc: '5-attribute spider chart showing character balance at a glance.' },
  { icon: '📈', title: 'Monthly Trends', desc: 'Line & bar charts tracking growth across every month of the term.' },
  { icon: '🎯', title: 'Growth Index', desc: 'A single 0–100 score summarising overall character development.' },
  { icon: '📄', title: 'PDF Reports', desc: 'Generate and download a professional PTM report instantly.' },
  { icon: '🔒', title: 'Secure Access', desc: 'Role-based portals with JWT authentication for each user type.' },
  { icon: '⭐', title: 'Star Ratings', desc: 'Teachers rate each attribute 1–5 stars; system auto-computes the index.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pgc-navy)', fontFamily: 'Inter, sans-serif' }}>

      {/* Top nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <img src={logoImg} alt="PGC Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>SGCMS</div>
            <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '.7rem' }}>Student Growth & Character System</div>
          </div>
        </div>
        <button className="btn" onClick={() => navigate('/login')}
          style={{ background: 'var(--pgc-red)', color: '#fff', padding: '.55rem 1.25rem', fontSize: '.85rem' }}>
          Sign In →
        </button>
      </nav>

      {/* Hero */}
      <section style={{ padding: '6rem 2.5rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {/* Blur white glass overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'var(--pgc-red)', opacity: .1, top: -100, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'var(--pgc-navy)', opacity: .1, bottom: -50, left: -50, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ background: 'rgba(200,16,46,.1)', color: 'var(--pgc-red)',
            padding: '.35rem 1rem', borderRadius: 999, fontSize: '.8rem', fontWeight: 600, letterSpacing: '.04em' }}>
            Built for PGC Colleges
          </span>
          <h1 style={{ color: 'var(--pgc-navy)', fontSize: '3rem', fontWeight: 900, marginTop: '1.5rem',
            lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Student Growth &<br />
            <span style={{ color: 'var(--pgc-red)' }}>Character Management</span>
          </h1>
          <p style={{ color: 'var(--gray-700)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 2.5rem', fontWeight: 500 }}>
            A digital platform that replaces verbal PTM feedback with data-driven character reports, interactive charts, and downloadable PDF summaries.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => navigate('/login')}
              style={{ background: 'var(--pgc-red)', color: '#fff', fontSize: '1rem', padding: '.75rem 2rem' }}>
              Get Started
            </button>
            <button className="btn btn-outline" onClick={() => document.getElementById('portals').scrollIntoView({ behavior: 'smooth' })}
              style={{ color: 'var(--pgc-navy)', borderColor: 'rgba(13,27,75,.4)', fontSize: '1rem', padding: '.75rem 2rem' }}>
              View Portals ↓
            </button>
          </div>
        </div>
      </section>

      {/* Portal cards */}
      <section id="portals" style={{ padding: '2rem 2.5rem 4rem' }}>
        <h2 style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'center', marginBottom: '2rem' }}>
          Three dedicated portals
        </h2>
        <div className="portal-cards" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {portals.map(p => (
            <div key={p.role} className="portal-card" onClick={() => navigate(p.path)}>
              <div className="portal-icon" style={{ background: `${p.color}22` }}>
                <span style={{ fontSize: '2rem' }}>{p.icon}</span>
              </div>
              <h3 style={{ color: '#fff', marginBottom: '.5rem' }}>{p.label}</h3>
              <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.875rem', lineHeight: 1.6 }}>{p.desc}</p>
              <div style={{ marginTop: '1.25rem' }}>
                <span style={{ color: p.color, fontSize: '.85rem', fontWeight: 600 }}>Enter portal →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section style={{ background: 'rgba(255,255,255,.03)', padding: '3rem 2.5rem' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '2.5rem' }}>Platform Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem', maxWidth: 1100, margin: '0 auto' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,.05)',
              border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>{f.icon}</div>
              <h4 style={{ color: '#fff', marginBottom: '.4rem' }}>{f.title}</h4>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '1.5rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '.8rem' }}>© 2026 PGC Colleges — SGCMS v1.0</span>
        <span style={{ color: 'rgba(255,255,255,.25)', fontSize: '.8rem' }}>Student Growth & Character Management System</span>
      </footer>
    </div>
  );
}
