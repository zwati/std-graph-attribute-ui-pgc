// server/controllers/adminController.js
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User    = require('../models/User');
const { ok, fail, serverError } = require('../utils/apiResponse');

const Class   = require('../models/Class');

// ── Classes & Categories ───────────────────────────────────────────────────

// GET /api/admin/classes
async function getClasses(req, res) {
  try {
    const classes = await Class.find().sort({ category: 1, className: 1, section: 1 }).lean();
    
    // Attach current student counts for each class
    const classesWithCounts = await Promise.all(classes.map(async (c) => {
      const studentCount = await Student.countDocuments({
        class: c.className,
        section: c.section,
        category: c.category,
      });
      return { ...c, studentCount };
    }));

    return ok(res, classesWithCounts);
  } catch (err) { return serverError(res, err); }
}

// POST /api/admin/classes — create a class section under a category
async function addClass(req, res) {
  try {
    const { className, category, section } = req.body;
    if (!className || !category || !section) {
      return fail(res, 'className, category, and section are required');
    }
    const newClass = await Class.create({ className, category, section });
    return ok(res, newClass, 201);
  } catch (err) {
    if (err.code === 11000) return fail(res, 'Class and section combination already exists in this category', 409);
    return serverError(res, err);
  }
}

// DELETE /api/admin/classes/:id
async function deleteClass(req, res) {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);
    if (!cls) return fail(res, 'Class not found', 404);
    return ok(res, { message: 'Class deleted' });
  } catch (err) { return serverError(res, err); }
}

// ── Students ───────────────────────────────────────────────────────────────

// GET /api/admin/students?page=1&limit=20&class=FA23&section=A&category=Medical&search=ali
async function getStudents(req, res) {
  try {
    const { page = 1, limit = 50, class: cls, section, category, search } = req.query;
    const filter = {};
    if (cls)      filter.class    = cls;
    if (section)  filter.section  = section;
    if (category) filter.category = category;
    if (search)   filter.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { rollNumber:  { $regex: search, $options: 'i' } },
    ];

    const [students, total] = await Promise.all([
      Student.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ studentName: 1 })
        .lean(),
      Student.countDocuments(filter),
    ]);

    return ok(res, { students, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { return serverError(res, err); }
}

// POST /api/admin/students — add student + auto-create parent User credentials
async function addStudent(req, res) {
  try {
    const { customId, rollNumber, studentName, fatherName, class: cls, section, category, teacherId } = req.body;

    if (!customId || !rollNumber || !studentName || !fatherName) {
      return fail(res, 'customId, rollNumber, studentName and fatherName are required');
    }

    // Auto-generate parent password
    const rawPassword  = crypto.randomBytes(4).toString('hex').toUpperCase();   // e.g. "A3F9B2C1"
    const passwordHash = await bcrypt.hash(rawPassword, 12);

    // Create student first
    const student = await Student.create({
      customId, rollNumber, studentName, fatherName,
      class: cls, section, category: category || 'Others', teacherId,
    });

    // Create parent User linked to this student
    await User.create({
      username:     rollNumber.toLowerCase(),
      passwordHash,
      role:         'parent',
      linkedId:     student._id,
    });

    return ok(res, { student, parentUsername: rollNumber.toLowerCase(), parentPassword: rawPassword }, 201);
  } catch (err) {
    if (err.code === 11000) return fail(res, 'Roll number or customId already exists', 409);
    return serverError(res, err);
  }
}


// PATCH /api/admin/students/:id
async function updateStudent(req, res) {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return fail(res, 'Student not found', 404);
    return ok(res, student);
  } catch (err) { return serverError(res, err); }
}

// DELETE /api/admin/students/:id
async function deleteStudent(req, res) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return fail(res, 'Student not found', 404);
    // Also remove linked parent User
    await User.deleteOne({ linkedId: student._id });
    return ok(res, { message: 'Student deleted' });
  } catch (err) { return serverError(res, err); }
}

// ── Teachers ───────────────────────────────────────────────────────────────

// GET /api/admin/teachers
async function getTeachers(req, res) {
  try {
    const teachers = await Teacher.find().populate('userId', 'username').lean();
    return ok(res, teachers);
  } catch (err) { return serverError(res, err); }
}

// POST /api/admin/teachers
async function addTeacher(req, res) {
  try {
    const { username, password, fullName, subject, classes } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const user    = await User.create({ username, passwordHash, role: 'teacher' });
    const teacher = await Teacher.create({ userId: user._id, fullName, subject, classes: classes ?? [] });
    return ok(res, teacher, 201);
  } catch (err) {
    if (err.code === 11000) return fail(res, 'Username already exists', 409);
    return serverError(res, err);
  }
}

// GET /api/admin/analytics  — school-wide growth summary
async function getAnalytics(req, res) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [overview, topStudents, weakestAttr, evaluationsToday, activeTeachers] = await Promise.all([
      Student.aggregate([
        { $group: { _id: null, avgGrowth: { $avg: '$growthIndex' }, total: { $sum: 1 } } },
      ]),
      Student.find().sort({ growthIndex: -1 }).limit(10).select('studentName rollNumber growthIndex class section').lean(),
      // Average per attribute across all evaluations
      require('../models/Evaluation').aggregate([
        { $group: {
          _id: null,
          communication:  { $avg: '$communication' },
          participation:  { $avg: '$participation' },
          discipline:     { $avg: '$discipline' },
          teamwork:       { $avg: '$teamwork' },
          responsibility: { $avg: '$responsibility' },
          leadership:     { $avg: '$leadership' },
        }},
      ]),
      require('../models/Evaluation').countDocuments({
        createdAt: { $gte: startOfToday, $lte: endOfToday }
      }),
      Teacher.countDocuments(),
    ]);

    return ok(res, {
      schoolAvgGrowth: overview[0]?.avgGrowth ?? 0,
      totalStudents:   overview[0]?.total ?? 0,
      evaluationsToday,
      activeTeachers,
      topStudents,
      attributeAverages: weakestAttr[0] ?? {},
    });
  } catch (err) { return serverError(res, err); }
}


module.exports = {
  getClasses, addClass, deleteClass,
  getStudents, addStudent, updateStudent, deleteStudent,
  getTeachers, addTeacher, getAnalytics,
};

