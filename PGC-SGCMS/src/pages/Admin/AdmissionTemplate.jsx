// src/pages/Admin/AdmissionTemplate.jsx
import { useState } from 'react';
import logoImg from '../../assets/logo.png';

export default function AdmissionTemplate() {
  const [generating, setGenerating] = useState(false);

  function handlePrint() {
    setGenerating(true);
    setTimeout(() => {
      window.print();
      setGenerating(false);
    }, 300);
  }

  const ATTR_DETAILS = [
    {
      name: 'Communication',
      desc: 'Expresses thoughts clearly, listens carefully to others, uses polite language, and maintains respectful interactions.',
      color: '#0D1B4B' // Navy
    },
    {
      name: 'Class Participation',
      desc: 'Inquisitive, actively participates in discussions, asks relevant questions, and shows interest in classroom activities.',
      color: '#ea580c' // Orange
    },
    {
      name: 'Discipline',
      desc: 'Punctual, follows rules, behaves ethically, respects elders/teachers, and maintains neatness.',
      color: '#0284c7' // Ocean Blue
    },
    {
      name: 'Teamwork',
      desc: 'Cooperates with peers, helps classmates, works collaboratively in groups, and supports peer study.',
      color: '#db2777' // Rose
    },
    {
      name: 'Responsibility',
      desc: 'Completes given tasks on time, takes care of belongings, and accepts accountability for actions.',
      color: '#7c3aed' // Violet
    },
    {
      name: 'Leadership',
      desc: 'Takes initiatives, guides classmates, demonstrates positive influence, and coordinates events/activities.',
      color: '#d4af37' // Gold
    }
  ];

  return (
    <div className="animate-fade">
      {/* Print Action Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem', gap: '.75rem' }}>
        <button className="btn btn-primary" onClick={handlePrint} disabled={generating}>
          {generating ? 'Preparing Template…' : '⬇ Download / Print Evaluation Form'}
        </button>
      </div>

      {/* Printable Form Sheet */}
      <div id="pdf-report" className="pdf-container" style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,.08)',
        padding: '2.5rem',
        maxWidth: 780,
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif'
      }}>
        
        {/* PGC Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid var(--pgc-navy)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={logoImg} alt="PGC Logo" style={{ width: 56, height: 56, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pgc-navy)', letterSpacing: '.02em' }}>
                Punjab Group of Colleges
              </div>
              <div style={{ fontSize: '.78rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                Student Character & Attribute Management System (SGCMS)
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.72rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>
              Form Reference
            </div>
            <div style={{ fontWeight: 700, color: 'var(--gray-800)', fontSize: '.875rem' }}>
              PGC-ADM-2026
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--pgc-navy)', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
            Student Admission Character Evaluation Form
          </h2>
          <p style={{ fontSize: '.82rem', color: 'var(--gray-500)', marginTop: '.4rem', lineHeight: 1.5, maxWidth: 640, marginLeft: 'auto', marginSpace: 'auto', marginRight: 'auto' }}>
            Dear Parent/Guardian, Punjab Group of Colleges believes in holistic growth and character development.
            Please rate your child honestly on the following 6 core attributes. This baseline rating will help us tailor character development plans for your child.
          </p>
        </div>

        {/* Blank Student Information Grid */}
        <div style={{
          border: '1.5px solid var(--gray-200)',
          borderRadius: 8,
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem 1.5rem',
          background: 'var(--gray-50)'
        }}>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Student Name
            </label>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 26, marginTop: '.2rem' }}></div>
          </div>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Father's Name
            </label>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 26, marginTop: '.2rem' }}></div>
          </div>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Previous School Name
            </label>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 26, marginTop: '.2rem' }}></div>
          </div>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Applying Class & Stream (e.g. 1st Year ICS/Medical)
            </label>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 26, marginTop: '.2rem' }}></div>
          </div>
        </div>

        {/* Attributes Rating Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid var(--gray-200)' }}>
            <thead>
              <tr style={{ background: 'var(--pgc-navy)' }}>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', color: '#fff', background: 'var(--pgc-navy)', fontWeight: 700, fontSize: '.83rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  Core Attribute
                </th>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', color: '#fff', background: 'var(--pgc-navy)', fontWeight: 700, fontSize: '.83rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  Behavior Checklist / Description
                </th>
                <th style={{ padding: '.75rem 1rem', textAlign: 'center', color: '#fff', background: 'var(--pgc-navy)', fontWeight: 700, fontSize: '.83rem', width: 220 }}>
                  Rating (1 to 5 Stars)
                </th>
              </tr>
            </thead>
            <tbody>
              {ATTR_DETAILS.map((attr, idx) => (
                <tr key={attr.name} style={{ background: idx % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                  <td style={{ padding: '.85rem 1rem', fontWeight: 700, borderBottom: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)', color: attr.color, fontSize: '.9rem' }}>
                    {attr.name}
                  </td>
                  <td style={{ padding: '.85rem 1rem', fontSize: '.78rem', color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)', lineHeight: 1.5 }}>
                    {attr.desc}
                  </td>
                  <td style={{ padding: '.85rem 1rem', borderBottom: '1px solid var(--gray-200)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '.65rem', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '.15rem' }}>
                          <span style={{ fontSize: '1.25rem', color: 'var(--gray-300)' }}>☆</span>
                          <span style={{ fontSize: '.68rem', color: 'var(--gray-400)', fontWeight: 600 }}>{star}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Written Remarks Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: 'var(--pgc-navy)', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: 700 }}>
            Additional Notes / Parent's Observations
          </h4>
          <p style={{ fontSize: '.75rem', color: 'var(--gray-400)', margin: '0 0 .6rem 0' }}>
            Describe any unique strengths, habits, or behavioral areas where you feel your child requires special focus:
          </p>
          <div style={{ border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '1rem', height: 80, background: '#fff' }}>
            <div style={{ borderBottom: '1px dotted var(--gray-200)', height: 20 }}></div>
            <div style={{ borderBottom: '1px dotted var(--gray-200)', height: 24 }}></div>
          </div>
        </div>

        {/* Signature lines */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '45%' }}>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 26 }}></div>
            <div style={{ fontSize: '.75rem', color: 'var(--gray-500)', fontWeight: 600, marginTop: '.3rem', textAlign: 'center' }}>
              Parent's Signature & Date
            </div>
          </div>
          <div style={{ width: '45%' }}>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 26 }}></div>
            <div style={{ fontSize: '.75rem', color: 'var(--gray-500)', fontWeight: 600, marginTop: '.3rem', textAlign: 'center' }}>
              Relationship with Student
            </div>
          </div>
        </div>

        {/* Office Box (Footer) */}
        <div style={{
          border: '2px dashed var(--pgc-navy)',
          borderRadius: 10,
          background: 'rgba(13,27,75,0.02)',
          padding: '1.25rem',
          marginTop: '2rem'
        }}>
          <h4 style={{ color: 'var(--pgc-navy)', marginTop: 0, marginBottom: '.65rem', fontSize: '.83rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em' }}>
            For Office Use Only (Admission Office Assessment)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '.7rem', color: 'var(--gray-500)', fontWeight: 600 }}>Calculated Baseline Growth Index</span>
              <div style={{ borderBottom: '1.5px solid var(--gray-300)', height: 26, fontSize: '.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '.2rem' }}>
                [ ____________________ % ]
              </div>
            </div>
            <div>
              <span style={{ fontSize: '.7rem', color: 'var(--gray-500)', fontWeight: 600 }}>Admission Officer Sign</span>
              <div style={{ borderBottom: '1.5px solid var(--gray-300)', height: 26 }}></div>
            </div>
            <div>
              <span style={{ fontSize: '.7rem', color: 'var(--gray-500)', fontWeight: 600 }}>Verification Date</span>
              <div style={{ borderBottom: '1.5px solid var(--gray-300)', height: 26 }}></div>
            </div>
          </div>
        </div>

        {/* Report Footer bar */}
        <div style={{
          borderTop: '2.5px solid var(--pgc-navy)',
          paddingTop: '0.85rem',
          marginTop: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '.72rem',
          color: 'var(--gray-400)',
          fontWeight: 500
        }}>
          <span>PGC SGCMS © 2026 Punjab Group of Colleges. All rights reserved.</span>
          <span>Printed: {new Date().toLocaleDateString('en-PK')}</span>
        </div>

      </div>

      {/* Print Overrides CSS */}
      <style>{`
        @media print {
          .no-print, .sidebar, .topbar { display: none !important; }
          .main-content { margin-left: 0 !important; }
          .page-body { padding: 0 !important; }
          #pdf-report { box-shadow: none !important; border-radius: 0 !important; padding: 0.5rem !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
