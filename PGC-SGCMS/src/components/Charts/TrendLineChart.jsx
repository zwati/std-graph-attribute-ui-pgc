// components/Charts/TrendLineChart.jsx
// Multi-line chart — one coloured line per attribute, monthly trend
// Uses the attribute colour palette (navy, red, green, amber, violet)

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ATTRIBUTE_COLORS, ATTRIBUTE_LABELS } from '../../utils/attributeColors';

/**
 * @param {Object[]} data - [{ month: 'Feb', communication: 4, participation: 3, ... }]
 * @param {string[]} attributes - which attributes to render (default: all 5)
 * @param {'attribute'|'index'} yScale - 'attribute' = 1-5, 'index' = 0-100
 */
export default function TrendLineChart({
  data = [],
  attributes = Object.keys(ATTRIBUTE_COLORS),
  yScale = 'attribute',
}) {
  const yDomain = yScale === 'index' ? [0, 100] : [1, 5];
  const yTicks  = yScale === 'index'
    ? [0, 20, 40, 60, 80, 100]
    : [1, 2, 3, 4, 5];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray=""
          stroke="#f3f4f6"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 13 }}
        />

        <YAxis
          domain={yDomain}
          ticks={yTicks}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 13 }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          formatter={(val, key) => [
            `${val}${yScale === 'attribute' ? ' / 5' : ''}`,
            ATTRIBUTE_LABELS[key] ?? key,
          ]}
        />

        <Legend
          wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
          formatter={(key) => ATTRIBUTE_LABELS[key] ?? key}
        />

        {attributes.map((attr) => (
          <Line
            key={attr}
            type="monotone"
            dataKey={attr}
            stroke={ATTRIBUTE_COLORS[attr] ?? '#64748b'}
            strokeWidth={2}
            dot={{ r: 4, fill: ATTRIBUTE_COLORS[attr] ?? '#64748b', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
