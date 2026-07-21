// components/Charts/MonthlyBarChart.jsx
// Bar chart — PGC Navy (#0D1B4B) bars, 0–100 Y-axis, monthly X-axis
// Reference design: deep navy bars, white bg, horizontal gridlines only, no axis lines

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

/**
 * @param {Object[]} data  - [{ month: 'Feb', score: 84 }, ...]
 * @param {string}   color - override bar color (default PGC Navy)
 */
export default function MonthlyBarChart({ data = [], color = '#0D1B4B' }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barCategoryGap="30%"
      >
        {/* Horizontal gridlines only — matches reference */}
        <CartesianGrid
          strokeDasharray=""
          stroke="#f3f4f6"
          vertical={false}
        />

        {/* X-axis: month labels, no line, no tick marks */}
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 13 }}
        />

        {/* Y-axis: 0–100, no line */}
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 13 }}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />

        <Tooltip
          cursor={{ fill: '#f9fafb' }}
          formatter={(val) => [`${val}`, 'Growth Score']}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        />

        {/* Navy bars — flat top corners (radius [0,0,0,0]) matching reference */}
        <Bar dataKey="score" fill={color} radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
