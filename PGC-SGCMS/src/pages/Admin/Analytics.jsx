// src/pages/Admin/Analytics.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChartCard from '../../components/Cards/ChartCard';
import MonthlyBarChart from '../../components/Charts/MonthlyBarChart';
import GrowthGauge from '../../components/Charts/GrowthGauge';

const attrLabels = { communication:'Communication', participation:'Participation', discipline:'Discipline', teamwork:'Teamwork', responsibility:'Responsibility' };

export default function Analytics() {
  const { authAxios } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    authAxios.get('/admin/analytics').then(r => setData(r.data.data)).catch(() => {});
  }, []);

  const attrBarData = data
    ? Object.entries(attrLabels).map(([k, label]) => ({
        month: label.slice(0, 5),
        score: parseFloat((data.attributeAverages?.[k] ?? 0).toFixed(1)),
      }))
    : [];

  return (
    <div className="animate-fade">
      <div className="chart-grid" style={{ marginBottom: '1.25rem' }}>
        <ChartCard title="School Average Growth Index" subtitle="All students combined">
          <GrowthGauge score={data?.schoolAvgGrowth ?? 0} size={240} />
        </ChartCard>
        <ChartCard title="Attribute Averages (School-wide)" subtitle="Avg 1–5 rating scale">
          <MonthlyBarChart data={attrBarData} />
        </ChartCard>
      </div>

      <ChartCard title="Top Performers">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Rank</th><th>Student</th><th>Roll No.</th><th>Class</th><th>Growth Index</th></tr></thead>
            <tbody>
              {(data?.topStudents ?? []).map((s, i) => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 800, color: i < 3 ? 'var(--amber-500)' : 'var(--gray-400)' }}>#{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                  <td><span className="badge badge-navy">{s.rollNumber}</span></td>
                  <td>{s.class} {s.section}</td>
                  <td style={{ fontWeight: 700, color: 'var(--pgc-navy)' }}>{s.growthIndex?.toFixed(1)}</td>
                </tr>
              ))}
              {!data?.topStudents?.length && <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--gray-400)', padding:'2rem' }}>No data yet</td></tr>}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
