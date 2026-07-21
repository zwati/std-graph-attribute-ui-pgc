// utils/growthLabel.js
// Maps a 0–100 growth index score to a display band label

export function growthLabel(score) {
  if (score >= 81) return 'Excellent';
  if (score >= 61) return 'Good';
  if (score >= 41) return 'Developing';
  return 'Needs Improvement';
}
