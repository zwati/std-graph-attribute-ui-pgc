// components/Charts/GrowthGauge.jsx
// Radial / gauge chart — shows the Student Growth Index (0–100)
// Colour-coded: Red (needs improvement) → Amber → Green → PGC Navy (excellent)

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { growthColor } from '../../utils/attributeColors';
import { growthLabel } from '../../utils/growthLabel';

/**
 * @param {number} score  - Growth Index 0–100
 * @param {number} size   - container height in px (default 220)
 */
export default function GrowthGauge({ score = 0, size = 220 }) {
  const color = growthColor(score);
  const label = growthLabel(score);

  // RadialBarChart needs a data array; max=100 sets the full-ring value
  const gaugeData = [{ value: score, fill: color }];

  return (
    <div style={{ position: 'relative', width: '100%', height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="68%"
          outerRadius="100%"
          data={gaugeData}
          startAngle={210}
          endAngle={-30}
          barSize={18}
        >
          {/* Background track — light grey ring */}
          <RadialBar
            background={{ fill: '#e5e7eb' }}
            dataKey="value"
            cornerRadius={10}
            max={100}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Center overlay: score number + band label */}
      <div
        style={{
          position:  'absolute',
          top:       '50%',
          left:      '50%',
          transform: 'translate(-50%, -42%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div>
          <span style={{ fontSize: 42, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
            {Math.round(score)}
          </span>
          <span style={{ fontSize: 18, color: '#9ca3af', fontWeight: 500 }}> /100</span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: 700,
            color,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
