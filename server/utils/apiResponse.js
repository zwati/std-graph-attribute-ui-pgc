// server/utils/apiResponse.js
// Standardised response helpers — all API handlers use these to ensure consistent shape:
// Success: { success: true,  data: <payload> }
// Error:   { success: false, error: <message> }

function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function fail(res, message, status = 400) {
  return res.status(status).json({ success: false, error: message });
}

function serverError(res, err) {
  console.error('[Server Error]', err);
  return res.status(500).json({ success: false, error: 'Internal server error' });
}

module.exports = { ok, fail, serverError };
