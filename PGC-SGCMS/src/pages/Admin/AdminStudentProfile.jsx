// src/pages/Admin/AdminStudentProfile.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GrowthBar from '../../components/ProgressBar/GrowthBar';
import { growthLabel } from '../../utils/growthLabel';
import { growthColor, ATTRIBUTE_COLORS } from '../../utils/attributeColors';
import { formatDate } from '../../utils/formatDate';

const ATTRS = ['communication', 'participation', 'discipline', 'teamwork', 'responsibility', 'leadership'];

const ATTR_ICONS = {
  communication:  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  participation:  () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  discipline:     () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  teamwork:       () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  responsibility: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  ),
  leadership:     () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
};

export default function AdminStudentProfile() {
  const { id } = useParams();
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      authAxios.get(`/admin/students/${id}`),
      authAxios.get(`/admin/students/${id}/growth`),
    ]).then(([p, g]) => {
      setProfile(p.data.data);
      setGrowth(g.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem', color: 'var(--gray-400)' }}>
      <svg className="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Loading student profile…
    </div>
  );

  if (!profile) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ margin: '0 auto 1rem', display: 'block', opacity: .4 }}>
        <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
      </svg>
      Student not found.
    </div>
  );

  const score = growth?.growthIndex ?? 0;

  // Latest attribute averages from most recent evaluation in progressHistory
  const lastEval = growth?.progressHistory?.slice(-1)[0];

  return (
    <div className="animate-fade" style={{ maxWidth: 780 }}>
      {/* Back button */}
      <button
        className="btn btn-outline btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Database
      </button>

      {/* Admin preview banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13,27,75,0.06) 0%, rgba(200,16,46,0.04) 100%)',
        border: '1.5px solid rgba(13,27,75,0.15)',
        borderRadius: 'var(--radius-sm)',
        padding: '.6rem 1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '.6rem',
        fontSize: '.82rem',
        color: 'var(--pgc-navy)',
        fontWeight: 600,
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        Admin Preview — Viewing as student profile (no password required)
      </div>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--pgc-navy) 0%, #1a3580 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(13,27,75,0.25)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" width="38" height="38">
              <circle cx="12" cy="8" r="4"/>
              <path d="M20 21a8 8 0 1 0-16 0"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 .25rem', display: 'flex', alignItems: 'center', gap: '.6rem', flexWrap: 'wrap' }}>
              {profile.studentName}
              <span className={`badge ${profile.gender === 'Female' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '.78rem' }}>
                {profile.gender === 'Female' ? 'Female' : 'Male'}
              </span>
            </h2>
            <p style={{ margin: '0 0 .6rem', fontSize: '.9rem' }}>
              <span style={{ color: 'var(--gray-400)' }}>Father: </span>
              <strong>{profile.fatherName}</strong>
            </p>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-navy">Roll No: {profile.rollNumber}</span>
              <span className="badge badge-gray">Board Roll: {profile.boardRollNumber || '—'}</span>
              <span className="badge badge-amber" style={{ fontWeight: 700 }}>9th: {profile.result9th || '—'}</span>
              <span className="badge badge-gray">{profile.class} {profile.section || ''} ({profile.category})</span>
            </div>
          </div>
          {/* Quick action */}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(`/admin/edit/${id}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', flexShrink: 0 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
        </div>
      </div>

      {/* Growth summary */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          Growth Summary
        </h3>
        <div className="parent-summary-grid" style={{ marginBottom: '1.5rem' }}>
          {[
            { label: 'Growth Index',   val: score > 0 ? score.toFixed(1) : 'N/A', sub: growthLabel(score) },
            { label: 'EMA Trend',      val: growth?.growthTrendEMA?.toFixed(1) ?? '—', sub: 'Recent momentum' },
            { label: 'Evaluations',    val: growth?.evaluationCount ?? 0, sub: 'Total sessions' },
          ].map(item => (
            <div key={item.label} style={{
              textAlign: 'center', background: 'var(--gray-50)',
              borderRadius: 10, padding: '1rem .75rem',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: growthColor(score) }}>{item.val}</div>
              <div style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--gray-700)', marginTop: '.15rem' }}>{item.label}</div>
              <div style={{ fontSize: '.7rem', color: 'var(--gray-400)' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '.5rem', fontWeight: 600, color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          Overall Progress
        </div>
        <GrowthBar value={score} max={100} showPercent />

        <div style={{ marginTop: '1rem', fontSize: '.82rem', color: 'var(--gray-400)' }}>
          Last evaluated: <strong style={{ color: 'var(--gray-600)' }}>{formatDate(profile.lastEvaluatedAt)}</strong>
        </div>
      </div>

      {/* Latest attribute scores */}
      {lastEval && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Latest Attribute Scores
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '.75rem' }}>
            {ATTRS.map(attr => {
              const val = lastEval[attr] ?? 0;
              const pct = Math.min((val / 5) * 100, 100);
              const IconComp = ATTR_ICONS[attr];
              const attrColor = ATTRIBUTE_COLORS[attr];
              return (
                <div key={attr} style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '.75rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
                    <span style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-700)', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                      <span style={{ color: 'var(--pgc-navy)', opacity: .7 }}><IconComp /></span>
                      {attr}
                    </span>
                    <span style={{ fontSize: '.9rem', fontWeight: 800, color: attrColor }}>{val}/5</span>
                  </div>
                  <div style={{ background: 'var(--gray-200)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${attrColor}, ${attrColor}cc)`, transition: 'width .6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Evaluation history */}
      {growth?.progressHistory?.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Evaluation History
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Month</th>
                  <th>Score</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {[...growth.progressHistory].reverse().slice(0, 10).map((ev, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: '.83rem' }}>{ev.date}</td>
                    <td><span className="badge badge-gray">{ev.month}</span></td>
                    <td><strong style={{ color: growthColor(ev.score) }}>{ev.score.toFixed(1)}</strong></td>
                    <td>
                      {ev.status === 'initial' ? (
                        <span style={{ color: 'var(--gray-400)', fontSize: '.8rem' }}>—</span>
                      ) : (
                        <span style={{
                          color: ev.status === 'progress' ? 'var(--green-600)' : ev.status === 'loss' ? 'var(--pgc-red)' : 'var(--gray-400)',
                          fontWeight: 600, fontSize: '.85rem', display: 'inline-flex', alignItems: 'center', gap: '.2rem'
                        }}>
                          {ev.status === 'progress' ? '↑' : ev.status === 'loss' ? '↓' : '–'}
                          {Math.abs(ev.diff)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
