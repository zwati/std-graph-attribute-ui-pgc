// src/pages/Parent/StudentProfile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import GrowthBar from '../../components/ProgressBar/GrowthBar';
import { growthLabel } from '../../utils/growthLabel';
import { growthColor } from '../../utils/attributeColors';
import { formatDate } from '../../utils/formatDate';

import { apiCache } from '../../utils/apiCache';

export default function StudentProfile() {
  const { authAxios } = useAuth();
  const [profile, setProfile] = useState(() => apiCache.get('parent_profile') || null);
  const [growth, setGrowth]   = useState(() => apiCache.get('parent_growth') || null);

  useEffect(() => {
    const pCache = apiCache.get('parent_profile');
    const gCache = apiCache.get('parent_growth');
    if (pCache && gCache) {
      setProfile(pCache);
      setGrowth(gCache);
    }
    Promise.all([
      authAxios.get('/parent/profile'),
      authAxios.get('/parent/growth'),
    ]).then(([p, g]) => {
      apiCache.set('parent_profile', p.data.data);
      apiCache.set('parent_growth', g.data.data);
      setProfile(p.data.data);
      setGrowth(g.data.data);
    }).catch(() => {});
  }, []);

  if (!profile) return <p style={{ textAlign:'center', color:'var(--gray-400)', padding:'3rem' }}>Loading…</p>;

  const score = growth?.growthIndex ?? 0;

  return (
    <div className="animate-fade" style={{ maxWidth: 680 }}>
      {/* Profile card */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--pgc-navy)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '2rem', color: '#fff' }}>🎓</span>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 .25rem' }}>
              {profile.studentName}
              <span className={`badge ${profile.gender === 'Female' ? 'badge-red' : 'badge-green'}`} style={{ marginLeft: '.6rem', fontSize: '.8rem' }}>
                {profile.gender === 'Female' ? 'Female' : 'Male'}
              </span>

            </h2>
            <p style={{ margin: 0, fontSize: '.9rem' }}>
              <span style={{ color: 'var(--gray-400)' }}>Father: </span>
              <strong>{profile.fatherName}</strong>
            </p>
            <div style={{ display: 'flex', gap: '.6rem', marginTop: '.6rem', flexWrap: 'wrap' }}>
              <span className="badge badge-navy">Roll No. (Login): {profile.rollNumber}</span>
              <span className="badge badge-gray">Board Roll: {profile.boardRollNumber || '—'}</span>
              <span className="badge badge-amber" style={{ fontWeight: 700 }}>9th Class Result: {profile.result9th || '—'}</span>
              <span className="badge badge-gray">{profile.class} {profile.section || ''} ({profile.category})</span>
            </div>
          </div>

        </div>
      </div>

      {/* Growth summary */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Growth Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Growth Index',   val: score.toFixed(1),              sub: growthLabel(score) },
            { label: 'EMA Trend',      val: growth?.growthTrendEMA?.toFixed(1) ?? '—', sub: 'Recent momentum' },
            { label: 'Evaluations',    val: growth?.evaluationCount ?? 0,  sub: 'Total sessions' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', background: 'var(--gray-50)',
              borderRadius: 10, padding: '1rem .75rem' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: growthColor(score) }}>{item.val}</div>
              <div style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--gray-700)', marginTop: '.15rem' }}>{item.label}</div>
              <div style={{ fontSize: '.7rem', color: 'var(--gray-400)' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '.5rem', fontWeight: 600, color: 'var(--gray-700)' }}>Overall Progress</div>
        <GrowthBar value={score} max={100} showPercent />

        <div style={{ marginTop: '1rem', fontSize: '.82rem', color: 'var(--gray-400)' }}>
          Last evaluated: <strong style={{ color: 'var(--gray-600)' }}>{formatDate(profile.lastEvaluatedAt)}</strong>
        </div>
      </div>
    </div>
  );
}
