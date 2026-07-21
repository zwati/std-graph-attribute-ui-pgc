// server/routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const { login, refresh, logout } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

router.post('/login',   loginLimiter, login);
router.post('/refresh', refresh);
router.post('/logout',  auth, logout);

module.exports = router;
