// utils/attributeColors.js
// PGC brand + attribute-specific palette used across all chart types

export const ATTRIBUTE_COLORS = {
  communication:  '#0D1B4B',   // PGC Navy
  participation:  '#C8102E',   // PGC Red
  discipline:     '#16a34a',   // Green
  teamwork:       '#d97706',   // Amber
  responsibility: '#7c3aed',   // Violet
};

export const ATTRIBUTE_LABELS = {
  communication:  'Communication',
  participation:  'Class Participation',
  discipline:     'Discipline',
  teamwork:       'Teamwork',
  responsibility: 'Responsibility',
};

// Growth index colour — dynamically picked based on score
export function growthColor(score) {
  if (score >= 81) return '#0D1B4B';   // Excellent → PGC Navy
  if (score >= 61) return '#16a34a';   // Good → Green
  if (score >= 41) return '#d97706';   // Developing → Amber
  return '#C8102E';                    // Needs Improvement → Red
}
