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
  const discipline = attrs.discipline ?? 0;
  const leadership = attrs.leadership ?? 0;
  const responsibility = attrs.responsibility ?? 0;
  const participation = attrs.participation ?? 0;
  const communication = attrs.communication ?? 0;
  const teamwork = attrs.teamwork ?? 0;

  const weightedScore = (0.20 * discipline) +
                        (0.20 * leadership) +
                        (0.17 * responsibility) +
                        (0.17 * participation) +
                        (0.13 * communication) +
                        (0.13 * teamwork);

  return parseFloat((weightedScore * 20).toFixed(2));
}


module.exports = { updateGrowth, computeScore };
