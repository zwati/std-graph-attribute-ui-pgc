// src/pages/Admin/StudentDatabase.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';

export default function StudentDatabase() {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      if (filterClass) params.set('class', filterClass);
      const { data } = await authAxios.get(`/admin/students?${params}`);
      setStudents(data.data.students);
      setTotal(data.data.total);
    } catch {} finally { setLoading(false); }
  }, [page, search, filterClass]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this student and their parent credentials?')) return;
    await authAxios.delete(`/admin/students/${id}`);
    fetchStudents();
  }

  const pages = Math.ceil(total / 15);

  return (
    <div className="animate-fade">
      {/* Search/filter bar */}
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input className="input" style={{ maxWidth: 280 }} placeholder="🔍 Search name or roll number…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <input className="input" style={{ maxWidth: 160 }} placeholder="Class (e.g. FA23)"
          value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }} />
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/add-student')}>➕ Add Student</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>All Students</h3>
          <span className="badge badge-gray">{total} total</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Roll No.</th><th>Name</th><th>Father's Name</th>
                <th>Class</th><th>Growth Index</th><th>Last Evaluated</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading…</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No students found</td></tr>
              ) : students.map(s => (
                <tr key={s._id}>
                  <td><span className="badge badge-navy">{s.rollNumber}</span></td>
                  <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                  <td>{s.fatherName}</td>
                  <td>{s.class} {s.section}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: s.growthIndex >= 81 ? 'var(--pgc-navy)' : s.growthIndex >= 61 ? 'var(--green-600)' : s.growthIndex > 0 ? 'var(--amber-500)' : 'var(--gray-400)' }}>
                      {s.growthIndex > 0 ? s.growthIndex.toFixed(1) : 'Not rated'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--gray-500)', fontSize: '.85rem' }}>{formatDate(s.lastEvaluatedAt)}</td>
                  <td style={{ display: 'flex', gap: '.4rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/admin/edit/${s._id}`)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ fontSize: '.85rem', color: 'var(--gray-500)' }}>Page {page} of {pages}</span>
            <button className="btn btn-outline btn-sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
