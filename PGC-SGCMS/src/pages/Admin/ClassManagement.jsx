// src/pages/Admin/ClassManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Medical', 'Pre-Eng', 'ICS', 'Others'];


export default function ClassManagement() {
  const { authAxios } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'addStudent' | 'manageRoster'

  // Class Creation Form State
  const [newClass, setNewClass] = useState({ className: '', category: 'Medical', section: 'A' });
  const [classLoading, setClassLoading] = useState(false);
  const [classError, setClassError] = useState('');

  // Selected Class State for adding & managing students
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedClassObj, setSelectedClassObj] = useState(null);

  // Student Form State (using same template as before)
  const [studentForm, setStudentForm] = useState({
    customId: '', rollNumber: '', boardRollNumber: '', studentName: '', fatherName: '', gender: 'Male', result9th: '', parentPassword: '',
  });

  const [studentLoading, setStudentLoading] = useState(false);
  const [studentResult, setStudentResult] = useState(null);
  const [studentError, setStudentError] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  function toggleShowPassword(id) {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  }


  // Class Roster State
  const [rosterStudents, setRosterStudents] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  // Fetch all classes
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authAxios.get('/admin/classes');
      setClasses(data.data);
      if (data.data.length > 0 && !selectedClassId) {
        setSelectedClassId(data.data[0]._id);
        setSelectedClassObj(data.data[0]);
      }
    } catch { } finally { setLoading(false); }
  }, [selectedClassId]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  // Update selected class object when selectedClassId changes
  useEffect(() => {
    if (selectedClassId) {
      const found = classes.find(c => c._id === selectedClassId);
      setSelectedClassObj(found || null);
    }
  }, [selectedClassId, classes]);

  // Fetch students for selected class roster
  const fetchRoster = useCallback(async () => {
    if (!selectedClassObj) return;
    setRosterLoading(true);
    try {
      const { data } = await authAxios.get(
        `/admin/students?class=${encodeURIComponent(selectedClassObj.className)}&section=${encodeURIComponent(selectedClassObj.section)}&category=${encodeURIComponent(selectedClassObj.category)}&limit=500`
      );
      setRosterStudents(data.data.students);
    } catch { } finally { setRosterLoading(false); }
  }, [selectedClassObj]);

  useEffect(() => {
    if (activeTab === 'manageRoster' && selectedClassObj) {
      fetchRoster();
    }
  }, [activeTab, selectedClassObj, fetchRoster]);

  // 1. Handle Class Creation
  async function handleCreateClass(e) {
    e.preventDefault();
    setClassError('');
    setClassLoading(true);
    try {
      const { data } = await authAxios.post('/admin/classes', newClass);
      setClasses(prev => [...prev, { ...data.data, studentCount: 0 }]);
      setSelectedClassId(data.data._id);
      setSelectedClassObj(data.data);
      setNewClass({ className: '', category: 'Medical', section: 'A' });
      setActiveTab('addStudent');
    } catch (err) {
      setClassError(err?.response?.data?.error ?? 'Failed to create class.');
    } finally { setClassLoading(false); }
  }

  // Delete a Class
  async function handleDeleteClass(classId) {
    if (!window.confirm('Are you sure you want to delete this class section?')) return;
    try {
      await authAxios.delete(`/admin/classes/${classId}`);
      setClasses(prev => prev.filter(c => c._id !== classId));
      if (selectedClassId === classId) {
        setSelectedClassId('');
        setSelectedClassObj(null);
      }
    } catch (err) {
      alert(err?.response?.data?.error ?? 'Failed to delete class.');
    }
  }

  // 2. Handle Adding Student to Selected Class
  async function handleAddStudent(e) {
    e.preventDefault();
    if (!selectedClassObj) {
      setStudentError('Please select a class first.');
      return;
    }
    setStudentError('');
    setStudentResult(null);
    setStudentLoading(true);

    try {
      const payload = {
        ...studentForm,
        customId: studentForm.rollNumber,
        class: selectedClassObj.className,
        section: selectedClassObj.section,
        category: selectedClassObj.category,
      };
      const { data } = await authAxios.post('/admin/students', payload);
      setStudentResult(data.data);
      setStudentForm({ rollNumber: '', boardRollNumber: '', studentName: '', fatherName: '', gender: 'Male', result9th: '', parentPassword: '' });

      fetchClasses();
      if (activeTab === 'manageRoster') fetchRoster();
    } catch (err) {
      setStudentError(err?.response?.data?.error ?? 'Failed to add student.');
    } finally { setStudentLoading(false); }
  }

  // 3. Handle Removing Student from Class Roster
  async function handleRemoveStudent(studentId) {
    if (!window.confirm('Are you sure you want to remove this student from the class?')) return;
    try {
      await authAxios.delete(`/admin/students/${studentId}`);
      setRosterStudents(prev => prev.filter(s => s._id !== studentId));
      fetchClasses();
    } catch (err) {
      alert(err?.response?.data?.error ?? 'Failed to remove student.');
    }
  }

  return (
    <div className="animate-fade">
      {/* Category & Class Navigation Header */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--gray-200)', paddingBottom: '.5rem' }}>
        <button
          className={`btn ${activeTab === 'classes' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('classes')}
        >
          ➕ 1. Create New Class
        </button>
        <button
          className={`btn ${activeTab === 'addStudent' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('addStudent')}
        >
          👨‍🎓 2. Add Students to Class
        </button>
        <button
          className={`btn ${activeTab === 'manageRoster' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setActiveTab('manageRoster'); fetchRoster(); }}
        >
          📋 3. Update & Manage Roster
        </button>
      </div>

      {/* ── TAB 1: CREATE CLASS UNDER CATEGORY ─────────────────────────────────── */}
      {activeTab === 'classes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Create Class Form */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Create New Class</h3>
            <p style={{ fontSize: '.85rem', color: 'var(--gray-500)', marginBottom: '1.25rem' }}>
              Select a category (Medical, Pre-Eng, ICS, Others) and define the class name & section.
            </p>

            <form onSubmit={handleCreateClass}>
              <div className="form-group">
                <label className="label">Category</label>
                <select
                  className="input"
                  value={newClass.category}
                  onChange={e => setNewClass(c => ({ ...c, category: e.target.value }))}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label">Class Name</label>
                  <input
                    className="input"
                    required
                    placeholder="e.g. 1st Year"
                    value={newClass.className}
                    onChange={e => setNewClass(c => ({ ...c, className: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="label">Section</label>
                  <input
                    className="input"
                    required
                    placeholder="e.g. A"
                    value={newClass.section}
                    onChange={e => setNewClass(c => ({ ...c, section: e.target.value }))}
                  />
                </div>
              </div>

              {classError && <div className="error-msg" style={{ marginBottom: '1rem' }}>⚠ {classError}</div>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={classLoading}>
                {classLoading ? 'Creating…' : '➕ Create Class Section'}
              </button>
            </form>
          </div>

          {/* Existing Classes List Grouped by Category */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Existing Class Sections</h3>
            {loading ? <p>Loading classes…</p> : classes.length === 0 ? (
              <p style={{ color: 'var(--gray-400)' }}>No class sections created yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {CATEGORIES.map(cat => {
                  const catClasses = classes.filter(c => c.category === cat);
                  if (catClasses.length === 0) return null;
                  return (
                    <div key={cat} style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 8 }}>
                      <div style={{ fontWeight: 700, color: 'var(--pgc-navy)', fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.5rem' }}>
                        {cat}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                        {catClasses.map(c => (
                          <div
                            key={c._id}
                            style={{
                              background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 6,
                              padding: '.4rem .75rem', display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.85rem'
                            }}
                          >
                            <span><strong>{c.className}</strong> — Sec {c.section} ({c.studentCount || 0})</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteClass(c._id)}
                              style={{ background: 'none', border: 'none', color: 'var(--red-600)', cursor: 'pointer', fontSize: '.8rem' }}
                              title="Delete class"
                            >
                              🗑
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: ADD STUDENTS TO CLASS ────────────────────────────────────────── */}
      {activeTab === 'addStudent' && (
        <div className="animate-fade" style={{ maxWidth: 640 }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Add Student to Class</h3>

            {/* Class Selector Dropdown */}
            <div className="form-group" style={{ marginBottom: '1.25rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: 8 }}>
              <label className="label" style={{ color: 'var(--pgc-navy)', fontWeight: 700 }}>Select Class & Category</label>
              {classes.length === 0 ? (
                <p style={{ color: 'var(--amber-600)', fontSize: '.85rem', margin: 0 }}>
                  ⚠️ No classes available. Please create a class first in Step 1.
                </p>
              ) : (
                <select
                  className="input"
                  value={selectedClassId}
                  onChange={e => { setSelectedClassId(e.target.value); setStudentResult(null); }}
                >
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>
                      [{c.category}] Class: {c.className} — Section: {c.section} ({c.studentCount || 0} students)
                    </option>
                  ))}
                </select>
              )}

              {selectedClassObj && (
                <div style={{ marginTop: '.6rem', fontSize: '.82rem', color: 'var(--gray-600)' }}>
                  Selected: Category <strong>{selectedClassObj.category}</strong> | Class <strong>{selectedClassObj.className}</strong> | Section <strong>{selectedClassObj.section}</strong>
                </div>
              )}
            </div>

            {/* Student Entry Form */}
            <form onSubmit={handleAddStudent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { name: 'rollNumber', label: 'ID', placeholder: 'e.g. 2302', required: true, col: 2 },

                  { name: 'boardRollNumber', label: 'Board Roll Number', placeholder: 'e.g. 300598', required: false, col: 2 },
                  { name: 'studentName', label: 'Student Name', placeholder: 'Full name', col: 2, required: true },
                  { name: 'fatherName', label: 'Father\'s Name', placeholder: 'Full name', col: 2, required: true },
                  { name: 'parentPassword', label: 'Parent Portal Password', placeholder: 'Optional (Leave blank to auto-generate)', col: 2, required: false },
                ].map(f => (
                  <div key={f.name} className="form-group" style={{ gridColumn: f.col ? `span ${f.col}` : undefined, margin: 0 }}>
                    <label className="label">{f.label}</label>
                    <input
                      className="input"
                      name={f.name}
                      required={f.required}
                      value={studentForm[f.name]}
                      onChange={e => setStudentForm(sf => ({ ...sf, [e.target.name]: e.target.value }))}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
              </div>

              {studentError && <div className="error-msg" style={{ marginTop: '.75rem' }}>⚠ {studentError}</div>}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                disabled={studentLoading || !selectedClassObj}
              >
                {studentLoading ? 'Saving Student…' : '➕ Save Student & Save Credentials to std-pgc-pswd.json'}
              </button>
            </form>
          </div>

          {/* Generated Credentials Result */}
          {studentResult && (
            <div className="card animate-fade" style={{ marginTop: '1.25rem', border: '2px solid var(--green-600)' }}>
              <h4 style={{ color: 'var(--green-600)', marginBottom: '.5rem' }}>✅ Student Added & Saved to std-pgc-pswd.json</h4>
              <p style={{ marginBottom: '.75rem', fontSize: '.85rem', color: 'var(--gray-600)' }}>
                Parent Login Credentials for <strong>{studentResult.student.studentName}</strong> have been created and saved to <code>std-pgc-pswd.json</code>:
              </p>
              <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '1rem', fontFamily: 'monospace', fontSize: '.95rem' }}>
                <div><strong>Username (Roll No.):</strong> {studentResult.parentUsername}</div>
                <div style={{ marginTop: '.4rem' }}>
                  <strong>Password:</strong>
                  <span style={{ background: 'var(--pgc-navy)', color: '#fff', padding: '.15rem .6rem', borderRadius: 6, marginLeft: '.5rem', letterSpacing: '.05em', fontWeight: 700 }}>
                    {studentResult.parentPassword}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => { setActiveTab('manageRoster'); fetchRoster(); }}>
                  View Class Roster →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: UPDATE & MANAGE CLASS ROSTER ─────────────────────────────────── */}
      {activeTab === 'manageRoster' && (
        <div className="animate-fade">
          {/* Class Filter Selector */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <label className="label" style={{ color: 'var(--pgc-navy)', fontWeight: 700 }}>Select Class Roster to Manage</label>
                <select
                  className="input"
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                >
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>
                      [{c.category}] Class: {c.className} — Section: {c.section} ({c.studentCount || 0} students)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('addStudent')}>
                  ➕ Add More Students to this Class
                </button>
              </div>
            </div>
          </div>

          {/* Roster Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>
                Students Roster {selectedClassObj ? `(${selectedClassObj.category} - ${selectedClassObj.className} ${selectedClassObj.section})` : ''}
              </h3>
              <span className="badge badge-navy">{rosterStudents.length} Students</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Roll No.</th>
                    <th>Student Name</th>
                    <th>Father's Name</th>
                    <th>Parent Password</th>
                    <th>Growth Index</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterLoading ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Loading roster…</td></tr>
                  ) : rosterStudents.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No students enrolled in this class yet. Click "Add More Students" to enroll.</td></tr>
                  ) : rosterStudents.map(s => {
                    const isVisible = visiblePasswords[s._id];
                    return (
                      <tr key={s._id}>
                        <td><span className="badge badge-navy">{s.rollNumber}</span></td>
                        <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                        <td>{s.fatherName}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                            <code style={{ background: 'var(--gray-100)', padding: '.15rem .5rem', borderRadius: 4, fontWeight: 700 }}>
                              {isVisible ? (s.parentPassword || 'N/A') : '••••••••'}
                            </code>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ padding: '.15rem .4rem', fontSize: '.72rem' }}
                              onClick={() => toggleShowPassword(s._id)}
                            >
                              {isVisible ? '🙈' : '👁️'}
                            </button>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: s.growthIndex >= 81 ? 'var(--pgc-navy)' : s.growthIndex >= 61 ? 'var(--green-600)' : s.growthIndex > 0 ? 'var(--amber-500)' : 'var(--gray-400)' }}>
                            {s.growthIndex > 0 ? s.growthIndex.toFixed(1) : 'Not rated'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleRemoveStudent(s._id)}>
                            🗑 Remove Student
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
