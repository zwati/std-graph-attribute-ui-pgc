// src/pages/Teacher/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';
import TeacherClassSelector from '../../components/TeacherClassSelector';

import { apiCache } from '../../utils/apiCache';

export default function TeacherDashboard() {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback((clsObj) => {
    if (!clsObj) {
      setStudents([]);
      return;
    }
    const cacheKey = `teacher_students_${clsObj.className}_${clsObj.section}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      setStudents(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    authAxios.get(`/teacher/students?class=${encodeURIComponent(clsObj.className)}&section=${encodeURIComponent(clsObj.section)}`)
      .then(r => {
        apiCache.set(cacheKey, r.data.data);
        setStudents(r.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass, fetchStudents]);

  const evaluated = students.filter(s => s.evaluationCount > 0).length;
  const improvedCount = students.filter(s => s.growthTrend === 'progress').length;
  const lossCount = students.filter(s => s.growthTrend === 'loss').length;
  const avgGrowth = students.length
    ? (students.reduce((a, s) => a + s.growthIndex, 0) / students.length).toFixed(1)
    : 0;

  return (
    <div className="animate-fade">
      {/* Step 1: Class Selection Header */}
      <TeacherClassSelector onClassSelect={setSelectedClass} />

      {/* Step 2: Class Stats & Progress/Loss Summary */}
      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: `Students in ${selectedClass?.className || 'Class'}`, val: students.length, icon: '👨‍🎓', color: 'navy' },
          { label: 'Students Improved', val: improvedCount, icon: '📈', color: 'green' },
          { label: 'Performance Loss', val: lossCount, icon: '📉', color: 'red' },
          { label: 'Class Avg Growth', val: `${avgGrowth}`, icon: '📊', color: 'amber' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}><span style={{ fontSize: '1.4rem' }}>{s.icon}</span></div>
            <div><div className="stat-val">{loading ? '…' : s.val}</div><div className="stat-lbl">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.75rem' }}>
          <h3 style={{ margin: 0, fontSize: 'clamp(1rem, 4vw, 1.15rem)' }}>
            Student Roster & Progress Status — {selectedClass ? `${selectedClass.className} (${selectedClass.section})` : 'Select Class'}
          </h3>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/teacher/evaluate')}>Evaluate a Student</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Growth Index</th>
                <th>Progress / Loss Status</th>
                <th>Last Eval</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading students…</td></tr>
                : students.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No students enrolled in this class section yet.</td></tr>
                  : students.slice(0, 15).map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                      <td><span className="badge badge-navy">{s.rollNumber}</span></td>
                      <td>{s.class} {s.section}</td>
                      <td style={{ fontWeight: 700, color: s.growthIndex >= 81 ? 'var(--pgc-navy)' : s.growthIndex >= 61 ? 'var(--green-600)' : s.growthIndex > 0 ? 'var(--amber-500)' : 'var(--gray-300)' }}>
                        {s.growthIndex > 0 ? s.growthIndex.toFixed(1) : 'Not rated'}
                      </td>
                      {/* Progress / Loss Status Badge */}
                      <td>
                        {s.growthTrend === 'progress' ? (
                          <span style={{ fontWeight: 700, color: 'var(--green-600)' }}>
                            +{s.growthDiff} (Improved)
                          </span>
                        ) : s.growthTrend === 'loss' ? (
                          <span style={{ fontWeight: 700, color: 'var(--pgc-red)' }}>
                            {s.growthDiff} (Loss)
                          </span>
                        ) : s.growthTrend === 'equal' ? (
                          <span style={{ color: 'var(--gray-500)', fontWeight: 600 }}>
                            0.0 (Unchanged)
                          </span>
                        ) : s.growthTrend === 'initial' ? (
                          <span style={{ color: 'var(--gray-500)', fontWeight: 600 }}>
                            Initial Rating
                          </span>
                        ) : (
                          <span style={{ fontSize: '.85rem', color: 'var(--gray-400)' }}>Not evaluated</span>
                        )}
                      </td>
                      <td style={{ fontSize: '.85rem', color: 'var(--gray-500)' }}>{formatDate(s.lastEvaluatedAt)}</td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/teacher/evaluate?sid=${s._id}`)}>
                          {s.evaluationCount > 0 ? '🔄 Re-Evaluate' : '⭐ Evaluate'}
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

