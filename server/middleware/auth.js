// server/middleware/auth.js
// Verifies the JWT access token from the Authorization header.
// Attaches decoded payload (userId, role, linkedId) to req.user.

const { verifyAccess } = require('../config/jwt');
const { fail } = require('../utils/apiResponse');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 'No token provided', 401);
  }

  const token = header.split(' ')[1];
  try {
    req.user = verifyAccess(token);
    next();
  } catch {
    return fail(res, 'Token invalid or expired', 401);
  }
};
