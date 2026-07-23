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

      {/* Top Navbar */}
      <nav className="home-nav">
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}>
            <img src={logoImg} alt="PGC Logo" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <span className="home-nav-brand-title" style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', letterSpacing: '.02em' }}>
                PUNJAB COLLEGES
              </span>
              <span style={{
                background: 'var(--pgc-red)',
                color: '#fff',
                fontSize: '.65rem',
                fontWeight: 800,
                padding: '.15rem .4rem',
                borderRadius: '4px',
                letterSpacing: '.04em'
              }}>
                SGCMS
              </span>
            </div>
            <div className="home-nav-brand-sub" style={{ color: 'rgba(255,255,255,.55)', fontSize: '.72rem', fontWeight: 500 }}>
              Sahiwal Campus • Student Growth System
            </div>
          </div>
        </div>

        {/* Center Nav Links (Hidden on Mobile) */}
        <div className="home-nav-center">
          <button
            onClick={() => document.getElementById('portals')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,.8)',
              fontSize: '.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: '.4rem .8rem',
              borderRadius: '6px'
            }}
            onMouseOver={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,.8)';
              e.currentTarget.style.background = 'none';
            }}
          >
            Portals
          </button>

          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,.8)',
              fontSize: '.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: '.4rem .8rem',
              borderRadius: '6px'
            }}
            onMouseOver={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,.8)';
              e.currentTarget.style.background = 'none';
            }}
          >
            Features
          </button>
        </div>

        {/* Right Action Button */}
        <div>
          <button
            className="btn home-nav-signin-btn"
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, var(--pgc-red) 0%, #a00d26 100%)',
              color: '#fff',
              padding: '.55rem 1.5rem',
              fontSize: '.85rem',
              fontWeight: 700,
              borderRadius: '8px',
              boxShadow: '0 4px 14px rgba(200, 16, 46, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(200, 16, 46, 0.6)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(200, 16, 46, 0.4)';
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '5rem 1.5rem 4.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Blur white glass overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'var(--pgc-red)', opacity: .1, top: -100, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'var(--pgc-navy)', opacity: .1, bottom: -50, left: -50, pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <span style={{
            background: 'rgba(200,16,46,.12)',
            color: 'var(--pgc-red)',
            padding: '.4rem 1.1rem',
            borderRadius: 999,
            fontSize: '.82rem',
            fontWeight: 700,
            letterSpacing: '.05em',
            border: '1px solid rgba(200,16,46,.25)'
          }}>
            PUNJAB GROUP OF COLLEGES
          </span>
          
          <h1 style={{
            color: 'var(--pgc-navy)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 900,
            marginTop: '1.5rem',
            lineHeight: 1.15,
            marginBottom: '1.25rem'
          }}>
            Student Growth &amp;<br />
            <span style={{ color: 'var(--pgc-red)' }}>Character Management</span>
          </h1>
          
          <p style={{
            color: 'var(--gray-800)',
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            maxWidth: 580,
            margin: '0 auto 2.5rem',
            fontWeight: 500,
            lineHeight: 1.6
          }}>
            A digital platform that replaces verbal PTM feedback with data-driven character reports, interactive charts, and downloadable PDF summaries.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => navigate('/login')}
              style={{ background: 'var(--pgc-red)', color: '#fff', fontSize: '1rem', padding: '.75rem 2.25rem', borderRadius: '10px', boxShadow: '0 4px 14px rgba(200,16,46,0.4)' }}>
              Get Started
            </button>
            <button className="btn btn-outline" onClick={() => document.getElementById('portals').scrollIntoView({ behavior: 'smooth' })}
              style={{ color: 'var(--pgc-navy)', borderColor: 'rgba(13,27,75,.4)', fontSize: '1rem', padding: '.75rem 2rem', borderRadius: '10px', background: 'rgba(255,255,255,0.7)' }}>
              View Portals ↓
            </button>
          </div>
        </div>
      </section>

      {/* Portal cards */}
      <section id="portals" style={{ padding: '3rem 1.5rem 4rem' }}>
        <h2 style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.1em', textAlign: 'center', marginBottom: '2rem' }}>
          Three Dedicated Portals
        </h2>
        <div className="portal-cards" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {portals.map(p => (
            <div key={p.role} className="portal-card" onClick={() => navigate(p.path)}>
              <div className="portal-icon" style={{ background: `${p.color}22` }}>
                <span style={{ fontSize: '2rem' }}>{p.icon}</span>
              </div>
              <h3 style={{ color: '#fff', marginBottom: '.5rem' }}>{p.label}</h3>
              <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.875rem', lineHeight: 1.6 }}>{p.desc}</p>
              <div style={{ marginTop: '1.25rem' }}>
                <span style={{ color: p.color, fontSize: '.85rem', fontWeight: 700 }}>Enter portal →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section id="features" style={{ background: 'rgba(255,255,255,.03)', padding: '3.5rem 1.5rem' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '2.5rem', fontWeight: 800 }}>Platform Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem', maxWidth: 1100, margin: '0 auto' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,.05)',
              border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>{f.icon}</div>
              <h4 style={{ color: '#fff', marginBottom: '.4rem', fontWeight: 700 }}>{f.title}</h4>
              <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Short Footer (Centered & Responsive) */}
      <footer className="home-footer">
        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.82rem' }}>
          © 2026 Punjab Group of Colleges. All rights reserved.
        </span>
        <a
          href="mailto:zwatisolutions@gmail.com?subject=PGC%20SGCMS%20Inquiry"
          style={{ color: 'rgba(255,255,255,.65)', fontSize: '.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = '#fff'}
          onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,.65)'}
        >
          Developed by <strong style={{ color: '#fff', textDecoration: 'underline' }}>ZWATI Solutions</strong>
        </a>
      </footer>
    </div>
  );
}
