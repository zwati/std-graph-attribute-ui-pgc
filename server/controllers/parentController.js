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
        _id:            0,
      }},
    ]);

    return ok(res, {
      growthIndex:    student.growthIndex,
      growthTrendEMA: student.growthTrendEMA,
      evaluationCount: student.evaluationCount,
      lastEvaluatedAt: student.lastEvaluatedAt,
      monthly,
    });
  } catch (err) { return serverError(res, err); }
}

module.exports = { getProfile, getEvaluations, getGrowthData };
