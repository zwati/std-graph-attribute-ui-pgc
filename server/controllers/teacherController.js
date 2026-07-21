// server/controllers/teacherController.js
const Student    = require('../models/Student');
const Evaluation = require('../models/Evaluation');
const { updateGrowth, computeScore } = require('../services/growthEngine');
const { ok, fail, serverError } = require('../utils/apiResponse');

// GET /api/teacher/students
async function getMyStudents(req, res) {
  try {
    const { search } = req.query;

    // Find Teacher document by userId (JWT contains userId, not teacherId)
    const Teacher = require('../models/Teacher');
    const teacher = await Teacher.findOne({ userId: req.user.userId }).lean();

    // Admins calling this endpoint see all students
    const filter = {};
    if (teacher) filter.teacherId = teacher._id;
    if (search) filter.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { rollNumber:  { $regex: search, $options: 'i' } },
    ];

    const students = await Student.find(filter).sort({ studentName: 1 }).lean();
    return ok(res, students);
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
    const { studentId, communication, participation, discipline, teamwork, responsibility, remarks } = req.body;

    if (!studentId) return fail(res, 'studentId required');

    const student = await Student.findById(studentId);
    if (!student) return fail(res, 'Student not found', 404);

    // Compute this evaluation's 0–100 score
    const attrs = { communication, participation, discipline, teamwork, responsibility };
    const score = computeScore(attrs);

    // Incrementally update growth fields on the student document
    const growthUpdate = updateGrowth(student, score);
    await Student.updateOne({ _id: student._id }, { $set: growthUpdate });

    // Persist the evaluation with a month snapshot
    const month = new Date().toISOString().slice(0, 7);   // "YYYY-MM"
    const evaluation = await Evaluation.create({
      studentId,
      evaluatedBy:         req.user.userId,
      communication, participation, discipline, teamwork, responsibility,
      remarks:             remarks ?? '',
      growthIndexAtSubmit: growthUpdate.growthIndex,
      month,
    });

    return ok(res, { evaluation, updatedGrowth: growthUpdate }, 201);
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

module.exports = { getMyStudents, getStudent, submitEvaluation, getEvaluationHistory };
