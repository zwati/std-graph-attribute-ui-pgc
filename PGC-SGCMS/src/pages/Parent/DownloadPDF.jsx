// src/pages/Parent/DownloadPDF.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { growthLabel } from '../../utils/growthLabel';
import { growthColor } from '../../utils/attributeColors';
import { formatDate, formatMonth } from '../../utils/formatDate';
import logoImg from '../../assets/logo.png';

const ATTR_LABELS = {
  communication: 'Communication', participation: 'Class Participation',
  discipline: 'Discipline', teamwork: 'Teamwork', responsibility: 'Responsibility',
};

// Rule-based insight generator — no external AI needed
function generateInsight(growthIndex, attrs, evaluations) {
  const label = growthLabel(growthIndex);
  const best  = Object.entries(attrs).sort(([,a],[,b]) => b - a)[0];
  const worst = Object.entries(attrs).sort(([,a],[,b]) => a - b)[0];
  const trend = evaluations.length >= 2
    ? evaluations[0].growthIndexAtSubmit > evaluations[1].growthIndexAtSubmit ? 'improving' : 'declining'
    : 'consistent';

  return `${label === 'Excellent' ? 'Outstanding performance!' : label === 'Good' ? 'Solid progress this term.' : 'Room for growth ahead.'} `
    + `The student shows strongest results in ${ATTR_LABELS[best?.[0]] ?? 'overall performance'} and `
    + `would benefit from focused effort on ${ATTR_LABELS[worst?.[0]] ?? 'key attributes'}. `
    + `Recent trend is ${trend}. `
    + (label === 'Needs Improvement'
        ? 'We encourage regular practice and open communication with the teacher.'
        : 'Keep up the great work and continue building on these strengths.');
}

import { apiCache } from '../../utils/apiCache';

export default function DownloadPDF() {
  const { authAxios } = useAuth();
  const [profile,     setProfile]     = useState(() => apiCache.get('parent_profile') || null);
  const [growth,      setGrowth]      = useState(() => apiCache.get('parent_growth') || null);
  const [evaluations, setEvaluations] = useState(() => apiCache.get('parent_evaluations') || []);
  const [loading,     setLoading]     = useState(() => !apiCache.get('parent_profile'));
  const [generating,  setGenerating]  = useState(false);

  useEffect(() => {
    const pCache = apiCache.get('parent_profile');
    const gCache = apiCache.get('parent_growth');
    const eCache = apiCache.get('parent_evaluations');
    if (pCache && gCache && eCache) {
      setProfile(pCache);
      setGrowth(gCache);
      setEvaluations(eCache);
      setLoading(false);
    }

    Promise.all([
      authAxios.get('/parent/profile'),
      authAxios.get('/parent/growth'),
      authAxios.get('/parent/evaluations'),
    ]).then(([p, g, e]) => {
      apiCache.set('parent_profile', p.data.data);
      apiCache.set('parent_growth', g.data.data);
      apiCache.set('parent_evaluations', e.data.data);
      setProfile(p.data.data);
      setGrowth(g.data.data);
      setEvaluations(e.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const latestEval = evaluations[0];
  const avgAttrs   = latestEval
    ? Object.fromEntries(Object.keys(ATTR_LABELS).map(k => [k, latestEval[k] ?? 0]))
    : {};
  const score      = growth?.growthIndex ?? 0;
  const insight    = !loading && profile ? generateInsight(score, avgAttrs, evaluations) : '';

  // Client-side print/PDF via browser print dialog
  function handlePrint() {
    setGenerating(true);
    setTimeout(() => { window.print(); setGenerating(false); }, 300);
  }

  if (loading) return <p style={{ textAlign:'center', color:'var(--gray-400)', padding:'3rem' }}>Loading report…</p>;

  return (
    <div className="animate-fade">
      {/* Action bar — hidden in print */}
      <div className="no-print" style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.25rem', gap:'.75rem' }}>
        <button className="btn btn-primary" onClick={handlePrint} disabled={generating}>
          {generating ? 'Preparing…' : '⬇ Download / Print PDF'}
        </button>
      </div>

      {/* ── Report body (print target) ── */}
      <div id="pdf-report" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,.08)', padding: '2.5rem', maxWidth: 780, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          borderBottom:'3px solid var(--pgc-navy)', paddingBottom:'1.25rem', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <img src={logoImg} alt="PGC Logo" style={{ width:52, height:52, objectFit:'contain' }} />
            <div>
              <div style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--pgc-navy)' }}>Punjab Group of Colleges</div>
              <div style={{ fontSize:'.78rem', color:'var(--gray-400)' }}>Student Growth & Character Management System</div>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'.75rem', color:'var(--gray-400)' }}>Report Date</div>
            <div style={{ fontWeight:600, color:'var(--gray-700)', fontSize:'.875rem' }}>{formatDate(new Date())}</div>
          </div>
        </div>

        {/* Student info */}
        <div style={{ background:'var(--gray-50)', borderRadius:10, padding:'1rem 1.25rem', marginBottom:'1.5rem',
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.4rem .5rem' }}>
          {[
            ['Student Name', profile?.studentName],
            ['Roll Number',  profile?.rollNumber],
            ['Father Name',  profile?.fatherName],
            ['Class / Section', `${profile?.class ?? ''} ${profile?.section ?? ''}`],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <span style={{ fontSize:'.75rem', color:'var(--gray-400)', fontWeight:600 }}>{lbl}</span>
              <div style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'.95rem' }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Growth Index badge */}
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', marginBottom:'1.5rem',
          padding:'1rem 1.25rem', borderRadius:10, border:`2px solid ${growthColor(score)}`, background:`${growthColor(score)}0D` }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'2.8rem', fontWeight:900, color:growthColor(score), lineHeight:1 }}>
              {score.toFixed(1)}
            </div>
            <div style={{ fontSize:'.7rem', color:'var(--gray-400)' }}>/ 100</div>
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:'1.15rem', color:growthColor(score) }}>{growthLabel(score)}</div>
            <div style={{ fontSize:'.85rem', color:'var(--gray-600)', marginTop:'.15rem' }}>Student Growth Index</div>
            <div style={{ fontSize:'.8rem', color:'var(--gray-400)', marginTop:'.1rem' }}>
              Based on {growth?.evaluationCount ?? 0} evaluation{growth?.evaluationCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Attribute scores table */}
        {latestEval && (
          <div style={{ marginBottom:'1.5rem' }}>
            <h4 style={{ marginBottom:'.75rem', color:'var(--pgc-navy)' }}>Character Attribute Scores (Latest Evaluation — {formatMonth(latestEval.month)})</h4>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.875rem' }}>
              <thead>
                <tr style={{ background:'var(--pgc-navy)' }}>
                  {['Attribute','Rating (1–5)','Score (%)','Assessment'].map(h => (
                    <th key={h} style={{ padding:'.6rem .85rem', textAlign:'left', color:'#fff', fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(ATTR_LABELS).map(([k, label], i) => {
                  const val = latestEval[k] ?? 0;
                  const pct = Math.round(val / 5 * 100);
                  const lvl = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Developing' : 'Needs Improvement';
                  return (
                    <tr key={k} style={{ background: i % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                      <td style={{ padding:'.6rem .85rem', fontWeight:600 }}>{label}</td>
                      <td style={{ padding:'.6rem .85rem' }}>{'★'.repeat(val)}{'☆'.repeat(5 - val)}</td>
                      <td style={{ padding:'.6rem .85rem', fontWeight:700, color:growthColor(pct) }}>{pct}%</td>
                      <td style={{ padding:'.6rem .85rem', color:'var(--gray-600)' }}>{lvl}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Monthly progress table */}
        {growth?.monthly?.length > 0 && (
          <div style={{ marginBottom:'1.5rem' }}>
            <h4 style={{ marginBottom:'.75rem', color:'var(--pgc-navy)' }}>Monthly Progress</h4>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.875rem' }}>
              <thead>
                <tr style={{ background:'var(--gray-100)' }}>
                  {['Month','Comm','Part','Disc','Team','Resp','Growth Score'].map(h => (
                    <th key={h} style={{ padding:'.5rem .75rem', textAlign:'left', fontWeight:600, color:'var(--gray-700)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {growth.monthly.map((m, i) => (
                  <tr key={m.month} style={{ borderBottom:'1px solid var(--gray-100)', background: i % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                    <td style={{ padding:'.5rem .75rem', fontWeight:600 }}>{formatMonth(m.month)}</td>
                    {['communication','participation','discipline','teamwork','responsibility'].map(k => (
                      <td key={k} style={{ padding:'.5rem .75rem' }}>{m[k]?.toFixed(1) ?? '—'}</td>
                    ))}
                    <td style={{ padding:'.5rem .75rem', fontWeight:700, color:growthColor(m.score ?? 0) }}>{m.score ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AI-style insight */}
        <div style={{ background:'var(--blue-50)', border:'1px solid #bfdbfe', borderRadius:10, padding:'1rem 1.25rem', marginBottom:'1.5rem' }}>
          <h4 style={{ marginBottom:'.5rem', color:'var(--pgc-navy)' }}>📋 Summary & Recommendations</h4>
          <p style={{ color:'var(--gray-700)', lineHeight:1.7, margin:0 }}>{insight}</p>
        </div>

        {/* Remarks */}
        {evaluations.length > 0 && evaluations.some(e => e.remarks) && (
          <div style={{ marginBottom:'1.5rem' }}>
            <h4 style={{ marginBottom:'.75rem', color:'var(--pgc-navy)' }}>Teacher Remarks</h4>
            {evaluations.filter(e => e.remarks).map(e => (
              <div key={e._id} style={{ borderLeft:'3px solid var(--pgc-red)',
                paddingLeft:'.85rem', marginBottom:'.75rem' }}>
                <div style={{ fontSize:'.75rem', color:'var(--gray-400)', marginBottom:'.2rem' }}>{formatMonth(e.month)}</div>
                <p style={{ margin:0, fontSize:'.875rem', color:'var(--gray-700)' }}>{e.remarks}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop:'2px solid var(--pgc-navy)', paddingTop:'1rem', marginTop:'1.5rem',
          display:'flex', justifyContent:'space-between', fontSize:'.75rem', color:'var(--gray-400)' }}>
          <span>PGC SGCMS — Confidential Student Report</span>
          <span>Generated: {new Date().toLocaleString('en-PK')}</span>
        </div>
      </div>

      {/* Print styles injected into head */}
      <style>{`
        @media print {
          .no-print, .sidebar, .topbar { display: none !important; }
          .main-content { margin-left: 0 !important; }
          .page-body { padding: 0 !important; }
          #pdf-report { box-shadow: none !important; border-radius: 0 !important; padding: 1rem !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
