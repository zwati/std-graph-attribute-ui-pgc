// server/middleware/errorHandler.js
// Global Express error handler — catches anything passed to next(err)

module.exports = function errorHandler(err, req, res, _next) {
  console.error('[Unhandled Error]', err);
  res.status(err.status ?? 500).json({
    success: false,
    error:   err.message ?? 'Internal server error',
  });
};
