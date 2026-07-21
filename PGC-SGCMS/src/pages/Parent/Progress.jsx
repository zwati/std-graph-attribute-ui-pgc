// src/pages/Parent/Progress.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChartCard from '../../components/Cards/ChartCard';
import MonthlyBarChart from '../../components/Charts/MonthlyBarChart';
import TrendLineChart from '../../components/Charts/TrendLineChart';

export default function Progress() {
  const { authAxios } = useAuth();
  const [growth, setGrowth] = useState(null);

  useEffect(() => {
    authAxios.get('/parent/growth').then(r => setGrowth(r.data.data)).catch(() => {});
  }, []);

  const monthly = growth?.monthly ?? [];

  return (
    <div className="animate-fade">
      <div className="chart-grid" style={{ marginBottom: '1.25rem' }}>
        <ChartCard title="Monthly Growth Score" subtitle="0–100 index per evaluation month">
          <MonthlyBarChart data={monthly.map(m => ({ month: m.month?.slice(5), score: m.score ?? 0 }))} />
        </ChartCard>

        <ChartCard title="Attribute Trends" subtitle="Per-attribute scores over time (1–5)">
          <TrendLineChart
            data={monthly.map(m => ({
              month:          m.month?.slice(5),
              communication:  m.communication,
              participation:  m.participation,
              discipline:     m.discipline,
              teamwork:       m.teamwork,
              responsibility: m.responsibility,
            }))}
            yScale="attribute"
          />
        </ChartCard>
      </div>

      {monthly.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--gray-300)', padding: '3rem' }}>
          No evaluation data available yet.
        </div>
      )}
    </div>
  );
}
