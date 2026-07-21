// src/pages/Parent/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChartCard from '../../components/Cards/ChartCard';
import GrowthGauge from '../../components/Charts/GrowthGauge';
import CharacterRadar from '../../components/Charts/CharacterRadar';
import GrowthBar from '../../components/ProgressBar/GrowthBar';
import { growthLabel } from '../../utils/growthLabel';

const ATTR_LABELS = {
  communication: 'Communication',
  participation: 'Class Participation',
  discipline:    'Discipline',
  teamwork:      'Teamwork',
  responsibility:'Responsibility',
};

export default function ParentDashboard() {
  const { authAxios } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [growth, setGrowth]     = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      authAxios.get('/parent/profile'),
      authAxios.get('/parent/growth'),
    ]).then(([p, g]) => {
      setProfile(p.data.data);
      setGrowth(g.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const latestEval = growth?.monthly?.at(-1);

  return (
    <div className="animate-fade">
      {/* Student info banner */}
      {profile && (
        <div className="card" style={{ marginBottom: '1.25rem', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
          borderLeft: '4px solid var(--pgc-red)' }}>
          <div>
            <h2 style={{ margin: 0 }}>{profile.studentName}</h2>
            <p style={{ margin: '.2rem 0 0', fontSize: '.875rem' }}>
              Father: <strong>{profile.fatherName}</strong> &nbsp;·&nbsp;
              Class: <strong>{profile.class} {profile.section}</strong> &nbsp;·&nbsp;
              Roll No.: <strong>{profile.rollNumber}</strong>
            </p>
          </div>
          <span className="badge badge-navy" style={{ fontSize: '.9rem', padding: '.35rem 1rem' }}>
            {growthLabel(growth?.growthIndex ?? 0)}
          </span>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem' }}>Loading dashboard…</p>
      ) : (
        <>
          {/* Top row: gauge + radar */}
          <div className="chart-grid" style={{ marginBottom: '1.25rem' }}>
            <ChartCard title="Student Growth Index" subtitle="Lifetime average (0–100)">
              <GrowthGauge score={growth?.growthIndex ?? 0} size={250} />
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--pgc-navy)' }}>
                    {growth?.growthTrendEMA?.toFixed(1) ?? '—'}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>EMA Trend</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--pgc-navy)' }}>
                    {growth?.evaluationCount ?? 0}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>Evaluations</div>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Character Radar"
              subtitle={latestEval ? `Latest: ${latestEval.month}` : 'No data yet'}
            >
              {latestEval
                ? <CharacterRadar evaluation={latestEval} />
                : <p style={{ textAlign: 'center', color: 'var(--gray-300)', padding: '3rem 0' }}>No evaluations yet</p>
              }
            </ChartCard>
          </div>

          {/* Attribute progress bars */}
          {latestEval && (
            <ChartCard title="Attribute Scores" subtitle="Latest evaluation (1–5 scale)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
                {Object.keys(ATTR_LABELS).map(k => (
                  <GrowthBar key={k} label={ATTR_LABELS[k]} value={latestEval[k] ?? 0} max={5} />
                ))}
              </div>
            </ChartCard>
          )}
        </>
      )}
    </div>
  );
}
