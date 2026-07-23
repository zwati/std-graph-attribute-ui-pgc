// src/components/QRCodeModal.jsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import logoImg from '../assets/logo.png';

export default function QRCodeModal({ isOpen, onClose }) {
  const portalUrl = 'https://pgcswl-sgcms.vercel.app';
  const [copied, setCopied] = useState(false);

  // Lock background scroll when modal is open
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

  // Use QuickChart QR Code API for crisp vector QR rendering
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(portalUrl)}&color=0d1b4b&bgcolor=ffffff`;

  function handleCopyUrl() {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrintCard() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PGC Parent Portal QR Access Card</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; text-align: center; color: #0d1b4b; padding: 40px 20px; background: #f8fafc; }
          .card { max-width: 480px; margin: 0 auto; background: #ffffff; border: 3px solid #800000; border-radius: 16px; padding: 32px 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
          .logo { width: 64px; height: 64px; margin-bottom: 12px; }
          h1 { margin: 0; font-size: 24px; color: #800000; text-transform: uppercase; letter-spacing: 0.5px; }
          h2 { margin: 6px 0 18px; font-size: 14px; color: #64748b; font-weight: 600; }
          .qr-img { width: 220px; height: 220px; border: 4px solid #0d1b4b; border-radius: 12px; padding: 8px; background: #fff; margin: 16px 0; }
          .instructions { font-size: 13px; color: #334155; line-height: 1.6; margin-top: 16px; background: #f1f5f9; padding: 12px; border-radius: 8px; }
          .url-text { font-family: monospace; font-weight: bold; color: #800000; font-size: 14px; margin-top: 10px; word-break: break-all; }
          .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <img src="${logoImg}" class="logo" alt="PGC Logo" />
          <h1>PUNJAB GROUP OF COLLEGES</h1>
          <h2>Student Growth & Character Portal (SGCMS)</h2>

          <img src="${qrImageUrl}" class="qr-img" alt="Portal Access QR Code" />

          <div class="instructions">
            <strong>📲 How Parents Connect:</strong><br/>
            1. Open your smartphone camera.<br/>
            2. Point your camera at the QR code above.<br/>
            3. Tap the link to open the portal & log in with your <strong>Student ID</strong> and <strong>Password</strong>.
          </div>

          <div class="url-text">${portalUrl}</div>

          <div class="footer">
            Official Institution Portal Access Card · Punjab Group of Colleges
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 300);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

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
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card"
        style={{
          maxWidth: 420,
          width: 'min(420px, 92vw)',
          background: '#ffffff',
          borderRadius: 16,
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          textAlign: 'center',
          maxHeight: '90vh',
          maxHeight: '90dvh',
          overflowY: 'auto',
          margin: 'auto',
          position: 'relative',
          animation: 'modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Close Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <img src={logoImg} alt="PGC Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <h3 style={{ margin: 0, color: 'var(--pgc-navy)', fontSize: '1.05rem', fontWeight: 800 }}>Portal QR Access Card</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              width: 30,
              height: 30,
              borderRadius: '50%',
              fontSize: '1rem',
              cursor: 'pointer',
              color: 'var(--gray-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', margin: '0 0 .85rem', lineHeight: 1.5 }}>
          Parents can scan this QR code using any smartphone camera to access the portal directly.
        </p>

        {/* Clean Non-Technical Link */}
        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
          <label className="label" style={{ fontSize: '.75rem', color: 'var(--pgc-navy)', fontWeight: 700, marginBottom: '.25rem' }}>
            Official Portal Web Link
          </label>
          <input
            type="text"
            className="input"
            readOnly
            style={{ fontSize: '.82rem', padding: '.45rem .75rem', background: 'var(--gray-50)', color: 'var(--pgc-navy)', fontWeight: 600 }}
            value={portalUrl}
          />
        </div>

        {/* QR Code Container */}
        <div style={{
          background: '#f8fafc',
          border: '2px solid var(--pgc-navy)',
          borderRadius: 14,
          padding: '1rem',
          display: 'inline-block',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <img
            src={qrImageUrl}
            alt="Portal Access QR Code"
            style={{ width: 190, height: 190, borderRadius: 8, display: 'block', margin: '0 auto' }}
          />
          <div style={{ fontSize: '.75rem', fontFamily: 'monospace', color: 'var(--pgc-navy)', fontWeight: 700, marginTop: '.6rem', wordBreak: 'break-all' }}>
            {portalUrl}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          <button className="btn btn-primary" onClick={handlePrintCard} style={{ justifyContent: 'center', padding: '.65rem 1rem' }}>
            📄 Print Official QR Card for Parents
          </button>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button className="btn btn-outline" onClick={handleCopyUrl} style={{ flex: 1, justifyContent: 'center' }}>
              {copied ? '✅ Link Copied!' : '📋 Copy Link'}
            </button>
            <a
              href={qrImageUrl}
              download="PGC_Portal_QR_Code.png"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
            >
              🖼 Save Image
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
