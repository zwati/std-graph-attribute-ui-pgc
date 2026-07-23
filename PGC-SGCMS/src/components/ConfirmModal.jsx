// src/components/ConfirmModal.jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
  onConfirm,
  onClose,
  loading = false,
}) {
  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const icon = isDanger ? '🗑️' : type === 'warning' ? '⚠️' : 'ℹ️';
  const iconBg = isDanger ? 'rgba(200, 16, 46, 0.12)' : 'rgba(245, 158, 11, 0.12)';
  const iconColor = isDanger ? 'var(--pgc-red)' : '#d97706';

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(13, 27, 75, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '1rem',
      }}
      onClick={e => e.target === e.currentTarget && !loading && onClose()}
    >
      <div
        className="card"
        style={{
          maxWidth: 400,
          width: 'min(400px, 92vw)',
          background: '#ffffff',
          borderRadius: 16,
          padding: '1.75rem 1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          textAlign: 'center',
          maxHeight: '90vh',
          maxHeight: '90dvh',
          overflowY: 'auto',
          margin: 'auto',
          position: 'relative',
          animation: 'modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Warning Icon Badge */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.6rem',
            color: iconColor,
          }}
        >
          {icon}
        </div>

        <h3 style={{ margin: '0 0 .5rem', color: '#111827', fontSize: '1.15rem', fontWeight: 800 }}>
          {title}
        </h3>

        <p style={{ fontSize: '.88rem', color: 'var(--gray-600)', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1, justifyContent: 'center', padding: '.65rem' }}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: '.65rem',
              background: isDanger ? 'linear-gradient(135deg, var(--pgc-red) 0%, #a00d26 100%)' : undefined,
              boxShadow: isDanger ? '0 4px 14px rgba(200, 16, 46, 0.35)' : undefined,
            }}
          >
            {loading ? 'Processing…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
