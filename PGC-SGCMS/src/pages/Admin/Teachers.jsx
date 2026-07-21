// src/pages/Admin/Teachers.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Teachers() {
  const { authAxios } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username:'', password:'', fullName:'', subject:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    authAxios.get('/admin/teachers').then(r => setTeachers(r.data.data)).catch(() => {});
  }, []);

  async function handleAdd(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await authAxios.post('/admin/teachers', form);
      setTeachers(t => [...t, data.data]);
      setShowForm(false);
      setForm({ username:'', password:'', fullName:'', subject:'' });
    } catch (err) { setError(err?.response?.data?.error ?? 'Failed to add teacher.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '➕ Add Teacher'}
        </button>
      </div>

      {showForm && (
        <div className="card animate-fade" style={{ marginBottom: '1.25rem', maxWidth: 520 }}>
          <h4 style={{ marginBottom: '1rem' }}>New Teacher Account</h4>
          <form onSubmit={handleAdd}>
            {[
              { name: 'fullName', label: 'Full Name', placeholder: 'e.g. Mr. Ali Raza' },
              { name: 'subject',  label: 'Subject',   placeholder: 'e.g. Physics' },
              { name: 'username', label: 'Username',  placeholder: 'Login username' },
              { name: 'password', label: 'Password',  placeholder: 'Set password', type: 'password' },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label className="label">{f.label}</label>
                <input className="input" type={f.type ?? 'text'} name={f.name} required
                  value={form[f.name]} placeholder={f.placeholder}
                  onChange={e => setForm(v => ({ ...v, [e.target.name]: e.target.value }))} />
              </div>
            ))}
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Adding…' : 'Add Teacher'}
            </button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)' }}>
          <h3 style={{ margin: 0 }}>Teacher Accounts</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Subject</th><th>Username</th></tr></thead>
            <tbody>
              {teachers.length === 0
                ? <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No teachers yet</td></tr>
                : teachers.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 600 }}>{t.fullName}</td>
                    <td>{t.subject}</td>
                    <td><span className="badge badge-gray">{t.userId?.username ?? '—'}</span></td>
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
