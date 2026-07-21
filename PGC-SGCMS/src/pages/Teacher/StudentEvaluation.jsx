// src/pages/Teacher/StudentEvaluation.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/Rating/StarRating';
import GrowthBar from '../../components/ProgressBar/GrowthBar';

const ATTRS = ['communication','participation','discipline','teamwork','responsibility'];
const ATTR_LABELS = { communication:'Communication', participation:'Class Participation', discipline:'Discipline', teamwork:'Teamwork', responsibility:'Responsibility' };

export default function StudentEvaluation() {
  const { authAxios } = useAuth();
  const [params] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(params.get('sid') ?? '');
  const [student, setStudent] = useState(null);
  const [ratings, setRatings] = useState({ communication:0, participation:0, discipline:0, teamwork:0, responsibility:0 });
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    authAxios.get('/teacher/students').then(r => setStudents(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedId) {
      authAxios.get(`/teacher/students/${selectedId}`)
        .then(r => setStudent(r.data.data)).catch(() => {});
    }
  }, [selectedId]);

  function setRating(attr, val) { setRatings(r => ({ ...r, [attr]: val })); }

  const allRated = ATTRS.every(a => ratings[a] > 0);
  const preview  = allRated ? parseFloat((ATTRS.reduce((s, a) => s + ratings[a], 0) / ATTRS.length / 5 * 100).toFixed(1)) : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allRated) return;
    setLoading(true); setSuccess(null);
    try {
      const { data } = await authAxios.post('/teacher/evaluations', { studentId: selectedId, ...ratings, remarks });
      setSuccess(data.data.updatedGrowth);
      setRatings({ communication:0, participation:0, discipline:0, teamwork:0, responsibility:0 });
      setRemarks('');
      setStudent(s => s ? { ...s, ...data.data.updatedGrowth } : s);
    } catch (err) { alert(err?.response?.data?.error ?? 'Submission failed.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="animate-fade" style={{ maxWidth: 720 }}>
      {/* Student selector */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <label className="label">Select Student</label>
        <select className="input" value={selectedId} onChange={e => { setSelectedId(e.target.value); setSuccess(null); }}>
          <option value="">— choose a student —</option>
          {students.map(s => <option key={s._id} value={s._id}>{s.studentName} ({s.rollNumber})</option>)}
        </select>
        {student && (
          <div style={{ marginTop: '1rem', padding: '.75rem 1rem', background: 'var(--gray-50)', borderRadius: 8,
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{student.studentName}</div>
              <div style={{ fontSize: '.83rem', color: 'var(--gray-500)' }}>Father: {student.fatherName} · {student.class} {student.section}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>Current Growth Index</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pgc-navy)' }}>{student.growthIndex?.toFixed(1) ?? '—'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Rating form */}
      {selectedId && (
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Character Evaluation</h3>
          <form onSubmit={handleSubmit}>
            {ATTRS.map(attr => (
              <div key={attr} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                  <label className="label" style={{ margin: 0 }}>{ATTR_LABELS[attr]}</label>
                  <span style={{ fontSize: '.83rem', color: 'var(--gray-400)' }}>
                    {ratings[attr] > 0 ? ['','Poor','Fair','Good','Very Good','Excellent'][ratings[attr]] : 'Not rated'}
                  </span>
                </div>
                <StarRating value={ratings[attr]} onChange={v => setRating(attr, v)} size="1.8rem" />
              </div>
            ))}

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
                placeholder="Add teacher's remarks about this student's character development…" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              disabled={!allRated || loading}>
              {loading ? 'Submitting…' : '✅ Submit Evaluation'}
            </button>
          </form>

          {success && (
            <div className="animate-fade" style={{ marginTop: '1.25rem', padding: '1rem',
              background: 'var(--green-50)', border: '1px solid #86efac', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: 'var(--green-600)', marginBottom: '.5rem' }}>✅ Evaluation submitted!</div>
              <div style={{ fontSize: '.875rem', color: 'var(--gray-700)' }}>
                New Growth Index: <strong>{success.growthIndex}</strong> · EMA Trend: <strong>{success.growthTrendEMA}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
