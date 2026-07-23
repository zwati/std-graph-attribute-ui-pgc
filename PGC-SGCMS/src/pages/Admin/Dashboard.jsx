import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChartCard from '../../components/Cards/ChartCard';
import MonthlyBarChart from '../../components/Charts/MonthlyBarChart';
import { apiCache } from '../../utils/apiCache';

export default function AdminDashboard() {
  const { authAxios } = useAuth();
  const [analytics, setAnalytics] = useState(() => apiCache.get('admin_analytics') || null);
  const [loading, setLoading] = useState(() => !apiCache.get('admin_analytics'));

  useEffect(() => {
    const cached = apiCache.get('admin_analytics');
    if (cached) {
      setAnalytics(cached);
      setLoading(false);
    }
    authAxios.get('/admin/analytics')
      .then(r => {
        apiCache.set('admin_analytics', r.data.data);
        setAnalytics(r.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Students', val: analytics?.totalStudents ?? '—', icon: '👨‍🎓', color: 'navy' },
    { label: 'Avg Growth Index', val: analytics?.schoolAvgGrowth ? `${analytics.schoolAvgGrowth.toFixed(1)}%` : '—', icon: '📈', color: 'green' },
    { label: 'Evaluations Today', val: analytics?.evaluationsToday ?? 0, icon: '⭐', color: 'amber' },
    { label: 'Active Teachers', val: analytics?.activeTeachers ?? 0, icon: '👨‍🏫', color: 'red' },
  ];

  const top = analytics?.topStudents ?? [];
  const attrs = analytics?.attributeAverages ?? {};
  const attrList = ['communication', 'discipline', 'leadership', 'participation', 'responsibility', 'teamwork'];
  const attrLabels = {
    communication: 'Comm',
    discipline: 'Disc',
    leadership: 'Lead',
    participation: 'Part',
    responsibility: 'Resp',
    teamwork: 'Team',
  };


  return (
    <div className="animate-fade">
      {/* Stat cards */}
      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}><span style={{ fontSize: '1.4rem' }}>{s.icon}</span></div>
            <div>
              <div className="stat-val">{loading ? '…' : s.val}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        {/* Attribute averages bar */}
        <ChartCard title="School-wide Attribute Averages" subtitle="All evaluations, avg 1–5 scale">
          <MonthlyBarChart
            data={attrList.map(k => ({ month: attrLabels[k].slice(0, 4), score: parseFloat((attrs[k] ?? 0).toFixed(1)) }))}
          />
        </ChartCard>


        {/* Top students */}
        <ChartCard title="Growth Index" subtitle="Top performing Student">
          {loading ? <p>Loading…</p> : (
            <div className="table-wrap" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table>
                <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
                  <tr><th>#</th><th>Name</th><th>Roll No.</th><th>Growth Index</th></tr>
                </thead>
                <tbody>
                  {top.map((s, i) => (
                    <tr key={s._id}>
                      <td style={{ color: 'var(--gray-400)', fontWeight: 700 }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                      <td><span className="badge badge-gray">{s.rollNumber}</span></td>
                      <td>
                        <span style={{ fontWeight: 700, color: s.growthIndex >= 81 ? 'var(--pgc-navy)' : s.growthIndex >= 61 ? 'var(--green-600)' : 'var(--amber-500)' }}>
                          {s.growthIndex.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {top.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem 1rem' }}>
                        No rated students yet. Roster ratings will display once teachers submit character evaluations.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          )}
        </ChartCard>

      </div>
    </div>
  );
}
