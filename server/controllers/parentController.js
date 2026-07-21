// server/controllers/parentController.js
// Parents can ONLY read their own linked student — enforced via JWT linkedId

const Student    = require('../models/Student');
const Evaluation = require('../models/Evaluation');
const { ok, fail, serverError } = require('../utils/apiResponse');

// GET /api/parent/profile
async function getProfile(req, res) {
  try {
    const student = await Student.findById(req.user.linkedId)
      .select('-__v')
      .lean();
    if (!student) return fail(res, 'Student not found', 404);
    return ok(res, student);
  } catch (err) { return serverError(res, err); }
}

// GET /api/parent/evaluations
async function getEvaluations(req, res) {
  try {
    const evaluations = await Evaluation.find({ studentId: req.user.linkedId })
      .sort({ createdAt: -1 })
      .lean();
    return ok(res, evaluations);
  } catch (err) { return serverError(res, err); }
}

// GET /api/parent/growth
// Returns growth index, EMA trend, and monthly breakdown for charts
async function getGrowthData(req, res) {
  try {
    const student = await Student.findById(req.user.linkedId)
      .select('growthIndex growthTrendEMA evaluationCount lastEvaluatedAt')
      .lean();

    if (!student) return fail(res, 'Student not found', 404);

    // Monthly breakdown for bar/line charts
    const monthly = await Evaluation.aggregate([
      { $match: { studentId: student._id } },
      { $group: {
        _id:            '$month',
        score:          { $avg: '$growthIndexAtSubmit' },
        communication:  { $avg: '$communication' },
        participation:  { $avg: '$participation' },
        discipline:     { $avg: '$discipline' },
        teamwork:       { $avg: '$teamwork' },
        responsibility: { $avg: '$responsibility' },
        leadership:     { $avg: '$leadership' },
      }},
      { $sort: { _id: 1 } },
      { $project: {
        month:          '$_id',
        score:          { $round: ['$score', 1] },
        communication:  { $round: ['$communication', 1] },
        participation:  { $round: ['$participation', 1] },
        discipline:     { $round: ['$discipline', 1] },
        teamwork:       { $round: ['$teamwork', 1] },
        responsibility: { $round: ['$responsibility', 1] },
        leadership:     { $round: ['$leadership', 1] },
        _id:            0,
      }},
    ]);

    // Chronological evaluations for computing monthly progress vs loss diffs
    const allEvals = await Evaluation.find({ studentId: student._id })
      .sort({ createdAt: 1 })
      .select('month growthIndexAtSubmit communication participation discipline teamwork responsibility leadership createdAt')
      .lean();

    let prevScore = null;
    const progressHistory = allEvals.map((ev, index) => {
      const currentScore = ev.growthIndexAtSubmit || 0;
      let diff = 0;
      let status = 'initial';

      if (prevScore !== null) {
        diff = parseFloat((currentScore - prevScore).toFixed(1));
        status = diff > 0 ? 'progress' : diff < 0 ? 'loss' : 'equal';
      }

      prevScore = currentScore;
      const d = new Date(ev.createdAt || Date.now());
      const monthName = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      return {
        _id: ev._id,
        month: ev.month,
        monthName,
        score: currentScore,
        diff,
        status,
        date: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        communication: ev.communication || 0,
        participation: ev.participation || 0,
        discipline: ev.discipline || 0,
        teamwork: ev.teamwork || 0,
        responsibility: ev.responsibility || 0,
        leadership: ev.leadership || 0,
      };
    });

    return ok(res, {
      growthIndex:     student.growthIndex,
      growthTrendEMA:  student.growthTrendEMA,
      evaluationCount: student.evaluationCount,
      lastEvaluatedAt: student.lastEvaluatedAt,
      monthly,
      progressHistory,
    });
  } catch (err) { return serverError(res, err); }
}


module.exports = { getProfile, getEvaluations, getGrowthData };
