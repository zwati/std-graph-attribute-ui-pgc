// server/routes/parentRoutes.js
const express = require('express');
const router  = express.Router();
const auth     = require('../middleware/auth');
const { allow } = require('../middleware/roleAuth');
const { getProfile, getEvaluations, getGrowthData } = require('../controllers/parentController');

router.use(auth, allow('parent'));

router.get('/profile',     getProfile);
router.get('/evaluations', getEvaluations);
router.get('/growth',      getGrowthData);

module.exports = router;
