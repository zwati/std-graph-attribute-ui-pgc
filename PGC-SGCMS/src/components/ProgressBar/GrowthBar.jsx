// src/components/ProgressBar/GrowthBar.jsx
import { growthColor } from '../../utils/attributeColors';

export default function GrowthBar({ value = 0, max = 5, label, showPercent = false }) {
  const pct = Math.round((value / max) * 100);
  const color = max === 100 ? growthColor(value) : growthColor(pct);

  return (
    <div style={{ marginBottom: '.75rem' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem' }}>
          <span style={{ fontSize: '.85rem', fontWeight: 500, color: 'var(--gray-700)' }}>{label}</span>
          <span style={{ fontSize: '.85rem', fontWeight: 600, color }}>
            {showPercent ? `${pct}%` : `${value}/${max}`}
          </span>
        </div>
      )}
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
