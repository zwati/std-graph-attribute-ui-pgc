import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';
import QRCodeModal from '../../components/QRCodeModal';
import ConfirmModal from '../../components/ConfirmModal';

import { apiCache } from '../../utils/apiCache';
import CustomSelect from '../../components/CustomSelect';

export default function StudentDatabase() {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState(() => apiCache.get('admin_students_default')?.students || []);
  const [total, setTotal] = useState(() => apiCache.get('admin_students_default')?.total || 0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [loading, setLoading] = useState(() => !apiCache.get('admin_students_default'));
  const [filterGender, setFilterGender] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: null,
    loading: false,
  });


  const fetchStudents = useCallback(async () => {
    const key = `admin_students_${page}_${search}_${filterClass}_${filterGender}`;
    const cached = apiCache.get(key);
    if (cached) {
      setStudents(cached.students);
      setTotal(cached.total);
      setLoading(false);
    }

    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      if (filterClass) params.set('class', filterClass);
      if (filterGender) params.set('gender', filterGender);
      const { data } = await authAxios.get(`/admin/students?${params}`);
      apiCache.set(key, data.data);
      if (page === 1 && !search && !filterClass && !filterGender) {
        apiCache.set('admin_students_default', data.data);
      }
      setStudents(data.data.students);
      setTotal(data.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, search, filterClass, filterGender]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  function requestDeleteStudent(student) {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Student Record',
      message: `Are you sure you want to delete ${student.studentName} (${student.rollNumber})? This will also remove associated parent login credentials.`,
      confirmText: 'Yes, Delete Student',
      onConfirm: () => performDeleteStudent(student._id),
      loading: false,
    });
  }

  async function performDeleteStudent(id) {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await authAxios.delete(`/admin/students/${id}`);
      apiCache.invalidate('admin_students');
      fetchStudents();
    } catch {
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false, loading: false }));
    }
  }

  const pages = Math.ceil(total / 15);

  function handleExportPDF() {
    try {
      const printWindow = window.open('', '_blank');
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      const rowsHtml = students.map((s, idx) => `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td style="font-weight:bold; color:#0d1b4b;">${s.rollNumber || '—'}</td>
          <td>${s.boardRollNumber || '—'}</td>
          <td style="font-weight:600;">${s.studentName || '—'}</td>
          <td>${s.fatherName || '—'}</td>
          <td>${s.class || ''} (${s.section || s.category || ''})</td>
          <td><span style="background:#fef3c7; border:1px solid #f59e0b; padding:2px 8px; border-radius:4px; font-family:monospace; font-weight:bold; color:#92400e;">${s.parentPassword || '—'}</span></td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Parent Credentials List — PGC SGCMS</title>
          <style>
            @page { size: A4 landscape; margin: 12mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 20px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #800000; padding-bottom: 12px; margin-bottom: 16px; }
            h1 { margin: 0; font-size: 22px; color: #800000; text-transform: uppercase; }
            .sub { font-size: 13px; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th { background: #0d1b4b; color: #ffffff; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
            td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
            .footer { margin-top: 20px; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>PUNJAB GROUP OF COLLEGES</h1>
              <div class="sub">Student Growth System · Parent Credentials Directory</div>
            </div>
            <div style="text-align:right; font-size:12px; color:#64748b;">
              Date: <strong>${dateStr}</strong><br/>
              Total Accounts: <strong>${students.length}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:40px; text-align:center;">#</th>
                <th>ID (Roll No.)</th>
                <th>Board Roll No.</th>
                <th>Student Name</th>
                <th>Father's Name</th>
                <th>Class & Section</th>
                <th>Parent Password</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="footer">Confidential Document · Generated by PGC SGCMS Admin Portal</div>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch {
      alert('Failed to load parent credentials for PDF export.');
    }
  }

  return (
    <div className="animate-fade">
      {/* Search/filter bar */}
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" style={{ width: '100%', maxWidth: 240 }} placeholder="🔍 Search name or roll number…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        
        <CustomSelect
          style={{ maxWidth: 140 }}
          value={filterClass}
          onChange={val => { setFilterClass(val); setPage(1); }}
          options={[
            { value: '', label: 'All Classes' },
            { value: '1st Year', label: '1st Year' },
            { value: '2nd Year', label: '2nd Year' }
          ]}
        />

        <CustomSelect
          style={{ maxWidth: 140 }}
          value={filterGender}
          onChange={val => { setFilterGender(val); setPage(1); }}
          options={[
            { value: '', label: 'All Genders' },
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' }
          ]}
        />

        <button className="btn btn-primary btn-sm" onClick={() => setShowQR(true)} title="Generate portal access QR code for parents">
          📱 Share Portal QR Code
        </button>
        <button className="btn btn-outline btn-sm" onClick={handleExportPDF} title="Download complete PDF report with parent usernames & passwords">
          📥 Download Parent Credentials (PDF)
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/classes')}>➕ Manage Classes & Add Students</button>
      </div>

      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />


      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>All Enrolled Students</h3>

          <span className="badge badge-navy">{total} total</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Board Roll No.</th>

                <th>Name</th>
                <th>Father's Name</th>
                <th>Gender</th>
                <th>Class</th>
                <th>9th Class Result</th>
                <th>Growth Index</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading…</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No students found</td></tr>
              ) : students.map(s => (
                <tr key={s._id}>
                  <td><span className="badge badge-navy">{s.rollNumber}</span></td>
                  <td><span className="badge badge-gray">{s.boardRollNumber || '—'}</span></td>
                  <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                  <td>{s.fatherName}</td>
                  <td>
                    <span className={`badge ${s.gender === 'Female' ? 'badge-red' : 'badge-green'}`}>
                      {s.gender === 'Female' ? 'Female' : 'Male'}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{s.class}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--gray-500)', marginTop: '.1rem' }}>
                      {s.section || s.category}
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-amber" style={{ fontWeight: 700 }}>
                      {s.result9th || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: s.growthIndex >= 81 ? 'var(--pgc-navy)' : s.growthIndex >= 61 ? 'var(--green-600)' : s.growthIndex > 0 ? 'var(--amber-500)' : 'var(--gray-400)' }}>
                      {s.growthIndex > 0 ? s.growthIndex.toFixed(1) : 'Not rated'}
                    </span>
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/admin/edit/${s._id}`)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => requestDeleteStudent(s)}>Delete</button>
                    </div>
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

      {/* Modern In-App Confirmation Modal */}
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
