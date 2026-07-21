// src/components/Charts/MonthlyProgressChart.jsx
// Monthly Progress / Loss Bar Chart displaying net improvement (+diff) in Green or loss (-diff) in Red
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

export default function MonthlyProgressChart({ data = [] }) {
  // [{ monthName: 'Jul 2026', diff: +5.2, score: 75.0, status: 'progress' }]
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip
          formatter={(val, name, props) => [
            `${val > 0 ? `+${val}` : val} Points (${props.payload?.status === 'progress' ? 'Progress' : props.payload?.status === 'loss' ? 'Loss' : 'Baseline'})`,
            'Net Change'
          ]}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
        <Bar dataKey="diff" radius={[4, 4, 0, 0]} barSize={32}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.diff > 0 ? '#16a34a' : entry.diff < 0 ? '#dc2626' : '#9ca3af'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
