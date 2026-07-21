// server/controllers/reportController.js
// Phase 5 placeholder — full PDFKit implementation comes in Phase 5
const { ok } = require('../utils/apiResponse');

async function generate(req, res) {
  return ok(res, { message: 'PDF generation will be implemented in Phase 5' });
}

async function download(req, res) {
  return ok(res, { message: 'Download will be implemented in Phase 5' });
}

module.exports = { generate, download };
