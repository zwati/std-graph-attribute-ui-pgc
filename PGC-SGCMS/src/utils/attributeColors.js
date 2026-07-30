// utils/attributeColors.js
// PGC brand + attribute-specific palette used across all chart types

export const ATTRIBUTE_COLORS = {
  leadership:     '#d4af37',   // Gold/Yellow
  discipline:     '#0284c7',   // Ocean Blue
  responsibility: '#7c3aed',   // Violet
  participation:  '#ea580c',   // Orange
  communication:  '#0D1B4B',   // PGC Navy
  teamwork:       '#db2777',   // Rose
};

export const ATTRIBUTE_LABELS = {
  leadership:     'Leadership',
  discipline:     'Discipline',
  responsibility: 'Responsibility',
  participation:  'Class Participation',
  communication:  'Communication',
  teamwork:       'Teamwork',
};


// Growth index colour — dynamically picked based on score
export function growthColor(score) {
  if (score >= 81) return '#0D1B4B';   // Excellent → PGC Navy
  if (score >= 61) return '#16a34a';   // Good → Green
  if (score >= 41) return '#d97706';   // Developing → Amber
  return '#C8102E';                    // Needs Improvement → Red
}
