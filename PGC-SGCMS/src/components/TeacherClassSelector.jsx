// src/components/TeacherClassSelector.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiCache } from '../utils/apiCache';

export default function TeacherClassSelector({ onClassSelect }) {
  const { authAxios } = useAuth();
  const [classes, setClasses] = useState(() => apiCache.get('teacher_classes') || []);
  const [loading, setLoading] = useState(() => !apiCache.get('teacher_classes'));
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [selectedKey, setSelectedKey] = useState(() => {
    return localStorage.getItem('pgc_teacher_class_key') || '';
  });

  useEffect(() => {
    const cached = apiCache.get('teacher_classes');
    if (cached && cached.length > 0) {
      setClasses(cached);
      setLoading(false);
      const found = cached.find(c => `${c.className}-${c.section}` === selectedKey);
      if (found) {
        onClassSelect(found);
      } else {
        const first = cached[0];
        const key = `${first.className}-${first.section}`;
        setSelectedKey(key);
        localStorage.setItem('pgc_teacher_class_key', key);
        onClassSelect(first);
      }
    }

    // Silent background fetch / revalidation
    authAxios.get('/teacher/classes')
      .then(r => {
        const list = r.data.data;
        apiCache.set('teacher_classes', list);
        setClasses(list);

        if (list.length > 0) {
          const found = list.find(c => `${c.className}-${c.section}` === selectedKey);
          if (found) {
            onClassSelect(found);
          } else {
            const first = list[0];
            const key = `${first.className}-${first.section}`;
            setSelectedKey(key);
            localStorage.setItem('pgc_teacher_class_key', key);
            onClassSelect(first);
          }
        } else {
          onClassSelect(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Close context menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChooseClass(clsObj) {
    const key = `${clsObj.className}-${clsObj.section}`;
    setSelectedKey(key);
    localStorage.setItem('pgc_teacher_class_key', key);
    onClassSelect(clsObj);
    setMenuOpen(false);
  }

  if (loading && classes.length === 0) {
    return (
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem', color: 'var(--gray-500)' }}>
        ⚡ Loading assigned classes…
      </div>
    );
  }

  if (!loading && classes.length === 0) {
    return (
      <div className="card" style={{ marginBottom: '1.25rem', background: 'var(--amber-50)', border: '1px solid #fde68a' }}>
        <h4 style={{ color: 'var(--amber-600)', margin: 0 }}>⚠️ No Classes Available</h4>
        <p style={{ margin: '.4rem 0 0', fontSize: '.85rem', color: 'var(--gray-700)' }}>
          No class sections have been created yet. Ask the Administrator to add classes and assign students in Class Management.
        </p>
      </div>
    );
  }

  const selectedObj = classes.find(c => `${c.className}-${c.section}` === selectedKey) || classes[0];

  return (
    <div className="card" style={{
      marginBottom: '1.25rem',
      background: 'var(--gray-50)',
      borderLeft: '4px solid var(--pgc-navy)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Active Class Label */}
        <div>
          <div style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
            Active Teaching Class
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pgc-navy)', marginTop: '.15rem', display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
            <span>🏫 Class: {selectedObj?.className} ({selectedObj?.section})</span>
            {selectedObj?.category && <span className="badge badge-navy" style={{ fontSize: '.8rem' }}>{selectedObj.category}</span>}
            <span className="badge badge-gray" style={{ fontSize: '.75rem' }}>{selectedObj?.studentCount || 0} Students</span>
          </div>
        </div>

        {/* Switch Class Button with Floating Context-Menu Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setMenuOpen(v => !v)}
            style={{ padding: '.5rem 1rem', fontSize: '.88rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}
          >
            <span>🔄 Switch Class</span>
            <span style={{ fontSize: '.75rem' }}>{menuOpen ? '▲' : '▼'}</span>
          </button>

          {/* ── CONTEXT MENU DROPDOWN LIST ─────────────────────────────────────── */}
          {menuOpen && (
            <div className="animate-fade class-selector-dropdown" style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              width: 320,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 10px 25px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)',
              border: '1px solid var(--gray-300)',
              zIndex: 9999,
              overflow: 'hidden',
              padding: '.4rem 0',
            }}>
              <div style={{ padding: '.6rem 1rem .4rem', borderBottom: '1px solid var(--gray-200)', fontSize: '.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Select Class Section:
              </div>

              <div style={{ maxHeight: 260, overflowY: 'auto' }}>

                {classes.map(c => {
                  const key = `${c.className}-${c.section}`;
                  const isSelected = selectedKey === key;

                  return (
                    <div
                      key={c._id || key}
                      onClick={() => handleChooseClass(c)}
                      style={{
                        padding: '.75rem 1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isSelected ? 'rgba(13, 27, 75, 0.08)' : '#fff',
                        borderLeft: isSelected ? '4px solid var(--pgc-navy)' : '4px solid transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--gray-100)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#fff'; }}
                    >
                      <div>
                        <div style={{ fontWeight: isSelected ? 800 : 600, fontSize: '.92rem', color: 'var(--gray-900)' }}>
                          Class {c.className} ({c.section})
                        </div>
                        <div style={{ fontSize: '.78rem', color: 'var(--gray-500)', marginTop: '.1rem' }}>
                          Category: {c.category || 'General'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-gray" style={{ fontSize: '.72rem' }}>
                          {c.studentCount || 0} students
                        </span>
                        {isSelected && (
                          <div style={{ fontSize: '.72rem', color: 'var(--pgc-navy)', fontWeight: 700, marginTop: '.2rem' }}>
                            ✓ Active
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
