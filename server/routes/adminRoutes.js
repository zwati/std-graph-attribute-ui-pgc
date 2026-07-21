// server/routes/adminRoutes.js
const express = require('express');
const router  = express.Router();
const auth     = require('../middleware/auth');
const { allow } = require('../middleware/roleAuth');
const {
  getStudents, addStudent, updateStudent, deleteStudent,
  getTeachers, addTeacher, getAnalytics,
} = require('../controllers/adminController');

router.use(auth, allow('admin'));

router.get('/students',      getStudents);
router.post('/students',     addStudent);
router.patch('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

router.get('/teachers',  getTeachers);
router.post('/teachers', addTeacher);

router.get('/analytics', getAnalytics);

module.exports = router;
