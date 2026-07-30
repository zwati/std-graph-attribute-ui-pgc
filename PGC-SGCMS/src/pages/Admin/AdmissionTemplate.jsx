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
      desc: 'Polite language, clear expression, and active listening skills.',
      color: '#0D1B4B'
    },
    {
      name: 'Class Participation',
      desc: 'Inquisitive, actively engages in discussions and asks relevant questions.',
      color: '#ea580c'
    },
    {
      name: 'Discipline',
      desc: 'Punctual, respects rules/teachers, behaves ethically, and stays neat.',
      color: '#0284c7'
    },
    {
      name: 'Teamwork',
      desc: 'Cooperates with peers, helps classmates, and works well in groups.',
      color: '#db2777'
    },
    {
      name: 'Responsibility',
      desc: 'Completes tasks on time, takes care of belongings, and is accountable.',
      color: '#7c3aed'
    },
    {
      name: 'Leadership',
      desc: 'Takes initiatives, assists peers, and demonstrates positive influence.',
      color: '#d4af37'
    }
  ];

  return (
    <div className="animate-fade">
      {/* Print Action Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '.75rem' }}>
        <button className="btn btn-primary" onClick={handlePrint} disabled={generating}>
          {generating ? 'Preparing Template…' : '⬇ Download / Print Evaluation Form'}
        </button>
      </div>

      {/* Printable Form Sheet */}
      <div id="pdf-report" className="pdf-container" style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,.05)',
        padding: '1.75rem',
        maxWidth: 760,
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif'
      }}>
        
        {/* PGC Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2.5px solid var(--pgc-navy)',
          paddingBottom: '0.85rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img src={logoImg} alt="PGC Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pgc-navy)', letterSpacing: '.01em' }}>
                Punjab Group of Colleges Sahiwal
              </div>
              <div style={{ fontSize: '.72rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                Student Growth & Character Management System (SGCMS)
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.65rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>
              Ref Number
            </div>
            <div style={{ fontWeight: 700, color: 'var(--gray-800)', fontSize: '.8rem' }}>
              PGC-ADM-2026
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--pgc-navy)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
            Student Admission Character Evaluation Form
          </h2>
          <p style={{ fontSize: '.78rem', color: 'var(--gray-500)', marginTop: '.3rem', lineHeight: 1.45, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', marginBottom: 0 }}>
            Please evaluate your child honestly on the following 6 core attributes. This baseline rating will help us tailor character development plans during their academic journey.
          </p>
        </div>

        {/* Blank Student Information Grid */}
        <div style={{
          border: '1px solid var(--gray-200)',
          borderRadius: 8,
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem 1.25rem',
          background: 'var(--gray-50)'
        }}>
          <div>
            <label style={{ fontSize: '.68rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Student Name
            </label>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20, marginTop: '.1rem' }}></div>
          </div>
          <div>
            <label style={{ fontSize: '.68rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Father's Name
            </label>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20, marginTop: '.1rem' }}></div>
          </div>
          <div>
            <label style={{ fontSize: '.68rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Previous School Name
            </label>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20, marginTop: '.1rem' }}></div>
          </div>
          <div>
            <label style={{ fontSize: '.68rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Applying Class & Stream (e.g. 1st Year ICS)
            </label>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20, marginTop: '.1rem' }}></div>
          </div>
        </div>

        {/* Attributes Rating Table */}
        <div style={{ marginBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--gray-200)' }}>
            <thead>
              <tr style={{ background: 'var(--pgc-navy)' }}>
                <th style={{ padding: '.55rem .75rem', textAlign: 'left', color: '#fff', background: 'var(--pgc-navy)', fontWeight: 700, fontSize: '.78rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  Core Attribute
                </th>
                <th style={{ padding: '.55rem .75rem', textAlign: 'left', color: '#fff', background: 'var(--pgc-navy)', fontWeight: 700, fontSize: '.78rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  Behavior Description
                </th>
                <th style={{ padding: '.55rem .75rem', textAlign: 'center', color: '#fff', background: 'var(--pgc-navy)', fontWeight: 700, fontSize: '.78rem', width: 200 }}>
                  Rating (1 to 5 Stars)
                </th>
              </tr>
            </thead>
            <tbody>
              {ATTR_DETAILS.map((attr, idx) => (
                <tr key={attr.name} style={{ background: idx % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                  <td style={{ padding: '.65rem .75rem', fontWeight: 700, borderBottom: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)', color: attr.color, fontSize: '.82rem' }}>
                    {attr.name}
                  </td>
                  <td style={{ padding: '.65rem .75rem', fontSize: '.75rem', color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)', borderRight: '1px solid var(--gray-200)', lineHeight: 1.4 }}>
                    {attr.desc}
                  </td>
                  <td style={{ padding: '.65rem .75rem', borderBottom: '1px solid var(--gray-200)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '.65rem', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '.05rem' }}>
                          <span style={{ fontSize: '1.1rem', color: 'var(--gray-300)', lineHeight: 1 }}>☆</span>
                          <span style={{ fontSize: '.62rem', color: 'var(--gray-400)', fontWeight: 600 }}>{star}</span>
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
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: 'var(--pgc-navy)', marginBottom: '.3rem', fontSize: '.82rem', fontWeight: 700 }}>
            Additional Notes / Parent's Observations
          </h4>
          <div style={{ border: '1px solid var(--gray-200)', borderRadius: 8, padding: '0.5rem .75rem', height: 48, background: '#fff' }}>
            <div style={{ borderBottom: '1px dotted var(--gray-200)', height: 16 }}></div>
            <div style={{ borderBottom: '1px dotted var(--gray-200)', height: 20 }}></div>
          </div>
        </div>

        {/* Signature lines */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '45%' }}>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20 }}></div>
            <div style={{ fontSize: '.72rem', color: 'var(--gray-500)', fontWeight: 600, marginTop: '.25rem', textAlign: 'center' }}>
              Parent's Signature & Date
            </div>
          </div>
          <div style={{ width: '45%' }}>
            <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20 }}></div>
            <div style={{ fontSize: '.72rem', color: 'var(--gray-500)', fontWeight: 600, marginTop: '.25rem', textAlign: 'center' }}>
              Relationship with Student
            </div>
          </div>
        </div>

        {/* Office Box (Footer) */}
        <div style={{
          border: '1.5px dashed var(--pgc-navy)',
          borderRadius: 8,
          background: 'rgba(13,27,75,0.01)',
          padding: '0.85rem',
          marginTop: '1rem'
        }}>
          <h4 style={{ color: 'var(--pgc-navy)', marginTop: 0, marginBottom: '.5rem', fontSize: '.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em' }}>
            For Office Use Only (Admission Office Assessment)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.85rem', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '.68rem', color: 'var(--gray-500)', fontWeight: 600 }}>Baseline Growth Index</span>
              <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20, fontSize: '.83rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                [ ___________________ % ]
              </div>
            </div>
            <div>
              <span style={{ fontSize: '.68rem', color: 'var(--gray-500)', fontWeight: 600 }}>Admission Officer Sign</span>
              <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20 }}></div>
            </div>
            <div>
              <span style={{ fontSize: '.68rem', color: 'var(--gray-500)', fontWeight: 600 }}>Verification Date</span>
              <div style={{ borderBottom: '1px solid var(--gray-300)', height: 20 }}></div>
            </div>
          </div>
        </div>

        {/* Report Footer bar */}
        <div style={{
          borderTop: '2px solid var(--pgc-navy)',
          paddingTop: '0.65rem',
          marginTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '.68rem',
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
          #pdf-report { 
            box-shadow: none !important; 
            border-radius: 0 !important; 
            padding: 5px !important; 
            margin: 0 auto !important; 
            max-width: 100% !important; 
          }
          body { background: white !important; }
          @page {
            size: auto;
            margin: 10mm 15mm 10mm 15mm;
          }
        }
      `}</style>
    </div>
  );
}
