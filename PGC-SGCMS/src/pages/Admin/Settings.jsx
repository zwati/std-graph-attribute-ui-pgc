// src/pages/Admin/Settings.jsx
export default function Settings() {
  return (
    <div className="card animate-fade" style={{ maxWidth: 560 }}>
      <h3 style={{ marginBottom: '1.25rem' }}>System Settings</h3>
      <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Configure system-wide options for SGCMS.</p>
      {[
        { label: 'Institution Name', val: 'Punjab Group of Colleges' },
        { label: 'Academic Year',    val: '2025–2026' },
        { label: 'Evaluation Scale', val: '1–5 Stars' },
        { label: 'Growth Index Formula', val: '(Avg of 5 attrs / 5) × 100' },
      ].map(s => (
        <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'.85rem 0', borderBottom:'1px solid var(--gray-100)' }}>
          <span style={{ fontWeight:600, color:'var(--gray-700)' }}>{s.label}</span>
          <span style={{ color:'var(--gray-500)', fontSize:'.9rem' }}>{s.val}</span>
        </div>
      ))}
    </div>
  );
}
