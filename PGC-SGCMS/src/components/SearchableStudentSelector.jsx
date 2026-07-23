// src/components/SearchableStudentSelector.jsx
import { useState, useEffect, useRef, useMemo } from 'react';

export default function SearchableStudentSelector({ students = [], selectedId = '', onSelect, label = 'Select Student' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter students based on search input (name or roll number)
  const filtered = useMemo(() => {
    return students.filter(s =>
      s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  const selectedStudent = useMemo(() => {
    return students.find(s => s._id === selectedId);
  }, [students, selectedId]);

  // Clean search query when opening/closing
  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 480, marginBottom: '1.25rem' }}>
      <label className="label" style={{ fontWeight: 600, display: 'block', marginBottom: '.4rem' }}>{label}</label>

      {/* Selector Trigger Input */}
      <div
        onClick={() => setIsOpen(v => !v)}
        className="input"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: '#fff',
          paddingRight: '1rem',
          userSelect: 'none',
        }}
      >
        <span style={{ color: selectedStudent ? 'var(--gray-900)' : 'var(--gray-400)', fontWeight: selectedStudent ? 600 : 400 }}>
          {selectedStudent
            ? `${selectedStudent.studentName} (${selectedStudent.rollNumber})`
            : '🔍 Click to search and select student…'}
        </span>
        <span style={{ fontSize: '.75rem', color: 'var(--gray-400)', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          ▼
        </span>
      </div>

      {/* Floating Dropdown List */}
      {isOpen && (
        <div
          className="animate-fade"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 10px 25px rgba(13,27,75,0.15), 0 2px 6px rgba(0,0,0,0.06)',
            border: '1px solid var(--gray-300)',
            zIndex: 999,
            overflow: 'hidden',
          }}
        >
          {/* Inner Search Field */}
          <div style={{ padding: '.5rem', borderBottom: '1px solid var(--gray-200)' }}>
            <input
              type="text"
              className="input"
              placeholder="Type name or roll number to filter..."
              style={{
                width: '100%',
                padding: '.4rem .75rem',
                fontSize: '.85rem',
                borderRadius: 6,
              }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              onClick={e => e.stopPropagation()} // Prevent closing dropdown on input click
            />
          </div>

          {/* List Options */}
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray-400)', fontSize: '.85rem' }}>
                No matching students found
              </div>
            ) : (
              filtered.map(s => {
                const isSelected = s._id === selectedId;
                return (
                  <div
                    key={s._id}
                    onClick={() => {
                      onSelect(s._id);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '.65rem 1rem',
                      cursor: 'pointer',
                      fontSize: '.9rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? 'var(--pgc-navy)' : 'var(--gray-700)',
                      background: isSelected ? 'rgba(13,27,75,0.06)' : 'transparent',
                      transition: 'background .15s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--gray-50)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{s.studentName} ({s.rollNumber})</span>
                    {s.evaluationCount > 0 && (
                      <span style={{ fontSize: '.72rem', color: 'var(--gray-400)', background: 'var(--gray-100)', padding: '2px 6px', borderRadius: 4 }}>
                        Re-Eval 🔄
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
