// src/components/CustomSelect.jsx
import { useState, useEffect, useRef } from 'react';

export default function CustomSelect({ options = [], value = '', onChange, style = {}, placeholder = 'Select option' }) {
  const [isOpen, setIsOpen] = useState(false);
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

  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOpt = normalizedOptions.find(opt => opt.value === value) || normalizedOptions[0];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        ...style
      }}
    >
      {/* Trigger Button */}
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
          height: '38px',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--gray-800)', fontSize: '.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <span style={{ fontSize: '.7rem', color: 'var(--gray-400)', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          ▼
        </span>
      </div>

      {/* Floating Options Menu */}
      {isOpen && (
        <div
          className="animate-fade"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 10px 25px rgba(13,27,75,0.15), 0 2px 6px rgba(0,0,0,0.06)',
            border: '1px solid var(--gray-300)',
            zIndex: 9999,
            overflowY: 'auto',
            maxHeight: 200,
            padding: '.25rem 0',
          }}
        >
          {normalizedOptions.map(opt => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '.55rem .85rem',
                  cursor: 'pointer',
                  fontSize: '.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'var(--pgc-navy)' : 'var(--gray-700)',
                  background: isSelected ? 'rgba(13,27,75,0.06)' : 'transparent',
                  transition: 'background .15s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--gray-50)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
