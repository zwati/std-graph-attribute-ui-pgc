import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import { apiCache } from '../../utils/apiCache';

export default function Teachers() {
  const { authAxios } = useAuth();
  const [teachers, setTeachers] = useState(() => apiCache.get('admin_teachers') || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username:'', password:'', fullName:'', subject:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: null,
    loading: false,
  });

  const fetchTeachers = () => {
    const cached = apiCache.get('admin_teachers');
    if (cached) {
      setTeachers(cached);
    }
    authAxios.get('/admin/teachers').then(r => {
      apiCache.set('admin_teachers', r.data.data);
      setTeachers(r.data.data);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function handleAdd(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await authAxios.post('/admin/teachers', form);
      apiCache.invalidate('admin_teachers');
      setTeachers(t => [...t, data.data]);
      setShowForm(false);
      setForm({ username:'', password:'', fullName:'', subject:'' });
      fetchTeachers();
    } catch (err) { setError(err?.response?.data?.error ?? 'Failed to add teacher.'); }
    finally { setLoading(false); }
  }

  function requestDeleteTeacher(teacher) {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Teacher Account',
      message: `Are you sure you want to delete ${teacher.fullName} (${teacher.userId?.username || 'Teacher'})? They will lose login access to the portal.`,
      confirmText: 'Yes, Delete Teacher',
      onConfirm: () => performDeleteTeacher(teacher._id),
      loading: false,
    });
  }

  async function performDeleteTeacher(teacherId) {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await authAxios.delete(`/admin/teachers/${teacherId}`);
      apiCache.invalidate('admin_teachers');
      setTeachers(prev => prev.filter(t => t._id !== teacherId));
    } catch {
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false, loading: false }));
    }
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
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Teacher Accounts</h3>
          <span style={{ fontSize: '.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>{teachers.length} Active Faculty</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Username</th>
                <th style={{ textStyle: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0
                ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No teachers created yet. Click "Add Teacher" above to create an account.</td></tr>
                : teachers.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 600 }}>{t.fullName}</td>
                    <td>{t.subject}</td>
                    <td><span className="badge badge-gray">{t.userId?.username ?? '—'}</span></td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <button className="btn btn-danger btn-sm" onClick={() => requestDeleteTeacher(t)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern In-App Confirmation Modal */}
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
