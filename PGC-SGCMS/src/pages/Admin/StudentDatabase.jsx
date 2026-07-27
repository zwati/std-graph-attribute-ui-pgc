import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

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

  // Close radial menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

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

        <button className="btn btn-primary btn-sm" onClick={() => setShowQR(true)} title="Generate portal access QR code for parents"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          Share Portal QR Code
        </button>
        <button className="btn btn-outline btn-sm" onClick={handleExportPDF} title="Download complete PDF report with parent usernames & passwords"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Parent Credentials (PDF)
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/classes')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Manage Classes &amp; Add Students
        </button>
      </div>

      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />


      <div className="card" style={{ padding: 0, overflow: 'visible' }}>
        <div style={{
          padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>All Enrolled Students</h3>

          <span className="badge badge-navy">{total} total</span>
        </div>
        <div className="table-wrap" style={{ overflow: 'visible' }}>
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
                <th style={{ width: 80, textAlign: 'center' }}>Actions</th>
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
                  <td style={{ verticalAlign: 'middle' }} ref={openMenuId === s._id ? menuRef : null}>
                    <div style={{ position: 'relative', width: 36, height: 36, margin: '0 auto' }}>
                      {/* Radial action buttons */}
                      {[
                        {
                          label: 'View Profile',
                          angle: 270, // top
                          color: '#0D1B4B',
                          bg: 'rgba(13,27,75,0.1)',
                          hoverBg: 'rgba(13,27,75,0.18)',
                          action: () => { setOpenMenuId(null); navigate(`/admin/student/${s._id}/profile`); },
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          ),
                        },
                        {
                          label: 'Edit',
                          angle: 30, // bottom-right
                          color: '#1d4ed8',
                          bg: 'rgba(29,78,216,0.1)',
                          hoverBg: 'rgba(29,78,216,0.18)',
                          action: () => { setOpenMenuId(null); navigate(`/admin/edit/${s._id}`); },
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          ),
                        },
                        {
                          label: 'Delete',
                          angle: 150, // bottom-left
                          color: '#C8102E',
                          bg: 'rgba(200,16,46,0.1)',
                          hoverBg: 'rgba(200,16,46,0.18)',
                          action: () => { setOpenMenuId(null); requestDeleteStudent(s); },
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          ),
                        },
                      ].map(({ label, angle, color, bg, hoverBg, action, icon }) => {
                        const rad = (angle * Math.PI) / 180;
                        const r = 30; // radius in px
                        const x = Math.round(r * Math.cos(rad));
                        const y = Math.round(r * Math.sin(rad));
                        const isOpen = openMenuId === s._id;
                        return (
                          <button
                            key={label}
                            title={label}
                            onClick={action}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              border: 'none',
                              background: bg,
                              color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease, background 0.15s',
                              transform: isOpen
                                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                                : 'translate(-50%, -50%) scale(0)',
                              opacity: isOpen ? 1 : 0,
                              pointerEvents: isOpen ? 'auto' : 'none',
                              zIndex: 10,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = hoverBg}
                            onMouseOut={e => e.currentTarget.style.background = bg}
                          >
                            {icon}
                          </button>
                        );
                      })}

                      {/* Gear toggle button */}
                      <button
                        title="Actions"
                        onClick={() => setOpenMenuId(openMenuId === s._id ? null : s._id)}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          border: '1.5px solid var(--gray-200)',
                          background: openMenuId === s._id ? 'var(--pgc-navy)' : '#fff',
                          color: openMenuId === s._id ? '#fff' : 'var(--gray-600)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: openMenuId === s._id ? '0 2px 8px rgba(13,27,75,0.3)' : 'var(--shadow-sm)',
                          zIndex: 11,
                        }}
                        onMouseOver={e => { if (openMenuId !== s._id) { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--pgc-navy)'; } }}
                        onMouseOut={e => { if (openMenuId !== s._id) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--gray-200)'; } }}
                      >
                        <svg
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          width="15" height="15"
                          style={{ transition: 'transform 0.3s ease', transform: openMenuId === s._id ? 'rotate(60deg)' : 'rotate(0deg)' }}
                        >
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                      </button>
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
