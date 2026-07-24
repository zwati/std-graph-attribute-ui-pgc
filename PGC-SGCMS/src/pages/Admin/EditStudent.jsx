// src/pages/Admin/EditStudent.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditStudent() {
  const { authAxios } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ studentName:'', fatherName:'', class:'', section:'', rollNumber:'', customId:'', boardRollNumber:'', result9th:'', parentPassword:'', gender:'Male' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    // Load from student list — find by id
    authAxios.get(`/admin/students?limit=1000`)
      .then(r => {
        const s = r.data.data.students.find(x => x._id === id);
        if (s) setForm({ 
          studentName: s.studentName, 
          fatherName: s.fatherName,
          class: s.class ?? '', 
          section: s.section ?? '',
          rollNumber: s.rollNumber, 
          customId: s.customId,
          boardRollNumber: s.boardRollNumber ?? '',
          result9th: s.result9th ?? '',
          parentPassword: s.parentPassword ?? '',
          gender: s.gender ?? 'Male'
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      await authAxios.patch(`/admin/students/${id}`, form);
      navigate('/admin/students');
    } catch (err) {
      setError(err?.response?.data?.error ?? 'Update failed.');
    } finally { setSaving(false); }
  }

  if (loading) return <p style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>Loading…</p>;

  return (
    <div className="animate-fade" style={{ maxWidth: 580 }}>
      <div className="card">
        <h3 style={{ marginBottom: '1.25rem' }}>Edit Student</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[
              { name:'customId',    label:'Custom ID',      col:1 },
              { name:'rollNumber',  label:'Roll Number',    col:1 },
              { name:'boardRollNumber', label:'Board Roll Number', col:1 },
              { name:'result9th',   label:'9th Class Result (Marks)', col:1 },
              { name:'studentName', label:'Student Name',   col:2 },
              { name:'fatherName',  label:'Father\'s Name', col:2 },
              { name:'class',       label:'Class',          col:1 },
              { name:'section',     label:'Section',        col:1 },
              { name:'gender',      label:'Gender',         col:1, type: 'select', options: ['Male', 'Female'] },
              { name:'parentPassword', label:'Parent Password', col:1, placeholder: 'Optional (Plaintext parent password)' },
            ].map(f => (
              <div key={f.name} className="form-group"
                style={{ gridColumn: f.col === 2 ? 'span 2' : undefined, margin:0 }}>
                <label className="label">{f.label}</label>
                {f.type === 'select' ? (
                  <select className="input" name={f.name} value={form[f.name]}
                    onChange={e => setForm(v => ({ ...v, [e.target.name]: e.target.value }))}>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input className="input" name={f.name} required={f.name !== 'boardRollNumber' && f.name !== 'result9th' && f.name !== 'parentPassword'} 
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={e => setForm(v => ({ ...v, [e.target.name]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
          {error && <div className="error-msg" style={{ marginTop:'.75rem' }}>⚠ {error}</div>}
          <div style={{ display:'flex', gap:'.75rem', marginTop:'1.25rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}
              style={{ flex:1, justifyContent:'center' }}>
              {saving ? 'Saving…' : '💾 Save Changes'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/students')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
