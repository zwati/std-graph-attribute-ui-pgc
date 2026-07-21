// src/pages/Admin/Parents.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Parents() {
  const { authAxios } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    authAxios.get('/admin/students?limit=100').then(r => setStudents(r.data.data.students)).catch(() => {});
  }, []);

  return (
    <div className="animate-fade">
      <div className="card" style={{ padding: 0, overflow:'hidden' }}>
        <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid var(--gray-100)' }}>
          <h3 style={{ margin:0 }}>Parent Credentials</h3>
          <p style={{ margin:'.25rem 0 0', fontSize:'.85rem', color:'var(--gray-400)' }}>
            Each parent logs in using their child's roll number as username.
          </p>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Roll No. (Username)</th><th>Class</th><th>Status</th></tr></thead>
            <tbody>
              {students.length === 0
                ? <tr><td colSpan={4} style={{ textAlign:'center', padding:'2rem', color:'var(--gray-400)' }}>No students enrolled</td></tr>
                : students.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight:600 }}>{s.studentName}</td>
                    <td><span className="badge badge-navy">{s.rollNumber}</span></td>
                    <td>{s.class} {s.section}</td>
                    <td><span className="badge badge-green">Active</span></td>
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
