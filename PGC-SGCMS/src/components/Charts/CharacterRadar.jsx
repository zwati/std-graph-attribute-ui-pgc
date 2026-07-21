// components/Charts/CharacterRadar.jsx
// Spider / radar chart — PGC red fill, white bg card
// Reference design: red stroke + red translucent fill, concentric polygon grid, 1–5 scale

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { ATTRIBUTE_LABELS } from '../../utils/attributeColors';

/**
 * @param {Object[]} data - array of { attribute: string, value: number (1–5) }
 *                          OR pass an evaluation object and we build data internally
 * @param {Object}  evaluation - { communication, participation, discipline, teamwork, responsibility }
 */
export default function CharacterRadar({ data, evaluation }) {
  const chartData = data || (evaluation ? [
    { attribute: ATTRIBUTE_LABELS.communication,  value: evaluation.communication  ?? 0 },
    { attribute: ATTRIBUTE_LABELS.participation,  value: evaluation.participation  ?? 0 },
    { attribute: ATTRIBUTE_LABELS.discipline,     value: evaluation.discipline     ?? 0 },
    { attribute: ATTRIBUTE_LABELS.teamwork,       value: evaluation.teamwork       ?? 0 },
    { attribute: ATTRIBUTE_LABELS.responsibility, value: evaluation.responsibility ?? 0 },
  ] : []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={chartData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
        {/* Concentric polygon grid lines — light grey */}
        <PolarGrid stroke="#e5e7eb" gridType="polygon" />

        {/* Axis labels — dark grey, 12px, outside each vertex */}
        <PolarAngleAxis
          dataKey="attribute"
          tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
        />

        {/* Radial tick numbers: 1 2 3 4 (domain 0–5, 5 ticks = 0,1,2,3,4 shown) */}
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tickCount={6}
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        {/* Red fill + red stroke — matches reference exactly */}
        <Radar
          dataKey="value"
          stroke="#C8102E"
          fill="#C8102E"
          fillOpacity={0.18}
          dot={{ r: 4, fill: '#C8102E', strokeWidth: 0 }}
          strokeWidth={2}
          activeDot={{ r: 6, fill: '#C8102E' }}
        />

        <Tooltip
          formatter={(val, name) => [`${val} / 5`, name]}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
