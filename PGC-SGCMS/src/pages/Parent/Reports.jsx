// src/pages/Parent/Reports.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/Rating/StarRating';
import { formatDate, formatMonth } from '../../utils/formatDate';

const ATTR_LABELS = {
  communication: 'Communication', participation: 'Participation',
  discipline: 'Discipline', teamwork: 'Teamwork', responsibility: 'Responsibility',
};

export default function ParentReports() {
  const { authAxios } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAxios.get('/parent/evaluations')
      .then(r => setEvaluations(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade">
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem' }}>Loading…</p>
      ) : evaluations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-300)' }}>
          No evaluation records yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {evaluations.map((ev, i) => (
            <div className="card animate-fade" key={ev._id}
              style={{ borderLeft: i === 0 ? '4px solid var(--pgc-red)' : '4px solid var(--gray-200)', animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '.5rem' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{formatMonth(ev.month)}</h4>
                  <span style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>{formatDate(ev.createdAt)}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>Growth Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pgc-navy)', lineHeight: 1 }}>
                    {ev.growthIndexAtSubmit?.toFixed(1) ?? '—'}
                  </div>
                </div>
              </div>

              {/* Attribute stars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem 2rem', marginBottom: '1rem' }}>
                {Object.entries(ATTR_LABELS).map(([k, label]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '.82rem', color: 'var(--gray-600)' }}>{label}</span>
                    <StarRating value={ev[k]} readOnly size=".9rem" />
                  </div>
                ))}
              </div>

              {ev.remarks && (
                <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '.75rem 1rem',
                  fontSize: '.875rem', color: 'var(--gray-700)', borderLeft: '3px solid var(--pgc-navy)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--pgc-navy)' }}>💬 Teacher's Remarks: </span>
                  {ev.remarks}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
