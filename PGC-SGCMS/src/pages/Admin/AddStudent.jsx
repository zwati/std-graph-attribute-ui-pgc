// src/pages/Admin/AddStudent.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AddStudent() {
  const { authAxios } = useAuth();
  const [form, setForm] = useState({ customId:'', rollNumber:'', studentName:'', fatherName:'', class:'', section:'' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setResult(null); setLoading(true);
    try {
      const { data } = await authAxios.post('/admin/students', form);
      setResult(data.data);
      setForm({ customId:'', rollNumber:'', studentName:'', fatherName:'', class:'', section:'' });
    } catch (err) {
      setError(err?.response?.data?.error ?? 'Failed to add student.');
    } finally { setLoading(false); }
  }

  return (
    <div className="animate-fade" style={{ maxWidth: 640 }}>
      <div className="card">
        <h3 style={{ marginBottom: '1.25rem' }}>Enrol New Student</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { name: 'customId',    label: 'Custom ID',     placeholder: 'e.g. PGC-2026-001' },
              { name: 'rollNumber',  label: 'Roll Number',   placeholder: 'e.g. CS-2024-001' },
              { name: 'studentName', label: 'Student Name',  placeholder: 'Full name', col: 2 },
              { name: 'fatherName',  label: 'Father\'s Name', placeholder: 'Full name', col: 2 },
              { name: 'class',       label: 'Class',         placeholder: 'e.g. FA23' },
              { name: 'section',     label: 'Section',       placeholder: 'e.g. A' },
            ].map(f => (
              <div key={f.name} className="form-group" style={{ gridColumn: f.col ? `span ${f.col}` : undefined, margin: 0 }}>
                <label className="label">{f.label}</label>
                <input className="input" name={f.name} required value={form[f.name]}
                  onChange={handleChange} placeholder={f.placeholder} />
              </div>
            ))}
          </div>
          {error && <div className="error-msg" style={{ marginTop: '.75rem' }}>⚠ {error}</div>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
            disabled={loading}>
            {loading ? 'Adding…' : '➕ Add Student & Generate Credentials'}
          </button>
        </form>
      </div>

      {/* Success — show generated credentials */}
      {result && (
        <div className="card animate-fade" style={{ marginTop: '1.25rem', border: '2px solid var(--green-600)' }}>
          <h4 style={{ color: 'var(--green-600)', marginBottom: '.75rem' }}>✅ Student Added Successfully</h4>
          <p style={{ marginBottom: '.5rem' }}>Share these credentials with the parent:</p>
          <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '1rem', fontFamily: 'monospace', fontSize: '.95rem' }}>
            <div><strong>Username (Roll No.):</strong> {result.parentUsername}</div>
            <div style={{ marginTop: '.4rem' }}><strong>Password:</strong>
              <span style={{ background: 'var(--pgc-red)', color: '#fff', padding: '.15rem .6rem',
                borderRadius: 6, marginLeft: '.5rem', letterSpacing: '.05em' }}>{result.parentPassword}</span>
            </div>
          </div>
          <p style={{ fontSize: '.8rem', color: 'var(--gray-400)', marginTop: '.5rem' }}>
            ⚠ Note this password now — it cannot be retrieved later.
          </p>
        </div>
      )}
    </div>
  );
}
