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
        padding:      '20px 24px',
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
            marginBottom:   16,
          }}
        >
          {title && (
            <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: '#111827' }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <span style={{ color: '#6b7280', fontSize: 13 }}>{subtitle}</span>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
