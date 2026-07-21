// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../config/jwt');
const { ok, fail, serverError } = require('../utils/apiResponse');

// POST /api/auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return fail(res, 'Username and password required');

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) return fail(res, 'Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return fail(res, 'Invalid credentials', 401);

    const payload = { userId: user._id, role: user.role, linkedId: user.linkedId };
    const accessToken  = signAccess(payload);
    const refreshToken = signRefresh(payload);

    return ok(res, { accessToken, refreshToken, role: user.role, linkedId: user.linkedId });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/auth/refresh
async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return fail(res, 'Refresh token required');

    const payload      = verifyRefresh(refreshToken);
    const accessToken  = signAccess({ userId: payload.userId, role: payload.role, linkedId: payload.linkedId });
    const newRefresh   = signRefresh({ userId: payload.userId, role: payload.role, linkedId: payload.linkedId });

    return ok(res, { accessToken, refreshToken: newRefresh });
  } catch {
    return fail(res, 'Invalid or expired refresh token', 401);
  }
}

// POST /api/auth/logout  (stateless — client drops tokens; placeholder for future blocklist)
function logout(_req, res) {
  return ok(res, { message: 'Logged out' });
}

module.exports = { login, refresh, logout };
