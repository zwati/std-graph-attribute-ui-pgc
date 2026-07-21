// server/services/growthEngine.js
// Incremental Growth Index update — O(1), no re-read of history needed.
// Called inside teacherController.submitEvaluation after each evaluation submit.

/**
 * Computes updated Growth Index and EMA given a new evaluation score.
 *
 * @param {Object} student     - Mongoose Student document (growthIndex, growthTrendEMA, evaluationCount)
 * @param {number} newScore    - This evaluation's average attribute score, scaled 0–100
 * @param {number} alpha       - EMA smoothing factor (0.25 ≈ 4-evaluation memory window)
 * @returns {Object}           - Fields to $set on the Student document
 */
function updateGrowth(student, newScore, alpha = 0.25) {
  const n = student.evaluationCount + 1;

  // Running lifetime average — mathematically identical to sum/n but requires no history re-read
  const newAvg = student.growthIndex + (newScore - student.growthIndex) / n;

  // Exponential Moving Average — weights recent evaluations more than old ones,
  // so the trend number captures recent improvement or decline
  const newEMA = n === 1
    ? newScore
    : alpha * newScore + (1 - alpha) * student.growthTrendEMA;

  return {
    growthIndex:     parseFloat(newAvg.toFixed(2)),
    growthTrendEMA:  parseFloat(newEMA.toFixed(2)),
    evaluationCount: n,
    lastEvaluatedAt: new Date(),
  };
}

/**
 * Converts 5 raw attribute scores (1–5 each) into a single 0–100 Growth Index score.
 *
 * @param {Object} attrs - { communication, participation, discipline, teamwork, responsibility }
 * @returns {number}     - 0–100
 */
function computeScore(attrs) {
  const keys  = ['communication', 'participation', 'discipline', 'teamwork', 'responsibility', 'leadership'];
  const total = keys.reduce((sum, k) => sum + (attrs[k] ?? 0), 0);
  const avg   = total / keys.length;      // avg on 1–5 scale
  return parseFloat(((avg / 5) * 100).toFixed(2));  // scale to 0–100
}


module.exports = { updateGrowth, computeScore };
