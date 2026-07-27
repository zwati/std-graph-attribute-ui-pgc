// server/routes/adminRoutes.js
const express = require('express');
const router  = express.Router();
const auth     = require('../middleware/auth');
const { allow } = require('../middleware/roleAuth');
const {
  getClasses, addClass, deleteClass,
  getStudents, addStudent, updateStudent, deleteStudent, getParentPasswords,
  getStudentById, getStudentGrowth,
  getTeachers, addTeacher, updateTeacher, deleteTeacher, getAnalytics,
} = require('../controllers/adminController');

router.use(auth, allow('admin'));

router.get('/classes',       getClasses);
router.post('/classes',      addClass);
router.delete('/classes/:id', deleteClass);

router.get('/students',            getStudents);
router.post('/students',           addStudent);
router.get('/students/:id',        getStudentById);
router.get('/students/:id/growth', getStudentGrowth);
router.patch('/students/:id',      updateStudent);
router.delete('/students/:id',     deleteStudent);

router.get('/passwords',     getParentPasswords);


router.get('/teachers',       getTeachers);
router.post('/teachers',      addTeacher);
router.patch('/teachers/:id',  updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

router.get('/analytics', getAnalytics);

module.exports = router;

