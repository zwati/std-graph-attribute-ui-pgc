// server/controllers/teacherController.js
const Student    = require('../models/Student');
const Evaluation = require('../models/Evaluation');
const { updateGrowth, computeScore } = require('../services/growthEngine');
const { ok, fail, serverError } = require('../utils/apiResponse');

const Class      = require('../models/Class');

// GET /api/teacher/classes — get available classes for teacher selection
async function getTeacherClasses(req, res) {
  try {
    const classes = await Class.find().sort({ className: 1, section: 1 }).lean();

    // Attach student count for each class section
    const withCounts = await Promise.all(classes.map(async (c) => {
      const studentCount = await Student.countDocuments({
        class: c.className,
        section: c.section,
      });
      return { ...c, studentCount };
    }));

    // If no Class documents exist, fallback to distinct class/sections from Student collection
    if (withCounts.length === 0) {
      const distinctClasses = await Student.aggregate([
        { $group: { _id: { class: '$class', section: '$section', category: '$category' }, studentCount: { $sum: 1 } } },
        { $sort: { '_id.class': 1, '_id.section': 1 } }
      ]);
      const fallbackList = distinctClasses.map(d => ({
        _id: `${d._id.class}-${d._id.section}`,
        className: d._id.class || 'Default Class',
        section: d._id.section || 'A',
        category: d._id.category || 'Others',
        studentCount: d.studentCount,
      }));
      return ok(res, fallbackList);
    }

    return ok(res, withCounts);
  } catch (err) { return serverError(res, err); }
}

// GET /api/teacher/students?class=1st Year&section=B2&search=ali
async function getMyStudents(req, res) {
  try {
    const { class: cls, section, search } = req.query;

    const filter = {};
    if (cls)     filter.class   = cls;
    if (section) filter.section = section;

    if (search) filter.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { rollNumber:  { $regex: search, $options: 'i' } },
    ];

    const students = await Student.find(filter).sort({ studentName: 1 }).lean();

    // Attach latest evaluation progress vs loss calculation for each student
    const withTrends = await Promise.all(students.map(async (s) => {
      const evals = await Evaluation.find({ studentId: s._id })
        .sort({ createdAt: -1 })
        .limit(2)
        .select('growthIndexAtSubmit')
        .lean();

      if (evals.length >= 2) {
        const latest = evals[0].growthIndexAtSubmit || 0;
        const prev   = evals[1].growthIndexAtSubmit || 0;
        const diff   = parseFloat((latest - prev).toFixed(1));
        const trend  = diff > 0 ? 'progress' : diff < 0 ? 'loss' : 'equal';
        return { ...s, growthDiff: diff, growthTrend: trend, previousScore: prev, latestScore: latest };
      } else if (evals.length === 1) {
        return { ...s, growthDiff: 0, growthTrend: 'initial', latestScore: evals[0].growthIndexAtSubmit };
      }

      return { ...s, growthDiff: 0, growthTrend: 'none' };
    }));

    return ok(res, withTrends);
  } catch (err) { return serverError(res, err); }
}



// GET /api/teacher/students/:id
async function getStudent(req, res) {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) return fail(res, 'Student not found', 404);
    return ok(res, student);
  } catch (err) { return serverError(res, err); }
}

// POST /api/teacher/evaluations
async function submitEvaluation(req, res) {
  try {
    const { studentId, communication, participation, discipline, teamwork, responsibility, leadership, remarks } = req.body;

    if (!studentId) return fail(res, 'studentId required');

    const student = await Student.findById(studentId);
    if (!student) return fail(res, 'Student not found', 404);

    const previousGrowthIndex = student.growthIndex || 0;

    // Compute this evaluation's 0–100 score
    const attrs = { communication, participation, discipline, teamwork, responsibility, leadership };
    const score = computeScore(attrs);

    // Incrementally update growth fields on the student document
    const growthUpdate = updateGrowth(student, score);
    await Student.updateOne({ _id: student._id }, { $set: growthUpdate });

    // Persist the evaluation with a month snapshot
    const month = new Date().toISOString().slice(0, 7);   // "YYYY-MM"
    const evaluation = await Evaluation.create({
      studentId,
      evaluatedBy:         req.user.userId,
      communication, participation, discipline, teamwork, responsibility, leadership,
      remarks:             remarks ?? '',
      growthIndexAtSubmit: growthUpdate.growthIndex,
      month,
    });


    const growthDiff = parseFloat((growthUpdate.growthIndex - previousGrowthIndex).toFixed(1));
    const trend = growthDiff > 0 ? 'progress' : growthDiff < 0 ? 'loss' : 'equal';

    return ok(res, {
      evaluation,
      updatedGrowth: growthUpdate,
      previousGrowthIndex,
      growthDiff,
      trend,
    }, 201);
  } catch (err) { return serverError(res, err); }
}


// GET /api/teacher/evaluations/:studentId
async function getEvaluationHistory(req, res) {
  try {
    const evaluations = await Evaluation.find({ studentId: req.params.studentId })
      .sort({ createdAt: -1 })
      .lean();
    return ok(res, evaluations);
  } catch (err) { return serverError(res, err); }
}

module.exports = { getTeacherClasses, getMyStudents, getStudent, submitEvaluation, getEvaluationHistory };

