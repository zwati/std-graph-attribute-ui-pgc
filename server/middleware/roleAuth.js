// server/middleware/roleAuth.js
// Role-based access control middleware factory.
// Usage: router.get('/route', auth, allow('admin'), handler)

const { fail } = require('../utils/apiResponse');

/**
 * @param {...string} roles - allowed roles e.g. allow('admin', 'teacher')
 */
function allow(...roles) {
  return (req, res, next) => {
    if (!req.user) return fail(res, 'Not authenticated', 401);
    if (!roles.includes(req.user.role)) {
      return fail(res, 'Access denied', 403);
    }
    next();
  };
}

module.exports = { allow };
