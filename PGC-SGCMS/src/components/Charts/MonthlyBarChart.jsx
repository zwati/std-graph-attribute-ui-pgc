// components/Charts/MonthlyBarChart.jsx
// Bar chart — PGC Navy (#0D1B4B) bars, 1–5 Y-axis scale, monthly/attribute X-axis
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

/**
 * @param {Object[]} data  - [{ month: 'Comm', score: 4.2 }, ...]
 * @param {string}   color - override bar color (default PGC Navy)
 * @param {number[]} domain - [0, 5] rating scale
 */
export default function MonthlyBarChart({ data = [], color = '#0D1B4B', domain = [0, 5] }) {
  const ticks = domain[1] === 100 
    ? [0, 20, 40, 60, 80, 100] 
    : (domain[1] === 5 ? [0, 1, 2, 3, 4, 5] : undefined);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barCategoryGap="30%"
      >
        {/* Horizontal gridlines only */}
        <CartesianGrid
          strokeDasharray=""
          stroke="#f3f4f6"
          vertical={false}
        />

        {/* X-axis labels */}
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 13 }}
        />

        {/* Y-axis: dynamic scale */}
        <YAxis
          domain={domain}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 13 }}
          ticks={ticks}
        />

        <Tooltip
          cursor={{ fill: '#f9fafb' }}
          formatter={(val) => [`${val} / ${domain[1]}`, 'Rating Score']}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        />

        {/* Navy bars */}
        <Bar dataKey="score" fill={color} radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
