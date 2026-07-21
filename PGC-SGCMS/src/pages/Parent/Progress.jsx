// src/pages/Parent/Progress.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChartCard from '../../components/Cards/ChartCard';
import MonthlyProgressChart from '../../components/Charts/MonthlyProgressChart';
import AttributeBarChart from '../../components/Charts/AttributeBarChart';
import CharacterRadar from '../../components/Charts/CharacterRadar';

const MONTH_NAMES = [
  'All Months (Overall History)',
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function Progress() {
  const { authAxios } = useAuth();
  const [growth, setGrowth] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('All Months (Overall History)');

  useEffect(() => {
    authAxios.get('/parent/growth').then(r => setGrowth(r.data.data)).catch(() => {});
  }, []);

  const progressHistory = growth?.progressHistory ?? [];
  const monthly = growth?.monthly ?? [];

  // Filter history based on 12-month menu selection
  const filteredHistory = selectedMonth === 'All Months (Overall History)'
    ? progressHistory
    : progressHistory.filter(p => p.monthName?.includes(selectedMonth) || p.month?.slice(5) === selectedMonth);

  const activeEval = filteredHistory.length > 0
    ? filteredHistory[filteredHistory.length - 1]
    : monthly.length > 0 ? monthly[monthly.length - 1] : {};

  // Compute total net progress / loss
  const totalDiff = progressHistory.reduce((acc, curr) => acc + (curr.diff || 0), 0);

  return (
    <div className="animate-fade">
      {/* 12-Month Navigation Filter & Progress Overview Header */}
      <div className="card" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>📈 Student Monthly Improvement & Progress</h3>
          <div style={{ fontSize: '.85rem', color: 'var(--gray-500)', marginTop: '.2rem' }}>
            Tracking student growth index and character evaluation trajectory from enrollment date
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <label className="label" style={{ margin: 0, fontWeight: 600, fontSize: '.85rem' }}>📅 Month Navigation:</label>
          <select
            className="input"
            style={{ minWidth: 200 }}
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {MONTH_NAMES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress / Loss Summary Banner */}
      {progressHistory.length > 0 && (
        <div className="card" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${totalDiff >= 0 ? 'var(--green-600)' : 'var(--red-600)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>
              Overall System Improvement Status
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '.25rem', color: totalDiff >= 0 ? 'var(--green-700)' : 'var(--red-600)' }}>
              {totalDiff > 0 ? `📈 Total Growth Progress: +${totalDiff.toFixed(1)} Points` : totalDiff < 0 ? `📉 Performance Loss: ${totalDiff.toFixed(1)} Points` : `⚖ Steady Score Baseline`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '.88rem' }}>
            <div>First Score: <strong>{progressHistory[0]?.score?.toFixed(1) || '0.0'}</strong></div>
            <div>Latest Growth Index: <strong>{growth?.growthIndex?.toFixed(1) || '0.0'}</strong></div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="chart-grid" style={{ marginBottom: '1.25rem' }}>
        {/* Monthly Improvement / Loss Bar Chart */}
        <ChartCard title="Monthly Improvement / Loss Bar" subtitle="Net progress (+diff) in Green and loss (-diff) in Red">
          <MonthlyProgressChart data={filteredHistory} />
        </ChartCard>

        {/* Redesigned Attribute Breakdown Graph */}
        <ChartCard title="Redesigned Attribute Breakdown" subtitle="6 Character attributes performance (1–5 Stars)">
          <AttributeBarChart evaluation={activeEval} />
        </ChartCard>
      </div>

      {/* Character Radar Overview */}
      {activeEval && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginBottom: '.5rem' }}>🕸 Character Radar Snapshot — {activeEval.monthName || selectedMonth}</h3>
          <CharacterRadar evaluation={activeEval} />
        </div>
      )}

      {progressHistory.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem' }}>
          No evaluation records found yet.
        </div>
      )}
    </div>
  );
}
