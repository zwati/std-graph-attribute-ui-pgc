// src/pages/Teacher/StudentList.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';
import TeacherClassSelector from '../../components/TeacherClassSelector';

export default function StudentList() {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback((clsObj) => {
    if (!clsObj) {
      setStudents([]);
      return;
    }
    setLoading(true);
    authAxios.get(`/teacher/students?class=${encodeURIComponent(clsObj.className)}&section=${encodeURIComponent(clsObj.section)}`)
      .then(r => setStudents(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass, fetchStudents]);

  const filtered = search
    ? students.filter(s =>
        s.studentName.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(search.toLowerCase()))
    : students;

  return (
    <div className="animate-fade">
      <TeacherClassSelector onClassSelect={setSelectedClass} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <input className="input" style={{ maxWidth: 320 }}
          placeholder="🔍 Search by name or roll number…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <span className="badge badge-navy">
          {filtered.length} Students in {selectedClass ? `${selectedClass.className} (${selectedClass.section})` : 'Class'}
        </span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Roll No.</th><th>Class</th><th>Growth Index</th><th>Last Evaluated</th><th></th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading class students…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No students enrolled in this class.</td></tr>
              ) : filtered.map(s => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                  <td><span className="badge badge-navy">{s.rollNumber}</span></td>
                  <td>{s.class} {s.section}</td>
                  <td style={{ fontWeight: 700, color: s.growthIndex >= 81 ? 'var(--pgc-navy)' : s.growthIndex >= 61 ? 'var(--green-600)' : s.growthIndex > 0 ? 'var(--amber-500)' : 'var(--gray-300)' }}>
                    {s.growthIndex > 0 ? s.growthIndex.toFixed(1) : '—'}
                  </td>
                  <td style={{ fontSize: '.85rem', color: 'var(--gray-500)' }}>{formatDate(s.lastEvaluatedAt)}</td>
                  <td style={{ display: 'flex', gap: '.4rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/teacher/evaluate?sid=${s._id}`)}>⭐ Evaluate</button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/teacher/history?sid=${s._id}`)}>📋 History</button>
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

