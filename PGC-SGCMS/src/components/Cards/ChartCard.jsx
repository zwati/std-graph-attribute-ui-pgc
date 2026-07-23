// components/Cards/ChartCard.jsx
// Shared white card wrapper used by every chart component
// Matches reference: white bg, 12px radius, subtle shadow, title left + subtitle right

export default function ChartCard({ title, subtitle, children, style = {} }) {
  return (
    <div
      style={{
        background:   '#ffffff',
        borderRadius: 12,
        boxShadow:    '0 1px 4px rgba(0,0,0,0.08)',
        padding:      '16px 18px',
        minWidth:     0,
        maxWidth:     '100%',
        overflow:     'hidden',
        ...style,
      }}
    >
      {/* Card header */}
      {(title || subtitle) && (
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            flexWrap:       'wrap',
            gap:            '0.25rem 0.5rem',
            marginBottom:   16,
            maxWidth:       '100%',
          }}
        >
          {title && (
            <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0, color: '#111827', minWidth: 0 }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <span style={{ color: '#6b7280', fontSize: 12 }}>{subtitle}</span>
          )}
        </div>
      )}

      <div style={{ width: '100%', minWidth: 0, overflowX: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
