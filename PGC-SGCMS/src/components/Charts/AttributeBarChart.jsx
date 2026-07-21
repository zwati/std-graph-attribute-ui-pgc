// src/components/Charts/AttributeBarChart.jsx
// Horizontal Bar Chart displaying all 6 character attributes on the Y-Axis
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ATTRIBUTE_COLORS } from '../../utils/attributeColors';

export default function AttributeBarChart({ evaluation = {} }) {
  const data = [
    { attribute: 'Communication',       key: 'communication',  score: evaluation.communication || 0 },
    { attribute: 'Discipline',          key: 'discipline',     score: evaluation.discipline || 0 },
    { attribute: 'Leadership',          key: 'leadership',     score: evaluation.leadership || 0 },
    { attribute: 'Class Participation', key: 'participation',  score: evaluation.participation || 0 },
    { attribute: 'Responsibility',      key: 'responsibility', score: evaluation.responsibility || 0 },
    { attribute: 'Teamwork',            key: 'teamwork',       score: evaluation.teamwork || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
        <XAxis type="number" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="attribute"
          axisLine={false}
          tickLine={false}
          width={140}
          tick={{ fill: '#0d1b4b', fontSize: 12, fontWeight: 700 }}
        />
        <Tooltip
          formatter={(val) => [`${val} / 5 Stars`, 'Score']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={22}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={ATTRIBUTE_COLORS[entry.key] || '#0d1b4b'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
