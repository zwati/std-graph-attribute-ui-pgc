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

  const mkSvg = (content) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">{content}</svg>
  );

  const stats = [
    { label: 'Total Students', val: analytics?.totalStudents ?? '—', color: 'navy',
      icon: mkSvg(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>)
    },
    { label: 'Avg Growth Index', val: analytics?.schoolAvgGrowth ? `${analytics.schoolAvgGrowth.toFixed(1)}%` : '—', color: 'green',
      icon: mkSvg(<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>)
    },
    { label: 'Evaluations Today', val: analytics?.evaluationsToday ?? 0, color: 'amber',
      icon: mkSvg(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>)
    },
    { label: 'Active Teachers', val: analytics?.activeTeachers ?? 0, color: 'red',
      icon: mkSvg(<><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>)
    },
  ];

  const top = analytics?.topStudents ?? [];
  const attrs = analytics?.attributeAverages ?? {};
  const attrList = ['leadership', 'discipline', 'responsibility', 'participation', 'communication', 'teamwork'];
  const attrLabels = {
    leadership: 'Lead',
    discipline: 'Disc',
    responsibility: 'Resp',
    participation: 'Part',
    communication: 'Comm',
    teamwork: 'Team',
  };


  return (
    <div className="animate-fade">
      {/* Stat cards */}
      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
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
