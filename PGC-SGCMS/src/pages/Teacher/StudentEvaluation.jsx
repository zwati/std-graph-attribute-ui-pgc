// src/pages/Teacher/StudentEvaluation.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/Rating/StarRating';
import GrowthBar from '../../components/ProgressBar/GrowthBar';
import TeacherClassSelector from '../../components/TeacherClassSelector';

const ATTRS = ['communication','participation','discipline','teamwork','responsibility','leadership'];
const ATTR_LABELS = {
  communication:'Communication',
  participation:'Class Participation',
  discipline:'Discipline',
  teamwork:'Teamwork',
  responsibility:'Responsibility',
  leadership:'Leadership',
};

export default function StudentEvaluation() {
  const { authAxios } = useAuth();
  const [params] = useSearchParams();
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(params.get('sid') ?? '');
  const [student, setStudent] = useState(null);
  const [ratings, setRatings] = useState({ communication:0, participation:0, discipline:0, teamwork:0, responsibility:0, leadership:0 });

  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

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

  const [prevEval, setPrevEval] = useState(null);

  useEffect(() => {
    if (selectedId) {
      authAxios.get(`/teacher/students/${selectedId}`)
        .then(r => setStudent(r.data.data)).catch(() => {});

      // Fetch latest evaluation history for previous scores
      authAxios.get(`/teacher/evaluations/${selectedId}`)
        .then(r => {
          const history = r.data.data;
          if (history && history.length > 0) {
            setPrevEval(history[0]);
          } else {
            setPrevEval(null);
          }
        })
        .catch(() => setPrevEval(null));
    }
  }, [selectedId]);

  function setRating(attr, val) { setRatings(r => ({ ...r, [attr]: val })); }

  const allRated = ATTRS.every(a => ratings[a] > 0);
  const preview  = allRated ? parseFloat((ATTRS.reduce((s, a) => s + ratings[a], 0) / ATTRS.length / 5 * 100).toFixed(1)) : 0;

  const [evalResult, setEvalResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allRated) return;
    setLoading(true); setEvalResult(null);
    try {
      const { data } = await authAxios.post('/teacher/evaluations', { studentId: selectedId, ...ratings, remarks });
      setEvalResult(data.data);
      setRatings({ communication:0, participation:0, discipline:0, teamwork:0, responsibility:0, leadership:0 });

      setRemarks('');
      setStudent(s => s ? { ...s, ...data.data.updatedGrowth } : s);
      // Refresh previous evaluation baseline
      setPrevEval(data.data.evaluation);
    } catch (err) { alert(err?.response?.data?.error ?? 'Submission failed.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="animate-fade" style={{ maxWidth: 720 }}>
      <TeacherClassSelector onClassSelect={setSelectedClass} />

      {/* Student selector */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <label className="label">Select Student from {selectedClass ? `${selectedClass.className} (${selectedClass.section})` : 'Class'}</label>
        <select className="input" value={selectedId} onChange={e => { setSelectedId(e.target.value); setEvalResult(null); }}>
          <option value="">— choose a student —</option>
          {students.map(s => (
            <option key={s._id} value={s._id}>
              {s.studentName} ({s.rollNumber}) {s.evaluationCount > 0 ? '🔄 (Has Previous Evaluations)' : ''}
            </option>
          ))}
        </select>
        {student && (
          <div style={{ marginTop: '1rem', padding: '.75rem 1rem', background: 'var(--gray-50)', borderRadius: 8,
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{student.studentName}</div>
              <div style={{ fontSize: '.83rem', color: 'var(--gray-500)' }}>Father: {student.fatherName} · {student.class} {student.section}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>Current Growth Index</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pgc-navy)' }}>{student.growthIndex?.toFixed(1) ?? '0.0'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Rating form */}
      {selectedId && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '.5rem' }}>
            <h3 style={{ margin: 0 }}>
              {prevEval ? '🔄 Re-Evaluate Student' : '⭐ Student Character Evaluation'}
            </h3>
            {prevEval && (
              <span className="badge badge-navy" style={{ fontSize: '.8rem' }}>
                Previous Eval Found — Lighter stars show earlier ratings
              </span>
            )}
          </div>

          {/* Star Rating Color Legend */}
          {prevEval ? (
            <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 8, padding: '.65rem 1rem', marginBottom: '1.25rem', fontSize: '.82rem', color: 'var(--gray-700)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span style={{ color: '#16a34a', fontSize: '1.2rem' }}>★</span>
                <span><strong style={{ color: 'var(--green-700)' }}>Green Stars</strong> = Improved (More stars)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span style={{ color: '#dc2626', fontSize: '1.2rem' }}>★</span>
                <span><strong style={{ color: 'var(--red-600)' }}>Red Stars</strong> = Loss / Decline (Fewer stars)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span style={{ color: '#eab308', fontSize: '1.2rem' }}>★</span>
                <span><strong>Yellow Stars</strong> = Same / Unchanged</span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '.82rem', color: 'var(--gray-500)', marginBottom: '1.25rem', background: 'var(--gray-50)', padding: '.5rem .85rem', borderRadius: 6 }}>
              ⭐ Initial Evaluation: Stars display in standard <strong>Yellow</strong>.
            </div>
          )}


          <form onSubmit={handleSubmit}>
            {ATTRS.map(attr => {
              const prevRating = prevEval ? prevEval[attr] || 0 : 0;
              const newRating = ratings[attr] || 0;
              const diff = newRating > 0 && prevRating > 0 ? newRating - prevRating : 0;

              return (
                <div key={attr} style={{ marginBottom: '1.35rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem', flexWrap: 'wrap', gap: '.5rem' }}>
                    <label className="label" style={{ margin: 0, fontWeight: 700 }}>{ATTR_LABELS[attr]}</label>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      {/* Real-time Attribute Progress vs Loss Badge */}
                      {prevRating > 0 && newRating > 0 && (
                        <span className={`badge ${diff > 0 ? 'badge-green' : diff < 0 ? 'badge-red' : 'badge-gray'}`} style={{ fontSize: '.75rem' }}>
                          {diff > 0 ? `📈 Improved (+${diff})` : diff < 0 ? `📉 Loss (${diff})` : '⚖ Unchanged'}
                        </span>
                      )}
                      
                      <span style={{ fontSize: '.83rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                        {newRating > 0 ? ['','Poor (1)','Fair (2)','Good (3)','Very Good (4)','Excellent (5)'][newRating] : prevRating > 0 ? `Prev: ${prevRating}★ (Tap to change)` : 'Not rated'}
                      </span>
                    </div>
                  </div>

                  <StarRating
                    value={ratings[attr]}
                    previousValue={prevRating}
                    onChange={v => setRating(attr, v)}
                    size="1.85rem"
                  />
                </div>
              );
            })}

            {/* Live preview */}
            {allRated && (
              <div style={{ background: 'var(--blue-50)', border: '1px solid #bfdbfe', borderRadius: 8,
                padding: '.75rem 1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--pgc-navy)', marginBottom: '.4rem' }}>
                  Preview Growth Score: <strong>{preview}</strong> / 100
                </div>
                <GrowthBar value={preview} max={100} showPercent />
              </div>
            )}

            <div className="form-group">
              <label className="label">Remarks (optional)</label>
              <textarea className="input" rows={3} value={remarks} onChange={e => setRemarks(e.target.value)}
                placeholder="Add teacher's remarks about this student's character progress/loss…" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              disabled={!allRated || loading}>
              {loading ? 'Submitting…' : prevEval ? '🔄 Save Re-Evaluation & Calculate Progress/Loss' : '✅ Submit Evaluation'}
            </button>
          </form>


          {/* Re-evaluation Result & Progress/Loss Badge */}
          {evalResult && (
            <div className="animate-fade" style={{
              marginTop: '1.25rem',
              padding: '1.25rem',
              background: evalResult.trend === 'progress' ? 'var(--green-50)' : evalResult.trend === 'loss' ? 'var(--red-50)' : 'var(--gray-50)',
              border: `1px solid ${evalResult.trend === 'progress' ? '#86efac' : evalResult.trend === 'loss' ? '#fca5a5' : 'var(--gray-300)'}`,
              borderRadius: 10
            }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: evalResult.trend === 'progress' ? 'var(--green-700)' : evalResult.trend === 'loss' ? 'var(--red-600)' : 'var(--gray-800)', marginBottom: '.4rem' }}>
                {evalResult.trend === 'progress' ? '📈 Progress Recorded!' : evalResult.trend === 'loss' ? '📉 Performance Loss Noted' : '✅ Evaluation Saved'}
              </div>

              <div style={{ fontSize: '.9rem', color: 'var(--gray-700)', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '.5rem', alignItems: 'center' }}>
                <div>Previous Index: <strong>{evalResult.previousGrowthIndex?.toFixed(1) || '0.0'}</strong></div>
                <div>New Growth Index: <strong>{evalResult.updatedGrowth?.growthIndex?.toFixed(1)}</strong></div>
                <div>
                  Net Change:
                  <span className={`badge ${evalResult.growthDiff > 0 ? 'badge-green' : evalResult.growthDiff < 0 ? 'badge-red' : 'badge-gray'}`} style={{ marginLeft: '.4rem', fontSize: '.85rem' }}>
                    {evalResult.growthDiff > 0 ? `+${evalResult.growthDiff} (Progress)` : evalResult.growthDiff < 0 ? `${evalResult.growthDiff} (Loss)` : '0.0 (Equal)'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


