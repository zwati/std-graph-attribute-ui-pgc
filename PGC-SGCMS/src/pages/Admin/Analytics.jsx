import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChartCard from '../../components/Cards/ChartCard';
import MonthlyBarChart from '../../components/Charts/MonthlyBarChart';
import GrowthGauge from '../../components/Charts/GrowthGauge';
import { apiCache } from '../../utils/apiCache';

const attrLabels = {
  communication: 'Comm',
  discipline: 'Disc',
  leadership: 'Lead',
  participation: 'Part',
  responsibility: 'Resp',
  teamwork: 'Team',
};

export default function Analytics() {
  const { authAxios } = useAuth();
  const [data, setData] = useState(() => apiCache.get('admin_analytics') || null);
  const [loading, setLoading] = useState(() => !apiCache.get('admin_analytics'));

  useEffect(() => {
    const cached = apiCache.get('admin_analytics');
    if (cached) {
      setData(cached);
      setLoading(false);
    }

    authAxios.get('/admin/analytics')
      .then(r => {
        apiCache.set('admin_analytics', r.data.data);
        setData(r.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const attrBarData = data
    ? Object.entries(attrLabels).map(([k, label]) => ({
        month: label,
        score: parseFloat((data.attributeAverages?.[k] ?? 0).toFixed(1)),
      }))
    : [];

  return (
    <div className="animate-fade">
      {/* 2-column chart grid (stacks vertically on mobile) */}
      <div className="chart-grid" style={{ marginBottom: '1.25rem' }}>
        <ChartCard title="School Average Growth Index" subtitle="All students combined">
          <GrowthGauge score={data?.schoolAvgGrowth ?? 0} size={230} />
        </ChartCard>
        <ChartCard title="Attribute Averages (School-wide)" subtitle="Avg 1–5 rating scale (6 Attributes)">
          <MonthlyBarChart data={attrBarData} />
        </ChartCard>
      </div>

      {/* Top Performers Table */}
      <ChartCard title="Top Performers" subtitle="Highest Character Growth Index">
        <div className="table-wrap" style={{ maxHeight: 380, overflowY: 'auto' }}>
          <table>
            <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Growth Index</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>Loading analytics…</td></tr>
              ) : (data?.topStudents ?? []).length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>No evaluations recorded yet.</td></tr>
              ) : (
                (data?.topStudents ?? []).map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 800, color: i < 3 ? 'var(--amber-500)' : 'var(--gray-400)', verticalAlign: 'middle' }}>
                      #{i + 1}
                    </td>
                    <td style={{ fontWeight: 600, verticalAlign: 'middle' }}>{s.studentName}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <span className="badge badge-navy">{s.rollNumber}</span>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>{s.class} {s.section}</td>
                    <td style={{ fontWeight: 700, color: s.growthIndex >= 81 ? 'var(--pgc-navy)' : s.growthIndex >= 61 ? 'var(--green-600)' : 'var(--amber-500)', verticalAlign: 'middle' }}>
                      {s.growthIndex?.toFixed(1)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
