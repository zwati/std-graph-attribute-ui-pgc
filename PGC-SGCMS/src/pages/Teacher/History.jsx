// src/pages/Teacher/History.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/Rating/StarRating';
import ChartCard from '../../components/Cards/ChartCard';
import CharacterRadar from '../../components/Charts/CharacterRadar';
import { formatMonth } from '../../utils/formatDate';

const ATTR_LABELS = { communication:'Communication', participation:'Participation', discipline:'Discipline', teamwork:'Teamwork', responsibility:'Responsibility' };

export default function History() {
  const { authAxios } = useAuth();
  const [params] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(params.get('sid') ?? '');
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authAxios.get('/teacher/students').then(r => setStudents(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    authAxios.get(`/teacher/evaluations/${selectedId}`)
      .then(r => setEvaluations(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedId]);

  const latest = evaluations[0];

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="label">Select Student</label>
        <select className="input" style={{ maxWidth: 360 }} value={selectedId}
          onChange={e => setSelectedId(e.target.value)}>
          <option value="">— choose a student —</option>
          {students.map(s => <option key={s._id} value={s._id}>{s.studentName} ({s.rollNumber})</option>)}
        </select>
      </div>

      {latest && (
        <div className="chart-grid" style={{ marginBottom: '1.25rem' }}>
          <ChartCard title="Latest Radar" subtitle={formatMonth(latest.month)}>
            <CharacterRadar evaluation={latest} />
          </ChartCard>
          <ChartCard title="Latest Scores">
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
              <tr><th>Month</th><th>Comm</th><th>Part</th><th>Disc</th><th>Team</th><th>Resp</th><th>Score</th><th>Remarks</th></tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={8} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>Loading…</td></tr>
                : evaluations.length === 0
                  ? <tr><td colSpan={8} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No evaluations yet</td></tr>
                  : evaluations.map(e => (
                    <tr key={e._id}>
                      <td style={{ fontWeight:600 }}>{formatMonth(e.month)}</td>
                      {['communication','participation','discipline','teamwork','responsibility'].map(a => (
                        <td key={a}><StarRating value={e[a]} readOnly size=".85rem" /></td>
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
