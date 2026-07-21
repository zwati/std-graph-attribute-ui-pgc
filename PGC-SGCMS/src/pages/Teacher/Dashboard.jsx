// src/pages/Teacher/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';

export default function TeacherDashboard() {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAxios.get('/teacher/students')
      .then(r => setStudents(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const evaluated = students.filter(s => s.evaluationCount > 0).length;
  const avgGrowth = students.length
    ? (students.reduce((a, s) => a + s.growthIndex, 0) / students.length).toFixed(1)
    : 0;

  return (
    <div className="animate-fade">
      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'My Students', val: students.length, icon: '👨‍🎓', color: 'navy' },
          { label: 'Evaluated',   val: evaluated,        icon: '⭐',    color: 'green' },
          { label: 'Pending',     val: students.length - evaluated, icon: '⏳', color: 'amber' },
          { label: 'Class Avg Growth', val: `${avgGrowth}`, icon: '📈', color: 'red' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}><span style={{ fontSize: '1.4rem' }}>{s.icon}</span></div>
            <div><div className="stat-val">{loading ? '…' : s.val}</div><div className="stat-lbl">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>Quick Evaluate</h3>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/teacher/evaluate')}>Evaluate a Student</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Roll No.</th><th>Class</th><th>Growth Index</th><th>Last Eval</th><th></th></tr></thead>
            <tbody>
              {loading
                ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading…</td></tr>
                : students.slice(0, 8).map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                    <td><span className="badge badge-navy">{s.rollNumber}</span></td>
                    <td>{s.class} {s.section}</td>
                    <td style={{ fontWeight: 700, color: s.growthIndex >= 81 ? 'var(--pgc-navy)' : s.growthIndex >= 61 ? 'var(--green-600)' : s.growthIndex > 0 ? 'var(--amber-500)' : 'var(--gray-300)' }}>
                      {s.growthIndex > 0 ? s.growthIndex.toFixed(1) : 'Not rated'}
                    </td>
                    <td style={{ fontSize: '.85rem', color: 'var(--gray-500)' }}>{formatDate(s.lastEvaluatedAt)}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/teacher/evaluate?sid=${s._id}`)}>
                        ⭐ Evaluate
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
