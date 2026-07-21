// server/routes/teacherRoutes.js
const express = require('express');
const router  = express.Router();
const auth     = require('../middleware/auth');
const { allow } = require('../middleware/roleAuth');
const {
  getMyStudents, getStudent, submitEvaluation, getEvaluationHistory,
} = require('../controllers/teacherController');

router.use(auth, allow('teacher', 'admin'));   // admin can also view

router.get('/students',                   getMyStudents);
router.get('/students/:id',               getStudent);
router.post('/evaluations',               submitEvaluation);
router.get('/evaluations/:studentId',     getEvaluationHistory);

module.exports = router;
