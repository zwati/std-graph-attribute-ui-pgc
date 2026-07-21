// server/middleware/rateLimiter.js
// Applied ONLY to the login route — brute-force protection

const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max:      10,               // 10 attempts per IP per window
  message:  { success: false, error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { loginLimiter };
