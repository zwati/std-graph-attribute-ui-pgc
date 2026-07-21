// src/pages/Teacher/History.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/Rating/StarRating';
import ChartCard from '../../components/Cards/ChartCard';
import CharacterRadar from '../../components/Charts/CharacterRadar';
import TrendLineChart from '../../components/Charts/TrendLineChart';
import { formatMonth } from '../../utils/formatDate';
import TeacherClassSelector from '../../components/TeacherClassSelector';

const ATTR_LABELS = {
  communication:'Communication',
  participation:'Participation',
  discipline:'Discipline',
  teamwork:'Teamwork',
  responsibility:'Responsibility',
  leadership:'Leadership',
};

export default function History() {
  const { authAxios } = useAuth();
  const [params] = useSearchParams();
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(params.get('sid') ?? '');
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback((clsObj) => {
    if (!clsObj) {
      setStudents([]);
      return;
    }
    authAxios.get(`/teacher/students?class=${encodeURIComponent(clsObj.className)}&section=${encodeURIComponent(clsObj.section)}`)
      .then(r => {
        const list = r.data.data;
        setStudents(list);
        if (list.length > 0 && !selectedId) {
          setSelectedId(list[0]._id);
        }
      })
      .catch(() => {});
  }, [selectedId]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass, fetchStudents]);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    authAxios.get(`/teacher/evaluations/${selectedId}`)
      .then(r => setEvaluations(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedId]);

  const latest = evaluations[0];
  const oldest = evaluations[evaluations.length - 1];

  const netDiff = (latest && oldest) ? parseFloat((latest.growthIndexAtSubmit - oldest.growthIndexAtSubmit).toFixed(1)) : 0;

  // Format trend line chart data from evaluation history including leadership
  const trendData = [...evaluations].reverse().map(e => ({
    month: formatMonth(e.month),
    communication: e.communication,
    participation: e.participation,
    discipline: e.discipline,
    teamwork: e.teamwork,
    responsibility: e.responsibility,
    leadership: e.leadership || 0,
    growthIndex: parseFloat((e.growthIndexAtSubmit || 0).toFixed(1)),
  }));

  return (
    <div className="animate-fade">
      <TeacherClassSelector onClassSelect={setSelectedClass} />

      <div style={{ marginBottom: '1.25rem' }}>
        <label className="label">Select Student from {selectedClass ? `${selectedClass.className} (${selectedClass.section})` : 'Class'}</label>
        <select className="input" style={{ maxWidth: 360 }} value={selectedId}
          onChange={e => setSelectedId(e.target.value)}>
          <option value="">— choose a student —</option>
          {students.map(s => <option key={s._id} value={s._id}>{s.studentName} ({s.rollNumber})</option>)}
        </select>
      </div>

      {evaluations.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          {/* Progress / Loss Summary Banner */}
          <div className="card" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: `4px solid ${netDiff >= 0 ? 'var(--green-600)' : 'var(--red-600)'}` }}>
            <div>
              <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase' }}>
                Re-Evaluation Progress / Loss Status
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '.2rem', color: netDiff >= 0 ? 'var(--green-700)' : 'var(--red-600)' }}>
                {netDiff > 0 ? `📈 Progress: +${netDiff} Points Growth` : netDiff < 0 ? `📉 Performance Loss: ${netDiff} Points` : `⚖ Steady Score Across Evaluations`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '.85rem' }}>
              <div>First Eval Score: <strong>{oldest?.growthIndexAtSubmit?.toFixed(1)}</strong></div>
              <div>Latest Eval Score: <strong>{latest?.growthIndexAtSubmit?.toFixed(1)}</strong></div>
            </div>
          </div>

          {/* Progress / Loss Trend Line Chart */}
          <ChartCard title="Re-Evaluation Progress & Character Trajectory" subtitle={`Tracking ${evaluations.length} evaluation snapshot(s)`}>
            <TrendLineChart data={trendData} />
          </ChartCard>
        </div>
      )}

      {latest && (
        <div className="chart-grid" style={{ marginBottom: '1.25rem' }}>
          <ChartCard title="Latest Character Radar" subtitle={formatMonth(latest.month)}>
            <CharacterRadar evaluation={latest} />
          </ChartCard>
          <ChartCard title="Latest Attribute Scores">
            {Object.keys(ATTR_LABELS).map(k => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem' }}>
                <span style={{ fontSize:'.875rem', fontWeight:500 }}>{ATTR_LABELS[k]}</span>
                <StarRating value={latest[k]} readOnly size="1rem" />
              </div>
            ))}
            {latest.remarks && (
              <p style={{ marginTop:'.75rem', fontSize:'.875rem', background:'var(--gray-50)', padding:'.75rem', borderRadius:8 }}>
                💬 {latest.remarks}
              </p>
            )}
          </ChartCard>
        </div>
      )}

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid var(--gray-100)' }}>
          <h3 style={{ margin:0 }}>
            Evaluation History
            {evaluations.length > 0 && <span className="badge badge-gray" style={{ marginLeft:'.5rem' }}>{evaluations.length}</span>}
          </h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Month</th><th>Comm</th><th>Part</th><th>Disc</th><th>Team</th><th>Resp</th><th>Lead</th><th>Score</th><th>Remarks</th></tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={9} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>Loading…</td></tr>
                : evaluations.length === 0
                  ? <tr><td colSpan={9} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No evaluations yet</td></tr>
                  : evaluations.map(e => (
                    <tr key={e._id}>
                      <td style={{ fontWeight:600 }}>{formatMonth(e.month)}</td>
                      {['communication','participation','discipline','teamwork','responsibility','leadership'].map(a => (
                        <td key={a}><StarRating value={e[a] || 0} readOnly size=".85rem" /></td>
                      ))}
                      <td style={{ fontWeight:700, color:'var(--pgc-navy)' }}>{e.growthIndexAtSubmit?.toFixed(1)}</td>
                      <td style={{ maxWidth:160, fontSize:'.8rem', color:'var(--gray-500)', whiteSpace:'normal' }}>
                        {e.remarks || '—'}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


